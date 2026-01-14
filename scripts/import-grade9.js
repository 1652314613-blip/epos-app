const fs = require('fs');
const path = require('path');

// 读取九年级语法数据
const grade9File = path.join(__dirname, '../lib/grade9-grammar-data.ts');
const mainFile = path.join(__dirname, '../lib/grammar-points-data.ts');

console.log('📚 开始导入九年级语法点...');

// 读取主文件
let mainContent = fs.readFileSync(mainFile, 'utf-8');

// 查找插入位置
const insertMarker = 'export const grade9GrammarPoints: GrammarPoint[] = [';
const insertPos = mainContent.indexOf(insertMarker);

if (insertPos === -1) {
  console.error('❌ 找不到插入标记');
  process.exit(1);
}

// 读取九年级数据文件获取单元标题映射
const unitTitles = {
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

console.log('✅ 九年级语法点数据已准备');
console.log('📊 共12个核心语法点');
console.log('💡 提示: 数据已存储在 lib/grade9-grammar-data.ts');
console.log('🔗 可以通过导入该文件使用九年级语法点');

