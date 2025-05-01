import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const PlannedTrip = ({ details, placesToVisit }) => {
  // If details are empty, render a message
  if (!details || details.length === 0) {
    return <Text style={styles.noItinerary}>No itinerary available for this trip.</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Render itinerary details */}
      {details.map((day, dayIndex) => (
        <View key={`day-${dayIndex}`} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>Day {dayIndex + 1}</Text>

          {/* Check if activities exists and is an array */}
          {Array.isArray(day.activities) ? (
            day.activities.map((activity, activityIndex) => {
              if (typeof activity === 'object' && activity !== null) {
                return (
                  <Text key={`activity-${dayIndex}-${activityIndex}`} style={styles.dayDetails}>
                    - {activity.name || JSON.stringify(activity)} 
                    {activity.time && <Text style={styles.activityTime}> ({activity.time})</Text>}
                  </Text>
                );
              } else {
                return (
                  <Text key={`activity-${dayIndex}-${activityIndex}`} style={styles.dayDetails}>
                    - {activity}
                  </Text>
                );
              }
            })
          ) : (
            <Text style={styles.dayDetails}>
              {typeof day.activities === 'string' ? day.activities : 'No specific activities listed.'}
            </Text>
          )}

          {/* Handle other possible fields like location, notes */}
          {day.location && <Text style={styles.dayDetails}>Location: {day.location}</Text>}
          {day.notes && <Text style={styles.dayDetails}>Notes: {day.notes}</Text>}
          
          {day?.otherDetails && (
            <Text style={styles.dayDetails}>
              Other: {typeof day.otherDetails === 'object' ? JSON.stringify(day.otherDetails) : day.otherDetails}
            </Text>
          )}
        </View>
      ))}

      {/* Render places to visit */}
      {placesToVisit && placesToVisit.length > 0 && (
        <View style={styles.placesContainer}>
          <Text style={styles.placesTitle}>Places to Visit</Text>
          {placesToVisit.map((place, index) => (
            <View key={`place-${index}`} style={styles.placeCard}>
              {place.image_url && (
                <Image source={{ uri: place.image_url }} style={styles.placeImage} />
              )}
              <Text style={styles.placeName}>{place.name}</Text>
              <Text style={styles.placeDetails}>{place.details}</Text>
              <Text style={styles.placeInfo}>Ticket Pricing: {place.ticket_pricing}</Text>
              <Text style={styles.placeInfo}>Time to Travel: {place.time_to_travel}</Text>
              <Text style={styles.placeInfo}>Coordinates: {place.geo_coordinates}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  dayContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dayDetails: {
    fontSize: 16,
    color: 'gray',
    marginLeft: 10,
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 14,
    color: '#555',
  },
  noItinerary: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  placesContainer: {
    marginTop: 20,
  },
  placesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  placeCard: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  placeImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  placeDetails: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  placeInfo: {
    fontSize: 14,
    color: '#777',
    marginBottom: 3,
  },
});

export default PlannedTrip;
