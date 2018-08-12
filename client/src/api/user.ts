import apiRequest from './apiRequest';
import { IAccessToken } from "./auth";

/**
 * Detailed information about a user
 */
export interface IUserDetails {
    id: number;
    displayCode: string;
    fullName: string;
    email: string;
    isManager: boolean;
    isAdmin: boolean;
}

/**
 * Get details of the current logged in user
 * @async
 * @param {IAccessToken} token An authorisation token
 * @returns {Promise<IUserDetails>}
 */
export const getUserDetails = async (token: IAccessToken): Promise<IUserDetails> => {
    const response = await apiRequest('GET', '/user/details', null, token);
    return response as IUserDetails;
}

/**
 * Delete the user and all data
 * @async
 * @param {IAccessToken} token An authorisation token
 */
export const deleteUser = async (token: IAccessToken) => {
    await apiRequest('DELETE', '/user', null, token);
}

/**
 * Get a list of all managers (teachers) and their details
 * @async
 * @param {IAccessToken} token An authorisation token
 * @returns {Promise<IUserDetails[]>} The result of the query
 */
export const getManagers = async (token: IAccessToken) => {
    const response = await apiRequest('GET', '/user/managers', null, token);
    return response.managers as IUserDetails[]; 
}