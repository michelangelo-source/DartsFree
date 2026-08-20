import { BustBar } from "@/components/Game/BustBar";
import { FinishedGameModal } from "@/components/Game/FinishedGameModal";
import { NonStandardScorePanel } from "@/components/Game/NonStandardScorePanel";
import { PlayerCard } from "@/components/Game/PlayerCard";
import { ScorePanel } from "@/components/Game/ScorePanel";
import { ScorePreviewPanel } from "@/components/Game/ScorePreviewPanel";
import { useGame } from "@/hooks/useGame";
import { commonStyles } from "@/styles/commonStyle";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const Game = () => {
  const {
    target,
    currentPlayer,
    currentPlayerIndex,
    players,
    playersListRef,
    currentThrows,
    bust,
    isTurnOver,
    finished,
    classicScore,
    addScore,
    setCurrentPlayerIndex,
    undoLastThrow,
    nextPlayer,
    setFinished,
  } = useGame();

  return (
    <View>
      <FlatList
        data={players}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        keyExtractor={(item) => item.name}
        ref={playersListRef}
        renderItem={({ item: player, index }) => (
          <PlayerCard
            target={target}
            isCurrentPlayer={currentPlayerIndex === index}
            player={player}
          />
        )}
      />
      <View style={{ flexDirection: "row", position: "relative" }}>
        {bust && <BustBar />}
        <ScorePreviewPanel score={currentThrows.firstThrow} />
        <ScorePreviewPanel score={currentThrows.secondThrow} />
        <ScorePreviewPanel score={currentThrows.thirdThrow} />
      </View>
      <NonStandardScorePanel classicScore={classicScore} addScore={addScore} />

      <View style={styles.scorePanelContainer}>
        <ScorePanel multiplier={1} handlePress={addScore} title={"S-"} />
        <ScorePanel multiplier={2} handlePress={addScore} title={"D-"} />
        <ScorePanel multiplier={3} handlePress={addScore} title={"T-"} />
      </View>
      <View style={styles.undoNextPlayerContainer}>
        <Pressable
          onPress={undoLastThrow}
          style={[styles.score, commonStyles.glassPanel]}
        >
          <Text>Undo last throw</Text>
        </Pressable>
        {/* add some animation when isTurnOver */}
        <Pressable
          onPress={nextPlayer}
          style={[
            styles.score,
            commonStyles.glassPanel,
            isTurnOver && styles.nextPlayerReady,
          ]}
        >
          <Text>Next Player</Text>
        </Pressable>
      </View>
      <FinishedGameModal
        open={finished}
        setOpen={setFinished}
        resetOrder={() => setCurrentPlayerIndex(0)}
        winner={currentPlayer}
      />
    </View>
  );
};
export default Game;

const styles = StyleSheet.create({
  score: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    margin: 10,
  },

  nonStandardButtons: {
    height: 50,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  scorePanelContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  undoNextPlayerContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  nextPlayerReady: {
    borderColor: "green",
    borderWidth: 2,
  },
});
