import React from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import LoginScreen from "./LoginScreen";
import { useNavigation } from "@react-navigation/native";

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Questree</Text>
      <Image source={require("../assets/tree.png")} style={styles.treeImg} />
      <Text style={styles.subTitleText}>Organize Your Quests with Ease</Text>
      <Button
        style={styles.loginBtn}
        title="Start!"
        onPress={() => navigation.navigate("Login")}
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
    marginBottom: 100,
  },
  subTitleText: {
    fontSize: 16,
    color: "#8c6b52",
    textAlign: "center",
    marginBottom: 20,
  },

  treeImg: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  loginBtn: {
    color: "gray",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
});

export default HomeScreen;
