import * as api from './api';
import * as auth from './auth';

import CustomEventTarget from './utils/CustomEventTarget';

export const events = new CustomEventTarget();

let user: api.IUserDetails = {
    id: 0,
    displayCode: '',
    fullName: '',
    email: '',
    isManager: false,
    isAdmin: false
};

const updateUserDetails = async () => {
    if (auth.isAuthenticated()) {
        user = await api.getUserDetails(auth.getToken()!);
        events.dispatchEvent(new Event('update'));
    }
}

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
    // updateUserDetails();
    // updateManagers();
}

export const getUser = () => user;
export const getAllManagers = () => Object.keys(managers).map(k => managers[k]);

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

