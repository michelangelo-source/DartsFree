import { commonStyles } from "@/styles/commonStyle";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type RandomThrowsGameProps = {
  targets: string[];
  onFinish: (hits: number, total: number) => void;
};

export const RandomThrowsGame = ({
  targets,
  onFinish,
}: RandomThrowsGameProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hits, setHits] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);

  const currentTarget = targets[currentIndex];
  const percentage =
    totalAttempted > 0 ? Math.round((hits / totalAttempted) * 100) : 0;
  const remaining = targets.length - totalAttempted;

  const handleHit = () => {
    const newHits = hits + 1;
    const newTotal = totalAttempted + 1;
    setHits(newHits);
    setTotalAttempted(newTotal);
    if (newTotal >= targets.length) {
      onFinish(newHits, newTotal);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleMiss = () => {
    const newTotal = totalAttempted + 1;
    setTotalAttempted(newTotal);
    if (newTotal >= targets.length) {
      onFinish(hits, newTotal);
    }
  };

  return (
    <View style={styles.gameContainer}>
      <View style={[commonStyles.glassPanel, styles.titlePanel]}>
        <Text style={commonStyles.subTitle}>Random</Text>
      </View>

      <View style={[commonStyles.glassPanel, styles.targetPanel]}>
        <Text style={commonStyles.text}>Aim for:</Text>
        <Text style={styles.targetNumber}>{currentTarget}</Text>
      </View>

      <View style={[commonStyles.glassPanel, styles.scorePanel]}>
        <Text style={commonStyles.text}>
          {hits}/{totalAttempted} ({percentage}%)
        </Text>
      </View>

      <View style={[commonStyles.glassPanel, styles.remainingPanel]}>
        <Text style={styles.remainingText}>{remaining} left</Text>
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          style={[commonStyles.glassPanel, styles.button]}
          onPress={handleHit}
        >
          <Text style={commonStyles.text}>HIT</Text>
        </Pressable>
        <Pressable
          style={[commonStyles.glassPanel, styles.button]}
          onPress={handleMiss}
        >
          <Text style={commonStyles.text}>MISS</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  titlePanel: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginBottom: 10,
  },
  targetPanel: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    alignItems: "center",
  },
  targetNumber: {
    fontSize: 100,
  },
  scorePanel: {
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  remainingPanel: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  remainingText: {
    fontSize: 16,
    color: "#666",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 20,
    width: "90%",
  },
  button: {
    flex: 1,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
});
