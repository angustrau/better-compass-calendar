import db = require('./../db');
import errors = require('./errors');
import AuthToken = require('./../compass/AuthToken');

class AccessToken {
    token: string;
    expires: Date;
    userId: number;
    compassToken: AuthToken;

    /**
     * Creates a Better Compass Calendar authentication token
     * @param {string} token 
     * @param {Date} expires 
     * @param {number} userId
     * @param {AuthToken} compassToken 
     */
    constructor(token: string, expires: Date, userId: number, compassToken: AuthToken) {
        this.token = token;
        this.expires = expires;
        this.userId = userId;
        this.compassToken = compassToken;
    }

    /**
     * Retrieves an access token from the DB
     * @async
     * @param {string} accessToken The token to retrieve
     * @returns {Promise<AccessToken>}
     */
    static async getToken(accessToken: string) {
        const token = await db.get('SELECT token, expires, user_id, compass_token FROM AuthTokens WHERE token = $1', accessToken);
        
        if (!token) {
            throw errors.TOKEN_NOT_FOUND;
        }

        if (token.expires < Date.now()) {
            await db.run('DELETE FROM AuthTokens WHERE token = $1', accessToken);
            throw errors.TOKEN_NOT_FOUND;
        }

        return new AccessToken(
            token.token, 
            new Date(token.expires),
            token.user_id,
            AuthToken.deserialize(token.compass_token)
        );
    }

    /**
     * Saves an access token into the DB
     * @async
     * @param {string} accessToken 
     * @param {Date} expires 
     * @param {number} userId 
     * @param {AuthToken} compassToken 
     */
    static async saveToken(accessToken: string, expires: Date, userId: number, compassToken: AuthToken) {
        const token = new AccessToken(
            accessToken,
            expires,
            userId,
            compassToken
        );
    
        await db.run(
            'INSERT INTO AuthTokens (token, expires, user_id, compass_token) VALUES ($1,$2,$3,$4)',
            token.token,
            token.expires.getTime(),
            userId,
            compassToken.serialize()
        );
    }
}

export = AccessToken;