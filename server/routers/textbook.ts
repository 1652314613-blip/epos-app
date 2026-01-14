import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

export const textbookRouter = router({
  // 生成单元语法知识点
  generateUnitGrammar: publicProcedure
    .input(
      z.object({
        grade: z.number().min(7).max(12),
        book: z.string(),
        unit: z.number().min(1),
        unitTitle: z.string(),
        vocabulary: z.array(z.string()).optional(), // 单元词汇列表，用于关联语法
      })
    )
    .mutation(async ({ input }) => {
      const { grade, book, unit, unitTitle, vocabulary } = input;

      const bookName = getBookName(grade, book);
      const vocabContext = vocabulary && vocabulary.length > 0 
        ? `\n\n该单元的核心词汇包括：${vocabulary.slice(0, 10).join(", ")}等。`
        : "";

      const prompt = `你是一位专业的英语教师，请为人教版${bookName} Unit ${unit} "${unitTitle}" 生成完整的语法知识点讲解。${vocabContext}

要求：
1. 列出该单元的核心语法知识点（2-4个）
2. 每个语法点包含：
   - 知识点标题
   - 所属类别（时态/语态/句型/词性/从句等）
   - 详细讲解（用通俗易懂的语言）
   - 语法规则要点（3-5条）
   - 典型例句（3-5个，附中文翻译和简要分析）
   - 常见错误（2-3个）
3. 语法点要符合${grade}年级学生水平
4. 例句要贴近学生生活，易于理解

请以JSON格式返回，格式如下：
{
  "grammarPoints": [
    {
      "title": "知识点标题",
      "category": "类别",
      "explanation": "详细讲解",
      "rules": ["规则1", "规则2"],
      "examples": [
        {
          "english": "英文例句",
          "chinese": "中文翻译",
          "analysis": "简要分析"
        }
      ],
      "commonMistakes": ["常见错误1", "常见错误2"]
    }
  ]
}`;

      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
        });

        const message = response.choices[0]?.message;
        if (!message || !message.content) {
          throw new Error("No response from LLM");
        }

        const content = Array.isArray(message.content) 
          ? (message.content.find((c: any) => c.type === "text") as any)?.text || ""
          : message.content;

        const result = JSON.parse(content);
        return result;
      } catch (error) {
        console.error("Error generating unit grammar:", error);
        throw new Error("生成单元语法失败，请稍后重试");
      }
    }),

  // 生成单元词汇表
  generateUnitVocabulary: publicProcedure
    .input(
      z.object({
        grade: z.number().min(7).max(12),
        book: z.string(),
        unit: z.number().min(1),
        unitTitle: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { grade, book, unit, unitTitle } = input;

      const bookName = getBookName(grade, book);
      const prompt = `你是一位专业的英语教师，请为人教版${bookName} Unit ${unit}${unitTitle ? ` "${unitTitle}"` : ""} 生成完整的单元词汇表。

要求：
1. 列出该单元的所有核心词汇（15-25个单词）
2. 每个单词包含：
   - 单词拼写
   - 国际音标
   - 词性（n./v./adj./adv./prep./conj./interj.等）
   - 中文释义
   - 2个实用例句（英文+中文翻译）
3. 词汇难度要符合${grade}年级学生水平
4. 例句要贴近学生生活，易于理解和记忆

请以JSON格式返回，格式如下：
{
  "unitTitle": "单元主题",
  "words": [
    {
      "word": "单词",
      "phonetic": "/音标/",
      "partOfSpeech": "词性",
      "meaning": "中文释义",
      "examples": [
        "例句1（英文）",
        "例句2（英文）"
      ]
    }
  ]
}`;

      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: { type: "json_object" },
        });

        const message = response.choices[0]?.message;
        if (!message || !message.content) {
          throw new Error("No response from LLM");
        }

        const content = Array.isArray(message.content) 
          ? (message.content.find((c: any) => c.type === "text") as any)?.text || ""
          : message.content;

        const result = JSON.parse(content);
        return result;
      } catch (error) {
        console.error("Error generating unit vocabulary:", error);
        throw new Error("生成单元词汇失败，请稍后重试");
      }
    }),
});

function getBookName(grade: number, book: string): string {
  const bookMap: Record<string, string> = {
    "7A": "七年级上册",
    "7B": "七年级下册",
    "8A": "八年级上册",
    "8B": "八年级下册",
    "9": "九年级全一册",
    "R1": "必修第一册",
    "R2": "必修第二册",
    "R3": "必修第三册",
    "E1": "选择性必修第一册",
    "E2": "选择性必修第二册",
    "E3": "选择性必修第三册",
    "E4": "选择性必修第四册",
  };
  return bookMap[book] || `${grade}年级`;
}
