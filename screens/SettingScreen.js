import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

function SettingScreen() {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [theme, setTheme] = useState("light"); // 'light' 또는 'dark'

  useEffect(() => {
    // AsyncStorage에서 설정 값 불러오기 (초기값 설정)
    const loadSettings = async () => {
      try {
        const storedNotificationsEnabled = await AsyncStorage.getItem(
          "notificationsEnabled",
        );
        const storedTheme = await AsyncStorage.getItem("theme");
        setNotificationsEnabled(storedNotificationsEnabled === "true");
        setTheme(storedTheme || "light");
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    // 설정 값 변경 시 AsyncStorage에 저장
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem(
          "notificationsEnabled",
          notificationsEnabled.toString(),
        );
        await AsyncStorage.setItem("theme", theme);
      } catch (error) {
        console.error("Error saving settings:", error);
      }
    };

    saveSettings();
  }, [notificationsEnabled, theme]);

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    Alert.alert("로그아웃", "로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "확인",
        onPress: async () => {
          try {
            const refreshToken = await AsyncStorage.getItem("refreshToken");

            const response = await fetch(
              "https://api.questree.lesh.kr/logout",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ refreshToken: refreshToken }),
              },
            );

            if (response.ok) {
              // 성공적으로 로그아웃되면 토큰 삭제
              await AsyncStorage.removeItem("accessToken");
              await AsyncStorage.removeItem("refreshToken");
              // 로그인 화면으로 이동
              navigation.navigate("Login");
            } else {
              Alert.alert("Error", "로그아웃에 실패했습니다.");
            }
          } catch (error) {
            console.error("Error logging out:", error);
            Alert.alert("Error", "로그아웃 중 오류가 발생했습니다.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>설정</Text>
      </View>
      <View style={styles.settingItemContainer}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>알림 설정</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>테마 설정</Text>
          <TouchableOpacity onPress={toggleTheme}>
            <Text style={styles.themeText}>
              {theme === "light" ? "밝게" : "어둡게"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  settingItemContainer: {
    flex: 2,
    padding: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  settingLabel: {
    fontSize: 16,
  },
  themeText: {
    fontSize: 16,
    color: "#008d62", // 테마 텍스트 색상 (예시)
  },
  logoutButton: {
    backgroundColor: "#008d62", // 로그아웃 버튼 색상 (예시)
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SettingScreen;
