/**
 * QA Router - 处理学生的学习问题
 * 用于回答"怎么检查语法错误"这类学习问题
 */

import { publicProcedure, router } from "@/server/_core/trpc";
import { z } from "zod";
import { invokeLLM } from "@/server/_core/llm";

interface QAResult {
  question: string;
  answer: string;
  tips?: string[];
  relatedTopics?: string[];
}

export const qaRouter = router({
  /**
   * 回答学生的学习问题
   * 用于处理"怎么检查语法错误"这类问题
   */
  ask: publicProcedure
    .input(
      z.object({
        question: z.string().min(1).max(1000),
        gradeLevel: z.number().min(7).max(12).default(9),
      })
    )
    .mutation(async ({ input }): Promise<QAResult> => {
      const { question, gradeLevel } = input;

      // 输入验证
      if (!question || question.trim().length === 0) {
        return {
          question: question,
          answer: "请输入一个问题哦！",
          tips: ["试试问我关于英语语法、学习方法或考试技巧的问题"],
        };
      }

      const systemPrompt = `你是一位温柔、有耐心的英语语法老师，专门帮助中国${gradeLevel}年级的学生学习英语语法。

你的任务是回答学生提出的关于英语语法、学习方法或考试技巧的问题。

回答时请注意：
1. 用简单、友好的中文解释，就像在和学生面对面聊天一样
2. 如果问题涉及具体的语法规则，请举例说明
3. 给出1-2条实用的学习建议或技巧
4. 如果适用，标注人教版教材参考（如 "七年级下册 Unit 4"）
5. 用温暖、积极的语气鼓励学生

请只返回JSON格式，结构如下：
{
  "question": "用户的问题",
  "answer": "你的详细回答（可以包含多个段落，用\\n分隔）",
  "tips": ["学习技巧1", "学习技巧2"],
  "relatedTopics": ["相关语法主题1", "相关语法主题2"]
}

记住：回答要有针对性、实用性和鼓励性！`;

      const userPrompt = `学生问题：${question}

请用中文详细回答这个问题，并给出实用的学习建议。`;

      try {
        console.log("[QA] Starting QA request...");
        console.log("[QA] Question:", question);

        const result = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        });
        console.log("[QA] LLM response:", result);

        // Extract the content from the response
        const content = result.choices[0]?.message?.content;
        if (!content) {
          throw new Error("No content in LLM response");
        }

        // Parse the response
        const qaResult = typeof content === "string" ? JSON.parse(content) : JSON.parse(JSON.stringify(content)) as QAResult;
        console.log("[QA] Parsed QA result:", qaResult);

        return qaResult;
      } catch (error) {
        console.error("[QA] Error:", error);

        // Fallback response
        return {
          question: question,
          answer: `很抱歉，我暂时无法回答这个问题。但我建议你：
1. 查看教材中的相关章节
2. 向老师或同学请教
3. 稍后再试一次

不过，如果你有具体的英文句子需要检查语法，我可以帮你分析哦！`,
          tips: ["如果问题持续，请稍后重试"],
          relatedTopics: [],
        };
      }
    }),
});
