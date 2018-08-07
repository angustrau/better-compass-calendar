import express = require('express');
import * as push from './../push';
import * as db from './../db';
import * as user from './../user';
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

export const sendPush = async (userId: number, data: push.PushMessage) => {
    const receipient = await user.getDetails(userId);
    await push.pushMessage(receipient, data);
}

export const runSQL = async (query: string) => {
    return db.all(query);
}