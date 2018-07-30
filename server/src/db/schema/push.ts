import db = require('./../../db');
import errors = require('./errors');
import { User } from './user';

export interface PushSubscription {
    userId: number;
    deviceName: string;
    endpoint: string;
    keys: {
        p256dh: string,
        auth: string
    }
}

export const subscribe = async (subscription: PushSubscription) => {
    await db.run(
        'INSERT INTO PushSubscriptions (user_id, device_name, endpoint, key_p256dh, key_auth) VALUES ($1,$2,$3,$4,$5)',
        subscription.userId,
        subscription.deviceName,
        subscription.endpoint,
        subscription.keys.p256dh,
        subscription.keys.auth
    );
}

export const unsubscribe = async (subscription: PushSubscription) => {
    await db.run('DELETE FROM PushSubscriptions WHERE endpoint = $1', subscription.endpoint);
}

export const getSubscriptions = async (user: User) => {
    const data = await db.all('SELECT user_id, device_name, endpoint, key_p256dh, key_auth FROM PushSubscriptions WHERE user_id = $1', user.id);
    return data.map((subscription): PushSubscription => {
        return {
            userId: subscription.user_id,
            deviceName: subscription.device_name,
            endpoint: subscription.endpoint,
            keys: {
                p256dh: subscription.key_p256dh,
                auth: subscription.key_auth
            }
        }
    });
}