//import rp = require('request-promise-native');
import rr = require('requestretry');
import config = require('./../../config.js');
import schema = require('./../db/schema');
import { Response } from 'request';

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
    maxAttempts: 5,
    retryDelay: 5000,
    retryStrategy: rr.RetryStrategies.NetworkError,
    // For debug logger
    time: true
}

let _request = async (uri: string, options: rr.RequestRetryOptions): Promise<Response> => {
    return new Promise<Response>((resolve, reject) => {
        rr(uri, {...defaults, ...options}, (err, res, body) => {
            if (err) reject(err);
            if (!res) return;

            console.log(
                res.request.method,
                res.request.path,
                res.timings ? res.timings.response : null
            );
            if (res.timings) {
                schema.requestlog.log(res.request.method, res.request.path, res.timings.response);
            }

            resolve(res);
        });
    })
}

let count = 0;
let requestQueue: any[] = [];
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
}
setInterval(() => {
    if (!processedThisInterval) {
        processQueue();
    }
    processedThisInterval = false;
}, 1000 / config.requestsPerSecond);

export = (uri: string, options: rr.RequestRetryOptions): Promise<Response> => {
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
}