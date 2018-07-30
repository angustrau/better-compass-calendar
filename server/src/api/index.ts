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

import location = require('./location');
router.use('/location', location);

import subscriptions = require('./subscriptions');
router.use('/subscriptions', subscriptions);

import push = require('./push');
router.use('/push', push);

import admin = require('./admin');
router.use('/admin', admin);

router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err });
});

export = router;