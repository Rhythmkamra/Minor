import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const PlannedTrip = ({ details }) => {
  // If details are empty, render a message
  if (!details || details.length === 0) {
    return <Text style={styles.noItinerary}>No itinerary available for this trip.</Text>;
  }

  return (
    <View style={styles.container}>
      {details.map((day, dayIndex) => (
        <View key={`day-${dayIndex}`} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>{day.day || `Day ${dayIndex + 1}`}</Text>

          {/* Check if activities exists and is an array */}
          {Array.isArray(day.activities) ? (
            // Map over the activities array
            day.activities.map((activity, activityIndex) => (
              <View key={`activity-${dayIndex}-${activityIndex}`} style={styles.activityContainer}>
                <Text style={styles.activityName}>
                  - {activity.name || JSON.stringify(activity)} 
                </Text>
                {activity.time && <Text style={styles.activityTime}>({activity.time})</Text>}
              </View>
            ))
          ) : (
            // If activities is a string or invalid
            <Text style={styles.dayDetails}>
              {typeof day.activities === 'string' ? day.activities : 'No specific activities listed.'}
            </Text>
          )}

          {/* Handle places to visit (if available) */}
          {Array.isArray(day.places_to_visit) && day.places_to_visit.length > 0 && (
            <View style={styles.placesContainer}>
              <Text style={styles.subHeading}>Places to Visit:</Text>
              {day.places_to_visit.map((place, placeIndex) => (
                <View key={`place-${placeIndex}`} style={styles.placeCard}>
                  <Image source={{ uri: place.image_url }} style={styles.placeImage} />
                  <View style={styles.placeDetails}>
                    <Text style={styles.placeName}>{place.name}</Text>
                    <Text style={styles.placeDescription}>{place.details}</Text>
                    <Text style={styles.placeInfo}>
                      Geo: {place.geo_coordinates} | Time to Travel: {place.time_to_travel} | Ticket: {place.ticket_pricing}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Handle other possible fields like location, notes */}
          {day.location && <Text style={styles.dayDetails}>Location: {day.location}</Text>}
          {day.notes && <Text style={styles.dayDetails}>Notes: {day.notes}</Text>}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 20,
  },
  dayContainer: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  activityContainer: {
    marginBottom: 8,
    paddingLeft: 10,
  },
  activityName: {
    fontSize: 16,
    color: '#555',
  },
  activityTime: {
    fontSize: 14,
    color: '#777',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
  },
  placesContainer: {
    marginTop: 15,
    paddingLeft: 10,
  },
  placeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  placeImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  placeDetails: {
    flex: 1,
    paddingRight: 10,
    justifyContent: 'center',
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  placeDescription: {
    fontSize: 14,
    color: '#777',
    marginVertical: 5,
  },
  placeInfo: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
  },
  dayDetails: {
    fontSize: 16,
    color: '#777',
    marginLeft: 20,
    marginBottom: 5,
  },
  noItinerary: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PlannedTrip;
