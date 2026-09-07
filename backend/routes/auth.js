const express = require('express');
const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'campusconnect2026';

  if (username === adminUser && password === adminPass) {
    // Simple token (not production-grade JWT — Phase 17 will harden this)
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    return res.json({
      success: true,
      token,
      message: 'Login successful.',
      user: { username, role: 'admin' }
    });
  }

  res.status(401).json({ error: 'Invalid credentials.' });
});

// POST /api/auth/verify
router.post('/verify', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ valid: false });
  // Basic check — token is base64-encoded
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [user] = decoded.split(':');
    if (user === (process.env.ADMIN_USERNAME || 'admin')) {
      return res.json({ valid: true, user: { username: user, role: 'admin' } });
    }
  } catch {}
  res.status(401).json({ valid: false });
});

module.exports = router;
