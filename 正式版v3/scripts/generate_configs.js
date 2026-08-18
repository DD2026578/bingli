const fs = require('fs');

const dataMap = {
  "社区获得性肺炎": {
    positiveSigns: [
      { id: "sign_1", label: "患侧呼吸运动减弱", default: true, text: "患侧胸廓饱满，呼吸运动及呼吸音减弱" },
      { id: "sign_2", label: "语颤增强", default: true, text: "患侧局部语音震颤增强" },
      { id: "sign_3", label: "叩诊浊音", default: true, text: "患侧肺部叩诊呈浊音或实音" },
      { id: "sign_4", label: "管状呼吸音", default: true, text: "听诊可闻及异常支气管呼吸音（管状呼吸音）" },
      { id: "sign_5", label: "湿性啰音", default: true, text: "吸气末可闻及细湿性啰音" }
    ],
    negativeSigns: [
      "颈静脉无怒张",
      "未见杵状指",
      "心浊音界正常",
      "气管居中，无偏移",
      "双下肢无水肿"
    ],
    specialistRaw: "气管居中。患侧胸廓饱满，呼吸运动及呼吸音减弱，局部语音震颤增强。叩诊呈浊音或实音，听诊可闻及管状呼吸音，吸气末可闻及细湿啰音。"
  },
  "急性ST段抬高型心肌梗死": {
    positiveSigns: [
      { id: "sign_1", label: "心率增快", default: true, text: "心率增快，偶可不规则" },
      { id: "sign_2", label: "心音低钝", default: true, text: "第一心音明显减弱，心音低钝" },
      { id: "sign_3", label: "奔马律", default: true, text: "心尖区可闻及舒张期奔马律（S3或S4）" },
      { id: "sign_4", label: "心包摩擦音", default: true, text: "发病数日后部分患者可闻及心包摩擦音" }
    ],
    negativeSigns: [
      "未闻及明显心脏杂音",
      "双肺底未闻及湿啰音（无心衰时）",
      "无明显颈静脉怒张",
      "奇脉阴性"
    ],
    specialistRaw: "心界不大或轻度扩大。心率增快，心尖区第一心音减弱，心音低钝，可闻及舒张期奔马律（第四心音）。各瓣膜区未闻及明显病理性杂音。未闻及心包摩擦音。"
  },
  "急性胰腺炎": {
    positiveSigns: [
      { id: "sign_1", label: "上腹部压痛", default: true, text: "中上腹或偏左侧可见明显深压痛" },
      { id: "sign_2", label: "腹膜刺激征", default: true, text: "伴有不同程度的腹肌紧张和反跳痛" },
      { id: "sign_3", label: "肠鸣音减弱", default: true, text: "肠鸣音明显减弱或消失" },
      { id: "sign_4", label: "Grey-Turner征", default: false, text: "两侧腰部皮肤呈暗灰蓝色（Grey-Turner征）" },
      { id: "sign_5", label: "Cullen征", default: false, text: "脐周皮肤呈青紫色（Cullen征）" }
    ],
    negativeSigns: [
      "Murphy征阴性",
      "麦氏点无压痛",
      "无明显肝浊音界缩小",
      "无黄疸（若无胆道梗阻）"
    ],
    specialistRaw: "腹部稍膨隆，上腹部明显压痛，伴反跳痛及肌紧张，以中左上腹为甚。Murphy征阴性。肝浊音界存在，移动性浊音可疑阳性。肠鸣音弱，1-2次/分。腰胁部及脐周未见明显皮下瘀斑。"
  },
  "2型糖尿病": {
    positiveSigns: [
      { id: "sign_1", label: "体重超重/肥胖", default: true, text: "体型偏胖或腹型肥胖，BMI超标" },
      { id: "sign_2", label: "足背动脉搏动减弱", default: false, text: "双侧足背动脉搏动减弱，提示外周血管病变" },
      { id: "sign_3", label: "跟腱反射减弱", default: false, text: "双下肢膝腱、跟腱反射减弱或消失" },
      { id: "sign_4", label: "黑棘皮征", default: false, text: "颈部、腋窝可见色素沉着呈黑棘皮征" }
    ],
    negativeSigns: [
      "甲状腺无肿大",
      "无典型满月脸、水牛背",
      "肺部查体无异常",
      "腹部无阳性体征",
      "未见明显脱水征"
    ],
    specialistRaw: "形体肥胖（或消瘦），颈部、腋下可见黑棘皮征。双下肢痛温觉、触觉正常/减弱。双足背动脉搏动正常/减弱，未见溃疡或坏疽。双侧膝腱反射、跟腱反射正常/减弱。"
  },
  "急性缺血性脑卒中": {
    positiveSigns: [
      { id: "sign_1", label: "意识障碍", default: false, text: "嗜睡至昏迷不等，格拉斯哥昏迷评分(GCS)下降" },
      { id: "sign_2", label: "脑神经受损体征", default: true, text: "中枢性面瘫、舌瘫，眼球凝视" },
      { id: "sign_3", label: "偏瘫/肢体无力", default: true, text: "一侧肢体肌力减退（0-4级），肌张力早期减低或增高" },
      { id: "sign_4", label: "偏侧感觉障碍", default: true, text: "患侧肢体痛温觉、触觉减弱" },
      { id: "sign_5", label: "病理征阳性", default: true, text: "患侧Babinski征、Chaddock征阳性" }
    ],
    negativeSigns: [
      "脑膜刺激征阴性",
      "无典型去大脑或去皮层强直",
      "双侧瞳孔等大等圆，对光反射存在",
      "心率节律正常，无房颤征象"
    ],
    specialistRaw: "神志清楚（或嗜睡/昏迷），双侧瞳孔等大等圆，对光反射灵敏。左侧/右侧中枢性面舌瘫。左侧/右侧肢体肌力下降（X级），肌张力正常或稍低，偏身感觉减退。患侧Babinski征阳性。脑膜刺激征阴性。"
  },
  "慢性阻塞性肺疾病急性加重": {
    positiveSigns: [
      { id: "sign_1", label: "桶状胸", default: true, text: "胸廓前后径增大，呈桶状胸，肋间隙增宽" },
      { id: "sign_2", label: "语颤减弱", default: true, text: "双侧语颤减弱，呼吸运动减弱" },
      { id: "sign_3", label: "叩诊过清音", default: true, text: "双肺叩诊过清音，心浊音界缩小，肺下界降低" },
      { id: "sign_4", label: "呼气相延长", default: true, text: "听诊呼吸音减弱，呼气相显著延长" },
      { id: "sign_5", label: "干湿啰音", default: true, text: "双肺可闻及干啰音及局限性湿啰音" }
    ],
    negativeSigns: [
      "未见明显颈静脉怒张",
      "无明显端坐呼吸",
      "肝颈静脉回流征阴性",
      "双下肢无明显凹陷性水肿"
    ],
    specialistRaw: "桶状胸，肋间隙增宽。双侧呼吸运动减弱，语颤减弱。双肺叩诊过清音，肺下界降低。听诊双肺呼吸音普遍减弱，呼气相延长，可闻及散在干啰音及肺底湿性啰音。"
  },
  "高血压病（3级 极高危）": {
    positiveSigns: [
      { id: "sign_1", label: "血压显著升高", default: true, text: "非同日多次测量收缩压≥180mmHg和/或舒张压≥110mmHg" },
      { id: "sign_2", label: "主动脉瓣区杂音", default: false, text: "主动脉瓣区第二心音(A2)亢进，偶可闻及收缩期杂音" },
      { id: "sign_3", label: "周围血管搏动强", default: true, text: "脉搏洪大有力，周围血管搏动明显" }
    ],
    negativeSigns: [
      "无满月脸、水牛背、紫纹（除外库欣）",
      "腹部未闻及血管杂音（除外肾血管性高血压）",
      "双下肢血压与上肢对称（除外主动脉缩窄）",
      "甲状腺无肿大及血管杂音"
    ],
    specialistRaw: "血压非同日多次升高，最高达180/110mmHg以上。心界向左下轻度扩大。主动脉瓣区第二心音(A2)亢进。未闻及病理性杂音。双侧颈动脉及腹主动脉未闻及明显血管杂音。"
  },
  "上消化道出血": {
    positiveSigns: [
      { id: "sign_1", label: "贫血貌", default: true, text: "面色苍白，口唇、甲床苍白" },
      { id: "sign_2", label: "脉率增快", default: true, text: "心率增快，脉搏细速（血容量不足表现）" },
      { id: "sign_3", label: "肠鸣音活跃", default: true, text: "腹部听诊肠鸣音活跃，可达6-10次/分" },
      { id: "sign_4", label: "直肠指诊黑便", default: true, text: "直肠指诊指套染黑粪或柏油样便" }
    ],
    negativeSigns: [
      "无蜘蛛痣及肝掌",
      "无黄疸",
      "腹壁无静脉曲张",
      "无明显脾肿大",
      "无明显右下腹或转移性压痛"
    ],
    specialistRaw: "贫血貌，眼结膜苍白。腹平软，上腹部轻压痛，无反跳痛及肌紧张。肝脾肋下未触及。肠鸣音较活跃（6-8次/分）。直肠指检指套染有柏油样黑便。"
  },
  "慢性胃炎": {
    positiveSigns: [
      { id: "sign_1", label: "上腹部轻压痛", default: true, text: "剑突下或上腹部可见轻度深压痛" }
    ],
    negativeSigns: [
      "无腹膜刺激征（无反跳痛及肌紧张）",
      "肝脾肋下未触及",
      "腹部未触及包块",
      "无明显黄疸及贫血貌",
      "肠鸣音正常"
    ],
    specialistRaw: "腹平软，无胃肠型及蠕动波。剑突下至上腹部轻度压痛，无反跳痛及腹肌紧张。肝脾肋下未及。未触及包块。肠鸣音正常，约4次/分。"
  },
  "慢性心力衰竭": {
    positiveSigns: [
      { id: "sign_1", label: "颈静脉怒张", default: true, text: "颈静脉怒张，肝颈静脉回流征阳性" },
      { id: "sign_2", label: "心脏扩大", default: true, text: "心界向左下扩大，心尖搏动弥散" },
      { id: "sign_3", label: "肺部湿啰音", default: true, text: "双肺底可闻及对称性细湿啰音" },
      { id: "sign_4", label: "心包及下肢水肿", default: true, text: "双下肢及双侧足背可见凹陷性水肿" },
      { id: "sign_5", label: "肝脏肿大", default: true, text: "右肋下可触及肿大的肝脏，有压痛" }
    ],
    negativeSigns: [
      "无奇脉",
      "心前区无震颤",
      "无单侧不对称下肢水肿",
      "神经系统查体无局灶性体征"
    ],
    specialistRaw: "颈静脉怒张，肝颈静脉回流征阳性。双肺底可闻及对称性湿啰音。心界向左下扩大，心尖部可闻及舒张期奔马律（S3）。肝脏肋下可及，轻度触痛。双下肢对称性凹陷性水肿。"
  },
  "心房颤动": {
    positiveSigns: [
      { id: "sign_1", label: "心律绝对不齐", default: true, text: "听诊心律绝对不规则，无明显节律" },
      { id: "sign_2", label: "第一心音强弱不等", default: true, text: "听诊心尖部第一心音(S1)强弱不等" },
      { id: "sign_3", label: "脉搏短绌", default: true, text: "同时测量心率及脉率，脉率小于心率" }
    ],
    negativeSigns: [
      "无明显心脏扩大杂音（除外风心病所致）",
      "无突眼、手颤（除外甲亢所致）",
      "双肺无湿性啰音（除外合并心衰）",
      "神经查体阴性（无栓塞表现）"
    ],
    specialistRaw: "神清。双侧颈静脉无怒张。心界大致正常。心率快慢不一（如110次/分），心律绝对不齐，第一心音强弱不等。同时触诊桡动脉示脉率小于心率（脉搏短绌）。未闻及病理性杂音。"
  },
  "不稳定型心绞痛": {
    positiveSigns: [
      { id: "sign_1", label: "发作时心率增快", default: true, text: "疼痛发作时常伴有心率增快、血压轻度升高" },
      { id: "sign_2", label: "发作时S4或S3", default: false, text: "缺血发作时可闻及第四心音或第三心音" }
    ],
    negativeSigns: [
      "非发作期心脏体征常阴性",
      "无心包摩擦音",
      "无明显颈静脉怒张或外周水肿",
      "无周围血管搏动异常"
    ],
    specialistRaw: "一般情况可。心前区无隆起，心尖搏动正常。心界不大。心率齐整，各瓣膜区未闻及确切病理性杂音。双肺呼吸音清。无双下肢浮肿。"
  },
  "支气管哮喘": {
    positiveSigns: [
      { id: "sign_1", label: "呼气相延长", default: true, text: "双肺呼吸音减低，呼气相明显延长" },
      { id: "sign_2", label: "广泛哮鸣音", default: true, text: "双肺弥漫性呼气相为主的哮鸣音，带高调音" },
      { id: "sign_3", label: "三凹征", default: false, text: "严重时出现胸骨上窝、锁骨上窝及肋间隙凹陷" }
    ],
    negativeSigns: [
      "无局限性湿性啰音（不合并感染时）",
      "无杵状指",
      "无明显心界扩大",
      "无单侧呼吸音减低（除外气胸）"
    ],
    specialistRaw: "呼吸急促，双肺叩诊呈清音或过清音，听诊双肺呼气相明显延长，可闻及广泛呼气相为主的哮鸣音。未闻及明显湿啰音。心界不大，心率偏快，无杂音。"
  },
  "支气管扩张症": {
    positiveSigns: [
      { id: "sign_1", label: "固定湿啰音", default: true, text: "病变部位（常为下肺）可闻及固定而持久的粗湿啰音" },
      { id: "sign_2", label: "杵状指（趾）", default: true, text: "慢性缺氧伴感染者可见指（趾）端膨大呈杵状" }
    ],
    negativeSigns: [
      "无单侧语颤消失",
      "心界无明显扩大",
      "无广泛呼气相哮鸣音",
      "颈部无淋巴结肿大"
    ],
    specialistRaw: "口唇无发绀。部分可见杵状指（趾）。双侧胸廓对称，下肺（或局限性部位）可闻及固定而持久的粗湿性啰音，咳嗽或体位改变后罗音可有改变。心前区未见异常。"
  },
  "慢性肺源性心脏病": {
    positiveSigns: [
      { id: "sign_1", label: "肺动脉瓣区P2亢进", default: true, text: "肺动脉高压体征：肺动脉瓣区第二心音(P2)亢进" },
      { id: "sign_2", label: "右心扩大体征", default: true, text: "剑突下可见明显心脏搏动，提示右心室肥大" },
      { id: "sign_3", label: "体循环淤血体征", default: true, text: "颈静脉怒张，肝大伴压痛，下肢凹陷性水肿" },
      { id: "sign_4", label: "发绀", default: true, text: "口唇、甲床发绀，提示明显缺氧" }
    ],
    negativeSigns: [
      "左心无明显扩大表现",
      "无特征性瓣膜狭窄或关闭不全杂音",
      "无明显胸腔积液大量压迫体征",
      "无高血压性眼底改变"
    ],
    specialistRaw: "口唇及甲床发绀。颈静脉充盈或怒张。桶状胸。双肺底可闻及细湿啰音。剑突下可见心脏搏动，肺动脉瓣区第二心音亢进。肝颈静脉回流征阳性，双下肢凹陷性水肿。"
  },
  "肝硬化失代偿期": {
    positiveSigns: [
      { id: "sign_1", label: "肝病面容", default: true, text: "面色灰暗黝黑，缺乏光泽" },
      { id: "sign_2", label: "蜘蛛痣及肝掌", default: true, text: "面颈胸部可见蜘蛛痣，手掌大鱼际小鱼际发红" },
      { id: "sign_3", label: "黄疸", default: true, text: "巩膜及皮肤黄染" },
      { id: "sign_4", label: "腹壁静脉曲张", default: true, text: "腹壁可见明显静脉曲张，呈海蛇神头样" },
      { id: "sign_5", label: "移动性浊音阳性", default: true, text: "腹部叩诊移动性浊音阳性，提示大量腹水" },
      { id: "sign_6", label: "脾肿大", default: true, text: "左肋下可触及肿大的脾脏" }
    ],
    negativeSigns: [
      "无明显上腹部板状腹",
      "神经系统生理反射正常（除外肝性脑病）",
      "无肝区叩痛（或轻微）",
      "无扑翼样震颤（若无肝性脑病）"
    ],
    specialistRaw: "肝病面容，可见蜘蛛痣及肝掌，巩膜黄染。腹膨隆，可见腹壁静脉曲张，腹部无明显压痛反跳痛。肝脏肋下未及，脾脏肿大。移动性浊音阳性，双下肢凹陷性水肿。"
  },
  "溃疡性结肠炎": {
    positiveSigns: [
      { id: "sign_1", label: "左下腹压痛", default: true, text: "左下腹或全腹可见压痛，伴肠鸣音活跃" }
    ],
    negativeSigns: [
      "无右下腹包块或压痛（常与克罗恩病鉴别）",
      "无明显反跳痛及肌紧张",
      "肛周常无瘘管或裂",
      "无肝脾肿大"
    ],
    specialistRaw: "神清貌可。腹部平软，左下腹（或沿结肠走行区）轻中度深压痛，无明显反跳痛及肌紧张。未触及包块。肠鸣音偏活跃。肛周未见明显脓肿、瘘管。"
  },
  "胃食管反流病": {
    positiveSigns: [
      { id: "sign_1", label: "剑突下压痛", default: false, text: "偶有剑突下轻度深压痛" }
    ],
    negativeSigns: [
      "心肺查体无异常（排除心绞痛）",
      "腹部无明显固定压痛反跳痛",
      "未触及腹部包块",
      "无黄疸",
      "无咽喉部明显阳性体征"
    ],
    specialistRaw: "一般情况良好，巩膜无黄染。心肺听诊未见异常。腹平软，剑突下偶有轻微压痛，无反跳痛。肝脾肋下未触及。未触及包块，肠鸣音正常。"
  },
  "慢性肾脏病5期": {
    positiveSigns: [
      { id: "sign_1", label: "尿毒症面容", default: true, text: "面色萎黄、苍白，伴色素沉着" },
      { id: "sign_2", label: "水肿", default: true, text: "颜面部及双下肢明显凹陷性水肿" },
      { id: "sign_3", label: "高血压", default: true, text: "常伴血压显著升高" },
      { id: "sign_4", label: "呼气有尿味", default: false, text: "口腔呼气可有氨味" }
    ],
    negativeSigns: [
      "无发绀",
      "无心包摩擦音（除非合并尿毒症性心包炎）",
      "肺部无明显干啰音",
      "无神经系统局灶性体征"
    ],
    specialistRaw: "尿毒症面容，结膜苍白。呼气有氨味。血压增高。心界可向左下扩大，未闻及心包摩擦音。腹平软，肾区无明显叩痛。双下肢及颜面部中至重度凹陷性水肿。"
  },
  "急性肾损伤": {
    positiveSigns: [
      { id: "sign_1", label: "水肿", default: true, text: "少尿期出现双下肢、眼睑等处水肿" }
    ],
    negativeSigns: [
      "无慢性贫血及严重长期骨病体征",
      "肾区常无明显叩击痛（除非感染或梗阻）",
      "无皮疹及关节畸形",
      "无眼底严重高血压病变"
    ],
    specialistRaw: "神清。血压轻中度升高。双侧眼睑及颜面部轻度水肿。心肺无特殊。腹软，双肾区叩击痛阴性或可疑弱阳性。双下肢轻度凹陷性水肿。"
  },
  "原发性肾病综合征": {
    positiveSigns: [
      { id: "sign_1", label: "重度水肿", default: true, text: "全身重度可凹陷性水肿，常见于下肢及阴囊，重者伴胸腹水" }
    ],
    negativeSigns: [
      "无明显高血压或仅轻度",
      "无皮疹或光过敏（排除狼疮）",
      "无紫癜（排除紫癜性肾炎）",
      "无明显贫血"
    ],
    specialistRaw: "明显水肿，以颜面及双下肢为重，呈凹陷性。部分可见腹壁水肿。心肺听诊因可合并胸腹水而呼吸音低、移动性浊音可疑阳性。无皮疹、无紫癜及光过敏。"
  },
  "2型糖尿病伴酮症酸中毒": {
    positiveSigns: [
      { id: "sign_1", label: "烂苹果味", default: true, text: "呼气有特殊酮味（烂苹果味）" },
      { id: "sign_2", label: "脱水征", default: true, text: "皮肤干燥弹性差，眼球下陷，心率增快，血压偏低" },
      { id: "sign_3", label: "Kussmaul呼吸", default: true, text: "呼吸深大（Kussmaul呼吸）" },
      { id: "sign_4", label: "神志改变", default: true, text: "不同程度的意识障碍，如嗜睡、昏迷" }
    ],
    negativeSigns: [
      "无神经系统定位体征",
      "无脑膜刺激征",
      "无多汗、手抖",
      "无黄疸"
    ],
    specialistRaw: "神志模糊或嗜睡，呼吸深大（Kussmaul呼吸），呼气中可闻及烂苹果味。明显脱水貌，皮肤弹性差，眼窝凹陷。双肺呼吸音清晰。心率快，心音低。腹部平软，无反跳痛。"
  },
  "原发性甲状腺功能亢进症": {
    positiveSigns: [
      { id: "sign_1", label: "甲状腺弥漫性肿大", default: true, text: "甲状腺弥漫性、对称性肿大，质软，可有震颤及血管杂音" },
      { id: "sign_2", label: "突眼", default: true, text: "双眼裂增宽，瞬目减少，有不同程度突眼征" },
      { id: "sign_3", label: "心率增快", default: true, text: "静息心率常>100次/分，脉压差增大" },
      { id: "sign_4", label: "手细颤", default: true, text: "双手平举可见细微震颤（震颤阳性）" }
    ],
    negativeSigns: [
      "无明显胫前粘液性水肿（常见于严重者）",
      "无淋巴结肿大",
      "腹部无异常",
      "心律齐无杂音（若未合并甲亢心）"
    ],
    specialistRaw: "消瘦，可见轻中度突眼，双眼裂增宽，瞬目减少。甲状腺Ⅱ度弥漫性肿大，质软，无结节，可触及震颤，闻及血管杂音。心率增快，心尖区可闻及收缩期杂音。双手平伸可见细微震颤。"
  },
  "痛风性关节炎": {
    positiveSigns: [
      { id: "sign_1", label: "关节红肿热痛", default: true, text: "受累关节（多为第一跖趾关节）局部明显红肿、皮温升高、剧痛" },
      { id: "sign_2", label: "痛风石", default: false, text: "耳廓或关节周围可触及黄白色痛风石结节" },
      { id: "sign_3", label: "活动受限", default: true, text: "急性期关节活动因疼痛严重受限" }
    ],
    negativeSigns: [
      "无关节对称性多发畸形（非晚期）",
      "无皮下结节或晨僵（与类风湿鉴别）",
      "无蝶形红斑",
      "无大关节游走性疼痛"
    ],
    specialistRaw: "第一跖趾关节（或单侧踝/膝关节）局部皮肤发红，皮温升高，明显肿胀及触痛，关节活动受限。耳廓等处可疑可见痛风石。其余关节未见明显红肿、变形。"
  },
  "类风湿关节炎": {
    positiveSigns: [
      { id: "sign_1", label: "多发对称性关节肿痛", default: true, text: "双手近端指间关节、掌指关节及腕关节对称性肿胀压痛" },
      { id: "sign_2", label: "类风湿结节", default: false, text: "关节伸侧或受压部位皮下可触及类风湿结节" },
      { id: "sign_3", label: "关节畸形", default: true, text: "晚期可有尺侧偏斜、天鹅颈畸形或纽扣花畸形" }
    ],
    negativeSigns: [
      "远端指间关节极少受累（与骨关节炎鉴别）",
      "无面部蝶形红斑",
      "无脊柱竹节样改变特征性受限",
      "无关节剧烈红热急发痛风特征"
    ],
    specialistRaw: "双手近端指间关节(PIP)、掌指关节(MCP)及腕关节对称性肿胀，伴压痛，部分呈梭形肿胀。可触及轻度皮下结节。晚期可见部分关节半脱位及尺侧偏斜畸形。"
  },
  "系统性红斑狼疮": {
    positiveSigns: [
      { id: "sign_1", label: "蝶形红斑", default: true, text: "面颊及鼻梁部可见蝶形分布的红斑" },
      { id: "sign_2", label: "盘状红斑及脱发", default: false, text: "可见盘状红斑、口腔溃疡或明显脱发" },
      { id: "sign_3", label: "关节压痛", default: false, text: "多发性非侵蚀性关节痛及压痛" }
    ],
    negativeSigns: [
      "无严重关节畸形",
      "无剧烈关节红肿",
      "无痛风石",
      "脊柱活动无严重受限"
    ],
    specialistRaw: "面颊部及鼻梁部可见红斑，部分呈蝶形分布。可见光过敏改变及少许口腔溃疡。双手部分关节轻度肿痛，无明显畸形。双下肢无或轻度凹陷性水肿。"
  },
  "脑出血": {
    positiveSigns: [
      { id: "sign_1", label: "意识障碍", default: true, text: "急性神志改变，嗜睡至深度昏迷，GCS评分显著下降" },
      { id: "sign_2", label: "中枢性面舌瘫", default: true, text: "对侧颜面下部及舌肌瘫痪" },
      { id: "sign_3", label: "偏瘫/偏身感觉障碍", default: true, text: "对侧肢体软瘫或痉挛性瘫痪" },
      { id: "sign_4", label: "病理征阳性", default: true, text: "患侧Babinski征阳性" },
      { id: "sign_5", label: "脑膜刺激征", default: false, text: "如有破入脑室或蛛网膜下腔，可有颈抵抗或克氏征阳性" }
    ],
    negativeSigns: [
      "心律多整齐",
      "无感染中毒性休克表现",
      "无肝掌蜘蛛痣",
      "常无低血糖昏迷史"
    ],
    specialistRaw: "神志嗜睡/昏迷。双侧瞳孔等大或不等大，对光反射迟钝。对侧鼻唇沟变浅，口角偏斜。对侧上、下肢肌力0-3级，肌张力可减低或增高。对侧痛觉减退。偏瘫侧病理征阳性。脑膜刺激征可阳性/阴性。"
  },
  "癫痫发作": {
    positiveSigns: [
      { id: "sign_1", label: "抽搐发作期体征", default: true, text: "双眼上翻，牙关紧闭，口吐白沫，四肢强直阵挛" },
      { id: "sign_2", label: "发作后体征", default: true, text: "发作后表现为意识朦胧或嗜睡状态，病理征可短暂阳性" }
    ],
    negativeSigns: [
      "发作间期常无局灶性神经系统体征",
      "无明显颈项强直",
      "心血管系统无异常",
      "无严重水电解质紊乱体征"
    ],
    specialistRaw: "（发作间期或发作后恢复期）神志清楚，对答切题。双侧瞳孔等大等圆，对光反射灵敏。四肢肌力5级，肌张力正常。未引出病理征。脑膜刺激征阴性。唇舌可见咬伤痕迹（部分）。"
  },
  "扩张型心肌病": {
    positiveSigns: [
      { id: "sign_1", label: "心脏普大", default: true, text: "心尖搏动向左下移位，心界向两侧扩大" },
      { id: "sign_2", label: "第三心音及杂音", default: true, text: "可闻及S3奔马律及二尖瓣相对关闭不全的收缩期杂音" },
      { id: "sign_3", label: "心力衰竭体征", default: true, text: "颈静脉怒张，肺底湿啰音，肝大，下肢水肿" }
    ],
    negativeSigns: [
      "无主动脉瓣区特征性粗糙杂音",
      "无心包摩擦音",
      "无杵状指",
      "无高血压重度眼底改变"
    ],
    specialistRaw: "颈静脉可见充盈/怒张。心界向左下显著扩大。心率较快，心尖区可闻及舒张期奔马律及2/6级收缩期吹风样杂音。双肺底可闻及少许细湿啰音。肝颈静脉回流征阳性，双下肢轻中度水肿。"
  },
  "急性肺栓塞": {
    positiveSigns: [
      { id: "sign_1", label: "呼吸急促发绀", default: true, text: "呼吸频率明显增快，口唇发绀" },
      { id: "sign_2", label: "右心负荷加重", default: true, text: "肺动脉瓣区第二心音(P2)亢进及分裂" },
      { id: "sign_3", label: "下肢深静脉血栓体征", default: false, text: "单侧下肢肿胀、疼痛，Homans征阳性" }
    ],
    negativeSigns: [
      "双肺常无明显大片湿性啰音（除非合并心衰或肺梗死）",
      "心尖区无明显病理性杂音",
      "无脑膜刺激征",
      "无异常病理反射"
    ],
    specialistRaw: "呼吸急促，口唇轻度发绀。颈静脉轻度充盈。双肺呼吸音粗，未闻及明显干湿啰音。心率偏快，肺动脉瓣区第二心音(P2)亢进。一侧下肢可能可见肿胀，腓肠肌挤压痛（可疑）。"
  },
  "结核性胸膜炎": {
    positiveSigns: [
      { id: "sign_1", label: "胸腔积液体征", default: true, text: "患侧胸廓饱满，呼吸运动减弱，气管向健侧移位" },
      { id: "sign_2", label: "叩诊实音", default: true, text: "患侧肺部叩诊呈实音" },
      { id: "sign_3", label: "语颤及呼吸音减弱", default: true, text: "患侧语颤及呼吸音明显减弱或消失" }
    ],
    negativeSigns: [
      "心界无扩大（若未受压）",
      "无明显全心衰竭体征",
      "无双下肢凹陷性水肿",
      "无关节畸形"
    ],
    specialistRaw: "气管偏向健侧，患侧胸廓饱满，呼吸动度减弱，语颤显著减弱。叩诊呈浊音或实音。听诊患侧呼吸音明显减弱或消失，上方可闻及支气管呼吸音。未闻及明显胸膜摩擦音。"
  },
  "间质性肺疾病": {
    positiveSigns: [
      { id: "sign_1", label: "Velcro啰音", default: true, text: "双肺底吸气末可闻及爆裂音（Velcro啰音）" },
      { id: "sign_2", label: "杵状指", default: true, text: "部分患者可见杵状指（趾）" },
      { id: "sign_3", label: "发绀及浅快呼吸", default: true, text: "静息或活动后发绀，呼吸频率浅快" }
    ],
    negativeSigns: [
      "无明显局部浊音或实变",
      "无广泛呼气相哮鸣音",
      "心界无明显扩大",
      "无双侧大量胸腔积液体征"
    ],
    specialistRaw: "呼吸偏浅快，可见明显杵状指（趾），口唇轻度发绀。双侧胸廓对称，未见明显胸廓畸形。双下肺叩诊清音。听诊双肺下野吸气末可闻及特征性爆裂音（Velcro啰音）。心前区未见异常。"
  },
  "阻塞性睡眠呼吸暂停低通气综合征": {
    positiveSigns: [
      { id: "sign_1", label: "肥胖短颈", default: true, text: "体型肥胖，颈围粗短" },
      { id: "sign_2", label: "口咽部狭窄", default: true, text: "咽腔狭窄，扁桃体肿大，软腭下垂，悬雍垂粗长" }
    ],
    negativeSigns: [
      "无典型肺部固定啰音",
      "心脏听诊常无杂音",
      "无甲状腺明显肿大",
      "无肢体瘫痪"
    ],
    specialistRaw: "体型肥胖，颈围较粗。口咽腔查体可见软腭下垂、悬雍垂粗长，扁桃体Ⅰ-Ⅱ度肿大，咽后壁组织肥厚，气道狭窄。双肺呼吸音清，心界不大，双下肢无明显水肿。"
  },
  "消化性溃疡伴出血": {
    positiveSigns: [
      { id: "sign_1", label: "上腹部压痛", default: true, text: "中上腹或剑突下偏右/左有局限性压痛" },
      { id: "sign_2", label: "贫血征象及黑便", default: true, text: "眼结膜苍白，直肠指诊黑便" }
    ],
    negativeSigns: [
      "无腹膜刺激征（未穿孔时）",
      "无肝脾肿大及黄疸",
      "无蜘蛛痣",
      "无典型右下腹固定压痛"
    ],
    specialistRaw: "一般情况可，口唇及甲床苍白。腹平，未见胃肠型，剑突下至上腹部偏中轻压痛，无反跳痛及肌紧张。肝脾未触及。肠鸣音较活跃。直肠指诊可及指套染黑便。"
  },
  "非酒精性脂肪性肝病": {
    positiveSigns: [
      { id: "sign_1", label: "肝脏轻度肿大", default: false, text: "部分患者肝脏轻度肿大，质地较软或中等" },
      { id: "sign_2", label: "肥胖", default: true, text: "多数有超重或中心性肥胖" }
    ],
    negativeSigns: [
      "无明显黄疸",
      "无蜘蛛痣、肝掌（未到肝硬化阶段）",
      "无腹水及腹壁静脉曲张",
      "无扑翼样震颤"
    ],
    specialistRaw: "形体偏胖，腹围增大。皮肤巩膜无黄染，未见蜘蛛痣及肝掌。腹部平软，无压痛反跳痛。肝脏肋缘下可疑触及，边缘钝，质偏软无压痛，脾未触及。移动性浊音阴性。"
  },
  "克罗恩病": {
    positiveSigns: [
      { id: "sign_1", label: "右下腹包块及压痛", default: true, text: "右下腹或脐周压痛，可触及不规则腹部包块" },
      { id: "sign_2", label: "肛周病变", default: true, text: "常伴有肛瘘、肛裂及肛周脓肿" },
      { id: "sign_3", label: "全身营养不良", default: true, text: "消瘦、贫血貌，部分有发育迟缓" }
    ],
    negativeSigns: [
      "无大面积左下腹典型压痛（与溃结鉴别）",
      "无进行性明显黄疸",
      "无典型心肺改变",
      "无大量明显腹水"
    ],
    specialistRaw: "营养稍差，轻度贫血貌。腹平，右下腹及脐周可见压痛，无明显反跳痛及肌紧张，可疑触及长条形增厚肠管或包块。肠鸣音正常或略活跃。肛周查体可见肛瘘或皮赘。"
  },
  "慢性肾小球肾炎": {
    positiveSigns: [
      { id: "sign_1", label: "水肿", default: true, text: "眼睑和（或）下肢轻中度水肿" },
      { id: "sign_2", label: "高血压", default: true, text: "中度或重度高血压，有时伴视网膜病变" }
    ],
    negativeSigns: [
      "无尿毒症面容",
      "无明显心脏显著扩大及心衰体征（早期）",
      "无明显皮疹及光过敏",
      "无关节畸形"
    ],
    specialistRaw: "神清。血压升高（例如150/95mmHg）。眼睑轻度浮肿。心界正常或轻度向左扩大。双肺听诊正常。腹平软，双肾区叩击痛阴性。双下肢可见轻中度凹陷性水肿。"
  },
  "强直性脊柱炎": {
    positiveSigns: [
      { id: "sign_1", label: "骶髂关节压痛", default: true, text: "双侧骶髂关节及脊柱深压痛及叩击痛" },
      { id: "sign_2", label: "脊柱活动受限", default: true, text: "腰椎前屈、后伸、侧弯受限，Schober试验阳性" },
      { id: "sign_3", label: "4字试验阳性", default: true, text: "骨盆挤压分离试验及“4”字试验可阳性" }
    ],
    negativeSigns: [
      "无远端小关节对称性肿胀（与类风湿鉴别）",
      "无明显心脏受累体征（多数无）",
      "无皮下结节",
      "无严重肾脏受累水肿"
    ],
    specialistRaw: "脊柱生理弯曲变直，腰椎和/或胸椎棘突深压痛。弯腰受限，Schober试验阳性（<4cm）。双侧骶髂关节压痛及叩痛阳性，“4”字试验阳性。双手指等外周小关节未见明显畸形及压痛。"
  },
  "原发性甲状腺功能减退症": {
    positiveSigns: [
      { id: "sign_1", label: "粘液性水肿", default: true, text: "颜面浮肿，表情淡漠，皮肤干燥粗糙，非凹陷性水肿" },
      { id: "sign_2", label: "心动过缓", default: true, text: "心率缓慢（常<60次/分），心音偏低钝" },
      { id: "sign_3", label: "毛发稀疏", default: true, text: "头发及眉毛稀疏（尤其是眉毛外1/3脱落）" }
    ],
    negativeSigns: [
      "无突眼征",
      "无手抖及细震颤",
      "无心界显著向两侧扩大（除非合并严重心包积液）",
      "无多汗"
    ],
    specialistRaw: "表情淡漠，面色苍白，眼睑及颜面部非凹陷性水肿，皮肤粗糙干燥，毛发及外1/3眉毛稀疏。甲状腺不大（或轻度弥漫肿大）。心率慢，心音稍低钝，腱反射恢复期延缓。"
  },
  "原发性骨质疏松症": {
    positiveSigns: [
      { id: "sign_1", label: "脊柱后凸", default: true, text: "可有驼背畸形，身高缩短" },
      { id: "sign_2", label: "胸腰椎压痛", default: true, text: "胸腰椎棘突及其旁局部轻至中度压痛或叩击痛" }
    ],
    negativeSigns: [
      "无红肿热痛（无急性炎症）",
      "无关节红肿（排除类风湿/痛风）",
      "无神经根受压及病理征",
      "无肝脾淋巴结肿大"
    ],
    specialistRaw: "老年体态。部分可见轻度脊柱后凸畸形，身高变矮。胸背部及腰背部棘突及椎旁有轻压痛和叩击痛，无放射痛。四肢关节活动度尚可。双下肢无浮肿，生理反射正常。"
  },
  "缺铁性贫血": {
    positiveSigns: [
      { id: "sign_1", label: "贫血貌", default: true, text: "皮肤黏膜、口唇、睑结膜及甲床苍白" },
      { id: "sign_2", label: "匙状甲", default: false, text: "严重者可见指甲扁平、失去光泽、呈反甲（匙状甲）" }
    ],
    negativeSigns: [
      "无黄疸（与溶血性贫血鉴别）",
      "无肝脾淋巴结明显肿大",
      "无出血点及紫癜",
      "无骨骼压痛"
    ],
    specialistRaw: "贫血貌，口唇、甲床及眼结膜明显苍白。皮肤粘膜无黄染及出血点。未见典型反甲（或偶见匙状甲）。心界不大，心尖区可闻及2/6级柔和收缩期杂音。肝脾未触及。"
  },
  "免疫性血小板减少症": {
    positiveSigns: [
      { id: "sign_1", label: "皮肤黏膜出血", default: true, text: "全身皮肤散在针尖样出血点、紫癜及瘀斑" },
      { id: "sign_2", label: "黏膜血泡", default: false, text: "口腔黏膜及齿龈可见出血、血泡" }
    ],
    negativeSigns: [
      "无肝脾明显肿大（显著增大不支持ITP）",
      "无浅表淋巴结肿大",
      "无关节肿痛",
      "无明显黄疸"
    ],
    specialistRaw: "四肢及躯干皮肤散在分布细小出血点及紫癜，部分可见大片瘀斑。口腔黏膜及齿龈可见少量渗血或血泡。浅表淋巴结无肿大。胸骨无压痛。肝脾肋下未触及。关节无异常。"
  },
  "短暂性脑缺血发作": {
    positiveSigns: [
      { id: "sign_1", label: "一过性神经局灶体征", default: true, text: "发作时有一过性偏瘫、失语等，发作间期完全恢复正常，查体阴性" }
    ],
    negativeSigns: [
      "无持续性病理征",
      "无持续性偏瘫及感觉障碍",
      "无意识障碍残留",
      "无脑膜刺激征"
    ],
    specialistRaw: "（发作间期）神清，言语清晰。双侧瞳孔等大等圆，对光反射灵敏。双侧鼻唇沟对称，伸舌居中。四肢肌力5级，肌张力正常，生理反射正常存在。未引出病理征。感觉及共济运动检查未见异常。"
  }
};

fs.writeFileSync('../js/data/internal_updates.json', JSON.stringify(dataMap, null, 2));

console.log('Update JSON ready.');
