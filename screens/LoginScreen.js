import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

function LoginScreen({ navigation }) {
  const [nameOrEmail, setNameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    let formData;

    if (nameOrEmail.includes("@")) {
      formData = {
        email: nameOrEmail,
        password: password,
      };
    } else {
      formData = {
        name: nameOrEmail,
        password: password,
      };
    }

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
          throw new Error("로그인 실패"); // 로그인 실패 시 에러 처리
        }
      })
      .then((data) => {
        const { accessToken, refreshToken } = data;

        // 토큰을 async storage에 저장
        AsyncStorage.setItem("accessToken", accessToken);
        AsyncStorage.setItem("refreshToken", refreshToken);

        // 로그인 후 메인 화면으로 이동
        navigation.navigate("MainToDo");
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
        <Text>ID</Text>
        <TextInput
          style={styles.inputBox}
          onChangeText={setNameOrEmail}
          value={nameOrEmail}
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
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.registerButtonText}>회원가입</Text>
        </TouchableOpacity>

        <View style={styles.forgotIdPasswordContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("ForgotId")}>
            <Text style={styles.forgotIdPassword}>아이디 / </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPw")}>
            <Text style={styles.forgotIdPassword}>비밀번호를 잊으셨나요?</Text>
          </TouchableOpacity>
        </View>
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
    width: "100%",
    marginTop: 70,
    flex: 2,
    marginBottom: 20,
    alignItems: "center",
  },
  inputContainer: {
    flex: 2,
    width: "100%",
  },
  buttonContainer: {
    flex: 1.2,
    width: "111%",
    borderRadius: 50,
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
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  forgotIdPasswordContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  forgotIdPassword: {
    color: "gray",
    textDecorationLine: "underline",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },

  loginButton: {
    backgroundColor: "#008d62", // 로그아웃 버튼 색상 (예시)
    padding: 12,
    borderRadius: 5,
    width: "100%",
  },
  registerButton: {
    backgroundColor: "#8c6b52", // 로그아웃 버튼 색상 (예시)
    padding: 12,
    borderRadius: 5,
  },
  loginButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
  registerButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LoginScreen;
