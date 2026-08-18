const fs = require('fs');

const internalFile = '../js/data/internal.js';
const updatesFile = '../js/data/internal_updates.json';

const content = fs.readFileSync(internalFile, 'utf8');
const updates = JSON.parse(fs.readFileSync(updatesFile, 'utf8'));

// Extract array using regex
const match = content.match(/const internalDiseases = (\[[\s\S]*?\]);\s*if \(typeof window/);

if (!match) {
  console.error('Could not find internalDiseases array in internal.js');
  process.exit(1);
}

const diseases = eval(match[1]);

for (const disease of diseases) {
  const name = disease.name;
  if (updates[name]) {
    // Preserve diseaseName from original peConfig if exists, but we'll overwrite
    const originalVitals = disease.t.peConfig && disease.t.peConfig.vitals ? disease.t.peConfig.vitals : {};
    
    disease.t.peConfig = {
      diseaseName: name,
      vitals: originalVitals,
      positiveSigns: updates[name].positiveSigns,
      negativeSigns: updates[name].negativeSigns,
      specialistRaw: updates[name].specialistRaw
    };
  } else {
    console.warn('No update found for: ' + name);
  }
}

const newDiseasesStr = JSON.stringify(diseases, null, 2);

const newContent = content.slice(0, match.index) + 
  'const internalDiseases = ' + newDiseasesStr + ';\n\n  if (typeof window' + 
  content.slice(match.index + match[0].length - 15); // Adjust for the ending

// Let's do it safer:
const startIdx = content.indexOf('const internalDiseases = [');
const endIdx = content.indexOf('  if (typeof window !== \'undefined\' && window.MedicalDB');

const newContentSafe = content.slice(0, startIdx) + 
  'const internalDiseases = ' + newDiseasesStr + ';\n\n' + 
  content.slice(endIdx);

fs.writeFileSync(internalFile, newContentSafe);

console.log('Successfully patched internal.js');
