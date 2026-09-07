const express = require('express');
const router = express.Router();
const db = require('../services/dataStore');

router.get('/', (req, res) => {
  const departments = db.getDepartments();
  res.json({ count: departments.length, data: departments });
});

module.exports = router;
