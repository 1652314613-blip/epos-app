/**
 * PEP (People's Education Press) Grammar Knowledge Base
 * Organized by grade levels (7-12) following Chinese middle and high school curriculum
 */

export type GradeLevel = 7 | 8 | 9 | 10 | 11 | 12;

export type GrammarCategory =
  | "Nouns"
  | "Tenses"
  | "Articles"
  | "Prepositions"
  | "Modal Verbs"
  | "Passive Voice"
  | "Conditionals"
  | "Reported Speech"
  | "Non-finite Verbs"
  | "Subjunctive Mood"
  | "Sentence Structure"
  | "Clauses"
  | "Agreement";

export interface GrammarTopic {
  id: string;
  title: string;
  category: GrammarCategory;
  gradeLevel: GradeLevel;
  description: string;
  rules: string[];
  examples: Array<{
    correct: string;
    explanation: string;
  }>;
  commonMistakes: Array<{
    incorrect: string;
    correct: string;
    explanation: string;
  }>;
  pepReference: string; // e.g., "Grade 9 Unit 3"
  difficulty: "basic" | "intermediate" | "advanced";
  relatedTopics: string[]; // IDs of related topics
}

export interface ErrorType {
  type: string;
  category: GrammarCategory;
  description: string;
  severity: "critical" | "important" | "minor";
}

/**
 * PEP Grammar Topics Database
 * Comprehensive collection organized by grade level
 */
export const GRAMMAR_TOPICS: GrammarTopic[] = [
  // 第一章：名词 (来源：星火英语·初中语法全解)

  {
    id: "nouns-features",
    title: "名词的特征",
    category: "Nouns",
    gradeLevel: 7,
    description: "名词是人类认识事物所使用的基本词汇，主要用来指各种人或事物具体的名称，也可以指抽象概念。",
    rules: [
      "可数名词有复数形式：英语中的大多数名词是可数名词，可数名词后可以加-s或-es构成复数形式",
      "名词前一般有限定词：名词前可由冠词（如a, an, the）或其他限定词修饰",
      "名词有自己的格：名词有主格、属格和宾格，属格一般是在其后加-'s或运用of + 名词结构",
    ],
    examples: [
      {
        correct: "two backpacks",
        explanation: "两个背包 - 可数名词的复数形式",
      },
      {
        correct: "many heroes",
        explanation: "很多英雄 - 以-o结尾的名词，复数加-es",
      },
      {
        correct: "a film",
        explanation: "一部电影 - 名词前有不定冠词修饰",
      },
      {
        correct: "Jack's shoes",
        explanation: "杰克的鞋 - 名词所有格：-'s形式",
      },
      {
        correct: "the gate of the school",
        explanation: "学校大门 - 名词所有格：of结构",
      },
    ],
    commonMistakes: [

    ],
    pepReference: "星火英语·初中语法全解 第一章",
    difficulty: "basic",
    relatedTopics: ["nouns-classification", "nouns-plural", "nouns-possessive"],
  },
  {
    id: "nouns-classification",
    title: "名词的分类",
    category: "Nouns",
    gradeLevel: 7,
    description: "名词可以分为专有名词和普通名词两大类。",
    rules: [
      "专有名词：表示具体的姓名、事物、地名、机构、月份和节日等",
      "个体名词：用来指单个人或事物的名词",
      "集体名词：用来指一群人或一些事物总称的名词",
      "物质名词：用来指无法分为个体的物质、材料的名词",
      "抽象名词：用来指人或事物的品质、情感、状态、动作等抽象概念的名词",
    ],
    examples: [
      {
        correct: "Green, Michael Jackson",
        explanation: "人名 - 专有名词：人名首字母大写",
      },
      {
        correct: "December, Mother's Day",
        explanation: "月份和节日 - 专有名词：时间名称",
      },
      {
        correct: "book, key, student",
        explanation: "书、钥匙、学生 - 个体名词",
      },
      {
        correct: "army, police, family",
        explanation: "军队、警察、家庭 - 集体名词",
      },
      {
        correct: "water, wind, glass",
        explanation: "水、风、玻璃 - 物质名词",
      },
      {
        correct: "honesty, love, silence",
        explanation: "诚实、热爱、安静 - 抽象名词",
      },
    ],
    commonMistakes: [

    ],
    pepReference: "星火英语·初中语法全解 第一章",
    difficulty: "basic",
    relatedTopics: ["nouns-features", "nouns-plural"],
  },
  {
    id: "nouns-plural-countable",
    title: "可数名词的数",
    category: "Nouns",
    gradeLevel: 7,
    description: "可数名词在表示两个或两个以上的概念时须用复数形式。",
    rules: [
      "规则1：一般名词后加-s，在清辅音后读[s]，在浊辅音或元音后读[z]",
      "规则2：以s, z, ʃ, ʒ, tʃ, dʒ等音素结尾的名词，后加-es，如果词尾为e，只加-s",
      "规则3：以'辅音字母 + o'结尾的名词，多数情况下加-es，es读作[z]",
      "规则4：以f(e)结尾的名词，大多数变f(e)为v，再加-es，ves读作[vz]",
      "规则5：以'辅音字母 + y'结尾的名词，变y为i，再加-es，ies读作[iz]",
      "规则6：以-th结尾的名词，一般加-s，th原来读[θ]，加复数词尾s后，多数情况下读[ð]",
    ],
    examples: [
      {
        correct: "stamp—stamps",
        explanation: "邮票 - 一般情况加-s",
      },
      {
        correct: "teacher—teachers",
        explanation: "教师 - 一般情况加-s",
      },
      {
        correct: "class—classes",
        explanation: "班级 - 以s结尾加-es",
      },
      {
        correct: "box—boxes",
        explanation: "盒子 - 以x结尾加-es",
      },
      {
        correct: "tomato—tomatoes",
        explanation: "西红柿 - 辅音+o结尾加-es",
      },
      {
        correct: "hero—heroes",
        explanation: "英雄 - 辅音+o结尾加-es",
      },
      {
        correct: "thief—thieves",
        explanation: "小偷 - f结尾变f为v加-es",
      },
      {
        correct: "knife—knives",
        explanation: "刀子 - fe结尾变f为v加-es",
      },
      {
        correct: "baby—babies",
        explanation: "婴儿 - 辅音+y结尾变y为i加-es",
      },
      {
        correct: "city—cities",
        explanation: "城市 - 辅音+y结尾变y为i加-es",
      },
    ],
    commonMistakes: [

    ],
    pepReference: "星火英语·初中语法全解 第一章",
    difficulty: "basic",
    relatedTopics: ["nouns-plural-irregular", "nouns-features"],
  },
  {
    id: "nouns-plural-irregular",
    title: "不规则复数形式",
    category: "Nouns",
    gradeLevel: 7,
    description: "有些名词的复数形式不遵循规则变化，需要特别记忆。",
    rules: [
      "变内部元音：foot—feet, man—men, woman—women, tooth—teeth, goose—geese, mouse—mice",
      "词尾加-ren或-en：child—children, ox—oxen",
      "单复数同形：fish, deer, sheep, means, Chinese, Japanese",
      "外来词：phenomenon—phenomena",
      "集体名词的复数：有些只有复数形式（goods, trousers, glasses），有些有形式变化但表示复数意义（police, people, cattle）",
    ],
    examples: [
      {
        correct: "foot—feet",
        explanation: "脚 - 变内部元音",
      },
      {
        correct: "man—men",
        explanation: "男人 - 变内部元音",
      },
      {
        correct: "child—children",
        explanation: "孩子们 - 词尾加-ren",
      },
      {
        correct: "fish (指条数)",
        explanation: "鱼 - 单复数同形",
      },
      {
        correct: "sheep",
        explanation: "绵羊 - 单复数同形",
      },
      {
        correct: "Chinese",
        explanation: "中国人 - 单复数同形",
      },
    ],
    commonMistakes: [

    ],
    pepReference: "星火英语·初中语法全解 第一章",
    difficulty: "intermediate",
    relatedTopics: ["nouns-plural-countable", "nouns-features"],
  },
  {
    id: "nouns-possessive-s",
    title: "名词的格：-'s所有格",
    category: "Nouns",
    gradeLevel: 7,
    description: "名词的格分为主格、宾格和所有格。名词所有格表示名词之间的所属关系。",
    rules: [
      "一般情况下，在名词词尾加-'s，在清辅音后读[s]，在浊辅音或元音后读[z]",
      "以-s或-es结尾的名词复数，直接在其后加'，读音与可数名词复数词尾相同",
      "不以-s结尾的可数名词复数，直接在其后加-'s，读音与可数名词复数词尾相同",
      "两人或多人共有一个人或事物时，只变化最后一个名词的词尾；如果为各自所有，各个名词的词尾都要变化",
      "表示时间、距离、国家、地点、自然现象等无生命的名词常用-'s所有格",
      "表示某人的店铺、医院、学校、住宅及公共建筑时，-'s所有格后常常不出现它所修饰的名词",
      "-'s所有格常用来表示节日",
    ],
    examples: [
      {
        correct: "Dick's hobby",
        explanation: "迪克的爱好 - 单数名词加-'s",
      },
      {
        correct: "my parents' hope",
        explanation: "我父母的希望 - 复数名词以-s结尾加'",
      },
      {
        correct: "children's time",
        explanation: "孩子们的时间 - 不规则复数加-'s",
      },
      {
        correct: "John and Susan's father",
        explanation: "约翰和苏珊的父亲（共有） - 共同所有",
      },
      {
        correct: "two days' trip",
        explanation: "两天的旅行 - 表示时间",
      },
      {
        correct: "China's weather",
        explanation: "中国的天气 - 表示国家",
      },
      {
        correct: "at the tailor's (shop)",
        explanation: "在裁缝店 - 店铺省略名词",
      },
      {
        correct: "Children's Day",
        explanation: "儿童节 - 节日",
      },
    ],
    commonMistakes: [

    ],
    pepReference: "星火英语·初中语法全解 第一章",
    difficulty: "intermediate",
    relatedTopics: ["nouns-possessive-of", "nouns-possessive-double"],
  },
  {
    id: "nouns-possessive-of",
    title: "of所有格和双重所有格",
    category: "Nouns",
    gradeLevel: 8,
    description: "'名词 + of + 名词'便构成了of所有格。双重所有格是'名词 + of + -'s所有格/名词性物主代词'构成双重所有格。",
    rules: [
      "of所有格表示无生命名词的所有关系",
      "名词化的形容词的所有关系用of所有格",
      "双重所有格：如果在表示所属物的名词前有冠词、数词、不定代词或指示代词时，常用双重所有格的形式来表示所有关系",
    ],
    examples: [
      {
        correct: "Beijing is the capital of China",
        explanation: "北京是中国的首都 - 无生命名词用of",
      },
      {
        correct: "The life of the poor is the biggest problem",
        explanation: "穷人的生活是最大的问题 - 名词化形容词用of",
      },
      {
        correct: "Two friends of mine had gone to the movies",
        explanation: "我的两个朋友去看电影了 - 双重所有格",
      },
      {
        correct: "David is a friend of my father's",
        explanation: "戴维是我父亲的一位朋友 - 双重所有格",
      },
    ],
    commonMistakes: [

    ],
    pepReference: "星火英语·初中语法全解 第一章",
    difficulty: "intermediate",
    relatedTopics: ["nouns-possessive-s"],
  },
  {
    id: "nouns-modifiers",
    title: "名词的修饰语",
    category: "Nouns",
    gradeLevel: 8,
    description: "名词可以由各种修饰语修饰，包括表示数量的词、单位词以及其他修饰语。",
    rules: [
      "只修饰可数名词：few（没有几个）, a few（几个）, several（几个）, many（很多）, a great/good many（很多）, a number of（若干）, numbers of（大量的）",
      "只修饰不可数名词：little（很少，几乎没有）, a little（一点）, much（许多）, a good/great deal of（很多）, a bit of（有一点，少量）",
      "既可修饰可数名词又可修饰不可数名词：some（一些）, lots of（很多）, a lot of（很多）, plenty of（充足的）, all（全部的）, most（大多数的）",
      "单位词：普通单位词（piece, article, bit）、度量单位词（metre, inch, yard, foot, pound, kilogram, ton, sum）、容积单位词（box, bag, basket, bottle, cup, glass, basin）、形状单位词（bar, block, loaf, cake, drop, grain）、集体单位词（team, crowd, group, fleet）",
      "其他修饰语：名词作修饰语（stone table）、形容词作修饰语（pretty girl）、副词作修饰语（the weather here）、介词短语作修饰语（a girl in clean clothes）、从句作修饰语（writers who write short stories）",
    ],
    examples: [
      {
        correct: "few students",
        explanation: "没有几个学生 - 修饰可数名词",
      },
      {
        correct: "much water",
        explanation: "许多水 - 修饰不可数名词",
      },
      {
        correct: "some money",
        explanation: "一些钱 - 既可修饰可数又可修饰不可数",
      },
      {
        correct: "a piece of music",
        explanation: "一段乐曲 - 普通单位词",
      },
      {
        correct: "a metre of cloth",
        explanation: "一米布 - 度量单位词",
      },
      {
        correct: "a cup of tea",
        explanation: "一杯茶 - 容积单位词",
      },
      {
        correct: "a bar of chocolate",
        explanation: "一块巧克力 - 形状单位词",
      },
      {
        correct: "a team of players",
        explanation: "一队选手 - 集体单位词",
      },
    ],
    commonMistakes: [

    ],
    pepReference: "星火英语·初中语法全解 第一章",
    difficulty: "intermediate",
    relatedTopics: ["nouns-plural-countable", "nouns-classification"],
  },
,
  // Grade 7 - Basic Foundation
  {
    id: "g7-simple-present",
    title: "Simple Present Tense",
    category: "Tenses",
    gradeLevel: 7,
    description: "Use the simple present tense to describe habits, facts, and general truths.",
    rules: [
      "Use base form of verb for I/you/we/they",
      "Add -s/-es for he/she/it",
      "Use do/does for questions and negatives",
    ],
    examples: [
      {
        correct: "She plays basketball every day.",
        explanation: "Third person singular (she) requires -s ending",
      },
      {
        correct: "They study English at school.",
        explanation: "Plural subject uses base form of verb",
      },
    ],
    commonMistakes: [
      {
        incorrect: "He play football.",
        correct: "He plays football.",
        explanation: "Third person singular requires -s ending",
      },
      {
        incorrect: "Does she plays tennis?",
        correct: "Does she play tennis?",
        explanation: "After 'does', use base form of verb",
      },
    ],
    pepReference: "Grade 7 Unit 1",
    difficulty: "basic",
    relatedTopics: ["g7-simple-past", "g8-present-continuous"],
  },
  {
    id: "g7-simple-past",
    title: "Simple Past Tense",
    category: "Tenses",
    gradeLevel: 7,
    description: "Use the simple past tense to describe completed actions in the past.",
    rules: [
      "Regular verbs: add -ed to base form",
      "Irregular verbs: use past form (go → went, see → saw)",
      "Use did for questions and negatives with base form",
    ],
    examples: [
      {
        correct: "I visited Beijing last summer.",
        explanation: "Regular verb 'visit' becomes 'visited' in past tense",
      },
      {
        correct: "She went to the library yesterday.",
        explanation: "Irregular verb 'go' becomes 'went' in past tense",
      },
    ],
    commonMistakes: [
      {
        incorrect: "I go to school yesterday.",
        correct: "I went to school yesterday.",
        explanation: "Use past tense 'went' with time marker 'yesterday'",
      },
      {
        incorrect: "Did you went there?",
        correct: "Did you go there?",
        explanation: "After 'did', use base form of verb",
      },
    ],
    pepReference: "Grade 7 Unit 4",
    difficulty: "basic",
    relatedTopics: ["g7-simple-present", "g8-present-perfect"],
  },
  {
    id: "g7-articles-basic",
    title: "Articles: A, An, The",
    category: "Articles",
    gradeLevel: 7,
    description: "Learn when to use indefinite articles (a, an) and the definite article (the).",
    rules: [
      "Use 'a' before consonant sounds",
      "Use 'an' before vowel sounds",
      "Use 'the' for specific or previously mentioned nouns",
    ],
    examples: [
      {
        correct: "I have a book and an apple.",
        explanation: "'a' before consonant sound (book), 'an' before vowel sound (apple)",
      },
      {
        correct: "The book on the table is mine.",
        explanation: "'the' refers to a specific book",
      },
    ],
    commonMistakes: [
      {
        incorrect: "I saw a elephant.",
        correct: "I saw an elephant.",
        explanation: "Use 'an' before vowel sound",
      },
      {
        incorrect: "I like the music.",
        correct: "I like music.",
        explanation: "No article needed for music in general",
      },
    ],
    pepReference: "Grade 7 Unit 2",
    difficulty: "basic",
    relatedTopics: ["g8-articles-advanced"],
  },

  // Grade 8 - Building Complexity
  {
    id: "g8-present-continuous",
    title: "Present Continuous Tense",
    category: "Tenses",
    gradeLevel: 8,
    description: "Use present continuous for actions happening now or around now.",
    rules: [
      "Form: am/is/are + verb-ing",
      "Use for actions in progress now",
      "Use for temporary situations",
    ],
    examples: [
      {
        correct: "She is reading a book right now.",
        explanation: "Action happening at this moment",
      },
      {
        correct: "They are studying for exams this week.",
        explanation: "Temporary situation around the present",
      },
    ],
    commonMistakes: [
      {
        incorrect: "He is play basketball.",
        correct: "He is playing basketball.",
        explanation: "Must use -ing form after is/am/are",
      },
      {
        incorrect: "I am understanding this.",
        correct: "I understand this.",
        explanation: "Stative verbs (understand, know, like) don't use continuous form",
      },
    ],
    pepReference: "Grade 8 Unit 1",
    difficulty: "basic",
    relatedTopics: ["g7-simple-present", "g8-present-perfect"],
  },
  {
    id: "g8-present-perfect",
    title: "Present Perfect Tense",
    category: "Tenses",
    gradeLevel: 8,
    description: "Use present perfect to connect past actions with the present.",
    rules: [
      "Form: have/has + past participle",
      "Use for experiences (ever, never)",
      "Use for unfinished time periods (today, this week)",
      "Use with 'for' and 'since' for duration",
    ],
    examples: [
      {
        correct: "I have visited Shanghai three times.",
        explanation: "Life experience up to now",
      },
      {
        correct: "She has lived here for five years.",
        explanation: "Action started in past, continues to present",
      },
    ],
    commonMistakes: [
      {
        incorrect: "I have seen him yesterday.",
        correct: "I saw him yesterday.",
        explanation: "Use simple past with specific past time (yesterday)",
      },
      {
        incorrect: "He has went to Beijing.",
        correct: "He has gone to Beijing.",
        explanation: "Past participle of 'go' is 'gone', not 'went'",
      },
    ],
    pepReference: "Grade 8 Unit 5",
    difficulty: "intermediate",
    relatedTopics: ["g7-simple-past", "g9-present-perfect-continuous"],
  },
  {
    id: "g8-modal-verbs",
    title: "Modal Verbs: Can, Could, May, Might, Must, Should",
    category: "Modal Verbs",
    gradeLevel: 8,
    description: "Use modal verbs to express ability, possibility, permission, and obligation.",
    rules: [
      "Modal + base form of verb (no -s, no -ing, no -ed)",
      "Can/Could: ability, possibility, permission",
      "May/Might: possibility, permission",
      "Must/Should: obligation, advice",
    ],
    examples: [
      {
        correct: "She can speak three languages.",
        explanation: "Can expresses ability",
      },
      {
        correct: "You should study harder.",
        explanation: "Should gives advice",
      },
    ],
    commonMistakes: [
      {
        incorrect: "He can plays guitar.",
        correct: "He can play guitar.",
        explanation: "Use base form after modal verbs",
      },
      {
        incorrect: "You must to go now.",
        correct: "You must go now.",
        explanation: "No 'to' after modal verbs",
      },
    ],
    pepReference: "Grade 8 Unit 3",
    difficulty: "basic",
    relatedTopics: ["g9-modal-perfect"],
  },

  // Grade 9 - Advanced Grammar
  {
    id: "g9-present-perfect-continuous",
    title: "Present Perfect Continuous",
    category: "Tenses",
    gradeLevel: 9,
    description: "Use present perfect continuous to emphasize duration of ongoing actions.",
    rules: [
      "Form: have/has been + verb-ing",
      "Emphasizes duration and continuity",
      "Often used with 'for' and 'since'",
    ],
    examples: [
      {
        correct: "I have been studying English for three hours.",
        explanation: "Emphasizes the duration of the ongoing action",
      },
      {
        correct: "She has been working here since 2020.",
        explanation: "Action started in past and continues to present",
      },
    ],
    commonMistakes: [
      {
        incorrect: "They have been knowing each other for years.",
        correct: "They have known each other for years.",
        explanation: "Stative verbs don't use continuous forms",
      },
    ],
    pepReference: "Grade 9 Unit 2",
    difficulty: "intermediate",
    relatedTopics: ["g8-present-perfect", "g9-past-perfect"],
  },
  {
    id: "g9-past-perfect",
    title: "Past Perfect Tense",
    category: "Tenses",
    gradeLevel: 9,
    description: "Use past perfect to show one past action happened before another past action.",
    rules: [
      "Form: had + past participle",
      "Shows which action happened first in the past",
      "Often used with 'before', 'after', 'when', 'by the time'",
    ],
    examples: [
      {
        correct: "When I arrived, the movie had already started.",
        explanation: "Movie started before I arrived (both in past)",
      },
      {
        correct: "She had finished her homework before dinner.",
        explanation: "Homework was completed before dinner time",
      },
    ],
    commonMistakes: [
      {
        incorrect: "After he left, I had realized my mistake.",
        correct: "After he left, I realized my mistake.",
        explanation: "Use simple past when sequence is clear from 'after'",
      },
    ],
    pepReference: "Grade 9 Unit 4",
    difficulty: "intermediate",
    relatedTopics: ["g7-simple-past", "g9-present-perfect-continuous"],
  },
  {
    id: "g9-passive-voice",
    title: "Passive Voice",
    category: "Passive Voice",
    gradeLevel: 9,
    description: "Use passive voice when the action is more important than who does it.",
    rules: [
      "Form: be + past participle",
      "Use when focus is on the action, not the doer",
      "Can be used in different tenses",
    ],
    examples: [
      {
        correct: "The book was written by Lu Xun.",
        explanation: "Focus on the book, not the author",
      },
      {
        correct: "English is spoken all over the world.",
        explanation: "Focus on the language, not the speakers",
      },
    ],
    commonMistakes: [
      {
        incorrect: "The letter was wrote yesterday.",
        correct: "The letter was written yesterday.",
        explanation: "Use past participle 'written', not past tense 'wrote'",
      },
      {
        incorrect: "The house is building now.",
        correct: "The house is being built now.",
        explanation: "Use 'being + past participle' for continuous passive",
      },
    ],
    pepReference: "Grade 9 Unit 6",
    difficulty: "intermediate",
    relatedTopics: ["g10-passive-advanced"],
  },

  // Grade 10 - Complex Structures
  {
    id: "g10-conditionals-zero-first",
    title: "Conditionals: Zero and First",
    category: "Conditionals",
    gradeLevel: 10,
    description: "Use conditionals to express real and possible situations.",
    rules: [
      "Zero conditional: If + present, present (general truths)",
      "First conditional: If + present, will + base form (real possibility)",
    ],
    examples: [
      {
        correct: "If you heat water to 100°C, it boils.",
        explanation: "Zero conditional for scientific facts",
      },
      {
        correct: "If it rains tomorrow, I will stay home.",
        explanation: "First conditional for real future possibility",
      },
    ],
    commonMistakes: [
      {
        incorrect: "If I will see him, I will tell him.",
        correct: "If I see him, I will tell him.",
        explanation: "Use present tense in 'if' clause, not 'will'",
      },
    ],
    pepReference: "Grade 10 Unit 2",
    difficulty: "intermediate",
    relatedTopics: ["g11-conditionals-second-third"],
  },
  {
    id: "g10-reported-speech",
    title: "Reported Speech",
    category: "Reported Speech",
    gradeLevel: 10,
    description: "Report what someone said without using their exact words.",
    rules: [
      "Change pronouns and time expressions",
      "Backshift tenses (present → past, past → past perfect)",
      "Use reporting verbs (say, tell, ask)",
    ],
    examples: [
      {
        correct: "He said that he was tired.",
        explanation: "Direct: 'I am tired' → Reported: he was tired",
      },
      {
        correct: "She told me that she had finished the work.",
        explanation: "Direct: 'I have finished' → Reported: she had finished",
      },
    ],
    commonMistakes: [
      {
        incorrect: "He said me that he was busy.",
        correct: "He told me that he was busy.",
        explanation: "Use 'told' with indirect object, not 'said'",
      },
      {
        incorrect: "She said that she is coming tomorrow.",
        correct: "She said that she was coming the next day.",
        explanation: "Backshift tense and change time expression",
      },
    ],
    pepReference: "Grade 10 Unit 5",
    difficulty: "advanced",
    relatedTopics: ["g11-reported-questions"],
  },

  // Grade 11 - Advanced Structures
  {
    id: "g11-conditionals-second-third",
    title: "Conditionals: Second and Third",
    category: "Conditionals",
    gradeLevel: 11,
    description: "Express unreal and hypothetical situations in present and past.",
    rules: [
      "Second conditional: If + past, would + base form (unreal present)",
      "Third conditional: If + past perfect, would have + past participle (unreal past)",
    ],
    examples: [
      {
        correct: "If I had more time, I would travel the world.",
        explanation: "Second conditional: unreal present situation",
      },
      {
        correct: "If I had studied harder, I would have passed the exam.",
        explanation: "Third conditional: unreal past situation",
      },
    ],
    commonMistakes: [
      {
        incorrect: "If I would have money, I would buy it.",
        correct: "If I had money, I would buy it.",
        explanation: "Don't use 'would' in the 'if' clause",
      },
    ],
    pepReference: "Grade 11 Unit 3",
    difficulty: "advanced",
    relatedTopics: ["g10-conditionals-zero-first", "g12-mixed-conditionals"],
  },
  {
    id: "g11-non-finite-verbs",
    title: "Non-finite Verbs: Infinitives and Gerunds",
    category: "Non-finite Verbs",
    gradeLevel: 11,
    description: "Use infinitives (to + verb) and gerunds (verb-ing) correctly.",
    rules: [
      "Some verbs take infinitive: want, decide, plan, hope",
      "Some verbs take gerund: enjoy, finish, avoid, mind",
      "Some verbs take both with different meanings: stop, remember, forget",
    ],
    examples: [
      {
        correct: "I want to learn English.",
        explanation: "'want' is followed by infinitive",
      },
      {
        correct: "She enjoys reading books.",
        explanation: "'enjoy' is followed by gerund",
      },
      {
        correct: "I stopped to talk to him. (stopped in order to talk)",
        explanation: "Infinitive shows purpose",
      },
      {
        correct: "I stopped talking to him. (stopped the action of talking)",
        explanation: "Gerund is the object of 'stopped'",
      },
    ],
    commonMistakes: [
      {
        incorrect: "I want learning English.",
        correct: "I want to learn English.",
        explanation: "'want' requires infinitive, not gerund",
      },
      {
        incorrect: "She finished to write the essay.",
        correct: "She finished writing the essay.",
        explanation: "'finish' requires gerund, not infinitive",
      },
    ],
    pepReference: "Grade 11 Unit 6",
    difficulty: "advanced",
    relatedTopics: ["g12-participles"],
  },

  // Grade 12 - Mastery Level
  {
    id: "g12-subjunctive-mood",
    title: "Subjunctive Mood",
    category: "Subjunctive Mood",
    gradeLevel: 12,
    description: "Use subjunctive mood for wishes, suggestions, and hypothetical situations.",
    rules: [
      "Use base form after suggest, recommend, insist, demand",
      "Use 'were' (not 'was') in unreal conditions",
      "Use 'should' in formal suggestions",
    ],
    examples: [
      {
        correct: "I suggest that he study harder.",
        explanation: "Base form 'study' after 'suggest'",
      },
      {
        correct: "If I were you, I would accept the offer.",
        explanation: "Use 'were' for all persons in unreal conditions",
      },
    ],
    commonMistakes: [
      {
        incorrect: "I suggest that he studies harder.",
        correct: "I suggest that he study harder.",
        explanation: "Use base form, not present tense",
      },
      {
        incorrect: "If I was rich, I would travel.",
        correct: "If I were rich, I would travel.",
        explanation: "Use 'were' in hypothetical conditions",
      },
    ],
    pepReference: "Grade 12 Unit 4",
    difficulty: "advanced",
    relatedTopics: ["g11-conditionals-second-third"],
  },
  {
    id: "g12-complex-sentences",
    title: "Complex Sentence Structures",
    category: "Sentence Structure",
    gradeLevel: 12,
    description: "Combine clauses to create sophisticated sentences.",
    rules: [
      "Use relative clauses (who, which, that, where, when)",
      "Use adverbial clauses (although, because, while, unless)",
      "Use noun clauses (that, what, whether, if)",
    ],
    examples: [
      {
        correct: "The book that I bought yesterday is very interesting.",
        explanation: "Relative clause modifies 'book'",
      },
      {
        correct: "Although it was raining, we went out.",
        explanation: "Adverbial clause shows contrast",
      },
    ],
    commonMistakes: [
      {
        incorrect: "The person which helped me was kind.",
        correct: "The person who helped me was kind.",
        explanation: "Use 'who' for people, not 'which'",
      },
    ],
    pepReference: "Grade 12 Unit 7",
    difficulty: "advanced",
    relatedTopics: ["g11-non-finite-verbs"],
  },
];

/**
 * Error type definitions for grammar checking
 */
export const ERROR_TYPES: ErrorType[] = [
  {
    type: "verb_tense",
    category: "Tenses",
    description: "Incorrect verb tense usage",
    severity: "critical",
  },
  {
    type: "subject_verb_agreement",
    category: "Agreement",
    description: "Subject and verb do not agree in number",
    severity: "critical",
  },
  {
    type: "article_error",
    category: "Articles",
    description: "Missing, incorrect, or unnecessary article",
    severity: "important",
  },
  {
    type: "preposition_error",
    category: "Prepositions",
    description: "Wrong preposition used",
    severity: "important",
  },
  {
    type: "modal_verb_error",
    category: "Modal Verbs",
    description: "Incorrect modal verb usage",
    severity: "important",
  },
  {
    type: "passive_voice_error",
    category: "Passive Voice",
    description: "Incorrect passive voice construction",
    severity: "important",
  },
  {
    type: "word_order",
    category: "Sentence Structure",
    description: "Incorrect word order in sentence",
    severity: "critical",
  },
  {
    type: "spelling",
    category: "Sentence Structure",
    description: "Spelling mistake",
    severity: "minor",
  },
  {
    type: "punctuation",
    category: "Sentence Structure",
    description: "Missing or incorrect punctuation",
    severity: "minor",
  },
];

/**
 * Get grammar topics by grade level
 */
export function getTopicsByGrade(grade: GradeLevel): GrammarTopic[] {
  return GRAMMAR_TOPICS.filter((topic) => topic.gradeLevel === grade);
}

/**
 * Get grammar topics by category
 */
export function getTopicsByCategory(category: GrammarCategory): GrammarTopic[] {
  return GRAMMAR_TOPICS.filter((topic) => topic.category === category);
}

/**
 * Get a specific grammar topic by ID
 */
export function getTopicById(id: string): GrammarTopic | undefined {
  return GRAMMAR_TOPICS.find((topic) => topic.id === id);
}

/**
 * Get all unique categories
 */
export function getAllCategories(): GrammarCategory[] {
  const categories = new Set(GRAMMAR_TOPICS.map((topic) => topic.category));
  return Array.from(categories);
}
