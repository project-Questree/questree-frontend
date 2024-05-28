import { React, useEffect } from "react";
import { StatusBar, StyleSheet, Text, View, Button, Image } from "react-native";
import LoginScreen from "./LoginScreen";
import { useNavigation } from "@react-navigation/native";

function HomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const timeoutId = setTimeout(() => navigation.navigate("Login"), 2000);
    return () => clearTimeout(timeoutId);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Questree</Text>
      <Text style={styles.subTitleText}>당신의 모든 일정을 한 손에</Text>
      <Image
        source={require("../assets/tree-icon.png")}
        style={styles.treeImg}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  titleText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#371c07",
    marginBottom: 15,
  },
  subTitleText: {
    fontSize: 16,
    color: "#8c6b52",
    textAlign: "center",
    marginBottom: 60,
  },

  treeImg: {
    width: 400,
    height: 400,
    marginBottom: 20,
  },
});

export default HomeScreen;
