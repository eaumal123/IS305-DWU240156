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
}