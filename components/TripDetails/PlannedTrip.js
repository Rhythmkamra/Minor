import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { fetchLocationImage } from '../../utils/unsplashAPI';

const PlannedTrip = ({ details }) => {
  const [images, setImages] = useState({});

  useEffect(() => {
    const loadImages = async () => {
      let newImages = {};
      for (const day of details || []) {
        if (day?.places_to_visit) {
          for (const place of day.places_to_visit) {
            if (!newImages[place.name]) {
              const img = await fetchLocationImage(place.name);
              newImages[place.name] = img;
            }
          }
        }
      }
      setImages(newImages);
    };

    loadImages();
  }, [details]);

  if (!details || details.length === 0) {
    return <Text style={styles.noItinerary}>No itinerary available for this trip.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {details.map((day, dayIndex) => (
        <View key={`day-${dayIndex}`} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>Day {dayIndex + 1}</Text>

          {/* Activities */}
          {Array.isArray(day.activities) ? (
            day.activities.map((activity, activityIndex) => (
              <Text key={`activity-${activityIndex}`} style={styles.dayDetails}>
                - {activity.name} {activity.time && <Text style={styles.time}>({activity.time})</Text>}
              </Text>
            ))
          ) : (
            <Text style={styles.dayDetails}>No specific activities listed.</Text>
          )}

          {/* Optional fields */}
          {day.location && <Text style={styles.dayDetails}>📍 Location: {day.location}</Text>}
          {day.notes && <Text style={styles.dayDetails}>📝 Notes: {day.notes}</Text>}
          {day.otherDetails && (
            <Text style={styles.dayDetails}>
              🧾 Other: {typeof day.otherDetails === 'object'
                ? JSON.stringify(day.otherDetails)
                : day.otherDetails}
            </Text>
          )}

          {/* Places to Visit */}
          {day?.places_to_visit?.map((place, placeIndex) => (
            <View key={`place-${placeIndex}`} style={styles.placeCard}>
              <Text style={styles.placeTitle}>{place.name}</Text>
              {images[place.name] && (
                <Image source={{ uri: images[place.name] }} style={styles.placeImage} />
              )}
              <Text style={styles.placeDetails}>{place.details}</Text>
              <Text style={styles.placeDetails}>🕒 Travel Time: {place.time_to_travel}</Text>
              <Text style={styles.placeDetails}>🎫 Ticket: {place.ticket_pricing}</Text>
              <Text style={styles.placeDetails}>📍 Coords: {place.geo_coordinates}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
  dayContainer: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  dayDetails: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#888',
  },
  placeCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    elevation: 2,
  },
  placeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#222',
  },
  placeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
  },
  placeDetails: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
  },
  noItinerary: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PlannedTrip;
