import apiRequest from "./apiRequest";

export interface IAccessToken {
    // A unique identifier for this session/user
    token: string;
    // Time when the token expires
    expires: Date;
}

/**
 * Get an access token (log in)
 * @async
 * @param {string} username Compass username
 * @param {string} password Compass password
 * @returns {Promise<IAccessToken>}
 */
export const getToken = async (username: string, password: string): Promise<IAccessToken> => {
    const response = await apiRequest('POST', '/auth/token', {
        password,
        username
    });

    return {
        expires: new Date(response.expires),
        token: response.token
    } as IAccessToken;
}

/**
 * Delete an access token (log out)
 * @async
 * @param {IAccessToken} token An authorisation token
 */
export const deleteToken = async (token: IAccessToken) => {
    await apiRequest('DELETE', '/auth/token', {}, token);
}