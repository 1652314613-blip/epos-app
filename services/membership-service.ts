/**
 * Membership Service - 会员系统服务
 * 预留高级会员功能接口,为未来商业化做准备
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const MEMBERSHIP_KEY = "user_membership";

// 会员等级
export type MembershipTier = "free" | "premium" | "vip";

// 会员信息
export interface MembershipInfo {
  tier: MembershipTier;
  expiresAt?: string; // ISO date string
  features: MembershipFeatures;
}

// 会员功能权限
export interface MembershipFeatures {
  // AI功能
  aiDeepExplanation: boolean; // AI深度解释
  aiTargetedExercise: boolean; // AI针对性练习
  aiPolish: boolean; // AI润色
  aiVoiceChat: boolean; // AI语音对话(未来功能)
  
  // 学习功能
  unlimitedChecks: boolean; // 无限次语法检查
  advancedAnalytics: boolean; // 高级数据分析
  scoreReport: boolean; // 提分报告
  wrongBookAdvanced: boolean; // 高级错题本
  
  // 内容功能
  allGrammarPoints: boolean; // 所有语法点
  allVocabulary: boolean; // 所有词汇
  premiumExercises: boolean; // 高级练习题
  realExamSimulation: boolean; // 真题模拟(未来功能)
  
  // 其他功能
  adFree: boolean; // 无广告
  prioritySupport: boolean; // 优先客服
  offlineMode: boolean; // 离线模式(未来功能)
}

/**
 * 免费会员功能
 */
const FREE_FEATURES: MembershipFeatures = {
  aiDeepExplanation: false,
  aiTargetedExercise: false,
  aiPolish: false,
  aiVoiceChat: false,
  unlimitedChecks: false, // 每日限制10次
  advancedAnalytics: false,
  scoreReport: false,
  wrongBookAdvanced: false,
  allGrammarPoints: true, // 基础语法点免费
  allVocabulary: true, // 基础词汇免费
  premiumExercises: false,
  realExamSimulation: false,
  adFree: false,
  prioritySupport: false,
  offlineMode: false,
};

/**
 * 高级会员功能
 */
const PREMIUM_FEATURES: MembershipFeatures = {
  aiDeepExplanation: true,
  aiTargetedExercise: true,
  aiPolish: true,
  aiVoiceChat: false,
  unlimitedChecks: true,
  advancedAnalytics: true,
  scoreReport: true,
  wrongBookAdvanced: true,
  allGrammarPoints: true,
  allVocabulary: true,
  premiumExercises: true,
  realExamSimulation: false,
  adFree: true,
  prioritySupport: true,
  offlineMode: false,
};

/**
 * VIP会员功能
 */
const VIP_FEATURES: MembershipFeatures = {
  aiDeepExplanation: true,
  aiTargetedExercise: true,
  aiPolish: true,
  aiVoiceChat: true,
  unlimitedChecks: true,
  advancedAnalytics: true,
  scoreReport: true,
  wrongBookAdvanced: true,
  allGrammarPoints: true,
  allVocabulary: true,
  premiumExercises: true,
  realExamSimulation: true,
  adFree: true,
  prioritySupport: true,
  offlineMode: true,
};

/**
 * 获取会员信息
 */
export async function getMembershipInfo(): Promise<MembershipInfo> {
  try {
    const data = await AsyncStorage.getItem(MEMBERSHIP_KEY);
    if (data) {
      const membership: MembershipInfo = JSON.parse(data);
      
      // 检查是否过期
      if (membership.expiresAt) {
        const expiresAt = new Date(membership.expiresAt);
        if (expiresAt < new Date()) {
          // 已过期,降级为免费会员
          return {
            tier: "free",
            features: FREE_FEATURES,
          };
        }
      }
      
      return membership;
    }
  } catch (error) {
    console.error("Failed to load membership info:", error);
  }
  
  // 默认免费会员
  return {
    tier: "free",
    features: FREE_FEATURES,
  };
}

/**
 * 保存会员信息
 */
async function saveMembershipInfo(membership: MembershipInfo): Promise<void> {
  try {
    await AsyncStorage.setItem(MEMBERSHIP_KEY, JSON.stringify(membership));
  } catch (error) {
    console.error("Failed to save membership info:", error);
  }
}

/**
 * 升级会员
 */
export async function upgradeMembership(tier: MembershipTier, durationDays: number): Promise<void> {
  const features = tier === "premium" ? PREMIUM_FEATURES : tier === "vip" ? VIP_FEATURES : FREE_FEATURES;
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);
  
  const membership: MembershipInfo = {
    tier,
    expiresAt: expiresAt.toISOString(),
    features,
  };
  
  await saveMembershipInfo(membership);
}

/**
 * 检查功能权限
 */
export async function hasFeature(feature: keyof MembershipFeatures): Promise<boolean> {
  const membership = await getMembershipInfo();
  return membership.features[feature];
}

/**
 * 获取会员标题
 */
export function getMembershipTitle(tier: MembershipTier): string {
  switch (tier) {
    case "free": return "免费会员";
    case "premium": return "高级会员";
    case "vip": return "VIP会员";
  }
}

/**
 * 获取会员颜色
 */
export function getMembershipColor(tier: MembershipTier): string {
  switch (tier) {
    case "free": return "#6B7280";
    case "premium": return "#3B82F6";
    case "vip": return "#F59E0B";
  }
}

/**
 * 获取会员图标
 */
export function getMembershipIcon(tier: MembershipTier): string {
  switch (tier) {
    case "free": return "🆓";
    case "premium": return "⭐";
    case "vip": return "👑";
  }
}

/**
 * 会员套餐定义
 */
export interface MembershipPlan {
  id: string;
  tier: MembershipTier;
  title: string;
  subtitle: string;
  price: number; // 单位:元
  originalPrice?: number; // 原价
  duration: number; // 天数
  features: string[]; // 功能列表
  recommended?: boolean; // 是否推荐
}

/**
 * 预定义的会员套餐
 */
export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "premium_month",
    tier: "premium",
    title: "高级会员 - 月卡",
    subtitle: "适合短期冲刺",
    price: 29,
    originalPrice: 39,
    duration: 30,
    features: [
      "✅ AI深度解释",
      "✅ AI针对性练习",
      "✅ AI润色功能",
      "✅ 无限次语法检查",
      "✅ 提分报告",
      "✅ 高级错题本",
      "✅ 高级练习题",
      "✅ 无广告",
      "✅ 优先客服",
    ],
  },
  {
    id: "premium_season",
    tier: "premium",
    title: "高级会员 - 季卡",
    subtitle: "性价比之选",
    price: 68,
    originalPrice: 87,
    duration: 90,
    features: [
      "✅ 包含月卡所有功能",
      "✅ 平均每月仅需 23 元",
      "✅ 适合一学期使用",
    ],
    recommended: true,
  },
  {
    id: "premium_year",
    tier: "premium",
    title: "高级会员 - 年卡",
    subtitle: "最超值选择",
    price: 198,
    originalPrice: 348,
    duration: 365,
    features: [
      "✅ 包含月卡所有功能",
      "✅ 平均每月仅需 17 元",
      "✅ 适合长期学习",
      "✅ 赠送3个月",
    ],
  },
  {
    id: "vip_year",
    tier: "vip",
    title: "VIP会员 - 年卡",
    subtitle: "尊享全部功能",
    price: 398,
    originalPrice: 698,
    duration: 365,
    features: [
      "✅ 包含高级会员所有功能",
      "✅ AI语音对话(即将上线)",
      "✅ 真题模拟(即将上线)",
      "✅ 离线模式(即将上线)",
      "✅ 专属学习顾问",
      "✅ 终身更新",
    ],
  },
];

/**
 * 模拟支付(实际应用中需要接入支付SDK)
 */
export async function mockPurchase(planId: string): Promise<boolean> {
  // TODO: 接入支付SDK (微信支付、支付宝等)
  // 这里仅作为接口预留
  
  const plan = MEMBERSHIP_PLANS.find(p => p.id === planId);
  if (!plan) return false;
  
  // 模拟支付成功
  await upgradeMembership(plan.tier, plan.duration);
  return true;
}

/**
 * 检查每日检查次数限制(免费用户)
 */
const DAILY_CHECK_LIMIT_KEY = "daily_check_limit";

export async function checkDailyLimit(): Promise<{
  canCheck: boolean;
  remaining: number;
  limit: number;
}> {
  const membership = await getMembershipInfo();
  
  // 付费用户无限制
  if (membership.tier !== "free") {
    return {
      canCheck: true,
      remaining: 999,
      limit: 999,
    };
  }
  
  // 免费用户每日限制10次
  const limit = 10;
  
  try {
    const data = await AsyncStorage.getItem(DAILY_CHECK_LIMIT_KEY);
    if (data) {
      const { count, date } = JSON.parse(data);
      const today = new Date().toDateString();
      
      if (date === today) {
        const remaining = Math.max(0, limit - count);
        return {
          canCheck: remaining > 0,
          remaining,
          limit,
        };
      }
    }
  } catch (error) {
    console.error("Failed to check daily limit:", error);
  }
  
  // 新的一天或首次使用
  return {
    canCheck: true,
    remaining: limit,
    limit,
  };
}

/**
 * 增加每日检查次数
 */
export async function incrementDailyCheckCount(): Promise<void> {
  const membership = await getMembershipInfo();
  
  // 付费用户不计数
  if (membership.tier !== "free") return;
  
  try {
    const data = await AsyncStorage.getItem(DAILY_CHECK_LIMIT_KEY);
    const today = new Date().toDateString();
    
    let count = 1;
    if (data) {
      const { count: oldCount, date } = JSON.parse(data);
      if (date === today) {
        count = oldCount + 1;
      }
    }
    
    await AsyncStorage.setItem(DAILY_CHECK_LIMIT_KEY, JSON.stringify({ count, date: today }));
  } catch (error) {
    console.error("Failed to increment daily check count:", error);
  }
}
