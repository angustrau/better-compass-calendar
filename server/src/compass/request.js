"use strict";
const rr = require("requestretry");
const config = require("./../../config.js");
const schema = require("./../db/schema");
const defaults = {
    baseUrl: config.schoolURL,
    followRedirect: false,
    headers: {
        'User-Agent': config.userAgent
    },
    maxAttempts: 5,
    retryDelay: 5000,
    retryStrategy: rr.RetryStrategies.NetworkError,
    // For debug logger
    time: true
};
// Request with retry functionality and timing logging
let _request = async (uri, options) => {
    return new Promise((resolve, reject) => {
        rr(uri, Object.assign({}, defaults, options), (err, res, body) => {
            if (err)
                reject(err);
            if (!res)
                return;
            console.log(res.request.method, res.request.path, res.timings ? res.timings.response : null);
            if (res.timings) {
                schema.logging.request(res.request.method, res.request.path, res.timings.response);
            }
            resolve(res);
        });
    });
};
/** The total number of requests made */
let count = 0;
/** Any pending requests to be made */
let requestQueue = [];
/** Whether a request has been processed in the last interval. Used to speed up the first request in a burst */
let processedThisInterval = false;
/**
 * Fetch a pending request from the queue and execute it
 */
const processQueue = () => {
    const args = requestQueue.shift();
    if (args) {
        const { uri, options, resolve, reject } = args;
        console.log(`PROCESSING (${count}) (${requestQueue.length}) ${options.method || 'GET'} ${uri}`);
        count++;
        _request(uri, options)
            .then(resolve)
            .catch(reject);
    }
};
/**
 * Rate limit outgoing requests
 */
setInterval(() => {
    if (!processedThisInterval) {
        processQueue();
    }
    processedThisInterval = false;
}, 1000 / config.requestsPerSecond);
const __request = (uri, options) => {
    return new Promise((resolve, reject) => {
        requestQueue.push({
            uri: uri,
            options: options,
            resolve: resolve,
            reject: reject
        });
        if (!processedThisInterval) {
            processedThisInterval = true;
            processQueue();
        }
    });
};
module.exports = __request;
//# sourceMappingURL=request.js.map