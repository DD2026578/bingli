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

    // GRACE 1.0 评分（年龄/心率/收缩压/肌酐 mg/dL/Killip/心脏骤停/ST段偏移/心肌标志物）
    function graceScore(p){
        p = p || {};
        const age = num(p.age), hr = num(p.hr), sbp = num(p.sbp), cr = num(p.creatinineMg), killip = num(p.killip);
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

    // Glasgow-Blatchford 评分
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
        return s;
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

    global.CalcCore = {
        bmi: bmi,
        qtcBazett: qtcBazett,
        mapArterial: mapArterial,
        apri: apri,
        fib4: fib4,
        sofaScore: sofaScore,
        graceScore: graceScore,
        blatchfordScore: blatchfordScore,
        nihssScore: nihssScore,
        gestationalAge: gestationalAge
    };
})(typeof window !== 'undefined' ? window : globalThis);
