import apiRequest from './apiRequest';
import { IAccessToken } from "./auth";

export interface IUserDetails {
    id: number;
    displayCode: string;
    fullName: string;
    email: string;
    isManager: boolean;
    isAdmin: boolean;
}

export const getUserDetails = async (token: IAccessToken) => {
    const response = await apiRequest('GET', '/user/details', null, token);
    return response as IUserDetails;
}

export const deleteUser = async (token: IAccessToken) => {
    await apiRequest('DELETE', '/user', null, token);
}

export const getManagers = async (token: IAccessToken) => {
    const response = await apiRequest('GET', '/user/managers', null, token);
    return response.managers as IUserDetails[]; 
}