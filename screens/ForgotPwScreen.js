import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

function ForgotPwScreen() {
  const navigation = useNavigation();
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const handleInputChange = (value) => {
    setPhone(value);
    setPhoneError(""); // 입력 시 에러 메시지 초기화
  };

  const handleBlur = () => {
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError("휴대폰 번호는 11자리 숫자여야 합니다.");
    }
  };

  const handleSubmit = async () => {
    if (phoneError) {
      Alert.alert("Error", "올바른 휴대폰 번호를 입력해주세요.");
      return;
    }

    setIsLoading(true); // 로딩 시작

    try {
      const response = await fetch(
        `https://api.questree.lesh.kr/member/findName?phone=${phone}`,
        {
          method: "GET",
        },
      );

      if (response.ok) {
        const data = await response.json();
        setResultMessage(`아이디: ${data.name}, 이메일: ${data.email}`);
      } else {
        const errorData = await response.json();
        setResultMessage(
          errorData.message || "아이디/이메일 찾기에 실패했습니다.",
        );
      }
    } catch (error) {
      console.error("Error finding ID/email:", error);
      setResultMessage("An error occurred while finding ID/email.");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{"<"}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { textAlign: "center" }]}>
            아이디 찾기
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>휴대폰 번호</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, phoneError && styles.invalidInput]}
            placeholder="휴대폰 번호"
            value={phone}
            onChangeText={handleInputChange}
            keyboardType="phone-pad"
            onBlur={handleBlur}
          />
          <Text
            style={[styles.errorText, phoneError && styles.errorTextVisible]}
          >
            {phoneError}
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>아이디 찾기</Text>
        </TouchableOpacity>

        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <Text style={styles.resultMessage}>{resultMessage}</Text>
        )}
      </View>
    </SafeAreaView>
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
    color: "white",
    marginRight: 10,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
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
  button: {
    backgroundColor: "#8c6b52", // 기존 버튼 배경색 유지
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20, // 결과 메시지와 버튼 사이 간격
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
