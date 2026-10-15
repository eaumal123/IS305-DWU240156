/*
  Program: Pass Component - Service Request base
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 25th September 2026
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

    updateDetails(userId, newTitle, newDescription, newCategory, newPriority) {
        if (this.#requester.getuserID() !== userId) {
            throw new Error("Unauthorized update: Updates attempted by another user.");
        }
        if (this.#status === 'Cancelled') {
            throw new Error("Cannot update a cancelled request.");
        }
        
        if (newTitle) this.title = newTitle;
        if (newDescription) this.description = newDescription;
        if (newCategory) this.category = newCategory;
        if (newPriority) this.priority = newPriority;
    }

    cancelRequest(userId) {
        if (this.#requester.getuserID() !== userId) {
            throw new Error("Unauthorized cancellation: Cancellation of another user's request is not allowed.");
        }
        if (this.#status === 'Cancelled') {
            throw new Error("Request is already marked Cancelled.");
        }

        this.#status = 'Cancelled';
        this.#dateUpdated = new Date();
    }

    getRequestSummary() {
        return `[ID: ${this.#requestID}] Title: ${this.#title} | Category: ${this.#category} | Priority: ${this.#priority} | Status: ${this.#status} | Requester: ${this.#requester.getFullName()}`;
    }
}

module.exports = ServiceRequest;