const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'data', '360 photos');
const dstDir = path.join(__dirname, '..', 'frontend', 'public', 'panoramas');

if (!fs.existsSync(dstDir)) {
  fs.mkdirSync(dstDir, { recursive: true });
}

// Mapping: source filename (as renamed by user) → destination name used by the app
// Walking order from Main Gate → Computer Dept (main stairs entry):
// 1. Main Gate
// 2. Main Building Entrance Porch
// 3. Ground Floor Foyer (after entering porch)
// 4. Staircase Approach (after taking left from foyer)
// 5. Main Staircase lower section (climb step 1)
// 6. First Floor Landing (reached 1st floor, climb step 2)
// 7. Computer Dept Entrance (Language Lab 138 visible on left)
// 8. Corridor-1: Language Lab (138) + Project Lab (134) on LEFT
// 9. Corridor-2: Software Labs (101, 102) on RIGHT, HPC (133) on LEFT
// 10. Corridor-3: Unix Lab (103) on RIGHT, PG Lab (131) + HOD (132) on LEFT
// 11. Corridor-4: Washrooms + Water Cooler on RIGHT, Network Lab (130) on LEFT
// 12. Corridor-5: Celebal (126) + Vertusa (125) on LEFT, Dr. Pawar (106) + Staff (107) on RIGHT
// 13. Corridor End: East/Secondary staircase end of the department

const mapping = {
  'Campus_main_gate.jpeg':                        'main-gate.jpg',
  'main_building_entarance.jpeg':                 'main-building-porch.jpg',
  'After_entring_the_main_building_poarch.jpeg':  'ground-floor-foyer.jpg',
  'After_taking_left_from_proach.jpeg':           'staircase-approach.jpg',
  'climb_the_steps_to_reach_1_floar(1).jpeg':     'main-staircase.jpg',
  'clibm_steps_to_reach_1_floor(2).jpeg':         'first-floor-landing.jpg',
  'computer_department_entarance.jpeg':            'comp-entrance.jpg',
  'corridor-1-langaugelab-projectlab.jpeg':        'comp-corridor-1.jpg',
  'corridor-2-softwarelabs.jpeg':                  'comp-corridor-2.jpg',
  'corridor-3-unixlab-pglab.jpeg':                 'comp-corridor-3.jpg',
  'corridor-4-washrooms-cooler.jpeg':              'comp-corridor-4.jpg',
  'corridor-celeballab-staffrooms.jpeg':           'comp-corridor-5.jpg',
  'corridor-5-end_of-deparment-.jpeg':             'comp-corridor-end.jpg',
};

console.log('Copying and renaming 360 photos into frontend/public/panoramas...\n');
let successCount = 0;
let failCount = 0;

for (const [srcFile, dstFile] of Object.entries(mapping)) {
  const srcPath = path.join(srcDir, srcFile);
  const dstPath = path.join(dstDir, dstFile);

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, dstPath);
    const stats = fs.statSync(dstPath);
    console.log(`✓  ${dstFile.padEnd(28)}  ← ${srcFile}  (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
    successCount++;
  } else {
    console.error(`✗  MISSING: ${srcPath}`);
    failCount++;
  }
}

console.log(`\nDone: ${successCount} copied, ${failCount} missing.`);
