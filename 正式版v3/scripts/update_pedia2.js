const fs = require('fs');

const filePath = '../js/data/pedia.js';
let fileContent = fs.readFileSync(filePath, 'utf8');

// Extract the pediaDiseases array
const startMarker = 'const pediaDiseases = ';
const startIndex = fileContent.indexOf(startMarker);
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

const arrayString = fileContent.substring(startIndex + startMarker.length, endIndex);
let diseases = eval('(' + arrayString + ')');

// 1. 小儿支气管肺炎
diseases[0].t.peConfig.positiveSigns = [
  { id: "sign_1", label: "呼吸增快伴三凹征", default: true, text: "呼吸急促，呼吸32-40次/分，吸气时可见三凹征（胸骨上窝、锁骨上窝、肋间隙凹陷）" },
  { id: "sign_2", label: "鼻翼扇动与口周发绀", default: true, text: "可见鼻翼扇动，口周伴轻度发绀" },
  { id: "sign_3", label: "双肺固定中细湿啰音", default: true, text: "双肺呼吸音粗糙，可闻及固定中细湿啰音，以双下肺及脊柱两旁为著" },
  { id: "sign_4", label: "轻度心率增快", default: false, text: "心率稍增快，110-120次/分，心音有力" }
];
diseases[0].t.peConfig.negativeSigns = [
  { id: "nsign_1", label: "无明显哮鸣音", text: "双肺未闻及明显的呼气相哮鸣音", default: true },
  { id: "nsign_2", label: "无慢性缺氧体征", text: "无杵状指（趾）等慢性缺氧体征", default: true },
  { id: "nsign_3", label: "无病理性杂音", text: "心脏各瓣膜听诊区未闻及病理性杂音", default: true },
  { id: "nsign_4", label: "胸廓对称无畸形", text: "气管居中，胸廓对称无畸形", default: true },
  { id: "nsign_5", label: "无神经受累体征", text: "脑膜刺激征阴性，病理反射未引出", default: true }
];
diseases[0].t.peConfig.specialistRaw = "呼吸32次/分，可见三凹征。双肺呼吸音粗，可闻及固定中细湿啰音，以双下肺为著。SpO₂：92-95%。";

// 2. 小儿腹泻病
diseases[1].t.peConfig.positiveSigns = [
  { id: "sign_1", label: "前囟及眼窝凹陷", default: true, text: "前囟明显凹陷，眼窝深陷，哭时泪少或无泪" },
  { id: "sign_2", label: "皮肤弹性下降", default: true, text: "皮肤干燥，弹性变差，捏起后回缩缓慢" },
  { id: "sign_3", label: "口腔黏膜干燥", default: true, text: "口唇及口腔黏膜干燥，唾液减少" },
  { id: "sign_4", label: "肠鸣音活跃", default: true, text: "腹部稍胀，肠鸣音活跃或亢进，约6-8次/分" },
  { id: "sign_5", label: "末梢循环欠佳", default: false, text: "四肢末梢稍凉，毛细血管充盈时间（CRT）轻度延长" }
];
diseases[1].t.peConfig.negativeSigns = [
  { id: "nsign_1", label: "无腹膜炎体征", text: "腹部平软，无压痛、反跳痛及肌紧张", default: true },
  { id: "nsign_2", label: "未触及腹部包块", text: "未触及腹部包块，可排除肠套叠", default: true },
  { id: "nsign_3", label: "大便无脓血", text: "大便无肉眼可见的黏液及脓血", default: true },
  { id: "nsign_4", label: "肝脾无肿大", text: "肝脏、脾脏肋下未触及肿大", default: true },
  { id: "nsign_5", label: "无神经系统异常", text: "神经系统查体未见异常，无颈项强直及脑膜刺激征", default: true }
];
diseases[1].t.peConfig.specialistRaw = "腹部平坦，腹软，肠鸣音活跃，无压痛，肝脾未触及。脱水程度：中度脱水，脱水性质：等渗性脱水。";

// 3. 手足口病
diseases[2].t.peConfig.positiveSigns = [
  { id: "sign_1", label: "典型手足臀皮疹", default: true, text: "手心、足底、臀部可见粟粒至绿豆大小的圆形或椭圆形红色斑丘疹、疱疹，直径约2-5mm" },
  { id: "sign_2", label: "皮疹伴炎性红晕", default: true, text: "皮疹及疱疹周围可见明显炎性红晕，疱内液体较少，疱液清亮" },
  { id: "sign_3", label: "口腔疱疹及溃疡", default: true, text: "口腔内舌部、颊黏膜、硬腭可见散在小疱疹或浅表溃疡" },
  { id: "sign_4", label: "咽部明显充血", default: true, text: "咽部充血明显，伴流涎" }
];
diseases[2].t.peConfig.negativeSigns = [
  { id: "nsign_1", label: "皮疹非向心性分布", text: "皮疹未呈向心性分布，无明显结痂（与水痘鉴别）", default: true },
  { id: "nsign_2", label: "无神经受累表现", text: "无精神萎靡、嗜睡、易惊、烦躁不安或肢体抖动，脑膜刺激征阴性", default: true },
  { id: "nsign_3", label: "无休克早期表现", text: "无面色苍白、出冷汗、心率明显增快及末梢循环不良等休克早期表现", default: true },
  { id: "nsign_4", label: "无肺水肿体征", text: "双肺呼吸音清晰，未闻及湿性啰音及粉红色泡沫痰", default: true },
  { id: "nsign_5", label: "无口腔Koplik斑", text: "双侧颊黏膜未见Koplik斑及麻疹卡他症状", default: true }
];
diseases[2].t.peConfig.specialistRaw = "手掌、足底、臀部可见散在圆形或椭圆形红色斑丘疹、疱疹，直径约2-5mm，疱液清亮，周围有红晕。口腔黏膜可见散在疱疹、浅表溃疡。咽部明显充血。神经系统检查未见异常。";

// 4. 小儿急性上呼吸道感染
diseases[3].t.peConfig.positiveSigns = [
  { id: "sign_1", label: "咽部及滤泡充血增生", default: true, text: "咽部明显充血，咽后壁可见淋巴滤泡增生" },
  { id: "sign_2", label: "扁桃体肿大", default: true, text: "双侧扁桃体Ⅰ至Ⅱ度肿大，伴表面明显充血" },
  { id: "sign_3", label: "颌下淋巴结肿大", default: false, text: "颌下或颈部可触及轻度肿大淋巴结，质软，活动度可，轻度触痛" },
  { id: "sign_4", label: "鼻黏膜充血水肿", default: true, text: "鼻腔黏膜充血水肿，可见少量浆液性或黏液性分泌物" }
];
diseases[3].t.peConfig.negativeSigns = [
  { id: "nsign_1", label: "肺部无感染体征", text: "双肺呼吸音清晰，未闻及干、湿性啰音", default: true },
  { id: "nsign_2", label: "无化脓性渗出", text: "双侧扁桃体表面无脓性渗出物及假膜形成", default: true },
  { id: "nsign_3", label: "口腔无特异病变", text: "软腭、咽腭弓未见疱疹及溃疡（排除疱疹性咽峡炎）", default: true },
  { id: "nsign_4", label: "无特异性皮疹", text: "全身皮肤黏膜无皮疹，无全身广泛淋巴结肿大", default: true },
  { id: "nsign_5", label: "心血管系统正常", text: "心音有力，心律齐，各瓣膜听诊区未闻及病理性杂音", default: true }
];
diseases[3].t.peConfig.specialistRaw = "咽部明显充血，双侧扁桃体Ⅱ度肿大，表面无脓性渗出物。双肺呼吸音清晰，未闻及干湿啰音。心音有力，律齐，各瓣膜区未闻及杂音。软腭未见疱疹及溃疡。";

const newArrayString = JSON.stringify(diseases, null, 2);
const newFileContent = fileContent.substring(0, startIndex + startMarker.length) + 
                       newArrayString + 
                       fileContent.substring(endIndex);

fs.writeFileSync(filePath, newFileContent, 'utf8');
console.log("SUCCESS");
