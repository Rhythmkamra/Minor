import { StyleSheet, Text, View, Button } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

const Discover = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover</Text>
      <Button
        title="Chat with TravelBot"
        onPress={() => router.push('/chatbot')}
        color="#ff5c8d"
      />
    </View>
  );
};

export default Discover;

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingTop: 55,
    backgroundColor: '#fff',
    height: '100%',
  },
  title: {
    fontSize: 30,
    fontFamily: 'outfit-bold',
    marginBottom: 20,
  },
});
