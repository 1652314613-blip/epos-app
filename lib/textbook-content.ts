/**
 * 七年级上册英语教材学习内容
 * 
 * 基于人教版教材知识点结构的原创内容
 * 所有例句、练习题均为独立创作
 */

export interface GrammarPoint {
  id: string;
  title: string;
  description: string;
  rules: string[];
  examples: string[];
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  type: 'choice' | 'fill' | 'correct';
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
}

export interface Vocabulary {
  word: string;
  partOfSpeech: string;
  meaning: string;
  exampleSentence: string;
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  theme: string;
  skills: {
    listening: string;
    speaking: string;
    reading: string;
    writing: string;
    grammar: string;
  };
  grammarPoints: GrammarPoint[];
  vocabulary: Vocabulary[];
}

/**
 * 七年级上册全部7个单元内容
 */
export const grade7Units: Unit[] = [
  {
    id: 'unit1',
    number: 1,
    title: 'You and Me',
    theme: '问候与自我介绍',
    skills: {
      listening: '听懂问候和自我介绍对话',
      speaking: '进行自我介绍，询问他人信息',
      reading: '阅读个人信息介绍文本',
      writing: '书写自我介绍短文',
      grammar: 'Be动词用法，特殊疑问句'
    },
    grammarPoints: [
      {
        id: 'unit1-be-verb',
        title: 'Be动词的基本用法',
        description: 'be动词（am/is/are）用于描述状态、身份和位置',
        rules: [
          'I am (I\'m) - 我是',
          'You/We/They are (You\'re/We\'re/They\'re) - 你/我们/他们是',
          'He/She/It is (He\'s/She\'s/It\'s) - 他/她/它是',
          '否定形式：在be动词后加not',
          '疑问形式：将be动词提到句首'
        ],
        examples: [
          'I am a student from Beijing.',
          'She is in Grade 7, Class 3.',
          'We are good friends.',
          'Are you from London?',
          'He is not my classmate.'
        ],
        exercises: [
          {
            id: 'ex1-1',
            type: 'choice',
            question: 'My name ___ Zhang Wei.',
            options: ['am', 'is', 'are'],
            answer: 'is',
            explanation: '主语"My name"是第三人称单数，使用is'
          },
          {
            id: 'ex1-2',
            type: 'fill',
            question: 'I ___ 13 years old.',
            answer: 'am',
            explanation: '主语是I，使用am'
          }
        ]
      },
      {
        id: 'unit1-wh-questions',
        title: '特殊疑问句',
        description: '使用疑问词提问获取具体信息',
        rules: [
          'What - 什么（询问事物）',
          'Where - 哪里（询问地点）',
          'How - 如何（询问方式、状态）',
          '结构：疑问词 + be动词 + 主语 + 其他？'
        ],
        examples: [
          'What is your name?',
          'Where are you from?',
          'How do you spell your name?',
          'What class are you in?'
        ],
        exercises: [
          {
            id: 'ex1-3',
            type: 'choice',
            question: '___ is your English teacher?',
            options: ['What', 'Where', 'Who'],
            answer: 'Who',
            explanation: '询问人物身份用Who'
          }
        ]
      }
    ],
    vocabulary: [
      { word: 'hello', partOfSpeech: 'interjection', meaning: '你好', exampleSentence: 'Hello! Nice to meet you.' },
      { word: 'name', partOfSpeech: 'noun', meaning: '名字', exampleSentence: 'My name is Li Hua.' },
      { word: 'class', partOfSpeech: 'noun', meaning: '班级', exampleSentence: 'I am in Class 5.' },
      { word: 'grade', partOfSpeech: 'noun', meaning: '年级', exampleSentence: 'She is in Grade 7.' },
      { word: 'from', partOfSpeech: 'preposition', meaning: '来自', exampleSentence: 'I am from Shanghai.' }
    ]
  },
  {
    id: 'unit2',
    number: 2,
    title: 'We\'re Family!',
    theme: '家庭成员',
    skills: {
      listening: '听懂家庭成员介绍',
      speaking: '介绍家庭成员，描述家庭关系',
      reading: '阅读家庭介绍文章',
      writing: '写作家庭介绍短文',
      grammar: '指示代词，名词所有格'
    },
    grammarPoints: [
      {
        id: 'unit2-demonstratives',
        title: '指示代词',
        description: '用于指示人或物的代词',
        rules: [
          'this - 这个（单数，近处）',
          'that - 那个（单数，远处）',
          'these - 这些（复数，近处）',
          'those - 那些（复数，远处）'
        ],
        examples: [
          'This is my mother.',
          'That is my school.',
          'These are my parents.',
          'Those are my classmates.'
        ],
        exercises: [
          {
            id: 'ex2-1',
            type: 'choice',
            question: '___ is my younger sister.',
            options: ['This', 'These', 'Those'],
            answer: 'This',
            explanation: '指示单数用this或that'
          }
        ]
      },
      {
        id: 'unit2-possessive',
        title: '名词所有格',
        description: '表示所属关系',
        rules: [
          '单数名词 + \'s 表示"...的"',
          '以s结尾的复数名词 + \' 即可',
          '不以s结尾的复数名词 + \'s'
        ],
        examples: [
          'This is my father\'s car.',
          'Lucy\'s brother is 10 years old.',
          'The teachers\' office is on the second floor.',
          'The children\'s playground is very big.'
        ],
        exercises: [
          {
            id: 'ex2-2',
            type: 'fill',
            question: 'This is ___ (Mary) bag.',
            answer: 'Mary\'s',
            explanation: '单数名词加\'s表示所属'
          }
        ]
      }
    ],
    vocabulary: [
      { word: 'family', partOfSpeech: 'noun', meaning: '家庭', exampleSentence: 'I have a happy family.' },
      { word: 'parent', partOfSpeech: 'noun', meaning: '父母之一', exampleSentence: 'These are my parents.' },
      { word: 'father', partOfSpeech: 'noun', meaning: '父亲', exampleSentence: 'My father is a teacher.' },
      { word: 'mother', partOfSpeech: 'noun', meaning: '母亲', exampleSentence: 'My mother works in a hospital.' },
      { word: 'sister', partOfSpeech: 'noun', meaning: '姐妹', exampleSentence: 'I have one sister.' },
      { word: 'brother', partOfSpeech: 'noun', meaning: '兄弟', exampleSentence: 'My brother is 8 years old.' }
    ]
  },
  {
    id: 'unit3',
    number: 3,
    title: 'My School',
    theme: '学校设施与方位',
    skills: {
      listening: '听懂学校设施描述和方位说明',
      speaking: '描述学校布局和位置关系',
      reading: '阅读学校介绍文本',
      writing: '写作学校设施介绍',
      grammar: 'There be句型，方位介词'
    },
    grammarPoints: [
      {
        id: 'unit3-there-be',
        title: 'There be 句型',
        description: '表示"某处有某物"',
        rules: [
          'There is + 单数名词/不可数名词',
          'There are + 复数名词',
          '否定：There is/are not...',
          '疑问：Is/Are there...?'
        ],
        examples: [
          'There is a library in our school.',
          'There are 45 students in my class.',
          'Is there a computer room?',
          'There aren\'t any trees behind the building.'
        ],
        exercises: [
          {
            id: 'ex3-1',
            type: 'choice',
            question: 'There ___ a blackboard in every classroom.',
            options: ['is', 'are', 'am'],
            answer: 'is',
            explanation: 'blackboard是单数，用is'
          }
        ]
      },
      {
        id: 'unit3-prepositions',
        title: '方位介词',
        description: '描述位置关系的介词',
        rules: [
          'in - 在...里面',
          'on - 在...上面',
          'behind - 在...后面',
          'in front of - 在...前面',
          'next to - 在...旁边',
          'between - 在...之间',
          'across from - 在...对面'
        ],
        examples: [
          'The library is behind the teaching building.',
          'My desk is next to the window.',
          'The gym is between the canteen and the lab.'
        ],
        exercises: [
          {
            id: 'ex3-2',
            type: 'choice',
            question: 'The playground is ___ the school gate.',
            options: ['in front of', 'between', 'at'],
            answer: 'in front of',
            explanation: '操场在校门前面'
          }
        ]
      }
    ],
    vocabulary: [
      { word: 'classroom', partOfSpeech: 'noun', meaning: '教室', exampleSentence: 'Our classroom is on the third floor.' },
      { word: 'library', partOfSpeech: 'noun', meaning: '图书馆', exampleSentence: 'I often read books in the library.' },
      { word: 'building', partOfSpeech: 'noun', meaning: '建筑物', exampleSentence: 'There are four buildings in our school.' },
      { word: 'office', partOfSpeech: 'noun', meaning: '办公室', exampleSentence: 'The teachers\' office is next to our classroom.' }
    ]
  },
  {
    id: 'unit4',
    number: 4,
    title: 'My Favourite Subject',
    theme: '学科与喜好',
    skills: {
      listening: '听懂学科讨论和喜好表达',
      speaking: '表达对学科的喜好和原因',
      reading: '阅读学科介绍和课程表',
      writing: '写作最喜欢的学科及原因',
      grammar: '一般现在时，Why/Because，连词'
    },
    grammarPoints: [
      {
        id: 'unit4-why-because',
        title: 'Why和Because的用法',
        description: '询问原因和给出理由',
        rules: [
          'Why - 为什么（询问原因）',
          'Because - 因为（回答原因）',
          '结构：Why do you...? Because...'
        ],
        examples: [
          'Why do you like maths? Because it\'s interesting.',
          'Why is English your favourite subject? Because it\'s useful.',
          'I like PE because it\'s fun.'
        ],
        exercises: [
          {
            id: 'ex4-1',
            type: 'fill',
            question: 'Why do you like art? ___ it\'s creative.',
            answer: 'Because',
            explanation: '回答Why提问用Because'
          }
        ]
      },
      {
        id: 'unit4-conjunctions',
        title: '连词 and, but, because',
        description: '连接句子和表达关系',
        rules: [
          'and - 和，表示并列',
          'but - 但是，表示转折',
          'because - 因为，表示原因'
        ],
        examples: [
          'I like maths and science.',
          'History is interesting, but it\'s hard.',
          'I like PE because it\'s exciting.'
        ],
        exercises: [
          {
            id: 'ex4-2',
            type: 'choice',
            question: 'I like music, ___ I can\'t play any instruments.',
            options: ['and', 'but', 'because'],
            answer: 'but',
            explanation: '前后句是转折关系，用but'
          }
        ]
      }
    ],
    vocabulary: [
      { word: 'subject', partOfSpeech: 'noun', meaning: '学科', exampleSentence: 'My favourite subject is English.' },
      { word: 'maths', partOfSpeech: 'noun', meaning: '数学', exampleSentence: 'Maths is useful but hard.' },
      { word: 'history', partOfSpeech: 'noun', meaning: '历史', exampleSentence: 'I have history class on Tuesday.' },
      { word: 'geography', partOfSpeech: 'noun', meaning: '地理', exampleSentence: 'Geography is interesting.' },
      { word: 'interesting', partOfSpeech: 'adjective', meaning: '有趣的', exampleSentence: 'Science is very interesting.' },
      { word: 'useful', partOfSpeech: 'adjective', meaning: '有用的', exampleSentence: 'English is useful for our future.' }
    ]
  },
  {
    id: 'unit5',
    number: 5,
    title: 'Fun Clubs',
    theme: '课外活动与俱乐部',
    skills: {
      listening: '听懂俱乐部介绍和能力讨论',
      speaking: '讨论俱乐部活动，表达能力',
      reading: '阅读俱乐部招募信息',
      writing: '写作俱乐部申请或介绍',
      grammar: '情态动词can的用法'
    },
    grammarPoints: [
      {
        id: 'unit5-can',
        title: '情态动词can',
        description: '表示能力和请求',
        rules: [
          'can + 动词原形（表示能力）',
          '否定：cannot / can\'t',
          '疑问：Can you...?',
          '乐器前加the：play the guitar'
        ],
        examples: [
          'I can play the piano.',
          'She can\'t play basketball.',
          'Can you sing well?',
          'He can play the drums.'
        ],
        exercises: [
          {
            id: 'ex5-1',
            type: 'choice',
            question: 'Can you play ___ violin?',
            options: ['a', 'the', '/'],
            answer: 'the',
            explanation: '乐器前要加the'
          },
          {
            id: 'ex5-2',
            type: 'fill',
            question: 'I ___ play chess, but I can\'t play it well.',
            answer: 'can',
            explanation: '表示能力用can'
          }
        ]
      }
    ],
    vocabulary: [
      { word: 'club', partOfSpeech: 'noun', meaning: '俱乐部', exampleSentence: 'I want to join the music club.' },
      { word: 'chess', partOfSpeech: 'noun', meaning: '国际象棋', exampleSentence: 'Can you play chess?' },
      { word: 'drama', partOfSpeech: 'noun', meaning: '戏剧', exampleSentence: 'The drama club is very popular.' },
      { word: 'guitar', partOfSpeech: 'noun', meaning: '吉他', exampleSentence: 'He can play the guitar very well.' },
      { word: 'violin', partOfSpeech: 'noun', meaning: '小提琴', exampleSentence: 'She is learning to play the violin.' },
      { word: 'drums', partOfSpeech: 'noun', meaning: '鼓', exampleSentence: 'I can play the drums.' }
    ]
  },
  {
    id: 'unit6',
    number: 6,
    title: 'A Day in the Life',
    theme: '日常作息与时间',
    skills: {
      listening: '听懂日常作息描述',
      speaking: '描述日常活动和时间安排',
      reading: '阅读日常生活记叙文',
      writing: '写作自己的日常作息安排',
      grammar: '时间表达，频度副词'
    },
    grammarPoints: [
      {
        id: 'unit6-time',
        title: '时间表达',
        description: '如何用英语表达时间',
        rules: [
          'at + 具体时刻（at 7:30, at noon）',
          'in + 时间段（in the morning, in December）',
          'on + 具体日期（on Monday, on May 1st）',
          'after/before + 时间/事件'
        ],
        examples: [
          'I get up at 7:00 a.m.',
          'We have lunch at 12:00.',
          'School begins at 9:00 in the morning.',
          'I do homework after dinner.'
        ],
        exercises: [
          {
            id: 'ex6-1',
            type: 'choice',
            question: 'I usually go to bed ___ 9:30 p.m.',
            options: ['at', 'in', 'on'],
            answer: 'at',
            explanation: '具体时刻前用at'
          }
        ]
      },
      {
        id: 'unit6-frequency',
        title: '频度副词',
        description: '表示动作发生的频率',
        rules: [
          'always - 总是（100%）',
          'usually - 通常（80%）',
          'often - 经常（60%）',
          'sometimes - 有时（40%）',
          'never - 从不（0%）',
          '位置：频度副词通常放在be动词后，实义动词前'
        ],
        examples: [
          'I usually get up at 7:00.',
          'She always does her homework after school.',
          'We often play sports on weekends.',
          'He is never late for class.'
        ],
        exercises: [
          {
            id: 'ex6-2',
            type: 'choice',
            question: 'I ___ go to the library on Sundays.',
            options: ['always', 'never', 'often'],
            answer: 'often',
            explanation: '根据语境选择合适的频度副词'
          }
        ]
      }
    ],
    vocabulary: [
      { word: 'routine', partOfSpeech: 'noun', meaning: '日常惯例', exampleSentence: 'This is my daily routine.' },
      { word: 'breakfast', partOfSpeech: 'noun', meaning: '早餐', exampleSentence: 'I have breakfast at 7:30.' },
      { word: 'lunch', partOfSpeech: 'noun', meaning: '午餐', exampleSentence: 'We have lunch at school.' },
      { word: 'dinner', partOfSpeech: 'noun', meaning: '晚餐', exampleSentence: 'My family has dinner together.' },
      { word: 'homework', partOfSpeech: 'noun', meaning: '家庭作业', exampleSentence: 'I do my homework after dinner.' }
    ]
  },
  {
    id: 'unit7',
    number: 7,
    title: 'Happy Birthday!',
    theme: '生日与庆祝',
    skills: {
      listening: '听懂生日日期和庆祝活动讨论',
      speaking: '询问和表达生日日期，讨论庆祝方式',
      reading: '阅读生日相关文本',
      writing: '写作生日邀请或庆祝描述',
      grammar: '日期表达，序数词'
    },
    grammarPoints: [
      {
        id: 'unit7-dates',
        title: '日期表达',
        description: '如何用英语表达日期',
        rules: [
          '月份：January, February, March...',
          '序数词：1st, 2nd, 3rd, 4th...',
          '日期格式：月份 + 序数词（May 1st）',
          '询问生日：When is your birthday?'
        ],
        examples: [
          'My birthday is on June 12th.',
          'When is your birthday? It\'s on March 3rd.',
          'Children\'s Day is on June 1st.',
          'New Year\'s Day is on January 1st.'
        ],
        exercises: [
          {
            id: 'ex7-1',
            type: 'choice',
            question: 'My birthday is ___ October.',
            options: ['at', 'in', 'on'],
            answer: 'in',
            explanation: '月份前用in'
          },
          {
            id: 'ex7-2',
            type: 'fill',
            question: 'When is your birthday? It\'s on May ___. (5)',
            answer: '5th',
            explanation: '日期用序数词表示'
          }
        ]
      },
      {
        id: 'unit7-ordinal',
        title: '序数词',
        description: '表示顺序的数词',
        rules: [
          '1st (first), 2nd (second), 3rd (third)',
          '4th-19th：基数词 + th',
          '20th, 30th...：基数词变y为ie + th',
          '21st, 22nd, 23rd...：十位用基数词，个位用序数词'
        ],
        examples: [
          'Today is the first day of school.',
          'My classroom is on the second floor.',
          'Her birthday is on the twenty-first of May.'
        ],
        exercises: [
          {
            id: 'ex7-3',
            type: 'choice',
            question: 'December is the ___ month of the year.',
            options: ['twelve', 'twelfth', 'twentieth'],
            answer: 'twelfth',
            explanation: '第十二个月，用序数词twelfth'
          }
        ]
      }
    ],
    vocabulary: [
      { word: 'birthday', partOfSpeech: 'noun', meaning: '生日', exampleSentence: 'When is your birthday?' },
      { word: 'celebrate', partOfSpeech: 'verb', meaning: '庆祝', exampleSentence: 'We celebrate birthdays with cake.' },
      { word: 'party', partOfSpeech: 'noun', meaning: '聚会', exampleSentence: 'I will have a birthday party.' },
      { word: 'gift', partOfSpeech: 'noun', meaning: '礼物', exampleSentence: 'This is a birthday gift for you.' },
      { word: 'January', partOfSpeech: 'noun', meaning: '一月', exampleSentence: 'January is the first month.' },
      { word: 'February', partOfSpeech: 'noun', meaning: '二月', exampleSentence: 'Spring Festival is usually in February.' }
    ]
  }
];

/**
 * 根据单元ID获取单元内容
 */
export function getUnitById(unitId: string): Unit | undefined {
  return grade7Units.find(unit => unit.id === unitId);
}

/**
 * 根据语法点ID获取语法点
 */
export function getGrammarPointById(grammarId: string): GrammarPoint | undefined {
  for (const unit of grade7Units) {
    const grammar = unit.grammarPoints.find(g => g.id === grammarId);
    if (grammar) return grammar;
  }
  return undefined;
}

/**
 * 获取所有单元列表（用于单元选择界面）
 */
export function getAllUnits() {
  return grade7Units.map(unit => ({
    id: unit.id,
    number: unit.number,
    title: unit.title,
    theme: unit.theme,
    grammarCount: unit.grammarPoints.length,
    vocabularyCount: unit.vocabulary.length
  }));
}
