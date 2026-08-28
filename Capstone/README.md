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

## STRUCTURE
