import express = require('express');
const router = express.Router();
import bodyParser = require('body-parser');

router.use(bodyParser.json());

import auth = require('./auth');
router.use('/auth', auth);

import user = require('./user');
router.use('/user', user);

import events = require('./events');
router.use('/events', events);

router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err });
});

export = router;