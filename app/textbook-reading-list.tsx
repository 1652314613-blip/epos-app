import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { TEXTBOOK_READINGS } from '@/lib/textbook-reading-data';
import { Ionicons } from '@expo/vector-icons';

export default function TextbookReadingListScreen() {
  const [selectedGrade, setSelectedGrade] = useState<number>(7);
  const [selectedBook, setSelectedBook] = useState<string>('7A');
  
  // Group readings by grade and book
  const groupedReadings = TEXTBOOK_READINGS.reduce((acc, reading) => {
    const key = `${reading.grade}${reading.book}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(reading);
    return acc;
  }, {} as Record<string, typeof TEXTBOOK_READINGS>);
  
  const currentReadings = groupedReadings[`${selectedGrade}${selectedBook}`] || [];
  
  // Get available grades and books
  const availableGrades = Array.from(new Set(TEXTBOOK_READINGS.map(r => r.grade))).sort();
  const availableBooks = Array.from(new Set(
    TEXTBOOK_READINGS
      .filter(r => r.grade === selectedGrade)
      .map(r => r.book)
  )).sort();
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return '#34C759';
      case 'intermediate': return '#FF9500';
      case 'advanced': return '#FF3B30';
      default: return '#007AFF';
    }
  };
  
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return '基础';
      case 'intermediate': return '中级';
      case 'advanced': return '高级';
      default: return '未知';
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>文章列表</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* Grade Selector */}
      <View style={styles.selectorSection}>
        <Text style={styles.selectorLabel}>难度:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
          {availableGrades.map(grade => (
            <TouchableOpacity
              key={grade}
              style={[
                styles.selectorButton,
                selectedGrade === grade && styles.selectorButtonActive
              ]}
              onPress={() => {
                setSelectedGrade(grade);
                // Auto-select first available article for this difficulty
                const articles = Array.from(new Set(
                  TEXTBOOK_READINGS.filter(r => r.grade === grade).map(r => r.book)
                )).sort();
                if (articles.length > 0) {
                  setSelectedBook(books[0]);
                }
              }}
            >
              <Text style={[
                styles.selectorButtonText,
                selectedGrade === grade && styles.selectorButtonTextActive
              ]}>
                {grade}年级
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Book Selector */}
      <View style={styles.selectorSection}>
        <Text style={styles.selectorLabel}>学期:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
          {availableBooks.map(book => (
            <TouchableOpacity
              key={book}
              style={[
                styles.selectorButton,
                selectedBook === book && styles.selectorButtonActive
              ]}
              onPress={() => setSelectedBook(book)}
            >
              <Text style={[
                styles.selectorButtonText,
                selectedBook === book && styles.selectorButtonTextActive
              ]}>
                {book.includes('A') ? '上册' : '下册'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Reading List */}
      <ScrollView style={styles.listContainer}>
        {currentReadings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color="#CCC" />
            <Text style={styles.emptyStateText}>暂无课文</Text>
            <Text style={styles.emptyStateSubtext}>
              该年级学期暂未添加课文数据
            </Text>
          </View>
        ) : (
          <View style={styles.readingList}>
            {currentReadings.map((reading, index) => (
              <TouchableOpacity
                key={reading.id}
                style={styles.readingCard}
                onPress={() => router.push(`/textbook-reading?id=${reading.id}`)}
              >
                <View style={styles.readingCardHeader}>
                  <View style={styles.readingCardTitleRow}>
                    <View style={styles.unitBadge}>
                      <Text style={styles.unitBadgeText}>
                        Unit {reading.unit}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.difficultyBadge,
                        { backgroundColor: getDifficultyColor(reading.difficulty) }
                      ]}
                    >
                      <Text style={styles.difficultyBadgeText}>
                        {getDifficultyLabel(reading.difficulty)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.readingTitle}>{reading.title}</Text>
                  {reading.subtitle && (
                    <Text style={styles.readingSubtitle}>{reading.subtitle}</Text>
                  )}
                </View>
                
                <View style={styles.readingCardFooter}>
                  <View style={styles.readingCardStat}>
                    <Ionicons name="document-text-outline" size={16} color="#666" />
                    <Text style={styles.readingCardStatText}>
                      {reading.content.length} 段落
                    </Text>
                  </View>
                  
                  {reading.grammarPoints && reading.grammarPoints.length > 0 && (
                    <View style={styles.readingCardStat}>
                      <Ionicons name="bulb-outline" size={16} color="#666" />
                      <Text style={styles.readingCardStatText}>
                        {reading.grammarPoints.length} 语法点
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.readingCardArrow}>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  selectorSection: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  selectorScroll: {
    flexDirection: 'row',
  },
  selectorButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  selectorButtonActive: {
    backgroundColor: '#007AFF',
  },
  selectorButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  selectorButtonTextActive: {
    color: '#FFF',
  },
  listContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#CCC',
    marginTop: 8,
  },
  readingList: {
    padding: 16,
    gap: 12,
  },
  readingCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  readingCardHeader: {
    marginBottom: 12,
  },
  readingCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  unitBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unitBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  readingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  readingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  readingCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  readingCardStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readingCardStatText: {
    fontSize: 12,
    color: '#666',
  },
  readingCardArrow: {
    marginLeft: 'auto',
  },
});
