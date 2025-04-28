import React, { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Colors } from '../constants/Colors'; // Import your color constants

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export default function Chatbot() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: '👋 Hi! I’m your trip assistant.\nAsk me anything about travel, food, or planning!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const scrollViewRef = useRef();

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
  
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(input);
      const response = await result.response;
      let botReply = response.text()?.trim() || "🤖 Sorry, I didn't get that.";
  
      // Clean and format the response
      botReply = botReply.replace(/\*/g, ''); // Remove all * characters
      const parts = botReply.split(/\n\s*\n/); // Split into parts at double line breaks
  
      for (let part of parts) {
        if (part.trim()) {
          await new Promise(resolve => setTimeout(resolve, 600)); // Delay between each message
          setMessages((prev) => [...prev, { from: 'bot', text: part.trim() }]);
        }
      }
  
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: '⚠️ Oops! Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={Colors.WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trip Assistant</Text>
        </View>

        {/* Chat Messages */}
        <ScrollView
          style={styles.chatContainer}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.from === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text style={msg.from === 'user' ? styles.userText : styles.botText}>
                {msg.text}
              </Text>
            </View>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <View style={styles.botBubble}>
              <ActivityIndicator size="small" color={Colors.PRIMARY} />
              <Text style={styles.botText}>Bot is typing...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            style={styles.input}
            editable={!loading}
          />
          <TouchableOpacity onPress={sendMessage} disabled={loading} style={styles.sendButton}>
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ff5c8d',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: Colors.WHITE,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    marginVertical: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 3,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.PRIMARY,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f1f1',
  },
  userText: {
    fontSize: 16,
    color: Colors.WHITE,
  },
  botText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: Colors.WHITE,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 45,
    marginRight: 10,
    color: Colors.light.text,
  },
  sendButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 50,
  },
});
