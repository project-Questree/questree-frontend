import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomTabBar from "../components/BottomTabBar"; // BottomTabBar 컴포넌트 import

function CalendarScreen() {
  return (
    <View style={styles.container}>
      <View>
        <Text>Calendar Screen</Text>
      </View>
      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CalendarScreen;
