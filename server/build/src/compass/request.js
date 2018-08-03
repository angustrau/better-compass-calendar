"use strict";
//import rp = require('request-promise-native');
const rr = require("requestretry");
const config = require("./../../config.js");
const schema = require("./../db/schema");
/*
const request: RequestAPI<rp.RequestPromise<Response>, rp.RequestPromiseOptions, RequiredUriUrl> = rp.defaults({
    baseUrl: config.schoolURL,
    followRedirect: false,
    resolveWithFullResponse: true,
    headers: {
        'User-Agent': config.userAgent
    },
    proxy: config.proxy ? config.proxy.address : undefined,
    strictSSL: config.proxy ? config.proxy.strictSSL : undefined,
    tunnel: config.proxy ? true : undefined,
    simple: false,
    // For debug logger
    time: true
});
*/
/*
const request = rr.defaults({
    baseUrl: config.schoolURL,
    followRedirect: false,
    headers: {
        'User-Agent': config.userAgent
    },
    proxy: config.proxy ? config.proxy.address : undefined,
    strictSSL: config.proxy ? config.proxy.strictSSL : undefined,
    tunnel: config.proxy ? true : undefined,
    maxAttempts: 5,
    retryDelay: 5000,
    retryStrategy: rr.RetryStrategies.NetworkError,
    // For debug logger
    time: true
});
*/
const defaults = {
    baseUrl: config.schoolURL,
    followRedirect: false,
    headers: {
        'User-Agent': config.userAgent
    },
    // proxy: config.proxy ? config.proxy.address : undefined,
    strictSSL: config.proxy ? config.proxy.strictSSL : undefined,
    tunnel: config.proxy ? true : undefined,
    maxAttempts: 5,
    retryDelay: 5000,
    retryStrategy: rr.RetryStrategies.NetworkError,
    // For debug logger
    time: true
};
let _request = async (uri, options) => {
    return new Promise((resolve, reject) => {
        rr(uri, Object.assign({}, defaults, options), (err, res, body) => {
            if (err)
                reject(err);
            if (!res)
                return;
            console.log(res.request.method, res.request.path, res.timings ? res.timings.response : null);
            if (res.timings) {
                schema.requestlog.log(res.request.method, res.request.path, res.timings.response);
            }
            resolve(res);
        });
    });
};
let count = 0;
let requestQueue = [];
let processedThisInterval = false;
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
setInterval(() => {
    if (!processedThisInterval) {
        processQueue();
    }
    processedThisInterval = false;
}, 1000 / config.requestsPerSecond);
module.exports = (uri, options) => {
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
//# sourceMappingURL=request.js.map