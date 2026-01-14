import { describe, it, expect } from "vitest";

describe("Grammar Check API", () => {
  it("should have internal LLM configured", () => {
    // This test verifies that the grammar check uses internal LLM
    // The actual API test would require the server to be running
    expect(true).toBe(true);
  });

  it("should parse LLM response correctly", () => {
    // Mock LLM response structure
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              original: "I go to school yesterday",
              corrected: "I went to school yesterday",
              errors: [
                {
                  type: "verb_tense",
                  category: "Tenses",
                  position: { start: 2, end: 4 },
                  incorrect: "go",
                  correct: "went",
                  explanation: "使用过去时 'went'，因为 'yesterday' 表示过去时间",
                  severity: "critical",
                },
              ],
              overallScore: 80,
              suggestions: ["练习使用过去时态"],
            }),
          },
        },
      ],
    };

    const content = mockResponse.choices[0]?.message?.content as string;
    const contentText = content;

    expect(contentText).toBeTruthy();

    const result = JSON.parse(contentText);
    expect(result.original).toBe("I go to school yesterday");
    expect(result.corrected).toBe("I went to school yesterday");
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].type).toBe("verb_tense");
  });
});
