/**
 * 词汇导入脚本
 * 从CSV文件批量导入单词到应用数据库
 */

import * as fs from 'fs';
import * as path from 'path';

interface VocabularyEntry {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  chinese: string;
  grade: number;
  semester: '上册' | '下册';
  unit: number;
  page: number;
}

/**
 * 解析CSV文件
 */
function parseCSV(filePath: string): VocabularyEntry[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // 跳过标题行
  const dataLines = lines.slice(1).filter(line => line.trim());
  
  const entries: VocabularyEntry[] = [];
  
  for (const line of dataLines) {
    const parts = line.split(',');
    if (parts.length < 8) continue;
    
    entries.push({
      word: parts[0].trim(),
      phonetic: parts[1].trim(),
      partOfSpeech: parts[2].trim(),
      chinese: parts[3].trim(),
      grade: parseInt(parts[4].trim()),
      semester: parts[5].trim() as '上册' | '下册',
      unit: parseInt(parts[6].trim()),
      page: parseInt(parts[7].trim())
    });
  }
  
  return entries;
}

/**
 * 生成TypeScript数据文件
 */
function generateDataFile(entries: VocabularyEntry[], outputPath: string) {
  const grouped: Record<string, VocabularyEntry[]> = {};
  
  // 按年级和学期分组
  for (const entry of entries) {
    const key = `grade${entry.grade}_${entry.semester}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(entry);
  }
  
  let output = `/**
 * 词汇数据 - 自动生成
 * 生成时间: ${new Date().toISOString()}
 */

export interface Vocabulary {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  chinese: string;
  grade: number;
  semester: '上册' | '下册';
  unit: number;
  page: number;
}

`;
  
  for (const [key, items] of Object.entries(grouped)) {
    const firstItem = items[0];
    const varName = `GRADE_${firstItem.grade}_${firstItem.semester === '上册' ? 'UPPER' : 'LOWER'}_VOCABULARY`;
    
    output += `export const ${varName}: Vocabulary[] = [\n`;
    
    for (const item of items) {
      output += `  {\n`;
      output += `    word: "${item.word}",\n`;
      output += `    phonetic: "${item.phonetic}",\n`;
      output += `    partOfSpeech: "${item.partOfSpeech}",\n`;
      output += `    chinese: "${item.chinese}",\n`;
      output += `    grade: ${item.grade},\n`;
      output += `    semester: "${item.semester}",\n`;
      output += `    unit: ${item.unit},\n`;
      output += `    page: ${item.page}\n`;
      output += `  },\n`;
    }
    
    output += `];\n\n`;
  }
  
  // 添加查询函数
  output += `/**
 * 获取指定年级和学期的词汇
 */
export function getVocabulary(grade: number, semester: '上册' | '下册'): Vocabulary[] {
  const varName = \`GRADE_\${grade}_\${semester === '上册' ? 'UPPER' : 'LOWER'}_VOCABULARY\`;
  
  switch (varName) {
    case 'GRADE_8_UPPER_VOCABULARY':
      return GRADE_8_UPPER_VOCABULARY;
    case 'GRADE_8_LOWER_VOCABULARY':
      return GRADE_8_LOWER_VOCABULARY;
    default:
      return [];
  }
}

/**
 * 获取指定单元的词汇
 */
export function getVocabularyByUnit(grade: number, semester: '上册' | '下册', unit: number): Vocabulary[] {
  return getVocabulary(grade, semester).filter(v => v.unit === unit);
}

/**
 * 搜索单词
 */
export function searchVocabulary(keyword: string): Vocabulary[] {
  const allVocabulary = [
    ...GRADE_8_UPPER_VOCABULARY,
    ...GRADE_8_LOWER_VOCABULARY,
  ];
  
  const lowerKeyword = keyword.toLowerCase();
  return allVocabulary.filter(v => 
    v.word.toLowerCase().includes(lowerKeyword) ||
    v.chinese.includes(keyword)
  );
}
`;
  
  fs.writeFileSync(outputPath, output, 'utf-8');
}

/**
 * 生成统计报告
 */
function generateReport(entries: VocabularyEntry[]): string {
  const stats: Record<string, any> = {};
  
  for (const entry of entries) {
    const key = `Grade ${entry.grade} ${entry.semester}`;
    if (!stats[key]) {
      stats[key] = { total: 0, units: new Set() };
    }
    stats[key].total++;
    stats[key].units.add(entry.unit);
  }
  
  let report = '词汇导入统计报告\n';
  report += '='.repeat(50) + '\n\n';
  
  for (const [key, value] of Object.entries(stats)) {
    report += `${key}:\n`;
    report += `  总单词数: ${value.total}\n`;
    report += `  单元数: ${value.units.size}\n`;
    report += `  平均每单元: ${Math.round(value.total / value.units.size)} 个单词\n\n`;
  }
  
  report += `总计: ${entries.length} 个单词\n`;
  
  return report;
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('使用方法: ts-node import-vocabulary.ts <csv文件路径>');
    console.log('示例: ts-node import-vocabulary.ts vocabulary_import_template.csv');
    process.exit(1);
  }
  
  const csvPath = args[0];
  
  if (!fs.existsSync(csvPath)) {
    console.error(`错误: 文件不存在 - ${csvPath}`);
    process.exit(1);
  }
  
  console.log('开始导入词汇...');
  console.log(`读取文件: ${csvPath}`);
  
  try {
    // 解析CSV
    const entries = parseCSV(csvPath);
    console.log(`成功解析 ${entries.length} 个单词`);
    
    // 生成数据文件
    const outputPath = path.join(__dirname, '../lib/vocabulary-data.ts');
    generateDataFile(entries, outputPath);
    console.log(`数据文件已生成: ${outputPath}`);
    
    // 生成报告
    const report = generateReport(entries);
    console.log('\n' + report);
    
    // 保存报告
    const reportPath = path.join(__dirname, '../vocabulary_import_report.txt');
    fs.writeFileSync(reportPath, report, 'utf-8');
    console.log(`报告已保存: ${reportPath}`);
    
    console.log('\n✅ 词汇导入完成!');
    
  } catch (error) {
    console.error('导入失败:', error);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}
