import React, { useEffect, useState } from 'react';
import {
  View, Text, SectionList, TextInput, StyleSheet,
  TouchableOpacity, ActivityIndicator, Alert, Image
} from 'react-native';
import { db } from '../../configs/FirebaseConfigs';
import {
  collection, doc, getDocs, query, where,
  addDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const RequestItem = ({ req, onAccept, onDecline }) => (
  <View style={styles.requestItem}>
    <Text style={styles.requestName}>{req.fromName}</Text>
    <Text style={styles.timestamp}>
      {req.timestamp?.seconds ? new Date(req.timestamp.seconds * 1000).toLocaleString() : ''}
    </Text>
    {req.status === 'pending' ? (
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.declineButton} onPress={onDecline}>
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <Text style={styles.acceptedText}>Accepted</Text>
    )}
  </View>
);

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]); // New state for suggested users

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const userRequestsRef = collection(db, 'Users', currentUser.uid, 'requests');
    const unsubscribe = onSnapshot(userRequestsRef, (snapshot) => {
      const updated = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(updated);
    });

    const fetchSent = async () => {
      const usersSnapshot = await getDocs(collection(db, 'Users'));
      const sent = [];
      for (const userDoc of usersSnapshot.docs) {
        const reqSnap = await getDocs(collection(db, 'Users', userDoc.id, 'requests'));
        reqSnap.forEach(docSnap => {
          if (docSnap.data().fromUserId === currentUser.uid) {
            sent.push({
              toUser: userDoc.data().username,
              status: docSnap.data().status
            });
          }
        });
      }
      setSentRequests(sent);
    };

    fetchSent();
    
    // Fetch suggested users
    const fetchSuggestedUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'Users'));
      const suggestions = [];

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userId = userDoc.id;

        // Skip if it's the current user
        if (userId === currentUser.uid) continue;

        // Skip if already requested
        const reqSnap = await getDocs(collection(db, 'Users', userId, 'requests'));
        const alreadyRequested = reqSnap.docs.some(doc => doc.data().fromUserId === currentUser.uid);
        if (alreadyRequested) continue;

        suggestions.push({
          id: userId,
          username: userData.username,
          bio: userData.bio || '',
          photo: userData.photo || '',  // Assuming `photo` exists in user data
        });
      }

      setSuggestedUsers(suggestions);
    };

    fetchSuggestedUsers();

    return () => unsubscribe();
  }, [currentUser]);

  const sendRequest = async () => {
    if (!userInput) return alert('Please enter a username.');
    setLoading(true);
    try {
      const recipientSnapshot = await getDocs(
        query(collection(db, 'Users'), where('username', '==', userInput))
      );

      if (recipientSnapshot.empty) {
        alert('No user found with that username.');
        setLoading(false);
        return;
      }

      const recipientDoc = recipientSnapshot.docs[0];
      const recipientId = recipientDoc.id;

      if (recipientId === currentUser.uid) {
        alert('You cannot send a request to yourself.');
        setLoading(false);
        return;
      }

      const existingRequests = await getDocs(collection(db, 'Users', recipientId, 'requests'));
      const alreadyRequested = existingRequests.docs.some(doc =>
        doc.data().fromUserId === currentUser.uid
      );

      if (alreadyRequested) {
        alert('You have already sent a request to this user.');
        setLoading(false);
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
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (id) => {
    try {
      const ref = doc(db, 'Users', currentUser.uid, 'requests', id);
      await updateDoc(ref, { status: 'accepted' });
    } catch (e) {
      console.error(e);
    }
  };

  const declineRequest = async (id) => {
    try {
      const ref = doc(db, 'Users', currentUser.uid, 'requests', id);
      await deleteDoc(ref);
    } catch (e) {
      console.error(e);
    }
  };

  const sections = [
    { title: 'Pending Requests', data: requests.filter(r => r.status === 'pending') },
    { title: 'Accepted Requests', data: requests.filter(r => r.status === 'accepted') },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connection Requests</Text>

      {/* Input Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Send a Connection Request</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            value={userInput}
            onChangeText={setUserInput}
          />
          <TouchableOpacity
            style={[styles.sendButton, loading && { backgroundColor: '#ccc' }]}
            onPress={sendRequest}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Requests */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionTitle}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <RequestItem
            req={item}
            onAccept={() => acceptRequest(item.id)}
            onDecline={() => declineRequest(item.id)}
          />
        )}
      />

      {/* Sent Requests */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Sent Requests</Text>
        {sentRequests.length === 0 ? (
          <Text style={styles.noRequests}>No sent requests.</Text>
        ) : sentRequests.map((req, idx) => (
          <Text key={idx} style={styles.sentRequest}>
            Sent to {req.toUser} - {req.status}
          </Text>
        ))}
      </View>

      {/* Suggested Profiles */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Suggested Profiles</Text>
        {suggestedUsers.length === 0 ? (
          <Text style={styles.noRequests}>No suggestions right now.</Text>
        ) : (
          suggestedUsers.map(user => (
            <View key={user.id} style={styles.suggestionItem}>
              <Image source={{ uri: user.photo }} style={styles.profilePic} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>{user.username}</Text>
                <Text style={{ color: '#777' }}>{user.bio}</Text>
              </View>
              <TouchableOpacity
                style={styles.connectButton}
                onPress={async () => {
                  try {
                    await addDoc(collection(db, 'Users', user.id, 'requests'), {
                      fromUserId: currentUser.uid,
                      fromName: currentUser.displayName || 'Unknown',
                      status: 'pending',
                      timestamp: serverTimestamp(),
                    });
                    Alert.alert('Request Sent', `Connection request sent to ${user.username}`);
                    setSuggestedUsers(prev => prev.filter(u => u.id !== user.id));
                  } catch (e) {
                    console.error(e);
                    Alert.alert('Error', 'Could not send request');
                  }
                }}
              >
                <Text style={{ color: '#fff' }}>Connect</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  sectionContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
  sendButton: { backgroundColor: '#00A0FF', padding: 10, borderRadius: 5, marginLeft: 10 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
  noRequests: { color: '#777', fontStyle: 'italic' },
  requestItem: { backgroundColor: '#fff', padding: 15, borderRadius: 5, marginBottom: 10, elevation: 2 },
  requestName: { fontWeight: 'bold', fontSize: 16 },
  timestamp: { fontSize: 12, color: '#777' },
  acceptedText: { color: '#28a745', fontWeight: 'bold' },
  buttonGroup: { flexDirection: 'row', marginTop: 10 },
  acceptButton: { backgroundColor: '#28a745', padding: 8, borderRadius: 5, marginRight: 10 },
  declineButton: { backgroundColor: '#dc3545', padding: 8, borderRadius: 5 },
  acceptButtonText: { color: '#fff' },
  declineButtonText: { color: '#fff' },
  sentRequest: { fontSize: 16, color: '#333', marginVertical: 5 },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: '#fff', padding: 10, borderRadius: 10, elevation: 3 },
  profilePic: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#ccc' },
  connectButton: { backgroundColor: '#FFC0CB', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5 },
});

export default Requests;
