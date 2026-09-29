/*
  Program: Dining Meal Booking Console App
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 29/09/2026
*/

class DiningAccount{
    // 1. Private fields
    #accountNumber;
    #balance;
    #transactions;

    // 2. Constructor with optional opening balance
    constructor(accountNumber, openingBalance = 0) {
        if (!accountNumber || accountNumber.trim() === "") {
            throw new Error("Account number cannot be empty.");
        }
        if (openingBalance < 0) {
            throw new Error("Opening balance cannot be negative.");
        }

        this.#accountNumber = accountNumber;
        this.#balance = openingBalance;
        this.#transactions = [];

        if (openingBalance > 0) {
            this.#transactions.push({
                type: "Deposit",
                amount: openingBalance,
                description: "Opening Balance"
            });
        }
    }

    // 3. Deposit method supporting 1 or 2 parameters
    deposit(amount, description = "Standard Deposit") {
        if (amount <= 0) {
            console.log("Deposit amount must be greater than zero.");
            return;
        }

        this.#balance += amount;
        this.#transactions.push({
            type: "Deposit",
            amount: amount,
            description: description
        });
    }

    // 4. Pay for meal with sufficient funds check
    payForMeal(amount, description = "Meal Payment") {
        if (amount <= 0) {
            console.log("Meal payment amount must be greater than zero.");
            return false;
        }

        if (this.#balance - amount < 0) {
            console.log("Payment rejected: Insufficient funds.");
            return false;
        }

        this.#balance -= amount;
        this.#transactions.push({
            type: "Payment",
            amount: amount,
            description: description
        });
        console.log("Payment successful.");
        return true;
    }

    // 5. Getter methods
    getBalance() {
        return this.#balance;
    }

    getTransactions() {
        // Return a copy of the array to maintain encapsulation
        return [...this.#transactions];
    }

    // 6. Display Summary
    displayAccountSummary() {
        console.log(`Account Number: ${this.#accountNumber}`);
        console.log(`Balance: K${this.#balance.toFixed(2)}`);
    }
}


     