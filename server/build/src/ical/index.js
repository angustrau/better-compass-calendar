"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const icalendar = require("icalendar");
const events = require("./../events");
const filterToQuery_1 = require("../utils/filterToQuery");
const user = require("./../user");
const location = require("./../location");
exports.generate = async (filter, token) => {
    const results = await events.query(filterToQuery_1.default(filter, token.userId), token);
    const calendar = new icalendar.iCalendar();
    await Promise.all(results.map(async (data) => {
        const manager = await user.getDetails(data.managerId);
        const room = await location.getLocation(data.locationId || 0);
        if (data.allDay) {
            data.startTime.date_only = true;
            data.endTime.date_only = true;
        }
        const event = new icalendar.VEvent(data.id);
        event.setSummary(data.title);
        event.setLocation(room.shortName + ' - ' + manager.displayCode);
        if (data.cancelled) {
            event.addProperty('METHOD', 'CANCEL');
            event.addProperty('STATUS', 'CANCELLED');
        }
        event.setDate(data.startTime, data.endTime);
        calendar.addComponent(event);
    }));
    return calendar;
};
//# sourceMappingURL=index.js.map