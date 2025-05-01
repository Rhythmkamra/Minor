import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import UserTripsList from '../../components/MyTrips/UserTripList';
import { useRouter } from 'expo-router';

const MyTrip = () => {
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [showChatIntro, setShowChatIntro] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleAddTrip = () => setShowAddOptions(true);
  const handleBackToTrips = () => setShowAddOptions(false);
  const openChatbotIntro = () => setShowChatIntro(true);
  const goToChatbot = () => {
    setShowChatIntro(false);
    router.push('/chatbot');
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={showAddOptions ? handleBackToTrips : handleAddTrip}>
            <Ionicons name={showAddOptions ? "arrow-back" : "add"} size={35} color="black" />
          </TouchableOpacity>

          <Text style={styles.title}>
            {showAddOptions ? 'Add New' : 'My Trips'}
          </Text>

          <View style={{ width: 35 }} />
        </View>

        <TextInput
          style={styles.searchBar}
          placeholder="Search trips by location"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />

        <UserTripsList searchQuery={searchQuery} showAddOptions={showAddOptions} />
      </ScrollView>

      <TouchableOpacity onPress={openChatbotIntro} style={styles.floatingButton}>
        <Ionicons name="chatbubble-ellipses" size={30} color="white" />
      </TouchableOpacity>

      {showChatIntro && (
        <Modal transparent animationType="fade" onRequestClose={() => setShowChatIntro(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Ionicons name="chatbubbles" size={40} color="#ff5c8d" />
              <Text style={styles.modalTitle}>Chat with HUMsafar</Text>
              <Text style={styles.modalText}>Your smart travel assistant 🤖</Text>
              <Pressable style={styles.modalButton} onPress={goToChatbot}>
                <Text style={styles.modalButtonText}>Continue</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default MyTrip;

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingTop: 55,
    backgroundColor: Colors.WHITE,
    minHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 30,
    textAlign: 'center',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#ff5c8d',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#ff5c8d',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

