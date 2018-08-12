import apiRequest from './apiRequest';
import { IAccessToken } from "./auth";

/**
 * Gets this user's activity subscriptions
 * @async
 * @param {IAccessToken} token An authorisation token
 * @returns {Promise<number[]>} A list of activity ids
 */
export const getAllSubscriptions = async (token: IAccessToken): Promise<number[]> => {
    const response = await apiRequest('GET', '/subscriptions', null, token);
    return response.subscriptions as number[];
}

/**
 * Subscribes the user to an activity
 * @async
 * @param {number} activity The id of the activity to subscribe to
 * @param {IAccessToken} token An authorisation token
 */
export const subscribe = async (activity: number, token: IAccessToken) => {
    await apiRequest('POST', '/subscriptions/subscribe', { activity }, token);
}

/**
 * Unsubscribes the user from an activity
 * @async
 * @param {number} activity The id of the activity to unsubscribe from
 * @param {IAccessToken} token An authorisation token
 */
export const unsubscribe = async (activity: number, token: IAccessToken) => {
    await apiRequest('POST', '/subscriptions/unsubscribe', { activity }, token);
}