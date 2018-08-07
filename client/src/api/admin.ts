import apiRequest from "./apiRequest";
import { IAccessToken } from "./auth";
import { IPushMessage } from "./push";
import { IUserDetails } from "./user";

export const sendPush = async (userId: number, data: IPushMessage, token: IAccessToken) => {
    await apiRequest('POST', '/admin/sendpush', {
        userId,
        data
    }, token);
}

export const runSQL = async (query: string, token: IAccessToken) => {
    const response = await apiRequest('POST', '/admin/sql', { query }, token);
    return response.result;
}