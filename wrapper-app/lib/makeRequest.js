import request from 'request';
import axios from "axios";

function makeRequest(options, cbFn) {
    request(options, cbFn);
}

export { makeRequest }