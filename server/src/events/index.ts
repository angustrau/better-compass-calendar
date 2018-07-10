import schema = require('./../db/schema');
import compass = require('./../compass');
import user = require('./../user');
import activities = require('./../activities');
import objectHash = require('object-hash');
import { AccessToken } from '../db/schema/AccessToken';
import { Event } from '../db/schema/event';
import { EventDetails } from '../compass/event';

export const errors = {
    INVALID_QUERY: 'Query is not valid'
}

export interface Query {
    title: string | undefined;
    locationId: number | undefined;
    managerId: number | undefined;
    before: Date | undefined;
    after: Date | undefined;
    subscribed: boolean | undefined;
}

const hashEvent = (event: EventDetails): string => {
    return objectHash([
        event.guid, 
        event.longTitle,
        event.description,
        event.start.getTime(), 
        event.finish.getTime(),
        event.backgroundColor
    ]);
}

const saveEvent = async (event: EventDetails) => {
    const locationMatch = event.longTitleWithoutTime.match(/^.*-.*-.* ([A-Za-z0-9]+) -.*$/);
    let locationId: number | null = null;
    if (locationMatch) {
        locationId = await schema.location.getLocation(locationMatch[1]).then(x => x.id);
    }

    await schema.event.saveEvent({
        id: event.guid,
        title: event.title,
        description: event.description,
        activityId: event.activityId,
        locationId: locationId,
        managerId: event.managerId,
        allDay: event.allDay,
        cancelled: event.runningStatus === 1,
        startTime: event.start,
        endTime: event.finish,
        hash: hashEvent(event)
    });
}

/*
export const query = async (query: Query, accessToken: AccessToken) => {
    // TODO implement subscription filtering
    return await schema.event.queryEvents(query);
}
*/

export const cacheEvents = async (accessToken: AccessToken) => {
    const currentTime = new Date();
    const today = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());
    // One fortnight in milliseconds
    const fortnight = 2 * 7 * 24 * 60 * 60 * 1000;

    const events = await compass.event.getEventsByUser(accessToken.userId, today, new Date(today.getTime() + fortnight), accessToken.compassToken);

    await Promise.all(events.map(async (event) => {
        await Promise.all([
            activities.registerActivity(event.activityId, accessToken),
            user.registerUser(event.managerId, accessToken)
        ]);

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
    }));
}