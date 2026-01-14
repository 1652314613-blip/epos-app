// 课文带学模块 - 数据类型定义

export interface TextbookReading {
  id: string;
  grade: number;
  book: string; // '9A', '9B', etc.
  unit: number;
  title: string;
  subtitle?: string;
  content: ReadingContent[];
  vocabulary: string[]; // 重点词汇ID列表
  grammarPoints: string[]; // 语法点
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

export interface ReadingContent {
  id: string;
  type: 'paragraph' | 'dialogue' | 'title' | 'subtitle';
  text: string;
  translation?: string;
  speaker?: string; // 对话时使用
  audioUrl?: string;
  keyPoints?: KeyPoint[]; // 该段落的考点
}

export interface KeyPoint {
  id: string;
  type: 'vocabulary' | 'grammar' | 'phrase' | 'sentence_pattern';
  text: string; // 原文中的文本
  startIndex: number; // 在段落中的起始位置
  endIndex: number; // 在段落中的结束位置
  explanation: string; // AI生成的解释
  examples?: string[]; // 例句
  relatedPoints?: string[]; // 相关考点ID
}

export interface AnalysisResult {
  contentId: string;
  sentence: string;
  analysis: {
    structure: string; // 句子成分分析
    keyWords: Array<{
      word: string;
      meaning: string;
      usage: string;
    }>;
    grammarPoints: Array<{
      point: string;
      explanation: string;
      example: string;
    }>;
  };
}

export interface StudyProgress {
  readingId: string;
  userId: string;
  completedSections: string[]; // 已完成的段落ID
  collectedPoints: string[]; // 已收藏的考点ID
  practiceScore?: number; // 练习得分
  lastStudyTime: Date;
}
