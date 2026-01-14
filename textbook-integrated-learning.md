# 教材同步学习体系架构设计

## 设计理念

将词汇学习和语法学习整合到人教版教材的单元体系中，让学生按照教材章节同步学习，实现：
- **教材同步**：与学校教学进度保持一致
- **知识关联**：词汇和语法在同一单元中相互关联
- **系统学习**：按单元循序渐进，避免碎片化

## 架构设计

### 1. 教材单元结构

```
教材 (Textbook Book)
├── 年级信息 (Grade, Book Code, Title)
├── 单元列表 (Units)
    ├── 单元 (Unit)
        ├── 单元信息 (Unit Number, Title, Theme)
        ├── 词汇部分 (Vocabulary Section)
        │   ├── 核心词汇列表
        │   ├── 词汇学习模式
        │   └── 词汇练习
        ├── 语法部分 (Grammar Section)
        │   ├── 语法知识点列表
        │   ├── 语法规则讲解
        │   ├── 例句分析
        │   └── 语法练习
        └── 综合练习 (Integrated Practice)
            ├── 句子改错
            ├── 完形填空
            └── 写作练习
```

### 2. 单元语法知识点映射

#### 七年级上册示例

**Unit 1: My name's Gina**
- 主题：认识新朋友
- 词汇：name, nice, meet, hello, first, last, friend...
- 语法点：
  1. be动词的用法（am, is, are）
  2. 人称代词（I, you, he, she, it）
  3. 形容词性物主代词（my, your, his, her）
  4. What's your name? 句型

**Unit 2: This is my sister**
- 主题：家庭成员
- 词汇：family, mother, father, sister, brother, parent...
- 语法点：
  1. 指示代词（this, that, these, those）
  2. 名词复数形式
  3. Who's...? 句型
  4. 介绍他人的句型

**Unit 3: Is this your pencil?**
- 主题：学习用品
- 词汇：pencil, book, eraser, ruler, dictionary...
- 语法点：
  1. 一般疑问句及回答
  2. 名词所有格（'s）
  3. Excuse me 礼貌用语
  4. 物主代词（mine, yours, his, hers）

### 3. 界面设计

#### 主界面：教材选择
- 年级选择器（7-12年级）
- 教材列表（上册/下册/必修/选修）
- 显示每本教材的学习进度

#### 单元列表界面
- 显示所有单元
- 每个单元显示：
  - 单元号和主题
  - 词汇学习进度（已学/总数）
  - 语法掌握情况
  - 练习完成度

#### 单元学习界面
- 顶部：单元信息和进度
- 词汇部分：
  - 查看词汇表
  - 开始词汇学习
  - 词汇练习
- 语法部分：
  - 语法知识点列表
  - 查看语法讲解
  - 语法练习
- 综合练习：
  - 句子改错
  - 应用练习

### 4. 学习流程

```
1. 选择年级和教材
   ↓
2. 选择单元
   ↓
3. 学习词汇
   - 浏览词汇表
   - 添加到单词本
   - 开始记忆
   ↓
4. 学习语法
   - 查看语法讲解
   - 理解规则和例句
   - 完成语法练习
   ↓
5. 综合练习
   - 句子改错（应用语法）
   - 使用新词汇和语法写句子
   ↓
6. 完成单元，进入下一单元
```

### 5. 数据结构

```typescript
interface TextbookUnit {
  grade: number;
  book: string;
  unit: number;
  title: string;
  theme: string;
  
  // 词汇部分
  vocabulary: {
    words: TextbookWord[];
    wordCount: number;
  };
  
  // 语法部分
  grammar: {
    points: GrammarPoint[];
    pointCount: number;
  };
  
  // 学习进度
  progress: {
    vocabularyLearned: number;
    vocabularyMastered: number;
    grammarCompleted: number;
    practiceCompleted: number;
  };
}

interface GrammarPoint {
  id: string;
  title: string;
  category: string; // 时态、语态、句型等
  explanation: string;
  rules: string[];
  examples: Array<{
    english: string;
    chinese: string;
    analysis?: string;
  }>;
  commonMistakes: string[];
  exercises: Exercise[];
}
```

### 6. 实现策略

1. **重构现有功能**：
   - 将"教材词汇"标签页改为"教材学习"
   - 整合词汇和语法到单元视图
   - 保留独立的"单词本"和"错题本"功能

2. **AI生成语法内容**：
   - 根据单元主题和词汇，AI生成对应的语法讲解
   - 生成语法练习题
   - 缓存到本地

3. **进度追踪**：
   - 统一追踪单元的词汇和语法学习进度
   - 在单元列表显示完成度

4. **学习路径**：
   - 建议学习顺序：先词汇后语法
   - 但允许学生自由选择学习内容

## 优势

1. **与教材同步**：学生可以跟随学校进度学习
2. **知识关联**：词汇和语法在同一单元中，相互强化
3. **系统完整**：覆盖初高中全部教材内容
4. **灵活学习**：可以按单元学习，也可以单独练习词汇或语法
