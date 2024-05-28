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

import AsyncStorage from "@react-native-async-storage/async-storage";
import TodoList from "../Controllers/ToDoList";

function MainToDoScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newTodo, setNewTodo] = useState("");
  const [todoLists, setTodoLists] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

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

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      //trim : 앞뒤 공백 제거
      setTodoLists({
        ...todoLists,
        [currentDate.toDateString()]: [
          ...(todoLists[currentDate.toDateString()] || []),
          { text: newTodo, completed: false },
        ],
      });
      setNewTodo("");
      setModalVisible(false);
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
        style={styles.floatingPlusButton}
        onPress={() => setModalVisible(true)}
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
        }}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>해야 할 일을 입력하세요.</Text>
            <TextInput
              style={styles.AddTodoinput}
              value={newTodo}
              onChangeText={setNewTodo}
              placeholder="Add a new todo"
              autoFocus={true}
            />

            <TouchableOpacity style={styles.addTodoButton} onPress={addTodo}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
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
    color: "#fff",
    fontSize: 30,
  },
  modalContainer: {
    flex: 2,
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
});

export default MainToDoScreen;
