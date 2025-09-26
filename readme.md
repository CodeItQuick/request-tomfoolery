# Example request migration repository

## Why? What problem does this solve?
Swapping from the request library to axios? Well this repository has some answers
in terms of incremental refactoring using tests. Specifically, it shows a method 
to wrap the request library itself then migrate to axios with promises in 2 steps.

## The problem

You have an old library called "request" in your code that is no longer maintained. It has been replaced by several 
possible alternatives.

Example code:

```js
request({ url: `http://localhost:${PORT}/hello-make-request`, method: 'GET' }, 
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

## How? Getting Started

```js
import {MakeHttp} from '../../wrapper-app/lib/makeHttp.js';
import {makeRequestFn} from "../../wrapper-app/lib/makeRequestFn.js";
import {makePromisifiedAxiosFn} from "../../wrapper-app/lib/makePromisifiedAxiosFn.js";
import {makeAxiosFn} from "../../wrapper-app/lib/makeAxiosFn.js";

// then import the adapter functions you want:

// original request library
const useRequest = new MakeHttp(makeRequestFn)
// new axios library with same interfaces
const useAxios = new MakeHttp(makeAxiosFn)
// new axios library with different interfaces
const usePromisifiedAxios = new MakeHttp(makePromisifiedAxiosFn)
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

