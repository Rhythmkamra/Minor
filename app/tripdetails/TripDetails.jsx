import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router'; // For getting the query parameters

const TripDetails = () => {
  const router = useRouter();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    if (router?.query?.trip) {
      const parsedTrip = JSON.parse(router.query.trip); // Parse the passed trip data
      setTrip(parsedTrip);
    }
  }, [router.query]);

  if (!trip) return <Text>Loading...</Text>; // Show loading if data is not ready

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{trip.tripData?.location} Trip Details</Text>

      {/* Trip Details */}
      <Text style={styles.detailText}>Start Date: {trip.tripData?.startDate}</Text>
      <Text style={styles.detailText}>End Date: {trip.tripData?.endDate}</Text>
      <Text style={styles.detailText}>Budget: {trip.tripData?.budget}</Text>
      <Text style={styles.detailText}>Traveler: {trip.tripData?.traveler}</Text>
      
      {/* Hotels */}
      <Text style={styles.sectionTitle}>Hotels:</Text>
      {trip.hotels?.length > 0 ? (
        trip.hotels.map((hotel, index) => (
          <Text key={index} style={styles.detailText}>{hotel.name} - {hotel.address}</Text>
        ))
      ) : (
        <Text style={styles.detailText}>No hotels listed.</Text>
      )}

      {/* Flights */}
      <Text style={styles.sectionTitle}>Flights:</Text>
      {trip.flights?.length > 0 ? (
        trip.flights.map((flight, index) => (
          <Text key={index} style={styles.detailText}>{flight.flightName} - {flight.flightDetails}</Text>
        ))
      ) : (
        <Text style={styles.detailText}>No flights listed.</Text>
      )}

      {/* Tourist Spots */}
      <Text style={styles.sectionTitle}>Tourist Spots:</Text>
      {trip.touristSpots?.length > 0 ? (
        trip.touristSpots.map((spot, index) => (
          <Text key={index} style={styles.detailText}>{spot.name} - {spot.description}</Text>
        ))
      ) : (
        <Text style={styles.detailText}>No tourist spots listed.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  detailText: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default TripDetails;
