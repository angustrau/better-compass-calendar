"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const push = require("./../push");
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
exports.sendPush = async (user, data) => {
    await push.pushMessage(user, data);
};
//# sourceMappingURL=index.js.map