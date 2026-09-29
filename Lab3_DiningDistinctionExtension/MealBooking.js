/*
  Program: Dining Meal Booking Feature
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 20 July 2026
  Description: A JavaScript program demonstrating classes,
  objects, constructors, private fields and methods.
*/

class MealBooking {
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

    // Getters
    get studentId() { return this.#studentId; }
    get studentName() { return this.#studentName; }
    get mealDate() { return this.#mealDate; }
    get mealType() { return this.#mealType; }
    get quantity() { return this.#quantity; }
    get dietaryNote() { return this.#dietaryNote; }
    get bookingStatus() { return this.#bookingStatus; }

    // Controlled Status Methods
    confirmBooking() {
        this.#bookingStatus = "Confirmed";
    }

    cancelBooking() {
        this.#bookingStatus = "Cancelled";
    }

    // Calculate Total Cost (meal price x quantity)
    calculateTotal() {
        let mealPrice = 0.00;
        if (this.#mealType === "Breakfast") mealPrice = 10.00;
        else if (this.#mealType === "Lunch") mealPrice = 15.00;
        else if (this.#mealType === "Dinner") mealPrice = 20.00;

        return this.#quantity * mealPrice;
    }

    // Receipt display
    getReceipt() {
        return `
========================================
             BOOKING RECEIPT            
========================================
Student Name : ${this.#studentName}
Student ID   : ${this.#studentId}
Meal Date    : ${this.#mealDate}
Meal Type    : ${this.#mealType}
Quantity     : ${this.#quantity}
Dietary Note : ${this.#dietaryNote}
Status       : ${this.#bookingStatus}
----------------------------------------
Total Cost   : K${this.calculateTotal().toFixed(2)}
========================================`;
    }
}

module.exports = MealBooking;