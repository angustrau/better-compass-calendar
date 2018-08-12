"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("./../../db");
const errors = require("./errors");
/**
 * Converts a database response to a user
 * @param data
 */
const dataToUser = (data) => {
    return {
        id: data.id,
        displayCode: data.display_code,
        fullName: data.full_name,
        email: data.email,
        isManager: data.is_manager === 1,
        isAdmin: data.is_admin === 1
    };
};
/**
 * Retrieves a BCC user from the DB
 * @async
 * @param {number} id
 * @returns {Promise<User>}
 */
exports.getUser = async (id) => {
    const user = await db.get('SELECT id, display_code, full_name, email, is_manager, is_admin FROM Users WHERE id = $1', id);
    if (!user) {
        throw errors.USER_NOT_FOUND;
    }
    return dataToUser(user);
};
/**
 * Saves a BCC user to the DB
 * @async
 * @param {User} user
 */
exports.saveUser = async (user) => {
    await db.run('REPLACE INTO Users (id, display_code, full_name, email, is_manager, is_admin) VALUES ($1,$2,$3,$4,$5,$6)', user.id, user.displayCode, user.fullName, user.email, user.isManager ? 1 : 0, user.isAdmin ? 1 : 0);
};
/**
 * Deletes a BCC user from the DB
 * @async
 * @param {number} id
 */
exports.deleteUser = async (id) => {
    await db.run('DELETE FROM Users WHERE id = $1', id);
};
exports.getManagers = async () => {
    const managers = await db.all('SELECT id, display_code, full_name, email, is_manager, is_admin FROM Users WHERE is_manager = 1');
    return managers.map(manager => dataToUser(manager));
};
//# sourceMappingURL=user.js.map