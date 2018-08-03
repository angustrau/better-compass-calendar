"use strict";
const express = require("express");
const router = express.Router();
const auth = require("./../auth");
const events = require("./../events");
router.post('/query', auth.authenticate, async (req, res, next) => {
    try {
        const query = Object.assign({}, req.body, { before: req.body.before ? new Date(req.body.before) : undefined, after: req.body.after ? new Date(req.body.after) : undefined });
        res.json({
            events: await events.query(query, req.token)
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/details', auth.authenticate, async (req, res, next) => {
    try {
        res.json(await events.getEvent(req.body.id));
    }
    catch (error) {
        next(error);
    }
});
module.exports = router;
//# sourceMappingURL=events.js.map