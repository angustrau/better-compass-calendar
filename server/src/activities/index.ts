import schema = require('./../db/schema');
import compass = require('./../compass');
import { AccessToken } from '../db/schema/AccessToken';
import { Activity } from '../db/schema/activity';

/**
 * Registers an activity if it do not exist
 * @async
 * @param {number} id
 * @returns {Promise<Activity>}
 */
export const registerActivity = async (id: number, token: AccessToken): Promise<Activity> => {
    let activity: Activity;
    try {
        activity = await schema.activity.getActivity(id);
    } catch (error) {
        if (error === schema.errors.ACTIVITY_NOT_FOUND) {
            activity = {
                id: id
            }
            await schema.activity.saveActivity(activity);
        } else {
            throw error;
        }
    }

    return activity;
}

export const getActivity = async (id: number) => {
    return await schema.activity.getActivity(id);
}