import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";

const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

const WeeklyField = ({
  targetedDays,
  resetDay,
  onTargetedDaysChange,
  onResetDayChange,
}) => {
  const toggleTargetedDay = (dayIndex) => {
    const newTargetedDays = [...targetedDays];
    const index = newTargetedDays.indexOf(dayIndex);
    if (index > -1) {
      newTargetedDays.splice(index, 1); // 이미 선택된 경우 제거
    } else {
      newTargetedDays.push(dayIndex); // 선택되지 않은 경우 추가
    }
    onTargetedDaysChange(newTargetedDays);
  };

  const getTargetedDaysString = () => {
    return daysOfWeek
      .map((_, index) => (targetedDays.includes(index) ? "1" : "0"))
      .join("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Targeted Days:</Text>
      <View style={styles.buttonContainer}>
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              targetedDays.includes(index) && styles.selectedButton,
            ]}
            onPress={() => toggleTargetedDay(index)}
          >
            <Text style={styles.buttonText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Reset Day:</Text>
      <View style={styles.buttonContainer}>
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              resetDay === index && styles.selectedButton, // resetDay 선택 스타일
            ]}
            onPress={() => onResetDayChange(index)}
          >
            <Text style={styles.buttonText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 추가된 부분: 현재 선택된 요일 문자열 표시 */}
      <Text>Selected Days: {getTargetedDaysString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "space-around",
  },

  WeeklyField: {
    marginTop: 150,
    marginBottom: 20,
  },
  targetedDayContainer: {
    marginBottom: 10,
  },
  resetDayContainer: {
    marginBottom: 10,
  },
  picker: {
    height: 0,
    width: "100%",
  },

  buttonText: {
    fontSize: 25,
  },
  selectedButton: {
    borderRadius: 5,
    backgroundColor: "#007AFF", // 선택된 버튼 배경색 (예시)
    borderColor: "#007AFF", // 선택된 버튼 테두리 색 (예시)
  },
});

export default WeeklyField;
