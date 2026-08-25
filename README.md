# 外科宝宝病历巴士 — 临床病历辅助与决策系统 · 架构与开发维护指南

> **💡 系统核心定位：** 本项目定位为**轻量、高效、开箱即用的临床病历模板与素材智库**，旨在为临床医师提供丰富、规范、高质量的病历表达、专科体查、临床计算、用药决策与临床路径素材，方便快捷调用与复制。**本系统并非 HIS 或电子病历 (EMR) 实际临床工作站**，无需后端数据库，不增加冗余流程拦截，始终保持极简顺畅的操作体验。

> **致后续开发者：** 本文档是当前系统的完整架构设计、函数依赖网络、组件拓扑拓扑关系、数据解耦标准及扩展开发手册。进行任何修改前，请先通读本文档，严格遵循统一规范，保证系统稳定性和数据一致性。

当前系统规模：**4 个临床科室**（外科 84 个、内科 63 个、妇产科 16 个、儿科 7 个，共计 **170 个疾病模板**）、**8 大功能 Tab 面板**、**28 个临床计算器**、**9 大分类 45+ 临床药物全维度知识库**。

---

## 目录

1. [系统总体架构与解耦理念](#1-系统总体架构与解耦理念)
2. [项目目录结构全景](#2-项目目录结构全景)
3. [前端组件拓扑结构与面板编排](#3-前端组件拓扑结构与面板编排)
4. [核心函数调用与依赖拓扑关系](#4-核心函数调用与依赖拓扑关系)
5. [数据构建脚本与数据管道机制](#5-数据构建脚本与数据管道机制)
6. [MedicalDB 统一数据总线机制](#6-medicaldb-统一数据总线机制)
7. [疾病模板与数据结构规范 (Schema)](#7-疾病模板与数据结构规范-schema)
8. [PEEngine 体格检查智能推导引擎](#8-peengine-体格检查智能推导引擎)
9. [Calculators & CalcCore 临床计算引擎](#9-calculators--calccore-临床计算引擎)
10. [DrugAssistant 临床用药知识助手](#10-drugassistant-临床用药知识助手)
11. [AI Chat 智能临床提示词引擎](#11-ai-chat-智能临床提示词引擎)
12. [CSS 样式系统与主题机制](#12-css-样式系统与主题机制)
13. [扩展开发指南与协作规范](#13-扩展开发指南与协作规范)
14. [部署与运维 (GitHub Pages)](#14-部署与运维-github-pages)

---

## 1. 系统总体架构与解耦理念

本项目为纯前端静态应用，遵循以下核心原则：

1. **定位明确（Template Hub）**：病历素材与表达智库，非复杂 HIS/EMR 工作站，强调“模板高质、调取代快、极简无阻”。
2. **界面与数据彻底隔离（HTML Data-Free）**：`index.html` 仅承担 DOM 骨架渲染与资源加载，禁止硬编码疾病文书或路径静态文本。
3. **纯 JavaScript 数据驱动（JS as DB）**：所有业务数据（科室配置、疾病模板、临床路径、药品库）存放在 `js/data/` 目录下的静态 JS 文件中，无需后端数据库，浏览器直接加载即用。
4. **数据总线统一管理（MedicalDB Central Bus）**：通过全局单例 `MedicalDB` 控制数据注册、按科室查询、模板提取及统计；通过 `DRUG_DATABASE` 管理药品检索与分类。
5. **功能与 UI 调度独立（Modularity）**：计算器（`calculators.js` + `calc_core.js`）、用药助手（`drug_assistant.js`）、AI 提示词（`ai_chat.js`）、体格检查引擎（`pe_engine.js`）、开场动效（`intro.js`）与页面主控（`app.js`）互相解耦，独立维护。

### 架构分层总览

```
┌─────────────────────────────────────────────────────────────┐
│                    入口层 (Entry Layer)                      │
│     index.html (纯DOM骨架) + css/style.css (六套主题与响应式) │
├─────────────────────────────────────────────────────────────┤
│                    主控调度层 (Controller)                    │
│     js/app.js — 侧边栏/Tab切换/模板填充/搜索/草稿/主题控制      │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  计算器模块   │  用药助手模块 │  AI提示词模块 │  体格检查引擎   │
│ calculators  │drug_assistant│  ai_chat.js  │  pe_engine.js  │
│ calc_core.js │              │              │ (阳性体征整合) │
├──────────────┴──────────────┴──────────────┴────────────────┤
│                    开场叙事模块 (Intro)                      │
│     intro.js — 暗夜监护舱 Canvas 2D 示波器心搏波形开场         │
├─────────────────────────────────────────────────────────────┤
│                    数据总线层 (Data Bus)                     │
│     js/data/db.js (MedicalDB) + js/data/drugs.js (DRUG_DB)  │
├─────────────────────────────────────────────────────────────┤
│                    数据层 (Data Files)                       │
│     departments.js | surgery.js | internal.js               │
│     obgyn.js       | pedia.js   | drugs.js                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 项目目录结构全景

```
.
├── .github/
│   └── workflows/
│       └── deploy-pages.yml     # GitHub Pages 自动化发布工作流
├── AGENTS.md                    # 协作工作流规则（分工执行与验收审查）
├── build_drugs.js               # 药品知识库数据聚合构建脚本
├── data_builder_part1~9.js      # 药品数据库源分卷数据 (Part 1 ~ Part 9)
├── index.html                   # 前端主入口 DOM 页面（纯 UI 骨架，无业务数据）
├── README.md                    # 本规范与维护指南
├── css/
│   └── style.css                # 全局 UI 样式、CSS 变量、六套主题、响应式与打印样式
└── js/
    ├── app.js                   # 【主控层】页面核心调度器、表单联动与移动端交互
    ├── data/                    # 【数据层】独立静态数据模块（运行时文件）
    │   ├── db.js                # MedicalDB 全局数据总线与 NORMAL_PE 标准体检模板
    │   ├── departments.js       # DEPARTMENT_CONFIGS 科室元数据 + DISEASE_GROUPS 二级分类
    │   ├── surgery.js           # 外科疾病模板（84 个）与临床路径
    │   ├── internal.js          # 内科疾病模板（63 个）与临床路径
    │   ├── obgyn.js             # 妇产科疾病模板（16 个）与临床路径
    │   ├── pedia.js             # 儿科疾病模板（7 个）与临床路径
    │   └── drugs.js             # 华医临床用药数据库 (DRUG_DATABASE)
    └── modules/                 # 【模块层】功能控制脚本
        ├── calc_core.js         # 临床计算核心公式（纯函数、无 DOM 依赖）
        ├── calculators.js       # 28 种临床计算器交互 + 3 种 A4 打印报告引擎
        ├── drug_assistant.js    # 临床用药助手交互主控（多维检索、药理与配伍禁忌展示）
        ├── ai_chat.js           # AI 大模型临床 Prompt 提炼与快捷工具
        ├── pe_engine.js         # 体格检查智能推导引擎（专科阳性体征无缝整合）
        └── intro.js             # 暗夜监护舱 Canvas 2D 示波器开场动画模块
```

---

## 3. 前端组件拓扑结构与面板编排

### 3.1 八大功能 Tab 面板

| Tab 标识 | 面板 ID | 主要职责与子组件 |
|---|---|---|
| `admission` | `panel-admission` | **入院记录**：基本信息表格、主诉、现病史、既往史、个人史、月经史、婚育史、家族史、全身体格检查（含四项生命体征）、专科检查、辅助检查、初步诊断/拟诊讨论。 |
| `firstCourse` | `panel-firstCourse` | **首次病程记录**：病例特点（自动同步现病史/体查/辅检）、拟诊讨论与依据、鉴别诊断、诊疗计划、记录者签名。 |
| `dailyCourse` | `panel-dailyCourse` | **日常病程记录**：上级医师查房记录、日常病情演变、治疗方案调整、术前/术后小结。 |
| `discharge` | `panel-discharge` | **出院记录**：入院情况、诊疗经过、出院情况、出院诊断、出院医嘱及随访建议。 |
| `pathway` | `panel-pathway` | **临床路径表单**：适用对象、进入路径标准、标准住院日、诊疗日程表（Day 1 至出院）。 |
| `calculator` | `panel-calculator` | **临床计算器**：28 种量表计算卡片、7 大子分类导航、动态结果渲染与 A4 报告打印。 |
| `drugAssistant` | `panel-drugAssistant` | **用药助手**：9 大药品分类、拼音/通用名实时模糊检索、药品全维度药理与用法卡片、配伍禁忌及用药医嘱一键生成。 |
| `aiChat` | `panel-aiChat` | **AI 临床助手**：病历要素一键提取、6 大提示词预设快捷生成、主流平台（DeepSeek / Kimi / 智谱 / 通义）直接跳转。 |

### 3.2 UI 骨架拓扑关系

```
[index.html 入口]
 │
 ├── [Magic Intro 叙事开场页]
 │    ├── #miEcgCanvas (Canvas 2D 示波器波形)
 │    ├── 蛇杖 Logo 动画 (SVG 渐变与流动光效)
 │    └── 四角科室徽章 (外科 / 内科 / 妇产科 / 儿科)
 │
 ├── [Header 顶部导航]
 │    ├── 系统标题与蛇杖标志
 │    ├── 统计徽章 (#totalDiseaseBadge / #totalCpBadge)
 │    └── 主题切换器 (#themeSelect 6套主题)
 │
 └── [Main Layout 主工作区]
      ├── [Left Sidebar 侧边栏] (移动端适配为抽屉式 Drawer)
      │    ├── 科室切换栏 (#deptList)
      │    ├── 疾病搜索框 (#diseaseSearchInput 支持拼音首字母)
      │    └── 疾病列表 (#diseaseList 支持二级分组渲染)
      │
      └── [Right Panel 右侧主工作区]
           ├── [Toolbar 工具栏] (抽屉切换 / 自动体检开关 / 正常体征填充 / 草稿保存提示)
           ├── [Record Tabs 八大面板标签导航]
           └── [Tab Panels 各业务面板容器]
```

---

## 4. 核心函数调用与依赖拓扑关系

系统采用低耦合、高内聚的模块化调用关系：

```
                    ┌─────────────────────────┐
                    │    index.html onload    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       app.js: init()    │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ renderDeptList() │   │ loadDiseaseList()│   │updateHeaderCounts│
└────────┬─────────┘   └────────┬─────────┘   └────────┬─────────┘
         │                      │                      │
         └──────────────────────┼──────────────────────┘
                                │
                                ▼
                   ┌──────────────────────────┐
                   │  MedicalDB (js/data/db)  │
                   └──────────────────────────┘
```

### 4.1 核心业务链路调用流

1. **科室与疾病选择链路**：
   - 用户点击科室 $\rightarrow$ `app.js: selectDept(deptId)` $\rightarrow$ 同步 `currentDept` $\rightarrow$ 调用 `MedicalDB.getDiseasesByDept()` $\rightarrow$ `loadDiseaseList()` 重新渲染二级分组与疾病列表。
   - 用户点击疾病 $\rightarrow$ `app.js: selectDisease(index)` $\rightarrow$ `fillTemplate(index)`：
     - 读取 `MedicalDB.getTemplate(dept, index)`。
     - 解构赋值病历字段（主诉、现病史、既往史、体格检查、专科检查、诊断等）。
     - 调用 `syncDatesToCourse()` 动态替换日期占位符 `{date}`。
     - 调用 `renderPathway(cp)` 渲染临床路径日程表。
     - 调用 `PEEngine.applySmartPE()` 启动体检智能推导。

2. **体检智能融合链路**：
   - `PEEngine.applySmartPE()` $\rightarrow$ 获取生命体征与专科检查文本。
   - `PEEngine.classifyDiseaseSystem(name, deptId)` $\rightarrow$ 结合 `DISEASE_GROUPS` 判断所属解剖体系统（甲状腺/乳腺/神经/骨科/心脏/呼吸/腹部/泌尿等）。
   - `PEEngine.deconflictPE()` $\rightarrow$ 解析标准体检模板 `NORMAL_PE`，并将专科阳性体征无缝合并到对应系统，消除“详见专科检查”的敷衍描述。
   - `PEEngine.syncFirstCourse()` $\rightarrow$ 调用 `generateCondensedPE()` 提取阳性与关键体征，同步刷新首次病程记录中的体查段落。

3. **临床计算与报告打印链路**：
   - 各计算器表单触发（如 `calcCcr()`, `calcFIB4()`, `calcSOFA()` 等）。
   - 调用 `CalcCore` 纯函数计算内核（如 `CalcCore.fib4()`, `CalcCore.sofaScore()`），彻底隔离 DOM 与算法。
   - 调用 `showCalcResult()` 统一渲染计算得分、风险分层与解释说明。
   - 触发 `printAssessmentResult(type)`（Caprini / Padua / GCS） $\rightarrow$ 动态构建 A4 打印 DOM 容器 $\rightarrow$ `window.print()`。

4. **用药助手查询链路**：
   - `DrugAssistant.init()` $\rightarrow$ 读取 `DRUG_DATABASE.getAllDrugs()`。
   - 筛选或搜索 $\rightarrow$ `DrugAssistant.onSearch()` / `selectCategory()` $\rightarrow$ 调用 `DRUG_DATABASE.searchDrugs()` 进行多字段权重匹配（名称/拼音/商品名/适应证/标签）。
   - 选中药品 $\rightarrow$ `DrugAssistant.selectDrug(id)` $\rightarrow$ `renderDrugDetail(id)` 渲染用法用量、药理机制、PK 参数、禁忌症、配伍禁忌、特殊人群用药及肾功能剂量调整表。

---

## 5. 数据构建脚本与数据管道机制

为了保证上百种高精细度药品知识库的可维护性与模块化，系统设计了离线构建与合并管道：

### 5.1 数据构建脚本清单

| 文件名 | 职责与涵盖分类 | 状态 |
|---|---|---|
| `build_drugs.js` | 药品数据库构建主引擎，负责聚合分卷数据并生成单体运行库 `js/data/drugs.js` | 构建工具 |
| `data_builder_part1.js` | 抗感染/抗微生物药物（头孢菌素、呼吸喹诺酮、碳青霉烯、β-内酰胺酶抑制剂复方等） | 数据分卷 |
| `data_builder_part2.js` | 心血管系统药物（抗血小板、抗凝、降压、调脂、抗心绞痛等） | 数据分卷 |
| `data_builder_part3.js` | 呼吸系统与抗过敏药物（支气管扩张剂、吸入糖皮质激素、止咳化痰等） | 数据分卷 |
| `data_builder_part4.js` | 消化系统药物（抑酸剂 PPI、促胃动力、黏膜保护剂、保肝降酶等） | 数据分卷 |
| `data_builder_part5.js` | 内分泌与代谢药物（口服降糖药、胰岛素类似物、甲状腺调节剂、降尿酸药等） | 数据分卷 |
| `data_builder_part6.js` | 镇痛与抗炎药物（NSAIDs、阿片类镇痛药、麻醉辅助及解痉药） | 数据分卷 |
| `data_builder_part7.js` | 急救与重症药物（血管活性药、强心剂、抗休克、电解质纠正等） | 数据分卷 |
| `data_builder_part8.js` | 神经与精神系统药物（镇静催眠、抗癫痫、脱水降颅压、营养神经等） | 数据分卷 |
| `data_builder_part9.js` | 超短效与特色急救制剂（艾司洛尔、硝酸甘油微泵、重组人脑利钠肽等） | 数据分卷 |

### 5.2 构建流程与数据管道

```
[data_builder_part1 ~ 9.js] 
            │ (CommonJS 模块分卷)
            ▼
   [build_drugs.js] (合并、Schema 校验、拼音索引增强)
            │
            ▼
   [js/data/drugs.js] (前端 IIFE: window.DRUG_DATABASE)
```

---

## 6. MedicalDB 统一数据总线机制

数据总线位于 `js/data/db.js`，通过 IIFE 创建全局单例 `window.MedicalDB`。

### 6.1 内部数据结构

```javascript
window.MedicalDB = (function() {
    const departments = [];   // [{ id, name, icon }, ...]
    const diseases = {};      // { surgery: [...], internal: [...], obgyn: [...], pedia: [...] }
    const diseaseGroups = {}; // { surgery: [{ group, items: [...] }, ...], ... }
    const NORMAL_PE = '...';  // 标准正常体格检查模板（含 {hr}、{mentality} 占位符）
    ...
})();
```

### 6.2 核心 API 规范

| API | 入参 | 返回值 | 功能说明 |
|---|---|---|---|
| `registerDepartment(config, diseaseList, groups)` | `config` 对象, `diseaseList` 数组, `groups` 分组 | `void` | 注册科室元数据、疾病模板集与二级分类，支持防重覆盖 |
| `getDepartments()` | 无 | `Array<DeptConfig>` | 获取所有已成功注册的科室列表 |
| `getDiseasesByDept(deptId)` | `deptId: string` | `Array<DiseaseTemplate>` | 获取指定科室下的所有疾病模板 |
| `getDiseaseGroupsByDept(deptId)` | `deptId: string` | `Array<GroupConfig> \| null` | 获取指定科室的亚专科二级分组配置 |
| `getTemplate(deptId, index)` | `deptId: string, index: number` | `DiseaseTemplate \| null` | 根据科室及索引安全提取对应模板 |
| `getStatistics()` | 无 | `{ totalDiseases, totalCps }` | 统计全系统的疾病模板总数与临床路径总数 |
| `getNormalPE()` | 无 | `string` | 获取全系统统一的标准正常全身体查文本 |

---

## 7. 疾病模板与数据结构规范 (Schema)

每个疾病模板均为标准的纯 JavaScript 对象，必须严格满足以下结构规范：

```javascript
{
    name: "急性阑尾炎",            // 疾病全称（必须唯一）
    icd: "K35.800",                // 规范 ICD-10 疾病编码
    t: {                           // 模板内容容器 (Template Container)
        chiefComplaint: "转移性右下腹痛8小时",
        presentIllness: "患者于8小时前无明显诱因出现上腹部及脐周隐痛...", // 现病史 (200~300字完整病程)
        pastHistory: "平素身体健康，否认高血压、糖尿病、冠心病等慢性病史...",
        personalHistory: "生于原籍，无疫区居住史，无吸烟饮酒嗜好...",
        menstrualHistory: "无",     // 男性填"无"，女性填写初潮/周期/经期/LMP
        maritalHistory: "适龄结婚，配偶体健，育有1子1女",
        familyHistory: "父母健在，家族中无遗传性疾病及传染病史",
        t: "37.8℃",                // 生命体征：体温
        p: "84次/分",              // 生命体征：脉搏
        r: "20次/分",              // 生命体征：呼吸
        bp: "125/80mmHg",          // 生命体征：血压
        hr: "84",                  // 心率数值
        physicalExam: "发育正常，营养良好，神志清晰，查体合作...", // 全身体格检查
        specialistExam: "腹平坦，未见胃肠型及蠕动波。麦氏点 (McBurney点) 压痛明显，伴局部肌紧张及反跳痛...", // 专科体查阳性
        auxiliaryExam: "血常规：WBC 14.5×10^9/L, N% 86.2%。阑尾超声示：右下腹阑尾区见肿胀管状结构...", // 辅助检查 (对应 DOM #auxiliaryExam)
        admitDiagnosis: "1. 急性化脓性阑尾炎\n2. 局限性腹膜炎", // 入院初步诊断 (对应 DOM #admitDiagnosis)
        finalDiagnosis: "1. 急性化脓性阑尾炎伴局限性腹膜炎",   // 出院最后诊断 (对应 DOM #finalDiagnosis)
        
        // 首次病程记录 (对应 DOM #firstCourse)
        firstCourse: "病例特点：\n1. 青年男性，急性起病...\n拟诊讨论与依据：...\n鉴别诊断：1. 胃十二指肠溃疡穿孔 2. 妇科急腹症...\n诊疗计划：1. 外科急症护理常规 2. 完善术前准备行急诊腹腔镜阑尾切除术...",
        
        // 日常病程记录 (对应 DOM #dailyCourse)
        dailyCourse: "【术后第1天 - 主治医师查房记录】\n今日为阑尾切除术后第1天，患者诉切口轻微疼痛...",
        
        // 出院记录 (对应 DOM #dischargeRecord)
        dischargeRecord: "【入院情况】...\n【诊疗经过】行腹腔镜阑尾切除术，抗感染补液支持...\n【出院医嘱】1. 注意休息，切口按时换药 2. 术后2周门诊复查...",
        
        // 临床路径 (Clinical Pathway, 可选)
        cp: {
            applicableObject: "第一诊断为急性阑尾炎（ICD-10：K35）",
            diagnosticBasis: "1. 转移性右下腹痛\n2. 右下腹麦氏点固定压痛反跳痛\n3. WBC及中性粒细胞升高，超声或CT证实",
            treatmentOptions: "行急诊腹腔镜阑尾切除术（LA）或开腹阑尾切除术（OA）",
            standardLOS: "3~5 天",
            entryCriteria: "第一诊断符合 ICD-10 K35 急性阑尾炎",
            examRequired: "血常规、尿常规、凝血功能、肝肾功能、电解质、胸片、心电图、阑尾超声/CT",
            examOptional: "感染四项、术前交叉配血",
            medicationPlan: "围手术期预防性使用二代头孢菌素 + 甲硝唑",
            surgeryDay: "入院第1天急诊手术",
            postopRecovery: "术后第1天进流质、下床活动、拔除引流管（如有）",
            dischargeCriteria: "切口愈合良好无感染，体温正常，胃肠功能恢复，无并发症",
            variationAnalysis: "阑尾穿孔坏死导致化脓性腹膜炎延长住院时间",
            costEstimate: "6000-9000元",
            dailySchedule: [
                {
                    day: "第 1 天 (入院/手术日)",
                    medicalWork: "完成入院检查，完善术前准备，急诊行腹腔镜阑尾切除术，抗感染治疗。",
                    orders: "长期医嘱：外科护理常规、禁食水、静脉输液；临时医嘱：急诊血化验、急诊手术。",
                    nursing: "术前准备、监测生命体征、术后按全麻常规护理。",
                    variation: "□无 □有，原因："
                },
                {
                    day: "第 2 天 (术后第 1 天)",
                    medicalWork: "评估生命体征及腹部体征，鼓励下床活动，切口换药，逐步恢复流质饮食。",
                    orders: "长期医嘱：流质饮食、抗感染、止痛；临时医嘱：换药。",
                    nursing: "协助早期下床活动、指导流质饮食。",
                    variation: "□无 □有，原因："
                },
                {
                    day: "第 3~4 天 (出院日)",
                    medicalWork: "切口愈合良好，无发热腹痛，办理出院手续，指导随访。",
                    orders: "出院医嘱：半流质过渡至普食、切口定期换药、门诊随访。",
                    nursing: "出院宣教、指导术后康复注意事宜。",
                    variation: "□无 □有，原因："
                }
            ]
        },

        // 体格检查推导配置 (PE Engine Config, 可选)
        peConfig: {
            diseaseName: "急性阑尾炎",
            positiveSigns: [
                { id: "sign_1", label: "麦氏点压痛明显", default: true, text: "麦氏点压痛明显" },
                { id: "sign_2", label: "伴局部肌紧张及反跳痛", default: true, text: "伴局部肌紧张及反跳痛" }
            ],
            negativeSigns: [
                { id: "neg_1", label: "腹平坦", default: true, text: "腹平坦" },
                { id: "neg_2", label: "未见胃肠型及蠕动波", default: true, text: "未见胃肠型及蠕动波" }
            ]
        }
    }
}
```

---

## 8. PEEngine 体格检查智能推导引擎

位于 `js/modules/pe_engine.js`，核心职责为消除传统病历录入中“详见专科检查”的断层问题，实现全身体查与专科体查的自动缝合。

```
[输入: 生命体征 + 专科检查文本]
                 │
                 ▼
     [classifyDiseaseSystem()] ── (匹配 11 大解剖系统)
                 │
                 ▼
          [deconflictPE()] ────── (替换 NORMAL_PE 中对应段落)
                 │
                 ▼
       [generateCondensedPE()] ── (提炼阳性体征注入首次病程)
```

### 8.1 覆盖的 11 大解剖体系统

1. `thyroid`（甲状腺）：替换颈部触诊、甲状腺震颤与血管杂音段落。
2. `breast`（乳腺）：替换胸部视诊及双侧乳房触诊段落。
3. `neurological`（神经系统）：替换意识、脑膜刺激征、四肢肌力/肌张力及病理反射段落。
4. `skin`（皮肤/体表）：替换皮肤黏膜、局部包块触诊段落。
5. `orthopedic`（骨科/运动）：替换四肢脊柱活动度、各关节压痛及特殊试验段落。
6. `cardiac`（心血管）：替换心界、心率、心律及心脏杂音听诊段落。
7. `respiratory`（呼吸系统）：替换胸廓呼吸动度、语颤、叩诊音及肺部干湿啰音段落。
8. `abdominal`（腹部/消化）：替换腹部视触叩听、压痛反跳痛及腹膜刺激征段落。
9. `urinary`（泌尿/男性生殖）：替换双肾区叩击痛、输尿管压痛点及外生殖器段落。
10. `gynecological`（妇科）：替换妇科双合诊、三合诊及附件区段落。
11. `pediatric`（儿科）：结合小儿生长发育与专科查体特征。

---

## 9. Calculators & CalcCore 临床计算引擎

### 9.1 双层计算架构

- **`calc_core.js`（纯逻辑层）**：零 DOM 依赖的纯数学与医学公式库，易于独立单元测试与移植。
- **`calculators.js`（交互与渲染层）**：负责读取 DOM、调用 `CalcCore`、输入有效性校验（`validNum`）、渲染卡片结果及生成 A4 打印报告。

### 9.2 包含的 28 种临床计算器列表

| 序号 | 计算器名称 | 所属专科分类 | 核心依据 / 标准出处 |
|---|---|---|---|
| 1 | 肌酐清除率 (Ccr) 与 eGFR (CKD-EPI) | 肾内/综合 | 人卫第10版《内科学》P522 / 2021 CKD-EPI |
| 2 | 体表面积 (BSA) (许文生/DuBois公式) | 综合/儿科 | 人卫第10版《儿科学》P45 / 《外科学》P129 |
| 3 | 校正血钙 (Corrected Calcium) | 内分泌/重症 | 人卫第10版《内科学》水电解质酸碱失衡章节 |
| 4 | 阴离子间隙 (AG) | 重症/肾内 | 人卫第10版《内科学》P779 酸碱平衡紊乱 |
| 5 | 维持性输液与全天液体需求量 | 普外/重症 | Holliday-Segar 经典法则 / 外科液体疗法 |
| 6 | 烧伤 Parkland 补液公式 | 烧伤/急救 | 人卫第10版《外科学》P131 烧伤休克补液 |
| 7 | Child-Pugh 肝功能分级评分 | 肝胆/消化 | 人卫第10版《内科学》P432 肝硬化分级 |
| 8 | MELD 终末期肝病模型评分 | 肝胆/移植 | 肝移植供体分配标准 / UNOS |
| 9 | Glasgow-Blatchford 上消化道出血评分 | 消化/急诊 | Blatchford 2000 / 急性上消化道出血指南 |
| 10 | CURB-65 社区获得性肺炎重症评分 | 呼吸/急诊 | 人卫第10版《内科学》P48 / 中国CAP指南 |
| 11 | Wells 下肢深静脉血栓 (DVT) 评分 | 血管外科/急诊 | 人卫第10版《外科学》P542 |
| 12 | Wells 肺栓塞 (PE) 临床概率评分 | 呼吸/急诊 | ESC 肺栓塞诊疗指南 2019 |
| 13 | Caprini 外科手术 VTE 风险评分 | 外科/重症 | Caprini 2013 / 附完整 A4 打印报告 |
| 14 | Padua 内科住院患者 VTE 风险评分 | 内科/重症 | Padua 2010 / 附完整 A4 打印报告 |
| 15 | NIHSS 美国国立卫生研究院卒中量表 | 神经内科 | 中国急性缺血性脑卒中诊治指南 |
| 16 | CHA₂DS₂-VASc 房颤抗凝血栓风险评分 | 心血管 | ESC 房颤管理指南 2020 |
| 17 | qSOFA 快速脓毒症器官衰竭评估 | 急重症/感染 | SSC 国际脓毒症指南 2021 |
| 18 | MEWS 改良早期预警评分 | 急重症/病房 | 急危重症早期识别预警体系 |
| 19 | GCS 格拉斯哥昏迷评分 | 神经/创伤 | Teasdale 1974 / 附完整 A4 打印报告 |
| 20 | SOFA 序贯器官衰竭评估 | 重症医学 (ICU) | Sepsis-3 脓毒症定义标准 |
| 21 | APACHE II 急性生理与慢性健康评估 | 重症医学 (ICU) | Knaus 1985 / ICU 重症评估标准 |
| 22 | APRI 肝纤维化天冬氨酸氨基转移酶比值 | 感染/肝胆 | WHO 慢性乙型/丙型肝炎指南 |
| 23 | FIB-4 基于4因子的肝纤维化指数 | 感染/肝胆 | Sterling 2006 / 非酒精性脂肪肝指南 |
| 24 | GRACE 1.0 急性冠脉综合征危险评分 | 心血管 | Fox 2006 / ESC NSTE-ACS 指南 |
| 25 | HAS-BLED 房颤抗凝出血风险评分 | 心血管 | ESC 房颤抗凝管理规范 |
| 26 | 动脉血氧合指数 (PaO₂/FiO₂) | 呼吸/重症 | ARDS 柏林定义 (Berlin Definition) |
| 27 | 校正 QTc 间期 (Bazett / Fridericia) | 心血管 | AHA/ACC 心电图测量标准指南 |
| 28 | 平均动脉压 (MAP) 与脉压差 | 心血管/急救 | 重症血流动力学监测常规 |

---

## 10. DrugAssistant 临床用药知识助手

位于 `js/modules/drug_assistant.js` 与 `js/data/drugs.js`，为临床医师提供实时用药参考：

### 10.1 药品分类索引 (9 大分类)

1. `anti_infective`：抗感染/抗微生物药物（青霉素类、头孢菌素、碳青霉烯、大环内酯、喹诺酮、抗真菌药等）
2. `cardiovascular`：心血管系统药物（抗血小板、抗凝、降压、调脂、抗心律失常、正性肌力药）
3. `respiratory`：呼吸系统药物（支气管舒张剂、吸入糖皮质激素、祛痰止咳药）
4. `digestive`：消化系统药物（质子泵抑制剂、黏膜保护剂、保肝降酶、解痉止痛）
5. `endocrine`：内分泌与代谢（降糖药、胰岛素、降尿酸药、甲状腺素调节剂）
6. `analgesic`：镇痛与抗炎（非甾体抗炎药 NSAIDs、中枢镇痛、阿片受体激动剂）
7. `emergency`：急救与重症药物（肾上腺素能受体激动剂、抗休克、纠酸补液、高渗脱水剂）
8. `neuro`：神经与精神系统（抗癫痫、镇静催眠、脑血管扩张剂、神经营养药）
9. `all`：全库统一多维检索

### 10.2 药品卡片包含的数据维度

每个药品包含通用名、商品名、规格、常规用法用量、药理作用机制、药代动力学 (PK)、适应证、禁忌证、药物相互作用 (DDIs)、用药注意事项、妊娠与哺乳期安全性分级、根据 eGFR 的肾功能剂量调整表及临床高频标签。

---

## 11. AI Chat 智能临床提示词引擎

位于 `js/modules/ai_chat.js`，通过结构化抽取当前编辑器内的病历要素，生成专为医学大语言模型优化的结构化 Prompt：

### 11.1 支持的 6 大提示词生成场景

1. **模板质控与规范化重写**：自动扫描病历缺陷，按三级甲等医院文书规范进行质控优化。
2. **首次病程生成提示词**：提炼主诉、现病史与体查，指导大模型生成病历特点与诊疗计划。
3. **鉴别诊断推导提示词**：针对初步诊断，列出排名前 3 的鉴别疾病及排查检查项目。
4. **出院记录与带药指导**：提炼住院诊疗经过，生成患者出院医嘱与康复指导。
5. **临床路径制定提示词**：根据疾病特点自动排布分日临床路径与关键医嘱。
6. **病历纯文本导出**：一键抽取纯文本，消除格式冗余，方便快速复制。

### 11.2 直连的 4 大 AI 平台

- **DeepSeek**（擅长复杂医学逻辑与鉴别诊断推理）
- **Kimi / 月之暗面**（支持超长上下文，适合整套长病历质控）
- **智谱清言**（清华 GLM 底座，中文医学理解优秀）
- **通义千问**（阿里通义大模型，综合知识面广阔）

---

## 12. CSS 样式系统与主题机制

位于 `css/style.css`，采用纯 CSS Custom Properties（变量）构建，无任何外部 UI 框架依赖。

### 12.1 六套专业医疗主题

| 主题 ID | 主题名称 | 核心主色 (`--c-primary`) | 适用场景 |
|---|---|---|---|
| `clinical-teal` | 极简冷灰（默认） | `#0f766e` (Teal) | 高清晰度、专业沉稳、防视觉疲劳 |
| `hospital-blue` | 华医深蓝 | `#1e40af` (Navy) | 经典三甲医院与综合医疗风格 |
| `dark-mode` | 暗夜黑金 | `#10b981` (Emerald) | 夜间值班与暗光环境护眼 |
| `sage-green` | 青竹淡绿 | `#15803d` (Green) | 柔和护眼、舒缓视觉 |
| `dream-purple` | 梦幻紫 | `#7c3aed` (Purple) | 妇幼专科与现代化专科界面 |
| `warm-orange` | 暖阳橙 | `#c2410c` (Orange) | 急诊与活力暖色调 |

### 12.2 响应式断点与移动端适配

- **Desktop ( $\ge 1024\text{px}$ )**：左右分栏工作台，左侧固定疾病列表，右侧宽屏多列排版。
- **Tablet ( $768\text{px} \sim 1023\text{px}$ )**：工具栏自动折叠，计算器表单流式两列排版。
- **Mobile ( $< 768\text{px}$ )**：
  - 侧边栏转为抽屉式弹出层 (`.drawer-overlay` + `.left-sidebar.drawer-open`)。
  - Tab 导航栏支持横向原生手势滚动。
  - 患者信息表格由 Table 转为 Flex 卡片流式布局。
  - 临床计算器与用药助手卡片 100% 宽度自适应。

---

## 13. 扩展开发指南与协作规范

### 13.1 如何新增一个疾病模板？

1. 打开对应科室文件（如 `js/data/surgery.js`）。
2. 在数组末尾添加符合 [Schema 规范](#7-疾病模板与数据结构规范-schema) 的新对象。
3. 打开 `js/data/departments.js`，在 `DISEASE_GROUPS` 对应的二级分类中填入该疾病名称。
4. 刷新浏览器即可，`MedicalDB` 会自动感知并统计更新。

### 13.2 如何新增一个临床计算器？

1. 在 `js/modules/calc_core.js` 中添加计算纯函数（输入数值 $\rightarrow$ 返回计算结果）。
2. 在 `index.html` 的 `#panel-calculator` 中添加 HTML 卡片结构。
3. 在 `js/modules/calculators.js` 中编写 UI 联动函数（获取输入、调用 `CalcCore`、校验并展示）。

### 13.3 协作铁律 (AGENTS.md)

1. **主对话定位**：仅用于方案讨论、任务调度与架构设计，禁止跳过规范直接编写脏代码。
2. **执行与验收隔离**：功能开发由执行 Agent 编写，交付前必须经过独立的验收审查 Agent 逐项验证。
3. **保持纯前端解耦**：严禁引入破坏离线特性的外部网络强依赖；严禁将业务数据硬编码在 `index.html`。

---

## 14. 部署与运维 (GitHub Pages)

本项目采用 GitHub Actions 实现自动化极速构建与零停机部署：

- **配置文件**：`.github/workflows/deploy-pages.yml`
- **触发分支**：`main` 分支 push 或 PR 合并
- **部署产物**：静态托管在 GitHub Pages，开箱即用，访问即享极速加载。

---
*外科宝宝病历巴士研发与临床维护团队 · 保留所有权利*
