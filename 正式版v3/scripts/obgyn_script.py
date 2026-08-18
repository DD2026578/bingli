import json
import re
import sys

def main():
    file_path = '../js/data/obgyn.js'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Define replacement peConfigs for the 4 diseases
    # We will use re.sub to replace the "peConfig": {...} block for each disease based on name

    disease_configs = {
        "子痫前期": {
            "diseaseName": "子痫前期",
            "vitals": {
                "t": "36.6℃",
                "p": "84次/分",
                "r": "18次/分",
                "bp": "165/105mmHg"
            },
            "positiveSigns": [
                {
                    "id": "zxqq_pos_1",
                    "label": "血压显著升高",
                    "default": True,
                    "text": "查体血压显著升高达{bp}mmHg。"
                },
                {
                    "id": "zxqq_pos_2",
                    "label": "下肢凹陷性水肿",
                    "default": True,
                    "text": "双下肢可见凹陷性水肿，水肿程度：{edema}。"
                },
                {
                    "id": "zxqq_pos_3",
                    "label": "宫底腹围符合孕周",
                    "default": True,
                    "text": "宫高{fh}cm，腹围{ac}cm，胎位{pos}，胎膜{membrane}，宫口{cx}cm。"
                },
                {
                    "id": "zxqq_pos_4",
                    "label": "胎心情况",
                    "default": True,
                    "text": "胎心{fhr}次/分，尚属正常范围内。"
                }
            ],
            "negativeSigns": [
                "腹软，无明显压痛及反跳痛",
                "神经系统病理征阴性",
                "阴道无异常流血及流液",
                "无抽搐及意识障碍",
                "双侧附件区未触及明显异常包块"
            ],
            "specialistRaw": "血压{bp}mmHg。宫高{fh}cm，腹围{ac}cm，胎位{pos}，胎心{fhr}次/分。胎膜{membrane}，宫口{cx}cm。水肿程度：{edema}。"
        },
        "子宫肌瘤": {
            "diseaseName": "子宫肌瘤",
            "vitals": {
                "t": "36.5℃",
                "p": "78次/分",
                "r": "18次/分",
                "bp": "118/72mmHg"
            },
            "positiveSigns": [
                {
                    "id": "zgjl_pos_1",
                    "label": "下腹部可触及包块",
                    "default": True,
                    "text": "腹部平坦，下腹部可触及一包块，大小约{size}，活动度可。"
                },
                {
                    "id": "zgjl_pos_2",
                    "label": "子宫明显增大",
                    "default": True,
                    "text": "{spec_exam}妇科检查：子宫明显增大，如孕{wks}周大小。"
                },
                {
                    "id": "zgjl_pos_3",
                    "label": "子宫表面不规则",
                    "default": True,
                    "text": "子宫表面不规则，可触及{num}个肌瘤结节，最大约{size}。"
                },
                {
                    "id": "zgjl_pos_4",
                    "label": "肌瘤质地硬",
                    "default": True,
                    "text": "结节质硬，活动度尚可。"
                }
            ],
            "negativeSigns": [
                "子宫无明显压痛",
                "双侧附件未触及异常包块及增厚",
                "宫颈无举痛及摇摆痛",
                "阴道后穹窿不饱满，无触痛",
                "无明显化脓性或异味阴道分泌物"
            ],
            "specialistRaw": "腹部平坦，下腹部可触及一包块，大小约{size}，质硬，活动度可，无压痛。{spec_exam}妇科检查：子宫增大，如孕{wks}周大小，表面不规则，可触及{num}个肌瘤结节，最大约{size}，质硬，活动度可，双侧附件未触及异常。"
        },
        "异位妊娠（宫外孕）": {
            "diseaseName": "异位妊娠",
            "vitals": {
                "t": "36.8℃",
                "p": "92次/分",
                "r": "20次/分",
                "bp": "100/60mmHg"
            },
            "positiveSigns": [
                {
                    "id": "ywrs_pos_1",
                    "label": "宫颈举痛及摇摆痛",
                    "default": True,
                    "text": "妇科检查：宫颈着色，有明显举痛及摇摆痛。"
                },
                {
                    "id": "ywrs_pos_2",
                    "label": "阴道后穹窿饱满",
                    "default": True,
                    "text": "阴道后穹窿饱满，触痛明显。"
                },
                {
                    "id": "ywrs_pos_3",
                    "label": "附件区压痛包块",
                    "default": True,
                    "text": "患侧附件区可触及边界不清的包块，伴明显压痛。"
                },
                {
                    "id": "ywrs_pos_4",
                    "label": "下腹压痛及反跳痛",
                    "default": True,
                    "text": "下腹部有明显压痛、反跳痛及轻度肌紧张。"
                },
                {
                    "id": "ywrs_pos_5",
                    "label": "阴道暗红色流血",
                    "default": True,
                    "text": "可见少量暗红色阴道流血。"
                }
            ],
            "negativeSigns": [
                "子宫大小稍大或正常，未达停经月份",
                "宫口闭合，无组织物堵塞或排出",
                "无明显脓性白带及发热表现",
                "附件区包块非实性硬结节",
                "无板状腹表现"
            ],
            "specialistRaw": "腹部平软，下腹部压痛（+），反跳痛（+），轻度肌紧张。妇科检查：外阴发育正常，阴道畅，可见少量暗红色血液；宫颈轻度糜烂，举痛（+），摇摆痛（+）；子宫稍大，质软，压痛（+）；患侧附件区可触及包块，压痛明显，边界不清；对侧附件未见异常；阴道后穹窿饱满，触痛（+）。"
        },
        "胎盘早剥": {
            "diseaseName": "胎盘早剥",
            "vitals": {
                "t": "36.6℃",
                "p": "105次/分",
                "r": "22次/分",
                "bp": "110/70mmHg"
            },
            "positiveSigns": [
                {
                    "id": "tpzb_pos_1",
                    "label": "子宫板状硬",
                    "default": True,
                    "text": "查体可见子宫呈板状硬，张力大，子宫不放松。"
                },
                {
                    "id": "tpzb_pos_2",
                    "label": "子宫压痛明显",
                    "default": True,
                    "text": "子宫压痛明显，尤其是胎盘附着处局限性压痛显著。"
                },
                {
                    "id": "tpzb_pos_3",
                    "label": "阴道暗红流血",
                    "default": True,
                    "text": "可见阴道流出暗红色血液，伴或不伴血块。"
                },
                {
                    "id": "tpzb_pos_4",
                    "label": "胎位触诊不清",
                    "default": True,
                    "text": "因宫壁紧张，胎位触诊不清。"
                },
                {
                    "id": "tpzb_pos_5",
                    "label": "胎心音异常",
                    "default": True,
                    "text": "胎心监护异常或听诊胎心音弱/变慢/消失。"
                }
            ],
            "negativeSigns": [
                "无明显下腹部及反跳痛等急腹症体征",
                "宫颈管未见进行性缩短（非正常临产）",
                "超声提示胎盘未覆盖宫颈内口",
                "无典型子宫收缩间歇期完全放松",
                "无阵发性规律宫缩痛表现"
            ],
            "specialistRaw": "腹部检查：子宫呈板状硬，张力增高，压痛明显；宫底高度大于孕周；胎位触诊不清；胎心音弱或消失。妇科检查：阴道有暗红色血液流出；宫口未开或开大{cx}cm。"
        }
    }

    # Find peConfig blocks for each disease
    # We will use a regex to replace the peConfig blocks. 
    # Because JSON regex matching is tricky with nested braces, we can use an approach:
    # Match the disease object, locate the peConfig, and replace it.
    
    # Simple state machine to parse and replace peConfig blocks.
    
    # Or, we can use json to parse, modify, and dump. But it's JS file!
    # Wait, the file is `const obgynDiseases = [ ... ];`
    # We can extract the JSON part, parse it, update it, and write it back.
    
    json_match = re.search(r'const\s+obgynDiseases\s*=\s*(\[\s*\{.*\}\s*\])\s*;\s*\}\)\(\);', content, re.DOTALL)
    if json_match:
        json_str = json_match.group(1)
        # Parse JSON
        # Note: sometimes JS objects have unquoted keys or trailing commas, but this is a standard JSON-like structure.
        # Let's try json.loads
        try:
            data = json.loads(json_str)
            for d in data:
                name = d.get('name')
                # 异位妊娠（宫外孕） special handling
                if '异位' in name:
                    name = '异位妊娠（宫外孕）'
                
                if name in disease_configs:
                    conf = disease_configs[name]
                    # Retain vitals if already present, otherwise use default
                    old_pe = d['t'].get('peConfig', {})
                    if 'vitals' in old_pe:
                        conf['vitals'] = old_pe['vitals']
                    
                    # Update specialistRaw if it exists in old_pe, otherwise keep from my dict
                    if 'specialistRaw' in old_pe:
                        conf['specialistRaw'] = old_pe['specialistRaw']
                        
                    d['t']['peConfig'] = conf
            
            new_json_str = json.dumps(data, ensure_ascii=False, indent=4)
            # Reconstruct the file
            new_content = content[:json_match.start(1)] + new_json_str + content[json_match.end(1):]
            with open(file_path, 'w', encoding='utf-8') as fw:
                fw.write(new_content)
            print("Successfully updated obgyn.js using JSON parsing.")
            return
        except json.JSONDecodeError as e:
            print("JSON parse failed, falling back to regex.", e)
            
    # Fallback: regex replacement
    # We will find `"name": "disease_name",` and then find its `"peConfig": { ... }` block
    for name, config in disease_configs.items():
        # Build the new peConfig string
        new_pe_str = '"peConfig": ' + json.dumps(config, ensure_ascii=False, indent=8)
        
        # Regex to find peConfig block
        pattern = r'("name":\s*"' + re.escape(name) + r'".*?)"peConfig":\s*\{.*?\}(?=\s*\}\s*\})'
        
        def replacer(m):
            return m.group(1) + new_pe_str
            
        content = re.sub(pattern, replacer, content, flags=re.DOTALL)
        
    with open(file_path, 'w', encoding='utf-8') as fw:
        fw.write(content)
    print("Updated obgyn.js using Regex.")

if __name__ == "__main__":
    main()
