import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

export const practiceRouter = router({
  /**
   * Generate grammar exercises for a specific grammar point
   */
  generateGrammarExercises: publicProcedure
    .input(
      z.object({
        grammarPoint: z.string(),
        gradeLevel: z.number().min(7).max(12),
        count: z.number().min(1).max(10).default(5),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const prompt = `你是一位温柔、有耐心的英语语法老师，正在为${input.gradeLevel}年级的学生出练习题。

语法知识点：${input.grammarPoint}

请生成${input.count}道选择题，要求：
1. 每道题考查这个语法知识点
2. 提供4个选项（A、B、C、D）
3. 标明正确答案
4. 用亲切、简单的中文解释为什么选这个答案
5. 难度适合${input.gradeLevel}年级学生

请以JSON数组格式返回，每个元素包含：
{
  "question": "题目（中文描述+英文句子，有空格需要填入正确选项）",
  "options": ["选项A", "选项B", "选项C", "选项D"],
  "correctAnswer": 0,  // 正确答案的索引（0-3）
  "explanation": "温暖、友好的中文解释"
}

记住：解释要像朋友一样亲切，让学生感到被鼓励！
只返回JSON数组，不要其他文字。`;

        const completion = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are an English grammar teacher. Always respond with valid JSON only, no markdown formatting.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        const content =
          typeof completion.choices[0]?.message.content === "string"
            ? completion.choices[0].message.content
            : "";

        // Parse JSON response
        const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (!jsonMatch) {
          throw new Error("Invalid JSON response from LLM");
        }

        const exercises = JSON.parse(jsonMatch[0]);

        return {
          exercises,
          grammarPoint: input.grammarPoint,
          count: exercises.length,
        };
      } catch (error) {
        console.error("Error generating grammar exercises:", error);
        throw new Error("Failed to generate grammar exercises");
      }
    }),

  /**
   * Generate similar practice exercises based on error types
   */
  generateExercises: publicProcedure
    .input(
      z.object({
        errorTypes: z.array(z.string()),
        originalSentence: z.string(),
        count: z.number().min(1).max(10).default(5),
        gradeLevel: z.number().min(7).max(12),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const prompt = `你是一位温柔、有耐心的英语语法老师，正在帮助${input.gradeLevel}年级的学生练习语法。

学生刚才在这个句子中犯了这些错误：${input.errorTypes.join("、")}
原句：${input.originalSentence}

现在请帮学生生成${input.count}道练习题，让他们巩固这些语法点。每道题要求：
1. 包含一个有语法错误的英文句子（错误类型和原句相同，但换个场景和词汇）
2. 提供正确的句子
3. 用亲切、简单的中文解释为什么要这样改（就像面对面教学生一样，多用"你"、"咱们"，语气要鼓励）
4. 难度适合${input.gradeLevel}年级学生

请以JSON数组格式返回，每个元素包含：
{
  "incorrect": "错误的句子",
  "correct": "正确的句子",
  "explanation": "温暖、友好的中文解释",
  "errorType": "错误类型"
}

记住：解释要像朋友一样亲切，让学生感到被鼓励，而不是被批评。多说"很好"、"加油"、"你可以的"这样的话！
只返回JSON数组，不要其他文字。`;

        const completion = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are an English grammar teacher. Always respond with valid JSON only, no markdown formatting.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          maxTokens: 2000,
        });

        const content = completion.choices[0]?.message?.content;
        const contentText = typeof content === "string" ? content : content?.[0]?.type === "text" ? content[0].text : "";
        if (!contentText) {
          throw new Error("No response from LLM");
        }

        // Parse JSON response
        let exercises;
        try {
          // Remove markdown code blocks if present
          const cleanContent = contentText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          exercises = JSON.parse(cleanContent);
        } catch (parseError) {
          console.error("Failed to parse OpenAI response:", content);
          throw new Error("Failed to parse exercises from AI response");
        }

        if (!Array.isArray(exercises)) {
          throw new Error("AI response is not an array");
        }

        return {
          exercises,
          count: exercises.length,
        };
      } catch (error: any) {
        console.error("Generate exercises error:", error);
        throw new Error(`Failed to generate exercises: ${error.message}`);
      }
    }),

  /**
   * Check practice answer
   */
  checkAnswer: publicProcedure
    .input(
      z.object({
        userAnswer: z.string(),
        correctAnswer: z.string(),
        originalIncorrect: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const isCorrect =
        input.userAnswer.trim().toLowerCase() === input.correctAnswer.trim().toLowerCase();

      return {
        isCorrect,
        userAnswer: input.userAnswer,
        correctAnswer: input.correctAnswer,
        feedback: isCorrect
          ? "完全正确！你已经掌握了这个语法点。"
          : "还有一些小错误，再试一次吧！",
      };
    }),
});
