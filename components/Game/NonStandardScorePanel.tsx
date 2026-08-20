import { SingleScore } from "@/store/GameStore";
import { commonStyles } from "@/styles/commonStyle";
import { Pressable, StyleSheet, Text, View } from "react-native";

type NonStandardScorePanelProps = {
  classicScore: () => void;
  addScore: (score: SingleScore, multiuplier: number) => void;
};

export const NonStandardScorePanel = ({
  classicScore,
  addScore,
}: NonStandardScorePanelProps) => {
  return (
    <View style={commonStyles.row}>
      <Pressable
        style={styles.pressableNonStandardButtons}
        onPress={() => addScore("MISS", 1)}
      >
        <View style={[commonStyles.glassPanel, styles.nonStandardButtons]}>
          <Text>MISS</Text>
        </View>
      </Pressable>
      <Pressable
        style={styles.pressableNonStandardButtons}
        onPress={classicScore}
      >
        <View style={[commonStyles.glassPanel, styles.nonStandardButtons]}>
          <Text>26</Text>
        </View>
      </Pressable>
      <Pressable
        style={styles.pressableNonStandardButtons}
        onPress={() => addScore(25, 1)}
      >
        <View style={[commonStyles.glassPanel, styles.nonStandardButtons]}>
          <Text>25</Text>
        </View>
      </Pressable>
      <Pressable
        style={styles.pressableNonStandardButtons}
        onPress={() => addScore(25, 2)}
      >
        <View style={[commonStyles.glassPanel, styles.nonStandardButtons]}>
          <Text>50</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  pressableNonStandardButtons: {
    width: "25%",
  },

  nonStandardButtons: {
    height: 50,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
