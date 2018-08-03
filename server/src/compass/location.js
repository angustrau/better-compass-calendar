"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("./request");
const errors = require("./errors");
/**
 * Gets a list of all locations
 * @async
 * @param {AuthToken} authToken
 * @returns {Promise<CompassLocation[]>}
 */
exports.getAllLocations = async (authToken) => {
    let response = await request('/Services/ReferenceData.svc/GetAllLocations?sessionstate=readonly', {
        method: 'POST',
        jar: authToken.jar,
        json: {}
    });
    if (response.statusCode === 200) {
        return response.body.d;
    }
    else {
        throw errors.INVALID_TOKEN;
    }
};
//# sourceMappingURL=location.js.map