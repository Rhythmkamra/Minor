// app/tabs/_layout.jsx
import { StyleSheet } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import CommunityNavigator from '../community/CommunityNavigator';


const TabLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: Colors.PRIMARY }}>
      <Tabs.Screen
        name="mytrip"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="location-sharp" size={24} color="pink" />,
          tabBarLabel: 'My Trip',
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="globe" size={24} color="pink" />,
          tabBarLabel: 'Discover',
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="people-circle" size={24} color="pink" />,
          tabBarLabel: 'Profile',
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={24} color="pink" />,
          tabBarLabel: 'Community',
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

const styles = StyleSheet.create({});
