import request = require('./request');
import AuthToken = require('./AuthToken');
import errors = require('./errors');

/**
 * Event details API response
 */
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

/**
 * Converts a date to a string as required by Compass
 */
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
                // Check if the event goes for more than 7 hours
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

/**
 * Event location details API response
 */
export interface EventLocationDetails {
    "__type": string;
    "archived": boolean;
    "availableForBooking": boolean;
    "building": string | null;
    "computerNumber": number;
    "hasCooling": boolean;
    "hasDvd": boolean;
    "hasGas": boolean;
    "hasHeating": boolean;
    "hasProjector": boolean;
    "hasSmartboard": boolean;
    "hasSpeakers": boolean;
    "hasTv": boolean;
    "hasWater": boolean;
    "hasWhiteboard": boolean;
    "hash": string | null;
    "id": number;
    "longName": string;
    "seatNumber": number;
    "shortName": string;
}

/**
 * Extended event details API response
 */
export interface ExtendedEventDetails {
    "__type": string;
    "ActivityDisplayName": string;
    "ActivityId": string;
    "ActivityManagerId": number;
    "ActivitySingular": string;
    "AttendanceMode": number;
    "AttendeeCount": number;
    "AttendeeLimit": number | null;
    "AttendeeUserIdList": number[];
    "CampusId": number;
    "CoveringIid": string;
    "CoveringPhotoPath": string;
    "CoveringUid": number;
    "CurrentInstance": boolean;
    "FutureInstance": boolean;
    "InstancePlural": string;
    "InstanceSingular": string;
    "IsBusRoute": boolean;
    "IsExam": boolean;
    "IsMeeting": boolean;
    "IsSchoolApproval": boolean;
    "IsYardDuty": boolean;
    "LocationDetails": EventLocationDetails;
    "LocationId": number;
    "ManagerPhotoPath": string;
    "ManagerTextReadable": string;
    "PastInstance": boolean;
    "ReadableAttendeeCount": string;
    "RunningStatus": boolean;
    "SubjectId": string;
    "SubjectName": string;
    "SubjectShortname": string;
    "UpcomingInstance": boolean;
    "UserCanCancelOrDelete": boolean;
    "UserCanEdit": boolean;
    "bs": any[];
    "dt": string;
    "fn": string;
    "id": string;
    "irm": boolean;
    "l": string;
    "locations": EventLocationDetails[];
    "lp": {
        "__type": string,
        "fileAssetId": null,
        "mp": null,
        "name": null,
        "sp": null,
        "wnid": null
    };
    "m": string;
    "managers": [
        {
            "__type": string,
            "CoveringImportIdentifier": string,
            "CoveringName": string,
            "CoveringPhotoPath": string,
            "CoveringUserId": number,
            "ManagerImportIdentifier": string,
            "ManagerName": string,
            "ManagerPhotoPath": string,
            "ManagerUserId": number
        }
    ];
    "mi": number;
    "st": string;
    "wsv": string;
}

/**
 * Get the extended details for an event
 * @param event 
 * @param authToken 
 */
export const getExtendedEventDetails = async (event: EventDetails, authToken: AuthToken) => {
    let response = await request('/Services/Activity.svc/GetLessonsByInstanceIdQuick?sessionstate=readonly', {
        method: 'POST',
        jar: authToken.jar,
        json: {
            instanceId: event.instanceId
        }
    });

    if (response.statusCode === 200) {
        return response.body.d as ExtendedEventDetails;
    } else {
        throw errors.INVALID_TOKEN;
    }
}