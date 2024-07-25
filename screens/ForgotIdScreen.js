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
import AsyncStorage from "@react-native-async-storage/async-storage";

function ForgotIdScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const handleInputChange = (field, value) => {
    if (field === "name") {
      setName(value);
      setNameError(""); // 입력 시 에러 메시지 초기화
    } else if (field === "phone") {
      setPhone(value);
      setPhoneError(""); // 입력 시 에러 메시지 초기화
    }
  };

  const handleBlur = (field) => {
    if (field === "name") {
      setNameError(name.trim() === "" ? "이름을 입력해주세요." : "");
    } else if (field === "phone") {
      const phoneRegex = /^\d{11}$/;
      setPhoneError(
        !phoneRegex.test(phone) ? "휴대폰 번호는 11자리 숫자여야 합니다." : "",
      );
    }
  };

  const handleSubmit = async () => {
    if (nameError || phoneError) {
      // 이름 또는 휴대폰 번호 유효성 검사 실패 시
      Alert.alert("Error", "모든 정보를 올바르게 입력해주세요.");
      return;
    }

    setIsLoading(true); // 로딩 시작

    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      const response = await fetch(
        `https://api.questree.lesh.kr/member/findEmail?name=${name}&phone=${phone}`,
        {
          method: "GET",
          headers: {
            Authorization: accessToken,
            "X-Refresh-Token": refreshToken,
          },
        },
      );

      if (response.ok) {
        console.log(response);
        const data = await response.json();
        setResultMessage(`아이디: ${data[0]}, 이메일: ${data[1]}`);
      } else {
        console.log(response);

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

      <View style={styles.textContainer}>
        <Text style={styles.titleText}>Questree</Text>
        <Text style={styles.subText}>아이디 찾기</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={[styles.input, nameError && styles.invalidInput]}
            placeholder="이름"
            value={name}
            onChangeText={(text) => handleInputChange("name", text)}
            onBlur={() => handleBlur("name")}
          />
          <Text
            style={[styles.errorText, nameError && styles.errorTextVisible]}
          >
            {nameError}
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
            onBlur={handleBlur}
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
          <Text style={styles.buttonText}>아이디 찾기</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <Text style={styles.resultMessage}>{resultMessage}</Text>
      )}
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

export default ForgotIdScreen;
