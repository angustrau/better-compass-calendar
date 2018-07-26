import apiRequest from './apiRequest';
import { IAccessToken } from "./auth";

export const getAllSubscriptions = async (token: IAccessToken) => {
    const response = await apiRequest('GET', '/subscriptions', null, token);
    return response.subscriptions as number[];
}

export const subscribe = async (activity: number, token: IAccessToken) => {
    await apiRequest('POST', '/subscriptions/subscribe', { activity }, token);
}

export const unsubscribe = async (activity: number, token: IAccessToken) => {
    await apiRequest('POST', '/subscriptions/unsubscribe', { activity }, token);
}