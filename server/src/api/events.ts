import express = require('express');
const router = express.Router();
import auth = require('./../auth');
import events = require('./../events');
import schema = require('./../db/schema');
import { Query } from '../db/schema/event';

router.post('/query', auth.authenticate, async (req, res, next) => {
    try {
        const query: Query = {
            ...req.body,
            before: req.body.before ? new Date(req.body.before) : undefined,
            after: req.body.after ? new Date(req.body.after) : undefined
        }

        res.json({
            events: await events.query(query, req.token)
        });
        schema.logging.query(req.user);
    } catch (error) {
        next(error);
    }
});

router.post('/details', auth.authenticate, async (req, res, next) => {
    try {
        res.json(await events.getEvent(req.body.id));
    } catch (error) {
        next(error);
    }
});

export = router;