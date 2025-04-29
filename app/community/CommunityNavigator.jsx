import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Connections from './connections';  // Correct path
import Chat from './chat';  // Correct path

const Stack = createNativeStackNavigator();

const CommunityNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Connections" component={Connections} />
      <Stack.Screen name="Chat" component={Chat} />  {/* Ensure 'Chat' is correctly registered */}
    </Stack.Navigator>
  );
};

export default CommunityNavigator;