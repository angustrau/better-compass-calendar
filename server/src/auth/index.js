"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UIDGenerator = require("uid-generator");
const uidgen = new UIDGenerator();
const compass = require("./../compass");
const schema = require("./../db/schema");
const user = require("./../user");
exports.errors = {
    INVALID_TOKEN: 'Invalid authorisation token'
};
/**
 * Authenticates user and generates token
 * @async
 * @param {string} username
 * @param {string} password
 */
exports.generateToken = async (username, password) => {
    let authToken = await compass.auth.login(username, password);
    let token = {
        token: await uidgen.generate(),
        expires: authToken.expires,
        userId: authToken.id,
        compassToken: authToken
    };
    await user.registerUser(token.userId, token);
    await schema.accessToken.saveToken(token);
    return token;
};
/**
 * De-authorises a token
 * @param token
 */
exports.revokeToken = async (token) => {
    await schema.accessToken.revokeToken(token.token);
};
/**
 * Middleware: validates request authentication
 * @async
 * @param req
 * @param res
 * @param next
 */
exports.authenticate = async (req, res, next) => {
    try {
        const accessToken = req.get('Authorization');
        if (!accessToken || typeof (accessToken) !== 'string') {
            throw exports.errors.INVALID_TOKEN;
        }
        req.token = await schema.accessToken.getToken(accessToken);
        req.user = await schema.user.getUser(req.token.userId);
    }
    catch (error) {
        switch (error) {
            case schema.errors.TOKEN_NOT_FOUND:
                next(exports.errors.INVALID_TOKEN);
                return;
            default:
                next(error);
                return;
        }
    }
    next();
};
//# sourceMappingURL=index.js.map