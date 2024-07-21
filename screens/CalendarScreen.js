import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import BottomTabBar from "../components/BottomTabBar";

function CalendarScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bodyContainer}>
        <Text style={styles.preparingMessage}>준비 중입니다...😥</Text>
      </View>
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
    alignItems: "center", // 가운데 정렬
    justifyContent: "center",
  },
  preparingMessage: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CalendarScreen;
