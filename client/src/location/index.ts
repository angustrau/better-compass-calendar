import * as api from './../api';
import * as auth from './../auth';

let locations: api.ILocationDetails[] = [];
const updateLocations = async () => {
    if (auth.isAuthenticated()) {
        locations = await api.getAllLocations(auth.getToken()!)
    }
}

export const init = () => {
    auth.events.addEventListener('log in', updateLocations);
    updateLocations();
}

export const getAllLocations = () => locations;