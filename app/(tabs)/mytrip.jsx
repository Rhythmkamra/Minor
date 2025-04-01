import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from './../../constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import StartNewTripCard from './../../components/MyTrips/StartNewTripCard';

const Mytrip = () => {
  const [userTrips, setUserTrips] =useState([]);
  return (
    <View style={{
      padding: 25,
      paddingTop: 55,
      backgroundColor:Colors.WHITE,
      height: '100%',

    }}>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }} >
      <Text style = {{
        fontFamily:'outfit-bold',
        fontSize: 35,
      }}>My Trips</Text>
      
        <Ionicons name="add" size={45} color="black" />
      </View>
      {userTrips.length === 0 ? <StartNewTripCard /> : null }
    </View>
  )
}

export default Mytrip

const styles = StyleSheet.create({})