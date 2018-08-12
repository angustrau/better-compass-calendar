import db = require('./../../db');
import { User, getUser } from './user';
import { Activity } from './activity';

/**
 * Add an activity subscription for a user to the database
 * @param user 
 * @param activity 
 */
export const subscribe = async (user: User, activity: Activity) => {
    await db.run(
        'REPLACE INTO Subscriptions (user_id, activity_id) VALUES ($1,$2)',
        user.id,
        activity.id
    );
}

/**
 * Remove an activity subscription for a user
 * @param user 
 * @param activity 
 */
export const unsubscribe = async (user: User, activity: Activity) => {
    await db.run(
        'DELETE FROM Subscriptions WHERE user_id = $1 AND activity_id = $2',
        user.id,
        activity.id
    );
}

/**
 * Get all activities a user is subscribed to
 */
export const getSubscriptions = async (user: User) => {
    const results = await db.all('SELECT user_id, activity_id FROM Subscriptions WHERE user_id = $1', user.id);
    return results.map(x => x.activity_id);
}

/**
 * Get all users subscribed to an activity
 * @param activity 
 */
export const getSubscribedUsers = async (activity: Activity) => {
    const results = await db.all('SELECT user_id, activity_id FROM Subscriptions WHERE activity_id = $1', activity.id);
    return Promise.all(results.map(x => getUser(x.user_id)));
}