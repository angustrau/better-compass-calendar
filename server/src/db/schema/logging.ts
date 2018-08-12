import db = require('./../../db');
import { User } from './user';

/**
 * Log an outgoing request
 * @param method 
 * @param uri 
 * @param time 
 */
export const request = async (method: string, uri: string, time: number) => {
    await db.run(
        'INSERT INTO RequestLog (log_time, method, uri, response_time) VALUES ($1,$2,$3,$4)',
        Date.now(),
        method,
        uri,
        time
    );
}

/**
 * Log a successful login
 * @param userId 
 */
export const login = async (userId: number) => {
    await db.run(
        'INSERT INTO LoginLog (user_id, time) VALUES ($1,$2)',
        userId,
        Date.now()
    );
}

/**
 * Log an event query
 * @param user 
 */
export const query = async (user: User) => {
    await db.run(
        'INSERT INTO QueryLog (user_id, time) VALUES ($1,$2)',
        user.id,
        Date.now()
    );
}