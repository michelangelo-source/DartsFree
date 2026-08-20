import { commonStyles } from "@/styles/commonStyle";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ScorePanelProps = {
  title: string;
  multiplier: number;
  handlePress: (value: number, multiplier: number) => void;
};

export const ScorePanel = ({
  multiplier,
  title,
  handlePress,
}: ScorePanelProps) => {
  return (
    <View style={styles.container}>
      <View style={[commonStyles.glassPanel, styles.titleRow]}>
        <Text style={commonStyles.text}>{title}</Text>
      </View>
      <View style={commonStyles.row}>
        <View style={styles.column}>
          {Array.from({ length: 10 }, (_, i) => {
            return (
              <Pressable onPress={() => handlePress(i + 1, multiplier)} key={i}>
                <View style={[commonStyles.glassPanel, styles.scoreBtn]}>
                  <Text>{i + 1}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.column}>
          {Array.from({ length: 10 }, (_, i) => {
            return (
              <Pressable
                onPress={() => handlePress(i + 11, multiplier)}
                key={i + 10}
              >
                <View style={[commonStyles.glassPanel, styles.scoreBtn]}>
                  <Text>{i + 11}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "33.333%",
    justifyContent: "center",
    alignItems: "center",
  },
  column: {
    flex: 1,
  },
  titleRow: {
    width: "100%",
    borderRadius: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreBtn: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
    height: 40,
  },
});
