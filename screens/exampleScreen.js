import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function ExampleScreen() {
  const [todoData, setTodoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

        if (!response.ok) {
          throw new Error("Failed to fetch todo lists");
        }

        const data = await response.json();
        setTodoData(data); // API 응답 데이터를 상태에 저장
      } catch (error) {
        setError(error.message);
        console.error("Error fetching todo lists:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : (
          <View>
            <Text style={styles.title}>API Response:</Text>
            <Text>{JSON.stringify(todoData, null, 2)}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
  },
});

export default ExampleScreen;
