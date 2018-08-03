"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite_1 = require("sqlite");
const config = require("./../../config");
let db;
exports.initDB = async () => {
    db = await sqlite_1.open('./db/database.sqlite', { promise: Promise });
    console.log('Opened SQLite database');
    await db.migrate({
        force: config.environment === 'dev' && !config.neverMigrateDB ? 'last' : undefined,
        migrationsPath: './db/migrations'
    });
    console.log('Completed SQL migration');
    // Enable foreign key constraint support
    await db.run('PRAGMA foreign_keys = ON');
    console.log('Initialised SQLite');
};
exports.run = async (query, ...params) => {
    return await db.run(query, ...params);
};
exports.get = async (query, ...params) => {
    return await db.get(query, ...params);
};
exports.all = async (query, ...params) => {
    return await db.all(query, ...params);
};
//# sourceMappingURL=sqlite.js.map