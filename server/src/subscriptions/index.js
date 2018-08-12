"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema = require("./../db/schema");
/**
 * Subscribe a user to an activity
 * @param user
 * @param activity
 */
exports.subscribe = async (user, activity) => {
    await schema.subscriptions.subscribe(user, activity);
};
/**
 * Remove a user from an activity subscription
 * @param user
 * @param activity
 */
exports.unsubscribe = async (user, activity) => {
    await schema.subscriptions.unsubscribe(user, activity);
};
/**
 * Get all activities a user is subscribed to
 * @param user
 */
exports.getSubscriptions = async (user) => {
    return await schema.subscriptions.getSubscriptions(user);
};
/**
 * Get all users subscribed to an activity
 * @param activity
 */
exports.getSubscribedUsers = async (activity) => {
    return await schema.subscriptions.getSubscribedUsers(activity);
};
//# sourceMappingURL=index.js.map