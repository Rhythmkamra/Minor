import { View, Text, Image } from 'react-native';
import React, { useEffect, useContext, useState } from 'react';
import { CreateTripContext } from '../../context/CreateTripContext';
import { AI_PROMPT, AI_MOODBOARD_PROMPT } from '../../constants/Options';
import { chatSession } from '../../configs/AiModal';
import { useRouter } from 'expo-router';
import { setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../configs/FirebaseConfigs';

const GenerateTrip = () => {
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true); // Added useState for loading
  const [tripGenerated, setTripGenerated] = useState(false); // New state to track if trip is generated

  useEffect(() => {
    if (!tripGenerated) {
      GenerateAItrip();
    }
  }, [tripData, tripGenerated]);

  const GenerateAItrip = async () => {
    if (!tripData) {
      console.error("tripData is undefined");
      return;
    }

    console.log("tripData:", tripData);

    // Validate required fields, provide default if necessary
    const location = tripData.location || "Unknown Location";
    const traveler = tripData.traveler || "Unknown Traveler";
    const budget = tripData.budget || "Unknown Budget";
    const totalNumOfDays = tripData.totalNumOfDays || 0;

    // Prevent negative nights
    const totalNight = totalNumOfDays > 0 ? totalNumOfDays - 1 : 0;

    // Ensure we are passing the correct prompt based on moodboard
    let FINAL_PROMPT = '';

    if (tripData?.moodboard) {
      FINAL_PROMPT = AI_MOODBOARD_PROMPT
        .replace('{location}', location)
        .replace('{totalDay}', totalNumOfDays.toString())
        .replace('{totalNight}', totalNight.toString())
        .replace('{budget}', budget)
        .replace('{travelerCount}', traveler)
        .replace('{mood}', tripData.moodboard || "Relaxation");
    } else {
      FINAL_PROMPT = AI_PROMPT
        .replace('{location}', location)
        .replace('{totalDays}', totalNumOfDays.toString())
        .replace('{totalNight}', totalNight.toString())
        .replace('{traveler}', traveler)
        .replace('{budget}', budget);
    }

    console.log("FINAL_PROMPT:", FINAL_PROMPT);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = await result.response.text();
      const tripResponse = JSON.parse(responseText);

      console.log("AI Response:", tripResponse);
      setLoading(false);
      setTripGenerated(true); // Set trip as generated

      // Save trip data to Firebase after generating the trip
      const docId = Date.now().toString();
      await setDoc(doc(db, 'UserTrip', docId), {
        userEmail: user?.email || "Unknown",
        tripPlan: tripResponse,
        tripData: tripData, // Save original tripData as well
        docId: docId,
      });

      // After successful save, reset tripData and redirect the user
      setTripData(null);  // Reset tripData after everything is saved and user is redirected

      // Redirect user to their generated trip page
      router.push('(tabs)/mytrip');
    } catch (error) {
      console.error("Error generating AI trip:", error);
      setLoading(false);
    }
  };

  return (
    <View style={{
      padding: 25,
      paddingTop: 75,
      backgroundColor: 'white',
      height: '100%',
    }}>
      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize: 30,
        textAlign: 'center',
      }}>{loading ? "Please wait" : "Trip Generated!"}</Text>
      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize: 25,
        margin: 20,
        textAlign: 'center',
      }}>{loading ? "Generating Your Trip!" : "Redirecting..."}</Text>

      <Image 
        source={require('./../../assets/images/wait.png')} 
        style={{
          width: '80%',
          height: 500,
          marginLeft: 30
        }} 
        resizeMode="contain"
      />
      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize: 25,
        margin: -5,
        textAlign: 'center',
      }}>Don't Go Back</Text>
    </View>
  );
};

export default GenerateTrip;
