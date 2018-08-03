"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("./../../db");
const errors = require("./errors");
const AuthToken = require("./../../compass/AuthToken");
/**
 * Retrieves an access token from the DB
 * @async
 * @param {string} accessToken The token to retrieve
 * @returns {Promise<AccessToken>}
 */
exports.getToken = async (accessToken) => {
    const token = await db.get('SELECT token, expires, user_id, compass_token FROM AuthTokens WHERE token = $1', accessToken);
    if (!token) {
        throw errors.TOKEN_NOT_FOUND;
    }
    if (token.expires < Date.now()) {
        await exports.revokeToken(token.token);
        throw errors.TOKEN_NOT_FOUND;
    }
    return {
        token: token.token,
        expires: new Date(token.expires),
        userId: token.user_id,
        compassToken: AuthToken.deserialize(token.compass_token)
    };
};
/**
* Saves an access token into the DB
* @async
* @param {AccessToken} token
*/
exports.saveToken = async (token) => {
    await db.run('INSERT INTO AuthTokens (token, expires, user_id, compass_token) VALUES ($1,$2,$3,$4)', token.token, token.expires.getTime(), token.userId, token.compassToken.serialize());
};
/**
 * Revokes an access token
 * @async
 * @param {string} accessToken
 */
exports.revokeToken = async (accessToken) => {
    await db.run('DELETE FROM AuthTokens WHERE token = $1', accessToken);
};
//# sourceMappingURL=accessToken.js.map