import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import todoScreen from "./todoScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

function LoginScreen({ navigation }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const formData = { name, password };

    fetch("https://api.questree.lesh.kr/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // JSON으로 응답을 받음
        } else {
          throw new Error("Login failed"); // 로그인 실패 시 에러 처리
        }
      })
      .then((data) => {
        const { accessToken, refreshToken } = data;

        // 토큰을 async storage에 저장
        AsyncStorage.setItem("accessToken", accessToken);
        AsyncStorage.setItem("refreshToken", refreshToken);

        // Plans 화면으로 이동
        // navigation.navigate("Plans");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>Questree</Text>
        <Text style={styles.subText}>로그인</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text>Name</Text>
        <TextInput
          style={styles.inputBox}
          onChangeText={setName}
          value={name}
          placeholder="이메일"
        />
        <Text>Password</Text>
        <TextInput
          style={styles.inputBox}
          onChangeText={setPassword}
          value={password}
          placeholder="비밀번호"
          secureTextEntry={true}
        />
        <Button title="로그인" onPress={handleLogin} color="#8c6b52" />
        <Button
          title="이메일로 회원가입"
          onPress={() => navigation.navigate("Register")}
          color="gray"
        />
        <Text style={styles.forgotPassword}>비밀번호를 잊으셨나요?</Text>
      </View>
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
  textContainer: {
    marginTop: 70,
    flex: 1,
    marginBottom: 20,
    alignItems: "center",
  },
  inputContainer: {
    flex: 2,
    width: "100%",
  },

  titleText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#371c07",
  },
  subText: {
    marginVertical: 25,
    fontWeight: "bold",
    fontSize: 20,
  },

  inputBox: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  forgotPassword: {
    color: "gray",
    textDecorationLine: "underline",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default LoginScreen;
