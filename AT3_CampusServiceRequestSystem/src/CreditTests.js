/*
  Program: Credit Component - Automated tests
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 19th October 2026
  Run from the project root:  node src/CreditTests.js
*/

const assert = require('assert');
const User = require('./User');
const ServiceRequest = require('./ServiceRequest');
const ServiceRequestManager = require('./ServiceRequestManager');
const { StudentRequester, StaffRequester, ServiceOfficer, Technician } = require('./SpecialisedUsers');
const { ICTSupportRequest, MaintenanceRequest, CleaningRequest } = require('./SpecialisedRequests');

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log(`  PASS  ${name}`); }
  catch (e) { console.log(`  FAIL  ${name}\n        ${e.message}`); process.exitCode = 1; }
}

// A fresh manager and a set of users for every test
function setup() {
  const m = new ServiceRequestManager();
  const student = new StudentRequester('S1', 'Ana', 'Kila', 'ana@uni.edu', 'Information Technology', 2);
  const student2 = new StudentRequester('S2', 'Joe', 'Mai', 'joe@uni.edu', 'Business', 1);
  const staff = new StaffRequester('ST1', 'Ben', 'Aru', 'ben@uni.edu', 'Commerce');
  const officer = new ServiceOfficer('O1', 'Oli', 'Toa', 'oli@uni.edu', 'Facilities');
  const tech = new Technician('T1', 'Tim', 'Vai', 'tim@uni.edu', 'Networks');
  const tech2 = new Technician('T2', 'Tara', 'Lui', 'tara@uni.edu', 'Electrical');
  [student, student2, staff, officer, tech, tech2].forEach(u => m.registerUser(u));
  return { m, student, student2, staff, officer, tech, tech2 };
}

const ict = (requester, id = 'REQ-1') => new ICTSupportRequest(
  { requestID: id, requester, title: 'Lab Wi-Fi down', description: 'No connection', campusLocation: 'Lab 3', priority: 'High' },
  { deviceType: 'Laptop', systemName: 'Moodle', faultType: 'Connectivity', networkImpact: 'Department' });
const maint = (requester, id = 'REQ-2') => new MaintenanceRequest(
  { requestID: id, requester, title: 'Broken socket', description: 'Sparks', campusLocation: 'Block B', priority: 'High' },
  { building: 'B', roomNumber: '204', hazardLevel: 'High', equipmentAffected: 'Power outlet' });
const clean = (requester, id = 'REQ-3') => new CleaningRequest(
  { requestID: id, requester, title: 'Spill in canteen', description: 'Floor spill', campusLocation: 'Canteen', priority: 'Normal' },
  { cleaningArea: 'Canteen', hygieneRisk: 'Medium', serviceType: 'Spot clean', preferredServiceTime: '14:00' });
const general = (requester, id = 'G-1', category = 'General Campus Service') => new ServiceRequest(
  id, requester, 'Faded sign', 'Sign needs repainting', 'Main gate', category, 'Low');

console.log('\nPass tests (still working after the Credit changes)');
test('Valid user registration', () => {
  const { m } = setup();
  assert.ok(m.findUserById('S1'));
});
test('Duplicate user ID rejected', () => {
  const { m } = setup();
  assert.throws(() => m.registerUser(new StaffRequester('S1', 'X', 'Y', 'x@y.com', 'Dept')), /Duplicate user ID: User with ID 'S1'/);
});
test('Valid request submission stores a Submitted request', () => {
  const { m, student } = setup();
  m.submitRequest(general(student));
  assert.strictEqual(m.findRequestById('G-1').status, 'Submitted');
});
test('Invalid request category rejected', () => {
  const { m, student } = setup();
  assert.throws(() => m.submitRequest(general(student, 'G-2', 'Gardening')), /Unsupported category: Gardening/);
  assert.strictEqual(m.findRequestById('G-2'), null);
});
test('View requester records shows only that user', () => {
  const { m, student, student2 } = setup();
  m.submitRequest(general(student, 'A')); m.submitRequest(general(student2, 'B'));
  assert.deepStrictEqual(m.getRequestsByUser('S1').map(r => r.requestID), ['A']);
});
test('Cancel Submitted request; other user and double cancel rejected', () => {
  const { m, student } = setup();
  m.submitRequest(general(student));
  assert.throws(() => m.cancelRequest('G-1', 'S2'), /Unauthorized cancellation/);
  m.cancelRequest('G-1', 'S1');
  assert.strictEqual(m.findRequestById('G-1').status, 'Cancelled');
  assert.throws(() => m.cancelRequest('G-1', 'S1'), /already marked Cancelled/);
});
test('Update by another user rejected; own update works', () => {
  const { m, student } = setup();
  m.submitRequest(general(student));
  assert.throws(() => m.updateRequest('G-1', 'S2', { title: 'Hacked' }), /Unauthorized update/);
  m.updateRequest('G-1', 'S1', { title: 'Faded sign (urgent)', priority: 'Urgent' });
  assert.strictEqual(m.findRequestById('G-1').title, 'Faded sign (urgent)');
});

console.log('\nCredit tests');
test('1. Subclass constructors correctly call super()', () => {
  const { student, staff, officer, tech } = setup();
  for (const u of [student, staff, officer, tech]) {
    assert.ok(u instanceof User);
    assert.ok(u.getuserID() && u.getFullName() && u.getuserType());   // set by the User constructor
  }
  assert.strictEqual(student.getuserType(), 'Student');
  assert.strictEqual(officer.getuserType(), 'Service Officer');
  assert.strictEqual(tech.speciality, 'Networks');
  const r = ict(student);
  assert.ok(r instanceof ServiceRequest);
  assert.strictEqual(r.requestID, 'REQ-1');            // set by the ServiceRequest constructor
  assert.strictEqual(r.status, 'Submitted');
  assert.strictEqual(r.category, 'ICT Support');
  assert.strictEqual(r.history.length, 1);
});
test('2. Specialised fields are validated', () => {
  const { student } = setup();
  const c = { requestID: 'X', requester: student, title: 't', description: 'd', campusLocation: 'l', priority: 'Normal' };
  assert.throws(() => new ICTSupportRequest(c, { deviceType: 'PC', systemName: '', faultType: 'f', networkImpact: 'None' }), /System name/);
  assert.throws(() => new ICTSupportRequest(c, { deviceType: 'PC', systemName: 's', faultType: 'f', networkImpact: 'Huge' }), /Network impact/);
  assert.throws(() => new MaintenanceRequest(c, { building: 'B', roomNumber: '1', hazardLevel: 'Extreme', equipmentAffected: 'e' }), /Hazard level/);
  assert.throws(() => new CleaningRequest(c, { cleaningArea: '', hygieneRisk: 'Low', serviceType: 's', preferredServiceTime: '9' }), /Cleaning area/);
  assert.throws(() => new StudentRequester('S9', 'A', 'B', 'a@b.com', 'IT', 0), /Year level/);
  const r = ict(student);
  assert.throws(() => r.updateDetails('S1', 'New title', undefined, undefined, undefined, { networkImpact: 'Bogus' }), /Network impact/);
  assert.strictEqual(r.title, 'Lab Wi-Fi down');                 // failed update changed nothing
  assert.throws(() => r.updateDetails('S1', undefined, undefined, 'Cleaning and Sanitation'), /cannot be changed/);
  r.updateDetails('S1', undefined, undefined, undefined, undefined, { networkImpact: 'Campus-wide' });
  assert.strictEqual(r.networkImpact, 'Campus-wide');
  assert.match(r.history[r.history.length - 1].comment, /networkImpact/);   // history names the specialised field
});
test('3. Only Service Officers can assign Technicians', () => {
  const { m, student } = setup();
  m.submitRequest(ict(student));
  m.reviewRequest('REQ-1', 'O1');
  m.assignPriority('REQ-1', 'O1', 'Urgent');
  assert.throws(() => m.assignTechnician('REQ-1', 'S1', 'T1'), /Only a Service Officer/);
  assert.throws(() => m.assignTechnician('REQ-1', 'T1', 'T1'), /Only a Service Officer/);
  assert.throws(() => m.assignTechnician('REQ-1', 'O1', 'S1'), /must be a Technician/);
  m.assignTechnician('REQ-1', 'O1', 'T1');
  assert.strictEqual(m.findRequestById('REQ-1').status, 'Assigned');
  assert.strictEqual(m.findRequestById('REQ-1').assignedTechnicianID, 'T1');
});
test('   Only Service Officers can review; priority needed before assignment', () => {
  const { m, student } = setup();
  m.submitRequest(ict(student));
  assert.throws(() => m.reviewRequest('REQ-1', 'T1'), /Only a Service Officer/);
  assert.throws(() => m.reviewRequest('REQ-1', 'S1'), /Only a Service Officer/);
  m.reviewRequest('REQ-1', 'O1');
  assert.throws(() => m.assignTechnician('REQ-1', 'O1', 'T1'), /priority must be assigned/);
});
test('4. Only assigned Technicians can update work progress', () => {
  const { m, student } = setup();
  m.submitRequest(ict(student));
  m.reviewRequest('REQ-1', 'O1'); m.assignPriority('REQ-1', 'O1', 'Urgent'); m.assignTechnician('REQ-1', 'O1', 'T1');
  assert.throws(() => m.startWork('REQ-1', 'T2'), /assigned Technician/);
  assert.throws(() => m.startWork('REQ-1', 'O1'), /assigned Technician/);
  m.startWork('REQ-1', 'T1');
  assert.throws(() => m.recordProgress('REQ-1', 'T2', 'x'), /assigned Technician/);
  m.recordProgress('REQ-1', 'T1', 'Replaced switch');
  assert.throws(() => m.resolveRequest('REQ-1', 'T2'), /assigned Technician/);
  m.resolveRequest('REQ-1', 'T1');
  assert.throws(() => m.closeRequest('REQ-1', 'T1'), /Only a Service Officer/);
  m.closeRequest('REQ-1', 'O1');
  const r = m.findRequestById('REQ-1');
  assert.strictEqual(r.status, 'Closed');
  assert.strictEqual(r.progressUpdates.length, 1);
});
test('5. Invalid status transitions are rejected', () => {
  const { m, student, staff } = setup();
  m.submitRequest(ict(student)); m.submitRequest(maint(staff));
  assert.throws(() => m.closeRequest('REQ-1', 'O1'), /Invalid status transition: Submitted -> Closed/);
  assert.throws(() => m.assignTechnician('REQ-1', 'O1', 'T1'), /Invalid status transition: Submitted -> Assigned/);
  m.cancelRequest('REQ-2', 'ST1');
  assert.throws(() => m.reviewRequest('REQ-2', 'O1'), /Invalid status transition: Cancelled -> Reviewed/);
  m.reviewRequest('REQ-1', 'O1');                                   // requester rules once the request has moved on
  assert.throws(() => m.cancelRequest('REQ-1', 'S1'), /Only Submitted requests can be cancelled/);
  assert.throws(() => m.updateRequest('REQ-1', 'S1', { title: 'late' }), /Only Submitted requests can be updated/);
});
test('6. Specialised summaries display the correct information', () => {
  const { student, staff } = setup();
  assert.match(ict(student).getRequestSummary(), /Device: Laptop.*System: Moodle.*Fault: Connectivity.*Network Impact: Department/);
  assert.match(maint(staff).getRequestSummary(), /Building: B.*Room: 204.*Hazard: High.*Equipment: Power outlet/);
  assert.match(clean(student).getRequestSummary(), /Area: Canteen.*Hygiene Risk: Medium.*Service: Spot clean.*Preferred Time: 14:00/);
  assert.strictEqual(maint(staff).getTargetResolutionHours(), 8);
  assert.strictEqual(ict(student).getTargetResolutionHours(), 24);
  assert.strictEqual(ict(student).calculatePriorityScore(), 3 + 4);      // High (3) + Department (2 x 2)
  assert.strictEqual(general(student).getTargetResolutionHours(), 72);   // base version
});
test('7. Search, filter and sort return correct results', () => {
  const { m, student, staff, tech, tech2, officer } = setup();
  m.submitRequest(ict(student)); m.submitRequest(maint(staff)); m.submitRequest(clean(student));
  m.reviewRequest('REQ-1', 'O1'); m.assignPriority('REQ-1', 'O1', 'Low'); m.assignTechnician('REQ-1', 'O1', 'T1');
  m.reviewRequest('REQ-2', 'O1'); m.assignPriority('REQ-2', 'O1', 'Urgent'); m.assignTechnician('REQ-2', 'O1', 'T2');
  const ids = (list) => list.map(r => r.requestID);
  assert.deepStrictEqual(ids(m.searchRequests('req-2')), ['REQ-2']);
  assert.deepStrictEqual(ids(m.searchRequests('wi-fi')), ['REQ-1']);
  assert.deepStrictEqual(m.searchRequests('nothing-here'), []);
  assert.deepStrictEqual(ids(m.filterRequests({ category: 'Cleaning and Sanitation' })), ['REQ-3']);
  assert.deepStrictEqual(ids(m.filterRequests({ status: 'Assigned' })), ['REQ-1', 'REQ-2']);
  assert.deepStrictEqual(ids(m.filterRequests({ priority: 'Urgent' })), ['REQ-2']);
  assert.deepStrictEqual(ids(m.filterRequests({ technicianID: 'T1' })), ['REQ-1']);
  assert.deepStrictEqual(ids(m.filterRequests({ status: 'Assigned', technicianID: 'T2' })), ['REQ-2']);
  // sorting: give each request a different date and priority
  const day = (n) => new Date(Date.now() - n * 86400000);
  const m2 = new ServiceRequestManager();
  m2.registerUser(student);
  const mk = (id, pri, d) => new ServiceRequest(id, student, 't', 'd', 'l', 'ICT Support', pri, 'Submitted', d, d);
  [mk('A', 'Low', day(1)), mk('B', 'Urgent', day(3)), mk('C', 'High', day(2))].forEach(r => m2.submitRequest(r));
  assert.deepStrictEqual(ids(m2.sortByDate()), ['B', 'C', 'A']);
  assert.deepStrictEqual(ids(m2.sortByDate(undefined, false)), ['A', 'C', 'B']);
  assert.deepStrictEqual(ids(m2.sortByPriority()), ['B', 'C', 'A']);
  assert.deepStrictEqual(ids(m2.sortByPriority(undefined, false)), ['A', 'C', 'B']);
  assert.strictEqual(m.getRequestSummaryByStatus().Assigned, 2);
});
test('8. Request history records approved workflow actions', () => {
  const { m, student } = setup();
  m.submitRequest(ict(student));
  m.reviewRequest('REQ-1', 'O1'); m.assignPriority('REQ-1', 'O1', 'High'); m.assignTechnician('REQ-1', 'O1', 'T1');
  m.startWork('REQ-1', 'T1'); m.recordProgress('REQ-1', 'T1', 'Checking cabling'); m.resolveRequest('REQ-1', 'T1');
  m.closeRequest('REQ-1', 'O1');
  const h = m.findRequestById('REQ-1').history;
  assert.deepStrictEqual(h.map(e => e.action), ['Submitted', 'Reviewed', 'Priority assigned',
    'Technician assigned', 'Work started', 'Progress update', 'Resolved', 'Closed']);
  assert.strictEqual(h[1].previousStatus, 'Submitted');
  assert.strictEqual(h[1].newStatus, 'Reviewed');
  assert.strictEqual(h[1].actorID, 'O1');
  assert.strictEqual(h[1].actorRole, 'Service Officer');
  assert.ok(h[1].dateTime instanceof Date && typeof h[1].comment === 'string');
  assert.throws(() => m.closeRequest('REQ-1', 'O1'));                    // rejected actions are not recorded
  assert.strictEqual(m.findRequestById('REQ-1').history.length, 8);
});

console.log(`\n${passed} tests passed${process.exitCode ? ' (with failures above)' : ''}`);
