# Epos首页重构指南 - AI英语私人助理界面

## 📋 项目概览

本次重构参考蚂蚁阿福的UI设计逻辑，将Epos首页打造成"AI英语私人助理"界面。新首页采用**黑白极简风格**，融合**轻盈呼吸感**的层级设计。

---

## 🎨 新增组件

### 1. **SmartQACard** (`components/smart-qa-card.tsx`)
智能问答卡片组件，仿照蚂蚁阿福的交互卡片设计。

**特性**：
- ✅ 带#号标签的圆角卡片（考点、避坑、挑战）
- ✅ 半透明背景 + 极细边框（0.5px）
- ✅ 进入动画（错落出现）
- ✅ 按压反馈动画
- ✅ 触觉反馈

**使用示例**：
```tsx
import { SmartQACardsContainer, type SmartQACardData } from "@/components/smart-qa-card";

const qaCards: SmartQACardData[] = [
  {
    id: "qa-1",
    tag: "考点",
    question: '"used to"和"be used to"怎么区分？',
    description: "这是中考高频考点",
    onPress: () => {
      // Handle card press
    },
  },
];

<SmartQACardsContainer cards={qaCards} title="💡 智能问答" />
```

---

### 2. **AILectureModal** (`components/ai-lecture-modal.tsx`)
全屏AI精讲窗口，点击问答卡片后弹出。

**特性**：
- ✅ 全屏模态框，底部滑入动画
- ✅ 调用现有AI API获取精讲内容
- ✅ 支持Markdown格式内容展示
- ✅ 加载状态和错误处理
- ✅ 平滑的背景模糊效果

**使用示例**：
```tsx
import { AILectureModal } from "@/components/ai-lecture-modal";

const [selectedQACard, setSelectedQACard] = useState(null);

<AILectureModal
  visible={!!selectedQACard}
  onClose={() => setSelectedQACard(null)}
  question={selectedQACard?.question}
  tag={selectedQACard?.tag}
/>
```

---

### 3. **GlobalInputBar** (`components/global-input-bar.tsx`)
底部全局输入框，常驻悬浮输入条。

**特性**：
- ✅ 文本输入 + 拍照按钮 + 发送按钮
- ✅ 长按说话（语音录制预留）
- ✅ 焦点时的动画效果
- ✅ 实时加载状态
- ✅ 触觉反馈

**使用示例**：
```tsx
import { GlobalInputBar } from "@/components/global-input-bar";

<GlobalInputBar
  onSendMessage={(text) => handleCheckGrammar(text)}
  onPhotoPress={() => router.push("/photo-recognition")}
  isLoading={isCheckingGrammar}
/>
```

---

### 4. **AssistantGreeting** (`components/assistant-greeting.tsx`)
顶部亲切问候语区域，显示学习进度。

**特性**：
- ✅ 时间感知的问候语（早上好/下午好/晚上好）
- ✅ 动态提分目标显示
- ✅ 进度条可视化
- ✅ 进入动画

**使用示例**：
```tsx
import { AssistantGreeting } from "@/components/assistant-greeting";

<AssistantGreeting
  remainingPoints={3}
  totalPoints={15}
/>
```

---

## 🔄 首页重构变更

### 原首页 (`app/(tabs)/index.tsx.backup`)
- 静态的"每日提示"卡片
- 中间输入框设计
- 最近检查列表

### 新首页 (`app/(tabs)/index.tsx`)
- **顶部**：Logo + 问候语 + 进度显示
- **中部**：智能问答卡片流（3个示例卡片）
- **中下**：快速导航（拍照、课文、语法）
- **下部**：统计数据卡片
- **底部**：全局输入框（固定）

### 布局结构
```
┌─────────────────────────┐
│  EPOS | logic of lang   │ ← Header
├─────────────────────────┤
│  早上好～ ✨             │ ← Greeting
│  距离提分目标还差 3 点   │
│  [进度条]               │
├─────────────────────────┤
│  💡 智能问答             │
│  ┌─────────────────────┐│
│  │ #考点 | "used to"...││ ← QA Cards
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │ #避坑 | "very happy"││
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │ #挑战 | 地道打招呼...││
│  └─────────────────────┘│
├─────────────────────────┤
│  🔔 今日待复习          │ ← Reminders
│  📷 拍照识别            │
│  📖 课文带学            │
│  📚 语法中心            │
├─────────────────────────┤
│  [已检查] [正确] [连续]  │ ← Stats
├─────────────────────────┤
│ [📷] [输入框...] [✈️]   │ ← Input Bar
└─────────────────────────┘
```

---

## 🎯 核心功能

### 1. 智能问答卡片
- **点击卡片** → 弹出全屏AI精讲窗口
- **AI精讲窗口** → 调用现有grammar.check API
- **返回结果** → 格式化为Markdown展示

### 2. 全局输入框
- **文本输入** → 调用checkGrammarMutation
- **拍照按钮** → 导航到photo-recognition页面
- **长按说话** → 预留语音功能（可扩展）

### 3. 顶部问候
- **时间感知** → 根据当前时间显示不同问候
- **进度显示** → 动态计算剩余知识点
- **进度条** → 可视化学习进度

---

## 🛠️ 技术实现细节

### 动画库
- **React Native Reanimated** - 高性能动画
- **Expo Haptics** - 触觉反馈

### 样式系统
- **NativeWind** - Tailwind CSS for React Native
- **useColors Hook** - 主题颜色管理
- **极简设计** - 0.5px边框、半透明背景、高斯模糊效果

### 状态管理
- **React Hooks** - useState, useEffect
- **tRPC** - 后端API调用
- **Local Storage** - 数据持久化

### 响应式设计
- **KeyboardAvoidingView** - 键盘避免
- **ScrollView** - 可滚动内容
- **Dimensions API** - 动态尺寸

---

## 📝 代码示例

### 添加新的QA卡片

```tsx
const qaCards: SmartQACardData[] = [
  {
    id: "qa-custom",
    tag: "考点", // 或 "避坑" / "挑战"
    question: "你的问题文本",
    description: "可选的描述文本",
    onPress: () => {
      setSelectedQACard({
        question: "你的问题文本",
        tag: "考点",
      });
    },
  },
  // ... 其他卡片
];
```

### 自定义AI精讲内容

在 `AILectureModal` 中修改 `fetchAILecture` 函数：

```tsx
const fetchAILecture = async () => {
  // 调用你的API
  const response = await fetch("/api/your-endpoint", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
  
  const data = await response.json();
  
  // 格式化为Markdown
  let content = `## ${tag}精讲\n\n`;
  content += `**问题**: ${question}\n\n`;
  content += `**解析**: ${data.explanation}\n\n`;
  
  setLectureContent(content);
};
```

---

## 🎨 视觉风格指南

### 颜色系统
- **背景**: 纯白或纯黑（根据主题）
- **前景**: 深灰或浅灰
- **边框**: 极淡灰色（0.5px）
- **标签背景**:
  - 考点: `#E8F0FE` (蓝色)
  - 避坑: `#FEF3E2` (橙色)
  - 挑战: `#F0FDF4` (绿色)

### 圆角规范
- **卡片**: 16px
- **按钮**: 12-24px
- **输入框**: 24px

### 间距规范
- **卡片间距**: 12px
- **区域间距**: 20-24px
- **内部填充**: 16px

### 字体规范
- **标题**: 24px, 300 weight
- **副标题**: 16px, 600 weight
- **正文**: 14-15px, 400 weight
- **标签**: 14px, 600 weight

---

## 🚀 部署检查清单

- [ ] 所有新组件已创建
- [ ] 首页文件已替换
- [ ] TypeScript编译无错误
- [ ] 本地测试通过
- [ ] 动画效果流畅
- [ ] 触觉反馈正常
- [ ] 响应式布局适配
- [ ] AI API调用正常
- [ ] 错误处理完整
- [ ] 代码已提交

---

## 📱 测试清单

### 功能测试
- [ ] 点击QA卡片，弹出AI精讲窗口
- [ ] AI精讲窗口显示内容正确
- [ ] 关闭窗口返回首页
- [ ] 输入框文本输入正常
- [ ] 发送按钮触发语法检查
- [ ] 拍照按钮导航正确
- [ ] 今日复习提醒显示正确

### 交互测试
- [ ] 卡片按压动画流畅
- [ ] 输入框焦点动画正常
- [ ] 触觉反馈有效
- [ ] 键盘弹出/收起正确
- [ ] 滚动流畅无卡顿

### 样式测试
- [ ] 黑白主题切换正常
- [ ] 边框显示清晰
- [ ] 间距均匀
- [ ] 字体大小适配
- [ ] 颜色对比度足够

### 性能测试
- [ ] 首页加载速度快
- [ ] 动画帧率稳定（60fps）
- [ ] 内存占用正常
- [ ] 无内存泄漏

---

## 🔧 故障排除

### 问题：卡片不显示
**解决**：检查 `SmartQACardsContainer` 是否正确传入 `cards` 数据

### 问题：AI精讲窗口不弹出
**解决**：确保 `selectedQACard` 状态正确更新，检查Modal的 `visible` 属性

### 问题：输入框不响应
**解决**：检查 `onSendMessage` 回调是否正确绑定

### 问题：动画卡顿
**解决**：确保使用了 `react-native-reanimated` 的Animated组件

---

## 📚 相关文件

| 文件 | 说明 |
|-----|------|
| `components/smart-qa-card.tsx` | 智能问答卡片 |
| `components/ai-lecture-modal.tsx` | AI精讲窗口 |
| `components/global-input-bar.tsx` | 全局输入框 |
| `components/assistant-greeting.tsx` | 顶部问候语 |
| `app/(tabs)/index.tsx` | 重构后的首页 |
| `app/(tabs)/index.tsx.backup` | 原首页备份 |

---

## 🎓 扩展建议

### 短期（1-2周）
1. 添加更多QA卡片（10+个）
2. 优化AI精讲内容质量
3. 实现语音输入功能
4. 添加卡片收藏功能

### 中期（1个月）
1. 实现个性化推荐算法
2. 添加QA卡片分类筛选
3. 实现学习路径规划
4. 添加社交分享功能

### 长期（2-3个月）
1. 实现AI对话功能
2. 添加学习数据分析
3. 实现智能复习计划
4. 集成更多AI能力

---

## 📞 支持

如有问题，请参考：
- 项目文档：`/home/ubuntu/epos-app/PROJECT_INFO.md`
- 快速开始：`/home/ubuntu/epos-app/QUICK_START.md`
- 优化指南：`/home/ubuntu/epos-app/OPTIMIZATION_GUIDE.md`

---

**重构完成时间**: 2026年1月14日  
**设计参考**: 蚂蚁阿福UI设计逻辑  
**代码质量**: ✅ TypeScript + 类型安全  
**性能**: ✅ 优化的动画和渲染
