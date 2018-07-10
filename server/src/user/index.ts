import schema = require('./../db/schema');
import compass = require('./../compass');
import { AccessToken } from '../db/schema/AccessToken';
import { User } from '../db/schema/User';

/**
 * Registers a user if they do not exist
 * @async
 * @param {number} id
 * @param {AccessToken} token 
 * @returns {Promise<User>}
 */
export const registerUser = async (id: number, token: AccessToken): Promise<User> => {
    let user: User;
    try {
        user = await schema.user.getUser(id);
    } catch (error) {
        if (error === schema.errors.USER_NOT_FOUND) {
            const { userDisplayCode, userFullName, userEmail } = await compass.user.getDetails(id, token.compassToken);

            user = {
                id: id,
                displayCode: userDisplayCode || '',
                fullName: userFullName || '',
                email: userEmail || ''
            }
            await schema.user.saveUser(user);
        } else {
            throw error;
        }
    }

    return user;
}

/**
 * Gets user details
 * @async
 * @param {number} id 
 * @returns {Promise<User>}
 */
export const getDetails = async (id: number): Promise<User> => {
    return await schema.user.getUser(id);
}

/**
 * Deletes a user 
 * @async
 * @param {number} id 
 */
export const deleteUser = async (id: number) => {
    await schema.user.deleteUser(id);
}