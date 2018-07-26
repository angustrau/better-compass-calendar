import express = require('express');
const app = express();
import path = require('path');
import db = require('./db');
import config = require('./../config');

import api = require('./api');
app.use('/api', api);

app.use('/', express.static(path.resolve('../../client/build')));
app.get('/*', (req, res) => {
    res.sendFile(path.resolve('../../client/build/index.html'));
});

(async () => {
    await db.initDB();
    app.listen(config.port, () => console.log('Server listening on port ' + config.port));
})()