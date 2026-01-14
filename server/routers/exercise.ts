/**
 * Exercise tRPC router
 * AI-powered targeted exercise generation based on wrong questions
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

/**
 * 生成针对性练习题
 * 根据用户的错题记录,生成3道相似但语境不同的新题目
 */
export const exerciseRouter = router({
  generateTargetedExercise: publicProcedure
    .input(
      z.object({
        wrongQuestionId: z.string(),
        grammarPoint: z.string(),
        category: z.string(),
        userAnswer: z.string(),
        correctAnswer: z.string(),
        explanation: z.string(),
        gradeLevel: z.number().min(7).max(12).default(9),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { grammarPoint, category, userAnswer, correctAnswer, explanation, gradeLevel } = input;

        const prompt = `你是一位专业的英语老师,需要根据学生的错题生成3道针对性练习题。

学生的错题信息:
- 语法点: ${grammarPoint}
- 错误类型: ${category}
- 学生的错误答案: ${userAnswer}
- 正确答案: ${correctAnswer}
- 错误原因: ${explanation}
- 年级: ${gradeLevel}年级

请生成3道新题目,要求:
1. 考查相同的语法点和知识点
2. 使用不同的生活场景(如:校园生活、家庭日常、朋友聚会等)
3. 难度适合${gradeLevel}年级学生
4. 每道题包含:
   - question: 题目(填空题或选择题)
   - options: 4个选项(如果是选择题)
   - correctAnswer: 正确答案
   - explanation: 简短的解析(50字以内)
   - scenario: 场景描述(如"校园生活")

返回JSON格式:
{
  "exercises": [
    {
      "question": "Yesterday, I ____ to the library with my classmates.",
      "options": ["go", "went", "going", "goes"],
      "correctAnswer": "went",
      "explanation": "yesterday表示过去,要用过去式went",
      "scenario": "校园生活"
    }
  ]
}`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "你是一位专业的英语教师,擅长根据学生的错题生成针对性练习。",
            },
            { role: "user", content: prompt },
          ],
          maxTokens: 1000,
        });

        const content = response.choices[0]?.message?.content;
        let result;

        if (typeof content === "string") {
          // 尝试解析JSON
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            result = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("无法解析AI返回的内容");
          }
        } else if (content?.[0]?.type === "text") {
          const jsonMatch = content[0].text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            result = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("无法解析AI返回的内容");
          }
        } else {
          throw new Error("AI返回格式错误");
        }

        return {
          success: true,
          exercises: result.exercises || [],
        };
      } catch (error) {
        console.error("Generate targeted exercise error:", error);
        return {
          success: false,
          exercises: [],
          error: "生成练习题失败,请稍后重试",
        };
      }
    }),

  /**
   * 批量生成专项突破练习
   * 针对某个错误分类生成一套完整的练习题
   */
  generateCategoryExercises: publicProcedure
    .input(
      z.object({
        category: z.string(),
        grammarPoints: z.array(z.string()),
        count: z.number().min(5).max(20).default(10),
        gradeLevel: z.number().min(7).max(12).default(9),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { category, grammarPoints, count, gradeLevel } = input;

        const prompt = `你是一位专业的英语老师,需要生成一套针对"${category}"的专项练习题。

相关语法点: ${grammarPoints.join(", ")}
题目数量: ${count}道
年级: ${gradeLevel}年级

请生成${count}道题目,要求:
1. 全部围绕"${category}"这个错误类型
2. 涵盖多个生活场景(校园、家庭、旅游、购物等)
3. 难度递进,从简单到复杂
4. 每道题包含:
   - question: 题目
   - options: 4个选项
   - correctAnswer: 正确答案
   - explanation: 解析(80字以内)
   - difficulty: 难度(easy/medium/hard)

返回JSON格式:
{
  "title": "专项练习:${category}",
  "exercises": [...]
}`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "你是一位专业的英语教师,擅长设计系统的专项练习。",
            },
            { role: "user", content: prompt },
          ],
          maxTokens: 2000,
        });

        const content = response.choices[0]?.message?.content;
        let result;

        if (typeof content === "string") {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            result = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("无法解析AI返回的内容");
          }
        } else if (content?.[0]?.type === "text") {
          const jsonMatch = content[0].text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            result = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("无法解析AI返回的内容");
          }
        } else {
          throw new Error("AI返回格式错误");
        }

        return {
          success: true,
          title: result.title || `专项练习:${category}`,
          exercises: result.exercises || [],
        };
      } catch (error) {
        console.error("Generate category exercises error:", error);
        return {
          success: false,
          title: "",
          exercises: [],
          error: "生成练习题失败,请稍后重试",
        };
      }
    }),
});
