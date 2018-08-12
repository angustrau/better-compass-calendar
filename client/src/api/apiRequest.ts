import config from '../config';
import { IAccessToken } from "./auth";

/**
 * Send an API request to the server
 * @async
 * @param {string} method The HTTP method to use
 * @param {string} endpoint The path to send the request to
 * @param {any} [body] The payload data to send. Must be JSON serialisable
 * @param {IAccessToken} [token] An authorisation token for the user
 * @returns {Promise<any>} The result of the request
 */
const apiRequest = async (method: 'GET' | 'POST' | 'DELETE', endpoint: string, body?: any, token?: IAccessToken): Promise<any> => {
    const response = await fetch(config.apiEndpoint + endpoint, {
        body: body ? JSON.stringify(body) : undefined,
        headers: {
            'Authorization': token ? token.token : '',
            'Content-Type': 'application/json'
        },
        method
    })
    .then(res => {
        return res.json();
    });
    
    if (response.error) {
        throw response.error;
    }
    
    return response;
}
export default apiRequest;