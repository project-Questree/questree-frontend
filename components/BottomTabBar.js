import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const BottomTabBar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState(route.name);

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      setActiveTab(route.name);
    });
    return unsubscribe; // 컴포넌트 언마운트 시 이벤트 리스너 제거
  }, [navigation, route]); // navigation, route가 변경될 때 useEffect 실행

  return (
    <View style={styles.bottomTabsContainer}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === "MainToDo" && styles.activeTabButton,
        ]}
        onPress={() => navigation.navigate("MainToDo")}
      >
        <Ionicons
          name="list-outline"
          size={32}
          color={activeTab === "MainToDo" ? "white" : "gray"}
          style={styles.icon} // 아이콘 스타일 추가
        />
        <Text
          style={[
            styles.tabText,
            activeTab === "MainToDo" && styles.activeTabText,
          ]}
        >
          할일 목록
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === "Calendar" && styles.activeTabButton,
          { borderLeftWidth: 1, borderRightWidth: 1, borderColor: "#ccc" }, // border 추가
        ]}
        onPress={() => navigation.navigate("Calendar")}
      >
        <Ionicons
          name="calendar-outline"
          size={32}
          color={activeTab === "Calendar" ? "white" : "gray"}
          style={styles.icon} // 아이콘 스타일 추가
        />
        <Text
          style={[
            styles.tabText,
            activeTab === "Calendar" && styles.activeTabText,
          ]}
        >
          달력
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === "MyPage" && styles.activeTabButton,
        ]}
        onPress={() => navigation.navigate("MyPage")}
      >
        <Ionicons
          name="person-outline"
          size={32}
          color={activeTab === "MyPage" ? "white" : "gray"}
          style={styles.icon} // 아이콘 스타일 추가
        />
        <Text
          style={[
            styles.tabText,
            activeTab === "MyPage" && styles.activeTabText,
          ]}
        >
          마이페이지
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomTabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  activeTabButton: {
    backgroundColor: "#66baa0",
  },
  icon: {
    marginBottom: 1, // 아이콘 아래에 약간의 마진 추가
  },
  tabText: {
    fontSize: 12,
    color: "gray",
  },
  activeTabText: {
    color: "white",
  },
});

export default BottomTabBar;
