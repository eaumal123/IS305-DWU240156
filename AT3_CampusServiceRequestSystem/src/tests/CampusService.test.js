/*
  Program: Distinction Component - Automated tests (built-in Node.js test runner)
  Run with:  node --test
  Every test that touches files uses its own temporary folder, never the real data folder.
*/

const { describe, test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

const ServiceRequest = require('../ServiceRequest');
const ServiceRequestManager = require('../ServiceRequestManager');
const ReportGenerator = require('../ReportGenerator');
const { StudentRequester, StaffRequester, ServiceOfficer, Technician } = require('../SpecialisedUsers');
const { ICTSupportRequest, MaintenanceRequest, CleaningRequest, GeneralServiceRequest } = require('../SpecialisedRequests');
const { UserFactory, ServiceRequestFactory } = require('../Factories');
const { createRepositories, UserFileRepository, ServiceRequestFileRepository, RepositoryError } = require('../FileRepositories');

// ---------- helpers ----------
const makeUsers = () => ({
  student: new StudentRequester('S1', 'Ana', 'Kila', 'ana@wpu.example', 'Computing', 2),
  student2: new StudentRequester('S2', 'Joe', 'Bani', 'joe@wpu.example', 'Business', 1),
  staff: new StaffRequester('ST1', 'Mere', 'Tau', 'mere@wpu.example', 'Library'),
  officer: new ServiceOfficer('OFF1', 'Sam', 'Kopi', 'sam@wpu.example', 'Facilities'),
  tech: new Technician('T1', 'Lee', 'Wong', 'lee@wpu.example', 'Networks'),
  tech2: new Technician('T2', 'Pat', 'Dau', 'pat@wpu.example', 'Electrical')
});

const common = (requester, id = 'REQ1', extra = {}) => ({
  requestID: id, requester, title: 'Broken thing', description: 'It is broken',
  campusLocation: 'Library Level 2', priority: 'High', ...extra
});

const ictData = { deviceType: 'Laptop', systemName: 'Campus Wi-Fi', faultType: 'Connectivity', networkImpact: 'Department' };
const maintData = { building: 'Block A', roomNumber: '12', hazardLevel: 'High', equipmentAffected: 'Light fitting' };
const cleanData = { cleaningArea: 'Cafeteria', hygieneRisk: 'Medium', serviceType: 'Spill clean-up', preferredServiceTime: '2pm' };

async function registerAll(manager, users) {
  for (const u of Object.values(users)) await manager.registerUser(u);
}

// Takes a request all the way to Resolved (and optionally Closed)
async function runWorkflow(manager, id, { close = false } = {}) {
  await manager.reviewRequest(id, 'OFF1');
  await manager.assignPriority(id, 'OFF1', 'Urgent');
  await manager.assignTechnician(id, 'OFF1', 'T1');
  await manager.startWork(id, 'T1');
  await manager.recordProgress(id, 'T1', 'Replaced the part');
  await manager.resolveRequest(id, 'T1');
  if (close) await manager.closeRequest(id, 'OFF1');
}

const readJson = async (file) => JSON.parse(await fs.readFile(file, 'utf8'));

// A saved request record, as it appears in serviceRequests.json
const savedICT = (over = {}) => ({
  requestId: 'REQ100', requestType: 'ICTSupportRequest', requesterId: 'S1', title: 'Wi-Fi down',
  description: 'No access', location: 'Library Level 2', category: 'ICT Support', priority: 'High',
  status: 'Submitted', priorityAssigned: false, assignedTechnicianId: null,
  dateSubmitted: '2026-08-10T09:30:00.000Z', dateUpdated: '2026-08-10T09:30:00.000Z',
  progressUpdates: [], specialisedData: { ...ictData }, ...over
});

let dir;
beforeEach(async () => { dir = await fs.mkdtemp(path.join(os.tmpdir(), 'campus-service-test-')); });
afterEach(async () => { await fs.rm(dir, { recursive: true, force: true }); });

async function makeStoredManager() {
  const repos = createRepositories(path.join(dir, 'data'));
  const manager = new ServiceRequestManager(repos);
  await manager.init();
  return { repos, manager };
}

// ---------- construction and validation ----------
describe('construction and validation', () => {
  test('valid users and requests are constructed with the right values', () => {
    const u = makeUsers();
    assert.equal(u.student.getuserType(), 'Student');
    assert.equal(u.student.getRoleDetails(), 'Programme: Computing | Year Level: 2');
    const ict = new ICTSupportRequest(common(u.student), ictData);
    assert.equal(ict.category, 'ICT Support');
    assert.equal(ict.status, 'Submitted');
    assert.equal(ict.deviceType, 'Laptop');
    assert.equal(ict.history.length, 1);
    assert.doesNotThrow(() => ict.validate());
  });

  test('invalid constructor values are rejected', () => {
    const u = makeUsers();
    assert.throws(() => new StudentRequester('S9', 'A', 'B', 'a@b.co', 'Computing', 12), /Year level/);
    assert.throws(() => new StaffRequester('ST9', 'A', 'B', 'a@b.co', '  '), /Department is required/);
    assert.throws(() => new ICTSupportRequest(common(u.student), { ...ictData, deviceType: '' }), /Device type is required/);
    assert.throws(() => new ICTSupportRequest(common(u.student), { ...ictData, networkImpact: 'Huge' }), /Network impact must be/);
    assert.throws(() => new MaintenanceRequest(common(u.student), { ...maintData, hazardLevel: 'Extreme' }), /Hazard level must be/);
    assert.throws(() => new CleaningRequest(common(u.student), { ...cleanData, serviceType: '' }), /Service type is required/);
    assert.throws(() => new ICTSupportRequest(common(u.student, 'R', { title: '' }), ictData).validate(), /Missing request title/);
  });

  test('duplicate user and request identifiers are rejected', async () => {
    const manager = new ServiceRequestManager();
    const u = makeUsers();
    await manager.registerUser(u.student);
    await assert.rejects(manager.registerUser(new StudentRequester('S1', 'X', 'Y', 'x@y.co', 'Law', 1)), /Duplicate user ID/);
    await manager.submitRequest(new ICTSupportRequest(common(u.student), ictData));
    await assert.rejects(manager.submitRequest(new ICTSupportRequest(common(u.student), ictData)), /Duplicate request ID/);
    assert.equal(manager.getAllRequests().length, 1);
  });
});

// ---------- roles and status transitions ----------
describe('role permissions and status transitions', () => {
  let manager, u;
  beforeEach(async () => {
    manager = new ServiceRequestManager();
    u = makeUsers();
    await registerAll(manager, u);
    await manager.submitRequest(new ICTSupportRequest(common(u.student), ictData));
  });

  test('only the right role can perform each action', async () => {
    await assert.rejects(manager.reviewRequest('REQ1', 'S1'), /Only a Service Officer can review/);
    await manager.reviewRequest('REQ1', 'OFF1');
    await assert.rejects(manager.assignPriority('REQ1', 'T1', 'High'), /Only a Service Officer/);
    await manager.assignPriority('REQ1', 'OFF1', 'High');
    await assert.rejects(manager.assignTechnician('REQ1', 'OFF1', 'S2'), /must be a Technician/);
    await manager.assignTechnician('REQ1', 'OFF1', 'T1');
    await assert.rejects(manager.startWork('REQ1', 'T2'), /Only the assigned Technician/);
    await assert.rejects(manager.startWork('REQ1', 'OFF1'), /Only the assigned Technician/);
  });

  test('only the owner can update or cancel a request', async () => {
    await assert.rejects(manager.cancelRequest('REQ1', 'S2'), /Unauthorized cancellation/);
    await assert.rejects(manager.updateRequest('REQ1', 'S2', { title: 'Hijack' }), /Unauthorized update/);
    assert.equal(manager.findRequestById('REQ1').title, 'Broken thing');
  });

  test('status changes follow the controlled flow', async () => {
    await assert.rejects(manager.assignTechnician('REQ1', 'OFF1', 'T1'), /Invalid status transition|priority must be assigned/);
    await assert.rejects(manager.closeRequest('REQ1', 'OFF1'), /Invalid status transition: Submitted -> Closed/);
    await runWorkflow(manager, 'REQ1', { close: true });
    const request = manager.findRequestById('REQ1');
    assert.equal(request.status, 'Closed');
    assert.deepEqual(request.history.map(h => h.newStatus),
      ['Submitted', 'Reviewed', 'Reviewed', 'Assigned', 'In Progress', 'In Progress', 'Resolved', 'Closed']);
    await assert.rejects(manager.cancelRequest('REQ1', 'S1'), /Only Submitted requests can be cancelled/);
  });

  test('a Reviewed request cannot be cancelled and a cancelled one cannot be reviewed', async () => {
    await manager.reviewRequest('REQ1', 'OFF1');
    await assert.rejects(manager.cancelRequest('REQ1', 'S1'), /Only Submitted requests can be cancelled/);
    await manager.submitRequest(new CleaningRequest(common(u.student, 'REQ2'), cleanData));
    await manager.cancelRequest('REQ2', 'S1');
    await assert.rejects(manager.reviewRequest('REQ2', 'OFF1'), /Invalid status transition: Cancelled -> Reviewed/);
  });
});

// ---------- polymorphism ----------
describe('polymorphism and specialised behaviour', () => {
  test('ServiceRequest is abstract-style and requires subclasses to supply methods', () => {
    const u = makeUsers();
    assert.throws(() => new ServiceRequest('R', u.student, 't', 'd', 'loc', 'ICT Support', 'High'), /abstract-style/);

    class Incomplete extends ServiceRequest {
      constructor() { super('R9', u.student, 't', 'd', 'loc', 'ICT Support', 'High'); }
    }
    const incomplete = new Incomplete();
    assert.throws(() => incomplete.calculatePriorityScore(), /Incomplete must implement calculatePriorityScore/);
    assert.throws(() => incomplete.getTargetResolutionHours(), /must implement getTargetResolutionHours/);
    assert.throws(() => incomplete.getRequestSummary(), /must implement getRequestSummary/);
  });

  test('each request type has its own specialised results', () => {
    const u = makeUsers();
    const ict = new ICTSupportRequest(common(u.student, 'A', { priority: 'High' }), { ...ictData, networkImpact: 'Campus-wide' });
    const maint = new MaintenanceRequest(common(u.student, 'B', { priority: 'High' }), maintData);
    const clean = new CleaningRequest(common(u.student, 'C', { priority: 'High' }), { ...cleanData, hygieneRisk: 'High' });
    const general = new GeneralServiceRequest(common(u.student, 'D', { priority: 'High' }));

    assert.equal(ict.calculatePriorityScore(), 3 + 3 * 2);      // base 3 + Campus-wide(3) x 2
    assert.equal(maint.calculatePriorityScore(), 3 + 2 * 3);    // base 3 + High hazard(2) x 3
    assert.equal(clean.calculatePriorityScore(), 3 + 2 * 2);    // base 3 + High risk(2) x 2
    assert.equal(general.calculatePriorityScore(), 3);
    assert.equal(ict.getTargetResolutionHours(), 4);
    assert.equal(maint.getTargetResolutionHours(), 8);
    assert.equal(clean.getTargetResolutionHours(), 6);
    assert.equal(general.getTargetResolutionHours(), 72);
  });

  test('the same method calls process every request type in one collection', () => {
    const u = makeUsers();
    const requests = [
      new ICTSupportRequest(common(u.student, 'A'), ictData),
      new MaintenanceRequest(common(u.student, 'B'), maintData),
      new CleaningRequest(common(u.student, 'C'), cleanData),
      new GeneralServiceRequest(common(u.student, 'D'))
    ];
    const results = [];
    for (const request of requests) {
      results.push([request.getRequestSummary(), request.calculatePriorityScore(), request.getTargetResolutionHours()]);
    }
    assert.match(results[0][0], /Device: Laptop/);
    assert.match(results[1][0], /Building: Block A/);
    assert.match(results[2][0], /Hygiene Risk: Medium/);
    assert.doesNotMatch(results[3][0], /\| Device|\| Building|\| Area/);
    assert.deepEqual(results.map(r => r[1]), [3 + 2 * 2, 3 + 2 * 3, 3 + 1 * 2, 3]);   // each type scores differently
    assert.deepEqual(results.map(r => r[2]), [24, 8, 24, 72]);
  });

  test('specialised update rules protect the category and the specialised fields', async () => {
    const u = makeUsers();
    const manager = new ServiceRequestManager();
    await registerAll(manager, u);
    await manager.submitRequest(new ICTSupportRequest(common(u.student), ictData));
    await assert.rejects(manager.updateRequest('REQ1', 'S1', { category: 'Facilities Maintenance' }), /category of a specialised request cannot be changed/);
    await assert.rejects(manager.updateRequest('REQ1', 'S1', { hazardLevel: 'High' }), /Cannot update field/);
    await assert.rejects(manager.updateRequest('REQ1', 'S1', { networkImpact: 'Huge' }), /Network impact must be/);
    await manager.updateRequest('REQ1', 'S1', { networkImpact: 'Campus-wide', title: 'Wi-Fi outage' });
    const request = manager.findRequestById('REQ1');
    assert.equal(request.networkImpact, 'Campus-wide');
    assert.equal(request.title, 'Wi-Fi outage');
    assert.equal(request.getTargetResolutionHours(), 4);
  });
});

// ---------- repositories ----------
describe('file repositories', () => {
  test('missing data files are created as empty arrays and empty files load as empty', async () => {
    const repo = new UserFileRepository(path.join(dir, 'data', 'users.json'));
    assert.deepEqual(await repo.loadAll(), []);
    assert.deepEqual(await readJson(repo.filePath), []);

    const emptyFile = path.join(dir, 'empty.json');
    await fs.writeFile(emptyFile, '');
    assert.deepEqual(await new UserFileRepository(emptyFile).loadAll(), []);
  });

  test('create, find, update and the finder methods work', async () => {
    const repo = new ServiceRequestFileRepository(path.join(dir, 'requests.json'));
    await repo.create({ requestId: 'R1', requesterId: 'S1', assignedTechnicianId: 'T1', title: 'One' });
    await repo.create({ requestId: 'R2', requesterId: 'S2', assignedTechnicianId: null, title: 'Two' });
    await assert.rejects(repo.create({ requestId: 'R1' }), /Duplicate requestId/);
    await assert.rejects(repo.create({ title: 'no id' }), /without a requestId/);
    assert.equal((await repo.findById('R2')).title, 'Two');
    assert.equal(await repo.findById('NOPE'), null);
    assert.deepEqual((await repo.findByRequester('S1')).map(r => r.requestId), ['R1']);
    assert.deepEqual((await repo.findByTechnician('T1')).map(r => r.requestId), ['R1']);
    const updated = await repo.update('R2', { title: 'Two (edited)', requestId: 'HACK' });
    assert.equal(updated.requestId, 'R2');
    assert.equal((await repo.findById('R2')).title, 'Two (edited)');
    await assert.rejects(repo.update('NOPE', {}), /no record with requestId 'NOPE'/);
  });

  test('file-reading errors are reported clearly and the file is left alone', async () => {
    const corrupt = path.join(dir, 'corrupt.json');
    await fs.writeFile(corrupt, '{ not json');
    const repo = new UserFileRepository(corrupt);
    await assert.rejects(repo.loadAll(), (e) => e instanceof RepositoryError && /Could not read .*corrupt\.json.*not valid JSON/.test(e.message));
    assert.equal(await fs.readFile(corrupt, 'utf8'), '{ not json');

    const notList = path.join(dir, 'object.json');
    await fs.writeFile(notList, '{"a":1}');
    await assert.rejects(new UserFileRepository(notList).loadAll(), /must contain a list of records/);

    const asFolder = path.join(dir, 'folder.json');
    await fs.mkdir(asFolder);
    await assert.rejects(new UserFileRepository(asFolder).loadAll(), /Could not read/);
  });

  test('file-writing errors are reported clearly', async () => {
    const blocker = path.join(dir, 'blocker');
    await fs.writeFile(blocker, 'I am a file, not a folder');
    const repo = new UserFileRepository(path.join(blocker, 'users.json'));
    await assert.rejects(repo.saveAll([]), (e) => e instanceof RepositoryError && /Could not write/.test(e.message));
    await assert.rejects(repo.create({ userId: 'U1' }), /Could not (write|read)/);
    await assert.rejects(new UserFileRepository(path.join(dir, 'x.json')).saveAll('not a list'), /records must be a list/);
  });
});

// ---------- persistence through the manager ----------
describe('saving and restoring through the manager', () => {
  test('users, requests, history and audit records are saved as plain data', async () => {
    const { repos, manager } = await makeStoredManager();
    const u = makeUsers();
    await registerAll(manager, u);
    await manager.submitRequest(new ICTSupportRequest(common(u.student), ictData));
    await runWorkflow(manager, 'REQ1');

    const users = await readJson(repos.users.filePath);
    assert.equal(users.length, 6);
    assert.deepEqual(users[0], { userId: 'S1', firstName: 'Ana', lastName: 'Kila', emailAddress: 'ana@wpu.example',
      userType: 'Student', programme: 'Computing', yearLevel: 2 });
    assert.ok(!JSON.stringify(users).toLowerCase().includes('password'));

    const [saved] = await readJson(repos.requests.filePath);
    assert.equal(saved.requestId, 'REQ1');
    assert.equal(saved.requestType, 'ICTSupportRequest');
    assert.equal(saved.requesterId, 'S1');
    assert.equal(saved.location, 'Library Level 2');
    assert.equal(saved.status, 'Resolved');
    assert.equal(saved.assignedTechnicianId, 'T1');
    assert.equal(saved.specialisedData.networkImpact, 'Department');
    assert.match(saved.dateSubmitted, /^\d{4}-\d{2}-\d{2}T.*Z$/);

    const history = await readJson(repos.history.filePath);
    assert.equal(history.length, manager.findRequestById('REQ1').history.length);
    assert.ok(history.every(h => h.requestId === 'REQ1' && h.dateTime && h.action));
  });

  test('a new session restores the correct specialised objects with the same behaviour', async () => {
    const first = await makeStoredManager();
    const u = makeUsers();
    await registerAll(first.manager, u);
    await first.manager.submitRequest(new ICTSupportRequest(common(u.student, 'REQ1'), { ...ictData, networkImpact: 'Campus-wide' }));
    await first.manager.submitRequest(new MaintenanceRequest(common(u.staff, 'REQ2'), maintData));
    await first.manager.submitRequest(new CleaningRequest(common(u.student2, 'REQ3'), cleanData));
    await first.manager.submitRequest(new GeneralServiceRequest(common(u.student, 'REQ4')));
    await runWorkflow(first.manager, 'REQ1');

    const second = await makeStoredManager();
    const loaded = await second.manager.init();
    assert.equal(loaded.users, 6);
    assert.equal(loaded.requests, 4);
    assert.deepEqual(loaded.warnings, []);

    const types = second.manager.getAllRequests().map(r => r.constructor.name);
    assert.deepEqual(types, ['ICTSupportRequest', 'MaintenanceRequest', 'CleaningRequest', 'GeneralServiceRequest']);
    for (const original of first.manager.getAllRequests()) {
      const restored = second.manager.findRequestById(original.requestID);
      assert.equal(restored.getRequestSummary(), original.getRequestSummary());
      assert.equal(restored.calculatePriorityScore(), original.calculatePriorityScore());
      assert.equal(restored.getTargetResolutionHours(), original.getTargetResolutionHours());
    }

    const restored = second.manager.findRequestById('REQ1');
    assert.equal(restored.status, 'Resolved');
    assert.equal(restored.assignedTechnicianID, 'T1');
    assert.equal(restored.progressUpdates.length, 1);
    assert.equal(restored.history.length, first.manager.findRequestById('REQ1').history.length);
    assert.ok(restored.dateSubmitted instanceof Date);
    assert.equal(second.manager.findUserById('S1').constructor.name, 'StudentRequester');
    await second.manager.closeRequest('REQ1', 'OFF1');            // the workflow carries on after a restart
    assert.equal(second.manager.findRequestById('REQ1').status, 'Closed');
    await assert.rejects(second.manager.updateRequest('REQ2', 'ST1', { hazardLevel: 'Extreme' }), /Hazard level must be/);   // specialised validation still works
  });

  test('invalid saved records are skipped with a warning and left in the file', async () => {
    const { repos } = await makeStoredManager();
    await repos.users.create(makeUsers().student.toData());
    await repos.requests.saveAll([
      savedICT(),
      savedICT({ requestId: 'REQ101', requestType: 'HackRequest' }),
      savedICT({ requestId: 'REQ102', requesterId: 'GHOST' })
    ]);
    const manager = new ServiceRequestManager(repos);
    const loaded = await manager.init();
    assert.equal(loaded.requests, 1);
    assert.equal(loaded.warnings.length, 2);
    assert.match(loaded.warnings[0], /REQ101.*Unknown saved request type/);
    assert.match(loaded.warnings[1], /REQ102.*not found/);
    assert.equal((await repos.requests.loadAll()).length, 3);
  });

  test('invalid requests are not saved', async () => {
    const { repos, manager } = await makeStoredManager();
    const u = makeUsers();
    await registerAll(manager, u);
    await assert.rejects(manager.submitRequest(new ICTSupportRequest(common(u.student, 'REQ1', { title: '' }), ictData)), /Missing request title/);
    await assert.rejects(manager.submitRequest(new ICTSupportRequest(common(new StudentRequester('S77', 'A', 'B', 'a@b.co', 'IT', 1)), ictData)), /not a registered user/);
    await assert.rejects(manager.registerUser(new StudentRequester('', 'A', 'B', 'a@b.co', 'IT', 1)), /Missing user ID/);
    assert.deepEqual(await readJson(repos.requests.filePath), []);
    assert.equal((await readJson(repos.users.filePath)).length, 6);
  });

  test('a failed save reports the error and leaves memory unchanged', async () => {
    const { repos, manager } = await makeStoredManager();
    const u = makeUsers();
    await registerAll(manager, u);
    await manager.submitRequest(new ICTSupportRequest(common(u.student), ictData));

    await fs.rm(repos.requests.filePath);
    await fs.mkdir(repos.requests.filePath);                      // now the requests file cannot be read or written
    await assert.rejects(manager.reviewRequest('REQ1', 'OFF1'), /Could not (read|write)/);
    assert.equal(manager.findRequestById('REQ1').status, 'Submitted');
    assert.equal(manager.findRequestById('REQ1').history.length, 1);

    await fs.rm(repos.users.filePath);
    await fs.mkdir(repos.users.filePath);
    await assert.rejects(manager.registerUser(new StudentRequester('S50', 'A', 'B', 'a@b.co', 'IT', 1)), /Could not (read|write)/);
    assert.equal(manager.findUserById('S50'), null);
  });
});

// ---------- factory ----------
describe('ServiceRequestFactory', () => {
  const users = makeUsers();
  const findUser = (id) => Object.values(users).find(x => x.getuserID() === id) || null;

  test('rebuilds each request type from saved data', () => {
    const ict = ServiceRequestFactory.createFromData(savedICT(), { findUser });
    assert.ok(ict instanceof ICTSupportRequest);
    assert.equal(ict.getTargetResolutionHours(), 24);
    const maint = ServiceRequestFactory.createFromData(savedICT({
      requestType: 'MaintenanceRequest', category: 'Facilities Maintenance', specialisedData: maintData }), { findUser });
    assert.ok(maint instanceof MaintenanceRequest);
    const clean = ServiceRequestFactory.createFromData(savedICT({
      requestType: 'CleaningRequest', category: 'Cleaning and Sanitation', specialisedData: cleanData }), { findUser });
    assert.ok(clean instanceof CleaningRequest);
  });

  test('rejects unknown types, missing requesters and inconsistent data', () => {
    assert.throws(() => ServiceRequestFactory.createFromData(savedICT({ requestType: 'constructor' }), { findUser }), /Unknown saved request type/);
    assert.throws(() => ServiceRequestFactory.createFromData(savedICT({ requesterId: 'NOPE' }), { findUser }), /not found/);
    assert.throws(() => ServiceRequestFactory.createFromData(savedICT(), {}), /findUser function is required/);
    assert.throws(() => ServiceRequestFactory.createFromData(savedICT({ status: 'Flying' }), { findUser }), /Unsupported status/);
    assert.throws(() => ServiceRequestFactory.createFromData(savedICT({ status: 'Assigned' }), { findUser }), /must have an assigned Technician/);
    assert.throws(() => ServiceRequestFactory.createFromData(savedICT({ dateSubmitted: 'not a date' }), { findUser }), /Invalid date submitted/);
    assert.throws(() => ServiceRequestFactory.createFromData(savedICT({ specialisedData: { ...ictData, deviceType: '' } }), { findUser }), /Device type is required/);
    assert.throws(() => ServiceRequestFactory.createFromData(savedICT({ category: 'Facilities Maintenance' }), { findUser }), /does not match/);
    assert.throws(() => UserFactory.createFromData({ userId: 'X', userType: 'Wizard' }), /Unknown saved user type/);
  });
});

// ---------- audit trail ----------
describe('audit trail', () => {
  test('every required action is recorded with the required fields', async () => {
    const { repos, manager } = await makeStoredManager();
    const u = makeUsers();
    await registerAll(manager, u);
    await manager.submitRequest(new ICTSupportRequest(common(u.student, 'REQ1'), ictData));
    await manager.updateRequest('REQ1', 'S1', { title: 'Updated title' });
    await runWorkflow(manager, 'REQ1', { close: true });
    await manager.submitRequest(new CleaningRequest(common(u.student, 'REQ2'), cleanData));
    await manager.cancelRequest('REQ2', 'S1');
    await assert.rejects(manager.reviewRequest('REQ2', 'S1'));

    const log = await readJson(repos.audit.filePath);
    const actions = new Set(log.map(e => e.action));
    for (const expected of ['User registration', 'Request created', 'Request updated', 'Priority changed', 'Technician assigned',
      'Status changed', 'Request cancelled', 'Request resolved', 'Request closed']) {
      assert.ok(actions.has(expected), `missing audit action: ${expected}`);
    }
    for (const entry of log) {
      for (const field of ['auditId', 'actorId', 'actorRole', 'action', 'requestId', 'description', 'dateTime', 'outcome']) {
        assert.ok(field in entry, `audit entry missing ${field}`);
      }
      assert.ok(!Number.isNaN(Date.parse(entry.dateTime)));
    }
    assert.equal(new Set(log.map(e => e.auditId)).size, log.length);      // IDs are unique
    const rejected = log.at(-1);
    assert.equal(rejected.actorId, 'S1');
    assert.match(rejected.outcome, /^Rejected: Only a Service Officer/);
    assert.equal((await manager.getAuditEntries('REQ2')).length, 3);        // created, cancelled, rejected review
  });
});

// ---------- reports ----------
describe('management reports', () => {
  const users = makeUsers();
  const findUser = (id) => Object.values(users).find(x => x.getuserID() === id) || null;
  const hour = 60 * 60 * 1000;
  const t0 = new Date('2026-08-10T00:00:00.000Z');
  const iso = (hoursAfter) => new Date(t0.getTime() + hoursAfter * hour).toISOString();
  const history = (id, resolvedAfterHours) => [
    { historyId: `${id}-H1`, requestId: id, previousStatus: null, newStatus: 'Submitted', action: 'Submitted', actorId: 'S1', actorRole: 'Student', comment: '', dateTime: iso(0) },
    { historyId: `${id}-H2`, requestId: id, previousStatus: 'In Progress', newStatus: 'Resolved', action: 'Resolved', actorId: 'T1', actorRole: 'Technician', comment: '', dateTime: iso(resolvedAfterHours) }
  ];
  const build = (data, hist = []) => ServiceRequestFactory.createFromData(data, { findUser, history: hist });

  const requests = [
    build(savedICT({ requestId: 'A', priority: 'Urgent', dateSubmitted: iso(0), specialisedData: { ...ictData, networkImpact: 'Campus-wide' } })),
    build(savedICT({ requestId: 'B', priority: 'Low', location: 'Block A', dateSubmitted: iso(0), specialisedData: { ...ictData, networkImpact: 'None' } })),
    build(savedICT({ requestId: 'C', priority: 'Urgent', status: 'Resolved', assignedTechnicianId: 'T1', priorityAssigned: true, dateSubmitted: iso(0) }), history('C', 6)),
    build(savedICT({ requestId: 'D', priority: 'Normal', status: 'Closed', assignedTechnicianId: 'T1', priorityAssigned: true, dateSubmitted: iso(0) }), history('D', 10)),
    build(savedICT({ requestId: 'E', requestType: 'MaintenanceRequest', category: 'Facilities Maintenance', status: 'Assigned',
      assignedTechnicianId: 'T2', priorityAssigned: true, location: 'Block A', dateSubmitted: iso(0), specialisedData: maintData }))
  ];
  const report = new ReportGenerator(requests);

  test('grouping reports count by status, category and priority', () => {
    assert.deepEqual(report.byStatus(), { Submitted: 2, Reviewed: 0, Assigned: 1, 'In Progress': 0, Resolved: 1, Closed: 1, Cancelled: 0 });
    assert.deepEqual(report.byCategory(), { 'ICT Support': 4, 'Facilities Maintenance': 1, 'Cleaning and Sanitation': 0, 'General Campus Service': 0 });
    assert.deepEqual(report.byPriority(), { Low: 1, Normal: 1, High: 1, Urgent: 2 });
  });

  test('urgent and overdue reports use each request type\'s own rules', () => {
    assert.deepEqual(report.urgentRequests().map(r => r.requestID), ['A']);          // C is Urgent but already Resolved
    const now = new Date(t0.getTime() + 5 * hour);
    assert.deepEqual(report.overdueRequests(now).map(r => r.requestID), ['A']);      // A: 4 hour target; B: 72; E: 8; C and D are finished
    const later = new Date(t0.getTime() + 30 * hour);
    assert.deepEqual(report.overdueRequests(later).map(r => r.requestID), ['A', 'E']);
  });

  test('technician, resolution time and location reports are calculated correctly', () => {
    assert.deepEqual(report.assignedByTechnician(), { T1: { count: 2, requestIds: ['C', 'D'] }, T2: { count: 1, requestIds: ['E'] } });
    assert.deepEqual(report.completedByTechnician(), { T1: { count: 2, requestIds: ['C', 'D'] } });
    assert.deepEqual(report.averageResolutionTime(), { completedRequests: 2, averageHours: 8 });
    assert.deepEqual(report.volumeByLocation(), { 'Library Level 2': 3, 'Block A': 2 });
    assert.deepEqual(new ReportGenerator([]).averageResolutionTime(), { completedRequests: 0, averageHours: null });
    assert.equal(report.catalog().length, 9);
    assert.deepEqual(ReportGenerator.format(report.averageResolutionTime()), ['completedRequests: 2', 'averageHours: 8']);
  });
});
