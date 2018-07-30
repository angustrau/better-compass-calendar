import db = require('./../../db');
import errors = require('./errors');

export interface User {
    id: number;
    displayCode: string;
    fullName: string;
    email: string;
    isManager: boolean;
    isAdmin: boolean;
}

const dataToUser = (data): User => {
    return {
        id: data.id, 
        displayCode: data.display_code,
        fullName: data.full_name,
        email: data.email,
        isManager: data.is_manager === 1,
        isAdmin: data.is_admin === 1
    }
}

/**
 * Retrieves a BCC user from the DB
 * @async
 * @param {number} id 
 * @returns {Promise<User>}
 */
export const getUser = async (id: number): Promise<User> => {
    const user = await db.get('SELECT id, display_code, full_name, email, is_manager, is_admin FROM Users WHERE id = $1', id);

    if (!user) {
        throw errors.USER_NOT_FOUND;
    }

    return dataToUser(user);
}

/**
 * Saves a BCC user to the DB
 * @async
 * @param {User} user 
 */
export const saveUser = async (user: User) => {
    await db.run(
        'REPLACE INTO Users (id, display_code, full_name, email, is_manager, is_admin) VALUES ($1,$2,$3,$4,$5,$6)',
        user.id,
        user.displayCode,
        user.fullName,
        user.email,
        user.isManager ? 1 : 0,
        user.isAdmin ? 1 : 0
    );
}

/**
 * Deletes a BCC user from the DB
 * @async
 * @param {number} id 
 */
export const deleteUser = async (id: number) => {
    await db.run('DELETE FROM Users WHERE id = $1', id);
}

export const getManagers = async () => {
    const managers = await db.all('SELECT id, display_code, full_name, email, is_manager, is_admin FROM Users WHERE is_manager = 1');

    return managers.map(manager => dataToUser(manager));
}