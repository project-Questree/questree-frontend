import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,SafeAreaView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

function PasswordConfirmScreen() {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordSubmit = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");
  
      const response = await fetch(
        `https://api.questree.lesh.kr/member/checkPassword`,
        {
          method: "POST",
          headers: {
            Authorization: accessToken,
            "X-Refresh-Token": refreshToken,
            "Content-Type": "application/json", // 요청 본문에 JSON 형식을 사용함을 명시
          },
          body: JSON.stringify({ givenPassword: password }), // 요청 본문에 사용자 입력 비밀번호 포함
        }
      );
  
      const data = await response.text(); // 응답을 JSON 형식으로 파싱
      console.log("API response:", data);
  
      if (response.ok) {
        // 서버 응답이 성공적이면 ProfileEdit 페이지로 이동
        navigation.navigate("ProfileEdit");
      } else {
        setPasswordError("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("Failed to verify password:", error);
      Alert.alert("Error", "비밀번호 확인 중 오류가 발생했습니다.");
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="chevron-back-outline" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>비밀번호 확인</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>비밀번호 확인</Text>
        <TextInput
          style={[styles.input, passwordError && styles.invalidInput]}
          placeholder="비밀번호를 입력하세요"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TouchableOpacity style={styles.submitButton} onPress={handlePasswordSubmit}>
          <Text style={styles.submitButtonText}>확인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#66baa0",
    justifyContent: "flex-start",
  },
  headerTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    flex: 1, 
    textAlign: "center",
    marginRight:12,

  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#008d62",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
submitButtonText: {
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
},
invalidInput: {
  borderColor: "red",
},
errorText: {
  color: "red",
  fontSize: 12,
  marginBottom: 10,
},
});

export default PasswordConfirmScreen;
