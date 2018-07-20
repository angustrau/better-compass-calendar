import * as api from './../api';
import * as auth from './../auth';

import CustomEventTarget from './../utils/CustomEventTarget';

export const events = new CustomEventTarget();

let user: api.IUserDetails = {
    id: 0,
    displayCode: '',
    fullName: '',
    email: ''
};

const updateUserDetails = async () => {
    if (auth.isAuthenticated()) {
        user = await api.getUserDetails(auth.getToken()!);
        events.dispatchEvent(new Event('update'));
    }
}

export const init = async () => {
    auth.events.addEventListener('login', async () => {
        await updateUserDetails();
    });
    await updateUserDetails();
}

export const getUser = () => user;