# DWU Dining Services - Meal Booking System

## Student Information
* **Student Name:** EAU MALLEN  
* **Student ID:** STU240156  

## GitHub Repository
* **Repository URL:** https://github.com/eaumal123/IS305-DWU240156.git

---

## Program Description
This application is a console-based **Dining Meal Booking System** built using Object-Oriented Programming (OOP) principles in JavaScript (Node.js). The system allows students to create meal bookings while ensuring strict **data encapsulation** using private fields (`#`). 
The application automatically calculates the total cost of a booking based on the designated pricing structure for DWU Dining Services and includes data validation to reject invalid inputs (such as negative meal quantities).

---

## Submitted Files

File Name & Purpose
`MealBooking.js` - Contains the core blueprint `MealBooking` class. Defines the private fields, class constructor, getters/setters for encapsulation, and the business logic methods (`calculateTotal()` and `getSummary()`).
`DiningApp.js` - The main executable driver file. It imports the `MealBooking` class, instantiates booking objects, manipulates data via setters, and displays outputs to the console interface.
`README.md` - Provides documentation, file overviews, setup instructions, and testing summaries for the project. |

---

## How to Run the Program

### Execution Steps
1. Open your terminal or command prompt (or use the built-in terminal in VS Code: `Ctrl + \``).
2. Navigate to the directory containing your project files:
   ``bash
   cd <directory_name>
3. Run the command `node DiningApp.js`. 

## Demonstration
### Test 1 - Valid Booking Creation.
```
Enter Student ID: DWU240156
Enter Full Name: Mary Thomas
Enter Meal Date (e.g. 2026-07-20): 2026-07-09
Enter Meal Type (Breakfast, Lunch, Dinner): Dinner
Enter Quantity: 2
Enter Dietary Note (Optional): Extra protein

========================================
             BOOKING SUMMARY            
========================================
Student Name : Mary Thomas
Student ID   : DWU240156
Meal Date    : 2026-07-09
Meal Type    : Dinner
Quantity     : 2
Dietary Note : Extra protein
Status       : Pending
----------------------------------------
Total Cost   : K40.00
========================================

--------------------------------------
Processing status update...
Updated Booking Status: Confirmed
```
### Test 2 - Invalid Booking Check
```
--- Welcome to DWU Dining Services ---

Enter Student ID: DWU231056
Enter Full Name: Samuel Paul
Enter Meal Date (e.g. 2026-07-20): 2026-09-23
Enter Meal Type (Breakfast, Lunch, Dinner): Special lunch
Enter Quantity: 1
Enter Dietary Note (Optional): No veggies

[ERROR] Invalid meal type. Allowed types are: Breakfast, Lunch, or Dinner.
```
### Test 3 - 