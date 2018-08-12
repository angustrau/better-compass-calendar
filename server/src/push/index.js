"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema = require("./../db/schema");
const webpush = require("web-push");
const config = require("./../../config");
// Credentials for encrypting push messages
webpush.setVapidDetails(config.contact, process.env.BCC_PUSH_APPSERVERKEY_PUB || '', process.env.BCC_PUSH_APPSERVERKEY_PRIV || '');
/**
 * Subscribe a user to push notifications
 * @param user
 * @param subscription
 */
exports.subscribe = async (user, subscription) => {
    await schema.push.subscribe(subscription);
};
/**
 * Unsubscribe a user from push notifications
 * @param user
 * @param subscription
 */
exports.unsubscribe = async (user, subscription) => {
    await schema.push.unsubscribe(subscription);
};
/**
 * Get all push subscriptions for a user
 * @param user
 */
exports.getSubscriptions = async (user) => {
    return await schema.push.getSubscriptions(user);
};
/**
 * Send a push payload to a user
 * @param user
 * @param data
 */
exports.pushMessage = async (user, data) => {
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
                }
                else {
                    throw err;
                }
            });
        });
    });
    await promiseChain;
};
//# sourceMappingURL=index.js.map