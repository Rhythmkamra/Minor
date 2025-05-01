// app/community/Chat.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    color: '#2C3E50',
  },
  messagesContainer: { flexGrow: 1, padding: 20, justifyContent: 'flex-end' },
  messageBubble: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: 'flex-end',
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: { fontSize: 16, color: '#2C3E50' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
  },
});

const Chat = () => {
  const { name } = useLocalSearchParams();
  const chatKey = `chatMessages-${name}`; // Unique key for each chat

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Load messages when the component mounts
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(chatKey);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const saveMessages = async (newMessages) => {
    try {
      await AsyncStorage.setItem(chatKey, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  };

  const sendMessage = () => {
    if (input.trim()) {
      const newMessage = { id: Date.now().toString(), text: input };
      const updatedMessages = [newMessage, ...messages];
      setMessages(updatedMessages);
      saveMessages(updatedMessages); // Save messages after sending
      setInput('');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageBubble}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat with {name}</Text>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={sendMessage}>
          <FontAwesome5 name="paper-plane" size={24} color="#687076" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chat;