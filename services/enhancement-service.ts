/**
 * Enhancement Service
 * 
 * Provides advanced vocabulary and sentence pattern suggestions
 * to help students improve their writing and speaking scores
 */

import { invokeLLM } from "@/server/_core/llm";

export interface EnhancementSuggestion {
  original: string; // Original word or phrase
  enhanced: string; // Enhanced version
  type: "vocabulary" | "phrase" | "sentence"; // Type of enhancement
  level: "intermediate" | "advanced" | "expert"; // Difficulty level
  examTag?: string; // e.g., "中考高频", "高考加分项"
  explanation: string; // Why this is better
  example: string; // Example usage
}

export interface EnhancementResult {
  suggestions: EnhancementSuggestion[];
  overallScore: number; // Original score (0-100)
  enhancedScore: number; // Potential score after enhancements (0-100)
  scoreGain: number; // Points gained
}

/**
 * Get enhancement suggestions for a sentence
 */
export async function getEnhancementSuggestions(
  sentence: string
): Promise<EnhancementResult> {
  const prompt = `你是一位专业的英语写作教练，帮助中国中学生提升英语表达水平。

请分析以下句子，提供3-5个具体的提升建议（词汇替换、短语升级、句式优化）：

句子：${sentence}

要求：
1. 每个建议必须包含：
   - 原始表达（original）
   - 高级替换（enhanced）
   - 类型（vocabulary/phrase/sentence）
   - 难度等级（intermediate/advanced/expert）
   - 考点标签（如"中考高频"、"高考加分项"、"写作亮点"）
   - 解释说明（为什么这样更好）
   - 例句（展示用法）

2. 建议要实用，适合中学生水平
3. 优先推荐考试常考的高级表达
4. 给出原始句子的评分（0-100）和提升后的预期评分

请以JSON格式返回：
{
  "suggestions": [
    {
      "original": "very happy",
      "enhanced": "be over the moon / be on cloud nine",
      "type": "phrase",
      "level": "advanced",
      "examTag": "高考加分项",
      "explanation": "这是地道的英语习语，表达'非常高兴'，比very happy更生动形象，能让作文脱颖而出",
      "example": "I was over the moon when I heard the good news."
    }
  ],
  "overallScore": 65,
  "enhancedScore": 85,
  "scoreGain": 20
}`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "你是专业的英语教学AI，精通中国中高考英语考点，擅长提供实用的提分建议。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      maxTokens: 2000,
    });

    // Extract content from response
    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== "string") {
      throw new Error("Invalid LLM response");
    }

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse LLM response");
    }

    const result = JSON.parse(jsonMatch[0]) as EnhancementResult;
    return result;
  } catch (error) {
    console.error("Failed to get enhancement suggestions:", error);
    // Return fallback result
    return {
      suggestions: [],
      overallScore: 70,
      enhancedScore: 70,
      scoreGain: 0,
    };
  }
}

/**
 * Common high-frequency vocabulary upgrades for quick reference
 */
export const COMMON_UPGRADES: EnhancementSuggestion[] = [
  {
    original: "very happy",
    enhanced: "delighted / thrilled / over the moon",
    type: "phrase",
    level: "intermediate",
    examTag: "中考高频",
    explanation: "比very happy更生动，表达强烈的喜悦之情",
    example: "I was delighted to receive your letter.",
  },
  {
    original: "very important",
    enhanced: "crucial / vital / essential",
    type: "vocabulary",
    level: "intermediate",
    examTag: "中考高频",
    explanation: "更正式、更有分量的表达",
    example: "It is crucial to protect the environment.",
  },
  {
    original: "I think",
    enhanced: "In my opinion / From my perspective / I believe",
    type: "phrase",
    level: "intermediate",
    examTag: "写作亮点",
    explanation: "更正式的观点表达，适合议论文",
    example: "In my opinion, reading is essential for personal growth.",
  },
  {
    original: "very good",
    enhanced: "excellent / outstanding / remarkable",
    type: "vocabulary",
    level: "intermediate",
    examTag: "中考高频",
    explanation: "更具体、更有力的褒义词",
    example: "She gave an excellent presentation.",
  },
  {
    original: "very bad",
    enhanced: "terrible / awful / dreadful",
    type: "vocabulary",
    level: "intermediate",
    examTag: "中考高频",
    explanation: "更强烈的负面表达",
    example: "The weather was terrible yesterday.",
  },
  {
    original: "because",
    enhanced: "due to / owing to / on account of",
    type: "phrase",
    level: "advanced",
    examTag: "高考加分项",
    explanation: "更正式的因果关系表达",
    example: "The match was cancelled due to bad weather.",
  },
  {
    original: "so",
    enhanced: "therefore / consequently / as a result",
    type: "vocabulary",
    level: "advanced",
    examTag: "高考加分项",
    explanation: "更正式的结果表达，适合议论文",
    example: "He studied hard; therefore, he passed the exam.",
  },
  {
    original: "more and more",
    enhanced: "increasingly / a growing number of",
    type: "phrase",
    level: "advanced",
    examTag: "写作亮点",
    explanation: "更简洁、更正式的递增表达",
    example: "An increasingly large number of people prefer online shopping.",
  },
];
