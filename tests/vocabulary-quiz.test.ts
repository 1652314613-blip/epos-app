import { describe, it, expect } from 'vitest';
import {
  generateMultipleChoiceQuestion,
  generateFillBlankQuestion,
  generateMatchingQuestion,
  generateVocabularyQuiz,
  calculateQuizScore,
  getScoreRating,
} from '@/lib/vocabulary-quiz';
import { getFullVocabularyForUnit } from '@/lib/grade7a-vocabulary-full';

describe('Vocabulary Quiz', () => {
  const unit1Words = getFullVocabularyForUnit(1);

  describe('generateMultipleChoiceQuestion', () => {
    it('should generate a valid multiple choice question', () => {
      const question = generateMultipleChoiceQuestion(unit1Words[0], unit1Words);
      
      expect(question.type).toBe('multiple_choice');
      expect(question.word).toBe(unit1Words[0]);
      expect(question.options).toHaveLength(4);
      expect(question.options).toContain(unit1Words[0].word);
      expect(question.correctAnswer).toBe(unit1Words[0].word);
      expect(question.question).toContain(unit1Words[0].definitions[0].meaning);
    });

    it('should have unique options', () => {
      const question = generateMultipleChoiceQuestion(unit1Words[0], unit1Words);
      const uniqueOptions = new Set(question.options);
      expect(uniqueOptions.size).toBe(4);
    });
  });

  describe('generateFillBlankQuestion', () => {
    it('should generate a valid fill-in-blank question', () => {
      const question = generateFillBlankQuestion(unit1Words[0]);
      
      expect(question.type).toBe('fill_blank');
      expect(question.word).toBe(unit1Words[0]);
      expect(question.sentence).toContain('___');
      expect(question.hint).toContain(unit1Words[0].word.charAt(0).toUpperCase());
      expect(question.correctAnswer).toBe(unit1Words[0].word.toLowerCase());
    });
  });

  describe('generateMatchingQuestion', () => {
    it('should generate a valid matching question', () => {
      const question = generateMatchingQuestion(unit1Words);
      
      expect(question.type).toBe('matching');
      expect(question.pairs).toHaveLength(Math.min(5, unit1Words.length));
      
      question.pairs.forEach(pair => {
        expect(pair.word).toBeTruthy();
        expect(pair.meaning).toBeTruthy();
        expect(pair.wordId).toBeTruthy();
      });
    });
  });

  describe('generateVocabularyQuiz', () => {
    it('should generate a complete quiz with specified number of questions', () => {
      const quiz = generateVocabularyQuiz(7, '7A', 1, unit1Words, 10);
      
      expect(quiz.grade).toBe(7);
      expect(quiz.book).toBe('7A');
      expect(quiz.unit).toBe(1);
      expect(quiz.questions.length).toBeGreaterThan(0);
      expect(quiz.questions.length).toBeLessThanOrEqual(10);
      expect(quiz.totalQuestions).toBe(quiz.questions.length);
    });

    it('should include different question types', () => {
      const quiz = generateVocabularyQuiz(7, '7A', 1, unit1Words, 10);
      
      const types = new Set(quiz.questions.map(q => q.type));
      expect(types.size).toBeGreaterThan(1); // At least 2 different types
    });

    it('should throw error if no words available', () => {
      expect(() => {
        generateVocabularyQuiz(7, '7A', 1, [], 10);
      }).toThrow();
    });
  });

  describe('calculateQuizScore', () => {
    it('should calculate correct score for all correct answers', () => {
      const quiz = generateVocabularyQuiz(7, '7A', 1, unit1Words, 5);
      const answers: Record<string, string> = {};
      
      quiz.questions.forEach(q => {
        if (q.type === 'multiple_choice' || q.type === 'fill_blank') {
          answers[q.id] = q.correctAnswer;
        }
      });
      
      const result = calculateQuizScore(quiz, answers);
      
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.correctCount).toBeLessThanOrEqual(result.totalCount);
      expect(result.wrongWords).toBeInstanceOf(Array);
    });

    it('should calculate zero score for all wrong answers', () => {
      const quiz = generateVocabularyQuiz(7, '7A', 1, unit1Words, 5);
      const answers: Record<string, string> = {};
      
      quiz.questions.forEach(q => {
        if (q.type === 'multiple_choice' || q.type === 'fill_blank') {
          answers[q.id] = 'wronganswer';
        }
      });
      
      const result = calculateQuizScore(quiz, answers);
      
      expect(result.score).toBe(0);
      expect(result.correctCount).toBe(0);
      expect(result.wrongWords.length).toBeGreaterThan(0);
    });
  });

  describe('getScoreRating', () => {
    it('should return correct rating for excellent score', () => {
      const rating = getScoreRating(95);
      expect(rating.rating).toBe('优秀');
      expect(rating.emoji).toBeTruthy();
    });

    it('should return correct rating for good score', () => {
      const rating = getScoreRating(85);
      expect(rating.rating).toBe('良好');
    });

    it('should return correct rating for passing score', () => {
      const rating = getScoreRating(75);
      expect(rating.rating).toBe('及格');
    });

    it('should return correct rating for low score', () => {
      const rating = getScoreRating(50);
      expect(rating.rating).toContain('需要');
    });
  });
});
