"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("./../../db");
exports.subscribe = async (subscription) => {
    await db.run('INSERT INTO PushSubscriptions (user_id, device_name, endpoint, key_p256dh, key_auth) VALUES ($1,$2,$3,$4,$5)', subscription.userId, subscription.deviceName, subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth);
};
exports.unsubscribe = async (subscription) => {
    await db.run('DELETE FROM PushSubscriptions WHERE endpoint = $1', subscription.endpoint);
};
exports.getSubscriptions = async (user) => {
    const data = await db.all('SELECT user_id, device_name, endpoint, key_p256dh, key_auth FROM PushSubscriptions WHERE user_id = $1', user.id);
    return data.map((subscription) => {
        return {
            userId: subscription.user_id,
            deviceName: subscription.device_name,
            endpoint: subscription.endpoint,
            keys: {
                p256dh: subscription.key_p256dh,
                auth: subscription.key_auth
            }
        };
    });
};
//# sourceMappingURL=push.js.map