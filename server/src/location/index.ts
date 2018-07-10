import schema = require('./../db/schema');
import compass = require('./../compass');
import { AccessToken } from '../db/schema/AccessToken';
import { Location } from '../db/schema/location';

let cachedLocations = false;
/**
 * Retrieves and caches information about locations
 * @param accessToken 
 */
export const cacheLocations = async (accessToken: AccessToken) => {
    // Only cache locations once
    if (cachedLocations) return;

    // Retrieve a list of all locations
    let locations = (await compass.location.getAllLocations(accessToken.compassToken)).map((x): Location => {
        return {
            id: x.id,
            fullName: x.longName,
            shortName: x.roomName
        }
    });
    await Promise.all(
        locations.map(x => schema.location.saveLocation(x))
    );

    cachedLocations = true;
}