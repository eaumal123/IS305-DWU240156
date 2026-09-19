/*
  Program: Dining Meal Booking Console App
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 20 July 2026
*/

import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { MealBooking } from './MealBooking.js';

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
        // Step 1: Prompt user inputs for Student details
        const studentId = await rl.question("Enter Student ID: ");
        const studentName = await rl.question("Enter Full Name: ");

        // Step 2: Prompt user inputs for Meal details
        const mealDate = await rl.question("Enter Meal Date (e.g. 2026-07-20): ");
        const mealType = await rl.question("Enter Meal Type (Breakfast, Lunch, Dinner): ");
        const quantity = await rl.question("Enter Quantity: ");
        const dietaryNote = await rl.question("Enter Dietary Note (Optional): ");

        // Step 3: Prevent duplicate booking
        if (isDuplicateBooking(studentId, mealDate, mealType)) {
            throw new Error("Duplicate booking detected! A booking with this Student ID, Date, and Meal Type already exists.");            
        }

        // Step 4: Instantiate MealBooking object (runs class constructor validation)
        const studentBooking = new MealBooking(
            studentId,
            studentName,
            mealDate,
            mealType,
            quantity,
            dietaryNote
        );

        // Step 5: Store in the bookings array
        bookings.push(studentBooking);
    }
}