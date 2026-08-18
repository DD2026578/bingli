/**
 * 华医临床计算器及打印报告推导引擎 (Clinical Calculators & Reports Engine)
 */

// 切换计算器分类面板
function switchCalcCat(catId, btnEl){
    document.querySelectorAll('.calc-nav-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.calc-cat-panel').forEach(p=>p.classList.remove('active'));
    if(btnEl) btnEl.classList.add('active');
    const panel = document.getElementById('calc-cat-' + catId);
    if(panel) panel.classList.add('active');
}

// 结果复制辅助函数
function copyResultToRecord(text){
    if (window.copyToClipboard) {
        window.copyToClipboard(text);
    } else {
        navigator.clipboard.writeText(text);
    }
    if (window.showToast) {
        window.showToast('📋 计算评估结果已复制到剪贴板！');
    }
}

// 通用数值范围校验：不通过时提示并返回 false
function validNum(v, min, max, label){
    if(!(v >= min && v <= max)){
        if(window.showToast) window.showToast('⚠️ ' + label + '请输入有效数值（' + min + '~' + max + '）！');
        return false;
    }
    return true;
}

// 统一结果渲染：展示结果 + 复制按钮（可选附加按钮）
function showCalcResult(boxId, html, resText, extraHtml){
    const box = document.getElementById(boxId);
    if(!box) return;
    box.style.display = 'block';
    box.innerHTML = html +
        `<button class="calc-insert-btn" onclick="copyResultToRecord(\`${resText}\`)">📋 复制结果至病历</button>` +
        (extraHtml || '');
}

// 1. 肌酐清除率 (Ccr) / eGFR
function calcCcr(){
    const gender = document.getElementById('ccr_gender').value;
    const age = parseFloat(document.getElementById('ccr_age').value);
    const weight = parseFloat(document.getElementById('ccr_weight').value);
    const scr = parseFloat(document.getElementById('ccr_scr').value);
    if(!validNum(age, 1, 120, '年龄') || !validNum(weight, 1, 300, '体重') || !validNum(scr, 1, 2000, '血肌酐')) return;

    let ccr = ((140 - age) * weight) / (0.818 * scr);
    if(gender === 'female') ccr *= 0.85;

    const scr_mg = scr / 88.4;
    const k = gender === 'female' ? 0.7 : 0.9;
    const a = gender === 'female' ? -0.241 : -0.302;
    let egfr = 142 * Math.pow(Math.min(scr_mg / k, 1), a) * Math.pow(Math.max(scr_mg / k, 1), -1.200) * Math.pow(0.9938, age);
    if(gender === 'female') egfr *= 1.012;

    let stage = '';
    if(egfr >= 90) stage = 'CKD 1期 (肾功能正常或高滤过)';
    else if(egfr >= 60) stage = 'CKD 2期 (肾功能轻度减退)';
    else if(egfr >= 45) stage = 'CKD 3a期 (肾功能中重度减退)';
    else if(egfr >= 30) stage = 'CKD 3b期 (肾功能中重度减退)';
    else if(egfr >= 15) stage = 'CKD 4期 (肾功能重度减退)';
    else stage = 'CKD 5期 (终末期肾病/尿毒症期)';

    const resText = `【肾功能及肌酐清除率评估】\n• Cockcroft-Gault 肌酐清除率 (Ccr): ${ccr.toFixed(1)} mL/min\n• CKD-EPI (2021) 估算肾小球滤过率 (eGFR): ${egfr.toFixed(1)} mL/min/1.73m²\n• 临床分级评估: ${stage}\n• 依据标准: 人卫第10版《内科学》P522 / 中国CKD诊治指南`;

    showCalcResult('res_ccr', `<div><strong>计算结果：Ccr = ${ccr.toFixed(1)} mL/min | eGFR = ${egfr.toFixed(1)} mL/min/1.73m²</strong></div>
    <div style="margin-top:4px;color:#334155">分期提示：<b>${stage}</b></div>
    `, resText);
}

// 2. BSA 体表面积
function calcBSA(){
    const h = parseFloat(document.getElementById('bsa_height').value);
    const w = parseFloat(document.getElementById('bsa_weight').value);
    if(!validNum(h, 30, 250, '身高') || !validNum(w, 1, 300, '体重')) return;

    let bsa_xws = 0;
    if(w <= 50) {
        bsa_xws = 0.0061 * h + 0.0128 * w - 0.0529;
    } else {
        bsa_xws = 1.05 + (w - 50) * 0.012;
    }

    let bsa_dubois = 0.007184 * Math.pow(h, 0.725) * Math.pow(w, 0.425);

    const resText = `【体表面积 BSA 测算结果】\n• 许文生中国人公式 BSA: ${bsa_xws.toFixed(2)} m²\n• DuBois 标准公式 BSA: ${bsa_dubois.toFixed(2)} m²\n• 依据标准: 人卫第10版《儿科学》P45 / 《外科学》P129`;

    showCalcResult('res_bsa', `<div><strong>许文生公式 BSA = ${bsa_xws.toFixed(2)} m² | DuBois公式 BSA = ${bsa_dubois.toFixed(2)} m²</strong></div>
    `, resText);
}

// 3. 校正血钙
function calcCorrectedCa(){
    const ca = parseFloat(document.getElementById('ca_val').value);
    const alb = parseFloat(document.getElementById('ca_alb').value);
    if(!validNum(ca, 0.5, 5, '血钙') || !validNum(alb, 10, 60, '白蛋白')) return;

    const corrected = ca + 0.02 * (40 - alb);
    let status = '';
    if(corrected < 2.25) status = '偏低 (真低钙血症风险)';
    else if(corrected > 2.75) status = '偏高 (高钙血症风险)';
    else status = '正常范围 (2.25 ~ 2.75 mmol/L)';

    const resText = `【校正血钙评估】\n• 实测血钙: ${ca.toFixed(2)} mmol/L (白蛋白 ALB ${alb} g/L)\n• 校正血钙: ${corrected.toFixed(2)} mmol/L (${status})\n• 依据标准: 人卫第10版《内科学》P801 (每降低10g/L ALB，血钙补加0.2mmol/L)`;

    showCalcResult('res_ca', `<div><strong>校正血钙结果: ${corrected.toFixed(2)} mmol/L (${status})</strong></div>
    `, resText);
}

// 4. 阴离子隙 (AG) & 补钠量
function calcAG(){
    const na = parseFloat(document.getElementById('ag_na').value);
    const cl = parseFloat(document.getElementById('ag_cl').value);
    const hco3 = parseFloat(document.getElementById('ag_hco3').value);
    const gender = document.getElementById('ag_gender').value;
    const weight = parseFloat(document.getElementById('ag_weight').value);
    if(!validNum(na, 100, 180, '血钠') || !validNum(cl, 60, 140, '血氯') || !validNum(hco3, 5, 50, '碳酸氢根') || !validNum(weight, 1, 300, '体重')) return;

    const ag = na - (cl + hco3);
    let agStatus = '';
    if(ag > 16) agStatus = '升高 (&gt;16 mmol/L，高AG型代谢性酸中毒风险，如酮症酸中毒、乳酸酸中毒)';
    else if(ag < 8) agStatus = '降低 (&lt;8 mmol/L，见于低白蛋白血症等)';
    else agStatus = '正常范围 (8 ~ 16 mmol/L)';

    let defNa = 0;
    let ns_ml = 0;
    let hyper_na_ml = 0;
    if(na < 135) {
        const factor = gender === 'female' ? 0.5 : 0.6;
        defNa = (142 - na) * weight * factor;
        ns_ml = defNa / 0.154;
        hyper_na_ml = defNa / 0.513;
    }

    const resText = `【阴离子隙 AG 与补钠评估】\n• 阴离子隙 (AG): ${ag.toFixed(1)} mmol/L (${agStatus.replace(/&gt;/g,'>').replace(/&lt;/g,'<')})\n` + (na < 135 ? `• 缺钠量估计: ${defNa.toFixed(0)} mmol (相当于 0.9%生理盐水 ${ns_ml.toFixed(0)} ml 或 3%高渗盐水 ${hyper_na_ml.toFixed(0)} ml)\n• 提示: 首日补给缺钠量的 1/2 + 生理需要量` : '• 血钠正常或偏高，无需急诊补钠。') + `\n• 依据标准: 人卫第10版《内科学》P789-792`;

    showCalcResult('res_ag', `<div><strong>阴离子隙 (AG) = ${ag.toFixed(1)} mmol/L (${agStatus})</strong></div>` +
    (na < 135 ? `<div style="margin-top:4px">累计缺钠量: <b>${defNa.toFixed(0)} mmol</b> (相当于 0.9%NS <b>${ns_ml.toFixed(0)}ml</b> 或 3%高盐 <b>${hyper_na_ml.toFixed(0)}ml</b>)</div>` : ''), resText);
}

// 5. Child-Pugh 肝功能评级
function calcChildPugh(){
    const enc = parseInt(document.getElementById('cp_encephalopathy').value);
    const asc = parseInt(document.getElementById('cp_ascites').value);
    const tbil = parseInt(document.getElementById('cp_tbil').value);
    const alb = parseInt(document.getElementById('cp_alb').value);
    const pt = parseInt(document.getElementById('cp_pt').value);

    const score = enc + asc + tbil + alb + pt;
    let grade = '', desc = '';
    if(score <= 6) { grade = 'A 级 (5~6分)'; desc = '肝功能代偿良好，手术耐受力好'; }
    else if(score <= 9) { grade = 'B 级 (7~9分)'; desc = '肝功能中度受损，手术需谨慎并做充分术前准备'; }
    else { grade = 'C 级 (10~15分)'; desc = '肝功能严重失代偿，通常为大手术禁忌'; }

    const resText = `【Child-Pugh 肝功能评级结果】\n• 评价总分: ${score} 分\n• 肝功能分级: Child-Pugh ${grade}\n• 临床指导: ${desc}\n• 依据标准: 人卫第10版《外科学》P418`;

    showCalcResult('res_cp', `<div><strong>Child-Pugh 总分: ${score} 分 | 肝功能分级: ${grade}</strong></div>
    <div style="margin-top:4px;color:#334155">临床意见: <b>${desc}</b></div>
    `, resText);
}

// 6. FIB-4 & APRI
function calcFIB4(){
    const age = parseFloat(document.getElementById('fib_age').value);
    const ast = parseFloat(document.getElementById('fib_ast').value);
    const alt = parseFloat(document.getElementById('fib_alt').value);
    const plt = parseFloat(document.getElementById('fib_plt').value);
    if(!validNum(age, 18, 120, '年龄') || !validNum(ast, 1, 2000, 'AST') || !validNum(alt, 1, 2000, 'ALT') || !validNum(plt, 1, 2000, '血小板')) return;

    const fib4 = window.CalcCore ? window.CalcCore.fib4(age, ast, alt, plt) : (age * ast) / (plt * Math.sqrt(alt));
    const apri = window.CalcCore ? window.CalcCore.apri(ast, plt) : ((ast / 40) / plt) * 100;

    let fib4_desc = '';
    if(fib4 < 1.45) fib4_desc = '低风险 (排除进展性肝纤维化/肝硬化 NPV>90%)';
    else if(fib4 > 3.25) fib4_desc = '高风险 (提示存在显著肝纤维化/肝硬化 PPV>65%)';
    else fib4_desc = '灰度中风险区域 (需结合肝脏弹性剪切波超声度测量/肝穿刺评估)';

    const apri_desc = apri > 2 ? '大于2，提示肝硬化风险高' : (apri < 0.5 ? '小于0.5，排除肝硬化可能性大' : '0.5~2之间，处于灰区，需结合影像学或肝穿刺进一步评估');
    const resText = `【FIB-4 & APRI 肝纤维化评分结果】\n• FIB-4 指数: ${fib4.toFixed(2)} (${fib4_desc})\n• APRI 指数: ${apri.toFixed(2)} (${apri_desc})\n• 依据指南: 中华医学会《慢性乙型肝炎防治指南 (2022版)》/ 人卫第10版《内科学》P431`;

    showCalcResult('res_fib', `<div><strong>FIB-4 = ${fib4.toFixed(2)} | APRI = ${apri.toFixed(2)}</strong></div>
    <div style="margin-top:4px;color:#334155">评估提示: <b>${fib4_desc}</b></div>
    `, resText);
}

// 7. CURB-65
function calcCURB65(){
    let score = 0;
    if(document.getElementById('curb_c').checked) score++;
    if(document.getElementById('curb_u').checked) score++;
    if(document.getElementById('curb_r').checked) score++;
    if(document.getElementById('curb_b').checked) score++;
    if(document.getElementById('curb_65').checked) score++;

    let risk = '', rec = '';
    if(score <= 1) { risk = '低危 (30天死亡率 < 1.5%)'; rec = '可在门诊口服抗生素治疗'; }
    else if(score === 2) { risk = '中危 (30天死亡率 9.2%)'; rec = '建议住院治疗或密切随访'; }
    else { risk = '高危 (30天死亡率 22% ~ 30%)'; rec = '建议立即住院，评估是否需收入 ICU'; }

    const resText = `【CURB-65 社区获得性肺炎 (CAP) 重症评分】\n• 评分结果: ${score} 分 (${risk})\n• 临床处置建议: ${rec}\n• 依据指南: 人卫第10版《内科学》P48 / 《中国 CAP 诊治指南》`;

    showCalcResult('res_curb', `<div><strong>CURB-65 得分: ${score} 分 (${risk})</strong></div>
    <div style="margin-top:4px;color:#334155">处置建议: <b>${rec}</b></div>
    `, resText);
}

// 8. Wells DVT
function calcWellsDVT(){
    let score = 0;
    for(let i=1; i<=9; i++){
        if(document.getElementById('wells_' + i).checked) score += 1;
    }
    if(document.getElementById('wells_alt').checked) score -= 2;

    let risk = '', rec = '';
    if(document.getElementById('wells_two_tier').checked){
        if(score < 2) { risk = '低危（两分法，DVT可能性小）'; rec = '建议检测 D-二聚体，若阴性可基本排除 DVT'; }
        else { risk = 'DVT可能性大（两分法，评分≥2）'; rec = '建议行全下肢静脉加压超声(CUS)确诊'; }
    } else {
        if(score <= 0) { risk = '低危 (DVT发生概率约为 3%)'; rec = '建议检测 D-二聚体，若阴性可基本排除 DVT'; }
        else if(score <= 2) { risk = '中危 (DVT发生概率约为 17%)'; rec = '建议行高敏 D-二聚体检测或下肢静脉加压超声(CUS)'; }
        else { risk = '高危 (DVT发生概率约为 75%)'; rec = '建议直接进行全下肢静脉加压超声(CUS)显像诊查'; }
    }

    const resText = `【Wells 下肢深静脉血栓 (DVT) 风险评分】\n• 评估得分: ${score} 分 (${risk})\n• 临床处置建议: ${rec}\n• 依据标准: 人卫第10版《外科学》P542 / 血管外科规范`;

    showCalcResult('res_wells', `<div><strong>Wells DVT 得分: ${score} 分 (${risk})</strong></div>
    <div style="margin-top:4px;color:#334155">建议策略: <b>${rec}</b></div>
    `, resText);
}

// 9. 烧伤补液
function calcBurnFluid(){
    const type = document.getElementById('burn_type').value;
    const weight = parseFloat(document.getElementById('burn_weight').value);
    const area = parseFloat(document.getElementById('burn_area').value);
    const ratio = document.getElementById('burn_ratio').value;
    if(!validNum(weight, 1, 300, '体重') || !validNum(area, 1, 100, '烧伤面积')) return;

    const factor = type === 'child' ? 2.0 : 1.5;
    const extraTotal = area * weight * factor;
    let crystalRatio = ratio === '1:1' ? 0.5 : (2/3);
    let colloidRatio = ratio === '1:1' ? 0.5 : (1/3);

    const crystalVal = extraTotal * crystalRatio;
    const colloidVal = extraTotal * colloidRatio;
    const baseWater = type === 'child' ? (weight * 60) : 2000;
    const grandTotal = extraTotal + baseWater;
    const first8h = extraTotal / 2 + baseWater / 3;

    const resText = `【烧伤休克期首个 24h 液体复苏计划】\n• 烧伤面积: Ⅱ~Ⅲ度 ${area}% (体重 ${weight}kg)\n• 第1个 24h 额外电解质与胶体总量: ${extraTotal.toFixed(0)} ml (晶体 ${crystalVal.toFixed(0)} ml + 胶体 ${colloidVal.toFixed(0)} ml)\n• 基础水分补充量: ${baseWater.toFixed(0)} ml (5% 葡萄糖液)\n• 第1个 24h 输液总总量: ${grandTotal.toFixed(0)} ml\n• 关键医嘱: 前 8 小时内需输入额外输液量的 1/2 (${(extraTotal/2).toFixed(0)} ml) + 基础量 1/3，即前8h入量约 ${first8h.toFixed(0)} ml\n• 依据标准: 人卫第10版《外科学》P132-136`;

    showCalcResult('res_burn', `<div><strong>首个 24h 额外电解质胶体总入量 = ${extraTotal.toFixed(0)} ml (晶体:${crystalVal.toFixed(0)}ml, 胶体:${colloidVal.toFixed(0)}ml)</strong></div>
    <div style="margin-top:4px;color:#334155">基础水分: ${baseWater.toFixed(0)}ml | <b>前 8 小时需快速输入额外量的 1/2 (${(extraTotal/2).toFixed(0)}ml)</b></div>
    `, resText);
}

// 10. 儿科体重与补液张力
function calcPedia(){
    const stage = document.getElementById('pedia_age_stage').value;
    const val = parseFloat(document.getElementById('pedia_age_val').value);
    const dehydrate = document.getElementById('pedia_dehydrate').value;
    const sodium = document.getElementById('pedia_sodium').value;
    if(!(val >= 0)){
        if(window.showToast) window.showToast('⚠️ 请输入年龄数值！');
        return;
    }
    let ageOk = true;
    if(stage === 'm1_6' && (val < 1 || val > 6)) ageOk = false;
    else if(stage === 'm7_12' && (val < 7 || val > 12)) ageOk = false;
    else if(stage === 'y2_12' && (val < 2 || val > 12)) ageOk = false;
    if(!ageOk){
        if(window.showToast) window.showToast('⚠️ 年龄与所选年龄段不匹配，请核对（1~6月 / 7~12月 / 2~12岁）！');
        return;
    }

    let estWeight = 0;
    if(stage === 'm1_6') estWeight = 3.2 + val * 0.7;
    else if(stage === 'm7_12') estWeight = 6 + val * 0.25;
    else estWeight = val * 2 + 8;

    let tension = '', liquidDesc = '';
    if(sodium === 'iso') { tension = '1/2 张液'; liquidDesc = '2:3:1 液 (2份生理盐水 + 3份5%GS + 1份1.4%NaHCO3)'; }
    else if(sodium === 'hypo') { tension = '2/3 张液'; liquidDesc = '4:3:2 液 (4份生理盐水 + 3份5%GS + 2份1.4%NaHCO3)'; }
    else { tension = '1/3 ~ 1/5 张液'; liquidDesc = '1:2 液 (1份NS + 2份GS) 或 1:4 液'; }

    let fluidPerKg = 0;
    if(dehydrate === 'mild') fluidPerKg = 50;
    else if(dehydrate === 'mod') fluidPerKg = 80;
    else fluidPerKg = 110;

    const totalFluid = estWeight * fluidPerKg;

    const resText = `【儿科估算体重与补液张力】\n• 公式估算标准体重: ${estWeight.toFixed(1)} kg\n• 累积损失量估算: 约 ${totalFluid.toFixed(0)} ml (${dehydrate === 'severe' ? '需优先按20ml/kg等张液快速扩容' : ''})\n• 推荐液体张力: ${tension} (${liquidDesc})\n• 依据标准: 人卫第10版《儿科学》P47, P235`;

    showCalcResult('res_pedia', `<div><strong>小儿预测标准体重: ${estWeight.toFixed(1)} kg | 推荐补液张力: ${tension}</strong></div>
    <div style="margin-top:4px;color:#334155">推荐配液: <b>${liquidDesc}</b></div>
    `, resText);
}

// 11. MELD 终末期肝病评分
function calcMELD(){
    const tbil = parseFloat(document.getElementById('meld_tbil').value);
    const inr = parseFloat(document.getElementById('meld_inr').value);
    const scr = parseFloat(document.getElementById('meld_scr').value);
    const dialysis = document.getElementById('meld_dialysis').value;
    if(!validNum(tbil, 1, 1000, '总胆红素') || !validNum(inr, 0.5, 10, 'INR') || !validNum(scr, 10, 2000, '血肌酐')) return;

    const tbil_mg = tbil / 17.1;
    let scr_mg = scr / 88.4;
    if(dialysis === 'yes') scr_mg = 4.0;

    let meld = 3.78 * Math.log(Math.max(tbil_mg, 1)) + 11.2 * Math.log(Math.max(inr, 1)) + 9.57 * Math.log(Math.max(scr_mg, 1)) + 6.43;
    meld = Math.round(meld);
    if(meld < 6) meld = 6;
    if(meld > 40) meld = 40;

    let risk = '';
    if(meld < 15) risk = '低风险 — 3个月死亡率约 1.9%~6.0%';
    else if(meld < 20) risk = '中风险 — 3个月死亡率约 6.0%~19.6%';
    else if(meld < 30) risk = '高风险 — 3个月死亡率约 19.6%~52.6%';
    else risk = '极高风险 — 3个月死亡率 > 52.6%，建议肝移植评估';

    const resText = `【MELD 终末期肝病评分】\n• MELD 评分: ${meld} 分\n• 风险评估: ${risk}\n• 依据标准: 人卫第10版《内科学》P433 / UNOS肝移植分配标准`;

    showCalcResult('res_meld', `<div><strong>MELD 评分 = ${meld} 分</strong></div>
    <div style="margin-top:4px;color:#334155">${risk}</div>
    `, resText);
}

// 12. Wells PE 肺栓塞评分
function calcWellsPE(){
    let score = 0;
    if(document.getElementById('wpe_1').checked) score += 3;
    if(document.getElementById('wpe_2').checked) score += 1.5;
    if(document.getElementById('wpe_3').checked) score += 1.5;
    if(document.getElementById('wpe_4').checked) score += 1.5;
    if(document.getElementById('wpe_5').checked) score += 1;
    if(document.getElementById('wpe_6').checked) score += 1;

    let risk = '';
    if(score <= 2) risk = '低危 (PE概率约 1.3%~6.0%) — 可考虑D-二聚体排除';
    else if(score <= 6) risk = '中危 (PE概率约 21.0%) — 建议CTPA确诊';
    else risk = '高危 (PE概率约 50.0%) — 紧急CTPA或V/Q显像，必要时溶栓/取栓';

    const resText = `【Wells 肺栓塞(PE)风险评分】\n• Wells PE 评分: ${score} 分\n• 风险评估: ${risk}\n• 依据标准: 人卫第10版《内科学》P67 / ESC肺栓塞指南`;

    showCalcResult('res_wpe', `<div><strong>Wells PE 评分 = ${score} 分</strong></div>
    <div style="margin-top:4px;color:#334155">${risk}</div>
    `, resText);
}

// 13. GCS 格拉斯哥昏迷评分
function calcGCS(){
    const eye = parseInt(document.getElementById('gcs_eye').value);
    const verbal = parseInt(document.getElementById('gcs_verbal').value);
    const motor = parseInt(document.getElementById('gcs_motor').value);
    const total = eye + verbal + motor;

    const info = getPtInfo('gcs');
    let patientInfo = '';
    if(info.name || info.gender || info.age){
        patientInfo = `\n• 患者: ${info.name || '未填'} | ${info.gender || '未选'} | ${info.age ? info.age+'岁' : '未填'}${info.bed ? ' | 床号: '+info.bed : ''}`;
    }

    let severity = '';
    if(total >= 13) severity = '轻度颅脑损伤 (意识障碍较轻)';
    else if(total >= 9) severity = '中度颅脑损伤 (意识障碍明显)';
    else severity = '重度颅脑损伤 (昏迷，需紧急气道保护与降颅压)';

    const resText = `【GCS 格拉斯哥昏迷评分】\n${patientInfo}\n• 睁眼反应(E): ${eye} 分\n• 言语反应(V): ${verbal} 分\n• 运动反应(M): ${motor} 分\n• GCS 总分: E${eye}V${verbal}M${motor} = ${total} 分\n• 伤情评估: ${severity}\n• 评估时间: ${info.date}\n• 依据标准: 人卫第10版《外科学》P205`;

    showCalcResult('res_gcs', `<div><strong>GCS = E${eye}V${verbal}M${motor} = ${total} 分</strong></div>
    <div style="margin-top:4px;color:#334155">${severity}</div>
    
    `, resText, `<button class="calc-insert-btn" onclick="printAssessmentResult('gcs')">🖨️ 打印</button>`);
}

// 14. Caprini 围手术期DVT风险评估
function calcCaprini(){
    let score = 0;
    const checks = [
        ['caprini_1', 1], ['caprini_2', 1], ['caprini_3', 1], ['caprini_4', 1],
        ['caprini_5', 2], ['caprini_6', 2], ['caprini_7', 2], ['caprini_8', 2],
        ['caprini_9', 3], ['caprini_10', 3], ['caprini_11', 5], ['caprini_12', 4]
    ];
    checks.forEach(([id, pts]) => {
        if(document.getElementById(id).checked){ score += pts; }
    });

    const info = getPtInfo('caprini');
    let patientInfo = '';
    if(info.name || info.gender || info.age){
        patientInfo = `\n• 患者: ${info.name || '未填'} | ${info.gender || '未选'} | ${info.age ? info.age+'岁' : '未填'}${info.bed ? ' | 床号: '+info.bed : ''}`;
    }

    let risk = '', recommendation = '';
    if(score <= 1){ risk = '极低危 (DVT发生率 < 0.5%)'; recommendation = '早期活动，无需药物预防'; }
    else if(score <= 2){ risk = '低危 (DVT发生率约 1.5%)'; recommendation = '推荐基础预防（早期活动 + 弹力袜）'; }
    else if(score <= 4){ risk = '中危 (DVT发生率约 3.0%)'; recommendation = '建议药物预防（低分子肝素/普通肝素），或机械预防（IPC）'; }
    else{ risk = '高危/极高危 (DVT发生率 ≥ 6.0%)'; recommendation = '强烈推荐药物 + 机械联合预防，术后尽早启动抗凝'; }

    const resText = `【Caprini 围手术期DVT风险评估】\n${patientInfo}\n• Caprini 总分: ${score} 分\n• 风险等级: ${risk}\n• 预防建议: ${recommendation}\n• 评估时间: ${info.date}\n• 依据标准: 人卫第10版《外科学》P542-543 / ACCP血栓预防指南`;

    showCalcResult('res_caprini', `<div><strong>Caprini 评分 = ${score} 分</strong></div>
    <div style="margin-top:4px;color:#334155"><b>${risk}</b></div>
    <div style="margin-top:6px;padding:8px;background:#f0fdf4;border-radius:6px;font-size:13px">💡 ${recommendation}</div>
    
    `, resText, `<button class="calc-insert-btn" onclick="printAssessmentResult('caprini')">🖨️ 打印</button>`);
}

// 15. Padua 内科住院患者VTE风险评估
function calcPadua(){
    let score = 0;
    const checks = [
        ['padua_1', 3], ['padua_2', 3], ['padua_3', 2], ['padua_4', 3],
        ['padua_5', 2], ['padua_6', 1], ['padua_7', 1], ['padua_8', 1],
        ['padua_9', 1], ['padua_10', 1], ['padua_11', 1], ['padua_12', 1]
    ];
    checks.forEach(([id, pts]) => {
        if(document.getElementById(id).checked) score += pts;
    });

    const info = getPtInfo('padua');
    let patientInfo = '';
    if(info.name || info.gender || info.age){
        patientInfo = `\n• 患者: ${info.name || '未填'} | ${info.gender || '未选'} | ${info.age ? info.age+'岁' : '未填'}${info.bed ? ' | 床号: '+info.bed : ''}`;
    }

    let risk = '', recommendation = '';
    if(score >= 4){ risk = '高危 (VTE发生率约 11.0%)'; recommendation = '强烈推荐药物预防（低分子肝素），除非有禁忌证；建议评估出血风险；早期下床活动+机械预防（弹力袜/IPC）'; }
    else{ risk = '低危 (VTE发生率约 0.6%~1.7%)'; recommendation = '推荐基础预防（早期活动、弹力袜），评估是否需要药物预防'; }

    const resText = `【Padua 内科住院患者VTE风险评估】\n${patientInfo}\n• Padua 总分: ${score} 分\n• 风险等级: ${risk}\n• 预防建议: ${recommendation}\n• 评估时间: ${info.date}\n• 依据标准: 人卫第10版《内科学》P71 / 中华医学会血栓防治指南`;

    showCalcResult('res_padua', `<div><strong>Padua 评分 = ${score} 分</strong></div>
    <div style="margin-top:4px;color:#334155"><b>${risk}</b></div>
    <div style="margin-top:6px;padding:8px;background:#f0fdf4;border-radius:6px;font-size:13px">💡 ${recommendation}</div>
    
    `, resText, `<button class="calc-insert-btn" onclick="printAssessmentResult('padua')">🖨️ 打印</button>`);
}

// 16. Hunt-Hess SAH 分级
function calcHuntHess(){
    const grade = parseInt(document.getElementById('hh_grade').value);
    let advice = '';
    if(grade === 0) advice = '未破裂动脉瘤，择期手术风险低';
    else if(grade === 1) advice = '手术风险低，尽早夹闭或介入栓塞';
    else if(grade === 2) advice = '手术风险较低，建议早期处理动脉瘤';
    else if(grade === 3) advice = '手术风险中等，需稳定后尽快处理';
    else if(grade === 4) advice = '手术风险高，先保守治疗，病情好转后手术';
    else advice = '濒危状态，以抢救生命为主，手术风险极高';

    const resText = `【Hunt-Hess 动脉瘤性SAH分级】\n• Hunt-Hess 分级: ${grade} 级\n• 处理建议: ${advice}\n• 依据标准: 人卫第10版《外科学》P225`;

    showCalcResult('res_hh', `<div><strong>Hunt-Hess 分级 = ${grade} 级</strong></div>
    <div style="margin-top:4px;color:#334155">${advice}</div>
    `, resText);
}

// 17. CHA2DS2-VASc 房颤血栓评分
function calcCHADS(){
    let score = 0;
    if(document.getElementById('chads_c').checked) score += 1;
    if(document.getElementById('chads_h').checked) score += 1;
    if(document.getElementById('chads_a75').checked) score += 2;
    if(document.getElementById('chads_d').checked) score += 1;
    if(document.getElementById('chads_s2').checked) score += 2;
    if(document.getElementById('chads_v').checked) score += 1;
    if(document.getElementById('chads_a65').checked) score += 1;
    if(document.getElementById('chads_sex').checked) score += 1;

    let risk = '';
    if(score === 0) risk = '低风险 — 年卒中率约 0.2%，可不抗凝(男性)';
    else if(score === 1) risk = '中风险 — 年卒中率约 0.6%~1.3%，考虑抗凝';
    else risk = '高风险 — 年卒中率 ≥ 1.9%，推荐口服抗凝药(NOAC/华法林)';

    const resText = `【CHA₂DS₂-VASc 房颤血栓风险评分】\n• CHA₂DS₂-VASc 评分: ${score} 分\n• 风险评估: ${risk}\n• 依据标准: 人卫第10版《内科学》P209 / ESC房颤管理指南`;

    showCalcResult('res_chads', `<div><strong>CHA₂DS₂-VASc 评分 = ${score} 分</strong></div>
    <div style="margin-top:4px;color:#334155">${risk}</div>
    `, resText);
}

// 18. qSOFA 脓毒症快速评分
function calcQSOFA(){
    let score = 0;
    if(document.getElementById('qsofa_1').checked) score += 1;
    if(document.getElementById('qsofa_2').checked) score += 1;
    if(document.getElementById('qsofa_3').checked) score += 1;

    let risk = '';
    if(score >= 2) risk = '高风险 — 院内死亡概率显著增加，需收入ICU并按脓毒症集束化治疗';
    else risk = '低风险 — 暂不满足qSOFA阳性标准，但需动态监测';

    const resText = `【qSOFA 快速脓毒症器官衰竭评估】\n• qSOFA 评分: ${score} / 3 分\n• 风险评估: ${risk}\n• 依据标准: 人卫第10版《内科学》P148 / 拯救脓毒症运动(SSC)2021指南`;

    showCalcResult('res_qsofa', `<div><strong>qSOFA 评分 = ${score} / 3 分</strong></div>
    <div style="margin-top:4px;color:#334155">${risk}</div>
    `, resText);
}

// 19. MEWS 改良早期预警评分
function calcMEWS(){
    const sbp = parseInt(document.getElementById('mews_sbp').value);
    const hr = parseInt(document.getElementById('mews_hr').value);
    const rr = parseInt(document.getElementById('mews_rr').value);
    const avpu = parseInt(document.getElementById('mews_avpu').value);
    const temp = parseInt(document.getElementById('mews_temp').value);
    const total = sbp + hr + rr + avpu + temp;

    let level = '';
    if(total < 4) level = '低风险 — 常规监测，每4~6小时复评';
    else if(total < 5) level = '中等风险 — 增加监测频次，通知上级医师';
    else if(total < 7) level = '高风险 — 需紧急呼叫医师评估，考虑转ICU';
    else level = '极高风险 — 立即启动抢救，转入ICU';

    const resText = `【MEWS 改良早期预警评分】\n• 收缩压: ${sbp} | 心率: ${hr} | 呼吸: ${rr} | 意识: ${avpu} | 体温: ${temp}\n• MEWS 总分: ${total} 分\n• 风险等级: ${level}\n• 依据标准: 中华医学会重症医学分会 / 人卫第10版《内科学》急危重症章节`;

    showCalcResult('res_mews', `<div><strong>MEWS 总分 = ${total} 分</strong></div>
    <div style="margin-top:4px;color:#334155">${level}</div>
    `, resText);
}

// 20. TIMI UA/NSTEMI 风险评分
function calcTIMI(){
    let score = 0;
    for(let i = 1; i <= 7; i++){
        if(document.getElementById('timi_' + i).checked) score += 1;
    }

    let risk = '';
    if(score <= 2) risk = '低风险 — 14天复合终点(死亡/心梗/紧急血运重建)约 4.7%~8.3%';
    else if(score <= 4) risk = '中风险 — 14天复合终点约 13.2%~19.9%，建议早期侵入策略';
    else risk = '高风险 — 14天复合终点约 26.2%~40.9%，推荐24~48h内冠脉造影+PCI';

    const resText = `【TIMI UA/NSTEMI 风险评分】\n• TIMI 评分: ${score} / 7 分\n• 风险评估: ${risk}\n• 依据标准: 人卫第10版《内科学》P243 / ACC/AHA NSTE-ACS指南`;

    showCalcResult('res_timi', `<div><strong>TIMI 评分 = ${score} / 7 分</strong></div>
    <div style="margin-top:4px;color:#334155">${risk}</div>
    `, resText);
}

// 21. BMI
function calcBMI(){
    const w = parseFloat(document.getElementById('bmi_weight').value);
    const h = parseFloat(document.getElementById('bmi_height').value);
    if(!validNum(w, 1, 300, '体重') || !validNum(h, 50, 250, '身高')) return;
    const bmi = CalcCore.bmi(w, h);
    let status = '';
    if(bmi < 18.5) status = '偏瘦';
    else if(bmi < 24) status = '正常范围';
    else if(bmi < 28) status = '超重';
    else status = '肥胖';
    const resText = `【BMI 体重指数】\n• BMI: ${bmi.toFixed(1)} kg/m²（${status}）\n• 依据标准: 中国成人体重判定标准（WS/T 428-2013）`;
    showCalcResult('res_bmi', `<div><strong>BMI = ${bmi.toFixed(1)} kg/m²（${status}）</strong></div>`, resText);
}

// 22. 孕周与预产期
function calcPreg(){
    const lmp = document.getElementById('preg_lmp').value;
    const on = document.getElementById('preg_on').value || undefined;
    if(!lmp){ if(window.showToast) window.showToast('⚠️ 请选择末次月经日期！'); return; }
    const r = CalcCore.gestationalAge(lmp, on);
    if(!r){ if(window.showToast) window.showToast('⚠️ 日期无效或晚于当前日期，请核对！'); return; }
    const edcStr = r.edc.getFullYear() + '-' + String(r.edc.getMonth()+1).padStart(2,'0') + '-' + String(r.edc.getDate()).padStart(2,'0');
    const resText = `【孕周与预产期】\n• 末次月经（LMP）: ${lmp}\n• 当前孕周: ${r.weeks}周+${r.days}天\n• 预产期（EDC）: ${edcStr}\n• 依据标准: 末次月经推算（Naegele 法，280天）`;
    showCalcResult('res_preg', `<div><strong>孕 ${r.weeks} 周 + ${r.days} 天 ｜ 预产期 ${edcStr}</strong></div>`, resText);
}

// 23. QTc（Bazett）
function calcQTc(){
    const qt = parseFloat(document.getElementById('qtc_qt').value);
    const hr = parseFloat(document.getElementById('qtc_hr').value);
    const gender = document.getElementById('qtc_gender').value;
    if(!validNum(qt, 200, 700, 'QT间期') || !validNum(hr, 20, 250, '心率')) return;
    const qtc = CalcCore.qtcBazett(qt, hr);
    const limit = gender === 'female' ? 460 : 450;
    const status = qtc > limit ? '延长（QTc > ' + limit + ' ms）' : '正常范围';
    const resText = `【QTc 校正QT间期（Bazett）】\n• QT: ${qt} ms，心率: ${hr} 次/分\n• QTc: ${qtc.toFixed(0)} ms（${status}）\n• 依据标准: Bazett 公式，QTc=${qt}/√(60/HR)`;
    showCalcResult('res_qtc', `<div><strong>QTc = ${qtc.toFixed(0)} ms（${status}）</strong></div>`, resText);
}

// 24. MAP 平均动脉压
function calcMAP(){
    const sbp = parseFloat(document.getElementById('map_sbp').value);
    const dbp = parseFloat(document.getElementById('map_dbp').value);
    if(!validNum(sbp, 50, 300, '收缩压') || !validNum(dbp, 30, 200, '舒张压')) return;
    if(sbp <= dbp){ if(window.showToast) window.showToast('⚠️ 收缩压应高于舒张压，请核对！'); return; }
    const map = CalcCore.mapArterial(sbp, dbp);
    const status = map >= 65 ? '达标（≥65 mmHg）' : '偏低（<65 mmHg，需关注灌注）';
    const resText = `【平均动脉压 MAP】\n• 收缩压 ${sbp} mmHg，舒张压 ${dbp} mmHg\n• MAP: ${map.toFixed(0)} mmHg（${status}）\n• 依据标准: MAP = DBP + (SBP-DBP)/3`;
    showCalcResult('res_map', `<div><strong>MAP = ${map.toFixed(0)} mmHg（${status}）</strong></div>`, resText);
}

// 25. SOFA 评分
function calcSOFA(){
    const items = ['sofa_resp','sofa_coag','sofa_liver','sofa_cv','sofa_neuro','sofa_renal'].map(id => parseInt(document.getElementById(id).value || '0', 10));
    const total = CalcCore.sofaScore({resp:items[0], coag:items[1], liver:items[2], cardiovascular:items[3], neuro:items[4], renal:items[5]});
    if(isNaN(total)){ if(window.showToast) window.showToast('⚠️ 请完整填写各分项！'); return; }
    const status = total >= 2 ? '提示存在器官功能障碍' : '暂未达 SOFA≥2 标准';
    const resText = `【SOFA 序贯器官衰竭评分】\n• 呼吸 ${items[0]} 分，凝血 ${items[1]} 分，肝 ${items[2]} 分，循环 ${items[3]} 分，神经 ${items[4]} 分，肾 ${items[5]} 分\n• SOFA 总分: ${total} 分（${status}）\n• 依据标准: Vincent 等 1996 / SSC 指南`;
    showCalcResult('res_sofa', `<div><strong>SOFA = ${total} 分（${status}）</strong></div>`, resText);
}

// 26. GRACE 评分
function calcGRACE(){
    const age = parseFloat(document.getElementById('grace_age').value);
    const hr = parseFloat(document.getElementById('grace_hr').value);
    const sbp = parseFloat(document.getElementById('grace_sbp').value);
    const cr = parseFloat(document.getElementById('grace_cr').value);
    const killip = parseInt(document.getElementById('grace_killip').value || '1', 10);
    if(!validNum(age, 20, 120, '年龄') || !validNum(hr, 20, 250, '心率') || !validNum(sbp, 50, 250, '收缩压') || !validNum(cr, 0.1, 20, '肌酐(mg/dL)')) return;
    const score = CalcCore.graceScore({
        age, hr, sbp, creatinineMg: cr, killip,
        cardiacArrest: document.getElementById('grace_ca').checked,
        stDeviation: document.getElementById('grace_st').checked,
        elevatedEnzymes: document.getElementById('grace_enz').checked
    });
    let risk = '';
    if(score <= 108) risk = '低危（院内死亡风险 <1%）';
    else if(score <= 140) risk = '中危（院内死亡风险 1%~3%）';
    else risk = '高危（院内死亡风险 >3%，建议早期侵入策略）';
    const resText = `【GRACE ACS 风险评分】\n• GRACE 评分: ${score} 分\n• 风险评估: ${risk}\n• 依据标准: GRACE 2.0/1.0 风险模型`;
    showCalcResult('res_grace', `<div><strong>GRACE = ${score} 分（${risk}）</strong></div>`, resText);
}

// 27. Glasgow-Blatchford 评分
function calcBlatchford(){
    const gender = document.getElementById('gb_gender').value;
    const bun = parseFloat(document.getElementById('gb_bun').value);
    const hb = parseFloat(document.getElementById('gb_hb').value);
    const sbp = parseFloat(document.getElementById('gb_sbp').value);
    const pulse = parseFloat(document.getElementById('gb_pulse').value);
    if(!validNum(bun, 1, 60, '尿素氮') || !validNum(hb, 30, 250, '血红蛋白') || !validNum(sbp, 50, 250, '收缩压') || !validNum(pulse, 30, 200, '脉搏')) return;
    const score = CalcCore.blatchfordScore({
        gender, bun, hb, sbp, pulse,
        melena: document.getElementById('gb_melena').checked,
        syncope: document.getElementById('gb_syncope').checked,
        liverDisease: document.getElementById('gb_liver').checked,
        heartFailure: document.getElementById('gb_hf').checked
    });
    let risk = '';
    if(score === 0) risk = '低危（可考虑门诊管理）';
    else if(score < 6) risk = '中危（建议住院观察）';
    else risk = '高危（建议急诊内镜及积极干预）';
    const resText = `【Glasgow-Blatchford 上消化道出血评分】\n• 评分: ${score} 分\n• 风险评估: ${risk}\n• 依据标准: Blatchford 等 2000`;
    showCalcResult('res_gb', `<div><strong>Blatchford = ${score} 分（${risk}）</strong></div>`, resText);
}

// 28. NIHSS 评分
function calcNIHSS(){
    const ids = ['nihss_1a','nihss_1b','nihss_1c','nihss_2','nihss_3','nihss_4','nihss_5a','nihss_5b','nihss_6a','nihss_6b','nihss_7','nihss_8','nihss_9','nihss_10','nihss_11'];
    const vals = ids.map(id => parseInt(document.getElementById(id).value || '0', 10));
    const total = CalcCore.nihssScore(vals);
    if(isNaN(total)){ if(window.showToast) window.showToast('⚠️ 请完整填写各分项！'); return; }
    let severity = '';
    if(total === 0) severity = '无卒中症状';
    else if(total <= 4) severity = '轻型';
    else if(total <= 15) severity = '中型';
    else if(total <= 20) severity = '中重型';
    else severity = '重型';
    const resText = `【NIHSS 美国国立卫生研究院卒中量表】\n• NIHSS 总分: ${total} / 42 分（${severity}）\n• 依据标准: NIHSS 1989`;
    showCalcResult('res_nihss', `<div><strong>NIHSS = ${total} / 42 分（${severity}）</strong></div>`, resText);
}

// 量表评估报告打印辅助
function printAssessmentResult(type){
    if(type === 'gcs') printGCSReport();
    else if(type === 'padua') printPaduaReport();
    else if(type === 'caprini') printCapriniReport();
}

function getPtInfo(prefix){
    const dateEl = document.getElementById(prefix+'_pt_date');
    let dateVal = '';
    if(dateEl && dateEl.value){
        const d = new Date(dateEl.value);
        if(!isNaN(d.getTime())){
            dateVal = d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate() + ' ' + String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
        }
    }
    if(!dateVal) dateVal = new Date().toLocaleString('zh-CN', {hour12:false});

    return {
        name: document.getElementById(prefix+'_pt_name').value.trim(),
        gender: document.getElementById(prefix+'_pt_gender').value,
        age: document.getElementById(prefix+'_pt_age').value,
        bed: document.getElementById(prefix+'_pt_bed').value.trim(),
        hospNo: document.getElementById(prefix+'_pt_hospNo').value.trim(),
        dept: document.getElementById(prefix+'_pt_dept').value.trim(),
        date: dateVal
    };
}

function ptInfoTable(info){
    const now = info.date || new Date().toLocaleString('zh-CN', {hour12:false});
    let rows = [];
    rows.push(`<tr><td style="background:#f0f0f0;font-weight:700;width:56px;text-align:center;font-size:11px;border:1px solid #333;padding:4px 6px">姓名</td><td style="border:1px solid #333;padding:4px 6px;font-size:11px">${info.name||'未填'}</td><td style="background:#f0f0f0;font-weight:700;width:56px;text-align:center;font-size:11px;border:1px solid #333;padding:4px 6px">性别</td><td style="border:1px solid #333;padding:4px 6px;font-size:11px">${info.gender||'未选'}</td><td style="background:#f0f0f0;font-weight:700;width:56px;text-align:center;font-size:11px;border:1px solid #333;padding:4px 6px">年龄</td><td style="border:1px solid #333;padding:4px 6px;font-size:11px">${info.age?info.age+'岁':'未填'}</td><td style="background:#f0f0f0;font-weight:700;width:56px;text-align:center;font-size:11px;border:1px solid #333;padding:4px 6px">床号</td><td style="border:1px solid #333;padding:4px 6px;font-size:11px">${info.bed||'-'}</td></tr>`);
    rows.push(`<tr><td style="background:#f0f0f0;font-weight:700;width:56px;text-align:center;font-size:11px;border:1px solid #333;padding:4px 6px">住院号</td><td style="border:1px solid #333;padding:4px 6px;font-size:11px">${info.hospNo||'-'}</td><td style="background:#f0f0f0;font-weight:700;width:56px;text-align:center;font-size:11px;border:1px solid #333;padding:4px 6px">科室</td><td style="border:1px solid #333;padding:4px 6px;font-size:11px">${info.dept||'-'}</td><td style="background:#f0f0f0;font-weight:700;width:56px;text-align:center;font-size:11px;border:1px solid #333;padding:4px 6px">评估日期</td><td colspan="3" style="border:1px solid #333;padding:4px 6px;font-size:11px">${now}</td></tr>`);
    return `<table style="width:100%;border-collapse:collapse;margin-bottom:10px;font-size:11px">${rows.join('')}</table>`;
}

function printStyle(){
    return `<style>
    *{margin:0;padding:0;box-sizing:border-box}
    @page{size:A4;margin:4mm}
    html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    body{font-family:"SimHei","Microsoft YaHei","SimSun",sans-serif;font-size:11px;line-height:1.45;color:#000;padding:10px 14px}
    .report-title{text-align:center;font-size:16px;font-weight:700;letter-spacing:5px;margin:6px 0 2px}
    .report-sub{text-align:center;font-size:9px;color:#555;margin-bottom:8px;letter-spacing:2px}
    .report-line{border-bottom:2px solid #000;margin-bottom:8px}
    .gcs-table{width:100%;border-collapse:collapse;margin:5px 0 8px;font-size:10.5px}
    .gcs-table th{background:#0e7490;color:#fff;padding:4px 6px;text-align:center;font-weight:700;border:1px solid #08607a}
    .gcs-table td{border:1px solid #ccc;padding:4px 6px;text-align:center;vertical-align:middle}
    .gcs-table .sel{background:#dcfce7;font-weight:700;color:#166534;border:2px solid #22c55e}
    .gcs-table .nosel{background:#fff;color:#999}
    .total-row{background:#fef3c7!important;font-weight:700;font-size:11px}
    .severity-box{border:2px solid #000;padding:6px 8px;margin:6px 0;border-radius:0;background:#fff;font-size:11px;line-height:1.55}
    .severity-box .score-display{font-size:20px;font-weight:700;text-align:center;margin:3px 0}
    .severity-box .severity-text{font-size:13px;font-weight:700;text-align:center;padding:4px;background:#0e7490;color:#fff;margin:5px 0}
    .assess-note{font-size:10px;line-height:1.7;margin:6px 0;padding:5px;background:#f8fafc;border:1px solid #e2e8f0}
    .assess-note b{color:#0e7490}
    .sign-area{display:flex;justify-content:flex-end;gap:40px;margin-top:12px}
    .sign-box{text-align:center}
    .sign-line{width:130px;border-bottom:1px solid #000;height:26px;margin-bottom:2px}
    .sign-label{font-size:10px;color:#555}
    @media print{body{padding:0}}
    </style>`;
}

function printGCSReport(){
    const info = getPtInfo('gcs');
    const eye = parseInt(document.getElementById('gcs_eye').value);
    const verbal = parseInt(document.getElementById('gcs_verbal').value);
    const motor = parseInt(document.getElementById('gcs_motor').value);
    const total = eye + verbal + motor;

    let severity = '', clinical = '', action = '';
    if(total >= 13){ severity = '轻型（轻度脑损伤）'; clinical = '意识障碍较轻，预后较好，通常不需特殊外科干预。'; action = '留观、定期复查GCS，必要时行CT检查排除颅内出血。'; }
    else if(total >= 9){ severity = '中型（中度脑损伤）'; clinical = '意识障碍明显，需密切监测神经功能变化。'; action = '建议CT检查，收入神经外科/ICU监护，监测颅内压。'; }
    else{ severity = '重型（重度脑损伤）'; clinical = '昏迷状态，预后较差，致残率和死亡率显著升高。'; action = '紧急气道保护（必要时气管插管），积极降颅压治疗，收入ICU，CT检查明确病因。'; }

    function gcsRow(label, value, score, selected){
        const bg = selected ? 'background:#dcfce7;font-weight:700;color:#166534;border:2px solid #22c55e' : 'background:#fff;color:#999;border:1px solid #ccc';
        const mark = selected ? '✅' : '-';
        return `<tr><td style="${bg};padding:5px 8px;text-align:center">${score}分</td><td style="${bg};padding:5px 8px;text-align:left">${label}</td><td style="${bg};padding:5px 8px;text-align:center;font-size:12px">${mark}</td></tr>`;
    }

    const eSel = (v) => v === eye;
    const vSel = (v) => v === verbal;
    const mSel = (v) => v === motor;

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>GCS评估报告</title>${printStyle()}</head><body>
    <div class="report-title">格 拉 斯 哥 昏 迷 评 分（GCS）</div>
    <div class="report-sub">Glasgow Coma Scale 临床评估报告</div>
    <div class="report-line"></div>
    ${ptInfoTable(info)}
    <table class="gcs-table">
    <colgroup><col style="width:160px"><col style="width:50px"><col><col style="width:50px"></colgroup>
    <tr><th>反应项目</th><th>分值</th><th>评分标准</th><th>勾选</th></tr>
    <tr><td rowspan="4" style="background:#f0f9ff;font-weight:700;font-size:13px;text-align:left;padding-left:10px;border:1px solid #08607a;vertical-align:middle">睁眼反应 (E)</td>
    ${gcsRow('自动睁眼', 4, 4, eSel(4))}</tr>
    <tr>${gcsRow('呼唤睁眼', 3, 3, eSel(3))}</tr>
    <tr>${gcsRow('刺痛睁眼', 2, 2, eSel(2))}</tr>
    <tr>${gcsRow('不睁眼', 1, 1, eSel(1))}</tr>
    <tr><td rowspan="5" style="background:#f0f9ff;font-weight:700;font-size:13px;text-align:left;padding-left:10px;border:1px solid #08607a;vertical-align:middle">言语反应 (V)</td>
    ${gcsRow('回答正确', 5, 5, vSel(5))}</tr>
    <tr>${gcsRow('回答错误', 4, 4, vSel(4))}</tr>
    <tr>${gcsRow('言语含混/不当', 3, 3, vSel(3))}</tr>
    <tr>${gcsRow('只能发音', 2, 2, vSel(2))}</tr>
    <tr>${gcsRow('不言语', 1, 1, vSel(1))}</tr>
    <tr><td rowspan="6" style="background:#f0f9ff;font-weight:700;font-size:13px;text-align:left;padding-left:10px;border:1px solid #08607a;vertical-align:middle">运动反应 (M)</td>
    ${gcsRow('遵嘱动作', 6, 6, mSel(6))}</tr>
    <tr>${gcsRow('刺痛定位', 5, 5, mSel(5))}</tr>
    <tr>${gcsRow('刺痛屈曲(逃避)', 4, 4, mSel(4))}</tr>
    <tr>${gcsRow('异常屈曲(去皮质)', 3, 3, mSel(3))}</tr>
    <tr>${gcsRow('异常伸直(去脑)', 2, 2, mSel(2))}</tr>
    <tr>${gcsRow('不动', 1, 1, mSel(1))}</tr>
    <tr class="total-row"><td colspan="2" style="text-align:center;font-size:14px">总 分</td><td colspan="2" style="font-size:18px;font-weight:900">${total} / 15 分（E${eye}V${verbal}M${motor}）</td></tr>
    </table>
    <div class="severity-box">
    <div class="score-display">GCS = ${total} 分</div>
    <div class="severity-text">${severity}</div>
    <div class="assess-note"><b>临床意义：</b>${clinical}<br><b>处理建议：</b>${action}<br><b>评分说明：</b>GCS总分15分，分数越低意识障碍越重；≤8分定义为昏迷，需紧急气道保护。</div>
    </div>
    <div class="sign-area"><div class="sign-box"><div class="sign-line"></div><div class="sign-label">评估医师签名</div></div><div class="sign-box"><div class="sign-line"></div><div class="sign-label">上级医师签名</div></div></div>
    <script>window.onload=function(){window.print();}<\/script>
    </body></html>`;
    const win = window.open('', '_blank');
    if(!win){ if(window.showToast) window.showToast('⚠️ 浏览器拦截了打印窗口，请允许弹出窗口后重试！'); return; }
    win.document.write(html);
    win.document.close();
}

function printPaduaReport(){
    var info = getPtInfo('padua');
    var factors = [
        ['padua_1','活动性肿瘤',3],['padua_2','既往VTE病史',3],['padua_3','减少活动≥3天',2],
        ['padua_4','已知易栓症',3],['padua_5','近期(1个月内)大手术或创伤',2],['padua_6','高龄≥70岁',1],
        ['padua_7','心脏和/或呼吸衰竭',1],['padua_8','急性心肌梗死和/或缺血性脑卒中',1],
        ['padua_9','急性感染和/或风湿性疾病',1],['padua_10','肥胖BMI≥30 kg/m²',1],
        ['padua_11','正在进行激素治疗',1],['padua_12','血小板计数>100x10⁹/L，需评估',1]
    ];
    var score = 0;
    var checkboxRows = '';
    for(var i=0;i<factors.length;i++){
        var f = factors[i];
        var checked = document.getElementById(f[0]).checked;
        if(checked) score += f[2];
        var mark = checked ? '☑' : '☐';
        var rowStyle = checked ? 'font-weight:700;color:#000' : '';
        checkboxRows += '<tr style="'+rowStyle+'"><td style="width:30px;text-align:center;border:1px solid #333;padding:6px;font-size:16px">'+mark+'</td><td style="border:1px solid #333;padding:6px 10px">'+f[1]+'</td><td style="width:50px;text-align:center;border:1px solid #333;padding:6px">'+f[2]+'分</td><td style="width:60px;text-align:center;border:1px solid #333;padding:6px;font-weight:700">'+(checked?f[2]:'')+'</td></tr>';
    }
    var riskLevel='', riskText='', advice='';
    if(score>=4){ riskLevel='VTE 高风险'; riskText='VTE发生率约11.0%，属于VTE高风险人群'; advice='1. 强烈推荐药物预防（低分子肝素），除非存在禁忌证<br>2. 评估出血风险<br>3. 早期下床活动+机械预防<br>4. 每日评估病情变化'; }
    else{ riskLevel='VTE 低风险'; riskText='VTE发生率约0.6%~1.7%'; advice='1. 推荐基础预防：鼓励早期下床活动<br>2. 使用弹力袜/间歇充气加压装置<br>3. 根据个体情况评估是否需要药物预防'; }
    var tagBg = score>=4?'#fee2e2;color:#991b1b;border:2px solid #ef4444':'#dcfce7;color:#166534;border:2px solid #22c55e';
    var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Padua评估</title>';
    html += '<style>*{margin:0;padding:0;box-sizing:border-box}@page{size:A4;margin:5mm}body{font-family:"SimHei","Microsoft YaHei","SimSun",sans-serif;font-size:11px;color:#000;padding:12px 16px;line-height:1.5}</style></head><body>';
    html += '<div style="text-align:center;font-size:18px;font-weight:700;letter-spacing:4px;margin-bottom:4px">Padua评分内科住院患者VTE风险评估表</div>';
    html += '<div style="text-align:center;font-size:10px;color:#666;margin-bottom:10px">静脉血栓栓塞症(Venous Thromboembolism) Risk Assessment</div>';
    html += '<div style="border-bottom:2px solid #000;margin-bottom:10px"></div>';
    html += ptInfoTable(info);
    html += '<div style="font-weight:700;font-size:12px;margin-bottom:6px">评估项目（在符合项目前打"✓"）：</div>';
    html += '<table style="width:100%;border-collapse:collapse;margin-bottom:14px;font-size:11px">';
    html += '<tr style="background:#0e7490;color:#fff"><th style="border:1px solid #08607a;padding:5px;width:30px">勾选</th><th style="border:1px solid #08607a;padding:5px;text-align:left">风险因素</th><th style="border:1px solid #08607a;padding:5px;width:50px">分值</th><th style="border:1px solid #08607a;padding:5px;width:60px">得分</th></tr>';
    html += checkboxRows;
    html += '<tr style="background:#fef3c7;font-weight:700"><td colspan="2" style="border:1px solid #333;padding:6px;text-align:center;font-size:12px">总 分</td><td colspan="2" style="border:1px solid #333;padding:6px;text-align:center;font-size:14px;font-weight:900">'+score+' 分（临界值4分）</td></tr>';
    html += '</table>';
    html += '<div style="border:2px solid #000;padding:8px 12px;margin-bottom:14px">';
    html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px"><span style="font-weight:700;font-size:12px">风险等级：</span><span style="display:inline-block;padding:4px 16px;font-weight:700;font-size:13px;background:'+tagBg+'">'+riskLevel+'</span></div>';
    html += '<div style="font-weight:700;font-size:14px;margin-bottom:4px">Padua评分 = '+score+' 分</div>';
    html += '<div style="font-size:11px;margin-bottom:4px"><b>风险判断：</b>'+riskText+'</div>';
    html += '<div style="font-size:11px"><b>预防建议：</b><br>'+advice+'</div>';
    html += '</div>';
    html += '<div style="display:flex;justify-content:flex-end;gap:50px;margin-top:16px">';
    html += '<div style="text-align:center"><div style="width:140px;border-bottom:1px solid #000;height:28px"></div><div style="font-size:11px;color:#555;margin-top:2px">评估医师签名</div></div>';
    html += '<div style="text-align:center"><div style="width:140px;border-bottom:1px solid #000;height:28px"></div><div style="font-size:11px;color:#555;margin-top:2px">上级医师签名</div></div>';
    html += '<div style="text-align:center"><div style="width:140px;border-bottom:1px solid #000;height:28px"></div><div style="font-size:11px;color:#555;margin-top:2px">评估日期</div></div>';
    html += '</div>';
    html += '<script>window.onload=function(){window.print();}<\/script>';
    html += '</body></html>';
    var win = window.open('','_blank');
    if(!win){ if(window.showToast) window.showToast('⚠️ 浏览器拦截了打印窗口，请允许弹出窗口后重试！'); return; }
    win.document.write(html);
    win.document.close();
}

function printCapriniReport(){
    var info = getPtInfo('caprini');
    var factors = [
        ['caprini_1','年龄41~60岁',1],['caprini_2','肥胖BMI>25 kg/m²',1],
        ['caprini_3','下肢水肿/静脉曲张/石膏制动',1],['caprini_4','严重肺炎/脓毒症/急性呼吸衰竭',1],
        ['caprini_5','年龄61~74岁',2],['caprini_6','中心静脉置管',2],
        ['caprini_7','关节镜手术/大手术>45min',2],['caprini_8','腹腔镜手术>45min',2],
        ['caprini_9','癌症/既往DVT/PE病史',3],['caprini_10','卧床>72小时/石膏固定下肢/下肢瘫痪',3],
        ['caprini_11','择期人工关节置换术/髋骨盆股骨骨折手术',5],['caprini_12','年龄≥75岁',4]
    ];
    var score = 0;
    var checkboxRows = '';
    for(var i=0;i<factors.length;i++){
        var f = factors[i];
        var checked = document.getElementById(f[0]).checked;
        if(checked) score += f[2];
        var mark = checked ? '☑' : '☐';
        var rowStyle = checked ? 'font-weight:700;color:#000' : '';
        checkboxRows += '<tr style="'+rowStyle+'"><td style="width:30px;text-align:center;border:1px solid #333;padding:6px;font-size:16px">'+mark+'</td><td style="border:1px solid #333;padding:6px 10px">'+f[1]+'</td><td style="width:50px;text-align:center;border:1px solid #333;padding:6px">'+f[2]+'分</td><td style="width:60px;text-align:center;border:1px solid #333;padding:6px;font-weight:700">'+(checked?f[2]:'')+'</td></tr>';
    }
    var riskLevel='', riskText='', advice='', tagBg='';
    if(score<=1){ riskLevel='极低危'; riskText='DVT发生率<0.5%'; advice='1. 早期下床活动<br>2. 无需药物或机械预防'; tagBg='#dcfce7;color:#166534;border:2px solid #22c55e'; }
    else if(score<=2){ riskLevel='低危'; riskText='DVT发生率约1.5%'; advice='1. 推荐基础预防：早期活动<br>2. 弹力袜或间歇充气加压装置'; tagBg='#dcfce7;color:#166534;border:2px solid #22c55e'; }
    else if(score<=4){ riskLevel='中危'; riskText='DVT发生率约3.0%'; advice='1. 建议药物预防（低分子肝素/普通肝素）<br>2. 或机械预防（间歇充气加压装置）<br>3. 早期下床活动'; tagBg='#fee2e2;color:#991b1b;border:2px solid #ef4444'; }
    else{ riskLevel='高危/极高危'; riskText='DVT发生率≥6.0%'; advice='1. 强烈推荐药物+机械联合预防<br>2. 低分子肝素或普通肝素皮下注射<br>3. 弹力袜+间歇充气加压装置<br>4. 术后尽早启动抗凝'; tagBg='#fee2e2;color:#991b1b;border:2px solid #ef4444'; }
    var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Caprini评估</title>';
    html += '<style>*{margin:0;padding:0;box-sizing:border-box}@page{size:A4;margin:5mm}body{font-family:"SimHei","Microsoft YaHei","SimSun",sans-serif;font-size:11px;color:#000;padding:12px 16px;line-height:1.5}</style></head><body>';
    html += '<div style="text-align:center;font-size:18px;font-weight:700;letter-spacing:4px;margin-bottom:4px">Caprini围手术期VTE风险评估表</div>';
    html += '<div style="text-align:center;font-size:10px;color:#666;margin-bottom:10px">静脉血栓栓塞症(Venous Thromboembolism) Risk Assessment</div>';
    html += '<div style="border-bottom:2px solid #000;margin-bottom:10px"></div>';
    html += ptInfoTable(info);
    html += '<div style="font-weight:700;font-size:12px;margin-bottom:6px">评估项目（在符合项目前打"✓"）：</div>';
    html += '<table style="width:100%;border-collapse:collapse;margin-bottom:14px;font-size:11px">';
    html += '<tr style="background:#0e7490;color:#fff"><th style="border:1px solid #08607a;padding:5px;width:30px">勾选</th><th style="border:1px solid #08607a;padding:5px;text-align:left">风险因素</th><th style="border:1px solid #08607a;padding:5px;width:50px">分值</th><th style="border:1px solid #08607a;padding:5px;width:60px">得分</th></tr>';
    html += checkboxRows;
    html += '<tr style="background:#fef3c7;font-weight:700"><td colspan="2" style="border:1px solid #333;padding:6px;text-align:center;font-size:12px">总 分</td><td colspan="2" style="border:1px solid #333;padding:6px;text-align:center;font-size:14px;font-weight:900">'+score+' 分</td></tr>';
    html += '</table>';
    html += '<div style="border:2px solid #000;padding:8px 12px;margin-bottom:14px">';
    html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px"><span style="font-weight:700;font-size:12px">风险等级：</span><span style="display:inline-block;padding:4px 16px;font-weight:700;font-size:13px;background:'+tagBg+'">'+riskLevel+'</span><span style="font-size:11px;color:#555">（'+riskText+'）</span></div>';
    html += '<div style="font-weight:700;font-size:14px;margin-bottom:4px">Caprini评分 = '+score+' 分</div>';
    html += '<div style="font-size:11px"><b>预防建议：</b><br>'+advice+'</div>';
    html += '</div>';
    html += '<div style="display:flex;justify-content:flex-end;gap:50px;margin-top:16px">';
    html += '<div style="text-align:center"><div style="width:140px;border-bottom:1px solid #000;height:28px"></div><div style="font-size:11px;color:#555;margin-top:2px">评估医师签名</div></div>';
    html += '<div style="text-align:center"><div style="width:140px;border-bottom:1px solid #000;height:28px"></div><div style="font-size:11px;color:#555;margin-top:2px">上级医师签名</div></div>';
    html += '<div style="text-align:center"><div style="width:140px;border-bottom:1px solid #000;height:28px"></div><div style="font-size:11px;color:#555;margin-top:2px">评估日期</div></div>';
    html += '</div>';
    html += '<script>window.onload=function(){window.print();}<\/script>';
    html += '</body></html>';
    var win = window.open('','_blank');
    if(!win){ if(window.showToast) window.showToast('⚠️ 浏览器拦截了打印窗口，请允许弹出窗口后重试！'); return; }
    win.document.write(html);
    win.document.close();
}
