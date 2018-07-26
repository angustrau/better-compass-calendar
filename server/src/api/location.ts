import express = require('express');
const router = express.Router();
import auth = require('./../auth');
import location = require('./../location');

router.post('/details', auth.authenticate, async (req, res, next) => {
    try {
        res.json(await location.getLocation(req.body.id));
    } catch (error) {
        next(error);
    }
});

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