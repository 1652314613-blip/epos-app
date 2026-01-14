/**
 * Gamification Service - 游戏化激励系统
 * 包括勋章体系和等级系统
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const ACHIEVEMENTS_KEY = "user_achievements";
const LEVEL_KEY = "user_level";

// 勋章定义
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "learning" | "mastery" | "streak" | "milestone";
  requirement: AchievementRequirement;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface AchievementRequirement {
  type: "check_count" | "error_correct" | "streak" | "mastery_level" | "grammar_master" | "perfect_score";
  value: number;
  description: string;
}

// 用户等级
export interface UserLevel {
  level: number;
  title: string;
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
}

// XP来源
export interface XPGain {
  amount: number;
  source: string;
  timestamp: string;
}

/**
 * 预定义的勋章列表
 */
export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, "unlocked" | "unlockedAt">[] = [
  // 学习类勋章
  {
    id: "first_check",
    title: "初次尝试",
    description: "完成第一次语法检查",
    icon: "🎯",
    category: "learning",
    requirement: {
      type: "check_count",
      value: 1,
      description: "完成1次语法检查",
    },
    rarity: "common",
  },
  {
    id: "check_10",
    title: "勤奋学习者",
    description: "完成10次语法检查",
    icon: "📚",
    category: "learning",
    requirement: {
      type: "check_count",
      value: 10,
      description: "完成10次语法检查",
    },
    rarity: "common",
  },
  {
    id: "check_50",
    title: "学习达人",
    description: "完成50次语法检查",
    icon: "🏆",
    category: "learning",
    requirement: {
      type: "check_count",
      value: 50,
      description: "完成50次语法检查",
    },
    rarity: "rare",
  },
  {
    id: "check_100",
    title: "学习大师",
    description: "完成100次语法检查",
    icon: "👑",
    category: "learning",
    requirement: {
      type: "check_count",
      value: 100,
      description: "完成100次语法检查",
    },
    rarity: "epic",
  },
  
  // 掌握类勋章
  {
    id: "correct_10",
    title: "错题克星",
    description: "纠正10个错误",
    icon: "✅",
    category: "mastery",
    requirement: {
      type: "error_correct",
      value: 10,
      description: "纠正10个错误",
    },
    rarity: "common",
  },
  {
    id: "correct_50",
    title: "语法精英",
    description: "纠正50个错误",
    icon: "⭐",
    category: "mastery",
    requirement: {
      type: "error_correct",
      value: 50,
      description: "纠正50个错误",
    },
    rarity: "rare",
  },
  {
    id: "grammar_master_5",
    title: "语法通",
    description: "掌握5个语法点(掌握度≥80%)",
    icon: "🎓",
    category: "mastery",
    requirement: {
      type: "grammar_master",
      value: 5,
      description: "掌握5个语法点",
    },
    rarity: "rare",
  },
  {
    id: "grammar_master_10",
    title: "语法专家",
    description: "掌握10个语法点(掌握度≥80%)",
    icon: "🏅",
    category: "mastery",
    requirement: {
      type: "grammar_master",
      value: 10,
      description: "掌握10个语法点",
    },
    rarity: "epic",
  },
  
  // 连续打卡类勋章
  {
    id: "streak_3",
    title: "三天坚持",
    description: "连续学习3天",
    icon: "🔥",
    category: "streak",
    requirement: {
      type: "streak",
      value: 3,
      description: "连续学习3天",
    },
    rarity: "common",
  },
  {
    id: "streak_7",
    title: "一周坚持",
    description: "连续学习7天",
    icon: "🌟",
    category: "streak",
    requirement: {
      type: "streak",
      value: 7,
      description: "连续学习7天",
    },
    rarity: "rare",
  },
  {
    id: "streak_30",
    title: "月度坚持",
    description: "连续学习30天",
    icon: "💎",
    category: "streak",
    requirement: {
      type: "streak",
      value: 30,
      description: "连续学习30天",
    },
    rarity: "epic",
  },
  {
    id: "streak_100",
    title: "百日坚持",
    description: "连续学习100天",
    icon: "🏆",
    category: "streak",
    requirement: {
      type: "streak",
      value: 100,
      description: "连续学习100天",
    },
    rarity: "legendary",
  },
  
  // 里程碑类勋章
  {
    id: "perfect_score_1",
    title: "完美开始",
    description: "获得第一个满分",
    icon: "💯",
    category: "milestone",
    requirement: {
      type: "perfect_score",
      value: 1,
      description: "获得1次满分",
    },
    rarity: "rare",
  },
  {
    id: "perfect_score_10",
    title: "完美主义者",
    description: "获得10次满分",
    icon: "🌈",
    category: "milestone",
    requirement: {
      type: "perfect_score",
      value: 10,
      description: "获得10次满分",
    },
    rarity: "epic",
  },
  {
    id: "mastery_80",
    title: "优秀学生",
    description: "综合掌握度达到80%",
    icon: "🎖️",
    category: "milestone",
    requirement: {
      type: "mastery_level",
      value: 80,
      description: "综合掌握度达到80%",
    },
    rarity: "rare",
  },
  {
    id: "mastery_95",
    title: "卓越学者",
    description: "综合掌握度达到95%",
    icon: "👨‍🎓",
    category: "milestone",
    requirement: {
      type: "mastery_level",
      value: 95,
      description: "综合掌握度达到95%",
    },
    rarity: "legendary",
  },
];

/**
 * 等级标题定义
 */
const LEVEL_TITLES: Record<number, string> = {
  1: "英语新手",
  5: "语法学徒",
  10: "语法学者",
  15: "语法专家",
  20: "语法大师",
  25: "语法宗师",
  30: "英语泰斗",
};

/**
 * 计算升级所需XP
 */
function calculateNextLevelXP(level: number): number {
  // XP需求随等级增长: 100 * level^1.5
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * 获取用户等级信息
 */
export async function getUserLevel(): Promise<UserLevel> {
  try {
    const data = await AsyncStorage.getItem(LEVEL_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to load user level:", error);
  }
  
  // 默认等级1
  return {
    level: 1,
    title: LEVEL_TITLES[1],
    currentXP: 0,
    nextLevelXP: calculateNextLevelXP(1),
    totalXP: 0,
  };
}

/**
 * 保存用户等级
 */
async function saveUserLevel(level: UserLevel): Promise<void> {
  try {
    await AsyncStorage.setItem(LEVEL_KEY, JSON.stringify(level));
  } catch (error) {
    console.error("Failed to save user level:", error);
  }
}

/**
 * 添加XP
 */
export async function addXP(amount: number, source: string): Promise<{
  leveledUp: boolean;
  newLevel?: number;
  oldLevel: number;
  xpGained: number;
}> {
  const level = await getUserLevel();
  const oldLevel = level.level;
  
  level.currentXP += amount;
  level.totalXP += amount;
  
  let leveledUp = false;
  let newLevel = level.level;
  
  // 检查是否升级
  while (level.currentXP >= level.nextLevelXP) {
    level.currentXP -= level.nextLevelXP;
    level.level++;
    leveledUp = true;
    newLevel = level.level;
    
    // 更新等级标题
    if (LEVEL_TITLES[level.level]) {
      level.title = LEVEL_TITLES[level.level];
    }
    
    // 更新下一级所需XP
    level.nextLevelXP = calculateNextLevelXP(level.level);
  }
  
  await saveUserLevel(level);
  
  return {
    leveledUp,
    newLevel: leveledUp ? newLevel : undefined,
    oldLevel,
    xpGained: amount,
  };
}

/**
 * 获取用户勋章
 */
export async function getUserAchievements(): Promise<Achievement[]> {
  try {
    const data = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to load achievements:", error);
  }
  
  // 初始化所有勋章为未解锁状态
  return ACHIEVEMENT_DEFINITIONS.map(def => ({
    ...def,
    unlocked: false,
  }));
}

/**
 * 保存用户勋章
 */
async function saveUserAchievements(achievements: Achievement[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch (error) {
    console.error("Failed to save achievements:", error);
  }
}

/**
 * 检查并解锁勋章
 */
export async function checkAndUnlockAchievements(stats: {
  checkCount: number;
  correctedErrors: number;
  streak: number;
  masteredGrammarCount: number;
  perfectScoreCount: number;
  overallMasteryLevel: number;
}): Promise<Achievement[]> {
  const achievements = await getUserAchievements();
  const newlyUnlocked: Achievement[] = [];
  
  achievements.forEach(achievement => {
    if (achievement.unlocked) return;
    
    let shouldUnlock = false;
    
    switch (achievement.requirement.type) {
      case "check_count":
        shouldUnlock = stats.checkCount >= achievement.requirement.value;
        break;
      case "error_correct":
        shouldUnlock = stats.correctedErrors >= achievement.requirement.value;
        break;
      case "streak":
        shouldUnlock = stats.streak >= achievement.requirement.value;
        break;
      case "grammar_master":
        shouldUnlock = stats.masteredGrammarCount >= achievement.requirement.value;
        break;
      case "perfect_score":
        shouldUnlock = stats.perfectScoreCount >= achievement.requirement.value;
        break;
      case "mastery_level":
        shouldUnlock = stats.overallMasteryLevel >= achievement.requirement.value;
        break;
    }
    
    if (shouldUnlock) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      newlyUnlocked.push(achievement);
      
      // 解锁勋章时奖励XP
      const xpReward = getAchievementXPReward(achievement.rarity);
      addXP(xpReward, `解锁勋章: ${achievement.title}`);
    }
  });
  
  if (newlyUnlocked.length > 0) {
    await saveUserAchievements(achievements);
  }
  
  return newlyUnlocked;
}

/**
 * 获取勋章XP奖励
 */
function getAchievementXPReward(rarity: Achievement["rarity"]): number {
  switch (rarity) {
    case "common": return 50;
    case "rare": return 100;
    case "epic": return 200;
    case "legendary": return 500;
  }
}

/**
 * 获取稀有度颜色
 */
export function getRarityColor(rarity: Achievement["rarity"]): string {
  switch (rarity) {
    case "common": return "#9CA3AF";
    case "rare": return "#3B82F6";
    case "epic": return "#A855F7";
    case "legendary": return "#F59E0B";
  }
}

/**
 * 获取稀有度标签
 */
export function getRarityLabel(rarity: Achievement["rarity"]): string {
  switch (rarity) {
    case "common": return "普通";
    case "rare": return "稀有";
    case "epic": return "史诗";
    case "legendary": return "传说";
  }
}

/**
 * 奖励XP (用于各种行为)
 */
export async function rewardXP(action: "check" | "correct_error" | "perfect_score" | "daily_login"): Promise<number> {
  let xp = 0;
  let source = "";
  
  switch (action) {
    case "check":
      xp = 10;
      source = "完成语法检查";
      break;
    case "correct_error":
      xp = 20;
      source = "纠正错误";
      break;
    case "perfect_score":
      xp = 50;
      source = "获得满分";
      break;
    case "daily_login":
      xp = 5;
      source = "每日登录";
      break;
  }
  
  await addXP(xp, source);
  return xp;
}
