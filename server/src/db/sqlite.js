"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite_1 = require("sqlite");
let db;
/**
 * Initialise database connection
 */
exports.initDB = async () => {
    db = await sqlite_1.open('./db/database.sqlite', { promise: Promise });
    console.log('Opened SQLite database');
    await db.migrate({
        // force: config.environment === 'dev' ? 'last' : undefined, 
        migrationsPath: './db/migrations'
    });
    console.log('Completed SQL migration');
    // Enable foreign key constraint support
    await db.run('PRAGMA foreign_keys = ON');
    console.log('Initialised SQLite');
};
/**
 * Execute an SQL statement without returning results
 * @param query
 * @param params
 */
exports.run = async (query, ...params) => {
    await db.run(query, ...params);
};
/**
 * Execute an SQL query, returning the top result
 * @param query
 * @param params
 */
exports.get = async (query, ...params) => {
    return await db.get(query, ...params);
};
/**
 * Execut an SQL query, returning all results
 * @param query
 * @param params
 */
exports.all = async (query, ...params) => {
    return await db.all(query, ...params);
};
//# sourceMappingURL=sqlite.js.map