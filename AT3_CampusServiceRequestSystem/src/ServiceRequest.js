/*
  Program: Credit Component - Service Request base
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 19th October 2026
*/

class ServiceRequest{
    #requestID;
    #requester; // User object
    #title;
    #description;
    #campusLocation;
    #category;
    #priority;
    #status;
    #dateSubmitted;
    #dateUpdated;
    // Credit additions
    #priorityAssigned = false;
    #assignedTechnicianID = null;
    #progressUpdates = [];
    #history = [];

    static ALLOWED_CATEGORIES = [
        'ICT Support',
        'Facilities Maintenance',
        'Cleaning and Sanitation',
        'General Campus Service'
    ];

    static ALLOWED_PRIORITIES = [
        'Low',
        'Normal',
        'High',
        'Urgent'
    ];

    static STATUSES = ['Submitted', 'Reviewed', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Cancelled'];

    // Permitted status flow. Closed and Cancelled are final.
    static TRANSITIONS = {
        'Submitted': ['Reviewed', 'Cancelled'],
        'Reviewed': ['Assigned'],
        'Assigned': ['In Progress'],
        'In Progress': ['Resolved'],
        'Resolved': ['Closed'],
        'Closed': [],
        'Cancelled': []
    };

    constructor(requestID, requester, title, description, campusLocation, category, priority, status = 'Submitted', dateSubmitted = new Date(), dateUpdated = new Date()){
        this.#requestID = requestID;
        this.#requester = requester;
        this.#title = title;
        this.#description = description;
        this.#campusLocation = campusLocation;
        this.#category = category;
        this.#priority = priority;
        this.#status = status;
        this.#dateSubmitted = dateSubmitted;
        this.#dateUpdated = dateUpdated;
        this.#log(null, this.#status, 'Submitted', requester, 'Request submitted');
    }

    // Appropriate getters
    get requestID(){return this.#requestID;}
    get requester(){return this.#requester;}
    get title(){return this.#title;}
    get description(){return this.#description;}
    get campusLocation(){return this.#campusLocation;}
    get category(){return this.#category;}
    get priority(){return this.#priority;}
    get status(){return this.#status;}
    get dateSubmitted(){return this.#dateSubmitted;}
    get dateUpdated(){return this.#dateUpdated;}
    get assignedTechnicianID(){return this.#assignedTechnicianID;}
    get priorityAssigned(){return this.#priorityAssigned;}
    get progressUpdates(){return this.#progressUpdates.map(p => ({...p}));}  // copies protect the record
    get history(){return this.#history.map(h => ({...h}));}

    // Controlled setters
    set title(title){
        if(!title || title.trim() === '') throw new Error("Missing request title");
        this.#title = title;
        this.#dateUpdated = new Date();
    }

    set description(description){
        if(!description || description.trim() === '') throw new Error("Missing request description");
        this.#description = description;
        this.#dateUpdated = new Date();
    }

    set category(category){
        if(!ServiceRequest.ALLOWED_CATEGORIES.includes(category)){
            throw new Error(`Unsupported category: ${category}`);
        }
        this.#category = category;
        this.#dateUpdated = new Date();
    }

    set priority(priority){
        if(!ServiceRequest.ALLOWED_PRIORITIES.includes(priority)){
            throw new Error(`Unsupported priority value: ${priority}`);
        }
        this.#priority = priority;
        this.#dateUpdated = new Date();
    }

    validate() {
        if (!this.#requestID || this.#requestID.trim() === '') throw new Error("Missing request ID.");
        if (!this.#requester) throw new Error("Missing requester object.");
        if (!this.#title || this.#title.trim() === '') throw new Error("Missing request title.");
        if (!this.#description || this.#description.trim() === '') throw new Error("Missing request description.");
        if (!ServiceRequest.ALLOWED_CATEGORIES.includes(this.#category)) {
            throw new Error(`Unsupported category: ${this.#category}`);
        }
        if (!ServiceRequest.ALLOWED_PRIORITIES.includes(this.#priority)) {
            throw new Error(`Unsupported priority value: ${this.#priority}`);
        }
    }

    // ---- Hooks that the specialised request classes override ----
    validateSpecialisedFields() { return true; }

    calculatePriorityScore() {
        return ServiceRequest.ALLOWED_PRIORITIES.indexOf(this.#priority) + 1;
    }

    getTargetResolutionHours() { return 72; }

    // ---- Private helpers ----
    #log(previousStatus, newStatus, action, actor, comment = '') {
        this.#history.push({
            previousStatus,
            newStatus,
            action,
            actorID: actor?.getuserID?.() ?? 'Unknown',
            actorRole: actor?.getuserType?.() ?? 'Unknown',
            comment,
            dateTime: new Date()
        });
    }

    #transition(next, action, actor, comment) {
        if (!ServiceRequest.TRANSITIONS[this.#status].includes(next)) {
            throw new Error(`Invalid status transition: ${this.#status} -> ${next}`);
        }
        const previous = this.#status;
        this.#status = next;
        this.#dateUpdated = new Date();
        this.#log(previous, next, action, actor, comment);
    }

    #requireRole(user, role, message) {
        if (!user || typeof user.getuserType !== 'function' || user.getuserType() !== role) {
            throw new Error(message);
        }
    }

    #requireAssignedTechnician(user) {
        if (!user || typeof user.getuserType !== 'function' ||
            user.getuserType() !== 'Technician' || user.getuserID() !== this.#assignedTechnicianID) {
            throw new Error("Only the assigned Technician can perform this action.");
        }
    }

    // ---- Requester actions (these keep the Pass signatures: they take a user ID) ----
    updateDetails(userId, newTitle, newDescription, newCategory, newPriority, extraChangedFields = []) {
        if (this.#requester.getuserID() !== userId) {
            throw new Error("Unauthorized update: Updates attempted by another user.");
        }
        if (this.#status === 'Cancelled') {
            throw new Error("Cannot update a cancelled request.");
        }
        if (this.#status !== 'Submitted') {
            throw new Error(`Only Submitted requests can be updated (current status: ${this.#status}).`);
        }

        // Validate everything first, so a bad update changes nothing
        if (newTitle && newTitle.trim() === '') throw new Error("Missing request title");
        if (newDescription && newDescription.trim() === '') throw new Error("Missing request description");
        if (newCategory && !ServiceRequest.ALLOWED_CATEGORIES.includes(newCategory)) {
            throw new Error(`Unsupported category: ${newCategory}`);
        }
        if (newPriority && !ServiceRequest.ALLOWED_PRIORITIES.includes(newPriority)) {
            throw new Error(`Unsupported priority value: ${newPriority}`);
        }

        const changed = [];
        if (newTitle) { this.title = newTitle; changed.push('title'); }
        if (newDescription) { this.description = newDescription; changed.push('description'); }
        if (newCategory) { this.category = newCategory; changed.push('category'); }
        if (newPriority) { this.priority = newPriority; changed.push('priority'); }
        if (Array.isArray(extraChangedFields)) changed.push(...extraChangedFields);   // specialised fields changed by a subclass
        this.#dateUpdated = new Date();
        this.#log(this.#status, this.#status, 'Updated details', this.#requester,
            `Updated: ${changed.join(', ') || 'no fields'}`);
    }

    cancelRequest(userId) {
        if (this.#requester.getuserID() !== userId) {
            throw new Error("Unauthorized cancellation: Cancellation of another user's request is not allowed.");
        }
        if (this.#status === 'Cancelled') {
            throw new Error("Request is already marked Cancelled.");
        }
        if (this.#status !== 'Submitted') {
            throw new Error(`Only Submitted requests can be cancelled (current status: ${this.#status}).`);
        }
        this.#transition('Cancelled', 'Cancelled', this.#requester, 'Cancelled by requester');
    }

    // ---- Service Officer actions ----
    review(officer, comment = 'Request reviewed') {
        this.#requireRole(officer, 'Service Officer', "Only a Service Officer can review requests.");
        this.#transition('Reviewed', 'Reviewed', officer, comment);
    }

    assignPriority(officer, priority, comment = '') {
        this.#requireRole(officer, 'Service Officer', "Only a Service Officer can assign a priority.");
        if (this.#status !== 'Reviewed') {
            throw new Error("Priority can only be assigned while the request is Reviewed.");
        }
        if (!ServiceRequest.ALLOWED_PRIORITIES.includes(priority)) {
            throw new Error(`Unsupported priority value: ${priority}`);
        }
        this.#priority = priority;
        this.#priorityAssigned = true;
        this.#dateUpdated = new Date();
        this.#log(this.#status, this.#status, 'Priority assigned', officer, comment || `Priority set to ${priority}`);
    }

    assignTechnician(officer, technician, comment = '') {
        this.#requireRole(officer, 'Service Officer', "Only a Service Officer can assign a Technician.");
        if (!technician || typeof technician.getuserType !== 'function' || technician.getuserType() !== 'Technician') {
            throw new Error("The assignee must be a Technician.");
        }
        if (this.#status === 'Reviewed' && !this.#priorityAssigned) {
            throw new Error("A priority must be assigned before assigning a Technician.");
        }
        this.#transition('Assigned', 'Technician assigned', officer, comment || `Assigned to ${technician.getuserID()}`);
        this.#assignedTechnicianID = technician.getuserID();
    }

    close(officer, comment = 'Verified and closed') {
        this.#requireRole(officer, 'Service Officer', "Only a Service Officer can close a request.");
        this.#transition('Closed', 'Closed', officer, comment);
    }

    // ---- Technician actions ----
    startWork(technician, comment = 'Work started') {
        this.#requireAssignedTechnician(technician);
        this.#transition('In Progress', 'Work started', technician, comment);
    }

    recordProgress(technician, note) {
        this.#requireAssignedTechnician(technician);
        if (this.#status !== 'In Progress') {
            throw new Error("Progress can only be recorded while the request is In Progress.");
        }
        if (!note || note.trim() === '') throw new Error("A progress note is required.");
        this.#progressUpdates.push({ note: note.trim(), by: technician.getuserID(), dateTime: new Date() });
        this.#dateUpdated = new Date();
        this.#log(this.#status, this.#status, 'Progress update', technician, note.trim());
    }

    resolve(technician, comment = 'Work resolved') {
        this.#requireAssignedTechnician(technician);
        this.#transition('Resolved', 'Resolved', technician, comment);
    }

    getRequestSummary() {
        return `[ID: ${this.#requestID}] Title: ${this.#title} | Category: ${this.#category} | Priority: ${this.#priority} | Status: ${this.#status} | Requester: ${this.#requester.getFullName()}`;
    }
}

module.exports = ServiceRequest;
