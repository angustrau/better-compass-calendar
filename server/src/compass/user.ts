import request = require('./request');
import AuthToken = require('./AuthToken');
import errors = require('./errors');
import cheerio = require('cheerio');

interface UserDetails {
    '__type': string | null;
    'userDetails': string | null;
    'userDisplayCode': string | null;
    'userEmail': string | null;
    'userFlags': Array<any> | null;
    'userFormGroup': string | null;
    'userFullName': string | null;
    'userHouse': string | null;
    'userId': number | null;
    'userPhoneExtension': number | null;
    'userPhotoPath': string | null;
    'userPreferredName': string | null;
    'userRole': number | null;
    'userSchoolId': string | null;
    'userSchoolURL': string | null;
    'userSquarePhotoPath': string | null;
    'userSussiID': string | null;
    'userVSN': string | null;
    'userYearLevel': string | null;
    'userYearLevelId': number | null;
}

interface ClassDetails {
    '__type': string;
    'attendanceModeDefault': number | null;
    'campusId': number | null;
    'checkInEnabledDefault': number;
    'customLocation': null;
    'description': string | null;
    'extendedStatusId': number | null;
    'facultyName': string;
    'finish': Date;
    'haparaSyncEnabled': boolean;
    'id': number;
    'importIdentifier': string;
    'layerAllowsImport': boolean;
    'layerId': number;
    'locationId': number | null;
    'managerId': number | null;
    'managerImportIdentifier': string | null;
    'name': string;
    'periodStructureId': number;
    'start': Date;
    'subjectId': number;
    'subjectImportIdentifier': string;
    'subjectLongName': string;
    'yearLevelShortName': string
}

/**
 * Retrieves detailed information about a user
 * @async
 * @param {number}    id        - The user id to look up
 * @param {AuthToken} authToken - An authentication token with permissions to look up user
 * @returns {Promise<UserDetails>}
 */
export const getDetails = async (id: number, authToken: AuthToken): Promise<UserDetails> => {
    let response = await request('/Services/User.svc/GetUserDetailsBlobByUserId?sessionstate=readonly', {
        method: 'POST',
        jar: authToken.jar,
        json: {
            id: id,
            targetUserId: id
        }
    });

    if (response.statusCode === 200) {
        if (!response.body.d) {
            throw errors.ACCESS_DENIED;
        }

        return response.body.d;
    } else {
        throw errors.INVALID_TOKEN;
    }
}

export const getClasses = async (authToken: AuthToken): Promise<ClassDetails[]> => {
    let response = await request('/Services/Subjects.svc/GetStandardClassesOfUserInAcademicGroup', {
        method: 'POST',
        jar: authToken.jar,
        json: {
            academicGroupId: -1,
            userId: authToken.id,
            page: 1,
            start: 0,
            limit: 50
        }
    });

    if (response.statusCode === 200) {
        return (response.body.d.data as Array<any>).map((x): ClassDetails => {
            return {
                ...x,
                start: new Date(x.start),
                finish: new Date(x.finish)
            }
        });
    } else {
        throw errors.INVALID_TOKEN;
    }
}

interface ActivityDetails {
    id: number;
}

export const getActivities = async (authToken: AuthToken): Promise<ActivityDetails[]> => {
    let response = await request('/', {
        method: 'GET',
        jar: authToken.jar
    });

    if (response.statusCode === 200) {
        let $ = cheerio.load(response.body);

        const activities = $('a[href^="/Organise/Activities/Activity.aspx#activity/"]').map((index, element) => {
            const activityMatch = element.attribs.href.match(/^\/Organise\/Activities\/Activity\.aspx#activity\/(\d+)$/);
            if (activityMatch) {
                return activityMatch[1];
            }
        }).get().map((x): ActivityDetails => {
            return {
                id: parseInt(x)
            }
        });

        return activities;
    } else {
        throw errors.INVALID_TOKEN;
    }
    
}