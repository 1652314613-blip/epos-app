/**
 * Unit Progress Service - Calculate learning progress for textbook units
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const PROGRESS_KEY = "textbook_unit_progress";

export interface UnitProgress {
  grade: number;
  book: string;
  unit: number;
  vocabularyLearned: number; // Number of words learned
  vocabularyTotal: number; // Total words in unit
  grammarLearned: number; // Number of grammar points learned
  grammarTotal: number; // Total grammar points in unit
  quizzesTaken: number; // Number of quizzes completed
  lastStudied: string; // ISO date string
}

export interface UnitProgressMap {
  [key: string]: UnitProgress; // key format: "grade_book_unit" (e.g., "7_7A_1")
}

/**
 * Get progress for a specific unit
 */
export async function getUnitProgress(
  grade: number,
  book: string,
  unit: number
): Promise<UnitProgress | null> {
  try {
    const key = `${grade}_${book}_${unit}`;
    const data = await AsyncStorage.getItem(PROGRESS_KEY);
    if (!data) return null;

    const progressMap: UnitProgressMap = JSON.parse(data);
    return progressMap[key] || null;
  } catch (error) {
    console.error("Failed to get unit progress:", error);
    return null;
  }
}

/**
 * Update progress for a specific unit
 */
export async function updateUnitProgress(progress: UnitProgress): Promise<void> {
  try {
    const key = `${progress.grade}_${progress.book}_${progress.unit}`;
    const data = await AsyncStorage.getItem(PROGRESS_KEY);
    const progressMap: UnitProgressMap = data ? JSON.parse(data) : {};

    progressMap[key] = {
      ...progress,
      lastStudied: new Date().toISOString(),
    };

    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progressMap));
  } catch (error) {
    console.error("Failed to update unit progress:", error);
  }
}

/**
 * Calculate overall completion percentage for a unit
 */
export function calculateUnitCompletion(progress: UnitProgress): number {
  if (!progress) return 0;

  const vocabProgress = progress.vocabularyTotal > 0 
    ? (progress.vocabularyLearned / progress.vocabularyTotal) * 50 
    : 0;

  const grammarProgress = progress.grammarTotal > 0 
    ? (progress.grammarLearned / progress.grammarTotal) * 50 
    : 0;

  return Math.round(vocabProgress + grammarProgress);
}

/**
 * Get all unit progress for display
 */
export async function getAllUnitProgress(): Promise<UnitProgressMap> {
  try {
    const data = await AsyncStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Failed to get all unit progress:", error);
    return {};
  }
}

/**
 * Mark a word as learned
 */
export async function markWordAsLearned(
  grade: number,
  book: string,
  unit: number,
  totalWords: number
): Promise<void> {
  const progress = await getUnitProgress(grade, book, unit);
  
  const updated: UnitProgress = progress || {
    grade,
    book,
    unit,
    vocabularyLearned: 0,
    vocabularyTotal: totalWords,
    grammarLearned: 0,
    grammarTotal: 0,
    quizzesTaken: 0,
    lastStudied: new Date().toISOString(),
  };

  updated.vocabularyLearned = Math.min(updated.vocabularyLearned + 1, totalWords);
  await updateUnitProgress(updated);
}

/**
 * Mark a grammar point as learned
 */
export async function markGrammarAsLearned(
  grade: number,
  book: string,
  unit: number,
  totalGrammar: number
): Promise<void> {
  const progress = await getUnitProgress(grade, book, unit);
  
  const updated: UnitProgress = progress || {
    grade,
    book,
    unit,
    vocabularyLearned: 0,
    vocabularyTotal: 0,
    grammarLearned: 0,
    grammarTotal: totalGrammar,
    quizzesTaken: 0,
    lastStudied: new Date().toISOString(),
  };

  updated.grammarLearned = Math.min(updated.grammarLearned + 1, totalGrammar);
  await updateUnitProgress(updated);
}

/**
 * Record quiz completion
 */
export async function recordQuizCompletion(
  grade: number,
  book: string,
  unit: number
): Promise<void> {
  const progress = await getUnitProgress(grade, book, unit);
  
  if (progress) {
    progress.quizzesTaken += 1;
    await updateUnitProgress(progress);
  }
}
