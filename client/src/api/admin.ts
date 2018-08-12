import apiRequest from "./apiRequest";
import { IAccessToken } from "./auth";

/**
 * A push notification payload
 */
export interface IPushMessage {
    title: string;
    body: string;
    url?: string;
}

/**
 * Send a push notification
 * @async
 * @param {number} userId The user to send the notification to
 * @param {IPushMessage} data The payload to send to the user's device
 * @param {IAccessToken} token An authorisation token with admin permissions
 */
export const sendPush = async (userId: number, data: IPushMessage, token: IAccessToken) => {
    await apiRequest('POST', '/admin/sendpush', {
        userId,
        data
    }, token);
}

/**
 * Runs an SQL query against the database
 * @async
 * @param {string} query An SQL query
 * @param {IAccessToken} token An authorisation token with admin permissions
 * @returns {Promise<any>} The result of the query
 */
export const runSQL = async (query: string, token: IAccessToken): Promise<any> => {
    const response = await apiRequest('POST', '/admin/sql', { query }, token);
    return response.result;
}