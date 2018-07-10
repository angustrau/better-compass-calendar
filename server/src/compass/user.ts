import request = require('./request');
import AuthToken = require('./AuthToken');
import errors = require('./errors');

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