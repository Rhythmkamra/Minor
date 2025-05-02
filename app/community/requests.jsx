import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image
} from 'react-native';
import { db } from '../../configs/FirebaseConfigs';
import {
  collection, doc, getDocs, query, where, getDoc, // <-- Make sure getDoc is imported
  addDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Feather, Ionicons } from '@expo/vector-icons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';

const primaryColor = '#ff69b4'; // Instagram-like pink

// --- RequestItem Component ---
// Displays individual request details (sender name, bio, pic, timestamp, actions)
const RequestItem = React.memo(({ req, onAccept, onDecline }) => (
  <View style={tabStyles.requestItem}>
    {/* Header: Profile Pic + Name/Bio */}
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
        {/* Displays the bio fetched in fetchRequests */}
        <Text style={tabStyles.requestBio}>{req.bio || 'No bio available'}</Text>
      </View>
    </View>
    {/* Timestamp */}
    <Text style={tabStyles.timestamp}>
      {req.timestamp?.seconds ? new Date(req.timestamp.seconds * 1000).toLocaleString() : ''}
    </Text>
    {/* Action Buttons (Pending) or Accepted Status */}
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

// --- FindConnectionsTab Component ---
// Handles searching/sending requests and displaying suggestions
const FindConnectionsTab = ({ userInput, setUserInput, loading, sendRequest, suggestedUsers, currentUser, setSuggestedUsers }) => (
  <View style={tabStyles.tabContainer}>
    {/* Send Request Section */}
    <View style={tabStyles.sendRequestContainer}>
      <Text style={tabStyles.sectionTitle}>Send a Connection Request</Text>
      <View style={tabStyles.inputContainer}>
        <TextInput
          style={tabStyles.input}
          placeholder="Enter username"
          value={userInput}
          onChangeText={setUserInput} // Pass the function to update state
          placeholderTextColor="#999"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[tabStyles.sendButton, loading && tabStyles.disabledButton]}
          onPress={sendRequest} // Trigger send request logic
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

    {/* Suggested Profiles Section */}
    <View style={tabStyles.suggestedContainer}>
      <Text style={tabStyles.sectionTitle}>Suggested Profiles</Text>
      {suggestedUsers.length === 0 ? (
        <Text style={tabStyles.noRequests}>No suggestions right now.</Text>
      ) : suggestedUsers.map(user => (
        // Display each suggested user
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
          {/* Connect Button for suggestions */}
          <TouchableOpacity
            style={tabStyles.connectButton}
            onPress={async () => { // Inline request sending logic for suggestions
              if (!currentUser) return; // Guard clause
              try {
                 // Fetch sender's current username before sending
                 const senderDocRef = doc(db, 'Users', currentUser.uid);
                 const senderDocSnap = await getDoc(senderDocRef);
                 const senderUsername = senderDocSnap.exists() ? senderDocSnap.data().username : 'Unknown User';

                await addDoc(collection(db, 'Users', user.id, 'requests'), {
                  fromUserId: currentUser.uid,
                  fromName: senderUsername, // Use fetched username
                  status: 'pending',
                  timestamp: serverTimestamp(),
                });
                Alert.alert('Request Sent', `Connection request sent to ${user.username}`);
                // Remove user from suggestions after sending request
                setSuggestedUsers(prev => prev.filter(u => u.id !== user.id));
              } catch (e) {
                console.error("Error sending request from suggestion:", e);
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

// --- PendingRequestsTab Component ---
// Displays only pending requests using RequestItem
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
            req={item} // Pass the enriched request object
            onAccept={() => acceptRequest(item.id)}
            onDecline={() => declineRequest(item.id)}
          />
        ))
    )}
  </View>
);

// --- AcceptedRequestsTab Component ---
// Displays only accepted requests using RequestItem
const AcceptedRequestsTab = ({ requests }) => (
  <View style={tabStyles.tabContainer}>
    {requests.filter(r => r.status === 'accepted').length === 0 ? (
      <Text style={tabStyles.noRequests}>No accepted requests.</Text>
    ) : (
      requests
        .filter(r => r.status === 'accepted')
        .map(item => (
          // Pass the enriched request object, no actions needed for accepted
          <RequestItem key={item.id} req={item} />
        ))
    )}
  </View>
);

// --- Main Requests Component ---
// Manages state, tabs, data fetching, and request logic
const Requests = () => {
  const layout = useWindowDimensions();

  // State variables
  const [index, setIndex] = useState(0); // Current tab index
  const [routes] = useState([             // Tab definitions
    { key: 'pending', title: 'Pending' },
    { key: 'accepted', title: 'Accepted' },
    { key: 'find', title: 'Find' },
  ]);
  const [requests, setRequests] = useState([]); // Stores fetched requests (pending & accepted)
  const [userInput, setUserInput] = useState(''); // Input for sending request by username
  const [loading, setLoading] = useState(false); // Loading state for sending request
  const [suggestedUsers, setSuggestedUsers] = useState([]); // Stores suggested users
  const [loadingRequests, setLoadingRequests] = useState(true); // Loading state for fetching requests

  const auth = getAuth();
  const currentUser = auth.currentUser; // Get current authenticated user

  // --- Fetch Incoming Requests (Corrected Version) ---
  // Fetches requests for the current user AND the sender's profile details (bio, pic)
  const fetchRequests = useCallback(async () => {
    if (!currentUser) {
        setLoadingRequests(false);
        return () => {}; // Return a no-op unsubscribe function if no user
    }
    setLoadingRequests(true); // Indicate loading has started
    const userRequestsRef = collection(db, 'Users', currentUser.uid, 'requests');

    // Listen for real-time updates on the requests subcollection
    const unsubscribe = onSnapshot(userRequestsRef, async (snapshot) => {
        // Process each request document using Promises to handle async profile fetching
        const promises = snapshot.docs.map(async (requestDoc) => {
            const requestData = { id: requestDoc.id, ...requestDoc.data() };
            const fromUserId = requestData.fromUserId; // Get the ID of the user who sent the request

            let bio = null; // Initialize bio
            let profilePic = null; // Initialize profile picture URL

            // If we have the sender's ID, attempt to fetch their profile
            if (fromUserId) {
                try {
                    // Create a direct reference to the sender's document in the 'Users' collection
                    const userProfileRef = doc(db, 'Users', fromUserId);
                    // Asynchronously fetch the sender's document data
                    const userProfileSnap = await getDoc(userProfileRef);

                    if (userProfileSnap.exists()) {
                        // If the sender's profile exists, extract their data
                        const profileData = userProfileSnap.data();
                        bio = profileData.bio || null;         // Get bio, fallback to null
                        profilePic = profileData.photo || null; // Get photo URL, fallback to null
                    } else {
                        // Log a warning if the sender's profile document wasn't found
                        console.warn(`Sender profile not found for ID: ${fromUserId}`);
                    }
                } catch (error) {
                    // Log any errors during the profile fetch
                    console.error("Error fetching sender profile:", error);
                }
            } else {
                 // Log a warning if a request document is missing the sender's ID
                 console.warn(`Request missing fromUserId: ${requestData.id}`);
            }

            // Return a new object combining the original request data with the fetched bio and profilePic
            return {
                ...requestData,
                bio,
                profilePic
            };
        });

        // Wait for all the profile fetch promises to resolve
        const updatedRequests = await Promise.all(promises);

        // Update the component's state with the array of enriched request objects
        // filter(Boolean) ensures no null/undefined entries if error handling resulted in them
        setRequests(updatedRequests.filter(Boolean));
        setLoadingRequests(false); // Indicate loading is complete

    }, (error) => { // Error handler for the onSnapshot listener itself
        console.error("Error fetching requests snapshot:", error);
        Alert.alert("Error", "Could not load requests.");
        setLoadingRequests(false); // Ensure loading stops on error
    });

    // Return the unsubscribe function for cleanup when the component unmounts or user changes
    return unsubscribe;
  }, [currentUser]); // Re-run this effect if the currentUser changes


  // --- Fetch Suggested Users ---
  // Fetches users, excluding self and those already requested
  const fetchSuggested = useCallback(async () => {
    if (!currentUser) return; // Exit if no user logged in

    try {
        const usersSnapshot = await getDocs(collection(db, 'Users'));
        const suggestions = [];
        const sentRequestIds = new Set(); // Keep track of users already requested by current user

        // First, find out who the current user has already sent requests to
        // This requires iterating through *all* users and checking their requests subcollection.
        // NOTE: This can be inefficient at scale. A better approach is storing sent requests
        // under the sender's document or having a dedicated 'connections' collection.
        for (const userDoc of usersSnapshot.docs) {
             if (userDoc.id !== currentUser.uid) {
                 const reqSnap = await getDocs(collection(db, 'Users', userDoc.id, 'requests'));
                 const alreadyRequested = reqSnap.docs.some(doc => doc.data().fromUserId === currentUser.uid);
                 if (alreadyRequested) {
                     sentRequestIds.add(userDoc.id);
                 }
             }
        }

        // Now, iterate again to build suggestions, filtering out self and already requested users
        for (const userDoc of usersSnapshot.docs) {
            const userData = userDoc.data();
            const userId = userDoc.id;

            // Skip current user and users already requested
            if (userId === currentUser.uid || sentRequestIds.has(userId)) {
                 continue;
            }

            // Add to suggestions list
            suggestions.push({
                id: userId,
                username: userData.username || 'No Username', // Provide fallback
                bio: userData.bio || '',
                photo: userData.photo || '',
            });
        }
         // Limit suggestions for display (e.g., show top 5)
        setSuggestedUsers(suggestions.slice(0, 5));
    } catch (error) {
        console.error("Error fetching suggested users:", error);
        setSuggestedUsers([]); // Clear suggestions on error
    }

  }, [currentUser]); // Re-run if currentUser changes

  // --- useEffect Hook ---
  // Runs on mount and when dependencies change to fetch initial data
  useEffect(() => {
    let unsubscribe = () => {}; // Initialize unsubscribe function

    const init = async () => {
      // fetchRequests now returns the unsubscribe function directly
      unsubscribe = await fetchRequests();
      // Fetch suggestions after starting to fetch requests
      fetchSuggested();
    };

    init(); // Run the initialization function

    // Cleanup function: This runs when the component unmounts or dependencies change
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe(); // Stop listening to request updates to prevent memory leaks
      }
    };
    // Dependencies: Re-run effect if user, fetchRequests, or fetchSuggested changes
  }, [currentUser, fetchRequests, fetchSuggested]);

  // --- Send Request Handler ---
  // Logic for sending a connection request via username input
  const handleSendRequest = async () => {
    if (!userInput.trim()) return Alert.alert('Info', 'Please enter a username.'); // Check for empty input
    if (!currentUser) return Alert.alert('Error', 'You must be logged in.'); // Check for user

    setLoading(true); // Start loading indicator for send button
    try {
      // Find the recipient user by username
      const recipientQuery = query(collection(db, 'Users'), where('username', '==', userInput.trim()));
      const recipientSnapshot = await getDocs(recipientQuery);

      if (recipientSnapshot.empty) {
        Alert.alert('Not Found', 'No user found with that username.');
        setLoading(false);
        return;
      }

      const recipientDoc = recipientSnapshot.docs[0];
      const recipientId = recipientDoc.id;

      // Prevent sending request to self
      if (recipientId === currentUser.uid) {
        Alert.alert('Oops', 'You cannot send a request to yourself.');
        setLoading(false);
        return;
      }

      // Check if a request (pending or accepted) already exists from currentUser to recipient
      const requestsRef = collection(db, 'Users', recipientId, 'requests');
      const existingRequestQuery = query(requestsRef, where('fromUserId', '==', currentUser.uid));
      const existingRequestSnap = await getDocs(existingRequestQuery);

      if (!existingRequestSnap.empty) {
         const status = existingRequestSnap.docs[0].data().status;
         if (status === 'pending') {
            Alert.alert('Already Sent', 'You have already sent a pending request to this user.');
         } else if (status === 'accepted') {
             Alert.alert('Already Connected', 'You are already connected with this user.');
         } else {
             Alert.alert('Request Exists', 'A request to this user already exists.'); // Generic fallback
         }

        setLoading(false);
        return;
      }

      // Get sender's current username (important if it can change)
      const senderDocRef = doc(db, 'Users', currentUser.uid);
      const senderDocSnap = await getDoc(senderDocRef);
      const senderUsername = senderDocSnap.exists() ? senderDocSnap.data().username : 'Unknown User';


      // Add the new request document to the recipient's 'requests' subcollection
      await addDoc(requestsRef, {
        fromUserId: currentUser.uid,
        fromName: senderUsername,
        status: 'pending',
        timestamp: serverTimestamp(),
        // NOTE: Bio/Pic are NOT added here; they are fetched by the receiver
      });

      Alert.alert('Request Sent', `Request sent to ${userInput.trim()}`);
      setUserInput(''); // Clear input field
      // Optional: Refresh suggestions or remove the user from suggestions if present
      fetchSuggested();

    } catch (error) {
      console.error('Error sending request:', error);
      Alert.alert('Error', 'Could not send request. Please try again.');
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // --- Accept Request Handler ---
  const handleAcceptRequest = useCallback(async (id) => {
    if (!currentUser) return; // Guard clause
    try {
      // Reference to the request document in the current user's requests
      const requestRef = doc(db, 'Users', currentUser.uid, 'requests', id);
      // Update the status to 'accepted'
      await updateDoc(requestRef, { status: 'accepted' });

      // --- Optional: Create a mutual connection ---
      // You might want additional logic here, e.g., adding both users to each other's
      // 'connections' list or creating a separate 'friendships' document.
      // This example keeps it simple by just updating the status.

      Alert.alert("Request Accepted!"); // Provide feedback

    } catch (e) {
      console.error("Error accepting request:", e);
      Alert.alert('Error', 'Could not accept request.');
    }
  }, [currentUser]); // Dependency: currentUser

  // --- Decline Request Handler ---
  const handleDeclineRequest = useCallback(async (id) => {
    if (!currentUser) return; // Guard clause
    try {
      // Reference to the request document to be deleted
      const requestRef = doc(db, 'Users', currentUser.uid, 'requests', id);
      // Delete the document
      await deleteDoc(requestRef);
      // The onSnapshot listener will automatically update the UI by removing the request
      Alert.alert("Request Declined"); // Provide feedback
    } catch (e) {
      console.error("Error declining request:", e);
      Alert.alert('Error', 'Could not decline request.');
    }
  }, [currentUser]); // Dependency: currentUser


  // --- Render Scene Logic for Tabs ---
  const renderScene = ({ route }) => {
    // Show loading indicator for Pending/Accepted tabs while initial requests load
    if (loadingRequests && (route.key === 'pending' || route.key === 'accepted')) {
        return <ActivityIndicator style={{ marginTop: 30 }} size="large" color={primaryColor} />;
    }

    switch (route.key) {
      case 'find':
        return (
          <FindConnectionsTab
            userInput={userInput}
            setUserInput={setUserInput} // Pass state setter
            loading={loading}
            sendRequest={handleSendRequest} // Pass handler
            suggestedUsers={suggestedUsers}
            currentUser={currentUser}
            setSuggestedUsers={setSuggestedUsers} // Pass state setter
          />
        );
      case 'pending':
        return (
          <PendingRequestsTab
            requests={requests} // Pass the enriched requests
            acceptRequest={handleAcceptRequest} // Pass handler
            declineRequest={handleDeclineRequest} // Pass handler
          />
        );
      case 'accepted':
        return <AcceptedRequestsTab requests={requests} />; // Pass the enriched requests
      default:
        return null; // Should not happen with defined routes
    }
  };

  // --- Render Tab Bar ---
  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={tabStyles.indicator} // Style for the sliding indicator
      style={tabStyles.tabBar} // Style for the tab bar container
      renderLabel={({ route, focused }) => ( // Custom label rendering
        <Text style={[tabStyles.tabLabel, { color: focused ? primaryColor : '#555' }]}>
          {route.title}
        </Text>
      )}
    />
  );

  // --- Main Return JSX ---
  return (
    <TabView
      navigationState={{ index, routes }} // Control the tabs' state
      renderScene={renderScene} // Function to render content for each tab
      onIndexChange={setIndex} // Update state when tab changes
      initialLayout={{ width: layout.width }} // Optimize initial rendering
      renderTabBar={renderTabBar} // Use the custom tab bar
    />
  );
};

// --- Styles ---
const tabStyles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fafafa', // Light background for content area
  },
  tabBar: {
    backgroundColor: '#ffffff', // White tab bar background
    borderBottomWidth: 1,       // Subtle border bottom
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,    
               // Elevation for Android shadow
  },
  indicator: {
    backgroundColor: primaryColor, // Pink indicator line
    height: 3,
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: '600', // Semi-bold labels
    textTransform: 'capitalize', // Capitalize tab titles
    marginVertical: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 10, // Add some top margin to section titles
  
  },
  // Send Request Styles
  sendRequestContainer: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12, // Increased padding
    fontSize: 16,
    backgroundColor: '#fff', // White input background
  },
  sendButton: {
    backgroundColor: primaryColor,
    paddingHorizontal: 18, // Adjusted padding
    height: 45, // Match input height
    justifyContent: 'center', // Center text vertically
    borderRadius: 8,
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#ffc1e3', // Lighter pink when disabled
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  // Suggestion Styles
  suggestedContainer: {
     marginTop: 15,
  },
  suggestionItem: {
    flexDirection: 'row',
    paddingVertical: 12, // Adjusted padding
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // Lighter border
    alignItems: 'center',
    backgroundColor: '#fff', // White background for items
    borderRadius: 8,        // Rounded corners
    marginBottom: 8,       // Space between items
  },
  profilePicSmall: {
    width: 40,              // Standardized size
    height: 40,
    borderRadius: 20,       // Circular
  },
  userIconContainerSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0', // Placeholder background
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionUsername: {
    fontWeight: '600', // Semi-bold username
    fontSize: 15,
    color: '#262626', // Darker text color
  },
  suggestionBio: {
    fontSize: 13,
    color: '#777', // Grey color for bio
    marginTop: 2,
  },
  connectButton: {
    backgroundColor: primaryColor,
    paddingHorizontal: 12, // Adjusted padding
    paddingVertical: 6,   // Adjusted padding
    borderRadius: 6,
  },
  connectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  // Generic Styles (No Requests, Accepted Status)
  noRequests: {
    fontSize: 15,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 40, // More margin top
    fontStyle: 'italic',
  },
  acceptedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Align to the right
    marginTop: 8,
    paddingRight: 5, // Add some padding
  },
  acceptedText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600', // Make accepted text semi-bold
    color: '#4CAF50', // Green color for accepted status
  },
  // RequestItem Styles
  requestItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10, // More rounded corners
    shadowColor: '#000',
    shadowOpacity: 0.08, // Softer shadow
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, // Softer elevation
    borderWidth: 1, // Optional subtle border
    borderColor: '#f0f0f0',
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5, // Less margin below header
  },
  profilePic: {
    width: 45,      // Standardized size
    height: 45,
    borderRadius: 22.5, // Circular
  },
  userIconContainer: { // Used when no profilePic available
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#262626', // Darker name color
  },
  requestBio: {
    fontSize: 14,
    color: '#777', // Grey bio color
    marginTop: 3,
  },
  timestamp: {
    fontSize: 11, // Smaller timestamp
    color: '#aaa',
    marginTop: 8, // More space above timestamp
    marginBottom: 8, // Space below timestamp
    alignSelf: 'flex-start', // Align timestamp left
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align buttons to the right
    marginTop: 5, // Space above buttons
  },
  acceptButton: {
    backgroundColor: '#4CAF50', // Green accept button
    padding: 10, // Circular padding
    borderRadius: 20, // Make buttons circular
    marginLeft: 10, // Space between buttons
    justifyContent: 'center',
    alignItems: 'center',
    width: 40, // Fixed size
    height: 40,
  },
  declineButton: {
    backgroundColor: '#FF1744', // Red decline button
    padding: 10,
    borderRadius: 20, // Circular
    marginLeft: 10, // Space from accept button if both shown (not usually)
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
});

export default Requests;