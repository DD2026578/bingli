const fs = require('fs');
const path = '../js/data/internal.js';
let content = fs.readFileSync(path, 'utf8');

const match = content.match(/(const internalDiseases = \[[\s\S]*\}\n  \])\n/m) || content.match(/(const internalDiseases = \[[\s\S]*\]);\s*$/m) || content.match(/(const internalDiseases = \[[\s\S]*\]);\s*return/m);

if (!match) {
  console.log('Failed to parse');
  process.exit(1);
}

const originalStr = match[1];
const arr = eval(originalStr.replace('const internalDiseases = ', ''));

const pe_cardio = "T: {t}℃ P: {p}次/分 R: {r}次/分 BP: {bp}mmHg\\n发育正常，营养中等，神志清楚，精神可，自主体位，查体合作。全身皮肤黏膜无黄染及出血点，浅表淋巴结未触及肿大。头颅无畸形，五官端正。双侧瞳孔等大等圆，对光反射灵敏。颈软，气管居中，甲状腺未触及肿大。胸廓无畸形。双肺呼吸音清，未闻及干湿性啰音。心脏查体详见专科查体。腹平软，无压痛及反跳痛，肝脾肋下未触及，肠鸣音正常。双下肢无水肿，病理征阴性。";
const pe_resp = "T: {t}℃ P: {p}次/分 R: {r}次/分 BP: {bp}mmHg\\n发育正常，营养中等，神志清楚，精神可，自主体位，查体合作。全身皮肤黏膜无黄染及出血点，浅表淋巴结未触及肿大。头颅无畸形，五官端正。双侧瞳孔等大等圆，对光反射灵敏。颈软，气管居中，甲状腺未触及肿大。胸廓及双肺查体详见专科查体。心界不大，心率{hr}次/分，律齐，各瓣膜听诊区未闻及病理性杂音。腹平软，无压痛及反跳痛，肝脾肋下未触及，肠鸣音正常。双下肢无水肿，病理征阴性。";
const pe_gastro = "T: {t}℃ P: {p}次/分 R: {r}次/分 BP: {bp}mmHg\\n发育正常，营养中等，神志清楚，精神可，自主体位，查体合作。全身皮肤黏膜无黄染，浅表淋巴结未触及肿大。头颅无畸形，五官端正。双侧瞳孔等大等圆，对光反射灵敏。颈软，气管居中，甲状腺未触及肿大。胸廓无畸形。双肺呼吸音清，未闻及干湿性啰音。心界不大，心率{hr}次/分，律齐，各瓣膜听诊区未闻及病理性杂音。腹部查体详见专科查体。双下肢无水肿，病理征阴性。";
const pe_neuro = "T: {t}℃ P: {p}次/分 R: {r}次/分 BP: {bp}mmHg\\n发育正常，营养中等，神志清楚，精神可，自主体位。全身皮肤黏膜无黄染及出血点，浅表淋巴结未触及肿大。头颅无畸形，五官端正。颈软，气管居中，甲状腺未触及肿大。胸廓无畸形。双肺呼吸音清，未闻及干湿性啰音。心界不大，心率{hr}次/分，律齐，各瓣膜听诊区未闻及病理性杂音。腹平软，无压痛及反跳痛，肝脾肋下未触及，肠鸣音正常。神经系统查体详见专科查体。";
const pe_nephro = "T: {t}℃ P: {p}次/分 R: {r}次/分 BP: {bp}mmHg\\n发育正常，营养中等，神志清楚，精神可，自主体位，查体合作。全身皮肤黏膜无黄染及出血点，浅表淋巴结未触及肿大。头颅无畸形，五官端正。双侧瞳孔等大等圆，对光反射灵敏。颈软，气管居中，甲状腺未触及肿大。胸廓无畸形。双肺呼吸音清，未闻及干湿性啰音。心界不大，心率{hr}次/分，律齐，各瓣膜听诊区未闻及病理性杂音。腹平软，无压痛及反跳痛，肝脾肋下未触及，肠鸣音正常。肾脏及相关专科查体详见专科查体。";
const pe_endo = "T: {t}℃ P: {p}次/分 R: {r}次/分 BP: {bp}mmHg\\n发育正常，营养中等，神志清楚，精神可，自主体位，查体合作。全身皮肤黏膜、浅表淋巴结及头颈部查体详见专科查体。胸廓无畸形。双肺呼吸音清，未闻及干湿性啰音。心界不大，心率{hr}次/分，律齐，各瓣膜听诊区未闻及病理性杂音。腹平软，无压痛及反跳痛，肝脾肋下未触及，肠鸣音正常。双下肢无水肿，病理征阴性。";
const pe_rheum = "T: {t}℃ P: {p}次/分 R: {r}次/分 BP: {bp}mmHg\\n发育正常，营养中等，神志清楚，精神可，自主体位，查体合作。全身皮肤黏膜无黄染及出血点，浅表淋巴结未触及肿大。头颅无畸形，五官端正。双侧瞳孔等大等圆，对光反射灵敏。颈软，气管居中，甲状腺未触及肿大。胸廓无畸形。双肺呼吸音清，未闻及干湿性啰音。心界不大，心率{hr}次/分，律齐，各瓣膜听诊区未闻及病理性杂音。腹平软，无压痛及反跳痛，肝脾肋下未触及，肠鸣音正常。骨关节专科查体详见专科查体。";
const pe_hemato = "T: {t}℃ P: {p}次/分 R: {r}次/分 BP: {bp}mmHg\\n发育正常，营养中等，神志清楚，精神可，自主体位，查体合作。头颅无畸形，五官端正。双侧瞳孔等大等圆，对光反射灵敏。颈软，气管居中，甲状腺未触及肿大。胸廓无畸形。双肺呼吸音清，未闻及干湿性啰音。心界不大，心率{hr}次/分，律齐，各瓣膜听诊区未闻及病理性杂音。腹平软，无压痛及反跳痛，肝脾肋下未触及，肠鸣音正常。血液系统查体详见专科查体。";

const catMap = {
  0: pe_resp, 5: pe_resp, 12: pe_resp, 13: pe_resp, 14: pe_resp, 29: pe_resp, 30: pe_resp, 31: pe_resp, 32: pe_resp,
  1: pe_cardio, 6: pe_cardio, 9: pe_cardio, 10: pe_cardio, 11: pe_cardio, 28: pe_cardio,
  2: pe_gastro, 7: pe_gastro, 8: pe_gastro, 15: pe_gastro, 16: pe_gastro, 17: pe_gastro, 33: pe_gastro, 34: pe_gastro, 35: pe_gastro,
  18: pe_nephro, 19: pe_nephro, 20: pe_nephro, 36: pe_nephro,
  3: pe_endo, 21: pe_endo, 22: pe_endo, 23: pe_endo, 38: pe_endo, 39: pe_endo,
  4: pe_neuro, 26: pe_neuro, 27: pe_neuro, 42: pe_neuro,
  24: pe_rheum, 25: pe_rheum, 37: pe_rheum,
  40: pe_hemato, 41: pe_hemato
};

const newSigns = {
  "慢性胃炎": {
    pos: [
      { id: "sign_1", label: "上腹部轻压痛", default: true, text: "上腹部有轻度压痛，无肌紧张" },
      { id: "sign_2", label: "无反跳痛", default: true, text: "上腹部深压无反跳痛" },
      { id: "sign_3", label: "肠鸣音正常", default: true, text: "肠鸣音正常，4-5次/分" }
    ],
    neg: [
      { id: "neg_1", label: "无莫非氏征", default: false, text: "Murphy征阴性" },
      { id: "neg_2", label: "肝脾未触及", default: false, text: "肝脾肋下未触及" },
      { id: "neg_3", label: "无移动性浊音", default: false, text: "移动性浊音阴性" },
      { id: "neg_4", label: "未及腹部包块", default: false, text: "腹部未触及包块" }
    ]
  },
  "不稳定型心绞痛": {
    pos: [
      { id: "sign_1", label: "心音有力", default: true, text: "心音相对有力，可有轻度减弱" },
      { id: "sign_2", label: "心率偏快", default: true, text: "心率可偏快，部分伴有早搏" },
      { id: "sign_3", label: "可闻及第四心音", default: true, text: "心尖区可闻及第四心音" }
    ],
    neg: [
      { id: "neg_1", label: "无心脏杂音", default: false, text: "各瓣膜区未闻及病理性杂音" },
      { id: "neg_2", label: "无心包摩擦音", default: false, text: "未闻及心包摩擦音" },
      { id: "neg_3", label: "肺部无啰音", default: false, text: "双肺底未闻及湿啰音" },
      { id: "neg_4", label: "下肢无水肿", default: false, text: "双下肢无水肿" }
    ]
  },
  "支气管扩张症": {
    pos: [
      { id: "sign_1", label: "固定湿啰音", default: true, text: "病变部位可闻及固定而持久的局限性粗湿啰音" },
      { id: "sign_2", label: "杵状指(趾)", default: true, text: "可伴有杵状指(趾)" },
      { id: "sign_3", label: "哮鸣音", default: true, text: "部分患者可闻及哮鸣音" }
    ],
    neg: [
      { id: "neg_1", label: "叩诊无浊音", default: false, text: "肺部叩诊多呈清音，无明显浊音" },
      { id: "neg_2", label: "呼吸音无减弱", default: false, text: "呼吸音多数正常或粗糙，无明显减弱" },
      { id: "neg_3", label: "无胸膜摩擦音", default: false, text: "未闻及胸膜摩擦音" },
      { id: "neg_4", label: "无明显桶状胸", default: false, text: "胸廓正常，无明显桶状胸" }
    ]
  },
  "溃疡性结肠炎": {
    pos: [
      { id: "sign_1", label: "左下腹压痛", default: true, text: "左下腹轻至中度压痛" },
      { id: "sign_2", label: "肠鸣音活跃", default: true, text: "肠鸣音活跃，可达6-8次/分" },
      { id: "sign_3", label: "可及肠管索条", default: true, text: "左下腹可触及硬管状结肠索条" }
    ],
    neg: [
      { id: "neg_1", label: "无反跳痛", default: false, text: "腹部无反跳痛及肌紧张" },
      { id: "neg_2", label: "无右下腹包块", default: false, text: "右下腹未及包块" },
      { id: "neg_3", label: "无移动性浊音", default: false, text: "移动性浊音阴性" },
      { id: "neg_4", label: "无明显黄疸", default: false, text: "全身皮肤黏膜无黄染" }
    ]
  },
  "胃食管反流病": {
    pos: [
      { id: "sign_1", label: "剑突下轻压痛", default: true, text: "剑突下或上腹部可有轻压痛" },
      { id: "sign_2", label: "无肌紧张", default: true, text: "腹部柔软，无肌紧张" },
      { id: "sign_3", label: "咽部充血", default: true, text: "可伴有咽后壁黏膜慢性充血" }
    ],
    neg: [
      { id: "neg_1", label: "无反跳痛", default: false, text: "全腹无反跳痛" },
      { id: "neg_2", label: "无莫非氏征", default: false, text: "Murphy征阴性" },
      { id: "neg_3", label: "无麦氏点压痛", default: false, text: "右下腹麦氏点无压痛" },
      { id: "neg_4", label: "腹部无包块", default: false, text: "腹部未触及包块" }
    ]
  },
  "急性肾损伤": {
    pos: [
      { id: "sign_1", label: "双下肢水肿", default: true, text: "双下肢呈可凹性水肿" },
      { id: "sign_2", label: "肾区叩击痛", default: true, text: "双侧肾区可有轻度叩击痛" },
      { id: "sign_3", label: "血压偏高", default: true, text: "血压可轻至中度升高" }
    ],
    neg: [
      { id: "neg_1", label: "无移动性浊音", default: false, text: "移动性浊音阴性" },
      { id: "neg_2", label: "肺底无啰音", default: false, text: "双肺底未闻及湿啰音" },
      { id: "neg_3", label: "心包无摩擦音", default: false, text: "未闻及心包摩擦音" },
      { id: "neg_4", label: "无颈静脉怒张", default: false, text: "无颈静脉怒张" }
    ]
  },
  "原发性肾病综合征": {
    pos: [
      { id: "sign_1", label: "重度水肿", default: true, text: "眼睑颜面部及双下肢重度凹陷性水肿" },
      { id: "sign_2", label: "移动性浊音阳性", default: true, text: "腹部移动性浊音阳性，提示腹水" },
      { id: "sign_3", label: "阴囊水肿", default: true, text: "部分患者可有阴囊/会阴部水肿" }
    ],
    neg: [
      { id: "neg_1", label: "无心脏杂音", default: false, text: "各瓣膜区未闻及病理性杂音" },
      { id: "neg_2", label: "肝脾未及", default: false, text: "肝脾肋下未及" },
      { id: "neg_3", label: "无黄疸", default: false, text: "巩膜无黄染" },
      { id: "neg_4", label: "肾区无剧烈叩击痛", default: false, text: "肾区无明显剧烈叩击痛" }
    ]
  },
  "癫痫发作": {
    pos: [
      { id: "sign_1", label: "意识障碍", default: true, text: "发作期可有意识丧失或模糊" },
      { id: "sign_2", label: "病理征阳性", default: true, text: "发作后短期内可引出病理征（如Babinski征）" },
      { id: "sign_3", label: "肌张力异常", default: true, text: "发作时肢体肌张力增高，可有强直痉挛" }
    ],
    neg: [
      { id: "neg_1", label: "脑膜刺激征阴性", default: false, text: "颈软，克氏征、布氏征阴性" },
      { id: "neg_2", label: "无持久偏瘫", default: false, text: "发作间期无偏瘫等局灶性神经功能缺损" },
      { id: "neg_3", label: "瞳孔等大等圆", default: false, text: "发作间期双侧瞳孔等大等圆" },
      { id: "neg_4", label: "心律齐", default: false, text: "心界不大，心律齐" }
    ]
  },
  "阻塞性睡眠呼吸暂停低通气综合征": {
    pos: [
      { id: "sign_1", label: "肥胖体型", default: true, text: "颈围较粗，体型偏肥胖，BMI升高" },
      { id: "sign_2", label: "咽腔狭窄", default: true, text: "悬雍垂粗长，双侧扁桃体肿大，咽腔变窄" },
      { id: "sign_3", label: "小颌畸形", default: true, text: "部分患者可见下颌后缩或小颌畸形" }
    ],
    neg: [
      { id: "neg_1", label: "肺部无啰音", default: false, text: "双肺呼吸音清，未闻及干湿性啰音" },
      { id: "neg_2", label: "无发绀", default: false, text: "口唇无明显发绀（非发作期）" },
      { id: "neg_3", label: "无三凹征", default: false, text: "静息状态下无三凹征" },
      { id: "neg_4", label: "心界正常", default: false, text: "心界不大" }
    ]
  },
  "消化性溃疡伴出血": {
    pos: [
      { id: "sign_1", label: "上腹压痛", default: true, text: "剑突下偏右或偏左有局限性压痛" },
      { id: "sign_2", label: "肠鸣音活跃", default: true, text: "肠鸣音活跃，可达6-10次/分" },
      { id: "sign_3", label: "皮肤苍白", default: true, text: "面色、口唇及甲床苍白，提示贫血" }
    ],
    neg: [
      { id: "neg_1", label: "无板状腹", default: false, text: "全腹无肌紧张，呈平软状" },
      { id: "neg_2", label: "无反跳痛", default: false, text: "腹部无反跳痛" },
      { id: "neg_3", label: "肝脾未触及", default: false, text: "肝脾肋下未触及" },
      { id: "neg_4", label: "无莫非氏征", default: false, text: "Murphy征阴性" }
    ]
  },
  "非酒精性脂肪性肝病": {
    pos: [
      { id: "sign_1", label: "肝脏轻度肿大", default: true, text: "肝脏肋下可及，边缘钝，质地稍韧" },
      { id: "sign_2", label: "肥胖或超重", default: true, text: "多伴有中心性肥胖，腹围增大" },
      { id: "sign_3", label: "右上腹轻压痛", default: true, text: "右上腹或肝区可有轻度叩痛或压痛" }
    ],
    neg: [
      { id: "neg_1", label: "无黄疸", default: false, text: "全身皮肤黏膜及巩膜无黄染" },
      { id: "neg_2", label: "无蜘蛛痣", default: false, text: "未见肝掌及蜘蛛痣" },
      { id: "neg_3", label: "脾脏未触及", default: false, text: "脾脏肋下未触及" },
      { id: "neg_4", label: "无腹水", default: false, text: "移动性浊音阴性，无腹水" }
    ]
  },
  "慢性肾小球肾炎": {
    pos: [
      { id: "sign_1", label: "双下肢水肿", default: true, text: "双下肢轻至中度凹陷性水肿" },
      { id: "sign_2", label: "血压偏高", default: true, text: "血压可轻至中度升高" },
      { id: "sign_3", label: "面色苍白", default: true, text: "慢性病容，颜面部及结膜稍苍白" }
    ],
    neg: [
      { id: "neg_1", label: "心脏无杂音", default: false, text: "各瓣膜区未闻及病理性杂音" },
      { id: "neg_2", label: "无移动性浊音", default: false, text: "移动性浊音阴性" },
      { id: "neg_3", label: "肾区无压痛", default: false, text: "双侧肾区无明显叩击痛及压痛" },
      { id: "neg_4", label: "肺底无啰音", default: false, text: "双肺未闻及湿性啰音" }
    ]
  },
  "原发性骨质疏松症": {
    pos: [
      { id: "sign_1", label: "脊柱后凸", default: true, text: "可见脊柱后凸畸形（驼背）" },
      { id: "sign_2", label: "椎体棘突叩痛", default: true, text: "胸腰椎局部棘突及旁系肌轻压痛、叩击痛" },
      { id: "sign_3", label: "身长缩短", default: true, text: "身高较年轻时明显缩短" }
    ],
    neg: [
      { id: "neg_1", label: "无神经根受压", default: false, text: "双下肢感觉、运动正常，无放射痛" },
      { id: "neg_2", label: "病理征阴性", default: false, text: "病理征阴性，生理反射正常" },
      { id: "neg_3", label: "关节无红肿", default: false, text: "四肢大关节无明显红肿热痛" },
      { id: "neg_4", label: "无肌肉萎缩", default: false, text: "四肢肌肉无明显萎缩" }
    ]
  },
  "缺铁性贫血": {
    pos: [
      { id: "sign_1", label: "皮肤苍白", default: true, text: "面色苍白，口唇、甲床苍白" },
      { id: "sign_2", label: "反甲", default: true, text: "部分患者可见指甲变平或呈匙状（反甲）" },
      { id: "sign_3", label: "心率偏快", default: true, text: "心率轻度增快，心尖区可闻及柔和收缩期杂音" }
    ],
    neg: [
      { id: "neg_1", label: "无黄疸", default: false, text: "巩膜及皮肤无黄染" },
      { id: "neg_2", label: "脾脏未及", default: false, text: "肝脾肋下未及" },
      { id: "neg_3", label: "无出血点", default: false, text: "全身皮肤无瘀点瘀斑" },
      { id: "neg_4", label: "淋巴结不大", default: false, text: "浅表淋巴结未触及肿大" }
    ]
  },
  "免疫性血小板减少症": {
    pos: [
      { id: "sign_1", label: "皮肤瘀点瘀斑", default: true, text: "四肢及躯干散在出血点、瘀斑，压之不退色" },
      { id: "sign_2", label: "黏膜出血", default: true, text: "可见牙龈渗血或口腔黏膜血疱" },
      { id: "sign_3", label: "束臂试验阳性", default: true, text: "束臂试验（毛细血管脆性试验）阳性" }
    ],
    neg: [
      { id: "neg_1", label: "脾脏不大", default: false, text: "脾脏肋下未触及" },
      { id: "neg_2", label: "无黄疸", default: false, text: "全身皮肤黏膜无黄染" },
      { id: "neg_3", label: "淋巴结不大", default: false, text: "浅表淋巴结未触及肿大" },
      { id: "neg_4", label: "无骨痛", default: false, text: "胸骨无压痛" }
    ]
  },
  "短暂性脑缺血发作": {
    pos: [
      { id: "sign_1", label: "局灶性体征", default: true, text: "发作期可有单瘫、偏瘫或偏身感觉障碍（短暂存在）" },
      { id: "sign_2", label: "言语障碍", default: true, text: "发作期可出现一过性失语或构音障碍" },
      { id: "sign_3", label: "神经系统可正常", default: true, text: "发作间期（就诊时）神经系统查体常完全正常" }
    ],
    neg: [
      { id: "neg_1", label: "脑膜刺激征阴性", default: false, text: "颈软，克氏征、布氏征阴性" },
      { id: "neg_2", label: "无意识障碍", default: false, text: "多无意识障碍，神志清楚" },
      { id: "neg_3", label: "眼球活动正常", default: false, text: "双侧眼球活动自如，无凝视" },
      { id: "neg_4", label: "病理征阴性", default: false, text: "发作间期病理征阴性" }
    ]
  }
};

arr.forEach((d, i) => {
  if (catMap[i]) {
    d.t.physicalExam = catMap[i];
  } else {
    d.t.physicalExam = pe_cardio; // default fallback
  }

  // Augment missing positive/negative signs
  if (newSigns[d.name]) {
    if (d.t.peConfig.positiveSigns.length < 3) {
      d.t.peConfig.positiveSigns = newSigns[d.name].pos;
    }
    if (d.t.peConfig.negativeSigns.length < 3) {
      d.t.peConfig.negativeSigns = newSigns[d.name].neg;
    }
  }
});

let finalStr = JSON.stringify(arr, null, 2);
finalStr = 'const internalDiseases = ' + finalStr + ';\n';
const fullFile = content.substring(0, match.index) + finalStr + content.substring(match.index + match[0].length);

fs.writeFileSync(path, fullFile, 'utf8');
console.log('Update complete.');
