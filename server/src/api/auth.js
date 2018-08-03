"use strict";
const express = require("express");
const router = express.Router();
const auth = require("./../auth");
const events = require("./../events");
router.post('/token', async (req, res, next) => {
    try {
        let { username, password } = req.body;
        if (!username || !password || typeof (username) !== 'string' || typeof (password) !== 'string') {
            throw 'Invalid input';
        }
        const token = await auth.generateToken(username, password);
        // Post-login tasks
        await events.cacheEventsFortnight(token);
        res.json({
            token: token.token,
            expires: token.expires
        });
    }
    catch (error) {
        next(error);
    }
});
router.delete('/token', auth.authenticate, async (req, res, next) => {
    try {
        await auth.revokeToken(req.token);
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
module.exports = router;
//# sourceMappingURL=auth.js.map