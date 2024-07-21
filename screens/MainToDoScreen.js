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
  Alert,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import WeeklyField from "../components/WeeklyField";
import CountField from "../components/CountField";
import NavBar from "../components/NavBar";
import BottomTabBar from "../components/BottomTabBar";
import { Ionicons } from "@expo/vector-icons";

function MainToDoScreen() {
  const navigation = useNavigation();

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

  const [updatingTodoId, setUpdatingTodoId] = useState(null); // 수정 중인 TODO ID 상태
  const [updatedTodoContent, setUpdatedTodoContent] = useState(""); // 수정된 TODO 내용 상태

  const handleTodoPress = (item) => {
    setUpdatingTodoId(item.id); // 수정 중인 TODO ID 설정
    setUpdatedTodoContent(item.content); // 수정된 TODO 내용 초기값 설정
  };

  useEffect(() => {
    fetchTodos();
  }, [currentDate]);

  const fetchTodos = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      const formattedDate = currentDate.toISOString(); // 현재 날짜를 ISO 8601 형식으로 변환

      const response = await fetch(
        `https://api.questree.lesh.kr/plans?requestDate=${formattedDate}`,
        {
          method: "GET",
          headers: {
            Authorization: accessToken,
            "X-Refresh-Token": refreshToken,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch todo lists");
      }

      const data = await response.json();
      console.log("GET 성공 :", data);

      //API 응답에서 notOPeratedPlans 와 histories 배열을 합쳐 todoLists 에 저장
      const TodoLists = [
        ...(data.notOperatedPlans || []),
        ...(data.histories || []),
      ];

      setTodoLists(TodoLists);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching todo lists:", error);
    } finally {
      setIsLoading(false);
    }
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

  const e = async (todoId) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      console.log(todoId);
      console.log(updatedTodoContent);
      const response = await fetch(
        `https://api.questree.lesh.kr/plans/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
            "X-Refresh-Token": refreshToken,
          },
          body: JSON.stringify({
            id: todoId,
            content: updatedTodoContent,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      // 수정 성공 시 todoLists 상태 업데이트
      setTodoLists((prevTodoLists) =>
        prevTodoLists.map((todo) =>
          todo.id === todoId ? { ...todo, content: updatedTodoContent } : todo,
        ),
      );
      setUpdatingTodoId(null); // 수정 종료
      setUpdatedTodoContent("");
    } catch (error) {
      console.error("Error updating todo:", error);
      // TODO: 에러 처리 (예: 사용자에게 알림)
    }
  };

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

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <BouncyCheckbox
        style={styles.checkbox}
        size={20}
        fillColor="#008d62"
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
      {updatingTodoId === item.id ? ( // 수정 중인 TODO인 경우 TextInput 표시
        <TextInput
          style={styles.todoContentInput}
          value={updatedTodoContent}
          onChangeText={setUpdatedTodoContent}
          onBlur={() => e(item.id)} // 포커스 잃으면 수정 완료
        />
      ) : (
        <TouchableOpacity onPress={() => handleTodoPress(item)}>
          <Text style={styles.todoContent}>{item.content}</Text>
        </TouchableOpacity>
      )}

      <View
        style={{
          position: "absolute",
          justifyContent: "flex-end",
          alignItems: "center",
          right: 250,
        }}
      >
        <Text style={styles.todoType}>({item.type})</Text>
        <TouchableOpacity onPress={() => handleDeleteTodo(item.id)}>
          <Text style={styles.deleteButton}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <NavBar currentDate={currentDate} setCurrentDate={setCurrentDate} />

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

        {/* <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        > */}
        <ScrollView contentContainerStyle={styles.modalScrollViewContent}>
          {/* ScrollView contentContainerStyle 추가 */}
          <View style={styles.modalContent}>
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
          </View>
        </ScrollView>
        {/* </KeyboardAvoidingView> */}
        <View style={styles.addTodoButtonContainer}>
          <TouchableOpacity style={styles.addTodoButton} onPress={addTodo}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  BodyContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5", // 연한 배경색
    borderRadius: 10, // 모서리를 둥글게
    margin: 10, // 외부 여백
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

    backgroundColor: "#008d62",
    bottom: 119,
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
  modalScrollViewContent: {
    flexGrow: 1, // ScrollView 내용이 남는 공간을 모두 차지하도록 설정
    justifyContent: "space-between", // 내용을 위아래로 정렬
  },
  addTodoButtonContainer: {
    position: "absolute", // addTodoButton을 Modal 내부에 절대 위치로 배치
    bottom: 20, // 하단 여백
    right: 20, // 오른쪽 여백
  },
  addTodoButton: {
    position: "absolute",
    bottom: 25,
    right: 10,
    backgroundColor: "#008d62",
    width: 60,
    height: 60,
    borderRadius: 10,
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    paddingBottom: 80,
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
  todoContentInput: {
    flex: 1, // 남은 공간을 모두 차지하도록 설정
    marginLeft: 10, // 체크박스와의 간격
    fontSize: 16,
    paddingVertical: 5, // 세로 패딩 추가 (선택 사항)
    borderWidth: 1, // 밑줄 추가
    padding: 10,
    borderBottomColor: "#008d62", // 밑줄 색상
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  todoTypePicker: {
    position: "absolute",
    height: 0,
    width: "100%",
    marginRight: 20,
  },
  typeButtonsContainer: {
    flexDirection: "row", // 가로 배치로 변경
    justifyContent: "space-around",
    marginBottom: 20,
  },
  typeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 5,
  },
  typeButtonText: {
    fontSize: 16,
    color: "black", // 기본 텍스트 색상
  },
  selectedTypeButton: {
    backgroundColor: "#008d62",
  },
  pressedTypeButton: {
    // 버튼이 눌렸을 때 스타일
    opacity: 0.7, // 투명도 조절
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
    right: 300,
    fontSize: 14,
    color: "black",
  },
  todoType: {
    fontSize: 12,
    color: "gray",
  },
  deleteButton: {
    fontSize: 15,
  },
});

export default MainToDoScreen;
