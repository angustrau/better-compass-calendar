import express = require('express');
import * as push from './../push';
import { User } from '../db/schema/user';

export const errors = {
    INVALID_TOKEN: 'Invalid authorisation token'
}

export const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.user.isAdmin) {
        next(errors.INVALID_TOKEN);
    } else {
        next();
    }
}

export const sendPush = async (user: User, data: push.PushMessage) => {
    await push.pushMessage(user, data);
}