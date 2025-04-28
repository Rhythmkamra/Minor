import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../../../constants/Colors'
import { useRouter } from 'expo-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../configs/FirebaseConfigs'
import { useState } from 'react'


const SignIn = () => {
  const [email, setEmail] = useState();
const [password, setPassword] = useState();
  
const Sign = () => {
  if (!email && !password) {
    ToastAndroid.show('Please fill all the fields', ToastAndroid.LONG);
    return;
  }                            
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
     router.replace('/mytrip');
     
      // ...
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/invalid credentials' ) {
        ToastAndroid.show('Invalid Credentials', ToastAndroid.LONG);
      }   
    });
}








  
  const router = useRouter(); // Moved inside the component

  return (
    <View style={{
        padding:25,
        backgroundColor:Colors.WHITE,
        height:'100%',
    }}>
     <Text style={{
        fontFamily:'outfit-bold',
        fontSize:30,
        marginTop:50,
     }}>Let's sign you up</Text>
      <Text style={{
        fontFamily:'outfit-medium',
        fontSize:30,
        color:Colors.GRAY,
        marginTop:10,
     }}>Welcome Back !</Text>
      <Text style={{
        fontFamily:'outfit-medium',
        fontSize:30,
        color:Colors.GRAY,
     }}>You've been missed</Text>

     <View style={{ marginTop:50 }}>
      <Text>Email</Text>
        <TextInput onChangeText={(value)=>setEmail(value)} style={styles.input} placeholder='Enter Email' />
     </View>

     <View style={{ marginTop:30 }}>
      <Text>Password</Text>
        <TextInput onChangeText={(value)=>setPassword(value)} style={styles.input} placeholder='Enter Password' secureTextEntry={true} />
     </View>

     <TouchableOpacity onPress={Sign} style={{
      padding:15,
      marginTop:30,
      backgroundColor:Colors.PRIMARY,
      borderRadius:15,
     }}>
      <Text style={{
        color:Colors.WHITE,
        textAlign:'center',
      }}>Sign-in</Text>
     </TouchableOpacity>

     <View style={{
      padding:15,
      marginTop:30,
      backgroundColor:Colors.WHITE,
      borderRadius:15,
      borderWidth:1,
     }}>
      <TouchableOpacity onPress={() => router.replace('auth/sign-up')}>
        <Text style={{ color:Colors.PRIMARY, textAlign:'center' }}>Create Account</Text>
      </TouchableOpacity>
     </View>
    </View>
  )
}

export default SignIn

const styles = StyleSheet.create({
  input: {
    padding:15,
    borderWidth:1,
    borderColor:Colors.GRAY,
    borderRadius:15,
    fontFamily:'outfit-medium',
  }
})
