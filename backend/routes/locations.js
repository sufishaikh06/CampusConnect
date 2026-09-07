const express = require('express');
const router = express.Router();
const db = require('../services/dataStore');

// GET /api/locations — list all locations
router.get('/', (req, res) => {
  const locations = db.getLocations();
  res.json({ count: locations.length, data: locations });
});

// GET /api/locations/search?q= — search by alias/name
router.get('/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase().trim();
  if (!query) {
    return res.json({ count: 0, data: [], message: 'Please provide a search query.' });
  }

  const locations = db.getLocations();
  const results = locations.filter(loc => {
    const nameMatch  = loc.name.toLowerCase().includes(query);
    const aliasMatch = loc.aliases && loc.aliases.some(a => a.toLowerCase().includes(query));
    const typeMatch  = loc.type && loc.type.toLowerCase().includes(query);
    return nameMatch || aliasMatch || typeMatch;
  });

  if (results.length === 0) {
    return res.json({
      count: 0,
      data: [],
      message: `No location found matching "${query}". Try: admission, library, fees, computer department, HOD.`
    });
  }

  res.json({ count: results.length, data: results });
});

// GET /api/locations/:id — get single location
router.get('/:id', (req, res) => {
  const locations = db.getLocations();
  const location = locations.find(l => l.id === req.params.id);
  if (!location) {
    return res.status(404).json({ error: `Location with id "${req.params.id}" not found.` });
  }
  res.json(location);
});

module.exports = router;
