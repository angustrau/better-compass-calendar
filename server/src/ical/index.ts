import icalendar = require('icalendar');
import events = require('./../events');
import { AccessToken } from '../db/schema/accessToken';
import filterToQuery from '../utils/filterToQuery';
import user = require('./../user');
import location = require('./../location');

export const generate = async (filter: string, token: AccessToken) => {
    const results = await events.query(filterToQuery(filter, token.userId), token);
    const calendar = new icalendar.iCalendar();

    await Promise.all(results.map(async (data) => {
        const manager = await user.getDetails(data.managerId);
        const room = await location.getLocation(data.locationId || 0);
        if (data.allDay) {
            (data.startTime as any).date_only = true;
            (data.endTime as any).date_only = true;
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
}