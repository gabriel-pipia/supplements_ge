import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Keyboard,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../../context';
import { IconX, IconSend, IconSparkles } from '../icons';
import { BottomSheetModal } from './BottomSheetModal';
import Svg, { Path, Circle } from 'react-native-svg';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

interface AIChatModalProps {
  visible: boolean;
  onClose: () => void;
}

// Icons
const IconHistory = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);

const IconTrash = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </Svg>
);

const IconPlus = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M12 5v14M5 12h14" />
  </Svg>
);

const IconChevronLeft = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

const CHAT_HISTORY_KEY = '@supplement_chat_history';

// AI Response Generator based on keywords
const generateAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('protein') || lowerMessage.includes('პროტეინ')) {
    return 'For protein supplements, I recommend our Gold Standard Whey for muscle building and recovery. 💪 If you\'re vegan, we have excellent plant-based options too. 🌱 What is your fitness goal?';
  }
  
  if (lowerMessage.includes('gain') || lowerMessage.includes('muscle') || lowerMessage.includes('bulk')) {
    return 'For muscle gain, I suggest a combination of whey protein, creatine, and BCAAs. ⚡ Our bestseller is the Gold Standard Whey with Creatine Monohydrate. Would you like more details? 📖';
  }
  
  if (lowerMessage.includes('lose') || lowerMessage.includes('weight loss') || lowerMessage.includes('fat')) {
    return 'For weight loss, I recommend protein supplements to maintain muscle, omega-3 for metabolism, and our multivitamin complex. 🥗 Protein can also help with satiety. Interested in a tailored plan? ✨';
  }
  
  if (lowerMessage.includes('energy') || lowerMessage.includes('pre-workout') || lowerMessage.includes('workout')) {
    return 'Our Pre-Workout formula provides sustained energy, focus, and endurance! 🔥 It contains caffeine, beta-alanine, and citrulline malate. Best taken 20-30 minutes before training! ⚡';
  }
  
  if (lowerMessage.includes('vitamin') || lowerMessage.includes('ვიტამინ') || lowerMessage.includes('immune')) {
    return 'We have a range of vitamins! 🍊 Vitamin D3 for immunity and bone health, Omega-3 for heart health, and our Complete Multivitamin for overall wellness. 🛡️ Which area interests you most?';
  }
  
  if (lowerMessage.includes('beginner') || lowerMessage.includes('start') || lowerMessage.includes('new')) {
    return 'Great to start! 🚀 For beginners, I recommend starting with a quality whey protein and a multivitamin. They\'re safe, effective, and will support your fitness journey. 🏁 What are your main goals?';
  }
  
  if (lowerMessage.includes('recommend') || lowerMessage.includes('best') || lowerMessage.includes('should')) {
    return 'Our top recommendations based on popularity: Gold Standard Whey (muscle building), Creatine Monohydrate (strength), and Omega-3 (overall health). ⭐ Tell me about your fitness goals for a personalized recommendation! 🎯';
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('გამარჯობა')) {
    return 'Hello! 👋 I\'m your supplement.ge AI assistant. I can help you find the perfect supplements for your fitness goals. What would you like to know?';
  }
  
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('მადლობა')) {
    return 'You\'re welcome! Feel free to ask me anything else about supplements or fitness nutrition. I\'m here to help! 😊';
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('ფასი')) {
    return 'Our prices are competitive and we frequently offer discounts! 💸 Protein supplements start from ₾89, creatine from ₾65, and vitamins from ₾45. Check our current offers on the home page! 🏷️';
  }
  
  if (lowerMessage.includes('program') || lowerMessage.includes('training') || lowerMessage.includes('workout plan')) {
    return 'We offer customized training programs by professional trainers! 🏋️‍♂️ From "Muscle Mass Masterclass" for advanced athletes to "Fat Burn" for beginners. You can find them in the Search screen. Want me to explain one? 🧐';
  }
  
  if (lowerMessage.includes('trainer') || lowerMessage.includes('coach')) {
    return 'Our trainers are experts in fitness and nutrition! 👨‍🏫 They\'ve designed plans for all levels. For example, Giorgi Svanidze specializes in muscle mass, and Nino Beridze in fat loss. Check them out in the Search section! 🔍';
  }

  return 'I can help you choose the right supplements or training programs! 🚀 Tell me about:\n• Your fitness goals (muscle gain, weight loss, etc.) 🎯\n• Your experience level 📈\n• Or ask about our trainers and plans! 👥';
};

const SUGGESTED_QUESTIONS = [
  'Best protein for muscle gain? 💪',
  'Recommend supplements for beginners 🚀',
  'What vitamins do I need? 🍊',
  'Help me lose weight 🏃',
  'Pre-workout recommendations ⚡',
];

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (date: Date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString();
};

export const AIChatModal: React.FC<AIChatModalProps> = ({ visible, onClose }) => {
  const { colors, t, isDark, isGuest, user } = useApp();
  const insets = useSafeAreaInsets();
  
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m your supplement.ge AI assistant. 🏋️✨\n\nHow can I help you today? Ask me about:\n• Protein & Supplements\n• Training Programs\n• Nutrition Advice',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Typing animation
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.4, duration: 400, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isTyping]);

  // Load chat history for logged-in users
  useEffect(() => {
    if (!isGuest && visible) {
      loadChatHistory();
    }
  }, [isGuest, visible]);

  // Save chat history when messages change
  useEffect(() => {
    if (!isGuest && messages.length > 1 && currentSessionId) {
      saveChatHistory();
    }
  }, [messages, currentSessionId]);

  const loadChatHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(CHAT_HISTORY_KEY + '_' + user.email);
      if (stored) {
        const parsed = JSON.parse(stored);
        setChatHistory(parsed);
      }
    } catch (e) {
      console.log('Error loading chat history:', e);
    }
  };

  const saveChatHistory = async () => {
    try {
      const sessionIndex = chatHistory.findIndex(s => s.id === currentSessionId);
      let updatedHistory = [...chatHistory];
      
      const currentSession: ChatSession = {
        id: currentSessionId!,
        title: messages[1]?.text.slice(0, 40) + '...' || 'New Chat',
        messages: messages,
        lastUpdated: new Date(),
      };
      
      if (sessionIndex >= 0) {
        updatedHistory[sessionIndex] = currentSession;
      } else {
        updatedHistory = [currentSession, ...updatedHistory].slice(0, 20); // Keep last 20 chats
      }
      
      setChatHistory(updatedHistory);
      await AsyncStorage.setItem(CHAT_HISTORY_KEY + '_' + user.email, JSON.stringify(updatedHistory));
    } catch (e) {
      console.log('Error saving chat history:', e);
    }
  };

  const startNewChat = () => {
    setCurrentSessionId(Date.now().toString());
    setMessages([
      {
        id: '1',
        text: 'Hi! I\'m your supplement.ge AI assistant. 🏋️✨\n\nHow can I help you today? Ask me about:\n• Protein & Supplements\n• Training Programs\n• Nutrition Advice',
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setShowHistory(false);
  };

  const loadSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
    setShowHistory(false);
  };

  const deleteSession = async (sessionId: string) => {
    const updatedHistory = chatHistory.filter(s => s.id !== sessionId);
    setChatHistory(updatedHistory);
    await AsyncStorage.setItem(CHAT_HISTORY_KEY + '_' + user.email, JSON.stringify(updatedHistory));
  };

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );
    
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    if (!currentSessionId && visible) {
      setCurrentSessionId(Date.now().toString());
    }
  }, [visible]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleClose = () => {
    Keyboard.dismiss();
    setShowHistory(false);
    onClose();
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText.trim());
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  if (!visible) return null;

  // History View
  if (showHistory) {
    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
        <BottomSheetModal onClose={handleClose} height="95%" safeAreaEdges={[]}>
          <View style={[styles.header, { borderBottomColor: colors.gray100 }]}>
            <TouchableOpacity 
              style={[styles.backButton, { backgroundColor: colors.gray100 }]}
              onPress={() => setShowHistory(false)}
            >
              <IconChevronLeft size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.historyTitle, { color: colors.text }]}>Chat History</Text>
            <TouchableOpacity 
              style={[styles.newChatButton, { backgroundColor: colors.accent }]}
              onPress={startNewChat}
            >
              <IconPlus size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.historyList}
            contentContainerStyle={[styles.historyContent, { paddingBottom: insets.bottom + 20 }]}
          >
            {chatHistory.length === 0 ? (
              <View style={styles.emptyHistory}>
                <IconHistory size={48} color={colors.gray200} />
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>No chat history yet</Text>
                <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
                  Your conversations will appear here
                </Text>
              </View>
            ) : (
              chatHistory.map((session) => (
                <TouchableOpacity
                  key={session.id}
                  style={[styles.historyItem, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}
                  onPress={() => loadSession(session)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.historyIcon, { backgroundColor: colors.accentLight }]}>
                    <IconSparkles size={18} color={colors.accent} />
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={[styles.historyItemTitle, { color: colors.text }]} numberOfLines={1}>
                      {session.title}
                    </Text>
                    <Text style={[styles.historyItemDate, { color: colors.textMuted }]}>
                      {formatDate(new Date(session.lastUpdated))} • {session.messages.length} messages
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.deleteButton, { backgroundColor: colors.gray100 }]}
                    onPress={() => deleteSession(session.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <IconTrash size={16} color={colors.textMuted} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </BottomSheetModal>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <BottomSheetModal onClose={handleClose} height="95%" safeAreaEdges={[]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.gray100 }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.aiAvatarContainer]}>
              <View style={[styles.aiAvatar, { backgroundColor: colors.accent }]}>
                <IconSparkles size={20} color={colors.white} />
              </View>
              <View style={[styles.onlineIndicator, { backgroundColor: '#22C55E', borderColor: colors.background }]} />
            </View>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>
                {t('aiAssistant') || 'AI Assistant'}
              </Text>
              <Text style={[styles.subtitle, { color: isTyping ? colors.accent : colors.textMuted }]}>
                {isTyping ? 'Typing...' : 'Online • Ready to help'}
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            {!isGuest && (
              <TouchableOpacity 
                style={[styles.historyButton, { backgroundColor: colors.gray100 }]}
                onPress={() => setShowHistory(true)}
              >
                <IconHistory size={18} color={colors.text} />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.closeButton, { backgroundColor: colors.gray100 }]}
              onPress={handleClose}
            >
              <IconX size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message, index) => {
            const showTimestamp = index === 0 || 
              new Date(message.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() > 300000;
            
            return (
              <View key={message.id}>
                {showTimestamp && (
                  <Text style={[styles.timestamp, { color: colors.textMuted }]}>
                    {formatTime(message.timestamp)}
                  </Text>
                )}
                <View
                  style={[
                    styles.messageRow,
                    message.isUser && styles.userMessageRow,
                  ]}
                >
                  {!message.isUser && (
                    <View style={[styles.messageAvatar, { backgroundColor: colors.accent }]}>
                      <IconSparkles size={14} color={colors.white} />
                    </View>
                  )}
                  <View
                    style={[
                      styles.messageBubble,
                      message.isUser
                        ? [styles.userBubble, { backgroundColor: colors.accent }]
                        : [styles.aiBubble, { backgroundColor: isDark ? colors.gray100 : colors.surface, borderColor: colors.gray100 }],
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        { color: message.isUser ? colors.white : colors.text },
                      ]}
                    >
                      {message.text}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
          {isTyping && (
            <View style={styles.messageRow}>
              <View style={[styles.messageAvatar, { backgroundColor: colors.accent }]}>
                <IconSparkles size={14} color={colors.white} />
              </View>
              <View style={[styles.messageBubble, styles.aiBubble, { backgroundColor: isDark ? colors.gray100 : colors.surface, borderColor: colors.gray100 }]}>
                <View style={styles.typingIndicator}>
                  <Animated.View style={[styles.typingDot, { backgroundColor: colors.accent, opacity: pulseAnim }]} />
                  <Animated.View style={[styles.typingDot, { backgroundColor: colors.accent, opacity: pulseAnim }]} />
                  <Animated.View style={[styles.typingDot, { backgroundColor: colors.accent, opacity: pulseAnim }]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Suggested Questions */}
        {!isTyping && messages.length < 2 && (
          <View style={[styles.suggestionsWrapper, { borderTopColor: colors.gray100 }]}>
            <Text style={[styles.suggestionsTitle, { color: colors.textMuted }]}>Quick questions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.suggestionChip, { backgroundColor: colors.surface, borderColor: colors.gray200 }]}
                  onPress={() => {
                    setInputText(question);
                  }}
                >
                  <Text style={[styles.suggestionChipText, { color: colors.text }]}>{question}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Input */}
        <View style={[
          styles.inputContainer, 
          { 
            backgroundColor: colors.background,
            borderTopColor: !isTyping && messages.length < 2 ? "transparent" : colors.gray100, 
            paddingBottom: Platform.OS === 'ios' ? Math.max(keyboardHeight, insets.bottom) : Math.max(16, insets.bottom) 
          }
        ]}>
          <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.gray200 }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder={t('typeMessage') || 'Ask me anything...'}
              placeholderTextColor={colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              multiline
              maxLength={500}
              blurOnSubmit={false}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: inputText.trim() ? colors.accent : colors.gray200 },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <IconSend size={18} color={inputText.trim() ? colors.white : colors.gray400} />
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 16 : 0,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiAvatarContainer: {
    position: 'relative',
  },
  aiAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  historyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    gap: 8,
    paddingBottom: 10,
  },
  timestamp: {
    textAlign: 'center',
    fontSize: 12,
    marginVertical: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 4,
  },
  userMessageRow: {
    flexDirection: 'row-reverse',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    borderBottomRightRadius: 6,
  },
  aiBubble: {
    borderBottomLeftRadius: 6,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  typingIndicator: {
    flexDirection: 'row',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionsWrapper: {
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  suggestionChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  // History styles
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyList: {
    flex: 1,
  },
  historyContent: {
    padding: 20,
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyInfo: {
    flex: 1,
  },
  historyItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyItemDate: {
    fontSize: 13,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
  },
});
