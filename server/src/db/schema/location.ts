import db = require('./../../db');
import errors = require('./errors');

export interface Location {
    id: number;
    fullName: string;
    shortName: string;
}

export const getLocation = async (id: number): Promise<Location> => {
    const data = await db.get('SELECT id, full_name, short_name FROM Locations WHERE id = $1', id);

    if (!data) {
        throw errors.LOCATION_NOT_FOUND;
    }

    return {
        id: data.id,
        fullName: data.full_name,
        shortName: data.short_name
    }
}

export const saveLocation = async (location: Location) => {
    await db.run(
        'REPLACE INTO Locations (id, full_name, short_name) VALUES ($1,$2,$3)',
        location.id,
        location.fullName,
        location.shortName
    )
}

export const clearLocations = async () => {
    await db.run('DELETE FROM Locations');
}