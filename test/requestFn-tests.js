import * as assert from "node:assert";
import {canRequest, canRequestAxios, canRequestAxiosPromise} from "../src/requestFn.js";
import nock from "nock";

function createMockCallback() {
    const calls = [];
    const mockFn = function (...args) {
        calls.push(args)
    }
    mockFn.calls = calls;
    return mockFn;
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

        const mockCallback = createMockCallback();

        helloWorld(mockCallback);

        const called = mockCallback.calls;

        assert.equal(called[0][0], 'hello')
        assert.equal(called[0][1], 'world')
    })
    const testCases = [
        {
            name: "can call the old method with a GET request and a callback",
            fn: canRequest,
            opts: {url: 'http://localhost:3000', method: 'GET'},
        },
        {
            name: "can call the old method with a POST request and a callback",
            fn: canRequest,
            opts: {url: 'http://localhost:3000', method: 'POST'},
        },
        {
            name: "can call the new axios method with a GET request and a callback",
            fn: canRequestAxios,
            opts: {uri: 'http://localhost:3000', method: 'GET'},
        },
        {
            name: "can call the new axios method with a POST request and a callback",
            fn: canRequestAxios,
            opts: {uri: 'http://localhost:3000', method: 'POST'},
        }
    ];
    testCases.forEach(({name, fn, opts}) => {
        it(name, (done) => {
            const mockCb = createMockCallback();
            fn(opts, (...args) => {
                mockCb(...args);
                assert.deepEqual(mockCb.calls[0][2], JSON.stringify({
                    body: "hello world",
                    responseCode: 200
                }))
                done();
            });
        });
    });
    const testCasesNoCallback = [
        {
            name: "can call the new axios method and adopt the new promise syntax with a GET request and a callback",
            fn: canRequestAxiosPromise,
            opts: {url: 'http://localhost:3000', method: 'GET'},
        },
        {
            name: "can call the new axios method and adopt the new promise syntax with a POST request and a callback",
            fn: canRequestAxiosPromise,
            opts: {url: 'http://localhost:3000', method: 'POST'},
        }
    ];
    testCasesNoCallback.forEach(({name, fn, opts}) => {
        it(name, (done) => {
            const cbFn = createMockCallback();
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
});