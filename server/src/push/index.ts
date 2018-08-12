import schema = require('./../db/schema');
import webpush = require('web-push');
import config = require('./../../config');
import { User } from '../db/schema/user';
import { PushSubscription } from '../db/schema/push';

const vapidKeys = {
    publicKey: process.env.BCC_PUSH_APPSERVERKEY_PUB || '',
    privateKey: process.env.BCC_PUSH_APPSERVERKEY_PRIV || ''
}

webpush.setVapidDetails(
    config.contact,
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

export const subscribe = async (user: User, subscription: PushSubscription) => {
    await schema.push.subscribe(subscription);
}

export const unsubscribe = async (user: User, subscription: PushSubscription) => {
    await schema.push.unsubscribe(subscription);
}

export const getSubscriptions = async (user: User) => {
    return await schema.push.getSubscriptions(user);
}

export interface PushMessage {
    title: string;
    body: string;
    url?: string;
}

export const pushMessage = async (user: User, data: PushMessage) => {
    const subscriptions = await schema.push.getSubscriptions(user);
    const promiseChain = Promise.resolve();

    subscriptions.forEach((subscription) => {
        promiseChain.then(() => {
            console.log('Pushing to ' + subscription.userId + ':' + subscription.deviceName);
            return webpush.sendNotification(subscription, JSON.stringify(data)).catch((err) => {
                if (err.statusCode === 410) {
                    return schema.push.unsubscribe(subscription);
                } else {
                    throw err;
                }
            });
        });
    });

    await promiseChain;
}