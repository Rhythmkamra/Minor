import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth, db } from '../configs/FirebaseConfigs';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../configs/FirebaseConfigs'; // ✅ Import your Firebase storage config
import { Colors } from '../constants/Colors';
import { useRouter } from 'expo-router';

const EditProfile = () => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "Users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUsername(data.username);
            setBio(data.bio);
            setProfilePicture(data.profilePicture);
          }
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      setLoading(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const user = auth.currentUser;

      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      setProfilePicture(downloadURL);
    } catch (error) {
      console.log('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      await updateDoc(doc(db, "Users", user.uid), {
        username,
        bio,
        profilePicture,
      });
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.log("Error updating profile:", error);
      Alert.alert('Error', 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image 
          source={{ uri: profilePicture || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
          style={styles.profileImage}
        />
        <Text style={styles.changePhotoText}>Change Photo</Text>
      </TouchableOpacity>

      <TextInput 
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput 
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        style={[styles.input, { height: 100 }]}
        multiline
      />

      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    marginTop: 20,
    backgroundColor: Colors.GRAY,
  },
  changePhotoText: {
    fontSize: 14,
    color: Colors.PRIMARY,
    marginBottom: 30,
    fontFamily: 'outfit-medium',
  },
  input: {
    width: '100%',
    borderColor: Colors.GRAY,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontFamily: 'outfit-regular',
  },
  saveButton: {
    backgroundColor: '#ff5c8d',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
  },
  saveButtonText: {
    color: Colors.WHITE,
    fontFamily: 'outfit-bold',
    fontSize: 16,
  },
});
