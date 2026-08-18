/**
 * 华医临床体格检查与专科检查智能推导引擎 (Physical Exam & Specialist Exam Engine)
 * 职责：
 * 1. 自动将专科检查中的阳性发现整合到全身体格检查对应系统段落（不含"详见专科检查"引用）。
 * 2. 全身体格检查完整显示所有系统查体，不省略、不引用。
 * 3. 同步首次病程记录中的体查段落，确保体格检查与专科检查逻辑一致。
 *
 * 变更记录：
 * - [v2.3] syncFirstCourse 使用 generateCondensedPE 生成精简版体格检查，
 *          保留相关系统阳性体征，省略无关正常描述，符合临床首次病程书写规范
 * - [v2.2] syncFirstCourse 支持三种首次病程格式（标准/Pattern A/Pattern B），
 *          覆盖全部127个疾病模板，确保首次病程与入院记录逻辑完全一致
 * - [v2.1] syncFirstCourse 直接使用入院记录体查文本（deconflictPE 输出），
 *          不再独立提取阳性发现，确保首次病程与入院记录逻辑完全一致
 * - [v2.0] 移除"体征结构化勾选生成器"模态框，改为全自动模式
 *         deconflictPE 不再使用"详见专科检查"替换，改为直接整合阳性发现
 */

window.PEEngine = (function(){

    // 默认基础通用体质 (用于合成全身体查，仅当 MedicalDB 不可用时作为兜底)
    const DEFAULT_BASE_PE = {
        general: "发育正常，营养良好，神志清晰，自主体位，查体合作。皮肤粘膜正常，皮肤弹性好，无水肿，无黄疸，无皮疹，无出血点，毛发分布正常。浅表淋巴结无肿大，无压痛。头颅五官无畸形，无肿块。睑结膜无充血，巩膜无黄染，角膜无混浊，双侧瞳孔等圆等大，双侧对光反射存在。耳无畸形，外耳道无分泌物。双侧乳突无压痛，双耳听力正常。鼻无畸形，通气顺畅，无分泌物，各副鼻窦均无压痛。口唇无发绀，齿龈无出血、无溢脓。口腔粘膜无出血点、无溃疡，咽无充血，双侧扁桃体正常。颈软对称，无颈静脉怒张、无异常搏动，甲状腺无肿大，气管居中。胸廓两侧对称，无局部突出、无凹陷，无胸壁静脉曲张。两侧呼吸动度相等，肋间隙无增宽、无变窄。语音震颤正常，无胸膜摩擦感。两肺叩诊音正常、呼吸音正常，未闻及干湿性啰音。心前区无隆起，触诊无震颤，心浊音界正常，心率80次/分，心律整齐。心脏各瓣膜听诊区无病理性杂音。腹平软，全腹无压痛及反跳痛，肝脾肋下未触及，未触及异常包块，移动性浊音阴性，肠鸣音4次/分，正常。外生殖器未查，肛门未查。颈椎活动度可，腰椎活动度尚可，无压痛、无叩击痛。四肢及各关节无畸形，无红肿，无肌肉萎缩。无水肿，双膝腱及跟腱反射存在。四肢肌力、肌张力正常，生理反射存在，病理反射未引出。"
    };

    /**
     * 疾病体系统分类器
     * 根据 DISEASE_GROUPS 亚专科分组 + 疾病名称精准匹配，将疾病归类到体系统
     */
    function classifyDiseaseSystem(name, deptId) {
        name = name || '';
        var systems = [];

        var subDept = null;
        if (window.DISEASE_GROUPS) {
            var deptKeys = deptId ? [deptId] : Object.keys(window.DISEASE_GROUPS);
            for (var d = 0; d < deptKeys.length && !subDept; d++) {
                var groups = window.DISEASE_GROUPS[deptKeys[d]];
                if (!groups) continue;
                for (var i = 0; i < groups.length; i++) {
                    if (groups[i].items && groups[i].items.indexOf(name) >= 0) {
                        subDept = groups[i].group;
                        break;
                    }
                }
            }
        }

        // 甲状腺疾病
        if (/甲状腺/.test(name)) {
            systems.push('thyroid');
        }
        else if (/乳腺|乳房/.test(name)) {
            systems.push('breast');
        }
        else if (/臀脓肿/.test(name)) {
            systems.push('skin');
        }
        else if (/脑(出血|梗死|炎|膜|积|震|外|损|病)|脑卒中|癫痫|三叉神经|蛛网膜|硬膜|颅脑|帕金森|脑疝|神经鞘瘤|短暂性脑缺血/.test(name)) {
            systems.push('neurological');
        }
        else if (subDept === '体表肿物' || /皮脂腺囊肿|表皮样囊肿|脂肪瘤|纤维瘤|色素痣|血管瘤|体表脓肿|痣/.test(name)) {
            systems.push('skin');
        }
        else if (subDept === '骨科' ||
                 /骨折|脱位|脱臼|颈椎病|腰椎|椎间盘|椎管|脊柱|韧带(损伤|撕裂|断裂)|半月板|肩(周炎|袖|关节)|髋(关节|脱位)|膝(关节|半月板|韧带)|肘关节|踝关节|胫骨|腓骨|股骨|肱骨|锁骨|桡骨|尺骨|跟骨|骨盆|腱鞘|肌腱|网球肘|拇外翻|骨质疏松|骨(髓炎|肉瘤|囊肿|关节炎)|软组织挫伤|肋骨骨折|强直性脊柱炎|痛风性关节炎|类风湿关节炎/.test(name)) {
            systems.push('orthopedic');
            if (/血气胸|气胸|血胸/.test(name)) {
                systems.push('respiratory');
            }
        }
        else if (subDept === '心血管系统' ||
                 /心肌梗死|心绞痛|冠心病|心力衰竭|心衰|心肌(炎|病)|高血压|房颤|心房颤动|心律失常|心包(炎|积液)|瓣膜|主动脉(夹层|瘤|狭窄)|心内膜炎|肺栓塞/.test(name)) {
            systems.push('cardiac');
        }
        else if (subDept === '呼吸系统' || subDept === '胸心外科' ||
                 /肺炎|肺(癌|脓肿|大疱|气肿|纤维化|栓塞|不张|源性)|哮喘|慢阻肺|慢性阻塞性肺|支气管|气胸|血气胸|胸腔积液|胸膜炎|呼吸|纵隔|漏斗胸/.test(name)) {
            if (/缩窄性心包炎|胸主动脉瘤|心包/.test(name)) {
                systems.push('cardiac');
            } else if (/膈疝/.test(name)) {
                systems.push('abdominal');
            } else {
                systems.push('respiratory');
            }
        }
        else if (subDept === '普通外科' || subDept === '消化系统' ||
                 /阑尾|胆囊|胆管|胆总管|胆石|胰腺炎|肠梗阻|胃(溃疡|穿孔|癌|炎|食管)|十二指肠|腹股沟疝|切口疝|腹膜炎|肝(癌|脓肿|硬化|囊肿|血管瘤)|脾(破裂|肿大|梗死)|结直肠|结肠癌|直肠癌|肛(瘘|裂|周脓肿)|痔|消化道(穿孔|出血)|食管(癌|平滑肌)|贲门|幽门|肠(套叠|扭转|穿孔|瘘)|腹部损伤|腹泻/.test(name)) {
            systems.push('abdominal');
        }
        else if (subDept === '泌尿外科' ||
                 /肾(结石|癌|炎|结核|囊肿|积水|肿瘤|衰竭|损伤|小球|脏病|病综合征)|输尿管|膀胱(癌|炎|结石)|前列腺(增生|癌|炎)|尿路感染|泌尿系|精索静脉|睾丸(扭转|炎)|附睾炎|鞘膜积液|尿道狭窄/.test(name)) {
            systems.push('urological');
        }
        else if (subDept === '血管外科' || /静脉曲张|动脉(瘤|硬化|狭窄)|血栓|脉管炎/.test(name)) {
            systems.push('vascular');
        }
        if (deptId === 'obgyn' ||
            /子宫(肌瘤|内膜|脱垂|癌|出血|腺肌)|卵巢(囊肿|癌|肿瘤)|宫颈(癌|炎|糜烂)|盆腔(炎|积液)|阴道(炎|脱垂)|异位妊娠|宫外孕|葡萄胎|前置胎盘|胎膜早破|子痫|胎盘早剥/.test(name)) {
            systems.push('gynecological');
            if (/异位妊娠|宫外孕|子痫前期|子痫|胎盘早剥|前置胎盘|子宫肌瘤|卵巢(囊肿|癌|肿瘤)|宫颈癌|子宫内膜癌|黄体破裂/.test(name)) {
                systems.push('abdominal');
            }
        }
        if (deptId === 'pedia' || /小儿|新生儿|儿童|手足口|川崎/.test(name)) {
            if (/肺炎|支气管|呼吸/.test(name)) {
                systems.push('respiratory');
            }
            if (/腹泻/.test(name)) {
                systems.push('abdominal');
            }
            if (/手足口/.test(name)) {
                systems.push('skin');
                systems.push('infectious');
            }
            if (/黄疸/.test(name)) {
                systems.push('skin');
                systems.push('jaundice');
            }
            if (/川崎/.test(name)) {
                systems.push('skin');
                systems.push('cardiac');
            }
            if (/惊厥/.test(name)) {
                systems.push('neurological');
            }
        }
        else if (/系统性红斑狼疮/.test(name)) {
            systems.push('systemic');
        }
        else if (/糖尿病/.test(name)) {
            systems.push('metabolic');
        }
        else if (/贫血|血小板减少/.test(name)) {
            systems.push('hematology');
        }
        else if (/臀脓肿|脓肿/.test(name)) {
            systems.push('skin');
        }

        return systems;
    }

    /**
     * 阴性子句判定：检查一个子句是否为阴性/正常描述
     */
    function isClauseNegative(c) {
        if (/阳性|\(\+\)|\(＋\)|（\+）|（＋）/.test(c)) return false;
        if (/阴性/.test(c)) return true;
        if (/无/.test(c)) return true;
        if (/未/.test(c)) return true;
        if (/不高|不肿|无肿|未触及/.test(c)) return true;
        if (/正常/.test(c) && !/异常/.test(c)) return true;
        if (/\(-\)|（-）/.test(c)) return true;
        return false;
    }

    /**
     * 通用阳性发现检测：在专科检查文本中按子句级别搜索阳性（异常）发现
     */
    function specHasPositive(spec, pattern) {
        spec = spec || '';
        var sentences = spec.split(/[。；;\n]/);
        for (var i = 0; i < sentences.length; i++) {
            var s = sentences[i].trim();
            if (!s) continue;
            var clauses = s.split(/[，,]/);
            for (var j = 0; j < clauses.length; j++) {
                var c = clauses[j].trim();
                if (!c) continue;
                if (!pattern.test(c)) continue;
                if (isClauseNegative(c)) continue;
                return true;
            }
        }
        return false;
    }

    /**
     * 专科检查文本系统特异性匹配（子句级阴性排除版）
     */
    function specHasSystemFinding(spec, system) {
        spec = spec || '';
        var sentences = spec.split(/[。；;\n]/);
        for (var i = 0; i < sentences.length; i++) {
            var s = sentences[i].trim();
            if (!s) continue;
            var clauses = s.split(/[，,]/);
            for (var j = 0; j < clauses.length; j++) {
                var c = clauses[j].trim();
                if (!c) continue;
                var matched = false;
                switch (system) {
                    case 'abdominal':
                        matched = /(腹部|全腹|中上腹|上腹|下腹|右上腹|左上腹|右下腹|左下腹|脐周|腹肌).*压痛|反跳痛|Murphy|麦氏点|肠鸣音.*(亢进|减弱|消失|活跃|金属)|气过水|移动性浊音|肝脾.*(肿大|触及|增大)|振水音|肝区.*叩击痛|腹胀|腹膜刺激|腹部.*肠型|腹部.*蠕动波|腹部.*膨隆|腹式呼吸.*(减弱|消失)|板状腹/.test(c);
                        break;
                    case 'orthopedic':
                        matched = /脊柱.*压痛|椎.*压痛|椎.*叩击|关节.*(肿|畸形|活动受限|压痛|红)|四肢.*(畸形|肿胀|活动受限)|活动度.*受限|直腿抬高|托马斯征|4字试验|骨擦|轴向叩击/.test(c);
                        break;
                    case 'respiratory':
                        matched = /啰音|呼吸音.*(减弱|消失|粗|降低|略低|低下)|管状呼吸|肺.*叩诊|语颤.*减弱|气管.*偏|胸膜摩擦/.test(c);
                        break;
                    case 'cardiac':
                        matched = /杂音|心律.*不齐|心率.*异常|心前区.*隆起|心浊音界.*扩大|心包摩擦|瓣膜.*病|颈静脉.*怒张|肝颈静脉|心音.*遥远|心包叩击/.test(c);
                        break;
                    case 'thyroid':
                        matched = /甲状腺.*(结节|肿大|触及|血管杂音)|颈部.*肿块/.test(c);
                        break;
                    case 'breast':
                        matched = /乳房.*肿块|乳腺.*(肿块|结节|压痛|橘皮|酒窝)|腋窝.*淋巴结/.test(c);
                        break;
                    case 'neurological':
                        matched = /瞳孔.*不等|对光反射.*(消失|迟钝)|病理征.*阳性|脑膜刺激|颈项强直|颈强直|克尼格征|克氏征|布鲁津斯基征|布氏征|巴宾斯基征|巴氏征|偏瘫|截瘫|肌力[0-4]级|GCS|昏迷|嗜睡|昏睡/.test(c);
                        break;
                    case 'urological':
                        matched = /肾区.*叩击痛|膀胱.*压痛|前列腺.*(肿大|结节)|尿道.*分泌物|阴囊.*(肿|红|热)/.test(c);
                        break;
                    case 'gynecological':
                        matched = /子宫.*(压痛|增大|脱垂)|宫颈.*举痛|盆腔.*压痛|附件.*包块|阴道.*分泌物/.test(c);
                        break;
                    case 'vascular':
                        matched = /静脉曲张|动脉搏动.*减弱|足背动脉.*减弱|毛细血管.*充盈|曲张|间歇性跛行|肢端.*坏疽|下肢.*溃疡/.test(c);
                        break;
                    default:
                        matched = false;
                }
                if (matched && !isClauseNegative(c)) return true;
            }
        }
        return false;
    }

    /**
     * [新增] 从专科检查文本中提取匹配指定模式的所有子句（含阳性和阴性）
     * 按 句号/分号/换行 → 逗号 二级分割为最小语义子句
     * 用途：提取阳性发现及其相关阴性描述，直接整合到体格检查对应段落
     */
    function extractAllClauses(spec, pattern) {
        spec = spec || '';
        var all = [];
        var sentences = spec.split(/[。；;\n]/);
        for (var i = 0; i < sentences.length; i++) {
            var s = sentences[i].trim();
            if (!s) continue;
            var clauses = s.split(/[，,]/);
            for (var j = 0; j < clauses.length; j++) {
                var c = clauses[j].trim();
                if (!c) continue;
                // 防御：跳过"占位符+未填选项"（如 {skin_exam}（A/B）），避免残留到体格检查
                if (/\{[a-zA-Z_][a-zA-Z0-9_]*\}（[^）]*\/[^）]*）/.test(c)) continue;
                if (pattern.test(c)) all.push(c);
            }
        }
        return all;
    }

    /**
     * 判断当前体检文本是否存在与专科检查矛盾的表述
     * 用于 fillTemplate 场景的安全检查：疾病分类包含任何系统 → 需要整合阳性发现
     */
    function needsDeconfliction(peText, spec, name) {
        if (!peText) return false;
        var deptId = window.currentDept || '';
        var systems = classifyDiseaseSystem(name, deptId);
        if (systems.length > 0) return true;

        var sysList = ['abdominal', 'orthopedic', 'respiratory', 'cardiac', 'thyroid', 'breast', 'neurological', 'urological', 'gynecological', 'vascular', 'jaundice'];
        for (var i = 0; i < sysList.length; i++) {
            if (specHasSystemFinding(spec, sysList[i])) return true;
        }
        if (specHasPositive(spec, /淋巴结.*肿大|肿大.*淋巴结|腋窝.*触及/)) return true;
        return false;
    }

    /**
     * [v2.0 重写] 全身体检阳性发现整合引擎
     * 核心变更：移除所有"详见专科检查"替换，改为将专科检查中的阳性发现直接整合到体格检查对应系统段落
     * 策略：
     *   1. 识别受累系统（classifyDiseaseSystem + specHasSystemFinding）
     *   2. 从专科检查文本中提取该系统的所有相关子句（含阳性和阴性）
     *   3. 若存在阳性子句，将体格检查中该系统的"全阴性正常描述"替换为实际发现
     *   4. 若无阳性子句，保持正常描述不变（不引用、不省略）
     */
    function deconflictPE(basePE, specialistText, hr, diseaseItem) {
        var name = diseaseItem ? (diseaseItem.name || '') : '';
        var deptId = window.currentDept || '';
        var spec = specialistText || '';
        var result = basePE;

        var systems = classifyDiseaseSystem(name, deptId);
        var hasSys = function(sys) { return systems.indexOf(sys) >= 0; };

        // 辅助：提取匹配子句
        function extract(pattern) {
            return extractAllClauses(spec, pattern);
        }

        // 辅助：判断子句列表中是否存在阳性（非阴性）子句
        function hasPos(clauses) {
            return clauses.some(function(c) { return !isClauseNegative(c); });
        }

        // 辅助：若存在阳性子句，用实际发现替换体格检查中的"全阴性正常描述"
        function replace(normalRegex, pattern) {
            var clauses = extract(pattern);
            if (hasPos(clauses) && normalRegex.test(result)) {
                result = result.replace(normalRegex, clauses.join('，'));
            }
        }

        // —— 1. 腹部系统 ——
        if (hasSys('abdominal') || specHasSystemFinding(spec, 'abdominal')) {
            var abClauses = extract(/肌紧张|板状腹|压痛|反跳痛|包块|肿块|下腹压痛/);
            if (hasPos(abClauses)) {
                if (result.indexOf('腹平软，全腹无压痛及反跳痛') >= 0) {
                    result = result.replace(/腹平软，全腹无压痛及反跳痛/g, abClauses.join('，'));
                } else if (result.indexOf('全腹无压痛及反跳痛') >= 0) {
                    result = result.replace(/全腹无压痛及反跳痛/g, abClauses.join('，'));
                    result = result.replace(/腹平软/g, '腹部查体见下');
                } else {
                    replace(/全腹无压痛及反跳痛/, /压痛|反跳痛|Murphy|麦氏|肌紧张|板状腹|包块/);
                    result = result.replace(/腹平软/g, '腹部');
                }
            } else {
                replace(/全腹无压痛及反跳痛/, /压痛|反跳痛|Murphy|麦氏|肌紧张|板状腹|包块/);
                replace(/肠鸣音\d+次\/分，正常/, /肠鸣音/);
                replace(/肝脾肋下未触及/, /肝.*肋下|脾.*肋下|肝.*肿大|脾.*肿大|肝.*触及|脾.*触及/);
                replace(/未触及异常包块/, /包块|肿块/);
                replace(/移动性浊音阴性/, /移动性浊音/);
            }
        }

        // —— 2. 浅表淋巴结 ——
        replace(/浅表淋巴结无肿大，无压痛/, /淋巴结|腋窝.*触及/);

        // —— 3. 皮肤 ——
        if (hasSys('skin') || hasSys('metabolic') || hasSys('hematology') ||
            specHasPositive(spec, /红肿|皮温|皮疹|糜烂|溃疡|橘皮|酒窝|瘀斑|苍白|出血点|黄染|蜘蛛痣|肝掌/)) {
            replace(/无皮疹，无出血点/, /皮疹|皮温|糜烂|溃疡|橘皮|酒窝|瘀斑|瘀点|瘢痕|破溃|渗液|充血|红肿|苍白|出血点|蜘蛛痣|肝掌|肿物|肿块|囊肿|隆起|痣|脂肪瘤|纤维瘤|血管瘤|波动感/);
        }

        // —— 3.5 新生儿黄疸/皮肤黄染 ——
        if (hasSys('jaundice') || specHasPositive(spec, /黄染|黄疸/)) {
            var jaundiceClauses = extract(/黄染|黄疸/);
            if (hasPos(jaundiceClauses) && result.indexOf('无黄疸') >= 0) {
                result = result.replace(/无黄疸/, jaundiceClauses.join('，'));
            }
        }

        // —— 4. 呼吸系统 ——
        if (hasSys('respiratory') || specHasSystemFinding(spec, 'respiratory')) {
            var respClauses = extract(/啰音|呼吸音|管状呼吸|肺.*叩诊|语颤|气管.*偏|胸膜摩擦/);
            if (hasPos(respClauses) && /两肺叩诊音正常、呼吸音正常，未闻及干湿性啰音/.test(result)) {
                // 避免重复"肺"字：若首句已含"肺"则不加前缀
                var respPrefix = /肺/.test(respClauses[0]) ? '' : '两肺';
                result = result.replace(/两肺叩诊音正常、呼吸音正常，未闻及干湿性啰音/, respPrefix + respClauses.join('，'));
            }
        }

        // —— 5. 心血管系统 ——
        if (hasSys('cardiac') || specHasSystemFinding(spec, 'cardiac')) {
            replace(/心脏各瓣膜听诊区无病理性杂音/, /杂音|心音|额外心音|心包叩击/);
            replace(/心律整齐/, /心律/);
            // 颈静脉怒张（心包炎/心衰等）
            replace(/无颈静脉怒张、无异常搏动/, /颈静脉|肝颈静脉/);
        }

        // —— 6. 甲状腺 ——
        if (hasSys('thyroid') || specHasSystemFinding(spec, 'thyroid')) {
            replace(/甲状腺无肿大/, /甲状腺/);
        }

        // —— 7. 乳腺 ——（正常体检模板中无乳腺描述，需追加）
        if (hasSys('breast') || specHasSystemFinding(spec, 'breast')) {
            var breastClauses = extract(/乳腺|乳房|腋窝.*触及|乳头/);
            if (hasPos(breastClauses)) {
                var thyroidMatch = result.match(/甲状腺[^。]*。/);
                if (thyroidMatch) {
                    result = result.replace(thyroidMatch[0], thyroidMatch[0] + breastClauses.join('，') + '。');
                }
            }
        }

        // —— 8-12. 泌尿生殖/肛门直肠（共享"外生殖器未查，肛门未查。"段落）——
        var guFindings = [];
        // 肛门直肠
        if (/肛门.*指|直肠.*指|肛诊|指诊|指检|痔/.test(spec) || /痔|肛瘘|肛裂|肛周脓肿|直肠/.test(name)) {
            var anorectalClauses = extract(/肛门|直肠|肛诊|指诊|指检|痔/);
            if (hasPos(anorectalClauses)) guFindings = guFindings.concat(anorectalClauses);
        }
        // 妇科
        if (hasSys('gynecological') || specHasSystemFinding(spec, 'gynecological')) {
            var gynClauses = extract(/子宫|宫颈|盆腔|附件|阴道|外阴/);
            if (hasPos(gynClauses)) guFindings = guFindings.concat(gynClauses);
        }
        // 泌尿
        if (hasSys('urological') || specHasSystemFinding(spec, 'urological')) {
            var uroClauses = extract(/肾区|膀胱|前列腺|尿道|阴囊|睾丸|附睾|精索|鞘膜/);
            if (hasPos(uroClauses)) guFindings = guFindings.concat(uroClauses);
        }
        if (guFindings.length > 0 && result.indexOf('外生殖器未查，肛门未查。') >= 0) {
            result = result.replace(/外生殖器未查，肛门未查。/g, guFindings.join('，') + '。');
        }

        // —— 9. 脊柱四肢/骨科 ——
        if (hasSys('orthopedic') || specHasSystemFinding(spec, 'orthopedic')) {
            // 脊柱压痛/叩击痛/活动度
            var spineClauses = extract(/颈椎|腰椎|脊柱.*压痛|脊柱.*叩击|椎.*压痛|椎.*叩击|叩击痛|活动度|直腿抬高|托马斯|4字试验/);
            if (hasPos(spineClauses)) {
                result = result.replace(/颈椎活动度可，腰椎活动度尚可，无压痛、无叩击痛。/g, spineClauses.join('，') + '。');
            }
            // 关节畸形/红肿
            var jointClauses = extract(/关节.*(?:肿|畸形|活动|压痛|红)|畸形|红肿|肿胀|肌肉萎缩|肿物|肿块|囊肿/);
            if (hasPos(jointClauses)) {
                result = result.replace(/四肢及各关节无畸形，无红肿，无肌肉萎缩。/g, jointClauses.join('，') + '。');
            }
            // 肌力/肌张力
            var muscleClauses = extract(/肌力|肌张力/);
            if (hasPos(muscleClauses) && result.indexOf('四肢肌力、肌张力正常') >= 0) {
                result = result.replace(/四肢肌力、肌张力正常/g, muscleClauses.join('，'));
            }
        }

        // —— 10. 神经系统 ——
        if (hasSys('neurological') || specHasSystemFinding(spec, 'neurological')) {
            // 瞳孔/对光反射
            var pupilClauses = extract(/瞳孔|对光反射/);
            if (hasPos(pupilClauses)) {
                result = result.replace(/，双侧瞳孔等圆等大，双侧对光反射存在。/g, '，' + pupilClauses.join('，') + '。');
            }
            // 病理反射/脑膜刺激征
            // 仅替换"生理反射存在，病理反射未引出"部分，避免与骨科肌力替换冲突
            if (result.indexOf('病理反射未引出') >= 0) {
                var reflexClauses = extract(/病理征|脑膜刺激|颈项强直|颈强直|克尼格征|克氏征|布鲁津斯基征|布氏征|巴宾斯基征|巴氏征|偏瘫|截瘫|肌力[0-4]级|病理反射/);
                if (hasPos(reflexClauses)) {
                    result = result.replace(/生理反射存在，病理反射未引出。/g, reflexClauses.join('，') + '。');
                }
            }
            // 肌力/肌张力：若专科检查存在肌力/肌张力描述，同步替换"四肢肌力、肌张力正常"（避免与骨科整合冲突，仅在骨科未替换时生效）
            var neuroMuscleClauses = extract(/肌力|肌张力/);
            if (hasPos(neuroMuscleClauses) && result.indexOf('四肢肌力、肌张力正常') >= 0) {
                result = result.replace(/四肢肌力、肌张力正常/g, neuroMuscleClauses.join('，'));
            }
        }

        // —— 13. 血管系统 ——（正常体检模板中无血管描述，需追加）
        if (hasSys('vascular') || specHasPositive(spec, /静脉曲张|动脉搏动.*减弱|足背动脉.*减弱|曲张|间歇性跛行/)) {
            var vascularClauses = extract(/静脉曲张|动脉|足背动脉|毛细血管|曲张|间歇性跛行|肢端/);
            if (hasPos(vascularClauses)) {
                if (result.indexOf('颈椎活动度可') >= 0) {
                    result = result.replace(/颈椎活动度可/g, vascularClauses.join('，') + '。颈椎活动度可');
                }
            }
        }

        // —— 14. 水肿（心血管/肝脏/肾脏疾病常见）——
        if (hasSys('cardiac') || hasSys('urological') || hasSys('metabolic') || hasSys('hematology') ||
            specHasPositive(spec, /水肿|凹陷性/)) {
            var edemaClauses = extract(/水肿|凹陷性/);
            if (hasPos(edemaClauses) && result.indexOf('无水肿，双膝腱及跟腱反射存在') >= 0) {
                result = result.replace(/无水肿，双膝腱及跟腱反射存在/g, edemaClauses.join('，') + '，双膝腱及跟腱反射存在');
            }
        }

        return result;
    }

    /**
     * [v2.0 简化] 自动生成体格检查并同步首次病程
     * 移除模态框交互，改为全自动模式：
     *   1. 从主面板获取生命体征
     *   2. 从专科检查字段获取疾病特异性查体文本
     *   3. 基于正常体检模板生成体格检查（整合阳性发现）
     *   4. 同步首次病程记录中的体查段落
     */
    function applySmartPE(deptId, diseaseIdx) {
        var diseaseItem = window.currentDiseaseItem || (window.MedicalDB ? window.MedicalDB.getTemplate(deptId || window.currentDept, diseaseIdx || window.currentDisease || 0) : null);
        if (!diseaseItem) return;

        // 从主面板获取生命体征
        function getVital(id, fallback) {
            var el = document.getElementById(id);
            return (el && el.value && el.value.trim()) ? el.value.trim() : fallback;
        }
        var tVal = getVital('t', '36.5℃');
        var pVal = getVital('p', '78次/分');
        var rVal = getVital('r', '18次/分');
        var bpVal = getVital('bp', '120/80mmHg');

        // 从专科检查字段获取文本（fillTemplate 已填充模板内容）
        var specEl = document.getElementById('specialistExam');
        var specialistResult = (specEl && specEl.value && specEl.value.trim())
            ? specEl.value
            : ((diseaseItem.t && diseaseItem.t.specialistExam) ? diseaseItem.t.specialistExam : '');

        // 基于正常体检模板生成体格检查
        var hr = pVal.replace(/次[/／]分/g, '').trim() || '80';
        var basePE = window.MedicalDB ? window.MedicalDB.getNormalPE() : DEFAULT_BASE_PE.general;
        basePE = basePE.replace('{hr}', hr).replace('{mentality}', '自主体位');

        // 整合阳性发现到体格检查
        basePE = deconflictPE(basePE, specialistResult, hr, diseaseItem);
        var peEl = document.getElementById('physicalExam');
        if (peEl) peEl.value = basePE;

        // 同步首次病程记录（直接使用入院记录体查文本，确保逻辑完全一致）
        syncFirstCourse(tVal, pVal, rVal, bpVal, diseaseItem, specialistResult, basePE);
    }

    /**
     * 判断句子是否包含阳性/异常发现（非全阴性描述）
     * 用于识别 deconflictPE 整合到 PE 中的阳性体征
     */
    function sentenceHasAbnormal(sentence) {
        var positiveMarkers = /阳性|压痛|反跳痛|肿[大块胀]|杂音|啰音|减弱|消失|亢进|受限|畸形|结节|包块|隆起|肿物|囊肿|痣|波动感|凹陷|浊音|管状|怒张|水肿|皮温[增高略升]|红斑|糜烂|溃疡|瘀斑|出血点|黄染|蜘蛛痣|肝掌|叩击痛|Murphy|麦氏|苍白|曲张|脱出|分泌物|饱满|气过水|略低|稍低/;
        if (!positiveMarkers.test(sentence)) return false;

        var clauses = sentence.split(/[，,]/);
        for (var i = 0; i < clauses.length; i++) {
            var c = clauses[i].trim();
            if (!c) continue;
            if (isClauseNegative(c)) continue;
            if (positiveMarkers.test(c)) return true;
        }
        return false;
    }

    /**
     * 判断句子是否匹配指定体系统
     */
    function sentenceMatchesSystem(sentence, system) {
        switch (system) {
            case 'respiratory':
                return /肺|呼吸音|呼吸动度|胸廓|语颤|胸膜摩擦|管状呼吸/.test(sentence);
            case 'cardiac':
                return /心[前区浊界]|心率|心律|杂音|颈静脉|心包|心音|肝颈/.test(sentence);
            case 'abdominal':
                return /腹[平软部肌膨隆式]|肝[脾区肋]|脾[肋下肿大]|肠鸣|Murphy|麦氏|移动性浊|反跳痛|板状腹|腹膜刺激|振水音|肛门|直肠/.test(sentence);
            case 'orthopedic':
                return /脊柱|四肢|关节|活动度|直腿|托马斯|4字|骨擦|轴向叩击|颈椎|腰椎|椎[间管盘]|半月板|肩[袖周关节]|髋|膝[关节]|踝关节|腱鞘|肌腱|小腿|大腿|肱骨|股骨|胫骨|腓骨|桡骨|尺骨|锁骨|跟骨|骨盆|肿物|肿块|囊肿/.test(sentence);
            case 'neurological':
                return /瞳孔|对光反射|病理征|脑膜刺激|颈项强直|颈强直|克尼格|克氏|布鲁津斯基|布氏|巴宾斯基|巴氏|偏瘫|截瘫|肌力[0-4]|GCS|昏迷|嗜睡|昏睡/.test(sentence);
            case 'urological':
                return /肾区|膀胱区|前列腺|尿道|阴囊|外生殖|睾丸|附睾|精索|鞘膜/.test(sentence);
            case 'thyroid':
                return /甲状腺|颈软|颈部/.test(sentence);
            case 'breast':
                return /乳腺|乳房|腋窝/.test(sentence);
            case 'gynecological':
                return /子宫|宫颈|盆腔|阴道|附件/.test(sentence);
            case 'vascular':
                return /动脉搏动|足背动脉|毛细血管|间歇性跛行|坏疽|静脉曲张/.test(sentence);
            case 'jaundice':
                return /黄染|黄疸|巩膜/.test(sentence);
            case 'skin':
                return /皮肤粘膜|皮温|皮疹|糜烂|溃疡|橘皮|酒窝|瘀斑|蜘蛛痣|肝掌|肿物|肿块|囊肿|隆起|痣|脂肪瘤|纤维瘤|血管瘤|波动感/.test(sentence);
            case 'metabolic':
                return /皮肤|水肿/.test(sentence);
            case 'hematology':
                return /皮肤|出血点|瘀斑|淋巴结|脾[肋下肿大]/.test(sentence);
            case 'systemic':
                return /皮肤|关节|水肿|淋巴结/.test(sentence);
            default:
                return false;
        }
    }

    /**
     * [v2.3 新增] 生成首次病程记录用的精简版体格检查文本
     * 临床规范：首次病程记录的体格检查应为入院记录的精简版，重点记录阳性体征和
     *          相关系统查体，其余系统用"余查体未见明显异常"概括。
     * 策略：
     *   1. 保留一般状态（首句：发育、营养、神志、体位等）
     *   2. 保留与疾病系统相关的句子（基于 classifyDiseaseSystem 分类）
     *   3. 保留包含阳性发现的句子（deconflictPE 整合到 PE 中的阳性体征）
     *   4. 保留神经反射总结（末句：肌力、肌张力、生理反射、病理反射）
     *   5. 其余正常描述省略，用"余查体未见明显异常。"概括
     */
    function generateCondensedPE(admissionPE, diseaseItem) {
        if (!admissionPE) return '';

        var name = diseaseItem ? (diseaseItem.name || '') : '';
        var deptId = window.currentDept || '';
        var systems = classifyDiseaseSystem(name, deptId);

        // 按句号分割为句子
        var allSentences = [];
        var parts = admissionPE.split(/。/);
        for (var i = 0; i < parts.length; i++) {
            var s = parts[i].trim();
            if (s) allSentences.push(s);
        }

        // 句子太少则无需精简
        if (allSentences.length <= 4) return admissionPE;
        // 无法分类疾病系统则保留全部（安全兜底）
        if (systems.length === 0) return admissionPE;

        var kept = [];
        var neuroSentence = '';

        // 识别末句（神经反射总结）
        for (var n = allSentences.length - 1; n >= 0; n--) {
            if (/肌力|肌张力|生理反射|病理反射/.test(allSentences[n])) {
                neuroSentence = allSentences[n];
                break;
            }
        }

        for (var i = 0; i < allSentences.length; i++) {
            var s = allSentences[i];

            // 跳过神经反射总结句（稍后单独添加）
            if (s === neuroSentence) continue;

            // 保留首句（一般状态）
            if (i === 0) {
                kept.push(s);
                continue;
            }

            // 检查是否匹配疾病系统
            var systemMatch = false;
            for (var j = 0; j < systems.length; j++) {
                if (sentenceMatchesSystem(s, systems[j])) {
                    systemMatch = true;
                    break;
                }
            }

            // 检查是否包含阳性发现（deconflictPE 整合的内容）
            var hasAbnormal = sentenceHasAbnormal(s);

            if (systemMatch || hasAbnormal) {
                kept.push(s);
            }
        }

        // 构建精简版
        var result = kept.join('。') + '。';
        result += '余查体未见明显异常。';
        if (neuroSentence) {
            result += neuroSentence + '。';
        }

        return result;
    }

    /**
     * [v2.3 重写] 同步首次病程记录中的体查段落
     * 核心变更：首次病程记录的体格检查使用入院记录的精简版（generateCondensedPE），
     *          保留相关系统阳性体征，省略无关正常描述，符合临床书写规范。
     * 支持三种首次病程格式：
     *   策略1（标准格式）：有"体格检查/查体"段落 → 直接替换该段落
     *   策略2（Pattern A）：有"专科检查"编号项但无"体格检查"段落 → 将该项改为"查体"，内含PE+专科检查
     *   策略3（Pattern B）：无PE和专科检查段落 → 在"二、初步诊断"前插入"查体"和"专科检查"项
     */
    function syncFirstCourse(tVal, pVal, rVal, bpVal, diseaseItem, specialistResult, admissionPE) {
        var firstCourseEl = document.getElementById('firstCourse');
        if (!firstCourseEl || !firstCourseEl.value) return;

        var fcText = firstCourseEl.value;
        // 使用精简版体格检查文本（保留阳性发现，省略无关正常描述）
        var peBody = generateCondensedPE(admissionPE, diseaseItem) || '';
        var specText = (specialistResult || '').replace(/\n/g, ' ');
        // 清理专科检查文本：去除可能存在的"专科检查："前缀，避免重复
        specText = specText.replace(/^专科检查[：:]\s*/, '');

        // ===== 策略1：标准格式 — 查找"体格检查/查体"段落起始位置 =====
        // 支持格式: "3.体格检查：" / "4. 体格检查：" / "3、体格检查：" / "【体格检查】" / "3.查体：" / "查体："
        var peStartRegex = /(?:\d+[\.．、]\s*|【)?(?:体格检查|查体)[：:】]/;
        var peStartMatch = fcText.match(peStartRegex);

        if (peStartMatch) {
            var peStartIdx = peStartMatch.index;
            var peHeader = peStartMatch[0];
            var afterPE = peStartIdx + peHeader.length;

            // 查找下一章节标记（辅助检查/初步诊断）
            var nextSectionRegex = /(?:\d+[\.．、]\s*|【)?(?:辅助检查|初步诊断)/;
            var nextSectionMatch = fcText.substring(afterPE).match(nextSectionRegex);
            var nextSectionIdx = -1;
            if (nextSectionMatch) {
                nextSectionIdx = afterPE + nextSectionMatch.index;
            }

            // 检测原始文本中专科检查的标题格式（保留原始编号）
            var specHeader = '专科检查：';
            var specHeaderMatch = fcText.substring(afterPE).match(/(?:\d+[\.．、]\s*|【)?专科检查[：:】]/);
            if (specHeaderMatch) {
                specHeader = specHeaderMatch[0];
            }

            // 构建替换内容（使用入院记录体查文本 + 专科检查文本）
            var newContent = peHeader + ' T：' + tVal + '  P：' + pVal + '  R：' + rVal + '  BP：' + bpVal +
                '\n   ' + peBody + '\n' + specHeader + specText;

            // 执行替换
            if (nextSectionIdx >= 0) {
                fcText = fcText.substring(0, peStartIdx) + newContent + '\n\n' + fcText.substring(nextSectionIdx);
            } else {
                fcText = fcText.substring(0, peStartIdx) + newContent;
            }

            firstCourseEl.value = fcText;
            return;
        }

        // ===== 策略2：Pattern A — 有"专科检查"编号项但无"体格检查"段落 =====
        // 适用于骨科等科室的首次病程格式：1、患者... 2、现病史... 3、专科检查... 4、辅助检查...
        var specItemRegex = /(\d+)([\.．、]\s*)专科检查[：:]/;
        var specItemMatch = fcText.match(specItemRegex);

        if (specItemMatch) {
            var specItemStart = specItemMatch.index;
            var specItemHeader = specItemMatch[0];      // e.g., "3、专科检查："
            var specNum = parseInt(specItemMatch[1]);   // e.g., 3
            var specSep = specItemMatch[2];              // e.g., "、"

            // 找到专科检查项的结束位置（下一编号项或"二、"标记）
            var afterSpecItem = specItemStart + specItemHeader.length;
            var nextItemRegex = /\n\d+[\.．、]\s*(?:辅助检查|既往史|个人史|家族史|过敏史)|\n二[、．.]/;
            var nextItemMatch = fcText.substring(afterSpecItem).match(nextItemRegex);
            var specItemEnd = fcText.length;
            if (nextItemMatch) {
                specItemEnd = afterSpecItem + nextItemMatch.index;
            }

            // 将原"专科检查"项替换为"查体"项，内含体格检查 + 专科检查内容
            var peItemContent = specNum + specSep + '查体：T：' + tVal + '  P：' + pVal + '  R：' + rVal + '  BP：' + bpVal +
                '\n   ' + peBody + '\n   专科检查：' + specText;

            fcText = fcText.substring(0, specItemStart) + peItemContent + fcText.substring(specItemEnd);

            firstCourseEl.value = fcText;
            return;
        }

        // ===== 策略3：Pattern B — 无PE和专科检查段落，在"二、初步诊断"前插入 =====
        // 适用于呼吸/心血管/泌尿等科室的首次病程格式：1、患者... 2、现病史... 二、初步诊断...
        var diagStartRegex = /二[、．.]\s*初步诊断/;
        var diagMatch = fcText.match(diagStartRegex);

        if (diagMatch) {
            var diagIdx = diagMatch.index;
            var insertContent = '3、查体：T：' + tVal + '  P：' + pVal + '  R：' + rVal + '  BP：' + bpVal +
                '\n   ' + peBody + '\n' +
                '4、专科检查：' + specText + '\n\n';

            fcText = fcText.substring(0, diagIdx) + insertContent + fcText.substring(diagIdx);

            firstCourseEl.value = fcText;
            return;
        }

        // 以上策略均不匹配，不做修改
    }

    return {
        applySmartPE: applySmartPE,
        // 内部函数暴露用于测试验证
        _deconflictPE: deconflictPE,
        _classifyDiseaseSystem: classifyDiseaseSystem,
        _specHasSystemFinding: specHasSystemFinding,
        _extractAllClauses: extractAllClauses,
        _isClauseNegative: isClauseNegative,
        _needsDeconfliction: needsDeconfliction,
        _generateCondensedPE: generateCondensedPE,
        _sentenceHasAbnormal: sentenceHasAbnormal,
        _sentenceMatchesSystem: sentenceMatchesSystem,
        _syncFirstCourse: syncFirstCourse
    };

})();
