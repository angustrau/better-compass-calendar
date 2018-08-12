import db = require('./../../db');
import errors = require('./errors');

/**
 * An activity (collection of events)
 */
export interface Activity {
    id: number;
}

/**
 * Gets activity data from the DB
 * @async
 * @param {number} id 
 * @returns {Promise<Activity>}
 */
export const getActivity = async (id: number): Promise<Activity> => {
    const data = await db.get('SELECT id FROM Activities WHERE id = $1', id);

    if (!data) {
        throw errors.ACTIVITY_NOT_FOUND;
    }

    return {
        id: data.id
    }
}

/**
 * Saves activity data to the DB
 * @async
 * @param {Activity} activity 
 */
export const saveActivity = async (activity: Activity) => {
    await db.run(
        'REPLACE INTO Activities (id) VALUES ($1)',
        activity.id
    );
}