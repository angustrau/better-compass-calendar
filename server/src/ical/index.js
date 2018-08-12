"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const icalendar = require("icalendar");
const events = require("./../events");
const filterToQuery_1 = require("../utils/filterToQuery");
const user = require("./../user");
const location = require("./../location");
/**
 * Create an iCal calendar from a filter
 * @param filter
 * @param token
 */
exports.generate = async (filter, token) => {
    const calendar = new icalendar.iCalendar();
    /** A list of events matching the filter */
    const results = await events.query(filterToQuery_1.default(filter, token.userId), token);
    // Construct each event
    await Promise.all(results.map(async (data) => {
        const event = new icalendar.VEvent(data.id);
        const manager = await user.getDetails(data.managerId);
        const room = await location.getLocation(data.locationId || 0);
        event.setSummary(data.title);
        event.setLocation(room.shortName + ' - ' + manager.displayCode);
        event.setDate(data.startTime, data.endTime);
        if (data.cancelled) {
            event.addProperty('METHOD', 'CANCEL');
            event.addProperty('STATUS', 'CANCELLED');
        }
        if (data.allDay) {
            data.startTime.date_only = true;
            data.endTime.date_only = true;
        }
        calendar.addComponent(event);
    }));
    return calendar;
};
//# sourceMappingURL=index.js.map