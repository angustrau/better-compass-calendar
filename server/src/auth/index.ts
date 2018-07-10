import express = require('express');
import UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();
import compass = require('./../compass');
import schema = require('./../db/schema');
import user = require('./../user');
import { AccessToken } from '../db/schema/AccessToken';

export const errors = {
    INVALID_TOKEN: 'Invalid authorisation token'
}

/**
 * Authenticates user and generates token
 * @async
 * @param {string} username 
 * @param {string} password 
 */
export const generateToken = async (username: string, password: string) => {
    let authToken = await compass.auth.login(username, password);
    let token: AccessToken = {
        token: await uidgen.generate(), 
        expires: authToken.expires, 
        userId: authToken.id, 
        compassToken: authToken
    }

    await user.registerUser(token.userId, token);
    await schema.accessToken.saveToken(token);

    return token;
}

export const revokeToken = async (token: AccessToken) => {
    await schema.accessToken.revokeToken(token.token);
}

declare module 'express-serve-static-core' {
    interface Request {
        user: schema.user.User;
        token: AccessToken;
    }
}

/**
 * Middleware: validates request authentication
 * @async
 * @param req 
 * @param res 
 * @param next 
 */
export const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const accessToken: string | undefined = req.get('Authorization');

        if (!accessToken || typeof(accessToken) !== 'string') {
            throw errors.INVALID_TOKEN;
        }

        req.token = await schema.accessToken.getToken(accessToken);
        req.user = await schema.user.getUser(req.token.userId);
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