import schema = require('./../db/schema');
import compass = require('./../compass');
import user = require('./../user');
import activities = require('./../activities');
import notification = require('./../notification');
import objectHash = require('object-hash');
import { AccessToken } from '../db/schema/AccessToken';
import { EventDetails } from '../compass/event';
import { Event, Query } from '../db/schema/event';

export const errors = {
    INVALID_QUERY: 'Query is not valid'
}

export const getEvent = async (id: string) => {
    return schema.event.getEvent(id);
}

const hashEvent = (event: EventDetails): string => {
    return objectHash([
        event.instanceId, 
        event.longTitle,
        event.description,
        event.start.getTime(), 
        event.finish.getTime(),
        event.backgroundColor,
        event.managerId,
        event.runningStatus,
        event.allDay
    ]);
}

const saveEvent = async (event: EventDetails) => {
    const locationMatch = event.longTitleWithoutTime.match(/^.*-.*-.* ([A-Za-z0-9]+) -.*$/);
    let locationId: number | null = null;
    if (locationMatch) {
        locationId = await schema.location.getLocation(locationMatch[1]).then(x => x.id);
    }

    const _event: Event = {
        id: event.instanceId,
        title: event.title,
        description: event.description,
        activityId: event.activityId,
        locationId: locationId,
        managerId: event.managerId,
        allDay: event.allDay,
        cancelled: event.runningStatus === 0,
        startTime: event.start,
        endTime: event.finish,
        hasChanged: event.backgroundColor === '#f4dcdc',
        hash: hashEvent(event)
    }
    await schema.event.saveEvent(_event);
    return _event;
}

export const query = async (query: Query, accessToken: AccessToken) => {
    if (query.subscribedUserId && query.subscribedUserId !== accessToken.userId) {
        throw errors.INVALID_QUERY;
    }

    return await schema.event.queryEvents(query);
}

const cacheEvents = async (accessToken: AccessToken, start: Date, end: Date) => {
    let data = await compass.event.getEventsByUser(accessToken.userId, start, end, accessToken.compassToken);
    let events = await Promise.all(data.map(async (eventData) => {
        if (eventData.backgroundColor === '#f4dcdc') {
            // Event has been modified
            const extendedDetails = await compass.event.getExtendedEventDetails(eventData, accessToken.compassToken);
            if (extendedDetails.CoveringUid !== 0) {
                return {
                    ...eventData,
                    managerId: extendedDetails.CoveringUid
                }
            }
        }

        return eventData;
    }));

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
            const currentDetails = await schema.event.getEvent(event.instanceId);
            const newHash = hashEvent(event);

            if (currentDetails.hash !== newHash) {
                const _event = await saveEvent(event);
                if (event.start > new Date()) {
                    await notification.notifyEventUpdate(_event);
                }
            }
        } catch (error) {
            if (error === schema.errors.EVENT_NOT_FOUND) {
                await saveEvent(event);
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