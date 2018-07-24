import * as api from './../api';
import * as auth from './../auth';

import CustomEventTarget from './../utils/CustomEventTarget';

export const events = new CustomEventTarget();

let user: api.IUserDetails = {
    id: 0,
    displayCode: '',
    fullName: '',
    email: '',
    isManager: false
};

const updateUserDetails = async () => {
    if (auth.isAuthenticated()) {
        user = await api.getUserDetails(auth.getToken()!);
        events.dispatchEvent(new Event('update'));
    }
}

let managers: api.IUserDetails[] = [];
const updateManagers = async () => {
    if (auth.isAuthenticated()) {
        managers = await api.getManagers(auth.getToken()!);
    }
}

export const init = async () => {
    auth.events.addEventListener('login', () => {
        updateUserDetails();
        updateManagers();
    });
    updateUserDetails();
    updateManagers();
}

export const getUser = () => user;
export const getAllManagers = () => managers;

