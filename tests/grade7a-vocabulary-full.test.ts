import { describe, it, expect } from 'vitest';
import { getFullVocabularyForUnit, getVocabularyStats } from '@/lib/grade7a-vocabulary-full';

describe('Grade 7A Complete Vocabulary Data', () => {
  it('should have vocabulary for all 7 units', () => {
    for (let unit = 1; unit <= 7; unit++) {
      const words = getFullVocabularyForUnit(unit);
      expect(words.length).toBeGreaterThan(0);
    }
  });

  it('should have correct word counts for each unit', () => {
    const stats = getVocabularyStats();
    
    expect(stats.unit1).toBe(27); // Unit 1: You and Me
    expect(stats.unit2).toBe(28); // Unit 2: We're Family
    expect(stats.unit3).toBe(39); // Unit 3: My School
    expect(stats.unit4).toBe(32); // Unit 4: My Favourite Subject
    expect(stats.unit5).toBe(33); // Unit 5: Fun Clubs
    expect(stats.unit6).toBe(34); // Unit 6: A Day in the Life
    expect(stats.unit7).toBe(28); // Unit 7: Happy Birthday
    expect(stats.total).toBe(221); // Total words
  });

  it('should have all required fields for each word', () => {
    for (let unit = 1; unit <= 7; unit++) {
      const words = getFullVocabularyForUnit(unit);
      
      words.forEach((word) => {
        expect(word.id).toBeTruthy();
        expect(word.word).toBeTruthy();
        expect(word.grade).toBe(7);
        expect(word.book).toBe('7A');
        expect(word.unit).toBe(unit);
        expect(word.definitions).toBeInstanceOf(Array);
        expect(word.definitions.length).toBeGreaterThan(0);
        expect(word.examples).toBeInstanceOf(Array);
        expect(word.examples.length).toBeGreaterThanOrEqual(2);
        expect(['basic', 'intermediate', 'advanced']).toContain(word.difficulty);
        expect(['high', 'medium', 'low']).toContain(word.frequency);
      });
    }
  });

  it('should have phonetic notation for single words (not phrases)', () => {
    for (let unit = 1; unit <= 7; unit++) {
      const words = getFullVocabularyForUnit(unit);
      
      words.forEach((word) => {
        // Phrases may not have phonetic notation
        if (!word.word.includes(' ')) {
          // Single words should have phonetic (except for abbreviations)
          if (!word.word.match(/^[A-Z]+$/)) {
            expect(word.phonetic).toBeTruthy();
          }
        }
      });
    }
  });

  it('should have Chinese meanings for all words', () => {
    for (let unit = 1; unit <= 7; unit++) {
      const words = getFullVocabularyForUnit(unit);
      
      words.forEach((word) => {
        expect(word.definitions[0].meaning).toBeTruthy();
        expect(word.definitions[0].meaning).toMatch(/[\u4e00-\u9fa5]/); // Contains Chinese characters
      });
    }
  });

  it('should have example sentences in English', () => {
    for (let unit = 1; unit <= 7; unit++) {
      const words = getFullVocabularyForUnit(unit);
      
      words.forEach((word) => {
        expect(word.examples.length).toBeGreaterThanOrEqual(2);
        word.examples.forEach((example) => {
          expect(example).toBeTruthy();
          expect(example.length).toBeGreaterThan(5); // Reasonable sentence length
        });
      });
    }
  });

  it('should return empty array for invalid unit number', () => {
    expect(getFullVocabularyForUnit(0)).toEqual([]);
    expect(getFullVocabularyForUnit(8)).toEqual([]);
    expect(getFullVocabularyForUnit(100)).toEqual([]);
  });
});
