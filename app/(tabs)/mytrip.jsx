import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Colors } from './../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import StartNewTripCard from './../../components/MyTrips/StartNewTripCard';
import StartMoodboardTripCard from './../../components/MyTrips/StartMoodboardTripCard'; // Import the new component

const Mytrip = () => {
  const [userTrips, setUserTrips] = useState([]);

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
        <Ionicons name="add" size={45} color="black" />
      </View>

      {userTrips.length === 0 ? (
        <>
          <StartNewTripCard />
          <StartMoodboardTripCard />
        </>
      ) : null}

    </View>
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 35,
  },
});
