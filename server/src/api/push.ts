import express = require('express');
const router = express.Router();
import auth = require('./../auth');
import push = require('./../push');

router.post('/subscribe', auth.authenticate, async (req, res, next) => {
    try {
        push.subscribe(req.user, req.body);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

router.post('/unsubscribe', auth.authenticate, async (req, res, next) => {
    try {
        push.unsubscribe(req.user, req.body);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

router.get('/subscriptions', auth.authenticate, async (req, res, next) => {
    try {
        res.json({ subscriptions: await push.getSubscriptions(req.user) });
    } catch (error) {
        next(error);
    }
});

export = router;