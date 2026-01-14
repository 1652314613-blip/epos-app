#!/usr/bin/env python3
"""
生成七年级上册完整词汇数据
基于教材词汇列表，提供标准音标和原创例句
"""

import json

# 定义词汇数据结构
def create_word(word_id, word, phonetic, pos, meaning, examples, difficulty="basic", frequency="high"):
    return {
        "id": word_id,
        "word": word,
        "phonetic": phonetic,
        "grade": 7,
        "book": "7A",
        "definitions": [{"partOfSpeech": pos, "meaning": meaning, "exampleSentence": examples[0] if examples else ""}],
        "examples": examples,
        "difficulty": difficulty,
        "frequency": frequency
    }

# Unit 1: You and Me (27 words)
unit1_words = [
    create_word("7a_u1_make_friends", "make friends", "", "phrase", "交朋友", ["I want to make friends with you.", "She likes to make friends at school."]),
    create_word("7a_u1_get_to_know", "get to know", "", "phrase", "认识；了解", ["Let's get to know each other.", "I want to get to know my classmates."]),
    create_word("7a_u1_each", "each", "/iːtʃ/", "adj. & pron.", "每个；各自", ["Each student has a book.", "They each have different hobbies."]),
    create_word("7a_u1_other", "other", "/ˈʌðə(r)/", "adj. & pron.", "另外的；其他的", ["Do you have any other questions?", "Some like math, others like English."]),
    create_word("7a_u1_each_other", "each other", "", "phrase", "互相；彼此", ["We help each other.", "They know each other well."]),
    create_word("7a_u1_full", "full", "/fʊl/", "adj.", "完整的；满的", ["Please write your full name.", "The room is full of people."]),
    create_word("7a_u1_full_name", "full name", "", "n.", "全名", ["My full name is Li Ming.", "What is your full name?"]),
    create_word("7a_u1_grade", "grade", "/ɡreɪd/", "n.", "年级；等级", ["I am in Grade 7.", "What grade are you in?"]),
    create_word("7a_u1_last_name", "last name", "", "n.", "姓氏", ["My last name is Wang.", "What is your last name?"]),
    create_word("7a_u1_classmate", "classmate", "/ˈklɑːsmeɪt/", "n.", "同班同学", ["She is my classmate.", "I have many classmates."]),
    create_word("7a_u1_class_teacher", "class teacher", "", "n.", "班主任", ["Our class teacher is very kind.", "The class teacher teaches us English."], "basic", "medium"),
    create_word("7a_u1_first_name", "first name", "", "n.", "名字", ["My first name is Tom.", "What is your first name?"]),
    create_word("7a_u1_mistake", "mistake", "/mɪˈsteɪk/", "n.", "错误；失误", ["Everyone makes mistakes.", "I made a mistake in my homework."]),
    create_word("7a_u1_country", "country", "/ˈkʌntri/", "n.", "国家", ["China is a big country.", "What country are you from?"]),
    create_word("7a_u1_same", "same", "/seɪm/", "adj.", "相同的", ["We are in the same class.", "They have the same hobby."]),
    create_word("7a_u1_twin", "twin", "/twɪn/", "n.", "双胞胎之一", ["She has a twin sister.", "The twins look very similar."], "basic", "medium"),
    create_word("7a_u1_both", "both", "/bəʊθ/", "adj. & pron.", "两个；两个都", ["Both of them are students.", "I like both apples and oranges."]),
    create_word("7a_u1_band", "band", "/bænd/", "n.", "乐队", ["He plays in a band.", "The band is very popular."], "basic", "medium"),
    create_word("7a_u1_pot", "pot", "/pɒt/", "n.", "锅", ["Put the vegetables in the pot.", "The pot is on the stove."], "basic", "medium"),
    create_word("7a_u1_a_lot", "a lot", "", "phrase", "很；非常", ["I like English a lot.", "She helps me a lot."]),
    create_word("7a_u1_guitar", "guitar", "/ɡɪˈtɑː(r)/", "n.", "吉他", ["He can play the guitar.", "I want to learn guitar."], "basic", "medium"),
    create_word("7a_u1_tennis", "tennis", "/ˈtenɪs/", "n.", "网球", ["Do you like playing tennis?", "Tennis is a popular sport."], "basic", "medium"),
    create_word("7a_u1_post", "post", "/pəʊst/", "n. & v.", "帖子；邮寄；发布", ["I will post a message online.", "She posted a photo."], "basic", "medium"),
    create_word("7a_u1_even", "even", "/ˈiːvn/", "adv.", "甚至；连", ["He can even speak three languages.", "She is even taller than her brother."], "intermediate"),
    create_word("7a_u1_would", "would", "/wʊd/", "modal v.", "想；将会", ["Would you like some tea?", "I would like to help you."], "intermediate"),
    create_word("7a_u1_information", "information", "/ˌɪnfəˈmeɪʃn/", "n.", "信息；消息", ["Can you give me some information?", "This book has useful information."], "intermediate"),
    create_word("7a_u1_hobby", "hobby", "/ˈhɒbi/", "n.", "业余爱好", ["My hobby is reading books.", "What is your hobby?"]),
]

# 输出JSON格式
output = {
    "unit": 1,
    "wordCount": len(unit1_words),
    "words": unit1_words
}

print(json.dumps(output, ensure_ascii=False, indent=2))
