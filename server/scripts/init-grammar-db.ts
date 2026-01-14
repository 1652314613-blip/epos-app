import { getDb } from '../db';
import { grammarChapters, grammarTopics, grammarExercises } from '../../drizzle/schema';
import { sql } from 'drizzle-orm';
import nounData from './noun-data.json';

/**
 * 初始化语法数据库表和数据
 */
export async function initGrammarDatabase() {
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  console.log('开始初始化语法数据库...');

  // 1. 创建表（如果不存在）
  console.log('创建数据库表...');
  
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

  console.log('数据库表创建完成');

  // 2. 导入第一章名词数据
  console.log('导入第一章名词数据...');
  
  const chapterData = (nounData as any).chapter;
  
  // 插入章节
  const [chapterResult] = await db.insert(grammarChapters).values({
    title: chapterData.title,
    titleEn: 'Nouns',
    order: chapterData.order,
    pageRange: chapterData.pageRange,
    examWeightPercentage: chapterData.examWeight.percentage,
    examWeightBreakdown: JSON.stringify(chapterData.examWeight.breakdown),
    examTags: JSON.stringify(chapterData.examTags),
  });

  const chapterId = (chapterResult as any).insertId;
  console.log(`章节插入成功，ID: ${chapterId}`);

  // 插入知识点
  for (const topic of chapterData.topics) {
    await db.insert(grammarTopics).values({
      chapterId,
      topicId: topic.id,
      title: topic.title,
      titleEn: topic.title,
      grade: '7A',
      unit: 1,
      category: 'noun',
      difficulty: topic.difficulty,
      examTag: topic.examTag,
      description: topic.description,
      rules: JSON.stringify(topic.rules),
      examples: JSON.stringify(topic.examples),
      memoryTips: JSON.stringify(topic.memoryTips || []),
      specialNotes: JSON.stringify(topic.specialNotes || []),
      commonMistakes: JSON.stringify([]),
      relatedTopics: JSON.stringify(topic.relatedTopics || []),
    });
    console.log(`知识点插入成功: ${topic.title}`);
  }

  console.log('语法数据库初始化完成！');
  
  return {
    success: true,
    chapterId,
    topicsCount: chapterData.topics.length,
  };
}
