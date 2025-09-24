import * as assert from "node:assert";
import {canRequest, canRequestAxios} from "../src/requestFn.js";
import nock from "nock";

function createMockCallback() {
    const calls = [];
    const mockFn = function (...args) {
        calls.push(args)
    }
    mockFn.calls = calls;
    return mockFn;
}
describe('other tests', () => {
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
    it("should be able to request GET a hello", (done) => {
        const fancy = createMockCallback();

        canRequest({url: 'http://localhost:3000', method: 'GET'}, (...args) => {
            fancy(...args);

            assert.deepEqual(fancy.calls[0][2], JSON.stringify({
                body: "hello world",
                responseCode: 200
            }))
            done()
        })
    });
    it("should be able to request POST a hello", (done) => {
        const fancy = createMockCallback();

        canRequest({url: 'http://localhost:3000', method: 'POST'}, (...args) => {
            fancy(...args);

            assert.deepEqual(fancy.calls[0][2], JSON.stringify({
                body: "hello world",
                responseCode: 200
            }))
            done()
        })
    })
    it("should be able to request a GET hello with axios", (done) => {
        const fancy = createMockCallback();

        canRequestAxios({uri: 'http://localhost:3000', method: 'GET'}, (...args) => {
            fancy(...args);

            assert.deepEqual(fancy.calls[0][2], JSON.stringify({
                body: "hello world",
                responseCode: 200
            }))
            done();
        })
    })
    it("should be able to request a POST hello with axios", (done) => {
        const fancy = createMockCallback();

        canRequestAxios({uri: 'http://localhost:3000', method: 'POST'}, (...args) => {
            fancy(...args);

            assert.deepEqual(fancy.calls[0][2], JSON.stringify({
                body: "hello world",
                responseCode: 200
            }))
            done();
        })
    });
});