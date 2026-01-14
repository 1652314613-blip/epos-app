import { View, Text } from "react-native";
import Svg, { Polygon, Circle, Line, Text as SvgText } from "react-native-svg";
import { useColors } from "@/hooks/use-colors";
import type { AbilityScores } from "@/services/ability-radar-service";

interface AbilityRadarChartProps {
  scores: AbilityScores;
  size?: number;
}

export function AbilityRadarChart({ scores, size = 200 }: AbilityRadarChartProps) {
  const colors = useColors();
  const center = size / 2;
  const radius = (size / 2) * 0.7;

  const dimensions = [
    { key: "vocabulary", label: "词汇", angle: -90 },
    { key: "grammar", label: "语法", angle: -18 },
    { key: "authenticity", label: "地道度", angle: 54 },
    { key: "perseverance", label: "毅力", angle: 126 },
    { key: "difficulty", label: "难度", angle: 198 },
  ];

  // Calculate polygon points
  const getPoint = (angle: number, value: number) => {
    const rad = (angle * Math.PI) / 180;
    const r = (radius * value) / 100;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  // Background grid (20, 40, 60, 80, 100)
  const gridLevels = [20, 40, 60, 80, 100];
  const gridPolygons = gridLevels.map((level) => {
    const points = dimensions
      .map((dim) => {
        const point = getPoint(dim.angle, level);
        return `${point.x},${point.y}`;
      })
      .join(" ");
    return points;
  });

  // Data polygon
  const dataPoints = dimensions
    .map((dim) => {
      const value = scores[dim.key as keyof AbilityScores];
      const point = getPoint(dim.angle, value);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  return (
    <View className="items-center gap-4">
      <Svg width={size} height={size}>
        {/* Grid lines */}
        {dimensions.map((dim, index) => {
          const endPoint = getPoint(dim.angle, 100);
          return (
            <Line
              key={`line-${index}`}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke={colors.border}
              strokeWidth="1"
            />
          );
        })}

        {/* Grid polygons */}
        {gridPolygons.map((points, index) => (
          <Polygon
            key={`grid-${index}`}
            points={points}
            fill="none"
            stroke={colors.border}
            strokeWidth="0.5"
          />
        ))}

        {/* Data polygon */}
        <Polygon
          points={dataPoints}
          fill={colors.primary + "40"}
          stroke={colors.primary}
          strokeWidth="2"
        />

        {/* Data points */}
        {dimensions.map((dim, index) => {
          const value = scores[dim.key as keyof AbilityScores];
          const point = getPoint(dim.angle, value);
          return (
            <Circle
              key={`point-${index}`}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={colors.primary}
            />
          );
        })}

        {/* Labels */}
        {dimensions.map((dim, index) => {
          const labelPoint = getPoint(dim.angle, 115);
          const value = scores[dim.key as keyof AbilityScores];
          return (
            <SvgText
              key={`label-${index}`}
              x={labelPoint.x}
              y={labelPoint.y}
              fill={colors.foreground}
              fontSize="12"
              fontWeight="600"
              textAnchor="middle"
            >
              {dim.label}
            </SvgText>
          );
        })}
      </Svg>

      {/* Legend */}
      <View className="flex-row flex-wrap gap-x-4 gap-y-2 justify-center">
        {dimensions.map((dim) => {
          const value = scores[dim.key as keyof AbilityScores];
          return (
            <View key={dim.key} className="flex-row items-center gap-1">
              <View
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
              <Text className="text-xs text-muted">
                {dim.label}: {value}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
