import express = require('express');
const router = express.Router();
import auth = require('./../../auth');
import user = require('./../../user');


router.use(auth.authenticate);

router.get('/details', async (req, res, next) => {
    try {
        res.json(await user.getDetails(req.user.id));
    } catch (error) {
        next(error);   
    }
});

export = router;