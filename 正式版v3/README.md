# 外科宝宝病历巴士

病历书写辅助工具，支持多科室模板（外科 / 内科 / 妇产科 / 儿科），可生成入院记录、首次病程、日常病程、出院记录，并内置临床路径、临床计算器、AI 智能分析等功能。

## 功能特点

- 多科室疾病模板与搜索（疾病名称 / 拼音首字母 / ICD 编码）
- 临床计算器（APRI、FIB-4、BMI、QTc、SOFA、GRACE、Blatchford、NIHSS、孕周等）
- 一键自动填充正常体检与生命体征
- 白昼 / 宝宝粉 / 护眼绿 / 护眼夜间四种主题
- 草稿自动保存到本地（localStorage），无需服务器
- 纯前端静态站，可直接部署到 GitHub Pages

## 目录结构

```
├── index.html            # 入口页面
├── css/
│   └── style.css         # 全局样式
├── js/
│   ├── app.js            # 页面逻辑
│   ├── modules/          # 计算器、AI 聊天、体检引擎等运行模块
│   └── data/             # 部署所需的科室与疾病数据
├── scripts/              # 开发维护脚本（一次性工具，不参与部署）
├── tests/                # 单元测试
└── package.json          # 测试命令
```

## 本地运行

直接用浏览器打开 `index.html` 即可；也可以启动一个静态服务器：

```bash
python -m http.server 8000
```

然后访问 http://localhost:8000

## 运行测试

```bash
node tests/calculators.test.js
```

或：

```bash
npm test
```

## 部署到 GitHub Pages

1. 在 GitHub 上新建一个仓库（免费版 Pages 要求仓库为公开）。
2. 配置提交署名并创建初始提交（仓库内文件已经暂存，只需提交）：

   ```bash
   git config user.name "你的 GitHub 用户名"
   git config user.email "你的 GitHub 邮箱"
   git commit -m "初始提交"
   ```

3. 关联远程仓库并推送：

   ```bash
   git remote add origin https://github.com/<用户名>/<仓库名>.git
   git branch -M main
   git push -u origin main
   ```

4. 打开仓库 Settings → Pages，在 “Build and deployment” 中选择 **Deploy from a branch**，分支选 `main`，目录选 `/ (root)`，保存。
5. 稍等片刻即可访问：
   - 仓库名为 `<用户名>.github.io` 时：`https://<用户名>.github.io/`
   - 其他仓库名时：`https://<用户名>.github.io/<仓库名>/`

页面内所有资源均使用相对路径，部署在子路径下也能正常加载。

## 说明

`scripts/` 目录下是开发过程中使用过的一次性维护脚本（数据提取、批量修改、调试输出等），不参与部署，如需使用请按需调整脚本内的文件路径。
