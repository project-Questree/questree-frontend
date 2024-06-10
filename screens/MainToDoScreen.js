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
  FlatList,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TodoList from "../Controllers/ToDoList";
import WeeklyField from "../components/WeeklyField";
import CountField from "../components/CountField";
import BouncyCheckbox from "react-native-bouncy-checkbox";

function MainToDoScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newTodo, setNewTodo] = useState("");
  const [todoLists, setTodoLists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [todoType, setTodoType] = useState("TODO");
  const [selectedType, setSelectedType] = useState("TODO"); // 선택된 타입 상태
  const [targetedDays, setTargetedDays] = useState("0000000"); // targetedDays 상태 추가
  const [resetDay, setResetDay] = useState(0); // 0: 일요일
  const [countData, setCountData] = useState({
    startDate: null,
    endDate: null,
    intervals: 0,
    repeatCount: 0,
  });
  const [floatingPlusButtonVisible, setFloatingPlusButtonVisible] =
    useState(true);
  const handleTypePress = (type) => {
    setSelectedType(type); // 선택된 타입 변경 (UI에 사용)
    setTodoType(type); // todoType 변경 (API 요청에 사용)
  };
  const [isLoading, setIsLoading] = useState(true); // isLoading 상태 추가
  const [error, setError] = useState(null); // error 상태 추가

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      const response = await fetch("https://api.questree.lesh.kr/plans", {
        method: "GET",
        headers: {
          Authorization: accessToken,
          "X-Refresh-Token": refreshToken,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch todo lists");
      }

      const data = await response.json();
      setTodoLists(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching todo lists:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        isContinue: true,
        targetedDays: null,
        resetDay: null,
        startDate: null,
        endDate: null,
        intervals: null,
        repeatCount: null,
      };

      if (todoType === "WEEKLY") {
        newTodoItem.targetedDays = targetedDays;
        newTodoItem.resetDay = resetDay;
      } else if (todoType === "COUNT") {
        newTodoItem.startDate = countData.startDate?.toISOString().slice(0, 10);
        newTodoItem.endDate = countData.endDate?.toISOString().slice(0, 10);
        newTodoItem.intervals = countData.intervals;
        newTodoItem.repeatCount = countData.repeatCount;
      }

      console.log("새로운 할 일 항목:", newTodoItem);

      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        const response = await fetch("https://api.questree.lesh.kr/plans/new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
            "X-Refresh-Token": refreshToken,
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
        fetchTodos(); // 투두리스트를 다시 불러온다.
      } catch (error) {
        console.error("API 요청 실패:", error);
        if (error instanceof SyntaxError && error.message.includes("JSON")) {
          // JSON 파싱 에러 처리
          console.error("API 응답이 올바른 JSON 형식이 아닙니다.");
        }
      } finally {
        setNewTodo("");
        setTodoType("TODO");
        setSelectedType("TODO");
        setModalVisible(false);
        setFloatingPlusButtonVisible(true);
        setTargetedDays("0000000"); // targetedDays 초기화
        setResetDay(0);
        setCountData({
          startDate: null,
          endDate: null,
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

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <BouncyCheckbox
          style={styles.checkbox}
          size={16}
          fillColor="red"
          unfillColor="#FFFFFF"
          iconStyle={{ borderColor: "white" }}
          textStyle={{ fontFamily: "JosefinSans-Regular" }}
          isChecked={!item.isContinue} // isContinue가 false일 때 체크되도록 변경
          onPress={async (isChecked) => {
            try {
              const accessToken = await AsyncStorage.getItem("accessToken");
              const refreshToken = await AsyncStorage.getItem("refreshToken");

              const response = await fetch(
                `https://api.questree.lesh.kr/plans/checked/${item.id}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: accessToken,
                    "X-Refresh-Token": refreshToken,
                  },
                  // body: JSON.stringify({
                  //   isContinue: !isChecked, // 반전된 값 전송
                  // }),
                },
              );

              if (!response.ok) {
                throw new Error("Failed to update todo");
              }

              // API 요청 성공 후 할 일 목록 다시 가져오기
              fetchTodos();
            } catch (error) {
              console.error("Error updating todo:", error);
              // 에러 처리 (예: 사용자에게 알림)
            }
          }}
        />
        <Text style={styles.todoContent}>{item.content}</Text>
      </View>
      <Text style={styles.todoType}>({item.type})</Text>
      <TouchableOpacity onPress={() => handleDeleteTodo(item.id)}>
        <Text style={styles.deleteButton}>❌</Text>
      </TouchableOpacity>
    </View>
  );
  const handleDeleteTodo = async (todoId) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      const response = await fetch(
        `https://api.questree.lesh.kr/plans/delete/${todoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: accessToken,
            "X-Refresh-Token": refreshToken,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      // 삭제 성공 시 todoLists 상태 업데이트
      setTodoLists((prevTodoLists) =>
        prevTodoLists.filter((todo) => todo.id !== todoId),
      );
    } catch (error) {
      console.error("Error deleting todo:", error);
      // TODO: 에러 처리 (예: 사용자에게 알림)
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);

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
        {isLoading ? (
          <Text>Loading...</Text> // 로딩 중일 때 표시
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text> // 에러 발생 시 표시
        ) : (
          // todoLists에 데이터가 있을 때만 FlatList 렌더링
          <FlatList
            data={todoLists}
            renderItem={renderItem}
            keyExtractor={(item) => String(item.id)}
          />
        )}
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
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // 양쪽 끝으로 정렬
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  todoContent: {
    fontSize: 16,
  },
  todoType: {
    fontSize: 12,
    color: "gray",
  },
  deleteButton: {
    fontSize: 18,
    marginLeft: 10,
    color: "red",
  },
});

export default MainToDoScreen;
