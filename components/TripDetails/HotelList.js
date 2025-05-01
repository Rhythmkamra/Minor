import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const HotelList = ({ hotelList }) => {
  if (!hotelList || hotelList.length === 0) return <Text style={styles.noHotels}>No hotels available</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hotel Bookings</Text>
      {hotelList.map((hotel, index) => (
        <View key={index} style={styles.card}>
          <Image 
            source={{ uri: hotel.image_url }} 
            style={styles.hotelImage} 
            resizeMode="cover" 
          />
          <View style={styles.hotelDetails}>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <Text style={styles.address}>{hotel.address}</Text>
            <Text style={styles.description}>{hotel.description}</Text>
            <Text style={styles.location}>Location: {hotel.geo_coordinates}</Text>
          </View>
          {/* Optional: Add a button for more details */}
          <TouchableOpacity style={styles.moreDetailsButton}>
            <Text style={styles.moreDetailsText}>See Details</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default HotelList;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  hotelImage: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  hotelDetails: {
    padding: 15,
  },
  hotelName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    color: '#777',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  location: {
    fontSize: 14,
    color: '#888',
  },
  moreDetailsButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  moreDetailsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  noHotels: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 30,
  },
});
