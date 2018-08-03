"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema = require("./../db/schema");
const webpush = require("web-push");
const config = require("./../../config");
const vapidKeys = {
    publicKey: process.env.BCC_PUSH_APPSERVERKEY_PUB || '',
    privateKey: process.env.BCC_PUSH_APPSERVERKEY_PRIV || ''
};
webpush.setVapidDetails(config.contact, vapidKeys.publicKey, vapidKeys.privateKey);
exports.subscribe = async (user, subscription) => {
    await schema.push.subscribe(subscription);
};
exports.unsubscribe = async (user, subscription) => {
    await schema.push.unsubscribe(subscription);
};
exports.getSubscriptions = async (user) => {
    return await schema.push.getSubscriptions(user);
};
exports.pushMessage = async (user, data) => {
    const subscriptions = await schema.push.getSubscriptions(user);
    const promiseChain = Promise.resolve();
    subscriptions.forEach((subscription) => {
        promiseChain.then(() => {
            console.log('Pushing to ' + subscription.userId + ':' + subscription.deviceName);
            return webpush.sendNotification(subscription, JSON.stringify(data)).catch((err) => {
                if (err.statusCode === 410) {
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