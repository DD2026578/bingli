# 外科宝宝病历巴士 — 临床病历辅助与决策系统 · 开发维护指南

> **💡 系统核心定位：** 本项目定位为**轻量、高效、开箱即用的临床病历模板与素材智库**，旨在为临床医师提供丰富、规范、高质量的病历表达、专科体查与临床路径素材，方便快捷调用与复制。**本系统并非 HIS 或电子病历 (EMR) 实际临床工作站**，无需后端数据库，不增加冗余流程拦截，始终保持极简顺畅的操作体验。

> **致后续开发者：** 本文档是当前系统的完整架构设计、运行逻辑、数据解耦标准及扩展开发手册。进行任何修改前，请先通读本文档，严格遵循统一规范，保证系统稳定性和数据一致性。

当前系统规模：4 个科室、150 个疾病模板、28 个临床计算器。

### 最近更新

- **清理历史遗留**：移除根目录临时审计脚本（_audit*/_check_internal.js）、scripts/ 一次性数据迁移/修复产物及 js/data/pe_negative_signs.js 死代码（NEGATIVE_SIGNS_DB 无任何运行时引用）
- **模板扩充**：妇产科由 4 → 16 个模板（产科 5、妇科肿瘤 6、妇科急症 3、普通妇科 2），儿科由 4 → 7 个模板（呼吸 2、消化 1、感染 1、新生儿 1、免疫 1、神经 1）
- **现病史质量优化**：体表肿物分组 5 个模板（表皮样囊肿、脂肪瘤、纤维瘤、色素痣、血管瘤）及骨科分组 8 个模板（桡骨远端骨折、锁骨骨折、胫骨骨折、肱骨骨折、肱骨髁上骨折、肩关节脱位、踝关节骨折、膝关节半月板损伤）的 presentIllness 按临床书写规范扩充至 200-260 字，firstCourse 现病史段落同步更新
- **计算引擎统一**：calculators.js 中 FIB-4 / APRI 已接入 CalcCore 纯函数内核
- **DISEASE_GROUPS 同步**：departments.js 各科室疾病分组已与模板清单 100% 对齐
- **README 与代码同步**：主题系统扩展为六套（新增梦幻紫/暖阳橙），补充 intro.js 开场动画模块与 app.js 函数索引

---

## 目录

1. [系统总体架构与解耦理念](#1-系统总体架构与解耦理念)
2. [项目目录结构全景](#2-项目目录结构全景)
3. [运行时启动流程与数据流](#3-运行时启动流程与数据流)
4. [MedicalDB 统一数据总线机制](#4-medicaldb-统一数据总线机制)
5. [疾病模板数据结构规范 (Schema)](#5-疾病模板数据结构规范-schema)
6. [PEEngine 体格检查智能引擎](#6-peengine-体格检查智能引擎)
7. [Calculators 临床计算器模块](#7-calculators-临床计算器模块)
8. [AI Chat 提示词引擎](#8-ai-chat-提示词引擎)
9. [app.js 核心调度控制器](#9-appjs-核心调度控制器)
10. [CSS 样式系统与主题机制](#10-css-样式系统与主题机制)
11. [扩展开发指南](#11-扩展开发指南)
12. [智能体 (Agent) 协作铁律](#12-智能体-agent-协作铁律)
13. [技术栈概览](#13-技术栈概览)

---

## 1. 系统总体架构与解耦理念

本项目为纯前端静态应用，遵循以下核心原则：

1. **定位明确（Template Hub）**：病历素材与表达智库，非复杂 HIS/EMR 工作站，强调“模板高质、调取代快、极简无阻”。
2. **界面与数据彻底隔离（HTML Data-Free）**：index.html 仅承担 DOM 骨架渲染与资源加载，禁止硬编码疾病文书或路径静态文本。
3. **纯 JavaScript 数据驱动（JS as DB）**：所有业务数据（科室配置、疾病模板、临床路径）存放在 js/data/ 目录下的静态 JS 文件中，无需数据库，浏览器直接加载即用。
4. **数据总线统一管理（MedicalDB Central Bus）**：通过全局单例 MedicalDB 控制数据注册、按科室查询、模板提取及统计。
5. **功能与 UI 调度独立（Modularity）**：计算器（calculators.js）、AI 提示词（ai_chat.js）、体格检查引擎（pe_engine.js）与页面主控（app.js）互相解耦，独立维护。

### 架构分层总览

    ┌─────────────────────────────────────────────┐
    │              入口层 (Entry Layer)            │
    │  index.html (DOM骨架) + css/style.css        │
    ├─────────────────────────────────────────────┤
    │              主控调度层 (Controller)          │
    │  js/app.js — Tab切换/模板填充/搜索/草稿/主题  │
    ├──────────────┬──────────────┬────────────────┤
    │  计算器模块   │  AI提示词模块 │  体格检查引擎   │
    │ calculators  │  ai_chat.js  │  pe_engine.js  │
    │ calc_core.js │              │ (阳性发现整合)  │
    ├──────────────┴──────────────┴────────────────┤
    │           开场叙事模块 (Intro)                │
    │  intro.js — 生命律动心电图开场页              │
    ├─────────────────────────────────────────────┤
    │              数据总线层 (Data Bus)            │
    │  js/data/db.js — MedicalDB 单例              │
    ├─────────────────────────────────────────────┤
    │              数据层 (Data Files)              │
    │  departments.js surgery.js internal.js       │
    │  obgyn.js pedia.js                           │
    └─────────────────────────────────────────────┘

### 七大功能 Tab 面板

| Tab 标识 | 面板 ID | 功能 |
|---|---|---|
| admission | panel-admission | 入院记录（患者信息、主诉、现病史、既往史、体查、专科检查、辅助检查、诊断） |
| firstCourse | panel-firstCourse | 首次病程记录（病历特点、诊断依据、鉴别诊断、诊疗计划） |
| dailyCourse | panel-dailyCourse | 日常病程记录（主治/主任查房、疗效评估、出院前评估） |
| discharge | panel-discharge | 出院记录（入院情况、诊治经过、出院情况、出院诊断、出院医嘱） |
| pathway | panel-pathway | 临床路径表单（适用对象、诊断依据、治疗方案、日程表等） |
| calculator | panel-calculator | 临床计算器（28 种，7 大分类） |
| aiChat | panel-aiChat | AI 对话（提示词生成 + 4 大平台跳转） |

---

## 2. 项目目录结构全景

    ├── AGENTS.md                    # 协作工作流规则（分工执行与验收审查）
    ├── index.html                   # 前端主入口 DOM 页面（纯 UI 骨架，无业务数据）
    ├── README.md                    # 本维护手册
    ├── css/
    │   └── style.css                # 全局 UI 样式、CSS 变量、六套主题、打印样式
    ├── js/
    │   ├── app.js                   # 【主控层】页面核心调度器
    │   ├── data/                    # 【数据层】独立静态数据模块（仅运行时文件）
    │   │   ├── db.js                # MedicalDB 全局数据总线与 NORMAL_PE 标准体检模板
    │   │   ├── departments.js       # DEPARTMENT_CONFIGS 科室元数据 + DISEASE_GROUPS 二级分类
    │   │   ├── surgery.js           # 外科疾病模板（84 个）与临床路径
    │   │   ├── internal.js          # 内科疾病模板（63 个）与临床路径
    │   │   ├── obgyn.js             # 妇产科疾病模板（16 个）与临床路径
    │   │   └── pedia.js             # 儿科疾病模板（7 个）与临床路径
    │   └── modules/                 # 【模块层】功能控制脚本
    │       ├── calc_core.js         # 临床计算核心公式（纯函数，供计算器与单元测试复用）
    │       ├── calculators.js       # 28 种临床计算器 + 3 种 A4 打印报告
    │       ├── ai_chat.js           # AI 大模型对话 Prompt 提炼与快捷工具
    │       ├── pe_engine.js         # 体格检查智能推导引擎（阳性发现整合）
    │       └── intro.js             # 生命律动心电图叙事开场页（会话内播放一次，sessionStorage 记忆）
    └── tests/
        └── calculators.test.js      # 计算核心公式单元测试（node tests/calculators.test.js）

> 注：js/data/ 仅保留运行时数据文件；历史遗留的一次性数据迁移/修复脚本（原 scripts/ 目录）与临时审计脚本已清理移除，不随项目发布。

---

## 3. 运行时启动流程与数据流

### 3.1 页面加载与初始化流程

index.html 按顺序加载样式和脚本：db.js → departments.js → 科室数据文件 → calc_core.js → calculators.js → ai_chat.js → pe_engine.js → intro.js → app.js。DOM 加载完成后触发 init()：

1. 设置默认日期（入院日期、记录日期、GCS/Caprini/Padua 评估日期）
2. renderDeptList() 渲染科室按钮
3. loadDiseaseList() 渲染疾病列表
4. updateHeaderCounts() 更新模板/路径统计
5. initAutoSave() 初始化草稿自动保存
6. initTheme() 初始化主题

### 3.2 核心用户操作数据流

   用户点击科室 → selectDept() 同步 currentDept/window.currentDept，重置疾病索引
   用户点击疾病 → selectDisease() 同步 currentDisease/window.currentDisease
       └→ 自动调用 fillTemplate()（v2.0 全自动模式）
           ├→ 遍历模板 t 字段写入对应 DOM
           ├→ syncDatesToCourse() 替换 {date}
           ├→ renderPathway() 渲染临床路径
           └→ PEEngine.applySmartPE() 自动整合体格检查与首次病程

### 3.3 PEEngine 智能体检引擎数据流

fillTemplate() → PEEngine.applySmartPE() → 读取生命体征与专科检查 → 基于 NORMAL_PE 生成体格检查 → classifyDiseaseSystem() 分类体统 → deconflictPE() 将专科检查阳性发现直接整合进对应系统段落 → syncFirstCourse() 同步首次病程体查段落。

---

## 4. MedicalDB 统一数据总线机制

数据总线位于 js/data/db.js，通过 IIFE 创建全局单例 window.MedicalDB。

### 4.1 内部数据结构

    window.MedicalDB = (function(){
        const departments = [];   // [{ id, name, icon }, ...]
        const diseases = {};      // { surgery: [...], internal: [...], ... }
        const diseaseGroups = {}; // { surgery: [{ group, items }, ...], ... }
        const NORMAL_PE = '...';  // 标准正常体检模板（含 {hr}、{mentality}）
    })();

### 4.2 API 列表

| API | 参数 | 返回 | 说明 |
|---|---|---|---|
| registerDepartment | config, diseaseList, groups | void | 注册科室数据（重复注册覆盖） |
| getDepartments | - | 数组 | 获取全部科室 |
| getDiseasesByDept | deptId | 数组 | 获取指定科室全部疾病 |
| getDiseaseGroupsByDept | deptId | 数组/null | 获取科室二级分类 |
| getTemplate | deptId, index | 对象/null | 按索引获取模板 |
| getStatistics | - | {totalDiseases, totalCps} | 模板与临床路径统计 |
| getNormalPE | - | 字符串 | 标准正常体检模板 |

### 4.3 NORMAL_PE 占位符

NORMAL_PE 包含 {hr}（心率）与 {mentality}（体位）两个占位符，由 app.js 的 fillNormalPE() 在填充时替换为实际值。

---

## 5. 疾病模板数据结构规范 (Schema)

每个疾病模板为 JavaScript 对象，必须包含：

| 字段 | 说明 |
|---|---|
| name | 疾病标准名称 |
| icd | ICD-10 编码 |
| t.chiefComplaint | 主诉（不超过 20 字，可含占位符） |
| t.presentIllness | 现病史（完整、结构化叙述） |
| t.pastHistory / t.personalHistory / t.menstrualHistory / t.maritalHistory / t.familyHistory | 各病史段落 |
| t.t / t.p / t.r / t.bp / t.hr | 生命体征 |
| t.physicalExam | 体格检查（可写 NORMAL_PE，运行时由引擎重建） |
| t.specialistExam | 专科检查（包含阳性体征，供 PEEngine 提取） |
| t.auxiliaryExam | 辅助检查 |
| t.admitDiagnosis / t.finalDiagnosis | 初步诊断 / 最后诊断 |
| t.firstCourse / t.dailyCourse / t.dischargeRecord | 首次病程、日常病程、出院记录 |
| t.cp | 临床路径对象（可选，建议填写） |
| t.peConfig | [历史兼容] 不再被运行时读取，可保留或省略 |

### 5.1 占位符规范

模板文本可使用 {xxx} 形式占位符，常用占位符包括：{date}、{days}、{age}、{sex}、{t}、{p}、{r}、{bp}、{hr} 等。{date} 会在填模板时自动替换为入院日期；其余占位符由使用者按实际情况替换。

> 规范：不得使用「{xxx}（选项A/选项B）」形式的选项式占位符，避免选项文字残留到最终文书。

### 5.2 新增模板检查清单

- name 与 icd 完整
- 五大文书（admitDiagnosis、firstCourse、dailyCourse、dischargeRecord）齐备
- specialistExam 包含该疾病的阳性体征描述
- firstCourse 包含标准体格检查/查体段落标记（否则 syncFirstCourse 静默失败）
- physicalExam 可写 NORMAL_PE 或留空（运行时由引擎生成）
- 日常病程 ≥ 2000 字、段落完整（病情动态、查体观察、辅助检查、上级意见、出院医嘱）
- 现病史 ≥ 200 字、结构化叙述（涵盖起病/演变/伴随症状/诊治经过/一般情况）
- 首次病程中的现病史段落必须与入院记录 presentIllness 保持一致（去掉结尾一般情况句）
- 疾病名称可被 classifyDiseaseSystem() 正确分类

---

## 6. PEEngine 体格检查智能引擎

位于 js/modules/pe_engine.js，通过 IIFE 创建全局单例 window.PEEngine。

### 6.1 核心职责

1. 全自动模式：选疾病即自动生成完整体格检查
2. 精准分类：classifyDiseaseSystem() 将疾病归入体系统
3. 阳性发现直接整合：deconflictPE() 将专科检查阳性发现整合到体格检查对应段落，不使用「详见专科检查」引用
4. 首次病程同步：syncFirstCourse() 同步首次病程体查段落（使用精简版 generateCondensedPE）

### 6.2 暴露的 API

| API | 说明 |
|---|---|
| PEEngine.applySmartPE(deptId?, diseaseIdx?) | 全自动推导合成逻辑，fillTemplate() 时自动调用 |

### 6.3 核心内部函数

| 函数 | 作用 |
|---|---|
| classifyDiseaseSystem(name, deptId) | 疾病体系统分类器（14+ 系统） |
| specHasSystemFinding(spec, system) | 专科检查系统特异性匹配（子句级阴性排除） |
| specHasPositive(spec, pattern) | 通用阳性发现检测 |
| isClauseNegative(c) | 阴性子句判定 |
| extractAllClauses(spec, pattern) | 提取匹配子句（句号→逗号二级分割） |
| deconflictPE(basePE, spec, hr, diseaseItem) | 阳性发现直接整合引擎 |
| generateCondensedPE(admissionPE, diseaseItem) | 首次病程精简版体格检查 |
| syncFirstCourse(...) | 首次病程体查段落同步 |

### 6.4 测试出口

内部函数以 _ 前缀暴露（如 PEEngine._classifyDiseaseSystem、PEEngine._deconflictPE），仅用于测试验证，运行时不应直接调用。

---

## 7. Calculators 临床计算器模块

位于 js/modules/calculators.js（28 种计算器，7 大分类）+ js/modules/calc_core.js（纯函数核心）。

| 分类 | 计算器 |
|---|---|
| 肾脏、代谢与体征 | Ccr/eGFR（CKD-EPI）、BSA、校正血钙、阴离子隙 AG |
| 肝胆与消化系统 | Child-Pugh、FIB-4 & APRI、MELD、Glasgow-Blatchford |
| 呼吸重症与血管急症 | CURB-65、Wells DVT、Wells PE |
| 外科烧伤与儿科 | 烧伤补液、小儿体重与补液张力 |
| 神经与意识评估 | GCS、Hunt-Hess、Caprini、Padua、NIHSS |
| 心血管与急重症评分 | CHA₂DS₂-VASc、qSOFA、MEWS、TIMI、QTc、MAP、SOFA、GRACE |
| 通用与妇产 | BMI、孕周/预产期 |

打印报告：GCS、Padua、Caprini 三份 A4 评估报告（printAssessmentResult）。

calc_core.js 提供纯函数：bmi、qtcBazett、mapArterial、apri、fib4、sofaScore、graceScore、blatchfordScore、nihssScore、gestationalAge。

单元测试：node tests/calculators.test.js（验证核心公式与边界）。

---

## 8. AI Chat 提示词引擎

位于 js/modules/ai_chat.js。

| 函数 | 说明 |
|---|---|
| fillAiPrompt(toolType) | 生成并填入 AI 提示词 |
| copyAiPrompt() | 复制提示词到剪贴板 |

工具类型：fixTemplate（模板质控重写）、firstCourse（首次病程生成）、differential（鉴别诊断）、discharge（出院记录）、pathway（临床路径）、calculator（预留）。

AI 平台（app.js openAI）：DeepSeek、Kimi、智谱清言、通义千问。

---

## 9. app.js 核心调度控制器

位于 js/app.js。

### 9.1 全局状态变量

    let currentDept = 'surgery';
    let currentDisease = null;
    let autoPE = false;
    window.currentDept = 'surgery';
    window.currentDisease = 0;
    window.currentDiseaseItem = null;

> 注意：PEEngine 通过 window.currentDept / window.currentDiseaseItem 读取上下文，任何修改这两处值的代码必须同步更新 window 副本。

### 9.2 核心函数索引

init、renderDeptList、updateHeaderCounts、selectDept、loadDiseaseList、searchDisease、selectDisease、fillTemplate、switchTab、syncDatesToCourse、fillNormalPE、fillNormalVitals、regeneratePE、toggleAutoPE、renderPathway、cpSection、openAI、showToast、copyToClipboard、fallbackCopy、collectAllRecordText、collectFormData、copyRecordForAI、copyWithPrompt、copyWithCustomPrompt、clearPrompt、saveDraft、initAutoSave、initTheme、updateThemeBtnLabel、toggleTheme。

### 9.3 草稿自动保存

- 存储键：magic_medical_record_draft
- 触发：input 事件 2.5 秒防抖
- 内容：带 id 的表单元素值 + 时间戳 + 当前疾病索引 + 当前科室（计算器与 AI 面板输入不纳入草稿）

### 9.4 主题切换

- 存储键：magic_medical_theme（light / pink / green / dark / purple / orange）
- 应用方式：document.documentElement.setAttribute('data-theme', theme)
- 默认跟随系统 prefers-color-scheme

### 9.5 临床路径渲染

renderPathway(cp) 将 t.cp 渲染为 12 个 section + 日程表；空字段跳过，cp 为空显示「该疾病暂无临床路径数据」。

---

## 10. CSS 样式系统与主题机制

位于 css/style.css。

- CSS 变量集中在 :root（颜色、圆角、阴影、字体）
- 六套主题：白昼清爽（light，默认）/ 宝宝粉（pink）/ 护眼绿（green）/ 护眼夜间（dark）/ 梦幻紫（purple）/ 暖阳橙（orange）
- 主题通过 html[data-theme="light|pink|green|dark|purple|orange"] 属性切换，pink/green/purple/orange 仅覆盖 CSS 变量及少量组件背景，dark 另有组件级深度适配
- 主题按钮循环切换顺序：light → pink → green → dark → purple → orange → light，当前主题显示于按钮标签，持久化于 localStorage（magic_medical_theme）
- 默认跟随系统 prefers-color-scheme（仅决定 light/dark）
- @media print 提供病历、临床路径、AI 面板的打印优化
- 头部蛇杖 logo 为内联 SVG + CSS 动画（orbPulse / snakeStream / tongueFlick / staffFloat）

---

## 11. 扩展开发指南

### 11.1 在现有科室中新增疾病模板

1. 在对应数据文件（如 js/data/surgery.js）中新增符合 Schema 的模板对象
2. 如需二级分类，在 js/data/departments.js 对应分组的 items 中加入疾病名
3. 保存后刷新页面即可，无需编译

### 11.2 新增全新科室

1. departments.js 的 DEPARTMENT_CONFIGS 中声明科室
2. 在 js/data/ 新建科室数据文件，调用 MedicalDB.registerDepartment()
3. 在 index.html 中按顺序引入（必须在 app.js 之前）

### 11.3 新增临床计算器

1. 在 calculators.js 新增 calcXxx()（参数校验、文献依据、复制按钮）
2. 在 index.html 对应分类新增 calc-card

### 11.4 新增 AI 提示词工具

1. ai_chat.js 的 fillAiPrompt() 中新增 case
2. index.html AI 面板工具区新增按钮

### 11.5 修改 CSS 主题

1. 颜色变量统一在 :root 与 html[data-theme="dark"] 中维护
2. 新组件样式需同时适配日间与夜间

### 11.6 扩展 PEEngine 系统整合规则

1. classifyDiseaseSystem() 新增系统标签（注意优先级顺序）
2. specHasSystemFinding() 新增匹配模式（必须要求 body-part 上下文）
3. deconflictPE() 新增整合逻辑（保持执行顺序）
4. sentenceMatchesSystem() 同步更新（供 generateCondensedPE 使用）
5. needsDeconfliction() 的 sysList 同步更新

---

## 12. 智能体 (Agent) 协作铁律

### 12.1 数据安全铁律

1. 严禁将模板静态文本写回 index.html；所有静态数据必须放在 js/data/
2. 严禁删除已有 Schema 字段（cp、t 等）；peConfig 保留向后兼容
3. 严禁修改 MedicalDB 的 API 签名，除非同步更新全部调用方

### 12.2 病历一致性铁律

1. 新增疾病模板必须保证五大文书完备
2. 体格检查不得出现「详见专科检查」引用，必须完整体现所有系统查体
3. 首次病程体查与入院记录体查保持一致（v2.3 精简版）
4. 首次病程必须包含标准体查段落标记，否则 syncFirstCourse 静默失败
5. 初步诊断与最后诊断逻辑关联，不得无依据推翻
6. 日常病程时间线连续合理；日常病程不得写成四句话式单薄模板
7. 现病史结构化叙述，达到统一质量标准（≥ 200 字，涵盖起病/演变/伴随/诊治/一般情况）
8. 首次病程中的现病史段落必须与入院记录 presentIllness 保持一致（去掉结尾一般情况句）

### 12.3 代码稳定性铁律

1. 修改数据文件后校验 IIFE 结构、registerDepartment 调用与数组语法
2. 新增 JS 文件必须在 index.html 按顺序引入
3. 新增 DOM 元素时，id 必须与模板字段名一致（如需 fillTemplate 自动填充）
4. 修改 PEEngine 时确保 applySmartPE 在 fillTemplate 自动调用时正常，并做 null 安全处理
5. 禁止恢复「应用模板」按钮或「体征结构化勾选生成器」模态框

### 12.4 PEEngine 分类器与整合铁律

1. 修改 classifyDiseaseSystem 时保持分类优先级顺序，避免跨系统误判
2. 所有匹配模式必须要求 body-part 上下文，禁止孤立泛化词
3. 保持 deconflictPE 执行顺序
4. 扩展新系统时同步更新 sentenceMatchesSystem 与 needsDeconfliction 的 sysList

---

## 13. 技术栈概览

| 项目 | 技术选型 |
|---|---|
| 前端框架 | 纯原生 HTML + CSS + JavaScript（无框架依赖） |
| 数据存储 | 浏览器内存（JS 静态文件）+ localStorage（草稿/主题） |
| 模块化 | IIFE（立即执行函数）+ 全局单例模式 |
| 主题系统 | CSS 变量 + data-theme 属性切换 |
| 打印方案 | window.open() + document.write() + @media print |
| 单元测试 | Node 内置断言（tests/calculators.test.js） |
| 兼容性 | Chrome / Edge / Firefox / Safari 现代浏览器 |
| 部署方式 | 静态文件直接部署，无需服务器 |

---

## 14. 部署到 GitHub Pages

本项目为纯静态站点，推荐使用 GitHub Pages 自动部署，无需服务器。

- 推送 `main` 分支即触发 `.github/workflows/` 下的发布工作流，自动构建并发布到 GitHub Pages。
- 部署使用 GitHub 自带的 `GITHUB_TOKEN`，无需配置任何个人访问令牌。
- 站点地址由「用户名 + 仓库名」决定，保持仓库名不变即可维持原有网址不变。

---

*最后更新：2026-08-24*
