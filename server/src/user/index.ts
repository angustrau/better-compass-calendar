import schema = require('./../db/schema');
import compass = require('./../compass');
import { AccessToken } from '../db/schema/AccessToken';
import { User } from '../db/schema/User';

/**
 * Registers a user if they do not exist
 * @async
 * @param {AccessToken} token 
 * @returns {Promise<User>}
 */
export const registerUser = async (token: AccessToken): Promise<User> => {
    let user: User;
    try {
        user = await schema.user.getUser(token.userId);
    } catch (error) {
        if (error === schema.errors.USER_NOT_FOUND) {
            const { id, displayCode, fullName, email } = await compass.user.getDetails(token.userId, token.compassToken);

            user = {
                id: id,
                displayCode: displayCode,
                fullName: fullName,
                email: email
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
    await Promise.all([
        schema.user.deleteUser(id),
        schema.accessToken.revokeTokensForUser(id)
    ]);
}