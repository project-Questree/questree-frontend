import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

const WeeklyField = ({ targetedDays, onTargetedDaysChange }) => {
  const [selectedDaysString, setSelectedDaysString] = useState(targetedDays);

  useEffect(() => {
    setSelectedDaysString(String(targetedDays));
  }, [targetedDays]);

  const toggleTargetedDay = (dayIndex) => {
    const newSelectedDaysString = selectedDaysString
      .split("")
      .map((char, index) =>
        index === dayIndex ? (char === "1" ? "0" : "1") : char,
      )
      .join("");
    setSelectedDaysString(newSelectedDaysString);
    onTargetedDaysChange(newSelectedDaysString);
  };

  useEffect(() => {
    // selectedDaysString 상태가 변경될 때마다 UI 업데이트
  }, [selectedDaysString]);

  return (
    <View style={styles.weeklyContainer}>
      <Text style={styles.label}>반복 요일 선택:</Text>
      <View style={styles.buttonContainer}>
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              selectedDaysString[index] === "1" && styles.selectedButton,
            ]}
            onPress={() => toggleTargetedDay(index)}
          >
            <Text
              style={[
                styles.buttonText,
                selectedDaysString[index] === "1" && styles.selectedButtonText,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  weeklyContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
    width: 40,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#008d62",
    borderColor: "#008d62",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
  selectedButtonText: {
    color: "#fff",
  },
});

export default WeeklyField;
