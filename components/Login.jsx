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
        <Text style={styles.welcomeText}>welcome to SAFAR</Text>
        <Text style={styles.tagline}>An ai based trip planner</Text>
           <Image
        source={require('../assets/images/logo.png')} // Replace with your logo path

       style={styles.logo}
     />
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
    padding: 20, // Increased overall padding
    alignItems: 'center', // Center items horizontally
  },
  welcomeText:{
    fontSize: 30,
    fontFamily:'outfit-medium',
    textAlign:'center',
    marginBottom: 10, // Add some space below welcome text
  },
  tagline:{
    fontSize: 15,
    fontFamily:'outfit',
    textAlign:'center',
    color:Colors.GRAY,
    marginBottom: 20, // Add more space below tagline for the logo
  },
  button: {
    padding: 18,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 99,
    color: Colors.WHITE,
    textAlign: 'center',
    fontFamily: 'outfit',
    fontSize: 19,
    marginTop: 40,
    width: '200',
     // Increased button width
    maxWidth: 600, //Added a maximum width
  },
  logo: { // Style for the logo
    width: 150, // Increased logo size
    height: 150, // Increased logo size
    borderRadius: 75, // Maintain circular shape
    alignSelf: 'center', // Center horizontally (already in container, but good practice)
    marginBottom: 10, // Adjust spacing below the logo
  },
 })