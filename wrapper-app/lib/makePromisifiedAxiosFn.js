import axios from "axios";

function makePromisifiedAxiosFn(options) {
    return axios(options);
}

export { makePromisifiedAxiosFn }