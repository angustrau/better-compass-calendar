import express = require('express');
const router = express.Router();
import auth = require('./../../auth');
import events = require('./../../events');
import { Query } from '../../db/schema/event';

router.post('/query', auth.authenticate, async (req, res, next) => {
    try {
        res.json(await events.query(req.body as Query, req.token));
    } catch (error) {
        next(error);
    }
});

export = router;