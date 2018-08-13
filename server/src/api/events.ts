import express = require('express');
const router = express.Router();
import auth = require('./../auth');
import events = require('./../events');
import schema = require('./../db/schema');
import { Query } from '../db/schema/event';

/**
 * POST /api/events/query
 * Query for events
 */
router.post('/query', auth.authenticate, async (req, res, next) => {
    try {
        if (typeof(req.body) !== 'object') {
            throw 'Invalid input';
        }

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

/**
 * POST /api/events/details
 * Get detailed information about an event
 */
router.post('/details', auth.authenticate, async (req, res, next) => {
    try {
        if (!req.body.id || typeof(req.body.id) !== 'number') {
            throw 'Invalid input';
        }
        
        res.json(await events.getEvent(req.body.id));
    } catch (error) {
        next(error);
    }
});

export = router;