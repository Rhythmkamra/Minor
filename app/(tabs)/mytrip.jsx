import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState } from 'react';
import { Colors } from './../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import StartNewTripCard from './../../components/MyTrips/StartNewTripCard';
import StartMoodboardTripCard from './../../components/MyTrips/StartMoodboardTripCard';
import { useRouter } from 'expo-router'; // 🆕 import router

const Mytrip = () => {
  const [userTrips, setUserTrips] = useState([]);
  const router = useRouter(); // 🆕 initialize router

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

      {/* 🆕 Chatbot Button */}
      <View style={styles.chatbotButton}>
        <Button
          title="Chat with TravelBot"
          onPress={() => router.push('/chatbot')}
          color="#ff5c8d"
        />
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 35,
  },
  chatbotButton: {
    marginTop: 20,
  },
});
