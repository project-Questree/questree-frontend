// MainToDoScreen.js

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TodoList from "../Controllers/ToDoList";
import WeeklyField from "../components/WeeklyField";
import CountField from "../components/CountField";

function MainToDoScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newTodo, setNewTodo] = useState("");
  const [todoLists, setTodoLists] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [todoType, setTodoType] = useState("TODO");
  const [selectedType, setSelectedType] = useState("TODO"); // 선택된 타입 상태
  const [targetedDays, setTargetedDays] = useState([]); // targetedDays 상태 추가
  const [resetDay, setResetDay] = useState(0); // 0: 일요일
  const [countData, setCountData] = useState({
    startDate: "",
    endDate: "",
    intervals: 0,
    repeatCount: 0,
  });
  const [floatingPlusButtonVisible, setFloatingPlusButtonVisible] =
    useState(true);
  const handleTypePress = (type) => {
    setSelectedType(type); // 선택된 타입 변경 (UI에 사용)
    setTodoType(type); // todoType 변경 (API 요청에 사용)
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken"); // 토큰 가져오기
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        const response = await fetch("https://api.questree.lesh.kr/plans", {
          method: "GET",
          headers: {
            Authorization: accessToken,
            "X-Refresh-Token": refreshToken,
          },
        });

        console.log(response);
        console.log("hihi");

        if (!response.ok) {
          throw new Error("Failed to fetch todo lists");
        }

        const data = await response.json();

        // API 응답 형식에 맞게 todoLists 상태 업데이트
        // 예시: data가 할 일 배열일 경우
        setTodoLists({
          [today]: data.map((todo) => ({
            content: todo.content,
            completed: todo.completed,
            type: todo.type,
            // 필요에 따라 다른 필드 추가 (targetedDay, resetDay, startDate, endDate, intervals, repeatCount)
          })),
        });
      } catch (error) {
        console.error("Error fetching todo lists:", error);
        // TODO: 에러 처리 (예: 사용자에게 알림)
      }
    };

    fetchTodos();
  }, [currentDate]);

  const handlePreviousDay = () => {
    const previousDay = new Date(currentDate);
    previousDay.setDate(currentDate.getDate() - 1);
    setCurrentDate(previousDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDay);
  };

  const addTodo = async () => {
    if (newTodo.trim() !== "") {
      let newTodoItem = {
        content: newTodo,
        type: todoType,
        // targetedDay: null, // 빈 배열로 초기화
        // resetDay: null,
        // startDate: null,
        // endDate: null,
        // intervals: null,
        // repeatCount: null,
      };

      console.log("새로운 할 일 항목:", newTodoItem);

      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        const response = await fetch("https://api.questree.lesh.kr/plans/new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken, // accessToken 헤더 추가
            "X-Refresh-Token": refreshToken, // refreshToken 헤더 추가 (필요한 경우)
          },
          body: JSON.stringify(newTodoItem),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }

        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
          // JSON 형식일 경우에만 JSON 파싱 시도
          data = await response.json();
        } else {
          // JSON 형식이 아닐 경우 텍스트로 처리
          data = await response.text();
        }

        console.log("API 응답:", data);

        // 성공적으로 API 요청을 보낸 후, todoLists 상태 업데이트
        setTodoLists((prevTodoLists) => ({
          ...prevTodoLists,
          [currentDate.toDateString()]: [
            ...(prevTodoLists[currentDate.toDateString()] || []),
            newTodoItem,
          ],
        }));
      } catch (error) {
        console.error("API 요청 실패:", error);
        if (error instanceof SyntaxError && error.message.includes("JSON")) {
          // JSON 파싱 에러 처리
          console.error("API 응답이 올바른 JSON 형식이 아닙니다.");
        }
      } finally {
        setNewTodo("");
        setTodoType("TODO");
        setModalVisible(false);
        setFloatingPlusButtonVisible(true);
        setTargetedDays([]);
        setResetDay(0);
        setCountData({
          startDate: "",
          endDate: "",
          intervals: 0,
          repeatCount: 0,
        });
      }
    }
  };

  const formatDate = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={handlePreviousDay}>
          <Text style={styles.switchDateBtn}>{"◀"}</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
        <TouchableOpacity onPress={handleNextDay}>
          <Text style={styles.switchDateBtn}>{"▶"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.BodyContainer}>
        <TodoList
          todos={todoLists[currentDate.toDateString()]}
          setTodos={setTodoLists}
          currentDate={currentDate}
        />
      </View>
      {/* 모달 띄우기 버튼 */}
      <TouchableOpacity
        style={[
          styles.floatingPlusButton,
          !floatingPlusButtonVisible && { display: "none" },
        ]}
        onPress={() => {
          setModalVisible(true);
          setFloatingPlusButtonVisible(false);
        }}
      >
        <Text style={styles.floatingPlusButtonText}>+</Text>
      </TouchableOpacity>

      {/* AddToDo모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setFloatingPlusButtonVisible(true);
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(false);
            setFloatingPlusButtonVisible(true);
          }}
        >
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView style={styles.modalContent}>
            <View>
              <Text style={styles.modalTitle}>To Do :</Text>
              <TextInput
                style={styles.AddTodoinput}
                value={newTodo}
                onChangeText={setNewTodo}
                placeholder="Add a new todo"
                autoFocus={true}
              />
            </View>

            <View style={styles.typeButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedType === "TODO" && styles.selectedTypeButton,
                ]}
                onPress={() => handleTypePress("TODO")}
              >
                <Text style={styles.typeButtonText}>TODO</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedType === "WEEKLY" && styles.selectedTypeButton,
                ]}
                onPress={() => handleTypePress("WEEKLY")}
              >
                <Text style={styles.typeButtonText}>WEEKLY</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedType === "COUNT" && styles.selectedTypeButton,
                ]}
                onPress={() => handleTypePress("COUNT")}
              >
                <Text style={styles.typeButtonText}>COUNT</Text>
              </TouchableOpacity>
            </View>

            {/* 조건부 렌더링 (TODO일 경우 아무것도 렌더링하지 않음) */}
            {selectedType === "WEEKLY" && (
              <WeeklyField
                targetedDays={targetedDays}
                resetDay={resetDay}
                onTargetedDaysChange={setTargetedDays}
                onResetDayChange={setResetDay}
              />
            )}
            {selectedType === "COUNT" && (
              <CountField
                countData={countData}
                onCountDataChange={setCountData}
              />
            )}

            <View style={styles.addTodoButtonContainer}>
              <TouchableOpacity style={styles.addTodoButton} onPress={addTodo}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomWidth: 1.5, // 경계선 두께
    borderBottomColor: "#ccc", // 경계선 색상
  },
  switchDateBtn: {
    color: "gray",
    fontSize: 30,
  },
  dateText: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "darkgrey",
    fontSize: 20,
    backgroundColor: "grey",
    color: "white",
    borderRadius: 35,
    width: 70,
    height: 70,
    textAlign: "center",
    lineHeight: 70, // Ensures the text is centered vertically
    overflow: "hidden",
  },
  BodyContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5", // 연한 배경색
    borderRadius: 10, // 모서리를 둥글게
    margin: 20, // 외부 여백
    shadowColor: "#000", // 그림자 색상
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1, // 그림자 투명도
    shadowRadius: 3.84, // 그림자 반경
    elevation: 5, // 안드로이드 그림자 효과
  },
  floatingPlusButton: {
    position: "absolute",

    backgroundColor: "grey",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingPlusButtonText: {
    color: "#fff",
    fontSize: 32,
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 20, // 아래 여백
    right: 20, // 오른쪽 여백
  },
  addTodoButton: {
    position: "absolute",
    bottom: 35,
    right: 40,
    backgroundColor: "grey",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    position: "absolute",
    color: "#fff",
    fontSize: 30,
  },
  modalContainer: {
    flex: 4,
    justifyContent: "center",
    // alignItems: "center",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  AddTodoinput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: 250,
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  todoTypePicker: {
    position: "absolute",
    height: 0,
    width: "100%",
    marginBottom: 0,
  },
  typeButtonsContainer: {
    flexDirection: "row", // 가로 배치로 변경
    justifyContent: "space-around",
    marginBottom: 20,
  },
  typeButtonText: {},
});

export default MainToDoScreen;
