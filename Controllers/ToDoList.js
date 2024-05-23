// TodoList.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Fontisto } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";

function TodoList({ todos, setTodos, currentDate }) {
  // Todo를 삭제하는 함수
  const deleteTodo = (index) => {
    setTodos((prevTodos) => ({
      ...prevTodos,
      [currentDate.toDateString()]: prevTodos[
        currentDate.toDateString()
      ].filter((_, i) => i !== index),
    }));
  };

  const toggleComplete = (index) => {
    setTodos((prevTodos) => {
      const todosForDate = prevTodos[currentDate.toDateString()] || [];
      todosForDate[index].completed = !todosForDate[index].completed;
      return {
        ...prevTodos,
        [currentDate.toDateString()]: [...todosForDate],
      };
    });
  };

  return (
    <View>
      {/* TodoList 표시 */}
      {todos &&
        todos.map((todo, index) => (
          <View key={index} style={styles.todoItem}>
            {/* 체크박스 */}
            <BouncyCheckbox
              style={styles.checkbox}
              size={16}
              fillColor="red"
              unfillColor="#FFFFFF"
              iconStyle={{ borderColor: "white" }}
              textStyle={{ fontFamily: "JosefinSans-Regular" }}
              isChecked={todo.completed}
              onPress={() => toggleComplete(index)}
            />
            {/* Todo 텍스트 */}
            <TouchableOpacity onPress={() => console.log("Edit")}>
              <Text
                style={[
                  styles.todoText,
                  todo.completed && styles.completedTodo,
                ]}
              >
                {todo.text}
              </Text>
            </TouchableOpacity>
            {/* 삭제 버튼 */}
            <TouchableOpacity onPress={() => deleteTodo(index)}>
              <Fontisto name="trash" size={17} color="darkgray" />
            </TouchableOpacity>
          </View>
        ))}
      {/* 새로운 Todo 추가 입력 */}
    </View>
  );
}

const styles = StyleSheet.create({
  todoItem: {
    backgroundColor: "rgba(52, 52, 52, 0.1)",
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
  },
  todoText: {
    fontSize: 16,
    fontWeight: "500",
  },

  completedTodo: {
    textDecorationLine: "line-through",
    color: "gray",
  },
});

export default TodoList;
