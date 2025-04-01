import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import Login from "./../components/Login";
import { auth } from "./../configs/FirebaseConfigs";
import { Redirect, useRouter } from "expo-router";
import { User } from "firebase/auth";

export default function Index() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return <View>{user ? <Redirect href="/mytrip" /> : <Login />}</View>;
}
