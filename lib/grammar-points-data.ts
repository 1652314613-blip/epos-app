/**
 * 七年级英语语法知识点数据
 * 基于人教版2024版教材
 */

export interface GrammarPoint {
  id: string;
  grade: '7A' | '7B' | '9';
  unit: number;
  unitTitle: string;
  title: string;
  titleCn: string;
  category: 'tense' | 'pronoun' | 'noun' | 'sentence' | 'modifier' | 'conjunction' | 'number' | '从句' | '语态' | '情态动词' | '非谓语动词' | '固定搭配' | '动词';
  difficulty: 'basic' | 'intermediate' | 'advanced';
  examTags?: ('中考频次' | '高考考点')[];  // 新增:考点标签
  description: string;
  rules: string[];
  examples: Array<{
    en: string;
    cn: string;
  }>;
  commonMistakes: Array<{
    wrong: string;
    correct: string;
    explanation: string;
  }>;
  relatedPoints: string[];
}

export const grammarPoints: GrammarPoint[] = [
  // ========== 七年级上册 ==========
  {
    id: '7a-u1-be',
    grade: '7A',
    unit: 1,
    unitTitle: 'You and Me',
    title: 'Simple Present Tense (be)',
    titleCn: '一般现在时(be动词)',
    category: 'tense',
    difficulty: 'basic',
    examTags: ['中考频次', '高考考点'],
    description: 'be动词(am, is, are)用于描述主语的状态、身份或特征。',
    rules: [
      'I + am',
      'He/She/It + is',
      'You/We/They + are',
      '否定形式:在be动词后加not',
      '疑问形式:将be动词提到句首'
    ],
    examples: [
      { en: 'I am a student.', cn: '我是一名学生。' },
      { en: 'She is my friend.', cn: '她是我的朋友。' },
      { en: 'They are happy.', cn: '他们很开心。' },
      { en: 'Are you ready?', cn: '你准备好了吗?' }
    ],
    commonMistakes: [
      {
        wrong: 'I is a student.',
        correct: 'I am a student.',
        explanation: 'I后面必须用am,不能用is'
      },
      {
        wrong: 'He are tall.',
        correct: 'He is tall.',
        explanation: '第三人称单数(he/she/it)后用is'
      }
    ],
    relatedPoints: ['7a-u1-pronouns', '7a-u2-do']
  },
  {
    id: '7a-u1-pronouns',
    grade: '7A',
    unit: 1,
    unitTitle: 'You and Me',
    title: 'Subject Pronouns',
    titleCn: '主格代词',
    category: 'pronoun',
    difficulty: 'basic',
    examTags: ['中考频次'],
    description: '主格代词用作句子的主语,表示动作的执行者。',
    rules: [
      '单数:I(我), you(你), he(他), she(她), it(它)',
      '复数:we(我们), you(你们), they(他们/她们/它们)',
      '主格代词在句中作主语',
      '第三人称单数:he, she, it'
    ],
    examples: [
      { en: 'I like English.', cn: '我喜欢英语。' },
      { en: 'He is my brother.', cn: '他是我的兄弟。' },
      { en: 'We are classmates.', cn: '我们是同学。' },
      { en: 'They play basketball.', cn: '他们打篮球。' }
    ],
    commonMistakes: [
      {
        wrong: 'Me am a student.',
        correct: 'I am a student.',
        explanation: '作主语时用主格代词I,不用宾格me'
      },
      {
        wrong: 'Him is tall.',
        correct: 'He is tall.',
        explanation: '作主语时用主格he,不用宾格him'
      }
    ],
    relatedPoints: ['7a-u1-be', '7b-u3-possessive-pronouns']
  },
  {
    id: '7a-u2-do',
    grade: '7A',
    unit: 2,
    unitTitle: "We're Family!",
    title: 'Simple Present Tense (do)',
    titleCn: '一般现在时(实义动词)',
    category: 'tense',
    difficulty: 'intermediate',
    examTags: ['中考频次', '高考考点'],
    description: '一般现在时表示经常发生的动作、习惯或客观事实。',
    rules: [
      '主语为第三人称单数时,动词加-s或-es',
      '主语为其他人称时,动词用原形',
      '否定句:主语 + do/does + not + 动词原形',
      '疑问句:Do/Does + 主语 + 动词原形?'
    ],
    examples: [
      { en: 'I play football every day.', cn: '我每天踢足球。' },
      { en: 'She likes music.', cn: '她喜欢音乐。' },
      { en: 'They go to school by bus.', cn: '他们坐公交车上学。' },
      { en: 'Does he speak English?', cn: '他说英语吗?' }
    ],
    commonMistakes: [
      {
        wrong: 'He play basketball.',
        correct: 'He plays basketball.',
        explanation: '第三人称单数主语后,动词要加-s'
      },
      {
        wrong: 'She don\'t like apples.',
        correct: 'She doesn\'t like apples.',
        explanation: '第三人称单数否定用doesn\'t,不用don\'t'
      }
    ],
    relatedPoints: ['7a-u1-be', '7b-u5-present-continuous']
  },
  {
    id: '7a-u2-possessive',
    grade: '7A',
    unit: 2,
    unitTitle: "We're Family!",
    title: "Possessive 's",
    titleCn: '名词所有格',
    category: 'noun',
    difficulty: 'basic',
    description: '名词所有格表示所属关系,通常在名词后加\'s。',
    rules: [
      '单数名词:直接加\'s (Tom\'s book)',
      '以s结尾的复数名词:只加\' (students\' books)',
      '不以s结尾的复数名词:加\'s (children\'s toys)',
      '表示时间、距离等:也可用\'s (today\'s homework)'
    ],
    examples: [
      { en: "This is Mary's bag.", cn: '这是玛丽的包。' },
      { en: "My father's car is red.", cn: '我爸爸的车是红色的。' },
      { en: "The children's room is big.", cn: '孩子们的房间很大。' },
      { en: "Today's lesson is interesting.", cn: '今天的课很有趣。' }
    ],
    commonMistakes: [
      {
        wrong: "This is Tom book.",
        correct: "This is Tom's book.",
        explanation: '表示所属关系要用\'s'
      },
      {
        wrong: "The students's books",
        correct: "The students' books",
        explanation: '以s结尾的复数名词只加\''
      }
    ],
    relatedPoints: ['7b-u3-possessive-pronouns']
  },
  {
    id: '7a-u3-there-be',
    grade: '7A',
    unit: 3,
    unitTitle: 'My School',
    title: 'There be Structure',
    titleCn: 'There be结构',
    category: 'sentence',
    difficulty: 'basic',
    description: 'There be结构表示"某处有某物",be动词的形式取决于后面的名词。',
    rules: [
      'There is + 单数名词/不可数名词',
      'There are + 复数名词',
      '就近原则:be动词与最近的名词保持一致',
      '否定:There is/are + not',
      '疑问:Is/Are + there...?'
    ],
    examples: [
      { en: 'There is a book on the desk.', cn: '桌子上有一本书。' },
      { en: 'There are three students in the classroom.', cn: '教室里有三个学生。' },
      { en: 'There is a pen and two books.', cn: '有一支笔和两本书。' },
      { en: 'Is there a library in your school?', cn: '你们学校有图书馆吗?' }
    ],
    commonMistakes: [
      {
        wrong: 'There have a book.',
        correct: 'There is a book.',
        explanation: 'There be结构不能用have'
      },
      {
        wrong: 'There are a book.',
        correct: 'There is a book.',
        explanation: 'be动词要与后面的名词单复数一致'
      }
    ],
    relatedPoints: ['7a-u3-prepositions']
  },
  {
    id: '7a-u3-prepositions',
    grade: '7A',
    unit: 3,
    unitTitle: 'My School',
    title: 'Prepositions of Position',
    titleCn: '方位介词',
    category: 'modifier',
    difficulty: 'intermediate',
    description: '方位介词用于描述物体的位置关系。',
    rules: [
      'in:在...里面',
      'on:在...上面(接触)',
      'under:在...下面',
      'behind:在...后面',
      'in front of:在...前面',
      'next to:在...旁边',
      'between:在...之间(两者)',
      'across from:在...对面'
    ],
    examples: [
      { en: 'The book is on the desk.', cn: '书在桌子上。' },
      { en: 'The cat is under the chair.', cn: '猫在椅子下面。' },
      { en: 'The library is behind the classroom.', cn: '图书馆在教室后面。' },
      { en: 'The bank is next to the post office.', cn: '银行在邮局旁边。' }
    ],
    commonMistakes: [
      {
        wrong: 'The book is in the desk.',
        correct: 'The book is on the desk.',
        explanation: '在桌面上用on,在抽屉里才用in'
      },
      {
        wrong: 'The school is in front the park.',
        correct: 'The school is in front of the park.',
        explanation: 'in front of是固定搭配,不能省略of'
      }
    ],
    relatedPoints: ['7a-u3-there-be']
  },
  {
    id: '7a-u4-conjunctions',
    grade: '7A',
    unit: 4,
    unitTitle: 'My Favourite Subject',
    title: 'Conjunctions',
    titleCn: '连词',
    category: 'conjunction',
    difficulty: 'basic',
    description: '连词用于连接单词、短语或句子。',
    rules: [
      'and:表示并列、顺承关系',
      'but:表示转折关系',
      'because:表示因果关系(引导原因)',
      'so:表示因果关系(引导结果)'
    ],
    examples: [
      { en: 'I like English and math.', cn: '我喜欢英语和数学。' },
      { en: 'I like sports, but I don\'t like running.', cn: '我喜欢运动,但我不喜欢跑步。' },
      { en: 'I like music because it\'s relaxing.', cn: '我喜欢音乐因为它令人放松。' },
      { en: 'It\'s raining, so I stay at home.', cn: '下雨了,所以我待在家里。' }
    ],
    commonMistakes: [
      {
        wrong: 'Because it\'s raining, so I stay home.',
        correct: 'Because it\'s raining, I stay home. / It\'s raining, so I stay home.',
        explanation: 'because和so不能同时使用'
      },
      {
        wrong: 'I like apples, oranges.',
        correct: 'I like apples and oranges.',
        explanation: '并列关系要用and连接'
      }
    ],
    relatedPoints: []
  },
  {
    id: '7a-u5-can',
    grade: '7A',
    unit: 5,
    unitTitle: 'Fun Clubs',
    title: 'Modal Verb: can',
    titleCn: '情态动词can',
    category: 'conjunction',
    difficulty: 'intermediate',
    description: 'can表示能力、请求或可能性,后接动词原形。',
    rules: [
      'can + 动词原形',
      '否定:cannot / can\'t',
      '疑问:Can + 主语 + 动词原形?',
      'can没有人称和数的变化'
    ],
    examples: [
      { en: 'I can swim.', cn: '我会游泳。' },
      { en: 'She can play the piano.', cn: '她会弹钢琴。' },
      { en: 'Can you speak English?', cn: '你会说英语吗?' },
      { en: 'He can\'t dance.', cn: '他不会跳舞。' }
    ],
    commonMistakes: [
      {
        wrong: 'He cans swim.',
        correct: 'He can swim.',
        explanation: 'can没有第三人称单数形式'
      },
      {
        wrong: 'I can to play basketball.',
        correct: 'I can play basketball.',
        explanation: 'can后直接加动词原形,不加to'
      }
    ],
    relatedPoints: ['7b-u2-modal-verbs']
  },
  {
    id: '7a-u6-time',
    grade: '7A',
    unit: 6,
    unitTitle: 'A Day in the Life',
    title: 'Time Expressions',
    titleCn: '时间表达',
    category: 'number',
    difficulty: 'intermediate',
    description: '用于表达具体时间和时间段的表达方式。',
    rules: [
      '整点:数字 + o\'clock (3 o\'clock)',
      '几点几分:数字 + 数字 (3:15)',
      '半点:half past + 数字 (half past three)',
      '一刻钟:a quarter past/to + 数字',
      '时间介词:at(具体时刻), in(上午/下午/晚上), on(具体日期)'
    ],
    examples: [
      { en: 'I get up at 7 o\'clock.', cn: '我7点起床。' },
      { en: 'The class starts at half past eight.', cn: '课程8点半开始。' },
      { en: 'It\'s a quarter past three.', cn: '现在是3点15分。' },
      { en: 'I go to bed at 9:30 in the evening.', cn: '我晚上9点30分睡觉。' }
    ],
    commonMistakes: [
      {
        wrong: 'I get up in 7 o\'clock.',
        correct: 'I get up at 7 o\'clock.',
        explanation: '具体时刻前用at,不用in'
      },
      {
        wrong: 'at morning',
        correct: 'in the morning',
        explanation: '上午/下午/晚上前用in'
      }
    ],
    relatedPoints: ['7a-u6-wh-questions']
  },
  {
    id: '7a-u6-wh-questions',
    grade: '7A',
    unit: 6,
    unitTitle: 'A Day in the Life',
    title: 'Wh- Questions',
    titleCn: '特殊疑问句',
    category: 'sentence',
    difficulty: 'intermediate',
    description: '以疑问词开头的疑问句,用于询问具体信息。',
    rules: [
      'What:什么(询问事物)',
      'When:什么时候(询问时间)',
      'Where:哪里(询问地点)',
      'Who:谁(询问人)',
      'Why:为什么(询问原因)',
      'How:怎么样(询问方式/程度)',
      '结构:疑问词 + 一般疑问句'
    ],
    examples: [
      { en: 'What time do you get up?', cn: '你几点起床?' },
      { en: 'When is your birthday?', cn: '你的生日是什么时候?' },
      { en: 'Where do you live?', cn: '你住在哪里?' },
      { en: 'Why do you like English?', cn: '你为什么喜欢英语?' }
    ],
    commonMistakes: [
      {
        wrong: 'What you do?',
        correct: 'What do you do?',
        explanation: '特殊疑问句也要用助动词do/does'
      },
      {
        wrong: 'Where does he lives?',
        correct: 'Where does he live?',
        explanation: '有does时,动词用原形'
      }
    ],
    relatedPoints: ['7a-u7-wh-review', '7b-u1-wh-advanced']
  },
  {
    id: '7a-u7-ordinal',
    grade: '7A',
    unit: 7,
    unitTitle: 'Happy Birthday!',
    title: 'Ordinal Numbers',
    titleCn: '序数词',
    category: 'number',
    difficulty: 'intermediate',
    description: '序数词表示顺序,用于日期、楼层等。',
    rules: [
      '基数词变序数词:一般加-th',
      '特殊变化:first(1st), second(2nd), third(3rd)',
      '以-y结尾:变y为i再加-eth (twenty → twentieth)',
      '几十几:只变个位 (twenty-one → twenty-first)',
      '日期表达:月份 + 序数词'
    ],
    examples: [
      { en: 'My birthday is on January 1st.', cn: '我的生日是1月1日。' },
      { en: 'He lives on the fifth floor.', cn: '他住在五楼。' },
      { en: 'This is my first English class.', cn: '这是我的第一节英语课。' },
      { en: 'Today is the twentieth of March.', cn: '今天是3月20日。' }
    ],
    commonMistakes: [
      {
        wrong: 'My birthday is on January one.',
        correct: 'My birthday is on January 1st / the first.',
        explanation: '日期要用序数词'
      },
      {
        wrong: 'the fiveth floor',
        correct: 'the fifth floor',
        explanation: 'five的序数词是fifth,不是fiveth'
      }
    ],
    relatedPoints: ['7a-u6-time']
  },
  {
    id: '7a-u7-wh-review',
    grade: '7A',
    unit: 7,
    unitTitle: 'Happy Birthday!',
    title: 'Wh- Questions Review',
    titleCn: '特殊疑问句复习',
    category: 'sentence',
    difficulty: 'intermediate',
    description: '综合运用各类特殊疑问句。',
    rules: [
      'What time:询问具体时刻',
      'What day:询问星期几',
      'What date:询问日期',
      'How old:询问年龄',
      'How many:询问数量(可数)',
      'How much:询问价格/数量(不可数)'
    ],
    examples: [
      { en: 'What time is it?', cn: '现在几点?' },
      { en: 'What day is it today?', cn: '今天星期几?' },
      { en: 'How old are you?', cn: '你多大了?' },
      { en: 'How many books do you have?', cn: '你有多少本书?' }
    ],
    commonMistakes: [
      {
        wrong: 'How many money do you have?',
        correct: 'How much money do you have?',
        explanation: 'money不可数,用how much'
      },
      {
        wrong: 'What day is today?',
        correct: 'What day is it today?',
        explanation: '询问星期几要加it'
      }
    ],
    relatedPoints: ['7a-u6-wh-questions', '7b-u1-wh-advanced']
  },

  // ========== 七年级下册 ==========
  {
    id: '7b-u1-wh-advanced',
    grade: '7B',
    unit: 1,
    unitTitle: 'Animal Friends',
    title: 'Wh- Questions (Advanced)',
    titleCn: '特殊疑问句(进阶)',
    category: 'sentence',
    difficulty: 'advanced',
    description: '更复杂的特殊疑问句用法。',
    rules: [
      'Which:哪一个(有选择范围)',
      'Whose:谁的(询问所属)',
      'How long:多长时间',
      'How far:多远',
      'How often:多久一次',
      'What kind of:什么种类'
    ],
    examples: [
      { en: 'Which animal do you like?', cn: '你喜欢哪种动物?' },
      { en: 'Whose book is this?', cn: '这是谁的书?' },
      { en: 'How long does it take?', cn: '需要多长时间?' },
      { en: 'How often do you exercise?', cn: '你多久锻炼一次?' }
    ],
    commonMistakes: [
      {
        wrong: 'Who book is this?',
        correct: 'Whose book is this?',
        explanation: '询问所属用whose,不用who'
      },
      {
        wrong: 'How long is it from here?',
        correct: 'How far is it from here?',
        explanation: '询问距离用how far,不用how long'
      }
    ],
    relatedPoints: ['7a-u6-wh-questions', '7a-u7-wh-review']
  },
  {
    id: '7b-u1-adjectives',
    grade: '7B',
    unit: 1,
    unitTitle: 'Animal Friends',
    title: 'Adjectives',
    titleCn: '形容词',
    category: 'modifier',
    difficulty: 'intermediate',
    description: '形容词用于描述或修饰名词。',
    rules: [
      '位置:名词前(a big dog)或be动词后(The dog is big)',
      '形容词没有单复数变化',
      '多个形容词顺序:大小→形状→颜色→材质',
      '形容词比较级和最高级(后续学习)'
    ],
    examples: [
      { en: 'I have a cute cat.', cn: '我有一只可爱的猫。' },
      { en: 'The elephant is big and strong.', cn: '大象又大又强壮。' },
      { en: 'She has a small red bag.', cn: '她有一个红色的小包。' },
      { en: 'The weather is nice today.', cn: '今天天气很好。' }
    ],
    commonMistakes: [
      {
        wrong: 'I have a cat cute.',
        correct: 'I have a cute cat.',
        explanation: '形容词要放在名词前'
      },
      {
        wrong: 'They are beautifuls.',
        correct: 'They are beautiful.',
        explanation: '形容词没有复数形式'
      }
    ],
    relatedPoints: ['7b-u3-adverbs']
  },
  {
    id: '7b-u1-plurals',
    grade: '7B',
    unit: 1,
    unitTitle: 'Animal Friends',
    title: 'Plurals',
    titleCn: '名词复数',
    category: 'noun',
    difficulty: 'basic',
    description: '名词复数的构成规则。',
    rules: [
      '一般情况:加-s (book → books)',
      '以s, x, ch, sh结尾:加-es (box → boxes)',
      '以辅音字母+y结尾:变y为i加-es (baby → babies)',
      '以f/fe结尾:变f/fe为v加-es (knife → knives)',
      '不规则变化:man→men, child→children, sheep→sheep'
    ],
    examples: [
      { en: 'I have three dogs.', cn: '我有三只狗。' },
      { en: 'There are many boxes.', cn: '有很多盒子。' },
      { en: 'The children are playing.', cn: '孩子们在玩耍。' },
      { en: 'I see two sheep.', cn: '我看到两只羊。' }
    ],
    commonMistakes: [
      {
        wrong: 'two childs',
        correct: 'two children',
        explanation: 'child的复数是children,不规则变化'
      },
      {
        wrong: 'three sheeps',
        correct: 'three sheep',
        explanation: 'sheep单复数同形'
      }
    ],
    relatedPoints: ['7b-u4-countable-uncountable']
  },
  {
    id: '7b-u2-imperatives',
    grade: '7B',
    unit: 2,
    unitTitle: 'No Rules, No Order',
    title: 'Imperatives',
    titleCn: '祈使句',
    category: 'sentence',
    difficulty: 'basic',
    description: '祈使句用于表达命令、请求、建议等。',
    rules: [
      '肯定:动词原形开头',
      '否定:Don\'t + 动词原形',
      '礼貌:Please + 动词原形 / 动词原形 + please',
      'Let\'s + 动词原形(建议一起做某事)'
    ],
    examples: [
      { en: 'Open the door.', cn: '打开门。' },
      { en: 'Don\'t run in the classroom.', cn: '不要在教室里跑。' },
      { en: 'Please be quiet.', cn: '请安静。' },
      { en: 'Let\'s go to the park.', cn: '我们去公园吧。' }
    ],
    commonMistakes: [
      {
        wrong: 'Not run in the classroom.',
        correct: 'Don\'t run in the classroom.',
        explanation: '祈使句否定用Don\'t开头'
      },
      {
        wrong: 'You open the door.',
        correct: 'Open the door.',
        explanation: '祈使句直接用动词原形,不加主语'
      }
    ],
    relatedPoints: ['7b-u2-modal-verbs']
  },
  {
    id: '7b-u2-modal-verbs',
    grade: '7B',
    unit: 2,
    unitTitle: 'No Rules, No Order',
    title: 'Modal Verbs: can, have to, must',
    titleCn: '情态动词:can, have to, must',
    category: 'conjunction',
    difficulty: 'intermediate',
    description: '情态动词表达能力、义务和必要性。',
    rules: [
      'can:能够,可以(能力/许可)',
      'have to:不得不,必须(外部要求)',
      'must:必须(内心认为必要)',
      '情态动词 + 动词原形',
      'have to有人称和时态变化,其他情态动词没有'
    ],
    examples: [
      { en: 'You can go now.', cn: '你现在可以走了。' },
      { en: 'I have to finish my homework.', cn: '我必须完成作业。' },
      { en: 'You must be careful.', cn: '你必须小心。' },
      { en: 'She has to get up early.', cn: '她不得不早起。' }
    ],
    commonMistakes: [
      {
        wrong: 'You must to go.',
        correct: 'You must go.',
        explanation: '情态动词后直接加动词原形,不加to'
      },
      {
        wrong: 'He have to study.',
        correct: 'He has to study.',
        explanation: 'have to有人称变化,第三人称单数用has to'
      }
    ],
    relatedPoints: ['7a-u5-can']
  },
  {
    id: '7b-u3-possessive-pronouns',
    grade: '7B',
    unit: 3,
    unitTitle: 'Keep Fit',
    title: 'Possessive Pronouns',
    titleCn: '物主代词',
    category: 'pronoun',
    difficulty: 'intermediate',
    description: '物主代词表示所属关系,分为形容词性和名词性两种。',
    rules: [
      '形容词性物主代词:my, your, his, her, its, our, their + 名词',
      '名词性物主代词:mine, yours, his, hers, ours, theirs(单独使用)',
      '形容词性物主代词不能单独使用',
      '名词性物主代词 = 形容词性物主代词 + 名词'
    ],
    examples: [
      { en: 'This is my book. / This book is mine.', cn: '这是我的书。' },
      { en: 'That is her pen. / That pen is hers.', cn: '那是她的笔。' },
      { en: 'Our classroom is big. Theirs is small.', cn: '我们的教室很大。他们的很小。' },
      { en: 'Is this your bag? Yes, it\'s mine.', cn: '这是你的包吗?是的,是我的。' }
    ],
    commonMistakes: [
      {
        wrong: 'This is mine book.',
        correct: 'This is my book.',
        explanation: '名词前用形容词性物主代词my,不用mine'
      },
      {
        wrong: 'The book is my.',
        correct: 'The book is mine.',
        explanation: '单独使用时用名词性物主代词mine'
      }
    ],
    relatedPoints: ['7a-u1-pronouns', '7a-u2-possessive']
  },
  {
    id: '7b-u3-adverbs',
    grade: '7B',
    unit: 3,
    unitTitle: 'Keep Fit',
    title: 'Adverbs of Frequency',
    titleCn: '频率副词',
    category: 'modifier',
    difficulty: 'intermediate',
    description: '频率副词表示动作发生的频率。',
    rules: [
      '常见频率副词:always(总是), usually(通常), often(经常), sometimes(有时), never(从不)',
      '位置:be动词后,实义动词前',
      '频率从高到低:always > usually > often > sometimes > never',
      '句首或句末:sometimes, usually可以放句首或句末'
    ],
    examples: [
      { en: 'I always get up at 7.', cn: '我总是7点起床。' },
      { en: 'She is usually late.', cn: '她通常迟到。' },
      { en: 'We often play basketball.', cn: '我们经常打篮球。' },
      { en: 'He never eats breakfast.', cn: '他从不吃早餐。' }
    ],
    commonMistakes: [
      {
        wrong: 'I go always to school.',
        correct: 'I always go to school.',
        explanation: '频率副词放在实义动词前'
      },
      {
        wrong: 'She always is happy.',
        correct: 'She is always happy.',
        explanation: '频率副词放在be动词后'
      }
    ],
    relatedPoints: ['7b-u1-adjectives']
  },
  {
    id: '7b-u4-alternative-questions',
    grade: '7B',
    unit: 4,
    unitTitle: 'Eat Well',
    title: 'Alternative Questions',
    titleCn: '选择疑问句',
    category: 'sentence',
    difficulty: 'intermediate',
    description: '选择疑问句提供两个或多个选项供选择。',
    rules: [
      '结构:一般疑问句 + or + 选项',
      '用or连接选项',
      '不能用Yes/No回答,要选择其中一项',
      '语调:前升后降'
    ],
    examples: [
      { en: 'Do you like apples or oranges?', cn: '你喜欢苹果还是橙子?' },
      { en: 'Is he a teacher or a doctor?', cn: '他是老师还是医生?' },
      { en: 'Would you like tea or coffee?', cn: '你想要茶还是咖啡?' },
      { en: 'Which do you prefer, red or blue?', cn: '你更喜欢红色还是蓝色?' }
    ],
    commonMistakes: [
      {
        wrong: 'Do you like apples or oranges? - Yes.',
        correct: 'Do you like apples or oranges? - I like apples.',
        explanation: '选择疑问句不能用Yes/No回答'
      },
      {
        wrong: 'You like apples or oranges?',
        correct: 'Do you like apples or oranges?',
        explanation: '选择疑问句也要用疑问句形式'
      }
    ],
    relatedPoints: ['7a-u6-wh-questions']
  },
  {
    id: '7b-u4-countable-uncountable',
    grade: '7B',
    unit: 4,
    unitTitle: 'Eat Well',
    title: 'Countable and Uncountable Nouns',
    titleCn: '可数与不可数名词',
    category: 'noun',
    difficulty: 'intermediate',
    description: '名词分为可数名词和不可数名词,用法不同。',
    rules: [
      '可数名词:有单复数形式,可用a/an修饰',
      '不可数名词:没有复数形式,不用a/an',
      '不可数名词前可用some, much, a lot of',
      '可数名词复数前可用some, many, a lot of',
      '常见不可数名词:water, milk, bread, rice, meat, money'
    ],
    examples: [
      { en: 'I have an apple.', cn: '我有一个苹果。(可数)' },
      { en: 'I drink some water.', cn: '我喝一些水。(不可数)' },
      { en: 'There are many books.', cn: '有很多书。(可数)' },
      { en: 'There is much milk.', cn: '有很多牛奶。(不可数)' }
    ],
    commonMistakes: [
      {
        wrong: 'I have a bread.',
        correct: 'I have some bread. / I have a piece of bread.',
        explanation: 'bread不可数,不能用a修饰'
      },
      {
        wrong: 'many water',
        correct: 'much water',
        explanation: '不可数名词用much,不用many'
      }
    ],
    relatedPoints: ['7b-u1-plurals']
  },
  {
    id: '7b-u5-present-continuous',
    grade: '7B',
    unit: 5,
    unitTitle: 'Here and Now',
    title: 'Present Continuous Tense (1)',
    titleCn: '现在进行时(基础)',
    category: 'tense',
    difficulty: 'advanced',
    description: '现在进行时表示正在进行的动作。',
    rules: [
      '结构:be动词(am/is/are) + 动词-ing',
      '动词-ing构成:一般加-ing',
      '以不发音e结尾:去e加-ing (make → making)',
      '重读闭音节:双写末尾字母加-ing (run → running)',
      '用法:正在进行的动作,常与now, at the moment连用'
    ],
    examples: [
      { en: 'I am reading a book now.', cn: '我现在正在读书。' },
      { en: 'She is watching TV.', cn: '她正在看电视。' },
      { en: 'They are playing football.', cn: '他们正在踢足球。' },
      { en: 'What are you doing?', cn: '你在做什么?' }
    ],
    commonMistakes: [
      {
        wrong: 'I reading a book.',
        correct: 'I am reading a book.',
        explanation: '现在进行时必须有be动词'
      },
      {
        wrong: 'She is runing.',
        correct: 'She is running.',
        explanation: 'run要双写n再加-ing'
      }
    ],
    relatedPoints: ['7a-u2-do', '7b-u6-present-continuous-2']
  },
  {
    id: '7b-u6-present-continuous-2',
    grade: '7B',
    unit: 6,
    unitTitle: 'Rain or Shine',
    title: 'Present Continuous Tense (2)',
    titleCn: '现在进行时(进阶)',
    category: 'tense',
    difficulty: 'advanced',
    description: '现在进行时的更多用法和特殊情况。',
    rules: [
      '表示现阶段正在进行的动作(不一定此刻)',
      '表示按计划即将发生的动作',
      '某些动词不用进行时:like, love, know, want, need, have(拥有)',
      '否定:be动词 + not + 动词-ing',
      '疑问:be动词提前'
    ],
    examples: [
      { en: 'I am learning English these days.', cn: '我这些天在学英语。' },
      { en: 'We are leaving tomorrow.', cn: '我们明天要离开。' },
      { en: 'He is not sleeping now.', cn: '他现在没在睡觉。' },
      { en: 'Are you listening to me?', cn: '你在听我说话吗?' }
    ],
    commonMistakes: [
      {
        wrong: 'I am knowing the answer.',
        correct: 'I know the answer.',
        explanation: 'know等状态动词不用进行时'
      },
      {
        wrong: 'She is haveing lunch.',
        correct: 'She is having lunch.',
        explanation: 'have去e加-ing'
      }
    ],
    relatedPoints: ['7b-u5-present-continuous', '7b-u7-simple-past']
  },
  {
    id: '7b-u7-simple-past',
    grade: '7B',
    unit: 7,
    unitTitle: 'A Day to Remember',
    title: 'Simple Past Tense (1)',
    titleCn: '一般过去时(基础)',
    category: 'tense',
    difficulty: 'advanced',
    description: '一般过去时表示过去发生的动作或状态。',
    rules: [
      '规则动词:加-ed (play → played)',
      '以e结尾:加-d (like → liked)',
      '辅音字母+y:变y为i加-ed (study → studied)',
      '重读闭音节:双写末尾字母加-ed (stop → stopped)',
      '常与yesterday, last week, ago等连用'
    ],
    examples: [
      { en: 'I played basketball yesterday.', cn: '我昨天打了篮球。' },
      { en: 'She visited her grandma last week.', cn: '她上周看望了奶奶。' },
      { en: 'We studied English two hours ago.', cn: '我们两小时前学了英语。' },
      { en: 'They lived in Beijing.', cn: '他们住在北京。(过去)' }
    ],
    commonMistakes: [
      {
        wrong: 'I play basketball yesterday.',
        correct: 'I played basketball yesterday.',
        explanation: '过去时间要用过去式'
      },
      {
        wrong: 'She studyed English.',
        correct: 'She studied English.',
        explanation: '辅音字母+y要变y为i加-ed'
      }
    ],
    relatedPoints: ['7a-u2-do', '7b-u8-simple-past-2']
  },
  {
    id: '7b-u8-simple-past-2',
    grade: '7B',
    unit: 8,
    unitTitle: 'Once upon a Time',
    title: 'Simple Past Tense (2)',
    titleCn: '一般过去时(进阶)',
    category: 'tense',
    difficulty: 'advanced',
    description: '一般过去时的不规则变化和特殊用法。',
    rules: [
      '不规则动词:需要记忆(go→went, see→saw, have→had)',
      'be动词过去式:was(单数), were(复数)',
      '否定:didn\'t + 动词原形',
      '疑问:Did + 主语 + 动词原形?',
      '常见不规则动词:go, do, have, see, come, take, get, make'
    ],
    examples: [
      { en: 'I went to the park yesterday.', cn: '我昨天去了公园。' },
      { en: 'She saw a movie last night.', cn: '她昨晚看了电影。' },
      { en: 'We didn\'t go to school.', cn: '我们没去上学。' },
      { en: 'Did you have breakfast?', cn: '你吃早餐了吗?' }
    ],
    commonMistakes: [
      {
        wrong: 'I goed to school.',
        correct: 'I went to school.',
        explanation: 'go的过去式是went,不规则变化'
      },
      {
        wrong: 'Did you went there?',
        correct: 'Did you go there?',
        explanation: '疑问句中有did,动词用原形'
      }
    ],
    relatedPoints: ['7b-u7-simple-past', '7a-u1-be']
  }
];

// 按类别分类
export const grammarPointsByCategory = {
  tense: grammarPoints.filter(p => p.category === 'tense'),
  pronoun: grammarPoints.filter(p => p.category === 'pronoun'),
  noun: grammarPoints.filter(p => p.category === 'noun'),
  sentence: grammarPoints.filter(p => p.category === 'sentence'),
  modifier: grammarPoints.filter(p => p.category === 'modifier'),
  conjunction: grammarPoints.filter(p => p.category === 'conjunction'),
  number: grammarPoints.filter(p => p.category === 'number'),
};

// 按年级分类
export const grammarPointsByGrade = {
  '7A': grammarPoints.filter(p => p.grade === '7A'),
  '7B': grammarPoints.filter(p => p.grade === '7B'),
};

// 按难度分类
export const grammarPointsByDifficulty = {
  basic: grammarPoints.filter(p => p.difficulty === 'basic'),
  intermediate: grammarPoints.filter(p => p.difficulty === 'intermediate'),
  advanced: grammarPoints.filter(p => p.difficulty === 'advanced'),
};

// 按单元获取语法点
export function getGrammarPointsByUnit(grade: '7A' | '7B', unit: number): GrammarPoint[] {
  return grammarPoints.filter(p => p.grade === grade && p.unit === unit);
}

// 根据ID获取语法点

// ========== 第一章：名词 (来源：星火英语·初中语法全解) ==========
export const NOUNS_GRAMMAR_POINTS = [
  {
    id: '7a-nouns-1',
    grade: '7A',
    unit: 1,
    unitTitle: '名词 (Nouns)',
    title: '名词的特征',
    titleCn: '名词的特征',
    category: 'noun',
    difficulty: 'basic',
    examTags: ["\u4e2d\u8003\u9891\u6b21"],
    description: '名词是人类认识事物所使用的基本词汇，主要用来指各种人或事物具体的名称，也可以指抽象概念。',
    rules: [
      '可数名词有复数形式：英语中的大多数名词是可数名词，可数名词后可以加-s或-es构成复数形式',
      '名词前一般有限定词：名词前可由冠词（如a, an, the）或其他限定词修饰',
      '名词有自己的格：名词有主格、属格和宾格，属格一般是在其后加-\'s或运用of + 名词结构',
    ],
    examples: [
      {
        en: 'two backpacks',
        cn: '两个背包 - 可数名词的复数形式',
      },
      {
        en: 'many heroes',
        cn: '很多英雄 - 以-o结尾的名词，复数加-es',
      },
      {
        en: 'a film',
        cn: '一部电影 - 名词前有不定冠词修饰',
      },
      {
        en: 'Jack\'s shoes',
        cn: '杰克的鞋 - 名词所有格：-\'s形式',
      },
      {
        en: 'the gate of the school',
        cn: '学校大门 - 名词所有格：of结构',
      },
    ],
    commonMistakes: [
    ],
    relatedPoints: ["7a-nouns-2", "7a-nouns-3", "7a-nouns-4"],
  },
  {
    id: '7a-nouns-2',
    grade: '7A',
    unit: 1,
    unitTitle: '名词 (Nouns)',
    title: '名词的分类',
    titleCn: '名词的分类',
    category: 'noun',
    difficulty: 'basic',
    examTags: ["\u4e2d\u8003\u9891\u6b21"],
    description: '名词可以分为专有名词和普通名词两大类。',
    rules: [
      '专有名词：表示具体的姓名、事物、地名、机构、月份和节日等',
      '个体名词：用来指单个人或事物的名词',
      '集体名词：用来指一群人或一些事物总称的名词',
      '物质名词：用来指无法分为个体的物质、材料的名词',
      '抽象名词：用来指人或事物的品质、情感、状态、动作等抽象概念的名词',
    ],
    examples: [
      {
        en: 'Green, Michael Jackson',
        cn: '人名 - 专有名词：人名首字母大写',
      },
      {
        en: 'December, Mother\'s Day',
        cn: '月份和节日 - 专有名词：时间名称',
      },
      {
        en: 'book, key, student',
        cn: '书、钥匙、学生 - 个体名词',
      },
      {
        en: 'army, police, family',
        cn: '军队、警察、家庭 - 集体名词',
      },
      {
        en: 'water, wind, glass',
        cn: '水、风、玻璃 - 物质名词',
      },
      {
        en: 'honesty, love, silence',
        cn: '诚实、热爱、安静 - 抽象名词',
      },
    ],
    commonMistakes: [
    ],
    relatedPoints: ["7a-nouns-1", "7a-nouns-3", "7a-nouns-4"],
  },
  {
    id: '7a-nouns-3',
    grade: '7A',
    unit: 1,
    unitTitle: '名词 (Nouns)',
    title: '可数名词的数',
    titleCn: '可数名词的数',
    category: 'noun',
    difficulty: 'basic',
    examTags: ["\u4e2d\u8003\u9891\u6b21"],
    description: '可数名词在表示两个或两个以上的概念时须用复数形式。',
    rules: [
      '规则1：一般名词后加-s，在清辅音后读[s]，在浊辅音或元音后读[z]',
      '规则2：以s, z, ʃ, ʒ, tʃ, dʒ等音素结尾的名词，后加-es，如果词尾为e，只加-s',
      '规则3：以\'辅音字母 + o\'结尾的名词，多数情况下加-es，es读作[z]',
      '规则4：以f(e)结尾的名词，大多数变f(e)为v，再加-es，ves读作[vz]',
      '规则5：以\'辅音字母 + y\'结尾的名词，变y为i，再加-es，ies读作[iz]',
      '规则6：以-th结尾的名词，一般加-s，th原来读[θ]，加复数词尾s后，多数情况下读[ð]',
    ],
    examples: [
      {
        en: 'stamp—stamps',
        cn: '邮票 - 一般情况加-s',
      },
      {
        en: 'teacher—teachers',
        cn: '教师 - 一般情况加-s',
      },
      {
        en: 'class—classes',
        cn: '班级 - 以s结尾加-es',
      },
      {
        en: 'box—boxes',
        cn: '盒子 - 以x结尾加-es',
      },
      {
        en: 'tomato—tomatoes',
        cn: '西红柿 - 辅音+o结尾加-es',
      },
      {
        en: 'hero—heroes',
        cn: '英雄 - 辅音+o结尾加-es',
      },
      {
        en: 'thief—thieves',
        cn: '小偷 - f结尾变f为v加-es',
      },
      {
        en: 'knife—knives',
        cn: '刀子 - fe结尾变f为v加-es',
      },
      {
        en: 'baby—babies',
        cn: '婴儿 - 辅音+y结尾变y为i加-es',
      },
      {
        en: 'city—cities',
        cn: '城市 - 辅音+y结尾变y为i加-es',
      },
    ],
    commonMistakes: [
    ],
    relatedPoints: ["7a-nouns-1", "7a-nouns-2", "7a-nouns-4"],
  },
  {
    id: '7a-nouns-4',
    grade: '7A',
    unit: 1,
    unitTitle: '名词 (Nouns)',
    title: '不规则复数形式',
    titleCn: '不规则复数形式',
    category: 'noun',
    difficulty: 'intermediate',
    examTags: ["\u4e2d\u8003\u9891\u6b21"],
    description: '有些名词的复数形式不遵循规则变化，需要特别记忆。',
    rules: [
      '变内部元音：foot—feet, man—men, woman—women, tooth—teeth, goose—geese, mouse—mice',
      '词尾加-ren或-en：child—children, ox—oxen',
      '单复数同形：fish, deer, sheep, means, Chinese, Japanese',
      '外来词：phenomenon—phenomena',
      '集体名词的复数：有些只有复数形式（goods, trousers, glasses），有些有形式变化但表示复数意义（police, people, cattle）',
    ],
    examples: [
      {
        en: 'foot—feet',
        cn: '脚 - 变内部元音',
      },
      {
        en: 'man—men',
        cn: '男人 - 变内部元音',
      },
      {
        en: 'child—children',
        cn: '孩子们 - 词尾加-ren',
      },
      {
        en: 'fish (指条数)',
        cn: '鱼 - 单复数同形',
      },
      {
        en: 'sheep',
        cn: '绵羊 - 单复数同形',
      },
      {
        en: 'Chinese',
        cn: '中国人 - 单复数同形',
      },
    ],
    commonMistakes: [
    ],
    relatedPoints: ["7a-nouns-1", "7a-nouns-2", "7a-nouns-3"],
  },
  {
    id: '7a-nouns-5',
    grade: '7A',
    unit: 1,
    unitTitle: '名词 (Nouns)',
    title: '名词的格：-\'s所有格',
    titleCn: '名词的格：-\'s所有格',
    category: 'noun',
    difficulty: 'intermediate',
    examTags: ["\u4e2d\u8003\u9891\u6b21"],
    description: '名词的格分为主格、宾格和所有格。名词所有格表示名词之间的所属关系。',
    rules: [
      '一般情况下，在名词词尾加-\'s，在清辅音后读[s]，在浊辅音或元音后读[z]',
      '以-s或-es结尾的名词复数，直接在其后加\'，读音与可数名词复数词尾相同',
      '不以-s结尾的可数名词复数，直接在其后加-\'s，读音与可数名词复数词尾相同',
      '两人或多人共有一个人或事物时，只变化最后一个名词的词尾；如果为各自所有，各个名词的词尾都要变化',
      '表示时间、距离、国家、地点、自然现象等无生命的名词常用-\'s所有格',
      '表示某人的店铺、医院、学校、住宅及公共建筑时，-\'s所有格后常常不出现它所修饰的名词',
      '-\'s所有格常用来表示节日',
    ],
    examples: [
      {
        en: 'Dick\'s hobby',
        cn: '迪克的爱好 - 单数名词加-\'s',
      },
      {
        en: 'my parents\' hope',
        cn: '我父母的希望 - 复数名词以-s结尾加\'',
      },
      {
        en: 'children\'s time',
        cn: '孩子们的时间 - 不规则复数加-\'s',
      },
      {
        en: 'John and Susan\'s father',
        cn: '约翰和苏珊的父亲（共有） - 共同所有',
      },
      {
        en: 'two days\' trip',
        cn: '两天的旅行 - 表示时间',
      },
      {
        en: 'China\'s weather',
        cn: '中国的天气 - 表示国家',
      },
      {
        en: 'at the tailor\'s (shop)',
        cn: '在裁缝店 - 店铺省略名词',
      },
      {
        en: 'Children\'s Day',
        cn: '儿童节 - 节日',
      },
    ],
    commonMistakes: [
    ],
    relatedPoints: ["7a-nouns-1", "7a-nouns-2", "7a-nouns-3"],
  },
  {
    id: '7a-nouns-6',
    grade: '7A',
    unit: 1,
    unitTitle: '名词 (Nouns)',
    title: 'of所有格和双重所有格',
    titleCn: 'of所有格和双重所有格',
    category: 'noun',
    difficulty: 'intermediate',
    examTags: ["\u4e2d\u8003\u9891\u6b21"],
    description: '\'名词 + of + 名词\'便构成了of所有格。双重所有格是\'名词 + of + -\'s所有格/名词性物主代词\'构成双重所有格。',
    rules: [
      'of所有格表示无生命名词的所有关系',
      '名词化的形容词的所有关系用of所有格',
      '双重所有格：如果在表示所属物的名词前有冠词、数词、不定代词或指示代词时，常用双重所有格的形式来表示所有关系',
    ],
    examples: [
      {
        en: 'Beijing is the capital of China',
        cn: '北京是中国的首都 - 无生命名词用of',
      },
      {
        en: 'The life of the poor is the biggest problem',
        cn: '穷人的生活是最大的问题 - 名词化形容词用of',
      },
      {
        en: 'Two friends of mine had gone to the movies',
        cn: '我的两个朋友去看电影了 - 双重所有格',
      },
      {
        en: 'David is a friend of my father\'s',
        cn: '戴维是我父亲的一位朋友 - 双重所有格',
      },
    ],
    commonMistakes: [
    ],
    relatedPoints: ["7a-nouns-1", "7a-nouns-2", "7a-nouns-3"],
  },
  {
    id: '7a-nouns-7',
    grade: '7A',
    unit: 1,
    unitTitle: '名词 (Nouns)',
    title: '名词的修饰语',
    titleCn: '名词的修饰语',
    category: 'noun',
    difficulty: 'intermediate',
    examTags: ["\u4e2d\u8003\u9891\u6b21"],
    description: '名词可以由各种修饰语修饰，包括表示数量的词、单位词以及其他修饰语。',
    rules: [
      '只修饰可数名词：few（没有几个）, a few（几个）, several（几个）, many（很多）, a great/good many（很多）, a number of（若干）, numbers of（大量的）',
      '只修饰不可数名词：little（很少，几乎没有）, a little（一点）, much（许多）, a good/great deal of（很多）, a bit of（有一点，少量）',
      '既可修饰可数名词又可修饰不可数名词：some（一些）, lots of（很多）, a lot of（很多）, plenty of（充足的）, all（全部的）, most（大多数的）',
      '单位词：普通单位词（piece, article, bit）、度量单位词（metre, inch, yard, foot, pound, kilogram, ton, sum）、容积单位词（box, bag, basket, bottle, cup, glass, basin）、形状单位词（bar, block, loaf, cake, drop, grain）、集体单位词（team, crowd, group, fleet）',
      '其他修饰语：名词作修饰语（stone table）、形容词作修饰语（pretty girl）、副词作修饰语（the weather here）、介词短语作修饰语（a girl in clean clothes）、从句作修饰语（writers who write short stories）',
    ],
    examples: [
      {
        en: 'few students',
        cn: '没有几个学生 - 修饰可数名词',
      },
      {
        en: 'much water',
        cn: '许多水 - 修饰不可数名词',
      },
      {
        en: 'some money',
        cn: '一些钱 - 既可修饰可数又可修饰不可数',
      },
      {
        en: 'a piece of music',
        cn: '一段乐曲 - 普通单位词',
      },
      {
        en: 'a metre of cloth',
        cn: '一米布 - 度量单位词',
      },
      {
        en: 'a cup of tea',
        cn: '一杯茶 - 容积单位词',
      },
      {
        en: 'a bar of chocolate',
        cn: '一块巧克力 - 形状单位词',
      },
      {
        en: 'a team of players',
        cn: '一队选手 - 集体单位词',
      },
    ],
    commonMistakes: [
    ],
    relatedPoints: ["7a-nouns-1", "7a-nouns-2", "7a-nouns-3"],
  },
];

export function getGrammarPointById(id: string): GrammarPoint | undefined {
  return grammarPoints.find(p => p.id === id);
}

// 获取相关语法点
// ========== 九年级全册 ==========
// 从九年级教材提取的12个核心语法点

export const grade9GrammarPoints: GrammarPoint[] = [
  // Unit 1-12 的语法点将在这里添加
];

export function getRelatedGrammarPoints(id: string): GrammarPoint[] {
  const point = getGrammarPointById(id);
  if (!point) return [];
  return point.relatedPoints
    .map(relatedId => getGrammarPointById(relatedId))
    .filter((p): p is GrammarPoint => p !== undefined);
}
