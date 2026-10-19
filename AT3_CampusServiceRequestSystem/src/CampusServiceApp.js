/*
  Program: CampusServiceApp (Credit Component)
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 19th October 2026
*/

const readline = require('readline');
const ServiceRequest = require('./ServiceRequest');
const ServiceRequestManager = require('./ServiceRequestManager');
const { StudentRequester, StaffRequester, ServiceOfficer, Technician } = require('./SpecialisedUsers');
const { ICTSupportRequest, MaintenanceRequest, CleaningRequest } = require('./SpecialisedRequests');

const manager = new ServiceRequestManager();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const USER_TYPES = ['Student', 'Staff', 'Service Officer', 'Technician'];

function displayMenu() {
  console.log("\n============================================");
  console.log("     CAMPUS SERVICE REQUEST SYSTEM");
  console.log("============================================");
  console.log("1. Register User");
  console.log("2. Submit Service Request");
  console.log("3. View Request by ID");
  console.log("4. View My Requests");
  console.log("5. View All Requests");
  console.log("6. Update My Request");
  console.log("7. Cancel My Request");
  console.log("8. Search Requests");
  console.log("9. View Request Summary");
  console.log("--------------- Credit ---------------------");
  console.log("10. Review Request (Service Officer)");
  console.log("11. Assign Priority (Service Officer)");
  console.log("12. Assign Technician (Service Officer)");
  console.log("13. Start Work (Technician)");
  console.log("14. Record Progress (Technician)");
  console.log("15. Resolve Request (Technician)");
  console.log("16. Close Request (Service Officer)");
  console.log("17. Filter Requests");
  console.log("18. Sort Requests");
  console.log("19. View Request History");
  console.log("--------------------------------------------");
  console.log("20. Exit");
  console.log("============================================");
  rl.question("Select an option (1-20): ", handleMenuChoice);
}

function handleMenuChoice(choice) {
  switch (choice.trim()) {
    case '1': promptRegisterUser(); break;
    case '2': promptSubmitRequest(); break;
    case '3': promptViewRequestById(); break;
    case '4': promptViewMyRequests(); break;
    case '5': promptViewAllRequests(); break;
    case '6': promptUpdateMyRequest(); break;
    case '7': promptCancelMyRequest(); break;
    case '8': promptSearchRequests(); break;
    case '9': promptViewSummary(); break;
    case '10': promptReview(); break;
    case '11': promptAssignPriority(); break;
    case '12': promptAssignTechnician(); break;
    case '13': promptStartWork(); break;
    case '14': promptRecordProgress(); break;
    case '15': promptResolve(); break;
    case '16': promptClose(); break;
    case '17': promptFilter(); break;
    case '18': promptSort(); break;
    case '19': promptHistory(); break;
    case '20':
      console.log("Exiting Campus Service Request System. Goodbye!");
      rl.close();
      break;
    default:
      console.log("Invalid option. Please enter a number between 1 and 20.");
      displayMenu();
      break;
  }
}

// ---------- Helpers ----------

// Asks a list of questions one after another, then calls done(answers).
function askAll(prompts, done, answers = []) {
  if (answers.length === prompts.length) return done(answers);
  rl.question(prompts[answers.length], (a) => askAll(prompts, done, [...answers, a.trim()]));
}

// Case-insensitive match against a list of allowed values; unmatched text is returned unchanged
function matchOption(value, options) {
  return options.find(o => o.toLowerCase() === value.toLowerCase()) || value;
}

// Accepts a category number (1-4) or the category name
function toCategory(input) {
  return ServiceRequest.ALLOWED_CATEGORIES[Number(input) - 1] || input.trim();
}

function showRequests(list) {
  if (list.length === 0) {
    console.log("\nNo matching requests found.");
    return;
  }
  list.forEach(req => console.log(req.getRequestSummary()));
  console.log(`(${list.length} request${list.length === 1 ? '' : 's'})`);
}

// Runs an action, prints a success or error message, then returns to the menu
function runAction(action, successMessage) {
  try {
    action();
    console.log(`\nSuccess: ${successMessage}`);
  } catch (error) {
    console.log(`\nError: ${error.message}`);
  }
  displayMenu();
}

// ---------- 1. Register User ----------
function promptRegisterUser() {
  rl.question("Enter User ID: ", (userId) => {
    rl.question("Enter First Name: ", (firstName) => {
      rl.question("Enter Last Name: ", (lastName) => {
        rl.question("Enter Email Address: ", (email) => {
          rl.question("Enter User Type (Student/Staff/Service Officer/Technician): ", (typeInput) => {
            const userType = matchOption(typeInput.trim(), USER_TYPES);
            const finish = (createUser) => {
              try {
                manager.registerUser(createUser());
                console.log("\nSuccess: User registered successfully.");
              } catch (error) {
                console.log(`\nError: ${error.message}`);
              }
              displayMenu();
            };
            if (userType === 'Student') {
              askAll(["Enter Programme: ", "Enter Year Level: "], ([programme, year]) =>
                finish(() => new StudentRequester(userId, firstName, lastName, email, programme, Number(year))));
            } else if (userType === 'Staff') {
              askAll(["Enter Department: "], ([department]) =>
                finish(() => new StaffRequester(userId, firstName, lastName, email, department)));
            } else if (userType === 'Service Officer') {
              askAll(["Enter Service Section: "], ([section]) =>
                finish(() => new ServiceOfficer(userId, firstName, lastName, email, section)));
            } else if (userType === 'Technician') {
              askAll(["Enter Technical Speciality: "], ([speciality]) =>
                finish(() => new Technician(userId, firstName, lastName, email, speciality)));
            } else {
              console.log(`\nError: Unsupported user type: ${userType}. Choose from: ${USER_TYPES.join(', ')}`);
              displayMenu();
            }
          });
        });
      });
    });
  });
}

// ---------- 2. Submit Service Request ----------
function promptSubmitRequest() {
  rl.question("Enter Requester User ID: ", (userId) => {
    const user = manager.findUserById(userId);
    if (!user) {
      console.log("\nError: User ID not found. Please register or provide a valid ID.");
      return displayMenu();
    }

    rl.question("Enter Request ID: ", (requestId) => {
      rl.question("Enter Title: ", (title) => {
        rl.question("Enter Description: ", (description) => {
          rl.question("Enter Campus Location: ", (campusLocation) => {
            console.log("Allowed Categories: 1. ICT Support | 2. Facilities Maintenance | 3. Cleaning and Sanitation | 4. General Campus Service");
            rl.question("Enter Category: ", (categoryInput) => {
              const category = toCategory(categoryInput);
              console.log("Allowed Priorities: Low, Normal, High, Urgent");
              rl.question("Enter Priority: ", (priority) => {
                const common = { requestID: requestId.trim(), requester: user, title, description, campusLocation, priority: priority.trim() };
                const submit = (createRequest) => {
                  try {
                    manager.submitRequest(createRequest());
                    console.log("\nSuccess: Service request submitted successfully with 'Submitted' status.");
                  } catch (error) {
                    console.log(`\nError: ${error.message}`);
                  }
                  displayMenu();
                };

                if (category === 'ICT Support') {
                  askAll(["Enter Device Type: ", "Enter System Name: ", "Enter Fault Type: ",
                          "Enter Network Impact (None/Single User/Department/Campus-wide): "],
                    ([deviceType, systemName, faultType, impact]) => submit(() =>
                      new ICTSupportRequest(common, { deviceType, systemName, faultType,
                        networkImpact: matchOption(impact, ICTSupportRequest.IMPACTS) })));
                } else if (category === 'Facilities Maintenance') {
                  askAll(["Enter Building: ", "Enter Room Number: ", "Enter Hazard Level (Low/Medium/High): ",
                          "Enter Equipment Affected: "],
                    ([building, roomNumber, hazard, equipmentAffected]) => submit(() =>
                      new MaintenanceRequest(common, { building, roomNumber,
                        hazardLevel: matchOption(hazard, MaintenanceRequest.HAZARDS), equipmentAffected })));
                } else if (category === 'Cleaning and Sanitation') {
                  askAll(["Enter Cleaning Area: ", "Enter Hygiene Risk (Low/Medium/High): ",
                          "Enter Service Type: ", "Enter Preferred Service Time: "],
                    ([cleaningArea, risk, serviceType, preferredServiceTime]) => submit(() =>
                      new CleaningRequest(common, { cleaningArea,
                        hygieneRisk: matchOption(risk, CleaningRequest.RISKS), serviceType, preferredServiceTime })));
                } else {
                  // General Campus Service, or an unsupported category (rejected by validate())
                  submit(() => new ServiceRequest(common.requestID, user, title, description, campusLocation, category, common.priority));
                }
              });
            });
          });
        });
      });
    });
  });
}

// ---------- 3. View Request by ID ----------
function promptViewRequestById() {
  rl.question("Enter Request ID to view: ", (requestId) => {
    const request = manager.findRequestById(requestId);
    if (request) {
      console.log(`\n${request.getRequestSummary()}`);
      console.log(`Description: ${request.description}`);
      console.log(`Location: ${request.campusLocation}`);
      console.log(`Assigned Technician: ${request.assignedTechnicianID ?? 'None'}`);
      console.log(`Target Resolution: ${request.getTargetResolutionHours()} hours | Priority Score: ${request.calculatePriorityScore()}`);
      console.log(`Submitted: ${request.dateSubmitted} | Updated: ${request.dateUpdated}`);
    } else {
      console.log("\nError: Request not found.");
    }
    displayMenu();
  });
}

// ---------- 4. View My Requests ----------
function promptViewMyRequests() {
  rl.question("Enter User ID to view requests for: ", (userId) => {
    const userRequests = manager.getRequestsByUser(userId);
    if (userRequests.length === 0) {
      console.log("\nNo requests found for this user ID.");
    } else {
      console.log(`\n--- Requests for User: ${userId} ---`);
      userRequests.forEach(req => console.log(req.getRequestSummary()));
    }
    displayMenu();
  });
}

// ---------- 5. View All Requests ----------
function promptViewAllRequests() {
  const allRequests = manager.getAllRequests();
  if (allRequests.length === 0) {
    console.log("\nNo service requests recorded in the system.");
  } else {
    console.log("\n--- All Service Requests ---");
    allRequests.forEach(req => console.log(req.getRequestSummary()));
  }
  displayMenu();
}

// ---------- 6. Update My Request ----------
function promptUpdateMyRequest() {
  rl.question("Enter Request ID to update: ", (requestId) => {
    rl.question("Enter Your User ID (Owner verification): ", (userId) => {
      const request = manager.findRequestById(requestId);
      if (!request) {
        console.log("\nError: Request not found.");
        return displayMenu();
      }
      console.log("Leave blank if you do not want to change a particular field.");
      console.log("Allowed Categories: ICT Support, Facilities Maintenance, Cleaning and Sanitation, General Campus Service");
      console.log("Allowed Priorities: Low, Normal, High, Urgent");
      const specialisedKeys = request.constructor.KEYS || [];   // only specialised requests have these
      const prompts = [
        "Enter New Title (or press Enter to skip): ",
        "Enter New Description (or press Enter to skip): ",
        "Enter New Category (or press Enter to skip): ",
        "Enter New Priority (or press Enter to skip): ",
        ...specialisedKeys.map(k => `Enter New ${k} (or press Enter to skip): `)
      ];
      askAll(prompts, (answers) => {
        const [title, description, category, priority, ...extra] = answers;
        const changes = {};
        if (title) changes.title = title;
        if (description) changes.description = description;
        if (category) changes.category = toCategory(category);
        if (priority) changes.priority = priority;
        specialisedKeys.forEach((k, i) => { if (extra[i]) changes[k] = extra[i]; });
        runAction(() => manager.updateRequest(requestId, userId, changes), "Request updated successfully.");
      });
    });
  });
}

// ---------- 7. Cancel My Request ----------
function promptCancelMyRequest() {
  rl.question("Enter Request ID to cancel: ", (requestId) => {
    rl.question("Enter Your User ID (Owner verification): ", (userId) => {
      runAction(() => manager.cancelRequest(requestId, userId), "Request has been cancelled.");
    });
  });
}

// ---------- 8. Search Requests ----------
function promptSearchRequests() {
  rl.question("Enter search keyword (request ID or title): ", (keyword) => {
    const results = manager.searchRequests(keyword);
    if (results.length > 0) console.log(`\n--- Search Results (${results.length}) ---`);
    showRequests(results);
    displayMenu();
  });
}

// ---------- 9. View Request Summary ----------
function promptViewSummary() {
  const summary = manager.getRequestSummaryByStatus();
  console.log("\n--- Request Summary by Status ---");
  Object.entries(summary).forEach(([status, count]) => console.log(`${status}: ${count}`));
  displayMenu();
}

// ---------- Credit: workflow ----------
function promptReview() {
  askAll(["Enter Service Officer ID: ", "Enter Request ID: ", "Enter comment (optional): "],
    ([officerId, requestId, comment]) =>
      runAction(() => manager.reviewRequest(requestId, officerId, comment), "Request reviewed. Status is now Reviewed."));
}

function promptAssignPriority() {
  askAll(["Enter Service Officer ID: ", "Enter Request ID: ", "Allowed Priorities: Low, Normal, High, Urgent\nEnter Priority: "],
    ([officerId, requestId, priority]) =>
      runAction(() => manager.assignPriority(requestId, officerId, matchOption(priority, ServiceRequest.ALLOWED_PRIORITIES)),
        "Priority assigned."));
}

function promptAssignTechnician() {
  askAll(["Enter Service Officer ID: ", "Enter Request ID: ", "Enter Technician ID: "],
    ([officerId, requestId, technicianId]) =>
      runAction(() => manager.assignTechnician(requestId, officerId, technicianId),
        "Technician assigned. Status is now Assigned."));
}

function promptStartWork() {
  askAll(["Enter Technician ID: ", "Enter Request ID: "],
    ([technicianId, requestId]) =>
      runAction(() => manager.startWork(requestId, technicianId), "Work started. Status is now In Progress."));
}

function promptRecordProgress() {
  askAll(["Enter Technician ID: ", "Enter Request ID: ", "Enter progress note: "],
    ([technicianId, requestId, note]) =>
      runAction(() => manager.recordProgress(requestId, technicianId, note), "Progress update recorded."));
}

function promptResolve() {
  askAll(["Enter Technician ID: ", "Enter Request ID: "],
    ([technicianId, requestId]) =>
      runAction(() => manager.resolveRequest(requestId, technicianId), "Request resolved. Status is now Resolved."));
}

function promptClose() {
  askAll(["Enter Service Officer ID: ", "Enter Request ID: "],
    ([officerId, requestId]) =>
      runAction(() => manager.closeRequest(requestId, officerId), "Request verified and closed. Status is now Closed."));
}

// ---------- Credit: filter, sort, history ----------
function promptFilter() {
  console.log("Leave a question blank to skip that filter.");
  console.log("Categories: 1. ICT Support | 2. Facilities Maintenance | 3. Cleaning and Sanitation | 4. General Campus Service");
  askAll(["Filter by category (1-4 or name): ",
          `Filter by status (${ServiceRequest.STATUSES.join('/')}): `,
          "Filter by priority (Low/Normal/High/Urgent): ",
          "Filter by assigned Technician ID: "],
    ([category, status, priority, technicianID]) => {
      try {
        const criteria = {};
        if (category) criteria.category = toCategory(category);
        if (status) criteria.status = matchOption(status, ServiceRequest.STATUSES);
        if (priority) criteria.priority = matchOption(priority, ServiceRequest.ALLOWED_PRIORITIES);
        if (technicianID) criteria.technicianID = technicianID;
        if (criteria.category && !ServiceRequest.ALLOWED_CATEGORIES.includes(criteria.category)) throw new Error(`Unsupported category: ${criteria.category}`);
        if (criteria.status && !ServiceRequest.STATUSES.includes(criteria.status)) throw new Error(`Unsupported status: ${criteria.status}`);
        if (criteria.priority && !ServiceRequest.ALLOWED_PRIORITIES.includes(criteria.priority)) throw new Error(`Unsupported priority value: ${criteria.priority}`);
        console.log("\n--- Filter Results ---");
        showRequests(manager.filterRequests(criteria));
      } catch (error) {
        console.log(`\nError: ${error.message}`);
      }
      displayMenu();
    });
}

function promptSort() {
  console.log("1. Date submitted (oldest first)");
  console.log("2. Date submitted (newest first)");
  console.log("3. Priority (highest first)");
  console.log("4. Priority (lowest first)");
  rl.question("Choose sort option (1-4): ", (choice) => {
    const sorters = {
      '1': () => manager.sortByDate(undefined, true),
      '2': () => manager.sortByDate(undefined, false),
      '3': () => manager.sortByPriority(undefined, true),
      '4': () => manager.sortByPriority(undefined, false)
    };
    const sorter = sorters[choice.trim()];
    if (!sorter) {
      console.log("\nError: Please choose a number from 1 to 4.");
    } else {
      console.log("\n--- Sorted Requests ---");
      showRequests(sorter());
    }
    displayMenu();
  });
}

function promptHistory() {
  rl.question("Enter Request ID: ", (requestId) => {
    const request = manager.findRequestById(requestId);
    if (!request) {
      console.log("\nError: Request not found.");
    } else {
      console.log(`\n--- History for ${request.requestID} ---`);
      request.history.forEach((h, i) => {
        console.log(`${i + 1}. ${h.dateTime.toLocaleString()} | ${h.previousStatus ?? '-'} -> ${h.newStatus} | ${h.action} | ${h.actorRole} ${h.actorID} | ${h.comment}`);
      });
    }
    displayMenu();
  });
}

// Start the application loop
displayMenu();
