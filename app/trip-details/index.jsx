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
import { fetchLocationImage } from '../../utils/unsplashAPI'; // ✅ import here

const Index = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationImage, setLocationImage] = useState(null); // ✅ state for image

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
          const data = { id: docSnap.id, ...docSnap.data() };
          setTripDetails(data);

          // ✅ fetch Unsplash image based on location
          const image = await fetchLocationImage(data.tripData?.location);
          if (image) setLocationImage(image);
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
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!tripDetails) return null;

  const tripData = tripDetails.tripData || {};
  const tripPlan = tripDetails.tripPlan?.trip || {};

  return (
    <ScrollView>
      {locationImage ? (
        <Image source={{ uri: locationImage }} style={styles.image} />
      ) : (
        <Image source={require('../../assets/images/plane.gif')} style={styles.image} />
      )}

      <View style={styles.container}>
        <Text style={styles.title}>{tripData?.location || 'Trip Details'}</Text>
        <View style={styles.flexBox}>
          <Text style={styles.dateText}>{moment(tripData?.startDate).format('DD MMM YYYY')}</Text>
          <Text style={styles.dateText}> - {moment(tripData?.endDate).format('DD MMM YYYY')}</Text>
        </View>
        <Text style={styles.infoText}>👨‍👩‍👧‍👦 Travelers: {tripData?.travelers || 'N/A'}</Text>
        <Text style={styles.infoText}>🎭 Mood: {tripData?.moodboard || 'N/A'}</Text>
        <Text style={styles.infoText}>💸 Budget: {tripPlan?.budget || 'N/A'}</Text>

        <FlightInfo flightData={tripPlan.flights} />
        <HotelList hotelList={tripPlan.hotels} />
        <PlannedTrip details={tripPlan.itinerary} />
      </View>
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    marginTop:20,
  },
  dateText: {
    fontFamily: 'Outfit',
    fontSize: 18,
    color: Colors.gray,
  },
  infoText: {
    fontFamily: 'Outfit',
    fontSize: 18,
    color: Colors.gray,
    marginTop: 6,
  },
  flexBox: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 6,
  },
});
