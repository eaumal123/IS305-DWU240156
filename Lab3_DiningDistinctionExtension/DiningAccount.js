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
}