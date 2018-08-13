"use strict";
const express = require("express");
const router = express.Router();
const auth = require("./../auth");
const events = require("./../events");
const schema = require("./../db/schema");
/**
 * POST /api/events/query
 * Query for events
 */
router.post('/query', auth.authenticate, async (req, res, next) => {
    try {
        if (typeof (req.body) !== 'object') {
            throw 'Invalid input';
        }
        const query = Object.assign({}, req.body, { before: req.body.before ? new Date(req.body.before) : undefined, after: req.body.after ? new Date(req.body.after) : undefined });
        res.json({
            events: await events.query(query, req.token)
        });
        schema.logging.query(req.user);
    }
    catch (error) {
        next(error);
    }
});
/**
 * POST /api/events/details
 * Get detailed information about an event
 */
router.post('/details', auth.authenticate, async (req, res, next) => {
    try {
        if (!req.body.id || typeof (req.body.id) !== 'number') {
            throw 'Invalid input';
        }
        res.json(await events.getEvent(req.body.id));
    }
    catch (error) {
        next(error);
    }
});
module.exports = router;
//# sourceMappingURL=events.js.map