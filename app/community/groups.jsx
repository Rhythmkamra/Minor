import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput, Platform } from 'react-native';

const Groups = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupMembers, setNewGroupMembers] = useState('');
  const [groupType, setGroupType] = useState('Travel');
  const [groups, setGroups] = useState([
    { id: '1', name: 'Europe Tour: Exploring Europe', type: 'Travel' },
    { id: '2', name: 'Exploring Asia: Backpacking in Asia', type: 'Travel' },
    { id: '3', name: 'Beach Lovers', type: 'Beach' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateGroup = () => {
    if (newGroupName && newGroupMembers) {
      const newGroup = { id: Math.random().toString(), name: newGroupName, type: groupType };
      setGroups([...groups, newGroup]);
      setNewGroupName('');
      setNewGroupMembers('');
      setGroupType('Travel');
      setModalVisible(false);
    } else {
      alert('Please enter valid group details');
    }
  };

  const handleSearchGroups = (query) => {
    setSearchQuery(query);
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Travel Groups</Text>
      <Text style={styles.subtitle}>You are part of {groups.length} groups currently.</Text>

      {/* Search for existing groups */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search Groups"
        value={searchQuery}
        onChangeText={handleSearchGroups}
        placeholderTextColor="#999"
      />

      {/* New Companions section with filtered groups */}
      <FlatList
        data={filteredGroups}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.suggestedGroupCard}>
            <Text style={styles.suggestedGroup}>{item.name}</Text>
            <Text style={styles.groupType}>{item.type}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        style={styles.suggestedGroupsContainer}
        ListHeaderComponent={
          <>
            <Text style={styles.suggestionTitle}>New Companions?</Text>
          </>
        }
      />

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.createGroupButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Create a New Group</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.joinGroupButton}>
          <Text style={styles.buttonText}>Join an Existing Group</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for creating a new group */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create a New Group</Text>
            <TextInput
              style={styles.input}
              placeholder="Group Name"
              value={newGroupName}
              onChangeText={setNewGroupName}
            />
            <TextInput
              style={styles.input}
              placeholder="Add Members (comma separated)"
              value={newGroupMembers}
              onChangeText={setNewGroupMembers}
            />
            <Text style={styles.inputLabel}>Group Type</Text>
            <View style={styles.groupTypeSelector}>
              {['Travel', 'Hiking', 'Photography', 'Beach'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    groupType === type && styles.selectedType,
                  ]}
                  onPress={() => setGroupType(type)}
                >
                  <Text style={styles.typeButtonText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={handleCreateGroup}>
                <Text style={styles.buttonText}>Create Group</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#687076',
    marginBottom: 10,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  suggestionTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff5c8d',
  },
  searchInput: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginVertical: 15,
    backgroundColor: '#f9f9f9',
  },
  suggestedGroupsContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  suggestedGroupCard: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  suggestedGroup: {
    fontSize: 18,
    color: '#555',
    fontWeight: '600',
  },
  groupType: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  actionsContainer: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  createGroupButton: {
    backgroundColor: '#ff5c8d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  joinGroupButton: {
    backgroundColor: '#687076',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#687076',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#687076',
    marginBottom: 10,
  },
  groupTypeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 25,
  },
  typeButton: {
    backgroundColor: '#f7f7f7',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    margin: 8,
  },
  selectedType: {
    backgroundColor: '#FFC0CB',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#687076',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#FFC0CB',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
    marginRight: 15,
  },
});

export default Groups;
