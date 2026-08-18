const fs = require('fs');

const filePath = '../js/data/pedia.js';
let fileContent = fs.readFileSync(filePath, 'utf8');

// Extract the pediaDiseases array
const startMarker = 'const pediaDiseases = ';
const startIndex = fileContent.indexOf(startMarker);
if (startIndex === -1) {
    console.log("Could not find start marker");
    process.exit(1);
}
let bracketCount = 0;
let endIndex = -1;
let i = startIndex + startMarker.length;
for (; i < fileContent.length; i++) {
    if (fileContent[i] === '[') bracketCount++;
    else if (fileContent[i] === ']') {
        bracketCount--;
        if (bracketCount === 0) {
            endIndex = i + 1;
            break;
        }
    }
}

if (endIndex === -1) {
    console.log("Could not find end of array");
    process.exit(1);
}

const arrayString = fileContent.substring(startIndex + startMarker.length, endIndex);
let diseases;
try {
    diseases = eval('(' + arrayString + ')');
} catch (e) {
    console.log("Error evaluating array:", e);
    process.exit(1);
}

// Now update diseases array
diseases[0].t.peConfig.positiveSigns[0].text = "呼吸急促，呼吸32次/分，三凹征阳性";
diseases[0].t.peConfig.positiveSigns[3].text = "心率稍增快，110次/分，心音有力";
diseases[0].t.peConfig.specialistRaw = "呼吸32次/分，三凹征阳性。双肺呼吸音粗，可闻及固定中细湿啰音，以双下肺为著。SpO₂：92%。";
diseases[0].t.peConfig.negativeSigns = [
    { id: "nsign_1", label: "无明显哮鸣音", text: "双肺未闻及明显的呼气相哮鸣音", default: true },
    { id: "nsign_2", label: "无慢性缺氧体征", text: "无杵状指（趾）等慢性缺氧体征", default: true },
    { id: "nsign_3", label: "无病理性杂音", text: "心脏各瓣膜听诊区未闻及病理性杂音", default: true },
    { id: "nsign_4", label: "胸廓对称无畸形", text: "气管居中，胸廓对称无畸形", default: true },
    { id: "nsign_5", label: "无呼吸衰竭体征", text: "未见明显三凹征，呼吸尚平稳", default: false }
];

diseases[1].t.peConfig.positiveSigns[3].text = "腹部稍胀，肠鸣音活跃，约6-8次/分";
diseases[1].t.peConfig.specialistRaw = "腹部平坦，腹软，肠鸣音活跃，无压痛，肝脾未触及。脱水程度：中度，脱水性质：等渗。";
diseases[1].t.peConfig.negativeSigns = [
    { id: "nsign_1", label: "无腹膜炎体征", text: "腹部平软，无压痛、反跳痛及肌紧张", default: true },
    { id: "nsign_2", label: "未触及腹部包块", text: "未触及腹部包块，排除肠套叠", default: true },
    { id: "nsign_3", label: "大便无脓血", text: "大便无黏液脓血", default: true },
    { id: "nsign_4", label: "肝脾无肿大", text: "肝脾未触及肿大", default: true },
    { id: "nsign_5", label: "无脑膜刺激征", text: "神经系统查体未见异常，无颈项强直", default: true }
];

if(diseases[2]) {
    // disease 3
    let d3 = diseases[2].t.peConfig;
    if (d3.positiveSigns) {
        d3.positiveSigns.forEach(s => {
            if (s.text.includes('{num}')) s.text = s.text.replace('{num}', '数');
            if (s.text.includes('{herpes_d}')) s.text = s.text.replace('{herpes_d}', '直径');
            if (s.text.includes('{neuro}')) s.text = s.text.replace('{neuro}', '');
        });
    }
    if (d3.specialistRaw) {
        d3.specialistRaw = "手掌、足底、臀部可见数个圆形或椭圆形红色斑丘疹、疱疹，直径约2-5mm，疱液清亮，周围有红晕。口腔黏膜可见散在疱疹、溃疡。咽充血。神经系统检查未见异常。";
    }
    
    // negative signs for d3
    if (d3.negativeSigns && d3.negativeSigns.length > 0 && typeof d3.negativeSigns[0] === 'string') {
        d3.negativeSigns = [
            { id: "nsign_1", label: "无脑膜刺激征", text: "颈软，无抵抗，布氏征及克氏征阴性", default: true },
            { id: "nsign_2", label: "无病理反射", text: "巴宾斯基征等病理反射未引出", default: true },
            { id: "nsign_3", label: "无休克体征", text: "四肢末梢暖，毛细血管充盈时间正常", default: true },
            { id: "nsign_4", label: "心肺听诊无异常", text: "双肺呼吸音清，心音有力，律齐", default: true }
        ];
    }
    // Also we need to fix any positiveSigns format if not already object
}

if(diseases[3]) {
    // disease 4
    let d4 = diseases[3].t.peConfig;
    if (d4.positiveSigns) {
         d4.positiveSigns.forEach(s => {
             if(s.text.includes('{degree}')) s.text = s.text.replace('{degree}', 'II');
         });
    }
    if (d4.specialistRaw) {
        d4.specialistRaw = "咽部充血，双侧扁桃体II度肿大，表面无渗出。双肺呼吸音粗，未闻及干湿啰音。心音有力，律齐，各瓣膜区未闻及杂音。软腭未见异常。";
    }
    if (d4.negativeSigns && d4.negativeSigns.length > 0 && typeof d4.negativeSigns[0] === 'string') {
        d4.negativeSigns = [
            { id: "nsign_1", label: "肺部无明显湿啰音", text: "双肺呼吸音清晰，未闻及干、湿性啰音", default: true },
            { id: "nsign_2", label: "扁桃体无脓性渗出", text: "扁桃体表面无脓性渗出物", default: true },
            { id: "nsign_3", label: "口腔无特殊病变", text: "软腭、咽腭弓未见疱疹及溃疡", default: true },
            { id: "nsign_4", label: "无皮疹及广泛淋巴结肿大", text: "无皮疹，无全身广泛淋巴结肿大", default: true },
            { id: "nsign_5", label: "无病理性杂音", text: "心音有力，未闻及早搏及病理性杂音", default: true }
        ];
    }
}

// Convert back to JSON and format
const newArrayString = JSON.stringify(diseases, null, 2);

// Since there are some specific JSON formats, this is fine, but it might mess up functions if there were any. 
// But wait, the original file has normal JSON with just simple javascript wrappers.
const newFileContent = fileContent.substring(0, startIndex + startMarker.length) + 
                       newArrayString + 
                       fileContent.substring(endIndex);

fs.writeFileSync(filePath, newFileContent, 'utf8');
console.log("File updated successfully.");
