/*
  Program: Dining Meal Booking Console App
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 15th September 2026
*/

const DiningAccount = require('./DiningAccount');

class CreditDiningAccount extends DiningAccount {
    // 1. Private field for credit limit
    #creditLimit;

    // 2. Constructor chaining with super()
    constructor(accountNumber, openingBalance, creditLimit) {
        super(accountNumber, openingBalance);
        
        if (creditLimit < 0) {
            throw new Error("Credit limit cannot be negative.");
        }
        this.#creditLimit = creditLimit;
    }

    // Getter for credit limit
    getCreditLimit() {
        return this.#creditLimit;
    }

    // 3. Override payForMeal() to allow balance to go negative down to -creditLimit
    payForMeal(amount, description = "Meal Payment") {
        if (amount <= 0) {
            console.log("Meal payment amount must be greater than zero.");
            return false;
        }

        // Available purchasing power = current balance + credit limit
        const availableFunds = this.getBalance() + this.#creditLimit;

        if (amount > availableFunds) {
            console.log("Payment rejected: Payment exceeds available balance and credit limit.");
            return false;
        }

        // Deduct from balance directly (can go negative)
        // Accessing private #balance via a deposit of negative amount or adjusting internal logic:
        // Since #balance is private to DiningAccount, we use super method or helper
        // Standard approach: record transaction directly or deduct via super call
        const success = super.payForMeal(amount, description);

        // If super rejected because balance < amount, handle credit logic directly:
        if (!success && amount <= availableFunds) {
            // Force payment by depositing negative or calling base method logic
            // Since #balance is private, we bypass standard check by using internal balance management:
            const currentBal = this.getBalance();
            const newBal = currentBal - amount;

            // Adjust balance using negative deposit / withdrawal
            this.deposit(-amount, description);
            console.log("Payment successful using credit line.");
            return true;
        }

        return success;
    }
}

module.exports = CreditDiningAccount;

