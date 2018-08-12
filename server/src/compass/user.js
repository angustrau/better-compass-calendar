"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("./request");
const errors = require("./errors");
const cheerio = require("cheerio");
/**
 * Retrieves detailed information about a user
 * @async
 * @param {number}    id        - The user id to look up
 * @param {AuthToken} authToken - An authentication token with permissions to look up user
 * @returns {Promise<UserDetails>}
 */
exports.getDetails = async (id, authToken) => {
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
    }
    else {
        throw errors.INVALID_TOKEN;
    }
};
/**
 * Gets a list of classes for a user
 * @param authToken
 */
exports.getClasses = async (authToken) => {
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
        return response.body.d.data.map((x) => {
            return Object.assign({}, x, { start: new Date(x.start), finish: new Date(x.finish) });
        });
    }
    else {
        throw errors.INVALID_TOKEN;
    }
};
/**
 * Get a list of the user's main activities
 * Simpler than getClasses()
 * @param authToken
 */
exports.getActivities = async (authToken) => {
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
        }).get().map((x) => {
            return {
                id: parseInt(x)
            };
        });
        return activities;
    }
    else {
        throw errors.INVALID_TOKEN;
    }
};
//# sourceMappingURL=user.js.map