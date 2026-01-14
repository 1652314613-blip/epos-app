/**
 * Native Polish Service - AI-powered native-level sentence polishing
 * Provides mother-tongue level improvements and scoring point explanations
 */

import { invokeLLM } from "@/server/_core/llm";

export interface PolishSuggestion {
  polishedSentence: string;
  improvements: string[];
  scoringPoints: string[];
  level: "intermediate" | "advanced" | "native";
  examTips?: {
    cet4?: string;  // 四级建议
    cet6?: string;  // 六级建议
    ielts?: string; // 雅思建议
    kaoyan?: string; // 考研建议
  };
}

/**
 * Generate native-level polished version of a sentence
 */
export async function generateNativePolish(
  originalSentence: string,
  correctedSentence: string,
  gradeLevel: number
): Promise<PolishSuggestion> {
  const prompt = `你是一位英语母语级表达专家和考试辅导专家，帮助中国学生将正确但不够地道的英语句子提升到母语水平，并提供针对不同考试的专业建议。

**原始句子**：${originalSentence}
**语法改正后**：${correctedSentence}
**学生年级**：${gradeLevel}年级

请提供：
1. **地道表达版本**：将句子改写为母语者会使用的自然表达
2. **改进点说明**：列出3-5个具体改进（词汇升级、句式优化、语气调整等）
3. **考试加分点**：说明这些改进在中考/高考作文中的加分价值
4. **分级考试建议**：针对四六级、考研、雅思等考试的专业建议

要求：
- 保持原意不变
- 使用更地道的词汇和句式
- 适合${gradeLevel}年级学生理解和学习
- 突出考试实用性
- 提供2个考研/雅思级别的高级建议

请以JSON格式返回：
{
  "polishedSentence": "地道表达版本",
  "improvements": ["改进点1", "改进点2", "改进点3"],
  "scoringPoints": ["加分点1", "加分点2"],
  "level": "intermediate" | "advanced" | "native",
  "examTips": {
    "cet4": "四级考试建议（可选）",
    "cet6": "六级考试建议（可选）",
    "ielts": "雅思考试建议（必填）",
    "kaoyan": "考研考试建议（必填）"
  }
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

    const content = response.choices[0]?.message.content;
    const text = typeof content === "string" ? content : "";
    const result = JSON.parse(text);
    return result as PolishSuggestion;
  } catch (error) {
    console.error("Failed to generate native polish:", error);
    // Fallback
    return {
      polishedSentence: correctedSentence,
      improvements: ["建议使用更地道的表达方式"],
      scoringPoints: ["使用高级词汇可以提升作文分数"],
      level: "intermediate",
      examTips: {
        kaoyan: "考研写作建议使用复杂句式和高级词汇",
        ielts: "雅思写作注意逻辑连贯性和论证充分性"
      }
    };
  }
}
