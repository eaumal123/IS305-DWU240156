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

}
module.exports = MealBooking;