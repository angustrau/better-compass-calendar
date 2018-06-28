import express = require('express');
const router = express.Router();
import auth = require('./../../auth');

router.get('/token', async (req, res, next) => {
    let { username, password } = req.body;

    try {
        const token = await auth.genToken(username, password)
        res.json({ token: token.token, expires: token.expires })
    } catch (error) {
        next(error);
    }
});

export = router;