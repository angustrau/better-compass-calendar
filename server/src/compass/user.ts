import request = require('./request');
import AuthToken = require('./AuthToken');
import errors = require('./errors');
import { Response } from 'request';

interface UserDetails {
    id: number;
    displayCode: string;
    fullName: string;
    email: string;
}

/**
 * Retrieves detailed information about a user
 * @async
 * @param {number}    id        - The user id to look up
 * @param {AuthToken} authToken - An authentication token with permissions to look up user
 * @returns {Promise<UserDetails>}
 */
export const getDetails = async (id: number, authToken: AuthToken): Promise<UserDetails> => {
    let response: Response = await request('/Services/User.svc/GetUserDetailsBlobByUserId?sessionstate=readonly', {
        method: 'POST',
        jar: authToken.jar,
        qs: {
            _dc: Date.now()
        },
        json: {
            id: id,
            targetUserId: id
        }
    });

    if (response.statusCode === 200) {
        if (!response.body.d) {
            throw errors.ACCESS_DENIED;
        }

        let { userId, userDisplayCode, userFullName, userEmail } = response.body.d;

        return {
            id: userId,
            displayCode: userDisplayCode,
            fullName: userFullName,
            email: userEmail
        }
    } else {
        throw errors.INVALID_TOKEN;
    }
    
}