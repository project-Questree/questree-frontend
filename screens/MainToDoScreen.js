// MainToDoScreen.js

import React, { useState } from "react";
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
import TodoList from "../Controllers/ToDoList";

function MainToDoScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [todoLists, setTodoLists] = useState({});
  const [newTodo, setNewTodo] = useState("");
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
      setTodoLists({
        ...todoLists,
        [currentDate.toDateString()]: [
          ...(todoLists[currentDate.toDateString()] || []),
          newTodo,
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
          <Text style={styles.switchDateBtn}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
        <TouchableOpacity onPress={handleNextDay}>
          <Text style={styles.switchDateBtn}>{">"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.todoList}>
        <TodoList
          todos={todoLists[currentDate.toDateString()]}
          setTodos={setTodoLists}
          currentDate={currentDate}
        />
      </View>
      {/* 추가 버튼 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
      {/* 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
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
              style={styles.input}
              value={newTodo}
              onChangeText={setNewTodo}
              placeholder="Add a new todo"
              autoFocus={true}
            />
            <TouchableOpacity style={styles.addButton} onPress={addTodo}>
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
    backgroundColor: "off-white",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  switchDateBtn: {
    fontSize: 30,
  },
  dateText: {
    fontSize: 20,
  },
  todoList: {
    flex: 1,
    padding: 20,
  },
  addButton: {
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: 200,
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addTodoButton: {
    backgroundColor: "blue",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
  },
});

export default MainToDoScreen;
