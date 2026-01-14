/**
 * Grammar Checker Service using OpenAI API
 * Analyzes English sentences and provides detailed error feedback
 */

import { ERROR_TYPES, type GrammarCategory } from "./grammar-data";

export interface GrammarError {
  type: string;
  category: GrammarCategory;
  position: {
    start: number;
    end: number;
  };
  incorrect: string;
  correct: string;
  explanation: string;
  pepReference?: string;
  severity: "critical" | "important" | "minor";
}

export interface GrammarCheckResult {
  original: string;
  corrected: string;
  errors: GrammarError[];
  overallScore: number; // 0-100
  suggestions: string[];
}

/**
 * Check grammar using tRPC API
 */
export async function checkGrammar(
  sentence: string,
  gradeLevel: number = 9
): Promise<GrammarCheckResult> {
  try {
    const response = await fetch("/api/trpc/grammar.check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        json: {
          sentence,
          gradeLevel,
        },
      }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to check grammar: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // tRPC returns { result: { data: { json: {...} } } }
    return data.result.data.json;
  } catch (error) {
    console.error("Grammar check error:", error);
    throw error;
  }
}

/**
 * Get error type information
 */
export function getErrorTypeInfo(errorType: string) {
  return ERROR_TYPES.find((et) => et.type === errorType);
}

/**
 * Calculate overall grammar score based on errors
 */
export function calculateScore(errors: GrammarError[]): number {
  if (errors.length === 0) return 100;

  let deduction = 0;
  errors.forEach((error) => {
    switch (error.severity) {
      case "critical":
        deduction += 15;
        break;
      case "important":
        deduction += 10;
        break;
      case "minor":
        deduction += 5;
        break;
    }
  });

  return Math.max(0, 100 - deduction);
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: GrammarError): string {
  return `${error.explanation}${error.pepReference ? ` (${error.pepReference})` : ""}`;
}
