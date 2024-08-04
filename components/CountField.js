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
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartDatePicker(true)}
        >
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
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndDatePicker(true)}
        >
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
          placeholder="1 이상의 숫자 입력"
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
          placeholder="숫자 입력"
        />
      </View>

      {/* 반복 정보 표시 */}
      <View style={styles.repeatInfoContainer}>
        <Text style={styles.repeatInfoText}>
          {countData.intervals}일 동안 {countData.repeatCount}번 반복하기
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  dateButton: {
    flex: 2,
    backgroundColor: "#e0f7fa",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    flex: 2,
    height: 40,
    marginLeft: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  repeatInfoContainer: {
    marginTop: 10,
    backgroundColor: "#e0f7fa",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#b2ebf2",
    alignItems: "center",
  },
  repeatInfoText: {
    fontSize: 16,
    color: "#00796b",
  },
});

export default CountField;
