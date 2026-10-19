/*
  Program: Pass Component - ServiceRequestManager
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 25th September 2026
*/

class ServiceRequestManager {
  constructor() {
    this.users = [];
    this.requests = [];
  }

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
    return this.users.find(u => u.getuserID() === userId) || null;
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
    return this.requests.find(r => r.requestID === requestId) || null;
  }

  getRequestsByUser(userId) {
    return this.requests.filter(r => r.requester.getuserID() === userId);
  }

  getAllRequests() {
    return this.requests;
  }

  updateRequest(requestId, userId, changes) {
    const request = this.findRequestById(requestId);
    if (!request) throw new Error("Request not found.");

    const { title, description, category, priority } = changes;
    request.updateDetails(userId, title, description, category, priority);
    return true;
  }

  cancelRequest(requestId, userId) {
    const request = this.findRequestById(requestId);
    if (!request) throw new Error("Request not found.");

    request.cancelRequest(userId);
    return true;
  }

  searchRequests(searchText) {
    if (!searchText) return [];
    const term = searchText.toLowerCase();
    return this.requests.filter(r =>
      r.title.toLowerCase().includes(term) ||
      r.description.toLowerCase().includes(term)
    );
  }

  getRequestSummaryByStatus() {
    const summary = { Submitted: 0, Cancelled: 0 };
    this.requests.forEach(r => {
      if (summary[r.status] !== undefined) {
        summary[r.status]++;
      }
    });
    return summary;
  }
}

module.exports = ServiceRequestManager;