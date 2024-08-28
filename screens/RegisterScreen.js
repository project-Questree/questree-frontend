import React, { useState } from "react";
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

function RegisterScreen() {
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

  const handleInputChange = (field, value) => {
    // 입력 값 변경 시에는 에러 메시지 초기화
    if (field === "name") {
      setName(value);
      setNameError("");
    } else if (field === "email") {
      setEmail(value);
      setEmailError("");
    } else if (field === "phone") {
      setPhone(value);
      setPhoneError("");
    } else if (field === "password") {
      setPassword(value);
      setPasswordError("");
    }
    if (field === "confirmPassword") {
      setConfirmPassword(value);
      setConfirmPasswordError(
        value !== password ? "비밀번호가 일치하지 않습니다." : "",
      );
    }
  };

  const handleBlur = (field) => {
    // 포커스 잃을 때 유효성 검사 및 에러 메시지 설정
    if (field === "name") {
      setNameError(name.trim() === "" ? "이름을 입력해주세요." : "");
    } else if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(
        !emailRegex.test(email) ? "올바른 이메일 주소를 입력해주세요." : "",
      );
    } else if (field === "phone") {
      const phoneRegex = /^\d{11}$/;
      setPhoneError(
        !phoneRegex.test(phone) ? "휴대폰 번호는 11자리 숫자여야 합니다." : "",
      );
    } else if (field === "password") {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,14}$/;
      setPasswordError(
        !passwordRegex.test(password)
          ? "비밀번호는 영문, 숫자 조합 14자리 이하여야 합니다."
          : "",
      );
    }
    if (field === "password") {
      // 비밀번호 입력 필드에서 포커스가 벗어날 때 비밀번호 확인 필드도 검사
      setConfirmPasswordError(
        confirmPassword !== password ? "비밀번호가 일치하지 않습니다." : "",
      );
    }
  };

  const handleSubmit = async () => {
    // 모든 필드 유효성 검사
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
      const response = await fetch("https://api.questree.lesh.kr/members/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, password }),
      });

      if (response.ok) {
        // 회원가입 성공
        Alert.alert("Success", "회원가입이 완료되었습니다.");
        navigation.navigate("Login");
      } else {
        // 회원가입 실패
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error registering:", error);
      Alert.alert("Error", "An error occurred during registration.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back-outline" size={24} color="white" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { textAlign: "center" }]}>
              회원가입
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
            placeholder="비밀번호"
            value={password}
            onChangeText={(text) => handleInputChange("password", text)}
            secureTextEntry
            onBlur={() => handleBlur("password")}
          />
          <Text style={styles.errorText}>{passwordError}</Text>

          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={[styles.input, confirmPasswordError && styles.invalidInput]}
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChangeText={(text) => handleInputChange("confirmPassword", text)}
            secureTextEntry
            onBlur={() => handleBlur("password")} // 비밀번호 필드와 동일하게 처리
          />
          <Text style={styles.errorText}>{confirmPasswordError}</Text>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleSubmit}
          >
            <Text style={styles.registerButtonText}>회원가입</Text>
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

    marginTop: 95,
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

export default RegisterScreen;
