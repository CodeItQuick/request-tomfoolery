import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;
import cors from 'cors';
import { makeRequest, makeAxios, makePromisifiedAxios } from './lib/requestFn.js';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret'; // Change to a secure secret in production
const db = new sqlite3.Database('./auth.db');

app.use(express.json());
app.use(cors());

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
});

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

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });
  const hash = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function(err) {
    if (err) return res.status(400).json({ error: 'User already exists' });
    res.json({ success: true });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, this is a protected route!` });
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
