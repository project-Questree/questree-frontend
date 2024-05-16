import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
} from "react-native";

function todoScreen() {
  const [todoItem, setTodoItem] = useState("");
  const [todoList, setTodoList] = useState([]);

  const handleAddTodo = () => {
    if (todoItem.trim() !== "") {
      setTodoList([...todoList, todoItem]);
      setTodoItem("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new todo"
          value={todoItem}
          onChangeText={setTodoItem}
        />
        <Button title="Add" onPress={handleAddTodo} />
      </View>
      <FlatList
        data={todoList}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text>{item}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingLeft: 10,
    marginRight: 10,
  },
  todoItem: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default todoScreen;
