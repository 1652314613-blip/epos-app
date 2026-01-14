import { describe, it, expect } from 'vitest';
import { GRADE_7A_UNITS, getGrade7AUnit } from '@/lib/textbook-grade7a-data';

describe('七年级上册教材数据', () => {
  it('应该包含全部7个单元', () => {
    expect(GRADE_7A_UNITS).toHaveLength(7);
  });

  it('每个单元应该有正确的基本信息', () => {
    GRADE_7A_UNITS.forEach((unit, index) => {
      expect(unit.grade).toBe(7);
      expect(unit.book).toBe('7A');
      expect(unit.unit).toBe(index + 1);
      expect(unit.title).toBeTruthy();
      expect(unit.theme).toBeTruthy();
      expect(unit.words).toBeDefined();
      expect(unit.grammar).toBeDefined();
    });
  });

  it('Unit 1应该是"You and Me"', () => {
    const unit1 = getGrade7AUnit(1);
    expect(unit1).toBeDefined();
    expect(unit1?.title).toBe('You and Me');
    expect(unit1?.theme).toBe('问候与自我介绍');
  });

  it('Unit 1应该包含be动词语法点', () => {
    const unit1 = getGrade7AUnit(1);
    expect(unit1?.grammar?.points).toBeDefined();
    const beVerbGrammar = unit1?.grammar?.points.find(p => p.id === '7a_u1_be_verb');
    expect(beVerbGrammar).toBeDefined();
    expect(beVerbGrammar?.title).toBe('Be动词的基本用法');
    expect(beVerbGrammar?.rules.length).toBeGreaterThan(0);
    expect(beVerbGrammar?.examples.length).toBeGreaterThan(0);
  });

  it('Unit 2应该包含指示代词语法点', () => {
    const unit2 = getGrade7AUnit(2);
    const demonstrativesGrammar = unit2?.grammar?.points.find(p => p.id === '7a_u2_demonstratives');
    expect(demonstrativesGrammar).toBeDefined();
    expect(demonstrativesGrammar?.title).toBe('指示代词（this/that/these/those）');
  });

  it('Unit 3应该包含There be句型语法点', () => {
    const unit3 = getGrade7AUnit(3);
    const thereBeGrammar = unit3?.grammar?.points.find(p => p.id === '7a_u3_there_be');
    expect(thereBeGrammar).toBeDefined();
    expect(thereBeGrammar?.title).toBe('There be 句型');
  });

  it('每个单元的词汇应该有完整的信息', () => {
    GRADE_7A_UNITS.forEach(unit => {
      unit.words.forEach(word => {
        expect(word.id).toBeTruthy();
        expect(word.word).toBeTruthy();
        expect(word.phonetic).toBeTruthy();
        expect(word.definitions).toBeDefined();
        expect(word.definitions.length).toBeGreaterThan(0);
        expect(word.examples).toBeDefined();
        expect(word.examples.length).toBeGreaterThan(0);
        expect(word.difficulty).toBeTruthy();
        expect(word.frequency).toBeTruthy();
      });
    });
  });

  it('每个单元的语法点应该有完整的信息', () => {
    GRADE_7A_UNITS.forEach(unit => {
      expect(unit.grammar).toBeDefined();
      expect(unit.grammar?.points).toBeDefined();
      expect(unit.grammar?.pointCount).toBeGreaterThan(0);
      
      unit.grammar?.points.forEach(grammar => {
        expect(grammar.id).toBeTruthy();
        expect(grammar.title).toBeTruthy();
        expect(grammar.category).toBeTruthy();
        expect(grammar.explanation).toBeTruthy();
        expect(grammar.rules).toBeDefined();
        expect(grammar.rules.length).toBeGreaterThan(0);
        expect(grammar.examples).toBeDefined();
        expect(grammar.examples.length).toBeGreaterThan(0);
        
        // 检查例句格式
        grammar.examples.forEach(example => {
          expect(example.english).toBeTruthy();
          expect(example.chinese).toBeTruthy();
        });
      });
    });
  });

  it('Unit 7应该是"Happy Birthday!"', () => {
    const unit7 = getGrade7AUnit(7);
    expect(unit7).toBeDefined();
    expect(unit7?.title).toBe('Happy Birthday!');
    expect(unit7?.theme).toBe('生日与庆祝');
  });

  it('getGrade7AUnit应该正确返回指定单元', () => {
    for (let i = 1; i <= 7; i++) {
      const unit = getGrade7AUnit(i);
      expect(unit).toBeDefined();
      expect(unit?.unit).toBe(i);
    }
  });

  it('getGrade7AUnit对于无效单元号应该返回undefined', () => {
    expect(getGrade7AUnit(0)).toBeUndefined();
    expect(getGrade7AUnit(8)).toBeUndefined();
    expect(getGrade7AUnit(99)).toBeUndefined();
  });
});
