import schema = require('./../db/schema');
import activities = require('./../activities');
import { User } from '../db/schema/user';
import { Activity } from '../db/schema/activity';

/**
 * Subscribe a user to an activity
 * @param user 
 * @param activity 
 */
export const subscribe = async (user: User, activity: Activity) => {
    await schema.subscriptions.subscribe(user, activity);
}

/**
 * Remove a user from an activity subscription
 * @param user 
 * @param activity 
 */
export const unsubscribe = async (user: User, activity: Activity) => {
    await schema.subscriptions.unsubscribe(user, activity);
}

/**
 * Get all activities a user is subscribed to
 * @param user 
 */
export const getSubscriptions = async (user: User) => {
    return await schema.subscriptions.getSubscriptions(user);
}

/**
 * Get all users subscribed to an activity
 * @param activity
 */
export const getSubscribedUsers = async (activity: Activity) => {
    return await schema.subscriptions.getSubscribedUsers(activity);
}