/**
 * 华医前端系统核心主控与 UI 逻辑 (App Core Controller)
 */
let currentDept = 'surgery';
let currentDisease = null;
let autoPE = false;

function init(){
    const now = new Date();
    const fmt = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    
    if(document.getElementById('admitDate')) document.getElementById('admitDate').value = fmt(now);
    if(document.getElementById('recordDate')) document.getElementById('recordDate').value = fmt(now);
    if(document.getElementById('gcs_pt_date')) document.getElementById('gcs_pt_date').value = fmt(now);
    if(document.getElementById('caprini_pt_date')) document.getElementById('caprini_pt_date').value = fmt(now);
    if(document.getElementById('padua_pt_date')) document.getElementById('padua_pt_date').value = fmt(now);
    
    renderDeptList();
    loadDiseaseList();
    updateHeaderCounts();
    initAutoSave();
    initTheme();
}

function updateHeaderCounts(){
    if (!window.MedicalDB) return;
    const stats = window.MedicalDB.getStatistics();
    const dBadge = document.getElementById('totalDiseaseBadge');
    const cpBadge = document.getElementById('totalCpBadge');
    if(dBadge) dBadge.textContent = stats.totalDiseases + '个疾病模板';
    if(cpBadge) cpBadge.textContent = stats.totalCps + '条临床路径';
}

function renderDeptList(){
    if (!window.MedicalDB) return;
    const departments = window.MedicalDB.getDepartments();
    const deptContainer = document.getElementById('deptList');
    if (!deptContainer) return;

    deptContainer.innerHTML = departments.map(d =>
        `<button class="dept-btn ${d.id === currentDept ? 'active' : ''}" onclick="selectDept('${d.id}')">
            <span class="dept-icon">${d.icon || ''}</span>
            <span class="dept-name">${d.name}</span>
        </button>`
    ).join('');
}

function selectDept(dept){
    currentDept = dept;
    window.currentDept = dept;
    currentDisease = 0;
    window.currentDisease = 0;
    window.currentDiseaseItem = window.MedicalDB ? window.MedicalDB.getTemplate(dept, 0) : null;
    renderDeptList();
    loadDiseaseList();
}

function loadDiseaseList(){
    const list = document.getElementById('diseaseList');
    if (!list || !window.MedicalDB) return;

    const data = window.MedicalDB.getDiseasesByDept(currentDept);
    const stats = window.MedicalDB.getStatistics();
    
    const statBox = document.getElementById('statBox');
    if(statBox) statBox.textContent = '本系统共 ' + stats.totalDiseases + ' 个模板';

    if(!data.length){
        list.innerHTML = '<div style="padding:20px;text-align:center;color:#64748b">该科室暂无模板</div>';
        return;
    }

    if (!window.currentDiseaseItem && data.length > 0) {
        window.currentDisease = 0;
        window.currentDiseaseItem = data[0];
    }

    const groups = window.MedicalDB.getDiseaseGroupsByDept(currentDept);
    if(groups){
        let html = '';
        const groupedNames = new Set();
        groups.forEach(g => {
            const matched = g.items.map(name => ({ name, idx: data.findIndex(d => d.name === name) })).filter(x => x.idx >= 0);
            matched.forEach(x => groupedNames.add(x.name));
            if(matched.length === 0) return;

            html += `<div class="disease-group-header">${g.group}<span class="count">${matched.length}</span></div>`;
            matched.forEach(x => {
                const d = data[x.idx];
                html += `<div class="disease-item ${currentDisease === x.idx ? 'selected' : ''}" data-idx="${x.idx}" onclick="selectDisease(${x.idx})">
                    <span class="icon">🩺</span><span class="name">${d.name}</span><span class="tag">${d.icd}</span>
                </div>`;
            });
        });

        const ungrouped = data.map((d, i) => ({ d, i })).filter(x => !groupedNames.has(x.d.name));
        if(ungrouped.length){
            html += `<div class="disease-group-header">其他<span class="count">${ungrouped.length}</span></div>`;
            ungrouped.forEach(x => {
                html += `<div class="disease-item ${currentDisease === x.i ? 'selected' : ''}" data-idx="${x.i}" onclick="selectDisease(${x.i})">
                    <span class="icon">🩺</span><span class="name">${x.d.name}</span><span class="tag">${x.d.icd}</span>
                </div>`;
            });
        }
        list.innerHTML = html;
    } else {
        list.innerHTML = data.map((d, i) =>
            `<div class="disease-item ${currentDisease === i ? 'selected' : ''}" data-idx="${i}" onclick="selectDisease(${i})">
                <span class="icon">🩺</span><span class="name">${d.name}</span><span class="tag">${d.icd}</span>
            </div>`
        ).join('');
    }
}

function searchDisease(kw){
    const headers = document.querySelectorAll('.disease-group-header');
    if(headers.length === 0){
        document.querySelectorAll('.disease-item').forEach(it => {
            const n = it.querySelector('.name').textContent;
            it.style.display = (n.includes(kw) || !kw) ? 'flex' : 'none';
        });
        return;
    }

    headers.forEach(h => {
        let visible = 0;
        let next = h.nextElementSibling;
        while(next && !next.classList.contains('disease-group-header')){
            const n = next.querySelector('.name').textContent;
            if(n.includes(kw) || !kw){
                next.style.display = 'flex';
                visible++;
            } else {
                next.style.display = 'none';
            }
            next = next.nextElementSibling;
        }
        h.style.display = visible > 0 ? 'block' : 'none';
    });
}

function selectDisease(i){
    currentDisease = i;
    window.currentDisease = i;
    document.querySelectorAll('.disease-item').forEach(it => {
        it.classList.toggle('selected', parseInt(it.dataset.idx) === i);
    });

    const item = window.MedicalDB.getTemplate(currentDept, i);
    window.currentDiseaseItem = item;
    if(item){
        // 直接填充模板，无需额外点击“应用模板”按钮
        fillTemplate();
    }
    closeDeptDrawer();
}

function fillTemplate(){
    if(currentDisease === null){
        showToast('⚠️ 请先在左侧选择一个疾病！');
        return;
    }
    const item = window.MedicalDB.getTemplate(currentDept, currentDisease);
    if(!item || !item.t) return;
    const t = item.t;

    Object.keys(t).forEach(k => {
        const el = document.getElementById(k);
        if(el) el.value = t[k];
    });

    if (autoPE) {
        fillNormalPE();
    }

    syncDatesToCourse();
    renderPathway(t.cp || null);
    
    // 同步体查，自动消除全身体检与专科检查之间的逻辑矛盾
    if (window.PEEngine && window.PEEngine.applySmartPE) {
        window.PEEngine.applySmartPE(currentDept, currentDisease);
    }
    showToast('📝 已完美应用【' + item.name + '】全套病历与临床路径！');

    const form = document.getElementById('recordForm');
    if(form) form.scrollIntoView({ behavior: 'smooth' });
}

function switchTab(tabId){
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    if(event && event.target) event.target.classList.add('active');
    const targetPanel = document.getElementById('panel-' + tabId);
    if(targetPanel) targetPanel.classList.add('active');
}

function syncDatesToCourse(){
    const admitDate = document.getElementById('admitDate').value;
    const dateStr = admitDate ? admitDate.slice(0, 10) : '{date}';
    ['firstCourse', 'dailyCourse', 'dischargeRecord', 'auxiliaryExam'].forEach(id => {
        const el = document.getElementById(id);
        if(el && el.value){
            el.value = el.value.replace(/\{date\}/g, dateStr);
        }
    });
}

function fillNormalPE(){
    const pEl = document.getElementById('p');
    const hr = pEl ? (pEl.value.replace('次/分', '').replace('次／分', '') || '80') : '80';
    const basePE = window.MedicalDB ? window.MedicalDB.getNormalPE() : '';
    const pe = basePE.replace('{hr}', hr).replace('{mentality}', '自主体位');
    
    const peEl = document.getElementById('physicalExam');
    if(peEl) peEl.value = pe;
    showToast('📋 已填入正常体检模板（心率同步为 ' + hr + ' 次/分）');
}

function toggleAutoPE(){
    autoPE = !autoPE;
    if(autoPE){
        fillNormalPE();
        showToast('⚙️ 已开启"自动填充正常体检"模式');
    } else {
        showToast('⚙️ 已关闭"自动填充正常体检"模式');
    }
}

function fillNormalVitals(){
    if(document.getElementById('t')) document.getElementById('t').value = '36.5℃';
    if(document.getElementById('p')) document.getElementById('p').value = '78次/分';
    if(document.getElementById('r')) document.getElementById('r').value = '18次/分';
    if(document.getElementById('bp')) document.getElementById('bp').value = '120/80mmHg';
    showToast('❤️ 已填入正常生命体征：T 36.5℃ P 78 R 18 BP 120/80');
}

function regeneratePE(){
    if(!window.PEEngine || !window.PEEngine.applySmartPE){
        showToast('⚠️ 智能体检引擎不可用');
        return;
    }
    if(window.currentDiseaseItem){
        window.PEEngine.applySmartPE(window.currentDept, window.currentDisease);
        showToast('✅ 已根据当前专科检查重新生成体检与首次病程');
    } else {
        showToast('⚠️ 请先在左侧选择疾病模板');
    }
}

function fallbackCopy(text){
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
        document.execCommand('copy');
        showToast('📋 已复制到剪贴板！可粘贴到 Word 或 AI 对话框中');
    } catch(e) {
        showToast('⚠️ 复制失败，请手动选择文本复制');
    }
    document.body.removeChild(ta);
}

function renderPathway(cp){
    const container = document.getElementById('pathwayContainer');
    if(!container) return;
    if(!cp){
        container.innerHTML = '<div class="cp-empty">该疾病暂无临床路径数据</div>';
        return;
    }

    let html = '<div class="cp-title"><h2>临床路径表单</h2><div class="cp-sub">依据国家卫健委临床路径标准 · 适用于二级医院</div></div>';
    if(cp.applicableObject) html += cpSection('一、适用对象', cp.applicableObject);
    if(cp.diagnosticBasis) html += cpSection('二、诊断依据', cp.diagnosticBasis);
    if(cp.treatmentOptions) html += cpSection('三、治疗方案选择', cp.treatmentOptions, '本路径适用于二级医院，超出本级医院技术能力时应及时转诊上级医院');
    if(cp.standardLOS) html += cpSection('四、标准住院日', cp.standardLOS);
    if(cp.entryCriteria) html += cpSection('五、进入路径标准', cp.entryCriteria);
    if(cp.examRequired || cp.examOptional){
        let examContent = '';
        if(cp.examRequired) examContent += '【必查项目】\n' + cp.examRequired + '\n\n';
        if(cp.examOptional) examContent += '【选查项目】\n' + cp.examOptional;
        html += cpSection('六、住院期间检查项目', examContent);
    }
    if(cp.medicationPlan) html += cpSection('七、治疗方案及药物选择', cp.medicationPlan);
    if(cp.surgeryDay) html += cpSection('八、手术日', cp.surgeryDay, '手术日为入院第' + (cp.surgeryDayNum || '2-3') + '天');
    if(cp.postopRecovery) html += cpSection('九、术后住院恢复', cp.postopRecovery);
    if(cp.dischargeCriteria) html += cpSection('十、出院标准', cp.dischargeCriteria);
    if(cp.variationAnalysis) html += cpSection('十一、变异及原因分析（含临床依据）', cp.variationAnalysis, '变异需记录具体原因，超出医保规范时须附临床依据支撑');
    if(cp.costEstimate) html += cpSection('十二、参考费用标准', cp.costEstimate);

    if(cp.dailySchedule && cp.dailySchedule.length > 0){
        html += '<div class="cp-section"><div class="cp-section-header">📋 临床路径日程表</div><div class="cp-section-body" style="padding:8px">';
        html += '<table class="cp-table"><thead><tr><th>时间</th><th>主要诊疗工作</th><th>重点医嘱</th><th>主要护理工作</th><th>病情变异记录</th></tr></thead><tbody>';
        cp.dailySchedule.forEach(d => {
            html += `<tr>
                <td class="day-col">${d.day || ''}</td>
                <td class="content-col">${(d.medicalWork || '').replace(/\n/g, '<br>')}</td>
                <td class="content-col">${(d.orders || '').replace(/\n/g, '<br>')}</td>
                <td class="content-col">${(d.nursing || '').replace(/\n/g, '<br>')}</td>
                <td class="variation-cell">${d.variation || '□无 □有，原因：'}</td>
            </tr>`;
        });
        html += '</tbody></table></div></div>';
    }
    container.innerHTML = html;
}

function cpSection(title, content, hint){
    let html = `<div class="cp-section"><div class="cp-section-header">${title}</div><div class="cp-section-body">${content}`;
    if(hint) html += `<div style="margin-top:8px;padding:6px 10px;background:#fff3cd;border-radius:4px;font-size:12px;color:#856404">⚠️ ${hint}</div>`;
    html += `</div></div>`;
    return html;
}

const AI_URLS = {
    deepseek: 'https://chat.deepseek.com',
    kimi: 'https://kimi.moonshot.cn',
    chatglm: 'https://chatglm.cn',
    tongyi: 'https://tongyi.aliyun.com'
};

function openAI(platform){
    const url = AI_URLS[platform];
    if(url) window.open(url, '_blank');
}

function showToast(msg){
    const t = document.getElementById('aiToast');
    if(t){
        t.textContent = msg || '✅ 已复制到剪贴板！请在AI对话框中粘贴';
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2500);
    }
}

function copyToClipboard(text){
    if(navigator.clipboard){
        navigator.clipboard.writeText(text).then(() => showToast()).catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
}

function collectAllRecordText(){
    let all = '';
    ['admission', 'firstCourse', 'dailyCourse', 'discharge'].forEach(id => {
        const panel = document.getElementById('panel-' + id);
        if(!panel) return;
        const title = panel.querySelector('h2');
        const titleText = title ? title.textContent : '';
        let body = '';
        panel.querySelectorAll('textarea').forEach(ta => {
            if(ta.value && ta.value.trim()) body += ta.value + '\n\n';
        });
        if(body.trim()) all += '=== ' + titleText + ' ===\n' + body + '\n';
    });
    return all.trim();
}

function copyRecordForAI(){
    const text = collectAllRecordText();
    if(!text){ showToast('⚠️ 当前病历为空，请先选择疾病或填写内容！'); return; }
    copyToClipboard(text);
}

function copyWithPrompt(type){
    const record = collectAllRecordText();
    if(!record){ showToast('⚠️ 当前病历为空，请先选择疾病！'); return; }
    const prompts = {
        diagnosis: '请分析以下住院病历的鉴别诊断是否充分，是否需要补充其他鉴别诊断，并给出理由：\n\n',
        quality: '请对以下住院病历进行质控审查，检查是否有遗漏、格式错误、逻辑矛盾等问题：\n\n',
        treatment: '请分析以下住院病历的治疗方案是否合理，是否需要调整或补充：\n\n',
        summary: '请根据以下住院病历，生成一份简洁规范的出院小结：\n\n'
    };
    const prompt = (prompts[type] || '') + record;
    copyToClipboard(prompt);
}

function copyWithCustomPrompt(){
    const input = document.getElementById('aiPromptInput');
    const question = input ? input.value.trim() : '';
    if(!question){ showToast('⚠️ 请先输入您的问题！'); return; }
    const record = collectAllRecordText();
    if(!record){ showToast('⚠️ 当前病历为空，请先选择疾病！'); return; }
    const full = question + '\n\n以下是当前病历内容：\n\n' + record;
    copyToClipboard(full);
}

function clearPrompt(){
    const input = document.getElementById('aiPromptInput');
    if(input) input.value = '';
}

const DRAFT_KEY = 'magic_medical_record_draft';

function collectFormData(){
    const data = {};
    document.querySelectorAll('input, textarea, select').forEach(el => {
        if(el.id && !(el.closest && el.closest('#panel-calculator, #panel-aiChat'))) data[el.id] = el.value;
    });
    data._timestamp = new Date().toLocaleString();
    data._diseaseIndex = currentDisease;
    data._dept = currentDept;
    return data;
}

function saveDraft(quiet = true){
    const data = collectFormData();
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    const statusEl = document.getElementById('autoSaveStatus');
    if(statusEl) statusEl.textContent = '已自动暂存 ' + new Date().toLocaleTimeString();
    if(!quiet) showToast('💾 病历草稿已成功暂存到本地！');
}

let autoSaveTimer = null;
function initAutoSave(){
    document.addEventListener('input', (e) => {
        if(e.target.matches('input, textarea, select')){
            if(autoSaveTimer) clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => saveDraft(true), 2500);
        }
    });
    const json = localStorage.getItem(DRAFT_KEY);
    if(json){
        try {
            const data = JSON.parse(json);
            const statusEl = document.getElementById('autoSaveStatus');
            if(statusEl) statusEl.textContent = '有未清空草稿 (' + (data._timestamp || '').slice(-8) + ')';
        } catch(e){}
    }
}

// 六套主题：白昼清爽 / 宝宝粉 / 护眼绿 / 护眼夜间 / 梦幻紫 / 暖阳橙，点击按钮循环切换
const THEME_LIST = [
    { id: 'light', label: '☀️ 白昼清爽', toast: '已切换至白昼清爽模式' },
    { id: 'pink',  label: '🌸 宝宝粉',   toast: '🌸 已切换至宝宝粉模式' },
    { id: 'green', label: '🌿 护眼绿',   toast: '🌿 已切换至护眼绿模式' },
    { id: 'dark',  label: '🌙 护眼夜间', toast: '🌙 已切换至护眼夜间模式' },
    { id: 'purple',label: '💜 梦幻紫',   toast: '💜 已切换至梦幻紫模式' },
    { id: 'orange',label: '🧡 暖阳橙',   toast: '🧡 已切换至暖阳橙模式' }
];

function initTheme(){
    const saved = localStorage.getItem('magic_medical_theme');
    let theme = saved;
    if(!theme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
        theme = 'dark';
    }
    if(theme){
        document.documentElement.setAttribute('data-theme', theme);
    } else {
        theme = 'light';
    }
    updateThemeBtnLabel(theme);
}

function updateThemeBtnLabel(theme){
    const cur = THEME_LIST.find(t => t.id === theme) || THEME_LIST[0];
    const label = document.getElementById('themeBtnLabel');
    if(label) label.textContent = cur.label;
}

function toggleTheme(){
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    const idx = THEME_LIST.findIndex(t => t.id === cur);
    const next = THEME_LIST[(idx + 1 + THEME_LIST.length) % THEME_LIST.length] || THEME_LIST[0];
    document.documentElement.setAttribute('data-theme', next.id);
    localStorage.setItem('magic_medical_theme', next.id);
    updateThemeBtnLabel(next.id);
    showToast(next.toast);
}

// 页面 DOM 加载完毕后自动初始化
document.addEventListener('DOMContentLoaded', init);

// 手机端：科室/疾病抽屉开关（桌面端无 .open 类与遮罩，调用无副作用）
function toggleDeptDrawer(){
    const p = document.querySelector('.left-panel');
    const o = document.getElementById('deptDrawerOverlay');
    if(p) p.classList.toggle('open');
    if(o) o.classList.toggle('show');
}

function closeDeptDrawer(){
    const p = document.querySelector('.left-panel');
    const o = document.getElementById('deptDrawerOverlay');
    if(p) p.classList.remove('open');
    if(o) o.classList.remove('show');
}
