import express = require('express');
const app = express();
import db = require('./db');
import config = require('./../config');

import api = require('./api');
app.use('/api', api);

(async () => {
    await db.initDB();
    app.listen(config.port, () => console.log('Server listening on port ' + config.port));
})()