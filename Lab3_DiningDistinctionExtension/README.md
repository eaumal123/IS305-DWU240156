# Dining Booking Credit Extension

## Student Information
* **Student Name:** EAU MALLEN
* **Student ID:** 240156

# GitHub Repository URL
* **Repository URL:** https://github.com/eaumal123/IS305-DWU240156.git

# Description
Labs 1 & 2 Base: Formed the core OOP foundation (e.g., Student class, MealBooking class, and basic payment/booking integration).

Lab 3 Extensions: Introduced DiningAccount as a base class, added specialized subclasses (RewardsDiningAccount, CreditDiningAccount), integrated method overriding and polymorphism, and linked account processing directly to meal bookings.

# Run the Application
The application is executed in the terminal of the Visual Studio Code. When attempting to run the application, you make sure that you cd into the directory of the application (Lab2_DiningCreditExtension) - `cd Lab3_DiningDistinctionExtension`. In order to execute the application, run this line `node DiningApp.js` in the working directory.

Command to run the application:
node DiningApp.js

# Object - Oriented Concepts Explained
## Class Inheritance Hierarchy
Base Class: DiningAccount
Subclasses: RewardsDiningAccount and CreditDiningAccount inherit properties and methods from DiningAccount.

## Constructor Chaining
In JavaScript, when a subclass extends a base (parent) class, it must call super() inside its constructor before accessing this or setting its own properties.

How super() Works
- Delegation: Calling super(...) invokes the parent class's constructor function.

- Initialization Order: Passing parameters into super() allows the base class to initialize inherited properties (like accountHolder and balance) first.

- Execution Context: Once super() runs, JavaScript binds this to the new subclass instance, allowing you to attach subclass-specific properties (like creditLimit).

Code Example
```
// Base Class
class DiningAccount {
  constructor(accountHolder, balance) {
    this.accountHolder = accountHolder; // Initialized by base class
    this.balance = balance;             // Initialized by base class
  }
}

// Subclass
class CreditDiningAccount extends DiningAccount {
  constructor(accountHolder, balance, creditLimit) {
    // 1. Pass initial values to the base class constructor
    super(accountHolder, balance);

    // 2. Add subclass-specific field
    this.creditLimit = creditLimit;
  }
}

// Example Usage:
const myAccount = new CreditDiningAccount("Eau Mallen", 100, 500);

console.log(myAccount.accountHolder); // "Eau Mallen" (from DiningAccount)
console.log(myAccount.balance);       // 100        (from DiningAccount)
console.log(myAccount.creditLimit);   // 500        (from CreditDiningAccount)
```

## Method Overriding
Method overriding occurs when a subclass provides its own specific implementation of a method that is already defined in its parent class.

Base Behavior (DiningAccount): The standard payment method checks if the account balance is sufficient to cover a transaction. If balance - amount < 0, the transaction fails to prevent a negative balance.

Overridden Behavior (CreditDiningAccount): CreditDiningAccount overrides this method to alter the spending rules. Instead of stopping at zero, it checks whether the new balance would fall within an authorized overdraft limit (e.g., balance - amount >= -creditLimit).

Execution: If the amount falls within the credit limit, the transaction succeeds—allowing the balance to become negative—and returns true. If the amount exceeds balance + creditLimit, the payment is rejected and returns false.
```
class CreditDiningAccount extends DiningAccount {
  constructor(accountHolder, balance, creditLimit) {
    super(accountHolder, balance);
    this.creditLimit = creditLimit;
  }

  // Overriding the base pay() method
  pay(amount) {
    if (this.balance - amount >= -this.creditLimit) {
      this.balance -= amount;
      return true; // Payment accepted, balance can be negative
    }
    return false; // Exceeds credit limit
  }
}
```
# System Connection & Interaction
Student & DiningAccount: A Student object is assigned a specific DiningAccount (or one of its subclasses).

MealBooking & DiningAccount: When a MealBooking processes payment, it calls the payment method on the student's assigned DiningAccount.

Transaction Flow:
- If payment succeeds, the booking status is marked as confirmed, preventing duplicate payments.
- If payment fails (e.g., insufficient funds/credit limit exceeded), the booking is not confirmed, and the transaction is logged accordingly.

# Testing & Results


# AI Tools
The lab was done with the assitance of AI, to create and debug the codes.

**AI Tool:** Google Gemini
**Use case:** Defining the purpose and role of `Getters & Setters`, structuring the code blocks and debugging.
**Validation:** The basic concept was understood well enough, that I was able to integrate and test the final work independently.  
