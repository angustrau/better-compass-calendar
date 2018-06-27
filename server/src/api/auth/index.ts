import express = require('express');
const router = express.Router();
import auth = require('./../../auth');

router.get('/token', async (req, res, next) => {
    let { username, password } = req.body;

    try {
        res.json({ token: await auth.genToken(username, password) })
    } catch (error) {
        next(error);
    }
});

export = router;