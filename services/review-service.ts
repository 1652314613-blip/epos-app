/**
 * Review Service
 * 
 * Manages review schedules based on Ebbinghaus forgetting curve
 */

import { getWrongBook, updateWrongBookItem, type WrongBookItem } from "@/lib/storage";
import {
  calculateNextReview,
  getReviewSchedule,
  isDueToday,
  type ReviewSchedule,
} from "@/lib/ebbinghaus-algorithm";

/**
 * Update review statuses for all items in wrong book
 * Should be called when wrong book screen is opened
 */
export async function updateReviewStatuses(): Promise<void> {
  const wrongBook = await getWrongBook();
  const now = new Date();

  for (const item of wrongBook) {
    // Skip if already mastered
    if (item.mastered) continue;

    const schedule = getReviewSchedule(
      new Date(item.firstLearnedDate),
      item.reviewCount,
      item.lastPracticeDate ? new Date(item.lastPracticeDate) : new Date(item.firstLearnedDate)
    );

    // Update if status changed
    if (schedule.status !== item.reviewStatus) {
      await updateWrongBookItem(item.id, {
        reviewStatus: schedule.status,
        nextReviewDate: schedule.nextReviewDate.getTime(),
      });
    }
  }
}

/**
 * Mark item as reviewed and update review schedule
 */
export async function markAsReviewed(itemId: string): Promise<void> {
  const wrongBook = await getWrongBook();
  const item = wrongBook.find((i) => i.id === itemId);

  if (!item) return;

  const newReviewCount = item.reviewCount + 1;
  const nextReviewDate = calculateNextReview(new Date(item.firstLearnedDate), newReviewCount);
  const now = new Date();

  await updateWrongBookItem(itemId, {
    reviewCount: newReviewCount,
    lastPracticeDate: now.toISOString().split("T")[0],
    nextReviewDate: nextReviewDate.getTime(),
    reviewStatus: newReviewCount >= 4 ? "mastered" : "pending",
    mastered: newReviewCount >= 4,
  });
}

/**
 * Get items due for review today
 */
export async function getDueItems(): Promise<WrongBookItem[]> {
  const wrongBook = await getWrongBook();
  return wrongBook.filter((item) => !item.mastered && isDueToday(new Date(item.nextReviewDate)));
}

/**
 * Get review statistics
 */
export async function getReviewStats(): Promise<{
  totalItems: number;
  dueToday: number;
  overdue: number;
  mastered: number;
  pending: number;
}> {
  const wrongBook = await getWrongBook();

  const stats = {
    totalItems: wrongBook.length,
    dueToday: 0,
    overdue: 0,
    mastered: 0,
    pending: 0,
  };

  for (const item of wrongBook) {
    switch (item.reviewStatus) {
      case "due":
        stats.dueToday++;
        break;
      case "overdue":
        stats.overdue++;
        break;
      case "mastered":
        stats.mastered++;
        break;
      case "pending":
        stats.pending++;
        break;
    }
  }

  return stats;
}

/**
 * Get predicted score improvement based on review completion
 * This is a simple heuristic: each mastered error type improves score by ~2-5%
 */
export async function getPredictedImprovement(): Promise<{
  currentMastery: number; // 0-100
  potentialImprovement: number; // 0-100
  estimatedScoreGain: number; // Points
}> {
  const wrongBook = await getWrongBook();

  if (wrongBook.length === 0) {
    return {
      currentMastery: 100,
      potentialImprovement: 0,
      estimatedScoreGain: 0,
    };
  }

  const masteredCount = wrongBook.filter((item) => item.mastered).length;
  const currentMastery = (masteredCount / wrongBook.length) * 100;
  const potentialImprovement = 100 - currentMastery;

  // Estimate score gain: each error type mastered = ~3 points improvement
  const estimatedScoreGain = Math.round((wrongBook.length - masteredCount) * 3);

  return {
    currentMastery: Math.round(currentMastery),
    potentialImprovement: Math.round(potentialImprovement),
    estimatedScoreGain,
  };
}

/**
 * Get count of items due for review today
 */
export async function getTodayReviewCount(): Promise<number> {
  const wrongBook = await getWrongBook();
  const now = new Date();

  let count = 0;
  for (const item of wrongBook) {
    // Skip if already mastered
    if (item.mastered) continue;

    const schedule = getReviewSchedule(
      new Date(item.firstLearnedDate),
      item.reviewCount,
      item.lastPracticeDate ? new Date(item.lastPracticeDate) : new Date(item.firstLearnedDate)
    );

    if (schedule.status === "due" || schedule.status === "overdue") {
      count++;
    }
  }

  return count;
}
