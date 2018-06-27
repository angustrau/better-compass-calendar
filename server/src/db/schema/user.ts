import * as db from './../../db';
import * as errors from './errors';

export interface User {
    id: number;
    displayCode: string;
    fullName: string;
    email: string;
}

/**
 * Retrieves a BCC user from the DB
 * @async
 * @param {number} id 
 * @returns {Promise<User>}
 */
export const getUser = async (id: number): Promise<User> => {
    const user = await db.get('SELECT id, display_code, full_name, email FROM Users WHERE id = $1', id);

    if (!user) {
        throw errors.USER_NOT_FOUND;
    }

    return {
        id: user.id, 
        displayCode: user.display_code,
        fullName: user.full_name,
        email: user.email
    }
}

/**
 * Saves a BCC user to the DB
 * @async
 * @param {User} user 
 */
export const saveUser = async(user: User) => {
    await db.run(
        'REPLACE INTO Users (id, display_code, full_name, email) VALUES ($1,$2,$3,$4)',
        user.id,
        user.displayCode,
        user.fullName,
        user.email
    );
}