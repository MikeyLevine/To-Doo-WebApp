// Auth routes: register, login, logout
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();
const SALT_ROUNDS = 12;

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existing = db.getUserByUsername(username);
  if (existing) {
    return res.status(409).json({ error: 'Username already taken' });
  }

  try {
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = db.createUser({ username, password_hash });

    req.session.userId = user.id;
    req.session.username = user.username;

    res.status(201).json({ id: user.id, username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = db.getUserByUsername(username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  try {
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    res.json({ id: user.id, username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me — check current session
router.get('/me', (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({ id: req.session.userId, username: req.session.username });
  }
  res.status(401).json({ error: 'Not authenticated' });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;
