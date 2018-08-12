import express = require('express');
const router = express.Router();
import ical = require('./../ical');
import auth = require('./../auth');
import basicauth = require('basic-auth');

/**
 * GET /api/ical/:filter/schedule.ics
 * Gets an iCal calendar from a filter
 */
router.get('/:filter/*', async (req, res, next) => {
    try {
        // Ensure that HTTP Basic Auth credentials are provided
        const creds = basicauth(req);
        if (!creds) {
            res.status(401);
            res.setHeader('WWW-Authenticate', 'Basic realm="better-compass-calendar"');
            res.send('Access denied');
            return;
        }

        const token = await auth.generateToken(creds.name, creds.pass);
        const calendar = await ical.generate(decodeURIComponent(req.params.filter), token)

        res.set({
            'Content-Disposition': 'attachment; filename="schedule.ics"',
            'Content-Type': 'text/calendar',
        });
        res.send(calendar.toString());
    } catch (error) {
        next(error);
    }
});

export = router;