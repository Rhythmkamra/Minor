import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

const TripDetails = () => {
  const { trip } = useLocalSearchParams();
  const tripData = JSON.parse(trip || '{}');

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {tripData.tripData?.location || 'Unnamed'} Trip
      </Text>
      <Text style={styles.details}>Trip ID: {tripData.id}</Text>
      <Text style={styles.details}>Traveler: {tripData.tripData?.traveler?.title || 'N/A'}</Text>
    </View>
  );
};

export default TripDetails;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    marginTop: 5,
  },
});
