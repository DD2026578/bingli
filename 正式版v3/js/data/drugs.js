/**
 * 华医临床用药知识库数据中心 (Clinical Drug Database) —— 入口与索引
 * 数据由 drugs_data_1~4.js 通过 window.__DRUG_DATA__.push(...) 逐条推送，
 * 本文件负责定义分类、构建索引并提供查询/检索 API（对外方法签名保持不变）。
 * 数据来源：《新编药物学》《中国国家处方集》/《中华人民共和国药典·临床用药须知》等权威药典。
 */
window.DRUG_DATABASE = (function() {

    const categories = [
        { id: 'all', name: '全部药物', icon: '💊' },
        { id: 'anti_infective', name: '抗感染/抗微生物', icon: '🦠' },
        { id: 'cardiovascular', name: '心血管系统', icon: '❤️' },
        { id: 'respiratory', name: '呼吸系统', icon: '🫁' },
        { id: 'digestive', name: '消化系统', icon: '🧪' },
        { id: 'endocrine', name: '内分泌与代谢', icon: '🧬' },
        { id: 'analgesic', name: '镇痛解热抗炎', icon: '💉' },
        { id: 'emergency', name: '急救与重症', icon: '🚨' },
        { id: 'neuro', name: '神经与精神', icon: '🧠' },
        { id: 'blood', name: '血液与造血系统', icon: '🩸' },
        { id: 'urinary', name: '泌尿系统', icon: '🚻' },
        { id: 'musculoskeletal', name: '肌肉骨骼与风湿', icon: '🦴' },
        { id: 'dermatology', name: '皮肤科用药', icon: '🧴' },
        { id: 'ent_eye', name: '五官系统用药', icon: '👁️' },
        { id: 'antitumor', name: '抗肿瘤与免疫调节', icon: '🎗️' }
    ];

    // 从各卫星数据文件汇总原始数据，并做拷贝副本以避免外部误改
    const drugs = (window.__DRUG_DATA__ || []).map(function(d) {
        return Object.assign({}, d);
    });

    // 重建索引：id -> drug
    const drugIndex = {};
    drugs.forEach(function(d) {
        if (d && d.id) drugIndex[d.id] = d;
    });

    function normalizeText(v) {
        return (v || '').toString().toLowerCase();
    }

    return {
        getCategories: function() {
            return categories;
        },
        getAllDrugs: function() {
            return drugs;
        },
        // 该分类下匹配当前检索条件的全部药物
        getDrugsByCategory: function(category) {
            const list = (category && category !== 'all') ? drugs.filter(d => d.category === category) : drugs;
            return list;
        },
        getDrugById: function(id) {
            return drugIndex[id] || null;
        },
        // 支持 name / pinyin / tradeName / indications / subCategory / tags / pharmacology / pharmacokinetics 子串匹配
        searchDrugs: function(query, category) {
            let list = drugs;
            if (category && category !== 'all') {
                list = list.filter(d => d.category === category);
            }
            if (!query || !query.trim()) {
                return list;
            }
            const q = normalizeText(query);
            return list.filter(function(d) {
                return normalizeText(d.name).includes(q) ||
                    normalizeText(d.subCategory).includes(q) ||
                    (d.tradeName && normalizeText(d.tradeName).includes(q)) ||
                    (d.pinyin && normalizeText(d.pinyin).includes(q)) ||
                    (d.indications && normalizeText(d.indications).includes(q)) ||
                    (d.pharmacology && normalizeText(d.pharmacology).includes(q)) ||
                    (d.pharmacokinetics && normalizeText(d.pharmacokinetics).includes(q)) ||
                    (d.tags && d.tags.some(function(t) { return normalizeText(t).includes(q); }));
            });
        }
    };
})();