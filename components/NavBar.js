import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const NavBar = ({ currentDate, setCurrentDate }) => {
  const formatDate = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  const handlePreviousDay = () => {
    const previousDay = new Date(currentDate);
    previousDay.setDate(currentDate.getDate() - 1);
    setCurrentDate(previousDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDay);
  };

  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={handlePreviousDay}>
        <Text style={styles.switchDateBtn}>{"◀"}</Text>
      </TouchableOpacity>
      <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
      <TouchableOpacity onPress={handleNextDay}>
        <Text style={styles.switchDateBtn}>{"▶"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomWidth: 1.5, // 경계선 두께
    borderBottomColor: "#ccc", // 경계선 색상
  },
  switchDateBtn: {
    color: "#684c38", // 색상 변경
    fontSize: 30,
  },
  dateText: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "darkgrey",
    fontSize: 20,
    backgroundColor: "#8c6b52",
    color: "white",
    borderRadius: 35,
    width: 70,
    height: 70,
    textAlign: "center",
    lineHeight: 70, // Ensures the text is centered vertically
    overflow: "hidden",
  },
});

export default NavBar;
