import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
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
  const [loading, setLoading] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [showChatIntro, setShowChatIntro] = useState(false);

  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchUserTrips();
    }
  }, [user]);

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
                {userTrips.length === 0 ? (
                  <>
                    <StartNewTripCard />
                    <StartMoodboardTripCard />
                  </>
                ) : (
                  userTrips.map((trip, index) => (
                    <View key={trip.id || index} style={styles.tripCard}>
                      {trip.tripData?.location && (
                        <Text style={styles.tripName}>
                          {trip.tripData.location} Trip
                        </Text>
                      )}
                      {trip.tripData?.startDate && (
                        <Text style={styles.tripDetails}>Start Date: {trip.tripData.startDate}</Text>
                      )}
                      {trip.tripData?.endDate && (
                        <Text style={styles.tripDetails}>End Date: {trip.tripData.endDate}</Text>
                      )}
                      {trip.tripData?.budget && (
                        <Text style={styles.tripDetails}>Budget: {trip.tripData.budget}</Text>
                      )}
                      {trip.tripData?.traveler && (
                        <Text style={styles.tripDetails}>Traveler: {trip.tripData.traveler}</Text>
                      )}
                    </View>
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
      <Modal
        visible={showChatIntro}
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
  tripDetails: {
    fontSize: 16,
    color: 'white',
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
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
