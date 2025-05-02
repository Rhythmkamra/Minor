// app/community/Chat.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

import { collection, addDoc, onSnapshot, orderBy, query, doc, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfigs';// Make sure your Firebase config is correct
import { getAuth } from 'firebase/auth';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  usernameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  bioText: {
    fontSize: 14,
    color: '#555',
    paddingHorizontal: 15,
    paddingBottom: 10,
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

const getChatId = (uid1, uid2) => {
  return [uid1, uid2].sort().join('_');
};

const Chat = () => {
  const { currentUserId, selectedUserId, name } = useLocalSearchParams(); // Receive 'name'
  console.log('currentUserId in Chat screen:', currentUserId); // Add this log
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userData, setUserData] = useState(null);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (selectedUserId) {
        try {
          const userDoc = await getDoc(doc(db, 'Users', selectedUserId));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [selectedUserId]);

  useEffect(() => {
    const chatId = getChatId(currentUserId, selectedUserId);
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [currentUserId, selectedUserId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const chatId = getChatId(currentUserId, selectedUserId);
    const messagesRef = collection(db, 'chats', chatId, 'messages');

    try {
      await addDoc(messagesRef, {
        text: input,
        sender: currentUserId,
        receiver: selectedUserId,
        createdAt: new Date(),
      });
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.sender === currentUserId;
    return (
      <View
        style={[
          styles.messageBubble,
          {
            alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
            backgroundColor: isMyMessage ? '#DCF8C6' : '#FFFFFF',
          },
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.headerContainer}>
          {userData?.profilePicture && (
            <Image source={{ uri: userData.profilePicture }} style={styles.profileImage} />
          )}
          <Text style={styles.usernameText}>{userData?.username || name || 'User'}</Text>
        </View>
        {userData?.bio && <Text style={styles.bioText}>{userData.bio}</Text>}
      </View>

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