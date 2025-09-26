import axios from "axios";

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

export { makeAxios }