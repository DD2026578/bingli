/**
 * 华医病历数据库中心管理器 (MedicalDB)
 * 职责：统一管理所有科室的病历模板、分类索引及临床路径
 */
window.MedicalDB = (function() {
    // 存储所有已注册科室数据
    const departments = [];
    const diseases = {};
    const diseaseGroups = {};

    // 标准正常体格检查模板（全系统共享）
    const NORMAL_PE = '发育正常，营养良好，神志清晰，{mentality}，查体合作。皮肤粘膜正常，皮肤弹性好，无水肿，无黄疸，无皮疹，无出血点，毛发分布正常。浅表淋巴结无肿大，无压痛。头颅五官无畸形，无肿块。睑结膜无充血，巩膜无黄染，角膜无混浊，双侧瞳孔等圆等大，双侧对光反射存在。耳无畸形，外耳道无分泌物。双侧乳突无压痛，双耳听力正常。鼻无畸形，通气顺畅，无分泌物，各副鼻窦均无压痛。口唇无发绀，齿龈无出血、无溢脓。口腔粘膜无出血点、无溃疡，咽无充血，双侧扁桃体正常。颈软对称，无颈静脉怒张、无异常搏动，甲状腺无肿大，气管居中。胸廓两侧对称，无局部突出、无凹陷，无胸壁静脉曲张。两侧呼吸动度相等，肋间隙无增宽、无变窄。语音震颤正常，无胸膜摩擦感。两肺叩诊音正常、呼吸音正常，未闻及干湿性啰音。心前区无隆起，触诊无震颤，心浊音界正常，心率{hr}次/分，心律整齐。心脏各瓣膜听诊区无病理性杂音。腹平软，全腹无压痛及反跳痛，肝脾肋下未触及，未触及异常包块，移动性浊音阴性，肠鸣音4次/分，正常。外生殖器未查，肛门未查。颈椎活动度可，腰椎活动度尚可，无压痛、无叩击痛。四肢及各关节无畸形，无红肿，无肌肉萎缩。无水肿，双膝腱及跟腱反射存在。四肢肌力、肌张力正常，生理反射存在，病理反射未引出。';

    return {
        // 获取通用体检模板
        getNormalPE: function() {
            return NORMAL_PE;
        },

        // 注册科室元数据与疾病列表
        registerDepartment: function(deptConfig, diseaseList, groups) {
            const { id, name, icon } = deptConfig;
            
            // 避免重复注册
            const existingIndex = departments.findIndex(d => d.id === id);
            if (existingIndex >= 0) {
                departments[existingIndex] = { id, name, icon };
            } else {
                departments.push({ id, name, icon });
            }

            diseases[id] = diseaseList || [];
            if (groups) {
                diseaseGroups[id] = groups;
            }
        },

        // 获取全部已注册的科室
        getDepartments: function() {
            return departments;
        },

        // 获取特定科室的疾病列表
        getDiseasesByDept: function(deptId) {
            return diseases[deptId] || [];
        },

        // 获取特定科室的分组信息
        getDiseaseGroupsByDept: function(deptId) {
            return diseaseGroups[deptId] || null;
        },

        // 获取总体模板与路径统计
        getStatistics: function() {
            let totalDiseases = 0;
            let totalCps = 0;

            Object.values(diseases).forEach(list => {
                totalDiseases += list.length;
                list.forEach(d => {
                    if (d.t && d.t.cp) totalCps++;
                });
            });

            return { totalDiseases, totalCps };
        },

        // 根据科室ID与疾病索引获取模板数据
        getTemplate: function(deptId, index) {
            const list = diseases[deptId];
            if (!list || !list[index]) return null;
            return list[index];
        }
    };
})();
