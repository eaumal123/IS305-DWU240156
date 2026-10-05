/*
  Program: Dining Meal Booking Console App
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 20 July 2026
*/

const Student = require('./Student');
const MealBooking = require('./MealBooking');
const DiningAccount = require('./DiningAccount');
const RewardsDiningAccount = require('./RewardsDiningAccount');
const CreditDiningAccount = require('./CreditDiningAccount');

// 1. Task 2: Demonstrate Polymorphism with Array
console.log("========================================");
console.log("       POLYMORPHIC ACCOUNT PROCESSING   ");
console.log("========================================");

const diningAccounts = [
    new DiningAccount("DA001", 100),
    new RewardsDiningAccount("RA001", 100, 2.5),
    new CreditDiningAccount("CA001", 100, 500)
];

for (const account of diningAccounts) {
    account.displayAccountSummary();
}

// 2. Task 3 & 4: Student, Booking & Payment Demonstration
console.log("\n========================================");
console.log("          STUDENT DINING ACCOUNT        ");
console.log("========================================");

const student = new Student("DWU2026001", "Maria Kila");
const rewardsAcc = new RewardsDiningAccount("RA001", 100, 2.5);
student.assignDiningAccount(rewardsAcc);

console.log(`Student: ${student.getName()}`);
console.log(`Student ID: ${student.getStudentId()}`);
console.log(`Account Type: RewardsDiningAccount`);
console.log(`Account Number: ${rewardsAcc.getAccountNumber ? rewardsAcc.getAccountNumber() : "RA001"}`);
console.log(`Opening Balance: K${rewardsAcc.getBalance().toFixed(2)}`);

console.log("\n========================================");
console.log("             MEAL BOOKING               ");
console.log("========================================");

const booking = new MealBooking(student.getStudentId(), student.getName(), "2026-09-30", "Dinner", 2);

const totalCost = booking.calculateTotalCost();

console.log(`Meal: ${booking.getMealType()}`);
console.log(`Quantity: ${booking.getQuantity()}`);
console.log(`Total Cost: K${totalCost.toFixed(2)}`);

const success = booking.processPayment(student.getDiningAccount());

console.log(`Payment Status: ${success ? "Successful" : "Failed"}`);
console.log(`Booking Status: ${booking.getStatus()}`);
console.log(`Remaining Balance: K${student.getDiningAccount().getBalance().toFixed(2)}`);

// 3. Task 5: Transaction History
console.log("\n========================================");
console.log("          TRANSACTION HISTORY           ");
console.log("========================================");

const history = student.getDiningAccount().getTransactions();
history.forEach((tx, index) => {
    console.log(`${index + 1}. ${tx.type} - K${tx.amount.toFixed(2)}`);
    console.log(`   Description: ${tx.description}`);
});

console.log(`Total Transactions: ${history.length}`);
console.log("========================================");
