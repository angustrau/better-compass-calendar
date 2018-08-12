import express = require('express');
const router = express.Router();
import auth = require('./../auth');
import location = require('./../location');
import events = require('./../events');
import schema = require('./../db/schema');

/**
 * POST /api/auth/token
 * Get an authorisation token (log in)
 */
router.post('/token', async (req, res, next) => {
    try {
        let { username, password } = req.body;
        if (!username || !password || typeof(username) !== 'string' || typeof(password) !== 'string') {
            throw 'Invalid input';
        }

        const token = await auth.generateToken(username, password)
        
        // Post-login tasks
        await events.cacheEventsFortnight(token);
        schema.logging.login(token.userId);

        res.json({
            token: token.token,
            expires: token.expires 
        });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/auth/token
 * Unauthorise a token (log out)
 */
router.delete('/token', auth.authenticate, async (req, res, next) => {
    try {
        await auth.revokeToken(req.token);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

export = router;