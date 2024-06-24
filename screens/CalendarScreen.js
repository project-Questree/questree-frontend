import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomTabBar from "../components/BottomTabBar"; // BottomTabBar 컴포넌트 import

function CalendarScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <View>
          <Text>Calendar Screen</Text>
        </View>
      </View>
      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyContainer: {
    flex: 2,
  },
});

export default CalendarScreen;
