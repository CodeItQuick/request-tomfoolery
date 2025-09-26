import request from 'request';
import axios from "axios";

function makeRequest(options, cbFn) {
    request(options, cbFn);
}

function makeAxios(options, cbFn) {
    options.url = options.uri;
    axios(options)
        .then((response) => {
            cbFn(null, response, JSON.stringify(response.data));
        })
        .catch((error) => {
            cbFn(error, null, null);
            throw error;
        })
}

function makePromisifiedAxios(options) {
    return axios(options);
}

export { makeRequest, makeAxios, makePromisifiedAxios }