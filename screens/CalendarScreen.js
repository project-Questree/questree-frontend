import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import BottomTabBar from "../components/BottomTabBar"; // BottomTabBar 컴포넌트 import

function CalendarScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bodyContainer}>
        <View>
          <Text>Calendar Screen</Text>
        </View>
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
    flex: 2,
  },
});

export default CalendarScreen;
