import * as api from './api';
import * as auth from './auth';

import CustomEventTarget from './utils/CustomEventTarget';

export const events = new CustomEventTarget();

let subscriptions: number[] = [];
const updateSubscriptions = async () => {
    if (auth.isAuthenticated()) {
        subscriptions = await api.getAllSubscriptions(auth.getToken()!);
    }
}

export const init = () => {
    auth.events.addEventListener('post-login', updateSubscriptions);
    // updateSubscriptions();
}

export const subscribe = async (activity: number) => {
    if (auth.isAuthenticated()) {
        await api.subscribe(activity, auth.getToken()!);
        if (subscriptions.indexOf(activity) === -1) {
            subscriptions.push(activity);
            events.dispatchEvent(new Event('subscribed'));
        }
    }
}

export const unsubscribe = async (activity: number) => {
    if (auth.isAuthenticated()) {
        await api.unsubscribe(activity, auth.getToken()!);
        const index = subscriptions.indexOf(activity);
        if (index !== -1) {
            subscriptions.splice(index, 1);
            events.dispatchEvent(new Event('unsubscribed'));
        }
    }
}

export const isSubscribed = (activity: number) => {
    return subscriptions.indexOf(activity) !== -1;
}