"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema = require("./../db/schema");
const compass = require("./../compass");
const user = require("./../user");
const activities = require("./../activities");
const notification = require("./../notification");
const objectHash = require("object-hash");
exports.errors = {
    INVALID_QUERY: 'Query is not valid'
};
/**
 * Fetch event details by id
 * @param id
 */
exports.getEvent = async (id) => {
    return schema.event.getEvent(id);
};
/**
 * Generate a unique string based on event details
 */
const hashEvent = (event) => {
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
};
/**
 * Store an event in the database
 */
const saveEvent = async (event) => {
    // Get the location of the event from the title
    /** The location short name if it exists */
    const locationMatch = event.longTitleWithoutTime.match(/^.*-.*-.* ([A-Za-z0-9]+) -.*$/);
    let locationId = null;
    if (locationMatch) {
        // Get location id from short name
        locationId = await schema.location.getLocation(locationMatch[1]).then(x => x.id);
    }
    const _event = {
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
    };
    await schema.event.saveEvent(_event);
    return _event;
};
/**
 * Perform a query for events
 */
exports.query = async (query, accessToken) => {
    // Check that the user is authorised to retrieve subscribed events
    if (query.subscribedUserId && query.subscribedUserId !== accessToken.userId) {
        throw exports.errors.INVALID_QUERY;
    }
    return await schema.event.queryEvents(query);
};
/**
 * Retrieve events over a time period and store them in the DB
 */
const cacheEvents = async (accessToken, start, end) => {
    let data = await compass.event.getEventsByUser(accessToken.userId, start, end, accessToken.compassToken);
    // For events which have a CRT, change the managerId to the CRT's ID
    let events = await Promise.all(data.map(async (eventData) => {
        if (eventData.backgroundColor === '#f4dcdc') {
            // Event has been modified
            const extendedDetails = await compass.event.getExtendedEventDetails(eventData, accessToken.compassToken);
            if (extendedDetails.CoveringUid !== 0) {
                return Object.assign({}, eventData, { managerId: extendedDetails.CoveringUid });
            }
        }
        return eventData;
    }));
    /** A list of all unique activities in fetched events */
    let activityIds = [];
    /** A list of all unique managers in fetched events */
    let managerIds = [];
    events.forEach(x => {
        if (!managerIds.includes(x.managerId)) {
            managerIds.push(x.managerId);
        }
        if (!activityIds.includes(x.activityId)) {
            activityIds.push(x.activityId);
        }
    });
    /** Ensure activities and managers are registered */
    await Promise.all([
        ...activityIds.map(activityId => activities.registerActivity(activityId, accessToken)),
        ...managerIds.map(managerId => user.registerUser(managerId, accessToken))
    ]);
    // Check each event for change
    await Promise.all(events.map(async (event) => {
        try {
            const currentDetails = await schema.event.getEvent(event.instanceId);
            const newHash = hashEvent(event);
            if (currentDetails.hash !== newHash) {
                // Event has changed
                const _event = await saveEvent(event);
                if (event.start > new Date()) {
                    await notification.notifyEventUpdate(_event);
                }
            }
        }
        catch (error) {
            if (error === schema.errors.EVENT_NOT_FOUND) {
                // Event is new
                await saveEvent(event);
            }
            else {
                throw error;
            }
        }
    }));
};
/**
 * Cache events for the coming fortnight
 * @param accessToken
 */
exports.cacheEventsFortnight = async (accessToken) => {
    const currentTime = new Date();
    const today = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());
    // One fortnight in milliseconds
    const fortnight = 2 * 7 * 24 * 60 * 60 * 1000;
    await cacheEvents(accessToken, today, new Date(today.getTime() + fortnight));
};
/**
 * Cache all events for the current year
 * @param accessToken
 */
exports.cacheEventsYear = async (accessToken) => {
    const currentTime = new Date();
    const start = new Date(currentTime.getFullYear(), 0, 1);
    const end = new Date(currentTime.getFullYear(), 11, 31);
    await cacheEvents(accessToken, start, end);
};
//# sourceMappingURL=index.js.map