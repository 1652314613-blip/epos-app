// 课文带学模块 - Mock数据 (九年级英语)

import { TextbookReading, ReadingContent } from './textbook-reading-types';

// Unit 1 - Friendship (Reading)
const GRADE9_UNIT1_READING: TextbookReading = {
  id: '9a_u1_reading',
  grade: 9,
  book: '9A',
  unit: 1,
  title: 'Unit 1 Friendship',
  subtitle: 'Reading: Anne\'s Best Friend',
  content: [
    {
      id: 'para1',
      type: 'paragraph',
      text: 'Do you want a friend whom you could tell everything to, like your deepest feelings and thoughts? Or are you afraid that your friend would laugh at you, or would not understand what you are going through?',
      translation: '你想要一个能够倾诉一切的朋友吗,比如你最深的感受和想法?还是你害怕你的朋友会嘲笑你,或者不理解你正在经历的事情?',
      keyPoints: [
        {
          id: 'kp1',
          type: 'grammar',
          text: 'whom you could tell everything to',
          startIndex: 22,
          endIndex: 53,
          explanation: '定语从句:whom引导定语从句修饰friend,whom在从句中作介词to的宾语。注意介词to可以放在whom前面(to whom)或句末。',
          examples: [
            'The person to whom I spoke was very helpful.',
            'The person whom I spoke to was very helpful.'
          ]
        },
        {
          id: 'kp2',
          type: 'phrase',
          text: 'go through',
          startIndex: 156,
          endIndex: 166,
          explanation: '短语动词:go through表示"经历,遭受(困难、痛苦等)"。',
          examples: [
            'She\'s going through a difficult time.',
            'We all go through changes in our lives.'
          ]
        }
      ]
    },
    {
      id: 'para2',
      type: 'paragraph',
      text: 'Anne Frank wanted the first kind of friend. She lived in Amsterdam in the Netherlands during World War II. Her family was Jewish so they had to hide or they would be caught by the German Nazis.',
      translation: '安妮·弗兰克想要第一种朋友。她在第二次世界大战期间住在荷兰的阿姆斯特丹。她的家人是犹太人,所以他们不得不躲藏起来,否则就会被德国纳粹抓住。',
      keyPoints: [
        {
          id: 'kp3',
          type: 'grammar',
          text: 'so they had to hide or they would be caught',
          startIndex: 140,
          endIndex: 183,
          explanation: '因果关系和虚拟语气:so引导结果状语从句;or表示"否则",后接虚拟语气would be caught,表示可能的后果。',
          examples: [
            'Hurry up, or we\'ll be late.',
            'Study hard, or you won\'t pass the exam.'
          ]
        }
      ]
    },
    {
      id: 'para3',
      type: 'paragraph',
      text: 'She and her family hid away for nearly twenty-five months before they were discovered. During that time the only true friend was her diary. She said, "I don\'t want to set down a series of facts in a diary as most people do, but I want this diary itself to be my friend, and I shall call my friend Kitty."',
      translation: '她和家人躲藏了将近25个月才被发现。在那段时间里,她唯一真正的朋友就是她的日记。她说:"我不想像大多数人那样在日记中记流水账,而是想让日记本身成为我的朋友,我要把这个朋友称作基蒂。"',
      keyPoints: [
        {
          id: 'kp4',
          type: 'phrase',
          text: 'hide away',
          startIndex: 20,
          endIndex: 29,
          explanation: '短语动词:hide away表示"躲藏起来,隐藏"。',
          examples: [
            'The children hid away in the attic.',
            'He hid away from his responsibilities.'
          ]
        },
        {
          id: 'kp5',
          type: 'phrase',
          text: 'set down',
          startIndex: 144,
          endIndex: 152,
          explanation: '短语动词:set down表示"记下,写下"。',
          examples: [
            'Let me set down your address.',
            'She set down everything that happened.'
          ]
        },
        {
          id: 'kp6',
          type: 'phrase',
          text: 'a series of',
          startIndex: 153,
          endIndex: 164,
          explanation: '固定搭配:a series of表示"一系列,一连串"。',
          examples: [
            'A series of accidents happened yesterday.',
            'The book is a series of short stories.'
          ]
        }
      ]
    },
    {
      id: 'para4',
      type: 'paragraph',
      text: 'Now read how she felt after being in the hiding place since July 1942. Thursday 15th June, 1944. Dear Kitty, I wonder if it\'s because I haven\'t been able to be outdoors for so long that I\'ve grown so crazy about everything to do with nature.',
      translation: '现在来读一读自1942年7月以来,她在藏身之处的感受。1944年6月15日,星期四。亲爱的基蒂,我不知道这是不是因为我太久不能去户外的缘故,我变得对一切与大自然有关的事物都无比狂热。',
      keyPoints: [
        {
          id: 'kp7',
          type: 'grammar',
          text: 'I wonder if it\'s because... that...',
          startIndex: 92,
          endIndex: 190,
          explanation: '强调句型:it\'s... that...强调句,强调原因状语because从句。wonder if表示"想知道是否"。',
          examples: [
            'I wonder if it\'s because of the weather that he didn\'t come.',
            'She wonders if it\'s true that he left.'
          ]
        },
        {
          id: 'kp8',
          type: 'phrase',
          text: 'grow crazy about',
          startIndex: 165,
          endIndex: 181,
          explanation: '短语:grow crazy about表示"变得对...狂热/着迷"。grow在此表示"变得,逐渐"。',
          examples: [
            'He has grown crazy about football.',
            'She grew crazy about classical music.'
          ]
        }
      ]
    }
  ],
  vocabulary: ['deepest', 'feelings', 'thoughts', 'Jewish', 'hide', 'caught', 'Nazis', 'diary', 'series', 'outdoors', 'nature'],
  grammarPoints: ['定语从句(关系代词whom)', '虚拟语气', '强调句型', '短语动词'],
  difficulty: 'intermediate'
};

// Import Grade 7 readings
import { GRADE7_READINGS_DATA } from './grade7-readings-generated';

// 导出所有课文数据
export const TEXTBOOK_READINGS: TextbookReading[] = [
  ...GRADE7_READINGS_DATA,
  GRADE9_UNIT1_READING
];

// 根据ID获取课文
export function getReadingById(id: string): TextbookReading | undefined {
  return TEXTBOOK_READINGS.find(r => r.id === id);
}

// 根据年级和单元获取课文
export function getReadingByUnit(grade: number, book: string, unit: number): TextbookReading | undefined {
  return TEXTBOOK_READINGS.find(r => r.grade === grade && r.book === book && r.unit === unit);
}

// 获取所有九年级课文
export function getGrade9Readings(): TextbookReading[] {
  return TEXTBOOK_READINGS.filter(r => r.grade === 9);
}
