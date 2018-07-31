import * as shortid from 'shortid';
import * as UAParser from 'ua-parser-js';
import * as api from './api';
import * as auth from './auth';
import config from './config';
import * as user from './user';

let deviceID = localStorage.getItem('bcc-push-deviceid') || '';
if (!deviceID) {
    deviceID = shortid.generate();
    localStorage.setItem('bcc-push-deviceid', deviceID);
}
const parser = new UAParser();
const device = parser.getDevice();
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
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return;
    }

    auth.events.addEventListener('log out', async () => {
        await unsubscribe();
    });

    const registration = await navigator.serviceWorker.ready;
    subscribed = await registration.pushManager.getSubscription() !== null;
}

export const promptPermission = () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return Promise.resolve(false);
    }

    return new Promise((resolve, reject) => {
        const permissionResult = Notification.requestPermission((result) => {
            resolve(result);
        });

        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    }).then((permissionResult) => {
        return permissionResult === 'granted';
    });
}

export const subscribe = async () => {
    if (!auth.isAuthenticated()) {
        return;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscriptionOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(config.push.applicationServerKey)
    }
    const pushSubscription = await registration.pushManager.subscribe(subscriptionOptions);

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

export const unsubscribe = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription && auth.isAuthenticated()) {
        await subscription.unsubscribe();
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