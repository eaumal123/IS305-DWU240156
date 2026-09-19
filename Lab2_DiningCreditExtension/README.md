# Dining Booking Credit Extension

## Student Information
* **Student Name:** EAU MALLEN
* **Student ID:** 240156

# GitHub Repository URL
* **Repository URL:** https://github.com/eaumal123/IS305-DWU240156.git

# Description
Lab2 is a Credit_Level extension of the Dining Meal Booking application from lab1. In the previous lab, the student information were all stored in one meal booking object only, thus, resulting in duplicate data whenever a student made multiple meal bookings.

In lab2, the design is upgraded by separating the responsibilities:
- A new Student class is introduced to hold individual student identity data.
- MealBooking class is updated so that it is connected directly to s Student object, rather than re-stroing student details.
- A student object cannow be linked to multiple MealBooking objects, demonstrating object composition and relationship management in JavaScript and Node.js.

# Run the Application
The application is executed in the terminal of the Visual Studio Code. When attempting to run the application, you make sure that you cd into the directory of the application (Lab2_DiningCreditExtension) - `cd Lab2_DiningCreditExtension`. In order to execute the application, run this line `node DiningApp.js` in the working directory.

# Key Requirements
- Ensure you have Node.js installed on your system.
- Make sure all required files (Student.js, MealBooking.js, DiningApp.js and README.md) are all located in the same working directory.

# Testing
## Test 1 - Valid Student Creation
--- Welcome to DWU Dining Services ---

--- Enter Student ID: S123 ---
--- Enter First Name: John ---
--- Enter Last Name: Doe ---
===========================
--- STUDENT DETAILS ---
===========================
--- Student ID: S123 ---
--- Student Name: John Doe ---
===========================

## Test 2 - Required Student Input
--- Welcome to DWU Dining Services ---

--- Enter Student ID: S123 ---
--- Enter First Name: --- 
--- Enter Last Name: --- 
===========================
--- STUDENT DETAILS ---
===========================
--- Student ID: S123 ---
--- Student Name: ---  
===========================
--- Enter Meal Date (e.g. 2026-07-12): 2026-09-15 ---
--- Enter Meal Type (Breakfast, Lunch, Dinner): Dinner ---
--- Enter Quantity: 2 ---
--- Enter Dietary Note (Optional): Extra protein ---

--- [ERROR] Student Name is required. ---

## Test 3 - Student and MealBooking Object Linked.
--- Welcome to DWU Dining Services ---

--- Enter Student ID: S123 ---
--- Enter First Name: John ---
--- Enter Last Name: Doe ---
===========================
--- STUDENT DETAILS ---
===========================
--- Student ID: S123 ---
--- Student Name: John Doe ---
===========================
--- Enter Meal Date (e.g. 2026-07-12): 2026-09-15 ---
--- Enter Meal Type (Breakfast, Lunch, Dinner): Dinner ---
--- Enter Quantity: 2 ---
--- Enter Dietary Note (Optional): Extra protein ---

========================================
             BOOKING RECEIPT            
========================================
--- Student Name : John Doe ---
--- Student ID   : S123 ---
--- Meal Date    : 2026-09-15 ---
--- Meal Type    : Dinner ---
--- Quantity     : 2 --- 
--- Dietary Note : Extra protein ---
--- Status       : Pending ---
----------------------------------------
--- Total Cost   : K40.00 ---
========================================

--------------------------------------
--- Processing status update... ---
--- Updated Status: Confirmed ---

# AI Tools
The lab was done with the assitance of AI, to create and debug the codes.

**AI Tool:** Google Gemini
**Use case:** Defining the purpose and role of `Getters & Setters`, structuring the code blocks and debugging.
**Validation:** The basic concept was understood well enough, that I was able to integrate and test the final work independently.  
