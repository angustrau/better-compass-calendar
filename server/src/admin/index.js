"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const push = require("./../push");
const db = require("./../db");
const user = require("./../user");
exports.errors = {
    INVALID_TOKEN: 'Invalid authorisation token'
};
/**
 * Middleware: Admin authentication
 */
exports.authenticate = async (req, res, next) => {
    if (!req.user.isAdmin) {
        next(exports.errors.INVALID_TOKEN);
    }
    else {
        next();
    }
};
/**
 * Send a push notification to a user with payload
 */
exports.sendPush = async (userId, data) => {
    const receipient = await user.getDetails(userId);
    await push.pushMessage(receipient, data);
};
/**
 * Run an arbitrary SQL query
 */
exports.runSQL = async (query) => {
    return db.all(query);
};
//# sourceMappingURL=index.js.map