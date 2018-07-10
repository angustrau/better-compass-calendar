import rp = require('request-promise-native');
import config = require('./../../config.js');
import schema = require('./../db/schema');
import { Response, RequestAPI, RequiredUriUrl } from 'request';

const request: RequestAPI<rp.RequestPromise<Response>, rp.RequestPromiseOptions, RequiredUriUrl> = rp.defaults({
    baseUrl: config.schoolURL,
    followRedirect: false,
    resolveWithFullResponse: true,
    headers: {
        'User-Agent': 'better-compass-calendar tra0172@mhs.vic.edu.au'
    },
    simple: false,
    // For debug logger
    time: true
});

let _request = new Proxy(request, {
    apply: (target: typeof request, thisArg, args) => {
        const req: rp.RequestPromise<Response> = target.apply(thisArg, args);
        req.then((res) => {
            // Log request statistics
            console.log(
                res.request.method,
                res.request.path,
                res.timings ? res.timings.response : null
            );
            if (res.timings) {
                schema.requestlog.log(res.request.method, res.request.path, res.timings.response);
            }
            return res;
        });
        return req;
    }
})


export = _request;