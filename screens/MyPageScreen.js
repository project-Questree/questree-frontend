import React from "react";
import { View, Text, StyleSheet } from "react-native";

function MyPageScreen() {
  return (
    <View style={styles.container}>
      <Text>My Page Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MyPageScreen;
