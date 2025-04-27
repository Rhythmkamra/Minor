import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { CreateTripContext } from "../../context/CreateTripContext";
import { moodOptions } from "../../constants/Options";

export default function MoodboardSelect() {
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();
  const [selectedMoodId, setSelectedMoodId] = useState(null); // To track selected mood

  const handleSelectMoodboard = (mood) => {
    setTripData({
      ...tripData,
      moodboard: mood.title,
    });
    setSelectedMoodId(mood.id); // Update selected mood id
  };

  const handleContinue = () => {
    router.push("/create-trip/search-place");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select Moodboard</Text>

      <FlatList
        data={moodOptions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedMoodId;
          return (
            <TouchableOpacity
              style={[
                styles.moodItem,
                isSelected && styles.selectedMoodItem, // Apply selected style
              ]}
              onPress={() => handleSelectMoodboard(item)}
            >
              <Text style={styles.moodTitle}>{item.icon} {item.title}</Text>
              <Text style={styles.moodDesc}>{item.desc}</Text>
            </TouchableOpacity>
          );
        }}
        style={styles.moodList}
      />

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  heading: {
    fontSize: 25,
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "outfit-bold",
    color: "black",
  },
  moodList: {
    marginTop: 20,
    marginBottom: 80,
  },
  moodItem: {
    backgroundColor: "pink",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#FF69B4",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  selectedMoodItem: {
    backgroundColor: "#ffe6f0", // Darker pink for selected mood
  },
  moodTitle: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    color: "black",
  },
  moodDesc: {
    fontSize: 14,
    color: "#A0527A",
    marginTop: 5,
    fontFamily: "outfit",
  },
  continueButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "pink",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "outfit-bold",
  },
});
