"use strict";
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const auth = require("./auth");
router.use('/auth', auth);
const user = require("./user");
router.use('/user', user);
const events = require("./events");
router.use('/events', events);
const location = require("./location");
router.use('/location', location);
const subscriptions = require("./subscriptions");
router.use('/subscriptions', subscriptions);
const push = require("./push");
router.use('/push', push);
const admin = require("./admin");
router.use('/admin', admin);
const ical = require("./ical");
router.use('/ical', ical);
router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err });
});
module.exports = router;
//# sourceMappingURL=index.js.map