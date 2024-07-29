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

      // API 응답에서 notOperatedPlans 와 histories 배열을 합쳐 todoLists 에 저장
      const TodoLists = [
        ...(data.notOperatedPlans || []).map((item) => ({
          ...item,
          isChecked: false,
        })),
        ...(data.histories || []).map((item) => ({ ...item, isChecked: true })),
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
        targetedDays: null,
        startDate: null,
        endDate: null,
        intervals: null,
        repeatCount: null,
      };

      if (todoType === "WEEKLY") {
        newTodoItem.targetedDays = targetedDays;
        // WEEKLY 타입 유효성 검사
        if (targetedDays === "0000000") {
          Alert.alert("Error", "요일을 선택해주세요.");
          return;
        }
      } else if (todoType === "COUNT") {
        newTodoItem.startDate = countData.startDate?.toISOString().slice(0, 10);
        newTodoItem.endDate = countData.endDate?.toISOString().slice(0, 10);
        newTodoItem.intervals = countData.intervals;
        newTodoItem.repeatCount = countData.repeatCount;
        // COUNT 타입 유효성 검사
        if (!countData.startDate || !countData.endDate) {
          Alert.alert("Error", "시작 날짜와 종료 날짜를 선택해주세요.");
          return;
        } else if (countData.intervals <= 0) {
          Alert.alert("Error", "간격은 1 이상이어야 합니다.");
          return;
        } else if (countData.repeatCount > countData.intervals) {
          Alert.alert("Error", "간격보다 반복 횟수가 많을 수 없습니다.");
          return;
        }
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

  const handleDeleteTodo = (todoId, isChecked) => {
    let alertMessage = "";
    let apiEndpoint = "";
    let apiMethod = "DELETE";

    if (isChecked) {
      // Check된 histories일 경우
      alertMessage = "히스토리가 삭제됩니다. 진행하시겠습니까?";
      apiEndpoint = `https://api.questree.lesh.kr/plans/deleteOne/${todoId}`;
    } else {
      // notOperatedPlans일 경우
      alertMessage = "해당 루틴이 삭제됩니다. 진행하시겠습니까?";
      apiEndpoint = `https://api.questree.lesh.kr/plans/deleteAll/${todoId}`;
    }
    console.log(
      "handleDeleteTodo called with todoId : ",
      todoId,
      "isChecked : ",
      isChecked,
      "apiEndpoint : ",
      apiEndpoint,
    ); // 로그 추가

    Alert.alert(
      "삭제 확인",
      alertMessage,
      [
        {
          text: "확인",
          onPress: async () => {
            console.log(
              "확인 pressed, calling callDeleteApi with",
              apiEndpoint,
            ); // 로그 추가
            await callDeleteApi(apiEndpoint, apiMethod, todoId);
          },
        },
        { text: "취소", style: "cancel" },
      ],
      { cancelable: true },
    );
  };
  const callDeleteApi = async (apiEndpoint, apiMethod, todoId) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      const response = await fetch(apiEndpoint, {
        method: apiMethod,
        headers: {
          Authorization: accessToken,
          "X-Refresh-Token": refreshToken,
        },
      });

      if (!response.ok) {
        console.log(`Error: ${response.status} ${response.statusText}`);
        let errorMessage = "Failed to delete todo.";
        if (response.status === 400) {
          errorMessage =
            "Bad Request (400): The server could not understand the request.";
        } else if (response.status === 404) {
          errorMessage =
            "Not Found (404): The requested resource could not be found.";
        } else if (response.status === 500) {
          errorMessage =
            "Internal Server Error (500): There was an error on the server.";
        }
        throw new Error(errorMessage);
      }

      // 삭제 성공 시 todoLists 상태 업데이트
      setTodoLists((prevTodoLists) =>
        prevTodoLists.filter((todo) => todo.id !== todoId),
      );
      console.log("삭제 성공하였습니다.");
    } catch (error) {
      console.error("Error deleting todo:", error);
      Alert.alert("Error", "Failed to delete todo.");
    }
  };

  const handleCheckboxPress = async (item) => {
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
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      // 상태 업데이트 시 배열의 순서를 유지
      setTodoLists((prevTodoLists) =>
        prevTodoLists.map((todo) =>
          todo.id === item.id ? { ...todo, isChecked: !todo.isChecked } : todo,
        ),
      );
    } catch (error) {
      console.error("Error updating todo:", error);
      // 에러 처리 (예: 사용자에게 알림)
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <BouncyCheckbox
        style={styles.checkbox}
        size={20}
        fillColor="#008d62"
        unfillColor="#FFFFFF"
        iconStyle={{ borderColor: "white" }}
        textStyle={{ fontFamily: "JosefinSans-Regular" }}
        isChecked={item.isChecked}
        onPress={() => handleCheckboxPress(item)}
      />
      <View style={styles.todoContentContainer}>
        {updatingTodoId === item.id ? (
          <TextInput
            style={styles.todoContentInput}
            value={updatedTodoContent}
            onChangeText={setUpdatedTodoContent}
            onBlur={() => e(item.id)}
            multiline={true} // 여러 줄 입력 가능하도록 설정
          />
        ) : (
          <TouchableOpacity onPress={() => handleTodoPress(item)}>
            <Text
              style={[
                styles.todoContent,
                item.isChecked && styles.todoContentChecked,
              ]}
            >
              {item.content}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.todoActions}>
        <Text style={styles.todoType}>({item.type})</Text>
        <TouchableOpacity
          style={styles.deleteButtonContainer}
          onPress={() => {
            console.log("Delete button pressed");
            handleDeleteTodo(item.id, item.isChecked);
          }}
        >
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

        <ScrollView contentContainerStyle={styles.modalScrollViewContent}>
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
                onTargetedDaysChange={setTargetedDays}
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
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  checkbox: {
    marginRight: 5,
  },
  todoContentContainer: {
    flex: 1,
    marginRight: 10,
    flexDirection: "row",
    flexWrap: "wrap", // 텍스트를 여러 줄로 표시하기 위한 스타일
  },
  todoContentInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
    borderWidth: 1,
    padding: 10,
    borderBottomColor: "#008d62",
  },
  todoContent: {
    fontSize: 14,
    marginTop: 10,
    color: "black",
    flexWrap: "wrap", // 텍스트를 여러 줄로 표시하기 위한 스타일
    flex: 1,
    width: "100%",
  },
  todoContentInput: {
    flex: 1, // 남은 공간을 모두 차지하도록 설정
    marginLeft: 10, // 체크박스와의 간격
    fontSize: 16,
    paddingVertical: 5, // 세로 패딩 추가 (선택 사항)
    borderWidth: 1, // 밑줄 추가
    padding: 10,
    borderBottomColor: "#008d62", // 밑줄 색상
    width: "100%",
  },
  todoActions: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  todoType: {
    fontSize: 12,
    color: "gray",
    marginRight: 10,
  },
  deleteButtonContainer: {
    padding: 10, // 터치 영역을 키우기 위해 패딩 추가
  },
  deleteButton: {
    fontSize: 15,
  },
  todoContentChecked: {
    fontSize: 14,
    marginTop: 10,
    color: "gray",
    textDecorationLine: "line-through", // 체크된 항목에 회색 줄을 긋기 위한 스타일
  },
});

export default MainToDoScreen;
