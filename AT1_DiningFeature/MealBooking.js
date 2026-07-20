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

    constructor(studentId, studentName, mealDate, mealType, quantity, dietaryNote) {
        this.#studentId = studentId;
        this.#studentName = studentName;
        this.#mealDate = mealDate;
        this.#mealType = mealType;
        this.#quantity = quantity;
        this.#dietaryNote = dietaryNote;
        this.#bookingStatus = "Pending";
    }

    //Create appropriate getters and setters
    
    // Student ID
    get studentId() {
        return this.#studentId;
    }
    set studentId(value) {
        this.#studentId = value;
    }

    // Student Name
    get studentName() {
        return this.#studentName;
    }
    set studentName(value) {
        this.#studentName = value;
    }

    // Meal Date
    get mealDate() {
        return this.#mealDate;
    }
    set mealDate(value) {
        this.#mealDate = value;
    }

    // Meal Type
    get mealType() {
        return this.#mealType;
    }
    set mealType(value) {
        this.#mealType = value;
    }

    // Quantity
    get quantity() {
        return this.#quantity;
    }
    set quantity(value) {
        if (value > 0) {
            this.#quantity = value;
        } else {
            console.log("Quantity must be greater than 0.");
        }
    }

    // Dietary Note
    get dietaryNote() {
        return this.#dietaryNote;
    }
    set dietaryNote(value) {
        this.#dietaryNote = value;
    }

    // Booking Status
    get bookingStatus() {
        return this.#bookingStatus;
    }
    set bookingStatus(value) {
        this.#bookingStatus = value;
    }

  //Create a method named calculateTotal() adjusted to actual prices
    calculateTotal() {
        let mealPrice = 0.00;
        // Normalize string to lowercase to prevent matching errors (e.g., "breakfast" vs "Breakfast")
        const type = this.#mealType.toLowerCase();

        if (type.includes("breakfast")) {
            mealPrice = 10.00;
        } else if (type.includes("lunch")) {
            mealPrice = 15.00;
        } else if (type.includes("dinner")) {
            mealPrice = 20.00;
        } else {
            mealPrice = 0.00; // Default case if unmatched
        }

        return this.#quantity * mealPrice;
    }

    //Create a method named getSummary()
    getSummary() {
        return `Booking Summary:
- Student: ${this.#studentName} (${this.#studentId})
- Meal: ${this.#mealType} on ${this.#mealDate}
- Quantity: ${this.#quantity}
- Dietary Note: ${this.#dietaryNote || "None"}
- Status: ${this.#bookingStatus}
- Total Cost: K${this.calculateTotal().toFixed(2)}`;
    }
}

module.exports = MealBooking;