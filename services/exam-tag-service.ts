/**
 * Exam Tag Service - AI-powered automatic tagging for grammar points and vocabulary
 * Tags: "中考高频", "高考易错", "作文加分句式"
 */

import { invokeLLM } from "@/server/_core/llm";

export type ExamTag = "中考高频" | "高考易错" | "作文加分句式" | null;

export interface TaggedItem {
  content: string;
  tag: ExamTag;
  reason: string; // Why this tag was assigned
}

/**
 * Automatically tag grammar points with exam relevance
 */
export async function tagGrammarPoints(
  grammarPoints: Array<{ title: string; explanation: string; category: string }>,
  gradeLevel: number
): Promise<TaggedItem[]> {
  const prompt = `你是一位中国英语考试专家，熟悉中考和高考英语考点。请为以下语法点打上考试标签。

**语法点列表**：
${grammarPoints.map((gp, i) => `${i + 1}. ${gp.title} (${gp.category})`).join("\n")}

**学生年级**：${gradeLevel}年级

**标签规则**：
- **中考高频**：中考必考、高频出现的语法点（适合7-9年级）
- **高考易错**：高考中学生容易出错的语法点（适合10-12年级）
- **作文加分句式**：可以提升作文分数的高级句式
- 如果不符合以上任何标签，返回null

请以JSON数组格式返回：
[
  {
    "content": "语法点标题",
    "tag": "中考高频" | "高考易错" | "作文加分句式" | null,
    "reason": "标签原因说明"
  }
]`;

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
    
    // Handle both array and object with "tags" property
    const tags = Array.isArray(result) ? result : result.tags || [];
    return tags as TaggedItem[];
  } catch (error) {
    console.error("Failed to tag grammar points:", error);
    // Fallback: no tags
    return grammarPoints.map((gp) => ({
      content: gp.title,
      tag: null,
      reason: "",
    }));
  }
}

/**
 * Automatically tag vocabulary with exam relevance
 */
export async function tagVocabulary(
  words: Array<{ word: string; meaning: string }>,
  gradeLevel: number
): Promise<TaggedItem[]> {
  const prompt = `你是一位中国英语考试专家，熟悉中考和高考英语词汇要求。请为以下单词打上考试标签。

**单词列表**：
${words.map((w, i) => `${i + 1}. ${w.word} - ${w.meaning}`).join("\n")}

**学生年级**：${gradeLevel}年级

**标签规则**：
- **中考高频**：中考必考、高频词汇（适合7-9年级）
- **高考易错**：高考中容易拼错或误用的词汇（适合10-12年级）
- **作文加分句式**：作文中使用可以加分的高级词汇
- 如果不符合以上任何标签，返回null

请以JSON数组格式返回：
[
  {
    "content": "单词",
    "tag": "中考高频" | "高考易错" | "作文加分句式" | null,
    "reason": "标签原因说明"
  }
]`;

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
    
    // Handle both array and object with "tags" property
    const tags = Array.isArray(result) ? result : result.tags || [];
    return tags as TaggedItem[];
  } catch (error) {
    console.error("Failed to tag vocabulary:", error);
    // Fallback: no tags
    return words.map((w) => ({
      content: w.word,
      tag: null,
      reason: "",
    }));
  }
}

/**
 * Get tag color for UI display
 */
export function getTagColor(tag: ExamTag): string {
  switch (tag) {
    case "中考高频":
      return "#EF4444"; // Red
    case "高考易错":
      return "#F59E0B"; // Orange
    case "作文加分句式":
      return "#10B981"; // Green
    default:
      return "#6B7280"; // Gray
  }
}

/**
 * Get tag background color for UI display
 */
export function getTagBackgroundColor(tag: ExamTag): string {
  switch (tag) {
    case "中考高频":
      return "#FEE2E2"; // Light red
    case "高考易错":
      return "#FEF3C7"; // Light orange
    case "作文加分句式":
      return "#D1FAE5"; // Light green
    default:
      return "#F3F4F6"; // Light gray
  }
}
