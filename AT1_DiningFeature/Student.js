/*
  Program: Dining Meal Booking Console App
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 15th September 2026
*/

class Student {
    #studentId;
    #firstName;
    #lastName;

    constructor(studentId, firstName, lastName){
        this.#studentId = studentId;
        this.#firstName = firstName;
        this.#lastName = lastName;
    }

    // --- Student ID ---
    get studentId(){
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
        if(!firstName || firstName.Trim() === ''){
            throw new Error('First name cannot be empty.');
        }
        this.#firstName = firstName;
    }

    // --- LastName ---
    get lastName(){
        return this.#lastName = lastName;
    }

    set lastName(lastName){
        if(!lastName || lastName.Trim() === ''){
            throw new Error('Last name cannot be empty.');
        }
        this.#lastName = lastName;
    }

    // Method 1: Combine First & Last Name
    getFullName(){
        return '${this.#firstName} ${this.#lastName}'; 
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