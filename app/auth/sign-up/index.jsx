import { StyleSheet, Text, View, TouchableOpacity, ToastAndroid } from 'react-native';
import React from 'react';
import { TextInput } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { useRouter } from 'expo-router';
import { auth, db } from '../../../configs/FirebaseConfigs'; // ✅ updated
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore'; // ✅ added Firestore functions

const Signup = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const router = useRouter();

  const OnCreateAccount = async () => {
    if (!email || !password || !fullName) {
      ToastAndroid.show('Please fill all the fields', ToastAndroid.SHORT);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Save additional user data into Firestore
      await setDoc(doc(db, "Users", user.uid), {
        username: fullName,
        email: user.email,
        profilePicture: "https://cdn-icons-png.flaticon.com/512/149/149071.png", // default pic
        bio: "Traveler exploring the world!",
        settings: {
          darkMode: false,
          notificationsEnabled: true,
        },
        createdAt: new Date(),
      });

      console.log('User Created and Data Saved:', user.uid);
      router.replace('/mytrip');
    } catch (error) {
      console.log(error.code, error.message);
    }
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
          onChangeText={setFullName}
        />
      </View>

      <View style={{ marginTop: 28 }}>
        <Text>Email</Text>
        <TextInput 
          style={styles.input}  
          placeholder='Enter Email' 
          onChangeText={setEmail}
        />
      </View>

      <View style={{ marginTop: 30 }}>
        <Text>Password</Text>
        <TextInput 
          style={styles.input}  
          placeholder='Enter Password' 
          secureTextEntry={true} 
          onChangeText={setPassword}
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
