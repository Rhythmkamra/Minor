import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from "react";
import { Colors } from '../../constants/Colors';
import moment from 'moment';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfigs';
import FlightInfo from '../../components/TripDetails/FlightInfo';
import HotelList from '../../components/TripDetails/HotelList';
import PlannedTrip from '../../components/TripDetails/PlannedTrip';

const Index = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
    });

    const fetchTripDetails = async () => {
      try {
        const docRef = doc(db, 'UserTrip', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTripDetails({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.warn('Trip not found');
        }
      } catch (error) {
        console.error('Error fetching trip:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTripDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!tripDetails) return null;

  const tripData = tripDetails.tripData || {};
  const tripPlan = tripDetails.tripPlan?.trip || {};
  const photoRef = tripData?.locationInfo?.photoRef;

  const imageUrl = photoRef && apiKey
    ? `https://maps.googleapis.com/maps/api/place/photo?maxheight=400&photoreference=${photoRef}&key=${apiKey}`
    : null;

  return (
    <ScrollView>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Image source={require('../../assets/images/plane.gif')} style={styles.image} />
      )}
      <View style={styles.container}>
        <Text style={styles.title}>{tripData?.location || 'Trip Details'}</Text>
        <View style={styles.flexBox}>
          <Text style={styles.smallPara}>{moment(tripData?.startDate).format('DD MMM YYYY')}</Text>
          <Text style={styles.smallPara}> - {moment(tripData?.endDate).format('DD MMM YYYY')}</Text>
        </View>
        <Text style={styles.smallPara}>👨‍👩‍👧‍👦 Travelers: {tripData?.traveler?.title}</Text>
        <Text style={styles.smallPara}>🧳 Budget: {tripPlan?.budget}</Text>
        <Text style={styles.smallPara}>🎭 Mood: {tripPlan?.mood}</Text>

        <FlightInfo flightData={tripPlan.flights} />
        <HotelList hotelList={tripPlan.hotels} />
        <PlannedTrip details={tripPlan.itinerary} />
      </View>
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 330,
  },
  container: {
    padding: 15,
    backgroundColor: Colors.white,
    minHeight: '100%',
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 25,
  },
  smallPara: {
    fontFamily: 'Outfit',
    fontSize: 18,
    color: Colors.gray,
    marginTop: 5,
  },
  flexBox: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 5,
  },
});
