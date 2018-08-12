import * as api from './api';
import * as auth from './auth';

import CustomEventTarget from './utils/CustomEventTarget';

export const events = new CustomEventTarget();

// Set up default user details
let user: api.IUserDetails = {
    id: 0,
    displayCode: '',
    fullName: '',
    email: '',
    isManager: false,
    isAdmin: false
};

/**
 * Refresh user details
 */
const updateUserDetails = async () => {
    if (auth.isAuthenticated()) {
        user = await api.getUserDetails(auth.getToken()!);
        events.dispatchEvent(new Event('update'));
    }
}

/**
 * Refresh the list of manager details
 */
const managers: { [id: number]: api.IUserDetails } = {};
const updateManagers = async () => {
    if (auth.isAuthenticated()) {
        const m = await api.getManagers(auth.getToken()!);
        m.forEach((manager) => {
            managers[manager.id] = manager;
        });
    }
}

export const init = async () => {
    auth.events.addEventListener('post-login', () => {
        return Promise.all([
            updateUserDetails(),
            updateManagers()
        ]);
    });
}

export const getUser = () => user;
export const getAllManagers = () => Object.keys(managers).map((k): api.IUserDetails => managers[k]);

/**
 * Find manager details by id
 * @param id 
 */
export const getManager = (id: number) => {
    return managers[id] || {
        id: 0,
        displayCode: '',
        fullName: '',
        email: '',
        isManager: true,
        isAdmin: false
    };
}

