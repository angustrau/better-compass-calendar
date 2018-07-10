import db = require('./../../db');
import errors = require('./errors');

export interface Event {
    id: string;
    title: string;
    description: string;
    activityId: number;
    locationId: number | null;
    managerId: number;
    allDay: boolean;
    cancelled: boolean;
    startTime: Date;
    endTime: Date;
    hash: string;
}

export interface Query {
    title: string | undefined;
    locationId: number | undefined;
    managerId: number | undefined;
    before: Date | undefined;
    after: Date | undefined;
}

const columns = 'id, title, description, activity_id, location_id, manager_id, all_day, cancelled, start_time, end_time, hash';

const dataToEvent = (data): Event => {
    return {
        id: data.id,
        title: data.title,
        description: data.description,
        activityId: data.activity_id,
        locationId: data.location_id,
        managerId: data.manager_id,
        allDay: data.all_day === 1,
        cancelled: data.cancelled === 1,
        startTime: new Date(data.start_time),
        endTime: new Date(data.end_time),
        hash: data.hash
    }
}

/**
 * Retrieves event data from the DB
 * @async
 * @param {string} id
 * @returns {Promise<Event>}
 */
export const getEvent = async (id: string): Promise<Event> => {
    //const data = await db.get(`SELECT ${columns} FROM Events WHERE Events MATCH 'id:$1'`, id);
    const data = await db.get(`SELECT ${columns} FROM Events WHERE id = $1`, id);
    if (!data) {
        throw errors.EVENT_NOT_FOUND;
    }

    return dataToEvent(data);
}

/**
 * Saves event data into the DB
 * @async
 * @param {Event} event 
 */
export const saveEvent = async (event: Event) => {
    await db.run(
        `REPLACE INTO Events (${columns}) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        event.id,
        event.title,
        event.description,
        event.activityId,
        event.locationId,
        event.managerId,
        event.allDay ? 1 : 0,
        event.cancelled ? 1 : 0,
        event.startTime.getTime(),
        event.endTime.getTime(),
        event.hash
    );
}

/*
export const queryEvents = async (query: Query): Promise<Event[]> => {
    const results = await db.all(
        `SELECT id FROM EventsIndex Where EventsIndex MATCHES '"$1" AND (title:$2) AND (location_id:$3) AND (manager_id:$4)'`,
        query.
        query.title || '*',
        query.locationId || '*',
        query.managerId || '*'
    );

    return results.map(dataToEvent);
}
*/