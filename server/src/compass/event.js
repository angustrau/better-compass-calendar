"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("./request");
const errors = require("./errors");
/**
 * Converts a date to a string as required by Compass
 */
const toDateString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const _date = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${_date}`;
};
/**
 * Retrieves a list of events for a user
 * @async
 * @param {number} id
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {AuthToken} authToken
 * @returns {Promise<EventDetails[]>}
 */
exports.getEventsByUser = async (id, startDate, endDate, authToken) => {
    let response = await request('/Services/Calendar.svc/GetEventsByUser?sessionstate=readonly', {
        method: 'POST',
        jar: authToken.jar,
        json: {
            userId: id,
            startDate: toDateString(startDate),
            endDate: toDateString(endDate),
            page: 1,
            start: 0,
            // Limit doesn't do anything
            limit: 25
        }
    });
    if (response.statusCode === 200) {
        return response.body.d.map((x) => {
            const start = new Date(x.start);
            const finish = new Date(x.finish);
            return Object.assign({}, x, { start,
                finish, 
                // Check if the event goes for more than 7 hours
                allDay: (finish.getTime() - start.getTime()) / 3.6e6 > 7 });
        });
    }
    else {
        if (response.body.Message === 'Access is denied.') {
            throw errors.ACCESS_DENIED;
        }
        throw errors.INVALID_TOKEN;
    }
};
/**
 * Get the extended details for an event
 * @param event
 * @param authToken
 */
exports.getExtendedEventDetails = async (event, authToken) => {
    let response = await request('/Services/Activity.svc/GetLessonsByInstanceIdQuick?sessionstate=readonly', {
        method: 'POST',
        jar: authToken.jar,
        json: {
            instanceId: event.instanceId
        }
    });
    if (response.statusCode === 200) {
        return response.body.d;
    }
    else {
        throw errors.INVALID_TOKEN;
    }
};
//# sourceMappingURL=event.js.map