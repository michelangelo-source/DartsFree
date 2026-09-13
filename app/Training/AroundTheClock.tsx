import { FinishedTrainingModal } from "@/components/Modals/FinishedTrainingModal";
import { commonStyles } from "@/styles/commonStyle";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const AroundTheClock = () => {
  const [hit, setHit] = useState(0);
  const [mis, setMis] = useState(0);
  const percentage = mis > 0 ? Math.round((hit / mis) * 100) : 0;
  const handleShoot = (isHit: boolean) => {
    if (isHit) setHit((prev) => prev + 1);
    setMis((prev) => prev + 1);
  };
  const resetTraining = () => {
    setHit(0);
    setMis(0);
  };
  return (
    <View style={styles.container}>
      <View style={[commonStyles.glassPanel, styles.titlePanel]}>
        <Text style={commonStyles.subTitle}>Around The Clock</Text>
      </View>

      <View style={[commonStyles.glassPanel, styles.targetPanel]}>
        <Text style={commonStyles.text}>Aim for:</Text>
        <Text style={styles.targetNumber}>{hit + 1 < 20 ? hit + 1 : 20}</Text>
      </View>

      <View style={[commonStyles.glassPanel, styles.scorePanel]}>
        <Text style={commonStyles.text}>
          {hit}/{mis} ({percentage}%)
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          style={[commonStyles.glassPanel, styles.button]}
          onPress={() => {
            handleShoot(true);
          }}
        >
          <Text style={commonStyles.text}>HIT</Text>
        </Pressable>
        <Pressable
          style={[commonStyles.glassPanel, styles.button]}
          onPress={() => {
            handleShoot(false);
          }}
        >
          <Text style={commonStyles.text}>MISS</Text>
        </Pressable>
      </View>
      <FinishedTrainingModal
        open={hit + 1 > 20}
        result={`${hit}/${mis} (${percentage}%)`}
        resetTraining={resetTraining}
      />
    </View>
  );
};
export default AroundTheClock;

const styles = StyleSheet.create({
  container: {
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
    fontSize: 120,
  },
  scorePanel: {
    paddingHorizontal: 30,
    paddingVertical: 10,
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
