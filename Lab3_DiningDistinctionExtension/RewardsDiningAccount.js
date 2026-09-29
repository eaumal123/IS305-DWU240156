/*
  Program: Dining Meal Booking Console App
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 29/09/2026
*/

const DiningAccount = require('./DiningAccount');

class RewardsDiningAccount extends DiningAccount {
    // 1. Private field
    #rewardRate;

    // 2. Constructor chaining using super()
    constructor(accountNumber, openingBalance, rewardRate) {
        super(accountNumber, openingBalance);
        this.#rewardRate = rewardRate;
    }

    // 3. Calculate reward formula: balance * rate / 100
    calculateReward() {
        return (this.getBalance() * this.#rewardRate) / 100;
    }

    // 4. Apply reward and deposit it into the account balance
    applyReward() {
        const rewardAmount = this.calculateReward();
        if (rewardAmount > 0) {
            this.deposit(rewardAmount, "Reward Earned");
        }
        return rewardAmount;
    }
}

module.exports = RewardsDiningAccount;