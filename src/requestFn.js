import request from 'request';
import axios from "axios";

function canRequest(options, cbFn) {
    request(options, cbFn);
}

function canRequestAxios(options, cbFn) {
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

function canRequestAxiosPromise(options) {
    return axios(options);
}

export { canRequest, canRequestAxios, canRequestAxiosPromise }