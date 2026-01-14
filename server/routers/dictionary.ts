import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

export const dictionaryRouter = router({
  /**
   * 查询单词释义
   */
  lookup: publicProcedure
    .input(
      z.object({
        word: z.string().min(1),
      })
    )
    .mutation(async ({ input }: { input: { word: string } }) => {
      const { word } = input;

      const prompt = `请作为一个英语词典，为单词"${word}"提供详细的释义信息。

要求：
1. 提供音标（国际音标IPA）
2. 列出所有常见词性和对应的中文释义
3. 每个释义提供一个简单易懂的英文例句
4. 如果是常见单词，提供记忆技巧或词根词缀分析
5. 用友好、易懂的中文表达

请以JSON格式返回，结构如下：
{
  "word": "${word}",
  "phonetic": "音标",
  "definitions": [
    {
      "partOfSpeech": "词性（如：n. / v. / adj.）",
      "meaning": "中文释义",
      "exampleSentence": "英文例句"
    }
  ],
  "memoryTip": "记忆技巧（可选）",
  "wordRoot": "词根词缀分析（可选）"
}`;

      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          maxTokens: 1000,
          responseFormat: { type: "json_object" },
        });

        const content = response.choices[0]?.message?.content;
        const contentText = typeof content === "string" ? content : content?.[0]?.type === "text" ? content[0].text : "";
        
        if (!contentText) {
          throw new Error("无法获取AI响应");
        }
        
        const result = JSON.parse(contentText);
        return result;
      } catch (error) {
        console.error("Dictionary lookup error:", error);
        throw new Error("查词失败，请稍后重试");
      }
    }),

  /**
   * 获取单词发音（TTS）
   */
  pronounce: publicProcedure
    .input(
      z.object({
        word: z.string().min(1),
      })
    )
    .mutation(async ({ input }: { input: { word: string } }) => {
      // TODO: 集成TTS服务或返回音频URL
      // 暂时返回占位符
      return {
        audioUrl: `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(input.word)}&type=1`,
      };
    }),
});
