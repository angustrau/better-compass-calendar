import * as api from "../api";
import CustomEventTarget from '../utils/CustomEventTarget';

const STORAGE_TOKEN_KEY = 'bcc-auth-token';
const STORAGE_EXPIRES_KEY = 'bcc-auth-expires';
const STORAGE_USERNAME_KEY = 'bcc-auth-username';
const STORAGE_PASSWORD_KEY = 'bcc-auth-password';

let token: api.IAccessToken | null = null;
let savedUsername: string | null = null;
let savedPassword: string | null = null;

export const events = new CustomEventTarget();

const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
const savedExpires = localStorage.getItem(STORAGE_EXPIRES_KEY);
if (savedToken && savedExpires && parseInt(savedExpires, 10) > Date.now()) {
    token = {
        expires: new Date(parseInt(savedExpires, 10)),
        token: savedToken
    }
}
export const init = async () => {
    savedUsername = localStorage.getItem(STORAGE_USERNAME_KEY);
    savedPassword = localStorage.getItem(STORAGE_PASSWORD_KEY);
    if (!token && savedUsername && savedPassword) {
        login(savedUsername, savedPassword, true);
    }
}

export const getToken = () => {
    if (!token) {
        return null;
    }

    if (token.expires.getTime() <= Date.now()) {
        logout();
    }

    return token;
}

let loggingIn = false;
export const login = async (username: string, password: string, rememberMe: boolean) => {
    loggingIn = true;
    token = await api.getToken(username, password);

    if (rememberMe) {
        savedUsername = username;
        savedPassword = password;
        localStorage.setItem(STORAGE_USERNAME_KEY, username);
        localStorage.setItem(STORAGE_PASSWORD_KEY, password);
    }
    localStorage.setItem(STORAGE_TOKEN_KEY, token.token);
    localStorage.setItem(STORAGE_EXPIRES_KEY, token.expires.getTime().toString());

    loggingIn = false;
    events.dispatchEvent(new Event('login'));
}

export const logout = async () => {
    if (!token) {
        return;
    }

    api.deleteToken(token);
    token = null;
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_EXPIRES_KEY);
    localStorage.removeItem(STORAGE_USERNAME_KEY);
    localStorage.removeItem(STORAGE_PASSWORD_KEY);
    savedUsername = null;
    savedPassword = null;

    events.dispatchEvent(new Event('logout'));
}

export const isAuthenticated = () => getToken() !== null;
export const isLoggingIn = () => loggingIn;