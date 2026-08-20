import { SingleScore } from "@/store/GameStore";
import { commonStyles } from "@/styles/commonStyle";
import { StyleSheet, Text, View } from "react-native";

export const ScorePreviewPanel = ({ score }: { score: SingleScore }) => {
  return (
    <View style={[styles.container, commonStyles.glassPanel]}>
      <Text style={commonStyles.text}> {score ?? "-"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 50,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
