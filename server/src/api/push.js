"use strict";
const express = require("express");
const router = express.Router();
const auth = require("./../auth");
const push = require("./../push");
/**
 * POST /api/push/subscribe
 * Subscribe to push notifications
 */
router.post('/subscribe', auth.authenticate, async (req, res, next) => {
    try {
        push.subscribe(req.user, req.body);
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
/**
 * POST /api/push/unsubscribe
 * Unsubscribe from push notifications
 */
router.post('/unsubscribe', auth.authenticate, async (req, res, next) => {
    try {
        push.unsubscribe(req.user, req.body);
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
/**
 * GET /api/push/subscriptions
 * Get all subscribed devices
 */
router.get('/subscriptions', auth.authenticate, async (req, res, next) => {
    try {
        res.json({ subscriptions: await push.getSubscriptions(req.user) });
    }
    catch (error) {
        next(error);
    }
});
module.exports = router;
//# sourceMappingURL=push.js.map