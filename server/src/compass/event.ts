import request = require('./request');
import AuthToken = require('./AuthToken');
import leftPad = require('./../utils/leftPad');
import errors = require('./errors');

export interface EventDetails {
    '__type': string;
    'activityId': number;
    'activityType': number;
    'allDay': boolean;
    'attendanceMode': number;
    'backgroundColor': string;
    'calendarId': number | null;
    'description': string;
    'finish': Date;
    'guid': string;
    'instanceId': string;
    'isRecurring': boolean;
    'longTitle': string;
    'longTitleWithoutTime': string;
    'managerId': number;
    'rollMarked': boolean;
    'runningStatus': number;
    'start': Date;
    'targetStudentId': number;
    'title': string;
}

const toDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = leftPad((date.getMonth() + 1).toString(), '0', 2);
    const _date = leftPad(date.getDate().toString(), '0', 2);
    return `${year}-${month}-${_date}`;
}

/**
 * Retrieves a list of events for a user
 * @async
 * @param {number} id 
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {AuthToken} authToken 
 * @returns {Promise<EventDetails[]>}
 */
export const getEventsByUser = async (id: number, startDate: Date, endDate: Date, authToken: AuthToken): Promise<EventDetails[]> => {
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
        return response.body.d.map(x => {
            return {
                ...x,
                start: new Date(x.start),
                finish: new Date(x.finish)
            }
        });
    } else {
        if (response.body.Message === 'Access is denied.') {
            throw errors.ACCESS_DENIED;
        }
        throw errors.INVALID_TOKEN;
    }
}