import apiRequest from './apiRequest';
import { IAccessToken } from './auth';

export interface ILocationDetails {
    id: number;
    fullName: string;
    shortName: string;
}

export const getLocationDetails = async (id: number, token: IAccessToken) => {
    const response = await apiRequest('POST', '/location/details', {
        id
    }, token);
    return response as ILocationDetails;
}

export const getAllLocations = async (token: IAccessToken) => {
    const response = await apiRequest('GET', '/location/all', null, token);
    return response.locations as ILocationDetails[];
}