import { View, Text ,TouchableOpacity} from 'react-native'
import React from 'react'
import { Colors } from './../../constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function StartNewTripCard() {
    const router = useRouter();
    return (
    
    <View style={{
        backgroundColor:Colors.WHITE,
    marginTop: 40,
    padding:20,
    display:'flex',
    alignItems:'center',
    gap:25
    }}>
      
      <Ionicons name="location" size={30} color="black" />
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize: 20,
        color:Colors.black,
        textAlign:'center'
      }}>NO TRIPS PLANNED YET! </Text>
       <Text style={{
        fontFamily:'outfit-medium',
        fontSize: 19,
        color:Colors.GRAY,
        textAlign:'center'
      }}>Plan a trip with your ai based assistant here at SAFAR </Text>
       <TouchableOpacity style={{
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius:15,
        paddingHorizontal:30,
        
       }}
       onPress={()=>router.push('/create-trip/search-place')}
      >
        <Text style={{textAlign:'center',color:Colors.WHITE,fontFamily:'Outfit-Medium',fontSize:17}}>Start New Trip</Text>
      </TouchableOpacity>

    </View>
  )
}