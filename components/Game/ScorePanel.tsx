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
  const getBtnColor = (index: number) => {
    return index % 2 === 0
      ? "rgba(255, 255, 255, 0.85)"
      : "rgba(215, 215, 215, 0.85)";
  };

  return (
    <View style={styles.container}>
      <View style={[commonStyles.glassPanel, styles.titleRow]}>
        <Text style={commonStyles.text}>{title}</Text>
      </View>
      <View style={[commonStyles.row, { flex: 1 }]}>
        <View style={styles.column}>
          {Array.from({ length: 10 }, (_, i) => {
            return (
              <Pressable
                onPress={() => handlePress(i + 1, multiplier)}
                key={i}
                style={{ flex: 1 }}
              >
                <View
                  style={[
                    commonStyles.glassPanel,
                    styles.scoreBtn,
                    { backgroundColor: getBtnColor(i) },
                  ]}
                >
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
                style={{ flex: 1 }}
              >
                <View
                  style={[
                    commonStyles.glassPanel,
                    styles.scoreBtn,
                    { backgroundColor: getBtnColor(i) },
                  ]}
                >
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
    flex: 1,
  },
  column: {
    flex: 1,
  },
  titleRow: {
    width: "100%",
    borderRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
  },
  scoreBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
  },
});
