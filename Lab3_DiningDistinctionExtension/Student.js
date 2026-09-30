/*
  Program: Dining Meal Booking Console App
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 15th September 2026
*/

const DiningAccount = require('./DiningAccount');

class Student {
    #studentId;
    #firstName;
    #lastName;
    #diningAccount;

    constructor(studentId, firstName, lastName = ""){
        this.#studentId = studentId;
        if (!lastName && firstName.includes(" ")) {
            const parts = firstName.split(" ");
            this.#firstName = parts[0];
            this.#lastName = parts.slice(1).join(" ");
        } else {
            this.#firstName = firstName;
            this.#lastName = lastName;
        }
        this.#diningAccount = null;
    }

    assignDiningAccount(account) {
        if (!(account instanceof DiningAccount)) {
            throw new Error("Invalid account: Must be an instance of DiningAccount or its subclasses.");
        }
        this.#diningAccount = account;
    }

    get studentId(){ return this.#studentId; }
    getStudentId() { return this.#studentId; }

    set studentId(studentId){
        if (!studentId || studentId.trim() === ''){
            throw new Error('Student ID cannot be empty.');
        }
        this.#studentId = studentId;
    }

    get firstName(){ return this.#firstName; }
    set firstName(firstName){
        if(!firstName || firstName.trim() === ''){
            throw new Error('First name cannot be empty.');
        }
        this.#firstName = firstName;
    }

    get lastName() { return this.#lastName; }
    set lastName(lastName) {
        if (!lastName || lastName.trim() === '') {
            throw new Error('Last name cannot be empty.');
        }
        this.#lastName = lastName;
    }

    getName() { return this.getFullName(); }
    getFullName(){ return `${this.#firstName} ${this.#lastName}`.trim(); }
    getDiningAccount(){ return this.#diningAccount; }

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