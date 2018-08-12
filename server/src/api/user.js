"use strict";
const express = require("express");
const router = express.Router();
const auth = require("./../auth");
const user = require("./../user");
/**
 * GET /api/user/details
 * Get details about the user
 */
router.get('/details', auth.authenticate, async (req, res, next) => {
    try {
        res.json(await user.getDetails(req.user.id));
    }
    catch (error) {
        next(error);
    }
});
/**
 * DELETE /api/user
 * Delete the user account
 */
router.delete('/', auth.authenticate, async (req, res, next) => {
    try {
        await user.deleteUser(req.user.id);
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
/**
 * GET /api/user/managers
 * Get a list of all manager information
 */
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