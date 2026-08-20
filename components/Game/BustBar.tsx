import { commonStyles } from "@/styles/commonStyle";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

export const BustBar = () => {
  const { width: screenWidth } = useWindowDimensions();
  return (
    <View
      style={[
        {
          width: screenWidth - 20,
        },
        styles.bar,
      ]}
    >
      <Text style={[styles.text, commonStyles.subTitle]}>BUST</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  bar: {
    margin: 10,
    height: 50,
    position: "absolute",
    left: 0,
    zIndex: 100,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(224, 224, 224, 0.95)",
  },
  text: {
    color: "rgb(92, 89, 89) ",
  },
});
