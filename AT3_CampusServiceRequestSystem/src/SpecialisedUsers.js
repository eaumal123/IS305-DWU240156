/*
  Program: Distinction Component - Specialised users
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 20th October 2026
*/

const User = require('./User');

const isBlank = (v) => typeof v !== 'string' || v.trim() === '';

class StudentRequester extends User {
    #programme;
    #yearLevel;

    constructor(userID, firstName, lastName, emailAddress, programme, yearLevel) {
        super(userID, firstName, lastName, emailAddress, 'Student');   // constructor chaining
        if (isBlank(programme)) throw new Error("Programme is required.");
        if (!Number.isInteger(yearLevel) || yearLevel < 1 || yearLevel > 8) {
            throw new Error("Year level must be a whole number from 1 to 8.");
        }
        this.#programme = programme.trim();
        this.#yearLevel = yearLevel;
    }
    get programme() { return this.#programme; }
    get yearLevel() { return this.#yearLevel; }
    getRoleDetails() { return `Programme: ${this.#programme} | Year Level: ${this.#yearLevel}`; }
    getRoleData() { return { programme: this.#programme, yearLevel: this.#yearLevel }; }
}

class StaffRequester extends User {
    #department;

    constructor(userID, firstName, lastName, emailAddress, department) {
        super(userID, firstName, lastName, emailAddress, 'Staff');     // constructor chaining
        if (isBlank(department)) throw new Error("Department is required.");
        this.#department = department.trim();
    }
    get department() { return this.#department; }
    getRoleDetails() { return `Department: ${this.#department}`; }
    getRoleData() { return { department: this.#department }; }
}

class ServiceOfficer extends User {
    #serviceSection;

    constructor(userID, firstName, lastName, emailAddress, serviceSection) {
        super(userID, firstName, lastName, emailAddress, 'Service Officer');   // constructor chaining
        if (isBlank(serviceSection)) throw new Error("Service section is required.");
        this.#serviceSection = serviceSection.trim();
    }
    get serviceSection() { return this.#serviceSection; }
    getRoleDetails() { return `Service Section: ${this.#serviceSection}`; }
    getRoleData() { return { serviceSection: this.#serviceSection }; }
}

class Technician extends User {
    #speciality;

    constructor(userID, firstName, lastName, emailAddress, speciality) {
        super(userID, firstName, lastName, emailAddress, 'Technician');        // constructor chaining
        if (isBlank(speciality)) throw new Error("Technical speciality is required.");
        this.#speciality = speciality.trim();
    }
    get speciality() { return this.#speciality; }
    getRoleDetails() { return `Speciality: ${this.#speciality}`; }
    getRoleData() { return { speciality: this.#speciality }; }
}

module.exports = { StudentRequester, StaffRequester, ServiceOfficer, Technician };
