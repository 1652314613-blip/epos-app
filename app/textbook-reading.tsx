import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { TextbookReading, ReadingContent, KeyPoint } from '@/lib/textbook-reading-types';
import { getReadingById, allReadings } from '@/lib/textbook-reading-data';
import { Ionicons } from '@expo/vector-icons';
import { cacheTextbookReadings, getCachedReading } from '@/lib/textbook-storage';
import { ReadAloudModal, FollowReadingModal, ScenarioDialogueModal } from '@/components/ReadingTools';

const { width } = Dimensions.get('window');

export default function TextbookReadingScreen() {
  const params = useLocalSearchParams();
  const readingId = params.id as string || '9a_u1_reading';
  
  const [reading, setReading] = useState<TextbookReading | null>(null);
  const [selectedContent, setSelectedContent] = useState<ReadingContent | null>(null);
  const [selectedKeyPoint, setSelectedKeyPoint] = useState<KeyPoint | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isExamMode, setIsExamMode] = useState(false);
  const [showReadAloud, setShowReadAloud] = useState(false);
  const [showFollowReading, setShowFollowReading] = useState(false);
  const [showScenarioDialogue, setShowScenarioDialogue] = useState(false);
  
  useEffect(() => {
    loadReading();
  }, [readingId]);
  
  // 缓存所有课文数据到本地
  useEffect(() => {
    cacheTextbookReadings(allReadings).catch(err => {
      console.error('Failed to cache readings:', err);
    });
  }, []);
  
  const loadReading = async () => {
    // 先尝试从内存加载
    let data = getReadingById(readingId);
    
    // 如果内存中没有，尝试从缓存加载（离线支持）
    if (!data) {
      data = await getCachedReading(readingId);
    }
    
    if (data) {
      setReading(data);
      setSelectedContent(data.content[0]); // 默认选中第一段
    }
  };
  
  if (!reading) {
    return (
      <View style={styles.container as any}>
        <Text style={styles.errorText as any}>文章加载中...</Text>
      </View>
    );
  }
  
  // 渲染考点高亮
  const renderTextWithHighlights = (content: ReadingContent) => {
    if (!content.keyPoints || content.keyPoints.length === 0) {
      return <Text style={styles.contentText as any}>{content.text}</Text>;
    }
    
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    // 按起始位置排序考点
    const sortedKeyPoints = [...content.keyPoints].sort((a, b) => a.startIndex - b.startIndex);
    
    sortedKeyPoints.forEach((kp, index) => {
      // 添加考点前的普通文本
      if (kp.startIndex > lastIndex) {
        parts.push(
          <Text key={`text-${index}`} style={styles.contentText as any}>
            {content.text.substring(lastIndex, kp.startIndex)}
          </Text>
        );
      }
      
      // 添加高亮的考点文本
      parts.push(
        <TouchableOpacity
          key={`kp-${kp.id}`}
          onPress={() => setSelectedKeyPoint(kp)}
          style={styles.highlightTouchable}
        >
          <Text style={[
            styles.contentText,
            styles.highlightText,
            selectedKeyPoint?.id === kp.id && styles.selectedHighlight
          ]}>
            {content.text.substring(kp.startIndex, kp.endIndex)}
          </Text>
        </TouchableOpacity>
      );
      
      lastIndex = kp.endIndex;
    });
    
    // 添加最后的普通文本
    if (lastIndex < content.text.length) {
      parts.push(
        <Text key="text-end" style={styles.contentText}>
          {content.text.substring(lastIndex)}
        </Text>
      );
    }
    
    return <Text style={styles.contentText}>{parts}</Text>;
  };
  
  return (
    <View style={styles.container}>
      {/* 顶部标题栏 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{reading.title}</Text>
        <Text style={styles.headerSubtitle}>{reading.subtitle}</Text>
      </View>
      
      {/* 工具栏 */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.toolButton}
          onPress={() => setShowTranslation(!showTranslation)}
        >
          <Ionicons name="language" size={20} color="#007AFF" />
          <Text style={styles.toolButtonText}>
            {showTranslation ? '隐藏译文' : '显示译文'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.toolButton, isExamMode && styles.toolButtonActive]}
          onPress={() => setIsExamMode(!isExamMode)}
        >
          <Ionicons name="school" size={20} color={isExamMode ? '#FFF' : '#007AFF'} />
          <Text style={[styles.toolButtonText, isExamMode && styles.toolButtonTextActive]}>
            考试模式
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.mainContent}>
        {/* 左侧：原文区域 */}
        <ScrollView style={styles.textArea}>
          {reading.content.map((content, index) => (
            <TouchableOpacity
              key={content.id}
              style={[
                styles.contentBlock,
                selectedContent?.id === content.id && styles.selectedContentBlock
              ]}
              onPress={() => setSelectedContent(content)}
            >
              {content.type === 'title' && (
                <Text style={styles.contentTitle}>{content.text}</Text>
              )}
              {content.type === 'subtitle' && (
                <Text style={styles.contentSubtitle}>{content.text}</Text>
              )}
              {content.type === 'paragraph' && (
                <View>
                  {renderTextWithHighlights(content)}
                  {showTranslation && content.translation && (
                    <Text style={styles.translationText}>{content.translation}</Text>
                  )}
                </View>
              )}
              {content.type === 'dialogue' && (
                <View style={styles.dialogueBlock}>
                  {content.speaker && (
                    <Text style={styles.speakerText}>{content.speaker}:</Text>
                  )}
                  <Text style={styles.contentText}>{content.text}</Text>
                  {showTranslation && content.translation && (
                    <Text style={styles.translationText}>{content.translation}</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* 右侧：AI私教面板 */}
        <View style={styles.aiPanel}>
          <View style={styles.aiPanelHeader}>
            <Ionicons name="bulb" size={20} color="#FF9500" />
            <Text style={styles.aiPanelTitle}>AI 私教</Text>
          </View>
          
          <ScrollView style={styles.aiPanelContent}>
            {selectedKeyPoint ? (
              <View style={styles.keyPointDetail}>
                <View style={styles.keyPointHeader}>
                  <View style={[
                    styles.keyPointBadge,
                    { backgroundColor: getKeyPointColor(selectedKeyPoint.type) }
                  ]}>
                    <Text style={styles.keyPointBadgeText}>
                      {getKeyPointLabel(selectedKeyPoint.type)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.collectButton}
                    onPress={() => {
                      // TODO: 收藏到积累本
                      alert('已收藏到积累本');
                    }}
                  >
                    <Ionicons name="bookmark-outline" size={18} color="#007AFF" />
                    <Text style={styles.collectButtonText}>收藏</Text>
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.keyPointText}>{selectedKeyPoint.text}</Text>
                <Text style={styles.keyPointExplanation}>{selectedKeyPoint.explanation}</Text>
                
                {selectedKeyPoint.examples && selectedKeyPoint.examples.length > 0 && (
                  <View style={styles.examplesSection}>
                    <Text style={styles.examplesSectionTitle}>例句:</Text>
                    {selectedKeyPoint.examples.map((example, index) => (
                      <Text key={index} style={styles.exampleText}>
                        {index + 1}. {example}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.aiPanelPlaceholder}>
                <Ionicons name="hand-left" size={40} color="#CCC" />
                <Text style={styles.aiPanelPlaceholderText}>
                  点击课文中的高亮部分
                </Text>
                <Text style={styles.aiPanelPlaceholderSubtext}>
                  查看AI生成的考点拆解
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
      
      {/* 底部工具栏 */}
      <View style={styles.bottomToolbar}>
        <TouchableOpacity
          style={styles.bottomToolButton}
          onPress={() => setShowReadAloud(true)}
        >
          <Ionicons name="volume-high" size={24} color="#007AFF" />
          <Text style={styles.bottomToolButtonText}>朗读</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.bottomToolButton}
          onPress={() => setShowFollowReading(true)}
        >
          <Ionicons name="mic" size={24} color="#007AFF" />
          <Text style={styles.bottomToolButtonText}>跟读</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.bottomToolButton}
          onPress={() => setShowScenarioDialogue(true)}
        >
          <Ionicons name="people" size={24} color="#007AFF" />
          <Text style={styles.bottomToolButtonText}>场景对练</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.bottomToolButton}
          onPress={() => {
            setIsExamMode(true);
            alert('完形填空模式已开启');
          }}
        >
          <Ionicons name="create" size={24} color="#007AFF" />
          <Text style={styles.bottomToolButtonText}>完形填空</Text>
        </TouchableOpacity>
      </View>
      
      {/* 模态框 */}
      {showReadAloud && selectedContent && (
        <ReadAloudModal
          text={selectedContent.text}
          onClose={() => setShowReadAloud(false)}
        />
      )}
      
      {showFollowReading && selectedContent && (
        <FollowReadingModal
          text={selectedContent.text}
          onClose={() => setShowFollowReading(false)}
        />
      )}
      
      {showScenarioDialogue && (
        <ScenarioDialogueModal
          onClose={() => setShowScenarioDialogue(false)}
        />
      )}
    </View>
  );
}

// 辅助函数
function getKeyPointColor(type: string): string {
  switch (type) {
    case 'vocabulary': return '#34C759';
    case 'grammar': return '#FF9500';
    case 'phrase': return '#5856D6';
    case 'sentence_pattern': return '#FF2D55';
    default: return '#007AFF';
  }
}

function getKeyPointLabel(type: string): string {
  switch (type) {
    case 'vocabulary': return '词汇';
    case 'grammar': return '语法';
    case 'phrase': return '短语';
    case 'sentence_pattern': return '句型';
    default: return '考点';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  toolbar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  toolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    gap: 6,
  },
  toolButtonActive: {
    backgroundColor: '#007AFF',
  },
  toolButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  toolButtonTextActive: {
    color: '#FFF',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  textArea: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
  },
  contentBlock: {
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
  },
  selectedContentBlock: {
    backgroundColor: '#F0F8FF',
  },
  contentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  contentSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 28,
    color: '#333',
  },
  highlightTouchable: {
    display: 'inline',
  },
  highlightText: {
    backgroundColor: '#FFF9E6',
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
    fontWeight: '500',
  },
  selectedHighlight: {
    backgroundColor: '#FFE5B4',
    borderBottomColor: '#FF9500',
  },
  translationText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  dialogueBlock: {
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  speakerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  aiPanel: {
    width: width * 0.4,
    backgroundColor: '#FFF',
    borderLeftWidth: 1,
    borderLeftColor: '#E5E5E5',
  },
  aiPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    gap: 8,
  },
  aiPanelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  aiPanelContent: {
    flex: 1,
    padding: 16,
  },
  aiPanelPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  aiPanelPlaceholderText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  aiPanelPlaceholderSubtext: {
    fontSize: 14,
    color: '#CCC',
    marginTop: 4,
  },
  keyPointDetail: {
    gap: 12,
  },
  keyPointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keyPointBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  keyPointBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  collectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  collectButtonText: {
    fontSize: 14,
    color: '#007AFF',
  },
  keyPointText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  keyPointExplanation: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
  },
  examplesSection: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  examplesSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
    marginBottom: 6,
  },
  bottomToolbar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
  },
  bottomToolButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  bottomToolButtonText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
});
