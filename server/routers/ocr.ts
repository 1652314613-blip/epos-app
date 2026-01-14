import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

export const ocrRouter = router({
  /**
   * 识别图片中的英文文字
   */
  recognizeText: publicProcedure
    .input(
      z.object({
        imageBase64: z.string(), // Base64编码的图片
      })
    )
    .mutation(async ({ input }) => {
      const { imageBase64 } = input;

      // 使用AI视觉模型识别图片中的文字
      const prompt = `请识别这张图片中的所有英文文字。要求：
1. 准确识别所有英文单词和句子
2. 保持原文的换行和段落结构
3. 如果有多个句子，每个句子单独一行
4. 只返回识别出的文字，不要添加任何解释或说明
5. 如果图片中没有英文文字，返回"未识别到英文文字"`;

      const result = await invokeLLM({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith("data:") 
                    ? imageBase64 
                    : `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
      });

      const recognizedText = typeof result.choices[0]?.message.content === "string" 
        ? result.choices[0].message.content.trim() 
        : "";

      // 分析识别出的文字类型
      const lines = recognizedText.split("\n").filter((line: string) => line.trim());
      const isSentence = lines.some((line: string) => line.includes(" ") && line.length > 10);
      const isWord = lines.length === 1 && !lines[0].includes(" ");

      return {
        text: recognizedText,
        lines,
        type: isWord ? "word" : isSentence ? "sentence" : "text",
      };
    }),
});
