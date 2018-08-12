import * as api from './api';
import { IPushMessage } from './api';
import * as auth from './auth';
import * as user from './user';

/**
 * Send an arbitrary push notification to a specific user
 */
export const sendPush = async (target: number, data: IPushMessage) => {
    if (!user.getUser().isAdmin || !auth.isAuthenticated()) {
        return;
    }

    await api.sendPush(target, data, auth.getToken()!);
}

/**
 * Run an arbitrary SQL statement and return the result
 */
export const runSQL = async (query: string) => {
    let result;
    try {
        result = await api.runSQL(query, auth.getToken()!)
    } catch (error) {
        result = error;
    }
    return result;
}