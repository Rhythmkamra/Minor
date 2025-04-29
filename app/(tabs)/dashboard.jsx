import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const Dashboard = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Let's Discover</Text>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/community/connections')}>
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>My Connections</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/community/groups')}>
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>Travel Groups</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/community/requests')}>
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>Let's Connect</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  heading: {
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 40,
    color: '#687076',
    textAlign: 'center',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#FFC0CB',
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginVertical: 15,
    width: '90%',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ translateY: -5 }],
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default Dashboard;
