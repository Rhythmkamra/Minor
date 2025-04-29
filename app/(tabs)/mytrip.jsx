import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
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

      console.log('Fetched Trips:', tripsArray);
      setUserTrips(tripsArray);

    } catch (error) {
      console.error('Error fetching trips:', error);
    }
    setLoading(false);
  };

  const handleAddTrip = () => {
    setShowAddOptions(true);
  };

  const handleBackToTrips = () => {
    setShowAddOptions(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={showAddOptions ? handleBackToTrips : handleAddTrip}>
          <Ionicons name={showAddOptions ? "arrow-back" : "add"} size={35} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>
          {showAddOptions ? 'Add New' : 'My Trips'}
        </Text>

        {/* Invisible view to balance the header */}
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

      {/* Chatbot button - always visible */}
      <View style={styles.chatBotContainer}>
        <Text style={styles.helpText}>Need help?</Text>
        <TouchableOpacity
          onPress={() => router.push('/chatbot')}
          style={styles.chatBotButton}
        >
          <Text style={styles.chatBotButtonText}>Chat with HUMsafar - the travel bot</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    backgroundColor:'#f56c97',
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
  },
  tripName: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'white',
    marginBottom: 5,
  },
  tripDetails: {
    fontSize: 16,
    color: 'white',
  },
  chatBotContainer: {
    marginTop: 30,
    marginBottom: 40,
    alignItems: 'center',
  },
  helpText: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    marginBottom: 10,
  },
  chatBotButton: {
    backgroundColor: '#ff5c8d',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  chatBotButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
