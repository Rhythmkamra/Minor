import { View, Text, Image } from 'react-native';
import React, { useEffect, useContext, useState } from 'react';
import { CreateTripContext } from '../../context/CreateTripContext';
import { AI_PROMPT } from '../../constants/Options';
import { chatSession } from '../../configs/AiModal';
import { useRouter } from 'expo-router';
import { setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../configs/FirebaseConfigs';

const GenerateTrip = () => {
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true); // Added useState for loading

  useEffect(() => {
    GenerateAItrip();
  }, [tripData]);

  const GenerateAItrip = async () => {
    if (!tripData) {
      console.error("tripData is undefined");
      return;
    }

    console.log("tripData:", tripData);

    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', tripData.location || "Unknown Location")
      .replace('{totalDays}', tripData.totalNumOfDays?.toString() || "0")
      .replace('{totalNight}', ((tripData.totalNumOfDays || 1) - 1).toString())
      .replace('{traveler}', tripData.traveler || "Unknown Traveler")
      .replace('{budget}', tripData.budget || "Unknown Budget");

    console.log("FINAL_PROMPT:", FINAL_PROMPT);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = await result.response.text(); // Ensure async handling
      const tripResponse = JSON.parse(responseText);

      console.log("AI Response:", tripResponse);
      setLoading(false);

      const docId = Date.now().toString();
      await setDoc(doc(db, 'UserTrip', docId), {
        userEmail: user?.email || "Unknown",
        tripPlan: tripResponse,
        tripData: tripData, // Removed JSON.stringify
        docId: docId,
      });

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
