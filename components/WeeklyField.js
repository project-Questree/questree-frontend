import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

const WeeklyField = ({
  targetedDays,
  resetDay,
  onTargetedDaysChange,
  onResetDayChange,
}) => {
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
    <View style={styles.WeeklyContainer}>
      <Text style={styles.label}>Targeted Days:</Text>
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
    backgroundColor: "#008d62", // 선택된 버튼 배경색 (예시)
    borderColor: "#008d62", // 선택된 버튼 테두리 색 (예시)
  },
});

export default WeeklyField;
