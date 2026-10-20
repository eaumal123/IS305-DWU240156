# Project Title: Campus Service Request Management System.

## PROJECT OVERVIEW
The project Campus Service Request Management System, is a JavaScript console-based application build upon the foundation of the unit IS305 Object Orientated Programming (OOP). This project aims to help students and staff of Divine Word University, in terms of reporting several campus-related issues; ICT Services, Facilitites Maintenance, Cleaning and Sanitation and General Campus Service. All these are requested via a prototype terminal, which users - Staff & Students can have access to.

## PROBLEM STATEMENT
### Current context
At Divine Word University, students and staff encounter daily operational issues ranging from network downtime, sanitation needs, broken equipment, transport service(General Campus Service) and so forth.

### Core problem
The current process handles requests manually across all different catoegories. These services are requested via telephone calls, emails, verbal communication and hand-written. Because all these are communicated through infomral channels:
*requests are lost, forgotten or destroyed
*important details (location, issue category) are ommited or left out
*requesters have no clear way to track their requests

### Proposed solution
The proposed solution is a centralized console-based Node.js application built using Object-Oriented Programming (OOP) principles. The project will digitize request submissions, automates request tracking, status workflow and persists service records using local JSON files - providing a transparent and traceable workflow from submission to resolution.

## OBJECTIVES
### General Objective
To design and develop an object-oriented, console-based Campus Service Request Management System in JavaScript (Node.js) that centralizes, tracks, and manages the lifecycle of campus service requests.

### Specific Objectives
Core Application Setup (Pass Milestone): Implement core classes (User, ServiceRequest, ServiceRequestManager) to handle user registration, input validation, request creation, and cancellation using JavaScript arrays and console menus.

Specialized Classes & Role Workflows (Credit Milestone): Apply class inheritance and constructor chaining to create specialized request categories and role-specific interfaces (Requester, Service Officer, Technician, System Administrator).

Data Persistence & Reporting (Distinction Milestone): Utilize polymorphism, abstraction, and Node.js file system modules (fs/promises) to save and restore application state via JSON files and generate management audit reports.

Documentation & Version Control: Maintain sustained version control tracking via GitHub and document system design and setup in README.md.

## SCOPE
### 1. Core Application & Base Features (Pass Level)

+ User & Request Modelling
Object-oriented User and base ServiceRequest classes with data encapsulation and input validation.

+ In-Memory Management
ServiceRequestManager class to store, manage and query requests in an array collection.

+ Interactive Terminal CLI
A terminal-based menu loop allowing users to create, search, update and cancel requests.

### 2. Domain Hierarchy & Role Workflows (Credit Level)

+ Inheritance & Subclasses
Concrete specialized classes (ICTSupportRequest, MaintenanceRequest, CleaningRequest...etc) extending the base request class.

+ Role-Based Access Control (RBAC)
Permission checks for Student/Staff (Requesters), Technicians and Admins.

+ Workflow Management
Controlled status state transitions, technician assignement workflows and history tracking.

### 3. Advanced Architecture, Persistence & Testing (Distinction level)

+ Abstraction & Polymorphism
Abstract-style base class forcusing subclasses to override methods (calculatePriorityScore(), getTargetResolutionHours(), getRequestSummary() ).

+ JSON File Repositories
Asynchronous file persistence using Nodejs fs/promises across 4 JSON storage files (uers.json, serviceRequests.json, requestHistory.json, auditing.json) separated via Repository pattern classes.

+ Object Hydration
ServiceRequestFactory to reconnect fully typed, active object instances from loaded plain JSON data.

+ Auditing & Reporting
Automated event logging engine and a management reporting module delivering key metrics via JavaScript array methods (filter, map, reudce, sort)

+ Automated Testing
Test suit (>=10 tests) using native Node.js test runner for constructor validation, permission, polymorphism, file storage and reporting logic.

## ❌ OUT OF SCOPE

+ External Database
SQL (MySQL, PostgreSQL, SQLite) or NoSQL (MongoDB/Mongoose) databases.

+ Graphical User Interface
Web frontends (HTML/CSS, React) or desktop GUI frameworks.

+ Third-Party Libraries
External ORMs or third-party testing libraries.

## PASS EXTENSION (Core Service Request System)
### Actors and User Roles
Requester (Student / Staff): Registers a user account, submits service requests under allowed categories and priority levels, searches records, updates personal requests, and cancels active submissions.

### Functional Requirement
* User account registration with validation for unique user IDs and correct data formats.

* Service request creation linked to a registered user, specifying a category (ICT Support, Facilities Maintenance, Cleaning and Sanitation, General Campus Service) and priority level (Low, Normal, High, Urgent).

* Querying requests by unique ID, filtering by user ID, or listing all system requests.

* Updating and canceling active requests with proper ownership verification.

### Non-Functional Requirement
Reliability: Comprehensive try...catch error handling to catch invalid inputs and prevent application crashes.

Maintainability: Modular separation of concerns across dedicated class files (User.js, ServiceRequest.js, ServiceRequestManager.js, and CampusServiceApp.js).

### Assumptions and Limitations
* Runs locally within a Node.js terminal environment.

* Data persistence is handled in-memory using JavaScript arrays during runtime.

### User Stories
1. As a student, I want to register an account with my user details so I can submit tickets.

2. As a staff member, I want to submit a service request specifying a category and priority so the issue can be logged.

3. As a requester, I want to view a specific request by its ID to check its details.

4. As a requester, I want to view all requests I have submitted so I can track my active tickets.

5. As a user, I want to view all requests currently recorded in the system.

6. As a requester, I want to update my request details if information changes.

7. As a requester, I want to cancel my request if the issue is resolved.

8. As a user, I want clear error messages if I enter invalid data or attempt unauthorized actions.

### UML System Design
Class Relationships:
* ServiceRequestManager manages a collection (array) of User objects and ServiceRequest objects via      composition/aggregation.
* ServiceRequest holds an association reference to the User instance acting as the requester.

### Technical Documentation

#### Folder structure
AT3_CampusServiceRequestSystem/
├── src/
│   ├── CampusServiceApp.js        # Main terminal CLI menu and controller
│   ├── ServiceRequest.js          # Base request model and validation
│   ├── ServiceRequestManager.js   # In-memory collection manager and query engine
│   └── User.js                    # User model with strict encapsulation
└── README.md                      # Complete project documentation

#### Class responsibilities
User.js: Encapsulates user attributes (userId, firstName, lastName, email, userType).

ServiceRequest.js: Encapsulates ticket details (requestId, requester, title, description, campusLocation, category, priority, status).

ServiceRequestManager.js: Handles array collections, user registration, duplicate checks, search filters, updates, and cancellations.

CampusServiceApp.js: Runs the interactive Node.js readline terminal menu.

Encapsulation: Private properties (prefixed with #) are protected from direct external modification and accessed strictly through getters and validating setters.

Validation & Error Handling: Invalid data entries or unauthorized updates throw standard Error instances that are safely caught in try...catch blocks within the CLI.

### User Guide
Installation Requirements: Ensure Node.js is installed on your system.

Setup Instructions: Open the AT3_CampusServiceRequestSystem folder in VS Code.

Starting the application:
node src/CampusServiceApp.js

Console Navigation: Use numbers 1 through 10 from the main menu to register users, submit requests, view records, update details, or cancel tickets.

### Test Report (Pass Level)
Test 1 – Valid User Registration
Field	Details
Test ID:	T1
Purpose:	To confirm that a user with valid details can be registered in the system.
Menu Option:	1. Register User
Expected Result:	The user is added successfully.
Actual Result:	The system displayed “Success: User registered successfully.”
Status:	Pass
```
============================================
     CAMPUS SERVICE REQUEST SYSTEM
============================================
1. Register User
2. Submit Service Request
3. View Request by ID
4. View My Requests
5. View All Requests
6. Update My Request
7. Cancel My Request
8. Search Requests
9. View Request Summary
10. Exit
============================================
Select an option (1-10): 1
Enter User ID: 240156
Enter First Name: Mary
Enter Last Name: Kala
Enter Email Address: maryk@gmail.com
Enter User Type (e.g. Student/Staff): Student

Success: User registered successfully.
```
Test 2 - Duplicate User ID
Field	Details
Test ID:	T2
Feature tested: Duplicate user ID
Test input:	Register User with ID 240156 (Mary Kala, maryk@gmail.com, Student), after 240156 was already registered
Expected result:	Second user is rejected.
Actual result	Error: Duplicate user ID: User with ID '240156' already exists.
Status:	Pass
Evidence:	duplicate.png (re-take after the fix)
```
============================================
     CAMPUS SERVICE REQUEST SYSTEM
============================================
1. Register User
2. Submit Service Request
3. View Request by ID
4. View My Requests
5. View All Requests
6. Update My Request
7. Cancel My Request
8. Search Requests
9. View Request Summary
10. Exit
============================================
Select an option (1-10): 1
Enter User ID: 240156
Enter First Name: Mary
Enter Last Name: Kala
Enter Email Address: maryk@gmail.com
Enter User Type (e.g. Student/Staff): Student

Error: Duplicate user ID: User with ID 'undefined' already exists.

```

Test 3: Valid Request Submission
Field	Details
Test ID	T3 (Attempt 1)
Feature tested:	Valid request submission
Test input:	User 240156; Request ID Req-001; Title: Electrical; Description: Room study lights need fixing.; Location: Girls dormitory.; Category: 2; Priority: Moderate
Expected result:	Request is stored with Submitted status.
Actual result	Error: Unsupported category: 2
Status:	Fail
Cause and fix:	The numbered category menu passed "2" through as text. CampusServiceApp.js now converts the number to the category name. The priority Moderate was also invalid, because only Low, Normal, High and Urgent are allowed.

Test 3 - 2nd Attempt
```
============================================
     CAMPUS SERVICE REQUEST SYSTEM
============================================
1. Register User
2. Submit Service Request
3. View Request by ID
4. View My Requests
5. View All Requests
6. Update My Request
7. Cancel My Request
8. Search Requests
9. View Request Summary
10. Exit
============================================
Select an option (1-10): 2
Enter Requester User ID: 240156
Enter Request ID: Req-001
Enter Title: Broken study lights
Enter Description: Study lights at the dormitory is broken.
Enter Campus Location: Girls Dormitory
Allowed Categories: 1. ICT Support | 2. Facilities Maintenance | 3. Cleaning and Sanitation | 4. General Campus Service
Enter Category: 2
Allowed Priorities: Low, Normal, High, Urgent
Enter Priority: Normal

Success: Service request submitted successfully with 'Submitted' status.
```

Test 4 - Invalid Request Category
```
============================================
     CAMPUS SERVICE REQUEST SYSTEM
============================================
1. Register User
2. Submit Service Request
3. View Request by ID
4. View My Requests
5. View All Requests
6. Update My Request
7. Cancel My Request
8. Search Requests
9. View Request Summary
10. Exit
============================================
Select an option (1-10): 2
Enter Requester User ID: 240156
Enter Request ID: Req-001
Enter Title: Broken lights
Enter Description: Study lights at the dormitory is not working.
Enter Campus Location: Girls Dormitory
Allowed Categories: 1. ICT Support | 2. Facilities Maintenance | 3. Cleaning and Sanitation | 4. General Campus Service
Enter Category: 2
Allowed Priorities: Low, Normal, High, Urgent
Enter Priority: Moderate

Error: Unsupported priority value: Moderate
```
Test 5 - View Requester Records
```
============================================
     CAMPUS SERVICE REQUEST SYSTEM
============================================
1. Register User
2. Submit Service Request
3. View Request by ID
4. View My Requests
5. View All Requests
6. Update My Request
7. Cancel My Request
8. Search Requests
9. View Request Summary
10. Exit
============================================
Select an option (1-10): 4
Enter User ID to view requests for: 240156

--- Requests for User: 240156 ---
[ID: Req-001] Title: Broken study lights | Category: Facilities Maintenance | Priority: Normal | Status: Submitted | Requester: Mary Kala
```
```
============================================
     CAMPUS SERVICE REQUEST SYSTEM
============================================
1. Register User
2. Submit Service Request
3. View Request by ID
4. View My Requests
5. View All Requests
6. Update My Request
7. Cancel My Request
8. Search Requests
9. View Request Summary
10. Exit
============================================
Select an option (1-10): 4
Enter User ID to view requests for: 240157

--- Requests for User: 240157 ---
[ID: Req-002] Title: Wifi Down | Category: ICT Support | Priority: High | Status: Submitted | Requester: Tessa Paul
```

Test 6 - Cancel Request.
```
============================================
     CAMPUS SERVICE REQUEST SYSTEM
============================================
1. Register User
2. Submit Service Request
3. View Request by ID
4. View My Requests
5. View All Requests
6. Update My Request
7. Cancel My Request
8. Search Requests
9. View Request Summary
10. Exit
============================================
Select an option (1-10): 3
Enter Request ID to view: Req-001

[ID: Req-001] Title: Broken study lights | Category: Facilities Maintenance | Priority: Normal | Status: Submitted | Requester: Mary Kala
Description: Study lights at the dormitory is broken.
Location: Girls Dormitory
Submitted: Mon Oct 19 2026 11:22:35 GMT+1000 (Papua New Guinea Time) | Updated: Mon Oct 19 2026 11:22:35 GMT+1000 (Papua New Guinea Time)

============================================
     CAMPUS SERVICE REQUEST SYSTEM
============================================
1. Register User
2. Submit Service Request
3. View Request by ID
4. View My Requests
5. View All Requests
6. Update My Request
7. Cancel My Request
8. Search Requests
9. View Request Summary
10. Exit
============================================
Select an option (1-10): 7
Enter Request ID to cancel: Req-001
Enter Your User ID (Owner verification): 240156

Success: Request has been cancelled.
```

## CREDIT EXTENSION

