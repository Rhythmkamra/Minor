import React from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import Chatbot from '../components/Chatbot';

const ChatbotScreen = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Chatbot router={router} />
    </View>
  );
};

export default ChatbotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});