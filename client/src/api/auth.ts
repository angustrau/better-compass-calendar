import apiRequest from "./apiRequest";

export interface IAccessToken {
    token: string;
    expires: Date;
}

export const getToken = async (username: string, password: string) => {
    const response = await apiRequest('POST', '/auth/token', {
        password,
        username
    });

    return {
        expires: new Date(response.expires),
        token: response.token
    } as IAccessToken;
}

export const deleteToken = async (token: IAccessToken) => {
    await apiRequest('DELETE', '/auth/token', {}, token);
}