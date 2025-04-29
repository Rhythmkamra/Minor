import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { CreateTripContext } from "../../context/CreateTripContext";

export default function SearchPlace() {
  const router = useRouter();
  const navigation = useNavigation();
  const { tripData, setTripData } = useContext(CreateTripContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (text) => {
    setSearchQuery(text);
    if (!text) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}`,
        {
          headers: {
            "User-Agent": "YourAppName",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  // Predefined locations (Most Visited Countries)
  const locations = [
    { name: "France", lat: 48.8566, lon: 2.3522 },
    { name: "Spain", lat: 40.4168, lon: -3.7038 },
    { name: "Italy", lat: 41.9028, lon: 12.4964 },
    { name: "India", lat: 28.6139, lon: 77.2090 },
    { name: "Switzerland", lat: 46.8182, lon: 8.2275 },
    { name: "Turkey", lat: 41.0082, lon: 28.9784 },
  ];

  // Handle location selection
  const handleSelectPlace = (place) => {
    setSearchQuery(place.display_name);
    setSearchResults([]);

    setTripData({
      ...tripData,
      location: place.display_name,
      coordinates: {
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon),
      },
    });

    router.push("/create-trip/select-traveler");
  };

  // Handle predefined location selection
  const handlePredefinedLocation = (location) => {
    setTripData({
      ...tripData,
      location: location.name,
      coordinates: {
        latitude: location.lat,
        longitude: location.lon,
      },
    });

    router.push("/create-trip/select-traveler");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.heading}>Search Destination</Text>

        {/* Search Input with Back Button */}
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.arrow}>←</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            placeholder="Search for a place"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Show search results first if available */}
        {searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.place_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectPlace(item)}>
                <Text>{item.display_name}</Text>
              </TouchableOpacity>
            )}
            style={styles.resultsContainer}
          />
        ) : (
          // Show predefined locations when no search results
          <>
            <Text style={styles.sectionTitle}>Most Visited Countries</Text>
            <View style={styles.predefinedContainer}>
              {locations.map((location, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.predefinedBox}
                  onPress={() => handlePredefinedLocation(location)}
                >
                  <Text style={styles.predefinedText}>{location.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 20 },
  heading: {
    fontSize: 25,
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "outfit-bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: "#ff69b4",
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  backButton: {
    marginRight: 10,
  },
  arrow: {
    fontSize: 24,
    color: "#333",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  resultsContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    maxHeight: 250, // Limit height to avoid pushing content too far down
  },
  resultItem: {
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontFamily: "outfit-bold",
    fontSize: 25,
    textAlign: "center",
    marginTop: 15,
  },
  predefinedContainer: {
    flexDirection: "column",
    marginBottom: 15,
  },
  predefinedBox: {
    backgroundColor: "#f56c97",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  predefinedText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Outfit-Bold",
  },
});

