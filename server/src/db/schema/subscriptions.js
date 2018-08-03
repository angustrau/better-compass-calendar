"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("./../../db");
const user_1 = require("./user");
exports.subscribe = async (user, activity) => {
    await db.run('REPLACE INTO Subscriptions (user_id, activity_id) VALUES ($1,$2)', user.id, activity.id);
};
exports.unsubscribe = async (user, activity) => {
    await db.run('DELETE FROM Subscriptions WHERE user_id = $1 AND activity_id = $2', user.id, activity.id);
};
exports.getSubscriptions = async (user) => {
    const results = await db.all('SELECT user_id, activity_id FROM Subscriptions WHERE user_id = $1', user.id);
    return results.map(x => x.activity_id);
};
exports.getSubscribedUsers = async (activity) => {
    const results = await db.all('SELECT user_id, activity_id FROM Subscriptions WHERE activity_id = $1', activity.id);
    return Promise.all(results.map(x => user_1.getUser(x.user_id)));
};
//# sourceMappingURL=subscriptions.js.map