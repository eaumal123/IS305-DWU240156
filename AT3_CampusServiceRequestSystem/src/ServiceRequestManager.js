/*
  Program: Distinction Component - ServiceRequestManager
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 20th October 2026
*/

const ServiceRequest = require('./ServiceRequest');
const { UserFactory, ServiceRequestFactory } = require('./Factories');

class ServiceRequestManager {
  #repos;

  // repositories = { users, requests, history, audit } from createRepositories().
  // Without them the manager works in memory only (useful for quick tests).
  constructor(repositories = null) {
    this.users = [];
    this.requests = [];
    this.loadWarnings = [];
    this.#repos = repositories;
  }

  // ---------- Distinction: load saved data when the program starts ----------
  // Saved records are rebuilt as objects. A bad record is skipped with a warning and left in the file.
  async init() {
    this.users = [];
    this.requests = [];
    this.loadWarnings = [];
    if (!this.#repos) return { users: 0, requests: 0, warnings: [] };

    const userRecords = await this.#repos.users.loadAll();
    const requestRecords = await this.#repos.requests.loadAll();
    const historyRecords = await this.#repos.history.loadAll();
    await this.#repos.audit.loadAll();   // creates the audit file when missing and checks it can be read

    for (const record of userRecords) {
      try {
        const user = UserFactory.createFromData(record);
        if (this.findUserById(user.getuserID())) throw new Error("Duplicate user ID.");
        this.users.push(user);
      } catch (error) {
        this.loadWarnings.push(`Skipped saved user '${record?.userId ?? 'unknown'}': ${error.message}`);
      }
    }

    for (const record of requestRecords) {
      try {
        const request = ServiceRequestFactory.createFromData(record, {
          findUser: (id) => this.findUserById(id),
          history: historyRecords.filter(h => h.requestId === record.requestId)
        });
        if (this.findRequestById(request.requestID)) throw new Error("Duplicate request ID.");
        this.requests.push(request);
      } catch (error) {
        this.loadWarnings.push(`Skipped saved request '${record?.requestId ?? 'unknown'}': ${error.message}`);
      }
    }
    return { users: this.users.length, requests: this.requests.length, warnings: [...this.loadWarnings] };
  }

  // ---------- Pass methods ----------
  async registerUser(user) {
    try {
      user.validate();
      const existing = this.findUserById(user.getuserID());
      if (existing) {
        throw new Error(`Duplicate user ID: User with ID '${user.getuserID()}' already exists.`);
      }
      if (this.#repos) await this.#repos.users.create(user.toData());   // only valid, new users are saved
    } catch (error) {
      await this.#auditQuietly(user?.getuserID?.() ?? 'Unknown', user?.getuserType?.() ?? 'Unknown',
        'User registration', null, 'Attempted user registration', `Rejected: ${error.message}`);
      throw error;
    }
    this.users.push(user);
    await this.#audit(user.getuserID(), user.getuserType(), 'User registration', null,
      `Registered ${user.getFullName()} as ${user.getuserType()}`, 'Success');
    return true;
  }

  findUserById(userId) {
    const id = String(userId).trim();
    return this.users.find(u => u.getuserID() === id) || null;
  }

  async submitRequest(request) {
    const requesterId = request?.requester?.getuserID?.() ?? 'Unknown';
    const requesterRole = request?.requester?.getuserType?.() ?? 'Unknown';
    try {
      request.validate();
      const existing = this.findRequestById(request.requestID);
      if (existing) {
        throw new Error(`Duplicate request ID: Request with ID '${request.requestID}' already exists.`);
      }
      if (!this.findUserById(requesterId)) {
        throw new Error(`The requester '${requesterId}' is not a registered user.`);
      }
      await this.#saveRequest(request);   // only valid, new requests are saved
    } catch (error) {
      await this.#auditQuietly(requesterId, requesterRole, 'Request created', request?.requestID ?? null,
        'Attempted request submission', `Rejected: ${error.message}`);
      throw error;
    }
    this.requests.push(request);
    await this.#audit(requesterId, requesterRole, 'Request created', request.requestID,
      `Submitted ${request.constructor.name}: ${request.title}`, 'Success');
    return true;
  }

  findRequestById(requestId) {
    const id = String(requestId).trim();
    return this.requests.find(r => r.requestID === id) || null;
  }

  getRequestsByUser(userId) {
    const id = String(userId).trim();
    return this.requests.filter(r => r.requester.getuserID() === id);
  }

  getAllRequests() {
    return [...this.requests];
  }

  async updateRequest(requestId, userId, changes) {
    const actorId = String(userId).trim();
    // Common fields first; anything else is a specialised field for the request subclass
    const { title, description, category, priority, ...specialised } = changes;
    return this.#perform({
      action: 'Request updated', actorId, requestId,
      work: (request) => request.updateDetails(actorId, title, description, category, priority, specialised),
      describe: () => `Updated request details (${Object.keys(changes).join(', ') || 'no fields'})`
    });
  }

  async cancelRequest(requestId, userId) {
    const actorId = String(userId).trim();
    return this.#perform({
      action: 'Request cancelled', actorId, requestId,
      work: (request) => request.cancelRequest(actorId),
      describe: () => 'Request cancelled by the requester'
    });
  }

  // Search by request ID or title
  searchRequests(searchText) {
    if (!searchText || searchText.trim() === '') return [];
    const term = searchText.trim().toLowerCase();
    return this.requests.filter(r =>
      r.requestID.toLowerCase().includes(term) ||
      r.title.toLowerCase().includes(term)
    );
  }

  getRequestSummaryByStatus() {
    const summary = {};
    ServiceRequest.STATUSES.forEach(s => { summary[s] = 0; });
    this.requests.forEach(r => { summary[r.status]++; });
    return summary;
  }

  // ---------- Credit: workflow (the request itself enforces roles and transitions) ----------
  #requireUser(userId) {
    const user = this.findUserById(userId);
    if (!user) throw new Error(`User not found: ${String(userId).trim()}`);
    return user;
  }

  #requireRequest(requestId) {
    const request = this.findRequestById(requestId);
    if (!request) throw new Error("Request not found.");
    return request;
  }

  async reviewRequest(requestId, officerId, comment) {
    return this.#perform({
      action: 'Status changed', actorId: officerId, requestId,
      work: (request) => request.review(this.#requireUser(officerId), comment || undefined),
      describe: (request, previous) => `Status changed from ${previous} to ${request.status}`
    });
  }

  async assignPriority(requestId, officerId, priority, comment) {
    return this.#perform({
      action: 'Priority changed', actorId: officerId, requestId,
      work: (request) => request.assignPriority(this.#requireUser(officerId), priority, comment || ''),
      describe: (request) => `Priority set to ${request.priority}`
    });
  }

  async assignTechnician(requestId, officerId, technicianId, comment) {
    return this.#perform({
      action: 'Technician assigned', actorId: officerId, requestId,
      work: (request) => request.assignTechnician(this.#requireUser(officerId), this.#requireUser(technicianId), comment || ''),
      describe: (request, previous) => `Assigned Technician ${String(technicianId).trim()} (status ${previous} to ${request.status})`
    });
  }

  async startWork(requestId, technicianId, comment) {
    return this.#perform({
      action: 'Status changed', actorId: technicianId, requestId,
      work: (request) => request.startWork(this.#requireUser(technicianId), comment || undefined),
      describe: (request, previous) => `Status changed from ${previous} to ${request.status}`
    });
  }

  async recordProgress(requestId, technicianId, note) {
    return this.#perform({
      action: 'Progress recorded', actorId: technicianId, requestId,
      work: (request) => request.recordProgress(this.#requireUser(technicianId), note),
      describe: () => 'Progress note recorded'
    });
  }

  async resolveRequest(requestId, technicianId, comment) {
    return this.#perform({
      action: 'Request resolved', actorId: technicianId, requestId,
      work: (request) => request.resolve(this.#requireUser(technicianId), comment || undefined),
      describe: (request, previous) => `Request resolved (status ${previous} to ${request.status})`
    });
  }

  async closeRequest(requestId, officerId, comment) {
    return this.#perform({
      action: 'Request closed', actorId: officerId, requestId,
      work: (request) => request.close(this.#requireUser(officerId), comment || undefined),
      describe: (request, previous) => `Request closed (status ${previous} to ${request.status})`
    });
  }

  // ---------- Credit: filter and sort ----------
  filterRequests({ category, status, priority, technicianID } = {}, list = this.requests) {
    return list.filter(r =>
      (!category || r.category === category) &&
      (!status || r.status === status) &&
      (!priority || r.priority === priority) &&
      (!technicianID || r.assignedTechnicianID === technicianID)
    );
  }

  sortByDate(list = this.requests, ascending = true) {
    return [...list].sort((a, b) => (ascending ? 1 : -1) * (a.dateSubmitted - b.dateSubmitted));
  }

  sortByPriority(list = this.requests, highestFirst = true) {
    const order = ServiceRequest.ALLOWED_PRIORITIES;
    return [...list].sort((a, b) =>
      (highestFirst ? -1 : 1) * (order.indexOf(a.priority) - order.indexOf(b.priority)));
  }

  // ---------- Distinction: audit trail ----------
  async getAuditEntries(requestId) {
    if (!this.#repos) return [];
    return requestId
      ? this.#repos.audit.findByRequest(String(requestId).trim())
      : this.#repos.audit.loadAll();
  }

  // ---------- Distinction: saving, rollback and auditing ----------
  // Runs one change on a request. The change is saved, and the audit entry written, only if the
  // domain rules allow it. If the save fails, the request goes back to how it was.
  async #perform({ action, actorId, requestId, work, describe }) {
    const actor = String(actorId ?? '').trim() || 'Unknown';
    const role = this.findUserById(actor)?.getuserType() ?? 'Unknown';
    let request;
    let before;
    try {
      request = this.#requireRequest(requestId);
      before = this.#snapshot(request);
      work(request);
    } catch (error) {
      await this.#auditQuietly(actor, role, action, String(requestId ?? '').trim() || null,
        `Attempted: ${action}`, `Rejected: ${error.message}`);
      throw error;
    }

    try {
      await this.#saveRequest(request, before);
    } catch (error) {
      this.#rollback(before);
      throw error;
    }
    await this.#audit(actor, role, action, request.requestID, describe(request, before.data.status), 'Success');
    return true;
  }

  #snapshot(request) {
    return { data: request.toData(), history: request.toHistoryData() };
  }

  #rollback(before) {
    const restored = ServiceRequestFactory.createFromData(before.data, {
      findUser: (id) => this.findUserById(id),
      history: before.history
    });
    const index = this.requests.findIndex(r => r.requestID === before.data.requestId);
    if (index !== -1) this.requests[index] = restored;
  }

  // Saves a request and its history. "before" is the earlier snapshot of an existing request.
  async #saveRequest(request, before = null) {
    if (!this.#repos) return;
    const data = request.toData();
    if (before) await this.#repos.requests.update(data.requestId, data);
    else await this.#repos.requests.create(data);

    try {
      await this.#repos.history.replaceForRequest(data.requestId, request.toHistoryData());
    } catch (error) {
      // keep the files consistent by undoing the request write
      try {
        if (before) await this.#repos.requests.update(data.requestId, before.data);
        else await this.#repos.requests.delete(data.requestId);
      } catch { /* the original error is the one to report */ }
      throw error;
    }
  }

  async #audit(actorId, actorRole, action, requestId, description, outcome) {
    if (!this.#repos) return;
    try {
      await this.#repos.audit.append({
        actorId, actorRole, action, requestId, description,
        dateTime: new Date().toISOString(), outcome
      });
    } catch (error) {
      throw new Error(`The change was saved, but the audit record could not be written. ${error.message}`);
    }
  }

  // Used for rejected attempts, so a logging problem never hides the real error
  async #auditQuietly(...args) {
    try { await this.#audit(...args); } catch { /* ignore */ }
  }
}

module.exports = ServiceRequestManager;
