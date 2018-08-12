import schema = require('./../db/schema');
import webpush = require('web-push');
import config = require('./../../config');
import { User } from '../db/schema/user';
import { PushSubscription } from '../db/schema/push';

// Credentials for encrypting push messages
webpush.setVapidDetails(
    config.contact,
    process.env.BCC_PUSH_APPSERVERKEY_PUB || '',
    process.env.BCC_PUSH_APPSERVERKEY_PRIV || ''
);

/**
 * Subscribe a user to push notifications
 * @param user 
 * @param subscription 
 */
export const subscribe = async (user: User, subscription: PushSubscription) => {
    await schema.push.subscribe(subscription);
}

/**
 * Unsubscribe a user from push notifications
 * @param user 
 * @param subscription 
 */
export const unsubscribe = async (user: User, subscription: PushSubscription) => {
    await schema.push.unsubscribe(subscription);
}

/**
 * Get all push subscriptions for a user
 * @param user 
 */
export const getSubscriptions = async (user: User) => {
    return await schema.push.getSubscriptions(user);
}

/**
 * Push notification payload information
 */
export interface PushMessage {
    title: string;
    body: string;
    url?: string;
}

/**
 * Send a push payload to a user
 * @param user 
 * @param data 
 */
export const pushMessage = async (user: User, data: PushMessage) => {
    // Get all push subscriptions for a user
    const subscriptions = await schema.push.getSubscriptions(user);
    const promiseChain = Promise.resolve();

    // Send push notifications top subscriptions sequentially
    subscriptions.forEach((subscription) => {
        promiseChain.then(() => {
            console.log('Pushing to ' + subscription.userId + ':' + subscription.deviceName);
            return webpush.sendNotification(subscription, JSON.stringify(data)).catch((err) => {
                if (err.statusCode === 410) {
                    // Push subscription has been disabled from client side
                    return schema.push.unsubscribe(subscription);
                } else {
                    throw err;
                }
            });
        });
    });
    await promiseChain;
}