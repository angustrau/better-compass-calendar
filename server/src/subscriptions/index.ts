import schema = require('./../db/schema');
import activities = require('./../activities');
import { User } from '../db/schema/user';
import { Activity } from '../db/schema/activity';

export const subscribe = async (user: User, activity: Activity) => {
    await schema.subscriptions.subscribe(user, activity);
}

export const unsubscribe = async (user: User, activity: Activity) => {
    await schema.subscriptions.unsubscribe(user, activity);
}

export const getSubscriptions = async (user: User) => {
    return await schema.subscriptions.getSubscriptions(user);
}

export const getSubscribedUsers = async (activity: Activity) => {
    return await schema.subscriptions.getSubscribedUsers(activity);
}