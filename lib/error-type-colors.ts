/**
 * Error type color mapping for grammar check results
 * 
 * Color scheme:
 * - Red: Tense errors (时态错误)
 * - Blue: Spelling errors (拼写错误)
 * - Purple: Preposition errors (介词错误)
 * - Orange: Word choice errors (用词错误)
 * - Green: Article errors (冠词错误)
 * - Pink: Subject-verb agreement errors (主谓一致错误)
 */

export interface ErrorTypeInfo {
  color: string;
  label: string;
  icon: string;
  textbookChapter?: string; // Link to PEP textbook chapter
}

export const ERROR_TYPE_COLORS: Record<string, ErrorTypeInfo> = {
  // Tense errors
  tense: {
    color: "#EF4444", // Red
    label: "时态错误",
    icon: "⏰",
    textbookChapter: "Unit 3 - 一般过去时 / Unit 5 - 现在进行时",
  },
  "verb-tense": {
    color: "#EF4444",
    label: "动词时态",
    icon: "⏰",
    textbookChapter: "Unit 3 - 一般过去时",
  },
  
  // Spelling errors
  spelling: {
    color: "#3B82F6", // Blue
    label: "拼写错误",
    icon: "✏️",
  },
  typo: {
    color: "#3B82F6",
    label: "拼写错误",
    icon: "✏️",
  },
  
  // Preposition errors
  preposition: {
    color: "#A855F7", // Purple
    label: "介词错误",
    icon: "🔗",
    textbookChapter: "Unit 2 - 方位介词 / Unit 6 - 时间介词",
  },
  
  // Word choice errors
  "word-choice": {
    color: "#F97316", // Orange
    label: "用词不当",
    icon: "📝",
  },
  vocabulary: {
    color: "#F97316",
    label: "词汇选择",
    icon: "📝",
  },
  
  // Article errors
  article: {
    color: "#10B981", // Green
    label: "冠词错误",
    icon: "🅰️",
    textbookChapter: "Unit 1 - 冠词 a/an/the 的用法",
  },
  
  // Subject-verb agreement
  "subject-verb-agreement": {
    color: "#EC4899", // Pink
    label: "主谓一致",
    icon: "🤝",
    textbookChapter: "Unit 1 - 主谓一致规则",
  },
  agreement: {
    color: "#EC4899",
    label: "主谓一致",
    icon: "🤝",
    textbookChapter: "Unit 1 - 主谓一致规则",
  },
  
  // Sentence structure
  "sentence-structure": {
    color: "#8B5CF6", // Violet
    label: "句子结构",
    icon: "🏗️",
    textbookChapter: "Unit 4 - 简单句与复合句",
  },
  
  // Punctuation
  punctuation: {
    color: "#6366F1", // Indigo
    label: "标点符号",
    icon: "❗",
  },
  
  // Default fallback
  other: {
    color: "#6B7280", // Gray
    label: "其他错误",
    icon: "⚠️",
  },
};

/**
 * Get error type info with fallback to "other"
 */
export function getErrorTypeInfo(type: string): ErrorTypeInfo {
  return ERROR_TYPE_COLORS[type.toLowerCase()] || ERROR_TYPE_COLORS.other;
}

/**
 * Get exam relevance tag for error type
 * 中考高频 / 高考加分项
 */
export function getExamRelevance(type: string): string | null {
  const highFrequencyTypes = ["tense", "verb-tense", "preposition", "article", "agreement"];
  const advancedTypes = ["word-choice", "sentence-structure"];
  
  if (highFrequencyTypes.includes(type.toLowerCase())) {
    return "中考高频";
  }
  if (advancedTypes.includes(type.toLowerCase())) {
    return "高考加分项";
  }
  return null;
}
