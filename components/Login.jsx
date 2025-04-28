import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors'
import { useRouter } from 'expo-router'

const Login = () => {
    const router = useRouter();
  return (

    <View>
      <Image source={require('../assets/images/login-1.jpeg')} 
      style={{
        width: '100%',
        height: '400',
      }}/>
      <View style={styles.container}>
        <Text style={{
            fontSize: 30,
            fontFamily:'outfit-medium',
            textAlign:'center',            
        }}>welcome to SAFAR</Text>
        <Text style={{
              fontSize: 15,
              fontFamily:'outfit',
                textAlign:'center',
                color:Colors.GRAY,
                marginTop:10,
        }}>An ai based trip planner</Text>
        <TouchableOpacity
        onPress={()=>router.push('/auth/sign-in')}>
            <Text style={styles.button}>Get started</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
        
        backgroundColor:Colors.WHITE,
        marginTop:-20,
        height:'100%',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        padding:15,
       
       
    },
    button:{
     padding:15,
     backgroundColor:Colors.PRIMARY,
     borderRadius:99,
     color:Colors.WHITE,
    textAlign:'center',
    fontFamily:'outfit',
    fontSize:17,
    marginTop:'25%',
    }

})