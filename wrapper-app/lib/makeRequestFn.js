import request from 'request';
import axios from "axios";

function makeRequestFn(options, cbFn) {
    request(options, cbFn);
}

export { makeRequestFn }