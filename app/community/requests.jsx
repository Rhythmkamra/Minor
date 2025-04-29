import React, { useState } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const Requests = () => {
  const [requests, setRequests] = useState([
    { id: '1', name: 'Alice Johnson', status: 'pending' },
  ]); // Replace with real Firebase requests later
  const [userInput, setUserInput] = useState(''); // To store input for sending requests

  const acceptRequest = (id) => {
    alert(`Accepted request from ${id}`);
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === id ? { ...req, status: 'accepted' } : req
      )
    );
  };

  const sendRequest = () => {
    if (userInput.trim()) {
      const newRequest = {
        id: Math.random().toString(),
        name: userInput,
        status: 'pending',
      };
      setRequests((prevRequests) => [...prevRequests, newRequest]);
      setUserInput(''); // Clear the input after sending the request
      alert(`Request sent to ${userInput}`);
    } else {
      alert('Please enter a name to send the request.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connection Requests</Text>

      {/* Send Request Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Send a Connection Request</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            value={userInput}
            onChangeText={setUserInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendRequest}>
            <Text style={styles.sendButtonText}>Send Request</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Accept Requests Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Pending Requests</Text>
        <FlatList
          data={requests.filter((req) => req.status === 'pending')}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.requestItem}>
              <Text style={styles.requestName}>{item.name}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => acceptRequest(item.id)}
                >
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {/* Accepted Requests Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Accepted Requests</Text>
        <FlatList
          data={requests.filter((req) => req.status === 'accepted')}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.requestItem}>
              <Text style={styles.requestName}>{item.name}</Text>
              <Text style={styles.acceptedText}>Accepted</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#000000',  // Black border for input
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    paddingLeft: 10,
  },
  sendButton: {
    backgroundColor: '#FFC0CB',  // Soft pink color for button
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,  // Black border around the button
    borderColor: '#000000',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  requestItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  requestName: {
    fontSize: 18,
    color: '#2C3E50',
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#FFC0CB',  // Soft pink color for button
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,  // Black border around the accept button
    borderColor: '#000000',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  acceptedText: {
    color: '#FFC0CB',  // Soft pink color for accepted status
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default Requests;

























