const express = require('express');
const router = express.Router();
const db = require('../services/dataStore');
const requireAdmin = require('../middleware/requireAdmin');

// All admin routes require authentication
router.use(requireAdmin);

// GET /api/admin/stats — dashboard stats
router.get('/stats', (req, res) => {
  const locations    = db.getLocations();
  const buildings    = db.getBuildings();
  const faculty      = db.getFaculty();
  const nodes        = db.getNavNodes();
  const panoramas    = db.getPanoramas();

  res.json({
    buildings:  buildings.length,
    locations:  locations.length,
    faculty:    faculty.length,
    navNodes:   nodes.length,
    panoramas:  panoramas.length
  });
});

// --- LOCATIONS ---

// GET /api/admin/locations
router.get('/locations', (req, res) => {
  res.json(db.getLocations());
});

// POST /api/admin/locations — add location
router.post('/locations', (req, res) => {
  const { name, type, buildingId, floorId, roomNumber, description, aliases } = req.body;
  if (!name || !buildingId) {
    return res.status(400).json({ error: 'name and buildingId are required.' });
  }

  const locations = db.getLocations();
  const newLocation = {
    id: 'loc-' + Date.now(),
    name,
    type: type || 'location',
    buildingId,
    floorId: floorId || null,
    roomNumber: roomNumber || null,
    description: description || '',
    aliases: Array.isArray(aliases) ? aliases : (aliases ? [aliases] : []),
    navigationNodeId: null
  };

  locations.push(newLocation);
  db.saveLocations(locations);
  res.status(201).json({ success: true, data: newLocation });
});

// PUT /api/admin/locations/:id — update location
router.put('/locations/:id', (req, res) => {
  const locations = db.getLocations();
  const idx = locations.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Location not found.' });

  locations[idx] = { ...locations[idx], ...req.body, id: locations[idx].id };
  db.saveLocations(locations);
  res.json({ success: true, data: locations[idx] });
});

// DELETE /api/admin/locations/:id
router.delete('/locations/:id', (req, res) => {
  const locations = db.getLocations();
  const filtered = locations.filter(l => l.id !== req.params.id);
  if (filtered.length === locations.length) {
    return res.status(404).json({ error: 'Location not found.' });
  }
  db.saveLocations(filtered);
  res.json({ success: true, message: 'Location deleted.' });
});

// --- FACULTY ---

router.get('/faculty', (req, res) => {
  res.json(db.getFaculty());
});

router.post('/faculty', (req, res) => {
  const { name, department, designation, cabin, locationId } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required.' });

  const faculty = db.getFaculty();
  const newFaculty = {
    id: 'fac-' + Date.now(),
    name,
    department: department || '',
    designation: designation || 'Faculty',
    cabin: cabin || '',
    locationId: locationId || null,
    description: '[Added via Admin Panel]'
  };

  faculty.push(newFaculty);
  db.saveFaculty(faculty);
  res.status(201).json({ success: true, data: newFaculty });
});

router.put('/faculty/:id', (req, res) => {
  const faculty = db.getFaculty();
  const idx = faculty.findIndex(f => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Faculty not found.' });

  faculty[idx] = { ...faculty[idx], ...req.body, id: faculty[idx].id };
  db.saveFaculty(faculty);
  res.json({ success: true, data: faculty[idx] });
});

router.delete('/faculty/:id', (req, res) => {
  const faculty = db.getFaculty();
  const filtered = faculty.filter(f => f.id !== req.params.id);
  if (filtered.length === faculty.length) return res.status(404).json({ error: 'Faculty not found.' });
  db.saveFaculty(filtered);
  res.json({ success: true, message: 'Faculty deleted.' });
});

module.exports = router;
