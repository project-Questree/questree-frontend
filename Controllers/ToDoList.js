// TodoList.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

function TodoList({ todos, setTodos, currentDate }) {
  const [newTodo, setNewTodo] = useState("");

  // Todo를 추가하는 함수
  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos((prevTodos) => ({
        ...prevTodos,
        [currentDate.toDateString()]: [
          ...(prevTodos[currentDate.toDateString()] || []),
          newTodo,
        ],
      }));
      setNewTodo("");
    }
  };

  // Todo를 삭제하는 함수
  const deleteTodo = (index) => {
    setTodos((prevTodos) => ({
      ...prevTodos,
      [currentDate.toDateString()]: prevTodos[
        currentDate.toDateString()
      ].filter((_, i) => i !== index),
    }));
  };

  return (
    <View>
      {/* TodoList 표시 */}
      {todos &&
        todos.map((todo, index) => (
          <View key={index} style={styles.todoItem}>
            {/* Todo 텍스트 */}
            <TouchableOpacity onPress={() => console.log("Edit")}>
              <Text style={styles.todoText}>{todo}</Text>
            </TouchableOpacity>
            {/* 삭제 버튼 */}
            <TouchableOpacity onPress={() => deleteTodo(index)}>
              <Text style={styles.deleteButton}>x</Text>
            </TouchableOpacity>
          </View>
        ))}
      {/* 새로운 Todo 추가 입력 */}
    </View>
  );
}

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
  },
  deleteButton: {
    fontSize: 16,
    color: "red",
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default TodoList;
