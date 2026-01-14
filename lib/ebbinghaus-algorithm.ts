/**
 * Ebbinghaus Forgetting Curve Algorithm
 * 
 * Implements spaced repetition based on the Ebbinghaus forgetting curve.
 * Review intervals: Day 1, 3, 7, 15 after first learning.
 */

export interface ReviewSchedule {
  nextReviewDate: Date;
  reviewCount: number;
  lastReviewDate: Date;
  status: "pending" | "due" | "overdue" | "mastered";
}

/**
 * Calculate next review date based on Ebbinghaus curve
 * 
 * Review intervals:
 * - 1st review: 1 day after learning
 * - 2nd review: 3 days after learning
 * - 3rd review: 7 days after learning
 * - 4th review: 15 days after learning
 * - After 4 reviews: Considered mastered
 */
export function calculateNextReview(
  firstLearnedDate: Date,
  reviewCount: number
): Date {
  const intervals = [1, 3, 7, 15]; // Days
  
  if (reviewCount >= intervals.length) {
    // Mastered - no more reviews needed
    const farFuture = new Date(firstLearnedDate);
    farFuture.setFullYear(farFuture.getFullYear() + 10);
    return farFuture;
  }
  
  const interval = intervals[reviewCount];
  const nextReview = new Date(firstLearnedDate);
  nextReview.setDate(nextReview.getDate() + interval);
  nextReview.setHours(9, 0, 0, 0); // Set to 9:00 AM
  
  return nextReview;
}

/**
 * Get review schedule for a learning item
 */
export function getReviewSchedule(
  firstLearnedDate: Date,
  reviewCount: number,
  lastReviewDate: Date
): ReviewSchedule {
  const nextReviewDate = calculateNextReview(firstLearnedDate, reviewCount);
  const now = new Date();
  
  let status: ReviewSchedule["status"];
  if (reviewCount >= 4) {
    status = "mastered";
  } else if (now >= nextReviewDate) {
    const daysPastDue = Math.floor((now.getTime() - nextReviewDate.getTime()) / (1000 * 60 * 60 * 24));
    status = daysPastDue > 2 ? "overdue" : "due";
  } else {
    status = "pending";
  }
  
  return {
    nextReviewDate,
    reviewCount,
    lastReviewDate,
    status,
  };
}

/**
 * Get days until next review
 */
export function getDaysUntilReview(nextReviewDate: Date): number {
  const now = new Date();
  const diff = nextReviewDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Check if item is due for review today
 */
export function isDueToday(nextReviewDate: Date): boolean {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const reviewDay = new Date(
    nextReviewDate.getFullYear(),
    nextReviewDate.getMonth(),
    nextReviewDate.getDate()
  );
  
  return reviewDay <= today;
}

/**
 * Get status label in Chinese
 */
export function getStatusLabel(status: ReviewSchedule["status"]): string {
  switch (status) {
    case "pending":
      return "待复习";
    case "due":
      return "今日复习";
    case "overdue":
      return "逾期未复习";
    case "mastered":
      return "已掌握";
    default:
      return "未知";
  }
}

/**
 * Get status color
 */
export function getStatusColor(status: ReviewSchedule["status"]): string {
  switch (status) {
    case "pending":
      return "#6B7280"; // Gray
    case "due":
      return "#F59E0B"; // Orange
    case "overdue":
      return "#EF4444"; // Red
    case "mastered":
      return "#10B981"; // Green
    default:
      return "#6B7280";
  }
}

/**
 * Get progress percentage (0-100)
 */
export function getProgressPercentage(reviewCount: number): number {
  return Math.min((reviewCount / 4) * 100, 100);
}
