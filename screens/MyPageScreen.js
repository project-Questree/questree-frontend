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

function MyPageScreen() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("사용자 이름"); // TODO: API에서 가져오기
  const [completedTasks, setCompletedTasks] = useState(0); // TODO: API에서 가져오기
  const [inProgressTasks, setInProgressTasks] = useState(0); // TODO: API에서 가져오기
  const [goalAchievementRate, setGoalAchievementRate] = useState(0); // TODO: API에서 가져오기

  const handleSettingsPress = () => {
    navigation.navigate("Setting"); // 설정 페이지로 이동
  };

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
        <Text>사진</Text>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.introduce}>자기소개자기소개자기소개</Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    padding: 20,
    fontSize: 24,
    fontWeight: "bold",
  },
  settingButton: {
    padding: 10,
  },
  profileContainer: {
    flex: 0.8,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
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
