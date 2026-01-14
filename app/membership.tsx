import { useState, useEffect } from "react";
import { ScrollView, Text, View, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { AnimatedButton } from "@/components/animated-button";
import { AnimatedListItem } from "@/components/animated-list-item";
import {
  getMembershipInfo,
  getMembershipTitle,
  getMembershipColor,
  getMembershipIcon,
  mockPurchase,
  MEMBERSHIP_PLANS,
  type MembershipInfo,
  type MembershipPlan,
} from "@/services/membership-service";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function MembershipScreen() {
  const colors = useColors();
  const [membership, setMembership] = useState<MembershipInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string>("premium_season");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getMembershipInfo();
      setMembership(data);
    } catch (error) {
      console.error("Failed to load membership:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (planId: string) => {
    Alert.alert(
      "确认购买",
      "确定要购买此套餐吗?",
      [
        { text: "取消", style: "cancel" },
        {
          text: "确定",
          onPress: async () => {
            try {
              const success = await mockPurchase(planId);
              if (success) {
                Alert.alert("购买成功", "恭喜你成为高级会员!", [
                  {
                    text: "确定",
                    onPress: () => {
                      loadData();
                      router.back();
                    },
                  },
                ]);
              } else {
                Alert.alert("购买失败", "请稍后重试");
              }
            } catch (error) {
              Alert.alert("购买失败", "请稍后重试");
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <ScreenContainer className="p-6 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-sm text-muted mt-4">正在加载...</Text>
      </ScreenContainer>
    );
  }

  if (!membership) {
    return (
      <ScreenContainer className="p-6 items-center justify-center">
        <Text className="text-lg text-foreground">加载失败</Text>
      </ScreenContainer>
    );
  }

  const membershipColor = getMembershipColor(membership.tier);
  const selectedPlanData = MEMBERSHIP_PLANS.find(p => p.id === selectedPlan);

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">会员中心</Text>
            <Text className="text-sm text-muted">解锁更多强大功能</Text>
          </View>

          {/* Current Membership */}
          <View
            className="rounded-3xl p-6 border-2"
            style={{ backgroundColor: membershipColor + "10", borderColor: membershipColor }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-sm text-muted">当前会员</Text>
                <Text className="text-2xl font-bold text-foreground">
                  {getMembershipTitle(membership.tier)}
                </Text>
              </View>
              <Text className="text-5xl">{getMembershipIcon(membership.tier)}</Text>
            </View>

            {membership.expiresAt && (
              <View className="bg-background rounded-xl p-3">
                <Text className="text-xs text-muted">有效期至</Text>
                <Text className="text-base font-semibold text-foreground">
                  {new Date(membership.expiresAt).toLocaleDateString("zh-CN")}
                </Text>
              </View>
            )}

            {membership.tier === "free" && (
              <View className="mt-4 pt-4 border-t border-border">
                <Text className="text-sm text-muted text-center">
                  升级会员,解锁AI深度解释、针对性练习等高级功能
                </Text>
              </View>
            )}
          </View>

          {/* Plans */}
          {membership.tier === "free" && (
            <>
              <View className="gap-3">
                <Text className="text-lg font-bold text-foreground">💎 选择套餐</Text>
                
                {MEMBERSHIP_PLANS.map((plan, index) => (
                  <AnimatedListItem key={plan.id} index={index}>
                    <TouchableOpacity
                      onPress={() => setSelectedPlan(plan.id)}
                      className="rounded-2xl p-5 border-2"
                      style={{
                        backgroundColor: selectedPlan === plan.id ? colors.primary + "10" : colors.surface,
                        borderColor: selectedPlan === plan.id ? colors.primary : colors.border,
                      }}
                    >
                      {/* Recommended Badge */}
                      {plan.recommended && (
                        <View
                          className="absolute -top-2 -right-2 px-3 py-1 rounded-full"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <Text className="text-xs font-bold text-white">推荐</Text>
                        </View>
                      )}

                      <View className="gap-3">
                        {/* Header */}
                        <View className="flex-row items-center justify-between">
                          <View className="flex-1">
                            <Text className="text-lg font-bold text-foreground">{plan.title}</Text>
                            <Text className="text-sm text-muted">{plan.subtitle}</Text>
                          </View>
                          <View className="items-end">
                            <View className="flex-row items-baseline gap-1">
                              <Text className="text-xs text-muted">¥</Text>
                              <Text className="text-3xl font-bold" style={{ color: colors.primary }}>
                                {plan.price}
                              </Text>
                            </View>
                            {plan.originalPrice && (
                              <Text className="text-xs text-muted line-through">
                                原价 ¥{plan.originalPrice}
                              </Text>
                            )}
                          </View>
                        </View>

                        {/* Features */}
                        <View className="gap-2">
                          {plan.features.map((feature, i) => (
                            <Text key={i} className="text-sm text-foreground">
                              {feature}
                            </Text>
                          ))}
                        </View>
                      </View>
                    </TouchableOpacity>
                  </AnimatedListItem>
                ))}
              </View>

              {/* Purchase Button */}
              {selectedPlanData && (
                <AnimatedButton
                  onPress={() => handlePurchase(selectedPlan)}
                  className="rounded-2xl p-5 items-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-lg font-bold text-white">
                    立即购买 - ¥{selectedPlanData.price}
                  </Text>
                  <Text className="text-sm text-white/80 mt-1">
                    {selectedPlanData.duration}天有效期
                  </Text>
                </AnimatedButton>
              )}

              {/* Notice */}
              <View className="bg-surface rounded-2xl p-4 border border-border">
                <Text className="text-xs text-muted leading-relaxed">
                  • 购买即表示同意《会员服务协议》{"\n"}
                  • 会员服务自购买之日起生效{"\n"}
                  • 会员期间可随时取消自动续费{"\n"}
                  • 如有问题请联系客服
                </Text>
              </View>
            </>
          )}

          {/* Feature Comparison */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">📊 功能对比</Text>
            
            <View className="bg-surface rounded-2xl border border-border overflow-hidden">
              {/* Header */}
              <View className="flex-row bg-background p-4 border-b border-border">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">功能</Text>
                </View>
                <View className="w-20 items-center">
                  <Text className="text-xs font-semibold text-muted">免费</Text>
                </View>
                <View className="w-20 items-center">
                  <Text className="text-xs font-semibold" style={{ color: colors.primary }}>高级</Text>
                </View>
              </View>

              {/* Rows */}
              {[
                { name: "AI深度解释", free: false, premium: true },
                { name: "AI针对性练习", free: false, premium: true },
                { name: "AI润色", free: false, premium: true },
                { name: "无限次检查", free: false, premium: true },
                { name: "提分报告", free: false, premium: true },
                { name: "高级错题本", free: false, premium: true },
                { name: "高级练习题", free: false, premium: true },
                { name: "无广告", free: false, premium: true },
              ].map((row, i) => (
                <View
                  key={i}
                  className="flex-row p-4 border-b border-border"
                  style={{ backgroundColor: i % 2 === 0 ? colors.background : colors.surface }}
                >
                  <View className="flex-1">
                    <Text className="text-sm text-foreground">{row.name}</Text>
                  </View>
                  <View className="w-20 items-center">
                    <Text className="text-lg">
                      {row.free ? "✅" : "❌"}
                    </Text>
                  </View>
                  <View className="w-20 items-center">
                    <Text className="text-lg">
                      {row.premium ? "✅" : "❌"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
