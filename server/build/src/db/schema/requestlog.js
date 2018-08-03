"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("./../../db");
exports.log = async (method, uri, time) => {
    await db.run('INSERT INTO RequestLog (log_time, method, uri, response_time) VALUES ($1,$2,$3,$4)', Date.now(), method, uri, time);
};
//# sourceMappingURL=requestlog.js.map