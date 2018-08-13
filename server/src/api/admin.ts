import express = require('express');
const router = express.Router();
import auth = require('./../auth');
import admin = require('./../admin');

/**
 * POST /api/admin/sendpush
 * Send a push notification to a user
 */
router.post('/sendpush', auth.authenticate, admin.authenticate, async (req, res, next) => {
    try {
        if (!req.body.userId || typeof(req.body.userId) !== 'number' || !req.body.data) {
            throw 'Invalid push payload'
        }

        await admin.sendPush(req.body.userId, req.body.data);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/admin/sql
 * Run an arbitrary SQL statement
 */
router.post('/sql', auth.authenticate, admin.authenticate, async (req, res, next) => {
    try {
        if (!req.body.query || typeof(req.body.query) !== 'string') {
            throw 'Invalid query';
        }

        res.json({ result: await admin.runSQL(req.body.query) });
    } catch (error) {
        next(error);
    }
});

export = router;