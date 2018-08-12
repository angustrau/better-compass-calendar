import * as api from "./api";
import CustomEventTarget from './utils/CustomEventTarget';

// Constants
// The keys used to read and write to local storage
const STORAGE_TOKEN_KEY = 'bcc-auth-token';
const STORAGE_EXPIRES_KEY = 'bcc-auth-expires';
const STORAGE_USERNAME_KEY = 'bcc-auth-username';
const STORAGE_PASSWORD_KEY = 'bcc-auth-password';

let token: api.IAccessToken | null = null;
let savedUsername: string | null = null;
let savedPassword: string | null = null;

export const events = new CustomEventTarget();

// On page load, retrieve any existing credentials from local storage
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

    // If a token already exists, dispatch events
    if (token) {
        await events.dispatchEvent(new Event('post-login'));
        await events.dispatchEvent(new Event('login'));
    }

    // If a token doesn't exist but credentials do, perform an automatic log in
    if (!token && savedUsername && savedPassword) {
        await login(savedUsername, savedPassword, true);
    }
}

/**
 * Returns the a currently authenticated user token or null
 */
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
/**
 * Logs the user in
 * @param username 
 * @param password 
 * @param rememberMe Whether to store the credentials for reuse
 */
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
    await events.dispatchEvent(new Event('post-login'));
    events.dispatchEvent(new Event('login'));
}

/**
 * Logs the user out
 */
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

/**
 * Returns whether the user is currently authenticated
 */
export const isAuthenticated = () => getToken() !== null;
/**
 * Returns whether the user is in the process of logging in
 */
export const isLoggingIn = () => loggingIn;