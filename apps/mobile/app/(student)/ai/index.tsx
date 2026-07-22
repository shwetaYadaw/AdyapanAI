import { useState, useRef } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, useColorScheme, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { sendChatMessageThunk, addUserMessage, clearChat } from '../../../store/aiSlice';
import Header from '../../../components/layout/Header';
import { AIChatMessage } from '@adyapan/shared';

export default function AIScreen() {
  const [input, setInput] = useState('');
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);

  const { chatMessages, isThinking } = useSelector((s: RootState) => s.ai);

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || isThinking) return;
    setInput('');
    dispatch(addUserMessage(msg));
    await dispatch(sendChatMessageThunk({ message: msg }));
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const SUGGESTIONS = [
    'Explain React hooks',
    'How to crack Google interview?',
    'Create a 30-day DSA plan',
    'Review my skills for SDE role',
  ];

  const renderMessage = ({ item }: { item: AIChatMessage }) => (
    <View style={[
      styles.bubble,
      item.role === 'user' ? styles.bubbleUser : [styles.bubbleAI, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }],
    ]}>
      <Text style={[
        styles.bubbleText,
        { color: item.role === 'user' ? '#fff' : (isDark ? '#e2e8f0' : '#111827') },
      ]}>
        {item.content}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={10}
    >
      <View style={[styles.root, { backgroundColor: isDark ? '#0f172a' : '#f8fafc' }]}>
        <Header title="AI Assistant" />

        {chatMessages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🧠</Text>
            <Text style={[styles.emptyTitle, { color: isDark ? '#f1f5f9' : '#111827' }]}>Ask me anything</Text>
            <Text style={styles.emptySubtext}>Career advice, concept explanations, study plans...</Text>
            <View style={styles.suggestions}>
              {SUGGESTIONS.map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setInput(s)}
                  style={[styles.suggestionPill, { backgroundColor: isDark ? '#1e293b' : '#eff6ff', borderColor: isDark ? '#334155' : '#bfdbfe' }]}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={chatMessages}
            keyExtractor={(_, i) => String(i)}
            renderItem={renderMessage}
            contentContainerStyle={styles.messages}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              isThinking ? (
                <View style={[styles.bubble, styles.bubbleAI, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
                  <ActivityIndicator size="small" color="#3b82f6" />
                </View>
              ) : null
            }
          />
        )}

        {/* Input bar */}
        <View style={[
          styles.inputBar,
          { backgroundColor: isDark ? '#111827' : '#fff', borderTopColor: isDark ? '#1e293b' : '#e5e7eb', paddingBottom: insets.bottom + 8 },
        ]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask anything..."
            placeholderTextColor="#9ca3af"
            multiline
            style={[styles.input, { backgroundColor: isDark ? '#1e293b' : '#f8fafc', color: isDark ? '#f9fafb' : '#111827', borderColor: isDark ? '#334155' : '#e5e7eb' }]}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!input.trim() || isThinking}
            style={[styles.sendBtn, { opacity: !input.trim() || isThinking ? 0.5 : 1 }]}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 20, fontWeight: '800' },
  emptySubtext: { fontSize: 13, color: '#9ca3af', textAlign: 'center' },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 },
  suggestionPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  suggestionText: { fontSize: 12, color: '#3b82f6', fontWeight: '600' },
  messages: { padding: 14, gap: 12 },
  bubble: { maxWidth: '82%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleUser: { backgroundColor: '#3b82f6', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  bubbleAI: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  inputBar: { borderTopWidth: 1, padding: 10, flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  input: { flex: 1, borderRadius: 18, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, maxHeight: 100 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center' },
  sendIcon: { color: '#fff', fontSize: 16 },
});
