import express = require('express');
const router = express.Router();
import auth = require('./../../auth');

router.get('/query', auth.authenticate, async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
});

export = router;