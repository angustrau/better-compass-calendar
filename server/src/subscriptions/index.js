"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema = require("./../db/schema");
exports.subscribe = async (user, activity) => {
    await schema.subscriptions.subscribe(user, activity);
};
exports.unsubscribe = async (user, activity) => {
    await schema.subscriptions.unsubscribe(user, activity);
};
exports.getSubscriptions = async (user) => {
    return await schema.subscriptions.getSubscriptions(user);
};
exports.getSubscribedUsers = async (activity) => {
    return await schema.subscriptions.getSubscribedUsers(activity);
};
//# sourceMappingURL=index.js.map