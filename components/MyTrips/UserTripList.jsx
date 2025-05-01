import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../configs/FirebaseConfigs';
import StartNewTripCard from './StartNewTripCard';
import StartMoodboardTripCard from './StartMoodboardTripCard';
import { useRouter } from 'expo-router';

const UserTripsList = ({ searchQuery, showAddOptions }) => {
  const [userTrips, setUserTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;
  const userEmail = user?.email;
  const router = useRouter();

  useEffect(() => {
    if (userEmail) fetchTrips();
  }, [userEmail]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = userTrips.filter((trip) =>
        trip.tripData?.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTrips(filtered);
    } else {
      setFilteredTrips(userTrips);
    }
  }, [searchQuery, userTrips]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'UserTrip'), where('userEmail', '==', userEmail));
      const snapshot = await getDocs(q);

      const tripsArray = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserTrips(tripsArray);
      setFilteredTrips(tripsArray);
    } catch (err) {
      console.error('Error fetching trips:', err);
    }
    setLoading(false);
  };

  const handleTripClick = (trip) => {
    router.push({
      pathname: '/trip-details',
      params: { trip: JSON.stringify(trip) },
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#ff5c8d" />;
  }

  if (showAddOptions || filteredTrips.length === 0) {
    return (
      <>
        <StartNewTripCard />
        <StartMoodboardTripCard />
      </>
    );
  }

  return (
    <View>
      {filteredTrips.map((trip) => (
        <TouchableOpacity key={trip.id} onPress={() => handleTripClick(trip)}>
          <View style={{
            backgroundColor: '#f56c97',
            padding: 20,
            borderRadius: 15,
            marginVertical: 10,
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
              {trip.tripData?.location || 'Unnamed'} Trip
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default UserTripsList;
