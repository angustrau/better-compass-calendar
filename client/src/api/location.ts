import apiRequest from './apiRequest';
import { IAccessToken } from './auth';

export interface ILocationDetails {
    id: number;
    fullName: string;
    shortName: string;
}

/**
 * Get a list of all locations
 * @async
 * @param {IAccessToken} token An authorisation token
 * @returns {Promise<ILocationDetails[]>} 
 */
export const getAllLocations = async (token: IAccessToken) => {
    const response = await apiRequest('GET', '/location/all', null, token);
    return response.locations as ILocationDetails[];
}