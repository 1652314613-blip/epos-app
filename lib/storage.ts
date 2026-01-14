/**
 * Local storage service using AsyncStorage
 * Manages user progress, settings, and history
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { GradeLevel } from "./grammar-data";
import type { GrammarCheckResult } from "./grammar-checker";

const KEYS = {
  USER_SETTINGS: "@grammar_tutor:user_settings",
  CHECK_HISTORY: "@grammar_tutor:check_history",
  PROGRESS_DATA: "@grammar_tutor:progress_data",
  LEARNED_TOPICS: "@grammar_tutor:learned_topics",
  WRONG_BOOK: "@grammar_tutor:wrong_book",
  COLLECTION_BOOK: "@grammar_tutor:collection_book",
};

// User Settings
export interface UserSettings {
  gradeLevel: GradeLevel;
  notificationsEnabled: boolean;
  dailyGoal: number;
}

const DEFAULT_SETTINGS: UserSettings = {
  gradeLevel: 9,
  notificationsEnabled: true,
  dailyGoal: 5,
};

export async function getUserSettings(): Promise<UserSettings> {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Failed to load user settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveUserSettings(settings: UserSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.USER_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save user settings:", error);
  }
}

// Check History
export interface CheckHistoryItem {
  id: string;
  timestamp: number;
  result: GrammarCheckResult;
}

export async function getCheckHistory(): Promise<CheckHistoryItem[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.CHECK_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load check history:", error);
    return [];
  }
}

export async function addCheckToHistory(result: GrammarCheckResult): Promise<void> {
  try {
    const history = await getCheckHistory();
    const newItem: CheckHistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      result,
    };

    // Keep only last 50 items
    const updatedHistory = [newItem, ...history].slice(0, 50);
    await AsyncStorage.setItem(KEYS.CHECK_HISTORY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to add check to history:", error);
  }
}

export async function clearCheckHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.CHECK_HISTORY);
  } catch (error) {
    console.error("Failed to clear check history:", error);
  }
}

// Progress Data
export interface ProgressData {
  totalChecks: number;
  correctChecks: number;
  currentStreak: number;
  longestStreak: number;
  lastCheckDate: string; // ISO date string
  errorTypeCount: Record<string, number>;
  weeklyActivity: Record<string, number>; // ISO date string -> check count
}

const DEFAULT_PROGRESS: ProgressData = {
  totalChecks: 0,
  correctChecks: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastCheckDate: "",
  errorTypeCount: {},
  weeklyActivity: {},
};

export async function getProgressData(): Promise<ProgressData> {
  try {
    const data = await AsyncStorage.getItem(KEYS.PROGRESS_DATA);
    return data ? JSON.parse(data) : DEFAULT_PROGRESS;
  } catch (error) {
    console.error("Failed to load progress data:", error);
    return DEFAULT_PROGRESS;
  }
}

export async function updateProgressData(result: GrammarCheckResult): Promise<void> {
  try {
    const progress = await getProgressData();
    const today = new Date().toISOString().split("T")[0];

    // Update total checks
    progress.totalChecks += 1;

    // Update correct checks
    if (result.errors.length === 0) {
      progress.correctChecks += 1;
    }

    // Update streak
    if (progress.lastCheckDate === today) {
      // Already checked today, no streak change
    } else {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      if (progress.lastCheckDate === yesterday) {
        // Consecutive day
        progress.currentStreak += 1;
      } else if (progress.lastCheckDate === "") {
        // First check ever
        progress.currentStreak = 1;
      } else {
        // Streak broken
        progress.currentStreak = 1;
      }
    }

    progress.lastCheckDate = today;
    progress.longestStreak = Math.max(progress.longestStreak, progress.currentStreak);

    // Update error type count
    result.errors.forEach((error) => {
      const type = error.type;
      progress.errorTypeCount[type] = (progress.errorTypeCount[type] || 0) + 1;
    });

    // Update weekly activity
    progress.weeklyActivity[today] = (progress.weeklyActivity[today] || 0) + 1;

    // Keep only last 30 days of activity
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
    Object.keys(progress.weeklyActivity).forEach((date) => {
      if (date < thirtyDaysAgo) {
        delete progress.weeklyActivity[date];
      }
    });

    await AsyncStorage.setItem(KEYS.PROGRESS_DATA, JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to update progress data:", error);
  }
}

export async function resetProgressData(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.PROGRESS_DATA, JSON.stringify(DEFAULT_PROGRESS));
  } catch (error) {
    console.error("Failed to reset progress data:", error);
  }
}

// Learned Topics
export async function getLearnedTopics(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.LEARNED_TOPICS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load learned topics:", error);
    return [];
  }
}

export async function markTopicAsLearned(topicId: string): Promise<void> {
  try {
    const learned = await getLearnedTopics();
    if (!learned.includes(topicId)) {
      learned.push(topicId);
      await AsyncStorage.setItem(KEYS.LEARNED_TOPICS, JSON.stringify(learned));
    }
  } catch (error) {
    console.error("Failed to mark topic as learned:", error);
  }
}

export async function unmarkTopicAsLearned(topicId: string): Promise<void> {
  try {
    const learned = await getLearnedTopics();
    const updated = learned.filter((id) => id !== topicId);
    await AsyncStorage.setItem(KEYS.LEARNED_TOPICS, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to unmark topic as learned:", error);
  }
}

// Wrong Book (错题本)
export interface WrongBookItem {
  id: string;
  timestamp: number;
  result: GrammarCheckResult;
  practiceCount: number; // How many times practiced
  lastPracticeDate: string; // ISO date string
  mastered: boolean; // Whether the user has mastered this error
  // Ebbinghaus review schedule fields
  firstLearnedDate: number; // Timestamp when first added to wrong book
  reviewCount: number; // Number of reviews completed (0-4)
  nextReviewDate: number; // Timestamp of next scheduled review
  reviewStatus: "pending" | "due" | "overdue" | "mastered"; // Current review status
}

export async function getWrongBook(): Promise<WrongBookItem[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.WRONG_BOOK);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load wrong book:", error);
    return [];
  }
}

export async function addToWrongBook(result: GrammarCheckResult): Promise<void> {
  try {
    // Only add if there are errors
    if (result.errors.length === 0) return;

    const wrongBook = await getWrongBook();
    const now = Date.now();
    const firstReviewDate = new Date(now);
    firstReviewDate.setDate(firstReviewDate.getDate() + 1); // First review in 1 day
    firstReviewDate.setHours(9, 0, 0, 0); // Set to 9:00 AM
    
    const newItem: WrongBookItem = {
      id: now.toString(),
      timestamp: now,
      result,
      practiceCount: 0,
      lastPracticeDate: "",
      mastered: false,
      // Ebbinghaus review schedule
      firstLearnedDate: now,
      reviewCount: 0,
      nextReviewDate: firstReviewDate.getTime(),
      reviewStatus: "pending",
    };

    // Add to beginning of array
    const updatedWrongBook = [newItem, ...wrongBook];
    await AsyncStorage.setItem(KEYS.WRONG_BOOK, JSON.stringify(updatedWrongBook));
  } catch (error) {
    console.error("Failed to add to wrong book:", error);
  }
}

export async function removeFromWrongBook(id: string): Promise<void> {
  try {
    const wrongBook = await getWrongBook();
    const updated = wrongBook.filter((item) => item.id !== id);
    await AsyncStorage.setItem(KEYS.WRONG_BOOK, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to remove from wrong book:", error);
  }
}

export async function updateWrongBookItem(
  id: string,
  updates: Partial<Omit<WrongBookItem, "id" | "timestamp" | "result">>
): Promise<void> {
  try {
    const wrongBook = await getWrongBook();
    const index = wrongBook.findIndex((item) => item.id === id);
    if (index !== -1) {
      wrongBook[index] = { ...wrongBook[index], ...updates };
      await AsyncStorage.setItem(KEYS.WRONG_BOOK, JSON.stringify(wrongBook));
    }
  } catch (error) {
    console.error("Failed to update wrong book item:", error);
  }
}

export async function markAsMastered(id: string): Promise<void> {
  await updateWrongBookItem(id, { 
    mastered: true,
    reviewStatus: "mastered",
    reviewCount: 4, // Mark as fully reviewed
  });
}

export async function incrementPracticeCount(id: string): Promise<void> {
  try {
    const wrongBook = await getWrongBook();
    const item = wrongBook.find((i) => i.id === id);
    if (item) {
      await updateWrongBookItem(id, {
        practiceCount: item.practiceCount + 1,
        lastPracticeDate: new Date().toISOString().split("T")[0],
      });
    }
  } catch (error) {
    console.error("Failed to increment practice count:", error);
  }
}

export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      KEYS.USER_SETTINGS,
      KEYS.CHECK_HISTORY,
      KEYS.PROGRESS_DATA,
      KEYS.LEARNED_TOPICS,
      KEYS.WRONG_BOOK,
      KEYS.COLLECTION_BOOK,
    ]);
  } catch (error) {
    console.error("Failed to clear all data:", error);
  }
}

// Collection Book (积累本) - for collecting good expressions and phrases
export interface CollectionItem {
  id: string;
  timestamp: number;
  original: string; // Original expression
  enhanced: string; // Enhanced version
  type: "vocabulary" | "phrase" | "sentence";
  level: "intermediate" | "advanced" | "expert";
  examTag?: string; // e.g., "中考高频", "高考加分项"
  explanation: string;
  example: string;
  category?: string; // User-defined category (e.g., "情感表达", "因果关系")
  isFavorite: boolean; // Star/favorite status
  reviewCount: number; // How many times reviewed
  lastReviewDate: string; // ISO date string
}

export async function getCollectionBook(): Promise<CollectionItem[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.COLLECTION_BOOK);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load collection book:", error);
    return [];
  }
}

export async function addToCollection(
  item: Omit<CollectionItem, "id" | "timestamp" | "isFavorite" | "reviewCount" | "lastReviewDate">
): Promise<void> {
  try {
    const collection = await getCollectionBook();
    const newItem: CollectionItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
      isFavorite: false,
      reviewCount: 0,
      lastReviewDate: "",
    };

    // Add to beginning of array
    const updatedCollection = [newItem, ...collection];
    await AsyncStorage.setItem(KEYS.COLLECTION_BOOK, JSON.stringify(updatedCollection));
  } catch (error) {
    console.error("Failed to add to collection:", error);
  }
}

export async function removeFromCollection(id: string): Promise<void> {
  try {
    const collection = await getCollectionBook();
    const updated = collection.filter((item) => item.id !== id);
    await AsyncStorage.setItem(KEYS.COLLECTION_BOOK, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to remove from collection:", error);
  }
}

export async function toggleCollectionFavorite(id: string): Promise<void> {
  try {
    const collection = await getCollectionBook();
    const index = collection.findIndex((item) => item.id === id);
    if (index !== -1) {
      collection[index].isFavorite = !collection[index].isFavorite;
      await AsyncStorage.setItem(KEYS.COLLECTION_BOOK, JSON.stringify(collection));
    }
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
  }
}

export async function updateCollectionCategory(id: string, category: string): Promise<void> {
  try {
    const collection = await getCollectionBook();
    const index = collection.findIndex((item) => item.id === id);
    if (index !== -1) {
      collection[index].category = category;
      await AsyncStorage.setItem(KEYS.COLLECTION_BOOK, JSON.stringify(collection));
    }
  } catch (error) {
    console.error("Failed to update category:", error);
  }
}

export async function incrementCollectionReview(id: string): Promise<void> {
  try {
    const collection = await getCollectionBook();
    const index = collection.findIndex((item) => item.id === id);
    if (index !== -1) {
      collection[index].reviewCount += 1;
      collection[index].lastReviewDate = new Date().toISOString().split("T")[0];
      await AsyncStorage.setItem(KEYS.COLLECTION_BOOK, JSON.stringify(collection));
    }
  } catch (error) {
    console.error("Failed to increment review count:", error);
  }
}
