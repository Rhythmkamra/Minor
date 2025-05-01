import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from './../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import StartNewTripCard from './../../components/MyTrips/StartNewTripCard';
import StartMoodboardTripCard from './../../components/MyTrips/StartMoodboardTripCard';
import { db, auth } from './../../configs/FirebaseConfigs';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const Mytrip = () => {
  const [userTrips, setUserTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [showChatIntro, setShowChatIntro] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null); // Store selected trip data

  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchUserTrips();
    }
  }, [user]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredTrips(
        userTrips.filter((trip) =>
          trip.tripData?.location?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredTrips(userTrips);
    }
  }, [searchQuery, userTrips]);

  const fetchUserTrips = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'UserTrip'),
        where('userEmail', '==', user.email)
      );
      const querySnapshot = await getDocs(q);

      const tripsArray = [];
      querySnapshot.forEach((doc) => {
        tripsArray.push({ id: doc.id, ...doc.data() });
      });

      setUserTrips(tripsArray);
      setFilteredTrips(tripsArray);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
    setLoading(false);
  };

  const handleAddTrip = () => setShowAddOptions(true);
  const handleBackToTrips = () => setShowAddOptions(false);
  const openChatbotIntro = () => setShowChatIntro(true);
  const goToChatbot = () => {
    setShowChatIntro(false);
    router.push('/chatbot');
  };

  const handleTripClick = (trip) => {
    setSelectedTrip(trip); // Store the entire trip data in state
    router.push(`/tripdetails/${trip.id}`); // Navigate to the TripDetails page with trip id
  };
  
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={showAddOptions ? handleBackToTrips : handleAddTrip}>
            <Ionicons name={showAddOptions ? "arrow-back" : "add"} size={35} color="black" />
          </TouchableOpacity>

          <Text style={styles.title}>
            {showAddOptions ? 'Add New' : 'My Trips'}
          </Text>

          <View style={{ width: 35 }} />
        </View>

        <TextInput
          style={styles.searchBar}
          placeholder="Search trips by location"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />

        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <>
            {showAddOptions ? (
              <>
                <StartNewTripCard />
                <StartMoodboardTripCard />
              </>
            ) : (
              <>
                {filteredTrips.length === 0 ? (
                  <>
                    <StartNewTripCard />
                    <StartMoodboardTripCard />
                  </>
                ) : (
                  filteredTrips.map((trip, index) => (
                    <TouchableOpacity key={trip.id || index} onPress={() => handleTripClick(trip)}>
                      <View style={styles.tripCard}>
                        {trip.tripData?.location && (
                          <Text style={styles.tripName}>
                            {trip.tripData.location} Trip
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Floating Chatbot Button */}
      <TouchableOpacity
        onPress={openChatbotIntro}
        style={styles.floatingButton}
      >
        <Ionicons name="chatbubble-ellipses" size={30} color="white" />
      </TouchableOpacity>

      {/* Modal for HUMsafar Chat Intro */}
      {showChatIntro && (
        <Modal
          transparent
          animationType="fade"
          onRequestClose={() => setShowChatIntro(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Ionicons name="chatbubbles" size={40} color="#ff5c8d" />
              <Text style={styles.modalTitle}>Chat with HUMsafar</Text>
              <Text style={styles.modalText}>Your smart travel assistant 🤖</Text>

              <Pressable style={styles.modalButton} onPress={goToChatbot}>
                <Text style={styles.modalButtonText}>Continue</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Mytrip;

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingTop: 55,
    backgroundColor: Colors.WHITE,
    minHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 30,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 30,
  },
  tripCard: {
    backgroundColor: '#f56c97',
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
  },
  tripName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#ff5c8d',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalSubTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#ff5c8d',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
