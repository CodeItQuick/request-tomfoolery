import axios from "axios";

function makePromisifiedAxios(options) {
    return axios(options);
}

export { makePromisifiedAxios }