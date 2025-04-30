import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../configs/FirebaseConfigs'; // Import Firestore
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchConnections = async () => {
      if (!currentUser) return;

      try {
        // Fetch the accepted requests for the current user
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
    navigation.navigate('Chat', { connection });
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
    paddingTop: 40, // Reduced padding at the top
    paddingHorizontal: 10, // Reduced horizontal padding
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
    paddingVertical: 18, // Reduced padding for the card
    paddingHorizontal: 12, // Reduced padding inside the card
    marginBottom: 12, // Reduced margin between cards
    borderRadius: 12, // Reduced border radius for a sleeker look
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginHorizontal: 5, // Prevents cards from touching the edges
    width: '100%', // Ensures card width fits the screen
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', // Ensures content doesn't overflow
  },
  connectionName: {
    fontSize: 18, // Slightly smaller font for connection name
    marginLeft: 12, // Reduced margin
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
});

export default Connections;
