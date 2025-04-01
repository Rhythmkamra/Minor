import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { selectBudgetOption } from './../../constants/Options';
import { CreateTripContext } from '../../context/CreateTripContext';

export default function SelectBudget() {
  const navigation = useNavigation();
  const router = useRouter();

  const { tripData, setTripData } = useContext(CreateTripContext);

  const [selectedBudget, setSelectedBudget] = useState(tripData?.budget || null);

  useEffect(() => {
    navigation.setOptions({ headerShown: true, headerTitle: '' });
    console.log("📌 Navigation options set.");
  }, [navigation]);

  useEffect(() => {
    console.log("📝 Initial tripData in SelectBudget:", tripData);
  }, []);

  useEffect(() => {
    if (selectedBudget) {
      setTripData((prev) => {
        const updatedData = {
          ...prev,
          budget: selectedBudget,
        };
        console.log("🔄 Updated tripData with budget:", updatedData);
        return updatedData;
      });
    }
  }, [selectedBudget]);

  const handleSelectBudget = (budget) => {
    console.log(`✅ Selected budget: ${budget.title}`);
    setSelectedBudget(budget.title);
  };

  const handleContinue = () => {
    if (!selectedBudget) {
      alert("⚠️ Please select a budget option.");
      return;
    }

    console.log("🚀 Navigating with tripData:", tripData);

    router.push({
      pathname: '/create-trip/review-trip',
      params: { tripData: JSON.stringify(tripData) }
    });
  };

  return (
    <View style={{ padding: 20, marginTop: 40, backgroundColor: 'white', height: '100%' }}>
      <Text style={{ fontSize: 30, fontFamily: 'outfit-bold' }}>Budget</Text>
      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 25, fontFamily: 'outfit-bold' }}>Choose Your Budget</Text>
      </View>

      <FlatList
        data={selectBudgetOption}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectBudget(item)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 15,
              marginVertical: 10,
              backgroundColor: selectedBudget === item.title ? 'pink' : 'white',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: 'pink',
            }}
          >
            <Text style={{ fontSize: 24, marginRight: 10 }}>{item.icon}</Text>
            <View>
              <Text style={{ fontSize: 18, fontFamily: 'outfit-bold', color: selectedBudget === item.title ? 'white' : 'black' }}>
                {item.title}
              </Text>
              <Text style={{ fontSize: 14, color: selectedBudget === item.title ? 'white' : 'grey' }}>{item.desc}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        onPress={handleContinue}
        style={{
          marginTop: 30,
          backgroundColor: 'pink',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 18, fontFamily: 'outfit-bold' }}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
