/*
  Program: Credit Component - ServiceRequestManager
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 19th October 2026
*/

const ServiceRequest = require('./ServiceRequest');

class ServiceRequestManager {
  constructor() {
    this.users = [];
    this.requests = [];
  }

  // ---------- Pass methods ----------
  registerUser(user) {
    user.validate();
    const existing = this.findUserById(user.getuserID());
    if (existing) {
      throw new Error(`Duplicate user ID: User with ID '${user.getuserID()}' already exists.`);
    }
    this.users.push(user);
    return true;
  }

  findUserById(userId) {
    const id = String(userId).trim();
    return this.users.find(u => u.getuserID() === id) || null;
  }

  submitRequest(request) {
    request.validate();
    const existing = this.findRequestById(request.requestID);
    if (existing) {
      throw new Error(`Duplicate request ID: Request with ID '${request.requestID}' already exists.`);
    }
    this.requests.push(request);
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

  updateRequest(requestId, userId, changes) {
    const request = this.findRequestById(requestId);
    if (!request) throw new Error("Request not found.");

    // Common fields first; anything else is a specialised field for the request subclass
    const { title, description, category, priority, ...specialised } = changes;
    request.updateDetails(String(userId).trim(), title, description, category, priority, specialised);
    return true;
  }

  cancelRequest(requestId, userId) {
    const request = this.findRequestById(requestId);
    if (!request) throw new Error("Request not found.");

    request.cancelRequest(String(userId).trim());
    return true;
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

  reviewRequest(requestId, officerId, comment) {
    this.#requireRequest(requestId).review(this.#requireUser(officerId), comment || undefined);
    return true;
  }

  assignPriority(requestId, officerId, priority, comment) {
    this.#requireRequest(requestId).assignPriority(this.#requireUser(officerId), priority, comment || '');
    return true;
  }

  assignTechnician(requestId, officerId, technicianId, comment) {
    const request = this.#requireRequest(requestId);
    request.assignTechnician(this.#requireUser(officerId), this.#requireUser(technicianId), comment || '');
    return true;
  }

  startWork(requestId, technicianId, comment) {
    this.#requireRequest(requestId).startWork(this.#requireUser(technicianId), comment || undefined);
    return true;
  }

  recordProgress(requestId, technicianId, note) {
    this.#requireRequest(requestId).recordProgress(this.#requireUser(technicianId), note);
    return true;
  }

  resolveRequest(requestId, technicianId, comment) {
    this.#requireRequest(requestId).resolve(this.#requireUser(technicianId), comment || undefined);
    return true;
  }

  closeRequest(requestId, officerId, comment) {
    this.#requireRequest(requestId).close(this.#requireUser(officerId), comment || undefined);
    return true;
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
}

module.exports = ServiceRequestManager;
