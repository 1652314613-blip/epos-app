/**
 * 考点热力值勋章组件
 * 显示中考/高考考点的热度标识
 */

import React from "react";
import { View, Text } from "react-native";

interface ExamHeatBadgeProps {
  zhongkaoFrequency?: "high" | "medium" | "low";  // 中考频次
  gaokaoPoint?: boolean;  // 是否为高考考点
  size?: "small" | "medium" | "large";
}

const ExamHeatBadge: React.FC<ExamHeatBadgeProps> = React.memo(({
  zhongkaoFrequency,
  gaokaoPoint,
  size = "medium",
}) => {
  const badges = [];

  // 中考热力值
  if (zhongkaoFrequency) {
    let fires = "";
    let label = "";
    let bgColor = "";
    let textColor = "";

    switch (zhongkaoFrequency) {
      case "high":
        fires = "🔥🔥🔥";
        label = "中考必考";
        bgColor = "#FEE2E2";
        textColor = "#DC2626";
        break;
      case "medium":
        fires = "🔥🔥";
        label = "中考常考";
        bgColor = "#FED7AA";
        textColor = "#EA580C";
        break;
      case "low":
        fires = "🔥";
        label = "中考考点";
        bgColor = "#FEF3C7";
        textColor = "#D97706";
        break;
    }

    badges.push({
      key: "zhongkao",
      icon: fires,
      label,
      bgColor,
      textColor,
    });
  }

  // 高考考点
  if (gaokaoPoint) {
    badges.push({
      key: "gaokao",
      icon: "🎯",
      label: "高考考点",
      bgColor: "#DBEAFE",
      textColor: "#1D4ED8",
    });
  }

  if (badges.length === 0) {
    return null;
  }

  const sizeStyles = {
    small: { fontSize: 10, padding: 4, gap: 4 },
    medium: { fontSize: 12, padding: 6, gap: 6 },
    large: { fontSize: 14, padding: 8, gap: 8 },
  };

  const style = sizeStyles[size];

  return (
    <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
      {badges.map((badge) => (
        <View
          key={badge.key}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: badge.bgColor,
            borderRadius: 8,
            paddingVertical: style.padding,
            paddingHorizontal: style.padding + 2,
            gap: style.gap,
          }}
        >
          <Text style={{ fontSize: style.fontSize }}>
            {badge.icon}
          </Text>
          <Text
            style={{
              fontSize: style.fontSize,
              fontWeight: "600",
              color: badge.textColor,
            }}
          >
            {badge.label}
          </Text>
        </View>
      ))}
    </View>
  );
});

export default ExamHeatBadge;

// 辅助函数: 根据考点标签获取热力值
export function getExamHeatFromTags(tags?: string[]): {
  zhongkaoFrequency?: "high" | "medium" | "low";
  gaokaoPoint?: boolean;
} {
  if (!tags || tags.length === 0) {
    return {};
  }

  const result: {
    zhongkaoFrequency?: "high" | "medium" | "low";
    gaokaoPoint?: boolean;
  } = {};

  // 检查中考标签
  if (tags.includes("中考必考") || tags.includes("中考高频")) {
    result.zhongkaoFrequency = "high";
  } else if (tags.includes("中考常考")) {
    result.zhongkaoFrequency = "medium";
  } else if (tags.includes("中考考点")) {
    result.zhongkaoFrequency = "low";
  }

  // 检查高考标签
  if (tags.some(tag => tag.includes("高考"))) {
    result.gaokaoPoint = true;
  }

  return result;
}
