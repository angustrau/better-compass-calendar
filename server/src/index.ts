import express = require('express');
const app = express();
import db = require('./db');

const port = process.env.PORT || 80;

import api = require('./api');
app.use('/api', api);

(async () => {
    await db.initDB();
    app.listen(port, () => console.log('Server listening on port ' + port));
})()