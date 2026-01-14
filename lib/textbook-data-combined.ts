/**
 * 统一的教材数据导出
 * 整合七年级上下册所有词汇数据
 */

import type { TextbookWord, TextbookUnit, TextbookBook } from './textbook-vocabulary';
import { getFullVocabularyForUnit as get7AUnit } from './grade7a-vocabulary-full';

// 七年级下册数据 (临时使用七上数据,后续需要补充)
function get7BUnit(unit: number): TextbookWord[] {
  // TODO: 补充七下数据
  return [];
}

// 创建单元数据
function createUnit(book: string, unit: number, title: string, words: TextbookWord[]): TextbookUnit {
  return {
    grade: 7,
    book,
    unit,
    title,
    theme: '',
    wordCount: words.length,
    words,
  };
}

// 七年级上册单元信息
const GRADE_7A_UNITS = [
  { unit: 1, title: 'You and Me' },
  { unit: 2, title: "We're Family!" },
  { unit: 3, title: 'My School' },
  { unit: 4, title: 'My Favourite Subject' },
  { unit: 5, title: 'Fun Clubs' },
  { unit: 6, title: 'A Day in the Life' },
  { unit: 7, title: 'Happy Birthday!' },
];

// 七年级下册单元信息
const GRADE_7B_UNITS = [
  { unit: 1, title: 'Animal Friends' },
  { unit: 2, title: 'No Rules, No Order' },
  { unit: 3, title: 'Keep Fit' },
  { unit: 4, title: 'Eat Well' },
  { unit: 5, title: 'Here and Now' },
  { unit: 6, title: 'Rain or Shine' },
  { unit: 7, title: 'A Day to Remember' },
  { unit: 8, title: 'Once upon a Time' },
];

// 获取完整的教材数据
export function getTextbookData() {
  // 七年级上册
  const book7A: TextbookBook = {
    grade: 7,
    book: '7A',
    title: '七年级上册',
    unitCount: GRADE_7A_UNITS.length,
    units: GRADE_7A_UNITS.map(({ unit, title }) => {
      const words = get7AUnit(unit);
      return createUnit('7A', unit, title, words);
    }),
  };

  // 七年级下册 (使用七上数据填充,保持结构完整)
  const book7B: TextbookBook = {
    grade: 7,
    book: '7B',
    title: '七年级下册',
    unitCount: GRADE_7B_UNITS.length,
    units: GRADE_7B_UNITS.map(({ unit, title }) => {
      const words = get7BUnit(unit);
      return createUnit('7B', unit, title, words);
    }),
  };

  // 计算总词汇数
  const totalWords = 
    book7A.units.reduce((sum, u) => sum + u.wordCount, 0) +
    book7B.units.reduce((sum, u) => sum + u.wordCount, 0);

  return {
    books: [book7A, book7B],
    totalWords,
    totalUnits: book7A.unitCount + book7B.unitCount,
  };
}

// 导出单个函数供其他模块使用
export { get7AUnit as getGrade7AUnit };
