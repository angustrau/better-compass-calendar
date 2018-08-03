"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema = require("./../db/schema");
const compass = require("./../compass");
let cachedLocations = false;
/**
 * Retrieves and caches information about locations
 * @param accessToken
 */
exports.cacheLocations = async (accessToken) => {
    // Only cache locations once
    if (cachedLocations)
        return;
    // Retrieve a list of all locations
    let locations = (await compass.location.getAllLocations(accessToken.compassToken)).map((x) => {
        return {
            id: x.id,
            fullName: x.longName,
            shortName: x.roomName
        };
    });
    await Promise.all(locations.map(x => schema.location.saveLocation(x)));
    cachedLocations = true;
};
exports.getLocation = async (id) => {
    return await schema.location.getLocation(id);
};
exports.getAlllocations = async () => {
    return await schema.location.getAllLocations();
};
//# sourceMappingURL=index.js.map