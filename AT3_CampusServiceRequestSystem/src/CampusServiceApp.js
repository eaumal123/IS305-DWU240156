/*
  Program: CampusServiceApp
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 25th September 2026
*/

const readline = require('readline');
const User = require('./User');
const ServiceRequest = require('./ServiceRequest');
const ServiceRequestManager = require('./ServiceRequestManager');

const manager = new ServiceRequestManager();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
  console.log("10. Exit");
  console.log("============================================");
  rl.question("Select an option (1-10): ", handleMenuChoice);
}

function handleMenuChoice(choice) {
  switch (choice.trim()) {
    case '1':
      promptRegisterUser();
      break;
    case '2':
      promptSubmitRequest();
      break;
    case '3':
      promptViewRequestById();
      break;
    case '4':
      promptViewMyRequests();
      break;
    case '5':
      promptViewAllRequests();
      break;
    case '6':
      promptUpdateMyRequest();
      break;
    case '7':
      promptCancelMyRequest();
      break;
    case '8':
      promptSearchRequests();
      break;
    case '9':
      promptViewSummary();
      break;
    case '10':
      console.log("Exiting Campus Service Request System. Goodbye!");
      rl.close();
      break;
    default:
      console.log("Invalid option. Please enter a number between 1 and 10.");
      displayMenu();
      break;
  }
}

// 1. Register User
function promptRegisterUser() {
  rl.question("Enter User ID: ", (userId) => {
    rl.question("Enter First Name: ", (firstName) => {
      rl.question("Enter Last Name: ", (lastName) => {
        rl.question("Enter Email Address: ", (email) => {
          rl.question("Enter User Type (e.g. Student/Staff): ", (userType) => {
            try {
              const user = new User(userId, firstName, lastName, email, userType);
              manager.registerUser(user);
              console.log("\nSuccess: User registered successfully.");
            } catch (error) {
              console.log(`\nError: ${error.message}`);
            }
            displayMenu();
          });
        });
      });
    });
  });
}

// 2. Submit Service Request
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
            rl.question("Enter Category: ", (category) => {
              console.log("Allowed Priorities: Low, Normal, High, Urgent");
              rl.question("Enter Priority: ", (priority) => {
                try {
                  const request = new ServiceRequest(requestId, user, title, description, campusLocation, category, priority);
                  manager.submitRequest(request);
                  console.log("\nSuccess: Service request submitted successfully with 'Submitted' status.");
                } catch (error) {
                  console.log(`\nError: ${error.message}`);
                }
                displayMenu();
              });
            });
          });
        });
      });
    });
  });
}

// 3. View Request by ID
function promptViewRequestById() {
  rl.question("Enter Request ID to view: ", (requestId) => {
    const request = manager.findRequestById(requestId);
    if (request) {
      console.log(`\n${request.getRequestSummary()}`);
      console.log(`Description: ${request.description}`);
      console.log(`Location: ${request.campusLocation}`);
      console.log(`Submitted: ${request.dateSubmitted} | Updated: ${request.dateUpdated}`);
    } else {
      console.log("\nError: Request not found.");
    }
    displayMenu();
  });
}

// 4. View My Requests
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

// 5. View All Requests
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

// 6. Update My Request
function promptUpdateMyRequest() {
  rl.question("Enter Request ID to update: ", (requestId) => {
    rl.question("Enter Your User ID (Owner verification): ", (userId) => {
      console.log("Leave blank if you do not want to change a particular field.");
      rl.question("Enter New Title (or press Enter to skip): ", (title) => {
        rl.question("Enter New Description (or press Enter to skip): ", (description) => {
          console.log("Allowed Categories: ICT Support, Facilities Maintenance, Cleaning and Sanitation, General Campus Service");
          rl.question("Enter New Category (or press Enter to skip): ", (category) => {
            console.log("Allowed Priorities: Low, Normal, High, Urgent");
            rl.question("Enter New Priority (or press Enter to skip): ", (priority) => {
              try {
                const changes = {};
                if (title.trim()) changes.title = title;
                if (description.trim()) changes.description = description;
                if (category.trim()) changes.category = category;
                if (priority.trim()) changes.priority = priority;

                manager.updateRequest(requestId, userId, changes);
                console.log("\nSuccess: Request updated successfully.");
              } catch (error) {
                console.log(`\nError: ${error.message}`);
              }
              displayMenu();
            });
          });
        });
      });
    });
  });
}

// 7. Cancel My Request
function promptCancelMyRequest() {
  rl.question("Enter Request ID to cancel: ", (requestId) => {
    rl.question("Enter Your User ID (Owner verification): ", (userId) => {
      try {
        manager.cancelRequest(requestId, userId);
        console.log("\nSuccess: Request has been cancelled.");
      } catch (error) {
        console.log(`\nError: ${error.message}`);
      }
      displayMenu();
    });
  });
}

// 8. Search Requests
function promptSearchRequests() {
  rl.question("Enter search keyword (title/description): ", (keyword) => {
    const results = manager.searchRequests(keyword);
    if (results.length === 0) {
      console.log("\nNo matching requests found.");
    } else {
      console.log(`\n--- Search Results (${results.length}) ---`);
      results.forEach(req => console.log(req.getRequestSummary()));
    }
    displayMenu();
  });
}

// 9. View Request Summary
function promptViewSummary() {
  const summary = manager.getRequestSummaryByStatus();
  console.log("\n--- Request Summary by Status ---");
  console.log(`Submitted: ${summary.Submitted}`);
  console.log(`Cancelled: ${summary.Cancelled}`);
  displayMenu();
}

// Start the application loop
displayMenu();