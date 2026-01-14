import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { speak, stopSpeaking, isSpeaking } from '@/lib/speech-service';

interface ReadingToolsProps {
  text: string;
  onClose: () => void;
}

export function ReadAloudModal({ text, onClose }: ReadingToolsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  
  useEffect(() => {
    return () => {
      // Cleanup: stop speaking when modal closes
      stopSpeaking();
    };
  }, []);
  
  const playAudio = async () => {
    try {
      setIsPlaying(true);
      await speak(text, {
        language: 'en-US',
        rate: speed,
        onDone: () => {
          setIsPlaying(false);
        },
        onError: (error) => {
          console.error('TTS error:', error);
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('播放失败:', error);
      setIsPlaying(false);
    }
  };
  
  const stopAudio = async () => {
    await stopSpeaking();
    setIsPlaying(false);
  };
  
  const handleSpeedChange = async (newSpeed: number) => {
    setSpeed(newSpeed);
    if (isPlaying) {
      await stopAudio();
      // Restart with new speed
      setTimeout(() => playAudio(), 100);
    }
  };
  
  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>朗读</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.textDisplay}>
            <Text style={styles.textDisplayContent}>{text}</Text>
          </View>
          
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={isPlaying ? stopAudio : playAudio}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={32}
                color="#FFF"
              />
            </TouchableOpacity>
            
            <View style={styles.speedControl}>
              <Text style={styles.speedLabel}>速度:</Text>
              <TouchableOpacity 
                style={[styles.speedButton, speed === 0.8 && styles.speedButtonActive]}
                onPress={() => handleSpeedChange(0.8)}
              >
                <Text style={[styles.speedButtonText, speed === 0.8 && styles.speedButtonTextActive]}>0.8x</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.speedButton, speed === 1.0 && styles.speedButtonActive]}
                onPress={() => handleSpeedChange(1.0)}
              >
                <Text style={[styles.speedButtonText, speed === 1.0 && styles.speedButtonTextActive]}>1.0x</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.speedButton, speed === 1.2 && styles.speedButtonActive]}
                onPress={() => handleSpeedChange(1.2)}
              >
                <Text style={[styles.speedButtonText, speed === 1.2 && styles.speedButtonTextActive]}>1.2x</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function FollowReadingModal({ text, onClose }: ReadingToolsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  
  const startRecording = async () => {
    try {
      // TODO: 实际项目中使用录音API
      // await Audio.requestPermissionsAsync();
      // const { recording } = await Audio.Recording.createAsync(
      //   Audio.RecordingOptionsPresets.HIGH_QUALITY
      // );
      setIsRecording(true);
    } catch (error) {
      console.error('录音失败:', error);
    }
  };
  
  const stopRecording = async () => {
    setIsRecording(false);
    setHasRecorded(true);
    
    // Mock: 模拟评分
    setTimeout(() => {
      setScore(85);
    }, 1000);
  };
  
  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>跟读练习</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.textDisplay}>
            <Text style={styles.textDisplayContent}>{text}</Text>
          </View>
          
          <View style={styles.recordingArea}>
            {!hasRecorded ? (
              <TouchableOpacity
                style={[styles.recordButton, isRecording && styles.recordButtonActive]}
                onPress={isRecording ? stopRecording : startRecording}
              >
                <Ionicons
                  name="mic"
                  size={40}
                  color={isRecording ? '#FF3B30' : '#FFF'}
                />
                <Text style={styles.recordButtonText}>
                  {isRecording ? '点击停止' : '按住录音'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.scoreDisplay}>
                <Text style={styles.scoreLabel}>发音得分</Text>
                <Text style={styles.scoreValue}>{score}</Text>
                <Text style={styles.scoreComment}>
                  {score && score >= 80 ? '发音很棒！' : '继续加油！'}
                </Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => {
                    setHasRecorded(false);
                    setScore(null);
                  }}
                >
                  <Text style={styles.retryButtonText}>重新录音</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function ScenarioDialogueModal({ onClose }: { onClose: () => void }) {
  const [selectedRole, setSelectedRole] = useState<'A' | 'B'>('A');
  const [currentLine, setCurrentLine] = useState(0);
  
  const dialogue = [
    { role: 'A', text: 'Hello! How are you today?', translation: '你好！你今天怎么样？' },
    { role: 'B', text: 'I\'m fine, thank you. And you?', translation: '我很好，谢谢。你呢？' },
    { role: 'A', text: 'I\'m great! What are you doing?', translation: '我很好！你在做什么？' },
    { role: 'B', text: 'I\'m reading a book.', translation: '我在看书。' },
  ];
  
  const currentDialogue = dialogue[currentLine];
  const isMyTurn = currentDialogue.role === selectedRole;
  
  const nextLine = () => {
    if (currentLine < dialogue.length - 1) {
      setCurrentLine(currentLine + 1);
    }
  };
  
  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>场景对练</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.roleSelection}>
            <Text style={styles.roleSectionTitle}>选择角色:</Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[styles.roleButton, selectedRole === 'A' && styles.roleButtonActive]}
                onPress={() => setSelectedRole('A')}
              >
                <Text style={[styles.roleButtonText, selectedRole === 'A' && styles.roleButtonTextActive]}>
                  角色 A
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, selectedRole === 'B' && styles.roleButtonActive]}
                onPress={() => setSelectedRole('B')}
              >
                <Text style={[styles.roleButtonText, selectedRole === 'B' && styles.roleButtonTextActive]}>
                  角色 B
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.dialogueArea}>
            <View style={[
              styles.dialogueBubble,
              currentDialogue.role === 'A' ? styles.dialogueBubbleLeft : styles.dialogueBubbleRight
            ]}>
              <Text style={styles.dialogueRole}>{currentDialogue.role}:</Text>
              <Text style={styles.dialogueText}>{currentDialogue.text}</Text>
              <Text style={styles.dialogueTranslation}>{currentDialogue.translation}</Text>
            </View>
            
            {isMyTurn && (
              <TouchableOpacity style={styles.speakButton} onPress={nextLine}>
                <Ionicons name="mic" size={24} color="#FFF" />
                <Text style={styles.speakButtonText}>点击跟读</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.dialogueProgress}>
            <Text style={styles.progressText}>
              {currentLine + 1} / {dialogue.length}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 600,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  textDisplay: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  textDisplayContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  controls: {
    alignItems: 'center',
    gap: 20,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  speedLabel: {
    fontSize: 14,
    color: '#666',
  },
  speedButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  speedButtonActive: {
    backgroundColor: '#007AFF',
  },
  speedButtonText: {
    fontSize: 14,
    color: '#333',
  },
  speedButtonTextActive: {
    color: '#FFF',
  },
  recordingArea: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonActive: {
    backgroundColor: '#FFF',
    borderWidth: 4,
    borderColor: '#FF3B30',
  },
  recordButtonText: {
    fontSize: 12,
    color: '#FFF',
    marginTop: 8,
  },
  scoreDisplay: {
    alignItems: 'center',
    gap: 12,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#34C759',
  },
  scoreComment: {
    fontSize: 18,
    color: '#333',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  retryButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  roleSelection: {
    marginBottom: 20,
  },
  roleSectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#007AFF',
  },
  roleButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  roleButtonTextActive: {
    color: '#FFF',
  },
  dialogueArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dialogueBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  dialogueBubbleLeft: {
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
  },
  dialogueBubbleRight: {
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-end',
  },
  dialogueRole: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  dialogueText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  dialogueTranslation: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 24,
    gap: 8,
  },
  speakButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  dialogueProgress: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
});
