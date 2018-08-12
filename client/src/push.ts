import * as shortid from 'shortid';
import * as UAParser from 'ua-parser-js';
import * as api from './api';
import * as auth from './auth';
import config from './config';
import * as user from './user';

// A unique identifier for this device
let deviceID = localStorage.getItem('bcc-push-deviceid') || '';
if (!deviceID) {
    deviceID = shortid.generate();
    localStorage.setItem('bcc-push-deviceid', deviceID);
}
const parser = new UAParser();
const device = parser.getDevice();
// A user friendly way to identify this device
const deviceName = device.vendor || device.model ? (device.vendor || '') + ' ' + (device.model || '') : deviceID;

// https://github.com/GoogleChromeLabs/web-push-codelab/blob/master/app/scripts/main.js
const urlB64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

let subscribed = false;
export const init = async () => {
    // Ensure that the browser supports web push to enable this feature
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return;
    }

    const registration = await navigator.serviceWorker.ready;
    subscribed = await registration.pushManager.getSubscription() !== null;
}

/**
 * Show the browser-provided notification permission popup
 */
export const promptPermission = () => {
    // If the browser doesn't support push, treat as permision denied
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return Promise.resolve(false);
    }

    return new Promise((resolve, reject) => {
        // Prompt the user for permission
        const permissionResult = Notification.requestPermission((result) => {
            resolve(result);
        });

        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    }).then((permissionResult) => {
        // Return a boolean, whether the user allowed notifications or not
        return permissionResult === 'granted';
    });
}

/**
 * Subscribe the user to push notifications
 * Requires that permissions has been granted already
 */
export const subscribe = async () => {
    if (!auth.isAuthenticated()) {
        return;
    }

    // Get a new push subscription
    const registration =  await navigator.serviceWorker.ready;
    const subscriptionOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(config.push.applicationServerKey)
    }
    const pushSubscription = await registration.pushManager.subscribe(subscriptionOptions);

    // Upload push subscription to backend
    const { endpoint, keys } = pushSubscription.toJSON();
    await api.pushSubscribe({
        userId: user.getUser().id,
        deviceName,
        endpoint: endpoint || '',
        keys: {
            p256dh: keys!.p256dh,
            auth: keys!.auth
        }
    }, auth.getToken()!);
    subscribed = true;
}

/**
 * Unsubscribe the user from push notifications
 */
export const unsubscribe = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    // Check that the user is subscribed
    if (subscription && auth.isAuthenticated()) {
        // Remove subscription from the browser
        await subscription.unsubscribe();
        // Tell the backend to remove the subscription
        await api.pushUnsubscribe({
            userId: user.getUser().id,
            deviceName,
            endpoint: subscription.endpoint,
            keys: {
                p256dh: subscription.toJSON().keys!.p256dh,
                auth: subscription.toJSON().keys!.auth
            }
        }, auth.getToken()!);
        subscribed = false;
    }
}

export const isSubscribed = () => subscribed;
export const getDeviceID = () => deviceID;