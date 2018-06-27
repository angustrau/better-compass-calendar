import schema = require('./../db/schema');

/**
 * Gets user details
 * @async
 * @param {number} id The id of the user to fetch details for
 */
export const getDetails = async (id: number) => {
    return await schema.user.getUser(id);
}