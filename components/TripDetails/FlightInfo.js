import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native'; 
import React from 'react';

// Helper function to format the date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    const year = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    
    const date = new Date(year, monthIndex, day);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString; 
  }
};

// Helper to format time (12-hour format)
const formatTime = (timeString) => {
   if (!timeString || !timeString.includes(':')) return timeString || 'N/A';
   try {
     const [hours, minutes] = timeString.split(':');
     const hourNum = parseInt(hours, 10);
     const suffix = hourNum >= 12 ? 'PM' : 'AM';
     const formattedHour = ((hourNum + 11) % 12 + 1); // Convert 24h to 12h
     return `${formattedHour}:${minutes} ${suffix}`;
   } catch (error) {
     console.error("Error formatting time:", timeString, error);
     return timeString;
   }
}

const FlightInfo = ({ flightData }) => {
  if (!Array.isArray(flightData) || flightData.length === 0) {
    return <Text style={styles.noDataText}>No flight details available.</Text>;
  }

  const handleOpenUrl = (url) => {
      Linking.canOpenURL(url).then(supported => {
          if (supported) {
              Linking.openURL(url);
          } else {
              console.log(`Don't know how to open URL: ${url}`);
          }
      }).catch(err => console.error('An error occurred trying to open URL', err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flight Details</Text>
      {flightData.map((flight, index) => (
        <View key={flight.flight_number ? `${flight.flight_number}-${flight.departure_date}` : `flight-${index}`} style={styles.card}>
          
          <Text style={styles.info}>
            ✈️ <Text style={styles.bold}>{flight.airline || 'N/A'}</Text> ({flight.flight_number || 'N/A'})
          </Text>

          <View style={styles.routeContainer}>
              <View style={styles.locationContainer}>
                 <Text style={styles.airportCode}>{flight.departure_airport || 'N/A'}</Text>
                 <Text style={styles.cityName}>{flight.departure_city || 'N/A'}</Text>
                 <Text style={styles.dateTime}>
                    {formatDate(flight.departure_date)} at {formatTime(flight.departure_time)}
                 </Text>
              </View>

              <Text style={styles.arrow}>→</Text>

               <View style={[styles.locationContainer, styles.arrivalContainer]}>
                 <Text style={styles.airportCode}>{flight.arrival_airport || 'N/A'}</Text>
                 <Text style={styles.cityName}>{flight.arrival_city || 'N/A'}</Text>
                  <Text style={styles.dateTime}>
                     {formatDate(flight.arrival_date)} at {formatTime(flight.arrival_time)}
                  </Text>
              </View>
          </View>

           {/* Optional: Display Price */}
           {flight.price && (
             <Text style={styles.price}>Price: {flight.price}</Text>
           )}

            {/* Optional: Booking Link Button */}
           {flight.booking_url && (
             <TouchableOpacity onPress={() => handleOpenUrl(flight.booking_url)} style={styles.button}>
                <Text style={styles.buttonText}>Go to Booking</Text>
             </TouchableOpacity>
           )}
        </View>
      ))}
    </View>
  );
};

export default FlightInfo;

// --- Updated Styles ---
const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',  // Subtle background color
    borderRadius: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  bold: {
    fontWeight: '600',
    color: '#333',
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  locationContainer: {
    flex: 1,
  },
  arrivalContainer: {
    alignItems: 'flex-end',
  },
  airportCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e90ff',  // Airline code color
  },
  cityName: {
    fontSize: 14,
    color: '#666',
  },
  dateTime: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  arrow: {
    fontSize: 24,
    color: '#333',
    marginHorizontal: 15,
  },
  price: {
    fontSize: 16,
    color: '#007AFF',  // Price color to stand out
    marginTop: 12,
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    padding: 10,
  },
  button: {
      backgroundColor: '#007AFF',  // Consistent button color
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 15,
      alignSelf: 'flex-start',
  },
  buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
  },
});
