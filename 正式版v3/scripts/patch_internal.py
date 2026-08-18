import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('../js/data/internal.js', 'r', encoding='utf-8') as f:
    text = f.read()

match = re.search(r'const internalDiseases = (\[.*\]);\s*if', text, re.DOTALL)
if not match:
    print("Cannot find internalDiseases array")
    sys.exit(1)

data = json.loads(match.group(1))

respiratory_names = [
    "社区获得性肺炎",
    "慢性阻塞性肺疾病急性加重",
    "支气管哮喘",
    "支气管扩张症",
    "慢性肺源性心脏病",
    "急性肺栓塞",
    "结核性胸膜炎",
    "间质性肺疾病",
    "阻塞性睡眠呼吸暂停低通气综合征"
]

for d in data:
    if d['name'] in respiratory_names:
        # Standardize physicalExam
        hr = "{hr}" if "{hr}" in d['t'].get('physicalExam', '') else "80"
        d['t']['physicalExam'] = f"T: {{t}}℃ P: {{p}}次/分 R: {{r}}次/分 BP: {{bp}}mmHg\\n发育正常，营养中等，神志清楚，精神可，自主体位，查体合作。全身皮肤黏膜无黄染及出血点，浅表淋巴结未触及肿大。头颅无畸形，五官端正。双侧瞳孔等大等圆，对光反射灵敏。颈软，气管居中，甲状腺未触及肿大。胸廓及两肺查体详见专科查体。心界不大，心率{hr}次/分，律齐，各瓣膜听诊区未闻及病理性杂音。腹平软，无压痛及反跳痛，肝脾肋下未触及，肠鸣音正常。双下肢无水肿，生理反射存在，病理征阴性。"
        
        # Standardize firstCourse
        fc = d['t']['firstCourse']
        
        def replace_pe(m):
            t_str = m.group(1)
            spec_str = d['t']['specialistExam']
            return f"3.体格检查：   {t_str}\n    发育正常，营养中等，神志清楚，精神可，自主体位，查体合作。全身皮肤黏膜无黄染及出血点。浅表淋巴结未触及肿大。头颈部无异常，气管居中。胸廓及两肺查体详见专科查体。心界不大，律齐，各瓣膜听诊区未闻及病理性杂音。腹平软无压痛及反跳痛，肝脾肋下未触及。双下肢无水肿，病理征阴性。\n专科检查：{spec_str}\n4.辅助检查："
            
        new_fc = re.sub(r'3\.体格检查：(.*?)\n.*?(?=4\.辅助检查：)', replace_pe, fc, flags=re.DOTALL)
        if new_fc != fc:
            d['t']['firstCourse'] = new_fc
        
        # peConfig Generation
        name = d['name']
        pe = {"diseaseName": name, "vitals": d['t'].get('peConfig', {}).get('vitals', {})}
        
        if name == "社区获得性肺炎":
            pe['positiveSigns'] = [
                {"id": "sign_1", "label": "患侧呼吸运动减弱", "default": True, "text": "患侧胸廓饱满，呼吸运动及呼吸音减弱"},
                {"id": "sign_2", "label": "语颤增强", "default": True, "text": "患侧局部语音震颤增强"},
                {"id": "sign_3", "label": "叩诊浊音", "default": True, "text": "患侧肺部叩诊呈浊音或实音"},
                {"id": "sign_4", "label": "管状呼吸音", "default": True, "text": "听诊可闻及异常支气管呼吸音（管状呼吸音）"},
                {"id": "sign_5", "label": "细湿啰音", "default": True, "text": "吸气末可闻及细湿性啰音"}
            ]
            pe['negativeSigns'] = [
                {"id": "neg_1", "label": "气管居中", "default": False, "text": "气管居中，无偏移"},
                {"id": "neg_2", "label": "颈静脉无怒张", "default": False, "text": "颈静脉无怒张"},
                {"id": "neg_3", "label": "未见杵状指", "default": False, "text": "未见杵状指"},
                {"id": "neg_4", "label": "心浊音界正常", "default": False, "text": "心浊音界正常"}
            ]
            pe['specialistRaw'] = "患侧胸廓饱满，呼吸运动减弱，局部语音震颤增强。叩诊呈浊音，听诊呼吸音减弱，可闻及管状呼吸音，吸气末可闻及细湿啰音。"
            
        elif name == "慢性阻塞性肺疾病急性加重":
            pe['positiveSigns'] = [
                {"id": "sign_1", "label": "桶状胸", "default": True, "text": "胸廓前后径增大，呈桶状胸"},
                {"id": "sign_2", "label": "双侧语颤减弱", "default": True, "text": "双侧语音震颤减弱"},
                {"id": "sign_3", "label": "叩诊过清音", "default": True, "text": "双肺叩诊呈过清音，心浊音界缩小"},
                {"id": "sign_4", "label": "呼气相延长", "default": True, "text": "双肺呼吸音减弱，呼气相明显延长"},
                {"id": "sign_5", "label": "干湿性啰音", "default": True, "text": "双肺可闻及散在干湿性啰音"}
            ]
            pe['negativeSigns'] = [
                {"id": "neg_1", "label": "无奇脉", "default": False, "text": "无奇脉"},
                {"id": "neg_2", "label": "颈静脉无明显怒张", "default": False, "text": "颈静脉无明显怒张"},
                {"id": "neg_3", "label": "气管居中", "default": False, "text": "气管居中，无偏移"},
                {"id": "neg_4", "label": "无局限现实变体征", "default": False, "text": "无局限性叩诊实音及语颤增强"}
            ]
            pe['specialistRaw'] = "胸廓呈桶状胸，肋间隙增宽，呼吸运动减弱。双侧语音震颤减弱。双肺叩诊呈过清音，心浊音界缩小，肺下界降低。双肺呼吸音普遍减弱，呼气相延长，可闻及散在干湿性啰音。"
            
        elif name == "支气管哮喘":
            pe['positiveSigns'] = [
                {"id": "sign_1", "label": "呼气相延长", "default": True, "text": "双肺呼吸音减弱，呼气相明显延长"},
                {"id": "sign_2", "label": "弥漫性哮鸣音", "default": True, "text": "双肺可闻及弥漫性哮鸣音"},
                {"id": "sign_3", "label": "双侧语颤减弱", "default": True, "text": "双侧语音震颤对称性减弱"},
                {"id": "sign_4", "label": "叩诊过清音", "default": True, "text": "双肺叩诊呈过清音"}
            ]
            pe['negativeSigns'] = [
                {"id": "neg_1", "label": "无湿性啰音", "default": False, "text": "双肺未闻及明显湿性啰音"},
                {"id": "neg_2", "label": "未见杵状指", "default": False, "text": "未见杵状指"},
                {"id": "neg_3", "label": "心音无低钝", "default": False, "text": "心音无低钝，无奔马律"},
                {"id": "neg_4", "label": "颈静脉无怒张", "default": False, "text": "颈静脉无怒张"}
            ]
            pe['specialistRaw'] = "胸廓对称，呼吸运动稍急促。双侧语音震颤减弱。双肺叩诊呈过清音。双肺呼吸音普遍减弱，呼气相明显延长，可闻及弥漫性哮鸣音，未闻及湿性啰音。"
            
        elif name == "支气管扩张症":
            pe['positiveSigns'] = [
                {"id": "sign_1", "label": "局限性湿啰音", "default": True, "text": "病变部位可闻及局限性、固定性粗湿啰音"},
                {"id": "sign_2", "label": "杵状指(趾)", "default": True, "text": "可见杵状指(趾)"},
                {"id": "sign_3", "label": "患侧呼吸音减弱", "default": True, "text": "患侧局限性呼吸音减弱"},
                {"id": "sign_4", "label": "语颤可增强", "default": True, "text": "伴有肺实变时局部语颤可增强"}
            ]
            pe['negativeSigns'] = [
                {"id": "neg_1", "label": "呼气相不延长", "default": False, "text": "呼气相无明显延长"},
                {"id": "neg_2", "label": "无弥漫性哮鸣音", "default": False, "text": "双肺无弥漫性哮鸣音"},
                {"id": "neg_3", "label": "气管居中", "default": False, "text": "气管居中，无偏移"},
                {"id": "neg_4", "label": "无胸膜摩擦音", "default": False, "text": "未闻及胸膜摩擦音"}
            ]
            pe['specialistRaw'] = "可见杵状指。胸廓对称，气管居中。病变部位语音震颤可略增强。叩诊可呈局部浊音。患侧局部呼吸音偏低，可闻及固定性、局限性粗湿啰音，咳嗽后啰音可略减少。"
            
        elif name == "慢性肺源性心脏病":
            pe['positiveSigns'] = [
                {"id": "sign_1", "label": "桶状胸", "default": True, "text": "呈桶状胸，肋间隙增宽"},
                {"id": "sign_2", "label": "肺动脉瓣区P2亢进", "default": True, "text": "肺动脉瓣区第二心音(P2)亢进"},
                {"id": "sign_3", "label": "剑突下心尖搏动", "default": True, "text": "剑突下可见明显心脏搏动"},
                {"id": "sign_4", "label": "颈静脉怒张", "default": True, "text": "颈静脉怒张，肝颈静脉回流征阳性"},
                {"id": "sign_5", "label": "双下肢水肿", "default": True, "text": "双下肢凹陷性水肿"}
            ]
            pe['negativeSigns'] = [
                {"id": "neg_1", "label": "无舒张期奔马律", "default": False, "text": "心尖区未闻及舒张期奔马律"},
                {"id": "neg_2", "label": "脾未触及肿大", "default": False, "text": "脾脏未触及肿大"},
                {"id": "neg_3", "label": "无奇脉", "default": False, "text": "无奇脉"},
                {"id": "neg_4", "label": "无局部实变体征", "default": False, "text": "肺部无局限性管状呼吸音等实变体征"}
            ]
            pe['specialistRaw'] = "呈桶状胸，颈静脉怒张，肝颈静脉回流征阳性。双肺可闻及干湿性啰音。剑突下可见明显心脏搏动，心界缩小，肺动脉瓣区第二心音亢进，三尖瓣区可闻及收缩期杂音。双下肢凹陷性水肿。"
            
        elif name == "急性肺栓塞":
            pe['positiveSigns'] = [
                {"id": "sign_1", "label": "呼吸急促", "default": True, "text": "呼吸急促，频率明显增快"},
                {"id": "sign_2", "label": "肺动脉瓣区P2亢进", "default": True, "text": "心率增快，肺动脉瓣区第二心音(P2)亢进"},
                {"id": "sign_3", "label": "颈静脉怒张", "default": True, "text": "可伴有颈静脉充盈或怒张"},
                {"id": "sign_4", "label": "下肢不对称肿胀", "default": True, "text": "可有单侧下肢肿胀，Homans征阳性"}
            ]
            pe['negativeSigns'] = [
                {"id": "neg_1", "label": "无广泛干湿性啰音", "default": False, "text": "双肺未闻及广泛干湿性啰音"},
                {"id": "neg_2", "label": "叩诊无实音", "default": False, "text": "肺部叩诊呈清音，无大片实变体征"},
                {"id": "neg_3", "label": "无舒张期杂音", "default": False, "text": "各瓣膜区无明显舒张期杂音"}
            ]
            pe['specialistRaw'] = "呼吸急促。可伴颈静脉充盈或怒张。双肺呼吸音略低，未闻及明显干湿性啰音。心界不大，心率增快，肺动脉瓣区第二心音亢进，三尖瓣区可闻及收缩期杂音。可伴单侧下肢肿胀及压痛。"
            
        elif name == "结核性胸膜炎":
            pe['positiveSigns'] = [
                {"id": "sign_1", "label": "气管偏向健侧", "default": True, "text": "气管向健侧移位"},
                {"id": "sign_2", "label": "患侧语颤减弱", "default": True, "text": "患侧语音震颤减弱或消失"},
                {"id": "sign_3", "label": "叩诊实音", "default": True, "text": "患侧局部叩诊呈浊音或实音"},
                {"id": "sign_4", "label": "呼吸音减弱或消失", "default": True, "text": "患侧呼吸音减弱或消失"},
                {"id": "sign_5", "label": "胸膜摩擦音", "default": True, "text": "积液较少时可闻及胸膜摩擦音"}
            ]
            pe['negativeSigns'] = [
                {"id": "neg_1", "label": "无弥漫性哮鸣音", "default": False, "text": "双肺无弥漫性哮鸣音"},
                {"id": "neg_2", "label": "颈静脉无怒张", "default": False, "text": "颈静脉无怒张"},
                {"id": "neg_3", "label": "无广泛湿啰音", "default": False, "text": "健侧肺未闻及明显湿啰音"}
            ]
            pe['specialistRaw'] = "气管向健侧移位。患侧胸廓饱满，呼吸运动受限。患侧语音震颤减弱或消失。患侧中下肺野叩诊呈浊音或实音。患侧呼吸音减弱或消失，积液上方可闻及支气管呼吸音。"
            
        elif name == "间质性肺疾病":
            pe['positiveSigns'] = [
                {"id": "sign_1", "label": "Velcro啰音", "default": True, "text": "双下肺可闻及吸气末细小爆裂音(Velcro啰音)"},
                {"id": "sign_2", "label": "杵状指(趾)", "default": True, "text": "可见杵状指(趾)"},
                {"id": "sign_3", "label": "呼吸浅快", "default": True, "text": "呼吸频率增快，以浅快呼吸为主"},
                {"id": "sign_4", "label": "语颤可轻度增强", "default": True, "text": "双侧下肺语音震颤可轻度增强"}
            ]
            pe['negativeSigns'] = [
                {"id": "neg_1", "label": "无哮鸣音", "default": False, "text": "双肺未闻及哮鸣音"},
                {"id": "neg_2", "label": "呼气相不延长", "default": False, "text": "呼气相无明显延长"},
                {"id": "neg_3", "label": "气管居中", "default": False, "text": "气管居中，无偏移"},
                {"id": "neg_4", "label": "无胸膜摩擦音", "default": False, "text": "未闻及胸膜摩擦音"}
            ]
            pe['specialistRaw'] = "可见杵状指，呼吸浅快。气管居中，胸廓无畸形。双下肺语音震颤可轻度增强，叩诊多为清音。双肺底可闻及典型的吸气末细小爆裂音(Velcro啰音)，未闻及哮鸣音。"
            
        elif name == "阻塞性睡眠呼吸暂停低通气综合征":
            pe['positiveSigns'] = [
                {"id": "sign_1", "label": "颈短粗", "default": True, "text": "颈部短粗，颈围明显增大"},
                {"id": "sign_2", "label": "咽部拥挤", "default": True, "text": "咽腔狭窄，悬雍垂肥大低垂"},
                {"id": "sign_3", "label": "扁桃体肿大", "default": True, "text": "扁桃体可有不同程度肥大"},
                {"id": "sign_4", "label": "肥胖体型", "default": True, "text": "体型多肥胖，BMI显著增加"}
            ]
            pe['negativeSigns'] = [
                {"id": "neg_1", "label": "肺部无干湿啰音", "default": False, "text": "双肺听诊清音，无干湿性啰音"},
                {"id": "neg_2", "label": "无气管偏移", "default": False, "text": "气管居中，无偏移"},
                {"id": "neg_3", "label": "心界正常", "default": False, "text": "心界正常，无扩大征象"}
            ]
            pe['specialistRaw'] = "体型肥胖，颈短粗，颈围增大。口咽部黏膜慢性充血，软腭低垂，悬雍垂肥大增粗，咽后壁淋巴滤泡增生，扁桃体可伴肥大，咽腔狭窄。双肺呼吸音清，未闻及干湿性啰音。"

        d['t']['peConfig'] = pe
        d['t']['specialistExam'] = pe['specialistRaw']

        fc2 = d['t']['firstCourse']
        fc2 = re.sub(r'专科检查：.*?\n4\.辅助检查：', f"专科检查：{pe['specialistRaw']}\\n4.辅助检查：", fc2, flags=re.DOTALL)
        d['t']['firstCourse'] = fc2

output_js = "/**\n * 华医 internal 疾病模板与临床路径数据库 (已全量解耦与专属 peConfig 增强)\n * 模板数量: 43 个\n */\n(function(){\n  const internalDiseases = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n  if(typeof window !== 'undefined') {\n    window.internalDiseases = internalDiseases;\n  } else if(typeof module !== 'undefined') {\n    module.exports = internalDiseases;\n  }\n})();\n"

with open('../js/data/internal.js', 'w', encoding='utf-8') as f:
    f.write(output_js)

print("Patch applied successfully.")
