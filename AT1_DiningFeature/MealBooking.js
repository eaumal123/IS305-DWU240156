/*
  Program: Dining Meal Booking Feature
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 20 July 2026
  Description: A JavaScript program demonstrating classes,
  objects, constructors, private fields and methods.
*/

export class MealBooking {
    #studentId;
    #studentName;
    #mealDate;
    #mealType;
    #quantity;
    #dietaryNote;
    #bookingStatus;

    constructor(studentId, studentName, mealDate, mealType, quantity, dietaryNote = "") {
        // Validation for missing required values
        if (!studentId || !studentId.trim()) throw new Error("Student ID is required.");
        if (!studentName || !studentName.trim()) throw new Error("Student Name is required.");
        if (!mealDate || !mealDate.trim()) throw new Error("Meal Date is required.");

        // Normalize and validate meal type
        const formattedMealType = MealBooking.formatMealType(mealType);
        if (!["Breakfast", "Lunch", "Dinner"].includes(formattedMealType)) {
            throw new Error("Invalid meal type. Allowed types are: Breakfast, Lunch, or Dinner.");
        }

        // Validate quantity
        const numQuantity = Number(quantity);
        if (isNaN(numQuantity) || numQuantity < 1) {
            throw new Error("Quantity must be a number equal to 1 or greater.");
        }

        this.#studentId = studentId.trim();
        this.#studentName = studentName.trim();
        this.#mealDate = mealDate.trim();
        this.#mealType = formattedMealType;
        this.#quantity = numQuantity;
        this.#dietaryNote = dietaryNote.trim() || "None";
        this.#bookingStatus = "Pending";
    }

    // Helper method to standardize meal type formatting
    static formatMealType(type) {
        if (!type || typeof type !== 'string') return "";
        const clean = type.trim().toLowerCase();
        return clean.charAt(0).toUpperCase() + clean.slice(1);
    }