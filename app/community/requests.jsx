import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TextInput,
  StyleSheet, TouchableOpacity
} from 'react-native';
import { db } from '../../configs/FirebaseConfigs';
import {
  collection, doc, getDocs,
  query, where, addDoc, updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [userInput, setUserInput] = useState('');
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const fetchRequests = async () => {
      try {
        const userRequestsRef = collection(db, 'Users', currentUser.uid, 'requests');
        const querySnapshot = await getDocs(userRequestsRef);
        const fetched = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(fetched);
      } catch (error) {
        console.error("Error fetching requests: ", error);
      }
    };

    fetchRequests();
  }, [currentUser]);

  const sendRequest = async () => {
    if (!userInput) {
      alert('Please enter a username.');
      return;
    }

    try {
      const recipientSnapshot = await getDocs(
        query(collection(db, 'Users'), where('username', '==', userInput))
      );

      if (recipientSnapshot.empty) {
        alert('No user found with that username.');
        return;
      }

      const recipientDoc = recipientSnapshot.docs[0];
      const recipientId = recipientDoc.id;

      if (recipientId === currentUser.uid) {
        alert('You cannot send a request to yourself.');
        return;
      }

      const senderSnapshot = await getDocs(
        query(collection(db, 'Users'), where('email', '==', currentUser.email))
      );

      const senderUsername = senderSnapshot.empty
        ? 'Unknown User'
        : senderSnapshot.docs[0].data().username;

      await addDoc(collection(db, 'Users', recipientId, 'requests'), {
        fromUserId: currentUser.uid,
        fromName: senderUsername,
        status: 'pending',
        timestamp: serverTimestamp(),
      });

      alert(`Request sent to ${userInput}`);
      setUserInput('');
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Error sending request');
    }
  };

  const acceptRequest = async (id) => {
    try {
      const requestDocRef = doc(db, 'Users', currentUser.uid, 'requests', id);
      await updateDoc(requestDocRef, {
        status: 'accepted',
      });

      // ✅ Update UI immediately
      setRequests((prev) =>
        prev.map((req) => req.id === id ? { ...req, status: 'accepted' } : req)
      );

    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Error accepting request');
    }
  };

  // 📌 Data for FlatList (single scrollable container)
  const requestSections = [
    { title: 'Pending Requests', data: requests.filter((r) => r.status === 'pending') },
    { title: 'Accepted Requests', data: requests.filter((r) => r.status === 'accepted') },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connection Requests</Text>

      {/* 📤 Send Request Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Send a Connection Request</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            value={userInput}
            onChangeText={setUserInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendRequest}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 📃 Requests Sections (FlatList) */}
      <FlatList
        data={requestSections}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            {item.data.length === 0 ? (
              <Text style={styles.noRequests}>No {item.title.toLowerCase()}.</Text>
            ) : (
              item.data.map((req) => (
                <View key={req.id} style={styles.requestItem}>
                  <Text style={styles.requestName}>{req.fromName}</Text>
                  {req.status === 'pending' ? (
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => acceptRequest(req.id)}
                    >
                      <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.acceptedText}>Accepted</Text>
                  )}
                </View>
              ))
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  title: {
    fontSize: 28, fontWeight: 'bold',
    color: '#2C3E50', textAlign: 'center', marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 30, padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10, elevation: 4,
  },
  sectionTitle: {
    fontSize: 22, fontWeight: 'bold',
    color: '#2C3E50', marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row', marginBottom: 15, alignItems: 'center',
  },
  input: {
    flex: 1, height: 40, borderColor: '#000000',
    borderWidth: 1, borderRadius: 5,
    marginRight: 10, paddingLeft: 10,
  },
  sendButton: {
    backgroundColor: '#FFC0CB',
    paddingVertical: 10, paddingHorizontal: 15,
    borderRadius: 5, borderWidth: 1,
    borderColor: '#000000',
  },
  sendButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
  requestItem: {
    backgroundColor: '#FFFFFF', padding: 15,
    marginBottom: 10, borderRadius: 10, elevation: 3,
  },
  requestName: { fontSize: 18, color: '#2C3E50', fontWeight: '500' },
  acceptButton: {
    backgroundColor: '#FFC0CB', paddingVertical: 10,
    paddingHorizontal: 15, borderRadius: 5,
    borderWidth: 1, borderColor: '#000000', marginTop: 10,
  },
  acceptButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
  acceptedText: { color: '#27ae60', fontWeight: 'bold', marginTop: 10 },
  noRequests: { color: '#7f8c8d', fontStyle: 'italic', marginTop: 5 },
});

export default Requests;
