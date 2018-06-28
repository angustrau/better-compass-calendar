import express = require('express');
const router = express.Router();
import auth = require('./../../auth');
import user = require('./../../user');
import location = require('./../../location');

router.get('/token', async (req, res, next) => {
    let { username, password } = req.body;

    try {
        const token = await auth.generateToken(username, password)
        
        // Post-login tasks
        await Promise.all([
            // Ensure that the user is registered
            user.registerUser(token),
            // Ensure that locations are cached
            location.cacheLocations(token)
        ]);
        
        res.json({
            token: token.token,
             expires: token.expires 
        });
    } catch (error) {
        next(error);
    }
});

router.delete('/token', auth.authenticate, async (req, res, next) => {
    try {
        await auth.revokeToken(req.token);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

export = router;