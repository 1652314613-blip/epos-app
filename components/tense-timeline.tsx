/**
 * 时态可视化时间轴组件
 * 直观展示时态的时间关系和动作点位
 */

import React, { useMemo } from "react";
import { View, Text, Dimensions } from "react-native";
import Svg, { Line, Circle, Text as SvgText, Defs, LinearGradient, Stop } from "react-native-svg";

const { width } = Dimensions.get("window");
const TIMELINE_WIDTH = width - 80;
const TIMELINE_HEIGHT = 200;

interface TimePoint {
  time: number;  // -2 (远过去), -1 (过去), 0 (现在), 1 (将来), 2 (远将来)
  text: string;
  color: string;
}

interface TenseTimelineProps {
  tense: string;
  examples: TimePoint[];
  description?: string;
}

const TenseTimeline: React.FC<TenseTimelineProps> = React.memo(({ tense, examples, description }) => {
  // 将时间点映射到SVG坐标
  const timeToX = (time: number): number => {
    // time范围: -2 到 2
    // 映射到: 40 到 TIMELINE_WIDTH-40
    return 40 + ((time + 2) / 4) * (TIMELINE_WIDTH - 80);
  };

  // 时态对应的颜色
  const tenseColors: Record<string, string> = {
    simple_present: "#4ECDC4",
    present_continuous: "#45B7D1",
    present_perfect: "#5D9CEC",
    present_perfect_continuous: "#4A89DC",
    simple_past: "#FC6E51",
    past_continuous: "#ED5565",
    past_perfect: "#DA4453",
    past_perfect_continuous: "#AC92EC",
    simple_future: "#A0D468",
    future_continuous: "#8CC152",
    future_perfect: "#37BC9B",
    future_perfect_continuous: "#3BAFDA",
  };

  const primaryColor = tenseColors[tense] || "#667eea";

  return (
    <View style={{ marginVertical: 20 }}>
      {description && (
        <Text style={{ fontSize: 14, color: "#666", marginBottom: 12, paddingHorizontal: 20 }}>
          {description}
        </Text>
      )}
      
      <Svg width={TIMELINE_WIDTH} height={TIMELINE_HEIGHT}>
        <Defs>
          <LinearGradient id="timelineGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#FC6E51" stopOpacity="0.8" />
            <Stop offset="0.5" stopColor="#4ECDC4" stopOpacity="0.8" />
            <Stop offset="1" stopColor="#A0D468" stopOpacity="0.8" />
          </LinearGradient>
        </Defs>

        {/* 主时间轴 */}
        <Line
          x1="40"
          y1="100"
          x2={TIMELINE_WIDTH - 40}
          y2="100"
          stroke="url(#timelineGradient)"
          strokeWidth="3"
        />

        {/* 时间刻度 */}
        {[-2, -1, 0, 1, 2].map((time) => {
          const x = timeToX(time);
          const labels = ["远过去", "过去", "现在", "将来", "远将来"];
          const label = labels[time + 2];
          const isNow = time === 0;

          return (
            <React.Fragment key={time}>
              <Line
                x1={x}
                y1="95"
                x2={x}
                y2="105"
                stroke={isNow ? primaryColor : "#999"}
                strokeWidth={isNow ? "3" : "2"}
              />
              <SvgText
                x={x}
                y="120"
                fontSize="12"
                fill={isNow ? primaryColor : "#666"}
                fontWeight={isNow ? "bold" : "normal"}
                textAnchor="middle"
              >
                {label}
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* 示例动作点 */}
        {examples.map((example, index) => {
          const x = timeToX(example.time);
          const y = 60 - index * 15;  // 多个点位错开显示

          return (
            <React.Fragment key={index}>
              {/* 连接线 */}
              <Line
                x1={x}
                y1={y + 10}
                x2={x}
                y2="95"
                stroke={example.color}
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              
              {/* 动作点 */}
              <Circle
                cx={x}
                cy={y}
                r="8"
                fill={example.color}
                opacity="0.9"
              />
              
              {/* 示例文本 */}
              <SvgText
                x={x}
                y={y - 15}
                fontSize="10"
                fill="#333"
                textAnchor="middle"
                fontWeight="500"
              >
                {example.text.length > 20 ? example.text.substring(0, 20) + "..." : example.text}
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* "现在"标记 */}
        <Circle
          cx={timeToX(0)}
          cy="100"
          r="6"
          fill={primaryColor}
        />
      </Svg>

      {/* 图例 */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, marginTop: 10 }}>
        {examples.map((example, index) => (
          <View key={index} style={{ flexDirection: "row", alignItems: "center", marginRight: 15, marginBottom: 8 }}>
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: example.color,
                marginRight: 6,
              }}
            />
            <Text style={{ fontSize: 12, color: "#666" }}>
              {example.text.length > 30 ? example.text.substring(0, 30) + "..." : example.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});

export default TenseTimeline;

// 预设时态示例数据
export const TenseExamples: Record<string, TimePoint[]> = {
  simple_present: [
    { time: 0, text: "I study English every day", color: "#4ECDC4" },
  ],
  present_continuous: [
    { time: 0, text: "I am studying now", color: "#45B7D1" },
  ],
  present_perfect: [
    { time: -1, text: "Started", color: "#FC6E51" },
    { time: 0, text: "I have studied for 3 years", color: "#5D9CEC" },
  ],
  present_perfect_continuous: [
    { time: -1, text: "Started", color: "#FC6E51" },
    { time: 0, text: "I have been studying", color: "#4A89DC" },
  ],
  simple_past: [
    { time: -1, text: "I studied yesterday", color: "#FC6E51" },
  ],
  past_continuous: [
    { time: -1, text: "I was studying at 8pm", color: "#ED5565" },
  ],
  past_perfect: [
    { time: -2, text: "Started", color: "#DA4453" },
    { time: -1, text: "I had studied before the test", color: "#FC6E51" },
  ],
  past_perfect_continuous: [
    { time: -2, text: "Started", color: "#DA4453" },
    { time: -1, text: "I had been studying", color: "#AC92EC" },
  ],
  simple_future: [
    { time: 1, text: "I will study tomorrow", color: "#A0D468" },
  ],
  future_continuous: [
    { time: 1, text: "I will be studying at 8pm", color: "#8CC152" },
  ],
  future_perfect: [
    { time: 0, text: "Now", color: "#4ECDC4" },
    { time: 1, text: "I will have studied by then", color: "#37BC9B" },
  ],
  future_perfect_continuous: [
    { time: 0, text: "Now", color: "#4ECDC4" },
    { time: 1, text: "I will have been studying", color: "#3BAFDA" },
  ],
};
