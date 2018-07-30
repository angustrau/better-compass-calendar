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