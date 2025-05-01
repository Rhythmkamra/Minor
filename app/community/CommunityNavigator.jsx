import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ConnectionsScreen from './connections';
import ChatScreen from './chat';

const Stack = createStackNavigator();

const CommunityNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="connections" component={ConnectionsScreen} />
      <Stack.Screen name="chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default CommunityNavigator;
