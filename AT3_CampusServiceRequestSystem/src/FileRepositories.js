/*
  Program: Distinction Component - File repositories
  Student Name: EAU MALLEN
  Student ID: 240156
  Date: 20th October 2026

  All reading and writing of the JSON data files happens here, using the built-in
  fs/promises module. The domain classes and the console menu never touch files.
*/

const fs = require('fs/promises');
const path = require('path');

const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';

class RepositoryError extends Error {
    constructor(message, cause) {
        super(message, cause ? { cause } : undefined);
        this.name = 'RepositoryError';
    }
}

// Shared behaviour for a JSON file that holds an array of records
class JsonFileRepository {
    #filePath;
    #idField;

    constructor(filePath, idField) {
        if (isBlank(filePath)) throw new Error("A file path is required.");
        if (isBlank(idField)) throw new Error("An ID field name is required.");
        this.#filePath = filePath;
        this.#idField = idField;
    }

    get filePath() { return this.#filePath; }
    get idField() { return this.#idField; }

    // Reads every record. A missing file is created as an empty array; an empty file is an empty array.
    async loadAll() {
        let text;
        try {
            text = await fs.readFile(this.#filePath, 'utf8');
        } catch (error) {
            if (error.code === 'ENOENT') {
                await this.saveAll([]);
                return [];
            }
            throw new RepositoryError(`Could not read ${this.#filePath}: ${error.message}`, error);
        }
        if (text.trim() === '') return [];

        let data;
        try {
            data = JSON.parse(text);
        } catch (error) {
            throw new RepositoryError(`Could not read ${this.#filePath}: the file is not valid JSON (${error.message}).`, error);
        }
        if (!Array.isArray(data)) {
            throw new RepositoryError(`Could not read ${this.#filePath}: the file must contain a list of records.`);
        }
        return data;
    }

    // Writes the whole list. A temporary file is written first, so a failed write cannot damage the real file.
    async saveAll(records) {
        if (!Array.isArray(records)) {
            throw new RepositoryError(`Could not write ${this.#filePath}: records must be a list.`);
        }
        const tempPath = `${this.#filePath}.tmp`;
        try {
            await fs.mkdir(path.dirname(this.#filePath), { recursive: true });
            await fs.writeFile(tempPath, JSON.stringify(records, null, 2) + '\n', 'utf8');
            await fs.rename(tempPath, this.#filePath);
        } catch (error) {
            await fs.rm(tempPath, { force: true }).catch(() => {});
            throw new RepositoryError(`Could not write ${this.#filePath}: ${error.message}`, error);
        }
    }

    async create(record) {
        if (!record || typeof record !== 'object' || isBlank(record[this.#idField])) {
            throw new RepositoryError(`Cannot save a record without a ${this.#idField}.`);
        }
        const records = await this.loadAll();
        if (records.some(r => r[this.#idField] === record[this.#idField])) {
            throw new RepositoryError(`Duplicate ${this.#idField}: '${record[this.#idField]}' is already saved in ${this.#filePath}.`);
        }
        records.push(record);
        await this.saveAll(records);
        return record;
    }

    async findById(id) {
        const records = await this.loadAll();
        return records.find(r => r[this.#idField] === id) || null;
    }

    async update(id, changes) {
        const records = await this.loadAll();
        const index = records.findIndex(r => r[this.#idField] === id);
        if (index === -1) throw new RepositoryError(`Cannot update: no record with ${this.#idField} '${id}' in ${this.#filePath}.`);
        records[index] = { ...records[index], ...changes, [this.#idField]: records[index][this.#idField] };
        await this.saveAll(records);
        return records[index];
    }

    async delete(id) {
        const records = await this.loadAll();
        const remaining = records.filter(r => r[this.#idField] !== id);
        if (remaining.length === records.length) {
            throw new RepositoryError(`Cannot delete: no record with ${this.#idField} '${id}' in ${this.#filePath}.`);
        }
        await this.saveAll(remaining);
        return true;
    }
}

class UserFileRepository extends JsonFileRepository {
    constructor(filePath) { super(filePath, 'userId'); }
}

class ServiceRequestFileRepository extends JsonFileRepository {
    constructor(filePath) { super(filePath, 'requestId'); }

    async findByRequester(userId) {
        return (await this.loadAll()).filter(r => r.requesterId === userId);
    }

    async findByTechnician(technicianId) {
        return (await this.loadAll()).filter(r => r.assignedTechnicianId === technicianId);
    }
}

class HistoryFileRepository extends JsonFileRepository {
    constructor(filePath) { super(filePath, 'historyId'); }

    async findByRequest(requestId) {
        return (await this.loadAll()).filter(h => h.requestId === requestId);
    }

    // Replaces one request's history, leaving every other request's history untouched
    async replaceForRequest(requestId, entries) {
        const others = (await this.loadAll()).filter(h => h.requestId !== requestId);
        await this.saveAll([...others, ...entries]);
    }
}

class AuditFileRepository extends JsonFileRepository {
    constructor(filePath) { super(filePath, 'auditId'); }

    // Adds an entry and gives it the next audit ID (AUD00001, AUD00002, ...)
    async append(entry) {
        const records = await this.loadAll();
        const highest = records.reduce((max, r) => Math.max(max, Number(String(r.auditId).replace(/\D/g, '')) || 0), 0);
        const saved = { auditId: `AUD${String(highest + 1).padStart(5, '0')}`, ...entry };
        records.push(saved);
        await this.saveAll(records);
        return saved;
    }

    async findByRequest(requestId) {
        return (await this.loadAll()).filter(a => a.requestId === requestId);
    }

    async findByActor(actorId) {
        return (await this.loadAll()).filter(a => a.actorId === actorId);
    }
}

// One repository per data file, all inside the given data folder
function createRepositories(dataDir) {
    return {
        users: new UserFileRepository(path.join(dataDir, 'users.json')),
        requests: new ServiceRequestFileRepository(path.join(dataDir, 'serviceRequests.json')),
        history: new HistoryFileRepository(path.join(dataDir, 'requestHistory.json')),
        audit: new AuditFileRepository(path.join(dataDir, 'auditLog.json'))
    };
}

module.exports = {
    RepositoryError,
    JsonFileRepository,
    UserFileRepository,
    ServiceRequestFileRepository,
    HistoryFileRepository,
    AuditFileRepository,
    createRepositories
};
