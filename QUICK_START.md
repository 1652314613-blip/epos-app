# 🚀 英语语法学习助手 - 快速开始指南

## 📦 解压项目

```bash
tar -xzf english_grammar_tutor_v2_780words.tar.gz
cd english_grammar_tutor
```

## 🔧 环境要求

- **Node.js**: 22.13.0 (推荐使用nvm安装)
- **包管理器**: pnpm (必需)
- **操作系统**: macOS, Linux, 或 Windows (WSL2)

## 📱 安装步骤

### 1. 安装依赖

```bash
pnpm install
```

*首次安装可能需要5-10分钟,请耐心等待*

### 2. 启动后端服务器

```bash
pnpm dev:server
```

后端将在 `http://localhost:3000` 运行

### 3. 启动Expo应用 (新终端窗口)

```bash
pnpm expo start --tunnel
```

### 4. 在手机上测试

1. 在手机上安装 **Expo Go** 应用
   - iOS: App Store搜索 "Expo Go"
   - Android: Google Play搜索 "Expo Go"

2. 扫描终端显示的二维码

3. 应用将自动加载到手机上

## 🎯 功能测试清单

### ✅ 词汇学习
- 打开"词汇卡片"功能
- 选择年级和单元
- 测试滑动学习功能

### ✅ AI语法检查
- 打开"语法检查"功能
- 输入英文句子
- 点击"检查语法"查看AI分析

### ✅ 词汇测验
- 打开"词汇测验"功能
- 选择测验范围
- 完成测验并查看成绩

### ✅ 语法课程
- 浏览25个语法知识点
- 查看详细讲解和例句

### ✅ 阅读理解
- 阅读10篇英文文章
- 完成理解题目

## 📊 数据验证

### 检查词汇数据

```bash
# 查看词汇统计
cat vocabulary_import_report.txt

# 查看项目统计
cat PROJECT_STATS.md
```

### 当前数据量
- **总词汇**: 780个单词
- **八年级上册**: 308个单词
- **八年级下册**: 472个单词

## 🔍 常见问题

### Q1: pnpm命令不存在
```bash
npm install -g pnpm
```

### Q2: 端口3000被占用
```bash
# 查找占用进程
lsof -i :3000
# 或修改 server/index.ts 中的端口号
```

### Q3: Expo tunnel无法连接
- 检查网络连接
- 尝试使用局域网模式: `pnpm expo start --lan`
- 或使用本地模式: `pnpm expo start`

### Q4: 词汇数据未显示
```bash
# 重新导入词汇数据
pnpm tsx scripts/import-vocabulary.ts grade8_upper_vocabulary.csv
pnpm tsx scripts/import-vocabulary.ts grade8_lower_vocabulary.csv
```

## 📁 重要文件说明

| 文件 | 说明 |
|------|------|
| `FINAL_HANDOVER_GUIDE.md` | 完整交接指南 |
| `VERSION_UPDATE_LOG.md` | 版本更新日志 |
| `PROJECT_STATS.md` | 项目统计信息 |
| `grade8_upper_vocabulary.csv` | 八上词汇数据 |
| `grade8_lower_vocabulary.csv` | 八下词汇数据 |
| `lib/vocabulary-data.ts` | 编译后的词汇库 |
| `.env` | 环境配置文件 |

## 🎨 UI特色

- **Manus风格设计**: 渐变背景、流畅动画
- **响应式布局**: 适配各种屏幕尺寸
- **深色模式**: 护眼的暗色主题
- **手势交互**: 滑动、点击等自然交互

## 🔐 API配置

DeepSeek API密钥已预配置在 `server/index.ts`:
```typescript
const apiKey = 'sk-0a4318d5fcbf4aa8973fa16b22c80953';
```

如需更换,请修改该文件中的密钥。

## 📞 获取帮助

1. 查看 `FINAL_HANDOVER_GUIDE.md` 获取详细文档
2. 检查 `VERSION_UPDATE_LOG.md` 了解最新变更
3. 查看终端错误信息进行调试

## ⚡ 快速命令参考

```bash
# 安装依赖
pnpm install

# 启动后端
pnpm dev:server

# 启动Expo (tunnel模式)
pnpm expo start --tunnel

# 启动Expo (局域网模式)
pnpm expo start --lan

# 重新导入词汇
pnpm tsx scripts/import-vocabulary.ts [csv文件]

# 清理缓存
cd english_grammar_tutor
rm -rf .expo .cache
```

---

**版本**: 2.0  
**总词汇量**: 780个单词  
**最后更新**: 2026年1月11日  

🎉 祝学习愉快!
