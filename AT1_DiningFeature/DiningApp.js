/*
  Program: Dining Meal Booking Console App
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 20 July 2026
*/

const readline = require("readline/promises");
const { stdin: input, stdout: output } = require("process");
const MealBooking = require("./MealBooking");

console.log("--- Welcome to DWU Dining Services ---\n");

// Array to store created MealBooking objects
const bookings = [];

/**
 * Checks if a booking already exists for the same student ID, meal date, and meal type.
 */
function isDuplicateBooking(studentId, mealDate, mealType) {
    const formattedType = MealBooking.formatMealType ? MealBooking.formatMealType(mealType) : mealType.trim();
    return bookings.some(b => 
        b.studentId.toLowerCase() === studentId.trim().toLowerCase() &&
        b.mealDate.trim().toLowerCase() === mealDate.trim().toLowerCase() &&
        b.mealType.toLowerCase() === formattedType.toLowerCase()
    );
}

async function runDiningApp() {
    const rl = readline.createInterface({ input, output });

    try {
        // Step 1: Prompt user inputs
        const studentId = await rl.question("Enter Student ID: ");
        const studentName = await rl.question("Enter Student Name: ");
        const mealDate = await rl.question("Enter Meal Date (e.g. 2026-07-21): ");
        const mealType = await rl.question("Enter Meal Type (Breakfast, Lunch, Dinner): ");
        const quantity = await rl.question("Enter Quantity: ");
        const dietaryNote = await rl.question("Enter Dietary Note (optional): ");

        // Step 2: Prevent duplicate booking check
        if (isDuplicateBooking(studentId, mealDate, mealType)) {
            throw new Error("Duplicate booking detected! A booking with this Student ID, Date, and Meal Type already exists.");
        }

        // Step 3: Instantiate MealBooking object (runs validations)
        const studentBooking = new MealBooking(
            studentId,
            studentName,
            mealDate,
            mealType,
            quantity,
            dietaryNote
        );

        // Step 4: Store in the array
        bookings.push(studentBooking);

        // Step 5: Display clear receipt
        console.log(studentBooking.getReceipt());

        // Step 6: Controlled method updates demonstration
        console.log("\n--------------------------------------");
        console.log("Processing status update...");
        studentBooking.confirmBooking(); 
        console.log(`Updated Status: ${studentBooking.bookingStatus}`);

    } catch (error) {
        // Display clear error message without crashing
        console.error(`\n[ERROR] ${error.message}`);
    } finally {
        rl.close();
    }
}

// Run the application
runDiningApp();