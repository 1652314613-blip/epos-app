import { ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { AnimatedButton } from "@/components/animated-button";

export default function PrivacyPolicyScreen() {
  const colors = useColors();

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">隐私政策</Text>
            <Text className="text-sm text-muted">最后更新日期：2026年1月10日</Text>
          </View>

          {/* Introduction */}
          <View className="gap-3">
            <Text className="text-base text-foreground leading-relaxed">
              欢迎使用英语语法辅导应用（以下简称"本应用"）。我们非常重视您的隐私保护和个人信息安全。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。
            </Text>
            <Text className="text-base text-foreground leading-relaxed">
              请您在使用本应用前仔细阅读并充分理解本隐私政策。如果您不同意本隐私政策的任何内容，请停止使用本应用。
            </Text>
          </View>

          {/* Section 1 */}
          <View className="gap-3">
            <Text className="text-xl font-bold text-foreground">1. 我们收集的信息</Text>
            <Text className="text-base text-foreground leading-relaxed">
              为了向您提供更好的服务，我们可能会收集以下信息：
            </Text>
            <View className="pl-4 gap-2">
              <Text className="text-base text-foreground leading-relaxed">
                • <Text className="font-semibold">账号信息</Text>：手机号码（用于登录验证）
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                • <Text className="font-semibold">学习数据</Text>：语法检查记录、错题本内容、单词本数据、学习进度统计
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                • <Text className="font-semibold">设备信息</Text>：设备型号、操作系统版本、应用版本号
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                • <Text className="font-semibold">使用数据</Text>：功能使用频率、学习时长、错误类型统计
              </Text>
            </View>
          </View>

          {/* Section 2 */}
          <View className="gap-3">
            <Text className="text-xl font-bold text-foreground">2. 信息的使用</Text>
            <Text className="text-base text-foreground leading-relaxed">
              我们收集的信息将用于以下目的：
            </Text>
            <View className="pl-4 gap-2">
              <Text className="text-base text-foreground leading-relaxed">
                • 提供语法检查、错题本、单词本等核心功能
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                • 生成个性化的学习建议和复习计划
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                • 统计和分析学习进度，提供可视化图表
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                • 改进应用功能和用户体验
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                • 保障应用安全和防止欺诈行为
              </Text>
            </View>
          </View>

          {/* Section 3 */}
          <View className="gap-3">
            <Text className="text-xl font-bold text-foreground">3. 信息的存储</Text>
            <Text className="text-base text-foreground leading-relaxed">
              • <Text className="font-semibold">本地存储</Text>：您的学习数据（错题本、单词本、学习进度）主要存储在您的设备本地，不会上传到服务器。
            </Text>
            <Text className="text-base text-foreground leading-relaxed">
              • <Text className="font-semibold">云端存储</Text>：仅在您主动开启云同步功能时，我们才会将您的学习数据加密上传到云端服务器。
            </Text>
            <Text className="text-base text-foreground leading-relaxed">
              • <Text className="font-semibold">数据安全</Text>：我们采用行业标准的安全措施保护您的数据，包括加密传输、访问控制和定期安全审计。
            </Text>
          </View>

          {/* Section 4 */}
          <View className="gap-3">
            <Text className="text-xl font-bold text-foreground">4. 信息的共享</Text>
            <Text className="text-base text-foreground leading-relaxed">
              我们承诺不会出售、出租或以其他方式向第三方披露您的个人信息，除非：
            </Text>
            <View className="pl-4 gap-2">
              <Text className="text-base text-foreground leading-relaxed">
                • 获得您的明确同意
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                • 法律法规要求或政府机关依法要求
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                • 为提供服务所必需的第三方服务商（如AI语言模型提供商），我们会要求其严格遵守保密义务
              </Text>
            </View>
          </View>

          {/* Section 5 */}
          <View className="gap-3">
            <Text className="text-xl font-bold text-foreground">5. 您的权利</Text>
            <Text className="text-base text-foreground leading-relaxed">
              您对自己的个人信息享有以下权利：
            </Text>
            <View className="pl-4 gap-2">
              <Text className="text-base text-foreground leading-relaxed">
                • <Text className="font-semibold">访问权</Text>：您可以随时查看您的学习数据和账号信息
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                • <Text className="font-semibold">更正权</Text>：您可以修改或更新您的个人信息
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                • <Text className="font-semibold">删除权</Text>：您可以删除您的学习记录或注销账号
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                • <Text className="font-semibold">撤回同意权</Text>：您可以随时撤回对数据处理的同意
              </Text>
            </View>
          </View>

          {/* Section 6 */}
          <View className="gap-3">
            <Text className="text-xl font-bold text-foreground">6. 未成年人保护</Text>
            <Text className="text-base text-foreground leading-relaxed">
              本应用主要面向中学生用户。我们非常重视未成年人的个人信息保护：
            </Text>
            <View className="pl-4 gap-2">
              <Text className="text-base text-foreground leading-relaxed">
                • 未成年人使用本应用应征得监护人同意
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                • 我们不会主动收集未成年人的敏感个人信息
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                • 监护人有权查看和管理未成年人的学习数据
              </Text>
            </View>
          </View>

          {/* Section 7 */}
          <View className="gap-3">
            <Text className="text-xl font-bold text-foreground">7. 第三方服务</Text>
            <Text className="text-base text-foreground leading-relaxed">
              本应用可能使用以下第三方服务：
            </Text>
            <View className="pl-4 gap-2">
              <Text className="text-base text-foreground leading-relaxed">
                • <Text className="font-semibold">AI语言模型</Text>：用于语法检查和智能问答（Google Gemini）
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                • <Text className="font-semibold">短信服务</Text>：用于发送验证码（阿里云短信服务）
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                • <Text className="font-semibold">语音合成</Text>：用于单词发音（Expo Speech）
              </Text>
            </View>
            <Text className="text-base text-foreground leading-relaxed">
              这些第三方服务有各自的隐私政策，我们建议您仔细阅读。
            </Text>
          </View>

          {/* Section 8 */}
          <View className="gap-3">
            <Text className="text-xl font-bold text-foreground">8. 政策更新</Text>
            <Text className="text-base text-foreground leading-relaxed">
              我们可能会不时更新本隐私政策。重大变更时，我们会通过应用内通知或其他方式告知您。继续使用本应用即表示您同意更新后的隐私政策。
            </Text>
          </View>

          {/* Section 9 */}
          <View className="gap-3">
            <Text className="text-xl font-bold text-foreground">9. 联系我们</Text>
            <Text className="text-base text-foreground leading-relaxed">
              如果您对本隐私政策有任何疑问、意见或建议，或需要行使您的权利，请通过以下方式联系我们：
            </Text>
            <View className="pl-4 gap-2">
              <Text className="text-base text-foreground leading-relaxed">
                • 邮箱：support@englishgrammartutor.com
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                • 应用内反馈：设置 → 帮助与反馈
              </Text>
            </View>
            <Text className="text-base text-foreground leading-relaxed">
              我们将在收到您的请求后15个工作日内予以回复。
            </Text>
          </View>

          {/* Back Button */}
          <View className="pt-4">
            <AnimatedButton onPress={() => router.back()} variant="primary">
              返回
            </AnimatedButton>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
