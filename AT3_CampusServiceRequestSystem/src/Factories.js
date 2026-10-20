/*
  Program: Distinction Component - Factories
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 20th October 2026

  JSON files hold plain data, not class objects. These factories rebuild the
  correct specialised object from a saved record, so restored objects keep their
  validation, overridden methods and polymorphic behaviour.
*/

const { StudentRequester, StaffRequester, ServiceOfficer, Technician } = require('./SpecialisedUsers');
const { ICTSupportRequest, MaintenanceRequest, CleaningRequest, GeneralServiceRequest } = require('./SpecialisedRequests');

class UserFactory {
    static createFromData(data) {
        if (!data || typeof data !== 'object') throw new Error("The saved user record is not valid.");
        const { userId, firstName, lastName, emailAddress, userType } = data;

        let user;
        switch (userType) {
            case 'Student':
                user = new StudentRequester(userId, firstName, lastName, emailAddress, data.programme, data.yearLevel);
                break;
            case 'Staff':
                user = new StaffRequester(userId, firstName, lastName, emailAddress, data.department);
                break;
            case 'Service Officer':
                user = new ServiceOfficer(userId, firstName, lastName, emailAddress, data.serviceSection);
                break;
            case 'Technician':
                user = new Technician(userId, firstName, lastName, emailAddress, data.speciality);
                break;
            default:
                throw new Error(`Unknown saved user type: ${userType}`);
        }
        user.validate();
        return user;
    }
}

const REQUEST_TYPES = { ICTSupportRequest, MaintenanceRequest, CleaningRequest, GeneralServiceRequest };

class ServiceRequestFactory {
    static TYPES = Object.keys(REQUEST_TYPES);

    // savedData: one record from serviceRequests.json
    // options.findUser: function that returns the User object for an ID (needed for the requester)
    // options.history: the records from requestHistory.json that belong to this request
    static createFromData(savedData, { findUser, history = [] } = {}) {
        if (!savedData || typeof savedData !== 'object') throw new Error("The saved request record is not valid.");
        if (!Object.hasOwn(REQUEST_TYPES, savedData.requestType)) {
            throw new Error(`Unknown saved request type: ${savedData.requestType}`);
        }
        if (typeof findUser !== 'function') throw new Error("A findUser function is required to restore the requester.");

        const requester = findUser(savedData.requesterId);
        if (!requester) throw new Error(`Requester '${savedData.requesterId}' was not found.`);

        const RequestClass = REQUEST_TYPES[savedData.requestType];
        const common = {
            requestID: savedData.requestId,
            requester,
            title: savedData.title,
            description: savedData.description,
            campusLocation: savedData.location,
            priority: savedData.priority
        };
        const request = new RequestClass(common, savedData.specialisedData ?? {});   // runs the specialised validation

        if (savedData.category !== undefined && savedData.category !== request.category) {
            throw new Error(`Saved category '${savedData.category}' does not match ${savedData.requestType}.`);
        }

        request.restoreState({
            status: savedData.status,
            priorityAssigned: savedData.priorityAssigned,
            assignedTechnicianId: savedData.assignedTechnicianId,
            progressUpdates: savedData.progressUpdates,
            dateSubmitted: savedData.dateSubmitted,
            dateUpdated: savedData.dateUpdated,
            history
        });
        request.validate();
        return request;
    }
}

module.exports = { UserFactory, ServiceRequestFactory };
