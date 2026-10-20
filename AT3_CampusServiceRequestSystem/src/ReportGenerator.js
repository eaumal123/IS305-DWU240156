/*
  Program: Distinction Component - Management reports
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 20th October 2026
*/

const ServiceRequest = require('./ServiceRequest');

const HOUR_MS = 60 * 60 * 1000;

class ReportGenerator {
    // No further work is expected on a request in one of these statuses
    static FINISHED_STATUSES = ['Resolved', 'Closed', 'Cancelled'];

    #requests;

    constructor(requests = []) {
        this.#requests = [...requests];
    }

    static isActive(request) {
        return !ReportGenerator.FINISHED_STATUSES.includes(request.status);
    }

    // Counts requests per key; every expected key is listed even when its count is 0
    #countBy(keyOf, expectedKeys = []) {
        const empty = Object.fromEntries(expectedKeys.map(k => [k, 0]));
        return this.#requests.reduce((counts, r) => {
            const key = keyOf(r);
            counts[key] = (counts[key] ?? 0) + 1;
            return counts;
        }, empty);
    }

    // Groups requests by Technician: { TECH001: { count, requestIds } }, busiest first
    #groupByTechnician(requests) {
        const grouped = requests.reduce((groups, r) => {
            const id = r.assignedTechnicianID;
            groups[id] = groups[id] ?? { count: 0, requestIds: [] };
            groups[id].count++;
            groups[id].requestIds.push(r.requestID);
            return groups;
        }, {});
        return Object.fromEntries(
            Object.entries(grouped).sort(([idA, a], [idB, b]) => b.count - a.count || idA.localeCompare(idB)));
    }

    byStatus() { return this.#countBy(r => r.status, ServiceRequest.STATUSES); }

    byCategory() { return this.#countBy(r => r.category, ServiceRequest.ALLOWED_CATEGORIES); }

    byPriority() { return this.#countBy(r => r.priority, ServiceRequest.ALLOWED_PRIORITIES); }

    // Urgent requests that are still open, highest priority score first (polymorphic score)
    urgentRequests() {
        return this.#requests
            .filter(r => r.priority === 'Urgent' && ReportGenerator.isActive(r))
            .sort((a, b) => b.calculatePriorityScore() - a.calculatePriorityScore());
    }

    // Open requests that have been waiting longer than their own target resolution time (polymorphic target)
    overdueRequests(now = new Date()) {
        const hoursOver = (r) => (now - r.dateSubmitted) / HOUR_MS - r.getTargetResolutionHours();
        return this.#requests
            .filter(r => ReportGenerator.isActive(r) && hoursOver(r) > 0)
            .sort((a, b) => hoursOver(b) - hoursOver(a));
    }

    assignedByTechnician() {
        return this.#groupByTechnician(this.#requests.filter(r => r.assignedTechnicianID));
    }

    completedByTechnician() {
        return this.#groupByTechnician(
            this.#requests.filter(r => r.assignedTechnicianID && ['Resolved', 'Closed'].includes(r.status)));
    }

    // Average hours from submission to the Resolved status, using the request history
    averageResolutionTime() {
        const hours = this.#requests
            .filter(r => ['Resolved', 'Closed'].includes(r.status))
            .map(r => {
                const resolved = r.history.find(h => h.newStatus === 'Resolved');
                return resolved ? (resolved.dateTime - r.dateSubmitted) / HOUR_MS : null;
            })
            .filter(h => h !== null);
        const total = hours.reduce((sum, h) => sum + h, 0);
        return {
            completedRequests: hours.length,
            averageHours: hours.length ? Math.round((total / hours.length) * 100) / 100 : null
        };
    }

    // Busiest campus locations first
    volumeByLocation() {
        const counts = this.#countBy(r => r.campusLocation.trim());
        return Object.fromEntries(
            Object.entries(counts).sort(([a, x], [b, y]) => y - x || a.localeCompare(b)));
    }

    catalog(now = new Date()) {
        return [
            { title: 'Requests by Status', data: this.byStatus() },
            { title: 'Requests by Category', data: this.byCategory() },
            { title: 'Requests by Priority', data: this.byPriority() },
            { title: 'Urgent Requests (still open)', data: this.urgentRequests() },
            { title: 'Overdue Requests', data: this.overdueRequests(now) },
            { title: 'Requests Assigned to Each Technician', data: this.assignedByTechnician() },
            { title: 'Completed Requests by Technician', data: this.completedByTechnician() },
            { title: 'Average Resolution Time', data: this.averageResolutionTime() },
            { title: 'Request Volume by Campus Location', data: this.volumeByLocation() }
        ];
    }

    // Turns report data into printable lines
    static format(data) {
        if (Array.isArray(data)) {
            return data.length ? data.map(r => r.getRequestSummary()) : ['(none)'];
        }
        const entries = Object.entries(data);
        if (entries.length === 0) return ['(none)'];
        return entries.map(([key, value]) =>
            value && typeof value === 'object'
                ? `${key}: ${value.count} (${value.requestIds.join(', ')})`
                : `${key}: ${value ?? 'n/a'}`);
    }
}

module.exports = ReportGenerator;
