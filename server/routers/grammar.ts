/**
 * Grammar checking tRPC router
 * Uses OpenAI to analyze English grammar and provide corrections
 * 
 * 优化特性:
 * - 自动重试机制(最多3次)
 * - 降级方案(API失败时返回基础检查)
 * - 完善的错误处理
 * - 超时保护
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { getTopicsByGrade, type GrammarCategory } from "../../lib/grammar-data";

interface GrammarError {
  type: string;
  category: GrammarCategory;
  position: {
    start: number;
    end: number;
  };
  incorrect: string;
  correct: string;
  explanation: string;
  pepReference?: string;
  severity: "critical" | "important" | "minor";
}

interface GrammarCheckResult {
  original: string;
  corrected: string;
  errors: GrammarError[];
  overallScore: number;
  suggestions: string[];
}

/**
 * 重试函数 - 带指数退避
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.log(`[Retry] Attempt ${attempt + 1}/${maxRetries} failed:`, error);
      
      // 最后一次尝试失败后不再等待
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt); // 指数退避: 1s, 2s, 4s
        console.log(`[Retry] Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error("Retry failed");
}

/**
 * 降级方案 - 基础语法检查
 */
function fallbackGrammarCheck(sentence: string): GrammarCheckResult {
  console.log("[Fallback] Using basic grammar check");
  
  const errors: GrammarError[] = [];
  
  // 基础检查1: 句子是否以大写字母开头
  if (sentence.length > 0 && sentence[0] !== sentence[0].toUpperCase()) {
    errors.push({
      type: "capitalization_error",
      category: "其他" as GrammarCategory,
      position: { start: 0, end: 1 },
      incorrect: sentence[0],
      correct: sentence[0].toUpperCase(),
      explanation: "英文句子的第一个字母要大写哦！",
      severity: "minor",
    });
  }
  
  // 基础检查2: 句子是否以标点结尾
  const lastChar = sentence[sentence.length - 1];
  if (!['.', '!', '?'].includes(lastChar)) {
    errors.push({
      type: "punctuation_error",
      category: "其他" as GrammarCategory,
      position: { start: sentence.length, end: sentence.length },
      incorrect: "",
      correct: ".",
      explanation: "句子末尾需要加上标点符号（如句号、问号或感叹号）哦！",
      severity: "minor",
    });
  }
  
  // 基础检查3: 常见拼写错误
  const commonMistakes: { [key: string]: string } = {
    "dont": "don't",
    "cant": "can't",
    "wont": "won't",
    "im": "I'm",
    "youre": "you're",
    "theyre": "they're",
  };
  
  const words = sentence.toLowerCase().split(/\s+/);
  words.forEach((word, index) => {
    const cleanWord = word.replace(/[.,!?;:]$/g, '');
    if (commonMistakes[cleanWord]) {
      const start = sentence.toLowerCase().indexOf(cleanWord);
      if (start !== -1) {
        errors.push({
          type: "spelling_error",
          category: "其他" as GrammarCategory,
          position: { start, end: start + cleanWord.length },
          incorrect: cleanWord,
          correct: commonMistakes[cleanWord],
          explanation: `这里应该是 "${commonMistakes[cleanWord]}"，记得加上撇号哦！`,
          severity: "important",
        });
      }
    }
  });
  
  const score = Math.max(60, 100 - errors.length * 10);
  
  return {
    original: sentence,
    corrected: sentence,
    errors,
    overallScore: score,
    suggestions: [
      "由于网络原因，我们暂时只能提供基础检查。",
      "建议稍后重试以获得更详细的AI分析。",
      "你可以继续练习，我们会尽快恢复完整功能！"
    ],
  };
}

export const grammarRouter = router({
  /**
   * Check grammar of a sentence using OpenAI
   * 带重试和降级方案
   */
  check: publicProcedure
    .input(
      z.object({
        sentence: z.string().min(1).max(1000),
        gradeLevel: z.number().min(7).max(12).default(9),
      })
    )
    .mutation(async ({ input, ctx }): Promise<GrammarCheckResult> => {
      const { sentence, gradeLevel } = input;

      // 输入验证
      if (!sentence || sentence.trim().length === 0) {
        return {
          original: sentence,
          corrected: sentence,
          errors: [],
          overallScore: 0,
          suggestions: ["请输入一个句子哦！"],
        };
      }

      // 步骤1：从用户问题中提取英文短语
      console.log("[Grammar Check] Original input:", sentence);
      const englishPhraseMatch = sentence.match(/'([^']+)'|"([^"]+)"|\b([a-zA-Z\s]+)\b(?=\s*真的|\s*会|\s*是|\s*怎么|\s*什么)/i);
      const englishPhrase = englishPhraseMatch ? (englishPhraseMatch[1] || englishPhraseMatch[2] || englishPhraseMatch[3] || sentence) : sentence;
      
      // 清理提取的短语
      const cleanedPhrase = englishPhrase.trim();
      console.log("[Grammar Check] Extracted English phrase:", cleanedPhrase);

      // Get relevant grammar topics for the grade level
      const relevantTopics = getTopicsByGrade(gradeLevel as 7 | 8 | 9 | 10 | 11 | 12);
      const topicSummary = relevantTopics
        .map((t) => `${t.title} (${t.category})`)
        .slice(0, 10)
        .join(", ");

      // Call LLM to analyze grammar
      const systemPrompt = `你是一位温柔、有耐心的英语语法老师，专门帮助中国${gradeLevel}年级的学生学习英语语法。
你的任务是分析学生写的英文句子，找出语法错误，并用简单、友好的中文解释。

${gradeLevel}年级的重点语法：${topicSummary}

分析句子时请注意：
1. 找出所有语法错误（动词时态、主谓一致、冠词、介词、情态动词、被动语态、语序、拼写、标点）
2. 对每个错误，请提供：
   - 错误类型（如 "verb_tense", "article_error", "subject_verb_agreement"）
   - 错误分类（如 "时态", "冠词", "主谓一致"）
   - 错误在句子中的位置（起始和结束字符索引）
   - 错误的部分
   - 正确的写法
   - 用简单、友好的中文解释为什么错了，怎么改正（就像在和学生面对面聊天一样）
   - 如果适用，标注人教版教材参考（如 "七年级下册 Unit 4"）
   - 严重程度："critical"（严重）, "important"（重要）, 或 "minor"（轻微）
3. 提供完整的正确句子
4. 给出1-2条鼓励性的学习建议（用温暖、积极的语气）

请只返回JSON格式，结构如下：
{
  "original": "原句",
  "corrected": "改正后的句子",
  "errors": [
    {
      "type": "verb_tense",
      "category": "时态",
      "position": {"start": 2, "end": 4},
      "incorrect": "go",
      "correct": "went",
      "explanation": "这里要用过去式 'went' 哦！因为 'yesterday'（昨天）表示的是过去发生的事情。记住：yesterday 后面的动词要用过去式。",
      "pepReference": "七年级下册 Unit 4",
      "severity": "critical"
    }
  ],
  "overallScore": 85,
  "suggestions": ["你已经掌握了基本句型，很棒！接下来可以多练习一下过去时态，特别是遇到 yesterday、last week 这些时间词的时候。加油！"]
}

如果句子没有错误，errors 返回空数组，overallScore 为 100。
记住：解释要像朋友一样亲切，多用"你"、"咱们"这样的词，让学生感到温暖和鼓励！`;

      // 步骤2：使用提取的短语进行语法检查，同时保留原始问题用于生成回答
      const userPrompt = `用户问题："${sentence}"

请分析这个英文短语的语法："${cleanedPhrase}"

然后根据你的分析结果，用中文回答用户的问题。如果短语有错误，解释为什么会扣分或有问题；如果没有错误，解释为什么不会扣分。`;

      try {
        console.log("[Grammar Check] Starting with retry mechanism...");
        
        // 使用重试机制调用LLM
        const response = await retryWithBackoff(async () => {
          return await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            maxTokens: 2000,
            responseFormat: { type: "json_object" },
          });
        }, 3, 1000);

        const content = response.choices[0]?.message?.content;
        const contentText = typeof content === "string" ? content : (Array.isArray(content) && content[0] && typeof content[0] === 'object' && 'type' in content[0] && content[0].type === "text" && 'text' in content[0]) ? content[0].text : "";
        
        if (!contentText) {
          console.error("[Grammar Check] No content from LLM, using fallback");
          return fallbackGrammarCheck(sentence);
        }
        
        const result = JSON.parse(contentText) as GrammarCheckResult;

        // Ensure all required fields are present
        console.log("[Grammar Check] Success!");
        return {
          original: result.original || sentence,
          corrected: result.corrected || sentence,
          errors: result.errors || [],
          overallScore: result.overallScore || 100,
          suggestions: result.suggestions || [],
        };
      } catch (error) {
        console.error("[Grammar Check] All retries failed, using fallback:", error);
        
        // 降级方案：返回基础检查结果
        return fallbackGrammarCheck(sentence);
      }
    }),

  /**
   * Get grammar topics by grade level
   */
  getTopics: publicProcedure
    .input(
      z.object({
        gradeLevel: z.number().min(7).max(12),
      })
    )
    .query(({ input }) => {
      return getTopicsByGrade(input.gradeLevel as 7 | 8 | 9 | 10 | 11 | 12);
    }),

  /**
   * Generate suggested questions based on grammar errors
   */
  suggestQuestions: publicProcedure
    .input(
      z.object({
        errors: z.array(
          z.object({
            type: z.string(),
            category: z.string(),
            explanation: z.string(),
          })
        ),
        gradeLevel: z.number().min(7).max(12),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const errorSummary = input.errors
          .map((e) => `${e.category}: ${e.type}`)
          .join("、");

        const prompt = `你是一位有经验的英语老师。学生刚才在语法检查中犯了这些错误：${errorSummary}

请根据这些错误，猜测${input.gradeLevel}年级学生可能想了解的相关知识点。生成 3-4 个简短的问题，帮助学生深入理解这个语法点。

问题要求：
1. 简短、口语化，像学生会问的那样
2. 直接针对错误类型的相关知识
3. 由浅入深，从基础到进阶

请以JSON数组格式返回，每个元素是一个问题字符串。
例如：[" past tense 和 past participle 有什么区别？", "什么时候用 went，什么时候用 gone？"]

只返回JSON数组，不要其他文字。`;

        const response = await retryWithBackoff(async () => {
          return await invokeLLM({
            messages: [
              {
                role: "system",
                content: "你是一位英语语法老师。只返回JSON格式，不要markdown格式。",
              },
              { role: "user", content: prompt },
            ],
            maxTokens: 500,
          });
        }, 2, 1000);

        const content = response.choices[0]?.message?.content;
        const contentText =
          typeof content === "string"
            ? content
            : content?.[0]?.type === "text"
              ? content[0].text
              : "";

        if (!contentText) {
          return { questions: [] };
        }

        const cleanContent = contentText
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        const questions = JSON.parse(cleanContent) as string[];

        return { questions };
      } catch (error) {
        console.error("Suggest questions error:", error);
        return { questions: [] };
      }
    }),

  /**
   * Categorize error automatically using AI
   */
  categorizeError: publicProcedure
    .input(
      z.object({
        errorType: z.string(),
        errorCategory: z.string(),
        explanation: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const prompt = `你是一位专业的英语语法分析专家。请根据以下错误信息,将其归类到最合适的语法分类中。

错误类型: ${input.errorType}
错误分类: ${input.errorCategory}
解释: ${input.explanation}

可选的详细分类标签:
- 时态变化 (tense)
- 主谓一致 (agreement)
- 虚拟语气 (subjunctive)
- 语态转换 (voice)
- 从句结构 (clause)
- 冠词使用 (article)
- 介词搭配 (preposition)
- 非谓语动词 (nonFinite)
- 情态动词 (modal)
- 词序问题 (wordOrder)

请只返回JSON格式:
{
  "detailedCategory": "时态变化",
  "categoryKey": "tense",
  "confidence": 0.95
}`;

        const response = await retryWithBackoff(async () => {
          return await invokeLLM({
            messages: [
              { role: "system", content: "你是一位英语语法分析专家。只返回JSON格式。" },
              { role: "user", content: prompt },
            ],
            maxTokens: 200,
            responseFormat: { type: "json_object" },
          });
        }, 2, 1000);

        const content = response.choices[0]?.message?.content;
        const contentText = typeof content === "string" ? content : (Array.isArray(content) && content[0] && typeof content[0] === 'object' && 'type' in content[0] && content[0].type === "text" && 'text' in content[0]) ? content[0].text : "";
        
        if (!contentText) {
          return { detailedCategory: input.errorCategory, categoryKey: "other", confidence: 0.5 };
        }
        
        const result = JSON.parse(contentText);
        return result;
      } catch (error) {
        console.error("Categorize error failed:", error);
        return { detailedCategory: input.errorCategory, categoryKey: "other", confidence: 0.5 };
      }
    }),

  /**
   * Generate targeted exercises based on error category
   */
  generateTargetedExercises: publicProcedure
    .input(
      z.object({
        errorCategory: z.string(),
        grammarPoint: z.string(),
        difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
        gradeLevel: z.number().min(7).max(12).default(8),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const prompt = `你是一位专业的英语教师,擅长设计针对性练习题。

学生在「${input.grammarPoint}」(${input.errorCategory})方面存在问题。
年级: ${input.gradeLevel}年级
难度: ${input.difficulty === "easy" ? "简单" : input.difficulty === "medium" ? "中等" : "困难"}

请生成3道针对性练习题,要求:
1. 题目要结合人教版教材的语境和词汇
2. 题目类型: 选择题或填空题
3. 难度适合${input.gradeLevel}年级学生
4. 每道题都要有详细的中文解析

请返回JSON格式:
{
  "exercises": [
    {
      "question": "题目内容",
      "options": ["A. 选项1", "B. 选项2", "C. 选项3", "D. 选项4"],
      "correctAnswer": "A",
      "explanation": "详细解析(中文)",
      "difficulty": "medium"
    }
  ]
}`;

        const response = await retryWithBackoff(async () => {
          return await invokeLLM({
            messages: [
              { role: "system", content: "你是一位英语教师。只返回JSON格式。" },
              { role: "user", content: prompt },
            ],
            maxTokens: 1500,
            responseFormat: { type: "json_object" },
          });
        }, 2, 1000);

        const content = response.choices[0]?.message?.content;
        const contentText = typeof content === "string" ? content : (Array.isArray(content) && content[0] && typeof content[0] === 'object' && 'type' in content[0] && content[0].type === "text" && 'text' in content[0]) ? content[0].text : "";
        
        if (!contentText) {
          return { exercises: [] };
        }
        
        const result = JSON.parse(contentText);
        return result;
      } catch (error) {
        console.error("Generate targeted exercises failed:", error);
        return { exercises: [] };
      }
    }),

  /**
   * Generate dual-mode explanation (teacher mode + simple mode)
   */
  generateDualExplanation: publicProcedure
    .input(
      z.object({
        grammarPoint: z.string(),
        category: z.string(),
        gradeLevel: z.number().min(7).max(12).default(8),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const prompt = `你是一位专业的英语语法老师。请为「${input.grammarPoint}」(分类: ${input.category})生成两种讲解模式:

1. **老师版** (Teacher Mode): 使用专业术语,完整的语法规则,适合教师教学和深入学习。
2. **大白话版** (Simple Mode): 用生活化的例子,通俗易懂的语言,适合${input.gradeLevel}年级学生快速理解。

要求:
- 老师版: 200-300字,专业、严谨、系统
- 大白话版: 150-200字,轻松、有趣、易懂
- 两种模式都要包含例句

请返回JSON格式:
{
  "teacher": "老师版讲解...",
  "simple": "大白话版讲解..."
}`;

        const response = await retryWithBackoff(async () => {
          return await invokeLLM({
            messages: [
              { role: "system", content: "你是一位英语语法老师。只返回JSON格式。" },
              { role: "user", content: prompt },
            ],
            maxTokens: 1000,
            responseFormat: { type: "json_object" },
          });
        }, 2, 1000);

        const content = response.choices[0]?.message?.content;
        const contentText = typeof content === "string" ? content : (Array.isArray(content) && content[0] && typeof content[0] === 'object' && 'type' in content[0] && content[0].type === "text" && 'text' in content[0]) ? content[0].text : "";
        
        if (!contentText) {
          return { 
            teacher: "暂无讲解", 
            simple: "暂无讲解" 
          };
        }
        
        const result = JSON.parse(contentText);
        return result;
      } catch (error) {
        console.error("Generate dual explanation failed:", error);
        return { 
          teacher: "生成讲解失败,请稍后重试", 
          simple: "生成讲解失败,请稍后重试" 
        };
      }
    }),

  /**
   * Answer student's follow-up question
   */
  answerQuestion: publicProcedure
    .input(
      z.object({
        question: z.string(),
        originalSentence: z.string(),
        errors: z.array(
          z.object({
            type: z.string(),
            category: z.string(),
            explanation: z.string(),
          })
        ),
        gradeLevel: z.number().min(7).max(12),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const errorContext = input.errors
          .map((e) => `- ${e.category} (${e.type}): ${e.explanation}`)
          .join("\n");

        const prompt = `你是一位温柔、有耐心的英语老师，正在帮助${input.gradeLevel}年级的学生。

学生的原句："${input.originalSentence}"

语法错误：
${errorContext}

学生现在问："${input.question}"

请用简单、友好的中文回答学生的问题。要求：
1. 语气亲切，像面对面聊天一样，多用"你"、"咱们"
2. 解释清晰、通俗易懂，适合${input.gradeLevel}年级学生
3. 如果适合，给出1-2个例句帮助理解
4. 鼓励学生，让他们感到被支持
5. 回答长度控制在 150-250 字

直接返回回答内容，不要JSON格式。`;

        const response = await retryWithBackoff(async () => {
          return await invokeLLM({
            messages: [
              {
                role: "system",
                content: "你是一位温柔、有耐心的英语老师。",
              },
              { role: "user", content: prompt },
            ],
            maxTokens: 800,
          });
        }, 2, 1000);

        const content = response.choices[0]?.message?.content;
        const answer =
          typeof content === "string"
            ? content
            : (Array.isArray(content) && content[0] && typeof content[0] === 'object' && 'type' in content[0] && content[0].type === "text" && 'text' in content[0])
              ? content[0].text
              : "抱歉，我暂时无法回答这个问题。请试试换个方式问。";

        return { answer };
      } catch (error) {
        console.error("Answer question error:", error);
        return {
          answer: "抱歉，出现了一些问题。请稍后再试。",
        };
      }
    }),

  /**
   * 测试环境变量（调试用）
   */
  testEnv: publicProcedure.query(() => {
    return {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasMysqlUrl: !!process.env.MYSQL_URL,
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) || 'not set',
      mysqlUrlPrefix: process.env.MYSQL_URL?.substring(0, 20) || 'not set',
    };
  }),

  /**
   * 初始化语法数据库（仅用于首次部署）
   */
  initDatabase: publicProcedure.mutation(async () => {
    const { initGrammarDatabase } = await import('../scripts/init-grammar-db');
    const result = await initGrammarDatabase();
    return result;
  }),

  /**
   * 获取所有语法章节
   */
  getChapters: publicProcedure.query(async () => {
    const { getDb } = await import('../db');
    const { grammarChapters } = await import('../../drizzle/schema');
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    const chapters = await db.select().from(grammarChapters).orderBy(grammarChapters.order);
    
    return chapters.map(chapter => ({
      ...chapter,
      examWeightBreakdown: chapter.examWeightBreakdown ? JSON.parse(chapter.examWeightBreakdown) : null,
      examTags: chapter.examTags ? JSON.parse(chapter.examTags) : [],
    }));
  }),

  /**
   * 获取所有知识点（用于语法中心）
   */
  getAllTopics: publicProcedure.query(async () => {
    const { getDb } = await import('../db');
    const { grammarTopics } = await import('../../drizzle/schema');
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    const topics = await db.select().from(grammarTopics);

    return topics.map(topic => ({
      ...topic,
      rules: topic.rules ? JSON.parse(topic.rules) : [],
      examples: topic.examples ? JSON.parse(topic.examples) : [],
      memoryTips: topic.memoryTips ? JSON.parse(topic.memoryTips) : [],
      specialNotes: topic.specialNotes ? JSON.parse(topic.specialNotes) : [],
      commonMistakes: topic.commonMistakes ? JSON.parse(topic.commonMistakes) : [],
      relatedTopics: topic.relatedTopics ? JSON.parse(topic.relatedTopics) : [],
    }));
  }),
});
