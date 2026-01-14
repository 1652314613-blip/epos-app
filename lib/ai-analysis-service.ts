// AI考点拆解服务

import { AnalysisResult } from './textbook-reading-types';

export interface SentenceAnalysisRequest {
  sentence: string;
  context?: string; // 上下文
  grade: number;
}

export async function analyzeSentence(request: SentenceAnalysisRequest): Promise<AnalysisResult> {
  // TODO: 实际项目中调用后端API进行AI分析
  // 这里先返回mock数据
  
  return {
    contentId: 'mock',
    sentence: request.sentence,
    analysis: {
      structure: '主语 + 谓语 + 宾语 + 状语',
      keyWords: [
        {
          word: 'example',
          meaning: '例子；榜样',
          usage: '作名词使用，表示"例子"或"榜样"'
        }
      ],
      grammarPoints: [
        {
          point: '现在完成时',
          explanation: '表示过去发生的动作对现在造成的影响或结果',
          example: 'I have finished my homework.'
        }
      ]
    }
  };
}

export async function generateKeyPointExplanation(
  text: string,
  type: 'vocabulary' | 'grammar' | 'phrase' | 'sentence_pattern',
  context: string
): Promise<{
  explanation: string;
  examples: string[];
}> {
  // TODO: 实际项目中调用后端API
  
  return {
    explanation: `这是关于"${text}"的详细解释...`,
    examples: [
      'Example sentence 1',
      'Example sentence 2'
    ]
  };
}

// 智能点读：点击句子自动生成考点拆解
export async function intelligentReading(sentence: string, grade: number): Promise<{
  structure: string;
  keyPoints: Array<{
    text: string;
    type: string;
    explanation: string;
  }>;
}> {
  // TODO: 实际项目中调用后端API
  
  // Mock数据
  return {
    structure: '这是一个复合句，包含主句和从句',
    keyPoints: [
      {
        text: 'key phrase',
        type: 'phrase',
        explanation: '这是一个重要短语...'
      }
    ]
  };
}

// 考试模式：将重点词汇挖空
export function generateClozeTest(text: string, keyWords: string[]): {
  text: string;
  blanks: Array<{ word: string; position: number }>;
} {
  let clozeText = text;
  const blanks: Array<{ word: string; position: number }> = [];
  
  keyWords.forEach((word, index) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const match = regex.exec(text);
    
    if (match) {
      blanks.push({
        word: word,
        position: match.index
      });
      
      // 用下划线替换单词
      clozeText = clozeText.replace(regex, '_'.repeat(word.length));
    }
  });
  
  return {
    text: clozeText,
    blanks
  };
}

// 场景对练：生成对话场景
export async function generateDialogueScenario(
  topic: string,
  difficulty: 'basic' | 'intermediate' | 'advanced'
): Promise<{
  scenario: string;
  roles: string[];
  dialogue: Array<{
    role: string;
    text: string;
    translation: string;
  }>;
}> {
  // TODO: 实际项目中调用后端API
  
  return {
    scenario: '在餐厅点餐',
    roles: ['Customer', 'Waiter'],
    dialogue: [
      {
        role: 'Waiter',
        text: 'Good evening! May I take your order?',
        translation: '晚上好！可以点餐了吗？'
      },
      {
        role: 'Customer',
        text: 'Yes, I\'d like a steak, please.',
        translation: '是的，我想要一份牛排。'
      }
    ]
  };
}
