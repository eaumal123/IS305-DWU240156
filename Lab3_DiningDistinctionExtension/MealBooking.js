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
    #isPaid;

    constructor(studentId, studentName, mealDate, mealType, quantity, dietaryNote = "") {
        if (!studentId || !studentId.trim()) throw new Error("Student ID is required.");
        if (!studentName || !studentName.trim()) throw new Error("Student Name is required.");
        if (!mealDate || !mealDate.trim()) throw new Error("Meal Date is required.");

        const formattedMealType = MealBooking.formatMealType(mealType);
        if (!["Breakfast", "Lunch", "Dinner"].includes(formattedMealType)) {
            throw new Error("Invalid meal type. Allowed types are: Breakfast, Lunch, or Dinner.");
        }

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
        this.#isPaid = false;
    }

    static formatMealType(type) {
        if (!type || typeof type !== 'string') return "";
        const clean = type.trim().toLowerCase();
        return clean.charAt(0).toUpperCase() + clean.slice(1);
    }

    // Property Getters
    get studentId() { return this.#studentId; }
    get studentName() { return this.#studentName; }
    get mealDate() { return this.#mealDate; }
    get mealType() { return this.#mealType; }
    get quantity() { return this.#quantity; }
    get dietaryNote() { return this.#dietaryNote; }
    get bookingStatus() { return this.#bookingStatus; }

    // Method Getters for DiningApp compatibility
    getMealType() { return this.#mealType; }
    getQuantity() { return this.#quantity; }
    getStatus() { return this.#bookingStatus; }

    confirmBooking() {
        this.#bookingStatus = "Confirmed";
    }

    cancelBooking() {
        this.#bookingStatus = "Cancelled";
    }

    calculateTotal() {
        let mealPrice = 0.00;
        if (this.#mealType === "Breakfast") mealPrice = 10.00;
        else if (this.#mealType === "Lunch") mealPrice = 15.00;
        else if (this.#mealType === "Dinner") mealPrice = 20.00;

        return this.#quantity * mealPrice;
    }

    calculateTotalCost() {
        return this.calculateTotal();
    }

   processPayment(diningAccount) {
        if (this.#isPaid) {
            console.log("Error: This booking has already been paid for.");
            return false;
        }

        const cost = this.calculateTotalCost();
        const paymentSuccessful = diningAccount.payForMeal(cost, `${this.#mealType} Booking`);

        if (paymentSuccessful) {
            this.#isPaid = true;
            this.#bookingStatus = "Confirmed";
        } else {
            this.#bookingStatus = "Pending";
        }

        return paymentSuccessful;
    }

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