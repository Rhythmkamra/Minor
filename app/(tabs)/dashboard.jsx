import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Dashboard = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title1}>Discover</Text>
       
        <Image
          source={require('../../assets/images/logo2.png')}
          style={styles.logo}
        />
        

    
      </View>
      <Text style={styles.title2}>Safar Community</Text>
      <Text style={styles.subtitle}>Connect, explore and share your journey</Text>

      <ScrollView contentContainerStyle={styles.cardContainer} showsVerticalScrollIndicator={false}>
        <Card
          title="Let's Connect"
          icon="account-plus"
          onPress={() => router.push('/community/requests')}
        />
        <Card
          title="Travel Groups"
          icon="account-group"
          onPress={() => router.push('/community/groups')}
        />

        <Card
          title="My Connections"
          icon="account-multiple"
          onPress={() => router.push('/community/connections')}
        />
      </ScrollView>
    </View>
  );
};

const Card = ({ title, icon, onPress }) => {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={onPress}>
      <Icon name={icon} size={30} color="#fff" style={styles.icon} />
      <Text style={styles.cardText}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title1: {
    fontSize: 34,
    fontWeight: '800',
    color: 'black',
    textAlign: 'center',
    flex: 1,
    marginRight: 10,
    
  },
  title2: {
    fontSize: 34,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
    flex: 1,
    marginRight: 10,
    marginTop: -10,
  },
  subtitle: {
    fontSize: 16,
    color: '#687076',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 8,
  },
  cardContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ff5c8d',
    width: '90%',
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.95,
  },
  icon: {
    marginBottom: 10,
  },
  cardText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.5,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 30,
    top: 0,
      right: -11,
  },

});

export default Dashboard;
