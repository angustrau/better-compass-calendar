import express = require('express');
const router = express.Router();
import auth = require('./../../auth');
import user = require('./../../user');

router.get('/details', auth.authenticate, async (req, res, next) => {
    try {
        res.json(await user.getDetails(req.user.id));
    } catch (error) {
        next(error);   
    }
});

router.delete('/', auth.authenticate, async (req, res, next) => {
    try {
        await user.deleteUser(req.user.id);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

export = router;