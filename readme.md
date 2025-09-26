# Example request migration repository

## Why? What problem does this solve?
Swapping from the request library to axios? Well this repository has some answers
in terms of incremental refactoring using tests. Specifically, it shows a method 
to wrap the request library itself then migrate to axios with promises in 2 steps.

## How? Getting Started

```js
import {MakeHttp} from '../../wrapper-app/lib/makeHttp.js';
import {makeRequestFn} from "../../wrapper-app/lib/makeRequestFn.js";
import {makePromisifiedAxiosFn} from "../../wrapper-app/lib/makePromisifiedAxiosFn.js";
import {makeAxiosFn} from "../../wrapper-app/lib/makeAxiosFn.js";

// then import the adapter functions you want:

const useRequest = new MakeHttp(makeRequestFn) // original request library
const useAxios = new MakeHttp(makeAxiosFn) // new axios library with same interfaces
const usePromisifiedAxios = new MakeHttp(makePromisifiedAxiosFn) // new axios library with different interfaces
```

an example call to the old request library:

```js
useRequest.makeRequest({ url: `http://localhost:${PORT}/hello-make-request`, method: 'GET' }, 
    (err, response, body) => {
    if (err) {
        res.status(500).json({ error: 'Internal server error' });
    } else {
        try {
            const data = JSON.parse(body);
            res.json(data);
        } catch (e) {
            res.status(500).json({ error: 'Invalid response from /hello' });
        }
    }
});
```

an example call to the new axios library with the same request library interface:

```js
useAxios.makeAxios({ uri: `http://localhost:${PORT}/hello-make-axios`, method: 'GET' }, 
    (err, response, body) => {
    if (err) {
        res.status(500).json({ error: 'Internal server error' });
    } else {
        try {
            const data = JSON.parse(body);
            res.json(data);
        } catch (e) {
            res.status(500).json({ error: 'Invalid response from /hello-make-axios' });
        }
    }
});
```

an example call to the new axios library with the new promise interface:

```js
try {
    const response = await usePromisifiedAxios.makePromisifiedAxios(
        { url: `http://localhost:${PORT}/hello-make-promisified-axios`, method: 'GET' });
    res.json(response.data);
} catch (err) {
    res.status(500).json({ error: 'Internal server error' });
}
```

