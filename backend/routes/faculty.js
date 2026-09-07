const express = require('express');
const router = express.Router();
const db = require('../services/dataStore');

router.get('/', (req, res) => {
  const faculty = db.getFaculty();
  res.json({ count: faculty.length, data: faculty });
});

router.get('/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  const faculty = db.getFaculty();
  const results = faculty.filter(f =>
    f.name.toLowerCase().includes(query) ||
    f.designation.toLowerCase().includes(query)
  );
  res.json({ count: results.length, data: results });
});

module.exports = router;
