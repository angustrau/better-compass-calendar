"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const path = require("path");
const db = require("./db");
const config = require("./../config");
const dotenv = require("dotenv");
dotenv.config();
const api = require("./api");
app.use('/api', api);
app.use('/', express.static(path.resolve('../../client/build')));
app.get('/*', (req, res) => {
    res.sendFile(path.resolve('../../client/build/index.html'));
});
(async () => {
    await db.initDB();
    app.listen(config.port, () => console.log('Server listening on port ' + config.port));
})();
//# sourceMappingURL=index.js.map