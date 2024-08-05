import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import RNPickerSelect from "react-native-picker-select";

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

  const generatePickerItems = (max) => {
    const items = [];
    for (let i = 1; i <= max; i++) {
      items.push({ label: `${i}`, value: i });
    }
    return items;
  };

  return (
    <View style={styles.container}>
      {/* Start Date */}
      <View style={styles.fieldContainer}>
        <Text style={styles.dateLabel}>시작 날짜</Text>
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
        <Text style={styles.dateLabel}>종료 날짜</Text>
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

      {/* Intervals and Repeat Count */}
      <View style={styles.pickerContainer}>
        <View style={styles.pickerWrapper}>
          <RNPickerSelect
            onValueChange={(value) =>
              onCountDataChange({ ...countData, intervals: value })
            }
            items={generatePickerItems(30)}
            placeholder={{ label: "-", value: null }}
            style={pickerSelectStyles}
          />
          <Text style={styles.pickerLabel}>일 동안</Text>
          <RNPickerSelect
            onValueChange={(value) =>
              onCountDataChange({ ...countData, repeatCount: value })
            }
            items={generatePickerItems(30)}
            placeholder={{ label: "-", value: null }}
            style={pickerSelectStyles}
          />
          <Text style={styles.pickerLabel}>번 반복하기</Text>
        </View>
      </View>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#66baa0",
    borderRadius: 5,
    color: "white",
    backgroundColor: "#66baa0",
    textAlign: "center",
    paddingRight: 15, // Ensures text is never behind the icon
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 2,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#66baa0",
    borderRadius: 5,
    color: "white",
    backgroundColor: "#66baa0",
    textAlign: "center",
    paddingRight: 15, // Ensures text is never behind the icon
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 2,
    elevation: 2,
  },
  placeholder: {
    color: "white",
  },
});

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
  dateLabel: {
    color: "#545454",
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
  },
  dateButton: {
    flex: 2,
    backgroundColor: "#66baa0",
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
    color: "white",
  },
  pickerContainer: {
    marginTop: 10,
    backgroundColor: "#f9f9f9",
    padding: 10,
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#d3d3d3",
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  pickerLabel: {
    marginHorizontal: 5,
    fontSize: 16,
    color: "#545454",
  },
});

export default CountField;
