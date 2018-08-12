import icalendar = require('icalendar');
import events = require('./../events');
import { AccessToken } from '../db/schema/accessToken';
import filterToQuery from '../utils/filterToQuery';
import user = require('./../user');
import location = require('./../location');

/**
 * Create an iCal calendar from a filter
 * @param filter 
 * @param token 
 */
export const generate = async (filter: string, token: AccessToken) => {
    const calendar = new icalendar.iCalendar();
    /** A list of events matching the filter */
    const results = await events.query(filterToQuery(filter, token.userId), token);

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
            (data.startTime as any).date_only = true;
            (data.endTime as any).date_only = true;
        }
        
        calendar.addComponent(event);
    }));

    return calendar;
}