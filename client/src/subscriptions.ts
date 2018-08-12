import * as api from './api';
import * as auth from './auth';

import CustomEventTarget from './utils/CustomEventTarget';

export const events = new CustomEventTarget();

let subscriptions: number[] = [];
/**
 * Refresh the list of activities the user is subscribed to
 */
const updateSubscriptions = async () => {
    if (auth.isAuthenticated()) {
        subscriptions = await api.getAllSubscriptions(auth.getToken()!);
    }
}

export const init = () => {
    auth.events.addEventListener('post-login', updateSubscriptions);
}

/**
 * Subscribe the user to an activity
 * @param activity 
 */
export const subscribe = async (activity: number) => {
    if (auth.isAuthenticated()) {
        await api.subscribe(activity, auth.getToken()!);
        if (subscriptions.indexOf(activity) === -1) {
            subscriptions.push(activity);
            events.dispatchEvent(new Event('subscribed'));
        }
    }
}

/**
 * Unsubscribe the user from an activity
 * @param activity 
 */
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

/**
 * Checks the subscription state of an activity
 */
export const isSubscribed = (activity: number) => {
    return subscriptions.indexOf(activity) !== -1;
}