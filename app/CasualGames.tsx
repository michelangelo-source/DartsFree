import { ManagePlayers } from "@/components/SetupGame/ManagePlayers";
import { ManageScore } from "@/components/SetupGame/ManageScore";
import { useGameStore } from "@/store/GameStore";
import { commonStyles } from "@/styles/commonStyle";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";

const CasualGames = () => {
  const {
    target,
    setTarget,
    players,
    addPlayer,
    deletePlayer,
    lastDartMultiplier,
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
        target={target}
        setTarget={setTarget}
      />

      <ManagePlayers
        players={players}
        addPlayer={addPlayer}
        deletePlayer={deletePlayer}
      />
      <Link href={"/Game"} disabled={players.length < 2} asChild>
        <Pressable
          testID="start-button"
          style={StyleSheet.flatten([
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
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
});
