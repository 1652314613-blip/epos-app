/**
 * 七年级上册完整词汇数据（全部221个词汇）
 * 基于人教版2025秋季新教材词汇表，提供原创学习内容
 */

import type { TextbookWord } from './textbook-vocabulary';

// 辅助函数：创建词汇对象
function w(
  id: string,
  word: string,
  phonetic: string,
  unit: number,
  pos: string,
  meaning: string,
  ex1: string,
  ex2: string,
  diff: 'basic' | 'intermediate' | 'advanced' = 'basic',
  freq: 'high' | 'medium' | 'low' = 'high'
): TextbookWord {
  return {
    id,
    word,
    phonetic,
    grade: 7,
    book: '7A',
    unit,
    definitions: [{ partOfSpeech: pos, meaning, exampleSentence: ex1 }],
    examples: [ex1, ex2],
    difficulty: diff,
    frequency: freq,
  };
}

// Unit 1: You and Me (27 words)
export const UNIT1_WORDS: TextbookWord[] = [
  w('7a_u1_01', 'make friends', '', 1, 'phrase', '交朋友', 'I want to make friends with you.', 'She likes to make friends at school.'),
  w('7a_u1_02', 'get to know', '', 1, 'phrase', '认识；了解', "Let's get to know each other.", 'I want to get to know my classmates.'),
  w('7a_u1_03', 'each', '/iːtʃ/', 1, 'adj. & pron.', '每个；各自', 'Each student has a book.', 'They each have different hobbies.'),
  w('7a_u1_04', 'other', '/ˈʌðə(r)/', 1, 'adj. & pron.', '另外的；其他的', 'Do you have any other questions?', 'Some like math, others like English.'),
  w('7a_u1_05', 'each other', '', 1, 'phrase', '互相；彼此', 'We help each other.', 'They know each other well.'),
  w('7a_u1_06', 'full', '/fʊl/', 1, 'adj.', '完整的；满的', 'Please write your full name.', 'The room is full of people.'),
  w('7a_u1_07', 'full name', '', 1, 'n.', '全名', 'My full name is Li Ming.', 'What is your full name?'),
  w('7a_u1_08', 'grade', '/ɡreɪd/', 1, 'n.', '年级；等级', 'I am in Grade 7.', 'What grade are you in?'),
  w('7a_u1_09', 'last name', '', 1, 'n.', '姓氏', 'My last name is Wang.', 'What is your last name?'),
  w('7a_u1_10', 'classmate', '/ˈklɑːsmeɪt/', 1, 'n.', '同班同学', 'She is my classmate.', 'I have many classmates.'),
  w('7a_u1_11', 'class teacher', '', 1, 'n.', '班主任', 'Our class teacher is very kind.', 'The class teacher teaches us English.', 'basic', 'medium'),
  w('7a_u1_12', 'first name', '', 1, 'n.', '名字', 'My first name is Tom.', 'What is your first name?'),
  w('7a_u1_13', 'mistake', '/mɪˈsteɪk/', 1, 'n.', '错误；失误', 'Everyone makes mistakes.', 'I made a mistake in my homework.'),
  w('7a_u1_14', 'country', '/ˈkʌntri/', 1, 'n.', '国家', 'China is a big country.', 'What country are you from?'),
  w('7a_u1_15', 'same', '/seɪm/', 1, 'adj.', '相同的', 'We are in the same class.', 'They have the same hobby.'),
  w('7a_u1_16', 'twin', '/twɪn/', 1, 'n.', '双胞胎之一', 'She has a twin sister.', 'The twins look very similar.', 'basic', 'medium'),
  w('7a_u1_17', 'both', '/bəʊθ/', 1, 'adj. & pron.', '两个；两个都', 'Both of them are students.', 'I like both apples and oranges.'),
  w('7a_u1_18', 'band', '/bænd/', 1, 'n.', '乐队', 'He plays in a band.', 'The band is very popular.', 'basic', 'medium'),
  w('7a_u1_19', 'pot', '/pɒt/', 1, 'n.', '锅', 'Put the vegetables in the pot.', 'The pot is on the stove.', 'basic', 'medium'),
  w('7a_u1_20', 'a lot', '', 1, 'phrase', '很；非常', 'I like English a lot.', 'She helps me a lot.'),
  w('7a_u1_21', 'guitar', '/ɡɪˈtɑː(r)/', 1, 'n.', '吉他', 'He can play the guitar.', 'I want to learn guitar.', 'basic', 'medium'),
  w('7a_u1_22', 'tennis', '/ˈtenɪs/', 1, 'n.', '网球', 'Do you like playing tennis?', 'Tennis is a popular sport.', 'basic', 'medium'),
  w('7a_u1_23', 'post', '/pəʊst/', 1, 'n. & v.', '帖子；邮寄；发布', 'I will post a message online.', 'She posted a photo.', 'basic', 'medium'),
  w('7a_u1_24', 'even', '/ˈiːvn/', 1, 'adv.', '甚至；连', 'He can even speak three languages.', 'She is even taller than her brother.', 'intermediate'),
  w('7a_u1_25', 'would', '/wʊd/', 1, 'modal v.', '想；将会', 'Would you like some tea?', 'I would like to help you.', 'intermediate'),
  w('7a_u1_26', 'information', '/ˌɪnfəˈmeɪʃn/', 1, 'n.', '信息；消息', 'Can you give me some information?', 'This book has useful information.', 'intermediate'),
  w('7a_u1_27', 'hobby', '/ˈhɒbi/', 1, 'n.', '业余爱好', 'My hobby is reading books.', 'What is your hobby?'),
];

// Unit 2: We're Family (28 words)
export const UNIT2_WORDS: TextbookWord[] = [
  w('7a_u2_01', 'mean', '/miːn/', 2, 'v.', '意思是；打算', 'What does this word mean?', 'I mean to help you.'),
  w('7a_u2_02', 'husband', '/ˈhʌzbənd/', 2, 'n.', '丈夫', 'Her husband is a doctor.', 'This is my husband.'),
  w('7a_u2_03', 'bat', '/bæt/', 2, 'n.', '球棒；球拍', 'He has a new baseball bat.', 'Can I borrow your bat?', 'basic', 'medium'),
  w('7a_u2_04', 'ping-pong', '/ˈpɪŋpɒŋ/', 2, 'n.', '乒乓球', 'Do you like playing ping-pong?', 'Ping-pong is popular in China.'),
  w('7a_u2_05', 'every day', '', 2, 'phrase', '每天', 'I exercise every day.', 'She reads English every day.'),
  w('7a_u2_06', 'together', '/təˈɡeðə(r)/', 2, 'adv.', '在一起；共同', 'We study together.', "Let's work together."),
  w('7a_u2_07', 'fishing rod', '/ˈfɪʃɪŋ rɒd/', 2, 'n.', '钓竿', 'He bought a new fishing rod.', 'My father has a fishing rod.', 'basic', 'medium'),
  w('7a_u2_08', 'spend', '/spend/', 2, 'v.', '花（时间、钱等）', 'I spend two hours on homework.', 'She spends a lot of time reading.'),
  w('7a_u2_09', 'a lot of', '', 2, 'phrase', '大量；许多', 'I have a lot of friends.', 'She has a lot of books.'),
  w('7a_u2_10', 'really', '/ˈriːəli/', 2, 'adv.', '非常；确实；真正地', 'I really like this book.', 'She is really kind.'),
  w('7a_u2_11', 'activity', '/ækˈtɪvəti/', 2, 'n.', '活动', 'We have many activities at school.', 'Sports is my favorite activity.'),
  w('7a_u2_12', 'chess', '/tʃes/', 2, 'n.', '国际象棋', 'Do you know how to play chess?', 'Chess is a strategy game.'),
  w('7a_u2_13', 'funny', '/ˈfʌni/', 2, 'adj.', '好笑的；奇怪的', 'He told a funny joke.', "That's a funny story."),
  w('7a_u2_14', 'laugh', '/lɑːf/', 2, 'v. & n.', '笑；发笑', 'The joke made me laugh.', 'I heard her laugh.'),
  w('7a_u2_15', 'different', '/ˈdɪfrənt/', 2, 'adj.', '不同的', 'We have different hobbies.', 'They are from different countries.'),
  w('7a_u2_16', 'violin', '/ˌvaɪəˈlɪn/', 2, 'n.', '小提琴', 'She can play the violin.', 'I want to learn violin.', 'basic', 'medium'),
  w('7a_u2_17', 'have fun', '', 2, 'phrase', '玩得愉快', 'We had fun at the party.', 'Have fun at school!'),
  w('7a_u2_18', 'pink', '/pɪŋk/', 2, 'adj. & n.', '粉红色（的）', 'She likes pink flowers.', 'Pink is her favorite color.'),
  w('7a_u2_19', 'hat', '/hæt/', 2, 'n.', '帽子', 'He is wearing a red hat.', 'Where is my hat?'),
  w('7a_u2_20', 'handsome', '/ˈhænsəm/', 2, 'adj.', '英俊的', 'He is a handsome boy.', 'My brother is very handsome.'),
  w('7a_u2_21', 'knee', '/niː/', 2, 'n.', '膝；膝盖', 'I hurt my knee.', 'He fell on his knees.', 'basic', 'medium'),
  w('7a_u2_22', 'at night', '', 2, 'phrase', '在夜晚', 'I study at night.', 'Stars come out at night.'),
  w('7a_u2_23', 'in the middle', '', 2, 'phrase', '中间；中部', 'He sits in the middle.', 'The table is in the middle of the room.'),
  w('7a_u2_24', 'grandchild', '/ˈɡræntʃaɪld/', 2, 'n.', '孙子；孙女', 'She has three grandchildren.', 'He is my grandchild.', 'basic', 'medium'),
  w('7a_u2_25', 'son', '/sʌn/', 2, 'n.', '儿子', 'He has two sons.', 'This is my son.'),
  w('7a_u2_26', 'next to', '', 2, 'phrase', '紧邻；在近旁', 'She sits next to me.', 'The library is next to the school.'),
  w('7a_u2_27', 'hike', '/haɪk/', 2, 'v. & n.', '远足；徒步旅行', 'We like to hike in the mountains.', "Let's go for a hike."),
  w('7a_u2_28', 'go hiking', '', 2, 'phrase', '远足；徒步旅行', 'We go hiking every weekend.', 'Do you want to go hiking?'),
];

// Unit 3: My School (39 words)
export const UNIT3_WORDS: TextbookWord[] = [
  w('7a_u3_01', 'hall', '/hɔːl/', 3, 'n.', '礼堂；大厅', 'The school hall is very big.', 'We have meetings in the hall.'),
  w('7a_u3_02', 'dining hall', '', 3, 'n.', '餐厅', 'The dining hall is on the first floor.', 'We eat lunch in the dining hall.'),
  w('7a_u3_03', 'in front of', '', 3, 'phrase', '在……前面', 'The library is in front of the gym.', 'She stands in front of the class.'),
  w('7a_u3_04', 'building', '/ˈbɪldɪŋ/', 3, 'n.', '建筑物；房子', 'This is a tall building.', 'Our school has three buildings.'),
  w('7a_u3_05', 'across', '/əˈkrɒs/', 3, 'prep. & adv.', '过；穿过', 'Walk across the street.', 'The park is across from the school.'),
  w('7a_u3_06', 'across from', '', 3, 'phrase', '在对面', 'The library is across from the gym.', 'I live across from the park.'),
  w('7a_u3_07', 'field', '/fiːld/', 3, 'n.', '场地；田地', 'We play football on the field.', 'There is a big field behind the school.'),
  w('7a_u3_08', 'sports field', '', 3, 'n.', '运动场', 'The sports field is very large.', 'Students exercise on the sports field.'),
  w('7a_u3_09', 'gym', '/dʒɪm/', 3, 'n.', '体育馆；健身房', 'We have PE class in the gym.', 'The gym is next to the library.'),
  w('7a_u3_10', 'office', '/ˈɒfɪs/', 3, 'n.', '办公室', 'The teacher is in the office.', 'Where is the principal office?', 'basic', 'medium'),
  w('7a_u3_11', 'large', '/lɑːdʒ/', 3, 'adj.', '大的；大号的', 'This is a large classroom.', 'She has a large family.'),
  w('7a_u3_12', 'special', '/ˈspeʃl/', 3, 'adj.', '特别的；特殊的', 'Today is a special day.', 'She is a special friend.'),
  w('7a_u3_13', 'smart', '/smɑːt/', 3, 'adj.', '智能的；聪明的', 'He is a smart student.', 'This is a smart phone.'),
  w('7a_u3_14', 'whiteboard', '/ˈwaɪtbɔːd/', 3, 'n.', '白板；白色书写板', 'The teacher writes on the whiteboard.', 'We have a new whiteboard.'),
  w('7a_u3_15', 'put up', '', 3, 'phrase', '张贴；搭建', 'We put up posters on the wall.', 'They put up a tent.'),
  w('7a_u3_16', 'important', '/ɪmˈpɔːtnt/', 3, 'adj.', '重要的', 'This is an important message.', 'English is very important.'),
  w('7a_u3_17', 'notice', '/ˈnəʊtɪs/', 3, 'n. & v.', '通知；注意；注意到', 'Did you see the notice?', 'I notice a new student.'),
  w('7a_u3_18', 'locker', '/ˈlɒkə(r)/', 3, 'n.', '有锁存物柜；寄物柜', 'My locker number is 15.', 'Put your bag in the locker.', 'basic', 'medium'),
  w('7a_u3_19', 'drawer', '/drɔː(r)/', 3, 'n.', '抽屉', 'The books are in the drawer.', 'Open the top drawer.', 'basic', 'medium'),
  w('7a_u3_20', 'at the back of', '', 3, 'phrase', '在……后面', 'He sits at the back of the classroom.', 'The garden is at the back of the house.'),
  w('7a_u3_21', 'corner', '/ˈkɔːnə(r)/', 3, 'n.', '角；墙角；街角', 'The desk is in the corner.', 'Turn left at the corner.'),
  w('7a_u3_22', 'bookcase', '/ˈbʊkkeɪs/', 3, 'n.', '书柜；书柜', 'We have a big bookcase.', 'Put the books in the bookcase.'),
  w('7a_u3_23', 'screen', '/skriːn/', 3, 'n.', '屏幕；银幕', 'Look at the screen.', 'The screen is very big.'),
  w('7a_u3_24', 'at school', '', 3, 'phrase', '在学校', 'I am at school now.', 'She studies hard at school.'),
  w('7a_u3_25', 'modern', '/ˈmɒdn/', 3, 'adj.', '现代的；当代的', 'This is a modern building.', 'We live in a modern city.'),
  w('7a_u3_26', 'do exercises', '', 3, 'phrase', '做体操', 'We do exercises every morning.', 'Doing exercises is good for health.'),
  w('7a_u3_27', 'amazing', '/əˈmeɪzɪŋ/', 3, 'adj.', '令人惊奇的', 'The show is amazing.', 'She has an amazing talent.'),
  w('7a_u3_28', 'raise', '/reɪz/', 3, 'v.', '使升高；提高', 'Raise your hand if you know.', 'They raise the flag every morning.'),
  w('7a_u3_29', 'flag', '/flæɡ/', 3, 'n.', '旗；旗帜', 'The national flag is red.', 'We raise the flag on Monday.'),
  w('7a_u3_30', 'most', '/məʊst/', 3, 'adj. & pron.', '大多数；最多', 'Most students like sports.', 'She has the most books.'),
  w('7a_u3_31', 'change', '/tʃeɪndʒ/', 3, 'v. & n.', '改变；变化', 'The weather may change.', 'There is a big change in the school.'),
  w('7a_u3_32', 'seat', '/siːt/', 3, 'n.', '座位', 'This is my seat.', 'Please take a seat.'),
  w('7a_u3_33', 'delicious', '/dɪˈlɪʃəs/', 3, 'adj.', '美味的；可口的', 'The food is delicious.', 'She cooks delicious meals.'),
  w('7a_u3_34', 'How about', '', 3, 'phrase', '怎么样；如何', 'How about going to the park?', 'How about this one?'),
  w('7a_u3_35', 'yours', '/jɔːz/', 3, 'pron.', '你的；您的', 'This book is yours.', 'Is this pen yours?'),
  w('7a_u3_36', 'similar', '/ˈsɪmələ(r)/', 3, 'adj.', '类似的；相像的', 'Our schools are similar.', 'They have similar interests.'),
  w('7a_u3_37', 'similar to', '', 3, 'phrase', '类似于；相像的', 'My school is similar to yours.', 'This book is similar to that one.'),
  w('7a_u3_38', 'sound', '/saʊnd/', 3, 'v.', '听起来；好像', 'That sounds good.', 'It sounds like fun.'),
  w('7a_u3_39', 'bye for now', '', 3, 'phrase', '再见', 'Bye for now! See you tomorrow.', 'Bye for now! Take care.'),
];

// Unit 4: My Favourite Subject (32 words)
export const UNIT4_WORDS: TextbookWord[] = [
  w('7a_u4_01', 'biology', '/baɪˈɒlədʒi/', 4, 'n.', '生物学', 'I like biology class.', 'Biology is interesting.'),
  w('7a_u4_02', 'IT', '/ˌaɪ ˈtiː/', 4, 'n.', '信息技术', 'IT is my favorite subject.', 'We learn computers in IT class.'),
  w('7a_u4_03', 'geography', '/dʒiˈɒɡrəfi/', 4, 'n.', '地理学', 'Geography is about the earth.', 'I study geography every week.'),
  w('7a_u4_04', 'history', '/ˈhɪstri/', 4, 'n.', '历史；历史课', 'History tells us about the past.', 'I love learning history.'),
  w('7a_u4_05', 'boring', '/ˈbɔːrɪŋ/', 4, 'adj.', '乏味的；令人生厌的', 'The movie is boring.', 'I think math is boring.'),
  w('7a_u4_06', 'useful', '/ˈjuːsfl/', 4, 'adj.', '有用的；有益的', 'English is very useful.', 'This book is useful for students.'),
  w('7a_u4_07', 'exciting', '/ɪkˈsaɪtɪŋ/', 4, 'adj.', '令人激动的；使人兴奋的', 'The game is very exciting.', 'We had an exciting trip.'),
  w('7a_u4_08', 'past', '/pɑːst/', 4, 'n. & adj.', '过去；过去的', 'We learn about the past in history.', 'In the past, life was different.'),
  w('7a_u4_09', 'good with', '', 4, 'phrase', '擅长于；善于应付', 'She is good with children.', 'He is good with computers.'),
  w('7a_u4_10', 'number', '/ˈnʌmbə(r)/', 4, 'n.', '数字；号码', 'What is your phone number?', 'Write down the numbers.'),
  w('7a_u4_11', 'help sb with', '', 4, 'phrase', '帮助某人做某事', 'Can you help me with my homework?', 'She helps me with English.'),
  w('7a_u4_12', 'reason', '/ˈriːzn/', 4, 'n.', '原因；理由', 'What is the reason?', 'Tell me the reason why you are late.'),
  w('7a_u4_13', 'listen to', '', 4, 'phrase', '听；倾听', 'Listen to the teacher.', 'I like to listen to music.'),
  w('7a_u4_14', 'good at', '', 4, 'phrase', '擅长', 'She is good at math.', 'I am good at playing basketball.'),
  w('7a_u4_15', 'remember', '/rɪˈmembə(r)/', 4, 'v.', '记住；记起', 'Remember to bring your book.', 'I remember his name.'),
  w('7a_u4_16', 'everyone', '/ˈevriwʌn/', 4, 'pron.', '每人；所有人', 'Everyone is here.', 'Everyone likes the new teacher.'),
  w('7a_u4_17', 'as', '/æz/', 4, 'prep. & conj.', '如同；作为', 'She works as a teacher.', 'Do as I say.'),
  w('7a_u4_18', 'AM', '/ˌeɪ ˈem/', 4, 'abbr.', '上午', 'The class starts at 8 AM.', 'I wake up at 7 AM.'),
  w('7a_u4_19', 'PM', '/ˌpiː ˈem/', 4, 'abbr.', '下午；午后', 'School ends at 3 PM.', 'The meeting is at 2 PM.'),
  w('7a_u4_20', 'French', '/frentʃ/', 4, 'n. & adj.', '法语；法国的；法国人的', 'She can speak French.', 'I am learning French.'),
  w('7a_u4_21', 'excellent', '/ˈeksələnt/', 4, 'adj.', '优秀的；极好的', 'Your work is excellent.', 'She is an excellent student.'),
  w('7a_u4_22', 'instrument', '/ˈɪnstrəmənt/', 4, 'n.', '器械；工具', 'He plays a musical instrument.', 'What instrument do you play?', 'basic', 'medium'),
  w('7a_u4_23', 'singer', '/ˈsɪŋə(r)/', 4, 'n.', '歌手', 'She is a famous singer.', 'I want to be a singer.'),
  w('7a_u4_24', 'future', '/ˈfjuːtʃə(r)/', 4, 'n.', '将来；未来', 'What do you want to do in the future?', 'The future is bright.'),
  w('7a_u4_25', 'in the future', '', 4, 'phrase', '将来；未来', 'I want to be a teacher in the future.', 'What will you do in the future?'),
  w('7a_u4_26', 'term', '/tɜːm/', 4, 'n.', '学期', 'This is the first term.', 'We have three terms in a year.'),
  w('7a_u4_27', 'work out', '', 4, 'phrase', '计算出；解决', 'Can you work out this problem?', 'We need to work out a plan.'),
  w('7a_u4_28', 'problem', '/ˈprɒbləm/', 4, 'n.', '难题；困难', 'This is a difficult problem.', 'Do you have any problems?'),
  w('7a_u4_29', 'in class', '', 4, 'phrase', '课堂上', 'Listen carefully in class.', 'We learn a lot in class.'),
  w('7a_u4_30', 'magic', '/ˈmædʒɪk/', 4, 'n. & adj.', '魔法；魔力；魔术；有魔力的；有神奇力量的', 'The show has magic tricks.', 'It is a magic moment.'),
  w('7a_u4_31', 'life', '/laɪf/', 4, 'n.', '生活；生命', 'School life is interesting.', 'I love my life.'),
  w('7a_u4_32', 'scientist', '/ˈsaɪəntɪst/', 4, 'n.', '科学家', 'He is a famous scientist.', 'I want to be a scientist.'),
];

// Unit 5: Fun Clubs (33 words)
export const UNIT5_WORDS: TextbookWord[] = [
  w('7a_u5_01', 'club', '/klʌb/', 5, 'n.', '俱乐部；社团', 'I joined the music club.', 'What club are you in?'),
  w('7a_u5_02', 'join', '/dʒɔɪn/', 5, 'v.', '参加；加入', 'Do you want to join our team?', 'She joined the club last week.'),
  w('7a_u5_03', 'choose', '/tʃuːz/', 5, 'v.', '选择；挑选', 'Choose your favorite book.', 'I choose to study English.'),
  w('7a_u5_04', 'drama', '/ˈdrɑːmə/', 5, 'n.', '戏剧；戏剧表演', 'We are doing a drama.', 'She likes drama class.'),
  w('7a_u5_05', 'play Chinese chess', '', 5, 'phrase', '下中国象棋', 'My grandfather can play Chinese chess.', 'Do you know how to play Chinese chess?'),
  w('7a_u5_06', 'feeling', '/ˈfiːlɪŋ/', 5, 'n.', '感觉；情感', 'I have a good feeling about this.', 'What is your feeling?'),
  w('7a_u5_07', 'news', '/njuːz/', 5, 'n.', '消息；新闻', 'I have good news for you.', 'Did you hear the news?'),
  w('7a_u5_08', 'musical', '/ˈmjuːzɪkl/', 5, 'adj.', '音乐的；有音乐天赋的', 'She is very musical.', 'We watched a musical show.'),
  w('7a_u5_09', 'musical instrument', '', 5, 'n.', '乐器', 'He plays many musical instruments.', 'What musical instrument can you play?', 'basic', 'medium'),
  w('7a_u5_10', 'exactly', '/ɪɡˈzæktli/', 5, 'adv.', '正是如此；准确地', 'That is exactly right.', 'Tell me exactly what happened.'),
  w('7a_u5_11', 'drum', '/drʌm/', 5, 'n.', '鼓', 'He can play the drum.', 'The drum is very loud.', 'basic', 'medium'),
  w('7a_u5_12', 'ability', '/əˈbɪləti/', 5, 'n.', '能力；才能', 'She has the ability to learn quickly.', 'Everyone has different abilities.'),
  w('7a_u5_13', 'paint', '/peɪnt/', 5, 'v. & n.', '用颜料画；油漆；涂料', 'I like to paint pictures.', 'The paint is still wet.'),
  w('7a_u5_14', 'climb', '/klaɪm/', 5, 'v.', '攀登；爬', 'We climb the mountain.', 'Can you climb trees?'),
  w('7a_u5_15', 'more', '/mɔː(r)/', 5, 'adj. & pron.', '更多的', 'I need more time.', 'Tell me more about it.'),
  w('7a_u5_16', 'act', '/ækt/', 5, 'v. & n.', '扩演；行动；一幕；行动', 'She can act very well.', 'This is a kind act.'),
  w('7a_u5_17', 'act out', '', 5, 'phrase', '表演', 'Let us act out the story.', 'They act out a play.'),
  w('7a_u5_18', 'at home', '', 5, 'phrase', '在家里', 'I study at home.', 'She stays at home today.'),
  w('7a_u5_19', 'interested', '/ˈɪntrəstɪd/', 5, 'adj.', '感兴趣的', 'I am interested in music.', 'She is interested in science.'),
  w('7a_u5_20', 'interested in', '', 5, 'phrase', '对……感兴趣', 'He is interested in sports.', 'Are you interested in art?'),
  w('7a_u5_21', 'nature', '/ˈneɪtʃə(r)/', 5, 'n.', '自然界；大自然', 'I love nature.', 'We should protect nature.'),
  w('7a_u5_22', 'beef', '/biːf/', 5, 'n.', '牛肉', 'I like beef noodles.', 'Beef is delicious.', 'basic', 'medium'),
  w('7a_u5_23', 'soon', '/suːn/', 5, 'adv.', '不久；很快', 'See you soon.', 'The movie will start soon.'),
  w('7a_u5_24', 'than', '/ðæn/', 5, 'prep. & conj.', '比', 'She is taller than me.', 'I like apples more than oranges.'),
  w('7a_u5_25', 'more than', '', 5, 'phrase', '多于', 'I have more than ten books.', 'She is more than a friend.'),
  w('7a_u5_26', 'mind', '/maɪnd/', 5, 'n.', '头脑；心思', 'I changed my mind.', 'Keep an open mind.'),
  w('7a_u5_27', 'fall', '/fɔːl/', 5, 'v. & n.', '进入；掉落；跌倒；秋天', 'Be careful not to fall.', 'Leaves fall in autumn.'),
  w('7a_u5_28', 'fall in love with', '', 5, 'phrase', '爱上', 'I fell in love with music.', 'She fell in love with the city.'),
  w('7a_u5_29', 'take photos', '', 5, 'phrase', '拍照', 'I like to take photos.', 'Let us take photos together.'),
  w('7a_u5_30', 'collect', '/kəˈlekt/', 5, 'v.', '收集；采集', 'I collect stamps.', 'She collects coins.'),
  w('7a_u5_31', 'insect', '/ˈɪnsekt/', 5, 'n.', '昆虫', 'There are many insects in the garden.', 'He studies insects.', 'basic', 'medium'),
  w('7a_u5_32', 'discover', '/dɪˈskʌvə(r)/', 5, 'v.', '发现；发觉', 'Scientists discover new things.', 'I discovered a new park.'),
  w('7a_u5_33', 'wildlife', '/ˈwaɪldlaɪf/', 5, 'n.', '野生动物；野生生物', 'We should protect wildlife.', 'I love watching wildlife.'),
];

// Unit 6: A Day in the Life (34 words)
export const UNIT6_WORDS: TextbookWord[] = [
  w('7a_u6_01', 'make use of', '', 6, 'phrase', '使用；利用', 'We should make use of our time.', 'Make use of this opportunity.'),
  w('7a_u6_02', 'shower', '/ˈʃaʊə(r)/', 6, 'n. & v.', '淋浴；淋浴器；洗淋浴', 'I take a shower every morning.', 'The shower is broken.'),
  w('7a_u6_03', 'take a shower', '', 6, 'phrase', '淋浴', 'I take a shower before bed.', 'He takes a shower after exercise.'),
  w('7a_u6_04', 'get dressed', '', 6, 'phrase', '穿衣服', 'Get dressed quickly!', 'She gets dressed for school.'),
  w('7a_u6_05', 'brush', '/brʌʃ/', 6, 'v. & n.', '刷子；刷', 'Brush your teeth twice a day.', 'I need a new brush.'),
  w('7a_u6_06', 'tooth', '/tuːθ/', 6, 'n.', '牙齿', 'I have a toothache.', 'Brush your teeth every day.'),
  w('7a_u6_07', 'duty', '/ˈdjuːti/', 6, 'n.', '值班；职责', 'I am on duty today.', 'It is my duty to help.'),
  w('7a_u6_08', 'on duty', '', 6, 'phrase', '值班', 'Who is on duty today?', 'The teacher is on duty.'),
  w('7a_u6_09', 'usually', '/ˈjuːʒuəli/', 6, 'adv.', '通常地；一般地', 'I usually get up at 7.', 'She usually walks to school.'),
  w('7a_u6_10', 'get up', '', 6, 'phrase', '起床；站起', 'I get up early every day.', 'Get up! It is time for school.'),
  w('7a_u6_11', 'reporter', '/rɪˈpɔːtə(r)/', 6, 'n.', '记者', 'She is a news reporter.', 'The reporter asked many questions.'),
  w('7a_u6_12', 'around', '/əˈraʊnd/', 6, 'prep. & adv.', '大约；环绕；到处', 'I wake up around 6 AM.', 'Let us walk around the park.'),
  w('7a_u6_13', 'homework', '/ˈhəʊmwɜːk/', 6, 'n.', '家庭作业', 'I do my homework after dinner.', 'Do you have much homework?'),
  w('7a_u6_14', 'go to bed', '', 6, 'phrase', '上床睡觉', 'I go to bed at 10 PM.', 'Go to bed early tonight.'),
  w('7a_u6_15', 'saying', '/ˈseɪɪŋ/', 6, 'n.', '谚语；格言', 'There is a saying about this.', 'Do you know this saying?'),
  w('7a_u6_16', 'rise', '/raɪz/', 6, 'v. & n.', '起床；升起；增长；增加；增强', 'The sun rises in the east.', 'Prices rise every year.'),
  w('7a_u6_17', 'stay', '/steɪ/', 6, 'v.', '停留；待', 'Stay here and wait.', 'I stay at home on weekends.'),
  w('7a_u6_18', 'routine', '/ruːˈtiːn/', 6, 'n.', '常规', 'I have a daily routine.', 'Follow your routine.'),
  w('7a_u6_19', 'restaurant', '/ˈrestrɒnt/', 6, 'n.', '餐馆；餐厅', 'We eat at a restaurant.', 'This restaurant is very popular.'),
  w('7a_u6_20', 'housework', '/ˈhaʊswɜːk/', 6, 'n.', '家务劳动', 'I help with housework.', 'Doing housework is important.'),
  w('7a_u6_21', 'while', '/waɪl/', 6, 'n. & conj.', '一段时间；一会儿；在……期间；当……的时候', 'Wait here for a while.', 'I read while she cooks.'),
  w('7a_u6_22', 'weekend', '/ˌwiːkˈend/', 6, 'n.', '周末', 'What do you do on the weekend?', 'I relax on weekends.'),
  w('7a_u6_23', 'daily', '/ˈdeɪli/', 6, 'adj.', '每日的；日常的', 'This is my daily routine.', 'I read the daily news.'),
  w('7a_u6_24', 'daily routine', '', 6, 'n.', '日常生活', 'My daily routine is simple.', 'Follow your daily routine.'),
  w('7a_u6_25', 'only', '/ˈəʊnli/', 6, 'adv.', '只；仅', 'I have only one brother.', 'She is only 12 years old.'),
  w('7a_u6_26', 'break', '/breɪk/', 6, 'n. & v.', '休息；间断；破碎；损坏', 'Let us take a break.', 'Be careful not to break it.'),
  w('7a_u6_27', 'Finnish', '/ˈfɪnɪʃ/', 6, 'n. & adj.', '芬兰语；芬兰的；芬兰人的', 'She speaks Finnish.', 'He is Finnish.', 'basic', 'medium'),
  w('7a_u6_28', 'finish', '/ˈfɪnɪʃ/', 6, 'v.', '结束；完成', 'Finish your homework first.', 'The movie will finish soon.'),
  w('7a_u6_29', 'hockey', '/ˈhɒki/', 6, 'n.', '曲棍球', 'He plays hockey.', 'Hockey is popular in Canada.', 'basic', 'medium'),
  w('7a_u6_30', 'ice hockey', '', 6, 'n.', '冰球运动；冰上曲棍球', 'Ice hockey is exciting.', 'They play ice hockey in winter.', 'basic', 'medium'),
  w('7a_u6_31', 'already', '/ɔːlˈredi/', 6, 'adv.', '已经；早已', 'I already finished my homework.', 'She is already here.'),
  w('7a_u6_32', 'dark', '/dɑːk/', 6, 'adj.', '暗淡的；深色的', 'It is getting dark.', 'She has dark hair.'),
  w('7a_u6_33', 'outside', '/ˌaʊtˈsaɪd/', 6, 'adv. & adj. & prep.', '在外面；外面的；在……外面', 'Let us play outside.', 'The outside world is beautiful.'),
  w('7a_u6_34', 'prepare', '/prɪˈpeə(r)/', 6, 'v.', '把……预备好；准备', 'Prepare for the test.', 'She prepares dinner every day.'),
];

// Unit 7: Happy Birthday (28 words)
export const UNIT7_WORDS: TextbookWord[] = [
  w('7a_u7_01', 'celebrate', '/ˈselɪbreɪt/', 7, 'v.', '庆祝；庆贺', 'We celebrate birthdays.', 'Let us celebrate together.'),
  w('7a_u7_02', 'surprise', '/səˈpraɪz/', 7, 'n. & v.', '惊奇；惊讶；使感到意外', 'What a surprise!', 'She surprised me with a gift.'),
  w('7a_u7_03', 'something', '/ˈsʌmθɪŋ/', 7, 'pron.', '某事；某物', 'I want to tell you something.', 'There is something on the table.'),
  w('7a_u7_04', 'sale', '/seɪl/', 7, 'n.', '出售；销售', 'The store has a big sale.', 'Everything is on sale.'),
  w('7a_u7_05', 'kilo', '/ˈkiːləʊ/', 7, 'n.', '千克；公斤', 'I bought two kilos of apples.', 'How many kilos do you need?'),
  w('7a_u7_06', 'yogurt', '/ˈjɒɡət/', 7, 'n.', '酸奶', 'I like eating yogurt.', 'Yogurt is healthy.'),
  w('7a_u7_07', 'total', '/ˈtəʊtl/', 7, 'n. & adj.', '总数；合计；总的；全体的', 'The total is 50 yuan.', 'What is the total cost?'),
  w('7a_u7_08', 'price', '/praɪs/', 7, 'n.', '价格', 'What is the price?', 'The price is too high.'),
  w('7a_u7_09', 'balloon', '/bəˈluːn/', 7, 'n.', '气球', 'There are many balloons at the party.', 'Blow up the balloon.'),
  w('7a_u7_10', 'chocolate', '/ˈtʃɒklət/', 7, 'n.', '巧克力', 'I love chocolate.', 'She bought a box of chocolates.'),
  w('7a_u7_11', 'pizza', '/ˈpiːtsə/', 7, 'n.', '比萨饼', 'Let us order pizza.', 'Pizza is my favorite food.'),
  w('7a_u7_12', 'list', '/lɪst/', 7, 'n. & v.', '列表；列清单；名单；清单', 'Make a shopping list.', 'List all the items.'),
  w('7a_u7_13', 'own', '/əʊn/', 7, 'adj. & pron.', '自己的；本人的', 'This is my own book.', 'I have my own room.'),
  w('7a_u7_14', 'example', '/ɪɡˈzɑːmpl/', 7, 'n.', '例子；范例', 'Give me an example.', 'For example, I like apples.'),
  w('7a_u7_15', 'for example', '', 7, 'phrase', '例如', 'I like fruits, for example, apples.', 'For example, you can do this.'),
  w('7a_u7_16', 'language', '/ˈlæŋɡwɪdʒ/', 7, 'n.', '语言', 'English is a language.', 'How many languages can you speak?'),
  w('7a_u7_17', 'international', '/ˌɪntəˈnæʃnəl/', 7, 'adj.', '国际的', 'This is an international school.', 'She is an international student.'),
  w('7a_u7_18', 'mark', '/mɑːk/', 7, 'v. & n.', '做记号；纪念；打分；记号', 'Mark the important words.', 'What mark did you get?'),
  w('7a_u7_19', 'date', '/deɪt/', 7, 'n.', '日期；日子', 'What is the date today?', 'Write the date on your paper.'),
  w('7a_u7_20', 'national', '/ˈnæʃnəl/', 7, 'adj.', '国家的；民族的', 'This is a national holiday.', 'The national flag is red.'),
  w('7a_u7_21', 'found', '/faʊnd/', 7, 'v.', '创建；创立', 'They found a new club.', 'The school was founded in 1990.'),
  w('7a_u7_22', 'meaningful', '/ˈmiːnɪŊfl/', 7, 'adj.', '重要的；重大的', 'This is a meaningful day.', 'We had a meaningful conversation.'),
  w('7a_u7_23', 'make a wish', '', 7, 'phrase', '许愿', 'Make a wish and blow out the candles.', 'I made a wish on my birthday.'),
  w('7a_u7_24', 'village', '/ˈvɪlɪdʒ/', 7, 'n.', '村庄；村镇', 'I live in a small village.', 'The village is very quiet.'),
  w('7a_u7_25', 'grow', '/ɡrəʊ/', 7, 'v.', '成长；长大；增长', 'Plants grow in spring.', 'I want to grow taller.'),
  w('7a_u7_26', 'blow', '/bləʊ/', 7, 'v.', '吹；刮', 'The wind blows hard.', 'Blow out the candles.'),
  w('7a_u7_27', 'blow out', '', 7, 'phrase', '吹灭', 'Blow out the candles.', 'She blew out all the candles.'),
  w('7a_u7_28', 'enjoy', '/ɪnˈdʒɔɪ/', 7, 'v.', '享受；喜欢', 'I enjoy reading books.', 'Enjoy your meal!'),
];

// 获取指定单元的词汇
export function getFullVocabularyForUnit(unit: number): TextbookWord[] {
  switch (unit) {
    case 1:
      return UNIT1_WORDS;
    case 2:
      return UNIT2_WORDS;
    case 3:
      return UNIT3_WORDS;
    case 4:
      return UNIT4_WORDS;
    case 5:
      return UNIT5_WORDS;
    case 6:
      return UNIT6_WORDS;
    case 7:
      return UNIT7_WORDS;
    default:
      return [];
  }
}

// 获取所有单元的词汇统计
export function getVocabularyStats() {
  const allWords = [
    ...UNIT1_WORDS,
    ...UNIT2_WORDS,
    ...UNIT3_WORDS,
    ...UNIT4_WORDS,
    ...UNIT5_WORDS,
    ...UNIT6_WORDS,
    ...UNIT7_WORDS,
  ];
  return {
    unit1: UNIT1_WORDS.length,
    unit2: UNIT2_WORDS.length,
    unit3: UNIT3_WORDS.length,
    unit4: UNIT4_WORDS.length,
    unit5: UNIT5_WORDS.length,
    unit6: UNIT6_WORDS.length,
    unit7: UNIT7_WORDS.length,
    total: allWords.length,
  };
}
