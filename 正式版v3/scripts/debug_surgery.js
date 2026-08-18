const fs = require('fs');

const code = fs.readFileSync('../js/data/surgery.js', 'utf8');

const match = code.match(/const surgeryDiseases = (\[[\s\S]*?\]);\s*if/);
if (match) {
    console.log("Regex matched!");
} else {
    // Try to find it manually
    const startIdx = code.indexOf("const surgeryDiseases = [");
    if (startIdx !== -1) {
        console.log("Found startIdx at " + startIdx);
        const endIdx = code.indexOf("];", startIdx);
        console.log("Found endIdx at " + endIdx);
    } else {
        console.log("Still not found!");
    }
}
