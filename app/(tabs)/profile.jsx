import { StyleSheet, Text, View, Image, ActivityIndicator, ScrollView, Switch, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { auth, db } from '../../configs/FirebaseConfigs';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router'; // if you're using expo-router

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // ✅ Added
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log("No such document!");
        }
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Updated to depend on refreshKey
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [refreshKey])
  );

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleToggleDarkMode = async () => {
    try {
      const user = auth.currentUser;
      const newDarkMode = !userData.settings.darkMode;
      await updateDoc(doc(db, "Users", user.uid), {
        "settings.darkMode": newDarkMode
      });
      setUserData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          darkMode: newDarkMode
        }
      }));
    } catch (error) {
      console.log("Error updating dark mode:", error);
    }
  };

  const handleToggleNotifications = async () => {
    try {
      const user = auth.currentUser;
      const newNotificationsEnabled = !userData.settings.notificationsEnabled;
      await updateDoc(doc(db, "Users", user.uid), {
        "settings.notificationsEnabled": newNotificationsEnabled
      });
      setUserData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          notificationsEnabled: newNotificationsEnabled
        }
      }));
    } catch (error) {
      console.log("Error updating notifications:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
          try {
            await auth.signOut();
            router.replace('/auth/sign-in');
          } catch (error) {
            console.log("Error logging out:", error);
          }
        } 
      }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={{ color: Colors.GRAY }}>No User Data Found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => router.push({ pathname: '/edit-profile', params: { refreshKey } })}>
          <Image 
            source={{ uri: userData.profilePicture || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
            style={styles.profileImage} 
          />
        </TouchableOpacity>
        <Text style={styles.username}>{userData.username}</Text>
        <Text style={styles.bio}>{userData.bio}</Text>

        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => router.push({ pathname: '/EditProfile', params: { refreshKey } })}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsContainer}>
        <Text style={styles.settingsTitle}>Settings</Text>

        <View style={styles.settingItem}>
          <Text>Dark Mode</Text>
          <Switch 
            value={userData.settings.darkMode}
            onValueChange={handleToggleDarkMode}
          />
        </View>

        <View style={styles.settingItem}>
          <Text>Notifications</Text>
          <Switch 
            value={userData.settings.notificationsEnabled}
            onValueChange={handleToggleNotifications}
          />
        </View>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
  },
  bio: {
    fontSize: 16,
    fontFamily: 'outfit-regular',
    color: Colors.GRAY,
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 8,
  },
  editButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#ff5c8d",
    borderRadius: 10,
  },
  editButtonText: {
    color: Colors.WHITE,
    fontFamily: 'outfit-medium',
    fontSize: 16,
  },
  settingsContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  settingsTitle: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 0.5,
    paddingBottom: 10,
    borderBottomColor: Colors.GRAY,
  },
  logoutButton: {
    backgroundColor: '#ff5c8d',
    margin: 20,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  logoutText: {
    color: Colors.WHITE,
    fontFamily: 'outfit-bold',
    fontSize: 16,
  },
});
