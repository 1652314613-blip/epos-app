import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Definition } from "./vocabulary-storage";

export interface TextbookWord {
  id: string;
  word: string;
  phonetic: string;
  grade: number; // 7-12
  book: string; // "7A", "7B", "8A", "8B", "9", "R1", "R2", "R3", "E1", "E2", "E3", "E4"
  unit: number;
  definitions: Definition[];
  examples: string[];
  difficulty: "basic" | "intermediate" | "advanced";
  frequency: "high" | "medium" | "low";
}

export interface GrammarPoint {
  id: string;
  title: string;
  category: string; // 时态、语态、句型等
  explanation: string;
  rules: string[];
  examples: Array<{
    english: string;
    chinese: string;
    analysis?: string;
  }>;
  commonMistakes: string[];
}

export interface TextbookUnit {
  grade: number;
  book: string;
  unit: number;
  title: string;
  theme?: string;
  wordCount: number;
  words: TextbookWord[];
  grammar?: {
    points: GrammarPoint[];
    pointCount: number;
  };
  progress?: {
    vocabularyLearned: number;
    vocabularyMastered: number;
    grammarCompleted: number;
  };
}

export interface TextbookBook {
  grade: number;
  book: string;
  title: string;
  unitCount: number;
  units: TextbookUnit[];
}

const STORAGE_KEY_PREFIX = "textbook_vocabulary_";
const BOOKS_KEY = "textbook_books";

// 教材书籍配置
export const TEXTBOOK_BOOKS: Array<{ grade: number; book: string; title: string; unitCount: number }> = [
  // 初中
  { grade: 7, book: "7A", title: "七年级上册（2025秋新教材）", unitCount: 7 },
  { grade: 7, book: "7B", title: "七年级下册", unitCount: 12 },
  { grade: 8, book: "8A", title: "八年级上册", unitCount: 10 },
  { grade: 8, book: "8B", title: "八年级下册", unitCount: 10 },
  { grade: 9, book: "9", title: "九年级全一册", unitCount: 14 },
  // 高中
  { grade: 10, book: "R1", title: "必修第一册", unitCount: 5 },
  { grade: 10, book: "R2", title: "必修第二册", unitCount: 5 },
  { grade: 11, book: "R3", title: "必修第三册", unitCount: 5 },
  { grade: 11, book: "E1", title: "选择性必修第一册", unitCount: 5 },
  { grade: 11, book: "E2", title: "选择性必修第二册", unitCount: 5 },
  { grade: 12, book: "E3", title: "选择性必修第三册", unitCount: 5 },
  { grade: 12, book: "E4", title: "选择性必修第四册", unitCount: 5 },
];

// 获取教材书籍列表
export async function getTextbookBooks(): Promise<typeof TEXTBOOK_BOOKS> {
  return TEXTBOOK_BOOKS;
}

// 获取指定年级的书籍
export async function getBooksByGrade(grade: number): Promise<typeof TEXTBOOK_BOOKS> {
  return TEXTBOOK_BOOKS.filter((book) => book.grade === grade);
}

// 获取单元词汇（从缓存或生成）
export async function getUnitVocabulary(grade: number, book: string, unit: number): Promise<TextbookUnit | null> {
  const cacheKey = `${STORAGE_KEY_PREFIX}${grade}_${book}_${unit}`;
  
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  } catch (error) {
    console.error("Error loading unit vocabulary:", error);
    return null;
  }
}

// 保存单元词汇到缓存
export async function saveUnitVocabulary(unitData: TextbookUnit): Promise<void> {
  const cacheKey = `${STORAGE_KEY_PREFIX}${unitData.grade}_${unitData.book}_${unitData.unit}`;
  
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(unitData));
  } catch (error) {
    console.error("Error saving unit vocabulary:", error);
  }
}

// 获取学习进度
export interface UnitProgress {
  grade: number;
  book: string;
  unit: number;
  totalWords: number;
  learnedWords: number;
  masteredWords: number;
}

export async function getUnitProgress(grade: number, book: string, unit: number): Promise<UnitProgress> {
  const progressKey = `unit_progress_${grade}_${book}_${unit}`;
  
  try {
    const cached = await AsyncStorage.getItem(progressKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error("Error loading unit progress:", error);
  }
  
  return {
    grade,
    book,
    unit,
    totalWords: 0,
    learnedWords: 0,
    masteredWords: 0,
  };
}

// 更新学习进度
export async function updateUnitProgress(progress: UnitProgress): Promise<void> {
  const progressKey = `unit_progress_${progress.grade}_${progress.book}_${progress.unit}`;
  
  try {
    await AsyncStorage.setItem(progressKey, JSON.stringify(progress));
  } catch (error) {
    console.error("Error saving unit progress:", error);
  }
}

// 示例词汇数据（七年级上册 Unit 1）
export const SAMPLE_UNIT_DATA: TextbookUnit = {
  grade: 7,
  book: "7A",
  unit: 1,
  title: "My name's Gina",
  wordCount: 20,
  words: [
    {
      id: "7a_u1_name",
      word: "name",
      phonetic: "/neɪm/",
      grade: 7,
      book: "7A",
      unit: 1,
      definitions: [
        {
          partOfSpeech: "n.",
          meaning: "名字；名称",
          exampleSentence: "My name is Tom.",
        },
      ],
      examples: [
        "What's your name? 你叫什么名字？",
        "Her name is Mary. 她的名字是玛丽。",
      ],
      difficulty: "basic",
      frequency: "high",
    },
    {
      id: "7a_u1_nice",
      word: "nice",
      phonetic: "/naɪs/",
      grade: 7,
      book: "7A",
      unit: 1,
      definitions: [
        {
          partOfSpeech: "adj.",
          meaning: "令人愉快的；宜人的；好的",
          exampleSentence: "Nice to meet you!",
        },
      ],
      examples: [
        "It's a nice day today. 今天天气真好。",
        "She is a nice girl. 她是个好女孩。",
      ],
      difficulty: "basic",
      frequency: "high",
    },
    {
      id: "7a_u1_meet",
      word: "meet",
      phonetic: "/miːt/",
      grade: 7,
      book: "7A",
      unit: 1,
      definitions: [
        {
          partOfSpeech: "v.",
          meaning: "遇见；相逢；会面",
          exampleSentence: "I meet my friend at school.",
        },
      ],
      examples: [
        "Let's meet at 3 o'clock. 让我们3点见面。",
        "I met him yesterday. 我昨天遇见了他。",
      ],
      difficulty: "basic",
      frequency: "high",
    },
    {
      id: "7a_u1_hello",
      word: "hello",
      phonetic: "/həˈləʊ/",
      grade: 7,
      book: "7A",
      unit: 1,
      definitions: [
        {
          partOfSpeech: "interj.",
          meaning: "你好；喂（打招呼用语）",
          exampleSentence: "Hello! How are you?",
        },
      ],
      examples: [
        "Hello, everyone! 大家好！",
        "Say hello to your parents. 向你的父母问好。",
      ],
      difficulty: "basic",
      frequency: "high",
    },
    {
      id: "7a_u1_first",
      word: "first",
      phonetic: "/fɜːst/",
      grade: 7,
      book: "7A",
      unit: 1,
      definitions: [
        {
          partOfSpeech: "adj.",
          meaning: "第一的；最初的",
          exampleSentence: "My first name is John.",
        },
      ],
      examples: [
        "This is my first day at school. 这是我上学的第一天。",
        "She won first prize. 她获得了一等奖。",
      ],
      difficulty: "basic",
      frequency: "high",
    },
  ],
};
