import * as assert from "node:assert";
import nock from "nock";
import {makeAxios} from "../../lib/makeAxios.js";
import {makeRequest} from "../../lib/makeRequest.js";
import {makePromisifiedAxios} from "../../lib/makePromisifiedAxios.js";

function createSpyCallback() {
    const calls = [];
    const spyFn = function (...args) {
        calls.push(args)
    }
    spyFn.calls = calls;
    return spyFn;
}

describe('all refactoring tests', () => {
    beforeEach(() => {
        nock('http://localhost:3000')
            .get('/')
            .reply(200, {
                body: 'hello world',
                responseCode: 200
            });
        nock('http://localhost:3000')
            .post('/')
            .reply(200, {
                body: 'hello world',
                responseCode: 200
            });
    })
    afterEach(() => {
        nock.cleanAll();
    })
    it('can test simple callbacks', () => {
        const helloWorld = function (cb) {
            cb('hello', 'world')
        }

        const spyCallback = createSpyCallback();

        helloWorld(spyCallback);

        const called = spyCallback.calls;

        assert.equal(called[0][0], 'hello')
        assert.equal(called[0][1], 'world')
    })
    const testCases = [
        {
            name: "can call the old method with a GET request and a callback",
            fn: makeRequest,
            opts: {url: 'http://localhost:3000', method: 'GET'},
        },
        {
            name: "can call the old method with a POST request and a callback",
            fn: makeRequest,
            opts: {url: 'http://localhost:3000', method: 'POST'},
        },
        {
            name: "can call the new axios method with a GET request and a callback",
            fn: makeAxios,
            opts: {uri: 'http://localhost:3000', method: 'GET'},
        },
        {
            name: "can call the new axios method with a POST request and a callback",
            fn: makeAxios,
            opts: {uri: 'http://localhost:3000', method: 'POST'},
        }
    ];
    testCases.forEach(({name, fn, opts}) => {
        it(name, (done) => {
            const spyCb = createSpyCallback();
            fn(opts, (...args) => {
                spyCb(...args);
                assert.deepEqual(spyCb.calls[0][2], JSON.stringify({
                    body: "hello world",
                    responseCode: 200
                }))
                done();
            });
        });
    });
    const testCasesNoCallback = [
        {
            name: "can call the new axios method and adopt the new promise syntax with a GET request",
            fn: makePromisifiedAxios,
            opts: {url: 'http://localhost:3000', method: 'GET'},
        },
        {
            name: "can call the new axios method and adopt the new promise syntax with a POST request",
            fn: makePromisifiedAxios,
            opts: {url: 'http://localhost:3000', method: 'POST'},
        }
    ];
    testCasesNoCallback.forEach(({name, fn, opts}) => {
        it(name, (done) => {
            const cbFn = createSpyCallback();
            fn(opts)
                .then((response) => {
                    cbFn(null, response, JSON.stringify(response.data));
                })
                .catch((error) => {
                    cbFn(error, null, null);
                    throw error;
                });
            done();
        });
    });
    [
        {
            name: 'should send custom headers for GET request with canRequest',
            fn: makeRequest,
            opts: {url: 'http://localhost:3000/headers', method: 'GET', headers: {'x-custom-header': 'test-value'}}
        },
        {
            name: 'should send custom headers for GET request with canRequestAxios',
            fn: makeAxios,
            opts: {uri: 'http://localhost:3000/headers', method: 'GET', headers: {'x-custom-header': 'test-value'}}
        },
        {
            name: 'should send custom headers for POST request with canRequest',
            fn: makeRequest,
            opts: {uri: 'http://localhost:3000/headers', method: 'POST', headers: {'x-custom-header': 'test-value'}}
        },
        {
            name: 'should send custom headers for POST request with canRequestAxios',
            fn: makeAxios,
            opts: {uri: 'http://localhost:3000/headers', method: 'POST', headers: {'x-custom-header': 'test-value'}}
        },
    ].forEach(({name, fn, opts}) => {
        it(name, (done) => {
            nock('http://localhost:3000', {
                reqheaders: {
                    'x-custom-header': 'test-value'
                }
            })[opts.method.toLowerCase()]('/headers')
                .reply(200, {received: true}, {'x-custom-header': 'test-value'});
            fn(opts, (err, res, body) => {
                assert.ifError(err);
                assert.ok(res);
                assert.equal(JSON.parse(body).received, true);
                assert.equal(res.headers['x-custom-header'], 'test-value');
                // assert.equal(res.getHeader('x-custom-header'), 'test-value');
                done();
            });
        });
    });
    [{
        name: 'should send custom headers with canRequestAxios',
        fn: makeAxios,
        opts: {uri: 'http://localhost:3000/headers', method: 'POST', headers: {'x-custom-header': 'test-value'}}
    },
        {
            name: 'should send custom headers with canRequestAxios',
            fn: makeAxios,
            opts: {uri: 'http://localhost:3000/headers', method: 'POST', headers: {'x-custom-header': 'test-value'}}
        }].forEach(({name, fn, opts}) => {
        it(`for ${opts.method} request should send custom headers with canRequestAxiosPromise`, async () => {
            nock('http://localhost:3000', {
                reqheaders: {
                    'x-custom-header': 'test-value'
                }
            })
                .get('/headers')
                .reply(200, {received: true}, { 'x-custom-header': 'test-value' });
            const response = await makePromisifiedAxios({
                url: 'http://localhost:3000/headers',
                method: 'GET',
                headers: {'x-custom-header': 'test-value'}
            });
            assert.ok(response);
            assert.equal(response.data.received, true);
            assert.equal(response.headers['x-custom-header'], 'test-value');
        });
    });
    [
        {
            name: 'should send Authorization and Content-Type headers with canRequest (GET)',
            fn: makeRequest,
            opts: {
                url: 'http://localhost:3000/headers',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer testtoken',
                    'Content-Type': 'application/json'
                }
            }
        },
        {
            name: 'should send Authorization and Content-Type headers with canRequestAxios (GET)',
            fn: makeAxios,
            opts: {
                uri: 'http://localhost:3000/headers',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer testtoken',
                    'Content-Type': 'application/json'
                }
            }
        },
        {
            name: 'should send Authorization and Content-Type headers with canRequest (POST)',
            fn: makeRequest,
            opts: {
                url: 'http://localhost:3000/headers',
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer testtoken',
                    'Content-Type': 'application/json'
                }
            }
        },
        {
            name: 'should send Authorization and Content-Type headers with canRequestAxios (POST)',
            fn: makeAxios,
            opts: {
                uri: 'http://localhost:3000/headers',
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer testtoken',
                    'Content-Type': 'application/json'
                }
            }
        }
    ].forEach(({name, fn, opts}) => {
        it(name, (done) => {
            nock('http://localhost:3000', {
                reqheaders: {
                    'Authorization': 'Bearer testtoken',
                    'Content-Type': 'application/json'
                }
            })
                [opts.method.toLowerCase()]('/headers')
                .reply(200, { received: true }, {
                    'Authorization': 'Bearer testtoken'
                });
            fn(opts, (err, res, body) => {
                assert.ifError(err);
                assert.ok(res);
                assert.equal(JSON.parse(body).received, true);
                assert.equal(res.headers['authorization'], 'Bearer testtoken');
                assert.equal(res.headers['content-type'], 'application/json');
                done();
            });
        });
    });
    [
        {
            name: 'should send Authorization and Content-Type (form-data) headers with canRequest (POST)',
            fn: makeRequest,
            opts: {
                url: 'http://localhost:3000/headers',
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer testtoken',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        },
        {
            name: 'should send Authorization and Content-Type (form-data) headers with canRequestAxios (POST)',
            fn: makeAxios,
            opts: {
                uri: 'http://localhost:3000/headers',
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer testtoken',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        }
    ].forEach(({name, fn, opts}) => {
        it(name, (done) => {
            nock('http://localhost:3000', {
                reqheaders: {
                    'Authorization': 'Bearer testtoken',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                [opts.method.toLowerCase()]('/headers')
                .reply(200, { received: true }, {
                    'Authorization': 'Bearer testtoken'
                });
            fn(opts, (err, res, body) => {
                assert.ifError(err);
                assert.ok(res);
                assert.equal(JSON.parse(body).received, true);
                assert.equal(res.headers['authorization'], 'Bearer testtoken');
                assert.equal(res.headers['content-type'], 'application/json');
                done();
            });
        });
    });
    [
        {
            name: 'should send and receive cookies with canRequest (GET)',
            fn: makeRequest,
            opts: {
                url: 'http://localhost:3000/headers',
                method: 'GET',
                headers: {
                    'Cookie': 'sessionid=abc123; userid=42'
                }
            }
        },
        {
            name: 'should send and receive cookies with canRequestAxios (GET)',
            fn: makeAxios,
            opts: {
                uri: 'http://localhost:3000/headers',
                method: 'GET',
                headers: {
                    'Cookie': 'sessionid=abc123; userid=42'
                }
            }
        },
        {
            name: 'should send and receive cookies with canRequest (POST)',
            fn: makeRequest,
            opts: {
                url: 'http://localhost:3000/headers',
                method: 'POST',
                headers: {
                    'Cookie': 'sessionid=abc123; userid=42'
                }
            }
        },
        {
            name: 'should send and receive cookies with canRequestAxios (POST)',
            fn: makeAxios,
            opts: {
                uri: 'http://localhost:3000/headers',
                method: 'POST',
                headers: {
                    'Cookie': 'sessionid=abc123; userid=42'
                }
            }
        }
    ].forEach(({name, fn, opts}) => {
        it(name, (done) => {
            nock('http://localhost:3000', {
                reqheaders: {
                    'Cookie': 'sessionid=abc123; userid=42'
                }
            })
                [opts.method.toLowerCase()]('/headers')
                .reply(200, { received: true }, {
                    'Set-Cookie': 'sessionid=abc123; userid=42'
                });
            fn(opts, (err, res, body) => {
                assert.ifError(err);
                assert.ok(res);
                assert.equal(JSON.parse(body).received, true);
                // Check that the response contains the Set-Cookie header
                assert.ok(res.headers['set-cookie']);
                assert.ok(res.headers['set-cookie'][0].includes('sessionid=abc123'));
                assert.ok(res.headers['set-cookie'][0].includes('userid=42'));
                done();
            });
        });
    });
});