import * as api from './api';
import * as auth from './auth';

const locations: { [id: number]: api.ILocationDetails } = {};
const updateLocations = async () => {
    if (auth.isAuthenticated()) {
        const l = await api.getAllLocations(auth.getToken()!);
        l.forEach((location) => {
            locations[location.id] = location;
        })
    }
}

export const init = () => {
    auth.events.addEventListener('post-login', updateLocations);
    // updateLocations();
}

export const getAllLocations = () => Object.keys(locations).map(k => locations[k]);

export const getLocation = (id: number) => {
    return locations[id] || {
        id: 0,
        fullName: '',
        shortName: ''
    };
}