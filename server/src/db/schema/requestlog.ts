import db = require('./../../db');
import errors = require('./errors');

export const log = async (method: string, uri: string, time: number) => {
    await db.run(
        'INSERT INTO RequestLog (log_time, method, uri, response_time) VALUES ($1,$2,$3,$4)',
        Date.now(),
        method,
        uri,
        time
    );
}