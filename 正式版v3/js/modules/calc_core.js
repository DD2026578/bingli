/**
 * 临床计算核心公式模块（纯函数，无 DOM 依赖，供计算器与单元测试复用）
 */
(function(global){
    function num(v){ return (typeof v === 'number' && isFinite(v)) ? v : NaN; }

    // BMI
    function bmi(weightKg, heightCm){
        weightKg = num(weightKg); heightCm = num(heightCm);
        if(!(weightKg > 0) || !(heightCm > 0)) return NaN;
        const h = heightCm / 100;
        return weightKg / (h * h);
    }

    // 体表面积 BSA (许文生中国人公式与 DuBois 标准公式)
    // 许文生公式: BSA (m²) = 0.0061 × 身高(cm) + 0.0128 × 体重(kg) - 0.1529 (人卫《儿科学》《外科学》)
    // DuBois 公式: BSA (m²) = 0.007184 × 身高(cm)^0.725 × 体重(kg)^0.425
    function bsaStevenson(heightCm, weightKg){
        heightCm = num(heightCm); weightKg = num(weightKg);
        if(!(heightCm > 0) || !(weightKg > 0)) return NaN;
        return 0.0061 * heightCm + 0.0128 * weightKg - 0.1529;
    }

    function bsaDubois(heightCm, weightKg){
        heightCm = num(heightCm); weightKg = num(weightKg);
        if(!(heightCm > 0) || !(weightKg > 0)) return NaN;
        return 0.007184 * Math.pow(heightCm, 0.725) * Math.pow(weightKg, 0.425);
    }

    // QTc（Bazett 公式）
    function qtcBazett(qtMs, hr){
        qtMs = num(qtMs); hr = num(hr);
        if(!(qtMs > 0) || !(hr > 0)) return NaN;
        const rrSec = 60 / hr;
        return qtMs / Math.sqrt(rrSec);
    }

    // 平均动脉压 MAP
    function mapArterial(sbp, dbp){
        sbp = num(sbp); dbp = num(dbp);
        if(!(sbp > dbp) || !(dbp > 0)) return NaN;
        return dbp + (sbp - dbp) / 3;
    }

    // APRI（AST 上限按 40 U/L）
    function apri(ast, plt){
        ast = num(ast); plt = num(plt);
        if(!(ast > 0) || !(plt > 0)) return NaN;
        return ((ast / 40) / plt) * 100;
    }

    // FIB-4
    function fib4(age, ast, alt, plt){
        age = num(age); ast = num(ast); alt = num(alt); plt = num(plt);
        if(!(age > 0) || !(ast > 0) || !(alt > 0) || !(plt > 0)) return NaN;
        return (age * ast) / (plt * Math.sqrt(alt));
    }

    // SOFA：p = { resp, coag, liver, cardiovascular, neuro, renal }，各项 0~4 分
    function sofaScore(p){
        p = p || {};
        const keys = ['resp','coag','liver','cardiovascular','neuro','renal'];
        let total = 0;
        for (const k of keys){
            const v = num(p[k]);
            if(isNaN(v) || v < 0 || v > 4) return NaN;
            total += v;
        }
        return total;
    }

    // GRACE 1.0 评分（年龄/心率/收缩压/肌酐/Killip/心脏骤停/ST段偏移/心肌标志物）
    // creatinineMg 或 creatinineUmol 均可输入
    function graceScore(p){
        p = p || {};
        const age = num(p.age), hr = num(p.hr), sbp = num(p.sbp), killip = num(p.killip);
        let cr = num(p.creatinineMg);
        if(isNaN(cr) && !isNaN(num(p.creatinineUmol))){
            cr = num(p.creatinineUmol) / 88.4;
        }
        if([age, hr, sbp, cr, killip].some(isNaN)) return NaN;
        if(age < 20 || age > 120 || hr < 20 || hr > 250 || sbp < 50 || sbp > 250 || cr < 0.1 || cr > 20 || killip < 0 || killip > 4) return NaN;
        let s = 0;
        if(age < 40) s += 0; else if(age < 50) s += 18; else if(age < 60) s += 36; else if(age < 70) s += 55; else if(age < 80) s += 73; else s += 91;
        if(hr < 50) s += 0; else if(hr < 70) s += 3; else if(hr < 90) s += 9; else if(hr < 110) s += 15; else if(hr < 150) s += 24; else if(hr < 200) s += 38; else s += 46;
        if(sbp < 80) s += 58; else if(sbp < 100) s += 53; else if(sbp < 120) s += 43; else if(sbp < 140) s += 34; else if(sbp < 160) s += 24; else if(sbp < 200) s += 10; else s += 0;
        if(cr < 0.4) s += 1; else if(cr < 0.8) s += 4; else if(cr < 1.2) s += 7; else if(cr < 1.6) s += 10; else if(cr < 2.0) s += 13; else if(cr < 4.0) s += 21; else s += 28;
        if(killip === 1) s += 0; else if(killip === 2) s += 20; else if(killip === 3) s += 39; else s += 59;
        if(p.cardiacArrest) s += 39;
        if(p.stDeviation) s += 28;
        if(p.elevatedEnzymes) s += 14;
        return s;
    }

    // Glasgow-Blatchford 评分（Lancet 2000 原版及常用临床修订版）
    function blatchfordScore(p){
        p = p || {};
        const bun = num(p.bun), hb = num(p.hb), sbp = num(p.sbp), pulse = num(p.pulse);
        if(isNaN(bun) || isNaN(hb) || isNaN(sbp) || isNaN(pulse)) return NaN;
        let s = 0;
        if(bun < 6.5) s += 0; else if(bun < 8.0) s += 2; else if(bun < 10.0) s += 3; else if(bun < 25.0) s += 4; else s += 6;
        const male = p.gender === 'male';
        if(male){
            if(hb < 100) s += 6; else if(hb < 120) s += 3; else if(hb < 130) s += 1;
        } else {
            if(hb < 100) s += 6; else if(hb < 120) s += 1;
        }
        if(sbp < 90) s += 3; else if(sbp < 100) s += 2; else if(sbp < 110) s += 1;
        if(pulse >= 100) s += 1;
        if(p.melena) s += 1;
        if(p.syncope) s += 2;
        if(p.liverDisease) s += 2;
        if(p.heartFailure) s += 2;
        if(p.hematemesis) s += 2; // 原版 Lancet 2000 项（呕血）
        return s;
    }

    // MELD 原版评分（UNOS 标准）：tbil(μmol/L), inr, scr(μmol/L), dialysis(boolean)
    // 换算: tbil mg/dL = tbil/17.1, scr mg/dL = scr/88.4 (透析或scr>4.0均截断为4.0，变量下限为1.0)
    function meldScore(tbilUmol, inr, scrUmol, isDialysis){
        tbilUmol = num(tbilUmol); inr = num(inr); scrUmol = num(scrUmol);
        if([tbilUmol, inr, scrUmol].some(isNaN)) return NaN;
        const tbil_mg = tbilUmol / 17.1;
        let scr_mg = scrUmol / 88.4;
        if(isDialysis || scr_mg > 4.0) scr_mg = 4.0;
        let meld = 3.78 * Math.log(Math.max(tbil_mg, 1.0)) + 11.2 * Math.log(Math.max(inr, 1.0)) + 9.57 * Math.log(Math.max(scr_mg, 1.0)) + 6.43;
        meld = Math.round(meld);
        if(meld < 6) meld = 6;
        if(meld > 40) meld = 40;
        return meld;
    }

    // NIHSS：items 为各分项得分数组，返回总和；任一为 NaN 则返回 NaN
    function nihssScore(items){
        if(!Array.isArray(items)) return NaN;
        let total = 0;
        for (const v of items){
            const n = num(v);
            if(isNaN(n) || n < 0) return NaN;
            total += n;
        }
        return total;
    }

    // 孕周与预产期
    function gestationalAge(lmpStr, onDateStr){
        const lmp = new Date(lmpStr);
        const on = onDateStr ? new Date(onDateStr) : new Date();
        if(isNaN(lmp.getTime()) || isNaN(on.getTime()) || lmp > on) return null;
        const days = Math.floor((on - lmp) / 86400000);
        return {
            weeks: Math.floor(days / 7),
            days: days % 7,
            edc: new Date(lmp.getTime() + 280 * 86400000)
        };
    }

    // 声明式临床计算器 Schema 定义集（用于引擎驱动与元数据查询）
    const CALCULATOR_SCHEMAS = {
        bmi: {
            id: 'bmi',
            name: '身体质量指数 (BMI)',
            category: 'general',
            inputs: [
                { id: 'height', label: '身高 (cm)', type: 'number', min: 30, max: 250, default: 170 },
                { id: 'weight', label: '体重 (kg)', type: 'number', min: 1, max: 300, default: 65 }
            ],
            calc: function(inputs) {
                const val = bmi(inputs.weight, inputs.height);
                if (isNaN(val)) return { error: '请输入有效的身高和体重' };
                let tier = '正常';
                if (val < 18.5) tier = '偏瘦';
                else if (val >= 24 && val < 28) tier = '超重';
                else if (val >= 28) tier = '肥胖';
                return { value: Number(val.toFixed(2)), unit: 'kg/m²', tier: tier };
            }
        },
        map: {
            id: 'map',
            name: '平均动脉压 (MAP)',
            category: 'cardio',
            inputs: [
                { id: 'sbp', label: '收缩压 (mmHg)', type: 'number', min: 40, max: 280, default: 120 },
                { id: 'dbp', label: '舒张压 (mmHg)', type: 'number', min: 20, max: 200, default: 80 }
            ],
            calc: function(inputs) {
                const val = mapArterial(inputs.sbp, inputs.dbp);
                if (isNaN(val)) return { error: '收缩压必须大于舒张压' };
                return { value: Number(val.toFixed(1)), unit: 'mmHg', tier: (val >= 70 && val <= 105) ? '正常' : (val < 70 ? '偏低 (器官灌注不足风险)' : '偏高') };
            }
        },
        apri: {
            id: 'apri',
            name: 'AST/PLT 肝纤维化指数 (APRI)',
            category: 'liver',
            inputs: [
                { id: 'ast', label: 'AST (U/L)', type: 'number', min: 1, max: 2000, default: 40 },
                { id: 'plt', label: '血小板 PLT (×10^9/L)', type: 'number', min: 1, max: 1000, default: 150 }
            ],
            calc: function(inputs) {
                const val = apri(inputs.ast, inputs.plt);
                if (isNaN(val)) return { error: '请输入有效的数值' };
                return { value: Number(val.toFixed(2)), tier: val > 1.5 ? '提示显著肝硬化可能' : (val < 0.5 ? '基本排除严重肝纤维化' : '中度区间') };
            }
        },
        fib4: {
            id: 'fib4',
            name: 'FIB-4 肝纤维化指数',
            category: 'liver',
            inputs: [
                { id: 'age', label: '年龄 (岁)', type: 'number', min: 1, max: 120 },
                { id: 'ast', label: 'AST (U/L)', type: 'number', min: 1, max: 2000 },
                { id: 'alt', label: 'ALT (U/L)', type: 'number', min: 1, max: 2000 },
                { id: 'plt', label: '血小板 (×10^9/L)', type: 'number', min: 1, max: 1000 }
            ],
            calc: function(inputs) {
                const val = fib4(inputs.age, inputs.ast, inputs.alt, inputs.plt);
                if (isNaN(val)) return { error: '请输入有效检验数值' };
                return { value: Number(val.toFixed(2)), tier: val > 3.25 ? '高度提示严重肝纤维化/肝硬化' : (val < 1.45 ? '阴性预测值高（排除晚期纤维化）' : '不确定区间') };
            }
        }
    };

    // 通用 Schema 驱动计算引擎
    const CalcEngine = {
        getSchemas: () => CALCULATOR_SCHEMAS,
        getSchema: (id) => CALCULATOR_SCHEMAS[id] || null,
        evaluate: function(calcId, inputs) {
            const schema = CALCULATOR_SCHEMAS[calcId];
            if (!schema || typeof schema.calc !== 'function') {
                return { error: `未找到计算器 Schema: ${calcId}` };
            }
            return schema.calc(inputs || {});
        }
    };

    global.CalcCore = {
        bmi: bmi,
        bsaStevenson: bsaStevenson,
        bsaDubois: bsaDubois,
        qtcBazett: qtcBazett,
        mapArterial: mapArterial,
        apri: apri,
        fib4: fib4,
        sofaScore: sofaScore,
        graceScore: graceScore,
        blatchfordScore: blatchfordScore,
        meldScore: meldScore,
        nihssScore: nihssScore,
        gestationalAge: gestationalAge,
        schemas: CALCULATOR_SCHEMAS,
        engine: CalcEngine
    };
})(typeof window !== 'undefined' ? window : globalThis);
