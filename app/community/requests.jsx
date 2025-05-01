import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image
} from 'react-native';
import { db } from '../../configs/FirebaseConfigs';
import {
  collection, doc, getDocs, query, where,
  addDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Feather, Ionicons } from '@expo/vector-icons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';

const primaryColor = '#ff69b4'; // Instagram-like pink

const RequestItem = React.memo(({ req, onAccept, onDecline }) => (
  <View style={tabStyles.requestItem}>
    <View style={tabStyles.requestHeader}>
      {req.profilePic ? (
        <Image source={{ uri: req.profilePic }} style={tabStyles.profilePic} />
      ) : (
        <View style={tabStyles.userIconContainer}>
          <Ionicons name="person" size={24} color="#888" />
        </View>
      )}
      <View style={{ marginLeft: 15, flex: 1 }}>
        <Text style={tabStyles.requestName}>{req.fromName}</Text>
        <Text style={tabStyles.requestBio}>{req.bio || 'No bio available'}</Text>
      </View>
    </View>
    <Text style={tabStyles.timestamp}>
      {req.timestamp?.seconds ? new Date(req.timestamp.seconds * 1000).toLocaleString() : ''}
    </Text>
    {req.status === 'pending' ? (
      <View style={tabStyles.buttonGroup}>
        <TouchableOpacity style={tabStyles.acceptButton} onPress={onAccept}>
          <Feather name="check" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={tabStyles.declineButton} onPress={onDecline}>
          <Feather name="x" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    ) : (
      <View style={tabStyles.acceptedContainer}>
        <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
        <Text style={tabStyles.acceptedText}>Accepted</Text>
      </View>
    )}
  </View>
));

const FindConnectionsTab = ({ userInput, setUserInput, loading, sendRequest, suggestedUsers, currentUser, setSuggestedUsers }) => (
  <View style={tabStyles.tabContainer}>
    <View style={tabStyles.sendRequestContainer}>
      <Text style={tabStyles.sectionTitle}>Send a Connection Request</Text>
      <View style={tabStyles.inputContainer}>
        <TextInput
          style={tabStyles.input}
          placeholder="Enter username"
          value={userInput}
          onChangeText={setUserInput}
          placeholderTextColor="#999"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[tabStyles.sendButton, loading && tabStyles.disabledButton]}
          onPress={sendRequest}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={tabStyles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>

    <View style={tabStyles.suggestedContainer}>
      <Text style={tabStyles.sectionTitle}>Suggested Profiles</Text>
      {suggestedUsers.length === 0 ? (
        <Text style={tabStyles.noRequests}>No suggestions right now.</Text>
      ) : suggestedUsers.map(user => (
        <View key={user.id} style={tabStyles.suggestionItem}>
          {user.photo ? (
            <Image source={{ uri: user.photo }} style={tabStyles.profilePicSmall} />
          ) : (
            <View style={tabStyles.userIconContainerSmall}>
              <Ionicons name="person" size={20} color="#888" />
            </View>
          )}
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={tabStyles.suggestionUsername}>{user.username}</Text>
            <Text style={tabStyles.suggestionBio}>{user.bio}</Text>
          </View>
          <TouchableOpacity
            style={tabStyles.connectButton}
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
            <Text style={tabStyles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  </View>
);

const PendingRequestsTab = ({ requests, acceptRequest, declineRequest }) => (
  <View style={tabStyles.tabContainer}>
    {requests.filter(r => r.status === 'pending').length === 0 ? (
      <Text style={tabStyles.noRequests}>No pending requests.</Text>
    ) : (
      requests
        .filter(r => r.status === 'pending')
        .map(item => (
          <RequestItem
            key={item.id}
            req={item}
            onAccept={() => acceptRequest(item.id)}
            onDecline={() => declineRequest(item.id)}
          />
        ))
    )}
  </View>
);

const AcceptedRequestsTab = ({ requests }) => (
  <View style={tabStyles.tabContainer}>
    {requests.filter(r => r.status === 'accepted').length === 0 ? (
      <Text style={tabStyles.noRequests}>No accepted requests.</Text>
    ) : (
      requests
        .filter(r => r.status === 'accepted')
        .map(item => (
          <RequestItem key={item.id} req={item} />
        ))
    )}
  </View>
);

const Requests = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'pending', title: 'Pending' },
    { key: 'accepted', title: 'Accepted' },
    { key: 'find', title: 'Find' },
  ]);
  const [requests, setRequests] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const fetchRequests = useCallback(async () => {
    if (!currentUser) return () => {}; // fallback noop

    const userRequestsRef = collection(db, 'Users', currentUser.uid, 'requests');
    const unsubscribe = onSnapshot(userRequestsRef, (snapshot) => {
      const updated = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(updated);
    });

    return unsubscribe; // return unsubscribe function
  }, [currentUser]);

  const fetchSuggested = useCallback(async () => {
    if (!currentUser) return;
    const usersSnapshot = await getDocs(collection(db, 'Users'));
    const suggestions = [];

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userId = userDoc.id;
      if (userId === currentUser.uid) continue;

      const reqSnap = await getDocs(collection(db, 'Users', userId, 'requests'));
      const alreadyRequested = reqSnap.docs.some(doc => doc.data().fromUserId === currentUser.uid);
      if (alreadyRequested) continue;

      suggestions.push({
        id: userId,
        username: userData.username,
        bio: userData.bio || '',
        photo: userData.photo || '',
      });
    }

    setSuggestedUsers(suggestions);
  }, [currentUser]);

  useEffect(() => {
    let unsubscribe = () => {};

    const init = async () => {
      const unsub = await fetchRequests();
      if (typeof unsub === 'function') {
        unsubscribe = unsub;
      }
      fetchSuggested();
    };

    init();

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [currentUser, fetchRequests, fetchSuggested]);

  const handleSendRequest = async () => {
    if (!userInput) return Alert.alert('Info', 'Please enter a username.');
    setLoading(true);
    try {
      const recipientSnapshot = await getDocs(
        query(collection(db, 'Users'), where('username', '==', userInput))
      );
      if (recipientSnapshot.empty) {
        Alert.alert('Not Found', 'No user found with that username.');
        setLoading(false);
        return;
      }
      const recipientDoc = recipientSnapshot.docs[0];
      const recipientId = recipientDoc.id;
      if (recipientId === currentUser.uid) {
        Alert.alert('Oops', 'You cannot send a request to yourself.');
        setLoading(false);
        return;
      }
      const existingRequests = await getDocs(collection(db, 'Users', recipientId, 'requests'));
      const alreadyRequested = existingRequests.docs.some(doc => doc.data().fromUserId === currentUser.uid);
      if (alreadyRequested) {
        Alert.alert('Already Sent', 'You have already sent a request to this user.');
        setLoading(false);
        return;
      }
      const senderSnapshot = await getDocs(
        query(collection(db, 'Users'), where('email', '==', currentUser.email))
      );
      const senderUsername = senderSnapshot.empty ? 'Unknown User' : senderSnapshot.docs[0].data().username;
      await addDoc(collection(db, 'Users', recipientId, 'requests'), {
        fromUserId: currentUser.uid,
        fromName: senderUsername,
        status: 'pending',
        timestamp: serverTimestamp(),
      });
      Alert.alert('Request Sent', `Request sent to ${userInput}`);
      setUserInput('');
    } catch (error) {
      console.error('Error sending request:', error);
      Alert.alert('Error', 'Could not send request.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = useCallback(async (id) => {
    try {
      const ref = doc(db, 'Users', currentUser.uid, 'requests', id);
      await updateDoc(ref, { status: 'accepted' });
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not accept request.');
    }
  }, [currentUser]);

  const handleDeclineRequest = useCallback(async (id) => {
    try {
      const ref = doc(db, 'Users', currentUser.uid, 'requests', id);
      await deleteDoc(ref);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not decline request.');
    }
  }, [currentUser]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'find':
        return (
          <FindConnectionsTab
            userInput={userInput}
            setUserInput={setUserInput}
            loading={loading}
            sendRequest={handleSendRequest}
            suggestedUsers={suggestedUsers}
            currentUser={currentUser}
            setSuggestedUsers={setSuggestedUsers}
          />
        );
      case 'pending':
        return (
          <PendingRequestsTab
            requests={requests}
            acceptRequest={handleAcceptRequest}
            declineRequest={handleDeclineRequest}
          />
        );
      case 'accepted':
        return <AcceptedRequestsTab requests={requests} />;
      default:
        return null;
    }
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={tabStyles.indicator}
      style={tabStyles.tabBar}
      renderLabel={({ route, focused }) => (
        <Text style={[tabStyles.tabLabel, { color: focused ? primaryColor : '#555' }]}>
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
};


const tabStyles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fafafa',
  },
  tabBar: {
    backgroundColor: '#ff5c8d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  indicator: {
    backgroundColor: primaryColor,
    height: 2,
  },
  tabLabel: {

    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  noRequests: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  requestItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#262626',
  },
 requestBio: {
    color: '#737373',
    fontSize: 14,
    marginTop: 2,
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginLeft: 8,
  },
  declineButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 5,
    marginLeft: 8,
  },
  acceptedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  acceptedText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  sendRequestContainer: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#262626',
  },
  sendButton: {
    backgroundColor: primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  suggestedContainer: {
    marginTop: 10,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  profilePicSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  userIconContainerSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionUsername: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#262626',
  },
  suggestionBio: {
    color: '#737373',
    fontSize: 14,
    marginTop: 2,
  },
  connectButton: {
    backgroundColor: primaryColor,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  connectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Requests;