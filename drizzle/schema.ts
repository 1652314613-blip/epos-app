import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  /** 密码哈希（用于邮箱登录） */
  passwordHash: text("passwordHash"),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  /** 手机号（用于短信验证码登录） */
  phoneNumber: varchar("phoneNumber", { length: 11 }).unique(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 短信验证码表
 * 存储发送的验证码，用于手机号登录验证
 */
export const smsVerificationCodes = mysqlTable("sms_verification_codes", {
  id: int("id").autoincrement().primaryKey(),
  /** 手机号 */
  phoneNumber: varchar("phoneNumber", { length: 11 }).notNull(),
  /** 验证码（6位数字） */
  code: varchar("code", { length: 6 }).notNull(),
  /** 验证码类型：login（登录）、register（注册） */
  type: mysqlEnum("type", ["login", "register"]).notNull(),
  /** 是否已使用 */
  used: int("used").default(0).notNull(), // 0=未使用，1=已使用
  /** 过期时间 */
  expiresAt: timestamp("expiresAt").notNull(),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SmsVerificationCode = typeof smsVerificationCodes.$inferSelect;
export type InsertSmsVerificationCode = typeof smsVerificationCodes.$inferInsert;

// TODO: Add your tables here

/**
 * 口语练习记录表
 * 存储用户的口语练习历史记录
 */
export const oralPracticeRecords = mysqlTable("oral_practice_records", {
  id: int("id").autoincrement().primaryKey(),
  /** 用户ID */
  userId: int("userId").notNull(),
  /** 练习场景：textbook（课文同步）、exam（考场模拟）、free（自由对话） */
  scenario: mysqlEnum("scenario", ["textbook", "exam", "free"]).notNull(),
  /** 用户说的文本（转写后） */
  userText: text("userText").notNull(),
  /** 音频文件URL */
  audioUrl: text("audioUrl"),
  /** AI评价结果（JSON格式） */
  aiEvaluation: text("aiEvaluation"),
  /** 综合评分（0-100） */
  score: int("score"),
  /** 练习时长（秒） */
  duration: int("duration"),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OralPracticeRecord = typeof oralPracticeRecords.$inferSelect;
export type InsertOralPracticeRecord = typeof oralPracticeRecords.$inferInsert;

/**
 * 表达积累本表
 * 存储用户收藏的地道表达
 */
export const expressionCollection = mysqlTable("expression_collection", {
  id: int("id").autoincrement().primaryKey(),
  /** 用户ID */
  userId: int("userId").notNull(),
  /** 地道表达 */
  expression: text("expression").notNull(),
  /** 使用场景/上下文 */
  context: text("context"),
  /** 来源：oral（口语）、grammar（语法）、reading（阅读） */
  source: mysqlEnum("source", ["oral", "grammar", "reading"]).default("oral").notNull(),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExpressionCollection = typeof expressionCollection.$inferSelect;
export type InsertExpressionCollection = typeof expressionCollection.$inferInsert;

/**
 * 口语能力评估表
 * 存储用户的口语能力各维度评分
 */
export const oralAbilityAssessment = mysqlTable("oral_ability_assessment", {
  id: int("id").autoincrement().primaryKey(),
  /** 用户ID */
  userId: int("userId").notNull().unique(),
  /** 语法准确性评分（0-100） */
  grammarScore: int("grammarScore").default(0).notNull(),
  /** 发音清晰度评分（0-100） */
  pronunciationScore: int("pronunciationScore").default(0).notNull(),
  /** 流利度评分（0-100） */
  fluencyScore: int("fluencyScore").default(0).notNull(),
  /** 词汇丰富度评分（0-100） */
  vocabularyScore: int("vocabularyScore").default(0).notNull(),
  /** 表达地道性评分（0-100） */
  authenticityScore: int("authenticityScore").default(0).notNull(),
  /** 综合评分（0-100） */
  overallScore: int("overallScore").default(0).notNull(),
  /** 更新时间 */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OralAbilityAssessment = typeof oralAbilityAssessment.$inferSelect;
export type InsertOralAbilityAssessment = typeof oralAbilityAssessment.$inferInsert;

/**
 * 语法章节表
 * 存储语法书的章节信息（如"名词"、"动词"等）
 */
export const grammarChapters = mysqlTable("grammar_chapters", {
  id: int("id").autoincrement().primaryKey(),
  /** 章节标题（中文） */
  title: varchar("title", { length: 100 }).notNull(),
  /** 章节标题（英文） */
  titleEn: varchar("titleEn", { length: 100 }),
  /** 章节顺序 */
  order: int("order").notNull(),
  /** 页码范围 */
  pageRange: varchar("pageRange", { length: 50 }),
  /** 考点权重百分比 */
  examWeightPercentage: int("examWeightPercentage"),
  /** 考点权重细分（JSON格式） */
  examWeightBreakdown: text("examWeightBreakdown"),
  /** 考点标签（JSON数组） */
  examTags: text("examTags"),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 更新时间 */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GrammarChapter = typeof grammarChapters.$inferSelect;
export type InsertGrammarChapter = typeof grammarChapters.$inferInsert;

/**
 * 语法知识点表
 * 存储具体的语法知识点（如"名词的特征"、"可数名词的数"等）
 */
export const grammarTopics = mysqlTable("grammar_topics", {
  id: int("id").autoincrement().primaryKey(),
  /** 章节ID */
  chapterId: int("chapterId").notNull(),
  /** 知识点ID（如nouns-features） */
  topicId: varchar("topicId", { length: 100 }).notNull().unique(),
  /** 知识点标题（中文） */
  title: varchar("title", { length: 200 }).notNull(),
  /** 知识点标题（英文） */
  titleEn: varchar("titleEn", { length: 200 }),
  /** 年级（如7A, 7B, 8A等） */
  grade: varchar("grade", { length: 10 }),
  /** 单元号 */
  unit: int("unit"),
  /** 类别（如noun, verb, tense等） */
  category: varchar("category", { length: 50 }),
  /** 难度：basic, intermediate, advanced */
  difficulty: mysqlEnum("difficulty", ["basic", "intermediate", "advanced"]).default("basic").notNull(),
  /** 考点标签 */
  examTag: varchar("examTag", { length: 50 }),
  /** 知识点描述 */
  description: text("description"),
  /** 核心规则（JSON数组） */
  rules: text("rules"),
  /** 例句（JSON数组） */
  examples: text("examples"),
  /** 记忆口诀（JSON数组） */
  memoryTips: text("memoryTips"),
  /** 特别提示（JSON数组） */
  specialNotes: text("specialNotes"),
  /** 常见错误（JSON数组） */
  commonMistakes: text("commonMistakes"),
  /** 关联知识点ID（JSON数组） */
  relatedTopics: text("relatedTopics"),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 更新时间 */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GrammarTopic = typeof grammarTopics.$inferSelect;
export type InsertGrammarTopic = typeof grammarTopics.$inferInsert;

/**
 * 语法练习题表
 * 存储语法练习题
 */
export const grammarExercises = mysqlTable("grammar_exercises", {
  id: int("id").autoincrement().primaryKey(),
  /** 知识点ID */
  topicId: int("topicId").notNull(),
  /** 题目类型：multiple-choice, fill-blank, error-correction等 */
  type: varchar("type", { length: 50 }).notNull(),
  /** 题目内容 */
  question: text("question").notNull(),
  /** 选项（JSON数组，用于选择题） */
  options: text("options"),
  /** 正确答案 */
  correctAnswer: text("correctAnswer").notNull(),
  /** 解析 */
  explanation: text("explanation"),
  /** 难度：basic, intermediate, advanced */
  difficulty: mysqlEnum("difficulty", ["basic", "intermediate", "advanced"]).default("basic").notNull(),
  /** 考点标签 */
  examTag: varchar("examTag", { length: 50 }),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 更新时间 */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GrammarExercise = typeof grammarExercises.$inferSelect;
export type InsertGrammarExercise = typeof grammarExercises.$inferInsert;
