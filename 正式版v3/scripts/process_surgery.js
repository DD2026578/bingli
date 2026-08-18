const fs = require('fs');

let code = fs.readFileSync('../js/data/surgery.js', 'utf8');

// Find start and end of the array
const startIdx = code.indexOf('const surgeryDiseases = [');
const endIdx = code.indexOf('];\n\n  if (typeof window', startIdx) !== -1 ? code.indexOf('];\n\n  if (typeof window', startIdx) : code.indexOf('];\r\n\r\n  if (typeof window', startIdx) !== -1 ? code.indexOf('];\r\n\r\n  if (typeof window', startIdx) : code.indexOf('];\n  if (typeof window', startIdx) !== -1 ? code.indexOf('];\n  if (typeof window', startIdx) : code.lastIndexOf('];');

if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find start or end index');
    process.exit(1);
}

const prefix = code.substring(0, startIdx + 'const surgeryDiseases = '.length);
const arrayStr = code.substring(startIdx + 'const surgeryDiseases = '.length, endIdx + 1);
const suffix = code.substring(endIdx + 1);

let diseases;
try {
    diseases = eval('(' + arrayStr + ')');
} catch (e) {
    console.error('Eval error', e);
    process.exit(1);
}

const orthoDiseases = [
    "股骨颈骨折", "腰椎压缩性骨折", "桡骨远端骨折", "锁骨骨折", "胫骨骨折", 
    "肱骨骨折", "腰椎间盘突出症", "肱骨髁上骨折（儿童）", "膝关节半月板损伤", 
    "骨关节炎（膝关节）", "急性骨髓炎", "肩关节脱位", "膝关节前交叉韧带损伤", 
    "踝关节骨折", "骨盆骨折", "脊柱骨折（胸腰椎）", "颈椎病（脊髓型）", "骨肉瘤",
    "多处软组织挫伤", "椎管内肿瘤（神经鞘瘤）"
];

const standardPhysicalExam = "发育正常，营养良好，神志清晰，查体合作。皮肤粘膜正常，浅表淋巴结无肿大。头颅外观无畸形，双眼睑无水肿，结膜无充血，巩膜无黄染，双侧瞳孔等大等圆，对光反射灵敏。耳鼻无畸形。颈软，气管居中，甲状腺无肿大，颈静脉无怒张。胸廓无畸形，双肺呼吸音清，未闻及干湿性啰音。心前区无隆起，心界不大，心率齐，各瓣膜听诊区未闻及病理性杂音。腹部平坦，腹壁柔软，全腹无压痛及反跳痛，肝脾肋下未触及，肠鸣音正常，无异常包块。四肢及脊柱阳性体征详见专科检查。生理反射存在，病理反射未引出。";

const configs = {
    "股骨颈骨折": {
        positive: [
            { id: 'p1', label: '患肢缩短', text: '患肢较健侧缩短' },
            { id: 'p2', label: '外旋畸形', text: '患肢呈45°-60°外旋畸形' },
            { id: 'p3', label: '大转子叩击痛', text: '患侧大转子叩击痛（+）' },
            { id: 'p4', label: '腹股沟中点压痛', text: '患侧腹股沟韧带中点下方压痛（+）' }
        ],
        negative: [
            { id: 'n1', label: '无开放性伤口', text: '患处皮肤完整，无开放性伤口' },
            { id: 'n2', label: '骨擦音(-)', text: '局部未触及明显骨擦音或骨擦感' },
            { id: 'n3', label: '足背动脉搏动正常', text: '患侧足背动脉搏动良好' },
            { id: 'n4', label: '足趾感觉正常', text: '足趾末梢感觉正常，活动自如' }
        ]
    },
    "腰椎压缩性骨折": {
        positive: [
            { id: 'p1', label: '病变椎体压痛', text: '病变腰椎棘突明显压痛' },
            { id: 'p2', label: '叩击痛(+)', text: '局部叩击痛阳性' },
            { id: 'p3', label: '活动受限', text: '腰椎活动明显受限' },
            { id: 'p4', label: '后凸畸形', text: '可见轻度后凸畸形' }
        ],
        negative: [
            { id: 'n1', label: '直腿抬高试验(-)', text: '双下肢直腿抬高试验阴性' },
            { id: 'n2', label: '感觉运动正常', text: '双下肢感觉、运动正常' },
            { id: 'n3', label: '肌力正常', text: '双下肢各肌群肌力V级' },
            { id: 'n4', label: '病理征(-)', text: '双侧巴氏征等病理反射阴性' }
        ]
    },
    "桡骨远端骨折": {
        positive: [
            { id: 'p1', label: '腕部肿胀', text: '患侧腕部明显肿胀' },
            { id: 'p2', label: '银叉/枪刺样畸形', text: '腕部可见银叉样（或枪刺样）畸形' },
            { id: 'p3', label: '局部压痛(+)', text: '桡骨远端明显压痛' },
            { id: 'p4', label: '活动受限', text: '腕关节活动明显受限' }
        ],
        negative: [
            { id: 'n1', label: '手指血运正常', text: '手指末梢血运良好，毛细血管反应正常' },
            { id: 'n2', label: '手指感觉正常', text: '指端感觉未见明显减退' },
            { id: 'n3', label: '无开放性伤口', text: '局部皮肤完整，无破溃' },
            { id: 'n4', label: '尺骨茎突无压痛', text: '尺骨茎突可无明显压痛' }
        ]
    },
    "锁骨骨折": {
        positive: [
            { id: 'p1', label: '锁骨区肿胀', text: '患侧锁骨区局部肿胀' },
            { id: 'p2', label: '局部压痛(+)', text: '锁骨中外1/3交界处压痛（+）' },
            { id: 'p3', label: '可及骨擦音', text: '触诊可及骨擦音及骨擦感' },
            { id: 'p4', label: '患肩下垂', text: '患侧肩部下垂，向内、向前倾斜' }
        ],
        negative: [
            { id: 'n1', label: '桡动脉搏动正常', text: '患侧桡动脉搏动有力' },
            { id: 'n2', label: '手指感觉正常', text: '患侧上肢及手指感觉、活动正常' },
            { id: 'n3', label: '无胸部压痛', text: '同侧胸壁无明显压痛' },
            { id: 'n4', label: '无开放伤口', text: '局部皮肤完整无损' }
        ]
    },
    "胫骨骨折": {
        positive: [
            { id: 'p1', label: '小腿肿胀', text: '患侧小腿明显肿胀、疼痛' },
            { id: 'p2', label: '畸形(+)', text: '可见成角或短缩畸形' },
            { id: 'p3', label: '骨擦感', text: '局部可触及骨擦音及异常活动' },
            { id: 'p4', label: '局部压痛(+)', text: '胫骨中下段明显压痛' }
        ],
        negative: [
            { id: 'n1', label: '足背动脉正常', text: '足背动脉、胫后动脉搏动良好' },
            { id: 'n2', label: '足趾活动正常', text: '足趾背伸、跖屈活动正常' },
            { id: 'n3', label: '无骨筋膜室高压', text: '小腿张力不高，无骨筋膜室综合征表现' },
            { id: 'n4', label: '皮肤完好', text: '闭合性骨折，皮肤无破溃' }
        ]
    },
    "肱骨骨折": {
        positive: [
            { id: 'p1', label: '上臂肿胀', text: '患侧上臂明显肿胀、疼痛' },
            { id: 'p2', label: '畸形及异常活动', text: '上臂可见成角畸形，触及异常活动' },
            { id: 'p3', label: '骨擦音', text: '局部触及骨擦音' },
            { id: 'p4', label: '活动受限', text: '肩、肘关节活动受限' }
        ],
        negative: [
            { id: 'n1', label: '垂腕(-)', text: '无垂腕、垂指畸形，桡神经功能正常' },
            { id: 'n2', label: '桡动脉正常', text: '桡动脉搏动良好' },
            { id: 'n3', label: '感觉正常', text: '手部感觉正常' },
            { id: 'n4', label: '无开放伤口', text: '闭合性损伤，局部无开放性伤口' }
        ]
    },
    "腰椎间盘突出症": {
        positive: [
            { id: 'p1', label: '腰椎压痛(+)', text: '病变间隙棘突旁压痛（+）' },
            { id: 'p2', label: '放射痛(+)', text: '压痛向同侧下肢放射' },
            { id: 'p3', label: '直腿抬高试验(+)', text: '患侧直腿抬高试验阳性' },
            { id: 'p4', label: '感觉减退', text: '患侧小腿外侧或足背感觉减退' }
        ],
        negative: [
            { id: 'n1', label: '病理征(-)', text: '双侧巴斯征阴性，未引出病理反射' },
            { id: 'n2', label: '肌力基本正常', text: '下肢主要肌群肌力无明显下降' },
            { id: 'n3', label: '无鞍区感觉障碍', text: '会阴部鞍区感觉正常，大小便无失禁' },
            { id: 'n4', label: '4字试验(-)', text: '双侧“4”字试验阴性' }
        ]
    },
    "肱骨髁上骨折（儿童）": {
        positive: [
            { id: 'p1', label: '肘部肿胀', text: '患肘明显肿胀，呈半屈曲位' },
            { id: 'p2', label: '局部压痛(+)', text: '肱骨髁上处明显压痛' },
            { id: 'p3', label: '骨擦感', text: '可触及骨擦感及异常活动' },
            { id: 'p4', label: '肘后三角正常', text: '肘后三角关系保持正常' }
        ],
        negative: [
            { id: 'n1', label: '桡动脉搏动正常', text: '桡动脉搏动存在，毛细血管充盈正常' },
            { id: 'n2', label: '手指活动正常', text: '手指屈伸活动正常，无神经损伤表现' },
            { id: 'n3', label: '无开放伤口', text: '局部皮肤完整，无骨折端外露' },
            { id: 'n4', label: '前臂张力正常', text: '前臂无明显肿胀及张力增高' }
        ]
    },
    "膝关节半月板损伤": {
        positive: [
            { id: 'p1', label: '关节间隙压痛', text: '患膝关节间隙固定压痛（+）' },
            { id: 'p2', label: '麦氏征(+)', text: '麦克莫瑞(McMurray)试验阳性' },
            { id: 'p3', label: '浮髌试验(±)', text: '浮髌试验可疑阳性或阳性（伴积液时）' },
            { id: 'p4', label: '关节交锁', text: '活动时可有交锁或弹响感' }
        ],
        negative: [
            { id: 'n1', label: '抽屉试验(-)', text: '前后抽屉试验阴性，交叉韧带完整' },
            { id: 'n2', label: '侧方应力(-)', text: '内外侧应力试验阴性，侧副韧带无松弛' },
            { id: 'n3', label: '无骨擦音', text: '关节活动未及明显骨擦音' },
            { id: 'n4', label: '感觉血运正常', text: '患肢远端感觉及血运正常' }
        ]
    },
    "骨关节炎（膝关节）": {
        positive: [
            { id: 'p1', label: '膝关节肿大', text: '双侧或单侧膝关节肿大变形' },
            { id: 'p2', label: '关节压痛(+)', text: '关节边缘及间隙压痛（+）' },
            { id: 'p3', label: '骨摩擦音', text: '关节活动时可及骨摩擦音' },
            { id: 'p4', label: '活动受限', text: '膝关节屈伸活动度不同程度受限' }
        ],
        negative: [
            { id: 'n1', label: '局部无红热', text: '关节局部皮温正常，无明显红肿发热' },
            { id: 'n2', label: '抽屉试验(-)', text: '前后抽屉试验阴性' },
            { id: 'n3', label: '直腿抬高(-)', text: '双下肢直腿抬高试验阴性' },
            { id: 'n4', label: '下肢血运正常', text: '双足背动脉搏动好，末梢感觉正常' }
        ]
    },
    "急性骨髓炎": {
        positive: [
            { id: 'p1', label: '局部红肿热痛', text: '患肢局部皮肤红肿、皮温升高、明显疼痛' },
            { id: 'p2', label: '深压痛(+)', text: '干骺端明显深压痛' },
            { id: 'p3', label: '叩击痛(+)', text: '骨干纵向叩击痛阳性' },
            { id: 'p4', label: '关节活动受限', text: '邻近关节因疼痛出现保护性活动受限' }
        ],
        negative: [
            { id: 'n1', label: '无骨擦感', text: '局部未及异常活动及骨擦感' },
            { id: 'n2', label: '无静脉曲张', text: '患肢无浅静脉曲张' },
            { id: 'n3', label: '无开放伤口', text: '局部无明显破溃及窦道形成（早期）' },
            { id: 'n4', label: '末梢血运正常', text: '肢端末梢血运、感觉正常' }
        ]
    },
    "肩关节脱位": {
        positive: [
            { id: 'p1', label: '方肩畸形', text: '患肩呈方肩畸形' },
            { id: 'p2', label: '杜加征(+)', text: 'Dugas征（搭肩试验）阳性' },
            { id: 'p3', label: '弹性固定', text: '患肢呈弹性固定状态' },
            { id: 'p4', label: '关节盂空虚', text: '触诊肩峰下空虚' }
        ],
        negative: [
            { id: 'n1', label: '无骨擦音', text: '未触及明显骨擦音或骨擦感' },
            { id: 'n2', label: '桡动脉正常', text: '桡动脉搏动好' },
            { id: 'n3', label: '感觉运动正常', text: '手部及腕部感觉、运动正常，无臂丛神经受损征象' },
            { id: 'n4', label: '皮肤完好', text: '闭合性损伤，无皮肤破溃' }
        ]
    },
    "膝关节前交叉韧带损伤": {
        positive: [
            { id: 'p1', label: '膝关节肿胀', text: '患膝明显肿胀，浮髌试验可呈阳性' },
            { id: 'p2', label: '前抽屉试验(+)', text: '前抽屉试验(ADT)阳性' },
            { id: 'p3', label: 'Lachman征(+)', text: 'Lachman试验阳性' },
            { id: 'p4', label: '压痛(+)', text: '关节间隙及髁间隆起处可有压痛' }
        ],
        negative: [
            { id: 'n1', label: '后抽屉试验(-)', text: '后抽屉试验阴性，后交叉韧带无明显损伤' },
            { id: 'n2', label: '无骨擦音', text: '未触及明显骨擦音' },
            { id: 'n3', label: '侧方应力(-)', text: '内外侧应力试验阴性' },
            { id: 'n4', label: '末梢血运正常', text: '足背动脉搏动好，感觉正常' }
        ]
    },
    "踝关节骨折": {
        positive: [
            { id: 'p1', label: '踝部肿胀', text: '患踝明显肿胀，常伴皮下瘀斑' },
            { id: 'p2', label: '局部压痛(+)', text: '内/外踝局部明显压痛' },
            { id: 'p3', label: '可及骨擦感', text: '触诊可及骨擦感及异常活动' },
            { id: 'p4', label: '活动受限', text: '踝关节主动及被动活动受限' }
        ],
        negative: [
            { id: 'n1', label: '足背动脉正常', text: '足背动脉、胫后动脉搏动有力' },
            { id: 'n2', label: '足趾运动正常', text: '足趾背伸、跖屈活动存在' },
            { id: 'n3', label: '无张力水泡', text: '局部暂无明显张力性水泡形成' },
            { id: 'n4', label: '皮肤完整', text: '闭合性骨折，无骨折端外露' }
        ]
    },
    "骨盆骨折": {
        positive: [
            { id: 'p1', label: '骨盆分离试验(+)', text: '骨盆分离与挤压试验阳性' },
            { id: 'p2', label: '局部压痛(+)', text: '耻骨联合或髂骨翼处明显压痛' },
            { id: 'p3', label: '下肢不对称', text: '双下肢长度可能出现不对称' },
            { id: 'p4', label: '翻身受限', text: '患者因疼痛无法翻身或坐起' }
        ],
        negative: [
            { id: 'n1', label: '无血尿', text: '尿道口无滴血，无明显血尿表现' },
            { id: 'n2', label: '腹部平软', text: '腹部平软，无明显腹膜刺激征' },
            { id: 'n3', label: '下肢运动正常', text: '双下肢感觉、运动基本正常' },
            { id: 'n4', label: '足背动脉正常', text: '双侧足背动脉搏动正常，无血管严重损伤' }
        ]
    },
    "脊柱骨折（胸腰椎）": {
        positive: [
            { id: 'p1', label: '局部压痛(+)', text: '病变胸腰椎棘突明显压痛' },
            { id: 'p2', label: '叩击痛(+)', text: '局部叩击痛阳性' },
            { id: 'p3', label: '活动受限', text: '脊柱活动明显受限，肌肉痉挛' },
            { id: 'p4', label: '后凸畸形', text: '受损部位可能存在后凸畸形' }
        ],
        negative: [
            { id: 'n1', label: '无下肢瘫痪', text: '双下肢感觉、运动功能无明显障碍' },
            { id: 'n2', label: '病理征(-)', text: '双侧巴氏征等病理反射阴性' },
            { id: 'n3', label: '括约肌功能正常', text: '肛门括约肌张力正常，无大小便失禁' },
            { id: 'n4', label: '腹部平软', text: '腹平软，无压痛反跳痛' }
        ]
    },
    "颈椎病（脊髓型）": {
        positive: [
            { id: 'p1', label: '颈部压痛', text: '颈椎下段棘突及旁系压痛' },
            { id: 'p2', label: '病理征(+)', text: '双侧或单侧Hoffmann征阳性' },
            { id: 'p3', label: '腱反射亢进', text: '双下肢膝腱、跟腱反射亢进' },
            { id: 'p4', label: '肌张力增高', text: '下肢肌张力增高，步态不稳' }
        ],
        negative: [
            { id: 'n1', label: '无明显肌肉萎缩', text: '四肢无明显肌肉萎缩' },
            { id: 'n2', label: '痛温觉相对保留', text: '感觉分离不明显，无节段性痛温觉丧失' },
            { id: 'n3', label: '局部无肿块', text: '颈部未触及明显包块' },
            { id: 'n4', label: '无脑神经受损', text: '面部感觉及脑神经功能正常' }
        ]
    },
    "骨肉瘤": {
        positive: [
            { id: 'p1', label: '局部肿块', text: '患处可触及质硬肿块，固定，边界不清' },
            { id: 'p2', label: '皮温升高', text: '肿块表面皮温升高，静脉怒张' },
            { id: 'p3', label: '明显压痛', text: '局部有明显自发痛及压痛' },
            { id: 'p4', label: '关节受限', text: '邻近关节活动受限' }
        ],
        negative: [
            { id: 'n1', label: '无波动感', text: '肿块质地硬，无波动感' },
            { id: 'n2', label: '皮肤无破溃', text: '早期局部皮肤完整，无破溃' },
            { id: 'n3', label: '淋巴结无肿大', text: '附近淋巴结未及明显肿大' },
            { id: 'n4', label: '末梢血运正常', text: '患肢远端感觉、血运正常' }
        ]
    },
    "多处软组织挫伤": {
        positive: [
            { id: 'p1', label: '局部肿胀', text: '多处受压或受力部位明显肿胀' },
            { id: 'p2', label: '皮下瘀斑', text: '可见大片皮下瘀斑或紫绀' },
            { id: 'p3', label: '触痛(+)', text: '局部触痛明显，活动时加剧' },
            { id: 'p4', label: '表皮擦伤', text: '部分区域伴有表皮擦伤及渗血' }
        ],
        negative: [
            { id: 'n1', label: '无骨擦音', text: '局部未触及骨擦音及骨擦感' },
            { id: 'n2', label: '无异常活动', text: '各关节活动正常，无异常活动' },
            { id: 'n3', label: '感觉运动正常', text: '远端肢体感觉、运动功能正常' },
            { id: 'n4', label: '无深部血肿', text: '未触及明显深部大血肿' }
        ]
    },
    "椎管内肿瘤（神经鞘瘤）": {
        positive: [
            { id: 'p1', label: '感觉平面', text: '躯干可查见明确的感觉障碍平面' },
            { id: 'p2', label: '肌力减退', text: '病变平面以下肢体肌力不同程度减退' },
            { id: 'p3', label: '病理征(+)', text: '受损节段以下病理反射阳性' },
            { id: 'p4', label: '脊柱压痛', text: '病变节段脊柱可有轻度叩击痛或压痛' }
        ],
        negative: [
            { id: 'n1', label: '无明显畸形', text: '脊柱外观无明显侧弯及后凸畸形' },
            { id: 'n2', label: '局部无红肿', text: '背部局部皮肤正常，无红肿' },
            { id: 'n3', label: '括约肌早期正常', text: '疾病早期括约肌功能可正常' },
            { id: 'n4', label: '脑神经正常', text: '脑神经查体未见异常' }
        ]
    }
};

let count = 0;
diseases.forEach(disease => {
    if (orthoDiseases.includes(disease.name) || configs[disease.name]) {
        count++;

        if (disease.t && disease.t.physicalExam) {
            disease.t.physicalExam = standardPhysicalExam;
        }

        let specialistRaw = "";
        if (disease.t && disease.t.specialistExam) {
            specialistRaw = disease.t.specialistExam;
        } else if (disease.peConfig && disease.peConfig.specialistRaw) {
            specialistRaw = disease.peConfig.specialistRaw;
        }

        let conf = configs[disease.name] || configs["股骨颈骨折"];
        disease.peConfig = {
            diseaseName: disease.name,
            positiveSigns: conf.positive.map(p => ({
                id: p.id,
                label: p.label,
                default: true,
                text: p.text
            })),
            negativeSigns: conf.negative.map(n => ({
                id: n.id,
                label: n.label,
                default: true,
                text: n.text
            })),
            specialistRaw: specialistRaw,
            vitals: {
                t: disease.t && disease.t.t ? disease.t.t : "36.5℃",
                p: disease.t && disease.t.p ? disease.t.p : "78次/分",
                r: disease.t && disease.t.r ? disease.t.r : "18次/分",
                bp: disease.t && disease.t.bp ? disease.t.bp : "120/80mmHg"
            }
        };

        const cleanText = (txt) => {
            if (!txt) return txt;
            return txt.replace(/腹部阳性体征详见专科检查/g, '四肢及脊柱阳性体征详见专科检查')
                      .replace(/全腹阳性及鉴别体征详见专科检查/g, '四肢及脊柱阳性体征详见专科检查')
                      .replace(/胸部阳性体征详见专科检查/g, '四肢及脊柱阳性体征详见专科检查');
        };
        
        if (disease.t) {
            disease.t.presentIllness = cleanText(disease.t.presentIllness);
            disease.t.dailyCourse = cleanText(disease.t.dailyCourse);
            disease.t.dischargeRecord = cleanText(disease.t.dischargeRecord);
            disease.t.firstCourse = cleanText(disease.t.firstCourse);
        }
    }
});

const newContent = prefix + JSON.stringify(diseases, null, 2) + suffix;

fs.writeFileSync('../js/data/surgery.js', newContent, 'utf8');
console.log("Processed " + count + " diseases successfully.");
