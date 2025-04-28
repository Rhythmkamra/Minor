import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from './../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import StartNewTripCard from './../../components/MyTrips/StartNewTripCard';
import StartMoodboardTripCard from './../../components/MyTrips/StartMoodboardTripCard';
import { db, auth } from './../../configs/FirebaseConfigs';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Mytrip = () => {
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
        <Ionicons name="add" size={45} color="black" />
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : userTrips.length === 0 ? (
        <>
          <StartNewTripCard />
          <StartMoodboardTripCard />
        </>
      ) : (
        userTrips.map((trip, index) => (
          <View key={trip.id || index} style={styles.tripCard}>
            <Text style={styles.tripName}>{trip.tripName || 'Unnamed Trip'}</Text>
            <Text style={styles.tripDetails}>Destination: {trip.destination || 'Unknown'}</Text>
            <Text style={styles.tripDetails}>Start Date: {trip.startDate || 'N/A'}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default Mytrip;

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingTop: 55,
    backgroundColor: Colors.WHITE,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 35,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  tripCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
  },
  tripName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tripDetails: {
    fontSize: 16,
    color: '#555',
  },
});
