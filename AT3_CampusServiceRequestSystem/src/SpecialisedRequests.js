/*
  Program: Credit Component - Specialised requests
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 19th October 2026
*/

const ServiceRequest = require('./ServiceRequest');

const isBlank = (v) => typeof v !== 'string' || v.trim() === '';

// Common data for every specialised request:
// { requestID, requester, title, description, campusLocation, priority }

class ICTSupportRequest extends ServiceRequest {
    static IMPACTS = ['None', 'Single User', 'Department', 'Campus-wide'];
    static KEYS = ['deviceType', 'systemName', 'faultType', 'networkImpact'];
    #deviceType; #systemName; #faultType; #networkImpact;

    constructor(commonRequestData, specialisedData = {}) {
        const c = commonRequestData;
        super(c.requestID, c.requester, c.title, c.description, c.campusLocation, 'ICT Support', c.priority);  // constructor chaining
        ICTSupportRequest.checkSpecialised(specialisedData);
        this.#deviceType = specialisedData.deviceType.trim();
        this.#systemName = specialisedData.systemName.trim();
        this.#faultType = specialisedData.faultType.trim();
        this.#networkImpact = specialisedData.networkImpact;
    }

    static checkSpecialised({ deviceType, systemName, faultType, networkImpact }) {
        if (isBlank(deviceType)) throw new Error("Device type is required.");
        if (isBlank(systemName)) throw new Error("System name is required.");
        if (isBlank(faultType)) throw new Error("Fault type is required.");
        if (!ICTSupportRequest.IMPACTS.includes(networkImpact)) {
            throw new Error(`Network impact must be one of: ${ICTSupportRequest.IMPACTS.join(', ')}`);
        }
        return true;
    }

    get deviceType() { return this.#deviceType; }
    get systemName() { return this.#systemName; }
    get faultType() { return this.#faultType; }
    get networkImpact() { return this.#networkImpact; }

    // ---- Overridden methods ----
    validate() { super.validate(); this.validateSpecialisedFields(); }

    validateSpecialisedFields() {
        return ICTSupportRequest.checkSpecialised({
            deviceType: this.#deviceType, systemName: this.#systemName,
            faultType: this.#faultType, networkImpact: this.#networkImpact
        });
    }

    getRequestSummary() {
        return `${super.getRequestSummary()} | Device: ${this.#deviceType} | System: ${this.#systemName} | Fault: ${this.#faultType} | Network Impact: ${this.#networkImpact}`;
    }

    calculatePriorityScore() {
        return super.calculatePriorityScore() + ICTSupportRequest.IMPACTS.indexOf(this.#networkImpact) * 2;
    }

    getTargetResolutionHours() {
        return { 'None': 72, 'Single User': 48, 'Department': 24, 'Campus-wide': 4 }[this.#networkImpact];
    }

    updateDetails(userId, newTitle, newDescription, newCategory, newPriority, specialisedChanges = {}) {
        if (newCategory && newCategory !== this.category) {
            throw new Error("The category of a specialised request cannot be changed.");
        }
        const unknown = Object.keys(specialisedChanges).filter(k => !ICTSupportRequest.KEYS.includes(k));
        if (unknown.length) throw new Error(`Cannot update field(s): ${unknown.join(', ')}`);
        const merged = {
            deviceType: this.#deviceType, systemName: this.#systemName,
            faultType: this.#faultType, networkImpact: this.#networkImpact, ...specialisedChanges
        };
        ICTSupportRequest.checkSpecialised(merged);                              // validate before changing anything
        super.updateDetails(userId, newTitle, newDescription, undefined, newPriority, Object.keys(specialisedChanges));   // owner and status rules
        this.#deviceType = merged.deviceType.trim();
        this.#systemName = merged.systemName.trim();
        this.#faultType = merged.faultType.trim();
        this.#networkImpact = merged.networkImpact;
    }
}

class MaintenanceRequest extends ServiceRequest {
    static HAZARDS = ['Low', 'Medium', 'High'];
    static KEYS = ['building', 'roomNumber', 'hazardLevel', 'equipmentAffected'];
    #building; #roomNumber; #hazardLevel; #equipmentAffected;

    constructor(commonRequestData, specialisedData = {}) {
        const c = commonRequestData;
        super(c.requestID, c.requester, c.title, c.description, c.campusLocation, 'Facilities Maintenance', c.priority);  // constructor chaining
        MaintenanceRequest.checkSpecialised(specialisedData);
        this.#building = specialisedData.building.trim();
        this.#roomNumber = String(specialisedData.roomNumber).trim();
        this.#hazardLevel = specialisedData.hazardLevel;
        this.#equipmentAffected = specialisedData.equipmentAffected.trim();
    }

    static checkSpecialised({ building, roomNumber, hazardLevel, equipmentAffected }) {
        if (isBlank(building)) throw new Error("Building is required.");
        if (isBlank(String(roomNumber ?? ''))) throw new Error("Room number is required.");
        if (!MaintenanceRequest.HAZARDS.includes(hazardLevel)) {
            throw new Error(`Hazard level must be one of: ${MaintenanceRequest.HAZARDS.join(', ')}`);
        }
        if (isBlank(equipmentAffected)) throw new Error("Equipment affected is required.");
        return true;
    }

    get building() { return this.#building; }
    get roomNumber() { return this.#roomNumber; }
    get hazardLevel() { return this.#hazardLevel; }
    get equipmentAffected() { return this.#equipmentAffected; }

    // ---- Overridden methods ----
    validate() { super.validate(); this.validateSpecialisedFields(); }

    validateSpecialisedFields() {
        return MaintenanceRequest.checkSpecialised({
            building: this.#building, roomNumber: this.#roomNumber,
            hazardLevel: this.#hazardLevel, equipmentAffected: this.#equipmentAffected
        });
    }

    getRequestSummary() {
        return `${super.getRequestSummary()} | Building: ${this.#building} | Room: ${this.#roomNumber} | Hazard: ${this.#hazardLevel} | Equipment: ${this.#equipmentAffected}`;
    }

    calculatePriorityScore() {
        return super.calculatePriorityScore() + MaintenanceRequest.HAZARDS.indexOf(this.#hazardLevel) * 3;
    }

    getTargetResolutionHours() {
        return { 'Low': 120, 'Medium': 48, 'High': 8 }[this.#hazardLevel];
    }

    updateDetails(userId, newTitle, newDescription, newCategory, newPriority, specialisedChanges = {}) {
        if (newCategory && newCategory !== this.category) {
            throw new Error("The category of a specialised request cannot be changed.");
        }
        const unknown = Object.keys(specialisedChanges).filter(k => !MaintenanceRequest.KEYS.includes(k));
        if (unknown.length) throw new Error(`Cannot update field(s): ${unknown.join(', ')}`);
        const merged = {
            building: this.#building, roomNumber: this.#roomNumber,
            hazardLevel: this.#hazardLevel, equipmentAffected: this.#equipmentAffected, ...specialisedChanges
        };
        MaintenanceRequest.checkSpecialised(merged);
        super.updateDetails(userId, newTitle, newDescription, undefined, newPriority, Object.keys(specialisedChanges));
        this.#building = merged.building.trim();
        this.#roomNumber = String(merged.roomNumber).trim();
        this.#hazardLevel = merged.hazardLevel;
        this.#equipmentAffected = merged.equipmentAffected.trim();
    }
}

class CleaningRequest extends ServiceRequest {
    static RISKS = ['Low', 'Medium', 'High'];
    static KEYS = ['cleaningArea', 'hygieneRisk', 'serviceType', 'preferredServiceTime'];
    #cleaningArea; #hygieneRisk; #serviceType; #preferredServiceTime;

    constructor(commonRequestData, specialisedData = {}) {
        const c = commonRequestData;
        super(c.requestID, c.requester, c.title, c.description, c.campusLocation, 'Cleaning and Sanitation', c.priority);  // constructor chaining
        CleaningRequest.checkSpecialised(specialisedData);
        this.#cleaningArea = specialisedData.cleaningArea.trim();
        this.#hygieneRisk = specialisedData.hygieneRisk;
        this.#serviceType = specialisedData.serviceType.trim();
        this.#preferredServiceTime = specialisedData.preferredServiceTime.trim();
    }

    static checkSpecialised({ cleaningArea, hygieneRisk, serviceType, preferredServiceTime }) {
        if (isBlank(cleaningArea)) throw new Error("Cleaning area is required.");
        if (!CleaningRequest.RISKS.includes(hygieneRisk)) {
            throw new Error(`Hygiene risk must be one of: ${CleaningRequest.RISKS.join(', ')}`);
        }
        if (isBlank(serviceType)) throw new Error("Service type is required.");
        if (isBlank(preferredServiceTime)) throw new Error("Preferred service time is required.");
        return true;
    }

    get cleaningArea() { return this.#cleaningArea; }
    get hygieneRisk() { return this.#hygieneRisk; }
    get serviceType() { return this.#serviceType; }
    get preferredServiceTime() { return this.#preferredServiceTime; }

    // ---- Overridden methods ----
    validate() { super.validate(); this.validateSpecialisedFields(); }

    validateSpecialisedFields() {
        return CleaningRequest.checkSpecialised({
            cleaningArea: this.#cleaningArea, hygieneRisk: this.#hygieneRisk,
            serviceType: this.#serviceType, preferredServiceTime: this.#preferredServiceTime
        });
    }

    getRequestSummary() {
        return `${super.getRequestSummary()} | Area: ${this.#cleaningArea} | Hygiene Risk: ${this.#hygieneRisk} | Service: ${this.#serviceType} | Preferred Time: ${this.#preferredServiceTime}`;
    }

    calculatePriorityScore() {
        return super.calculatePriorityScore() + CleaningRequest.RISKS.indexOf(this.#hygieneRisk) * 2;
    }

    getTargetResolutionHours() {
        return { 'Low': 48, 'Medium': 24, 'High': 6 }[this.#hygieneRisk];
    }

    updateDetails(userId, newTitle, newDescription, newCategory, newPriority, specialisedChanges = {}) {
        if (newCategory && newCategory !== this.category) {
            throw new Error("The category of a specialised request cannot be changed.");
        }
        const unknown = Object.keys(specialisedChanges).filter(k => !CleaningRequest.KEYS.includes(k));
        if (unknown.length) throw new Error(`Cannot update field(s): ${unknown.join(', ')}`);
        const merged = {
            cleaningArea: this.#cleaningArea, hygieneRisk: this.#hygieneRisk,
            serviceType: this.#serviceType, preferredServiceTime: this.#preferredServiceTime, ...specialisedChanges
        };
        CleaningRequest.checkSpecialised(merged);
        super.updateDetails(userId, newTitle, newDescription, undefined, newPriority, Object.keys(specialisedChanges));
        this.#cleaningArea = merged.cleaningArea.trim();
        this.#hygieneRisk = merged.hygieneRisk;
        this.#serviceType = merged.serviceType.trim();
        this.#preferredServiceTime = merged.preferredServiceTime.trim();
    }
}

module.exports = { ICTSupportRequest, MaintenanceRequest, CleaningRequest };
