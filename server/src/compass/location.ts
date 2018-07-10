import request = require('./request');
import AuthToken = require('./AuthToken');
import errors = require('./errors');

interface CompassLocation {
    '__type': string;
    'building': string | undefined;
    'id': number;
    'longName': string;
    'n': string;
    'roomName': string;
}

/**
 * Gets a list of all locations
 * @async
 * @param {AuthToken} authToken 
 * @returns {Promise<CompassLocation[]>}
 */
export const getAllLocations = async (authToken: AuthToken): Promise<CompassLocation[]> => {
    let response = await request('/Services/ReferenceData.svc/GetAllLocations?sessionstate=readonly', {
        method: 'POST',
        jar: authToken.jar,
        json: {}
    });

    if (response.statusCode === 200) {
        return (response.body.d as Array<CompassLocation>);
    } else {
        throw errors.INVALID_TOKEN;
    }
}