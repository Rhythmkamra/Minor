import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from './../../constants/Colors';
import { SelectTravelersList } from '../../constants/Options';
import OptionCard from '../../components/CreateTrip/OptionCard';
import { CreateTripContext } from './../../context/CreateTripContext';

const SelectTraveler = () => {
  const navigation = useNavigation();
  const router = useRouter(); // ✅ Use router for navigation
  const [selectedTravel, setSelectedTravel] = useState(null);
  const { tripData, setTripData } = useContext(CreateTripContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
    });
  }, [navigation]);

  useEffect(() => {
    setTripData({
      ...tripData,
      traveler: selectedTravel,
    });
  }, [selectedTravel]);

  // Debugging: Log trip data updates
  useEffect(() => {
    console.log("tripData", tripData);
  }, [tripData]);

  // Handle Continue button press
  const handleContinue = () => {
    if (selectedTravel) {
      router.push('/create-trip/select-dates'); // ✅ Correct navigation
    } else {
      alert("Please select a traveler before continuing.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.WHITE, padding: 25, paddingTop: 75 }}>
      <Text style={{ fontSize: 30, fontFamily: 'outfit-bold', marginTop: 20 }}>
        Who is Traveling
      </Text>

      <View style={{ marginTop: 20, flex: 1 }}>
        <Text style={{ fontFamily: 'outfit-bold', fontSize: 20 }}>
          Choose Your Travelers
        </Text>

        {/* FlatList should be inside a View with flex: 1 */}
        <FlatList
          data={SelectTravelersList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedTravel(item.title)}
              activeOpacity={0.7}
            >
              <OptionCard option={item} isSelected={selectedTravel === item.title} />
            </TouchableOpacity>
          )}
        />
      </View>

      {/* ✅ Continue Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#f56c97", // Pink Color
          padding: 15,
          borderRadius: 15,
          marginTop: 20,
          marginBottom: 40, // Prevents cutoff
          alignItems: "center",
        }}
        onPress={handleContinue} // ✅ Use function for navigation
      >
        <Text
          style={{
            color: Colors.WHITE || "#FFF",
            textAlign: 'center',
            fontFamily: 'Outfit-Medium',
            fontSize: 20,
          }}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectTraveler;
