import apiRequest from './apiRequest';
import { IAccessToken } from './auth';

/**
 * Contains information required to push to a device
 */
export interface IPushSubscription {
    userId: number;
    deviceName: string;
    endpoint: string;
    keys: {
        p256dh: string,
        auth: string
    }
}

/**
 * Enable push notification services
 * @async
 * @param {IPushSubscription} subscription Subscription data for pushing to this device
 * @param {IAccessToken} token An authorisation token
 */
export const pushSubscribe = async (subscription: IPushSubscription, token: IAccessToken) => {
    await apiRequest('POST', '/push/subscribe', subscription, token);
}

/**
 * Disable push notifications
 * @async
 * @param {IPushSubscription} subscription Subscription data for pushing to this device
 * @param {IAccessToken} token An authorisation token
 */
export const pushUnsubscribe = async (subscription: IPushSubscription, token: IAccessToken) => {
    await apiRequest('POST', '/push/unsubscribe', subscription, token);
}

/**
 * Get all devices linked to this account with push enabled
 * @async
 * @param {IAccessToken} token An authorisation token
 * @returns {Promise<IPushSubscription[]>} Subscription data for all devices
 */
export const getPushSubscriptions = async (token: IAccessToken) => {
    const response = await apiRequest('GET', '/push/subscriptions', null, token);
    return response.subscriptions as IPushSubscription[];
}