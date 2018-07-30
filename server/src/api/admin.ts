import express = require('express');
const router = express.Router();
import auth = require('./../auth');
import admin = require('./../admin');
import push = require('./../push');
import user = require('./../user');

router.post('/sendpush', auth.authenticate, admin.authenticate, async (req, res, next) => {
    try {
        const receipient = await user.getDetails(req.body.userId);
        await push.pushMessage(receipient, req.body.data);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

export = router;