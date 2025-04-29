import { StyleSheet, Text, View, Button } from 'react-native';
import React from 'react';

const Discover = () => {
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover</Text>
     
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
