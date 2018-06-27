import express = require('express');
import UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();
import compass = require('./../compass');
import schema = require('./../schema');

export const errors = {
    INVALID_TOKEN: 'Invalid authorisation token'
}

/**
 * Authenticates user and generates token
 * @async
 * @param {string} username 
 * @param {string} password 
 */
export const genToken = async (username: string, password: string) => {
    let authToken = await compass.auth.login(username, password);
    let user = await schema.User.getOrAddUser(authToken);

    let token: string = await uidgen.generate();
    await schema.AccessToken.saveToken(token, authToken.expires, user.id, authToken);

    return token;
}

declare module 'express-serve-static-core' {
    interface Request {
        user: schema.User;
    }
}

/**
 * Middleware: validates request authentication
 * @async
 * @param req 
 * @param res 
 * @param next 
 */
export const authenticate = async (req: express.Request, res, next) => {
    const accessToken: string|undefined = req.get('Authorization');

    if (!accessToken) {
        next(errors.INVALID_TOKEN);
        return;
    }

    try {
        const token = await schema.AccessToken.getToken(accessToken);
        req.user = await schema.User.getUser(token.userId);
    } catch (error) {
        switch (error) {
            case schema.errors.TOKEN_NOT_FOUND:
                next(errors.INVALID_TOKEN);
                return;
            default:
                next(error);
                return;
        }
    }

    next();
}