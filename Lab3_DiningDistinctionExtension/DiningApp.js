/*
  Program: Dining Meal Booking Console App
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 20 July 2026
*/

const DiningAccount = require('./DiningAccount');
const RewardsDiningAccount = require('./RewardsDiningAccount');

console.log("========================================");
console.log("       STANDARD DINING ACCOUNT          ");
console.log("========================================");

// 1. Create a DiningAccount with opening balance K1,000.00
const standardAccount = new DiningAccount("DA001", 1000);
console.log("Account Number: DA001");
console.log("Opening Balance: K1000.00");

// 2. Deposit K500.00
standardAccount.deposit(500, "Weekly meal allowance");
console.log("Deposit: K500.00");

// 3. Pay K200.00 for a meal
console.log("Meal Payment: K200.00");
process.stdout.write("Payment Status: ");
standardAccount.payForMeal(200, "Dinner payment");

// 4. Display final balance
console.log(`Final Balance: K${standardAccount.getBalance().toFixed(2)}`);

console.log("\n========================================");
console.log("        REWARDS DINING ACCOUNT          ");
console.log("========================================");

// 5. Create RewardsDiningAccount (Opening balance K1,500.00, 2.5% rate)
const rewardsAccount = new RewardsDiningAccount("RA001", 1500, 2.5);
console.log("Account Number: RA001");

// Deposit K500.00
rewardsAccount.deposit(500);
console.log(`Balance Before Reward: K${rewardsAccount.getBalance().toFixed(2)}`);
console.log("Reward Rate: 2.5%");

// Calculate and apply reward
const rewardEarned = rewardsAccount.calculateReward();
console.log(`Reward Earned: K${rewardEarned.toFixed(2)}`);
rewardsAccount.applyReward();

// Display final balance
console.log(`Final Balance: K${rewardsAccount.getBalance().toFixed(2)}`);
console.log("========================================");