import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

const Chat = () => {
  const { name } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      setMessages((prev) => [
        { id: Date.now().toString(), text: input },
        ...prev,
      ]);
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  header: {
    fontSize: 22, fontWeight: 'bold', padding: 20, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#E0E0E0', color: '#2C3E50',
  },
  messagesContainer: { flexGrow: 1, padding: 20, justifyContent: 'flex-end' },
  messageBubble: {
    backgroundColor: '#FFFFFF', padding: 15, borderRadius: 20, marginBottom: 10,
    alignSelf: 'flex-end', maxWidth: '80%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2, elevation: 2,
  },
  messageText: { fontSize: 16, color: '#2C3E50' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1, backgroundColor: '#E8E8E8', borderRadius: 25,
    paddingHorizontal: 20, paddingVertical: 10, marginRight: 10,
  },
});

export default Chat;
