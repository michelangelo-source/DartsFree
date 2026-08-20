import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  glassPanel: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 10,
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.15)",
  },
  row: {
    flexDirection: "row",
  },
  title: {
    fontSize: 40,
  },
  subTitle: {
    fontSize: 32,
  },
  text: {
    fontSize: 25,
  },
});
