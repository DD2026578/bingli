/**
 * 华医 AI 临床病历助手提示词推导模块 (AI Medical Assistant Module)
 */

function fillAiPrompt(toolType){
    const textarea = document.getElementById('aiPromptInput');
    if(!textarea) return;

    // 获取当前正在编辑的病历字段
    const chiefComplaint = document.getElementById('chiefComplaint') ? document.getElementById('chiefComplaint').value.trim() : '';
    const presentIllness = document.getElementById('presentIllness') ? document.getElementById('presentIllness').value.trim() : '';
    const admitDiagnosis = document.getElementById('admitDiagnosis') ? document.getElementById('admitDiagnosis').value.trim() : '';
    const auxiliaryExam = document.getElementById('auxiliaryExam') ? document.getElementById('auxiliaryExam').value.trim() : '';

    let text = '';
    switch(toolType){
        case 'firstCourse':
            text = `请基于以下患者信息，生成一份符合国家三级医院病历书写规范的【首次病程记录】：\n主诉：${chiefComplaint || '请填写主诉'}\n现病史：${presentIllness || '请填写现病史'}\n初步诊断：${admitDiagnosis || '请填写初步诊断'}\n辅助检查：${auxiliaryExam || '暂缺'}\n要求：包含病历特点、拟诊讨论（诊断依据与鉴别诊断）、诊疗计划，逻辑严密，措辞专业规范。`;
            break;
        case 'fixTemplate':
            text = `请作为三级甲等医院病历质控专家，审阅并重写以下【${admitDiagnosis || chiefComplaint || '疾病模板'}】的病历内容：\n\n【审阅要求】：\n1. 检查主诉、现病史、体查、专科检查及首次病程之间是否存在逻辑矛盾或不合理之处；\n2. 修正不符合《病历书写基本规范》的非专业口语化表述，补充必要的阴性鉴别体征；\n3. 输出一份彻底修正、规范严谨且可直接作为标准模板使用的完整病历版本。`;
            break;
        case 'differential':
            text = `请对以下病例进行专业的【鉴别诊断推导】：\n主诉：${chiefComplaint || '请填写主诉'}\n初步诊断：${admitDiagnosis || '请填写初步诊断'}\n现病史及检查：${presentIllness || ''} ${auxiliaryExam || ''}\n要求：列出3个最需要鉴别的同类或相似疾病，分别从支持点、不支持点和鉴别结论三个方面进行详细阐述。`;
            break;
        case 'discharge':
            text = `请生成一份正规的【出院记录及出院医嘱】：\n诊断：${admitDiagnosis || '请填写诊断'}\n入院主诉：${chiefComplaint || ''}\n诊治经过：已行规范化对症/手术治疗，病情平稳。\n要求：包含入院情况、诊治经过、出院情况、出院诊断及详细的出院带药与随访医嘱指导。`;
            break;
        case 'pathway':
            text = `请依据国家卫生健康委最新发布的临床路径指南，为【${admitDiagnosis || chiefComplaint || '当前疾病'}】制定一份标准的【临床路径表单与每日诊疗计划】：\n包含适用对象、诊断依据、标准住院日、必查及备查项目、每日主要医疗工作及护理医嘱等。`;
            break;
        case 'calculator':
            text = `请帮我计算并分析以下临床量表及指标：\n${chiefComplaint ? '患者情况: ' + chiefComplaint : '请在此处补充患者具体的化验指标或症状量表数据'}`;
            break;
        default:
            text = `请协助进行临床病历书写与医学逻辑推理。`;
    }

    textarea.value = text;
    if(window.showToast) window.showToast('✨ 已自动为您生成最佳 AI Prompt 提示词！');
}

function copyAiPrompt(){
    const textarea = document.getElementById('aiPromptInput');
    if(!textarea || !textarea.value.trim()){
        if(window.showToast) window.showToast('⚠️ 提示词框为空，请先选择生成提示词！');
        return;
    }
    
    if(window.copyToClipboard){
        window.copyToClipboard(textarea.value);
    } else {
        navigator.clipboard.writeText(textarea.value);
    }

    const toast = document.getElementById('aiCopiedToast');
    if(toast){
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    } else if(window.showToast) {
        window.showToast('📋 AI 提示词已成功复制到剪贴板！');
    }
}

// 统一导出到全局对象
(function(g){
    if(!g) return;
    g.fillAiPrompt = fillAiPrompt;
    g.copyAiPrompt = copyAiPrompt;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
