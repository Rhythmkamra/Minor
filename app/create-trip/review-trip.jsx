import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { CreateTripContext } from '../../context/CreateTripContext';

const ReviewTrip = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { tripData } = useContext(CreateTripContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Your Trip</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>📍 Destination</Text>
        <Text style={styles.value}>{tripData?.location || "Not Selected"}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>👤 Traveler</Text>
        <Text style={styles.value}>{tripData?.traveler || "Not Selected"}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>🗓️ Travel Dates</Text>
        <Text style={styles.value}>
          {tripData?.startDate && tripData?.endDate
            ? `${tripData.startDate} → ${tripData.endDate} (${tripData.totalNumOfDays} Days)`
            : "Not Selected"}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>💰 Budget</Text>
        <Text style={styles.value}>{tripData?.budget || "Not Selected"}</Text>
      </View>

      {/* Conditionally show Moodboard only if selected */}
      {tripData?.moodboard && (
        <View style={styles.infoBox}>
          <Text style={styles.label}>🎨 Moodboard</Text>
          <Text style={styles.value}>{tripData.moodboard}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/create-trip/generate-trip')}
      >
        <Text style={styles.buttonText}>Build My Trip</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReviewTrip;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingTop: 75,
    backgroundColor: Colors.WHITE,
  },
  title: {
    fontSize: 30,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: Colors.LIGHT_GREY,
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  label: {
    fontSize: 18,
    fontFamily: 'outfit-medium',
    color: Colors.DARK_GREY,
  },
  value: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    color: Colors.BLACK,
    marginTop: 5,
  },
  button: {
    marginTop: 30,
    backgroundColor: 'pink',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'outfit-bold',
  },
});
