/*
  Program: Pass Component - Core Service Request System
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 25th September 2026
*/

// Define User class.
class User {
    #userID;
    #firstName;
    #lastName;
    #emailAddress;
    #userType;

    static isValid(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Constructor 
    constructor(userID, firstName, lastName, emailAddress, userType){
        this.#userID = userID;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#emailAddress = emailAddress;
        this.#userType = userType;
    }

    // Getters
    getuserID(){return this.#userID;}
    getfirstName(){return this.#firstName;}
    getlastName(){return this.#lastName;}
    getemailAddress(){return this.#emailAddress;}
    getuserType(){return this.#userType;}

    // Controlled setters
    set firstName(firstName){
        if(!firstName || firstName.trim() === '') throw new Error("First name cannot be empty");
        this.#firstName = firstName;
    }

    set lastName(lastName){
        if(!lastName || lastName.trim() === '') throw new Error("Last name cannot be empty");
        this.#lastName = lastName;
    }

    set emailAddress (emailAddress){
        if(!User.isValid(emailAddress)) throw new Error("Invalid email address.");
        this.#emailAddress = emailAddress;
    }

    getFullName(){
        return `${this.#firstName} ${this.#lastName}`;
    }

    // Validation
    validate(){
        if(!this.#userID || this.#userID.trim() === '') throw new Error("Missing user ID");
        if(!this.#firstName || this.#firstName.trim() === '') throw new Error("Missing first name");
        if(!this.#lastName || this.#lastName.trim() === '') throw new Error("Missing last name");
        if(!User.isValid(this.#emailAddress) || this.#emailAddress.trim() === '') throw new Error("Invalid email address");
    }

    displayInfo(){
        console.log(`[User ID: ${this.#userID}] Name: ${this.getFullName()} | Email: ${this.emailAddress} | Type: ${this.#userType}`);
    }
}

module.exports = User;

