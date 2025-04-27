import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from './../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function StartMoodboardTripCard() {
  const router = useRouter();
  
  return (
    <View style={{
      backgroundColor: Colors.WHITE,
      marginTop:-14,
      padding: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 25
    }}>
      
      <Ionicons name="images" size={30} color="black" />
      
      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize: 20,
        color: Colors.black,
        textAlign: 'center'
      }}>
        PLAN A MOODBOARD TRIP!
      </Text>
      
      <Text style={{
        fontFamily: 'outfit-medium',
        fontSize: 19,
        color: Colors.GRAY,
        textAlign: 'center'
      }}>
        Create a trip based on your vibe — culinary, culture, sports, and more!
      </Text>
      
      <TouchableOpacity style={{
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 15,
        paddingHorizontal: 30,
      }}
      onPress={() => router.push('/create-trip/moodboard-select')}
      >
        <Text style={{
          textAlign: 'center',
          color: Colors.WHITE,
          fontFamily: 'Outfit-Medium',
          fontSize: 17
        }}>
          Start Moodboard Trip
        </Text>
      </TouchableOpacity>

    </View>
  );
}
