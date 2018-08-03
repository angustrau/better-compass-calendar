"use strict";
const express = require("express");
const router = express.Router();
const auth = require("./../auth");
const admin = require("./../admin");
const push = require("./../push");
const user = require("./../user");
router.post('/sendpush', auth.authenticate, admin.authenticate, async (req, res, next) => {
    try {
        const receipient = await user.getDetails(req.body.userId);
        await push.pushMessage(receipient, req.body.data);
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
module.exports = router;
//# sourceMappingURL=admin.js.map