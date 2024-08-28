import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomTabBar from "../components/BottomTabBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

function MyPageScreen() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("사용자 이름");
  const [completedTasks, setCompletedTasks] = useState(0);
  const [inProgressTasks, setInProgressTasks] = useState(0);
  const [goalAchievementRate, setGoalAchievementRate] = useState(0);

  const handleSettingsPress = () => {
    navigation.navigate("Setting"); // 설정 페이지로 이동
  };

  useFocusEffect(
  React.useCallback(() => {
    const fetchUserName = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        const response = await fetch(
          "https://api.questree.lesh.kr/member/getMemberInfo",
          {
            method: "GET",
            headers: {
              Authorization: accessToken,
              "X-Refresh-Token": refreshToken,
            },
          }
        );

        const data = await response.json();
        console.log("API response:", data);
        setUserName(data.name || "사용자 이름");
      } catch (error) {
        console.error("Failed to fetch user name:", error);
      }
    };

    fetchUserName();
  }, [])
);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>마이페이지</Text>
        <TouchableOpacity
          style={styles.settingButton}
          onPress={handleSettingsPress}
        >
          <Ionicons name="settings-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

   {/* 프로필 영역 */}
<View style={styles.profileContainer}>
  <Image 
     source={require("../assets/tree-icon.png")}
    style={styles.profileImage} 
  />
  <View style={styles.profileTextContainer}>
    <Text style={styles.userName}>{userName}</Text>
    <Text style={styles.introduce}>안녕하세요</Text>
  </View>
</View>

      {/* 통계 영역 */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>완료된 할 일</Text>
          <Text style={styles.statValue}>{completedTasks}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>진행 중인 할 일</Text>
          <Text style={styles.statValue}>{inProgressTasks}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>목표 달성률</Text>
          <Text style={styles.statValue}>{goalAchievementRate}%</Text>
        </View>
      </View>
      <BottomTabBar />
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
    backgroundColor: "white",
    justifyContent: "flex-start",
    borderBottomWidth:1,
    borderBottomColor: "#ccc",

  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    flex: 1, 
    textAlign: "center",
    marginLeft:20,
  
  }, 
  profileContainer: {
    flexDirection: "row", // 사진과 텍스트를 가로로 배치
    alignItems: "center", // 수직 가운데 정렬
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profileImage: {
    width: 80, // 원하는 크기로 설정
    height: 80,
    borderWidth:1.5,
    borderRadius: 40, // 원형으로 만들기 위해 반지름을 높이의 절반으로 설정
    marginRight: 20, // 이미지와 텍스트 사이의 간격
  },
  profileTextContainer: {
    flex: 1, // 남은 공간을 차지하도록 설정
    justifyContent: "center",
    padding:5,
    marginBottom:10,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  introduce: {
    fontSize: 15,
    fontweight: "bold",
  },
  statsContainer: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MyPageScreen;
