/**
 * 语法练习题库
 * 为每个语法知识点提供精心设计的练习题
 */

export interface GrammarExercise {
  id: string;
  grammarPointId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const grammarExercises: GrammarExercise[] = [
  // ========== 一般现在时(be动词) ==========
  {
    id: 'ex-7a-u1-be-1',
    grammarPointId: '7a-u1-be',
    question: 'I ___ a student.',
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 0,
    explanation: 'I后面必须用am。主语I是第一人称单数,对应的be动词是am。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7a-u1-be-2',
    grammarPointId: '7a-u1-be',
    question: 'She ___ my friend.',
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 1,
    explanation: 'She是第三人称单数,后面用is。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7a-u1-be-3',
    grammarPointId: '7a-u1-be',
    question: 'They ___ happy.',
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 2,
    explanation: 'They是复数主语,后面用are。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7a-u1-be-4',
    grammarPointId: '7a-u1-be',
    question: '___ you ready?',
    options: ['Am', 'Is', 'Are', 'Be'],
    correctAnswer: 2,
    explanation: '疑问句将be动词提前,you后面用are。',
    difficulty: 'medium'
  },
  {
    id: 'ex-7a-u1-be-5',
    grammarPointId: '7a-u1-be',
    question: 'He ___ not at home.',
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 1,
    explanation: '否定句在be动词后加not,he是第三人称单数,用is。',
    difficulty: 'medium'
  },

  // ========== 主格代词 ==========
  {
    id: 'ex-7a-u1-pronouns-1',
    grammarPointId: '7a-u1-pronouns',
    question: '___ like English.',
    options: ['Me', 'I', 'My', 'Mine'],
    correctAnswer: 1,
    explanation: '作主语用主格代词I,不用宾格me。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7a-u1-pronouns-2',
    grammarPointId: '7a-u1-pronouns',
    question: '___ is my brother.',
    options: ['Him', 'His', 'He', 'Her'],
    correctAnswer: 2,
    explanation: '作主语用主格代词He,不用宾格him。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7a-u1-pronouns-3',
    grammarPointId: '7a-u1-pronouns',
    question: '___ are classmates.',
    options: ['Us', 'Our', 'We', 'Ours'],
    correctAnswer: 2,
    explanation: '作主语用主格代词We,表示"我们"。',
    difficulty: 'easy'
  },

  // ========== 一般现在时(实义动词) ==========
  {
    id: 'ex-7a-u2-do-1',
    grammarPointId: '7a-u2-do',
    question: 'He ___ basketball every day.',
    options: ['play', 'plays', 'playing', 'played'],
    correctAnswer: 1,
    explanation: '第三人称单数主语(he),动词要加-s,所以是plays。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7a-u2-do-2',
    grammarPointId: '7a-u2-do',
    question: 'They ___ to school by bus.',
    options: ['go', 'goes', 'going', 'went'],
    correctAnswer: 0,
    explanation: 'They是复数主语,动词用原形go。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7a-u2-do-3',
    grammarPointId: '7a-u2-do',
    question: 'She ___ like apples.',
    options: ["don't", "doesn't", "isn't", "aren't"],
    correctAnswer: 1,
    explanation: '第三人称单数否定用doesn\'t,后面动词用原形。',
    difficulty: 'medium'
  },
  {
    id: 'ex-7a-u2-do-4',
    grammarPointId: '7a-u2-do',
    question: '___ he speak English?',
    options: ['Do', 'Does', 'Is', 'Are'],
    correctAnswer: 1,
    explanation: '第三人称单数疑问句用Does开头。',
    difficulty: 'medium'
  },

  // ========== 名词所有格 ==========
  {
    id: 'ex-7a-u2-possessive-1',
    grammarPointId: '7a-u2-possessive',
    question: "This is ___ bag.",
    options: ['Mary', "Mary's", 'Marys', 'Marys\''],
    correctAnswer: 1,
    explanation: '单数名词所有格直接加\'s,所以是Mary\'s。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7a-u2-possessive-2',
    grammarPointId: '7a-u2-possessive',
    question: "The ___ room is big.",
    options: ['children', "children's", 'childrens', 'childrens\''],
    correctAnswer: 1,
    explanation: '不以s结尾的复数名词所有格加\'s,所以是children\'s。',
    difficulty: 'medium'
  },
  {
    id: 'ex-7a-u2-possessive-3',
    grammarPointId: '7a-u2-possessive',
    question: "The ___ books are on the desk.",
    options: ['students', "students'", 'student\'s', 'student'],
    correctAnswer: 1,
    explanation: '以s结尾的复数名词所有格只加\',所以是students\'。',
    difficulty: 'medium'
  },

  // ========== There be结构 ==========
  {
    id: 'ex-7a-u3-there-be-1',
    grammarPointId: '7a-u3-there-be',
    question: 'There ___ a book on the desk.',
    options: ['is', 'are', 'have', 'has'],
    correctAnswer: 0,
    explanation: 'There be结构中,a book是单数,所以用is。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7a-u3-there-be-2',
    grammarPointId: '7a-u3-there-be',
    question: 'There ___ three students in the classroom.',
    options: ['is', 'are', 'have', 'has'],
    correctAnswer: 1,
    explanation: 'three students是复数,所以用are。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7a-u3-there-be-3',
    grammarPointId: '7a-u3-there-be',
    question: 'There ___ a pen and two books.',
    options: ['is', 'are', 'have', 'has'],
    correctAnswer: 0,
    explanation: '就近原则:be动词与最近的名词(a pen)保持一致,所以用is。',
    difficulty: 'hard'
  },

  // ========== 方位介词 ==========
  {
    id: 'ex-7a-u3-prepositions-1',
    grammarPointId: '7a-u3-prepositions',
    question: 'The book is ___ the desk.',
    options: ['in', 'on', 'at', 'to'],
    correctAnswer: 1,
    explanation: '在桌面上用on,表示接触。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7a-u3-prepositions-2',
    grammarPointId: '7a-u3-prepositions',
    question: 'The cat is ___ the chair.',
    options: ['on', 'in', 'under', 'at'],
    correctAnswer: 2,
    explanation: '在椅子下面用under。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7a-u3-prepositions-3',
    grammarPointId: '7a-u3-prepositions',
    question: 'The library is ___ the classroom.',
    options: ['behind', 'in', 'on', 'at'],
    correctAnswer: 0,
    explanation: '在教室后面用behind。',
    difficulty: 'medium'
  },

  // ========== 连词 ==========
  {
    id: 'ex-7a-u4-conjunctions-1',
    grammarPointId: '7a-u4-conjunctions',
    question: 'I like English ___ math.',
    options: ['and', 'but', 'because', 'so'],
    correctAnswer: 0,
    explanation: '并列关系用and连接。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7a-u4-conjunctions-2',
    grammarPointId: '7a-u4-conjunctions',
    question: 'I like sports, ___ I don\'t like running.',
    options: ['and', 'but', 'because', 'so'],
    correctAnswer: 1,
    explanation: '转折关系用but,表示"但是"。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7a-u4-conjunctions-3',
    grammarPointId: '7a-u4-conjunctions',
    question: 'I like music ___ it\'s relaxing.',
    options: ['and', 'but', 'because', 'so'],
    correctAnswer: 2,
    explanation: 'because引导原因,表示"因为"。',
    difficulty: 'medium'
  },

  // ========== 情态动词can ==========
  {
    id: 'ex-7a-u5-can-1',
    grammarPointId: '7a-u5-can',
    question: 'I ___ swim.',
    options: ['can', 'cans', 'can to', 'to can'],
    correctAnswer: 0,
    explanation: 'can后直接加动词原形,没有人称变化。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7a-u5-can-2',
    grammarPointId: '7a-u5-can',
    question: 'She ___ play the piano.',
    options: ['can', 'cans', 'can to', 'to can'],
    correctAnswer: 0,
    explanation: 'can没有第三人称单数形式,所以还是can。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7a-u5-can-3',
    grammarPointId: '7a-u5-can',
    question: '___ you speak English?',
    options: ['Can', 'Do', 'Are', 'Is'],
    correctAnswer: 0,
    explanation: '情态动词can的疑问句,将can提到句首。',
    difficulty: 'medium'
  },

  // ========== 现在进行时(基础) ==========
  {
    id: 'ex-7b-u5-present-continuous-1',
    grammarPointId: '7b-u5-present-continuous',
    question: 'I ___ a book now.',
    options: ['read', 'reading', 'am reading', 'reads'],
    correctAnswer: 2,
    explanation: '现在进行时:be动词(am) + 动词-ing(reading)。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7b-u5-present-continuous-2',
    grammarPointId: '7b-u5-present-continuous',
    question: 'She ___ TV.',
    options: ['watch', 'watching', 'is watching', 'watches'],
    correctAnswer: 2,
    explanation: '第三人称单数用is + 动词-ing。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7b-u5-present-continuous-3',
    grammarPointId: '7b-u5-present-continuous',
    question: 'They ___ football.',
    options: ['play', 'playing', 'are playing', 'plays'],
    correctAnswer: 2,
    explanation: '复数主语用are + 动词-ing。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7b-u5-present-continuous-4',
    grammarPointId: '7b-u5-present-continuous',
    question: 'He is ___.',
    options: ['run', 'runs', 'runing', 'running'],
    correctAnswer: 3,
    explanation: 'run是重读闭音节,要双写n再加-ing。',
    difficulty: 'hard'
  },

  // ========== 一般过去时(基础) ==========
  {
    id: 'ex-7b-u7-simple-past-1',
    grammarPointId: '7b-u7-simple-past',
    question: 'I ___ basketball yesterday.',
    options: ['play', 'plays', 'played', 'playing'],
    correctAnswer: 2,
    explanation: '一般过去时,规则动词加-ed,所以是played。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7b-u7-simple-past-2',
    grammarPointId: '7b-u7-simple-past',
    question: 'She ___ her grandma last week.',
    options: ['visit', 'visits', 'visited', 'visiting'],
    correctAnswer: 2,
    explanation: '过去时间(last week)用过去式visited。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7b-u7-simple-past-3',
    grammarPointId: '7b-u7-simple-past',
    question: 'We ___ English two hours ago.',
    options: ['study', 'studies', 'studied', 'studying'],
    correctAnswer: 2,
    explanation: '辅音字母+y结尾,变y为i加-ed,所以是studied。',
    difficulty: 'medium'
  },

  // ========== 一般过去时(进阶) ==========
  {
    id: 'ex-7b-u8-simple-past-1',
    grammarPointId: '7b-u8-simple-past-2',
    question: 'I ___ to the park yesterday.',
    options: ['go', 'goes', 'went', 'going'],
    correctAnswer: 2,
    explanation: 'go的过去式是went,不规则变化。',
    difficulty: 'medium'
  },
  {
    id: 'ex-7b-u8-simple-past-2',
    grammarPointId: '7b-u8-simple-past-2',
    question: 'She ___ a movie last night.',
    options: ['see', 'sees', 'saw', 'seeing'],
    correctAnswer: 2,
    explanation: 'see的过去式是saw,不规则变化。',
    difficulty: 'medium'
  },
  {
    id: 'ex-7b-u8-simple-past-3',
    grammarPointId: '7b-u8-simple-past-2',
    question: '___ you go there?',
    options: ['Do', 'Does', 'Did', 'Are'],
    correctAnswer: 2,
    explanation: '一般过去时疑问句用Did,后面动词用原形。',
    difficulty: 'medium'
  },
  {
    id: 'ex-7b-u8-simple-past-4',
    grammarPointId: '7b-u8-simple-past-2',
    question: 'We ___ go to school yesterday.',
    options: ["don't", "doesn't", "didn't", "aren't"],
    correctAnswer: 2,
    explanation: '一般过去时否定用didn\'t,后面动词用原形。',
    difficulty: 'medium'
  },

  // ========== 物主代词 ==========
  {
    id: 'ex-7b-u3-possessive-pronouns-1',
    grammarPointId: '7b-u3-possessive-pronouns',
    question: 'This is ___ book.',
    options: ['I', 'me', 'my', 'mine'],
    correctAnswer: 2,
    explanation: '名词前用形容词性物主代词my。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7b-u3-possessive-pronouns-2',
    grammarPointId: '7b-u3-possessive-pronouns',
    question: 'The book is ___.',
    options: ['I', 'me', 'my', 'mine'],
    correctAnswer: 3,
    explanation: '单独使用时用名词性物主代词mine。',
    difficulty: 'easy'
  },
  {
    id: 'ex-7b-u3-possessive-pronouns-3',
    grammarPointId: '7b-u3-possessive-pronouns',
    question: 'Is this your bag? Yes, it\'s ___.',
    options: ['I', 'me', 'my', 'mine'],
    correctAnswer: 3,
    explanation: '回答时单独使用名词性物主代词mine。',
    difficulty: 'medium'
  },

  // ========== 频率副词 ==========
  {
    id: 'ex-7b-u3-adverbs-1',
    grammarPointId: '7b-u3-adverbs',
    question: 'I ___ get up at 7.',
    options: ['always', 'am always', 'always am', 'be always'],
    correctAnswer: 0,
    explanation: '频率副词放在实义动词前,所以是always get up。',
    difficulty: 'medium'
  },
  {
    id: 'ex-7b-u3-adverbs-2',
    grammarPointId: '7b-u3-adverbs',
    question: 'She ___ late.',
    options: ['usually is', 'is usually', 'usually be', 'be usually'],
    correctAnswer: 1,
    explanation: '频率副词放在be动词后,所以是is usually。',
    difficulty: 'medium'
  },
  {
    id: 'ex-7b-u3-adverbs-3',
    grammarPointId: '7b-u3-adverbs',
    question: 'He ___ eats breakfast.',
    options: ['never', 'is never', 'never is', 'be never'],
    correctAnswer: 0,
    explanation: '频率副词放在实义动词前,所以是never eats。',
    difficulty: 'medium'
  },
];

// 根据语法点ID获取练习题
export function getExercisesByGrammarPoint(grammarPointId: string): GrammarExercise[] {
  return grammarExercises.filter(ex => ex.grammarPointId === grammarPointId);
}

// 根据难度获取练习题
export function getExercisesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): GrammarExercise[] {
  return grammarExercises.filter(ex => ex.difficulty === difficulty);
}

// 随机获取N道练习题
export function getRandomExercises(grammarPointId: string, count: number): GrammarExercise[] {
  const exercises = getExercisesByGrammarPoint(grammarPointId);
  const shuffled = [...exercises].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
