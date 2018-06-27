import express = require('express');
import UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();
import compass = require('./../compass');
import schema = require('./../db/schema');

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

    let user: schema.user.User;
    try {
        user = await schema.user.getUser(authToken.id);
    } catch (error) {
        if (error === schema.errors.USER_NOT_FOUND) {
            const { id, displayCode, fullName, email } = await compass.user.getDetails(authToken.id, authToken);

            await schema.user.saveUser({
                id: id,
                displayCode: displayCode,
                fullName: fullName,
                email: email
            });
            user = await schema.user.getUser(id);
        } else {
            throw error;
        }
    }

    let token: schema.accessToken.AccessToken = {
        token: await uidgen.generate(), 
        expires: authToken.expires, 
        userId: user.id, 
        compassToken: authToken
    }

    await schema.accessToken.saveToken(token);

    return token;
}

declare module 'express-serve-static-core' {
    interface Request {
        user: schema.user.User;
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
    const accessToken: string|undefined = req.get('Authorization');

    if (!accessToken) {
        next(errors.INVALID_TOKEN);
        return;
    }

    try {
        const token = await schema.accessToken.getToken(accessToken);
        req.user = await schema.user.getUser(token.userId);
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