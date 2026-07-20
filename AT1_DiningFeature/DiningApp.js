// Import the MealBooking class from MealBooking class
const MealBooking = require("./MealBooking");

console.log("--- Welcome to DWU Dining Services ---\n");

// Create a MealBooking object
const studentBooking = new MealBooking(
    "STU240156",
    "Alex Kain",
    "2026-07-21",
    "Dinner",
    2,
    "No seafood"
);

// Call the object's methods & Display the booking summary and calculated total
console.log(studentBooking.getSummary());

console.log("\n--------------------------------------");
console.log("Processing updates...");

// Demonstration
studentBooking.bookingStatus = "Confirmed";
console.log(`Updated Status: ${studentBooking.bookingStatus}`);