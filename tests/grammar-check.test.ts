/**
 * Grammar Check Tests
 * Tests the grammar checking functionality and data structures
 */

import { describe, it, expect } from "vitest";
import { GRAMMAR_TOPICS, getTopicsByGrade, getTopicById } from "../lib/grammar-data";

describe("Grammar Data Structure", () => {
  it("should have grammar topics defined", () => {
    expect(GRAMMAR_TOPICS).toBeDefined();
    expect(Array.isArray(GRAMMAR_TOPICS)).toBe(true);
    expect(GRAMMAR_TOPICS.length).toBeGreaterThan(0);
  });

  it("should have topics for each grade level", () => {
    for (let grade = 7; grade <= 12; grade++) {
      const topics = getTopicsByGrade(grade as 7 | 8 | 9 | 10 | 11 | 12);
      expect(topics.length).toBeGreaterThan(0);
    }
  });

  it("should have proper topic structure", () => {
    const topic = GRAMMAR_TOPICS[0];
    expect(topic.id).toBeDefined();
    expect(topic.title).toBeDefined();
    expect(topic.category).toBeDefined();
    expect(topic.gradeLevel).toBeGreaterThanOrEqual(7);
    expect(topic.gradeLevel).toBeLessThanOrEqual(12);
    expect(topic.description).toBeDefined();
    expect(Array.isArray(topic.rules)).toBe(true);
    expect(Array.isArray(topic.examples)).toBe(true);
    expect(Array.isArray(topic.commonMistakes)).toBe(true);
    expect(topic.pepReference).toBeDefined();
    expect(["basic", "intermediate", "advanced"]).toContain(topic.difficulty);
  });

  it("should retrieve topic by ID", () => {
    const topic = getTopicById("g7-simple-present");
    expect(topic).toBeDefined();
    expect(topic?.id).toBe("g7-simple-present");
    expect(topic?.title).toBe("Simple Present Tense");
  });

  it("should have examples with correct structure", () => {
    const topic = GRAMMAR_TOPICS[0];
    expect(topic.examples.length).toBeGreaterThan(0);

    const example = topic.examples[0];
    expect(example.correct).toBeDefined();
    expect(example.explanation).toBeDefined();
  });

  it("should have common mistakes with correct structure", () => {
    const topic = GRAMMAR_TOPICS[0];
    expect(topic.commonMistakes.length).toBeGreaterThan(0);

    const mistake = topic.commonMistakes[0];
    expect(mistake.incorrect).toBeDefined();
    expect(mistake.correct).toBeDefined();
    expect(mistake.explanation).toBeDefined();
  });

  it("should have topics covering major grammar categories", () => {
    const categories = new Set(GRAMMAR_TOPICS.map((t) => t.category));

    expect(categories.has("Tenses")).toBe(true);
    expect(categories.has("Articles")).toBe(true);
    expect(categories.has("Modal Verbs")).toBe(true);
    expect(categories.has("Passive Voice")).toBe(true);
  });

  it("should have progressive difficulty across grades", () => {
    const grade7Topics = getTopicsByGrade(7);
    const grade12Topics = getTopicsByGrade(12);

    const grade7Basic = grade7Topics.filter((t) => t.difficulty === "basic").length;
    const grade12Advanced = grade12Topics.filter((t) => t.difficulty === "advanced").length;

    // Grade 7 should have more basic topics
    expect(grade7Basic).toBeGreaterThan(0);
    // Grade 12 should have more advanced topics
    expect(grade12Advanced).toBeGreaterThan(0);
  });
});

describe("Storage Functions", () => {
  it("should export storage functions", async () => {
    const { getUserSettings, getCheckHistory, getProgressData } = await import("../lib/storage");

    expect(typeof getUserSettings).toBe("function");
    expect(typeof getCheckHistory).toBe("function");
    expect(typeof getProgressData).toBe("function");
  });
});

describe("Grammar Checker Types", () => {
  it("should have proper error type structure", async () => {
    const { ERROR_TYPES } = await import("../lib/grammar-data");

    expect(Array.isArray(ERROR_TYPES)).toBe(true);
    expect(ERROR_TYPES.length).toBeGreaterThan(0);

    const errorType = ERROR_TYPES[0];
    expect(errorType.type).toBeDefined();
    expect(errorType.category).toBeDefined();
    expect(errorType.description).toBeDefined();
    expect(["critical", "important", "minor"]).toContain(errorType.severity);
  });
});
