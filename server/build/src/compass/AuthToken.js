"use strict";
const tough = require("tough-cookie");
const config = require("./../../config");
const errors = require("./errors");
const request = require("request");
class AuthToken {
    /**
     * Creates a Compass authentication token
     * @param {number}    id  - The id of the user connected to this auth token
     * @param {CookieJar} jar - A RequestJS cookie jar
     */
    constructor(id, jar) {
        this.jar = jar;
        this.id = id;
        let sessionCookie = this.jar.getCookies(config.schoolURL).find(x => x.key === 'ASP.NET_SessionId');
        if (!sessionCookie) {
            throw errors.INVALID_TOKEN;
        }
        this.expires = sessionCookie.expires;
    }
    /**
     * Serialise authentication token into a string
     * @returns {string}
     */
    serialize() {
        return JSON.stringify({
            id: this.id,
            jar: this.jar._jar.serializeSync()
        });
    }
    /**
     * Deserialises authentication token from a string
     * @param   {string} serialisedToken - An string representing a serialised auth token
     * @returns {AuthToken}
     */
    static deserialize(serializedToken) {
        const token = JSON.parse(serializedToken);
        const jar = request.jar();
        jar._jar = tough.CookieJar.deserializeSync(token.jar);
        return new AuthToken(token.id, jar);
    }
}
module.exports = AuthToken;
//# sourceMappingURL=AuthToken.js.map