import { commonStyles } from "@/styles/commonStyle";
import { Pressable, StyleSheet, Text } from "react-native";

type ScorePanelProps = {
  target: number;
  setTarget: (target: number) => void;
};

export default function SetScoreButton({ target, setTarget }: ScorePanelProps) {
  return (
    <Pressable
      onPress={() => setTarget(target)}
      style={[styles.score, commonStyles.glassPanel]}
    >
      <Text style={styles.scoreText}>{target}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  score: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    margin: 10,
  },
  scoreText: {
    fontSize: 25,
    color: "black",
  },
});
