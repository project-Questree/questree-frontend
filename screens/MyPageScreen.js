import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomTabBar from "../components/BottomTabBar";

function MyPageScreen() {
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);

  // useEffect(() => {
  //   const fetchUserId = async () => {
  //     try {
  //       const storedUserId = await AsyncStorage.getItem("userId");
  //       setUserId(storedUserId);
  //     } catch (error) {
  //       console.error("Error loading userId:", error);
  //     }
  //   };

  //   fetchUserId();
  // }, []);

  const handleSettingsPress = () => {
    // TODO: 설정 페이지로 이동하는 로직 구현
    navigation.navigate("Setting"); // 예시: SettingsScreen으로 이동
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>마이페이지</Text>
        <TouchableOpacity onPress={handleSettingsPress}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {userId ? (
          <Text style={styles.userId}>ID: {userId}</Text>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  userId: {
    fontSize: 18,
  },
});

export default MyPageScreen;
