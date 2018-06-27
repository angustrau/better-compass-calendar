import * as db from './../../db';
import * as errors from './errors';
import AuthToken from './../../compass/AuthToken';

export interface AccessToken {
    token: string;
    expires: Date;
    userId: number;
    compassToken: AuthToken;
}

/**
 * Retrieves an access token from the DB
 * @async
 * @param {string} accessToken The token to retrieve
 * @returns {Promise<AccessToken>}
 */
export const getToken = async (accessToken: string): Promise<AccessToken> => {
    const token = await db.get('SELECT token, expires, user_id, compass_token FROM AuthTokens WHERE token = $1', accessToken);
    
    if (!token) {
        throw errors.TOKEN_NOT_FOUND;
    }

    if (token.expires < Date.now()) {
        await db.run('DELETE FROM AuthTokens WHERE token = $1', accessToken);
        throw errors.TOKEN_NOT_FOUND;
    }

    return {
        token: token.token, 
        expires: new Date(token.expires),
        userId: token.user_id,
        compassToken: AuthToken.deserialize(token.compass_token)
    }
}

/**
* Saves an access token into the DB
* @async
* @param {AccessToken} token
*/
export const saveToken = async (token: AccessToken) => {
   await db.run(
       'INSERT INTO AuthTokens (token, expires, user_id, compass_token) VALUES ($1,$2,$3,$4)',
       token.token,
       token.expires.getTime(),
       token.userId,
       token.compassToken.serialize()
   );
}