import schema = require('./../db/schema');
import compass = require('./../compass');
import user = require('./../user');
import activities = require('./../activities');
import objectHash = require('object-hash');
import { AccessToken } from '../db/schema/AccessToken';
import { EventDetails } from '../compass/event';
import { default_type } from '../../node_modules/@types/mime';
import { Event } from '../db/schema/event';

export const errors = {
    INVALID_QUERY: 'Query is not valid'
}

export interface Query extends schema.event.Query {
    subscribed: boolean | undefined;
}

const hashEvent = (event: EventDetails): string => {
    return objectHash([
        event.guid, 
        event.longTitle,
        event.description,
        event.start.getTime(), 
        event.finish.getTime(),
        event.backgroundColor,
        event.managerId,
        event.runningStatus
    ]);
}

const saveEvent = async (event: EventDetails) => {
    const locationMatch = event.longTitleWithoutTime.match(/^.*-.*-.* ([A-Za-z0-9]+) -.*$/);
    let locationId: number | null = null;
    if (locationMatch) {
        locationId = await schema.location.getLocation(locationMatch[1]).then(x => x.id);
    }

    const _event: Event = {
        id: event.guid,
        title: event.title,
        description: event.description,
        activityId: event.activityId,
        locationId: locationId,
        managerId: event.managerId,
        allDay: event.allDay,
        cancelled: event.runningStatus === 0,
        startTime: event.start,
        endTime: event.finish,
        hash: hashEvent(event)
    }
    await schema.event.saveEvent(_event);
    return _event;
}

export const query = async (query: Query, accessToken: AccessToken) => {
    // TODO implement subscription filtering
    return await schema.event.queryEvents(query);
}

const cacheEvents = async (accessToken: AccessToken, start: Date, end: Date) => {
    let events = await compass.event.getEventsByUser(accessToken.userId, start, end, accessToken.compassToken);

    let activityIds: number[] = [];
    let managerIds: number[] = [];
    events.forEach(x => {
        if (!managerIds.includes(x.managerId)) {
            managerIds.push(x.managerId);
        }
        if (!activityIds.includes(x.activityId)) {
            activityIds.push(x.activityId);
        }
    });
    await Promise.all([
        ...activityIds.map(activityId => activities.registerActivity(activityId, accessToken)),
        ...managerIds.map(managerId => user.registerUser(managerId, accessToken))
    ]);

    await Promise.all(events.map(async (event) => {
        try {
            const currentDetails = await schema.event.getEvent(event.guid);
            const newHash = hashEvent(event);

            if (currentDetails.hash !== newHash) {
                saveEvent(event);
            }
        } catch (error) {
            if (error === schema.errors.EVENT_NOT_FOUND) {
                saveEvent(event);
            } else {
                throw error;
            }
        }
    }))
}

export const cacheEventsFortnight = async (accessToken: AccessToken) => {
    const currentTime = new Date();
    const today = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());
    // One fortnight in milliseconds
    const fortnight = 2 * 7 * 24 * 60 * 60 * 1000;

    await cacheEvents(accessToken, today, new Date(today.getTime() + fortnight));
}

export const cacheEventsYear = async (accessToken: AccessToken) => {
    const currentTime = new Date();
    const start = new Date(currentTime.getFullYear(), 0, 1);
    const end = new Date (currentTime.getFullYear(), 11, 31);

    await cacheEvents(accessToken, start, end);
}