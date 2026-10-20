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
## CREDIT EXTENSION (Specialised Requests and Role Workflows)

The Credit extension builds on the Pass system. It adds user and request inheritance, constructor chaining, specialised request types, a controlled status workflow with role permissions, search, filter and sort, and a request history.

---

# 1. Actors and User Roles

The system has four actors. Each is a registered user, and each role is a subclass of the `User` base class.

| Actor | Class | User type value | Specialised fields | Responsibility |
|---|---|---|---|---|
| Student Requester | `StudentRequester` | `Student` | Programme, year level | Submits service requests and manages their own requests |
| Staff Requester | `StaffRequester` | `Staff` | Department | Submits service requests and manages their own requests |
| Service Officer | `ServiceOfficer` | `Service Officer` | Service section | Reviews requests, assigns priority, assigns a Technician, and verifies and closes resolved requests |
| Technician | `Technician` | `Technician` | Technical speciality | Carries out the assigned work: starts it, records progress and resolves it |

**Role permissions**

| Action | Menu option | Student / Staff Requester | Service Officer | Technician |
|---|---|---|---|---|
| Register a user | 1 | Yes | Yes | Yes |
| Submit a service request | 2 | Yes | – | – |
| Update a request | 6 | Own request, while Submitted | – | – |
| Cancel a request | 7 | Own request, while Submitted | – | – |
| Review a request | 10 | – | Yes | – |
| Assign a priority | 11 | – | Yes | – |
| Assign a Technician | 12 | – | Yes | – |
| Start work | 13 | – | – | Only if assigned to the request |
| Record progress | 14 | – | – | Only if assigned to the request |
| Resolve a request | 15 | – | – | Only if assigned to the request |
| Close a request | 16 | – | Yes (Resolved requests only) | – |
| View, search, filter, sort and view history | 3, 4, 5, 8, 9, 17, 18, 19 | Yes | Yes | Yes |

**Notes**
- The system has no login. A user identifies themselves by entering their user ID, and the system checks that ID against the user's registered role.
- A requester can update or cancel a request only if their ID matches the requester stored on that request, and only while its status is Submitted.
- A Technician can work only on requests assigned to them by a Service Officer.
- Requests are intended to be submitted by Student and Staff users. The system does not currently stop a Service Officer or Technician from submitting one.

---

# 2. Functional Requirements

| ID | Requirement |
|---|---|
| FR1 | The system shall provide `User` as a base class, with `StudentRequester`, `StaffRequester`, `ServiceOfficer` and `Technician` as subclasses. Every subclass shall call the `User` constructor using `super()`. |
| FR2 | The system shall provide `ServiceRequest` as a base class, with `ICTSupportRequest`, `MaintenanceRequest` and `CleaningRequest` as subclasses. Every subclass shall call the `ServiceRequest` constructor using `super()`. |
| FR3 | Each specialised request shall validate its own fields: ICT (device type, system name, fault type, network impact), Maintenance (building, room number, hazard level, equipment affected), Cleaning (cleaning area, hygiene risk, service type, preferred service time). |
| FR4 | The system shall enforce the status flow Submitted → Reviewed → Assigned → In Progress → Resolved → Closed. Cancelled is a final status. Invalid transitions shall be rejected. |
| FR5 | A requester may update only their own Submitted request. |
| FR6 | A requester may cancel only their own Submitted request. |
| FR7 | Only a Service Officer may review a request. |
| FR8 | Only a Service Officer may assign a priority, and a priority must be assigned before a Technician can be assigned. |
| FR9 | Only a Service Officer may assign a Technician, and the assignee must be a Technician. |
| FR10 | Only the assigned Technician may start work, record progress or resolve the request. |
| FR11 | Only a Service Officer may close a Resolved request. |
| FR12 | At least two methods shall be overridden in the specialised request classes. |
| FR13 | The system shall search requests by request ID or title. |
| FR14 | The system shall filter requests by category, status, priority and assigned Technician. |
| FR15 | The system shall sort requests by date submitted and by priority. |
| FR16 | Every request shall keep a history of each approved action with previous status, new status, action, actor ID and role, comment, and date and time. |
| FR17 | The system shall show the number of requests in each status. |
| FR18 | The Pass functions (register users, submit, view, update, cancel, search and summary) shall continue to work. |

---

# 3. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR1 | **Encapsulation:** class data is held in private fields (`#`) and changed only through getters, validated setters and methods. |
| NFR2 | **Data integrity:** invalid input or an unauthorised action is rejected with a clear message. A rejected update changes nothing. |
| NFR3 | **Maintainability:** each class has one responsibility, and the permitted status transitions are held in a single table (`ServiceRequest.TRANSITIONS`). |
| NFR4 | **Auditability:** every approved status change or workflow action is written to the request history. Rejected actions are not recorded. |
| NFR5 | **Usability:** the console menu is numbered, prompts show the allowed values, and error messages say what went wrong. |
| NFR6 | **Testability:** all Credit behaviour can be checked by an automated test file without using the menu. |
| NFR7 | **Portability:** the application runs on Node.js 14.6 or later with no extra packages. |
| NFR8 | **Compatibility:** the Credit extension keeps the Pass method names and menu options 1 to 9. |

---

# 4. Assumptions and Limitations

**Assumptions**
- Users are registered before they submit or process requests, and user IDs and request IDs are unique.
- Student and Staff users submit requests.
- Service Officers and Technicians are registered through the same Register User option as other users.
- The requester enters a starting priority. The Service Officer then assigns the official priority during review.
- A request is handled by one Technician.
- Request IDs and user IDs must be entered exactly as registered. Leading and trailing spaces are ignored.

**Limitations**
- Data is held in memory and is lost when the application closes. The `data` folder is reserved for later storage, but JSON storage is not implemented at the Credit level.
- There is no login or password. Identity is the user ID entered.
- The system does not stop a Service Officer or Technician from submitting a request.
- Technician reassignment is not supported.
- Closed and Cancelled requests cannot be reopened.
- The category of a specialised request cannot be changed after it is submitted.
- Search covers request ID and title only.
- The console application does not remember who is "logged in", so the user ID is asked for each action.

---

# 5. User Stories

| ID | User story |
|---|---|
| US1 | As a **student**, I want to submit an ICT support request with device and fault details so that the right team can fix my problem. |
| US2 | As a **staff member**, I want to report a maintenance hazard with the building, room and equipment so that it is handled safely. |
| US3 | As a **requester**, I want to report a cleaning problem with the area and hygiene risk so that it is cleaned in time. |
| US4 | As a **requester**, I want to update my request while it is still Submitted so that I can correct mistakes. |
| US5 | As a **requester**, I want to cancel my own Submitted request so that no work is done if I no longer need it. |
| US6 | As a **Service Officer**, I want to review a request and assign its priority so that urgent problems are handled first. |
| US7 | As a **Service Officer**, I want to assign a Technician so that the work has a clear owner. |
| US8 | As a **Technician**, I want to start work and record progress updates so that everyone can see how the job is going. |
| US9 | As a **Technician**, I want to mark my assigned request as resolved so that it can be verified. |
| US10 | As a **Service Officer**, I want to verify and close a Resolved request so that finished work is formally completed. |
| US11 | As a **Service Officer**, I want to search, filter and sort requests so that I can find and prioritise work quickly. |
| US12 | As a **manager**, I want a full history of every request so that I can see who did what and when. |

---

# 6. UML System Design

The diagrams are written in Mermaid and render on GitHub and in most Markdown viewers. Export them as images if your submission needs picture files.

## 6.1 Use Case Diagram

```mermaid
flowchart LR
    REQ(["Student / Staff Requester"])
    OFF(["Service Officer"])
    TEC(["Technician"])

    subgraph SYS["Campus Service Request System"]
        UC1("Register user")
        UC2("Submit request")
        UC3("Update own Submitted request")
        UC4("Cancel own Submitted request")
        UC5("View and search requests")
        UC6("Review request")
        UC7("Assign priority")
        UC8("Assign Technician")
        UC9("Start work")
        UC10("Record progress")
        UC11("Resolve request")
        UC12("Verify and close request")
        UC13("Filter and sort requests")
        UC14("View status summary")
        UC15("View request history")
    end

    REQ --- UC1
    REQ --- UC2
    REQ --- UC3
    REQ --- UC4
    REQ --- UC5
    REQ --- UC15
    OFF --- UC1
    OFF --- UC5
    OFF --- UC6
    OFF --- UC7
    OFF --- UC8
    OFF --- UC12
    OFF --- UC13
    OFF --- UC14
    OFF --- UC15
    TEC --- UC1
    TEC --- UC5
    TEC --- UC9
    TEC --- UC10
    TEC --- UC11
    TEC --- UC15
```

## 6.2 Class Diagram

```mermaid
classDiagram
    class User {
        -userID
        -firstName
        -lastName
        -emailAddress
        -userType
        +getuserID() String
        +getuserType() String
        +getFullName() String
        +validate()
        +displayInfo()
    }
    class StudentRequester {
        -programme
        -yearLevel
        +getRoleDetails() String
    }
    class StaffRequester {
        -department
        +getRoleDetails() String
    }
    class ServiceOfficer {
        -serviceSection
        +getRoleDetails() String
    }
    class Technician {
        -speciality
        +getRoleDetails() String
    }

    class ServiceRequest {
        -requestID
        -requester
        -title
        -description
        -campusLocation
        -category
        -priority
        -status
        -dateSubmitted
        -dateUpdated
        -priorityAssigned
        -assignedTechnicianID
        -progressUpdates
        -history
        +validate()
        +validateSpecialisedFields() boolean
        +calculatePriorityScore() int
        +getTargetResolutionHours() int
        +getRequestSummary() String
        +updateDetails(userId, changes)
        +cancelRequest(userId)
        +review(officer)
        +assignPriority(officer, priority)
        +assignTechnician(officer, technician)
        +startWork(technician)
        +recordProgress(technician, note)
        +resolve(technician)
        +close(officer)
    }
    class ICTSupportRequest {
        -deviceType
        -systemName
        -faultType
        -networkImpact
        +validate()
        +validateSpecialisedFields() boolean
        +getRequestSummary() String
        +calculatePriorityScore() int
        +getTargetResolutionHours() int
        +updateDetails(userId, changes)
    }
    class MaintenanceRequest {
        -building
        -roomNumber
        -hazardLevel
        -equipmentAffected
        +validate()
        +validateSpecialisedFields() boolean
        +getRequestSummary() String
        +calculatePriorityScore() int
        +getTargetResolutionHours() int
        +updateDetails(userId, changes)
    }
    class CleaningRequest {
        -cleaningArea
        -hygieneRisk
        -serviceType
        -preferredServiceTime
        +validate()
        +validateSpecialisedFields() boolean
        +getRequestSummary() String
        +calculatePriorityScore() int
        +getTargetResolutionHours() int
        +updateDetails(userId, changes)
    }

    class ServiceRequestManager {
        +users
        +requests
        +registerUser(user)
        +findUserById(userId)
        +submitRequest(request)
        +findRequestById(requestId)
        +getRequestsByUser(userId)
        +getAllRequests()
        +updateRequest(requestId, userId, changes)
        +cancelRequest(requestId, userId)
        +searchRequests(text)
        +getRequestSummaryByStatus()
        +reviewRequest(requestId, officerId)
        +assignPriority(requestId, officerId, priority)
        +assignTechnician(requestId, officerId, technicianId)
        +startWork(requestId, technicianId)
        +recordProgress(requestId, technicianId, note)
        +resolveRequest(requestId, technicianId)
        +closeRequest(requestId, officerId)
        +filterRequests(criteria)
        +sortByDate(list, ascending)
        +sortByPriority(list, highestFirst)
    }

    User <|-- StudentRequester
    User <|-- StaffRequester
    User <|-- ServiceOfficer
    User <|-- Technician
    ServiceRequest <|-- ICTSupportRequest
    ServiceRequest <|-- MaintenanceRequest
    ServiceRequest <|-- CleaningRequest
    ServiceRequest "many" --> "1" User : requester
    ServiceRequestManager o-- "many" User : manages
    ServiceRequestManager o-- "many" ServiceRequest : manages
```

## 6.3 Sequence Diagram: Submitting a Request

```mermaid
sequenceDiagram
    actor Req as Requester
    participant App as CampusServiceApp
    participant Mgr as ServiceRequestManager
    participant ICT as ICTSupportRequest
    participant SR as ServiceRequest

    Req->>App: Choose option 2 and enter the request details
    App->>Mgr: findUserById(userId)
    Mgr-->>App: requester user
    App->>ICT: new ICTSupportRequest(commonData, specialisedData)
    ICT->>SR: super(requestID, requester, title, ..., category, priority)
    SR->>SR: store common fields, status = Submitted
    SR->>SR: write the first history entry
    SR-->>ICT: base object created
    ICT->>ICT: checkSpecialised(device, system, fault, network impact)
    ICT-->>App: request object
    App->>Mgr: submitRequest(request)
    Mgr->>ICT: validate()
    ICT->>SR: super.validate()
    ICT->>ICT: validateSpecialisedFields()
    Mgr->>Mgr: findRequestById (duplicate check)
    Mgr->>Mgr: store the request
    Mgr-->>App: success
    App-->>Req: Success message
    Note over ICT,Mgr: Any failed check throws an Error, nothing is stored, and the app prints the message
```

## 6.4 Sequence Diagram: Assigning a Technician

```mermaid
sequenceDiagram
    actor Off as Service Officer
    participant App as CampusServiceApp
    participant Mgr as ServiceRequestManager
    participant Req as ServiceRequest

    Off->>App: Option 10 (Review Request)
    App->>Mgr: reviewRequest(requestId, officerId, comment)
    Mgr->>Req: review(officer, comment)
    Req->>Req: role must be Service Officer
    Req->>Req: transition Submitted to Reviewed, log "Reviewed"
    Off->>App: Option 11 (Assign Priority)
    App->>Mgr: assignPriority(requestId, officerId, priority)
    Mgr->>Req: assignPriority(officer, priority)
    Req->>Req: status must be Reviewed and priority valid
    Req->>Req: priorityAssigned = true, log "Priority assigned"
    Off->>App: Option 12 (Assign Technician)
    App->>Mgr: assignTechnician(requestId, officerId, technicianId)
    Mgr->>Mgr: find the officer and the technician
    Mgr->>Req: assignTechnician(officer, technician)
    alt actor is not a Service Officer
        Req-->>Mgr: Error: Only a Service Officer can assign a Technician
    else assignee is not a Technician or no priority assigned
        Req-->>Mgr: Error
    else valid
        Req->>Req: transition Reviewed to Assigned, log "Technician assigned"
        Req->>Req: store assignedTechnicianID
        Req-->>Mgr: success
    end
    Mgr-->>App: success or error
    App-->>Off: Message
```

## 6.5 Sequence Diagram: Resolving and Closing a Request

```mermaid
sequenceDiagram
    actor Tec as Technician
    actor Off as Service Officer
    participant App as CampusServiceApp
    participant Mgr as ServiceRequestManager
    participant Req as ServiceRequest

    Tec->>App: Option 13 (Start Work)
    App->>Mgr: startWork(requestId, technicianId)
    Mgr->>Req: startWork(technician)
    Req->>Req: must be the assigned Technician
    Req->>Req: transition Assigned to In Progress, log
    Tec->>App: Option 14 (Record Progress)
    App->>Mgr: recordProgress(requestId, technicianId, note)
    Mgr->>Req: recordProgress(technician, note)
    Req->>Req: status must be In Progress, store note, log "Progress update"
    Tec->>App: Option 15 (Resolve Request)
    App->>Mgr: resolveRequest(requestId, technicianId)
    Mgr->>Req: resolve(technician)
    Req->>Req: transition In Progress to Resolved, log "Resolved"
    Off->>App: Option 16 (Close Request)
    App->>Mgr: closeRequest(requestId, officerId)
    Mgr->>Req: close(officer)
    alt actor is not a Service Officer or status is not Resolved
        Req-->>Mgr: Error
    else valid
        Req->>Req: transition Resolved to Closed, log "Closed"
    end
    Mgr-->>App: success or error
    App-->>Off: Message
```

## 6.6 Explanation of Class Relationships

- **Inheritance (is-a):** `StudentRequester`, `StaffRequester`, `ServiceOfficer` and `Technician` each extend `User`, so they share ID, name, email and type handling and add their own role-specific field. `ICTSupportRequest`, `MaintenanceRequest` and `CleaningRequest` each extend `ServiceRequest`, so they share the status, workflow and history logic and add their own specialised fields.
- **Association:** every `ServiceRequest` holds a reference to its requester, which is a `User` (a student or staff member). One user can have many requests, and each request has exactly one requester.
- **Aggregation:** `ServiceRequestManager` holds arrays of users and requests. It looks objects up and passes workflow actions to them, but the rules themselves live in the request classes.
- **Technician link:** a request stores the assigned Technician's ID (not the object), which keeps the request independent of the Technician class.
- **Dependency:** `CampusServiceApp` depends on the manager and on the request and user classes' public methods. It never touches private fields.

---

# 7. Technical Documentation

## 7.1 Encapsulation

- All class data is held in private `#` fields, for example `#status`, `#history` and `#assignedTechnicianID` in `ServiceRequest`, and `#deviceType` in `ICTSupportRequest`. Other code cannot read or change them directly.
- Public **getters** expose the data. `history` and `progressUpdates` return copies, so outside code cannot change the audit trail.
- **Setters are controlled.** `title`, `description`, `category` and `priority` in `ServiceRequest` check the new value before accepting it. There is no setter for `status`, so it can change only through the workflow methods.
- **Private methods** (`#transition`, `#log`, `#requireRole`, `#requireAssignedTechnician`) hold the internal rules and cannot be called from outside the class.
- `getAllRequests()` returns a copy of the request array, so callers cannot change the manager's list.

## 7.2 Inheritance and Constructor Chaining

- `StudentRequester`, `StaffRequester`, `ServiceOfficer` and `Technician` extend `User`.
- `ICTSupportRequest`, `MaintenanceRequest` and `CleaningRequest` extend `ServiceRequest`.
- Every subclass constructor calls its parent constructor first with `super()`:

```javascript
// SpecialisedUsers.js
class Technician extends User {
    constructor(userID, firstName, lastName, emailAddress, speciality) {
        super(userID, firstName, lastName, emailAddress, 'Technician');   // constructor chaining
        ...
    }
}

// SpecialisedRequests.js
class ICTSupportRequest extends ServiceRequest {
    constructor(commonRequestData, specialisedData = {}) {
        const c = commonRequestData;
        super(c.requestID, c.requester, c.title, c.description,
              c.campusLocation, 'ICT Support', c.priority);               // constructor chaining
        ICTSupportRequest.checkSpecialised(specialisedData);              // then validate the specialised fields
        ...
    }
}
```

The parent constructor sets the common data first, and the subclass then validates and stores its own fields. The subclass fixes the user type and the category, so they cannot be entered wrongly. `commonRequestData` is one object, and the subclass unpacks it into the base constructor's arguments.

## 7.3 Overriding and Polymorphism

**Method overriding**

| Method | Base version (`ServiceRequest`) | Specialised version |
|---|---|---|
| `getRequestSummary()` | Common summary line | Each subclass calls `super.getRequestSummary()` and adds its own fields |
| `calculatePriorityScore()` | Priority position (Low = 1 to Urgent = 4) | ICT adds 2 per network-impact level, Maintenance adds 3 per hazard level, Cleaning adds 2 per hygiene-risk level |
| `getTargetResolutionHours()` | 72 hours | ICT: 72 / 48 / 24 / 4 by impact. Maintenance: 120 / 48 / 8 by hazard. Cleaning: 48 / 24 / 6 by hygiene risk |
| `validateSpecialisedFields()` | Returns `true` | Each subclass checks its own fields |
| `validate()` | Checks the common fields | Each subclass calls `super.validate()` and then `validateSpecialisedFields()` |
| `updateDetails()` | Updates common fields | Each subclass also updates its own fields, validating before changing anything |

**Polymorphism.** The manager stores every request as a `ServiceRequest`. It calls `validate()`, `getRequestSummary()`, `calculatePriorityScore()` or `getTargetResolutionHours()` without knowing the request's type, and each object runs its own version:

```javascript
for (const request of manager.getAllRequests()) {
    console.log(request.getRequestSummary());   // ICT, Maintenance, Cleaning or General details appear automatically
}
```

## 7.4 How the Request Workflow Is Controlled

- The permitted flow is held in one table, `ServiceRequest.TRANSITIONS`:

| From | Allowed next status |
|---|---|
| Submitted | Reviewed, Cancelled |
| Reviewed | Assigned |
| Assigned | In Progress |
| In Progress | Resolved |
| Resolved | Closed |
| Closed | none (final) |
| Cancelled | none (final) |

- Every status change goes through one private method, `#transition()`. It rejects any move that is not in the table with `Invalid status transition: X -> Y`, and otherwise updates the status and writes the history entry.
- Role rules are checked before the transition:
  - Requesters: only the owner, and only while the request is Submitted, may update or cancel.
  - Only a Service Officer may review, assign a priority, assign a Technician or close.
  - Only the assigned Technician may start, record progress or resolve.
- A priority must be assigned by the Service Officer (while the request is Reviewed) before a Technician can be assigned.
- Because status has no setter and `#transition()` is private, the workflow cannot be bypassed.

## 7.5 How Validation and Errors Are Handled

- Validation uses `validate()` on users and requests and a static `checkSpecialised()` method in each specialised request. They throw an `Error` with a clear message when data is missing or unsupported.
- Updates are **validated before they are applied**, so a failed update changes nothing.
- Specialised constructors validate their own fields, so an invalid specialised request cannot be created.
- The manager adds system-level checks: duplicate user IDs, duplicate request IDs, unknown users and requests.
- Permission and workflow failures are also thrown as `Error`s.
- `CampusServiceApp.js` wraps each action in `try/catch` and prints `Error: <message>`, so the program keeps running after a mistake.
- Rejected actions are not written to the request history.

## 7.6 How JSON Data Is Stored and Restored

JSON file storage is **not part of the Credit level**. Users and requests are kept in memory arrays inside `ServiceRequestManager` and are lost when the application closes. The `data` folder is already in the project and is reserved for stored data in a later level.

## 7.7 How Tests Are Organised

All automated tests are in `src/CreditTests.js` and run with `node src/CreditTests.js`.

- A small `test(name, fn)` helper runs each test, prints `PASS` or `FAIL`, and sets a failing exit code if anything fails.
- A `setup()` function builds a fresh manager with a student, a staff member, a Service Officer and two Technicians for each test, so tests do not affect each other.
- Tests use Node's built-in `assert` module, so no packages are needed.
- There are 16 tests: 7 Pass tests (to confirm nothing broke), the 8 required Credit tests, and 1 extra check that only Service Officers can review and that a priority is needed before assignment.

## 7.8 Known Limitations and Future Improvements

**Known limitations**
- In-memory storage only, with no JSON file storage.
- No login or password.
- One Technician per request, with no reassignment.
- Closed and Cancelled requests cannot be reopened.
- Search covers request ID and title only.
- The manager's `users` and `requests` arrays are ordinary properties and are not private.
- A Service Officer or Technician can submit a request.

**Future improvements**
- Save and restore users and requests as JSON files in the `data` folder.
- Add login with password checking.
- Block non-requesters from submitting requests.
- Allow reassignment and reopening, with history entries.
- Add reports (by category, Technician workload, average resolution time) and overdue warnings using `getTargetResolutionHours()`.
- Make the manager's arrays private.

---

# 8. Folder Structure

```
AT3_CampusServiceRequestSystem/
├── data/                           Reserved for stored data (not used at Credit level)
├── src/
│   ├── User.js                     Base user class
│   ├── SpecialisedUsers.js         StudentRequester, StaffRequester, ServiceOfficer, Technician
│   ├── ServiceRequest.js           Base request class, workflow rules, role checks, history
│   ├── SpecialisedRequests.js      ICTSupportRequest, MaintenanceRequest, CleaningRequest
│   ├── ServiceRequestManager.js    Stores users and requests, search, filter, sort, summary
│   ├── CampusServiceApp.js         Console menu and user interaction
│   └── CreditTests.js              Automated Pass and Credit tests
├── .gitkeep
└── README.md                       This documentation
```

---

# 9. Class Responsibilities

| Class | File | Responsibility |
|---|---|---|
| `User` | `User.js` | Holds and validates common user data (ID, name, email, type). |
| `StudentRequester` | `SpecialisedUsers.js` | A `User` with programme and year level. Submits and manages their own requests. |
| `StaffRequester` | `SpecialisedUsers.js` | A `User` with a department. Submits and manages their own requests. |
| `ServiceOfficer` | `SpecialisedUsers.js` | A `User` with a service section. Reviews, assigns priority and Technician, and closes requests. |
| `Technician` | `SpecialisedUsers.js` | A `User` with a technical speciality. Starts, updates and resolves assigned work. |
| `ServiceRequest` | `ServiceRequest.js` | Holds common request data, controls the status workflow, enforces role permissions and records history. Also handles General Campus Service requests directly. |
| `ICTSupportRequest` | `SpecialisedRequests.js` | Adds device type, system name, fault type and network impact, with its own validation, summary, score and target hours. |
| `MaintenanceRequest` | `SpecialisedRequests.js` | Adds building, room number, hazard level and equipment affected, with its own validation, summary, score and target hours. |
| `CleaningRequest` | `SpecialisedRequests.js` | Adds cleaning area, hygiene risk, service type and preferred service time, with its own validation, summary, score and target hours. |
| `ServiceRequestManager` | `ServiceRequestManager.js` | Registers users, stores requests, finds users and requests, passes workflow actions to the request, and provides search, filter, sort and the status summary. |
| `CampusServiceApp` | `CampusServiceApp.js` | Shows the menu, reads input, calls the manager, and prints results or error messages. |
| Test file | `CreditTests.js` | Runs the automated Pass and Credit tests. |

---

# 10. User Guide

## 10.1 Installation Requirements

- Node.js **14.6 or later** (check with `node --version`).
- A terminal, such as the one in VS Code.
- No extra packages are needed.

## 10.2 Setup Instructions

1. Keep the project files in the folder layout shown in section 8.
2. Open a terminal in the project folder, `AT3_CampusServiceRequestSystem` (in VS Code: Terminal > New Terminal, then `cd AT3_CampusServiceRequestSystem`).
3. Confirm Node.js is installed: `node --version`.

## 10.3 Starting the Application

```
node src/CampusServiceApp.js
```

The menu appears. Options 1 to 9 are the Pass options and 10 to 19 are the Credit options:

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
--------------- Credit ---------------------
10. Review Request (Service Officer)
11. Assign Priority (Service Officer)
12. Assign Technician (Service Officer)
13. Start Work (Technician)
14. Record Progress (Technician)
15. Resolve Request (Technician)
16. Close Request (Service Officer)
17. Filter Requests
18. Sort Requests
19. View Request History
--------------------------------------------
20. Exit
============================================
```

To run the automated tests instead: `node src/CreditTests.js`

Data is kept only while the application is running. Register your users again each time you start it.

## 10.4 Registering or Selecting a User

Choose **1. Register User** and enter the user ID, first name, last name, email and user type. The app then asks for the details of that role:

| User type | Extra details asked |
|---|---|
| Student | Programme, year level (1 to 8) |
| Staff | Department |
| Service Officer | Service section |
| Technician | Technical speciality |

There is no login. Each later action asks for your user ID to identify you.

## 10.5 Submitting a Request

1. Choose **2. Submit Service Request**.
2. Enter your user ID (you must be registered), then a unique request ID, title, description and campus location.
3. Choose a category (1 to 4, or type the name) and a priority (Low, Normal, High or Urgent).
4. For categories 1 to 3, enter the specialised details:

| Category | Details asked |
|---|---|
| 1. ICT Support | Device type, system name, fault type, network impact (None / Single User / Department / Campus-wide) |
| 2. Facilities Maintenance | Building, room number, hazard level (Low / Medium / High), equipment affected |
| 3. Cleaning and Sanitation | Cleaning area, hygiene risk (Low / Medium / High), service type, preferred service time |
| 4. General Campus Service | None |

The request is stored with status **Submitted**. While it is still Submitted, the requester can use **6. Update My Request** (blank answers keep the current value) or **7. Cancel My Request**.

## 10.6 Assigning and Processing a Request

| Step | Menu option | Who | Action | Status after |
|---|---|---|---|---|
| 1 | 10 | Service Officer | Review the request | Reviewed |
| 2 | 11 | Service Officer | Assign a priority | Reviewed |
| 3 | 12 | Service Officer | Assign a Technician | Assigned |
| 4 | 13 | Assigned Technician | Start work | In Progress |
| 5 | 14 | Assigned Technician | Record progress (repeat as needed) | In Progress |
| 6 | 15 | Assigned Technician | Resolve the request | Resolved |
| 7 | 16 | Service Officer | Verify and close the request | Closed |

Each step asks for the acting user's ID and the request ID. A wrong user or a step out of order is rejected with an error message, and the request is not changed.

## 10.7 Searching, Filtering, Sorting and Reports

| Task | Menu option | How |
|---|---|---|
| View one request | 3 | Enter the request ID to see its details, assigned Technician, target hours and priority score. |
| View a user's requests | 4 | Enter the user ID. |
| View all requests | 5 | Lists every request. |
| Search | 8 | Enter part of a request ID or title (case does not matter). |
| Status report | 9 | Shows the number of requests in each status. |
| Filter | 17 | Answer the four questions: category, status, priority and Technician ID. Leave a question blank to skip it. Filters can be combined. |
| Sort | 18 | Choose 1 to 4: date oldest first, date newest first, priority highest first, priority lowest first. |
| Request history | 19 | Enter the request ID to see every approved action with the actor, comment and time. |

## 10.8 Example Console Screenshots

Add your own screenshots for each item and save them in a `screenshots` folder:

| Screenshot | Suggested file |
|---|---|
| Registering each type of user | `register_users.png` |
| Submitting a specialised request | `submit_request.png` |
| Specialised field rejected | `specialised_rejected.png` |
| A rejected workflow action | `rejected_action.png` |
| A request taken through to Closed | `closed_request.png` |
| Request history | `request_history.png` |
| Search, filter and sort results | `search_filter_sort.png` |
| Automated test output | `credit_tests.png` |

## 10.9 Common Errors and Solutions

| Error message | Cause | Solution |
|---|---|---|
| `Duplicate user ID: User with ID '...' already exists.` | The user ID is already registered. | Use a different user ID. |
| `Duplicate request ID: Request with ID '...' already exists.` | The request ID is already used. | Use a new request ID. |
| `User ID not found. Please register or provide a valid ID.` | The requester is not registered (or the app was restarted). | Register the user first. |
| `User not found: ...` | A user ID entered in a workflow step is not registered. | Check the ID and register the user if needed. |
| `Request not found.` | The request ID does not exist. | Check the ID (it must be typed exactly as submitted). |
| `Unsupported category: ...` | The category is not one of the four allowed. | Enter 1 to 4 or a valid category name. |
| `Unsupported priority value: ...` | The priority is not Low, Normal, High or Urgent. | Use one of the four values. |
| `Unsupported user type: ...` | The user type is not Student, Staff, Service Officer or Technician. | Use one of the four types. |
| `Year level must be a whole number from 1 to 8.` | The year level is not valid. | Enter a number from 1 to 8. |
| `Network impact must be one of: ...` / `Hazard level must be one of: ...` / `Hygiene risk must be one of: ...` | A specialised field has an unsupported value. | Use one of the listed values. |
| `Device type is required.` (and similar) | A required specialised field was left blank. | Enter a value. |
| `Unauthorized update: Updates attempted by another user.` | Another user tried to update the request. | Use the requester's own user ID. |
| `Unauthorized cancellation: Cancellation of another user's request is not allowed.` | Another user tried to cancel the request. | Use the requester's own user ID. |
| `Request is already marked Cancelled.` | The request was already cancelled. | No action is needed. |
| `Only Submitted requests can be updated (current status: ...).` / `Only Submitted requests can be cancelled (current status: ...).` | The request has already moved past Submitted. | Updates and cancellation are only allowed while Submitted. |
| `The category of a specialised request cannot be changed.` | An update tried to change the category. | Leave the category blank. |
| `Only a Service Officer can review requests.` (and similar for priority, assignment and closing) | The acting user is not a Service Officer. | Use a Service Officer's user ID. |
| `Only the assigned Technician can perform this action.` | Wrong Technician, or not a Technician. | Use the assigned Technician's user ID. |
| `A priority must be assigned before assigning a Technician.` | The officer skipped the priority step. | Run option 11 first. |
| `The assignee must be a Technician.` | The ID given is not a Technician. | Use a Technician's user ID. |
| `Invalid status transition: X -> Y` | The action is out of order. | Follow the workflow order in section 10.6. |
| `Progress can only be recorded while the request is In Progress.` | Work has not started or is already resolved. | Start the work first (option 13). |

## Test Report
Test 1: Sub-class constructors correctly call super().  

Registering Student:
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
--------------- Credit ---------------------
10. Review Request (Service Officer)
11. Assign Priority (Service Officer)
12. Assign Technician (Service Officer)
13. Start Work (Technician)
14. Record Progress (Technician)
15. Resolve Request (Technician)
16. Close Request (Service Officer)
17. Filter Requests
18. Sort Requests
19. View Request History
--------------------------------------------
20. Exit
============================================
Select an option (1-20): 1
Enter User ID: 240156
Enter First Name: Mary
Enter Last Name: Kala
Enter Email Address: maryk@gmail.com
Enter User Type (Student/Staff/Service Officer/Technician): Student
Enter Programme: Information System
Enter Year Level: 3

Success: User registered successfully.
```
Registering staff:
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
--------------- Credit ---------------------
10. Review Request (Service Officer)
11. Assign Priority (Service Officer)
12. Assign Technician (Service Officer)
13. Start Work (Technician)
14. Record Progress (Technician)
15. Resolve Request (Technician)
16. Close Request (Service Officer)
17. Filter Requests
18. Sort Requests
19. View Request History
--------------------------------------------
20. Exit
============================================
Select an option (1-20): 1
Enter User ID: ST1
Enter First Name: Ben 
Enter Last Name: Aru
Enter Email Address: bena@gmail.com
Enter User Type (Student/Staff/Service Officer/Technician): Staff
Enter Department: Commerce

Success: User registered successfully.
```
Registering Service Officer:
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
--------------- Credit ---------------------
10. Review Request (Service Officer)
11. Assign Priority (Service Officer)
12. Assign Technician (Service Officer)
13. Start Work (Technician)
14. Record Progress (Technician)
15. Resolve Request (Technician)
16. Close Request (Service Officer)
17. Filter Requests
18. Sort Requests
19. View Request History
--------------------------------------------
20. Exit
============================================
Select an option (1-20): 1
Enter User ID: 01
Enter First Name: Oli 
Enter Last Name: Toa
Enter Email Address: olit@gmail.com
Enter User Type (Student/Staff/Service Officer/Technician): Service Officer
Enter Service Section: Facilities

Success: User registered successfully.
```
Registering Technician:
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
--------------- Credit ---------------------
10. Review Request (Service Officer)
11. Assign Priority (Service Officer)
12. Assign Technician (Service Officer)
13. Start Work (Technician)
14. Record Progress (Technician)
15. Resolve Request (Technician)
16. Close Request (Service Officer)
17. Filter Requests
18. Sort Requests
19. View Request History
--------------------------------------------
20. Exit
============================================
Select an option (1-20): 1
Enter User ID: T1
Enter First Name: Tim
Enter Last Name: Vai
Enter Email Address: taiv@gmail.com
Enter User Type (Student/Staff/Service Officer/Technician): Technician
Enter Technical Speciality: Networks

Success: User registered successfully.
```

Missing first name error:
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
--------------- Credit ---------------------
10. Review Request (Service Officer)
11. Assign Priority (Service Officer)
12. Assign Technician (Service Officer)
13. Start Work (Technician)
14. Record Progress (Technician)
15. Resolve Request (Technician)
16. Close Request (Service Officer)
17. Filter Requests
18. Sort Requests
19. View Request History
--------------------------------------------
20. Exit
============================================
Select an option (1-20): 1
Enter User ID: 240157
Enter First Name: 
Enter Last Name: Peter
Enter Email Address: kellyp@gmail.com
Enter User Type (Student/Staff/Service Officer/Technician): Student
Enter Programme: IT
Enter Year Level: 2

Error: Missing first name
```
Test 2: Specialised fields are validated
Enter correct hazard level:
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
--------------- Credit ---------------------
10. Review Request (Service Officer)
11. Assign Priority (Service Officer)
12. Assign Technician (Service Officer)
13. Start Work (Technician)
14. Record Progress (Technician)
15. Resolve Request (Technician)
16. Close Request (Service Officer)
17. Filter Requests
18. Sort Requests
19. View Request History
--------------------------------------------
20. Exit
============================================
Select an option (1-20): 2
Enter Requester User ID: 240156
Enter Request ID: Req-001
Enter Title: Broken lights
Enter Description: Need to repair broken lights.
Enter Campus Location: Girls dormitory
Allowed Categories: 1. ICT Support | 2. Facilities Maintenance | 3. Cleaning and Sanitation | 4. General Campus Service
Enter Category: 2
Allowed Priorities: Low, Normal, High, Urgent
Enter Priority: High
Enter Building: A
Enter Room Number: 204
Enter Hazard Level (Low/Medium/High): Extreme
Enter Equipment Affected: Light

Error: Hazard level must be one of: Low, Medium, High
```

Missing field not allowed:
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
--------------- Credit ---------------------
10. Review Request (Service Officer)
11. Assign Priority (Service Officer)
12. Assign Technician (Service Officer)
13. Start Work (Technician)
14. Record Progress (Technician)
15. Resolve Request (Technician)
16. Close Request (Service Officer)
17. Filter Requests
18. Sort Requests
19. View Request History
--------------------------------------------
20. Exit
============================================
Select an option (1-20): 2
Enter Requester User ID: T1
Enter Request ID: Req-003
Enter Title: Garbage pollution
Enter Description: Rubbish outlet is filled.
Enter Campus Location: Admin Block
Allowed Categories: 1. ICT Support | 2. Facilities Maintenance | 3. Cleaning and Sanitation | 4. General Campus Service
Enter Category: 3
Allowed Priorities: Low, Normal, High, Urgent
Enter Priority: High
Enter Cleaning Area: 
Enter Hygiene Risk (Low/Medium/High): High
Enter Service Type: Spot clean
Enter Preferred Service Time: 14:00

Error: Cleaning area is required.
```

Test 3: Only Service Officers can assign Technicians.
Non-Service Officer
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
--------------- Credit ---------------------
10. Review Request (Service Officer)
11. Assign Priority (Service Officer)
12. Assign Technician (Service Officer)
13. Start Work (Technician)
14. Record Progress (Technician)
15. Resolve Request (Technician)
16. Close Request (Service Officer)
17. Filter Requests
18. Sort Requests
19. View Request History
--------------------------------------------
20. Exit
============================================
Select an option (1-20): 10
Enter Service Officer ID: ST1
Enter Request ID: Req-001
Enter comment (optional): 

Error: Only a Service Officer can review requests.
```

Service Officer reviews request:
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
--------------- Credit ---------------------
10. Review Request (Service Officer)
11. Assign Priority (Service Officer)
12. Assign Technician (Service Officer)
13. Start Work (Technician)
14. Record Progress (Technician)
15. Resolve Request (Technician)
16. Close Request (Service Officer)
17. Filter Requests
18. Sort Requests
19. View Request History
--------------------------------------------
20. Exit
============================================
Select an option (1-20): 
Select an option (1-20): 10
Enter Service Officer ID: 01
Enter Request ID: Req-004
Enter comment (optional): 

Success: Request reviewed. Status is now Reviewed.
```

Assigns prioritory:
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
--------------- Credit ---------------------
10. Review Request (Service Officer)
11. Assign Priority (Service Officer)
12. Assign Technician (Service Officer)
13. Start Work (Technician)
14. Record Progress (Technician)
15. Resolve Request (Technician)
16. Close Request (Service Officer)
17. Filter Requests
18. Sort Requests
19. View Request History
--------------------------------------------
20. Exit
============================================
Select an option (1-20): 11
Enter Service Officer ID: 01
Enter Request ID: Req-004
Allowed Priorities: Low, Normal, High, Urgent
Enter Priority: Urgent

Success: Priority assigned.
```

Assigns Technician:
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
--------------- Credit ---------------------
10. Review Request (Service Officer)
11. Assign Priority (Service Officer)
12. Assign Technician (Service Officer)
13. Start Work (Technician)
14. Record Progress (Technician)
15. Resolve Request (Technician)
16. Close Request (Service Officer)
17. Filter Requests
18. Sort Requests
19. View Request History
--------------------------------------------
20. Exit
============================================
Select an option (1-20): 12
Enter Service Officer ID: 01
Enter Request ID: Req-004
Enter Technician ID: T1

Success: Technician assigned. Status is now Assigned.
```

**Distinction Extension: Polymorphism, JSON Storage and Reporting**
---

## 1. Actors and User Roles

### Primary actors

| Actor | Class | Role-specific data | What they do |
|---|---|---|---|
| Student Requester | `StudentRequester` | Programme, year level (1 to 8) | Submits and manages their own service requests |
| Staff Requester | `StaffRequester` | Department | Submits and manages their own service requests |
| Service Officer | `ServiceOfficer` | Service section | Reviews requests, assigns priority and a Technician, verifies and closes completed work |
| Technician | `Technician` | Technical speciality | Starts work, records progress and resolves requests assigned to them |

### Supporting actors

| Actor | Description |
|---|---|
| JSON data files | The persistent store (`users.json`, `serviceRequests.json`, `requestHistory.json`, `auditLog.json`). Accessed only through the repository classes. |
| Test runner | The built-in Node.js test runner, which runs the automated tests against temporary files. |

### Permission matrix

| Action | Requester (Student / Staff) | Service Officer | Technician |
|---|:---:|:---:|:---:|
| Register a user | Yes | Yes | Yes |
| Submit a request | Yes | Yes | Yes |
| Update own request (only while `Submitted`) | Owner only | No | No |
| Cancel own request (only while `Submitted`) | Owner only | No | No |
| Review a request | No | Yes | No |
| Assign priority | No | Yes | No |
| Assign a Technician | No | Yes | No |
| Start work, record progress, resolve | No | No | Assigned Technician only |
| Close a request | No | Yes | No |
| View, search, filter, sort, history, reports, audit log | Yes | Yes | Yes |

Role checks are enforced inside the `ServiceRequest` class itself, so they apply no matter how the class is called.

---

## 2. Functional Requirements

Each requirement is tagged with the level that introduced it.

### User and request management

| ID | Requirement | Level |
|---|---|---|
| FR1 | Register a user of type Student, Staff, Service Officer or Technician with role-specific details. | Pass |
| FR2 | Reject duplicate user IDs and invalid user data (blank fields, invalid email, year level outside 1 to 8). | Pass |
| FR3 | Submit a request in one of four categories: ICT Support, Facilities Maintenance, Cleaning and Sanitation, General Campus Service. | Pass |
| FR4 | Capture category-specific fields for ICT, Maintenance and Cleaning requests and validate them. | Credit |
| FR5 | Reject duplicate request IDs and invalid request data. | Pass |
| FR6 | View a request by ID, view a user's own requests, and view all requests. | Pass |
| FR7 | Let the owner update title, description, priority and category-specific fields while the request is `Submitted`. | Pass |
| FR8 | Let the owner cancel a request while it is `Submitted`. | Pass |
| FR9 | Search requests by ID or title, and show a count of requests per status. | Pass |

### Workflow

| ID | Requirement | Level |
|---|---|---|
| FR10 | Move requests only through the permitted flow: `Submitted` → `Reviewed` → `Assigned` → `In Progress` → `Resolved` → `Closed`. A `Submitted` request may instead be `Cancelled`. | Credit |
| FR11 | Only a Service Officer may review, assign priority, assign a Technician and close. | Credit |
| FR12 | A priority must be assigned (while `Reviewed`) before a Technician can be assigned. | Credit |
| FR13 | Only the assigned Technician may start work, record progress and resolve. | Credit |
| FR14 | Record every status change and action in a per-request history. | Credit |
| FR15 | Filter requests by category, status, priority and Technician; sort by date and by priority. | Credit |

### Distinction extension

| ID | Requirement | Level |
|---|---|---|
| FR16 | Store all request types in one collection and process them with the same method calls (`getRequestSummary()`, `calculatePriorityScore()`, `getTargetResolutionHours()`), with each type giving its own result. | Distinction |
| FR17 | Treat `ServiceRequest` as abstract-style: it cannot be created directly, and its three required methods throw a clear error if a subclass does not supply them. | Distinction |
| FR18 | Save users, requests, request history and audit records to JSON files in a `data` folder. | Distinction |
| FR19 | On start-up, load existing records and create an empty array for any missing file. | Distinction |
| FR20 | Save after each successful registration, submission, update and status change. Never save an incomplete or invalid record. | Distinction |
| FR21 | Show clear file-reading and file-writing error messages. | Distinction |
| FR22 | Rebuild the correct specialised object from saved data through a factory, so restored objects keep their validation and polymorphic behaviour. | Distinction |
| FR23 | Keep file access in repository classes. The console app never reads or writes files. | Distinction |
| FR24 | Record an audit entry (audit ID, actor ID and role, action, request ID, description, date and time, outcome) for user registration, request creation, updates, priority changes, Technician assignment, status changes, cancellation, resolution and closure. | Distinction |
| FR25 | Provide nine management reports (see [section 7.6](#76-management-reports)), built with `filter()`, `map()`, `reduce()` and `sort()`. | Distinction |
| FR26 | Provide at least ten automated tests using the built-in Node.js test runner and temporary files. | Distinction |

---

## 3. Non-Functional Requirements

| Category | Requirement | How it is met |
|---|---|---|
| Technology | No database; JSON files only, using the built-in `fs/promises` module. | No third-party packages are used. `package.json` has no dependencies. |
| Portability | Runs on any machine with Node.js 20 or later. | Uses only built-in modules. Developed and tested on Node.js 22. |
| Reliability | A failed save must not corrupt data or leave memory and files disagreeing. | Writes go to a temporary file first and are then renamed. If a save fails, the in-memory request is rolled back to its previous state. A corrupt file is never overwritten. |
| Data integrity | Invalid or incomplete records are never stored. | Validation runs before every save. The factory re-validates every record on load. |
| Data safety | Data files hold simulated data only. | Files contain plain JSON, with no code, passwords or confidential information. |
| Maintainability | Clear separation of responsibilities. | Console menu, domain classes, manager, repositories, factories and reports are separate modules. |
| Extensibility | A new request type should be easy to add. | Add a subclass, register it in `Factories.js` and implement the three required methods. |
| Testability | Tests must not touch real data. | Every file-based test uses its own temporary folder, deleted afterwards. |
| Usability | Messages should be understandable. | Every failure prints `Error:` with a plain-language reason. Inputs such as priority and user type are case-insensitive. |
| Auditability | Actions can be traced. | Successful and rejected actions are both written to `auditLog.json`. |
| Performance | Responsive for a small campus dataset. | Each repository operation reads and writes one whole file. This is fast for hundreds of records (see limitations). |

---

## 4. Assumptions and Limitations

### Assumptions

- The application is used by one person at a time on one machine.
- Users identify themselves by typing their user ID. The system is a teaching prototype, so there are no passwords or login.
- All data is simulated. IDs are text, are case-sensitive, and have leading and trailing spaces ignored.
- Anyone may register any user type. A real system would restrict who can create Service Officers and Technicians.
- A request is **overdue** when it is not `Resolved`, `Closed` or `Cancelled` and the time since submission is longer than its own target resolution hours.
- A request counts as **completed** for the Technician and resolution-time reports once it reaches `Resolved` or `Closed`.
- Resolution time is measured from the submission date to the moment the `Resolved` status was recorded in the history.
- Dates are stored as ISO 8601 UTC strings and shown in the local format on screen.

### Limitations

- **No authentication.** Any user can type another user's ID. Role and ownership checks still apply to the ID that is typed.
- **No concurrent access.** Two copies of the program running at once could overwrite each other's changes, because there is no file locking.
- **Whole-file reads and writes.** Every operation loads and rewrites an entire JSON file. This does not scale to very large datasets.
- **Not a transaction across files.** A change touches up to three files (requests, history, audit). If the history write fails, the request write is undone as a best effort. If only the audit write fails, the change stays saved and an error explains that the audit record is missing.
- **Skipped bad records.** A saved record that fails validation at start-up is skipped with a warning and left unchanged in the file, so it is not lost but is not loaded either.
- **A fourth request class.** The brief names three specialised types. A fourth class, `GeneralServiceRequest`, was added so the General Campus Service category still works now that the base class is abstract.
- **Status flow is fixed.** A request cannot move backwards, `Closed` and `Cancelled` are final, and a category cannot be changed once a request exists.
- **No editing of users.** Users can be registered but not edited or deleted from the menu.
- **Pasted input.** The menu reads answers one line at a time. If several answers are pasted at once, lines that arrive while a save is in progress can be lost. Typing normally is not affected.

---

## 5. User Stories

### Requesters (Student and Staff)

| ID | Story | Acceptance criteria |
|---|---|---|
| US1 | As a **student or staff member**, I want to register with my details so that I can use the system. | The user is saved to `users.json`. A duplicate ID or invalid email is rejected with a clear message. |
| US2 | As a **requester**, I want to submit a request with details specific to its type so that the right team gets the information they need. | The request is created as `Submitted`, saved, and an audit entry is written. Missing or invalid fields are rejected and nothing is saved. |
| US3 | As a **requester**, I want to see my own requests and their status so that I know what is happening. | "View My Requests" lists every request for my ID. |
| US4 | As a **requester**, I want to correct a request before anyone reviews it so that the details are accurate. | Update succeeds only for the owner and only while `Submitted`. |
| US5 | As a **requester**, I want to cancel a request I no longer need so that it is not worked on. | Cancel succeeds only for the owner and only while `Submitted`. |
| US6 | As a **requester**, I want to search by ID or title so that I can find a request quickly. | Search returns requests whose ID or title contains the text. |

### Service Officers

| ID | Story | Acceptance criteria |
|---|---|---|
| US7 | As a **Service Officer**, I want to review new requests so that they enter the workflow. | Status moves from `Submitted` to `Reviewed`. Non-officers are rejected. |
| US8 | As a **Service Officer**, I want to set a priority so that urgent problems are handled first. | Priority can be set only while `Reviewed`. |
| US9 | As a **Service Officer**, I want to assign a Technician so that someone is responsible. | Assignment needs a priority first and a valid Technician ID. Status becomes `Assigned`. |
| US10 | As a **Service Officer**, I want to verify and close resolved requests so that finished work is confirmed. | Close works only from `Resolved`. |
| US11 | As a **Service Officer**, I want reports on status, category, priority, urgency, overdue work, Technician workload, resolution time and location so that I can manage the service. | The Reports menu shows all nine reports. |

### Technicians

| ID | Story | Acceptance criteria |
|---|---|---|
| US12 | As a **Technician**, I want to see the requests assigned to me so that I know what to do. | Filter by Technician ID lists my requests. |
| US13 | As a **Technician**, I want to start work and record progress notes so that others can follow what has been done. | Only the assigned Technician can do this, and notes need text. |
| US14 | As a **Technician**, I want to mark a request resolved so that the officer can verify it. | Resolve works only from `In Progress`. |

### Cross-cutting

| ID | Story | Acceptance criteria |
|---|---|---|
| US15 | As a **user**, I want my data to still be there after I close the program so that work is not lost. | Restarting the program loads all users and requests, with the same status, history and behaviour. |
| US16 | As an **administrator**, I want an audit log so that I can see who did what and whether it succeeded. | Every action, including rejected attempts, is logged with a unique audit ID. |
| US17 | As a **user**, I want to see each request's full history so that I can trace its progress. | "View Request History" lists every status change with time, actor and comment. |
| US18 | As a **developer**, I want automated tests that use temporary files so that I can change the code safely without damaging real data. | `node --test` runs the suite and leaves `data/` untouched. |
| US19 | As a **user**, I want a clear message when a file cannot be read or written so that I know what to fix. | Errors name the file and the reason. |

---

## 6. UML System Design

The diagrams use [Mermaid](https://mermaid.js.org/), which GitHub and VS Code (with a Mermaid preview extension) render automatically.

### 6.1 Use case diagram

```mermaid
flowchart LR
    Req(["Student / Staff Requester"])
    Off(["Service Officer"])
    Tech(["Technician"])

    subgraph System["Campus Service Request System"]
        UC1["Register user"]
        UC2["Submit request"]
        UC3["View / search / filter / sort requests"]
        UC4["Update own request"]
        UC5["Cancel own request"]
        UC6["Review request"]
        UC7["Assign priority"]
        UC8["Assign Technician"]
        UC9["Start work"]
        UC10["Record progress"]
        UC11["Resolve request"]
        UC12["Close request"]
        UC13["View request history"]
        UC14["View management reports"]
        UC15["View audit log"]
        UC16["Process all requests polymorphically"]
    end

    Req --> UC1 & UC2 & UC3 & UC4 & UC5 & UC13 & UC14 & UC15 & UC16
    Off --> UC1 & UC3 & UC6 & UC7 & UC8 & UC12 & UC13 & UC14 & UC15 & UC16
    Tech --> UC1 & UC3 & UC9 & UC10 & UC11 & UC13 & UC14 & UC15 & UC16
```

### 6.2 Layered architecture

```mermaid
flowchart TB
    UI["CampusServiceApp.js<br/>Console menu and input"]
    MGR["ServiceRequestManager<br/>Workflow, saving, rollback, auditing"]
    REP["ReportGenerator<br/>Management reports"]
    DOM["Domain classes<br/>User and ServiceRequest hierarchies"]
    FAC["Factories<br/>UserFactory, ServiceRequestFactory"]
    REPO["File repositories<br/>Read and write JSON"]
    FILES[("data/*.json")]

    UI --> MGR
    UI --> REP
    MGR --> DOM
    MGR --> FAC
    FAC --> DOM
    MGR --> REPO
    REPO --> FILES
    REP --> DOM
```

The console app never touches the repositories' files. It only calls the manager and the report generator.

### 6.3 Class diagram

```mermaid
classDiagram
    class User {
        -userID
        -firstName
        -lastName
        -emailAddress
        -userType
        +validate()
        +getFullName()
        +getRoleData()
        +toData()
    }
    class StudentRequester {
        -programme
        -yearLevel
    }
    class StaffRequester {
        -department
    }
    class ServiceOfficer {
        -serviceSection
    }
    class Technician {
        -speciality
    }
    User <|-- StudentRequester
    User <|-- StaffRequester
    User <|-- ServiceOfficer
    User <|-- Technician

    class ServiceRequest {
        <<abstract>>
        -requestID
        -title
        -description
        -campusLocation
        -category
        -priority
        -status
        -assignedTechnicianID
        -progressUpdates
        -history
        +validate()
        +updateDetails()
        +cancelRequest()
        +review()
        +assignPriority()
        +assignTechnician()
        +startWork()
        +recordProgress()
        +resolve()
        +close()
        +calculatePriorityScore()*
        +getTargetResolutionHours()*
        +getRequestSummary()*
        +toData()
        +toHistoryData()
        +restoreState()
    }
    class ICTSupportRequest {
        -deviceType
        -systemName
        -faultType
        -networkImpact
    }
    class MaintenanceRequest {
        -building
        -roomNumber
        -hazardLevel
        -equipmentAffected
    }
    class CleaningRequest {
        -cleaningArea
        -hygieneRisk
        -serviceType
        -preferredServiceTime
    }
    class GeneralServiceRequest
    ServiceRequest <|-- ICTSupportRequest
    ServiceRequest <|-- MaintenanceRequest
    ServiceRequest <|-- CleaningRequest
    ServiceRequest <|-- GeneralServiceRequest
    ServiceRequest "*" --> "1" User : requester

    class ServiceRequestManager {
        +init()
        +registerUser()
        +submitRequest()
        +updateRequest()
        +cancelRequest()
        +reviewRequest()
        +assignPriority()
        +assignTechnician()
        +startWork()
        +recordProgress()
        +resolveRequest()
        +closeRequest()
        +filterRequests()
        +sortByDate()
        +sortByPriority()
        +getAuditEntries()
    }
    ServiceRequestManager "1" o-- "*" User
    ServiceRequestManager "1" o-- "*" ServiceRequest

    class UserFactory {
        +createFromData()
    }
    class ServiceRequestFactory {
        +createFromData()
    }
    ServiceRequestManager ..> UserFactory
    ServiceRequestManager ..> ServiceRequestFactory
    ServiceRequestFactory ..> ServiceRequest : creates

    class JsonFileRepository {
        +loadAll()
        +saveAll()
        +create()
        +findById()
        +update()
        +delete()
    }
    class UserFileRepository
    class ServiceRequestFileRepository {
        +findByRequester()
        +findByTechnician()
    }
    class HistoryFileRepository {
        +findByRequest()
        +replaceForRequest()
    }
    class AuditFileRepository {
        +append()
        +findByRequest()
        +findByActor()
    }
    JsonFileRepository <|-- UserFileRepository
    JsonFileRepository <|-- ServiceRequestFileRepository
    JsonFileRepository <|-- HistoryFileRepository
    JsonFileRepository <|-- AuditFileRepository
    ServiceRequestManager --> JsonFileRepository : uses

    class ReportGenerator {
        +byStatus()
        +byCategory()
        +byPriority()
        +urgentRequests()
        +overdueRequests()
        +assignedByTechnician()
        +completedByTechnician()
        +averageResolutionTime()
        +volumeByLocation()
        +catalog()
    }
    ReportGenerator ..> ServiceRequest : reads
```

`*` after a method name marks an abstract-style method that each subclass must supply.

### 6.4 Request status state diagram

```mermaid
stateDiagram-v2
    state "In Progress" as InProgress
    [*] --> Submitted
    Submitted --> Reviewed : Officer reviews
    Submitted --> Cancelled : Requester cancels
    Reviewed --> Assigned : Officer assigns Technician
    Assigned --> InProgress : Technician starts work
    InProgress --> Resolved : Technician resolves
    Resolved --> Closed : Officer closes
    Closed --> [*]
    Cancelled --> [*]
```

Assigning a priority and recording progress are logged in the history but do not change the status.

### 6.5 Sequence diagram: a status change with saving and auditing

```mermaid
sequenceDiagram
    actor O as Service Officer
    participant App as CampusServiceApp
    participant M as ServiceRequestManager
    participant R as ServiceRequest
    participant Repo as Repositories

    O->>App: Review request (officer ID, request ID)
    App->>M: reviewRequest()
    M->>M: Take snapshot of the request
    M->>R: review(officer)
    alt Not allowed (wrong role or invalid transition)
        R-->>M: throws Error
        M->>Repo: audit.append (outcome: Rejected)
        M-->>App: throws Error
        App-->>O: Error: reason
    else Allowed
        R-->>M: status changed
        M->>Repo: requests.update and history.replaceForRequest
        alt Save fails
            Repo-->>M: RepositoryError
            M->>M: Roll back from snapshot
            M-->>App: throws Error
            App-->>O: Error: could not write file
        else Saved
            M->>Repo: audit.append (outcome: Success)
            M-->>App: true
            App-->>O: Success message
        end
    end
```

### 6.6 Sequence diagram: start-up and restoring saved objects

```mermaid
sequenceDiagram
    participant App as CampusServiceApp
    participant M as ServiceRequestManager
    participant Repo as Repositories
    participant F as Factories

    App->>M: init()
    M->>Repo: loadAll() for users, requests, history, audit
    Note over Repo: A missing file is created as an empty array
    Repo-->>M: plain data records
    loop each user record
        M->>F: UserFactory.createFromData()
        F-->>M: User object, or error (skipped with a warning)
    end
    loop each request record
        M->>F: ServiceRequestFactory.createFromData(record, findUser, history)
        F-->>M: specialised request object, or error (skipped with a warning)
    end
    M-->>App: counts and warnings
    App->>App: display menu
```

---

## 7. Technical Documentation

### 7.1 Technology

| Item | Detail |
|---|---|
| Language | JavaScript (CommonJS modules) |
| Runtime | Node.js 20 or later (tested on 22) |
| Console input | Built-in `readline` |
| File access | Built-in `fs/promises` (only inside `FileRepositories.js`) |
| Tests | Built-in `node:test` and `node:assert` |
| Dependencies | None |

### 7.2 Object-oriented concepts used

| Concept | Where |
|---|---|
| Encapsulation | Private `#` fields with getters and controlled setters in `User` and `ServiceRequest`. |
| Inheritance | `StudentRequester`, `StaffRequester`, `ServiceOfficer` and `Technician` extend `User`. The four request classes extend `ServiceRequest`. Repositories extend `JsonFileRepository`. |
| Constructor chaining | Every subclass calls `super(...)`. |
| Polymorphism | One collection holds all request types and the same three calls give type-specific results. |
| Abstraction | `ServiceRequest` cannot be instantiated and requires three methods from its subclasses. |
| Factory pattern | `UserFactory` and `ServiceRequestFactory` rebuild objects from saved data. |
| Repository pattern | File access is separated from domain logic and the console. |

### 7.3 Polymorphism and abstract-style methods

`ServiceRequest` throws if created directly (`new.target` check). Its three required methods throw `"<ClassName> must implement <method>()"` unless the subclass overrides them. Subclasses reuse two helpers, `getBaseSummary()` and `getBasePriorityScore()`.

The base priority score is Low 1, Normal 2, High 3, Urgent 4.

| Type | Priority score | Target resolution hours |
|---|---|---|
| `ICTSupportRequest` | base + (network impact position) × 2 | None 72, Single User 48, Department 24, Campus-wide 4 |
| `MaintenanceRequest` | base + (hazard level position) × 3 | Low 120, Medium 48, High 8 |
| `CleaningRequest` | base + (hygiene risk position) × 2 | Low 48, Medium 24, High 6 |
| `GeneralServiceRequest` | base | 72 |

Position means the index in the list: network impact `None, Single User, Department, Campus-wide` (0 to 3), and hazard and hygiene `Low, Medium, High` (0 to 2).

Specialised fields:

| Type | Fields |
|---|---|
| ICT Support | `deviceType`, `systemName`, `faultType`, `networkImpact` |
| Facilities Maintenance | `building`, `roomNumber`, `hazardLevel`, `equipmentAffected` |
| Cleaning and Sanitation | `cleaningArea`, `hygieneRisk`, `serviceType`, `preferredServiceTime` |
| General Campus Service | none |

### 7.4 Data files

All four files live in `data/` and each holds a JSON array. The files contain plain data only.

**`users.json`**
```json
{
  "userId": "S1",
  "firstName": "Ana",
  "lastName": "Kila",
  "emailAddress": "ana@wpu.example",
  "userType": "Student",
  "programme": "Computing",
  "yearLevel": 2
}
```

**`serviceRequests.json`**
```json
{
  "requestId": "REQ1",
  "requestType": "ICTSupportRequest",
  "requesterId": "S1",
  "title": "Wi-Fi down",
  "description": "No access",
  "location": "Library Level 2",
  "category": "ICT Support",
  "priority": "Urgent",
  "status": "Assigned",
  "priorityAssigned": true,
  "assignedTechnicianId": "T1",
  "dateSubmitted": "2026-10-20T05:48:19.203Z",
  "dateUpdated": "2026-10-20T05:48:20.410Z",
  "progressUpdates": [],
  "specialisedData": {
    "deviceType": "Laptop",
    "systemName": "Wi-Fi",
    "faultType": "Connectivity",
    "networkImpact": "Department"
  }
}
```

**`requestHistory.json`**
```json
{
  "historyId": "REQ1-H2",
  "requestId": "REQ1",
  "previousStatus": "Submitted",
  "newStatus": "Reviewed",
  "action": "Reviewed",
  "actorId": "OFF1",
  "actorRole": "Service Officer",
  "comment": "Request reviewed",
  "dateTime": "2026-10-20T05:48:19.800Z"
}
```

**`auditLog.json`**
```json
{
  "auditId": "AUD00005",
  "actorId": "OFF1",
  "actorRole": "Service Officer",
  "action": "Status changed",
  "requestId": "REQ1",
  "description": "Status changed from Submitted to Reviewed",
  "dateTime": "2026-10-20T05:48:19.800Z",
  "outcome": "Success"
}
```

A rejected attempt has an outcome such as `Rejected: Only a Service Officer can close a request.`

### 7.5 Persistence, rollback and error handling

1. **Loading.** `loadAll()` reads a file. A missing file is created as `[]`. An empty file counts as `[]`. Invalid JSON, a non-array value or an unreadable path throws a `RepositoryError` naming the file.
2. **Saving.** `saveAll()` creates the folder if needed, writes `<file>.tmp`, then renames it over the real file. If anything fails, the temporary file is removed and a `RepositoryError` is thrown.
3. **Changing a request.** The manager takes a snapshot, applies the change in memory, saves the request and its history, and only then writes the audit entry.
4. **Rollback.** If saving fails, the request is rebuilt from the snapshot, so memory matches the files again.
5. **Rejected actions.** If the domain rules refuse an action, nothing is saved. The attempt is audited with `Rejected: <reason>` and the original error is shown.
6. **Start-up.** If a data file cannot be read, the program prints the error and closes instead of risking an overwrite. A single invalid record is skipped with a warning.

### 7.6 Management reports

| # | Report | Definition |
|---|---|---|
| 1 | Requests by Status | Count per status, including zeros. |
| 2 | Requests by Category | Count per category, including zeros. |
| 3 | Requests by Priority | Count per priority, including zeros. |
| 4 | Urgent Requests | Priority `Urgent` and still open, highest priority score first. |
| 5 | Overdue Requests | Open requests older than their own target resolution hours, most overdue first. |
| 6 | Requests Assigned to Each Technician | Count and request IDs per Technician, busiest first. |
| 7 | Completed Requests by Technician | Resolved or Closed requests per Technician. |
| 8 | Average Resolution Time | Average hours from submission to the `Resolved` entry in the history. |
| 9 | Request Volume by Campus Location | Count per location, busiest first. |

Open means the status is not `Resolved`, `Closed` or `Cancelled`.

### 7.7 Audit actions

`User registration`, `Request created`, `Request updated`, `Priority changed`, `Technician assigned`, `Status changed` (review and start work), `Progress recorded`, `Request resolved`, `Request closed`, `Request cancelled`.

### 7.8 Automated tests

Run with `node --test`. There are 26 tests in `test/campusService.test.js`. Each test that touches files creates a temporary folder under the system temp directory and deletes it afterwards.

| Area | What is tested |
|---|---|
| Valid construction | Users and requests are built with correct values. |
| Invalid constructor values | Bad year level, blank fields, invalid specialised values, creating the abstract base class. |
| Duplicate identifiers | Duplicate user and request IDs are rejected. |
| Role permissions | Wrong role or wrong user is rejected for every protected action. |
| Status transitions | Illegal jumps, final statuses, full workflow to `Closed`. |
| Specialised behaviour | Scores, target hours, update rules and category protection per type. |
| Polymorphism | One collection processed with the same method calls. |
| Abstract-style methods | Missing overrides throw a clear error. |
| Saving JSON | Users, requests, history and audit are written as plain data. |
| Loading and restoring | A new session restores the correct classes and behaviour, then continues the workflow. |
| Missing or empty files | Created as empty arrays. |
| File errors | Corrupt JSON, wrong structure, unreadable and unwritable paths, rollback after a failed save. |
| Invalid data | Invalid requests and users are not saved. Bad saved records are skipped with a warning. |
| Factory | Unknown types, missing requesters, bad dates and inconsistent data are rejected. |
| Audit trail | All required actions and fields are recorded, including rejections. |
| Reports | Grouping, urgent, overdue, Technician, average time and location calculations. |

---

## 8. Folder Structure

```
campus-service-app/
├── CampusServiceApp.js          Console menu and user input (entry point)
├── ServiceRequestManager.js     Workflow, saving, rollback and auditing
├── ServiceRequest.js            Abstract-style base request
├── SpecialisedRequests.js       ICT, Maintenance, Cleaning and General request classes
├── User.js                      Base user class
├── SpecialisedUsers.js          Student, Staff, Service Officer and Technician classes
├── Factories.js                 UserFactory and ServiceRequestFactory
├── FileRepositories.js          JSON file repositories and RepositoryError
├── ReportGenerator.js           Management reports
├── package.json                 Scripts: start and test
├── README.md                    This document
├── test/
│   └── campusService.test.js    Automated tests
└── data/                        Created on first run
    ├── users.json
    ├── serviceRequests.json
    ├── requestHistory.json
    └── auditLog.json
```

A file ending in `.tmp` may briefly appear in `data/` while a save is in progress. It is removed or renamed automatically.

---

## 9. Class Responsibilities

### Users

| Class | Responsibility |
|---|---|
| `User` | Holds ID, name, email and user type. Validates them, builds the full name, and converts itself to plain data (`toData()`). |
| `StudentRequester` | Adds programme and year level, and validates them. |
| `StaffRequester` | Adds department. |
| `ServiceOfficer` | Adds service section. |
| `Technician` | Adds technical speciality. |

### Requests

| Class | Responsibility |
|---|---|
| `ServiceRequest` | Abstract-style base. Holds common data, status, history and progress notes. Enforces the status flow, role checks and update rules. Converts itself to and from plain data. Requires subclasses to supply the priority score, target hours and summary. |
| `ICTSupportRequest` | ICT fields and validation, plus its own score, target hours, summary and update rules. |
| `MaintenanceRequest` | Maintenance fields and validation, plus its own score, target hours, summary and update rules. |
| `CleaningRequest` | Cleaning fields and validation, plus its own score, target hours, summary and update rules. |
| `GeneralServiceRequest` | Concrete class for the General Campus Service category, using the shared base behaviour. |

### Application services

| Class | Responsibility |
|---|---|
| `ServiceRequestManager` | Keeps the in-memory users and requests. Loads saved data at start-up. Runs each action, saves it, rolls back on failure and writes audit entries. Provides search, filter and sort. |
| `ReportGenerator` | Calculates the nine management reports and formats them for display. |
| `UserFactory` | Rebuilds the correct `User` subclass from a saved record. |
| `ServiceRequestFactory` | Rebuilds the correct request subclass from a saved record, restoring status, dates, history and progress, and validating the result. |

### Persistence

| Class | Responsibility |
|---|---|
| `JsonFileRepository` | Shared file logic: `loadAll`, `saveAll`, `create`, `findById`, `update`, `delete`. The only place that uses `fs/promises`. |
| `UserFileRepository` | Stores `users.json`, keyed by `userId`. |
| `ServiceRequestFileRepository` | Stores `serviceRequests.json`, with `findByRequester` and `findByTechnician`. |
| `HistoryFileRepository` | Stores `requestHistory.json`, with `findByRequest` and `replaceForRequest`. |
| `AuditFileRepository` | Stores `auditLog.json`, assigns audit IDs in `append`, with `findByRequest` and `findByActor`. |
| `RepositoryError` | The error type for file-reading and file-writing problems. |

### Console

| Module | Responsibility |
|---|---|
| `CampusServiceApp.js` | Shows the menu, asks questions, calls the manager and report generator, and prints results or errors. It never reads or writes files. |

---

## 10. User Guide

### 10.1 Requirements and start-up

1. Install [Node.js](https://nodejs.org) version 20 or later. Check with `node -v`.
2. Open a terminal in the project folder.
3. Start the program:

```
node CampusServiceApp.js
```

(or `npm start`). The first line shows how many users and requests were loaded from the `data` folder. On the first run this is `0` for both.

To run the automated tests:

```
node --test
```

(or `npm test`).

### 10.2 Menu

| # | Option | Who normally uses it |
|---|---|---|
| 1 | Register User | Everyone |
| 2 | Submit Service Request | Requesters |
| 3 | View Request by ID | Everyone |
| 4 | View My Requests | Requesters |
| 5 | View All Requests | Everyone |
| 6 | Update My Request | Requester (owner, while `Submitted`) |
| 7 | Cancel My Request | Requester (owner, while `Submitted`) |
| 8 | Search Requests | Everyone |
| 9 | View Request Summary (count per status) | Everyone |
| 10 | Review Request | Service Officer |
| 11 | Assign Priority | Service Officer |
| 12 | Assign Technician | Service Officer |
| 13 | Start Work | Assigned Technician |
| 14 | Record Progress | Assigned Technician |
| 15 | Resolve Request | Assigned Technician |
| 16 | Close Request | Service Officer |
| 17 | Filter Requests | Everyone |
| 18 | Sort Requests | Everyone |
| 19 | View Request History | Everyone |
| 20 | Management Reports | Everyone |
| 21 | View Audit Log | Everyone |
| 22 | Process All Requests (polymorphism) | Everyone |
| 23 | Exit | Everyone |

Type the number and press Enter. Where an optional answer is offered, press Enter to skip it.

### 10.3 Walk-through

**Step 1: Register users (option 1).** Register at least one of each role. Example:

| User ID | Name | Email | Type | Extra details |
|---|---|---|---|---|
| `S1` | Ana Kila | ana@wpu.example | Student | Programme `Computing`, year level `2` |
| `ST1` | Mere Tau | mere@wpu.example | Staff | Department `Library` |
| `OFF1` | Sam Kopi | sam@wpu.example | Service Officer | Service section `Facilities` |
| `T1` | Lee Wong | lee@wpu.example | Technician | Speciality `Networks` |

**Step 2: Submit a request (option 2).** Enter the requester's user ID, a new request ID (for example `REQ1`), title, description, campus location, category (type `1` to `4` or the name) and priority (`Low`, `Normal`, `High` or `Urgent`). Then answer the questions for that category:

| Category | Extra questions |
|---|---|
| 1. ICT Support | Device type, system name, fault type, network impact (`None`, `Single User`, `Department`, `Campus-wide`) |
| 2. Facilities Maintenance | Building, room number, hazard level (`Low`, `Medium`, `High`), equipment affected |
| 3. Cleaning and Sanitation | Cleaning area, hygiene risk (`Low`, `Medium`, `High`), service type, preferred service time |
| 4. General Campus Service | None |

The request is created with status `Submitted`.

**Step 3: Process the request.** Run these in order, entering the user ID and request ID each time:

| Order | Option | Who | Resulting status |
|---|---|---|---|
| 1 | 10 Review Request | Service Officer | `Reviewed` |
| 2 | 11 Assign Priority | Service Officer | `Reviewed` (priority set) |
| 3 | 12 Assign Technician | Service Officer | `Assigned` |
| 4 | 13 Start Work | The assigned Technician | `In Progress` |
| 5 | 14 Record Progress (optional, repeatable) | The assigned Technician | `In Progress` |
| 6 | 15 Resolve Request | The assigned Technician | `Resolved` |
| 7 | 16 Close Request | Service Officer | `Closed` |

**Step 4: Look at the results.**

- **Option 3** shows one request in full, including target resolution hours and priority score.
- **Option 19** shows the complete history for a request.
- **Option 22** lists every request with its own priority score and target hours, showing polymorphism.
- **Option 20** shows the reports. Choose a number from 1 to 9, or 10 for all reports.
- **Option 21** shows the audit log. Enter a request ID for one request, or press Enter for the latest 20 entries.

**Step 5: Check persistence.** Choose 23 to exit, run the program again, and use option 5 or 3. Your users and requests are still there.

### 10.4 Updating, filtering and sorting

- **Update (6):** Enter the request ID and your user ID, then press Enter to skip any field you do not want to change. For ICT, Maintenance and Cleaning requests the specialised fields are listed too.
- **Filter (17):** Fill in any of category, status, priority and Technician ID. Leave a question blank to skip it.
- **Sort (18):** Choose date (oldest or newest first) or priority (highest or lowest first).

### 10.5 Resetting the data

To start fresh, close the program and delete the four files in `data/` (or the whole folder). They are recreated empty on the next start. Always keep `data/` as simulated data only.

### 10.6 Troubleshooting

| Message | Meaning and fix |
|---|---|
| `Only a Service Officer can ...` | The ID you entered belongs to a different role. Use a Service Officer's ID. |
| `Only the assigned Technician can perform this action.` | Use the ID of the Technician assigned to that request. |
| `Invalid status transition: A -> B` | The request is not at the right stage. See the state diagram in section 6.4. |
| `A priority must be assigned before assigning a Technician.` | Run option 11 first. |
| `Only Submitted requests can be updated / cancelled` | The request has already moved on and can no longer be changed by the requester. |
| `Duplicate user ID` / `Duplicate request ID` | Choose an ID that has not been used. |
| `User not found` / `Request not found` | Check the ID. IDs are case-sensitive. |
| `The requester '...' is not a registered user.` | Register the user first (option 1). |
| `Could not read ...: the file is not valid JSON` | A data file was edited incorrectly. Fix the file, or delete it to start empty. The program closes at start-up rather than overwrite it. |
| `Could not write ...` | The data folder is read-only, full or locked. Fix the cause and try again. The in-memory change is undone. |
| `Warning: Skipped saved request ...` | That saved record is invalid. The rest loaded normally, and the bad record is left untouched in the file. |
| `The change was saved, but the audit record could not be written.` | The action worked, but `auditLog.json` could not be updated. Check the file and folder. |
