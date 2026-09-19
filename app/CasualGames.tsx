import { ManagePlayers } from "@/components/SetupGame/ManagePlayers";
import { ManageScore } from "@/components/SetupGame/ManageScore";
import { useGameStore } from "@/store/GameStore";
import { commonStyles } from "@/styles/commonStyle";
import { Link } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const CasualGames = () => {
  const {
    target,
    setTarget,
    players,
    addPlayer,
    deletePlayer,
    lastDartMultiplier,
    setLastDartMultiplier,
    quitGame,
  } = useGameStore();

  useEffect(() => {
    return () => {
      quitGame();
    };
  }, [quitGame]);

  return (
    <View style={styles.container}>
      <Text style={commonStyles.title}>Game Setup</Text>
      <ManageScore
        lastDartMultiplier={lastDartMultiplier}
        setLastDartMultiplier={setLastDartMultiplier}
        target={target}
        setTarget={setTarget}
      />

      <ManagePlayers
        players={players}
        addPlayer={addPlayer}
        deletePlayer={deletePlayer}
      />
      <Link href={"/Game"} disabled={players.length < 2 || target < lastDartMultiplier} asChild>
        <Pressable
          disabled={players.length < 2 || target < lastDartMultiplier}
          testID="start-button"
          style={StyleSheet.flatten([
            players.length < 2 || target < lastDartMultiplier ? commonStyles.disabledButton : commonStyles.primaryButton,
            styles.startGameBtn,
            commonStyles.glassPanel,
          ])}
        >
          <Text style={commonStyles.text}>Start</Text>
        </Pressable>
      </Link>
    </View>
  );
};
export default CasualGames;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  startGameBtn: {
    height: 50,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
});
