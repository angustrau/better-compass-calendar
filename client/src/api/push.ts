import apiRequest from './apiRequest';
import { IAccessToken } from './auth';

export interface IPushMessage {
    title: string;
}

export interface IPushSubscription {
    userId: number;
    deviceName: string;
    endpoint: string;
    keys: {
        p256dh: string,
        auth: string
    }
}

export const pushSubscribe = async (subscription: IPushSubscription, token: IAccessToken) => {
    await apiRequest('POST', '/push/subscribe', subscription, token);
}

export const pushUnsubscribe = async (subscription: IPushSubscription, token: IAccessToken) => {
    await apiRequest('POST', '/push/unsubscribe', subscription, token);
}

export const getPushSubscriptions = async (token: IAccessToken) => {
    const response = await apiRequest('GET', '/push/subscriptions', null, token);
    return response.subscriptions as IPushSubscription[];
}