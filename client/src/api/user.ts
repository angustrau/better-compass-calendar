import apiRequest from './apiRequest';
import { IAccessToken } from "./auth";

export interface IUserDetails {
    id: number;
    displayCode: string;
    fullName: string;
    email: string;
}

export const getUserDetails = async (token: IAccessToken) => {
    const response = await apiRequest('GET', '/user/details', null, token);
    return response as IUserDetails;
}

export const deleteUser = async (token: IAccessToken) => {
    await apiRequest('DELETE', '/user', null, token);
}