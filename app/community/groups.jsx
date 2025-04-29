import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput } from 'react-native';

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
    fontSize: 18,
    color: '#888',
  },
  suggestionTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFC0CB',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  suggestedGroupsContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  suggestedGroupCard: {
    backgroundColor: '#f7f7f7',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestedGroup: {
    fontSize: 16,
    color: '#555',
  },
  groupType: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  actionsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  createGroupButton: {
    backgroundColor: '#FFC0CB',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  joinGroupButton: {
    backgroundColor: '#687076',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#687076',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: '#687076',
    marginBottom: 8,
  },
  groupTypeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  typeButton: {
    backgroundColor: '#f7f7f7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    margin: 5,
  },
  selectedType: {
    backgroundColor: '#FFC0CB',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#687076',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#FFC0CB',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
});

export default Groups;
