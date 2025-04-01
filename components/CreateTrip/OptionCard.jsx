import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colors } from './../../constants/Colors';
const OptionCard = ({ option }) => {  
  if (!option || !option.title) return null; 

  return (
    <View style={styles.card}>
      <View>
      <Text style={styles.title}>{String(option.title)}</Text> 
      <Text style={{
        fontFamily:'outfit',
        fontSize:15,
      }}>{String(option.desc)}</Text> 
    </View>
    <Text style={{
        fontFamily:'outfit',
        fontSize:20,
      }}>{String(option.icon)}</Text> 
    </View>
  );
};

export default OptionCard;

const styles = StyleSheet.create({
  card: {
    padding: 25,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginVertical: 15,
    // alignItems: 'center'
    display:'flex,',
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor:'pink'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
   
  }
});
