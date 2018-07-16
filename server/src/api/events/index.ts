import express = require('express');
const router = express.Router();
import auth = require('./../../auth');
import events = require('./../../events');

router.get('/query', auth.authenticate, async (req, res, next) => {
    try {
        res.json(await events.query(req.body as events.Query, req.token));

    } catch (error) {
        next(error);
    }
});

export = router;