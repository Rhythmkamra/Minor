// app/community/Connections.jsx
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useState, useLayoutEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router'; // Import useRouter
import { db } from '../../configs/FirebaseConfigs';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  // const navigation = useNavigation(); // Remove useNavigation
  const router = useRouter(); // Use useRouter from expo-router
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useLayoutEffect(() => {
    // You might not need headerLeft like this with Expo Router's Stack
    // If you do, ensure it's within the CommunityNavigator's Stack.Screen options
    // navigation.setOptions({
    //   headerLeft: () => (
    //     <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
    //       <FontAwesome5 name="arrow-left" size={24} color="#687076" />
    //     </TouchableOpacity>
    //   ),
    //   headerStyle: { backgroundColor: '#F0F2F5' },
    //   headerTitleStyle: { fontSize: 20, fontWeight: '600', color: '#2C3E50' },
    // });
  }, [router]); // Use router in the dependency array if needed

  useEffect(() => {
    const fetchConnections = async () => {
      if (!currentUser) return;

      try {
        const acceptedRequestsRef = collection(db, 'Users', currentUser.uid, 'requests');
        const querySnapshot = await getDocs(query(acceptedRequestsRef, where('status', '==', 'accepted')));

        const acceptedConnections = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setConnections(acceptedConnections);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching connections:", error);
        setLoading(false);
      }
    };

    fetchConnections();
  }, [currentUser]);

  const handlePress = (connection) => {
    router.push({
      pathname: '/community/chat',
      params: {
        currentUserId: currentUser.uid, // VERY IMPORTANT: Ensure currentUser.uid is the logged-in user's ID
        selectedUserId: connection.fromUserId, // The ID of the user you are chatting with
        name: connection.fromName || 'Unknown User',
      },
    });
  };

  const renderConnection = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
      <View style={styles.cardContent}>
        <FontAwesome5 name="user-circle" size={32} color="#687076" />
        <Text style={styles.connectionName}>{item.fromName || 'Unknown User'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#687076" />
        <Text style={styles.loadingText}>Loading connections...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Connections</Text>
      {connections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="user-slash" size={48} color="#687076" />
          <Text style={styles.emptyText}>No connections yet.</Text>
        </View>
      ) : (
        <FlatList
          data={connections}
          keyExtractor={(item) => item.id}
          renderItem={renderConnection}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
    backgroundColor: '#F0F2F5',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2C3E50',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginHorizontal: 5,
    width: '100%',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  connectionName: {
    fontSize: 18,
    marginLeft: 12,
    color: '#2C3E50',
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#687076',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 18,
    color: '#687076',
  },
  listContent: {
    paddingBottom: 20,
  },
  backButton: {
    marginLeft: 10,
  },
});

export default Connections;