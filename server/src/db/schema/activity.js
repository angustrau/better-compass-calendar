"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("./../../db");
const errors = require("./errors");
/**
 * Gets activity data from the DB
 * @async
 * @param {number} id
 * @returns {Promise<Activity>}
 */
exports.getActivity = async (id) => {
    const data = await db.get('SELECT id FROM Activities WHERE id = $1', id);
    if (!data) {
        throw errors.ACTIVITY_NOT_FOUND;
    }
    return {
        id: data.id
    };
};
/**
 * Saves activity data to the DB
 * @async
 * @param {Activity} activity
 */
exports.saveActivity = async (activity) => {
    await db.run('REPLACE INTO Activities (id) VALUES ($1)', activity.id);
};
//# sourceMappingURL=activity.js.map