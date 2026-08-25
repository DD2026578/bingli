# 华医临床系统 · 面向对象 (OOP) 开发与架构手册

> 本手册从面向对象 (OOP) 视角系统性拆解华医系统的核心服务对象。涵盖各对象的**职责边界、封装模式、公有 API 契约、典型调用链及二次开发扩展范式**。

---

## 1. 系统对象模型与设计模式

系统采用 **单例模块模式 (Singleton Module Pattern)** 与 **领域服务模式 (Domain Services)**，全局各核心服务解耦独立，接口契约清晰：

```
                    ┌─────────────────────────┐
                    │    App (UI Controller)  │
                    └───────────┬─────────────┘
                                │ 调度与协作
        ┌──────────────┬────────┼──────────────┬──────────────┐
        ▼              ▼        ▼              ▼              ▼
  ┌───────────┐ ┌───────────┐ ┌──────────┐ ┌─────────────┐ ┌──────────┐
  │ MedicalDB │ │ PEEngine  │ │ CalcCore │ │DrugAssistant│ │  AIChat  │
  └───────────┘ └───────────┘ └──────────┘ └─────────────┘ └──────────┘
  [数据仓储单例] [智能推理引擎] [算法纯函数] [业务交互代理]  [提示词引擎]
```

---

## 2. 核心对象速查与 API 契约

### 2.1 MedicalDB (临床数据仓储总线)
- **定位**：科室配置、病历模板、亚专科分组及临床路径的统一数据总线（仓储单例）。
- **对象访问**：`window.MedicalDB`

#### 公有方法 (Public Methods)
| 方法签名 | 返回类型 | 说明 |
| :--- | :--- | :--- |
| `registerDepartment(deptConfig, diseaseList, groups)` | `void` | 注册/更新科室元数据、疾病列表与亚专科分组 |
| `getDepartments()` | `Array<DeptConfig>` | 获取所有已注册科室清单 |
| `getDiseasesByDept(deptId)` | `Array<DiseaseItem>` | 按科室 ID 获取疾病模板集合 |
| `getDiseaseGroupsByDept(deptId)` | `Array<Group> \| null` | 获取科室所属的亚专科分组配置 |
| `getTemplate(deptId, index)` | `DiseaseItem \| null` | 获取指定科室及索引处的完整模板对象 |
| `getStatistics()` | `{ totalDiseases, totalCps }` | 获取全系统模板与临床路径总数统计 |
| `getNormalPE()` | `string` | 获取全局共享的标准体格检查模板底稿 |

#### 调用示例 (Usage)
```javascript
// 1. 查询所有科室
const depts = window.MedicalDB.getDepartments();

// 2. 获取普外科第 1 个疾病模板
const disease = window.MedicalDB.getTemplate('surgery', 0);
console.log(disease.name, disease.icd, disease.t.chiefComplaint);
```

---

### 2.2 PEEngine (体格检查与病程智能推导引擎)
- **定位**：专科阳性体征识别、全身体查融合消解与首次病程记录同步的智能推理引擎。
- **对象访问**：`window.PEEngine`

#### 公有方法 (Public Methods)
| 方法签名 | 说明 |
| :--- | :--- |
| `applySmartPE(deptId, diseaseIdx)` | 主入口：读取生命体征与专科检查，执行体查冲突消解与首次病程自动同步 |
| `_deconflictPE(basePE, specialistText, hr, diseaseItem)` | 核心推理：将专科阳性体征无缝合并入全身体格检查对应系统 |
| `_generateCondensedPE(admissionPE, diseaseItem)` | 规范精炼：依临床规范生成精简版首次病程体格检查文本（保留阳性发现与相关系统） |
| `_classifyDiseaseSystem(name, deptId)` | 分类器：根据疾病名称与亚专科推导归属器官系统（respiratory, abdominal, cardiac 等） |
| `_specHasSystemFinding(spec, system)` | 匹配器：子句级检测专科检查文本中特定体系统的阳性体征（排除阴性描述） |
| `_extractAllClauses(spec, pattern)` | 提取器：从专科检查文本中按标点切分并提取匹配子句（过滤未填占位符） |
| `_isClauseNegative(c)` | 判定器：判断单个子句是否为阴性/正常描述（如“无”、“未触及”、“正常”等） |
| `_needsDeconfliction(peText, spec, name)` | 检查器：判断当前体检文本是否存在与专科检查矛盾的表述 |
| `_sentenceHasAbnormal(sentence)` | 判定器：判断句子是否包含阳性/异常体征（非全阴性描述） |
| `_sentenceMatchesSystem(sentence, system)` | 判定器：判断句子是否匹配指定体系统 |
| `_syncFirstCourse(tVal, pVal, rVal, bpVal, diseaseItem, specialistResult, admissionPE)` | 同步器：采用多策略模式（标准格式/Pattern A/Pattern B）更新首次病程体查段落 |

#### 调用示例 (Usage)
```javascript
// 1. 触发当前病历体格检查智能推理与病程联动
window.PEEngine.applySmartPE();

// 2. 亦可显式传入指定科室与疾病索引
window.PEEngine.applySmartPE('surgery', 0);
```

---

### 2.3 CalcCore (临床计算核心算法类)
- **定位**：无状态 (Stateless) 的纯函数计算引擎，无 DOM 依赖，支持任意环境（Web / Node / 单元测试）。
- **对象访问**：`window.CalcCore` 或 `globalThis.CalcCore`

#### 公有方法 (Public Methods)
| 方法签名 | 参数类型 | 返回值 | 临床含义 |
| :--- | :--- | :--- | :--- |
| `bmi(weightKg, heightCm)` | `(number, number)` | `number` | 身体质量指数 BMI |
| `qtcBazett(qtMs, hr)` | `(number, number)` | `number` | 校正 QTc 间期 (ms) |
| `mapArterial(sbp, dbp)` | `(number, number)` | `number` | 平均动脉压 (mmHg) |
| `apri(ast, plt)` | `(number, number)` | `number` | 肝纤维化 APRI 评分 |
| `fib4(age, ast, alt, plt)` | `(number, number, number, number)` | `number` | 肝纤维化 FIB-4 指数 |
| `sofaScore(params)` | `{ resp, coag, liver, cardiovascular, neuro, renal }` | `number` | 脓毒症 SOFA 评分 (0~24) |
| `graceScore(params)` | `{ age, hr, sbp, creatinineMg, killip, cardiacArrest, stDeviation, elevatedEnzymes }` | `number` | 急性冠脉综合征 GRACE 危险分层 |
| `blatchfordScore(params)`| `{ bun, hb, sbp, pulse, gender, melena, syncope, liverDisease, heartFailure }` | `number` | 上消化道出血 GBS 评分 |
| `nihssScore(items)` | `Array<number>` | `number` | 脑卒中 NIHSS 评分 |
| `gestationalAge(lmpStr, onDateStr)` | `(string, string)` | `{ weeks, days, edc }` | 孕周与预产期计算 |

#### 调用示例 (Usage)
```javascript
// 计算 BMI（注：CalcCore 内部返回高精度浮点原生值，UI 层通常调用 .toFixed(1) 或 .toFixed(2) 进行展示）
const patientBMI = CalcCore.bmi(70, 175); // => 22.857142857142858 (UI展示: 22.9 或 22.86)

// 计算 SOFA 评分 (0~24)
const sofa = CalcCore.sofaScore({
    resp: 2, coag: 1, liver: 0, cardiovascular: 2, neuro: 1, renal: 0
}); // => 6
```

---

### 2.4 DrugAssistant (临床用药决策与交互代理)
- **定位**：药品多维度检索、分类过滤、详情呈现、用法复制及处方带入的交互控制器。
- **对象访问**：`window.DrugAssistant`

#### 公有方法 (Public Methods)
| 方法签名 | 说明 |
| :--- | :--- |
| `init()` | 初始化分类列表、药品检索索引与默认展示卡片 |
| `selectCategory(catId)` | 切换当前药品大类（如 'all', 'anti_infective', 'cardiovascular', 'respiratory', 'digestive', 'endocrine', 'analgesic', 'emergency', 'neuro'） |
| `onSearch(query)` | 触发关键词实时检索（支持名称、拼音、适应症、标签多维匹配） |
| `selectDrug(drugId)` | 激活指定药品卡片并渲染配伍禁忌与全维度用药详情（如真实药品 ID 'd_001', 'd_006'） |
| `copyUsage(drugId)` | 格式化并快速复制药品用法用量至系统剪贴板 |
| `insertToDischarge(drugId)` | 将药品用法格式化追加至出院记录的“出院带药”区域 |

#### 调用示例 (Usage)
```javascript
// 切换至心血管系统分类 (cardiovascular) 并检索阿司匹林
DrugAssistant.selectCategory('cardiovascular');
DrugAssistant.onSearch('阿司匹林');
DrugAssistant.selectDrug('d_006'); // 选中阿司匹林肠溶片 (d_006)
```

---

### 2.5 AIChat (临床 AI 提示词推导对象)
- **定位**：提取当前病历上下文（主诉、现病史、诊断、辅助检查），依据六大临床场景生成结构化 Prompt。
- **对象暴露**：全局辅助函数/命名空间

#### 公有方法 (Public Methods)
| 方法签名 | 说明 |
| :--- | :--- |
| `fillAiPrompt(toolType)` | 根据场景提取病历数据并注入 Prompt，可选场景：`firstCourse`（首次病程）、`fixTemplate`（病历质控）、`differential`（鉴别诊断）、`discharge`（出院记录）、`pathway`（临床路径）、`calculator`（指标量表） |
| `copyAiPrompt()` | 复制生成的专业临床 Prompt 到剪贴板供接入 LLM 推理 |

#### 调用示例 (Usage)
```javascript
// 一键生成当前疾病的“鉴别诊断推导”提示词
fillAiPrompt('differential');
copyAiPrompt();
```

---

## 3. 二次开发与扩展指南 (Extensibility)

### 3.1 扩展新科室与疾病模板 (扩展 MedicalDB)
通过 `MedicalDB.registerDepartment` 挂载新数据模块：

```javascript
// my_new_dept.js
(function() {
    const deptConfig = {
        id: 'ent',
        name: '耳鼻喉科',
        icon: '👂'
    };

    const diseaseList = [
        {
            name: '慢性化脓性中耳炎',
            icd: 'H66.300',
            t: {
                chiefComplaint: '左耳反复流脓伴听力下降5年，加重1周。',
                presentIllness: '患者5年前无明显诱因出现左耳间歇性流脓...',
                specialistExam: '左侧外耳道内见脓性分泌物，鼓膜紧张部中央性穿孔...',
                admitDiagnosis: '慢性化脓性中耳炎（左耳）',
                treatmentPlan: '1. 完善耳部CT；2. 局部清洁抗炎；3. 择期行鼓室成形术。',
                firstCourse: '...',
                discharge: '...',
                cp: null // 可选临床路径配置
            }
        }
    ];

    const groups = [
        { group: '耳科疾病', items: ['慢性化脓性中耳炎'] }
    ];

    if (window.MedicalDB) {
        window.MedicalDB.registerDepartment(deptConfig, diseaseList, groups);
    }
})();
```

### 3.2 扩展新临床计算器 (扩展 CalcCore)
直接在 `CalcCore` 纯函数对象上挂载新算法：

```javascript
// 扩展肾小球滤过率 (eGFR-CKD-EPI) 计算公式
CalcCore.egfrCkdEpi = function(scr, age, gender) {
    if (!scr || !age) return NaN;
    const isFemale = gender === 'female';
    const k = isFemale ? 0.7 : 0.9;
    const a = isFemale ? -0.329 : -0.411;
    const minVal = Math.min(scr / k, 1);
    const maxVal = Math.max(scr / k, 1);
    let egfr = 141 * Math.pow(minVal, a) * Math.pow(maxVal, -1.209) * Math.pow(0.9929, age);
    if (isFemale) egfr *= 1.018;
    return Math.round(egfr * 10) / 10;
};
```

### 3.3 扩展专科系统识别与体查推导 (扩展 PEEngine)
若添加了新专科系统（如耳鼻喉），只需在 `classifyDiseaseSystem` 与 `sentenceMatchesSystem` 中追加匹配规则与正则映射。

---

## 4. 最佳实践与规范

1. **坚持纯函数无副作用**：所有数学与评分公式须封装于 `CalcCore`，严禁在计算核心内操作 DOM。
2. **单一数据流**：病历数据的读写统一通过 `MedicalDB` 接口，避免跨模块直接操作私有闭包变量。
3. **安全防御性传参**：所有数值计算前统一进行 `Number` 类型与边界校验，防止运行时抛出异常。
