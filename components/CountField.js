import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const CountField = ({ countData, onCountDataChange }) => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleStartDateConfirm = (date) => {
    setShowStartDatePicker(false);
    onCountDataChange({
      ...countData,
      startDate: date ? date.toISOString().slice(0, 10) : "",
    });
  };

  const handleEndDateConfirm = (date) => {
    setShowEndDatePicker(false);
    onCountDataChange({
      ...countData,
      endDate: date ? date.toISOString().slice(0, 10) : "",
    });
  };

  return (
    <View style={styles.container}>
      {/* Start Date */}
      <Text style={styles.label}>Start Date:</Text>
      <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
        <Text>{countData.startDate || "Select Date"}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={showStartDatePicker}
        mode="date"
        onConfirm={handleStartDateConfirm}
        onCancel={() => setShowStartDatePicker(false)}
      />

      {/* End Date */}
      <Text style={styles.label}>End Date:</Text>
      <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
        <Text>{countData.endDate || "Select Date"}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={showEndDatePicker}
        mode="date"
        onConfirm={handleEndDateConfirm}
        onCancel={() => setShowEndDatePicker(false)}
      />

      {/* Intervals */}
      <Text style={styles.label}>Intervals (days):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={countData.intervals.toString()}
        onChangeText={(text) =>
          onCountDataChange({
            ...countData,
            intervals: parseInt(text) || 0, // 숫자 변환 및 기본값 0 설정
          })
        }
      />

      {/* Repeat Count */}
      <Text style={styles.label}>Repeat Count:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={countData.repeatCount.toString()}
        onChangeText={(text) =>
          onCountDataChange({
            ...countData,
            repeatCount: parseInt(text) || 0, // 숫자 변환 및 기본값 0 설정
          })
        }
      />
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
