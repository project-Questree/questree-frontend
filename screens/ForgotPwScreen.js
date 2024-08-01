import React, { useState } from "react";
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

function ForgotPwScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState(""); // 이메일 상태 사용
  const [emailError, setEmailError] = useState(""); // 이메일 에러 상태
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const handleInputChange = (field, value) => {
    if (field === "email") {
      setEmail(value);
      setEmailError("");
    } else if (field === "phone") {
      setPhone(value);
      setPhoneError("");
    }
  };

  const handleBlur = (field) => {
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(
        !emailRegex.test(email) ? "올바른 이메일 주소를 입력해주세요." : "",
      );
    } else if (field === "phone") {
      const phoneRegex = /^\d{11}$/;
      setPhoneError(
        !phoneRegex.test(phone) ? "휴대폰 번호는 11자리 숫자여야 합니다." : "",
      );
    }
  };

  const handleSubmit = async () => {
    if (emailError || phoneError) {
      Alert.alert("Error", "모든 정보를 올바르게 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      const response = await fetch(
        `https://api.questree.lesh.kr/member/findPassword?email=${email}&phone=${phone}`, // 쿼리 파라미터 수정
        {
          method: "GET",
          headers: {
            Authorization: accessToken,
            "X-Refresh-Token": refreshToken,
          },
        },
      );

      if (response.ok) {
        const data = await response.text();
        setResultMessage(
          "새로운 비밀번호가 발급되었습니다. 이메일을 확인해주세요.",
        );
      } else {
        const errorData = await response.text();
        setResultMessage(errorData.message || "비밀번호 찾기에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error finding password:", error);
      setResultMessage("An error occurred while finding password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>{"<"}</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { textAlign: "center" }]}>
              비밀번호 찾기
            </Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.titleText}>Questree</Text>
          <Text style={styles.subText}>비밀번호 찾기</Text>
        </View>

        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={[styles.input, emailError && styles.invalidInput]}
              placeholder="이메일"
              value={email}
              onChangeText={(text) => handleInputChange("email", text)}
              keyboardType="email-address"
              onBlur={() => handleBlur("email")}
            />
            <Text
              style={[styles.errorText, emailError && styles.errorTextVisible]}
            >
              {emailError}
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>휴대폰 번호</Text>
            <TextInput
              style={[styles.input, phoneError && styles.invalidInput]}
              placeholder="휴대폰 번호"
              value={phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              keyboardType="default"
              onBlur={() => handleBlur("phone")}
            />
            <Text
              style={[styles.errorText, phoneError && styles.errorTextVisible]}
            >
              {phoneError}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>비밀번호 찾기</Text>
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <Text style={styles.resultMessage}>{resultMessage}</Text>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#8c6b52", // 기존 헤더 배경색 유지
  },
  backButton: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  textContainer: {
    width: "100%",
    marginTop: 70,
    flex: 2,
    marginBottom: 20,
    alignItems: "center",
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  invalidInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  errorTextVisible: {
    height: 16,
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "#008d62", // 나뭇잎색
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 130, // 결과 메시지와 버튼 사이 간격
    width: "90%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  resultMessage: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default ForgotPwScreen;
