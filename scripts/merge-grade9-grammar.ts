/**
 * 将九年级语法点数据合并到主语法数据文件
 */

import { grade9GrammarPoints } from '../lib/grade9-grammar-data';
import type { GrammarPoint } from '../lib/grammar-points-data';

// 转换九年级数据格式为统一的GrammarPoint格式
const convertedGrade9Points: GrammarPoint[] = grade9GrammarPoints.map(point => ({
  id: point.id,
  grade: '9' as const,
  unit: point.unit,
  unitTitle: getUnitTitle(point.unit),
  title: point.title,
  titleCn: point.titleCn,
  category: point.category as any,
  difficulty: point.difficulty,
  examTags: point.examTags,
  description: point.description,
  rules: point.keyPoints,
  examples: point.examples,
  commonMistakes: point.commonMistakes,
  relatedPoints: []
}));

function getUnitTitle(unit: number): string {
  const titles: Record<number, string> = {
    1: 'How can we become good learners?',
    2: 'I think that mooncakes are delicious!',
    3: 'Could you please tell me where the restrooms are?',
    4: 'I used to be afraid of the dark.',
    5: 'What are the shirts made of?',
    6: 'When was it invented?',
    7: 'Teenagers should be allowed to choose their own clothes.',
    8: 'It must belong to Carla.',
    9: 'I like music that I can dance to.',
    10: 'You\'re supposed to shake hands.',
    11: 'Sad movies make me cry.',
    12: 'Life is full of the unexpected.'
  };
  return titles[unit] || `Unit ${unit}`;
}

console.log('✅ 九年级语法点转换完成');
console.log(`📊 共转换 ${convertedGrade9Points.length} 个语法点`);
console.log('\n按单元统计:');
const byUnit = convertedGrade9Points.reduce((acc, p) => {
  acc[p.unit] = (acc[p.unit] || 0) + 1;
  return acc;
}, {} as Record<number, number>);
Object.entries(byUnit).forEach(([unit, count]) => {
  console.log(`  Unit ${unit}: ${count}个语法点`);
});

export { convertedGrade9Points };
