import db = require('./../../db');
import { User } from './user';
import { Activity } from './activity';

export const subscribe = async (user: User, activity: Activity) => {
    await db.run(
        'REPLACE INTO Subscriptions (user_id, activity_id) VALUES ($1,$2)',
        user.id,
        activity.id
    );
}

export const unsubscribe = async (user: User, activity: Activity) => {
    await db.run(
        'DELETE FROM Subscriptions WHERE user_id = $1 AND activity_id = $2',
        user.id,
        activity.id
    );
}

export const getSubscriptions = async (user: User) => {
    const results = await db.all('SELECT user_id, activity_id FROM Subscriptions WHERE user_id = $1', user.id);
    return results.map(x => x.activity_id);
}

export const getSubscribedUsers = async (activity: Activity) => {
    const results = await db.all('SELECT user_id, activity_id FROM Subscriptions WHERE activity_id = $1', activity.id);
    return results.map(x => x.user_id);
}