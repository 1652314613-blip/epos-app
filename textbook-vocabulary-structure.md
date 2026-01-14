# 人教版初高中英语教材词汇数据结构

## 教材体系

### 初中（Grade 7-9）
- 七年级上册（Grade 7A）：12个单元
- 七年级下册（Grade 7B）：12个单元
- 八年级上册（Grade 8A）：10个单元
- 八年级下册（Grade 8B）：10个单元
- 九年级全一册（Grade 9）：14个单元

### 高中（Grade 10-12）
- 必修第一册（Required Book 1）：5个单元
- 必修第二册（Required Book 2）：5个单元
- 必修第三册（Required Book 3）：5个单元
- 选择性必修第一册（Elective Book 1）：5个单元
- 选择性必修第二册（Elective Book 2）：5个单元
- 选择性必修第三册（Elective Book 3）：5个单元
- 选择性必修第四册（Elective Book 4）：5个单元

## 数据结构设计

```typescript
interface TextbookWord {
  id: string;
  word: string;
  phonetic: string;
  grade: number; // 7-12
  book: string; // "7A", "7B", "8A", "8B", "9", "R1", "R2", "R3", "E1", "E2", "E3", "E4"
  unit: number; // 单元号
  definitions: Definition[];
  examples: string[];
  difficulty: "basic" | "intermediate" | "advanced";
  frequency: "high" | "medium" | "low"; // 词频
}

interface TextbookUnit {
  grade: number;
  book: string;
  unit: number;
  title: string; // 单元主题
  wordCount: number;
  words: TextbookWord[];
}

interface TextbookBook {
  grade: number;
  book: string;
  title: string;
  units: TextbookUnit[];
}
```

## 示例数据（七年级上册 Unit 1）

### Unit 1: My name's Gina

**主题**：认识新朋友，介绍自己

**核心词汇**：
1. name /neɪm/ n. 名字
   - 例句：My name is Tom. 我的名字是汤姆。
   
2. nice /naɪs/ adj. 令人愉快的；宜人的
   - 例句：Nice to meet you! 很高兴见到你！
   
3. meet /miːt/ v. 遇见；相逢
   - 例句：I meet my friend at school. 我在学校遇见我的朋友。
   
4. hello /həˈləʊ/ interj. 你好；喂
   - 例句：Hello! How are you? 你好！你好吗？
   
5. first /fɜːst/ adj. 第一的
   - 例句：My first name is John. 我的名字是约翰。

## 实现策略

由于完整的教材词汇数据量庞大（约3000-5000个单词），我们将：

1. **创建核心词汇库**：先实现每个年级每册的代表性单元（如每册前2个单元）
2. **使用AI动态生成**：当学生选择某个单元时，通过AI API动态生成该单元的完整词汇表
3. **本地缓存机制**：生成后的词汇表缓存到本地，避免重复请求
4. **渐进式加载**：优先加载学生当前年级的词汇，其他年级按需加载

## 数据来源

- 人教版官方教材大纲
- 教育部英语课程标准词汇表
- AI辅助生成和验证
