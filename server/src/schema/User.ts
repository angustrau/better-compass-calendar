import db = require('./../db');
import compass = require('./../compass');
import errors = require('./errors');

class User {
    id: number;
    displayCode: string;
    fullName: string;
    email: string;
    compassToken: compass.AuthToken;

    /**
     * Represents a BCC user
     * @param {number} id 
     * @param {string} displayCode 
     * @param {string} fullName 
     * @param {string} email 
     */
    constructor(id: number, displayCode: string, fullName: string, email: string) {
        this.id = id;
        this.displayCode = displayCode;
        this.fullName = fullName;
        this.email = email;
    }

    /**
     * Retrieves a BCC user from the DB
     * @async
     * @param {number} id 
     * @returns {User}
     */
    static async getUser(id: number) {
        const user = await db.get('SELECT id, display_code, full_name, email FROM Users WHERE id = $1', id);

        if (!user) {
            throw errors.USER_NOT_FOUND;
        }

        return new User(
            user.id, 
            user.display_code,
            user.full_name,
            user.email
        );
    }

    /**
     * Retrieves a user from the DB, creating it if it doesn't exist
     * @async
     * @param {compass.AuthToken} authToken 
     * @returns {User}
     */
    static async getOrAddUser(authToken: compass.AuthToken) {
        let user: User;
        try {
            user = await User.getUser(authToken.id);
        } catch (error) {
            if (error === errors.USER_NOT_FOUND) {
                const { id, displayCode, fullName, email } = await compass.user.getDetails(authToken.id, authToken);

                await db.run(
                    'INSERT INTO Users (id, display_code, full_name, email) VALUES ($1,$2,$3,$4)',
                    id,
                    displayCode,
                    fullName,
                    email
                );

                user = await User.getUser(authToken.id);
            } else {
                throw error;
            }
        }
        
        return user;
    }
}

export = User;