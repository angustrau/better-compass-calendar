"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("./../../db");
exports.request = async (method, uri, time) => {
    await db.run('INSERT INTO RequestLog (log_time, method, uri, response_time) VALUES ($1,$2,$3,$4)', Date.now(), method, uri, time);
};
exports.login = async (userId) => {
    await db.run('INSERT INTO LoginLog (user_id, time) VALUES ($1,$2)', userId, Date.now());
};
exports.query = async (user) => {
    await db.run('INSERT INTO QueryLog (user_id, time) VALUES ($1,$2)', user.id, Date.now());
};
//# sourceMappingURL=logging.js.map