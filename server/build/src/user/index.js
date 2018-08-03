"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema = require("./../db/schema");
const compass = require("./../compass");
const events = require("./../events");
const subscriptions = require("./../subscriptions");
const location = require("./../location");
/**
 * Registers a user if they do not exist
 * @async
 * @param {number} id
 * @param {AccessToken} token
 * @returns {Promise<User>}
 */
exports.registerUser = async (id, token) => {
    let user;
    try {
        user = await schema.user.getUser(id);
    }
    catch (error) {
        if (error === schema.errors.USER_NOT_FOUND) {
            const { userDisplayCode, userFullName, userEmail, userRole } = await compass.user.getDetails(id, token.compassToken);
            user = {
                id: id,
                displayCode: userDisplayCode || '',
                fullName: userFullName || '',
                email: userEmail || '',
                isManager: userRole !== 1,
                isAdmin: false
            };
            await schema.user.saveUser(user);
            if (id === token.userId) {
                await location.cacheLocations(token);
                await events.cacheEventsYear(token);
                const classes = await compass.user.getClasses(token.compassToken);
                //const classes = await compass.user.getActivities(token.compassToken);
                await Promise.all(classes.map(activity => subscriptions.subscribe(user, activity)));
            }
        }
        else {
            throw error;
        }
    }
    return user;
};
/**
 * Gets user details
 * @async
 * @param {number} id
 * @returns {Promise<User>}
 */
exports.getDetails = async (id) => {
    return await schema.user.getUser(id);
};
/**
 * Deletes a user
 * @async
 * @param {number} id
 */
exports.deleteUser = async (id) => {
    await schema.user.deleteUser(id);
};
exports.getManagers = async () => {
    return await schema.user.getManagers();
};
//# sourceMappingURL=index.js.map