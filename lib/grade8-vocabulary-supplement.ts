/**
 * Grade 8 Vocabulary Supplement
 * 基于人教版八年级上下册教材大纲整理的词汇主题
 * 注：具体单词列表需要学生参考教材课后词汇表
 */

export interface VocabularyUnit {
  grade: number;
  semester: "上册" | "下册";
  unit: number;
  title: string;
  topics: string[];
  keyPhrases: string[];
}

export const GRADE_8_VOCABULARY_UNITS: VocabularyUnit[] = [
  // 八年级上册
  {
    grade: 8,
    semester: "上册",
    unit: 1,
    title: "Happy Holiday",
    topics: ["假期活动", "旅游", "不定代词"],
    keyPhrases: [
      "go on vacation",
      "stay at home",
      "visit museums",
      "go to the beach",
      "something special",
      "quite a few"
    ]
  },
  {
    grade: 8,
    semester: "上册",
    unit: 2,
    title: "Home Sweet Home",
    topics: ["家务", "请求和许可", "频率副词"],
    keyPhrases: [
      "help out",
      "at least",
      "hardly ever",
      "once a week",
      "twice a month",
      "Could you please...?"
    ]
  },
  {
    grade: 8,
    semester: "上册",
    unit: 3,
    title: "Same or Different?",
    topics: ["外貌", "性格", "比较级"],
    keyPhrases: [
      "more outgoing",
      "as...as",
      "be different from",
      "be similar to",
      "bring out the best",
      "care about"
    ]
  },
  {
    grade: 8,
    semester: "上册",
    unit: 4,
    title: "Amazing Plants and Animals",
    topics: ["动植物", "最高级", "名词后缀"],
    keyPhrases: [
      "the most amazing",
      "play a role in",
      "for example",
      "all kinds of",
      "be up to",
      "take...seriously"
    ]
  },
  {
    grade: 8,
    semester: "上册",
    unit: 5,
    title: "What a Delicious Meal!",
    topics: ["食物", "烹饪", "可数不可数名词"],
    keyPhrases: [
      "turn on",
      "cut up",
      "pour...into",
      "mix...together",
      "one by one",
      "a piece of"
    ]
  },
  {
    grade: 8,
    semester: "上册",
    unit: 6,
    title: "Plan for Yourself",
    topics: ["职业", "计划", "将来时"],
    keyPhrases: [
      "grow up",
      "be going to",
      "want to be",
      "make sure",
      "be able to",
      "have to do with"
    ]
  },
  {
    grade: 8,
    semester: "上册",
    unit: 7,
    title: "When Tomorrow Comes",
    topics: ["未来预测", "科技", "will"],
    keyPhrases: [
      "in the future",
      "hundreds of",
      "fall down",
      "look for",
      "over and over again",
      "wake up"
    ]
  },
  {
    grade: 8,
    semester: "上册",
    unit: 8,
    title: "Let's Communicate!",
    topics: ["沟通", "建议", "条件句"],
    keyPhrases: [
      "have a great time",
      "give advice",
      "keep...to oneself",
      "in half",
      "be angry with",
      "make mistakes"
    ]
  },

  // 八年级下册
  {
    grade: 8,
    semester: "下册",
    unit: 1,
    title: "What's the matter?",
    topics: ["健康", "急救", "身体部位"],
    keyPhrases: [
      "have a cold",
      "have a fever",
      "lie down",
      "take one's temperature",
      "get off",
      "right away"
    ]
  },
  {
    grade: 8,
    semester: "下册",
    unit: 2,
    title: "I'll help to clean up the city parks",
    topics: ["志愿活动", "慈善", "短语动词"],
    keyPhrases: [
      "clean up",
      "cheer up",
      "give out",
      "come up with",
      "put off",
      "hand out",
      "call up",
      "care for"
    ]
  },
  {
    grade: 8,
    semester: "下册",
    unit: 3,
    title: "Could you please clean your room?",
    topics: ["家务", "请求", "许可"],
    keyPhrases: [
      "take out the rubbish",
      "fold the clothes",
      "sweep the floor",
      "make the bed",
      "do the dishes",
      "all the time",
      "as soon as",
      "in order to"
    ]
  },
  {
    grade: 8,
    semester: "下册",
    unit: 4,
    title: "Why don't you talk to your parents?",
    topics: ["人际关系", "建议", "连词"],
    keyPhrases: [
      "get on with",
      "hang out",
      "work out",
      "get into a fight",
      "look through",
      "big deal",
      "compare...with",
      "in one's opinion"
    ]
  },
  {
    grade: 8,
    semester: "下册",
    unit: 5,
    title: "What were you doing when the rainstorm came?",
    topics: ["难忘事件", "过去进行时", "when/while"],
    keyPhrases: [
      "go off",
      "pick up",
      "fall asleep",
      "die down",
      "have a look",
      "make one's way",
      "in silence",
      "take down",
      "at first"
    ]
  },
  {
    grade: 8,
    semester: "下册",
    unit: 6,
    title: "An old man tried to move the mountains",
    topics: ["传说故事", "unless/as soon as/so...that"],
    keyPhrases: [
      "once upon a time",
      "fall in love",
      "get married",
      "turn...into",
      "instead of",
      "a little bit",
      "keep doing sth",
      "give up"
    ]
  },
  {
    grade: 8,
    semester: "下册",
    unit: 7,
    title: "What's the highest mountain in the world?",
    topics: ["地理", "自然", "比较级最高级"],
    keyPhrases: [
      "as far as I know",
      "take in",
      "in the face of",
      "even though",
      "at birth",
      "up to",
      "walk into",
      "fall over",
      "or so"
    ]
  },
  {
    grade: 8,
    semester: "下册",
    unit: 8,
    title: "Have you read Treasure Island yet?",
    topics: ["文学", "音乐", "现在完成时already/yet"],
    keyPhrases: [
      "full of",
      "hurry up",
      "due date",
      "at least",
      "can't wait to do",
      "used to",
      "fight over",
      "come to realize"
    ]
  },
  {
    grade: 8,
    semester: "下册",
    unit: 9,
    title: "Have you ever been to a museum?",
    topics: ["地点", "经历", "现在完成时been/ever/never"],
    keyPhrases: [
      "have been to",
      "have gone to",
      "amusement park",
      "put up",
      "in such a rapid way",
      "different kinds of",
      "tea art",
      "a couple of"
    ]
  },
  {
    grade: 8,
    semester: "下册",
    unit: 10,
    title: "I've had this bike for three years",
    topics: ["家乡", "变化", "现在完成时since/for"],
    keyPhrases: [
      "yard sale",
      "check out",
      "no longer",
      "part with",
      "as for",
      "to be honest",
      "according to",
      "close to",
      "in need"
    ]
  }
];

/**
 * 获取指定年级和学期的词汇单元
 */
export function getVocabularyUnits(grade: number, semester?: "上册" | "下册"): VocabularyUnit[] {
  let units = GRADE_8_VOCABULARY_UNITS.filter(unit => unit.grade === grade);
  if (semester) {
    units = units.filter(unit => unit.semester === semester);
  }
  return units;
}

/**
 * 获取指定单元的词汇信息
 */
export function getVocabularyUnit(grade: number, semester: "上册" | "下册", unitNumber: number): VocabularyUnit | undefined {
  return GRADE_8_VOCABULARY_UNITS.find(
    unit => unit.grade === grade && unit.semester === semester && unit.unit === unitNumber
  );
}
