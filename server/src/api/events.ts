import express = require('express');
const router = express.Router();
import auth = require('./../auth');
import events = require('./../events');
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
    } catch (error) {
        next(error);
    }
});

export = router;