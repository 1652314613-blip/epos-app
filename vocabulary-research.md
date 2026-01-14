# 背单词功能研究文档

## 主流背单词App功能对比

### 核心功能总结

**1. 学习模式**
- **墨墨背单词**：基于艾宾浩斯遗忘曲线的间隔重复算法，点击2次完成单词学习，效率最高
- **扇贝单词**：需要用户主动判断"认识/不认识"，熟悉词2次，陌生词3次
- **百词斩**：图像记忆法，通过选择题判断是否记住，游戏化学习（单词PK等）

**2. 记忆方法**
- 图像联想（百词斩特色）
- 词根词缀分析
- 例句记忆
- 视频讲解
- 发音跟读

**3. 复习系统**
- 间隔重复算法（Spaced Repetition System, SRS）
- 艾宾浩斯遗忘曲线
- 单词熟悉度分级：新词、学习中、熟悉、已掌握
- 自动安排复习时间

**4. 辅助功能**
- 词汇量测试
- 每日学习目标设置
- 学习打卡和连续天数
- 学习统计和进度可视化
- 随身听功能（音频播放）
- 词书选择（考试词汇、主题词汇）

**5. 互动功能**
- 单词PK对战
- 学习小组/打卡社区
- 学习排行榜

## 推荐实现的核心功能

### 第一优先级（MVP）
1. **查词功能**：输入单词查询释义、发音、例句
2. **单词本管理**：添加/删除单词，分类管理
3. **学习模式**：卡片式单词复习
4. **间隔重复算法**：基于遗忘曲线自动安排复习
5. **单词熟悉度**：新词→学习中→熟悉→已掌握

### 第二优先级（增强）
1. **每日学习目标**：设置每天学习单词数量
2. **学习统计**：今日学习、累计掌握、学习曲线
3. **发音功能**：TTS语音播放
4. **例句展示**：真实语境中的例句
5. **与语法检查集成**：自动收集检查中的生词

### 第三优先级（可选）
1. **词根词缀分析**
2. **图像记忆**
3. **听写练习**
4. **单词测试**

## 数据结构设计

### Word（单词）
```typescript
interface Word {
  id: string;
  word: string;
  phonetic: string;
  definitions: Definition[];
  examples: string[];
  addedAt: number;
  lastReviewedAt: number;
  nextReviewAt: number;
  reviewCount: number;
  masteryLevel: 'new' | 'learning' | 'familiar' | 'mastered';
  easeFactor: number; // 用于SRS算法
  interval: number; // 复习间隔（天）
}

interface Definition {
  partOfSpeech: string; // 词性
  meaning: string; // 释义
  exampleSentence?: string;
}
```

### 间隔重复算法（SuperMemo SM-2）
- 初始间隔：1天、3天、7天...
- 根据用户反馈调整：认识→增加间隔，不认识→重置间隔
- easeFactor：难度系数，影响下次复习时间
