"use strict";
const express = require("express");
const router = express.Router();
const auth = require("./../auth");
const user = require("./../user");
router.get('/details', auth.authenticate, async (req, res, next) => {
    try {
        res.json(await user.getDetails(req.user.id));
    }
    catch (error) {
        next(error);
    }
});
router.delete('/', auth.authenticate, async (req, res, next) => {
    try {
        await user.deleteUser(req.user.id);
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
router.get('/managers', auth.authenticate, async (req, res, next) => {
    try {
        res.json({
            managers: await user.getManagers()
        });
    }
    catch (error) {
        next(error);
    }
});
module.exports = router;
//# sourceMappingURL=user.js.map