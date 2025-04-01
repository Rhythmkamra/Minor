import { StyleSheet, Text, View, TouchableOpacity, ToastAndroid } from 'react-native';
import React from 'react';
import { TextInput } from 'react-native';
import { Colors } from '/home/rhythm/Documents/minor/safar/constants/Colors.ts';
import { useRouter } from 'expo-router';
import { auth } from '../../../configs/FirebaseConfigs';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Signup = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const router = useRouter();

  const OnCreateAccount = () => {
    if (!email || !password || !fullName) { 
      ToastAndroid.show('Please fill all the fields', ToastAndroid.SHORT);
      return;
    }
  

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('User Created:', userCredential.user);
        router.replace('/mytrip');
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
      
  };

  return (
    <View style={{
      padding: 25,
      backgroundColor: Colors.WHITE,
      height: '100%',
    }}>
      <Text style={{
        fontSize: 30,
        marginTop: 70,
        fontFamily: 'outfit-bold',
      }}>Create New Account</Text>

      <View>
        <Text style={{
          fontFamily: 'outfit-medium',
          marginTop: 10,
        }}>Enter Full Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder='Enter Full Name' 
          onChangeText={setFullName} // ✅ Fixed state update
        />
      </View>

      <View style={{ marginTop: 28 }}>
        <Text>Email</Text>
        <TextInput 
          style={styles.input}  
          placeholder='Enter Email' 
          onChangeText={setEmail} // ✅ Fixed state update
        />
      </View>

      <View style={{ marginTop: 30 }}>
        <Text>Password</Text>
        <TextInput 
          style={styles.input}  
          placeholder='Enter Password' 
          secureTextEntry={true} 
          onChangeText={setPassword} // ✅ Fixed state update
        />
      </View>

      <View style={{
        padding: 15,
        marginTop: 30,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 15,
      }}>
        <TouchableOpacity onPress={OnCreateAccount}>
          <Text style={{
            color: Colors.WHITE,
            textAlign: 'center',
          }}>Create Account</Text>
        </TouchableOpacity>
      </View>

      <View style={{
        padding: 15,
        marginTop: 30,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        borderWidth: 1,
      }}>
        <TouchableOpacity onPress={() => router.replace('/auth/sign-in')}> 
          <Text style={{ color: Colors.PRIMARY, textAlign: 'center' }}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  input: {
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 15,
    fontFamily: 'outfit-medium',
  }
});
