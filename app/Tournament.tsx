import { ExitGameModal } from "@/components/Modals/ExitGameModal";
import { ManagePlayers } from "@/components/SetupGame/ManagePlayers";
import { ManageScore } from "@/components/SetupGame/ManageScore";
import { Bracket } from "@/components/Tournament/Bracket/Bracket";
import { useGameStore } from "@/store/GameStore";
import {
  TournamentMatch,
  useTournamentStore,
} from "@/store/Tournament/TournamentStore";
import { commonStyles } from "@/styles/commonStyle";
import { router } from "expo-router/build/global-state/router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedRef,
  useScrollOffset,
} from "react-native-reanimated";

const Tournament = () => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

  const scrollY = useScrollOffset(scrollViewRef);

  const {
    readyToStart,
    lastDartMultiplier,
    target,
    isStarted,
    tournamentParticipants,
    tournamentMatches,
    setTournamentTarget,
    startMatch,
    addTournamentParticipants,
    deleteTournamentParticipants,
    randomizeTournament,
    resetTournament,
    setLastDartMultiplier,
  } = useTournamentStore();

  const isTournamentFinished =
    tournamentMatches.length > 0 && tournamentMatches.at(-1)?.winner !== null;

  useEffect(() => {
    return () => {
      resetTournament();
      useGameStore.getState().quitGame();
    };
  }, [resetTournament]);

  const handleStart = (match?: TournamentMatch) => {
    startMatch(match);
    router.navigate("/Game");
  };

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={commonStyles.title}>Tournament</Text>
      {!isStarted && (
        <>
          <ManageScore
            lastDartMultiplier={lastDartMultiplier}
            setLastDartMultiplier={setLastDartMultiplier}
            target={target}
            setTarget={setTournamentTarget}
          />

          <ManagePlayers
            players={tournamentParticipants}
            addPlayer={addTournamentParticipants}
            deletePlayer={deleteTournamentParticipants}
            horizontalPlayerList
          />
        </>
      )}

      <View style={[commonStyles.row, styles.btnContainer]}>
        {!isStarted && (
          <Pressable
            disabled={tournamentParticipants.length < 2 || target < lastDartMultiplier}
            onPress={() => {
              randomizeTournament();
            }}
            style={[
              tournamentParticipants.length < 2 || target < lastDartMultiplier ? commonStyles.disabledButton : commonStyles.primaryButton,
              styles.shuffleBtn,
              commonStyles.glassPanel,
            ]}
          >
            <Text style={[commonStyles.text, styles.shuffleBtnText]}>
              Shuffle
            </Text>
          </Pressable>
        )}

        {readyToStart && !isTournamentFinished && (
          <Pressable
            disabled={tournamentParticipants.length < 2 || target < lastDartMultiplier}
            onPress={() => handleStart()}
            style={[
              tournamentParticipants.length < 2 || target < lastDartMultiplier ? commonStyles.disabledButton : commonStyles.primaryButton,
              styles.nextMatchBtn,
              commonStyles.glassPanel,
            ]}
          >
            <Text style={[commonStyles.text, styles.shuffleBtnText]}>
              Next Match
            </Text>
          </Pressable>
        )}
      </View>
      <Bracket
        scrollViewRef={scrollViewRef}
        scrollY={scrollY}
        handleStart={handleStart}
      />
      {!!tournamentParticipants.length && (
        <ExitGameModal />
      )}
    </Animated.ScrollView>
  );
};

export default Tournament;

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  btnContainer: { paddingHorizontal: 5 },
  shuffleBtn: {
    flex: 1,
    margin: 5,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  nextMatchBtn: {
    flex: 1,
    margin: 5,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  shuffleBtnText: { textAlign: "center" },
});
