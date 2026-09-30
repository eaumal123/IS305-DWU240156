/*
  Program: Dining Meal Booking Console App
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 15th September 2026
*/

const DiningAccount = require('./DiningAccount');

// --- Class Declaration ---
class Student {
    #studentId;
    #firstName;
    #lastName;
    #diningAccount;

// --- Constructor Implementation ---    
    constructor(studentId, firstName, lastName){
        this.#studentId = studentId;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#diningAccount = null;
    }

    // Assign account with type validation
    assignDiningAccount(account) {
        if (!(account instanceof DiningAccount)) {
            throw new Error("Invalid account: Must be an instance of DiningAccount or its subclasses.");
        }
        this.#diningAccount = account;
    }

    // --- GETTERS & SETTERS ---
    // --- Student ID ---
    get studentId(){
        return this.#studentId;
    }

    getStudentId() {
    return this.#studentId;
}
  
    set studentId(studentId){
        if (!studentId || studentId.trim() === ''){
            throw new Error('Student ID cannot be empty.');
        }
        this.#studentId = studentId;
    }

    // --- FirstName ---
    get firstName(){
        return this.#firstName;
    }

    set firstName(firstName){
        if(!firstName || firstName.trim() === ''){
            throw new Error('First name cannot be empty.');
        }
        this.#firstName = firstName;
    }

    // --- LastName ---
    get lastName() {
        return this.#lastName;
    }

    set lastName(lastName) {
        if (!lastName || lastName.trim() === '') {
            throw new Error('Last name cannot be empty.');
        }
        this.#lastName = lastName;
    }

    getName() {
        return this.getFullName();
    }

    // Method 1: Combine First & Last Name
    getFullName(){
        return `${this.#firstName} ${this.#lastName}`; 
    }

    // Method 2: Return Dining Account.
    getDiningAccount(){
        return this.#diningAccount;
    }

    // Method 2: Display Information(output)
    displayInfo(){
        const output =
`===========================
STUDENT DETAILS
===========================
Student ID: ${this.studentId}
Student Name: ${this.getFullName()}
===========================`;

        console.log(output);
        return output;  
    }
}

    module.exports = Student;