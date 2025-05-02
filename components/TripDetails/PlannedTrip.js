import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

const PlannedTrip = ({ details }) => {
  if (!details || !Array.isArray(details)) return null;

  const grouped = details.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {});

  const days = Object.keys(grouped);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🗓️ Your Itinerary</Text>
      {days.map((day) => (
        <View key={day} style={styles.daySection}>
          <Text style={styles.dayTitle}>{day}</Text>
          {grouped[day].map((activity, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.activityTitle}>🎯 {activity.activity}</Text>
              <Text style={styles.detailText}>📍 {activity.details}</Text>
              <Text style={styles.detailText}>🕒 {activity.time} — {activity.time_to_spend}</Text>
              <Text style={styles.detailText}>🌤️ Best Time: {activity.best_time_to_visit}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default PlannedTrip;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    marginBottom: 16,
    color: Colors.primary,
  },
  daySection: {
    marginBottom: 25,
  },
  dayTitle: {
    fontSize: 22,
    fontFamily: 'Outfit-Bold',
    marginBottom: 12,
    color: Colors.primaryDark || '#333',
  },
  card: {
    backgroundColor: Colors.lightGray || '#f6f6f6',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    marginBottom: 6,
    color: '#333',
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Outfit',
    color: Colors.gray,
    marginBottom: 3,
  },
});
