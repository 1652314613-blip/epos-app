var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
var schema_exports = {};
__export(schema_exports, {
  expressionCollection: () => expressionCollection,
  grammarChapters: () => grammarChapters,
  grammarExercises: () => grammarExercises,
  grammarTopics: () => grammarTopics,
  oralAbilityAssessment: () => oralAbilityAssessment,
  oralPracticeRecords: () => oralPracticeRecords,
  smsVerificationCodes: () => smsVerificationCodes,
  users: () => users
});
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users, smsVerificationCodes, oralPracticeRecords, expressionCollection, oralAbilityAssessment, grammarChapters, grammarTopics, grammarExercises;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
      /**
       * Surrogate primary key. Auto-incremented numeric value managed by the database.
       * Use this for relations between tables.
       */
      id: int("id").autoincrement().primaryKey(),
      /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
      /** 手机号（用于短信验证码登录） */
      phoneNumber: varchar("phoneNumber", { length: 11 }).unique()
    });
    smsVerificationCodes = mysqlTable("sms_verification_codes", {
      id: int("id").autoincrement().primaryKey(),
      /** 手机号 */
      phoneNumber: varchar("phoneNumber", { length: 11 }).notNull(),
      /** 验证码（6位数字） */
      code: varchar("code", { length: 6 }).notNull(),
      /** 验证码类型：login（登录）、register（注册） */
      type: mysqlEnum("type", ["login", "register"]).notNull(),
      /** 是否已使用 */
      used: int("used").default(0).notNull(),
      // 0=未使用，1=已使用
      /** 过期时间 */
      expiresAt: timestamp("expiresAt").notNull(),
      /** 创建时间 */
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    oralPracticeRecords = mysqlTable("oral_practice_records", {
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
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    expressionCollection = mysqlTable("expression_collection", {
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
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    oralAbilityAssessment = mysqlTable("oral_ability_assessment", {
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
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    grammarChapters = mysqlTable("grammar_chapters", {
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
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    grammarTopics = mysqlTable("grammar_topics", {
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
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    grammarExercises = mysqlTable("grammar_exercises", {
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
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    console.log("[ENV] OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + "..." : "NOT SET");
    console.log("[ENV] OPENAI_BASE_URL:", process.env.OPENAI_BASE_URL || "NOT SET");
    console.log("[ENV] OPENAI_MODEL:", process.env.OPENAI_MODEL || "NOT SET");
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      // 支持多种API密钥配置方式
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? process.env.OPENAI_BASE_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? process.env.OPENAI_API_KEY ?? "",
      // DeepSeek 配置
      openaiModel: process.env.OPENAI_MODEL ?? "deepseek-chat"
    };
    console.log("[ENV] Final forgeApiKey:", ENV.forgeApiKey ? ENV.forgeApiKey.substring(0, 10) + "..." : "EMPTY");
    console.log("[ENV] Final forgeApiUrl:", ENV.forgeApiUrl || "EMPTY (will use default)");
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  getDb: () => getDb,
  getUserByOpenId: () => getUserByOpenId,
  upsertUser: () => upsertUser
});
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
async function getDb() {
  const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  if (!_db && dbUrl) {
    try {
      _db = drizzle(dbUrl, {
        schema: { users, smsVerificationCodes },
        mode: "default"
      });
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
var _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
  }
});

// server/scripts/noun-data.json
var noun_data_default;
var init_noun_data = __esm({
  "server/scripts/noun-data.json"() {
    noun_data_default = {
      chapter: {
        id: "ch1-nouns",
        title: "\u540D\u8BCD (Nouns)",
        order: 1,
        pageRange: "2-39",
        examWeight: {
          percentage: 6,
          breakdown: {
            \u8BCD\u4E49\u8FA8\u6790: 80,
            \u5355\u590D\u6570: 12,
            \u6240\u6709\u683C: 7,
            \u4F5C\u5B9A\u8BED: 1
          }
        },
        examTags: [
          "\u4E2D\u8003\u9AD8\u9891",
          "\u57FA\u7840\u5FC5\u4F1A"
        ],
        topics: [
          {
            id: "nouns-features",
            title: "\u540D\u8BCD\u7684\u7279\u5F81",
            category: "Nouns",
            gradeLevel: 7,
            difficulty: "basic",
            examTag: "\u57FA\u7840\u5FC5\u4F1A",
            description: "\u540D\u8BCD\u662F\u4EBA\u7C7B\u8BA4\u8BC6\u4E8B\u7269\u6240\u4F7F\u7528\u7684\u57FA\u672C\u8BCD\u6C47\uFF0C\u4E3B\u8981\u7528\u6765\u6307\u5404\u79CD\u4EBA\u6216\u4E8B\u7269\u5177\u4F53\u7684\u540D\u79F0\uFF0C\u4E5F\u53EF\u4EE5\u6307\u62BD\u8C61\u6982\u5FF5\u3002",
            rules: [
              "\u53EF\u6570\u540D\u8BCD\u6709\u590D\u6570\u5F62\u5F0F\uFF1A\u82F1\u8BED\u4E2D\u7684\u5927\u591A\u6570\u540D\u8BCD\u662F\u53EF\u6570\u540D\u8BCD\uFF0C\u53EF\u6570\u540D\u8BCD\u540E\u53EF\u4EE5\u52A0-s\u6216-es\u6784\u6210\u590D\u6570\u5F62\u5F0F",
              "\u540D\u8BCD\u524D\u4E00\u822C\u6709\u9650\u5B9A\u8BCD\uFF1A\u540D\u8BCD\u524D\u53EF\u7531\u51A0\u8BCD\uFF08\u5982a, an, the\uFF09\u6216\u5176\u4ED6\u9650\u5B9A\u8BCD\u4FEE\u9970",
              "\u540D\u8BCD\u6709\u81EA\u5DF1\u7684\u683C\uFF1A\u540D\u8BCD\u6709\u4E3B\u683C\u3001\u5C5E\u683C\u548C\u5BBE\u683C\uFF0C\u5C5E\u683C\u4E00\u822C\u662F\u5728\u5176\u540E\u52A0-'s\u6216\u8FD0\u7528of + \u540D\u8BCD\u7ED3\u6784"
            ],
            examples: [
              {
                correct: "two backpacks",
                translation: "\u4E24\u4E2A\u80CC\u5305",
                explanation: "\u53EF\u6570\u540D\u8BCD\u7684\u590D\u6570\u5F62\u5F0F"
              },
              {
                correct: "many heroes",
                translation: "\u5F88\u591A\u82F1\u96C4",
                explanation: "\u4EE5-o\u7ED3\u5C3E\u7684\u540D\u8BCD\uFF0C\u590D\u6570\u52A0-es"
              },
              {
                correct: "a film",
                translation: "\u4E00\u90E8\u7535\u5F71",
                explanation: "\u540D\u8BCD\u524D\u6709\u4E0D\u5B9A\u51A0\u8BCD\u4FEE\u9970"
              },
              {
                correct: "Jack's shoes",
                translation: "\u6770\u514B\u7684\u978B",
                explanation: "\u540D\u8BCD\u6240\u6709\u683C\uFF1A-'s\u5F62\u5F0F"
              },
              {
                correct: "the gate of the school",
                translation: "\u5B66\u6821\u5927\u95E8",
                explanation: "\u540D\u8BCD\u6240\u6709\u683C\uFF1Aof\u7ED3\u6784"
              }
            ],
            memoryTips: [
              "\u5927\u591A\u6570\u540D\u8BCD\u90FD\u53EF\u4EE5\u6570\uFF0C\u80FD\u6570\u7684\u5C31\u80FD\u52A0-s/-es\u53D8\u590D\u6570",
              "\u540D\u8BCD\u524D\u9762\u5E38\u6709'\u5C0F\u5E2E\u624B'\uFF1Aa/an/the/some\u7B49\u9650\u5B9A\u8BCD",
              "\u8868\u793A'\u8C01\u7684'\u7528-'s\u6216of\u7ED3\u6784"
            ],
            relatedTopics: [
              "nouns-classification",
              "nouns-plural",
              "nouns-possessive"
            ]
          },
          {
            id: "nouns-classification",
            title: "\u540D\u8BCD\u7684\u5206\u7C7B",
            category: "Nouns",
            gradeLevel: 7,
            difficulty: "basic",
            examTag: "\u57FA\u7840\u5FC5\u4F1A",
            description: "\u540D\u8BCD\u53EF\u4EE5\u5206\u4E3A\u4E13\u6709\u540D\u8BCD\u548C\u666E\u901A\u540D\u8BCD\u4E24\u5927\u7C7B\u3002",
            rules: [
              "\u4E13\u6709\u540D\u8BCD\uFF1A\u8868\u793A\u5177\u4F53\u7684\u59D3\u540D\u3001\u4E8B\u7269\u3001\u5730\u540D\u3001\u673A\u6784\u3001\u6708\u4EFD\u548C\u8282\u65E5\u7B49",
              "\u4E2A\u4F53\u540D\u8BCD\uFF1A\u7528\u6765\u6307\u5355\u4E2A\u4EBA\u6216\u4E8B\u7269\u7684\u540D\u8BCD",
              "\u96C6\u4F53\u540D\u8BCD\uFF1A\u7528\u6765\u6307\u4E00\u7FA4\u4EBA\u6216\u4E00\u4E9B\u4E8B\u7269\u603B\u79F0\u7684\u540D\u8BCD",
              "\u7269\u8D28\u540D\u8BCD\uFF1A\u7528\u6765\u6307\u65E0\u6CD5\u5206\u4E3A\u4E2A\u4F53\u7684\u7269\u8D28\u3001\u6750\u6599\u7684\u540D\u8BCD",
              "\u62BD\u8C61\u540D\u8BCD\uFF1A\u7528\u6765\u6307\u4EBA\u6216\u4E8B\u7269\u7684\u54C1\u8D28\u3001\u60C5\u611F\u3001\u72B6\u6001\u3001\u52A8\u4F5C\u7B49\u62BD\u8C61\u6982\u5FF5\u7684\u540D\u8BCD"
            ],
            examples: [
              {
                correct: "Green, Michael Jackson",
                translation: "\u4EBA\u540D",
                explanation: "\u4E13\u6709\u540D\u8BCD\uFF1A\u4EBA\u540D\u9996\u5B57\u6BCD\u5927\u5199"
              },
              {
                correct: "December, Mother's Day",
                translation: "\u6708\u4EFD\u548C\u8282\u65E5",
                explanation: "\u4E13\u6709\u540D\u8BCD\uFF1A\u65F6\u95F4\u540D\u79F0"
              },
              {
                correct: "book, key, student",
                translation: "\u4E66\u3001\u94A5\u5319\u3001\u5B66\u751F",
                explanation: "\u4E2A\u4F53\u540D\u8BCD"
              },
              {
                correct: "army, police, family",
                translation: "\u519B\u961F\u3001\u8B66\u5BDF\u3001\u5BB6\u5EAD",
                explanation: "\u96C6\u4F53\u540D\u8BCD"
              },
              {
                correct: "water, wind, glass",
                translation: "\u6C34\u3001\u98CE\u3001\u73BB\u7483",
                explanation: "\u7269\u8D28\u540D\u8BCD"
              },
              {
                correct: "honesty, love, silence",
                translation: "\u8BDA\u5B9E\u3001\u70ED\u7231\u3001\u5B89\u9759",
                explanation: "\u62BD\u8C61\u540D\u8BCD"
              }
            ],
            memoryTips: [
              "\u4E13\u6709\u540D\u8BCD\uFF1A\u4EBA\u540D\u3001\u5730\u540D\u3001\u6708\u4EFD\u3001\u8282\u65E5\u7B49\u72EC\u4E00\u65E0\u4E8C\u7684\u8981\u5927\u5199\u9996\u5B57\u6BCD",
              "\u4E13\u6709\u540D\u8BCD\u4E2D\u7684\u865A\u8BCD\uFF08a/an/the\u3001in/for\u7B49\uFF09\u9996\u5B57\u6BCD\u4E00\u822C\u4E0D\u5927\u5199",
              "\u666E\u901A\u540D\u8BCD\u5206\u56DB\u7C7B\uFF1A\u4E2A\u4F53\uFF08\u4E00\u4E2A\u4E2A\uFF09\u3001\u96C6\u4F53\uFF08\u4E00\u7FA4\uFF09\u3001\u7269\u8D28\uFF08\u65E0\u6CD5\u6570\uFF09\u3001\u62BD\u8C61\uFF08\u770B\u4E0D\u89C1\u6478\u4E0D\u7740\uFF09"
            ],
            specialNotes: [
              "\u4E13\u6709\u540D\u8BCD\u7684\u7B2C\u4E00\u4E2A\u5B57\u6BCD\u5FC5\u987B\u5927\u5199\uFF0C\u4F46\u5176\u4E2D\u7684\u865A\u8BCD\uFF08\u5982\u51A0\u8BCDa/an/the\u3001\u4ECB\u8BCDin/for\u7B49\uFF09\u7684\u7B2C\u4E00\u4E2A\u5B57\u6BCD\u4E00\u822C\u4E0D\u5927\u5199",
              "\u5F53\u6240\u6709\u5B57\u6BCD\u5927\u5199\u65F6\uFF0C\u51A0\u8BCD\u3001\u4ECB\u8BCD\u7B49\u865A\u8BCD\u4E5F\u987B\u5927\u5199"
            ],
            relatedTopics: [
              "nouns-features",
              "nouns-plural"
            ]
          },
          {
            id: "nouns-plural-countable",
            title: "\u53EF\u6570\u540D\u8BCD\u7684\u6570",
            category: "Nouns",
            gradeLevel: 7,
            difficulty: "basic",
            examTag: "\u4E2D\u8003\u9AD8\u9891",
            description: "\u53EF\u6570\u540D\u8BCD\u5728\u8868\u793A\u4E24\u4E2A\u6216\u4E24\u4E2A\u4EE5\u4E0A\u7684\u6982\u5FF5\u65F6\u987B\u7528\u590D\u6570\u5F62\u5F0F\u3002",
            rules: [
              "\u89C4\u52191\uFF1A\u4E00\u822C\u540D\u8BCD\u540E\u52A0-s\uFF0C\u5728\u6E05\u8F85\u97F3\u540E\u8BFB[s]\uFF0C\u5728\u6D4A\u8F85\u97F3\u6216\u5143\u97F3\u540E\u8BFB[z]",
              "\u89C4\u52192\uFF1A\u4EE5s, z, \u0283, \u0292, t\u0283, d\u0292\u7B49\u97F3\u7D20\u7ED3\u5C3E\u7684\u540D\u8BCD\uFF0C\u540E\u52A0-es\uFF0C\u5982\u679C\u8BCD\u5C3E\u4E3Ae\uFF0C\u53EA\u52A0-s",
              "\u89C4\u52193\uFF1A\u4EE5'\u8F85\u97F3\u5B57\u6BCD + o'\u7ED3\u5C3E\u7684\u540D\u8BCD\uFF0C\u591A\u6570\u60C5\u51B5\u4E0B\u52A0-es\uFF0Ces\u8BFB\u4F5C[z]",
              "\u89C4\u52194\uFF1A\u4EE5f(e)\u7ED3\u5C3E\u7684\u540D\u8BCD\uFF0C\u5927\u591A\u6570\u53D8f(e)\u4E3Av\uFF0C\u518D\u52A0-es\uFF0Cves\u8BFB\u4F5C[vz]",
              "\u89C4\u52195\uFF1A\u4EE5'\u8F85\u97F3\u5B57\u6BCD + y'\u7ED3\u5C3E\u7684\u540D\u8BCD\uFF0C\u53D8y\u4E3Ai\uFF0C\u518D\u52A0-es\uFF0Cies\u8BFB\u4F5C[iz]",
              "\u89C4\u52196\uFF1A\u4EE5-th\u7ED3\u5C3E\u7684\u540D\u8BCD\uFF0C\u4E00\u822C\u52A0-s\uFF0Cth\u539F\u6765\u8BFB[\u03B8]\uFF0C\u52A0\u590D\u6570\u8BCD\u5C3Es\u540E\uFF0C\u591A\u6570\u60C5\u51B5\u4E0B\u8BFB[\xF0]"
            ],
            examples: [
              {
                correct: "stamp\u2014stamps",
                translation: "\u90AE\u7968",
                explanation: "\u4E00\u822C\u60C5\u51B5\u52A0-s"
              },
              {
                correct: "teacher\u2014teachers",
                translation: "\u6559\u5E08",
                explanation: "\u4E00\u822C\u60C5\u51B5\u52A0-s"
              },
              {
                correct: "class\u2014classes",
                translation: "\u73ED\u7EA7",
                explanation: "\u4EE5s\u7ED3\u5C3E\u52A0-es"
              },
              {
                correct: "box\u2014boxes",
                translation: "\u76D2\u5B50",
                explanation: "\u4EE5x\u7ED3\u5C3E\u52A0-es"
              },
              {
                correct: "tomato\u2014tomatoes",
                translation: "\u897F\u7EA2\u67FF",
                explanation: "\u8F85\u97F3+o\u7ED3\u5C3E\u52A0-es"
              },
              {
                correct: "hero\u2014heroes",
                translation: "\u82F1\u96C4",
                explanation: "\u8F85\u97F3+o\u7ED3\u5C3E\u52A0-es"
              },
              {
                correct: "thief\u2014thieves",
                translation: "\u5C0F\u5077",
                explanation: "f\u7ED3\u5C3E\u53D8f\u4E3Av\u52A0-es"
              },
              {
                correct: "knife\u2014knives",
                translation: "\u5200\u5B50",
                explanation: "fe\u7ED3\u5C3E\u53D8f\u4E3Av\u52A0-es"
              },
              {
                correct: "baby\u2014babies",
                translation: "\u5A74\u513F",
                explanation: "\u8F85\u97F3+y\u7ED3\u5C3E\u53D8y\u4E3Ai\u52A0-es"
              },
              {
                correct: "city\u2014cities",
                translation: "\u57CE\u5E02",
                explanation: "\u8F85\u97F3+y\u7ED3\u5C3E\u53D8y\u4E3Ai\u52A0-es"
              }
            ],
            memoryTips: [
              "\u8F85\u97F3+o\u7ED3\u5C3E\u7684\u540D\u8BCD\uFF1A\u82F1\u96C4(hero)\u7231\u5403\u897F\u7EA2\u67FF(tomato)\u548C\u571F\u8C46(potato)\uFF0C\u8BB0\u4F4F\u8FD9\u4E09\u4E2A\u52A0-es",
              "\u4EE5f/fe\u7ED3\u5C3E\u53D8ves\uFF1A\u5C0F\u5077(thief)\u7684\u59BB\u5B50(wife)\u7528\u5200\u5B50(knife)\u628A\u6811\u53F6(leaf)\u5207\u6210\u4E24\u534A(half)",
              "\u8F85\u97F3+y\u7ED3\u5C3E\uFF1A\u628Ay\u53D8\u6210i\uFF0C\u518D\u52A0-es\uFF1B\u5143\u97F3+y\u7ED3\u5C3E\uFF1A\u76F4\u63A5\u52A0-s"
            ],
            specialNotes: [
              "\u4EE5'\u8F85\u97F3\u5B57\u6BCD + o'\u7ED3\u5C3E\u7684\u540D\u8BCD\uFF0C\u4E5F\u6709\u4EE5\u5916\u6765\u8BCD\u3001\u7F29\u5199\u8BCD\u3001\u4E13\u6709\u540D\u8BCD\u3001\u590D\u6570\u5F62\u5F0F\u76F4\u63A5\u52A0-s\u7684\u60C5\u51B5\uFF0C\u5982\uFF1Apiano\u2014pianos, photo\u2014photos",
              "\u4EE5'\u5143\u97F3\u5B57\u6BCD + y'\u7ED3\u5C3E\u7684\u4E13\u6709\u540D\u8BCD\uFF0C\u590D\u6570\u5F62\u5F0F\u76F4\u63A5\u52A0-s\uFF0C\u5982\uFF1AMarys, Henrys"
            ],
            relatedTopics: [
              "nouns-plural-irregular",
              "nouns-features"
            ]
          },
          {
            id: "nouns-plural-irregular",
            title: "\u4E0D\u89C4\u5219\u590D\u6570\u5F62\u5F0F",
            category: "Nouns",
            gradeLevel: 7,
            difficulty: "intermediate",
            examTag: "\u4E2D\u8003\u9AD8\u9891",
            description: "\u6709\u4E9B\u540D\u8BCD\u7684\u590D\u6570\u5F62\u5F0F\u4E0D\u9075\u5FAA\u89C4\u5219\u53D8\u5316\uFF0C\u9700\u8981\u7279\u522B\u8BB0\u5FC6\u3002",
            rules: [
              "\u53D8\u5185\u90E8\u5143\u97F3\uFF1Afoot\u2014feet, man\u2014men, woman\u2014women, tooth\u2014teeth, goose\u2014geese, mouse\u2014mice",
              "\u8BCD\u5C3E\u52A0-ren\u6216-en\uFF1Achild\u2014children, ox\u2014oxen",
              "\u5355\u590D\u6570\u540C\u5F62\uFF1Afish, deer, sheep, means, Chinese, Japanese",
              "\u5916\u6765\u8BCD\uFF1Aphenomenon\u2014phenomena",
              "\u96C6\u4F53\u540D\u8BCD\u7684\u590D\u6570\uFF1A\u6709\u4E9B\u53EA\u6709\u590D\u6570\u5F62\u5F0F\uFF08goods, trousers, glasses\uFF09\uFF0C\u6709\u4E9B\u6709\u5F62\u5F0F\u53D8\u5316\u4F46\u8868\u793A\u590D\u6570\u610F\u4E49\uFF08police, people, cattle\uFF09"
            ],
            examples: [
              {
                correct: "foot\u2014feet",
                translation: "\u811A",
                explanation: "\u53D8\u5185\u90E8\u5143\u97F3"
              },
              {
                correct: "man\u2014men",
                translation: "\u7537\u4EBA",
                explanation: "\u53D8\u5185\u90E8\u5143\u97F3"
              },
              {
                correct: "child\u2014children",
                translation: "\u5B69\u5B50\u4EEC",
                explanation: "\u8BCD\u5C3E\u52A0-ren"
              },
              {
                correct: "fish (\u6307\u6761\u6570)",
                translation: "\u9C7C",
                explanation: "\u5355\u590D\u6570\u540C\u5F62"
              },
              {
                correct: "sheep",
                translation: "\u7EF5\u7F8A",
                explanation: "\u5355\u590D\u6570\u540C\u5F62"
              },
              {
                correct: "Chinese",
                translation: "\u4E2D\u56FD\u4EBA",
                explanation: "\u5355\u590D\u6570\u540C\u5F62"
              }
            ],
            memoryTips: [
              "\u53D8\u5143\u97F3\u8BB0\u5FC6\uFF1A\u4E00\u7537(man)\u4E00\u5973(woman)\u4E00\u811A(foot)\u4E00\u7259(tooth)\u4E00\u9E45(goose)\u4E00\u9F20(mouse)",
              "\u5355\u590D\u6570\u540C\u5F62\uFF1A\u4E2D\u56FD\u4EBA(Chinese)\u548C\u65E5\u672C\u4EBA(Japanese)\u7231\u5403\u9C7C(fish)\u548C\u7F8A(sheep)",
              "\u96C6\u4F53\u540D\u8BCD\uFF1A\u8B66\u5BDF(police)\u548C\u4EBA\u4EEC(people)\u8D76\u7740\u725B(cattle)"
            ],
            specialNotes: [
              "\u8FD9\u7C7B\u540D\u8BCD\u4E00\u822C\u4E0D\u7528\u5177\u4F53\u7684\u6570\u5B57\u4FEE\u9970\uFF0C\u5982\u4E0D\u8BF4 two trousers\uFF0C\u4F46\u80FD\u8BF4 many trousers, two pairs of trousers\u7B49"
            ],
            relatedTopics: [
              "nouns-plural-countable",
              "nouns-features"
            ]
          },
          {
            id: "nouns-possessive-s",
            title: "\u540D\u8BCD\u7684\u683C\uFF1A-'s\u6240\u6709\u683C",
            category: "Nouns",
            gradeLevel: 7,
            difficulty: "intermediate",
            examTag: "\u4E2D\u8003\u9AD8\u9891",
            description: "\u540D\u8BCD\u7684\u683C\u5206\u4E3A\u4E3B\u683C\u3001\u5BBE\u683C\u548C\u6240\u6709\u683C\u3002\u540D\u8BCD\u6240\u6709\u683C\u8868\u793A\u540D\u8BCD\u4E4B\u95F4\u7684\u6240\u5C5E\u5173\u7CFB\u3002",
            rules: [
              "\u4E00\u822C\u60C5\u51B5\u4E0B\uFF0C\u5728\u540D\u8BCD\u8BCD\u5C3E\u52A0-'s\uFF0C\u5728\u6E05\u8F85\u97F3\u540E\u8BFB[s]\uFF0C\u5728\u6D4A\u8F85\u97F3\u6216\u5143\u97F3\u540E\u8BFB[z]",
              "\u4EE5-s\u6216-es\u7ED3\u5C3E\u7684\u540D\u8BCD\u590D\u6570\uFF0C\u76F4\u63A5\u5728\u5176\u540E\u52A0'\uFF0C\u8BFB\u97F3\u4E0E\u53EF\u6570\u540D\u8BCD\u590D\u6570\u8BCD\u5C3E\u76F8\u540C",
              "\u4E0D\u4EE5-s\u7ED3\u5C3E\u7684\u53EF\u6570\u540D\u8BCD\u590D\u6570\uFF0C\u76F4\u63A5\u5728\u5176\u540E\u52A0-'s\uFF0C\u8BFB\u97F3\u4E0E\u53EF\u6570\u540D\u8BCD\u590D\u6570\u8BCD\u5C3E\u76F8\u540C",
              "\u4E24\u4EBA\u6216\u591A\u4EBA\u5171\u6709\u4E00\u4E2A\u4EBA\u6216\u4E8B\u7269\u65F6\uFF0C\u53EA\u53D8\u5316\u6700\u540E\u4E00\u4E2A\u540D\u8BCD\u7684\u8BCD\u5C3E\uFF1B\u5982\u679C\u4E3A\u5404\u81EA\u6240\u6709\uFF0C\u5404\u4E2A\u540D\u8BCD\u7684\u8BCD\u5C3E\u90FD\u8981\u53D8\u5316",
              "\u8868\u793A\u65F6\u95F4\u3001\u8DDD\u79BB\u3001\u56FD\u5BB6\u3001\u5730\u70B9\u3001\u81EA\u7136\u73B0\u8C61\u7B49\u65E0\u751F\u547D\u7684\u540D\u8BCD\u5E38\u7528-'s\u6240\u6709\u683C",
              "\u8868\u793A\u67D0\u4EBA\u7684\u5E97\u94FA\u3001\u533B\u9662\u3001\u5B66\u6821\u3001\u4F4F\u5B85\u53CA\u516C\u5171\u5EFA\u7B51\u65F6\uFF0C-'s\u6240\u6709\u683C\u540E\u5E38\u5E38\u4E0D\u51FA\u73B0\u5B83\u6240\u4FEE\u9970\u7684\u540D\u8BCD",
              "-'s\u6240\u6709\u683C\u5E38\u7528\u6765\u8868\u793A\u8282\u65E5"
            ],
            examples: [
              {
                correct: "Dick's hobby",
                translation: "\u8FEA\u514B\u7684\u7231\u597D",
                explanation: "\u5355\u6570\u540D\u8BCD\u52A0-'s"
              },
              {
                correct: "my parents' hope",
                translation: "\u6211\u7236\u6BCD\u7684\u5E0C\u671B",
                explanation: "\u590D\u6570\u540D\u8BCD\u4EE5-s\u7ED3\u5C3E\u52A0'"
              },
              {
                correct: "children's time",
                translation: "\u5B69\u5B50\u4EEC\u7684\u65F6\u95F4",
                explanation: "\u4E0D\u89C4\u5219\u590D\u6570\u52A0-'s"
              },
              {
                correct: "John and Susan's father",
                translation: "\u7EA6\u7FF0\u548C\u82CF\u73CA\u7684\u7236\u4EB2\uFF08\u5171\u6709\uFF09",
                explanation: "\u5171\u540C\u6240\u6709"
              },
              {
                correct: "two days' trip",
                translation: "\u4E24\u5929\u7684\u65C5\u884C",
                explanation: "\u8868\u793A\u65F6\u95F4"
              },
              {
                correct: "China's weather",
                translation: "\u4E2D\u56FD\u7684\u5929\u6C14",
                explanation: "\u8868\u793A\u56FD\u5BB6"
              },
              {
                correct: "at the tailor's (shop)",
                translation: "\u5728\u88C1\u7F1D\u5E97",
                explanation: "\u5E97\u94FA\u7701\u7565\u540D\u8BCD"
              },
              {
                correct: "Children's Day",
                translation: "\u513F\u7AE5\u8282",
                explanation: "\u8282\u65E5"
              }
            ],
            memoryTips: [
              "\u5355\u6570\u52A0-'s\uFF0C\u590D\u6570-s\u540E\u52A0'\uFF0C\u4E0D\u89C4\u5219\u590D\u6570\u52A0-'s",
              "\u5171\u6709\u53EA\u52A0\u6700\u540E\u4E00\u4E2A\uFF0C\u5404\u81EA\u6240\u6709\u90FD\u8981\u52A0",
              "\u65F6\u95F4\u3001\u8DDD\u79BB\u3001\u56FD\u5BB6\u3001\u5730\u70B9\u4E5F\u80FD\u7528-'s"
            ],
            specialNotes: [
              "\u6709\u65F6\u4E3A\u4E86\u907F\u514D\u91CD\u590D\uFF0C\u5982\u679C\u4E00\u4E2A\u88AB-'s\u6240\u6709\u683C\u4FEE\u9970\u7684\u540D\u8BCD\u5728\u4E0A\u6587\u5DF2\u7ECF\u63D0\u5230\u8FC7\uFF0C\u6216\u4E24\u4E2A-'s\u6240\u6709\u683C\u6240\u4FEE\u9970\u7684\u8BCD\u76F8\u540C\uFF0C\u5F80\u5F80\u53EF\u4EE5\u7701\u7565\u7B2C\u4E8C\u4E2A\u6240\u6709\u683C\u540E\u7684\u540D\u8BCD"
            ],
            relatedTopics: [
              "nouns-possessive-of",
              "nouns-possessive-double"
            ]
          },
          {
            id: "nouns-possessive-of",
            title: "of\u6240\u6709\u683C\u548C\u53CC\u91CD\u6240\u6709\u683C",
            category: "Nouns",
            gradeLevel: 8,
            difficulty: "intermediate",
            examTag: "\u4E2D\u8003\u9AD8\u9891",
            description: "'\u540D\u8BCD + of + \u540D\u8BCD'\u4FBF\u6784\u6210\u4E86of\u6240\u6709\u683C\u3002\u53CC\u91CD\u6240\u6709\u683C\u662F'\u540D\u8BCD + of + -'s\u6240\u6709\u683C/\u540D\u8BCD\u6027\u7269\u4E3B\u4EE3\u8BCD'\u6784\u6210\u53CC\u91CD\u6240\u6709\u683C\u3002",
            rules: [
              "of\u6240\u6709\u683C\u8868\u793A\u65E0\u751F\u547D\u540D\u8BCD\u7684\u6240\u6709\u5173\u7CFB",
              "\u540D\u8BCD\u5316\u7684\u5F62\u5BB9\u8BCD\u7684\u6240\u6709\u5173\u7CFB\u7528of\u6240\u6709\u683C",
              "\u53CC\u91CD\u6240\u6709\u683C\uFF1A\u5982\u679C\u5728\u8868\u793A\u6240\u5C5E\u7269\u7684\u540D\u8BCD\u524D\u6709\u51A0\u8BCD\u3001\u6570\u8BCD\u3001\u4E0D\u5B9A\u4EE3\u8BCD\u6216\u6307\u793A\u4EE3\u8BCD\u65F6\uFF0C\u5E38\u7528\u53CC\u91CD\u6240\u6709\u683C\u7684\u5F62\u5F0F\u6765\u8868\u793A\u6240\u6709\u5173\u7CFB"
            ],
            examples: [
              {
                correct: "Beijing is the capital of China",
                translation: "\u5317\u4EAC\u662F\u4E2D\u56FD\u7684\u9996\u90FD",
                explanation: "\u65E0\u751F\u547D\u540D\u8BCD\u7528of"
              },
              {
                correct: "The life of the poor is the biggest problem",
                translation: "\u7A77\u4EBA\u7684\u751F\u6D3B\u662F\u6700\u5927\u7684\u95EE\u9898",
                explanation: "\u540D\u8BCD\u5316\u5F62\u5BB9\u8BCD\u7528of"
              },
              {
                correct: "Two friends of mine had gone to the movies",
                translation: "\u6211\u7684\u4E24\u4E2A\u670B\u53CB\u53BB\u770B\u7535\u5F71\u4E86",
                explanation: "\u53CC\u91CD\u6240\u6709\u683C"
              },
              {
                correct: "David is a friend of my father's",
                translation: "\u6234\u7EF4\u662F\u6211\u7236\u4EB2\u7684\u4E00\u4F4D\u670B\u53CB",
                explanation: "\u53CC\u91CD\u6240\u6709\u683C"
              }
            ],
            memoryTips: [
              "\u65E0\u751F\u547D\u7684\u7528of\uFF1Athe capital of China",
              "\u53CC\u91CD\u6240\u6709\u683C\uFF1A\u6709\u9650\u5B9A\u8BCD\u65F6\u7528'of + -'s'\u6216'of + mine/yours'",
              "of\u524D\u7684\u540D\u8BCD\u662Fphoto/picture\u7B49\u65F6\uFF0C\u53CC\u91CD\u6240\u6709\u683C\u4E0Eof\u6240\u6709\u683C\u8868\u793A\u7684\u610F\u4E49\u4E0D\u540C"
            ],
            specialNotes: [
              "of\u524D\u7684\u540D\u8BCD\u662Fphoto, picture\u7B49\u65F6\uFF0C\u53CC\u91CD\u6240\u6709\u683C\u4E0Eof\u6240\u6709\u683C\u8868\u793A\u7684\u610F\u4E49\u4E0D\u540C\uFF1Aa picture of Mr Sun's \u5B59\u5148\u751F\uFF08\u62E5\u6709\uFF09\u7684\u4E00\u5F20\u7167\u7247\uFF1Ba picture of Mr Sun \u5B59\u5148\u751F\uFF08\u672C\u4EBA\uFF09\u7684\u4E00\u5F20\u7167\u7247"
            ],
            relatedTopics: [
              "nouns-possessive-s"
            ]
          },
          {
            id: "nouns-modifiers",
            title: "\u540D\u8BCD\u7684\u4FEE\u9970\u8BED",
            category: "Nouns",
            gradeLevel: 8,
            difficulty: "intermediate",
            examTag: "\u4E2D\u8003\u9AD8\u9891",
            description: "\u540D\u8BCD\u53EF\u4EE5\u7531\u5404\u79CD\u4FEE\u9970\u8BED\u4FEE\u9970\uFF0C\u5305\u62EC\u8868\u793A\u6570\u91CF\u7684\u8BCD\u3001\u5355\u4F4D\u8BCD\u4EE5\u53CA\u5176\u4ED6\u4FEE\u9970\u8BED\u3002",
            rules: [
              "\u53EA\u4FEE\u9970\u53EF\u6570\u540D\u8BCD\uFF1Afew\uFF08\u6CA1\u6709\u51E0\u4E2A\uFF09, a few\uFF08\u51E0\u4E2A\uFF09, several\uFF08\u51E0\u4E2A\uFF09, many\uFF08\u5F88\u591A\uFF09, a great/good many\uFF08\u5F88\u591A\uFF09, a number of\uFF08\u82E5\u5E72\uFF09, numbers of\uFF08\u5927\u91CF\u7684\uFF09",
              "\u53EA\u4FEE\u9970\u4E0D\u53EF\u6570\u540D\u8BCD\uFF1Alittle\uFF08\u5F88\u5C11\uFF0C\u51E0\u4E4E\u6CA1\u6709\uFF09, a little\uFF08\u4E00\u70B9\uFF09, much\uFF08\u8BB8\u591A\uFF09, a good/great deal of\uFF08\u5F88\u591A\uFF09, a bit of\uFF08\u6709\u4E00\u70B9\uFF0C\u5C11\u91CF\uFF09",
              "\u65E2\u53EF\u4FEE\u9970\u53EF\u6570\u540D\u8BCD\u53C8\u53EF\u4FEE\u9970\u4E0D\u53EF\u6570\u540D\u8BCD\uFF1Asome\uFF08\u4E00\u4E9B\uFF09, lots of\uFF08\u5F88\u591A\uFF09, a lot of\uFF08\u5F88\u591A\uFF09, plenty of\uFF08\u5145\u8DB3\u7684\uFF09, all\uFF08\u5168\u90E8\u7684\uFF09, most\uFF08\u5927\u591A\u6570\u7684\uFF09",
              "\u5355\u4F4D\u8BCD\uFF1A\u666E\u901A\u5355\u4F4D\u8BCD\uFF08piece, article, bit\uFF09\u3001\u5EA6\u91CF\u5355\u4F4D\u8BCD\uFF08metre, inch, yard, foot, pound, kilogram, ton, sum\uFF09\u3001\u5BB9\u79EF\u5355\u4F4D\u8BCD\uFF08box, bag, basket, bottle, cup, glass, basin\uFF09\u3001\u5F62\u72B6\u5355\u4F4D\u8BCD\uFF08bar, block, loaf, cake, drop, grain\uFF09\u3001\u96C6\u4F53\u5355\u4F4D\u8BCD\uFF08team, crowd, group, fleet\uFF09",
              "\u5176\u4ED6\u4FEE\u9970\u8BED\uFF1A\u540D\u8BCD\u4F5C\u4FEE\u9970\u8BED\uFF08stone table\uFF09\u3001\u5F62\u5BB9\u8BCD\u4F5C\u4FEE\u9970\u8BED\uFF08pretty girl\uFF09\u3001\u526F\u8BCD\u4F5C\u4FEE\u9970\u8BED\uFF08the weather here\uFF09\u3001\u4ECB\u8BCD\u77ED\u8BED\u4F5C\u4FEE\u9970\u8BED\uFF08a girl in clean clothes\uFF09\u3001\u4ECE\u53E5\u4F5C\u4FEE\u9970\u8BED\uFF08writers who write short stories\uFF09"
            ],
            examples: [
              {
                correct: "few students",
                translation: "\u6CA1\u6709\u51E0\u4E2A\u5B66\u751F",
                explanation: "\u4FEE\u9970\u53EF\u6570\u540D\u8BCD"
              },
              {
                correct: "much water",
                translation: "\u8BB8\u591A\u6C34",
                explanation: "\u4FEE\u9970\u4E0D\u53EF\u6570\u540D\u8BCD"
              },
              {
                correct: "some money",
                translation: "\u4E00\u4E9B\u94B1",
                explanation: "\u65E2\u53EF\u4FEE\u9970\u53EF\u6570\u53C8\u53EF\u4FEE\u9970\u4E0D\u53EF\u6570"
              },
              {
                correct: "a piece of music",
                translation: "\u4E00\u6BB5\u4E50\u66F2",
                explanation: "\u666E\u901A\u5355\u4F4D\u8BCD"
              },
              {
                correct: "a metre of cloth",
                translation: "\u4E00\u7C73\u5E03",
                explanation: "\u5EA6\u91CF\u5355\u4F4D\u8BCD"
              },
              {
                correct: "a cup of tea",
                translation: "\u4E00\u676F\u8336",
                explanation: "\u5BB9\u79EF\u5355\u4F4D\u8BCD"
              },
              {
                correct: "a bar of chocolate",
                translation: "\u4E00\u5757\u5DE7\u514B\u529B",
                explanation: "\u5F62\u72B6\u5355\u4F4D\u8BCD"
              },
              {
                correct: "a team of players",
                translation: "\u4E00\u961F\u9009\u624B",
                explanation: "\u96C6\u4F53\u5355\u4F4D\u8BCD"
              }
            ],
            memoryTips: [
              "few/little\u8868\u793A'\u51E0\u4E4E\u6CA1\u6709'\uFF08\u5426\u5B9A\uFF09\uFF0Ca few/a little\u8868\u793A'\u6709\u4E00\u4E9B'\uFF08\u80AF\u5B9A\uFF09",
              "many/much\u5F88\u591A\uFF1Amany\u4FEE\u9970\u53EF\u6570\uFF0Cmuch\u4FEE\u9970\u4E0D\u53EF\u6570",
              "some, lots of, plenty of\u662F'\u4E07\u80FD\u8BCD'\uFF0C\u53EF\u6570\u4E0D\u53EF\u6570\u90FD\u80FD\u4FEE\u9970",
              "\u5355\u4F4D\u8BCD\u8BB0\u5FC6\uFF1A\u4E00\u7247(piece)\u3001\u4E00\u6761(article)\u3001\u4E00\u7C73(metre)\u3001\u4E00\u676F(cup)\u3001\u4E00\u5757(bar)\u3001\u4E00\u961F(team)"
            ],
            specialNotes: [
              "\u82F1\u8BED\u4E2D\u6709\u4E9B\u540D\u8BCD\u6210\u53CC\u6210\u5BF9\u51FA\u73B0\u7684\uFF0C\u8FD9\u4E9B\u540D\u8BCD\u5E38\u7528pair\u6765\u4FEE\u9970\uFF1Aa pair of glasses\uFF08\u4E00\u526F\u773C\u955C\uFF09, a pair of trousers\uFF08\u4E00\u6761\u88E4\u5B50\uFF09, a pair of shoes\uFF08\u4E00\u53CC\u978B\uFF09"
            ],
            relatedTopics: [
              "nouns-plural-countable",
              "nouns-classification"
            ]
          }
        ]
      }
    };
  }
});

// server/scripts/init-grammar-db.ts
var init_grammar_db_exports = {};
__export(init_grammar_db_exports, {
  initGrammarDatabase: () => initGrammarDatabase
});
import { sql } from "drizzle-orm";
async function initGrammarDatabase() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  console.log("\u5F00\u59CB\u521D\u59CB\u5316\u8BED\u6CD5\u6570\u636E\u5E93...");
  console.log("\u521B\u5EFA\u6570\u636E\u5E93\u8868...");
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS grammar_chapters (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      titleEn VARCHAR(100),
      \`order\` INT NOT NULL,
      pageRange VARCHAR(50),
      examWeightPercentage INT,
      examWeightBreakdown TEXT,
      examTags TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS grammar_topics (
      id INT AUTO_INCREMENT PRIMARY KEY,
      chapterId INT NOT NULL,
      topicId VARCHAR(100) NOT NULL UNIQUE,
      title VARCHAR(200) NOT NULL,
      titleEn VARCHAR(200),
      grade VARCHAR(10),
      unit INT,
      category VARCHAR(50),
      difficulty ENUM('basic', 'intermediate', 'advanced') DEFAULT 'basic' NOT NULL,
      examTag VARCHAR(50),
      description TEXT,
      rules TEXT,
      examples TEXT,
      memoryTips TEXT,
      specialNotes TEXT,
      commonMistakes TEXT,
      relatedTopics TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS grammar_exercises (
      id INT AUTO_INCREMENT PRIMARY KEY,
      topicId INT NOT NULL,
      type VARCHAR(50) NOT NULL,
      question TEXT NOT NULL,
      options TEXT,
      correctAnswer TEXT NOT NULL,
      explanation TEXT,
      difficulty ENUM('basic', 'intermediate', 'advanced') DEFAULT 'basic' NOT NULL,
      examTag VARCHAR(50),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
    )
  `);
  console.log("\u6570\u636E\u5E93\u8868\u521B\u5EFA\u5B8C\u6210");
  console.log("\u5BFC\u5165\u7B2C\u4E00\u7AE0\u540D\u8BCD\u6570\u636E...");
  const chapterData = noun_data_default.chapter;
  const [chapterResult] = await db.insert(grammarChapters).values({
    title: chapterData.title,
    titleEn: "Nouns",
    order: chapterData.order,
    pageRange: chapterData.pageRange,
    examWeightPercentage: chapterData.examWeight.percentage,
    examWeightBreakdown: JSON.stringify(chapterData.examWeight.breakdown),
    examTags: JSON.stringify(chapterData.examTags)
  });
  const chapterId = chapterResult.insertId;
  console.log(`\u7AE0\u8282\u63D2\u5165\u6210\u529F\uFF0CID: ${chapterId}`);
  for (const topic of chapterData.topics) {
    await db.insert(grammarTopics).values({
      chapterId,
      topicId: topic.id,
      title: topic.title,
      titleEn: topic.title,
      grade: "7A",
      unit: 1,
      category: "noun",
      difficulty: topic.difficulty,
      examTag: topic.examTag,
      description: topic.description,
      rules: JSON.stringify(topic.rules),
      examples: JSON.stringify(topic.examples),
      memoryTips: JSON.stringify(topic.memoryTips || []),
      specialNotes: JSON.stringify(topic.specialNotes || []),
      commonMistakes: JSON.stringify([]),
      relatedTopics: JSON.stringify(topic.relatedTopics || [])
    });
    console.log(`\u77E5\u8BC6\u70B9\u63D2\u5165\u6210\u529F: ${topic.title}`);
  }
  console.log("\u8BED\u6CD5\u6570\u636E\u5E93\u521D\u59CB\u5316\u5B8C\u6210\uFF01");
  return {
    success: true,
    chapterId,
    topicsCount: chapterData.topics.length
  };
}
var init_init_grammar_db = __esm({
  "server/scripts/init-grammar-db.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_noun_data();
  }
});

// server/_core/index.ts
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/oauth.ts
init_db();

// server/_core/cookies.ts
var LOCAL_HOSTS = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "::1"]);
function isIpAddress(host) {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getParentDomain(hostname) {
  if (LOCAL_HOSTS.has(hostname) || isIpAddress(hostname)) {
    return void 0;
  }
  const parts = hostname.split(".");
  if (parts.length < 3) {
    return void 0;
  }
  return "." + parts.slice(-2).join(".");
}
function getSessionCookieOptions(req) {
  const hostname = req.hostname;
  const domain = getParentDomain(hostname);
  return {
    domain,
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client2) {
    this.client = client2;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(EXCHANGE_TOKEN_PATH, payload);
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(GET_USER_INFO_PATH, {
      accessToken: token.accessToken
    });
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client2 = createOAuthHttpClient()) {
    this.client = client2;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(platforms.filter((p) => typeof p === "string"));
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice("Bearer ".length).trim();
    }
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = token || cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
async function syncUser(userInfo) {
  if (!userInfo.openId) {
    throw new Error("openId missing from user info");
  }
  const lastSignedIn = /* @__PURE__ */ new Date();
  await upsertUser({
    openId: userInfo.openId,
    name: userInfo.name || null,
    email: userInfo.email ?? null,
    loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
    lastSignedIn
  });
  const saved = await getUserByOpenId(userInfo.openId);
  return saved ?? {
    openId: userInfo.openId,
    name: userInfo.name,
    email: userInfo.email,
    loginMethod: userInfo.loginMethod ?? null,
    lastSignedIn
  };
}
function buildUserResponse(user) {
  return {
    id: user?.id ?? null,
    openId: user?.openId ?? null,
    name: user?.name ?? null,
    email: user?.email ?? null,
    loginMethod: user?.loginMethod ?? null,
    lastSignedIn: (user?.lastSignedIn ?? /* @__PURE__ */ new Date()).toISOString()
  };
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      await syncUser(userInfo);
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      const frontendUrl = process.env.EXPO_WEB_PREVIEW_URL || process.env.EXPO_PACKAGER_PROXY_URL || "http://localhost:8081";
      res.redirect(302, frontendUrl);
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
  app.get("/api/oauth/mobile", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      const user = await syncUser(userInfo);
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({
        app_session_id: sessionToken,
        user: buildUserResponse(user)
      });
    } catch (error) {
      console.error("[OAuth] Mobile exchange failed", error);
      res.status(500).json({ error: "OAuth mobile exchange failed" });
    }
  });
  app.post("/api/auth/logout", (req, res) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.json({ success: true });
  });
  app.get("/api/auth/me", async (req, res) => {
    try {
      const user = await sdk.authenticateRequest(req);
      res.json({ user: buildUserResponse(user) });
    } catch (error) {
      console.error("[Auth] /api/auth/me failed:", error);
      res.status(401).json({ error: "Not authenticated", user: null });
    }
  });
  app.post("/api/auth/session", async (req, res) => {
    try {
      const user = await sdk.authenticateRequest(req);
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
        res.status(400).json({ error: "Bearer token required" });
        return;
      }
      const token = authHeader.slice("Bearer ".length).trim();
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ success: true, user: buildUserResponse(user) });
    } catch (error) {
      console.error("[Auth] /api/auth/session failed:", error);
      res.status(401).json({ error: "Invalid token" });
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL("webdevtoken.v1.WebDevService/SendNotification", normalizedBase).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers/grammar.ts
import { z as z2 } from "zod";

// server/_core/llm.ts
var ENV2 = {
  forgeApiKey: process.env.OPENAI_API_KEY || "",
  forgeApiUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com",
  forgeApiModel: process.env.OPENAI_MODEL || "gpt-4.1-mini"
};
console.log("[ENV] OPENAI_API_KEY:", ENV2.forgeApiKey ? ENV2.forgeApiKey.substring(0, 12) + "..." : "NOT SET");
console.log("[ENV] OPENAI_BASE_URL:", ENV2.forgeApiUrl || "NOT SET");
console.log("[ENV] OPENAI_MODEL:", ENV2.forgeApiModel || "NOT SET");
console.log("[ENV] Final forgeApiKey:", ENV2.forgeApiKey ? ENV2.forgeApiKey.substring(0, 12) + "..." : "EMPTY");
console.log("[ENV] Final forgeApiUrl:", ENV2.forgeApiUrl || "EMPTY (will use default)");
function resolveApiUrl() {
  const baseUrl = ENV2.forgeApiUrl.replace(/\/$/, "");
  return `${baseUrl}/v1/chat/completions`;
}
function normalizeContent(content) {
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content;
  }
  return [content];
}
function normalizeResponseFormat(options) {
  const { responseFormat, response_format, outputSchema, output_schema } = options;
  if (responseFormat) return responseFormat;
  if (response_format) return response_format;
  const schema = outputSchema || output_schema;
  if (schema) {
    return {
      type: "json_schema",
      json_schema: {
        name: "output",
        schema,
        strict: true
      }
    };
  }
  return void 0;
}
async function invokeLLM(options) {
  const {
    model = ENV2.forgeApiModel,
    messages,
    temperature,
    max_tokens,
    maxTokens,
    top_p,
    topP,
    frequency_penalty,
    frequencyPenalty,
    presence_penalty,
    presencePenalty,
    stop,
    tools,
    tool_choice,
    toolChoice,
    parallel_tool_calls,
    parallelToolCalls,
    response_format,
    responseFormat,
    output_schema,
    outputSchema,
    stream = false,
    user,
    seed,
    logprobs,
    top_logprobs,
    topLogprobs,
    logit_bias,
    logitBias,
    n
  } = options;
  console.log("[LLM] API Key found:", ENV2.forgeApiKey ? ENV2.forgeApiKey.substring(0, 12) + "..." : "MISSING");
  if (!ENV2.forgeApiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  const normalizedMessages = messages.map((msg) => ({
    ...msg,
    content: normalizeContent(msg.content)
  }));
  const payload = {
    model,
    messages: normalizedMessages,
    stream
  };
  if (temperature !== void 0) payload.temperature = temperature;
  if (max_tokens !== void 0) payload.max_tokens = max_tokens;
  if (maxTokens !== void 0) payload.max_tokens = maxTokens;
  if (top_p !== void 0) payload.top_p = top_p;
  if (topP !== void 0) payload.top_p = topP;
  if (frequency_penalty !== void 0) payload.frequency_penalty = frequency_penalty;
  if (frequencyPenalty !== void 0) payload.frequency_penalty = frequencyPenalty;
  if (presence_penalty !== void 0) payload.presence_penalty = presence_penalty;
  if (presencePenalty !== void 0) payload.presence_penalty = presencePenalty;
  if (stop !== void 0) payload.stop = stop;
  if (tools !== void 0) payload.tools = tools;
  if (tool_choice !== void 0) payload.tool_choice = tool_choice;
  if (toolChoice !== void 0) payload.tool_choice = toolChoice;
  if (parallel_tool_calls !== void 0) payload.parallel_tool_calls = parallel_tool_calls;
  if (parallelToolCalls !== void 0) payload.parallel_tool_calls = parallelToolCalls;
  if (user !== void 0) payload.user = user;
  if (seed !== void 0) payload.seed = seed;
  if (logprobs !== void 0) payload.logprobs = logprobs;
  if (top_logprobs !== void 0) payload.top_logprobs = top_logprobs;
  if (topLogprobs !== void 0) payload.top_logprobs = topLogprobs;
  if (logit_bias !== void 0) payload.logit_bias = logit_bias;
  if (logitBias !== void 0) payload.logit_bias = logitBias;
  if (n !== void 0) payload.n = n;
  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema
  });
  if (normalizedResponseFormat) {
    if (normalizedResponseFormat.type === "json_schema") {
      payload.response_format = { type: "json_object" };
    } else {
      payload.response_format = normalizedResponseFormat;
    }
  }
  const apiUrl = resolveApiUrl();
  console.log("[LLM] Calling API:", apiUrl);
  console.log("[LLM] Model:", model);
  console.log("[LLM] Payload:", JSON.stringify(payload, null, 2).substring(0, 500));
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6e4);
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ENV2.forgeApiKey}`
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    console.log("[LLM] Response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[LLM] Error response:", errorText);
      throw new Error(`LLM invoke failed: ${response.status} ${response.statusText} \u2013 ${errorText}`);
    }
    const result = await response.json();
    console.log("[LLM] Success! Response:", JSON.stringify(result).substring(0, 200));
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("[LLM] Fetch error:", error);
    throw error;
  }
}

// lib/grammar-data.ts
var GRAMMAR_TOPICS = [
  // 第一章：名词 (来源：星火英语·初中语法全解)
  {
    id: "nouns-features",
    title: "\u540D\u8BCD\u7684\u7279\u5F81",
    category: "Nouns",
    gradeLevel: 7,
    description: "\u540D\u8BCD\u662F\u4EBA\u7C7B\u8BA4\u8BC6\u4E8B\u7269\u6240\u4F7F\u7528\u7684\u57FA\u672C\u8BCD\u6C47\uFF0C\u4E3B\u8981\u7528\u6765\u6307\u5404\u79CD\u4EBA\u6216\u4E8B\u7269\u5177\u4F53\u7684\u540D\u79F0\uFF0C\u4E5F\u53EF\u4EE5\u6307\u62BD\u8C61\u6982\u5FF5\u3002",
    rules: [
      "\u53EF\u6570\u540D\u8BCD\u6709\u590D\u6570\u5F62\u5F0F\uFF1A\u82F1\u8BED\u4E2D\u7684\u5927\u591A\u6570\u540D\u8BCD\u662F\u53EF\u6570\u540D\u8BCD\uFF0C\u53EF\u6570\u540D\u8BCD\u540E\u53EF\u4EE5\u52A0-s\u6216-es\u6784\u6210\u590D\u6570\u5F62\u5F0F",
      "\u540D\u8BCD\u524D\u4E00\u822C\u6709\u9650\u5B9A\u8BCD\uFF1A\u540D\u8BCD\u524D\u53EF\u7531\u51A0\u8BCD\uFF08\u5982a, an, the\uFF09\u6216\u5176\u4ED6\u9650\u5B9A\u8BCD\u4FEE\u9970",
      "\u540D\u8BCD\u6709\u81EA\u5DF1\u7684\u683C\uFF1A\u540D\u8BCD\u6709\u4E3B\u683C\u3001\u5C5E\u683C\u548C\u5BBE\u683C\uFF0C\u5C5E\u683C\u4E00\u822C\u662F\u5728\u5176\u540E\u52A0-'s\u6216\u8FD0\u7528of + \u540D\u8BCD\u7ED3\u6784"
    ],
    examples: [
      {
        correct: "two backpacks",
        explanation: "\u4E24\u4E2A\u80CC\u5305 - \u53EF\u6570\u540D\u8BCD\u7684\u590D\u6570\u5F62\u5F0F"
      },
      {
        correct: "many heroes",
        explanation: "\u5F88\u591A\u82F1\u96C4 - \u4EE5-o\u7ED3\u5C3E\u7684\u540D\u8BCD\uFF0C\u590D\u6570\u52A0-es"
      },
      {
        correct: "a film",
        explanation: "\u4E00\u90E8\u7535\u5F71 - \u540D\u8BCD\u524D\u6709\u4E0D\u5B9A\u51A0\u8BCD\u4FEE\u9970"
      },
      {
        correct: "Jack's shoes",
        explanation: "\u6770\u514B\u7684\u978B - \u540D\u8BCD\u6240\u6709\u683C\uFF1A-'s\u5F62\u5F0F"
      },
      {
        correct: "the gate of the school",
        explanation: "\u5B66\u6821\u5927\u95E8 - \u540D\u8BCD\u6240\u6709\u683C\uFF1Aof\u7ED3\u6784"
      }
    ],
    commonMistakes: [],
    pepReference: "\u661F\u706B\u82F1\u8BED\xB7\u521D\u4E2D\u8BED\u6CD5\u5168\u89E3 \u7B2C\u4E00\u7AE0",
    difficulty: "basic",
    relatedTopics: ["nouns-classification", "nouns-plural", "nouns-possessive"]
  },
  {
    id: "nouns-classification",
    title: "\u540D\u8BCD\u7684\u5206\u7C7B",
    category: "Nouns",
    gradeLevel: 7,
    description: "\u540D\u8BCD\u53EF\u4EE5\u5206\u4E3A\u4E13\u6709\u540D\u8BCD\u548C\u666E\u901A\u540D\u8BCD\u4E24\u5927\u7C7B\u3002",
    rules: [
      "\u4E13\u6709\u540D\u8BCD\uFF1A\u8868\u793A\u5177\u4F53\u7684\u59D3\u540D\u3001\u4E8B\u7269\u3001\u5730\u540D\u3001\u673A\u6784\u3001\u6708\u4EFD\u548C\u8282\u65E5\u7B49",
      "\u4E2A\u4F53\u540D\u8BCD\uFF1A\u7528\u6765\u6307\u5355\u4E2A\u4EBA\u6216\u4E8B\u7269\u7684\u540D\u8BCD",
      "\u96C6\u4F53\u540D\u8BCD\uFF1A\u7528\u6765\u6307\u4E00\u7FA4\u4EBA\u6216\u4E00\u4E9B\u4E8B\u7269\u603B\u79F0\u7684\u540D\u8BCD",
      "\u7269\u8D28\u540D\u8BCD\uFF1A\u7528\u6765\u6307\u65E0\u6CD5\u5206\u4E3A\u4E2A\u4F53\u7684\u7269\u8D28\u3001\u6750\u6599\u7684\u540D\u8BCD",
      "\u62BD\u8C61\u540D\u8BCD\uFF1A\u7528\u6765\u6307\u4EBA\u6216\u4E8B\u7269\u7684\u54C1\u8D28\u3001\u60C5\u611F\u3001\u72B6\u6001\u3001\u52A8\u4F5C\u7B49\u62BD\u8C61\u6982\u5FF5\u7684\u540D\u8BCD"
    ],
    examples: [
      {
        correct: "Green, Michael Jackson",
        explanation: "\u4EBA\u540D - \u4E13\u6709\u540D\u8BCD\uFF1A\u4EBA\u540D\u9996\u5B57\u6BCD\u5927\u5199"
      },
      {
        correct: "December, Mother's Day",
        explanation: "\u6708\u4EFD\u548C\u8282\u65E5 - \u4E13\u6709\u540D\u8BCD\uFF1A\u65F6\u95F4\u540D\u79F0"
      },
      {
        correct: "book, key, student",
        explanation: "\u4E66\u3001\u94A5\u5319\u3001\u5B66\u751F - \u4E2A\u4F53\u540D\u8BCD"
      },
      {
        correct: "army, police, family",
        explanation: "\u519B\u961F\u3001\u8B66\u5BDF\u3001\u5BB6\u5EAD - \u96C6\u4F53\u540D\u8BCD"
      },
      {
        correct: "water, wind, glass",
        explanation: "\u6C34\u3001\u98CE\u3001\u73BB\u7483 - \u7269\u8D28\u540D\u8BCD"
      },
      {
        correct: "honesty, love, silence",
        explanation: "\u8BDA\u5B9E\u3001\u70ED\u7231\u3001\u5B89\u9759 - \u62BD\u8C61\u540D\u8BCD"
      }
    ],
    commonMistakes: [],
    pepReference: "\u661F\u706B\u82F1\u8BED\xB7\u521D\u4E2D\u8BED\u6CD5\u5168\u89E3 \u7B2C\u4E00\u7AE0",
    difficulty: "basic",
    relatedTopics: ["nouns-features", "nouns-plural"]
  },
  {
    id: "nouns-plural-countable",
    title: "\u53EF\u6570\u540D\u8BCD\u7684\u6570",
    category: "Nouns",
    gradeLevel: 7,
    description: "\u53EF\u6570\u540D\u8BCD\u5728\u8868\u793A\u4E24\u4E2A\u6216\u4E24\u4E2A\u4EE5\u4E0A\u7684\u6982\u5FF5\u65F6\u987B\u7528\u590D\u6570\u5F62\u5F0F\u3002",
    rules: [
      "\u89C4\u52191\uFF1A\u4E00\u822C\u540D\u8BCD\u540E\u52A0-s\uFF0C\u5728\u6E05\u8F85\u97F3\u540E\u8BFB[s]\uFF0C\u5728\u6D4A\u8F85\u97F3\u6216\u5143\u97F3\u540E\u8BFB[z]",
      "\u89C4\u52192\uFF1A\u4EE5s, z, \u0283, \u0292, t\u0283, d\u0292\u7B49\u97F3\u7D20\u7ED3\u5C3E\u7684\u540D\u8BCD\uFF0C\u540E\u52A0-es\uFF0C\u5982\u679C\u8BCD\u5C3E\u4E3Ae\uFF0C\u53EA\u52A0-s",
      "\u89C4\u52193\uFF1A\u4EE5'\u8F85\u97F3\u5B57\u6BCD + o'\u7ED3\u5C3E\u7684\u540D\u8BCD\uFF0C\u591A\u6570\u60C5\u51B5\u4E0B\u52A0-es\uFF0Ces\u8BFB\u4F5C[z]",
      "\u89C4\u52194\uFF1A\u4EE5f(e)\u7ED3\u5C3E\u7684\u540D\u8BCD\uFF0C\u5927\u591A\u6570\u53D8f(e)\u4E3Av\uFF0C\u518D\u52A0-es\uFF0Cves\u8BFB\u4F5C[vz]",
      "\u89C4\u52195\uFF1A\u4EE5'\u8F85\u97F3\u5B57\u6BCD + y'\u7ED3\u5C3E\u7684\u540D\u8BCD\uFF0C\u53D8y\u4E3Ai\uFF0C\u518D\u52A0-es\uFF0Cies\u8BFB\u4F5C[iz]",
      "\u89C4\u52196\uFF1A\u4EE5-th\u7ED3\u5C3E\u7684\u540D\u8BCD\uFF0C\u4E00\u822C\u52A0-s\uFF0Cth\u539F\u6765\u8BFB[\u03B8]\uFF0C\u52A0\u590D\u6570\u8BCD\u5C3Es\u540E\uFF0C\u591A\u6570\u60C5\u51B5\u4E0B\u8BFB[\xF0]"
    ],
    examples: [
      {
        correct: "stamp\u2014stamps",
        explanation: "\u90AE\u7968 - \u4E00\u822C\u60C5\u51B5\u52A0-s"
      },
      {
        correct: "teacher\u2014teachers",
        explanation: "\u6559\u5E08 - \u4E00\u822C\u60C5\u51B5\u52A0-s"
      },
      {
        correct: "class\u2014classes",
        explanation: "\u73ED\u7EA7 - \u4EE5s\u7ED3\u5C3E\u52A0-es"
      },
      {
        correct: "box\u2014boxes",
        explanation: "\u76D2\u5B50 - \u4EE5x\u7ED3\u5C3E\u52A0-es"
      },
      {
        correct: "tomato\u2014tomatoes",
        explanation: "\u897F\u7EA2\u67FF - \u8F85\u97F3+o\u7ED3\u5C3E\u52A0-es"
      },
      {
        correct: "hero\u2014heroes",
        explanation: "\u82F1\u96C4 - \u8F85\u97F3+o\u7ED3\u5C3E\u52A0-es"
      },
      {
        correct: "thief\u2014thieves",
        explanation: "\u5C0F\u5077 - f\u7ED3\u5C3E\u53D8f\u4E3Av\u52A0-es"
      },
      {
        correct: "knife\u2014knives",
        explanation: "\u5200\u5B50 - fe\u7ED3\u5C3E\u53D8f\u4E3Av\u52A0-es"
      },
      {
        correct: "baby\u2014babies",
        explanation: "\u5A74\u513F - \u8F85\u97F3+y\u7ED3\u5C3E\u53D8y\u4E3Ai\u52A0-es"
      },
      {
        correct: "city\u2014cities",
        explanation: "\u57CE\u5E02 - \u8F85\u97F3+y\u7ED3\u5C3E\u53D8y\u4E3Ai\u52A0-es"
      }
    ],
    commonMistakes: [],
    pepReference: "\u661F\u706B\u82F1\u8BED\xB7\u521D\u4E2D\u8BED\u6CD5\u5168\u89E3 \u7B2C\u4E00\u7AE0",
    difficulty: "basic",
    relatedTopics: ["nouns-plural-irregular", "nouns-features"]
  },
  {
    id: "nouns-plural-irregular",
    title: "\u4E0D\u89C4\u5219\u590D\u6570\u5F62\u5F0F",
    category: "Nouns",
    gradeLevel: 7,
    description: "\u6709\u4E9B\u540D\u8BCD\u7684\u590D\u6570\u5F62\u5F0F\u4E0D\u9075\u5FAA\u89C4\u5219\u53D8\u5316\uFF0C\u9700\u8981\u7279\u522B\u8BB0\u5FC6\u3002",
    rules: [
      "\u53D8\u5185\u90E8\u5143\u97F3\uFF1Afoot\u2014feet, man\u2014men, woman\u2014women, tooth\u2014teeth, goose\u2014geese, mouse\u2014mice",
      "\u8BCD\u5C3E\u52A0-ren\u6216-en\uFF1Achild\u2014children, ox\u2014oxen",
      "\u5355\u590D\u6570\u540C\u5F62\uFF1Afish, deer, sheep, means, Chinese, Japanese",
      "\u5916\u6765\u8BCD\uFF1Aphenomenon\u2014phenomena",
      "\u96C6\u4F53\u540D\u8BCD\u7684\u590D\u6570\uFF1A\u6709\u4E9B\u53EA\u6709\u590D\u6570\u5F62\u5F0F\uFF08goods, trousers, glasses\uFF09\uFF0C\u6709\u4E9B\u6709\u5F62\u5F0F\u53D8\u5316\u4F46\u8868\u793A\u590D\u6570\u610F\u4E49\uFF08police, people, cattle\uFF09"
    ],
    examples: [
      {
        correct: "foot\u2014feet",
        explanation: "\u811A - \u53D8\u5185\u90E8\u5143\u97F3"
      },
      {
        correct: "man\u2014men",
        explanation: "\u7537\u4EBA - \u53D8\u5185\u90E8\u5143\u97F3"
      },
      {
        correct: "child\u2014children",
        explanation: "\u5B69\u5B50\u4EEC - \u8BCD\u5C3E\u52A0-ren"
      },
      {
        correct: "fish (\u6307\u6761\u6570)",
        explanation: "\u9C7C - \u5355\u590D\u6570\u540C\u5F62"
      },
      {
        correct: "sheep",
        explanation: "\u7EF5\u7F8A - \u5355\u590D\u6570\u540C\u5F62"
      },
      {
        correct: "Chinese",
        explanation: "\u4E2D\u56FD\u4EBA - \u5355\u590D\u6570\u540C\u5F62"
      }
    ],
    commonMistakes: [],
    pepReference: "\u661F\u706B\u82F1\u8BED\xB7\u521D\u4E2D\u8BED\u6CD5\u5168\u89E3 \u7B2C\u4E00\u7AE0",
    difficulty: "intermediate",
    relatedTopics: ["nouns-plural-countable", "nouns-features"]
  },
  {
    id: "nouns-possessive-s",
    title: "\u540D\u8BCD\u7684\u683C\uFF1A-'s\u6240\u6709\u683C",
    category: "Nouns",
    gradeLevel: 7,
    description: "\u540D\u8BCD\u7684\u683C\u5206\u4E3A\u4E3B\u683C\u3001\u5BBE\u683C\u548C\u6240\u6709\u683C\u3002\u540D\u8BCD\u6240\u6709\u683C\u8868\u793A\u540D\u8BCD\u4E4B\u95F4\u7684\u6240\u5C5E\u5173\u7CFB\u3002",
    rules: [
      "\u4E00\u822C\u60C5\u51B5\u4E0B\uFF0C\u5728\u540D\u8BCD\u8BCD\u5C3E\u52A0-'s\uFF0C\u5728\u6E05\u8F85\u97F3\u540E\u8BFB[s]\uFF0C\u5728\u6D4A\u8F85\u97F3\u6216\u5143\u97F3\u540E\u8BFB[z]",
      "\u4EE5-s\u6216-es\u7ED3\u5C3E\u7684\u540D\u8BCD\u590D\u6570\uFF0C\u76F4\u63A5\u5728\u5176\u540E\u52A0'\uFF0C\u8BFB\u97F3\u4E0E\u53EF\u6570\u540D\u8BCD\u590D\u6570\u8BCD\u5C3E\u76F8\u540C",
      "\u4E0D\u4EE5-s\u7ED3\u5C3E\u7684\u53EF\u6570\u540D\u8BCD\u590D\u6570\uFF0C\u76F4\u63A5\u5728\u5176\u540E\u52A0-'s\uFF0C\u8BFB\u97F3\u4E0E\u53EF\u6570\u540D\u8BCD\u590D\u6570\u8BCD\u5C3E\u76F8\u540C",
      "\u4E24\u4EBA\u6216\u591A\u4EBA\u5171\u6709\u4E00\u4E2A\u4EBA\u6216\u4E8B\u7269\u65F6\uFF0C\u53EA\u53D8\u5316\u6700\u540E\u4E00\u4E2A\u540D\u8BCD\u7684\u8BCD\u5C3E\uFF1B\u5982\u679C\u4E3A\u5404\u81EA\u6240\u6709\uFF0C\u5404\u4E2A\u540D\u8BCD\u7684\u8BCD\u5C3E\u90FD\u8981\u53D8\u5316",
      "\u8868\u793A\u65F6\u95F4\u3001\u8DDD\u79BB\u3001\u56FD\u5BB6\u3001\u5730\u70B9\u3001\u81EA\u7136\u73B0\u8C61\u7B49\u65E0\u751F\u547D\u7684\u540D\u8BCD\u5E38\u7528-'s\u6240\u6709\u683C",
      "\u8868\u793A\u67D0\u4EBA\u7684\u5E97\u94FA\u3001\u533B\u9662\u3001\u5B66\u6821\u3001\u4F4F\u5B85\u53CA\u516C\u5171\u5EFA\u7B51\u65F6\uFF0C-'s\u6240\u6709\u683C\u540E\u5E38\u5E38\u4E0D\u51FA\u73B0\u5B83\u6240\u4FEE\u9970\u7684\u540D\u8BCD",
      "-'s\u6240\u6709\u683C\u5E38\u7528\u6765\u8868\u793A\u8282\u65E5"
    ],
    examples: [
      {
        correct: "Dick's hobby",
        explanation: "\u8FEA\u514B\u7684\u7231\u597D - \u5355\u6570\u540D\u8BCD\u52A0-'s"
      },
      {
        correct: "my parents' hope",
        explanation: "\u6211\u7236\u6BCD\u7684\u5E0C\u671B - \u590D\u6570\u540D\u8BCD\u4EE5-s\u7ED3\u5C3E\u52A0'"
      },
      {
        correct: "children's time",
        explanation: "\u5B69\u5B50\u4EEC\u7684\u65F6\u95F4 - \u4E0D\u89C4\u5219\u590D\u6570\u52A0-'s"
      },
      {
        correct: "John and Susan's father",
        explanation: "\u7EA6\u7FF0\u548C\u82CF\u73CA\u7684\u7236\u4EB2\uFF08\u5171\u6709\uFF09 - \u5171\u540C\u6240\u6709"
      },
      {
        correct: "two days' trip",
        explanation: "\u4E24\u5929\u7684\u65C5\u884C - \u8868\u793A\u65F6\u95F4"
      },
      {
        correct: "China's weather",
        explanation: "\u4E2D\u56FD\u7684\u5929\u6C14 - \u8868\u793A\u56FD\u5BB6"
      },
      {
        correct: "at the tailor's (shop)",
        explanation: "\u5728\u88C1\u7F1D\u5E97 - \u5E97\u94FA\u7701\u7565\u540D\u8BCD"
      },
      {
        correct: "Children's Day",
        explanation: "\u513F\u7AE5\u8282 - \u8282\u65E5"
      }
    ],
    commonMistakes: [],
    pepReference: "\u661F\u706B\u82F1\u8BED\xB7\u521D\u4E2D\u8BED\u6CD5\u5168\u89E3 \u7B2C\u4E00\u7AE0",
    difficulty: "intermediate",
    relatedTopics: ["nouns-possessive-of", "nouns-possessive-double"]
  },
  {
    id: "nouns-possessive-of",
    title: "of\u6240\u6709\u683C\u548C\u53CC\u91CD\u6240\u6709\u683C",
    category: "Nouns",
    gradeLevel: 8,
    description: "'\u540D\u8BCD + of + \u540D\u8BCD'\u4FBF\u6784\u6210\u4E86of\u6240\u6709\u683C\u3002\u53CC\u91CD\u6240\u6709\u683C\u662F'\u540D\u8BCD + of + -'s\u6240\u6709\u683C/\u540D\u8BCD\u6027\u7269\u4E3B\u4EE3\u8BCD'\u6784\u6210\u53CC\u91CD\u6240\u6709\u683C\u3002",
    rules: [
      "of\u6240\u6709\u683C\u8868\u793A\u65E0\u751F\u547D\u540D\u8BCD\u7684\u6240\u6709\u5173\u7CFB",
      "\u540D\u8BCD\u5316\u7684\u5F62\u5BB9\u8BCD\u7684\u6240\u6709\u5173\u7CFB\u7528of\u6240\u6709\u683C",
      "\u53CC\u91CD\u6240\u6709\u683C\uFF1A\u5982\u679C\u5728\u8868\u793A\u6240\u5C5E\u7269\u7684\u540D\u8BCD\u524D\u6709\u51A0\u8BCD\u3001\u6570\u8BCD\u3001\u4E0D\u5B9A\u4EE3\u8BCD\u6216\u6307\u793A\u4EE3\u8BCD\u65F6\uFF0C\u5E38\u7528\u53CC\u91CD\u6240\u6709\u683C\u7684\u5F62\u5F0F\u6765\u8868\u793A\u6240\u6709\u5173\u7CFB"
    ],
    examples: [
      {
        correct: "Beijing is the capital of China",
        explanation: "\u5317\u4EAC\u662F\u4E2D\u56FD\u7684\u9996\u90FD - \u65E0\u751F\u547D\u540D\u8BCD\u7528of"
      },
      {
        correct: "The life of the poor is the biggest problem",
        explanation: "\u7A77\u4EBA\u7684\u751F\u6D3B\u662F\u6700\u5927\u7684\u95EE\u9898 - \u540D\u8BCD\u5316\u5F62\u5BB9\u8BCD\u7528of"
      },
      {
        correct: "Two friends of mine had gone to the movies",
        explanation: "\u6211\u7684\u4E24\u4E2A\u670B\u53CB\u53BB\u770B\u7535\u5F71\u4E86 - \u53CC\u91CD\u6240\u6709\u683C"
      },
      {
        correct: "David is a friend of my father's",
        explanation: "\u6234\u7EF4\u662F\u6211\u7236\u4EB2\u7684\u4E00\u4F4D\u670B\u53CB - \u53CC\u91CD\u6240\u6709\u683C"
      }
    ],
    commonMistakes: [],
    pepReference: "\u661F\u706B\u82F1\u8BED\xB7\u521D\u4E2D\u8BED\u6CD5\u5168\u89E3 \u7B2C\u4E00\u7AE0",
    difficulty: "intermediate",
    relatedTopics: ["nouns-possessive-s"]
  },
  {
    id: "nouns-modifiers",
    title: "\u540D\u8BCD\u7684\u4FEE\u9970\u8BED",
    category: "Nouns",
    gradeLevel: 8,
    description: "\u540D\u8BCD\u53EF\u4EE5\u7531\u5404\u79CD\u4FEE\u9970\u8BED\u4FEE\u9970\uFF0C\u5305\u62EC\u8868\u793A\u6570\u91CF\u7684\u8BCD\u3001\u5355\u4F4D\u8BCD\u4EE5\u53CA\u5176\u4ED6\u4FEE\u9970\u8BED\u3002",
    rules: [
      "\u53EA\u4FEE\u9970\u53EF\u6570\u540D\u8BCD\uFF1Afew\uFF08\u6CA1\u6709\u51E0\u4E2A\uFF09, a few\uFF08\u51E0\u4E2A\uFF09, several\uFF08\u51E0\u4E2A\uFF09, many\uFF08\u5F88\u591A\uFF09, a great/good many\uFF08\u5F88\u591A\uFF09, a number of\uFF08\u82E5\u5E72\uFF09, numbers of\uFF08\u5927\u91CF\u7684\uFF09",
      "\u53EA\u4FEE\u9970\u4E0D\u53EF\u6570\u540D\u8BCD\uFF1Alittle\uFF08\u5F88\u5C11\uFF0C\u51E0\u4E4E\u6CA1\u6709\uFF09, a little\uFF08\u4E00\u70B9\uFF09, much\uFF08\u8BB8\u591A\uFF09, a good/great deal of\uFF08\u5F88\u591A\uFF09, a bit of\uFF08\u6709\u4E00\u70B9\uFF0C\u5C11\u91CF\uFF09",
      "\u65E2\u53EF\u4FEE\u9970\u53EF\u6570\u540D\u8BCD\u53C8\u53EF\u4FEE\u9970\u4E0D\u53EF\u6570\u540D\u8BCD\uFF1Asome\uFF08\u4E00\u4E9B\uFF09, lots of\uFF08\u5F88\u591A\uFF09, a lot of\uFF08\u5F88\u591A\uFF09, plenty of\uFF08\u5145\u8DB3\u7684\uFF09, all\uFF08\u5168\u90E8\u7684\uFF09, most\uFF08\u5927\u591A\u6570\u7684\uFF09",
      "\u5355\u4F4D\u8BCD\uFF1A\u666E\u901A\u5355\u4F4D\u8BCD\uFF08piece, article, bit\uFF09\u3001\u5EA6\u91CF\u5355\u4F4D\u8BCD\uFF08metre, inch, yard, foot, pound, kilogram, ton, sum\uFF09\u3001\u5BB9\u79EF\u5355\u4F4D\u8BCD\uFF08box, bag, basket, bottle, cup, glass, basin\uFF09\u3001\u5F62\u72B6\u5355\u4F4D\u8BCD\uFF08bar, block, loaf, cake, drop, grain\uFF09\u3001\u96C6\u4F53\u5355\u4F4D\u8BCD\uFF08team, crowd, group, fleet\uFF09",
      "\u5176\u4ED6\u4FEE\u9970\u8BED\uFF1A\u540D\u8BCD\u4F5C\u4FEE\u9970\u8BED\uFF08stone table\uFF09\u3001\u5F62\u5BB9\u8BCD\u4F5C\u4FEE\u9970\u8BED\uFF08pretty girl\uFF09\u3001\u526F\u8BCD\u4F5C\u4FEE\u9970\u8BED\uFF08the weather here\uFF09\u3001\u4ECB\u8BCD\u77ED\u8BED\u4F5C\u4FEE\u9970\u8BED\uFF08a girl in clean clothes\uFF09\u3001\u4ECE\u53E5\u4F5C\u4FEE\u9970\u8BED\uFF08writers who write short stories\uFF09"
    ],
    examples: [
      {
        correct: "few students",
        explanation: "\u6CA1\u6709\u51E0\u4E2A\u5B66\u751F - \u4FEE\u9970\u53EF\u6570\u540D\u8BCD"
      },
      {
        correct: "much water",
        explanation: "\u8BB8\u591A\u6C34 - \u4FEE\u9970\u4E0D\u53EF\u6570\u540D\u8BCD"
      },
      {
        correct: "some money",
        explanation: "\u4E00\u4E9B\u94B1 - \u65E2\u53EF\u4FEE\u9970\u53EF\u6570\u53C8\u53EF\u4FEE\u9970\u4E0D\u53EF\u6570"
      },
      {
        correct: "a piece of music",
        explanation: "\u4E00\u6BB5\u4E50\u66F2 - \u666E\u901A\u5355\u4F4D\u8BCD"
      },
      {
        correct: "a metre of cloth",
        explanation: "\u4E00\u7C73\u5E03 - \u5EA6\u91CF\u5355\u4F4D\u8BCD"
      },
      {
        correct: "a cup of tea",
        explanation: "\u4E00\u676F\u8336 - \u5BB9\u79EF\u5355\u4F4D\u8BCD"
      },
      {
        correct: "a bar of chocolate",
        explanation: "\u4E00\u5757\u5DE7\u514B\u529B - \u5F62\u72B6\u5355\u4F4D\u8BCD"
      },
      {
        correct: "a team of players",
        explanation: "\u4E00\u961F\u9009\u624B - \u96C6\u4F53\u5355\u4F4D\u8BCD"
      }
    ],
    commonMistakes: [],
    pepReference: "\u661F\u706B\u82F1\u8BED\xB7\u521D\u4E2D\u8BED\u6CD5\u5168\u89E3 \u7B2C\u4E00\u7AE0",
    difficulty: "intermediate",
    relatedTopics: ["nouns-plural-countable", "nouns-classification"]
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
      "Use do/does for questions and negatives"
    ],
    examples: [
      {
        correct: "She plays basketball every day.",
        explanation: "Third person singular (she) requires -s ending"
      },
      {
        correct: "They study English at school.",
        explanation: "Plural subject uses base form of verb"
      }
    ],
    commonMistakes: [
      {
        incorrect: "He play football.",
        correct: "He plays football.",
        explanation: "Third person singular requires -s ending"
      },
      {
        incorrect: "Does she plays tennis?",
        correct: "Does she play tennis?",
        explanation: "After 'does', use base form of verb"
      }
    ],
    pepReference: "Grade 7 Unit 1",
    difficulty: "basic",
    relatedTopics: ["g7-simple-past", "g8-present-continuous"]
  },
  {
    id: "g7-simple-past",
    title: "Simple Past Tense",
    category: "Tenses",
    gradeLevel: 7,
    description: "Use the simple past tense to describe completed actions in the past.",
    rules: [
      "Regular verbs: add -ed to base form",
      "Irregular verbs: use past form (go \u2192 went, see \u2192 saw)",
      "Use did for questions and negatives with base form"
    ],
    examples: [
      {
        correct: "I visited Beijing last summer.",
        explanation: "Regular verb 'visit' becomes 'visited' in past tense"
      },
      {
        correct: "She went to the library yesterday.",
        explanation: "Irregular verb 'go' becomes 'went' in past tense"
      }
    ],
    commonMistakes: [
      {
        incorrect: "I go to school yesterday.",
        correct: "I went to school yesterday.",
        explanation: "Use past tense 'went' with time marker 'yesterday'"
      },
      {
        incorrect: "Did you went there?",
        correct: "Did you go there?",
        explanation: "After 'did', use base form of verb"
      }
    ],
    pepReference: "Grade 7 Unit 4",
    difficulty: "basic",
    relatedTopics: ["g7-simple-present", "g8-present-perfect"]
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
      "Use 'the' for specific or previously mentioned nouns"
    ],
    examples: [
      {
        correct: "I have a book and an apple.",
        explanation: "'a' before consonant sound (book), 'an' before vowel sound (apple)"
      },
      {
        correct: "The book on the table is mine.",
        explanation: "'the' refers to a specific book"
      }
    ],
    commonMistakes: [
      {
        incorrect: "I saw a elephant.",
        correct: "I saw an elephant.",
        explanation: "Use 'an' before vowel sound"
      },
      {
        incorrect: "I like the music.",
        correct: "I like music.",
        explanation: "No article needed for music in general"
      }
    ],
    pepReference: "Grade 7 Unit 2",
    difficulty: "basic",
    relatedTopics: ["g8-articles-advanced"]
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
      "Use for temporary situations"
    ],
    examples: [
      {
        correct: "She is reading a book right now.",
        explanation: "Action happening at this moment"
      },
      {
        correct: "They are studying for exams this week.",
        explanation: "Temporary situation around the present"
      }
    ],
    commonMistakes: [
      {
        incorrect: "He is play basketball.",
        correct: "He is playing basketball.",
        explanation: "Must use -ing form after is/am/are"
      },
      {
        incorrect: "I am understanding this.",
        correct: "I understand this.",
        explanation: "Stative verbs (understand, know, like) don't use continuous form"
      }
    ],
    pepReference: "Grade 8 Unit 1",
    difficulty: "basic",
    relatedTopics: ["g7-simple-present", "g8-present-perfect"]
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
      "Use with 'for' and 'since' for duration"
    ],
    examples: [
      {
        correct: "I have visited Shanghai three times.",
        explanation: "Life experience up to now"
      },
      {
        correct: "She has lived here for five years.",
        explanation: "Action started in past, continues to present"
      }
    ],
    commonMistakes: [
      {
        incorrect: "I have seen him yesterday.",
        correct: "I saw him yesterday.",
        explanation: "Use simple past with specific past time (yesterday)"
      },
      {
        incorrect: "He has went to Beijing.",
        correct: "He has gone to Beijing.",
        explanation: "Past participle of 'go' is 'gone', not 'went'"
      }
    ],
    pepReference: "Grade 8 Unit 5",
    difficulty: "intermediate",
    relatedTopics: ["g7-simple-past", "g9-present-perfect-continuous"]
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
      "Must/Should: obligation, advice"
    ],
    examples: [
      {
        correct: "She can speak three languages.",
        explanation: "Can expresses ability"
      },
      {
        correct: "You should study harder.",
        explanation: "Should gives advice"
      }
    ],
    commonMistakes: [
      {
        incorrect: "He can plays guitar.",
        correct: "He can play guitar.",
        explanation: "Use base form after modal verbs"
      },
      {
        incorrect: "You must to go now.",
        correct: "You must go now.",
        explanation: "No 'to' after modal verbs"
      }
    ],
    pepReference: "Grade 8 Unit 3",
    difficulty: "basic",
    relatedTopics: ["g9-modal-perfect"]
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
      "Often used with 'for' and 'since'"
    ],
    examples: [
      {
        correct: "I have been studying English for three hours.",
        explanation: "Emphasizes the duration of the ongoing action"
      },
      {
        correct: "She has been working here since 2020.",
        explanation: "Action started in past and continues to present"
      }
    ],
    commonMistakes: [
      {
        incorrect: "They have been knowing each other for years.",
        correct: "They have known each other for years.",
        explanation: "Stative verbs don't use continuous forms"
      }
    ],
    pepReference: "Grade 9 Unit 2",
    difficulty: "intermediate",
    relatedTopics: ["g8-present-perfect", "g9-past-perfect"]
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
      "Often used with 'before', 'after', 'when', 'by the time'"
    ],
    examples: [
      {
        correct: "When I arrived, the movie had already started.",
        explanation: "Movie started before I arrived (both in past)"
      },
      {
        correct: "She had finished her homework before dinner.",
        explanation: "Homework was completed before dinner time"
      }
    ],
    commonMistakes: [
      {
        incorrect: "After he left, I had realized my mistake.",
        correct: "After he left, I realized my mistake.",
        explanation: "Use simple past when sequence is clear from 'after'"
      }
    ],
    pepReference: "Grade 9 Unit 4",
    difficulty: "intermediate",
    relatedTopics: ["g7-simple-past", "g9-present-perfect-continuous"]
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
      "Can be used in different tenses"
    ],
    examples: [
      {
        correct: "The book was written by Lu Xun.",
        explanation: "Focus on the book, not the author"
      },
      {
        correct: "English is spoken all over the world.",
        explanation: "Focus on the language, not the speakers"
      }
    ],
    commonMistakes: [
      {
        incorrect: "The letter was wrote yesterday.",
        correct: "The letter was written yesterday.",
        explanation: "Use past participle 'written', not past tense 'wrote'"
      },
      {
        incorrect: "The house is building now.",
        correct: "The house is being built now.",
        explanation: "Use 'being + past participle' for continuous passive"
      }
    ],
    pepReference: "Grade 9 Unit 6",
    difficulty: "intermediate",
    relatedTopics: ["g10-passive-advanced"]
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
      "First conditional: If + present, will + base form (real possibility)"
    ],
    examples: [
      {
        correct: "If you heat water to 100\xB0C, it boils.",
        explanation: "Zero conditional for scientific facts"
      },
      {
        correct: "If it rains tomorrow, I will stay home.",
        explanation: "First conditional for real future possibility"
      }
    ],
    commonMistakes: [
      {
        incorrect: "If I will see him, I will tell him.",
        correct: "If I see him, I will tell him.",
        explanation: "Use present tense in 'if' clause, not 'will'"
      }
    ],
    pepReference: "Grade 10 Unit 2",
    difficulty: "intermediate",
    relatedTopics: ["g11-conditionals-second-third"]
  },
  {
    id: "g10-reported-speech",
    title: "Reported Speech",
    category: "Reported Speech",
    gradeLevel: 10,
    description: "Report what someone said without using their exact words.",
    rules: [
      "Change pronouns and time expressions",
      "Backshift tenses (present \u2192 past, past \u2192 past perfect)",
      "Use reporting verbs (say, tell, ask)"
    ],
    examples: [
      {
        correct: "He said that he was tired.",
        explanation: "Direct: 'I am tired' \u2192 Reported: he was tired"
      },
      {
        correct: "She told me that she had finished the work.",
        explanation: "Direct: 'I have finished' \u2192 Reported: she had finished"
      }
    ],
    commonMistakes: [
      {
        incorrect: "He said me that he was busy.",
        correct: "He told me that he was busy.",
        explanation: "Use 'told' with indirect object, not 'said'"
      },
      {
        incorrect: "She said that she is coming tomorrow.",
        correct: "She said that she was coming the next day.",
        explanation: "Backshift tense and change time expression"
      }
    ],
    pepReference: "Grade 10 Unit 5",
    difficulty: "advanced",
    relatedTopics: ["g11-reported-questions"]
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
      "Third conditional: If + past perfect, would have + past participle (unreal past)"
    ],
    examples: [
      {
        correct: "If I had more time, I would travel the world.",
        explanation: "Second conditional: unreal present situation"
      },
      {
        correct: "If I had studied harder, I would have passed the exam.",
        explanation: "Third conditional: unreal past situation"
      }
    ],
    commonMistakes: [
      {
        incorrect: "If I would have money, I would buy it.",
        correct: "If I had money, I would buy it.",
        explanation: "Don't use 'would' in the 'if' clause"
      }
    ],
    pepReference: "Grade 11 Unit 3",
    difficulty: "advanced",
    relatedTopics: ["g10-conditionals-zero-first", "g12-mixed-conditionals"]
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
      "Some verbs take both with different meanings: stop, remember, forget"
    ],
    examples: [
      {
        correct: "I want to learn English.",
        explanation: "'want' is followed by infinitive"
      },
      {
        correct: "She enjoys reading books.",
        explanation: "'enjoy' is followed by gerund"
      },
      {
        correct: "I stopped to talk to him. (stopped in order to talk)",
        explanation: "Infinitive shows purpose"
      },
      {
        correct: "I stopped talking to him. (stopped the action of talking)",
        explanation: "Gerund is the object of 'stopped'"
      }
    ],
    commonMistakes: [
      {
        incorrect: "I want learning English.",
        correct: "I want to learn English.",
        explanation: "'want' requires infinitive, not gerund"
      },
      {
        incorrect: "She finished to write the essay.",
        correct: "She finished writing the essay.",
        explanation: "'finish' requires gerund, not infinitive"
      }
    ],
    pepReference: "Grade 11 Unit 6",
    difficulty: "advanced",
    relatedTopics: ["g12-participles"]
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
      "Use 'should' in formal suggestions"
    ],
    examples: [
      {
        correct: "I suggest that he study harder.",
        explanation: "Base form 'study' after 'suggest'"
      },
      {
        correct: "If I were you, I would accept the offer.",
        explanation: "Use 'were' for all persons in unreal conditions"
      }
    ],
    commonMistakes: [
      {
        incorrect: "I suggest that he studies harder.",
        correct: "I suggest that he study harder.",
        explanation: "Use base form, not present tense"
      },
      {
        incorrect: "If I was rich, I would travel.",
        correct: "If I were rich, I would travel.",
        explanation: "Use 'were' in hypothetical conditions"
      }
    ],
    pepReference: "Grade 12 Unit 4",
    difficulty: "advanced",
    relatedTopics: ["g11-conditionals-second-third"]
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
      "Use noun clauses (that, what, whether, if)"
    ],
    examples: [
      {
        correct: "The book that I bought yesterday is very interesting.",
        explanation: "Relative clause modifies 'book'"
      },
      {
        correct: "Although it was raining, we went out.",
        explanation: "Adverbial clause shows contrast"
      }
    ],
    commonMistakes: [
      {
        incorrect: "The person which helped me was kind.",
        correct: "The person who helped me was kind.",
        explanation: "Use 'who' for people, not 'which'"
      }
    ],
    pepReference: "Grade 12 Unit 7",
    difficulty: "advanced",
    relatedTopics: ["g11-non-finite-verbs"]
  }
];
function getTopicsByGrade(grade) {
  return GRAMMAR_TOPICS.filter((topic) => topic.gradeLevel === grade);
}

// server/routers/grammar.ts
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1e3) {
  let lastError = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.log(`[Retry] Attempt ${attempt + 1}/${maxRetries} failed:`, error);
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`[Retry] Waiting ${delay}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError || new Error("Retry failed");
}
function fallbackGrammarCheck(sentence) {
  console.log("[Fallback] Using basic grammar check");
  const errors = [];
  if (sentence.length > 0 && sentence[0] !== sentence[0].toUpperCase()) {
    errors.push({
      type: "capitalization_error",
      category: "\u5176\u4ED6",
      position: { start: 0, end: 1 },
      incorrect: sentence[0],
      correct: sentence[0].toUpperCase(),
      explanation: "\u82F1\u6587\u53E5\u5B50\u7684\u7B2C\u4E00\u4E2A\u5B57\u6BCD\u8981\u5927\u5199\u54E6\uFF01",
      severity: "minor"
    });
  }
  const lastChar = sentence[sentence.length - 1];
  if (![".", "!", "?"].includes(lastChar)) {
    errors.push({
      type: "punctuation_error",
      category: "\u5176\u4ED6",
      position: { start: sentence.length, end: sentence.length },
      incorrect: "",
      correct: ".",
      explanation: "\u53E5\u5B50\u672B\u5C3E\u9700\u8981\u52A0\u4E0A\u6807\u70B9\u7B26\u53F7\uFF08\u5982\u53E5\u53F7\u3001\u95EE\u53F7\u6216\u611F\u53F9\u53F7\uFF09\u54E6\uFF01",
      severity: "minor"
    });
  }
  const commonMistakes = {
    "dont": "don't",
    "cant": "can't",
    "wont": "won't",
    "im": "I'm",
    "youre": "you're",
    "theyre": "they're"
  };
  const words = sentence.toLowerCase().split(/\s+/);
  words.forEach((word, index) => {
    const cleanWord = word.replace(/[.,!?;:]$/g, "");
    if (commonMistakes[cleanWord]) {
      const start = sentence.toLowerCase().indexOf(cleanWord);
      if (start !== -1) {
        errors.push({
          type: "spelling_error",
          category: "\u5176\u4ED6",
          position: { start, end: start + cleanWord.length },
          incorrect: cleanWord,
          correct: commonMistakes[cleanWord],
          explanation: `\u8FD9\u91CC\u5E94\u8BE5\u662F "${commonMistakes[cleanWord]}"\uFF0C\u8BB0\u5F97\u52A0\u4E0A\u6487\u53F7\u54E6\uFF01`,
          severity: "important"
        });
      }
    }
  });
  const score = Math.max(60, 100 - errors.length * 10);
  return {
    original: sentence,
    corrected: sentence,
    errors,
    overallScore: score,
    suggestions: [
      "\u7531\u4E8E\u7F51\u7EDC\u539F\u56E0\uFF0C\u6211\u4EEC\u6682\u65F6\u53EA\u80FD\u63D0\u4F9B\u57FA\u7840\u68C0\u67E5\u3002",
      "\u5EFA\u8BAE\u7A0D\u540E\u91CD\u8BD5\u4EE5\u83B7\u5F97\u66F4\u8BE6\u7EC6\u7684AI\u5206\u6790\u3002",
      "\u4F60\u53EF\u4EE5\u7EE7\u7EED\u7EC3\u4E60\uFF0C\u6211\u4EEC\u4F1A\u5C3D\u5FEB\u6062\u590D\u5B8C\u6574\u529F\u80FD\uFF01"
    ]
  };
}
var grammarRouter = router({
  /**
   * Check grammar of a sentence using OpenAI
   * 带重试和降级方案
   */
  check: publicProcedure.input(
    z2.object({
      sentence: z2.string().min(1).max(1e3),
      gradeLevel: z2.number().min(7).max(12).default(9)
    })
  ).mutation(async ({ input, ctx }) => {
    const { sentence, gradeLevel } = input;
    if (!sentence || sentence.trim().length === 0) {
      return {
        original: sentence,
        corrected: sentence,
        errors: [],
        overallScore: 0,
        suggestions: ["\u8BF7\u8F93\u5165\u4E00\u4E2A\u53E5\u5B50\u54E6\uFF01"]
      };
    }
    const relevantTopics = getTopicsByGrade(gradeLevel);
    const topicSummary = relevantTopics.map((t2) => `${t2.title} (${t2.category})`).slice(0, 10).join(", ");
    const systemPrompt = `\u4F60\u662F\u4E00\u4F4D\u6E29\u67D4\u3001\u6709\u8010\u5FC3\u7684\u82F1\u8BED\u8BED\u6CD5\u8001\u5E08\uFF0C\u4E13\u95E8\u5E2E\u52A9\u4E2D\u56FD${gradeLevel}\u5E74\u7EA7\u7684\u5B66\u751F\u5B66\u4E60\u82F1\u8BED\u8BED\u6CD5\u3002
\u4F60\u7684\u4EFB\u52A1\u662F\u5206\u6790\u5B66\u751F\u5199\u7684\u82F1\u6587\u53E5\u5B50\uFF0C\u627E\u51FA\u8BED\u6CD5\u9519\u8BEF\uFF0C\u5E76\u7528\u7B80\u5355\u3001\u53CB\u597D\u7684\u4E2D\u6587\u89E3\u91CA\u3002

${gradeLevel}\u5E74\u7EA7\u7684\u91CD\u70B9\u8BED\u6CD5\uFF1A${topicSummary}

\u5206\u6790\u53E5\u5B50\u65F6\u8BF7\u6CE8\u610F\uFF1A
1. \u627E\u51FA\u6240\u6709\u8BED\u6CD5\u9519\u8BEF\uFF08\u52A8\u8BCD\u65F6\u6001\u3001\u4E3B\u8C13\u4E00\u81F4\u3001\u51A0\u8BCD\u3001\u4ECB\u8BCD\u3001\u60C5\u6001\u52A8\u8BCD\u3001\u88AB\u52A8\u8BED\u6001\u3001\u8BED\u5E8F\u3001\u62FC\u5199\u3001\u6807\u70B9\uFF09
2. \u5BF9\u6BCF\u4E2A\u9519\u8BEF\uFF0C\u8BF7\u63D0\u4F9B\uFF1A
   - \u9519\u8BEF\u7C7B\u578B\uFF08\u5982 "verb_tense", "article_error", "subject_verb_agreement"\uFF09
   - \u9519\u8BEF\u5206\u7C7B\uFF08\u5982 "\u65F6\u6001", "\u51A0\u8BCD", "\u4E3B\u8C13\u4E00\u81F4"\uFF09
   - \u9519\u8BEF\u5728\u53E5\u5B50\u4E2D\u7684\u4F4D\u7F6E\uFF08\u8D77\u59CB\u548C\u7ED3\u675F\u5B57\u7B26\u7D22\u5F15\uFF09
   - \u9519\u8BEF\u7684\u90E8\u5206
   - \u6B63\u786E\u7684\u5199\u6CD5
   - \u7528\u7B80\u5355\u3001\u53CB\u597D\u7684\u4E2D\u6587\u89E3\u91CA\u4E3A\u4EC0\u4E48\u9519\u4E86\uFF0C\u600E\u4E48\u6539\u6B63\uFF08\u5C31\u50CF\u5728\u548C\u5B66\u751F\u9762\u5BF9\u9762\u804A\u5929\u4E00\u6837\uFF09
   - \u5982\u679C\u9002\u7528\uFF0C\u6807\u6CE8\u4EBA\u6559\u7248\u6559\u6750\u53C2\u8003\uFF08\u5982 "\u4E03\u5E74\u7EA7\u4E0B\u518C Unit 4"\uFF09
   - \u4E25\u91CD\u7A0B\u5EA6\uFF1A"critical"\uFF08\u4E25\u91CD\uFF09, "important"\uFF08\u91CD\u8981\uFF09, \u6216 "minor"\uFF08\u8F7B\u5FAE\uFF09
3. \u63D0\u4F9B\u5B8C\u6574\u7684\u6B63\u786E\u53E5\u5B50
4. \u7ED9\u51FA1-2\u6761\u9F13\u52B1\u6027\u7684\u5B66\u4E60\u5EFA\u8BAE\uFF08\u7528\u6E29\u6696\u3001\u79EF\u6781\u7684\u8BED\u6C14\uFF09

\u8BF7\u53EA\u8FD4\u56DEJSON\u683C\u5F0F\uFF0C\u7ED3\u6784\u5982\u4E0B\uFF1A
{
  "original": "\u539F\u53E5",
  "corrected": "\u6539\u6B63\u540E\u7684\u53E5\u5B50",
  "errors": [
    {
      "type": "verb_tense",
      "category": "\u65F6\u6001",
      "position": {"start": 2, "end": 4},
      "incorrect": "go",
      "correct": "went",
      "explanation": "\u8FD9\u91CC\u8981\u7528\u8FC7\u53BB\u5F0F 'went' \u54E6\uFF01\u56E0\u4E3A 'yesterday'\uFF08\u6628\u5929\uFF09\u8868\u793A\u7684\u662F\u8FC7\u53BB\u53D1\u751F\u7684\u4E8B\u60C5\u3002\u8BB0\u4F4F\uFF1Ayesterday \u540E\u9762\u7684\u52A8\u8BCD\u8981\u7528\u8FC7\u53BB\u5F0F\u3002",
      "pepReference": "\u4E03\u5E74\u7EA7\u4E0B\u518C Unit 4",
      "severity": "critical"
    }
  ],
  "overallScore": 85,
  "suggestions": ["\u4F60\u5DF2\u7ECF\u638C\u63E1\u4E86\u57FA\u672C\u53E5\u578B\uFF0C\u5F88\u68D2\uFF01\u63A5\u4E0B\u6765\u53EF\u4EE5\u591A\u7EC3\u4E60\u4E00\u4E0B\u8FC7\u53BB\u65F6\u6001\uFF0C\u7279\u522B\u662F\u9047\u5230 yesterday\u3001last week \u8FD9\u4E9B\u65F6\u95F4\u8BCD\u7684\u65F6\u5019\u3002\u52A0\u6CB9\uFF01"]
}

\u5982\u679C\u53E5\u5B50\u6CA1\u6709\u9519\u8BEF\uFF0Cerrors \u8FD4\u56DE\u7A7A\u6570\u7EC4\uFF0CoverallScore \u4E3A 100\u3002
\u8BB0\u4F4F\uFF1A\u89E3\u91CA\u8981\u50CF\u670B\u53CB\u4E00\u6837\u4EB2\u5207\uFF0C\u591A\u7528"\u4F60"\u3001"\u54B1\u4EEC"\u8FD9\u6837\u7684\u8BCD\uFF0C\u8BA9\u5B66\u751F\u611F\u5230\u6E29\u6696\u548C\u9F13\u52B1\uFF01`;
    const userPrompt = `Analyze this sentence: "${sentence}"`;
    try {
      console.log("[Grammar Check] Starting with retry mechanism...");
      const response = await retryWithBackoff(async () => {
        return await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          maxTokens: 2e3,
          responseFormat: { type: "json_object" }
        });
      }, 3, 1e3);
      const content = response.choices[0]?.message?.content;
      const contentText = typeof content === "string" ? content : Array.isArray(content) && content[0] && typeof content[0] === "object" && "type" in content[0] && content[0].type === "text" && "text" in content[0] ? content[0].text : "";
      if (!contentText) {
        console.error("[Grammar Check] No content from LLM, using fallback");
        return fallbackGrammarCheck(sentence);
      }
      const result = JSON.parse(contentText);
      console.log("[Grammar Check] Success!");
      return {
        original: result.original || sentence,
        corrected: result.corrected || sentence,
        errors: result.errors || [],
        overallScore: result.overallScore || 100,
        suggestions: result.suggestions || []
      };
    } catch (error) {
      console.error("[Grammar Check] All retries failed, using fallback:", error);
      return fallbackGrammarCheck(sentence);
    }
  }),
  /**
   * Get grammar topics by grade level
   */
  getTopics: publicProcedure.input(
    z2.object({
      gradeLevel: z2.number().min(7).max(12)
    })
  ).query(({ input }) => {
    return getTopicsByGrade(input.gradeLevel);
  }),
  /**
   * Generate suggested questions based on grammar errors
   */
  suggestQuestions: publicProcedure.input(
    z2.object({
      errors: z2.array(
        z2.object({
          type: z2.string(),
          category: z2.string(),
          explanation: z2.string()
        })
      ),
      gradeLevel: z2.number().min(7).max(12)
    })
  ).mutation(async ({ input }) => {
    try {
      const errorSummary = input.errors.map((e) => `${e.category}: ${e.type}`).join("\u3001");
      const prompt = `\u4F60\u662F\u4E00\u4F4D\u6709\u7ECF\u9A8C\u7684\u82F1\u8BED\u8001\u5E08\u3002\u5B66\u751F\u521A\u624D\u5728\u8BED\u6CD5\u68C0\u67E5\u4E2D\u72AF\u4E86\u8FD9\u4E9B\u9519\u8BEF\uFF1A${errorSummary}

\u8BF7\u6839\u636E\u8FD9\u4E9B\u9519\u8BEF\uFF0C\u731C\u6D4B${input.gradeLevel}\u5E74\u7EA7\u5B66\u751F\u53EF\u80FD\u60F3\u4E86\u89E3\u7684\u76F8\u5173\u77E5\u8BC6\u70B9\u3002\u751F\u6210 3-4 \u4E2A\u7B80\u77ED\u7684\u95EE\u9898\uFF0C\u5E2E\u52A9\u5B66\u751F\u6DF1\u5165\u7406\u89E3\u8FD9\u4E2A\u8BED\u6CD5\u70B9\u3002

\u95EE\u9898\u8981\u6C42\uFF1A
1. \u7B80\u77ED\u3001\u53E3\u8BED\u5316\uFF0C\u50CF\u5B66\u751F\u4F1A\u95EE\u7684\u90A3\u6837
2. \u76F4\u63A5\u9488\u5BF9\u9519\u8BEF\u7C7B\u578B\u7684\u76F8\u5173\u77E5\u8BC6
3. \u7531\u6D45\u5165\u6DF1\uFF0C\u4ECE\u57FA\u7840\u5230\u8FDB\u9636

\u8BF7\u4EE5JSON\u6570\u7EC4\u683C\u5F0F\u8FD4\u56DE\uFF0C\u6BCF\u4E2A\u5143\u7D20\u662F\u4E00\u4E2A\u95EE\u9898\u5B57\u7B26\u4E32\u3002
\u4F8B\u5982\uFF1A[" past tense \u548C past participle \u6709\u4EC0\u4E48\u533A\u522B\uFF1F", "\u4EC0\u4E48\u65F6\u5019\u7528 went\uFF0C\u4EC0\u4E48\u65F6\u5019\u7528 gone\uFF1F"]

\u53EA\u8FD4\u56DEJSON\u6570\u7EC4\uFF0C\u4E0D\u8981\u5176\u4ED6\u6587\u5B57\u3002`;
      const response = await retryWithBackoff(async () => {
        return await invokeLLM({
          messages: [
            {
              role: "system",
              content: "\u4F60\u662F\u4E00\u4F4D\u82F1\u8BED\u8BED\u6CD5\u8001\u5E08\u3002\u53EA\u8FD4\u56DEJSON\u683C\u5F0F\uFF0C\u4E0D\u8981markdown\u683C\u5F0F\u3002"
            },
            { role: "user", content: prompt }
          ],
          maxTokens: 500
        });
      }, 2, 1e3);
      const content = response.choices[0]?.message?.content;
      const contentText = typeof content === "string" ? content : content?.[0]?.type === "text" ? content[0].text : "";
      if (!contentText) {
        return { questions: [] };
      }
      const cleanContent = contentText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const questions = JSON.parse(cleanContent);
      return { questions };
    } catch (error) {
      console.error("Suggest questions error:", error);
      return { questions: [] };
    }
  }),
  /**
   * Categorize error automatically using AI
   */
  categorizeError: publicProcedure.input(
    z2.object({
      errorType: z2.string(),
      errorCategory: z2.string(),
      explanation: z2.string()
    })
  ).mutation(async ({ input }) => {
    try {
      const prompt = `\u4F60\u662F\u4E00\u4F4D\u4E13\u4E1A\u7684\u82F1\u8BED\u8BED\u6CD5\u5206\u6790\u4E13\u5BB6\u3002\u8BF7\u6839\u636E\u4EE5\u4E0B\u9519\u8BEF\u4FE1\u606F,\u5C06\u5176\u5F52\u7C7B\u5230\u6700\u5408\u9002\u7684\u8BED\u6CD5\u5206\u7C7B\u4E2D\u3002

\u9519\u8BEF\u7C7B\u578B: ${input.errorType}
\u9519\u8BEF\u5206\u7C7B: ${input.errorCategory}
\u89E3\u91CA: ${input.explanation}

\u53EF\u9009\u7684\u8BE6\u7EC6\u5206\u7C7B\u6807\u7B7E:
- \u65F6\u6001\u53D8\u5316 (tense)
- \u4E3B\u8C13\u4E00\u81F4 (agreement)
- \u865A\u62DF\u8BED\u6C14 (subjunctive)
- \u8BED\u6001\u8F6C\u6362 (voice)
- \u4ECE\u53E5\u7ED3\u6784 (clause)
- \u51A0\u8BCD\u4F7F\u7528 (article)
- \u4ECB\u8BCD\u642D\u914D (preposition)
- \u975E\u8C13\u8BED\u52A8\u8BCD (nonFinite)
- \u60C5\u6001\u52A8\u8BCD (modal)
- \u8BCD\u5E8F\u95EE\u9898 (wordOrder)

\u8BF7\u53EA\u8FD4\u56DEJSON\u683C\u5F0F:
{
  "detailedCategory": "\u65F6\u6001\u53D8\u5316",
  "categoryKey": "tense",
  "confidence": 0.95
}`;
      const response = await retryWithBackoff(async () => {
        return await invokeLLM({
          messages: [
            { role: "system", content: "\u4F60\u662F\u4E00\u4F4D\u82F1\u8BED\u8BED\u6CD5\u5206\u6790\u4E13\u5BB6\u3002\u53EA\u8FD4\u56DEJSON\u683C\u5F0F\u3002" },
            { role: "user", content: prompt }
          ],
          maxTokens: 200,
          responseFormat: { type: "json_object" }
        });
      }, 2, 1e3);
      const content = response.choices[0]?.message?.content;
      const contentText = typeof content === "string" ? content : Array.isArray(content) && content[0] && typeof content[0] === "object" && "type" in content[0] && content[0].type === "text" && "text" in content[0] ? content[0].text : "";
      if (!contentText) {
        return { detailedCategory: input.errorCategory, categoryKey: "other", confidence: 0.5 };
      }
      const result = JSON.parse(contentText);
      return result;
    } catch (error) {
      console.error("Categorize error failed:", error);
      return { detailedCategory: input.errorCategory, categoryKey: "other", confidence: 0.5 };
    }
  }),
  /**
   * Generate targeted exercises based on error category
   */
  generateTargetedExercises: publicProcedure.input(
    z2.object({
      errorCategory: z2.string(),
      grammarPoint: z2.string(),
      difficulty: z2.enum(["easy", "medium", "hard"]).default("medium"),
      gradeLevel: z2.number().min(7).max(12).default(8)
    })
  ).mutation(async ({ input }) => {
    try {
      const prompt = `\u4F60\u662F\u4E00\u4F4D\u4E13\u4E1A\u7684\u82F1\u8BED\u6559\u5E08,\u64C5\u957F\u8BBE\u8BA1\u9488\u5BF9\u6027\u7EC3\u4E60\u9898\u3002

\u5B66\u751F\u5728\u300C${input.grammarPoint}\u300D(${input.errorCategory})\u65B9\u9762\u5B58\u5728\u95EE\u9898\u3002
\u5E74\u7EA7: ${input.gradeLevel}\u5E74\u7EA7
\u96BE\u5EA6: ${input.difficulty === "easy" ? "\u7B80\u5355" : input.difficulty === "medium" ? "\u4E2D\u7B49" : "\u56F0\u96BE"}

\u8BF7\u751F\u62103\u9053\u9488\u5BF9\u6027\u7EC3\u4E60\u9898,\u8981\u6C42:
1. \u9898\u76EE\u8981\u7ED3\u5408\u4EBA\u6559\u7248\u6559\u6750\u7684\u8BED\u5883\u548C\u8BCD\u6C47
2. \u9898\u76EE\u7C7B\u578B: \u9009\u62E9\u9898\u6216\u586B\u7A7A\u9898
3. \u96BE\u5EA6\u9002\u5408${input.gradeLevel}\u5E74\u7EA7\u5B66\u751F
4. \u6BCF\u9053\u9898\u90FD\u8981\u6709\u8BE6\u7EC6\u7684\u4E2D\u6587\u89E3\u6790

\u8BF7\u8FD4\u56DEJSON\u683C\u5F0F:
{
  "exercises": [
    {
      "question": "\u9898\u76EE\u5185\u5BB9",
      "options": ["A. \u9009\u98791", "B. \u9009\u98792", "C. \u9009\u98793", "D. \u9009\u98794"],
      "correctAnswer": "A",
      "explanation": "\u8BE6\u7EC6\u89E3\u6790(\u4E2D\u6587)",
      "difficulty": "medium"
    }
  ]
}`;
      const response = await retryWithBackoff(async () => {
        return await invokeLLM({
          messages: [
            { role: "system", content: "\u4F60\u662F\u4E00\u4F4D\u82F1\u8BED\u6559\u5E08\u3002\u53EA\u8FD4\u56DEJSON\u683C\u5F0F\u3002" },
            { role: "user", content: prompt }
          ],
          maxTokens: 1500,
          responseFormat: { type: "json_object" }
        });
      }, 2, 1e3);
      const content = response.choices[0]?.message?.content;
      const contentText = typeof content === "string" ? content : Array.isArray(content) && content[0] && typeof content[0] === "object" && "type" in content[0] && content[0].type === "text" && "text" in content[0] ? content[0].text : "";
      if (!contentText) {
        return { exercises: [] };
      }
      const result = JSON.parse(contentText);
      return result;
    } catch (error) {
      console.error("Generate targeted exercises failed:", error);
      return { exercises: [] };
    }
  }),
  /**
   * Generate dual-mode explanation (teacher mode + simple mode)
   */
  generateDualExplanation: publicProcedure.input(
    z2.object({
      grammarPoint: z2.string(),
      category: z2.string(),
      gradeLevel: z2.number().min(7).max(12).default(8)
    })
  ).mutation(async ({ input }) => {
    try {
      const prompt = `\u4F60\u662F\u4E00\u4F4D\u4E13\u4E1A\u7684\u82F1\u8BED\u8BED\u6CD5\u8001\u5E08\u3002\u8BF7\u4E3A\u300C${input.grammarPoint}\u300D(\u5206\u7C7B: ${input.category})\u751F\u6210\u4E24\u79CD\u8BB2\u89E3\u6A21\u5F0F:

1. **\u8001\u5E08\u7248** (Teacher Mode): \u4F7F\u7528\u4E13\u4E1A\u672F\u8BED,\u5B8C\u6574\u7684\u8BED\u6CD5\u89C4\u5219,\u9002\u5408\u6559\u5E08\u6559\u5B66\u548C\u6DF1\u5165\u5B66\u4E60\u3002
2. **\u5927\u767D\u8BDD\u7248** (Simple Mode): \u7528\u751F\u6D3B\u5316\u7684\u4F8B\u5B50,\u901A\u4FD7\u6613\u61C2\u7684\u8BED\u8A00,\u9002\u5408${input.gradeLevel}\u5E74\u7EA7\u5B66\u751F\u5FEB\u901F\u7406\u89E3\u3002

\u8981\u6C42:
- \u8001\u5E08\u7248: 200-300\u5B57,\u4E13\u4E1A\u3001\u4E25\u8C28\u3001\u7CFB\u7EDF
- \u5927\u767D\u8BDD\u7248: 150-200\u5B57,\u8F7B\u677E\u3001\u6709\u8DA3\u3001\u6613\u61C2
- \u4E24\u79CD\u6A21\u5F0F\u90FD\u8981\u5305\u542B\u4F8B\u53E5

\u8BF7\u8FD4\u56DEJSON\u683C\u5F0F:
{
  "teacher": "\u8001\u5E08\u7248\u8BB2\u89E3...",
  "simple": "\u5927\u767D\u8BDD\u7248\u8BB2\u89E3..."
}`;
      const response = await retryWithBackoff(async () => {
        return await invokeLLM({
          messages: [
            { role: "system", content: "\u4F60\u662F\u4E00\u4F4D\u82F1\u8BED\u8BED\u6CD5\u8001\u5E08\u3002\u53EA\u8FD4\u56DEJSON\u683C\u5F0F\u3002" },
            { role: "user", content: prompt }
          ],
          maxTokens: 1e3,
          responseFormat: { type: "json_object" }
        });
      }, 2, 1e3);
      const content = response.choices[0]?.message?.content;
      const contentText = typeof content === "string" ? content : Array.isArray(content) && content[0] && typeof content[0] === "object" && "type" in content[0] && content[0].type === "text" && "text" in content[0] ? content[0].text : "";
      if (!contentText) {
        return {
          teacher: "\u6682\u65E0\u8BB2\u89E3",
          simple: "\u6682\u65E0\u8BB2\u89E3"
        };
      }
      const result = JSON.parse(contentText);
      return result;
    } catch (error) {
      console.error("Generate dual explanation failed:", error);
      return {
        teacher: "\u751F\u6210\u8BB2\u89E3\u5931\u8D25,\u8BF7\u7A0D\u540E\u91CD\u8BD5",
        simple: "\u751F\u6210\u8BB2\u89E3\u5931\u8D25,\u8BF7\u7A0D\u540E\u91CD\u8BD5"
      };
    }
  }),
  /**
   * Answer student's follow-up question
   */
  answerQuestion: publicProcedure.input(
    z2.object({
      question: z2.string(),
      originalSentence: z2.string(),
      errors: z2.array(
        z2.object({
          type: z2.string(),
          category: z2.string(),
          explanation: z2.string()
        })
      ),
      gradeLevel: z2.number().min(7).max(12)
    })
  ).mutation(async ({ input }) => {
    try {
      const errorContext = input.errors.map((e) => `- ${e.category} (${e.type}): ${e.explanation}`).join("\n");
      const prompt = `\u4F60\u662F\u4E00\u4F4D\u6E29\u67D4\u3001\u6709\u8010\u5FC3\u7684\u82F1\u8BED\u8001\u5E08\uFF0C\u6B63\u5728\u5E2E\u52A9${input.gradeLevel}\u5E74\u7EA7\u7684\u5B66\u751F\u3002

\u5B66\u751F\u7684\u539F\u53E5\uFF1A"${input.originalSentence}"

\u8BED\u6CD5\u9519\u8BEF\uFF1A
${errorContext}

\u5B66\u751F\u73B0\u5728\u95EE\uFF1A"${input.question}"

\u8BF7\u7528\u7B80\u5355\u3001\u53CB\u597D\u7684\u4E2D\u6587\u56DE\u7B54\u5B66\u751F\u7684\u95EE\u9898\u3002\u8981\u6C42\uFF1A
1. \u8BED\u6C14\u4EB2\u5207\uFF0C\u50CF\u9762\u5BF9\u9762\u804A\u5929\u4E00\u6837\uFF0C\u591A\u7528"\u4F60"\u3001"\u54B1\u4EEC"
2. \u89E3\u91CA\u6E05\u6670\u3001\u901A\u4FD7\u6613\u61C2\uFF0C\u9002\u5408${input.gradeLevel}\u5E74\u7EA7\u5B66\u751F
3. \u5982\u679C\u9002\u5408\uFF0C\u7ED9\u51FA1-2\u4E2A\u4F8B\u53E5\u5E2E\u52A9\u7406\u89E3
4. \u9F13\u52B1\u5B66\u751F\uFF0C\u8BA9\u4ED6\u4EEC\u611F\u5230\u88AB\u652F\u6301
5. \u56DE\u7B54\u957F\u5EA6\u63A7\u5236\u5728 150-250 \u5B57

\u76F4\u63A5\u8FD4\u56DE\u56DE\u7B54\u5185\u5BB9\uFF0C\u4E0D\u8981JSON\u683C\u5F0F\u3002`;
      const response = await retryWithBackoff(async () => {
        return await invokeLLM({
          messages: [
            {
              role: "system",
              content: "\u4F60\u662F\u4E00\u4F4D\u6E29\u67D4\u3001\u6709\u8010\u5FC3\u7684\u82F1\u8BED\u8001\u5E08\u3002"
            },
            { role: "user", content: prompt }
          ],
          maxTokens: 800
        });
      }, 2, 1e3);
      const content = response.choices[0]?.message?.content;
      const answer = typeof content === "string" ? content : Array.isArray(content) && content[0] && typeof content[0] === "object" && "type" in content[0] && content[0].type === "text" && "text" in content[0] ? content[0].text : "\u62B1\u6B49\uFF0C\u6211\u6682\u65F6\u65E0\u6CD5\u56DE\u7B54\u8FD9\u4E2A\u95EE\u9898\u3002\u8BF7\u8BD5\u8BD5\u6362\u4E2A\u65B9\u5F0F\u95EE\u3002";
      return { answer };
    } catch (error) {
      console.error("Answer question error:", error);
      return {
        answer: "\u62B1\u6B49\uFF0C\u51FA\u73B0\u4E86\u4E00\u4E9B\u95EE\u9898\u3002\u8BF7\u7A0D\u540E\u518D\u8BD5\u3002"
      };
    }
  }),
  /**
   * 测试环境变量（调试用）
   */
  testEnv: publicProcedure.query(() => {
    return {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasMysqlUrl: !!process.env.MYSQL_URL,
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) || "not set",
      mysqlUrlPrefix: process.env.MYSQL_URL?.substring(0, 20) || "not set"
    };
  }),
  /**
   * 初始化语法数据库（仅用于首次部署）
   */
  initDatabase: publicProcedure.mutation(async () => {
    const { initGrammarDatabase: initGrammarDatabase2 } = await Promise.resolve().then(() => (init_init_grammar_db(), init_grammar_db_exports));
    const result = await initGrammarDatabase2();
    return result;
  }),
  /**
   * 获取所有语法章节
   */
  getChapters: publicProcedure.query(async () => {
    const { getDb: getDb2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const { grammarChapters: grammarChapters2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const db = await getDb2();
    if (!db) {
      throw new Error("Database not available");
    }
    const chapters = await db.select().from(grammarChapters2).orderBy(grammarChapters2.order);
    return chapters.map((chapter) => ({
      ...chapter,
      examWeightBreakdown: chapter.examWeightBreakdown ? JSON.parse(chapter.examWeightBreakdown) : null,
      examTags: chapter.examTags ? JSON.parse(chapter.examTags) : []
    }));
  }),
  /**
   * 获取所有知识点（用于语法中心）
   */
  getAllTopics: publicProcedure.query(async () => {
    const { getDb: getDb2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const { grammarTopics: grammarTopics2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const db = await getDb2();
    if (!db) {
      throw new Error("Database not available");
    }
    const topics = await db.select().from(grammarTopics2);
    return topics.map((topic) => ({
      ...topic,
      rules: topic.rules ? JSON.parse(topic.rules) : [],
      examples: topic.examples ? JSON.parse(topic.examples) : [],
      memoryTips: topic.memoryTips ? JSON.parse(topic.memoryTips) : [],
      specialNotes: topic.specialNotes ? JSON.parse(topic.specialNotes) : [],
      commonMistakes: topic.commonMistakes ? JSON.parse(topic.commonMistakes) : [],
      relatedTopics: topic.relatedTopics ? JSON.parse(topic.relatedTopics) : []
    }));
  })
});

// server/routers/practice.ts
import { z as z3 } from "zod";
var practiceRouter = router({
  /**
   * Generate grammar exercises for a specific grammar point
   */
  generateGrammarExercises: publicProcedure.input(
    z3.object({
      grammarPoint: z3.string(),
      gradeLevel: z3.number().min(7).max(12),
      count: z3.number().min(1).max(10).default(5)
    })
  ).mutation(async ({ input }) => {
    try {
      const prompt = `\u4F60\u662F\u4E00\u4F4D\u6E29\u67D4\u3001\u6709\u8010\u5FC3\u7684\u82F1\u8BED\u8BED\u6CD5\u8001\u5E08\uFF0C\u6B63\u5728\u4E3A${input.gradeLevel}\u5E74\u7EA7\u7684\u5B66\u751F\u51FA\u7EC3\u4E60\u9898\u3002

\u8BED\u6CD5\u77E5\u8BC6\u70B9\uFF1A${input.grammarPoint}

\u8BF7\u751F\u6210${input.count}\u9053\u9009\u62E9\u9898\uFF0C\u8981\u6C42\uFF1A
1. \u6BCF\u9053\u9898\u8003\u67E5\u8FD9\u4E2A\u8BED\u6CD5\u77E5\u8BC6\u70B9
2. \u63D0\u4F9B4\u4E2A\u9009\u9879\uFF08A\u3001B\u3001C\u3001D\uFF09
3. \u6807\u660E\u6B63\u786E\u7B54\u6848
4. \u7528\u4EB2\u5207\u3001\u7B80\u5355\u7684\u4E2D\u6587\u89E3\u91CA\u4E3A\u4EC0\u4E48\u9009\u8FD9\u4E2A\u7B54\u6848
5. \u96BE\u5EA6\u9002\u5408${input.gradeLevel}\u5E74\u7EA7\u5B66\u751F

\u8BF7\u4EE5JSON\u6570\u7EC4\u683C\u5F0F\u8FD4\u56DE\uFF0C\u6BCF\u4E2A\u5143\u7D20\u5305\u542B\uFF1A
{
  "question": "\u9898\u76EE\uFF08\u4E2D\u6587\u63CF\u8FF0+\u82F1\u6587\u53E5\u5B50\uFF0C\u6709\u7A7A\u683C\u9700\u8981\u586B\u5165\u6B63\u786E\u9009\u9879\uFF09",
  "options": ["\u9009\u9879A", "\u9009\u9879B", "\u9009\u9879C", "\u9009\u9879D"],
  "correctAnswer": 0,  // \u6B63\u786E\u7B54\u6848\u7684\u7D22\u5F15\uFF080-3\uFF09
  "explanation": "\u6E29\u6696\u3001\u53CB\u597D\u7684\u4E2D\u6587\u89E3\u91CA"
}

\u8BB0\u4F4F\uFF1A\u89E3\u91CA\u8981\u50CF\u670B\u53CB\u4E00\u6837\u4EB2\u5207\uFF0C\u8BA9\u5B66\u751F\u611F\u5230\u88AB\u9F13\u52B1\uFF01
\u53EA\u8FD4\u56DEJSON\u6570\u7EC4\uFF0C\u4E0D\u8981\u5176\u4ED6\u6587\u5B57\u3002`;
      const completion = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You are an English grammar teacher. Always respond with valid JSON only, no markdown formatting."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });
      const content = typeof completion.choices[0]?.message.content === "string" ? completion.choices[0].message.content : "";
      const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (!jsonMatch) {
        throw new Error("Invalid JSON response from LLM");
      }
      const exercises = JSON.parse(jsonMatch[0]);
      return {
        exercises,
        grammarPoint: input.grammarPoint,
        count: exercises.length
      };
    } catch (error) {
      console.error("Error generating grammar exercises:", error);
      throw new Error("Failed to generate grammar exercises");
    }
  }),
  /**
   * Generate similar practice exercises based on error types
   */
  generateExercises: publicProcedure.input(
    z3.object({
      errorTypes: z3.array(z3.string()),
      originalSentence: z3.string(),
      count: z3.number().min(1).max(10).default(5),
      gradeLevel: z3.number().min(7).max(12)
    })
  ).mutation(async ({ input }) => {
    try {
      const prompt = `\u4F60\u662F\u4E00\u4F4D\u6E29\u67D4\u3001\u6709\u8010\u5FC3\u7684\u82F1\u8BED\u8BED\u6CD5\u8001\u5E08\uFF0C\u6B63\u5728\u5E2E\u52A9${input.gradeLevel}\u5E74\u7EA7\u7684\u5B66\u751F\u7EC3\u4E60\u8BED\u6CD5\u3002

\u5B66\u751F\u521A\u624D\u5728\u8FD9\u4E2A\u53E5\u5B50\u4E2D\u72AF\u4E86\u8FD9\u4E9B\u9519\u8BEF\uFF1A${input.errorTypes.join("\u3001")}
\u539F\u53E5\uFF1A${input.originalSentence}

\u73B0\u5728\u8BF7\u5E2E\u5B66\u751F\u751F\u6210${input.count}\u9053\u7EC3\u4E60\u9898\uFF0C\u8BA9\u4ED6\u4EEC\u5DE9\u56FA\u8FD9\u4E9B\u8BED\u6CD5\u70B9\u3002\u6BCF\u9053\u9898\u8981\u6C42\uFF1A
1. \u5305\u542B\u4E00\u4E2A\u6709\u8BED\u6CD5\u9519\u8BEF\u7684\u82F1\u6587\u53E5\u5B50\uFF08\u9519\u8BEF\u7C7B\u578B\u548C\u539F\u53E5\u76F8\u540C\uFF0C\u4F46\u6362\u4E2A\u573A\u666F\u548C\u8BCD\u6C47\uFF09
2. \u63D0\u4F9B\u6B63\u786E\u7684\u53E5\u5B50
3. \u7528\u4EB2\u5207\u3001\u7B80\u5355\u7684\u4E2D\u6587\u89E3\u91CA\u4E3A\u4EC0\u4E48\u8981\u8FD9\u6837\u6539\uFF08\u5C31\u50CF\u9762\u5BF9\u9762\u6559\u5B66\u751F\u4E00\u6837\uFF0C\u591A\u7528"\u4F60"\u3001"\u54B1\u4EEC"\uFF0C\u8BED\u6C14\u8981\u9F13\u52B1\uFF09
4. \u96BE\u5EA6\u9002\u5408${input.gradeLevel}\u5E74\u7EA7\u5B66\u751F

\u8BF7\u4EE5JSON\u6570\u7EC4\u683C\u5F0F\u8FD4\u56DE\uFF0C\u6BCF\u4E2A\u5143\u7D20\u5305\u542B\uFF1A
{
  "incorrect": "\u9519\u8BEF\u7684\u53E5\u5B50",
  "correct": "\u6B63\u786E\u7684\u53E5\u5B50",
  "explanation": "\u6E29\u6696\u3001\u53CB\u597D\u7684\u4E2D\u6587\u89E3\u91CA",
  "errorType": "\u9519\u8BEF\u7C7B\u578B"
}

\u8BB0\u4F4F\uFF1A\u89E3\u91CA\u8981\u50CF\u670B\u53CB\u4E00\u6837\u4EB2\u5207\uFF0C\u8BA9\u5B66\u751F\u611F\u5230\u88AB\u9F13\u52B1\uFF0C\u800C\u4E0D\u662F\u88AB\u6279\u8BC4\u3002\u591A\u8BF4"\u5F88\u597D"\u3001"\u52A0\u6CB9"\u3001"\u4F60\u53EF\u4EE5\u7684"\u8FD9\u6837\u7684\u8BDD\uFF01
\u53EA\u8FD4\u56DEJSON\u6570\u7EC4\uFF0C\u4E0D\u8981\u5176\u4ED6\u6587\u5B57\u3002`;
      const completion = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You are an English grammar teacher. Always respond with valid JSON only, no markdown formatting."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        maxTokens: 2e3
      });
      const content = completion.choices[0]?.message?.content;
      const contentText = typeof content === "string" ? content : content?.[0]?.type === "text" ? content[0].text : "";
      if (!contentText) {
        throw new Error("No response from LLM");
      }
      let exercises;
      try {
        const cleanContent = contentText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        exercises = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", content);
        throw new Error("Failed to parse exercises from AI response");
      }
      if (!Array.isArray(exercises)) {
        throw new Error("AI response is not an array");
      }
      return {
        exercises,
        count: exercises.length
      };
    } catch (error) {
      console.error("Generate exercises error:", error);
      throw new Error(`Failed to generate exercises: ${error.message}`);
    }
  }),
  /**
   * Check practice answer
   */
  checkAnswer: publicProcedure.input(
    z3.object({
      userAnswer: z3.string(),
      correctAnswer: z3.string(),
      originalIncorrect: z3.string()
    })
  ).mutation(async ({ input }) => {
    const isCorrect = input.userAnswer.trim().toLowerCase() === input.correctAnswer.trim().toLowerCase();
    return {
      isCorrect,
      userAnswer: input.userAnswer,
      correctAnswer: input.correctAnswer,
      feedback: isCorrect ? "\u5B8C\u5168\u6B63\u786E\uFF01\u4F60\u5DF2\u7ECF\u638C\u63E1\u4E86\u8FD9\u4E2A\u8BED\u6CD5\u70B9\u3002" : "\u8FD8\u6709\u4E00\u4E9B\u5C0F\u9519\u8BEF\uFF0C\u518D\u8BD5\u4E00\u6B21\u5427\uFF01"
    };
  })
});

// server/routers/dictionary.ts
import { z as z4 } from "zod";
var dictionaryRouter = router({
  /**
   * 查询单词释义
   */
  lookup: publicProcedure.input(
    z4.object({
      word: z4.string().min(1)
    })
  ).mutation(async ({ input }) => {
    const { word } = input;
    const prompt = `\u8BF7\u4F5C\u4E3A\u4E00\u4E2A\u82F1\u8BED\u8BCD\u5178\uFF0C\u4E3A\u5355\u8BCD"${word}"\u63D0\u4F9B\u8BE6\u7EC6\u7684\u91CA\u4E49\u4FE1\u606F\u3002

\u8981\u6C42\uFF1A
1. \u63D0\u4F9B\u97F3\u6807\uFF08\u56FD\u9645\u97F3\u6807IPA\uFF09
2. \u5217\u51FA\u6240\u6709\u5E38\u89C1\u8BCD\u6027\u548C\u5BF9\u5E94\u7684\u4E2D\u6587\u91CA\u4E49
3. \u6BCF\u4E2A\u91CA\u4E49\u63D0\u4F9B\u4E00\u4E2A\u7B80\u5355\u6613\u61C2\u7684\u82F1\u6587\u4F8B\u53E5
4. \u5982\u679C\u662F\u5E38\u89C1\u5355\u8BCD\uFF0C\u63D0\u4F9B\u8BB0\u5FC6\u6280\u5DE7\u6216\u8BCD\u6839\u8BCD\u7F00\u5206\u6790
5. \u7528\u53CB\u597D\u3001\u6613\u61C2\u7684\u4E2D\u6587\u8868\u8FBE

\u8BF7\u4EE5JSON\u683C\u5F0F\u8FD4\u56DE\uFF0C\u7ED3\u6784\u5982\u4E0B\uFF1A
{
  "word": "${word}",
  "phonetic": "\u97F3\u6807",
  "definitions": [
    {
      "partOfSpeech": "\u8BCD\u6027\uFF08\u5982\uFF1An. / v. / adj.\uFF09",
      "meaning": "\u4E2D\u6587\u91CA\u4E49",
      "exampleSentence": "\u82F1\u6587\u4F8B\u53E5"
    }
  ],
  "memoryTip": "\u8BB0\u5FC6\u6280\u5DE7\uFF08\u53EF\u9009\uFF09",
  "wordRoot": "\u8BCD\u6839\u8BCD\u7F00\u5206\u6790\uFF08\u53EF\u9009\uFF09"
}`;
    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        maxTokens: 1e3,
        responseFormat: { type: "json_object" }
      });
      const content = response.choices[0]?.message?.content;
      const contentText = typeof content === "string" ? content : content?.[0]?.type === "text" ? content[0].text : "";
      if (!contentText) {
        throw new Error("\u65E0\u6CD5\u83B7\u53D6AI\u54CD\u5E94");
      }
      const result = JSON.parse(contentText);
      return result;
    } catch (error) {
      console.error("Dictionary lookup error:", error);
      throw new Error("\u67E5\u8BCD\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5");
    }
  }),
  /**
   * 获取单词发音（TTS）
   */
  pronounce: publicProcedure.input(
    z4.object({
      word: z4.string().min(1)
    })
  ).mutation(async ({ input }) => {
    return {
      audioUrl: `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(input.word)}&type=1`
    };
  })
});

// server/routers/textbook.ts
import { z as z5 } from "zod";
var textbookRouter = router({
  // 生成单元语法知识点
  generateUnitGrammar: publicProcedure.input(
    z5.object({
      grade: z5.number().min(7).max(12),
      book: z5.string(),
      unit: z5.number().min(1),
      unitTitle: z5.string(),
      vocabulary: z5.array(z5.string()).optional()
      // 单元词汇列表，用于关联语法
    })
  ).mutation(async ({ input }) => {
    const { grade, book, unit, unitTitle, vocabulary } = input;
    const bookName = getBookName(grade, book);
    const vocabContext = vocabulary && vocabulary.length > 0 ? `

\u8BE5\u5355\u5143\u7684\u6838\u5FC3\u8BCD\u6C47\u5305\u62EC\uFF1A${vocabulary.slice(0, 10).join(", ")}\u7B49\u3002` : "";
    const prompt = `\u4F60\u662F\u4E00\u4F4D\u4E13\u4E1A\u7684\u82F1\u8BED\u6559\u5E08\uFF0C\u8BF7\u4E3A\u4EBA\u6559\u7248${bookName} Unit ${unit} "${unitTitle}" \u751F\u6210\u5B8C\u6574\u7684\u8BED\u6CD5\u77E5\u8BC6\u70B9\u8BB2\u89E3\u3002${vocabContext}

\u8981\u6C42\uFF1A
1. \u5217\u51FA\u8BE5\u5355\u5143\u7684\u6838\u5FC3\u8BED\u6CD5\u77E5\u8BC6\u70B9\uFF082-4\u4E2A\uFF09
2. \u6BCF\u4E2A\u8BED\u6CD5\u70B9\u5305\u542B\uFF1A
   - \u77E5\u8BC6\u70B9\u6807\u9898
   - \u6240\u5C5E\u7C7B\u522B\uFF08\u65F6\u6001/\u8BED\u6001/\u53E5\u578B/\u8BCD\u6027/\u4ECE\u53E5\u7B49\uFF09
   - \u8BE6\u7EC6\u8BB2\u89E3\uFF08\u7528\u901A\u4FD7\u6613\u61C2\u7684\u8BED\u8A00\uFF09
   - \u8BED\u6CD5\u89C4\u5219\u8981\u70B9\uFF083-5\u6761\uFF09
   - \u5178\u578B\u4F8B\u53E5\uFF083-5\u4E2A\uFF0C\u9644\u4E2D\u6587\u7FFB\u8BD1\u548C\u7B80\u8981\u5206\u6790\uFF09
   - \u5E38\u89C1\u9519\u8BEF\uFF082-3\u4E2A\uFF09
3. \u8BED\u6CD5\u70B9\u8981\u7B26\u5408${grade}\u5E74\u7EA7\u5B66\u751F\u6C34\u5E73
4. \u4F8B\u53E5\u8981\u8D34\u8FD1\u5B66\u751F\u751F\u6D3B\uFF0C\u6613\u4E8E\u7406\u89E3

\u8BF7\u4EE5JSON\u683C\u5F0F\u8FD4\u56DE\uFF0C\u683C\u5F0F\u5982\u4E0B\uFF1A
{
  "grammarPoints": [
    {
      "title": "\u77E5\u8BC6\u70B9\u6807\u9898",
      "category": "\u7C7B\u522B",
      "explanation": "\u8BE6\u7EC6\u8BB2\u89E3",
      "rules": ["\u89C4\u52191", "\u89C4\u52192"],
      "examples": [
        {
          "english": "\u82F1\u6587\u4F8B\u53E5",
          "chinese": "\u4E2D\u6587\u7FFB\u8BD1",
          "analysis": "\u7B80\u8981\u5206\u6790"
        }
      ],
      "commonMistakes": ["\u5E38\u89C1\u9519\u8BEF1", "\u5E38\u89C1\u9519\u8BEF2"]
    }
  ]
}`;
    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });
      const message = response.choices[0]?.message;
      if (!message || !message.content) {
        throw new Error("No response from LLM");
      }
      const content = Array.isArray(message.content) ? message.content.find((c) => c.type === "text")?.text || "" : message.content;
      const result = JSON.parse(content);
      return result;
    } catch (error) {
      console.error("Error generating unit grammar:", error);
      throw new Error("\u751F\u6210\u5355\u5143\u8BED\u6CD5\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5");
    }
  }),
  // 生成单元词汇表
  generateUnitVocabulary: publicProcedure.input(
    z5.object({
      grade: z5.number().min(7).max(12),
      book: z5.string(),
      unit: z5.number().min(1),
      unitTitle: z5.string().optional()
    })
  ).mutation(async ({ input }) => {
    const { grade, book, unit, unitTitle } = input;
    const bookName = getBookName(grade, book);
    const prompt = `\u4F60\u662F\u4E00\u4F4D\u4E13\u4E1A\u7684\u82F1\u8BED\u6559\u5E08\uFF0C\u8BF7\u4E3A\u4EBA\u6559\u7248${bookName} Unit ${unit}${unitTitle ? ` "${unitTitle}"` : ""} \u751F\u6210\u5B8C\u6574\u7684\u5355\u5143\u8BCD\u6C47\u8868\u3002

\u8981\u6C42\uFF1A
1. \u5217\u51FA\u8BE5\u5355\u5143\u7684\u6240\u6709\u6838\u5FC3\u8BCD\u6C47\uFF0815-25\u4E2A\u5355\u8BCD\uFF09
2. \u6BCF\u4E2A\u5355\u8BCD\u5305\u542B\uFF1A
   - \u5355\u8BCD\u62FC\u5199
   - \u56FD\u9645\u97F3\u6807
   - \u8BCD\u6027\uFF08n./v./adj./adv./prep./conj./interj.\u7B49\uFF09
   - \u4E2D\u6587\u91CA\u4E49
   - 2\u4E2A\u5B9E\u7528\u4F8B\u53E5\uFF08\u82F1\u6587+\u4E2D\u6587\u7FFB\u8BD1\uFF09
3. \u8BCD\u6C47\u96BE\u5EA6\u8981\u7B26\u5408${grade}\u5E74\u7EA7\u5B66\u751F\u6C34\u5E73
4. \u4F8B\u53E5\u8981\u8D34\u8FD1\u5B66\u751F\u751F\u6D3B\uFF0C\u6613\u4E8E\u7406\u89E3\u548C\u8BB0\u5FC6

\u8BF7\u4EE5JSON\u683C\u5F0F\u8FD4\u56DE\uFF0C\u683C\u5F0F\u5982\u4E0B\uFF1A
{
  "unitTitle": "\u5355\u5143\u4E3B\u9898",
  "words": [
    {
      "word": "\u5355\u8BCD",
      "phonetic": "/\u97F3\u6807/",
      "partOfSpeech": "\u8BCD\u6027",
      "meaning": "\u4E2D\u6587\u91CA\u4E49",
      "examples": [
        "\u4F8B\u53E51\uFF08\u82F1\u6587\uFF09",
        "\u4F8B\u53E52\uFF08\u82F1\u6587\uFF09"
      ]
    }
  ]
}`;
    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });
      const message = response.choices[0]?.message;
      if (!message || !message.content) {
        throw new Error("No response from LLM");
      }
      const content = Array.isArray(message.content) ? message.content.find((c) => c.type === "text")?.text || "" : message.content;
      const result = JSON.parse(content);
      return result;
    } catch (error) {
      console.error("Error generating unit vocabulary:", error);
      throw new Error("\u751F\u6210\u5355\u5143\u8BCD\u6C47\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5");
    }
  })
});
function getBookName(grade, book) {
  const bookMap = {
    "7A": "\u4E03\u5E74\u7EA7\u4E0A\u518C",
    "7B": "\u4E03\u5E74\u7EA7\u4E0B\u518C",
    "8A": "\u516B\u5E74\u7EA7\u4E0A\u518C",
    "8B": "\u516B\u5E74\u7EA7\u4E0B\u518C",
    "9": "\u4E5D\u5E74\u7EA7\u5168\u4E00\u518C",
    "R1": "\u5FC5\u4FEE\u7B2C\u4E00\u518C",
    "R2": "\u5FC5\u4FEE\u7B2C\u4E8C\u518C",
    "R3": "\u5FC5\u4FEE\u7B2C\u4E09\u518C",
    "E1": "\u9009\u62E9\u6027\u5FC5\u4FEE\u7B2C\u4E00\u518C",
    "E2": "\u9009\u62E9\u6027\u5FC5\u4FEE\u7B2C\u4E8C\u518C",
    "E3": "\u9009\u62E9\u6027\u5FC5\u4FEE\u7B2C\u4E09\u518C",
    "E4": "\u9009\u62E9\u6027\u5FC5\u4FEE\u7B2C\u56DB\u518C"
  };
  return bookMap[book] || `${grade}\u5E74\u7EA7`;
}

// server/routers/ocr.ts
import { z as z6 } from "zod";
var ocrRouter = router({
  /**
   * 识别图片中的英文文字
   */
  recognizeText: publicProcedure.input(
    z6.object({
      imageBase64: z6.string()
      // Base64编码的图片
    })
  ).mutation(async ({ input }) => {
    const { imageBase64 } = input;
    const prompt = `\u8BF7\u8BC6\u522B\u8FD9\u5F20\u56FE\u7247\u4E2D\u7684\u6240\u6709\u82F1\u6587\u6587\u5B57\u3002\u8981\u6C42\uFF1A
1. \u51C6\u786E\u8BC6\u522B\u6240\u6709\u82F1\u6587\u5355\u8BCD\u548C\u53E5\u5B50
2. \u4FDD\u6301\u539F\u6587\u7684\u6362\u884C\u548C\u6BB5\u843D\u7ED3\u6784
3. \u5982\u679C\u6709\u591A\u4E2A\u53E5\u5B50\uFF0C\u6BCF\u4E2A\u53E5\u5B50\u5355\u72EC\u4E00\u884C
4. \u53EA\u8FD4\u56DE\u8BC6\u522B\u51FA\u7684\u6587\u5B57\uFF0C\u4E0D\u8981\u6DFB\u52A0\u4EFB\u4F55\u89E3\u91CA\u6216\u8BF4\u660E
5. \u5982\u679C\u56FE\u7247\u4E2D\u6CA1\u6709\u82F1\u6587\u6587\u5B57\uFF0C\u8FD4\u56DE"\u672A\u8BC6\u522B\u5230\u82F1\u6587\u6587\u5B57"`;
    const result = await invokeLLM({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ]
    });
    const recognizedText = typeof result.choices[0]?.message.content === "string" ? result.choices[0].message.content.trim() : "";
    const lines = recognizedText.split("\n").filter((line) => line.trim());
    const isSentence = lines.some((line) => line.includes(" ") && line.length > 10);
    const isWord = lines.length === 1 && !lines[0].includes(" ");
    return {
      text: recognizedText,
      lines,
      type: isWord ? "word" : isSentence ? "sentence" : "text"
    };
  })
});

// server/routers/sms.ts
import { z as z7 } from "zod";
init_db();
init_schema();
import { eq as eq2, and, gt, desc } from "drizzle-orm";
function generateVerificationCode() {
  return Math.floor(1e5 + Math.random() * 9e5).toString();
}
function isValidPhoneNumber(phone) {
  return /^1[3-9]\d{9}$/.test(phone);
}
var smsRouter = router({
  /**
   * 发送验证码
   * 开发模式下验证码固定为 "123456"，生产环境需要集成真实短信服务
   */
  sendCode: publicProcedure.input(
    z7.object({
      phoneNumber: z7.string().length(11, "\u624B\u673A\u53F7\u5FC5\u987B\u662F11\u4F4D"),
      type: z7.enum(["login", "register"]).default("login")
    })
  ).mutation(async ({ input }) => {
    const { phoneNumber, type } = input;
    if (!isValidPhoneNumber(phoneNumber)) {
      throw new Error("\u624B\u673A\u53F7\u683C\u5F0F\u4E0D\u6B63\u786E");
    }
    const oneMinuteAgo = new Date(Date.now() - 60 * 1e3);
    const db = await getDb();
    if (!db) {
      throw new Error("\u6570\u636E\u5E93\u4E0D\u53EF\u7528");
    }
    const recentCodes = await db.select().from(smsVerificationCodes).where(
      and(
        eq2(smsVerificationCodes.phoneNumber, phoneNumber),
        gt(smsVerificationCodes.createdAt, oneMinuteAgo)
      )
    ).limit(1);
    const recentCode = recentCodes[0];
    if (recentCode) {
      throw new Error("\u9A8C\u8BC1\u7801\u53D1\u9001\u8FC7\u4E8E\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5");
    }
    const code = process.env.NODE_ENV === "production" ? generateVerificationCode() : "123456";
    const expiresAt = new Date(Date.now() + 5 * 60 * 1e3);
    await db.insert(smsVerificationCodes).values({
      phoneNumber,
      code,
      type,
      used: 0,
      expiresAt
    });
    if (process.env.NODE_ENV !== "production") {
      console.log(`[SMS] \u624B\u673A\u53F7 ${phoneNumber} \u7684\u9A8C\u8BC1\u7801\u662F: ${code}`);
    }
    return {
      success: true,
      message: "\u9A8C\u8BC1\u7801\u5DF2\u53D1\u9001",
      // 开发模式下返回验证码，方便测试
      ...process.env.NODE_ENV !== "production" && { code }
    };
  }),
  /**
   * 验证验证码并登录/注册
   */
  verifyAndLogin: publicProcedure.input(
    z7.object({
      phoneNumber: z7.string().length(11, "\u624B\u673A\u53F7\u5FC5\u987B\u662F11\u4F4D"),
      code: z7.string().length(6, "\u9A8C\u8BC1\u7801\u5FC5\u987B\u662F6\u4F4D")
    })
  ).mutation(async ({ input, ctx }) => {
    const { phoneNumber, code } = input;
    if (!isValidPhoneNumber(phoneNumber)) {
      throw new Error("\u624B\u673A\u53F7\u683C\u5F0F\u4E0D\u6B63\u786E");
    }
    const db = await getDb();
    if (!db) {
      throw new Error("\u6570\u636E\u5E93\u4E0D\u53EF\u7528");
    }
    const verificationCodes = await db.select().from(smsVerificationCodes).where(
      and(
        eq2(smsVerificationCodes.phoneNumber, phoneNumber),
        eq2(smsVerificationCodes.code, code),
        eq2(smsVerificationCodes.used, 0),
        gt(smsVerificationCodes.expiresAt, /* @__PURE__ */ new Date())
      )
    ).orderBy(desc(smsVerificationCodes.createdAt)).limit(1);
    const verificationCode = verificationCodes[0];
    if (!verificationCode) {
      throw new Error("\u9A8C\u8BC1\u7801\u9519\u8BEF\u6216\u5DF2\u8FC7\u671F");
    }
    await db.update(smsVerificationCodes).set({ used: 1 }).where(eq2(smsVerificationCodes.id, verificationCode.id));
    const existingUsers = await db.select().from(users).where(eq2(users.phoneNumber, phoneNumber)).limit(1);
    let user = existingUsers[0];
    if (!user) {
      const [newUser] = await db.insert(users).values({
        openId: `phone_${phoneNumber}`,
        // 使用手机号作为openId
        phoneNumber,
        name: `\u7528\u6237${phoneNumber.slice(-4)}`,
        // 默认昵称：用户+后4位
        loginMethod: "phone_sms",
        role: "user"
      });
      const newUsers = await db.select().from(users).where(eq2(users.id, newUser.insertId)).limit(1);
      user = newUsers[0];
    } else {
      await db.update(users).set({ lastSignedIn: /* @__PURE__ */ new Date() }).where(eq2(users.id, user.id));
    }
    if (!user) {
      throw new Error("\u7528\u6237\u521B\u5EFA\u5931\u8D25");
    }
    return {
      success: true,
      message: "\u767B\u5F55\u6210\u529F",
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        role: user.role
      }
    };
  })
});

// server/routers/polish.ts
import { z as z8 } from "zod";

// services/native-polish-service.ts
async function generateNativePolish(originalSentence, correctedSentence, gradeLevel) {
  const prompt = `\u4F60\u662F\u4E00\u4F4D\u82F1\u8BED\u6BCD\u8BED\u7EA7\u8868\u8FBE\u4E13\u5BB6\u548C\u8003\u8BD5\u8F85\u5BFC\u4E13\u5BB6\uFF0C\u5E2E\u52A9\u4E2D\u56FD\u5B66\u751F\u5C06\u6B63\u786E\u4F46\u4E0D\u591F\u5730\u9053\u7684\u82F1\u8BED\u53E5\u5B50\u63D0\u5347\u5230\u6BCD\u8BED\u6C34\u5E73\uFF0C\u5E76\u63D0\u4F9B\u9488\u5BF9\u4E0D\u540C\u8003\u8BD5\u7684\u4E13\u4E1A\u5EFA\u8BAE\u3002

**\u539F\u59CB\u53E5\u5B50**\uFF1A${originalSentence}
**\u8BED\u6CD5\u6539\u6B63\u540E**\uFF1A${correctedSentence}
**\u5B66\u751F\u5E74\u7EA7**\uFF1A${gradeLevel}\u5E74\u7EA7

\u8BF7\u63D0\u4F9B\uFF1A
1. **\u5730\u9053\u8868\u8FBE\u7248\u672C**\uFF1A\u5C06\u53E5\u5B50\u6539\u5199\u4E3A\u6BCD\u8BED\u8005\u4F1A\u4F7F\u7528\u7684\u81EA\u7136\u8868\u8FBE
2. **\u6539\u8FDB\u70B9\u8BF4\u660E**\uFF1A\u5217\u51FA3-5\u4E2A\u5177\u4F53\u6539\u8FDB\uFF08\u8BCD\u6C47\u5347\u7EA7\u3001\u53E5\u5F0F\u4F18\u5316\u3001\u8BED\u6C14\u8C03\u6574\u7B49\uFF09
3. **\u8003\u8BD5\u52A0\u5206\u70B9**\uFF1A\u8BF4\u660E\u8FD9\u4E9B\u6539\u8FDB\u5728\u4E2D\u8003/\u9AD8\u8003\u4F5C\u6587\u4E2D\u7684\u52A0\u5206\u4EF7\u503C
4. **\u5206\u7EA7\u8003\u8BD5\u5EFA\u8BAE**\uFF1A\u9488\u5BF9\u56DB\u516D\u7EA7\u3001\u8003\u7814\u3001\u96C5\u601D\u7B49\u8003\u8BD5\u7684\u4E13\u4E1A\u5EFA\u8BAE

\u8981\u6C42\uFF1A
- \u4FDD\u6301\u539F\u610F\u4E0D\u53D8
- \u4F7F\u7528\u66F4\u5730\u9053\u7684\u8BCD\u6C47\u548C\u53E5\u5F0F
- \u9002\u5408${gradeLevel}\u5E74\u7EA7\u5B66\u751F\u7406\u89E3\u548C\u5B66\u4E60
- \u7A81\u51FA\u8003\u8BD5\u5B9E\u7528\u6027
- \u63D0\u4F9B2\u4E2A\u8003\u7814/\u96C5\u601D\u7EA7\u522B\u7684\u9AD8\u7EA7\u5EFA\u8BAE

\u8BF7\u4EE5JSON\u683C\u5F0F\u8FD4\u56DE\uFF1A
{
  "polishedSentence": "\u5730\u9053\u8868\u8FBE\u7248\u672C",
  "improvements": ["\u6539\u8FDB\u70B91", "\u6539\u8FDB\u70B92", "\u6539\u8FDB\u70B93"],
  "scoringPoints": ["\u52A0\u5206\u70B91", "\u52A0\u5206\u70B92"],
  "level": "intermediate" | "advanced" | "native",
  "examTips": {
    "cet4": "\u56DB\u7EA7\u8003\u8BD5\u5EFA\u8BAE\uFF08\u53EF\u9009\uFF09",
    "cet6": "\u516D\u7EA7\u8003\u8BD5\u5EFA\u8BAE\uFF08\u53EF\u9009\uFF09",
    "ielts": "\u96C5\u601D\u8003\u8BD5\u5EFA\u8BAE\uFF08\u5FC5\u586B\uFF09",
    "kaoyan": "\u8003\u7814\u8003\u8BD5\u5EFA\u8BAE\uFF08\u5FC5\u586B\uFF09"
  }
}`;
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    const content = response.choices[0]?.message.content;
    const text2 = typeof content === "string" ? content : "";
    const result = JSON.parse(text2);
    return result;
  } catch (error) {
    console.error("Failed to generate native polish:", error);
    return {
      polishedSentence: correctedSentence,
      improvements: ["\u5EFA\u8BAE\u4F7F\u7528\u66F4\u5730\u9053\u7684\u8868\u8FBE\u65B9\u5F0F"],
      scoringPoints: ["\u4F7F\u7528\u9AD8\u7EA7\u8BCD\u6C47\u53EF\u4EE5\u63D0\u5347\u4F5C\u6587\u5206\u6570"],
      level: "intermediate",
      examTips: {
        kaoyan: "\u8003\u7814\u5199\u4F5C\u5EFA\u8BAE\u4F7F\u7528\u590D\u6742\u53E5\u5F0F\u548C\u9AD8\u7EA7\u8BCD\u6C47",
        ielts: "\u96C5\u601D\u5199\u4F5C\u6CE8\u610F\u903B\u8F91\u8FDE\u8D2F\u6027\u548C\u8BBA\u8BC1\u5145\u5206\u6027"
      }
    };
  }
}

// server/routers/polish.ts
var polishRouter = router({
  generatePolish: publicProcedure.input(
    z8.object({
      originalSentence: z8.string(),
      correctedSentence: z8.string(),
      gradeLevel: z8.number()
    })
  ).mutation(async ({ input }) => {
    const suggestion = await generateNativePolish(
      input.originalSentence,
      input.correctedSentence,
      input.gradeLevel
    );
    return suggestion;
  })
});

// server/routers/auth.ts
import { z as z9 } from "zod";
import { TRPCError as TRPCError3 } from "@trpc/server";

// server/services/apple-auth-service.ts
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
var APPLE_JWKS_URI = "https://appleid.apple.com/auth/keys";
var client = jwksClient({
  jwksUri: APPLE_JWKS_URI,
  cache: true,
  cacheMaxAge: 864e5
  // 24 hours
});
function getAppleSigningKey(kid) {
  return new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err, key) => {
      if (err) {
        reject(err);
      } else {
        const signingKey = key?.getPublicKey();
        if (signingKey) {
          resolve(signingKey);
        } else {
          reject(new Error("Failed to get public key"));
        }
      }
    });
  });
}
async function verifyAppleToken(token) {
  try {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded === "string") {
      throw new Error("Invalid token format");
    }
    const { kid } = decoded.header;
    if (!kid) {
      throw new Error("Token missing 'kid' in header");
    }
    const publicKey = await getAppleSigningKey(kid);
    const payload = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      issuer: "https://appleid.apple.com"
      // Note: In production, you should verify 'aud' matches your app's bundle ID
      // audience: process.env.APPLE_BUNDLE_ID,
    });
    if (!payload.sub) {
      throw new Error("Token missing 'sub' (user ID)");
    }
    return payload;
  } catch (error) {
    console.error("[Apple Auth] Token verification failed:", error);
    throw new Error(
      `Apple token verification failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// server/routers/auth.ts
init_db();
var authRouter = router({
  /**
   * Apple Sign In - Verify identity token and create/update user
   */
  appleSignIn: publicProcedure.input(
    z9.object({
      identityToken: z9.string(),
      user: z9.object({
        email: z9.string().email().optional(),
        name: z9.object({
          firstName: z9.string().optional(),
          lastName: z9.string().optional()
        }).optional()
      }).optional()
    })
  ).mutation(async ({ input }) => {
    try {
      const payload = await verifyAppleToken(input.identityToken);
      const appleUserId = payload.sub;
      const email = payload.email || input.user?.email;
      let name = null;
      if (input.user?.name) {
        const { firstName, lastName } = input.user.name;
        name = [firstName, lastName].filter(Boolean).join(" ") || null;
      }
      const lastSignedIn = /* @__PURE__ */ new Date();
      await upsertUser({
        openId: `apple_${appleUserId}`,
        // Prefix to distinguish from other login methods
        name: name || null,
        email: email || null,
        loginMethod: "apple",
        lastSignedIn
      });
      const user = await getUserByOpenId(`apple_${appleUserId}`);
      if (!user) {
        throw new TRPCError3({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user"
        });
      }
      return {
        success: true,
        user: {
          id: user.id,
          openId: user.openId,
          name: user.name,
          email: user.email,
          loginMethod: user.loginMethod,
          lastSignedIn: user.lastSignedIn?.toISOString()
        }
      };
    } catch (error) {
      console.error("[Apple Sign In] Error:", error);
      throw new TRPCError3({
        code: "UNAUTHORIZED",
        message: error instanceof Error ? error.message : "Apple Sign In failed"
      });
    }
  }),
  /**
   * Get current authenticated user
   */
  me: publicProcedure.query(async ({ ctx }) => {
    return { user: null };
  })
});

// server/routers/exercise.ts
import { z as z10 } from "zod";
var exerciseRouter = router({
  generateTargetedExercise: publicProcedure.input(
    z10.object({
      wrongQuestionId: z10.string(),
      grammarPoint: z10.string(),
      category: z10.string(),
      userAnswer: z10.string(),
      correctAnswer: z10.string(),
      explanation: z10.string(),
      gradeLevel: z10.number().min(7).max(12).default(9)
    })
  ).mutation(async ({ input }) => {
    try {
      const { grammarPoint, category, userAnswer, correctAnswer, explanation, gradeLevel } = input;
      const prompt = `\u4F60\u662F\u4E00\u4F4D\u4E13\u4E1A\u7684\u82F1\u8BED\u8001\u5E08,\u9700\u8981\u6839\u636E\u5B66\u751F\u7684\u9519\u9898\u751F\u62103\u9053\u9488\u5BF9\u6027\u7EC3\u4E60\u9898\u3002

\u5B66\u751F\u7684\u9519\u9898\u4FE1\u606F:
- \u8BED\u6CD5\u70B9: ${grammarPoint}
- \u9519\u8BEF\u7C7B\u578B: ${category}
- \u5B66\u751F\u7684\u9519\u8BEF\u7B54\u6848: ${userAnswer}
- \u6B63\u786E\u7B54\u6848: ${correctAnswer}
- \u9519\u8BEF\u539F\u56E0: ${explanation}
- \u5E74\u7EA7: ${gradeLevel}\u5E74\u7EA7

\u8BF7\u751F\u62103\u9053\u65B0\u9898\u76EE,\u8981\u6C42:
1. \u8003\u67E5\u76F8\u540C\u7684\u8BED\u6CD5\u70B9\u548C\u77E5\u8BC6\u70B9
2. \u4F7F\u7528\u4E0D\u540C\u7684\u751F\u6D3B\u573A\u666F(\u5982:\u6821\u56ED\u751F\u6D3B\u3001\u5BB6\u5EAD\u65E5\u5E38\u3001\u670B\u53CB\u805A\u4F1A\u7B49)
3. \u96BE\u5EA6\u9002\u5408${gradeLevel}\u5E74\u7EA7\u5B66\u751F
4. \u6BCF\u9053\u9898\u5305\u542B:
   - question: \u9898\u76EE(\u586B\u7A7A\u9898\u6216\u9009\u62E9\u9898)
   - options: 4\u4E2A\u9009\u9879(\u5982\u679C\u662F\u9009\u62E9\u9898)
   - correctAnswer: \u6B63\u786E\u7B54\u6848
   - explanation: \u7B80\u77ED\u7684\u89E3\u6790(50\u5B57\u4EE5\u5185)
   - scenario: \u573A\u666F\u63CF\u8FF0(\u5982"\u6821\u56ED\u751F\u6D3B")

\u8FD4\u56DEJSON\u683C\u5F0F:
{
  "exercises": [
    {
      "question": "Yesterday, I ____ to the library with my classmates.",
      "options": ["go", "went", "going", "goes"],
      "correctAnswer": "went",
      "explanation": "yesterday\u8868\u793A\u8FC7\u53BB,\u8981\u7528\u8FC7\u53BB\u5F0Fwent",
      "scenario": "\u6821\u56ED\u751F\u6D3B"
    }
  ]
}`;
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "\u4F60\u662F\u4E00\u4F4D\u4E13\u4E1A\u7684\u82F1\u8BED\u6559\u5E08,\u64C5\u957F\u6839\u636E\u5B66\u751F\u7684\u9519\u9898\u751F\u6210\u9488\u5BF9\u6027\u7EC3\u4E60\u3002"
          },
          { role: "user", content: prompt }
        ],
        maxTokens: 1e3
      });
      const content = response.choices[0]?.message?.content;
      let result;
      if (typeof content === "string") {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("\u65E0\u6CD5\u89E3\u6790AI\u8FD4\u56DE\u7684\u5185\u5BB9");
        }
      } else if (content?.[0]?.type === "text") {
        const jsonMatch = content[0].text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("\u65E0\u6CD5\u89E3\u6790AI\u8FD4\u56DE\u7684\u5185\u5BB9");
        }
      } else {
        throw new Error("AI\u8FD4\u56DE\u683C\u5F0F\u9519\u8BEF");
      }
      return {
        success: true,
        exercises: result.exercises || []
      };
    } catch (error) {
      console.error("Generate targeted exercise error:", error);
      return {
        success: false,
        exercises: [],
        error: "\u751F\u6210\u7EC3\u4E60\u9898\u5931\u8D25,\u8BF7\u7A0D\u540E\u91CD\u8BD5"
      };
    }
  }),
  /**
   * 批量生成专项突破练习
   * 针对某个错误分类生成一套完整的练习题
   */
  generateCategoryExercises: publicProcedure.input(
    z10.object({
      category: z10.string(),
      grammarPoints: z10.array(z10.string()),
      count: z10.number().min(5).max(20).default(10),
      gradeLevel: z10.number().min(7).max(12).default(9)
    })
  ).mutation(async ({ input }) => {
    try {
      const { category, grammarPoints, count, gradeLevel } = input;
      const prompt = `\u4F60\u662F\u4E00\u4F4D\u4E13\u4E1A\u7684\u82F1\u8BED\u8001\u5E08,\u9700\u8981\u751F\u6210\u4E00\u5957\u9488\u5BF9"${category}"\u7684\u4E13\u9879\u7EC3\u4E60\u9898\u3002

\u76F8\u5173\u8BED\u6CD5\u70B9: ${grammarPoints.join(", ")}
\u9898\u76EE\u6570\u91CF: ${count}\u9053
\u5E74\u7EA7: ${gradeLevel}\u5E74\u7EA7

\u8BF7\u751F\u6210${count}\u9053\u9898\u76EE,\u8981\u6C42:
1. \u5168\u90E8\u56F4\u7ED5"${category}"\u8FD9\u4E2A\u9519\u8BEF\u7C7B\u578B
2. \u6DB5\u76D6\u591A\u4E2A\u751F\u6D3B\u573A\u666F(\u6821\u56ED\u3001\u5BB6\u5EAD\u3001\u65C5\u6E38\u3001\u8D2D\u7269\u7B49)
3. \u96BE\u5EA6\u9012\u8FDB,\u4ECE\u7B80\u5355\u5230\u590D\u6742
4. \u6BCF\u9053\u9898\u5305\u542B:
   - question: \u9898\u76EE
   - options: 4\u4E2A\u9009\u9879
   - correctAnswer: \u6B63\u786E\u7B54\u6848
   - explanation: \u89E3\u6790(80\u5B57\u4EE5\u5185)
   - difficulty: \u96BE\u5EA6(easy/medium/hard)

\u8FD4\u56DEJSON\u683C\u5F0F:
{
  "title": "\u4E13\u9879\u7EC3\u4E60:${category}",
  "exercises": [...]
}`;
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "\u4F60\u662F\u4E00\u4F4D\u4E13\u4E1A\u7684\u82F1\u8BED\u6559\u5E08,\u64C5\u957F\u8BBE\u8BA1\u7CFB\u7EDF\u7684\u4E13\u9879\u7EC3\u4E60\u3002"
          },
          { role: "user", content: prompt }
        ],
        maxTokens: 2e3
      });
      const content = response.choices[0]?.message?.content;
      let result;
      if (typeof content === "string") {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("\u65E0\u6CD5\u89E3\u6790AI\u8FD4\u56DE\u7684\u5185\u5BB9");
        }
      } else if (content?.[0]?.type === "text") {
        const jsonMatch = content[0].text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("\u65E0\u6CD5\u89E3\u6790AI\u8FD4\u56DE\u7684\u5185\u5BB9");
        }
      } else {
        throw new Error("AI\u8FD4\u56DE\u683C\u5F0F\u9519\u8BEF");
      }
      return {
        success: true,
        title: result.title || `\u4E13\u9879\u7EC3\u4E60:${category}`,
        exercises: result.exercises || []
      };
    } catch (error) {
      console.error("Generate category exercises error:", error);
      return {
        success: false,
        title: "",
        exercises: [],
        error: "\u751F\u6210\u7EC3\u4E60\u9898\u5931\u8D25,\u8BF7\u7A0D\u540E\u91CD\u8BD5"
      };
    }
  })
});

// server/routers.ts
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    }),
    // Apple Sign In
    ...authRouter._def.procedures
  }),
  // Grammar checking router
  grammar: grammarRouter,
  // Practice exercises router
  practice: practiceRouter,
  // Dictionary and vocabulary router
  dictionary: dictionaryRouter,
  // Textbook vocabulary router
  textbook: textbookRouter,
  // OCR text recognition router
  ocr: ocrRouter,
  // SMS verification code router
  sms: smsRouter,
  // Native polish router
  polish: polishRouter,
  // AI targeted exercise router
  exercise: exerciseRouter
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  const path = await import("path");
  const fs = await import("fs");
  const webBuildPath = path.join(process.cwd(), "web-build");
  console.log("[debug] Current working directory:", process.cwd());
  console.log("[debug] Web build path:", webBuildPath);
  console.log("[debug] Web build exists:", fs.existsSync(webBuildPath));
  if (fs.existsSync(webBuildPath)) {
    const files = fs.readdirSync(webBuildPath);
    console.log("[debug] Files in web-build:", files.slice(0, 10));
  }
  app.use(express.static(webBuildPath));
  registerOAuthRoutes(app);
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });
  app.get("/api/debug/filesystem", (_req, res) => {
    const cwd = process.cwd();
    const webBuildPath2 = path.join(cwd, "web-build");
    const webBuildExists = fs.existsSync(webBuildPath2);
    let files = [];
    if (webBuildExists) {
      files = fs.readdirSync(webBuildPath2);
    }
    res.json({
      cwd,
      webBuildPath: webBuildPath2,
      webBuildExists,
      filesCount: files.length,
      files: files.slice(0, 20),
      indexHtmlExists: fs.existsSync(path.join(webBuildPath2, "index.html"))
    });
  });
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(process.cwd(), "web-build", "index.html"));
    }
  });
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
  });
}
startServer().catch(console.error);
