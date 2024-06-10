import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const CountField = ({ countData, onCountDataChange }) => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(
    countData.startDate ? new Date(countData.startDate) : null,
  );
  const [endDate, setEndDate] = useState(
    countData.endDate ? new Date(countData.endDate) : null,
  );

  const formatDate = (date) => {
    return format(date, "yyyy년 MM월 dd일 (E)", { locale: ko });
  };

  const handleStartDateConfirm = (date) => {
    setShowStartDatePicker(false);
    setStartDate(date); // Date 객체로 저장
    onCountDataChange({ ...countData, startDate: date }); // Date 객체 전달
  };

  const handleEndDateConfirm = (date) => {
    setShowEndDatePicker(false);
    setEndDate(date); // Date 객체로 저장
    onCountDataChange({ ...countData, endDate: date }); // Date 객체 전달
  };

  return (
    <View style={styles.container}>
      {/* Start Date */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>시작 날짜:</Text>
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
          <Text style={styles.dateButtonText}>
            {startDate ? formatDate(startDate) : "날짜 선택"}
          </Text>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={showStartDatePicker}
        textColor="black"
        mode="date"
        locale="ko-KR"
        onConfirm={handleStartDateConfirm}
        onCancel={() => setShowStartDatePicker(false)}
      />

      {/* End Date */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>종료 날짜:</Text>
        <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
          <Text style={styles.dateButtonText}>
            {endDate ? formatDate(endDate) : "날짜 선택"}
          </Text>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={showEndDatePicker}
        textColor="black"
        mode="date"
        locale="ko-KR"
        onConfirm={handleEndDateConfirm}
        onCancel={() => setShowEndDatePicker(false)}
      />

      {/* Intervals */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>간격 (일):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={countData.intervals.toString()}
          onChangeText={(text) =>
            onCountDataChange({
              ...countData,
              intervals: parseInt(text) || 0,
            })
          }
        />
      </View>

      {/* Repeat Count */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>반복 횟수:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={countData.repeatCount.toString()}
          onChangeText={(text) =>
            onCountDataChange({
              ...countData,
              repeatCount: parseInt(text) || 0,
            })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginBottom: 20,
  },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dateButtonText: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});

export default CountField;
