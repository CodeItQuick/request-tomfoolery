import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;
import cors from 'cors';
import { makeRequest, makeAxios, makePromisifiedAxios } from './lib/requestFn.js';

app.use(express.json());
app.use(cors());

app.get('/hello-make-request', (req, res) => {
  res.json({ message: 'Hello World from make-request!' });
});

app.get('/make-request', (req, res) => {
  makeRequest({ url: `http://localhost:${PORT}/hello-make-request`, method: 'GET' }, (err, response, body) => {
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
});

app.get('/hello-make-axios', (req, res) => {
  res.json({ message: 'Hello World from make-axios!' });
});

app.get('/make-axios', (req, res) => {
  makeAxios({ uri: `http://localhost:${PORT}/hello-make-axios`, method: 'GET' }, (err, response, body) => {
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
});

app.get('/hello-make-promisified-axios', (req, res) => {
  res.json({ message: 'Hello World from make-promisified-axios!' });
});

app.get('/make-promisified-axios', async (req, res) => {
  try {
    const response = await makePromisifiedAxios({ url: `http://localhost:${PORT}/hello-make-promisified-axios`, method: 'GET' });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
