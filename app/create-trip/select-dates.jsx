import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { CreateTripContext } from '../../context/CreateTripContext';

export default function SelectDates() {
  const navigation = useNavigation();
  const router = useRouter();
  const { tripData, setTripData } = useContext(CreateTripContext);

  const [selectedRange, setSelectedRange] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
    });
  }, [navigation]);

  const today = moment().format('YYYY-MM-DD'); // Get today's date

  const handleDayPress = (day) => {
    setError(null); // Clear any previous error message

    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null);
      setSelectedRange({
        [day.dateString]: {
          startingDay: true,
          endingDay: true,
          color: '#f56c97',
          textColor: 'white',
        },
      });
    } else {
      if (moment(day.dateString).isSameOrAfter(startDate)) {
        setEndDate(day.dateString);

        let range = {};
        let currentDate = moment(startDate);
        while (currentDate.isSameOrBefore(day.dateString)) {
          range[currentDate.format('YYYY-MM-DD')] = {
            color: '#f56c97',
            textColor: 'white',
          };
          currentDate.add(1, 'day');
        }
        setSelectedRange(range);
      } else {
        setStartDate(day.dateString);
        setEndDate(null);
        setSelectedRange({
          [day.dateString]: {
            startingDay: true,
            endingDay: true,
            color: '#f56c97',
            textColor: 'white',
          },
        });
      }
    }

    console.log("Selected Range:", selectedRange);
    console.log("Start Date:", startDate, "End Date:", endDate);
  };

  // Update tripData when startDate and endDate change
  useEffect(() => {
    if (startDate && endDate) {
      const updatedTripData = {
        ...tripData,
        startDate,
        endDate,
        totalNumOfDays: moment(endDate).diff(moment(startDate), 'days') + 1,
      };

      console.log("✅ Saving tripData in SelectDates:", updatedTripData);
      setTripData(updatedTripData);
    }
  }, [startDate, endDate]);

  const handleContinue = () => {
    if (!startDate || !endDate) {
      setError('Please select a start and end date.');
      return;
    }

    console.log("🚀 Navigating with tripData from SelectDates:", tripData);
    router.push('/create-trip/select-budget');
  };

  return (
    <View style={{
      flex: 1,
      padding: 25,
      paddingTop: 75,
      backgroundColor: Colors.WHITE,
    }}>
      <Text style={{
        fontSize: 35,
        fontFamily: 'outfit-bold',
        marginBottom: 20,
      }}>
        Travel Dates
      </Text>

      <Calendar
        minDate={today}
        onDayPress={handleDayPress}
        markingType="period"
        markedDates={{ ...selectedRange }}
        theme={{
          textDisabledColor: 'grey',
          dayTextColor: 'black',
          todayTextColor: 'red',
          arrowColor: 'pink',
          monthTextColor: 'black',
        }}
      />

      {error && (
        <Text style={{ color: 'red', marginTop: 10, fontSize: 16 }}>
          {error}
        </Text>
      )}

      <TouchableOpacity
        onPress={handleContinue}
        style={{
          marginTop: 30,
          backgroundColor: '#f56c97',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <Text style={{
          color: 'white',
          fontSize: 18,
          fontFamily: 'outfit-bold',
        }}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}
