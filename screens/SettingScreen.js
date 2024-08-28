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

  const handleProfileEdit = () => {
    navigation.navigate("PasswordConfirm");
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
                  Cookie: `refreshToken=${refreshToken}`,
                },
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
        <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>설정</Text>
      </View>
      <View style={styles.settingItemContainer}>
        <View style={styles.settingItem}>
          <View style={styles.settingItemIconLabel}>
            <Icon name="notifications-outline" size={24} color="black" style={styles.icon} />
            <Text style={styles.settingLabel}>알림 설정</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
          />
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingItemIconLabel}>
            <Icon name="moon-outline" size={24} color="black" style={styles.icon} />
            <Text style={styles.settingLabel}>테마 설정</Text>
          </View>
          <TouchableOpacity onPress={toggleTheme}>
            <Text style={styles.themeText}>
              {theme === "light" ? "밝게" : "어둡게"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingItemIconLabel}>
            <Icon name="person-outline" size={24} color="black" style={styles.icon} />
            <TouchableOpacity onPress={handleProfileEdit} style={styles.settingItemRow}>        
              <Text style={styles.settingLabel}>개인정보 수정</Text>    
              <Icon name="chevron-forward-outline" size={22} color="grey" />

            </TouchableOpacity>
          </View>
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
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#66baa0",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    flex: 1, 
    textAlign: "center",
    marginRight:12,
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
  settingItemIconLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
  },
  settingItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // 아이콘을 오른쪽에 배치하기 위해 추가
    flex: 1,},
  icon: {
    marginRight: 10,
  },
  themeText: {
    fontSize: 16,
    color: "#008d62", // 테마 텍스트 색상 (예시)
  },
  logoutButton: {
    backgroundColor: "#008d62", // 로그아웃 버튼 색상 (예시)
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SettingScreen;