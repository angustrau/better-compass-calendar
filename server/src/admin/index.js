"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const push = require("./../push");
const db = require("./../db");
const user = require("./../user");
exports.errors = {
    INVALID_TOKEN: 'Invalid authorisation token'
};
exports.authenticate = async (req, res, next) => {
    if (!req.user.isAdmin) {
        next(exports.errors.INVALID_TOKEN);
    }
    else {
        next();
    }
};
exports.sendPush = async (userId, data) => {
    const receipient = await user.getDetails(userId);
    await push.pushMessage(receipient, data);
};
exports.runSQL = async (query) => {
    return db.all(query);
};
//# sourceMappingURL=index.js.map