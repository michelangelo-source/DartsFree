import { commonStyles } from "@/styles/commonStyle";
import { useAudioPlayer } from "expo-audio";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type RandomThrowsGameProps = {
  currentTarget: string;
  totalThrows: number;
  onNext: () => void;
  onFinish: (hits: number, total: number) => void;
};

export const RandomThrowsGame = ({
  currentTarget,
  totalThrows,
  onNext,
  onFinish,
}: RandomThrowsGameProps) => {
  const [hits, setHits] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);

  const scorePlayer = useAudioPlayer(require("@/assets/sounds/ScoreSound.mp3"));
  const missPlayer = useAudioPlayer(require("@/assets/sounds/MissSound.mp3"));

  const percentage =
    totalAttempted > 0 ? Math.round((hits / totalAttempted) * 100) : 0;
  const remaining = totalThrows - totalAttempted;

  const handleHit = () => {
    scorePlayer.seekTo(0);
    scorePlayer.play();
    const newHits = hits + 1;
    const newTotal = totalAttempted + 1;
    setHits(newHits);
    setTotalAttempted(newTotal);
    if (newTotal >= totalThrows) {
      onFinish(newHits, newTotal);
    } else {
      onNext();
    }
  };

  const handleMiss = () => {
    missPlayer.seekTo(0);
    missPlayer.play();
    const newTotal = totalAttempted + 1;
    setTotalAttempted(newTotal);
    if (newTotal >= totalThrows) {
      onFinish(hits, newTotal);
    } else {
      onNext();
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
