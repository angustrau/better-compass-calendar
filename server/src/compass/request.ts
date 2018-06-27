import rp = require('request-promise-native');
import config = require('./../../config.js');

const request = rp.defaults({
    baseUrl: config.schoolURL,
    followRedirect: false,
    resolveWithFullResponse: true,
    headers: {
        'User-Agent': 'better-compass-calendar tra0172@mhs.vic.edu.au'
    },
    simple: false
});

export = request;