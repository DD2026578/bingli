const fs = require('fs');

const file = '../js/data/surgery.js';
let code = fs.readFileSync(file, 'utf8');

const match = code.match(/(const surgeryDiseases = )(\[[\s\S]*?\])(;\s*if \(typeof window)/);
if (!match) {
  console.log('Failed to match');
  process.exit(1);
}

let diseases = JSON.parse(match[2]);

// Define target diseases
const neuros = [
  '脑膜瘤', '蛛网膜下腔出血', '颅脑损伤（硬膜下/外血肿）', '高血压脑出血',
  '三叉神经痛', '椎管内肿瘤（神经鞘瘤）', '脑积水', '脑震荡'
];
const thoracics = [
  '自发性气胸', '肺癌', '肋骨骨折合并血气胸', '胸部外伤（肋骨骨折合并血气胸）', 
  '漏斗胸', '食管癌', '胸主动脉瘤', '纵隔肿瘤（胸腺瘤）', '肺大疱', '肺脓肿', '创伤性膈疝'
];

let neuroCount = 0;
let thoracicCount = 0;

diseases.forEach(d => {
  let name = d.name;
  
  if (neuros.includes(name)) {
    neuroCount++;
    if (d.t && d.t.physicalExam) {
      d.t.physicalExam = '发育正常，营养良好，神志清晰，查体合作。皮肤粘膜正常，浅表淋巴结无肿大。头颅外观无畸形，双眼睑无水肿，结膜无充血，巩膜无黄染。颈软，气管居中，甲状腺无肿大，颈静脉无怒张。胸廓无畸形，双肺呼吸音清，未闻及干湿性啰音。心前区无隆起，心界不大，心率齐，各瓣膜听诊区未闻及病理性杂音。腹部平坦，腹软，无压痛及反跳痛。神经系统阳性体征详见专科检查。四肢脊柱无畸形，活动自如。';
    }
    
    let peConfig = (d.t && d.t.peConfig) || d.peConfig || {};
    peConfig.diseaseName = name;
    
    if (name === '脑膜瘤') {
      peConfig.positiveSigns = [
        { id: 'p1', label: '局灶神经缺损', default: true, text: '肢体肌力减退（肌力IV级），伴痛温觉减退' },
        { id: 'p2', label: '视乳头水肿', default: true, text: '眼底检查可见双侧视神经乳头水肿，边界不清' },
        { id: 'p3', label: '局部颅骨隆起', default: true, text: '可触及局部颅骨限局性隆起，质硬无压痛' }
      ];
      peConfig.negativeSigns = [
        { id: 'n1', label: '脑膜刺激征（-）', default: true, text: '颈项无强直，克氏征、布氏征均阴性' },
        { id: 'n2', label: '无意识障碍', default: true, text: '神志清楚，GCS 15分' },
        { id: 'n3', label: '无颅内杂音', default: true, text: '听诊未闻及明显颅内血管杂音' },
        { id: 'n4', label: '瞳孔正常', default: true, text: '双侧瞳孔等大等圆，对光反射灵敏' }
      ];
    } else if (name === '蛛网膜下腔出血') {
      peConfig.positiveSigns = [
        { id: 'p1', label: '脑膜刺激征（+）', default: true, text: '颈项强直，克氏征阳性，布氏征阳性' },
        { id: 'p2', label: '意识障碍', default: true, text: '嗜睡/浅昏迷状态，GCS评分减低' },
        { id: 'p3', label: '动眼神经麻痹', default: true, text: '一侧瞳孔散大，对光反射迟钝或消失，眼球活动受限' }
      ];
      peConfig.negativeSigns = [
        { id: 'n1', label: '无明显偏瘫', default: true, text: '四肢肌力对称，未见明显偏瘫体征' },
        { id: 'n2', label: '病理征（-）', default: true, text: '双侧巴宾斯基征阴性' },
        { id: 'n3', label: '无头皮外伤', default: true, text: '头皮完整，无挫裂伤、血肿' },
        { id: 'n4', label: '无共济失调', default: true, text: '指鼻试验、跟膝胫试验未见异常' }
      ];
    } else if (name.includes('颅脑损伤')) { 
      peConfig.positiveSigns = [
        { id: 'p1', label: '局部头皮血肿', default: true, text: '局部可见头皮擦伤及皮下血肿，触痛明显' },
        { id: 'p2', label: '瞳孔不等大', default: true, text: '患侧瞳孔散大，对光反射迟钝或消失' },
        { id: 'p3', label: '对侧偏瘫', default: true, text: '对侧肢体肌力减退，肌张力增高' },
        { id: 'p4', label: '意识障碍加重', default: true, text: '呈浅昏迷状态，GCS评分进行性下降' }
      ];
      peConfig.negativeSigns = [
        { id: 'n1', label: '脑膜刺激征（-）', default: true, text: '颈项无明显强直' },
        { id: 'n2', label: '无眼球震颤', default: true, text: '未见明显眼球水平或垂直震颤' },
        { id: 'n3', label: '无脑脊液漏', default: true, text: '双侧外耳道及鼻腔未见清亮液体流出' },
        { id: 'n4', label: '无外耳道流血', default: true, text: '双侧外耳道无出血' }
      ];
    } else if (name === '高血压脑出血') {
      peConfig.positiveSigns = [
        { id: 'p1', label: '典型偏瘫', default: true, text: '病灶对侧中枢性面舌瘫，对侧肢体偏瘫，肌张力增高' },
        { id: 'p2', label: '病理征（+）', default: true, text: '病灶对侧巴宾斯基征（Babinski征）阳性' },
        { id: 'p3', label: '感觉障碍', default: true, text: '对侧偏身痛温觉及触觉明显减退' },
        { id: 'p4', label: '意识水平下降', default: true, text: '浅昏迷至深昏迷，GCS评分显著下降' }
      ];
      peConfig.negativeSigns = [
        { id: 'n1', label: '无头皮外伤', default: true, text: '头皮完整，未见挫伤及血肿' },
        { id: 'n2', label: '无脑脊液漏', default: true, text: '外耳道、鼻腔无脑脊液漏' },
        { id: 'n3', label: '无颅骨凹陷', default: true, text: '触诊未见颅骨凹陷及骨折台阶感' },
        { id: 'n4', label: '无明显颈强直', default: true, text: '颈软，早期无明显脑膜刺激征' }
      ];
    } else if (name === '三叉神经痛') {
      peConfig.positiveSigns = [
        { id: 'p1', label: '面部触发点', default: true, text: '同侧口角、鼻翼、颊部等处有明确的扳机点，触之诱发剧痛' },
        { id: 'p2', label: '痛性抽搐', default: true, text: '发作时伴有同侧面部肌肉抽搐、流泪、流涎' },
        { id: 'p3', label: '痛觉过敏', default: true, text: '同侧面部皮肤轻触觉可引发痛觉过敏' }
      ];
      peConfig.negativeSigns = [
        { id: 'n1', label: '面部感觉正常', default: true, text: '非发作期面部痛温觉及触觉无明显减退' },
        { id: 'n2', label: '角膜反射存在', default: true, text: '双侧角膜反射存在，灵敏' },
        { id: 'n3', label: '咀嚼肌力正常', default: true, text: '双侧咀嚼肌肌力对称，无萎缩' },
        { id: 'n4', label: '无面瘫', default: true, text: '双侧额纹对称，鼻唇沟对称，无周围性面瘫' }
      ];
    } else if (name.includes('椎管内肿瘤')) {
      peConfig.positiveSigns = [
        { id: 'p1', label: '神经根性疼痛', default: true, text: '特定皮节区放射性剧痛，咳嗽、打喷嚏时加重' },
        { id: 'p2', label: '感觉减退', default: true, text: '病变平面以下痛、温、触觉及深感觉减退或消失' },
        { id: 'p3', label: '肌张力异常', default: true, text: '病灶同侧或双侧下肢肌力减退，上运动神经元损害肌张力增高' },
        { id: 'p4', label: '病理反射阳性', default: true, text: '双下肢腱反射亢进，Babinski征阳性' }
      ];
      peConfig.negativeSigns = [
        { id: 'n1', label: '颅神经正常', default: true, text: '十二对脑神经检查未见异常' },
        { id: 'n2', label: '皮层功能正常', default: true, text: '神志清楚，语言、计算、记忆功能无异常' },
        { id: 'n3', label: '脑膜刺激征（-）', default: true, text: '颈项无强直，克氏征、布氏征均阴性' },
        { id: 'n4', label: '无脊柱畸形', default: true, text: '脊柱生理弯曲存在，无明显侧弯及后凸畸形' }
      ];
    } else if (name === '脑震荡') {
      peConfig.positiveSigns = [
        { id: 'p1', label: '逆行性遗忘', default: true, text: '对受伤当时及伤前近期情况不能回忆' },
        { id: 'p2', label: '意识丧失病史', default: true, text: '伤后有短暂昏迷史，通常不超过30分钟' },
        { id: 'p3', label: '自主神经症状', default: true, text: '伴有轻度恶心、呕吐、面色苍白' }
      ];
      peConfig.negativeSigns = [
        { id: 'n1', label: '神经查体（-）', default: true, text: '颅神经未见异常，四肢肌力V级，无感觉减退' },
        { id: 'n2', label: '病理征（-）', default: true, text: '双侧病理征阴性' },
        { id: 'n3', label: '脑膜刺激征（-）', default: true, text: '颈项无强直' },
        { id: 'n4', label: '生命体征平稳', default: true, text: '心率、血压、呼吸节律均正常' }
      ];
    } else if (name === '脑积水') {
      peConfig.positiveSigns = [
        { id: 'p1', label: '共济失调步态', default: true, text: '行走缓慢，步距变宽，呈特征性共济失调步态' },
        { id: 'p2', label: '认知功能减退', default: true, text: '反应迟钝，记忆力下降' },
        { id: 'p3', label: '括约肌功能障碍', default: true, text: '可见尿急、尿频或尿失禁' }
      ];
      peConfig.negativeSigns = [
        { id: 'n1', label: '无肢体偏瘫', default: true, text: '四肢肌力大致正常，无局灶性偏瘫' },
        { id: 'n2', label: '脑膜刺激征（-）', default: true, text: '颈项软，无强直' },
        { id: 'n3', label: '无视野缺损', default: true, text: '粗测视野正常，无偏盲' },
        { id: 'n4', label: '无颅内杂音', default: true, text: '颅部未闻及明显血管杂音' }
      ];
    }
    
    peConfig.specialistRaw = (d.t && d.t.specialistExam) || '详细专科查体已提炼。';
    
    if(d.t) d.t.peConfig = peConfig;
    d.peConfig = peConfig;
  }
  
  if (thoracics.includes(name)) {
    thoracicCount++;
    if (d.t && d.t.physicalExam) {
      d.t.physicalExam = '发育正常，营养良好，神志清晰，查体合作。皮肤粘膜正常，浅表淋巴结无肿大。头颅外观无畸形，双眼睑无水肿，结膜无充血，巩膜无黄染。颈软，甲状腺无肿大，颈静脉无怒张。胸肺部阳性体征详见专科检查。心前区无隆起，心界不大，心率齐，各瓣膜听诊区未闻及病理性杂音。腹部平坦，腹软，无压痛及反跳痛。神经系统正常，生理反射存在，病理反射未引出。四肢脊柱无畸形，活动自如。';
    }
    
    let peConfig = (d.t && d.t.peConfig) || d.peConfig || {};
    peConfig.diseaseName = name;
    
    if (name === '自发性气胸' || name === '气胸') {
      peConfig.positiveSigns = [
        { id: 'p1', label: '气管移位', default: true, text: '气管向健侧移位' },
        { id: 'p2', label: '呼吸音减弱', default: true, text: '患侧语颤减弱，呼吸音明显减弱或消失' },
        { id: 'p3', label: '叩诊鼓音', default: true, text: '患侧胸部叩诊呈鼓音' }
      ];
      peConfig.negativeSigns = [
        { id: 'n1', label: '无皮下气肿', default: true, text: '胸壁、颈部未触及皮下捻发感' },
        { id: 'n2', label: '无反常呼吸', default: true, text: '胸廓无反常呼吸运动' },
        { id: 'n3', label: '无胸部外伤', default: true, text: '胸壁无淤斑、无擦伤及伤口' },
        { id: 'n4', label: '心音正常', default: true, text: '心音有力，无明显遥远感' }
      ];
    } else if (name === '肺癌') {
      peConfig.positiveSigns = [
        { id: 'p1', label: '局限性哮鸣音', default: true, text: '患侧局部可闻及固定性哮鸣音' },
        { id: 'p2', label: '呼吸音减弱', default: true, text: '患侧局部呼吸音减低，叩诊可呈浊音' },
        { id: 'p3', label: '锁骨上淋巴结', default: true, text: '锁骨上可触及肿大淋巴结，质硬固定' }
      ];
      peConfig.negativeSigns = [
        { id: 'n1', label: '无胸壁压痛', default: true, text: '胸廓挤压痛阴性，局部无明显压痛' },
        { id: 'n2', label: '无皮下气肿', default: true, text: '胸壁未触及皮下气肿' },
        { id: 'n3', label: '无杵状指', default: true, text: '四肢末端无明显杵状指（趾）' },
        { id: 'n4', label: '无上腔静脉征', default: true, text: '颜面、颈部及上肢无水肿，颈静脉无明显怒张' }
      ];
    } else if (name.includes('肋骨骨折合并血气胸')) {
      peConfig.positiveSigns = [
        { id: 'p1', label: '胸壁骨擦感', default: true, text: '患侧胸壁局部压痛明显，可触及骨擦感' },
        { id: 'p2', label: '气管移位', default: true, text: '气管向健侧移位' },
        { id: 'p3', label: '叩诊浊鼓音', default: true, text: '患侧胸部叩诊上部呈鼓音，下部呈浊音' },
        { id: 'p4', label: '皮下气肿', default: true, text: '患侧胸壁可触及皮下气肿，有捻发感' }
      ];
      peConfig.negativeSigns = [
        { id: 'n1', label: '无反常呼吸', default: true, text: '胸廓未见连枷胸所致的反常呼吸运动' },
        { id: 'n2', label: '无心包填塞', default: true, text: '心音无遥远，颈静脉无明显怒张' },
        { id: 'n3', label: '腹膜刺激征（-）', default: true, text: '腹部无压痛及反跳痛' },
        { id: 'n4', label: '无骨盆挤压痛', default: true, text: '骨盆挤压分离试验阴性' }
      ];
    } else if (name === '漏斗胸') {
      peConfig.positiveSigns = [
        { id: 'p1', label: '胸骨凹陷', default: true, text: '胸骨中下段向后凹陷，呈漏斗状畸形' },
        { id: 'p2', label: '心脏轻度杂音', default: true, text: '受胸骨压迫，心前区可闻及轻度收缩期杂音' },
        { id: 'p3', label: '呼吸受限', default: true, text: '深呼吸时胸廓扩张度轻度受限' }
      ];
      peConfig.negativeSigns = [
        { id: 'n1', label: '无反常呼吸', default: true, text: '无胸壁软化及反常呼吸' },
        { id: 'n2', label: '无干湿性啰音', default: true, text: '双肺未闻及明显干湿性啰音' },
        { id: 'n3', label: '无发绀', default: true, text: '口唇无紫绀，指端无发绀' },
        { id: 'n4', label: '无脊柱明显畸形', default: true, text: '脊柱无明显侧弯及后凸畸形' }
      ];
    } else if (name === '食管癌') {
      peConfig.positiveSigns = [
        { id: 'p1', label: '锁骨上淋巴结', default: true, text: '可触及左侧锁骨上窝肿大淋巴结' },
        { id: 'p2', label: '恶病质征象', default: true, text: '查体可见明显消瘦，皮下脂肪减少' },
        { id: 'p3', label: '贫血貌', default: true, text: '睑结膜、口唇稍苍白' }
      ];
      peConfig.negativeSigns = [
        { id: 'n1', label: '腹部无包块', default: true, text: '腹平软，未触及明显腹部包块' },
        { id: 'n2', label: '无腹水征', default: true, text: '移动性浊音阴性' },
        { id: 'n3', label: '无胸腔积液', default: true, text: '双肺呼吸音清，无叩诊浊音' },
        { id: 'n4', label: '无发绀', default: true, text: '口唇无发绀' },
        { id: 'n5', label: '无声音嘶哑', default: true, text: '发音清晰，无明显喉返神经受损表现' }
      ];
    } else if (name === '胸主动脉瘤') {
      peConfig.positiveSigns = [
        { id: 'p1', label: '局部异常搏动', default: true, text: '胸骨左缘或右缘偶可见局部异常搏动' },
        { id: 'p2', label: '血管杂音', default: true, text: '相应部位听诊可闻及收缩期血管杂音' },
        { id: 'p3', label: '上腔静脉征', default: true, text: '可有颈静脉怒张、颜面水肿' }
      ];
      peConfig.negativeSigns = [
        { id: 'n1', label: '无心包填塞', default: true, text: '心音有力，无奇脉' },
        { id: 'n2', label: '血压对称', default: true, text: '双侧桡动脉搏动对称，双上肢血压无明显差异' },
        { id: 'n3', label: '无胸壁外伤', default: true, text: '胸壁完整，无外伤及皮下瘀斑' },
        { id: 'n4', label: '肺部呼吸音清', default: true, text: '双肺呼吸音清晰，未闻及干湿性啰音' }
      ];
    } else if (name.includes('纵隔肿瘤')) {
      peConfig.positiveSigns = [
        { id: 'p1', label: '肌无力征象', default: true, text: '合并胸腺瘤者可有上睑下垂、四肢乏力' },
        { id: 'p2', label: '上腔静脉征', default: true, text: '颈静脉怒张，面颈部及上胸壁浅静脉迂曲扩张' },
        { id: 'p3', label: '气管移位', default: true, text: '巨大肿瘤可致气管受压偏移' }
      ];
      peConfig.negativeSigns = [
        { id: 'n1', label: '无胸廓畸形', default: true, text: '胸廓外形正常' },
        { id: 'n2', label: '无干湿性啰音', default: true, text: '双肺呼吸音清，未闻及啰音' },
        { id: 'n3', label: '无杵状指', default: true, text: '四肢末端无明显杵状指' },
        { id: 'n4', label: '无局部压痛', default: true, text: '胸骨及胸壁无明显局限性压痛' }
      ];
    } else if (name === '肺大疱') {
      peConfig.positiveSigns = [
        { id: 'p1', label: '呼吸音减低', default: true, text: '巨大肺大疱区域呼吸音明显减低或消失' },
        { id: 'p2', label: '叩诊过清音', default: true, text: '患侧局部胸部叩诊呈过清音或鼓音' },
        { id: 'p3', label: '胸廓饱满', default: true, text: '患侧胸廓轻度饱满，肋间隙增宽' }
      ];
      peConfig.negativeSigns = [
        { id: 'n1', label: '无气管移位', default: true, text: '气管居中，无明显偏移' },
        { id: 'n2', label: '无皮下气肿', default: true, text: '颈胸部未触及皮下气肿及捻发感' },
        { id: 'n3', label: '无反常呼吸', default: true, text: '胸廓运动对称，无反常呼吸' },
        { id: 'n4', label: '心脏听诊正常', default: true, text: '心率齐，未闻及病理性杂音' }
      ];
    } else if (name === '肺脓肿') {
      peConfig.positiveSigns = [
        { id: 'p1', label: '叩诊浊音', default: true, text: '病变部位叩诊呈浊音或实音' },
        { id: 'p2', label: '局部湿啰音', default: true, text: '病灶区域可闻及细湿啰音及支气管呼吸音' },
        { id: 'p3', label: '杵状指', default: true, text: '慢性期可见双手指端呈杵状增大' }
      ];
      peConfig.negativeSigns = [
        { id: 'n1', label: '无气管移位', default: true, text: '气管居中，无偏移' },
        { id: 'n2', label: '无皮下气肿', default: true, text: '胸壁未触及捻发感' },
        { id: 'n3', label: '无胸壁红肿', default: true, text: '胸壁局部无红肿热痛' },
        { id: 'n4', label: '无心脏杂音', default: true, text: '各瓣膜区未闻及病理性杂音' }
      ];
    } else if (name === '创伤性膈疝') {
      peConfig.positiveSigns = [
        { id: 'p1', label: '胸部可闻肠鸣音', default: true, text: '患侧胸部听诊可闻及肠鸣音' },
        { id: 'p2', label: '呼吸音消失', default: true, text: '患侧下肺呼吸音减弱或消失' },
        { id: 'p3', label: '胸部叩诊鼓音', default: true, text: '患侧胸部叩诊呈不规则鼓音或浊音' }
      ];
      peConfig.negativeSigns = [
        { id: 'n1', label: '无严重皮下气肿', default: true, text: '胸颈部未及明显皮下捻发感' },
        { id: 'n2', label: '无腹壁开放伤', default: true, text: '腹部无开放性伤口及内脏脱出' },
        { id: 'n3', label: '无脑膜刺激征', default: true, text: '神经系统查体正常' },
        { id: 'n4', label: '无全腹压痛', default: true, text: '腹部平软，无明显全腹弥漫性压痛及反跳痛' }
      ];
    }

    peConfig.specialistRaw = (d.t && d.t.specialistExam) || '详细专科查体已提炼。';
    
    if(d.t) d.t.peConfig = peConfig;
    d.peConfig = peConfig;
  }
});

let updatedArray = JSON.stringify(diseases, null, 2);
let newCode = code.replace(match[2], updatedArray);

fs.writeFileSync(file, newCode, 'utf8');

console.log('Update completed. Modified Neuro:', neuroCount, 'Thoracic:', thoracicCount);
