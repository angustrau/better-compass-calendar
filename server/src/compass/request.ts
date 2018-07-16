import rp = require('request-promise-native');
import config = require('./../../config.js');
import schema = require('./../db/schema');
import { Response, RequestAPI, RequiredUriUrl } from 'request';

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

let _request = async (uri: string, options: rp.RequestPromiseOptions): Promise<Response> => {
    const res = await request(uri, options);
    console.log(
        res.request.method,
        res.request.path,
        res.timings ? res.timings.response : null
    );
    if (res.timings) {
        schema.requestlog.log(res.request.method, res.request.path, res.timings.response);
    }
    return res;
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

export = (uri: string, options: rp.RequestPromiseOptions): Promise<Response> => {
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