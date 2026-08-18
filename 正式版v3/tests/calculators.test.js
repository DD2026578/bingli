/**
 * 临床计算核心公式单元测试
 * 运行：node tests/calculators.test.js
 */
const path = require('path');
require(path.join(__dirname, '..', 'js', 'modules', 'calc_core.js'));
const C = globalThis.CalcCore;

let passed = 0, failed = 0;
function assert(cond, name, detail){
    if(cond){ passed++; console.log('PASS', name); }
    else { failed++; console.error('FAIL', name, detail !== undefined ? JSON.stringify(detail) : ''); }
}
function near(a, b, eps){
    return Math.abs(a - b) <= (eps || 0.01);
}

// APRI
assert(near(C.apri(40, 100), 1.0), 'APRI 40/100 = 1.0（灰区）', C.apri(40, 100));
assert(near(C.apri(160, 100), 4.0), 'APRI 160/100 = 4.0（高危）', C.apri(160, 100));
assert(near(C.apri(20, 100), 0.5), 'APRI 20/100 = 0.5（非低危边界）', C.apri(20, 100));

// FIB-4
assert(near(C.fib4(45, 65, 50, 120), 3.447, 0.01), 'FIB-4 样例 = 3.45（高危）', C.fib4(45, 65, 50, 120));

// BMI
assert(near(C.bmi(70, 175), 22.86, 0.01), 'BMI 70kg/175cm = 22.86', C.bmi(70, 175));

// QTc（Bazett）
assert(near(C.qtcBazett(400, 60), 400), 'QTc 400ms @60bpm = 400', C.qtcBazett(400, 60));

// MAP
assert(near(C.mapArterial(120, 80), 93.33, 0.01), 'MAP 120/80 = 93.3', C.mapArterial(120, 80));

// SOFA
assert(C.sofaScore({resp:2, coag:1, liver:0, cardiovascular:1, neuro:0, renal:0}) === 4, 'SOFA 2+1+0+1+0+0 = 4');
assert(isNaN(C.sofaScore({resp:5, coag:0, liver:0, cardiovascular:0, neuro:0, renal:0})), 'SOFA 非法分项返回 NaN');

// GRACE
assert(C.graceScore({age:60, hr:90, sbp:130, creatinineMg:1.0, killip:1, cardiacArrest:false, stDeviation:false, elevatedEnzymes:false}) === 111, 'GRACE 样例 = 111');

// Glasgow-Blatchford
assert(C.blatchfordScore({gender:'male', bun:20, hb:90, sbp:100, pulse:100, melena:false, syncope:false, liverDisease:false, heartFailure:false}) === 12, 'Blatchford 样例 = 12');

// NIHSS
assert(C.nihssScore([1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]) === 1, 'NIHSS 样例 = 1');

// 孕周/预产期
const g = C.gestationalAge('2026-01-01', '2026-08-14');
assert(g && g.weeks === 32 && g.days === 1, '孕周 2026-01-01→08-14 = 32周+1天', g);

console.log('\n通过 ' + passed + ' 项，失败 ' + failed + ' 项');
process.exit(failed ? 1 : 0);
