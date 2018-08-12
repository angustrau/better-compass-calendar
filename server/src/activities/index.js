"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema = require("./../db/schema");
/**
 * Registers an activity if it do not exist
 * @async
 * @param {number} id
 * @returns {Promise<Activity>}
 */
exports.registerActivity = async (id, token) => {
    let activity;
    try {
        activity = await schema.activity.getActivity(id);
    }
    catch (error) {
        if (error === schema.errors.ACTIVITY_NOT_FOUND) {
            activity = {
                id: id
            };
            await schema.activity.saveActivity(activity);
        }
        else {
            throw error;
        }
    }
    return activity;
};
/**
 * Get an activity from an id
 */
exports.getActivity = async (id) => {
    return await schema.activity.getActivity(id);
};
//# sourceMappingURL=index.js.map