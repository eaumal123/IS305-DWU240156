/* 
Student Name: Eau Mallen
Student ID#: 240156
Description: This file is purposely used for testing.
*/

const DiningAccount = require('./DiningAccount');
const CreditDiningAccount = require('./CreditDiningAccount');
const Student = require('./Student');
const MealBooking = require('./MealBooking');

// Import your classes (or make sure they are loaded)
// const { Student, MealBooking, DiningAccount, CreditDiningAccount } = require('./your-files');

console.log("=== RUNNING LAB 3 TEST SUITE ===\n");

// -------------------------------------------------------------
// TEST 1: Deposit to DiningAccount
// Expected: Balance increases correctly
// -------------------------------------------------------------
console.log("TEST 1: Deposit to DiningAccount");
const account1 = new DiningAccount("Eau Mallen", 50);
account1.deposit(30);

if (account1.balance === 80) {
  console.log("Result: PASS (Balance correctly updated to 80)\n");
} else {
  console.log(`Result: FAIL (Expected 80, got ${account1.balance})\n`);
}

// -------------------------------------------------------------
// TEST 2: Booking payment with sufficient balance
// Expected: Payment succeeds, booking confirmed
// -------------------------------------------------------------
console.log("TEST 2: Booking payment with sufficient balance");
const student1 = new Student("S123", "Eau Mallen");
const account2 = new DiningAccount("Eau Mallen", 100);
student1.assignDiningAccount(account2);

const booking1 = new MealBooking(student1.studentId, "Lunch", 25);
const success1 = booking1.processPayment(); // Assumes processPayment() uses assigned account

if (success1 && booking1.isConfirmed && account2.balance === 75) {
  console.log("Result: PASS (Payment succeeded & booking confirmed)\n");
} else {
  console.log("Result: FAIL (Payment or confirmation failed)\n");
}

// -------------------------------------------------------------
// TEST 3: Booking payment with insufficient balance
// Expected: Payment fails, booking unconfirmed
// -------------------------------------------------------------
console.log("TEST 3: Booking payment with insufficient balance");
const student2 = new Student("S124", "John Doe");
const account3 = new DiningAccount("John Doe", 10); // Balance ($10) < Price ($30)
student2.assignDiningAccount(account3);

const booking2 = new MealBooking(student2.studentId, "Dinner", 30);
const success2 = booking2.processPayment();

if (!success2 && !booking2.isConfirmed && account3.balance === 10) {
  console.log("Result: PASS (Payment correctly rejected & booking unconfirmed)\n");
} else {
  console.log("Result: FAIL (Payment should have been rejected)\n");
}

// -------------------------------------------------------------
// TEST 4: CreditDiningAccount payment within limit
// Expected: Payment succeeds, balance negative
// -------------------------------------------------------------
console.log("TEST 4: CreditDiningAccount payment within limit");
const student3 = new Student("S125", "Jane Smith");
// Balance = $20, Credit Limit = $50 (Can spend up to -$50)
const creditAccount = new CreditDiningAccount("Jane Smith", 20, 50); 
student3.assignDiningAccount(creditAccount);

const booking3 = new MealBooking(student.studentId, "Dinner", 40); // Costs $40, balance becomes -$20
const success3 = booking3.processPayment();

if (success3 && booking3.isConfirmed && creditAccount.balance === -20) {
  console.log("Result: PASS (Payment succeeded with negative balance: -20)\n");
} else {
  console.log(`Result: FAIL (Expected balance -20, got ${creditAccount.balance})\n`);
}

// -------------------------------------------------------------
// TEST 5: Attempt duplicate meal booking payment
// Expected: Second attempt rejected
// -------------------------------------------------------------
console.log("TEST 5: Attempt duplicate meal booking payment");
// Reuse booking1 which was already paid in TEST 2
const secondPaymentSuccess = booking1.processPayment(); 

if (!secondPaymentSuccess) {
  console.log("Result: PASS (Duplicate payment prevented)\n");
} else {
  console.log("Result: FAIL (Duplicate payment allowed)\n");
}

