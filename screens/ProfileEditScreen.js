import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SettingScreen from "./SettingScreen";

function ProfileEditScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        const response = await fetch(
          "https://api.questree.lesh.kr/member/getMemberInfo",
          {
            method: "GET",
            headers: {
              Authorization: accessToken,
              "X-Refresh-Token": refreshToken,
            },
          }
        );

        const data = await response.json();
        console.log("API response:", data);

        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field, value) => {
    switch (field) {
      case "name":
        setName(value);
        setNameError("");
        break;
      case "email":
        setEmail(value);
        setEmailError("");
        break;
      case "phone":
        setPhone(value);
        setPhoneError("");
        break;
      case "password":
        setPassword(value);
        setPasswordError("");
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        setConfirmPasswordError(
          value !== password ? "비밀번호가 일치하지 않습니다." : ""
        );
        break;
    }
  };

  const handleBlur = (field) => {
    switch (field) {
      case "name":
        setNameError(name.trim() === "" ? "이름을 입력해주세요." : "");
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailError(
          !emailRegex.test(email) ? "올바른 이메일 주소를 입력해주세요." : ""
        );
        break;
      case "phone":
        const phoneRegex = /^\d{11}$/;
        setPhoneError(
          !phoneRegex.test(phone) ? "휴대폰 번호는 11자리 숫자여야 합니다." : ""
        );
        break;
      case "password":
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,14}$/;
        setPasswordError(
          !passwordRegex.test(password)
            ? "비밀번호는 영문, 숫자 조합 14자리 이하여야 합니다."
            : ""
        );
        setConfirmPasswordError(
          confirmPassword !== password ? "비밀번호가 일치하지 않습니다." : ""
        );
        break;
    }
  };

  const handleSubmit = async () => {
    if (
      nameError ||
      emailError ||
      phoneError ||
      passwordError ||
      confirmPasswordError
    ) {
      Alert.alert("Error", "모든 정보를 올바르게 입력해주세요.");
      return;
    }
  
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");
  
      const response = await fetch("https://api.questree.lesh.kr/members/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
          "X-Refresh-Token": refreshToken,
        },
        body: JSON.stringify({
          name: name ? name : null, // name이 비어 있으면 null을 사용
          email: email ? email : null, // email이 비어 있으면 null을 사용
          phone: phone ? phone : null, // phone이 비어 있으면 null을 사용
          password: password ? password : null, // password가 비어 있으면 null을 사용
        }),
      });
  
      if (response.ok) {
        Alert.alert("Success", "프로필이 성공적으로 수정되었습니다.");
        navigation.navigate("Setting");
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "프로필 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "프로필 수정 중 오류가 발생했습니다.");
    }
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { textAlign: "center" }]}>
              개인정보 수정
            </Text>
          </View>
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={[styles.input, nameError && styles.invalidInput]}
            placeholder="이름"
            value={name}
            onChangeText={(text) => handleInputChange("name", text)}
            onBlur={() => handleBlur("name")}
          />
          <Text style={styles.errorText}>{nameError}</Text>

          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={[styles.input, emailError && styles.invalidInput]}
            placeholder="Email"
            value={email}
            onChangeText={(text) => handleInputChange("email", text)}
            keyboardType="email-address"
            onBlur={() => handleBlur("email")}
          />
          <Text style={styles.errorText}>{emailError}</Text>

          <Text style={styles.label}>휴대폰 번호</Text>
          <TextInput
            style={[styles.input, phoneError && styles.invalidInput]}
            placeholder="휴대폰 번호"
            value={phone}
            onChangeText={(text) => handleInputChange("phone", text)}
            keyboardType="phone-pad"
            onBlur={() => handleBlur("phone")}
          />
          <Text style={styles.errorText}>{phoneError}</Text>

          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={[styles.input, passwordError && styles.invalidInput]}
            placeholder="비밀번호 (필요시 변경)"
            value={password}
            onChangeText={(text) => handleInputChange("password", text)}
            secureTextEntry
            onBlur={() => handleBlur("password")}
          />
          <Text style={styles.errorText}>{passwordError}</Text>

          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={[
              styles.input,
              confirmPasswordError && styles.invalidInput,
            ]}
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChangeText={(text) =>
              handleInputChange("confirmPassword", text)
            }
            secureTextEntry
            onBlur={() => handleBlur("password")}
          />
          <Text style={styles.errorText}>{confirmPasswordError}</Text>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleSubmit}
          >
            <Text style={styles.registerButtonText}>완료</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  registerButton: {
    backgroundColor: "#008d62",
    padding: 18,
    borderRadius: 5,
    width: "100%",
    marginTop: 40, // 레이아웃이 깔끔하게 보이도록 수정
  },
  registerButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
  safeAreaContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#66baa0",
    justifyContent: "center",
  },
  backButton: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  invalidInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
    height: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
});

export default ProfileEditScreen;
