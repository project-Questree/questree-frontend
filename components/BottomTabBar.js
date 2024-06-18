import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const BottomTabBar = () => {
  const navigation = useNavigation(); // navigation 객체 사용

  return (
    <View style={styles.bottomTabsContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("MainToDo")}>
        <Ionicons name="list-outline" size={32} color="#8c6b52" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Calendar")}>
        <Ionicons name="calendar-outline" size={32} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("MyPage")}>
        <Ionicons name="person-outline" size={32} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomTabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});

export default BottomTabBar;
