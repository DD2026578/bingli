/**
 * 华医临床用药助手模块 (Drug Assistant Interaction Controller)
 * 职责：药品多维度检索、分类切换、详情展示、配伍禁忌速查及一键复制用药医嘱
 */
window.DrugAssistant = (function() {
    let currentCategory = 'all';
    let currentSearchText = '';
    let selectedDrugId = null;

    function init() {
        renderCategories();
        renderDrugList();
        if (window.DRUG_DATABASE) {
            const all = window.DRUG_DATABASE.getAllDrugs();
            if (all && all.length > 0) {
                selectDrug(all[0].id);
            }
        }
    }

    function renderCategories() {
        const container = document.getElementById('drugCategoryList');
        if (!container || !window.DRUG_DATABASE) return;

        const cats = window.DRUG_DATABASE.getCategories();
        container.innerHTML = cats.map(cat => `
            <button class="drug-cat-btn ${cat.id === currentCategory ? 'active' : ''}" onclick="DrugAssistant.selectCategory('${cat.id}')">
                <span class="drug-cat-icon">${cat.icon}</span>
                <span class="drug-cat-name">${cat.name}</span>
            </button>
        `).join('');
    }

    function selectCategory(catId) {
        currentCategory = catId;
        renderCategories();
        renderDrugList();
    }

    let searchTimer = null;
    function onSearch(query) {
        currentSearchText = query;
        if (searchTimer) clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            renderDrugList();
        }, 120);
    }

    function renderDrugList() {
        const container = document.getElementById('drugListContainer');
        const countBadge = document.getElementById('drugCountBadge');
        if (!container || !window.DRUG_DATABASE) return;

        const results = window.DRUG_DATABASE.searchDrugs(currentSearchText, currentCategory);
        if (countBadge) {
            countBadge.textContent = `共 ${results.length} 种药物`;
        }

        if (results.length === 0) {
            container.innerHTML = `
                <div class="drug-empty-state">
                    <div style="font-size:32px;margin-bottom:8px">🔍</div>
                    <div style="font-size:14px;color:var(--c-text-muted)">未找到匹配的药品信息</div>
                </div>
            `;
            return;
        }

        container.innerHTML = results.map(drug => `
            <div class="drug-list-item ${drug.id === selectedDrugId ? 'active' : ''}" onclick="DrugAssistant.selectDrug('${drug.id}')">
                <div class="drug-item-header">
                    <span class="drug-item-name">${drug.name}</span>
                    <span class="drug-item-sub">${drug.subCategory || ''}</span>
                </div>
                <div class="drug-item-trade">商品名: ${drug.tradeName || '通用名制剂'}</div>
                <div class="drug-item-tags">
                    ${(drug.tags || []).slice(0, 3).map(tag => `<span class="drug-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');

        // 如果选中的药物不在结果里，自动选中第一项
        if (results.length > 0 && !results.some(d => d.id === selectedDrugId)) {
            selectDrug(results[0].id);
        }
    }

    function selectDrug(drugId) {
        selectedDrugId = drugId;
        
        // 更新列表选中态
        const items = document.querySelectorAll('.drug-list-item');
        items.forEach(el => {
            // 通过 onclick 或其他判断
            if (el.getAttribute('onclick') && el.getAttribute('onclick').includes(drugId)) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });

        renderDrugDetail(drugId);
    }

    function renderDrugDetail(drugId) {
        const detailContainer = document.getElementById('drugDetailContainer');
        if (!detailContainer || !window.DRUG_DATABASE) return;

        const drug = window.DRUG_DATABASE.getDrugById(drugId);
        if (!drug) {
            detailContainer.innerHTML = `
                <div class="drug-empty-detail">
                    <div style="font-size:36px;margin-bottom:10px">💊</div>
                    <div>请从左侧选择需要查看的临床药物</div>
                </div>
            `;
            return;
        }

        detailContainer.innerHTML = `
            <div class="drug-detail-card">
                <div class="drug-detail-disclaimer">⚠️ 本库资料仅供临床医师参考，具体用药以最新版说明书、药典及现行诊疗指南为准</div>
                <div class="drug-detail-header">
                    <div class="drug-detail-title-group">
                        <div class="drug-title-line">
                            <h2 class="drug-main-title">${drug.name}</h2>
                            <span class="drug-detail-badge">${drug.subCategory}</span>
                        </div>
                        <div class="drug-sub-title">常用商品名：${drug.tradeName || '未收录特定商品名'} ｜ 规格：${drug.spec || '详见说明书'}</div>
                    </div>
                    <div class="drug-actions-group">
                        <button class="btn btn-outline" onclick="DrugAssistant.copyUsage('${drug.id}')">📋 复制用法用量</button>
                        <button class="btn btn-primary" onclick="DrugAssistant.insertToDischarge('${drug.id}')">➕ 填入出院带药</button>
                    </div>
                </div>

                <div class="drug-tags-row">
                    ${(drug.tags || []).map(t => `<span class="drug-tag-badge">🏷️ ${t}</span>`).join('')}
                </div>

                <div class="drug-info-grid">
                    <!-- 用法用量 -->
                    <div class="drug-info-block span-2 primary-border">
                        <div class="drug-block-title">
                            <span class="drug-icon-box">📌</span>
                            <b>常用用法用量与途径</b>
                        </div>
                        <div class="drug-block-content preserve-line">${drug.usage || '暂无说明'}</div>
                    </div>

                    ${drug.clinicalCase ? `
                    <!-- 临床使用实例 -->
                    <div class="drug-info-block span-2">
                        <div class="drug-block-title">
                            <span class="drug-icon-box">📋</span>
                            <b>临床使用实例</b>
                        </div>
                        <div class="drug-block-content preserve-line">${drug.clinicalCase}</div>
                    </div>
                    ` : ''}

                    <!-- 药理作用 -->
                    <div class="drug-info-block span-2">
                        <div class="drug-block-title">
                            <span class="drug-icon-box">🧬</span>
                            <b>药理作用（药物机制）</b>
                        </div>
                        <div class="drug-block-content">${drug.pharmacology || '详见说明书'}</div>
                    </div>

                    <!-- 药代动力学 -->
                    <div class="drug-info-block span-2">
                        <div class="drug-block-title">
                            <span class="drug-icon-box">⏱</span>
                            <b>药代动力学特征</b>
                        </div>
                        <div class="drug-block-content">${drug.pharmacokinetics || '详见说明书'}</div>
                    </div>

                    <!-- 适应症 -->
                    <div class="drug-info-block">
                        <div class="drug-block-title">
                            <span class="drug-icon-box">🎯</span>
                            <b>临床适应症</b>
                        </div>
                        <div class="drug-block-content">${drug.indications || '详见说明书'}</div>
                    </div>

                    <!-- 禁忌证 -->
                    <div class="drug-info-block warning-border">
                        <div class="drug-block-title warning-title">
                            <span class="drug-icon-box">⛔</span>
                            <b>禁忌证</b>
                        </div>
                        <div class="drug-block-content warning-text">${drug.contraindications || '对本品过敏者禁用'}</div>
                    </div>

                    <!-- 配伍禁忌与药物相互作用 -->
                    <div class="drug-info-block">
                        <div class="drug-block-title">
                            <span class="drug-icon-box">⚠️</span>
                            <b>药物相互作用与配伍关注</b>
                        </div>
                        <div class="drug-block-content">${drug.interactions || '无明显特殊相互作用记录'}</div>
                    </div>

                    <!-- 肾功能与特殊调整 -->
                    <div class="drug-info-block">
                        <div class="drug-block-title">
                            <span class="drug-icon-box">🫘</span>
                            <b>肾功能不全剂量调整 (eGFR)</b>
                        </div>
                        <div class="drug-block-content preserve-line">${drug.renalAdjustment || '轻中度肾损害通常无需调整，重度肾损害遵医嘱'}</div>
                    </div>

                    <!-- 妊娠与哺乳 -->
                    <div class="drug-info-block">
                        <div class="drug-block-title">
                            <span class="drug-icon-box">🤰</span>
                            <b>妊娠与哺乳期用药</b>
                        </div>
                        <div class="drug-block-content">${drug.pregnancyLactation || '遵专科医嘱'}</div>
                    </div>

                    <!-- 临床注意事项 -->
                    <div class="drug-info-block">
                        <div class="drug-block-title">
                            <span class="drug-icon-box">🔔</span>
                            <b>临床注意事项与不良反应</b>
                        </div>
                        <div class="drug-block-content">${drug.precautions || '使用期间密切观察生命体征及不良反应'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    function copyUsage(drugId) {
        if (!window.DRUG_DATABASE) return;
        const drug = window.DRUG_DATABASE.getDrugById(drugId);
        if (!drug) return;

        const text = `【${drug.name}】(${drug.tradeName || ''})\n规格：${drug.spec}\n用法：\n${drug.usage}`;
        if (window.copyToClipboard) {
            window.copyToClipboard(text);
        } else {
            navigator.clipboard.writeText(text);
        }
        if (window.showToast) {
            window.showToast(`📋 已复制【${drug.name}】用法用量`);
        }
    }

    function insertToDischarge(drugId) {
        if (!window.DRUG_DATABASE) return;
        const drug = window.DRUG_DATABASE.getDrugById(drugId);
        if (!drug) return;

        const dischargeTextarea = document.getElementById('dischargeRecord');
        if (dischargeTextarea) {
            const appendStr = `\n出院带药：${drug.name}（${drug.spec}），${drug.usage.replace(/\n/g, ' ')}`;
            dischargeTextarea.value = (dischargeTextarea.value || '') + appendStr;
            if (window.showToast) {
                window.showToast(`➕ 已将【${drug.name}】用法追加至出院记录中！`);
            }
        } else {
            copyUsage(drugId);
        }
    }

    return {
        init: init,
        selectCategory: selectCategory,
        onSearch: onSearch,
        selectDrug: selectDrug,
        copyUsage: copyUsage,
        insertToDischarge: insertToDischarge
    };
})();

// 在页面DOM准备好时初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (window.DrugAssistant) window.DrugAssistant.init();
    });
} else {
    if (window.DrugAssistant) window.DrugAssistant.init();
}
