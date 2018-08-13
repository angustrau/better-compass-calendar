import express = require('express');
const router = express.Router();
import auth = require('./../auth');
import location = require('./../location');

/**
 * POST /api/location/details
 * Get details about a location
 */
router.post('/details', auth.authenticate, async (req, res, next) => {
    try {
        if (!req.body.id || typeof(req.body.id) !== 'number') {
            throw 'Invalid input';
        }

        res.json(await location.getLocation(req.body.id));
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/location/all
 * Get the details of all locations
 */
router.get('/all', auth.authenticate, async (req, res, next) => {
    try {
        res.json({
            locations: await location.getAlllocations()
        });
    } catch (error) {
        next(error);
    }
});

export = router;