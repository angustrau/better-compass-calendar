import db = require('./../../db');
import errors = require('./errors');

/**
 * Information about a location
 */
export interface Location {
    id: number;
    fullName: string;
    shortName: string;
}

/**
 * Converts database response to location
 * @param data 
 */
const dataToLocation = (data): Location => {
    return {
        id: data.id,
        fullName: data.full_name,
        shortName: data.short_name
    }
}

/**
 * Gets location data from the DB
 * Either pass in an id (number) or the short name (string)
 * @async
 * @param {number | string} x Location ID or short name
 * @returns {Promise<Location>}
 */
export const getLocation = async (x: number | string): Promise<Location> => {
    let data;
    if (typeof(x) === 'number') {
        if (x === 0) {
            x = 1;
        }
        data = await db.get('SELECT id, full_name, short_name FROM Locations WHERE id = $1', x);
    } else if (typeof(x) === 'string') {
        data = await db.get('SELECT id, full_name, short_name FROM Locations WHERE short_name = $1', x);
    }

    if (!data) {
        throw errors.LOCATION_NOT_FOUND;
    }

    return dataToLocation(data);
}

/**
 * Saves location data into the DB
 * @async
 * @param {Location} location 
 */
export const saveLocation = async (location: Location) => {
    await db.run(
        'REPLACE INTO Locations (id, full_name, short_name) VALUES ($1,$2,$3)',
        location.id,
        location.fullName,
        location.shortName
    );
}

/**
 * Get a list of all locations from the DB
 */
export const getAllLocations = async () => {
    const data = await db.all('SELECT id, full_name, short_name FROM Locations');
    return data.map(location => dataToLocation(location));
}