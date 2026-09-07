const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../../data');

function readJSON(filename) {
  try {
    const filePath = path.join(dataDir, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[DataStore] Failed to read ${filename}:`, err.message);
    return [];
  }
}

function writeJSON(filename, data) {
  try {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`[DataStore] Failed to write ${filename}:`, err.message);
    return false;
  }
}

module.exports = {
  getLocations:        () => readJSON('locations.json'),
  getBuildings:        () => readJSON('buildings.json'),
  getFloors:           () => readJSON('floors.json'),
  getDepartments:      () => readJSON('departments.json'),
  getFaculty:          () => readJSON('faculty.json'),
  getNavNodes:         () => readJSON('navigation-nodes.json'),
  getNavEdges:         () => readJSON('navigation-edges.json'),
  getPanoramas:        () => readJSON('panoramas.json'),
  saveLocations:  (d) => writeJSON('locations.json', d),
  saveNavNodes:   (d) => writeJSON('navigation-nodes.json', d),
  saveNavEdges:   (d) => writeJSON('navigation-edges.json', d),
  savePanoramas:  (d) => writeJSON('panoramas.json', d),
  saveFaculty:    (d) => writeJSON('faculty.json', d),
};
