import request = require('./request');
import AuthToken = require('./AuthToken');
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
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const _date = date.getDate().toString().padStart(2, '0')
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
        return response.body.d.map((x): EventDetails => {
            const start = new Date(x.start);
            const finish = new Date(x.finish);

            return {
                ...x,
                start,
                finish,
                allDay: (finish.getTime() - start.getTime()) / 3.6e6 > 7
            }
        });
    } else {
        if (response.body.Message === 'Access is denied.') {
            throw errors.ACCESS_DENIED;
        }
        throw errors.INVALID_TOKEN;
    }
}