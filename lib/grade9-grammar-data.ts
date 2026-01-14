// 九年级全册语法知识点数据
// 基于人教版义务教育教科书·英语九年级全册

export interface Grade9GrammarPoint {
  id: string;
  unit: number;
  title: string;
  titleCn: string;
  category: string;
  difficulty: 'intermediate' | 'advanced';
  examTags?: Array<'中考频次' | '高考考点'>;
  description: string;
  keyPoints: string[];
  examples: Array<{
    en: string;
    cn: string;
  }>;
  commonMistakes: Array<{
    wrong: string;
    correct: string;
    explanation: string;
  }>;
}

export const grade9GrammarPoints: Grade9GrammarPoint[] = [
  {
    id: 'g9-u1-by-gerund',
    unit: 1,
    title: 'Verb + by with gerund',
    titleCn: '动词 + by + 动名词',
    category: '非谓语动词',
    difficulty: 'intermediate',
    examTags: ['中考频次'],
    description: '使用"by + 动名词"结构来表达做某事的方法或手段。这是描述学习方法、解决问题方式的常用句型。',
    keyPoints: [
      'by后面必须接动名词(V-ing形式)',
      '表示"通过...方式/方法"',
      '常用于回答How问题',
      '可以连用多个by短语表达多种方法'
    ],
    examples: [
      {
        en: 'I learn English by watching English movies.',
        cn: '我通过看英文电影来学英语。'
      },
      {
        en: 'She improves her pronunciation by reading aloud.',
        cn: '她通过大声朗读来提高发音。'
      },
      {
        en: 'We can remember words by making word cards.',
        cn: '我们可以通过制作单词卡来记单词。'
      }
    ],
    commonMistakes: [
      {
        wrong: 'I learn by watch movies.',
        correct: 'I learn by watching movies.',
        explanation: 'by后面必须用动名词形式,不能用动词原形'
      },
      {
        wrong: 'She studies by to read books.',
        correct: 'She studies by reading books.',
        explanation: 'by后面不能接不定式,只能接动名词'
      }
    ]
  },
  {
    id: 'g9-u2-objective-clauses',
    unit: 2,
    title: 'Objective clauses with that/if/whether',
    titleCn: '宾语从句(that/if/whether引导)',
    category: '从句',
    difficulty: 'advanced',
    examTags: ['中考频次', '高考考点'],
    description: '宾语从句是在复合句中作宾语的从句,可以由that、if或whether引导。掌握宾语从句的语序和时态是关键。',
    keyPoints: [
      'that引导陈述句作宾语,that可省略',
      'if/whether引导一般疑问句作宾语,表示"是否"',
      '宾语从句用陈述语序(主语+谓语)',
      '主句过去时,从句用相应的过去时态',
      '客观真理用一般现在时'
    ],
    examples: [
      {
        en: 'I think (that) mooncakes are delicious.',
        cn: '我认为月饼很美味。'
      },
      {
        en: 'I wonder if/whether the Water Festival is fun.',
        cn: '我想知道泼水节是否有趣。'
      },
      {
        en: 'She asked whether I liked Chinese festivals.',
        cn: '她问我是否喜欢中国节日。'
      }
    ],
    commonMistakes: [
      {
        wrong: 'I don\'t know where is the post office.',
        correct: 'I don\'t know where the post office is.',
        explanation: '宾语从句必须用陈述语序,不能用疑问语序'
      },
      {
        wrong: 'He asked me that I am happy.',
        correct: 'He asked me if/whether I was happy.',
        explanation: '一般疑问句作宾语要用if/whether,不用that'
      }
    ]
  },
  {
    id: 'g9-u2-exclamations',
    unit: 2,
    title: 'Exclamatory statements',
    titleCn: '感叹句',
    category: '句型',
    difficulty: 'intermediate',
    examTags: ['中考频次'],
    description: '感叹句用来表达强烈的情感。主要有What和How两种句型,要注意它们后面跟的词性不同。',
    keyPoints: [
      'What + (a/an) + 形容词 + 名词 + 主语 + 谓语!',
      'How + 形容词/副词 + 主语 + 谓语!',
      'What后接名词,How后接形容词或副词',
      '主语和谓语可以省略'
    ],
    examples: [
      {
        en: 'What fun the Water Festival is!',
        cn: '泼水节多有趣啊!'
      },
      {
        en: 'What a beautiful festival it is!',
        cn: '多么美丽的节日啊!'
      },
      {
        en: 'How delicious the mooncakes are!',
        cn: '月饼多美味啊!'
      }
    ],
    commonMistakes: [
      {
        wrong: 'What delicious the food is!',
        correct: 'How delicious the food is!',
        explanation: 'delicious是形容词,应该用How,不用What'
      },
      {
        wrong: 'How a nice day!',
        correct: 'What a nice day!',
        explanation: 'day是名词,应该用What,不用How'
      }
    ]
  },
  {
    id: 'g9-u3-wh-questions',
    unit: 3,
    title: 'Objective clauses with wh- questions',
    titleCn: 'wh-引导的宾语从句',
    category: '从句',
    difficulty: 'advanced',
    examTags: ['中考频次', '高考考点'],
    description: '特殊疑问句作宾语时,保留疑问词(where, when, what, how等),但要改为陈述语序。常用于礼貌询问信息。',
    keyPoints: [
      '保留疑问词(where/when/what/how/why等)',
      '改为陈述语序(疑问词+主语+谓语)',
      '时态遵循宾语从句规则',
      '常与Could you tell me等礼貌用语连用'
    ],
    examples: [
      {
        en: 'Could you please tell me where the restrooms are?',
        cn: '你能告诉我洗手间在哪里吗?'
      },
      {
        en: 'I don\'t know how to get to the post office.',
        cn: '我不知道怎么去邮局。'
      },
      {
        en: 'Do you know when the bookstore closes?',
        cn: '你知道书店什么时候关门吗?'
      }
    ],
    commonMistakes: [
      {
        wrong: 'Can you tell me where is the bank?',
        correct: 'Can you tell me where the bank is?',
        explanation: '宾语从句要用陈述语序,不能用疑问语序'
      },
      {
        wrong: 'I wonder how can I get there.',
        correct: 'I wonder how I can get there.',
        explanation: '疑问词后面要用陈述语序'
      }
    ]
  },
  {
    id: 'g9-u4-used-to',
    unit: 4,
    title: 'Used to',
    titleCn: '过去常常(used to)',
    category: '时态',
    difficulty: 'intermediate',
    examTags: ['中考频次'],
    description: 'used to表示过去的习惯或状态,强调现在已经不再如此。要注意与be used to doing(习惯于做某事)的区别。',
    keyPoints: [
      'used to + 动词原形',
      '表示过去的习惯或状态,现在不再如此',
      '否定式: didn\'t use to / used not to',
      '疑问式: Did...use to...?',
      '区别: be used to doing(习惯于)'
    ],
    examples: [
      {
        en: 'I used to be afraid of the dark.',
        cn: '我过去害怕黑暗。(现在不怕了)'
      },
      {
        en: 'She used to have long hair.',
        cn: '她过去留长发。(现在不留了)'
      },
      {
        en: 'Did you use to wear glasses?',
        cn: '你过去戴眼镜吗?'
      }
    ],
    commonMistakes: [
      {
        wrong: 'I used to being shy.',
        correct: 'I used to be shy.',
        explanation: 'used to后面接动词原形,不接动名词'
      },
      {
        wrong: 'He didn\'t used to like tests.',
        correct: 'He didn\'t use to like tests.',
        explanation: '否定式中used要变回use'
      }
    ]
  },
  {
    id: 'g9-u5-passive-present',
    unit: 5,
    title: 'Passive voice (present tense)',
    titleCn: '被动语态(一般现在时)',
    category: '语态',
    difficulty: 'advanced',
    examTags: ['中考频次', '高考考点'],
    description: '被动语态表示主语是动作的承受者。一般现在时的被动语态结构为"am/is/are + 过去分词"。',
    keyPoints: [
      '结构: am/is/are + 过去分词',
      '表示经常性、习惯性的被动动作',
      '否定式: am/is/are + not + 过去分词',
      '疑问式: Am/Is/Are + 主语 + 过去分词?',
      '注意主谓一致'
    ],
    examples: [
      {
        en: 'These shirts are made of cotton.',
        cn: '这些衬衫是棉制的。'
      },
      {
        en: 'Tea is grown in many parts of China.',
        cn: '中国许多地方种植茶叶。'
      },
      {
        en: 'English is spoken all over the world.',
        cn: '全世界都说英语。'
      }
    ],
    commonMistakes: [
      {
        wrong: 'The shirts is made of silk.',
        correct: 'The shirts are made of silk.',
        explanation: '主语是复数,be动词要用are'
      },
      {
        wrong: 'Tea plants grow on mountains.',
        correct: 'Tea plants are grown on mountains.',
        explanation: '茶树是被种植的,要用被动语态'
      }
    ]
  },
  {
    id: 'g9-u6-passive-past',
    unit: 6,
    title: 'Passive voice (past tense)',
    titleCn: '被动语态(一般过去时)',
    category: '语态',
    difficulty: 'advanced',
    examTags: ['中考频次', '高考考点'],
    description: '一般过去时的被动语态表示过去发生的被动动作。结构为"was/were + 过去分词"。常用于描述发明历史。',
    keyPoints: [
      '结构: was/were + 过去分词',
      '表示过去的被动动作',
      '否定式: was/were + not + 过去分词',
      '疑问式: Was/Were + 主语 + 过去分词?',
      '常与过去时间状语连用'
    ],
    examples: [
      {
        en: 'When was the zipper invented?',
        cn: '拉链是什么时候发明的?'
      },
      {
        en: 'It was invented by Whitcomb Judson in 1893.',
        cn: '它是由惠特科姆·贾德森在1893年发明的。'
      },
      {
        en: 'The telephone was invented in 1876.',
        cn: '电话是在1876年发明的。'
      }
    ],
    commonMistakes: [
      {
        wrong: 'The car invented in 1885.',
        correct: 'The car was invented in 1885.',
        explanation: '被动语态不能省略be动词'
      },
      {
        wrong: 'When did the computer invent?',
        correct: 'When was the computer invented?',
        explanation: '询问被动动作要用被动语态'
      }
    ]
  },
  {
    id: 'g9-u7-modal-passive',
    unit: 7,
    title: 'Should + be allowed to',
    titleCn: '情态动词被动语态',
    category: '语态',
    difficulty: 'advanced',
    examTags: ['中考频次'],
    description: '情态动词的被动语态结构为"情态动词 + be + 过去分词"。常用于表达规则、建议和允许。',
    keyPoints: [
      '结构: 情态动词 + be + 过去分词',
      'should be allowed to表示"应该被允许"',
      '否定式: should not be allowed to',
      '疑问式: Should...be allowed to...?',
      '其他情态动词: can, must, may等'
    ],
    examples: [
      {
        en: 'Teenagers should be allowed to choose their own clothes.',
        cn: '青少年应该被允许选择自己的衣服。'
      },
      {
        en: 'Students should not be allowed to have part-time jobs.',
        cn: '学生不应该被允许做兼职工作。'
      },
      {
        en: 'Should sixteen-year-olds be allowed to drive?',
        cn: '16岁的孩子应该被允许开车吗?'
      }
    ],
    commonMistakes: [
      {
        wrong: 'Students should allow to use phones.',
        correct: 'Students should be allowed to use phones.',
        explanation: '情态动词被动语态不能省略be'
      },
      {
        wrong: 'They should be allowed choosing.',
        correct: 'They should be allowed to choose.',
        explanation: 'be allowed to后面接动词原形'
      }
    ]
  },
  {
    id: 'g9-u8-modal-inference',
    unit: 8,
    title: 'Modal verbs for making inferences',
    titleCn: '情态动词表推测',
    category: '情态动词',
    difficulty: 'advanced',
    examTags: ['中考频次'],
    description: '使用must, might, could, can\'t等情态动词表达不同程度的推测。must表示肯定推测,can\'t表示否定推测。',
    keyPoints: [
      'must: 一定,肯定(90%以上把握)',
      'might/could: 可能,也许(50%左右把握)',
      'can\'t: 不可能(否定推测)',
      'may: 可能(不太确定)',
      '后接动词原形或be doing'
    ],
    examples: [
      {
        en: 'It must belong to Carla. She loves volleyball.',
        cn: '它一定是卡拉的。她喜欢排球。'
      },
      {
        en: 'It might be Mei\'s hair band.',
        cn: '它可能是梅的发带。'
      },
      {
        en: 'It can\'t be a dog. It\'s too big.',
        cn: '它不可能是狗。太大了。'
      }
    ],
    commonMistakes: [
      {
        wrong: 'It must is hers.',
        correct: 'It must be hers.',
        explanation: '情态动词后面用动词原形be,不用is'
      },
      {
        wrong: 'It can\'t belongs to Tom.',
        correct: 'It can\'t belong to Tom.',
        explanation: '情态动词后面用动词原形'
      }
    ]
  },
  {
    id: 'g9-u9-relative-clauses',
    unit: 9,
    title: 'Relative clauses with that/who/which',
    titleCn: '定语从句',
    category: '从句',
    difficulty: 'advanced',
    examTags: ['中考频次', '高考考点'],
    description: '定语从句用来修饰名词或代词。that可指人或物,who指人,which指物。关系词在从句中作主语或宾语。',
    keyPoints: [
      'that: 指人或物(最常用)',
      'who: 只指人',
      'which: 只指物',
      '关系词作宾语时可省略',
      '从句紧跟在先行词后面'
    ],
    examples: [
      {
        en: 'I like music that I can dance to.',
        cn: '我喜欢我能跟着跳舞的音乐。'
      },
      {
        en: 'She likes musicians who play different kinds of music.',
        cn: '她喜欢演奏不同类型音乐的音乐家。'
      },
      {
        en: 'I prefer movies which give me something to think about.',
        cn: '我更喜欢能让我思考的电影。'
      }
    ],
    commonMistakes: [
      {
        wrong: 'I like the music what is quiet.',
        correct: 'I like the music that/which is quiet.',
        explanation: '定语从句不能用what,要用that或which'
      },
      {
        wrong: 'The man which helped me is kind.',
        correct: 'The man who/that helped me is kind.',
        explanation: '指人要用who或that,不用which'
      }
    ]
  },
  {
    id: 'g9-u10-supposed-to',
    unit: 10,
    title: 'Be supposed to',
    titleCn: 'be supposed to(应该)',
    category: '固定搭配',
    difficulty: 'intermediate',
    examTags: ['中考频次'],
    description: 'be supposed to表示"应该,被期望",常用于描述社会习俗、规则和礼仪。类似结构还有be expected to。',
    keyPoints: [
      '结构: be supposed to + 动词原形',
      '表示"应该,被期望"',
      '否定式: be not supposed to',
      '疑问式: Am/Is/Are...supposed to...?',
      '类似: be expected to, It is + adj. + to'
    ],
    examples: [
      {
        en: 'You\'re supposed to shake hands when you meet someone.',
        cn: '你见到某人时应该握手。'
      },
      {
        en: 'Am I supposed to wear jeans?',
        cn: '我应该穿牛仔裤吗?'
      },
      {
        en: 'It\'s important to be on time.',
        cn: '准时是很重要的。'
      }
    ],
    commonMistakes: [
      {
        wrong: 'You supposed to arrive on time.',
        correct: 'You are supposed to arrive on time.',
        explanation: 'be supposed to不能省略be动词'
      },
      {
        wrong: 'We\'re supposed shaking hands.',
        correct: 'We\'re supposed to shake hands.',
        explanation: 'be supposed to后面接动词原形'
      }
    ]
  },
  {
    id: 'g9-u11-make',
    unit: 11,
    title: 'Make + sb. + do/adj.',
    titleCn: '使役动词make',
    category: '动词',
    difficulty: 'intermediate',
    examTags: ['中考频次'],
    description: 'make作使役动词,表示"使,让"。可以接不带to的不定式或形容词作宾补,表示使某人做某事或使某人处于某种状态。',
    keyPoints: [
      'make + sb. + do(不带to的不定式)',
      'make + sb. + 形容词',
      '表示"使某人做某事/处于某种状态"',
      '被动语态: be made to do(要加to)',
      '类似动词: let, have'
    ],
    examples: [
      {
        en: 'Sad movies make me cry.',
        cn: '悲伤的电影让我哭。'
      },
      {
        en: 'The loud music makes me nervous.',
        cn: '吵闹的音乐让我紧张。'
      },
      {
        en: 'Money doesn\'t always make people happy.',
        cn: '金钱并不总是让人快乐。'
      }
    ],
    commonMistakes: [
      {
        wrong: 'The movie made me to cry.',
        correct: 'The movie made me cry.',
        explanation: 'make后面的不定式不带to'
      },
      {
        wrong: 'It makes me happily.',
        correct: 'It makes me happy.',
        explanation: 'make后面接形容词,不接副词'
      }
    ]
  },
  {
    id: 'g9-u12-past-perfect',
    unit: 12,
    title: 'Past perfect tense',
    titleCn: '过去完成时',
    category: '时态',
    difficulty: 'advanced',
    examTags: ['中考频次', '高考考点'],
    description: '过去完成时表示在过去某一时间或动作之前已经完成的动作。结构为"had + 过去分词"。常与by, before, when等连用。',
    keyPoints: [
      '结构: had + 过去分词',
      '表示"过去的过去"',
      '常与by, before, when, by the time等连用',
      '否定式: had not (hadn\'t) + 过去分词',
      '疑问式: Had + 主语 + 过去分词?'
    ],
    examples: [
      {
        en: 'When I got to school, I realized I had left my backpack at home.',
        cn: '当我到学校时,我意识到我把背包落在家里了。'
      },
      {
        en: 'By the time I got back to school, the bell had rung.',
        cn: '当我回到学校时,铃已经响了。'
      },
      {
        en: 'Before I got to the bus stop, the bus had already left.',
        cn: '在我到达公交站之前,公交车已经开走了。'
      }
    ],
    commonMistakes: [
      {
        wrong: 'When I arrived, he left already.',
        correct: 'When I arrived, he had already left.',
        explanation: '"已经离开"发生在"到达"之前,要用过去完成时'
      },
      {
        wrong: 'I had forgot my homework.',
        correct: 'I had forgotten my homework.',
        explanation: 'forget的过去分词是forgotten,不是forgot'
      }
    ]
  }
];

// 按单元分组
export const grade9GrammarByUnit = grade9GrammarPoints.reduce((acc, point) => {
  if (!acc[point.unit]) {
    acc[point.unit] = [];
  }
  acc[point.unit].push(point);
  return acc;
}, {} as Record<number, Grade9GrammarPoint[]>);

// 统计信息
export const grade9GrammarStats = {
  totalUnits: 14,
  totalGrammarPoints: grade9GrammarPoints.length,
  byCategory: grade9GrammarPoints.reduce((acc, point) => {
    acc[point.category] = (acc[point.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>),
  byDifficulty: {
    intermediate: grade9GrammarPoints.filter(p => p.difficulty === 'intermediate').length,
    advanced: grade9GrammarPoints.filter(p => p.difficulty === 'advanced').length
  }
};
