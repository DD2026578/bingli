/**
 * 华医临床病历助手 - 关键阴性鉴别体征数据库 (Negative Differential Signs Database)
 *
 * 本数据库由8个临床子代理根据各疾病的鉴别诊断逐一审定，为每个疾病提供
 * 特异性的阴性鉴别体征，用于防止病历前后逻辑矛盾。
 *
 * 阴性体征优先级：NEGATIVE_SIGNS_DB > peConfig.negativeSigns > 自动提取
 *
 * 编写原则：
 * 1. 每个疾病4-6个阴性鉴别体征
 * 2. 阴性体征针对该疾病的主要鉴别诊断设计（从首次病程记录"鉴别诊断"部分提取）
 * 3. 使用规范医学术语，描述为阴性发现（如"无..."、"未触及..."、"未闻及..."等）
 * 4. default值为true（表示该患者确实不具备此体征）
 * 5. 阴性体征不与该疾病的阳性体征矛盾
 *
 * 数据统计：
 * - 内科: 43个疾病
 * - 外科: 76个疾病
 * - 妇产科: 4个疾病
 * - 儿科: 4个疾病
 * - 合计: 127个疾病，673条阴性体征
 */
window.NEGATIVE_SIGNS_DB = {

// ===== 内科疾病 (43) =====

    "社区获得性肺炎": [
        { id: "neg_1", label: "无结核中毒症状", default: true, text: "无盗汗、消瘦等结核中毒症状" },
        { id: "neg_2", label: "无咯血", default: true, text: "无咯血" },
        { id: "neg_3", label: "无大量脓臭痰", default: true, text: "无大量脓臭痰" },
        { id: "neg_4", label: "气管居中", default: true, text: "气管居中，无偏移" },
        { id: "neg_5", label: "无胸膜摩擦音", default: true, text: "未闻及胸膜摩擦音" }
    ],

    "急性ST段抬高型心肌梗死": [
        { id: "neg_1", label: "双上肢血压对称", default: true, text: "双上肢血压对称，无显著差异" },
        { id: "neg_2", label: "无颈静脉怒张", default: true, text: "无颈静脉怒张" },
        { id: "neg_3", label: "无心包摩擦音", default: true, text: "未闻及心包摩擦音" },
        { id: "neg_4", label: "无奇脉", default: true, text: "无奇脉" },
        { id: "neg_5", label: "双下肢无水肿", default: true, text: "双下肢无凹陷性水肿，无深静脉血栓征象" }
    ],

    "急性胰腺炎": [
        { id: "neg_1", label: "无全腹板状强直", default: true, text: "腹肌紧张局限于上腹部，无全腹板状强直" },
        { id: "neg_2", label: "右上腹无明显压痛", default: true, text: "右上腹无明显压痛" },
        { id: "neg_3", label: "腹部未见胃肠型及蠕动波", default: true, text: "腹部未见胃肠型及蠕动波" },
        { id: "neg_4", label: "肛门指检未触及肿块", default: true, text: "肛门指检未触及肿块" },
        { id: "neg_5", label: "无腹壁静脉曲张", default: true, text: "腹壁无静脉曲张" }
    ],

    "2型糖尿病": [
        { id: "neg_1", label: "无库欣面容", default: true, text: "无向心性肥胖、满月脸等库欣综合征表现" },
        { id: "neg_2", label: "皮肤未见紫纹", default: true, text: "腹部及大腿未见皮肤紫纹" },
        { id: "neg_3", label: "呼气无酮味", default: true, text: "呼气无酮味（烂苹果味）" },
        { id: "neg_4", label: "无Kussmaul呼吸", default: true, text: "无深大呼吸（Kussmaul呼吸）" },
        { id: "neg_5", label: "双肾区无叩击痛", default: true, text: "双侧肾区无叩击痛" }
    ],

    "急性缺血性脑卒中": [
        { id: "neg_1", label: "脑膜刺激征阴性", default: true, text: "颈无抵抗，Kernig征、Brudzinski征阴性" },
        { id: "neg_2", label: "瞳孔等大等圆", default: true, text: "双侧瞳孔等大等圆，对光反射灵敏" },
        { id: "neg_3", label: "眼底无视乳头水肿", default: true, text: "眼底检查无视乳头水肿" },
        { id: "neg_4", label: "无癫痫发作", default: true, text: "无癫痫发作" },
        { id: "neg_5", label: "呼吸节律规整", default: true, text: "呼吸节律规整，无潮式呼吸及呼吸暂停" }
    ],

    "慢性阻塞性肺疾病急性加重": [
        { id: "neg_1", label: "双肺未闻及弥漫性哮鸣音", default: true, text: "双肺未闻及弥漫性呼气相哮鸣音" },
        { id: "neg_2", label: "心脏未闻及奔马律", default: true, text: "心脏未闻及奔马律" },
        { id: "neg_3", label: "气管居中", default: true, text: "气管居中，无偏移" },
        { id: "neg_4", label: "锁骨上淋巴结未触及", default: true, text: "双侧锁骨上未触及肿大淋巴结" },
        { id: "neg_5", label: "无咯血", default: true, text: "无咯血" }
    ],

    "高血压病（3级 极高危）": [
        { id: "neg_1", label: "无库欣面容", default: true, text: "无向心性肥胖、满月脸、皮肤紫纹等库欣综合征表现" },
        { id: "neg_2", label: "腹部未闻及血管杂音", default: true, text: "腹部脐周及肾动脉区未闻及血管杂音" },
        { id: "neg_3", label: "双肾区无叩击痛", default: true, text: "双侧肾区无叩击痛" },
        { id: "neg_4", label: "无下肢凹陷性水肿", default: true, text: "双下肢无凹陷性水肿" },
        { id: "neg_5", label: "双上肢血压对称", default: true, text: "双上肢血压对称，无明显差异" }
    ],

    "上消化道出血": [
        { id: "neg_1", label: "双肺呼吸音清", default: true, text: "双肺呼吸音清，未闻及干湿性啰音" },
        { id: "neg_2", label: "无肝掌及蜘蛛痣", default: true, text: "无肝掌及蜘蛛痣" },
        { id: "neg_3", label: "皮肤巩膜无黄染", default: true, text: "皮肤、巩膜无黄染" },
        { id: "neg_4", label: "肛门指检未触及肿块", default: true, text: "肛门指检未触及肿块" },
        { id: "neg_5", label: "无扑翼样震颤", default: true, text: "无扑翼样震颤" }
    ],

    "慢性胃炎": [
        { id: "neg_1", label: "Murphy征阴性", default: true, text: "右上腹无压痛，Murphy征阴性" },
        { id: "neg_2", label: "腹部未触及包块", default: true, text: "腹部未触及包块" },
        { id: "neg_3", label: "锁骨上淋巴结未触及", default: true, text: "双侧锁骨上未触及肿大淋巴结" },
        { id: "neg_4", label: "皮肤巩膜无黄染", default: true, text: "皮肤、巩膜无黄染" },
        { id: "neg_5", label: "无呕血及黑便", default: true, text: "无呕血及黑便" }
    ],

    "慢性心力衰竭": [
        { id: "neg_1", label: "无桶状胸", default: true, text: "胸廓无桶状胸畸形，肋间隙无增宽" },
        { id: "neg_2", label: "无颈静脉怒张", default: true, text: "无颈静脉怒张" },
        { id: "neg_3", label: "P2不亢进", default: true, text: "肺动脉瓣区第二心音不亢进" },
        { id: "neg_4", label: "双肺叩诊呈清音", default: true, text: "双肺叩诊呈清音，无过清音" },
        { id: "neg_5", label: "无口唇发绀", default: true, text: "无口唇及肢端发绀" }
    ],

    "心房颤动": [
        { id: "neg_1", label: "颈静脉无异常搏动", default: true, text: "颈静脉无异常搏动及炮a波" },
        { id: "neg_2", label: "心尖部未触及震颤", default: true, text: "心尖部未触及震颤" },
        { id: "neg_3", label: "无心包摩擦音", default: true, text: "未闻及心包摩擦音" },
        { id: "neg_4", label: "无发绀及端坐呼吸", default: true, text: "无口唇发绀及端坐呼吸" },
        { id: "neg_5", label: "无阿斯综合征发作", default: true, text: "无阿斯综合征发作表现" }
    ],

    "不稳定型心绞痛": [
        { id: "neg_1", label: "心电图无ST段抬高", default: true, text: "心电图未见ST段抬高及病理性Q波，无动态ST-T演变" },
        { id: "neg_2", label: "心肌标志物正常", default: true, text: "心肌损伤标志物（肌钙蛋白、CK-MB）无升高" },
        { id: "neg_3", label: "双侧血压对称", default: true, text: "双侧上肢血压对称，无脉压差显著增大" },
        { id: "neg_4", label: "无血管杂音", default: true, text: "未闻及胸腹部及大血管区血管杂音" },
        { id: "neg_5", label: "无脉搏不对称", default: true, text: "无双侧脉搏不对称及脉搏短绌" },
        { id: "neg_6", label: "无心包摩擦音", default: true, text: "心前区未闻及心包摩擦音" }
    ],

    "支气管哮喘": [
        { id: "neg_1", label: "无心界扩大及奔马律", default: true, text: "心界不大，未闻及舒张期奔马律" },
        { id: "neg_2", label: "无颈静脉怒张", default: true, text: "无颈静脉怒张及肝颈静脉回流征阳性" },
        { id: "neg_3", label: "无下肢水肿", default: true, text: "无双下肢凹陷性水肿" },
        { id: "neg_4", label: "无杵状指", default: true, text: "无杵状指（趾）" },
        { id: "neg_5", label: "无紫绀", default: true, text: "无口唇及甲床发绀" }
    ],

    "支气管扩张症": [
        { id: "neg_1", label: "无上肺实变", default: true, text: "无上肺野实变体征，病变非结核好发部位" },
        { id: "neg_2", label: "无淋巴结肿大", default: true, text: "未触及颈部及锁骨上淋巴结肿大" },
        { id: "neg_3", label: "无大叶性实变", default: true, text: "无大叶性实变及空瓮音" },
        { id: "neg_4", label: "无胸膜摩擦音", default: true, text: "未闻及胸膜摩擦音" },
        { id: "neg_5", label: "无呼吸音消失", default: true, text: "无呼吸音完全消失及语颤消失" }
    ],

    "慢性肺源性心脏病": [
        { id: "neg_1", label: "无心尖舒张期杂音", default: true, text: "心尖区未闻及舒张期隆隆样杂音" },
        { id: "neg_2", label: "无二尖瓣面容", default: true, text: "无二尖瓣面容" },
        { id: "neg_3", label: "无主动脉瓣杂音", default: true, text: "主动脉瓣听诊区未闻及舒张期叹气样杂音" },
        { id: "neg_4", label: "心尖搏动无左下移位", default: true, text: "心尖搏动无向左下移位" },
        { id: "neg_5", label: "无心尖区收缩期杂音", default: true, text: "心尖区未闻及病理性收缩期杂音" }
    ],

    "肝硬化失代偿期": [
        { id: "neg_1", label: "无颈静脉怒张", default: true, text: "无颈静脉怒张" },
        { id: "neg_2", label: "无心包叩击音及奇脉", default: true, text: "无心包叩击音及奇脉" },
        { id: "neg_3", label: "无腹壁柔韧感", default: true, text: "腹部无柔韧感及揉面感" },
        { id: "neg_4", label: "无发热盗汗", default: true, text: "无发热及盗汗" },
        { id: "neg_5", label: "无腹部包块", default: true, text: "未触及腹部包块" },
        { id: "neg_6", label: "无心包摩擦音", default: true, text: "心界不大，未闻及心包摩擦音" }
    ],

    "溃疡性结肠炎": [
        { id: "neg_1", label: "无右下腹压痛", default: true, text: "无右下腹压痛及反跳痛" },
        { id: "neg_2", label: "无肛周病变", default: true, text: "无肛周瘘管及脓肿形成" },
        { id: "neg_3", label: "无肠外表现", default: true, text: "无口腔黏膜溃疡及皮肤结节性红斑" },
        { id: "neg_4", label: "无发热脱水", default: true, text: "无发热及明显脱水貌" },
        { id: "neg_5", label: "无关节肿痛", default: true, text: "无关节红肿热痛" }
    ],

    "胃食管反流病": [
        { id: "neg_1", label: "心电图无动态改变", default: true, text: "心电图无ST段压低及T波倒置等动态改变" },
        { id: "neg_2", label: "无左肩臂放射痛", default: true, text: "胸痛无向左肩及左臂内侧放射" },
        { id: "neg_3", label: "无吞咽困难", default: true, text: "无进行性吞咽困难" },
        { id: "neg_4", label: "无锁骨上淋巴结肿大", default: true, text: "未触及锁骨上淋巴结肿大" },
        { id: "neg_5", label: "无恶病质", default: true, text: "无明显消瘦及恶病质" }
    ],

    "慢性肾脏病5期": [
        { id: "neg_1", label: "无颈静脉怒张", default: true, text: "无颈静脉怒张" },
        { id: "neg_2", label: "无肝颈回流征", default: true, text: "无肝颈静脉回流征阳性" },
        { id: "neg_3", label: "无奔马律", default: true, text: "未闻及舒张期奔马律" },
        { id: "neg_4", label: "无急性失血", default: true, text: "无急性失血及低血容量休克表现" },
        { id: "neg_5", label: "无肾区叩击痛", default: true, text: "双肾区无叩击痛" }
    ],

    "急性肾损伤": [
        { id: "neg_1", label: "无肾性骨病", default: true, text: "无肾性骨营养不良及皮肤瘙痒表现" },
        { id: "neg_2", label: "无重度贫血貌", default: true, text: "无重度贫血貌" },
        { id: "neg_3", label: "无尿毒症霜", default: true, text: "无皮肤色素沉着及尿素霜" },
        { id: "neg_4", label: "无血容量不足征", default: true, text: "无颈静脉塌陷及皮肤弹性减退" },
        { id: "neg_5", label: "无循环衰竭", default: true, text: "无循环衰竭及休克表现" }
    ],

    "原发性肾病综合征": [
        { id: "neg_1", label: "无蝶形红斑", default: true, text: "无面部蝶形红斑" },
        { id: "neg_2", label: "无关节肿痛", default: true, text: "无关节红肿热痛" },
        { id: "neg_3", label: "无脱发口腔溃疡", default: true, text: "无脱发及口腔溃疡" },
        { id: "neg_4", label: "无多饮多尿", default: true, text: "无多饮多尿及多食" },
        { id: "neg_5", label: "无视网膜病变", default: true, text: "无糖尿病性视网膜病变" },
        { id: "neg_6", label: "无肢端感觉异常", default: true, text: "无肢端感觉异常及末梢神经病变" }
    ],

    "2型糖尿病伴酮症酸中毒": [
        { id: "neg_1", label: "无意识障碍加重", default: true, text: "无抽搐及意识障碍进行性加重" },
        { id: "neg_2", label: "无腹泻", default: true, text: "无腹泻及水样便" },
        { id: "neg_3", label: "无发热中毒症", default: true, text: "无发热及感染中毒症状" },
        { id: "neg_4", label: "无黄疸", default: true, text: "无皮肤巩膜黄染" },
        { id: "neg_5", label: "无神经定位征", default: true, text: "无肢体偏瘫及中枢神经系统定位体征" }
    ],

    "原发性甲状腺功能亢进症": [
        { id: "neg_1", label: "甲状腺无压痛", default: true, text: "甲状腺未触及结节及肿块，无压痛及放射痛" },
        { id: "neg_2", label: "无发热及前驱感染", default: true, text: "无发热、咽痛及上呼吸道感染前驱症状" },
        { id: "neg_3", label: "无脉搏短绌", default: true, text: "无脉搏短绌及心律不齐" },
        { id: "neg_4", label: "无心包摩擦音", default: true, text: "未闻及心包摩擦音及附加心音" },
        { id: "neg_5", label: "无胫前黏液性水肿", default: true, text: "无胫前黏液性水肿及指端粗厚" }
    ],

    "痛风性关节炎": [
        { id: "neg_1", label: "无广泛皮下红肿", default: true, text: "病变关节周围无广泛皮下红肿、淋巴管炎及皮肤破溃" },
        { id: "neg_2", label: "区域淋巴结无肿大", default: true, text: "区域引流淋巴结无肿大及压痛" },
        { id: "neg_3", label: "大关节无受累", default: true, text: "膝、腕等大关节无红肿热痛及活动受限" },
        { id: "neg_4", label: "无对称性多关节肿痛", default: true, text: "无对称性多关节肿痛及晨僵" },
        { id: "neg_5", label: "无类风湿结节", default: true, text: "无皮下类风湿结节" },
        { id: "neg_6", label: "无发热及中毒症状", default: true, text: "无发热及全身中毒症状" }
    ],

    "类风湿关节炎": [
        { id: "neg_1", label: "无Heberden结节", default: true, text: "远端指间关节无Heberden结节及骨性膨大" },
        { id: "neg_2", label: "无膝关节骨摩擦感", default: true, text: "负重膝关节无骨性摩擦感及活动弹响" },
        { id: "neg_3", label: "无蝶形红斑", default: true, text: "无面部蝶形红斑及盘状红斑" },
        { id: "neg_4", label: "无口腔溃疡及脱发", default: true, text: "无口腔溃疡、脱发及光过敏" },
        { id: "neg_5", label: "无雷诺现象", default: true, text: "无雷诺现象及肢端皮肤硬化" },
        { id: "neg_6", label: "无浅表淋巴结肿大", default: true, text: "无浅表淋巴结肿大及脾大" }
    ],

    "系统性红斑狼疮": [
        { id: "neg_1", label: "无口眼干燥", default: true, text: "无口干、眼干及腮腺肿大" },
        { id: "neg_2", label: "无近端肌无力", default: true, text: "无近端肌无力及肌力下降" },
        { id: "neg_3", label: "无Gottron疹", default: true, text: "无Gottron疹及向阳性皮疹" },
        { id: "neg_4", label: "无肌痛及肌压痛", default: true, text: "无肌痛及肌压痛" },
        { id: "neg_5", label: "无肢端硬化", default: true, text: "无肢端皮肤硬化及发紧" },
        { id: "neg_6", label: "无Heberden结节", default: true, text: "无远端指间关节Heberden结节" }
    ],

    "脑出血": [
        { id: "neg_1", label: "无脑膜刺激征", default: true, text: "无颈项强直，Kernig征及Brudzinski征阴性" },
        { id: "neg_2", label: "瞳孔等大等圆", default: true, text: "双侧瞳孔等大等圆，对光反射灵敏" },
        { id: "neg_3", label: "无意识障碍", default: true, text: "无意识障碍及昏迷" },
        { id: "neg_4", label: "无癫痫发作", default: true, text: "病程中无癫痫发作" },
        { id: "neg_5", label: "无去大脑强直", default: true, text: "无去皮质强直及去大脑强直姿势" },
        { id: "neg_6", label: "无中枢性高热", default: true, text: "无中枢性高热及呼吸节律异常" }
    ],

    "癫痫发作": [
        { id: "neg_1", label: "瞳孔等大等圆", default: true, text: "双侧瞳孔等大等圆，对光反射灵敏" },
        { id: "neg_2", label: "无脑膜刺激征", default: true, text: "无颈项强直，Kernig征阴性" },
        { id: "neg_3", label: "无肢体偏瘫", default: true, text: "无肢体偏瘫及病理征阳性" },
        { id: "neg_4", label: "无意识障碍", default: true, text: "发作间期无意识障碍及认知功能异常" },
        { id: "neg_5", label: "无精神症状", default: true, text: "无精神症状及情感障碍" },
        { id: "neg_6", label: "无神经皮肤综合征", default: true, text: "无皮肤牛奶咖啡斑及皮脂腺瘤" }
    ],

    "扩张型心肌病": [
        { id: "neg_1", label: "无震颤及抬举样搏动", default: true, text: "心前区无震颤及抬举样搏动" },
        { id: "neg_2", label: "无心包摩擦音", default: true, text: "未闻及心包摩擦音" },
        { id: "neg_3", label: "无周围血管征", default: true, text: "无水冲脉、枪击音及Duroziez征" },
        { id: "neg_4", label: "无奇脉", default: true, text: "无奇脉" },
        { id: "neg_5", label: "无杵状指及发绀", default: true, text: "无杵状指及口唇发绀" },
        { id: "neg_6", label: "无下肢不对称肿胀", default: true, text: "无双下肢不对称肿胀及压痛" }
    ],

    "急性肺栓塞": [
        { id: "neg_1", label: "双侧血压对称", default: true, text: "双侧上肢血压对称，无脉压差显著增大" },
        { id: "neg_2", label: "无撕裂样胸背痛", default: true, text: "无胸背部撕裂样疼痛及向腹部放射" },
        { id: "neg_3", label: "无主动脉瓣舒张期杂音", default: true, text: "主动脉瓣区未闻及舒张期叹气样杂音" },
        { id: "neg_4", label: "四肢脉搏对称", default: true, text: "四肢脉搏对称有力，无脉搏消失及不对称" },
        { id: "neg_5", label: "无心前区震颤", default: true, text: "心前区未触及震颤及抬举样搏动" },
        { id: "neg_6", label: "无心包摩擦音", default: true, text: "未闻及心包摩擦音" }
    ],

    "结核性胸膜炎": [
        { id: "neg_1", label: "无锁骨上淋巴结肿大", default: true, text: "无锁骨上及腋窝淋巴结肿大" },
        { id: "neg_2", label: "无杵状指", default: true, text: "无杵状指及肥大性骨关节病" },
        { id: "neg_3", label: "无胸壁红肿及窦道", default: true, text: "无胸壁红肿、波动感及窦道形成" },
        { id: "neg_4", label: "无恶病质", default: true, text: "无恶病质及重度消瘦" },
        { id: "neg_5", label: "无皮肤冷脓肿", default: true, text: "无皮肤冷脓肿及瘘管" },
        { id: "neg_6", label: "无上腔静脉压迫征", default: true, text: "无颈静脉怒张及上腔静脉压迫综合征" }
    ],

    "间质性肺疾病": [
        { id: "neg_1", label: "无桶状胸", default: true, text: "无桶状胸及胸廓前后径增大" },
        { id: "neg_2", label: "无呼气相哮鸣音", default: true, text: "无呼气相哮鸣音及呼气延长" },
        { id: "neg_3", label: "无浅表淋巴结肿大", default: true, text: "无浅表淋巴结肿大" },
        { id: "neg_4", label: "无结节性红斑", default: true, text: "无皮疹及结节性红斑" },
        { id: "neg_5", label: "无葡萄膜炎", default: true, text: "无葡萄膜炎及腮腺肿大" },
        { id: "neg_6", label: "无大量脓痰", default: true, text: "无大量脓痰及反复咯血" }
    ],

    "阻塞性睡眠呼吸暂停低通气综合征": [
        { id: "neg_1", label: "无猝倒发作", default: true, text: "无猝倒发作及入睡前幻觉" },
        { id: "neg_2", label: "无睡眠瘫痪", default: true, text: "无睡眠瘫痪" },
        { id: "neg_3", label: "无甲状腺肿大", default: true, text: "无甲状腺肿大及结节" },
        { id: "neg_4", label: "无黏液性水肿", default: true, text: "无明显黏液性水肿及皮肤干燥" },
        { id: "neg_5", label: "无反应迟钝", default: true, text: "无反应迟钝及智力减退" },
        { id: "neg_6", label: "无肢端肥大", default: true, text: "无肢端肥大及巨舌症" }
    ],

    "消化性溃疡伴出血": [
        { id: "neg_1", label: "无蜘蛛痣及肝掌", default: true, text: "全身皮肤未见蜘蛛痣，双手大鱼际及小鱼际无肝掌表现" },
        { id: "neg_2", label: "无黄疸", default: true, text: "皮肤巩膜未见黄染" },
        { id: "neg_3", label: "脾脏未肿大", default: true, text: "脾脏肋下未触及肿大，无脾功能亢进表现" },
        { id: "neg_4", label: "压痛局限", default: true, text: "腹壁压痛局限于剑突下，腹壁无弥漫性压痛" },
        { id: "neg_5", label: "无液波震颤", default: true, text: "未触及液波震颤" },
        { id: "neg_6", label: "无肝病面容", default: true, text: "面色无晦暗黝黑，无肝病面容" }
    ],

    "非酒精性脂肪性肝病": [
        { id: "neg_1", label: "无黄疸", default: true, text: "皮肤巩膜未见黄染" },
        { id: "neg_2", label: "无腹壁静脉曲张", default: true, text: "腹壁未见静脉曲张及海蛇头征" },
        { id: "neg_3", label: "无男性乳房发育", default: true, text: "无男性乳房发育及睾丸萎缩" },
        { id: "neg_4", label: "脾脏未肿大", default: true, text: "脾脏肋下未触及肿大" },
        { id: "neg_5", label: "无液波震颤", default: true, text: "未触及液波震颤" }
    ],

    "克罗恩病": [
        { id: "neg_1", label: "左下腹无压痛", default: true, text: "左下腹未触及压痛及包块" },
        { id: "neg_2", label: "直肠指诊阴性", default: true, text: "直肠指诊未触及肿物及触痛，指套退出无血染" },
        { id: "neg_3", label: "无腹腔淋巴结肿大", default: true, text: "腹部未触及肿大淋巴结" },
        { id: "neg_4", label: "无浅表淋巴结肿大", default: true, text: "全身浅表淋巴结未触及肿大" },
        { id: "neg_5", label: "无腹壁柔韧感", default: true, text: "腹壁无柔韧感及揉面感" },
        { id: "neg_6", label: "无结核中毒征", default: true, text: "无发热、盗汗及明显消瘦" }
    ],

    "慢性肾小球肾炎": [
        { id: "neg_1", label: "肾区无叩击痛", default: true, text: "双侧肾区无叩击痛" },
        { id: "neg_2", label: "无眼睑水肿", default: true, text: "眼睑及颜面部无水肿" },
        { id: "neg_3", label: "无高血压眼底病变", default: true, text: "眼底检查未见高血压视网膜病变" },
        { id: "neg_4", label: "A2不亢进", default: true, text: "主动脉瓣区第二心音不亢进" },
        { id: "neg_5", label: "膀胱区无异常", default: true, text: "膀胱区无压痛，未触及充盈膀胱" }
    ],

    "强直性脊柱炎": [
        { id: "neg_1", label: "直腿抬高试验阴性", default: true, text: "双侧直腿抬高试验及加强试验均阴性" },
        { id: "neg_2", label: "下肢感觉正常", default: true, text: "双下肢无感觉减退及感觉异常" },
        { id: "neg_3", label: "下肢肌力正常", default: true, text: "双下肢肌力5级，肌张力正常" },
        { id: "neg_4", label: "反射对称", default: true, text: "双侧膝腱反射及跟腱反射对称引出" },
        { id: "neg_5", label: "无放射痛", default: true, text: "无下肢放射性疼痛" },
        { id: "neg_6", label: "无间歇性跛行", default: true, text: "无间歇性跛行" }
    ],

    "原发性甲状腺功能减退症": [
        { id: "neg_1", label: "水肿非凹陷性", default: true, text: "全身水肿按压无明显凹陷，呈黏液性水肿特征" },
        { id: "neg_2", label: "肾区无叩击痛", default: true, text: "双侧肾区无叩击痛" },
        { id: "neg_3", label: "无腹水征", default: true, text: "移动性浊音阴性，未触及液波震颤" },
        { id: "neg_4", label: "无黄色瘤", default: true, text: "皮肤未见黄色瘤及皮下脂质沉积表现" },
        { id: "neg_5", label: "无胸腔积液征", default: true, text: "双肺未闻及胸膜摩擦音，无胸腔积液体征" }
    ],

    "原发性骨质疏松症": [
        { id: "neg_1", label: "腰椎无局限压痛", default: true, text: "腰椎棘突无局限性压痛及叩击痛" },
        { id: "neg_2", label: "无多发骨压痛", default: true, text: "胸骨及多处长骨无压痛" },
        { id: "neg_3", label: "无贫血貌", default: true, text: "无贫血貌，皮肤黏膜无苍白" },
        { id: "neg_4", label: "下肢神经正常", default: true, text: "双下肢感觉、肌力及肌张力正常" },
        { id: "neg_5", label: "无淋巴结肿大", default: true, text: "全身浅表淋巴结未触及肿大" },
        { id: "neg_6", label: "无肾功能损害征", default: true, text: "无水肿及肾区叩击痛等肾功能损害表现" }
    ],

    "缺铁性贫血": [
        { id: "neg_1", label: "无舌乳头萎缩", default: true, text: "舌乳头无萎缩，舌质无绛红及牛肉样改变" },
        { id: "neg_2", label: "无感觉障碍", default: true, text: "无浅感觉及深感觉（振动觉、位置觉）障碍" },
        { id: "neg_3", label: "无广泛出血", default: true, text: "皮肤黏膜无广泛出血点及瘀斑" },
        { id: "neg_4", label: "无感染征象", default: true, text: "无发热及口腔黏膜溃疡等感染征象" },
        { id: "neg_5", label: "无黄疸", default: true, text: "皮肤巩膜无黄染" }
    ],

    "免疫性血小板减少症": [
        { id: "neg_1", label: "无可触及性紫癜", default: true, text: "无双下肢对称性可触及性紫癜" },
        { id: "neg_2", label: "关节无异常", default: true, text: "双侧大关节无红肿、压痛及活动受限" },
        { id: "neg_3", label: "无肉眼血尿", default: true, text: "无肉眼血尿" },
        { id: "neg_4", label: "无贫血貌", default: true, text: "无贫血貌，皮肤黏膜无苍白" },
        { id: "neg_5", label: "无感染征象", default: true, text: "无发热及感染征象" },
        { id: "neg_6", label: "无肝脾淋巴结肿大", default: true, text: "未触及肝脾及浅表淋巴结肿大" }
    ],

    "短暂性脑缺血发作": [
        { id: "neg_1", label: "无抽搐发作", default: true, text: "无肢体抽搐及强直阵挛发作" },
        { id: "neg_2", label: "无发作后状态", default: true, text: "无发作后意识模糊、嗜睡及遗忘" },
        { id: "neg_3", label: "无舌咬伤及尿失禁", default: true, text: "无舌咬伤及尿失禁" },
        { id: "neg_4", label: "无眩晕耳鸣", default: true, text: "无旋转性眩晕、耳鸣及听力下降" },
        { id: "neg_5", label: "无眼震及共济失调", default: true, text: "无眼球震颤及共济失调" },
        { id: "neg_6", label: "发作间期无定位征", default: true, text: "发作间期神经系统查体无阳性定位体征" }
    ],


// ===== 外科疾病 (76) =====

    "不完全性肠梗阻": [
        { id: "neg_1", label: "右下腹无压痛", default: true, text: "右下腹麦氏点无压痛及反跳痛，不支持急性阑尾炎" },
        { id: "neg_2", label: "无转移性右下腹痛", default: true, text: "腹痛以脐周、左下腹阵发性隐痛为主，无转移性右下腹痛，不支持急性阑尾炎" },
        { id: "neg_3", label: "无腰背放射痛", default: true, text: "上腹部无持续性剧痛向腰背部放射，血淀粉酶无明显升高，不支持急性胰腺炎" },
        { id: "neg_4", label: "无肉眼血便", default: true, text: "无肉眼血便，无房颤、冠心病等基础疾病，不支持肠系膜血管栓塞" },
        { id: "neg_5", label: "腹部未触及包块", default: true, text: "腹部未触及包块，腹壁无柔韧感，不支持肿瘤性肠梗阻及结核性腹膜炎" }
    ],

    "急性阑尾炎": [
        { id: "neg_1", label: "右上腹无压痛", default: true, text: "右上腹无压痛及反跳痛，Murphy征阴性，不支持急性胆囊炎" },
        { id: "neg_2", label: "无会阴放射痛", default: true, text: "无阵发性腰部绞痛向会阴部放射，不支持右侧输尿管结石" },
        { id: "neg_3", label: "无肉眼血尿", default: true, text: "无肉眼血尿，尿常规未见明显红细胞，不支持右侧输尿管结石" },
        { id: "neg_4", label: "无板状腹", default: true, text: "腹肌稍紧张而非板状腹，肝浊音界存在，立位腹平片未见膈下游离气体，不支持消化性溃疡穿孔" },
        { id: "neg_5", label: "无突发刀割样腹痛", default: true, text: "腹痛为转移性右下腹痛而非突发上腹刀割样剧痛，不支持消化性溃疡穿孔" }
    ],

    "胆囊结石伴急性胆囊炎": [
        { id: "neg_1", label: "无Charcot三联征", default: true, text: "无寒战高热，无皮肤巩膜黄染，无Charcot三联征，不支持急性胆管炎" },
        { id: "neg_2", label: "无板状腹", default: true, text: "上腹部无突发刀割样剧痛，腹肌柔软无板状腹，不支持消化性溃疡穿孔" },
        { id: "neg_3", label: "肝浊音界存在", default: true, text: "肝浊音界存在，无缩小或消失，立位腹平片未见膈下游离气体，不支持消化性溃疡穿孔" },
        { id: "neg_4", label: "无腰背放射痛", default: true, text: "无向腰背部放射的左上腹持续性剧痛，血淀粉酶正常，不支持急性胰腺炎" },
        { id: "neg_5", label: "左上腹无深压痛", default: true, text: "左上腹无深压痛及叩击痛，CT未提示胰腺渗出，不支持急性胰腺炎" }
    ],

    "胆总管结石": [
        { id: "neg_1", label: "无进行性无痛性黄疸", default: true, text: "黄疸呈阵发性伴腹痛发热，而非进行性无痛性加深，不支持壶腹部肿瘤" },
        { id: "neg_2", label: "腹部未触及包块", default: true, text: "腹部未触及包块，无胆囊进行性无痛性肿大（Courvoisier征阴性），不支持壶腹部肿瘤" },
        { id: "neg_3", label: "无恶病质", default: true, text: "无消瘦、乏力等恶病质表现，肿瘤标志物正常，不支持壶腹部肿瘤" },
        { id: "neg_4", label: "无腰背放射痛", default: true, text: "无向腰背部放射的左上腹持续性剧痛，血淀粉酶正常，不支持急性胰腺炎" },
        { id: "neg_5", label: "上腹正中无深压痛", default: true, text: "上腹部正中无深压痛，CT未提示胰腺渗出及周围渗出，不支持急性胰腺炎" }
    ],

    "急性胆管炎": [
        { id: "neg_1", label: "无腰背放射痛", default: true, text: "无向腰背部放射的左上腹持续性剧痛，血淀粉酶正常，不支持急性胰腺炎" },
        { id: "neg_2", label: "肝区无波动感包块", default: true, text: "肝区未触及波动感包块，肝脏未触及肿大，B超及CT未提示肝内占位，不支持肝脓肿" },
        { id: "neg_3", label: "无右季肋区隆起", default: true, text: "无右季肋区局限性隆起及皮肤凹陷性水肿，不支持肝脓肿" },
        { id: "neg_4", label: "腹部未触及包块", default: true, text: "腹部未触及包块，影像学未提示肝内占位性病变，不支持肝脓肿" },
        { id: "neg_5", label: "无恶病质", default: true, text: "无消瘦、恶病质表现，黄疸伴发热寒战而非进行性无痛性，不支持壶腹部肿瘤" }
    ],

    "甲状腺结节": [
        { id: "neg_1", label: "无突眼及手抖", default: true, text: "无突眼征，无手震颤，无心悸、多汗、消瘦，甲状腺功能正常，不支持甲状腺功能亢进" },
        { id: "neg_2", label: "甲状腺无弥漫性肿大", default: true, text: "甲状腺无弥漫性肿大，抗体无明显升高，不支持甲状腺炎" },
        { id: "neg_3", label: "甲状腺区无红肿", default: true, text: "甲状腺区皮肤无红肿，皮温正常，无甲状腺区疼痛及发热，不支持亚急性甲状腺炎" },
        { id: "neg_4", label: "结节无固定", default: true, text: "结节边界清楚，无侵犯周围组织征象，随吞咽上下活动，不支持甲状腺癌侵犯周围组织" },
        { id: "neg_5", label: "无声嘶", default: true, text: "无声嘶，声带活动正常，无喉返神经受累征象，不支持甲状腺癌侵犯喉返神经" }
    ],

    "急性乳腺炎": [
        { id: "neg_1", label: "无橘皮样改变", default: true, text: "乳房皮肤无弥漫性浸润变硬，无橘皮样改变，不支持炎性乳腺癌" },
        { id: "neg_2", label: "未触及质硬实性肿块", default: true, text: "未触及质硬、边界不清、活动度差的实性肿块，B超提示液性暗区而非实性占位，不支持炎性乳腺癌" },
        { id: "neg_3", label: "无乳头血性溢液", default: true, text: "挤压乳头未见血性溢液，不支持乳腺癌" },
        { id: "neg_4", label: "无锁骨上淋巴结肿大", default: true, text: "锁骨上淋巴结未触及肿大，不支持乳腺癌淋巴结转移" },
        { id: "neg_5", label: "未触及质韧活动肿块", default: true, text: "未触及边界清楚、质韧、活动度好的实性肿块，B超声像符合脓肿而非实性良性肿瘤，不支持乳腺纤维腺瘤合并感染" }
    ],

    "腹股沟疝": [
        { id: "neg_1", label: "阴囊内睾丸在位", default: true, text: "同侧阴囊内可触及睾丸，大小质地正常，不支持隐睾" },
        { id: "neg_2", label: "包块无囊性波动感", default: true, text: "包块无囊性波动感，透光试验阴性，B超提示为疝内容物而非液性暗区，不支持鞘膜积液" },
        { id: "neg_3", label: "无韧带下方半球形隆起", default: true, text: "无腹股沟韧带下方半球形隆起，包块位于腹股沟韧带上方，还纳后压住深环口不再突出，不支持股疝" },
        { id: "neg_4", label: "无红肿热痛", default: true, text: "腹股沟区无红肿热痛及压痛，包块可还纳，无嵌顿及绞窄征象，不支持嵌顿性/绞窄性疝" },
        { id: "neg_5", label: "无进行性增大", default: true, text: "包块无进行性增大及囊性感，平卧可还纳，不支持交通性鞘膜积液" }
    ],

    "消化性溃疡穿孔": [
        { id: "neg_1", label: "无腰背放射痛", default: true, text: "无向腰背部放射的左上腹持续性剧痛，血淀粉酶无明显升高，不支持急性胰腺炎" },
        { id: "neg_2", label: "无转移性右下腹痛", default: true, text: "腹痛为突发上腹刀割样剧痛迅速波及全腹，非转移性右下腹痛，不支持急性阑尾炎穿孔" },
        { id: "neg_3", label: "无右肩背放射痛", default: true, text: "无右肩背部放射痛，无胆囊结石病史，不支持急性胆囊炎穿孔" },
        { id: "neg_4", label: "无会阴放射痛", default: true, text: "无阵发性腰部绞痛向会阴部放射，不支持输尿管结石" },
        { id: "neg_5", label: "无肉眼血尿", default: true, text: "无肉眼血尿，尿常规未见明显红细胞，不支持输尿管结石" }
    ],

    "乳腺癌": [
        { id: "neg_1", label: "局部无红肿热痛", default: true, text: "肿块局部无红肿热痛，皮温不高，无发热，不支持乳腺炎" },
        { id: "neg_2", label: "未触及波动感", default: true, text: "未触及波动感，B超未见液性暗区，不支持乳腺脓肿" },
        { id: "neg_3", label: "肿块非多发", default: true, text: "肿块为单发，不随月经周期变化，无周期性胀痛，不支持乳腺增生症" },
        { id: "neg_4", label: "未触及质韧活动肿块", default: true, text: "未触及质韧、边界清楚、活动度好的肿块，BI-RADS分类较高，不支持乳腺纤维腺瘤" },
        { id: "neg_5", label: "无乳头血性溢液", default: true, text: "无自发性乳头血性溢液，不支持导管内乳头状瘤恶变" }
    ],

    "混合痔": [
        { id: "neg_1", label: "无肛门撕裂痛", default: true, text: "无排便时肛门撕裂样疼痛，不支持肛裂" },
        { id: "neg_2", label: "肛管无溃疡", default: true, text: "肛管皮肤无溃疡及前哨痔，不支持肛裂" },
        { id: "neg_3", label: "无黏液脓血便", default: true, text: "无黏液脓血便，出血为鲜红色便后滴血，不支持直肠癌及炎症性肠病" },
        { id: "neg_4", label: "直肠未触及肿物", default: true, text: "直肠未触及菜花样或溃疡型肿物，肠镜未见占位性病变，不支持直肠癌" },
        { id: "neg_5", label: "未触及带蒂肿物", default: true, text: "未触及带蒂息肉样肿物，肠镜未见息肉样隆起，不支持直肠息肉" }
    ],

    "结直肠癌": [
        { id: "neg_1", label: "无便后滴血", default: true, text: "无鲜红色便后滴血及肛门肿物脱出，出血为暗红色血与粪便混合，不支持痔疮" },
        { id: "neg_2", label: "无黏液脓血便", default: true, text: "无黏液脓血便伴里急后重，肠镜见菜花/溃疡型肿物而非弥漫性炎症，不支持溃疡性结肠炎" },
        { id: "neg_3", label: "无痔核脱出", default: true, text: "无肛周痔核脱出，肛门镜未见齿状线附近痔核为主病变，不支持痔疮" },
        { id: "neg_4", label: "未触及带蒂肿物", default: true, text: "肛门指检及肠镜未触及带蒂质软息肉样肿物，活检为腺癌，不支持肠息肉" },
        { id: "neg_5", label: "无腹泻便秘交替", default: true, text: "无腹泻与便秘交替伴黏液便，肠镜所见为肿物而非弥漫性炎症，不支持溃疡性结肠炎" }
    ],

    "胃癌": [
        { id: "neg_1", label: "腹痛无节律性", default: true, text: "上腹痛无节律性，非餐后或空腹规律性发作，无周期性缓解复发，胃镜见溃疡型肿物，不支持胃溃疡" },
        { id: "neg_2", label: "无反酸嗳气", default: true, text: "无明显反酸嗳气及烧心，伴消瘦、贫血，胃镜见肿物，不支持慢性胃炎" },
        { id: "neg_3", label: "无周期性缓解", default: true, text: "腹痛呈进行性加重，无周期性缓解与复发，活检为腺癌，不支持胃溃疡" },
        { id: "neg_4", label: "无浅表淋巴结肿大", default: true, text: "无全身浅表淋巴结肿大，活检病理为腺癌而非淋巴瘤，不支持胃淋巴瘤" },
        { id: "neg_5", label: "无呕血黑便", default: true, text: "无上消化道大出血及呕血黑便表现，不支持溃疡出血" }
    ],

    "闭合性腹部损伤": [
        { id: "neg_1", label: "肝浊音界存在", default: true, text: "肝浊音界存在，无缩小或消失，立位腹平片未见膈下游离气体，不支持空腔脏器穿孔" },
        { id: "neg_2", label: "骨盆挤压分离试验阴性", default: true, text: "骨盆挤压分离试验阴性，骨盆X线未见骨折，不支持骨盆骨折" },
        { id: "neg_3", label: "无肉眼血尿", default: true, text: "无肉眼血尿，尿常规未见明显红细胞，不支持泌尿系损伤" },
        { id: "neg_4", label: "胸廓挤压征阴性", default: true, text: "胸廓挤压征阴性，胸部CT未见肋骨骨折，不支持肋骨骨折" },
        { id: "neg_5", label: "无下肢感觉运动障碍", default: true, text: "无下肢感觉运动障碍，脊柱无压痛及叩击痛，不支持脊柱脊髓损伤" }
    ],

    "脾破裂": [
        { id: "neg_1", label: "右上腹无压痛", default: true, text: "右上腹无压痛，肝区无叩击痛，CT示肝脏未见损伤，不支持肝破裂" },
        { id: "neg_2", label: "无肉眼血尿", default: true, text: "无肉眼血尿，尿常规未见明显红细胞，CT示肾脏未见损伤，不支持左肾挫裂伤" },
        { id: "neg_3", label: "右肾区无叩击痛", default: true, text: "右肾区无叩击痛，CT未见右肾损伤，不支持右肾损伤" },
        { id: "neg_4", label: "无胸壁反常呼吸", default: true, text: "无胸壁反常呼吸运动，CT未见连枷胸，不支持严重肋骨骨折合并连枷胸" },
        { id: "neg_5", label: "无胸部皮下气肿", default: true, text: "胸部未触及皮下气肿，无气管偏移，CT未见张力性气胸，不支持张力性气胸为主要诊断" }
    ],

    "股骨颈骨折": [
        { id: "neg_1", label: "无屈曲内收内旋畸形", default: true, text: "患肢无屈曲、内收、内旋畸形，X线示股骨头未脱出髋臼，不支持髋关节后脱位" },
        { id: "neg_2", label: "大转子处无显著肿胀", default: true, text: "大转子处无显著肿胀及广泛瘀斑，压痛以腹股沟中点为主，不支持股骨转子间骨折" },
        { id: "neg_3", label: "外旋角度小于90°", default: true, text: "患肢外旋角度约45-60°，非90°外旋畸形，X线示骨折线在股骨颈而非转子间，不支持股骨转子间骨折" },
        { id: "neg_4", label: "骨盆挤压分离试验阴性", default: true, text: "骨盆挤压分离试验阴性，骨盆X线未见骨折，不支持骨盆骨折" },
        { id: "neg_5", label: "无原发肿瘤征象", default: true, text: "全身未触及肿块，无原发肿瘤病史，X线未见骨质破坏征象，不支持病理性骨折" }
    ],

    "腰椎压缩性骨折": [
        { id: "neg_1", label: "直腿抬高试验阴性", default: true, text: "直腿抬高试验阴性，无下肢放射痛，不支持腰椎间盘突出症" },
        { id: "neg_2", label: "无神经根分布区感觉减退", default: true, text: "无神经根分布区感觉减退及肌力下降，无神经定位体征，不支持腰椎间盘突出症" },
        { id: "neg_3", label: "腰背部无冷脓肿", default: true, text: "腰背部未触及包块及冷脓肿，无低热盗汗等结核中毒症状，MRI未见椎间隙狭窄及椎体破坏，不支持腰椎结核" },
        { id: "neg_4", label: "无后凸畸形进行性加重", default: true, text: "无脊柱后凸畸形进行性加重，MRI未见椎体骨质破坏及软组织肿块，不支持脊柱转移瘤病理性骨折" },
        { id: "neg_5", label: "无夜间静息痛", default: true, text: "无夜间痛及静息痛，MRI示骨髓水肿信号符合新鲜外伤性骨折，不支持脊柱转移瘤病理性骨折" }
    ],

    "肋骨骨折合并血气胸": [
        { id: "neg_1", label: "无广泛皮下气肿", default: true, text: "无广泛皮下气肿及气管偏移，无颈静脉怒张，不支持张力性气胸" },
        { id: "neg_2", label: "无明显咯血", default: true, text: "无明显咯血，CT肺挫伤不明显，以肋骨骨折合并血气胸为主要表现，不支持严重肺挫伤为主要诊断" },
        { id: "neg_3", label: "对侧胸壁无压痛", default: true, text: "对侧胸壁无压痛及骨擦感，胸廓挤压征阴性，不支持对侧肋骨骨折" },
        { id: "neg_4", label: "腹部无压痛反跳痛", default: true, text: "腹部无压痛及反跳痛，腹部CT未见脏器损伤，不支持合并腹部损伤" },
        { id: "neg_5", label: "无胸壁开放性伤口", default: true, text: "胸壁皮肤完整无开放性伤口，不支持开放性气胸" }
    ],

    "肋骨骨折": [
        { id: "neg_1", label: "胸部叩诊清音", default: true, text: "胸部叩诊呈清音，无鼓音及浊音，胸部CT未见气胸及胸腔积液，不支持肋骨骨折合并血气胸" },
        { id: "neg_2", label: "无皮下气肿", default: true, text: "无皮下气肿，无气管偏移，不支持气胸" },
        { id: "neg_3", label: "无呼吸困难发绀", default: true, text: "无胸闷气促、呼吸困难及发绀，SpO₂正常，不支持血气胸" },
        { id: "neg_4", label: "压痛位于肋骨体部", default: true, text: "压痛部位位于肋骨体部而非肋软骨交界处，X线可见明确骨折线，不支持肋软骨损伤" },
        { id: "neg_5", label: "无开放性伤口", default: true, text: "胸壁皮肤完整无破损及开放性伤口，不支持开放性气胸及开放性肋骨骨折" }
    ],

    "桡骨远端骨折": [
        { id: "neg_1", label: "鼻烟窝无压痛", default: true, text: "鼻烟窝无压痛，X线未见舟骨骨折，不支持腕骨骨折（舟骨骨折）" },
        { id: "neg_2", label: "尺骨骨干无压痛", default: true, text: "尺骨骨干无明显压痛及畸形，X线未见尺骨干骨折，不支持尺骨骨折/前臂双骨折" },
        { id: "neg_3", label: "腕关节无弹性固定", default: true, text: "腕关节无弹性固定，X线示腕骨排列正常，不支持腕关节脱位" },
        { id: "neg_4", label: "腕部无开放性伤口", default: true, text: "腕部皮肤完整，无开放性伤口，不支持开放性骨折" },
        { id: "neg_5", label: "无正中神经损伤征象", default: true, text: "手指感觉运动正常，无正中神经支配区感觉减退及麻木，不支持正中神经损伤" }
    ],

    "锁骨骨折": [
        { id: "neg_1", label: "肩锁关节无压痛", default: true, text: "{side}肩锁关节无压痛，锁骨远端无翘起，肩锁关节间隙无增宽，不支持肩锁关节脱位" },
        { id: "neg_2", label: "Dugas征阴性", default: true, text: "Dugas征阴性，{side}肩关节无方肩畸形，未触及脱出之肱骨头，不支持肩关节脱位" },
        { id: "neg_3", label: "胸锁关节无压痛", default: true, text: "{side}胸锁关节无压痛及异常隆起，不支持胸锁关节脱位" },
        { id: "neg_4", label: "肩关节无弹性固定", default: true, text: "{side}肩关节无弹性固定，被动活动无弹性回缩感，不支持肩关节脱位" }
    ],

    "胫骨骨折": [
        { id: "neg_1", label: "踝关节无压痛", default: true, text: "{side}踝关节间隙无压痛，无踝关节异常活动，不支持踝关节骨折" },
        { id: "neg_2", label: "膝关节无损伤", default: true, text: "{side}膝关节间隙无压痛，无韧带松弛及关节不稳定，不支持膝关节损伤" },
        { id: "neg_3", label: "无被动牵拉痛", default: true, text: "{side}小腿无被动牵拉痛，无进行性肿胀及筋膜间室张力增高，不支持骨筋膜室综合征" },
        { id: "neg_4", label: "无进行性加重", default: true, text: "{side}下肢感觉及末梢血运无进行性加重，无皮肤张力进行性增高，不支持骨筋膜室综合征" }
    ],

    "肱骨骨折": [
        { id: "neg_1", label: "Dugas征阴性", default: true, text: "Dugas征阴性，{side}肩关节无方肩畸形，不支持肩关节脱位" },
        { id: "neg_2", label: "肘关节无脱位", default: true, text: "{side}肘后三角关系正常，肘关节无直接压痛，不支持肘关节脱位" },
        { id: "neg_3", label: "髁上无压痛", default: true, text: "{side}肱骨髁上无压痛，骨折线不在髁上部，不支持肱骨髁上骨折" },
        { id: "neg_4", label: "肩关节无弹性固定", default: true, text: "{side}肩关节无弹性固定，未触及脱出之肱骨头，不支持肩关节脱位" }
    ],

    "腰椎间盘突出症": [
        { id: "neg_1", label: "无间歇性跛行", default: true, text: "无间歇性跛行，行走距离无明显受限，不支持腰椎管狭窄症" },
        { id: "neg_2", label: "梨状肌无压痛", default: true, text: "{side}臀部梨状肌体表投影区无压痛，不支持梨状肌综合征" },
        { id: "neg_3", label: "无夜间痛", default: true, text: "无夜间痛，无明显体重下降及全身消耗症状，不支持腰椎肿瘤" },
        { id: "neg_4", label: "无马尾综合征", default: true, text: "无会阴部麻木及大小便功能障碍，不支持马尾综合征" }
    ],

    "肱骨髁上骨折（儿童）": [
        { id: "neg_1", label: "外髁无压痛", default: true, text: "{side}肱骨外髁无压痛，骨折线不在外髁，不支持肱骨外髁骨折" },
        { id: "neg_2", label: "桡骨小头无压痛", default: true, text: "{side}桡骨小头无压痛，无上肢牵拉史，不支持桡骨小头半脱位" },
        { id: "neg_3", label: "肘关节无弹性固定", default: true, text: "{side}肘关节无弹性固定，肘后三角关系正常，不支持肘关节脱位" },
        { id: "neg_4", label: "X线无脱位征象", default: true, text: "X线未见尺桡骨向前后脱位征象，不支持肘关节脱位" }
    ],

    "泌尿系结石": [
        { id: "neg_1", label: "右下腹无压痛", default: true, text: "右下腹无压痛及反跳痛，非转移性右下腹痛，不支持急性阑尾炎" },
        { id: "neg_2", label: "Murphy征阴性", default: true, text: "无右上腹绞痛向右肩背放射，Murphy征阴性，不支持急性胆囊炎" },
        { id: "neg_3", label: "无全程无痛性血尿", default: true, text: "无全程无痛性肉眼血尿，不支持泌尿系肿瘤" },
        { id: "neg_4", label: "腹部未触及包块", default: true, text: "{side}侧腹部未触及包块，不支持泌尿系肿瘤" }
    ],

    "良性前列腺增生": [
        { id: "neg_1", label: "前列腺无结节", default: true, text: "前列腺表面光滑无结节，质地韧而非坚硬，PSA在正常范围内，不支持前列腺癌" },
        { id: "neg_2", label: "无尿道外伤史", default: true, text: "无尿道外伤及炎症病史，排尿困难为进行性发展伴夜尿增多，不支持尿道狭窄" },
        { id: "neg_3", label: "无膀胱颈梗阻", default: true, text: "肛门指检前列腺增大突入膀胱，B超未见膀胱颈增厚及挛缩，不支持膀胱颈梗阻" },
        { id: "neg_4", label: "无神经源性膀胱", default: true, text: "无神经系统病变，不伴感觉及运动功能障碍，不支持神经源性膀胱" }
    ],

    "自发性气胸": [
        { id: "neg_1", label: "心电图无异常", default: true, text: "心电图无ST-T改变，无病理性Q波，心肌酶谱正常，不支持急性心肌梗死" },
        { id: "neg_2", label: "无咯血", default: true, text: "无咯血及晕厥，无深静脉血栓高危因素，D-二聚体无明显升高，不支持肺栓塞" },
        { id: "neg_3", label: "双侧血压对称", default: true, text: "血压正常，双侧血压对称，无双侧血压不对称，不支持主动脉夹层" },
        { id: "neg_4", label: "无纵隔增宽", default: true, text: "胸部X线未见纵隔增宽，不支持主动脉夹层" }
    ],

    "肺癌": [
        { id: "neg_1", label: "无结核中毒症状", default: true, text: "无午后低热、盗汗、消瘦等结核中毒症状，不支持肺结核球" },
        { id: "neg_2", label: "无感染史", default: true, text: "无近期呼吸道感染史，CT未见斑片状渗出影，不支持肺部炎性假瘤" },
        { id: "neg_3", label: "无爆米花样钙化", default: true, text: "CT未见爆米花样钙化，肿块有分叶毛刺及胸膜牵拉，不支持肺错构瘤" },
        { id: "neg_4", label: "无卫星灶", default: true, text: "CT未见钙化及卫星灶，不支持肺结核球" }
    ],

    "膝关节半月板损伤": [
        { id: "neg_1", label: "髌骨研磨试验阴性", default: true, text: "右膝髌骨研磨试验阴性，不支持髌骨软化症" },
        { id: "neg_2", label: "无内外翻畸形", default: true, text: "右膝关节无明显内外翻畸形，不支持膝关节骨关节炎" },
        { id: "neg_3", label: "无晨僵", default: true, text: "无晨僵及多关节对称性受累，不支持类风湿关节炎" },
        { id: "neg_4", label: "无发热", default: true, text: "无发热及寒战，不支持化脓性关节炎" },
        { id: "neg_5", label: "无骨干骨折征象", default: true, text: "右下肢无短缩及旋转畸形，胫骨干无压痛及异常活动，不支持胫骨骨折" }
    ],

    "骨关节炎（膝关节）": [
        { id: "neg_1", label: "麦氏试验阴性", default: true, text: "右膝麦氏试验阴性，无明显关节交锁感，不支持半月板损伤" },
        { id: "neg_2", label: "无晨僵", default: true, text: "无晨僵及多关节对称性受累，不支持类风湿关节炎" },
        { id: "neg_3", label: "无痛风征象", default: true, text: "无第一跖趾关节红肿热痛，无痛风石，不支持痛风性关节炎" },
        { id: "neg_4", label: "无发热", default: true, text: "无发热及寒战，不支持化脓性关节炎" },
        { id: "neg_5", label: "无窦道", default: true, text: "关节周围无窦道及流脓，不支持膝关节结核" }
    ],

    "急性骨髓炎": [
        { id: "neg_1", label: "关节间隙无压痛", default: true, text: "右膝关节间隙无压痛，关节无明显肿胀积液，不支持化脓性关节炎" },
        { id: "neg_2", label: "无恶性骨肿瘤征象", default: true, text: "无其他部位骨痛及肿块，无全身淋巴结肿大，不支持恶性骨肿瘤" },
        { id: "neg_3", label: "无远处感染灶", default: true, text: "未发现皮肤、呼吸道等远处感染灶，不支持转移性感染" },
        { id: "neg_4", label: "无对称性受累", default: true, text: "无对称性多关节受累，不支持系统性免疫疾病" }
    ],

    "食管癌": [
        { id: "neg_1", label: "无化学物吞服史", default: true, text: "无腐蚀性化学物吞服史及长期反流性食管炎病史，不支持食管良性狭窄" },
        { id: "neg_2", label: "无鸟嘴样狭窄", default: true, text: "X线造影未见食管下端鸟嘴样狭窄，不支持贲门失弛缓症" },
        { id: "neg_3", label: "非黏膜下隆起", default: true, text: "胃镜见菜花样隆起而非黏膜下隆起，表面不光滑，活检为鳞癌，不支持食管平滑肌瘤" },
        { id: "neg_4", label: "非间歇性发作", default: true, text: "吞咽困难呈进行性加重，非间歇性发作，不支持贲门失弛缓症" }
    ],

    "胸主动脉瘤": [
        { id: "neg_1", label: "非撕裂样疼痛", default: true, text: "疼痛为持续性钝痛非撕裂样，无双侧血压不对称，不支持主动脉夹层" },
        { id: "neg_2", label: "心电图无动态改变", default: true, text: "心电图无ST-T动态演变，心肌酶谱正常，不支持急性心肌梗死" },
        { id: "neg_3", label: "无呼吸困难及咯血", default: true, text: "无呼吸困难及咯血，D-二聚体无明显升高，不支持肺栓塞" },
        { id: "neg_4", label: "腹部无血管杂音", default: true, text: "腹部未闻及血管杂音，不支持合并腹主动脉瘤" }
    ],

    "纵隔肿瘤（胸腺瘤）": [
        { id: "neg_1", label: "无脂肪及钙化", default: true, text: "CT示密度均匀的软组织影，无脂肪及钙化成分，不支持畸胎瘤" },
        { id: "neg_2", label: "无全身症状", default: true, text: "无发热、消瘦、盗汗等全身症状，非多发淋巴结肿大融合，不支持淋巴瘤" },
        { id: "neg_3", label: "与甲状腺不连续", default: true, text: "病变位于前纵隔胸骨后方，与颈部甲状腺不连续，不支持胸骨后甲状腺肿" },
        { id: "neg_4", label: "无肌无力", default: true, text: "无眼睑下垂及肌无力表现，不伴重症肌无力" }
    ],

    "肺大疱": [
        { id: "neg_1", label: "心电图正常", default: true, text: "心电图无ST-T动态演变，心肌酶谱正常，不支持急性心肌梗死" },
        { id: "neg_2", label: "无咯血", default: true, text: "无咯血，无下肢深静脉血栓病史，D-二聚体无明显升高，不支持肺栓塞" },
        { id: "neg_3", label: "非撕裂样疼痛", default: true, text: "疼痛为针刺样与呼吸相关，非撕裂样，CT未见主动脉异常，不支持主动脉夹层" },
        { id: "neg_4", label: "无放射痛", default: true, text: "无大汗及濒死感，无左肩及左上肢放射痛，不支持急性心肌梗死" }
    ],

    "胸部外伤（肋骨骨折合并血气胸）": [
        { id: "neg_1", label: "胸骨无压痛", default: true, text: "胸骨无压痛及反常呼吸，胸部CT未提示胸骨骨折，不支持胸骨骨折" },
        { id: "neg_2", label: "无膈疝征象", default: true, text: "胸部CT未见膈肌破裂及腹腔脏器疝入胸腔，胸部未闻及肠鸣音，不支持创伤性膈疝" },
        { id: "neg_3", label: "无心律失常", default: true, text: "无心悸及心律失常，心电图仅示窦性心动过速，不支持心脏挫伤" },
        { id: "neg_4", label: "腹部无压痛", default: true, text: "腹平软，全腹无压痛及反跳痛，不伴腹腔脏器损伤" }
    ],

    "前列腺癌": [
        { id: "neg_1", label: "前列腺无压痛", default: true, text: "前列腺无压痛，不支持急性前列腺炎" },
        { id: "neg_2", label: "无前列腺脓肿", default: true, text: "前列腺未触及波动感及囊性包块，不支持前列腺脓肿" },
        { id: "neg_3", label: "无结核征象", default: true, text: "无泌尿系结核病史，前列腺未触及干酪样坏死及窦道，不支持前列腺结核" },
        { id: "neg_4", label: "直肠壁正常", default: true, text: "未触及直肠壁异常，无直肠肿瘤侵犯前列腺征象" }
    ],

    "膀胱癌": [
        { id: "neg_1", label: "膀胱区无压痛", default: true, text: "耻骨上膀胱区无压痛，无尿频尿急尿痛，不支持膀胱炎" },
        { id: "neg_2", label: "前列腺不大", default: true, text: "前列腺不大，未触及结节，不支持前列腺增生及前列腺癌" },
        { id: "neg_3", label: "输尿管无压痛", default: true, text: "双侧输尿管走行区无压痛，无肾绞痛发作史，不支持输尿管结石" },
        { id: "neg_4", label: "无结核征象", default: true, text: "无泌尿系结核病史，无脓尿，不支持泌尿系结核" }
    ],

    "肾肿瘤（肾细胞癌）": [
        { id: "neg_1", label: "输尿管无压痛", default: true, text: "双侧输尿管走行区无压痛，无肾绞痛发作史，不支持泌尿系结石" },
        { id: "neg_2", label: "无结核征象", default: true, text: "无低热、盗汗、消瘦等结核中毒症状，无脓尿，不支持肾结核" },
        { id: "neg_3", label: "对侧肾正常", default: true, text: "对侧肾区无叩击痛，未触及包块，不支持双侧肾病变" },
        { id: "neg_4", label: "膀胱区无异常", default: true, text: "耻骨上膀胱区无压痛及充盈，不伴膀胱受累" }
    ],

    "睾丸扭转": [
        { id: "neg_1", label: "无发热", default: true, text: "无发热，体温正常，不支持急性附睾炎等感染性疾病" },
        { id: "neg_2", label: "无尿路刺激征", default: true, text: "无尿频、尿急、尿痛等尿路刺激症状，不支持附睾炎" },
        { id: "neg_3", label: "阴囊无蓝点征", default: true, text: "阴囊皮肤未见蓝点征，不支持睾丸附件扭转" },
        { id: "neg_4", label: "阴囊皮肤无红肿", default: true, text: "阴囊皮肤无红肿及皮温升高，不支持急性附睾炎、睾丸炎" },
        { id: "neg_5", label: "尿常规无异常", default: true, text: "尿常规未见白细胞及细菌增多，不支持尿路感染继发附睾炎" },
        { id: "neg_6", label: "疼痛剧烈且突然", default: true, text: "起病急骤、疼痛剧烈，非附睾炎之渐进性起病特点，间接排除附睾炎" }
    ],

    "睾丸炎": [
        { id: "neg_1", label: "睾丸位置正常", default: true, text: "睾丸位置正常，未触及睾丸横位上移，不支持睾丸扭转" },
        { id: "neg_2", label: "提睾反射存在", default: true, text: "提睾反射存在，未消失，不支持睾丸扭转" },
        { id: "neg_3", label: "无腹股沟包块", default: true, text: "阴囊内及腹股沟区未触及不能还纳的包块，不支持腹股沟嵌顿疝" },
        { id: "neg_4", label: "无肠梗阻表现", default: true, text: "无恶心呕吐、腹胀及停止排气排便等肠梗阻表现，不支持嵌顿疝" },
        { id: "neg_5", label: "彩超血流增多", default: true, text: "阴囊彩超示睾丸血流信号增多而非减少，未见睾丸血流缺失，不支持睾丸扭转" }
    ],

    "精索静脉曲张": [
        { id: "neg_1", label: "未触及精索实性肿物", default: true, text: "精索区未触及实性肿物，不支持精索肿瘤" },
        { id: "neg_2", label: "附睾睾丸正常", default: true, text: "双侧睾丸及附睾大小形态正常，未触及结节及压痛，不支持附睾炎、附睾结核" },
        { id: "neg_3", label: "阴囊无红肿", default: true, text: "阴囊皮肤无红肿、皮温升高及触痛，不支持急性阴囊感染" },
        { id: "neg_4", label: "透光试验阴性", default: true, text: "阴囊透光试验阴性，不支持鞘膜积液" },
        { id: "neg_5", label: "平卧可缩小", default: true, text: "平卧后曲张静脉团缩小或部分消失，支持原发性曲张，间接排除腹膜后肿瘤压迫所致继发性曲张" },
        { id: "neg_6", label: "无腹膜后占位", default: true, text: "腹部未触及腹膜后肿块，影像学未见腹膜后占位压迫征象，排除继发性精索静脉曲张" }
    ],

    "肛周脓肿": [
        { id: "neg_1", label: "未见瘘管外口", default: true, text: "肛周未见瘘管外口，不支持肛瘘" },
        { id: "neg_2", label: "未触及条索状瘘管", default: true, text: "肛门指诊未触及条索状硬结通向直肠，不支持肛瘘" },
        { id: "neg_3", label: "无反复流脓史", default: true, text: "无肛旁反复流脓病史，本次为急性起病，不支持肛瘘" },
        { id: "neg_4", label: "无多发皮下脓肿", default: true, text: "肛周未触及多发性皮下小脓肿，不支持化脓性汗腺炎" },
        { id: "neg_5", label: "骶尾部无瘘口", default: true, text: "骶尾部臀间裂未见瘘口及窦道，不支持藏毛窦" }
    ],

    "肛瘘": [
        { id: "neg_1", label: "无急性红肿波动", default: true, text: "肛周无急性红肿热痛及波动感，不支持肛周脓肿急性期" },
        { id: "neg_2", label: "无急性发热", default: true, text: "无急性发热及全身中毒症状，不支持肛周脓肿急性发作" },
        { id: "neg_3", label: "骶尾部无瘘口", default: true, text: "骶尾部臀间裂未见瘘口，且瘘管与肛管相通，不支持藏毛窦" },
        { id: "neg_4", label: "无多发皮下脓肿", default: true, text: "肛周未见多发性皮下脓肿及瘘管，瘘管与肛管相通，不支持化脓性汗腺炎" },
        { id: "neg_5", label: "直肠未触及肿物", default: true, text: "直肠指诊及腔内超声未触及直肠肿物，排除直肠肿瘤继发瘘管" }
    ],

    "臀脓肿": [
        { id: "neg_1", label: "肛门指诊无异常", default: true, text: "肛门指诊未触及压痛性隆起，肛周区无红肿压痛，不支持肛周脓肿" },
        { id: "neg_2", label: "未触及实性包块", default: true, text: "局部未触及实性包块，穿刺抽出脓液，不支持脂肪瘤感染" },
        { id: "neg_3", label: "急性起病", default: true, text: "病程为急性起病，无长期臀部肿块病史，不支持脂肪瘤感染" },
        { id: "neg_4", label: "B超示液性暗区", default: true, text: "B超提示皮下液性暗区而非实性肿块，不支持脂肪瘤及实性肿瘤" },
        { id: "neg_5", label: "髋关节无骨性阻挡", default: true, text: "髋关节被动活动无骨性阻挡，活动受限系疼痛所致，排除髋关节病变" }
    ],

    "下肢静脉曲张": [
        { id: "neg_1", label: "未触及震颤", default: true, text: "患肢未触及局部震颤，不支持动静脉瘘" },
        { id: "neg_2", label: "未闻及血管杂音", default: true, text: "患肢未闻及血管杂音，不支持动静脉瘘" },
        { id: "neg_3", label: "皮温正常", default: true, text: "患肢皮温正常，无异常升高，不支持动静脉瘘" },
        { id: "neg_4", label: "无DVT病史", default: true, text: "无深静脉血栓病史，深静脉彩超未见血栓形成，不支持血栓形成后综合征" },
        { id: "neg_5", label: "深静脉瓣膜正常", default: true, text: "深静脉彩超未见深静脉瓣膜反流，Perthes试验阴性，不支持原发性下肢深静脉瓣膜功能不全" },
        { id: "neg_6", label: "无急性肿胀疼痛", default: true, text: "无下肢急性肿胀、疼痛及股青肿表现，不支持急性深静脉血栓形成" }
    ],

    "甲状腺癌": [
        { id: "neg_1", label: "无弥漫性甲状腺肿大", default: true, text: "甲状腺未触及弥漫性肿大，不支持甲状腺炎" },
        { id: "neg_2", label: "甲状腺功能正常", default: true, text: "甲状腺功能检查正常，无甲亢或甲减表现，不支持甲状腺炎" },
        { id: "neg_3", label: "自身抗体阴性", default: true, text: "甲状腺自身抗体（TPOAb、TgAb）阴性，不支持桥本甲状腺炎" },
        { id: "neg_4", label: "未触及多发结节", default: true, text: "甲状腺未触及多个结节，超声未见多发结节伴完整声晕，不支持结节性甲状腺肿" },
        { id: "neg_5", label: "颈部无血管杂音", default: true, text: "颈部未闻及血管杂音，无甲亢高代谢症状，不支持毒性结节性甲状腺肿" },
        { id: "neg_6", label: "结节无完整声晕", default: true, text: "结节无声晕完整、边界清楚、表面光滑等良性征象，不支持甲状腺腺瘤" }
    ],

    "肝癌": [
        { id: "neg_1", label: "无发热寒战", default: true, text: "无发热寒战等感染中毒症状，不支持肝脓肿" },
        { id: "neg_2", label: "白细胞正常", default: true, text: "血常规白细胞及中性粒细胞正常，不支持肝脓肿" },
        { id: "neg_3", label: "CT无液性暗区", default: true, text: "腹部CT未见液性暗区及脓肿壁环形强化，不支持肝脓肿" },
        { id: "neg_4", label: "无多发占位", default: true, text: "肝脏未触及多发结节，影像学为单发占位，不支持肝转移瘤" },
        { id: "neg_5", label: "无原发肿瘤病史", default: true, text: "无其他原发恶性肿瘤病史，不支持肝转移瘤" },
        { id: "neg_6", label: "无牛眼征", default: true, text: "增强CT未见环形强化及牛眼征，AFP显著升高，不支持肝转移瘤及血管瘤" }
    ],

    "肩关节脱位": [
        { id: "neg_1", label: "X线无骨折", default: true, text: "X线及CT未见肩关节骨折征象，排除肩关节骨折脱位" },
        { id: "neg_2", label: "肩后无肱骨头", default: true, text: "肩后未触及肱骨头凸起，肩前方隆起，排除肩关节后脱位" },
        { id: "neg_3", label: "肩袖无缺损", default: true, text: "肩袖区域未触及凹陷缺损，无外伤后上肢无力不能外展，不支持肩袖损伤" },
        { id: "neg_4", label: "远端血运感觉正常", default: true, text: "患肢远端感觉、血运、运动正常，桡动脉搏动有力，排除腋神经及血管损伤" },
        { id: "neg_5", label: "无麻木感觉异常", default: true, text: "患肢无麻木及感觉异常，排除臂丛神经损伤" }
    ],

    "膝关节前交叉韧带损伤": [
        { id: "neg_1", label: "后抽屉阴性", default: true, text: "后抽屉试验阴性，胫骨结节无后塌陷，排除后交叉韧带损伤" },
        { id: "neg_2", label: "McMurray阴性", default: true, text: "McMurray征阴性，膝关节内外侧间隙无压痛，排除半月板损伤" },
        { id: "neg_3", label: "无关节交锁", default: true, text: "无关节交锁史，无弹响及卡压感，排除半月板损伤" },
        { id: "neg_4", label: "内外翻应力阴性", default: true, text: "内外翻应力试验阴性，膝关节内外侧副韧带走行区无压痛，排除侧副韧带损伤" },
        { id: "neg_5", label: "MRI无半月板撕裂", default: true, text: "MRI未见半月板撕裂及侧副韧带断裂，仅示前交叉韧带断裂" },
        { id: "neg_6", label: "远端血运感觉正常", default: true, text: "患肢远端感觉、血运、运动正常，排除腘血管及神经损伤" }
    ],

    "踝关节骨折": [
        { id: "neg_1", label: "胫骨远端无粉碎压缩", default: true, text: "胫骨远端关节面无粉碎压缩骨折，非轴向暴力所致，排除Pilon骨折" },
        { id: "neg_2", label: "距骨无压痛", default: true, text: "距骨及踝关节前方无局限性压痛，影像学未见距骨骨折，排除距骨骨折" },
        { id: "neg_3", label: "跟骨无压痛", default: true, text: "跟骨无压痛及叩击痛，影像学未见跟骨骨折，排除跟骨骨折" },
        { id: "neg_4", label: "远端血运感觉正常", default: true, text: "足背动脉搏动可触及，末梢感觉、运动正常，毛细血管充盈时间<2秒，排除血管神经损伤" },
        { id: "neg_5", label: "跟腱反射正常", default: true, text: "跟腱反射正常，排除胫神经损伤" }
    ],

    "骨盆骨折": [
        { id: "neg_1", label: "髋关节周围无局限压痛", default: true, text: "髋关节周围无局限性压痛，骨盆挤压分离试验阳性，CT示骨折位于骨盆环而非髋臼，排除髋臼骨折" },
        { id: "neg_2", label: "股骨大转子无叩痛", default: true, text: "股骨大转子无纵向叩击痛，X线未见股骨颈及粗隆间骨折，排除股骨颈/粗隆间骨折" },
        { id: "neg_3", label: "骶尾部无局限压痛", default: true, text: "骶尾部无局限性压痛，CT示骨折累及骨盆环而非单纯骶尾骨，排除单纯骶尾骨骨折" },
        { id: "neg_4", label: "直肠指检无异常", default: true, text: "直肠指检未及明显异常，指套无血迹，排除直肠损伤" },
        { id: "neg_5", label: "腹部无腹膜刺激征", default: true, text: "腹部无压痛、反跳痛及肌紧张，排除腹腔脏器损伤" }
    ],

    "脊柱骨折（胸腰椎）": [
        { id: "neg_1", label: "无肿瘤病史", default: true, text: "无恶性肿瘤病史，MRI未见椎体骨质破坏及软组织肿块，骨髓水肿信号符合新鲜外伤性骨折，排除脊柱转移瘤病理性骨折" },
        { id: "neg_2", label: "无结核中毒症状", default: true, text: "无低热、盗汗、消瘦等结核中毒症状，排除胸腰椎结核" },
        { id: "neg_3", label: "无冷脓肿", default: true, text: "MRI未见椎旁冷脓肿形成及椎间隙狭窄，为外伤后急性骨折，排除胸腰椎结核" },
        { id: "neg_4", label: "椎间隙无狭窄", default: true, text: "椎间隙无狭窄，椎体无明显破坏，排除脊柱结核" },
        { id: "neg_5", label: "无腰背痛晨僵史", default: true, text: "无慢性腰背痛及晨僵病史，排除强直性脊柱炎合并骨折" },
        { id: "neg_6", label: "骶髂关节无异常", default: true, text: "X线未见竹节样脊柱改变，骶髂关节无异常，排除强直性脊柱炎" }
    ],

    "颈椎病（脊髓型）": [
        { id: "neg_1", label: "无神经根性疼痛", default: true, text: "无上肢沿神经根走行的放射性疼痛，臂丛神经牵拉试验阴性，排除神经根型颈椎病" },
        { id: "neg_2", label: "MRI无占位", default: true, text: "MRI未见椎管内占位性病变，排除脊髓肿瘤" },
        { id: "neg_3", label: "无缓解复发", default: true, text: "无缓解复发病史，症状呈进行性加重，排除多发性硬化" },
        { id: "neg_4", label: "脑部MRI无脱髓鞘", default: true, text: "脑部MRI未见脱髓鞘病灶，排除多发性硬化" },
        { id: "neg_5", label: "无下运动神经元损害", default: true, text: "无肌萎缩及下运动神经元损害体征，舌肌无萎缩及纤颤，排除肌萎缩侧索硬化症" },
        { id: "neg_6", label: "有感觉障碍", default: true, text: "存在明确感觉障碍及MRI脊髓压迫征象，排除无感觉障碍的肌萎缩侧索硬化症" }
    ],

    "骨肉瘤": [
        { id: "neg_1", label: "无急性高热寒战", default: true, text: "无急性高热寒战等急性炎症表现，不支持急性骨髓炎" },
        { id: "neg_2", label: "白细胞正常", default: true, text: "血常规白细胞及中性粒细胞正常，不支持骨髓炎" },
        { id: "neg_3", label: "X线无死骨", default: true, text: "X线未见死骨形成及骨质增生硬化，不支持慢性骨髓炎" },
        { id: "neg_4", label: "无葱皮样骨膜反应", default: true, text: "X线未见葱皮样骨膜反应，肿瘤位于干骺端而非骨干，排除尤因肉瘤" },
        { id: "neg_5", label: "无偏心溶骨膨胀破坏", default: true, text: "X线未见偏心性溶骨性膨胀性破坏，无骨膜反应缺乏，排除骨巨细胞瘤" },
        { id: "neg_6", label: "病理确诊", default: true, text: "穿刺活检病理确诊骨肉瘤，可排除骨巨细胞瘤、尤因肉瘤等原发性骨肿瘤" }
    ],

    "肺脓肿": [
        { id: "neg_1", label: "无结核中毒症状", default: true, text: "无低热、盗汗、消瘦等结核中毒症状，痰抗酸杆菌阴性，排除肺结核" },
        { id: "neg_2", label: "空洞内壁光滑", default: true, text: "空洞内壁光滑，未见凹凸不平及结节样突起，排除支气管肺癌空洞" },
        { id: "neg_3", label: "空洞无偏心", default: true, text: "空洞无偏心性改变，外缘未见明显分叶及毛刺，排除支气管肺癌" },
        { id: "neg_4", label: "无长期吸烟史", default: true, text: "无长期大量吸烟史，痰细胞学检查未见癌细胞，排除支气管肺癌" },
        { id: "neg_5", label: "非薄壁囊肿", default: true, text: "空洞壁较厚，周围渗出明显，非薄壁囊肿表现，排除肺囊肿继发感染" },
        { id: "neg_6", label: "左侧呼吸音清", default: true, text: "左侧呼吸音清，未闻及干湿性啰音，病变局限于右肺下叶" }
    ],

    "创伤性膈疝": [
        { id: "neg_1", label: "未闻及鼓音", default: true, text: "胸部叩诊呈浊音而非鼓音，胸膜腔内未见大量游离气体，排除单纯气胸" },
        { id: "neg_2", label: "胸腔无大量积液积气", default: true, text: "胸部CT未见单纯胸腔积液积气而无膈肌破裂，排除外伤性血气胸" },
        { id: "neg_3", label: "无膈神经损伤史", default: true, text: "无医源性膈神经损伤及肿瘤侵犯病史，排除膈肌麻痹" },
        { id: "neg_4", label: "CT无膈肌完整抬高", default: true, text: "胸部CT未见膈肌连续性完整抬高，而见膈肌破裂及腹腔脏器疝入，排除膈肌麻痹" },
        { id: "neg_5", label: "无饱食后腹胀史", default: true, text: "有明确外伤史，无大量进食后腹胀病史，影像学证实膈肌破裂，排除胃扩张" },
        { id: "neg_6", label: "右侧呼吸音正常", default: true, text: "右侧呼吸音正常，病变局限于左侧，排除对侧胸部病变" }
    ],

    "食管平滑肌瘤": [
        { id: "neg_1", label: "黏膜无溃疡菜花样", default: true, text: "食管黏膜未见溃疡及菜花样新生物，黏膜光滑完整，排除食管癌" },
        { id: "neg_2", label: "活检无恶性细胞", default: true, text: "内镜活检未见恶性肿瘤细胞，排除食管癌" },
        { id: "neg_3", label: "超声内镜无无回声", default: true, text: "超声内镜未见无回声囊性病灶，病变为低回声实性，排除食管囊肿" },
        { id: "neg_4", label: "间接喉镜无异常", default: true, text: "间接喉镜检查未见异常，排除咽喉部病变所致吞咽困难" },
        { id: "neg_5", label: "颈部无肿大淋巴结", default: true, text: "颈部未触及肿大淋巴结，排除食管癌淋巴结转移" },
        { id: "neg_6", label: "胸腹部无阳性体征", default: true, text: "胸腹部未见明显阳性体征，无远处转移征象" }
    ],

    "缩窄性心包炎": [
        { id: "neg_1", label: "无心内膜增厚", default: true, text: "心脏彩超无心内膜增厚，心室充盈受限受呼吸影响，排除限制型心肌病" },
        { id: "neg_2", label: "BNP无明显升高", default: true, text: "BNP无明显升高，排除限制型心肌病" },
        { id: "neg_3", label: "无慢性肝病病史", default: true, text: "无慢性肝病病史，肝功能无明显异常，排除肝硬化" },
        { id: "neg_4", label: "有颈静脉怒张", default: true, text: "存在颈静脉怒张、心包叩击音及心包增厚钙化等心脏体征，排除肝硬化所致腹水" },
        { id: "neg_5", label: "无瓣膜杂音", default: true, text: "各瓣膜听诊区未闻及病理性杂音，心脏未见明显扩大，排除瓣膜病及扩张型心肌病所致右心衰竭" },
        { id: "neg_6", label: "CT示心包钙化", default: true, text: "CT示心包增厚伴弧形钙化，有明确心包叩击音，排除原发性右心衰竭" }
    ],

    "漏斗胸": [
        { id: "neg_1", label: "无胸骨前凸畸形", default: true, text: "胸骨无向前凸起畸形，肋软骨无前突，与鸡胸方向相反，可排除鸡胸" },
        { id: "neg_2", label: "胸大肌对称无缺如", default: true, text: "双侧胸大肌发育对称，无缺如及发育不良；双手未见并指（趾）畸形，胸壁对称，可排除Poland综合征" },
        { id: "neg_3", label: "无Marfan特征", default: true, text: "无蜘蛛指（趾），无高腭弓，无关节过度活动及韧带松弛，可排除Marfan综合征" },
        { id: "neg_4", label: "无晶体脱位及主动脉扩张", default: true, text: "双眼晶体无脱位，超声心动图未见主动脉根部扩张及主动脉夹层征象，可排除Marfan综合征心血管病变" },
        { id: "neg_5", label: "脊柱无侧弯后凸", default: true, text: "脊柱外观无侧弯及后凸畸形，无脊柱先天性畸形表现" },
        { id: "neg_6", label: "无腭裂及唇裂", default: true, text: "口腔检查未见腭裂及唇裂，无先天性颅面畸形表现" }
    ],

    "脑膜瘤": [
        { id: "neg_1", label: "无视乳头水肿", default: true, text: "眼底检查未见视乳头水肿，无明显颅内压增高眼底表现" },
        { id: "neg_2", label: "无其他颅神经麻痹", default: true, text: "无其他颅神经受累体征——双侧听力粗测正常，无面瘫，无吞咽困难及饮水呛咳，无声音嘶哑" },
        { id: "neg_3", label: "视野无缺损", default: true, text: "双眼视野粗测未见缺损，无视交叉受压表现" },
        { id: "neg_4", label: "无失语", default: true, text: "言语流利，无明显运动性失语及感觉性失语，高级智能检查基本正常" },
        { id: "neg_5", label: "无体表转移及淋巴结肿大", default: true, text: "全身浅表淋巴结未触及肿大，皮肤未见异常色素沉着及皮下结节，未触及体表肿块" },
        { id: "neg_6", label: "无恶性肿瘤病史", default: true, text: "既往无恶性肿瘤病史，无其他部位原发肿瘤表现，可排除转移瘤" }
    ],

    "脑积水": [
        { id: "neg_1", label: "无其他颅神经受累", default: true, text: "无其他颅神经麻痹征象——双侧听力粗测正常，无面瘫，无吞咽困难及饮水呛咳，可排除颅内占位压迫颅神经" },
        { id: "neg_2", label: "视野无缺损", default: true, text: "双眼视野粗测未见缺损，无视交叉受压及视路受累表现" },
        { id: "neg_3", label: "无失语及明显认知障碍", default: true, text: "言语流利，无明显失语，定向力基本正常，非典型痴呆表现" },
        { id: "neg_4", label: "头颅无局限性隆起", default: true, text: "头颅外形大致正常，未见局限性隆起及头皮异常，无颅骨病变征象" },
        { id: "neg_5", label: "无外伤及感染史", default: true, text: "既往无颅脑外伤史，无脑膜炎及颅内感染病史，可排除外伤性或感染后脑积水" },
        { id: "neg_6", label: "无癫痫发作", default: true, text: "既往无癫痫发作史，无肢体抽搐及意识丧失发作" }
    ],

    "蛛网膜下腔出血": [
        { id: "neg_1", label: "无偏瘫及偏身感觉障碍", default: true, text: "双侧肢体肌力5级，肌张力正常，无偏瘫及偏身感觉障碍，可排除高血压脑出血的局灶性神经功能缺损" },
        { id: "neg_2", label: "无皮肤瘀点瘀斑", default: true, text: "全身皮肤未见瘀点、瘀斑及皮疹，无败血症及化脓性脑膜炎相关皮肤表现" },
        { id: "neg_3", label: "无感染中毒症状", default: true, text: "无发热，体温正常，外周血白细胞无明显升高，无感染中毒症状，可排除颅内感染" },
        { id: "neg_4", label: "无反复头痛发作史", default: true, text: "既往无反复发作性剧烈头痛病史，本次为首次发作炸裂样头痛，可排除偏头痛" },
        { id: "neg_5", label: "无高血压病史", default: true, text: "既往无高血压病史，入院血压无显著升高，不支持高血压脑出血" },
        { id: "neg_6", label: "无其他颅神经受累", default: true, text: "双侧听力粗测正常，无面瘫，无吞咽困难，无其他颅神经麻痹征象" }
    ],

    "椎管内肿瘤（神经鞘瘤）": [
        { id: "neg_1", label: "无传导束性感觉障碍", default: true, text: "双下肢感觉对称正常，无感觉平面及传导束性感觉障碍，不支持脊髓横贯性损害" },
        { id: "neg_2", label: "下肢反射及运动正常", default: true, text: "双下肢肌力5级，膝腱及跟腱反射正常，无下肢锥体束受累表现" },
        { id: "neg_3", label: "无神经纤维瘤病表现", default: true, text: "无全身多发性皮肤牛奶咖啡斑及皮下神经纤维瘤，无腋窝及腹股沟雀斑，可排除神经纤维瘤病" },
        { id: "neg_4", label: "无括约肌功能障碍", default: true, text: "无大小便功能障碍，括约肌功能正常，无马尾神经及圆锥受压表现" },
        { id: "neg_5", label: "无Horner综合征", default: true, text: "无Horner综合征表现——无上睑下垂、瞳孔缩小及面部无汗，无颈交感神经链受累" },
        { id: "neg_6", label: "脊柱无畸形及皮肤异常", default: true, text: "脊柱外观无畸形，局部皮肤未见异常色素沉着、毛发及窦道，无脊柱神经管闭合不全表现" }
    ],

    "三叉神经痛": [
        { id: "neg_1", label: "三叉神经区无感觉减退", default: true, text: "三叉神经各分支分布区无感觉减退区，面部痛觉、触觉对称正常，可排除继发性三叉神经痛" },
        { id: "neg_2", label: "无其他颅神经麻痹", default: true, text: "无其他颅神经受累体征——眼球运动正常，无面瘫，无听力减退，无吞咽困难，可排除继发性肿瘤性三叉神经痛" },
        { id: "neg_3", label: "咽部无触发痛", default: true, text: "咽部及舌根触诊无压痛，吞咽动作不诱发疼痛发作，疼痛不位于扁桃体窝及咽部，可排除舌咽神经痛" },
        { id: "neg_4", label: "咀嚼肌无萎缩", default: true, text: "咀嚼肌无萎缩及肌束颤动，咀嚼功能正常，无咀嚼肌神经源性损害表现" },
        { id: "neg_5", label: "无持续性面痛区", default: true, text: "面部无持续性疼痛区域，疼痛严格限于阵发性发作，非持续性钝痛，可排除非典型面痛" },
        { id: "neg_6", label: "无颅内压增高表现", default: true, text: "无颅内压增高表现，眼底检查未见视乳头水肿，MRI平扫未见颅内占位性病变" }
    ],

    "脑震荡": [
        { id: "neg_1", label: "无视乳头水肿", default: true, text: "双侧眼底检查未见视乳头水肿，无明显颅内压增高表现，可排除颅内血肿" },
        { id: "neg_2", label: "无局灶性神经体征", default: true, text: "双侧肢体无偏瘫及偏身感觉障碍，无失语，病理征阴性，可排除脑挫裂伤的局灶性定位体征" },
        { id: "neg_3", label: "无脑脊液漏", default: true, text: "无脑脊液鼻漏及耳漏，双耳鼻无清亮液体流出，可排除颅底骨折" },
        { id: "neg_4", label: "无癫痫发作", default: true, text: "伤后无癫痫发作，无肢体抽搐及口吐白沫，无外伤后癫痫表现" },
        { id: "neg_5", label: "CT无出血及骨折", default: true, text: "头颅CT未见脑实质出血、水肿及颅骨骨折征象，可排除脑挫裂伤及颅内血肿" },
        { id: "neg_6", label: "无进行性意识障碍", default: true, text: "意识丧失短暂，醒后无进行性意识障碍加重，瞳孔无进行性不等大，可排除迟发性颅内血肿" }
    ],

    "颅脑损伤（硬膜下/外血肿）": [
        { id: "neg_1", label: "无高血压病史", default: true, text: "既往无高血压病史，无脑血管病史，伤前无肢体无力及言语障碍，可排除高血压脑出血" },
        { id: "neg_2", label: "CT无脑实质出血", default: true, text: "头颅CT未见脑实质内出血灶及片状低密度水肿，无脑挫裂伤征象" },
        { id: "neg_3", label: "CT无硬膜下血肿", default: true, text: "头颅CT未见颅骨内板下新月形高密度影，无硬膜下血肿征象" },
        { id: "neg_4", label: "无凝血功能障碍", default: true, text: "既往无血液系统疾病及凝血功能异常病史，无长期服用抗凝药物史" },
        { id: "neg_5", label: "伤前无神经缺损", default: true, text: "伤前无肢体无力、言语障碍及偏瘫等神经功能缺损症状，可排除自发性脑卒中" },
        { id: "neg_6", label: "无全身出血倾向", default: true, text: "无全身自发性出血倾向，皮肤未见广泛瘀斑及出血点，无出血性疾病表现" }
    ],

    "高血压脑出血": [
        { id: "neg_1", label: "无外伤史", default: true, text: "否认头部外伤史，本次发病前无外伤，可排除外伤性颅内出血" },
        { id: "neg_2", label: "CT无蛛网膜下腔积血", default: true, text: "头颅CT未见蛛网膜下腔积血，CTA未见颅内动脉瘤破裂征象，可排除动脉瘤破裂致蛛网膜下腔出血" },
        { id: "neg_3", label: "CT无脑占位病变", default: true, text: "头颅CT未见脑实质占位性病变及不规则出血，无肿瘤卒中征象" },
        { id: "neg_4", label: "CT无低密度梗死灶", default: true, text: "头颅CT未见大面积低密度梗死灶，CT未见早期脑梗死低密度改变，可排除缺血性脑卒中" },
        { id: "neg_5", label: "无AVM及癫痫史", default: true, text: "既往无癫痫发作史及脑血管畸形病史，无青少年脑出血史，可排除脑动静脉畸形出血" },
        { id: "neg_6", label: "无渐进性神经缺损史", default: true, text: "既往无渐进性神经功能缺损及颅内肿瘤病史，本次为突发起病，可排除脑肿瘤卒中" }
    ],

    "肾积水": [
        { id: "neg_1", label: "肾区未触及包块", default: true, text: "双侧肾区未触及包块及肿物，无明显肾脏增大" },
        { id: "neg_2", label: "腹部未触及包块", default: true, text: "腹部未触及异常包块，无腹膜后肿物征象，可排除腹腔占位压迫输尿管" },
        { id: "neg_3", label: "无肉眼血尿", default: true, text: "尿常规未见明显肉眼血尿及大量红细胞，无典型结石相关血尿表现" },
        { id: "neg_4", label: "影像学无结石", default: true, text: "B超及CTU检查未见肾结石及输尿管结石影，可排除泌尿系结石" },
        { id: "neg_5", label: "影像学无肾占位", default: true, text: "影像学检查未见肾脏占位性病变，肾脏实质未见异常密度影，可排除肾肿瘤" },
        { id: "neg_6", label: "无无痛性血尿史", default: true, text: "无全程无痛性肉眼血尿病史，无泌尿系肿瘤相关表现" }
    ],

    "膀胱结石": [
        { id: "neg_1", label: "无无痛性血尿", default: true, text: "无全程无痛性肉眼血尿，尿液检查未见异型细胞，可排除膀胱肿瘤" },
        { id: "neg_2", label: "影像学无膀胱占位", default: true, text: "影像学检查膀胱内未见实性占位病变，膀胱壁未见增厚及新生物，可排除膀胱肿瘤" },
        { id: "neg_3", label: "前列腺无增生", default: true, text: "直肠指检及影像学检查前列腺体积正常，无增生及结节，可排除前列腺增生症" },
        { id: "neg_4", label: "前尿道无结石", default: true, text: "前尿道走行区未触及结石及硬结，可排除尿道结石" },
        { id: "neg_5", label: "影像学无尿道结石", default: true, text: "影像学检查未见尿道结石征象，结石明确位于膀胱内" },
        { id: "neg_6", label: "尿道口无异常", default: true, text: "尿道口无狭窄及异常分泌物，前尿道通畅，可排除尿道狭窄" }
    ],

    "鞘膜积液": [
        { id: "neg_1", label: "无肠鸣音及可还纳", default: true, text: "阴囊包块触诊无肠鸣音，平卧后不能还纳腹腔，透光试验阳性，可排除腹股沟斜疝" },
        { id: "neg_2", label: "睾丸实质无占位", default: true, text: "影像学检查睾丸实质回声均匀，未见睾丸内实性占位病变，可排除睾丸肿瘤" },
        { id: "neg_3", label: "包块包绕睾丸", default: true, text: "包块包绕睾丸，与睾丸界限不能分清，非位于精索走行区与睾丸分界清楚，可排除精索鞘膜积液" },
        { id: "neg_4", label: "腹股沟区无包块", default: true, text: "腹股沟管区未触及包块，外环口无扩大，无腹股沟疝表现" },
        { id: "neg_5", label: "无肠梗阻表现", default: true, text: "无腹痛、腹胀及肠梗阻表现，腹部查体无压痛及反跳痛" },
        { id: "neg_6", label: "对侧阴囊正常", default: true, text: "对侧睾丸、附睾及精索未触及异常，双侧精索静脉无曲张" }
    ],

    "尿道狭窄": [
        { id: "neg_1", label: "前列腺无增大", default: true, text: "直肠指检前列腺大小正常，表面光滑，无增大及结节，可排除前列腺增生症" },
        { id: "neg_2", label: "影像学前列腺正常", default: true, text: "影像学检查前列腺体积正常，未见前列腺增生征象，残余尿量与前列腺增大不符" },
        { id: "neg_3", label: "无膀胱颈挛缩", default: true, text: "尿道造影未见膀胱颈挛缩征象，膀胱颈开放正常，可排除膀胱颈挛缩" },
        { id: "neg_4", label: "影像学无尿道结石", default: true, text: "影像学检查未见尿道及膀胱结石征象，可排除尿道结石" },
        { id: "neg_5", label: "尿道口无异常", default: true, text: "尿道口无狭窄及异常分泌物，前尿道未触及硬结及瘢痕" },
        { id: "neg_6", label: "无前列腺手术史", default: true, text: "既往无前列腺手术及尿道器械操作史，无医源性尿道损伤因素" }
    ],

    "肾结核": [
        { id: "neg_1", label: "普通细菌培养阴性", default: true, text: "尿普通细菌培养阴性，常规抗感染治疗后症状无改善，可排除慢性肾盂肾炎及膀胱炎" },
        { id: "neg_2", label: "影像学无肾占位", default: true, text: "影像学检查未见肾脏实性占位性病变，肾实质未见异常强化肿块，可排除肾肿瘤" },
        { id: "neg_3", label: "无无痛性血尿", default: true, text: "无全程无痛性肉眼血尿，尿脱落细胞学未见异型细胞，可排除肾肿瘤" },
        { id: "neg_4", label: "无膀胱占位", default: true, text: "膀胱区未触及包块，影像学未见膀胱占位病变，可排除膀胱肿瘤" },
        { id: "neg_5", label: "对侧肾脏正常", default: true, text: "对侧肾脏形态及功能正常，无对侧肾积水及肾功能损害" },
        { id: "neg_6", label: "无泌尿系结石", default: true, text: "影像学检查未见泌尿系结石影，无结石相关肾积水表现" }
    ],

    "多处软组织挫伤": [
        { id: "neg_1", label: "无骨折征象", default: true, text: "触诊无骨擦感，无骨折处畸形及纵向叩击痛，X线未见骨折线，可排除骨折" },
        { id: "neg_2", label: "腹部无腹膜刺激征", default: true, text: "腹部查体无压痛、反跳痛及肌紧张，肝脾区无叩击痛，可排除闭合性腹腔脏器损伤" },
        { id: "neg_3", label: "生命体征平稳", default: true, text: "生命体征平稳，血压及心率正常，无休克及内出血表现，可排除腹腔内出血" },
        { id: "neg_4", label: "肿胀非弥漫性", default: true, text: "肢体肿胀局限于外伤部位，非单侧肢体弥漫性肿胀，远端动脉搏动正常，可排除深静脉血栓形成" },
        { id: "neg_5", label: "远端血运感觉正常", default: true, text: "患肢远端感觉、运动及血运正常，毛细血管充盈正常，远端动脉搏动良好" },
        { id: "neg_6", label: "实验室无异常", default: true, text: "实验室检查血红蛋白无进行性下降，D-二聚体无明显升高，不支持活动性出血及深静脉血栓" }
    ],

    "附睾炎": [
        { id: "neg_1", label: "提睾反射存在无横位", default: true, text: "提睾反射存在，睾丸位置无上移及横位，无睾丸扭转典型体征" },
        { id: "neg_2", label: "睾丸血流增多", default: true, text: "影像学检查睾丸血流信号增多，未见血流减少或消失，可排除睾丸扭转" },
        { id: "neg_3", label: "睾丸无肿大压痛", default: true, text: "睾丸大小正常，无明显肿大及压痛，病变以附睾为主，可排除睾丸炎" },
        { id: "neg_4", label: "无窦道及寒性脓肿", default: true, text: "阴囊皮肤无窦道形成，未触及寒性脓肿及串珠样改变，可排除附睾结核" },
        { id: "neg_5", label: "急性起病无结核中毒", default: true, text: "起病急骤，伴发热及白细胞升高，无明显盗汗、消瘦及低热等结核中毒症状" },
        { id: "neg_6", label: "无结核病史", default: true, text: "既往无肺结核及泌尿生殖系结核病史，可排除附睾结核" }
    ],


// ===== 妇产科疾病 (4) =====

    "子痫前期": [
        { id: "neg_1", label: "孕20周前血压正常", default: true, text: "孕20周前及孕早期血压正常，既往无高血压病史，可排除妊娠合并慢性高血压" },
        { id: "neg_2", label: "无慢性肾病史", default: true, text: "既往无慢性肾病史，孕前尿常规正常，无水肿及蛋白尿史，可排除慢性肾炎合并妊娠" },
        { id: "neg_3", label: "无抽搐及意识障碍", default: true, text: "无抽搐及意识障碍发作，无子痫发作表现，可排除子痫及癫痫" },
        { id: "neg_4", label: "无癫痫病史", default: true, text: "既往无癫痫病史及癫痫家族史，头痛为子痫前期血管痉挛所致" },
        { id: "neg_5", label: "无慢性肾炎典型表现", default: true, text: "无肉眼血尿，无肾功能严重损害及低蛋白血症，非慢性肾炎典型表现" },
        { id: "neg_6", label: "胎心基线正常", default: true, text: "胎心监测基线正常，未发现胎儿窘迫征象，无胎盘功能严重减退表现" }
    ],

    "子宫肌瘤": [
        { id: "neg_1", label: "无痛经进行性加重", default: true, text: "无继发性痛经进行性加重史，子宫非弥漫性均匀增大，可排除子宫腺肌病" },
        { id: "neg_2", label: "子宫表面不规则质硬", default: true, text: "妇科检查子宫表面不规则，可触及质硬肌瘤结节，非腺肌病的均匀质硬增大" },
        { id: "neg_3", label: "双侧附件无包块", default: true, text: "双侧附件区未触及包块及肿物，可排除卵巢肿瘤" },
        { id: "neg_4", label: "影像学卵巢正常", default: true, text: "影像学检查双侧卵巢形态及大小正常，未见占位病变，可排除卵巢肿瘤" },
        { id: "neg_5", label: "无停经及HCG阴性", default: true, text: "无停经史，尿或血HCG阴性，可排除妊娠子宫" },
        { id: "neg_6", label: "影像学无宫内孕囊", default: true, text: "影像学检查宫腔内未见孕囊及妊娠组织，子宫质硬表面不规则不符合妊娠子宫" }
    ],

    "异位妊娠（宫外孕）": [
        { id: "neg_1", label: "无转移性右下腹痛", default: true, text: "无转移性右下腹痛，麦氏点无压痛及反跳痛，可排除急性阑尾炎" },
        { id: "neg_2", label: "HCG升高排除黄体破裂", default: true, text: "血β-HCG明显升高，不符合黄体破裂（HCG阴性），支持妊娠相关疾病" },
        { id: "neg_3", label: "影像学无宫内孕囊", default: true, text: "影像学检查宫腔内未见孕囊，附件区可见包块，可排除宫内妊娠流产" },
        { id: "neg_4", label: "子宫无明显增大变软", default: true, text: "妇科检查子宫无明显均匀增大变软，不符合宫内妊娠表现" },
        { id: "neg_5", label: "无大量阴道流血及组织排出", default: true, text: "阴道流血量少，未见绒毛及蜕膜组织排出，可排除不全流产" },
        { id: "neg_6", label: "无月经后半期腹痛史", default: true, text: "既往无月经后半期（黄体期）突发下腹痛发作史，不支持黄体破裂" }
    ],

    "胎盘早剥": [
        { id: "neg_1", label: "非无痛性阴道流血", default: true, text: "阴道流血伴剧烈持续性腹痛，非无痛性阴道流血，可排除前置胎盘" },
        { id: "neg_2", label: "胎盘位置正常", default: true, text: "影像学检查胎盘附着位置正常，未附着于子宫下段及覆盖宫颈内口，可排除前置胎盘" },
        { id: "neg_3", label: "无瘢痕子宫及缩复环", default: true, text: "既往无剖宫产及子宫手术史，无瘢痕子宫，腹部未触及病理性缩复环，可排除先兆子宫破裂" },
        { id: "neg_4", label: "无肉眼血尿", default: true, text: "无肉眼血尿，无先兆子宫破裂相关血尿表现" },
        { id: "neg_5", label: "无产程梗阻史", default: true, text: "无产程梗阻及难产史，非产程中发生，可排除先兆子宫破裂" },
        { id: "neg_6", label: "宫缩间歇张力不缓解", default: true, text: "宫缩间歇期子宫张力不缓解，呈持续性收缩状态，非阵发性放松，可排除早产临产" }
    ],


// ===== 儿科疾病 (4) =====

    "小儿支气管肺炎": [
        { id: "neg_1", label: "无结核接触及中毒症状", default: true, text: "无结核接触史，无盗汗、消瘦、乏力等结核中毒症状，可排除肺结核" },
        { id: "neg_2", label: "已种卡介苗PPD阴性", default: true, text: "已按时接种卡介苗，PPD皮试阴性，可排除肺结核" },
        { id: "neg_3", label: "无异物吸入史", default: true, text: "无异物吸入及呛咳史，咳嗽为持续性非阵发性，可排除支气管异物" },
        { id: "neg_4", label: "无单侧呼吸音减低", default: true, text: "双肺呼吸音对称，无单侧呼吸音减低，可排除支气管异物" },
        { id: "neg_5", label: "胸片无异物征象", default: true, text: "胸片未见肺不张、纵隔移位及异物征象，可排除支气管异物" },
        { id: "neg_6", label: "啰音固定中细", default: true, text: "双肺为固定中细湿啰音，非不固定粗湿啰音，胸片见斑片状阴影，可排除急性支气管炎" }
    ],

    "小儿腹泻病": [
        { id: "neg_1", label: "无黏液脓血便", default: true, text: "大便无黏液脓血，无里急后重表现，可排除细菌性痢疾" },
        { id: "neg_2", label: "大便常规无大量红白细胞", default: true, text: "大便常规未见大量白细胞、红细胞及吞噬细胞，大便培养阴性，可排除细菌性痢疾" },
        { id: "neg_3", label: "无腹胀便血及肌紧张", default: true, text: "无腹胀、便血及果酱样大便，腹部无压痛及肌紧张，可排除急性坏死性肠炎" },
        { id: "neg_4", label: "腹部无包块及腹膜刺激征", default: true, text: "腹部未触及包块，无腹膜刺激征，一般情况相对较好，可排除急性坏死性肠炎" },
        { id: "neg_5", label: "伴发热脱水非单纯腹泻", default: true, text: "伴发热、呕吐及脱水，精神状态差，非单纯大便次数增多，可排除生理性腹泻" },
        { id: "neg_6", label: "非6月内婴儿生理性腹泻", default: true, text: "患儿非6个月以内婴儿单纯性腹泻，生长发育受影响，可排除生理性腹泻" }
    ],

    "手足口病": [
        { id: "neg_1", label: "皮疹离心性分布", default: true, text: "皮疹呈离心性分布（手、足、口、臀部），非躯干向心性分布，可排除水痘" },
        { id: "neg_2", label: "皮疹同期无多形并存", default: true, text: "皮疹为同一期疱疹，未见丘疹、疱疹、结痂同时存在，可排除水痘" },
        { id: "neg_3", label: "无Koplik斑", default: true, text: "无Koplik斑，无自上而下的斑丘疹融合，皮疹不呈斑丘疹融合，可排除麻疹" },
        { id: "neg_4", label: "无明显卡他症状", default: true, text: "无明显卡他症状（流涕、畏光、流泪及结膜炎），可排除麻疹" },
        { id: "neg_5", label: "病变不局限于咽峡", default: true, text: "病变不局限于咽峡部，伴有典型手足口臀部皮疹，可排除疱疹性咽峡炎" },
        { id: "neg_6", label: "口腔散在非簇状", default: true, text: "口腔病变为散在疱疹溃疡，非咽峡部集中簇状分布，可排除疱疹性咽峡炎" }
    ],

    "小儿急性上呼吸道感染": [
        { id: "neg_1", label: "全身症状轻", default: true, text: "全身症状相对较轻，无明显高热、剧烈全身酸痛及严重乏力，可排除流行性感冒" },
        { id: "neg_2", label: "流感病毒检测阴性", default: true, text: "甲流、乙流病毒检测阴性，可排除流行性感冒" },
        { id: "neg_3", label: "无全身淋巴结及肝脾肿大", default: true, text: "无全身浅表淋巴结肿大及肝脾肿大，可排除急性传染性单核细胞增多症" },
        { id: "neg_4", label: "EB病毒阴性", default: true, text: "EB病毒检测阴性，外周血无异型淋巴细胞增多，可排除传染性单核细胞增多症" },
        { id: "neg_5", label: "双肺无啰音及浸润", default: true, text: "双肺未闻及干湿啰音，胸片未见斑片状浸润影，病变局限于上呼吸道，可排除急性支气管炎" },
        { id: "neg_6", label: "无皮疹及黏膜损害", default: true, text: "无皮疹及皮肤黏膜损害，无多形性红斑及渗出性多形红斑表现" }
    ]
};
