import type { TextbookWord } from "./textbook-vocabulary";

export type QuizQuestionType = "multiple_choice" | "fill_blank" | "matching";

export interface MultipleChoiceQuestion {
  type: "multiple_choice";
  id: string;
  word: TextbookWord;
  question: string; // 中文释义
  options: string[]; // 4个英文单词选项
  correctAnswer: string;
  explanation?: string;
}

export interface FillBlankQuestion {
  type: "fill_blank";
  id: string;
  word: TextbookWord;
  sentence: string; // 例句，用___代替目标单词
  hint: string; // 首字母提示
  correctAnswer: string;
  explanation?: string;
}

export interface MatchingQuestion {
  type: "matching";
  id: string;
  pairs: Array<{
    word: string;
    meaning: string;
    wordId: string;
  }>;
  userMatches?: Record<string, string>; // word -> meaning
}

export type QuizQuestion = MultipleChoiceQuestion | FillBlankQuestion | MatchingQuestion;

export interface VocabularyQuiz {
  id: string;
  grade: number;
  book: string;
  unit: number;
  questions: QuizQuestion[];
  totalQuestions: number;
  createdAt: Date;
}

export interface QuizResult {
  quizId: string;
  grade: number;
  book: string;
  unit: number;
  score: number; // 0-100
  correctCount: number;
  totalCount: number;
  answers: Record<string, string>; // questionId -> userAnswer
  wrongWords: TextbookWord[]; // 答错的单词
  completedAt: Date;
  timeSpent: number; // 秒
}

/**
 * 生成选择题：给出中文释义，选择正确的英文单词
 */
export function generateMultipleChoiceQuestion(
  targetWord: TextbookWord,
  allWords: TextbookWord[]
): MultipleChoiceQuestion {
  const meaning = targetWord.definitions[0].meaning;
  
  // 随机选择3个干扰项
  const distractors = allWords
    .filter(w => w.id !== targetWord.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(w => w.word);
  
  // 组合选项并打乱
  const options = [targetWord.word, ...distractors].sort(() => Math.random() - 0.5);
  
  return {
    type: "multiple_choice",
    id: `mc_${targetWord.id}_${Date.now()}`,
    word: targetWord,
    question: `"${meaning}" 的英文单词是？`,
    options,
    correctAnswer: targetWord.word,
    explanation: `正确答案是 "${targetWord.word}"，意思是"${meaning}"。`,
  };
}

/**
 * 生成填空题：给出例句和首字母提示，填写完整单词
 */
export function generateFillBlankQuestion(targetWord: TextbookWord): FillBlankQuestion {
  // 从例句中选择一个包含目标单词的句子
  const example = targetWord.examples.find(ex => 
    ex.toLowerCase().includes(targetWord.word.toLowerCase())
  ) || targetWord.examples[0];
  
  // 将目标单词替换为空格
  const wordRegex = new RegExp(`\\b${targetWord.word}\\b`, 'gi');
  const sentence = example.replace(wordRegex, '___');
  
  // 首字母提示
  const hint = targetWord.word.charAt(0).toUpperCase();
  
  return {
    type: "fill_blank",
    id: `fb_${targetWord.id}_${Date.now()}`,
    word: targetWord,
    sentence,
    hint: `首字母提示：${hint}`,
    correctAnswer: targetWord.word.toLowerCase(),
    explanation: `正确答案是 "${targetWord.word}"，意思是"${targetWord.definitions[0].meaning}"。`,
  };
}

/**
 * 生成匹配题：将5个英文单词与中文释义配对
 */
export function generateMatchingQuestion(words: TextbookWord[]): MatchingQuestion {
  // 随机选择5个单词
  const selectedWords = words
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(5, words.length));
  
  const pairs = selectedWords.map(word => ({
    word: word.word,
    meaning: word.definitions[0].meaning,
    wordId: word.id,
  }));
  
  return {
    type: "matching",
    id: `match_${Date.now()}`,
    pairs,
  };
}

/**
 * 为单元生成完整的词汇测试
 */
export function generateVocabularyQuiz(
  grade: number,
  book: string,
  unit: number,
  words: TextbookWord[],
  questionCount: number = 10
): VocabularyQuiz {
  if (words.length === 0) {
    throw new Error("No words available for quiz generation");
  }
  
  const questions: QuizQuestion[] = [];
  const selectedWords = words
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(questionCount, words.length));
  
  // 生成不同类型的题目
  selectedWords.forEach((word, index) => {
    if (index % 3 === 0) {
      // 每3题中有1题是填空题
      questions.push(generateFillBlankQuestion(word));
    } else {
      // 其他是选择题
      questions.push(generateMultipleChoiceQuestion(word, words));
    }
  });
  
  // 如果题目足够多且未超过限制，添加一道匹配题
  if (words.length >= 5 && questions.length >= 8 && questions.length < questionCount) {
    questions.push(generateMatchingQuestion(words));
  }
  
  return {
    id: `quiz_${grade}_${book}_${unit}_${Date.now()}`,
    grade,
    book,
    unit,
    questions,
    totalQuestions: questions.length,
    createdAt: new Date(),
  };
}

/**
 * 计算测试成绩
 */
export function calculateQuizScore(
  quiz: VocabularyQuiz,
  answers: Record<string, string>
): QuizResult {
  let correctCount = 0;
  const wrongWords: TextbookWord[] = [];
  
  quiz.questions.forEach(question => {
    const userAnswer = answers[question.id]?.toLowerCase().trim();
    
    if (question.type === "multiple_choice" || question.type === "fill_blank") {
      const correctAnswer = question.correctAnswer.toLowerCase().trim();
      if (userAnswer === correctAnswer) {
        correctCount++;
      } else {
        wrongWords.push(question.word);
      }
    } else if (question.type === "matching") {
      // 匹配题：检查所有配对是否正确
      const userMatches = question.userMatches || {};
      let allCorrect = true;
      
      question.pairs.forEach(pair => {
        if (userMatches[pair.word] !== pair.meaning) {
          allCorrect = false;
        }
      });
      
      if (allCorrect) {
        correctCount++;
      } else {
        // 匹配题错误时，将所有涉及的单词标记为错误
        question.pairs.forEach(pair => {
          const word = quiz.questions.find(q => 
            q.type !== "matching" && q.word.word === pair.word
          );
          if (word && word.type !== "matching") {
            wrongWords.push(word.word);
          }
        });
      }
    }
  });
  
  const score = Math.round((correctCount / quiz.totalQuestions) * 100);
  
  return {
    quizId: quiz.id,
    grade: quiz.grade,
    book: quiz.book,
    unit: quiz.unit,
    score,
    correctCount,
    totalCount: quiz.totalQuestions,
    answers,
    wrongWords,
    completedAt: new Date(),
    timeSpent: 0, // 需要在UI层计算
  };
}

/**
 * 获取成绩评价
 */
export function getScoreRating(score: number): { rating: string; message: string; emoji: string } {
  if (score >= 90) {
    return {
      rating: "优秀",
      message: "太棒了！你已经完全掌握了这些单词！",
      emoji: "🎉",
    };
  } else if (score >= 80) {
    return {
      rating: "良好",
      message: "做得很好！继续努力，你会更棒的！",
      emoji: "👍",
    };
  } else if (score >= 70) {
    return {
      rating: "及格",
      message: "不错！再多复习一下错题就更好了。",
      emoji: "💪",
    };
  } else if (score >= 60) {
    return {
      rating: "需要努力",
      message: "继续加油！建议重点复习错题。",
      emoji: "📚",
    };
  } else {
    return {
      rating: "需要加强",
      message: "不要灰心！多花时间学习这些单词，你一定能进步的！",
      emoji: "💡",
    };
  }
}
