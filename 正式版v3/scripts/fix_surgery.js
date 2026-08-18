const fs = require('fs');
let code = fs.readFileSync('../js/data/surgery.js', 'utf8');

const regex = /\(function\(\)\{[\s\S]*?\[\s*\{/;
if (regex.test(code)) {
    code = code.replace(regex, '(function(){\n  const surgeryDiseases = [\n  {');
    fs.writeFileSync('../js/data/surgery.js', code, 'utf8');
    console.log('Fixed missing const surgeryDiseases');
} else {
    console.log('Regex did not match');
}
