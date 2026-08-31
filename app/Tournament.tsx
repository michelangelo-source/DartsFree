/* eslint-disable react-hooks/refs */
import { ManagePlayers } from "@/components/SetupGame/ManagePlayers";
import { ManageScore } from "@/components/SetupGame/ManageScore";
import { TournamentMatch, useTournamentStore } from "@/store/TournamentStore";
import { commonStyles } from "@/styles/commonStyle";
import { router } from "expo-router/build/global-state/router";
import { Play } from "lucide-react-native";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  clamp,
  scrollTo,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";

//refactor
//testy
const Tournament = () => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

  const scrollY = useScrollOffset(scrollViewRef);

  const { height, width } = useWindowDimensions();
  const {
    readyToStart,
    lastDartMultiplier,
    target,
    tournamentMatches,
    tournamentParticipants,
    isStarted,
    setTournamentTarget,
    startMatch,
    addTournamentParticipants,
    deleteTournamentParticipants,
    randomizeTournament,
  } = useTournamentStore();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const contextX = useSharedValue(0);
  const contextY = useSharedValue(0);
  const lastTranslationY = useSharedValue(0);

  const BASE_HEIGHT = height * 0.8;
  const matchHeight = 60;
  const matchHeightMargin = 16;
  const matchWidth = 130;
  const matchWidthMargin = 30;
  const maxRound = tournamentMatches.at(-1)?.round ?? 0;
  const MAP_WIDTH =
    maxRound * matchWidth + (maxRound - 1) * matchWidthMargin + 100;
  const MAP_HEIGHT =
    Math.ceil(tournamentMatches.length / 2) * matchHeight +
    (Math.ceil(tournamentMatches.length / 2) - 1) * matchHeightMargin +
    100;

  const EXTRA_SCROLL_SPACE = 20;

  const MIN_X = Math.min(0, width - MAP_WIDTH - EXTRA_SCROLL_SPACE);
  const MAX_X = 0;

  const MIN_Y = Math.min(0, BASE_HEIGHT - MAP_HEIGHT - EXTRA_SCROLL_SPACE);
  const MAX_Y = 0;

  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextX.value = translateX.value;
      contextY.value = translateY.value;
      lastTranslationY.value = 0;
    })
    .onUpdate((event) => {
      const deltaY = event.translationY - lastTranslationY.value;
      lastTranslationY.value = event.translationY;
      const nextX = contextX.value + event.translationX;
      const nextY = contextY.value + event.translationY;
      translateX.value = clamp(nextX, MIN_X, MAX_X);
      if (nextY > MAX_Y) {
        translateY.value = MAX_Y;
        scrollTo(scrollViewRef, 0, scrollY.value - deltaY, false);
      } else if (nextY < MIN_Y) {
        translateY.value = MIN_Y;
        scrollTo(scrollViewRef, 0, scrollY.value - deltaY, false);
      } else {
        translateY.value = nextY;
      }
    })
    .onEnd((event) => {
      translateX.value = withDecay({
        velocity: event.velocityX,
        clamp: [MIN_X, MAX_X],
      });
      translateY.value = withDecay({
        velocity: event.velocityY,
        clamp: [MIN_Y, MAX_Y],
      });
    });

  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const calculateTopStartingPosition = (round: number) => {
    if (round < 2) return 0;

    return (
      Math.pow(2, round - 2) * matchHeight +
      (Math.pow(2, round - 2) - 1) * matchHeightMargin +
      matchHeightMargin / 2 -
      matchHeight / 2
    );
  };
  const calculateMatchSpacing = (round: number, index: number) => {
    if (round === 1) {
      return index * (matchHeight + matchHeightMargin);
    }
    const prevMatches = getPreviousMatchesCount(
      round,
      tournamentMatches.length,
    );
    return (
      matchHeight * Math.pow(2, round - 1) * (index - prevMatches) +
      matchHeightMargin * Math.pow(2, round - 1) * (index - prevMatches)
    );
  };

  const getPreviousMatchesCount = (round: number, totalMatches: number) => {
    if (round <= 1) return 0;

    return totalMatches + 1 - (totalMatches + 1) / Math.pow(2, round - 1);
  };
  const handleStart = (match?: TournamentMatch) => {
    startMatch(match);
    router.navigate("/Game");
  };

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      contentContainerStyle={{ alignItems: "center" }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={commonStyles.title}>Tournament</Text>
      {!isStarted && (
        <>
          <ManageScore
            lastDartMultiplier={lastDartMultiplier}
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

      <View style={[commonStyles.row, { paddingHorizontal: 5 }]}>
        {!isStarted && (
          <View
            style={{
              flex: 1,
              margin: 5,
              justifyContent: "center",
            }}
          >
            <Pressable
              disabled={tournamentParticipants.length < 2}
              onPress={() => {
                randomizeTournament();
              }}
              style={[
                {
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: "green",
                  borderWidth: readyToStart ? 0 : 2,
                },
                commonStyles.glassPanel,
              ]}
            >
              <Text style={[commonStyles.text, { textAlign: "center" }]}>
                Shuffle
              </Text>
            </Pressable>
          </View>
        )}

        {readyToStart && (
          <View style={{ flex: 1, margin: 5, justifyContent: "center" }}>
            <Pressable
              disabled={tournamentParticipants.length < 2}
              onPress={() => handleStart()}
              style={[
                {
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: "green",
                  borderWidth: 2,
                },
                commonStyles.glassPanel,
              ]}
            >
              <Text style={[commonStyles.text, { textAlign: "center" }]}>
                Next Match
              </Text>
            </Pressable>
          </View>
        )}
      </View>
      <View
        style={{
          height: BASE_HEIGHT,
          width: "100%",
          overflow: "hidden",
        }}
      >
        {!!tournamentMatches.length && (
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                {
                  width: MAP_WIDTH,
                  height: MAP_HEIGHT,
                  position: "relative",
                  margin: 10,
                },
                commonStyles.glassPanel,
                animatedContentStyle,
              ]}
            >
              {tournamentMatches.map((match, index) => {
                return (
                  <View
                    key={match.id}
                    style={[
                      {
                        position: "absolute",
                        left:
                          (match.round - 1) * (matchWidth + matchWidthMargin) +
                          50,
                        top:
                          50 +
                          calculateTopStartingPosition(match.round) +
                          calculateMatchSpacing(match.round, index),
                        width: matchWidth,
                        flexDirection: "row",
                      },
                      commonStyles.glassPanel,
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={{
                          color: match.winner === 1 ? "green" : "black",
                          height: matchHeight / 2,
                          borderBottomWidth: 1,
                          textAlignVertical: "center",
                          textAlign: "center",
                          fontSize: 100,
                        }}
                      >
                        {match.player1?.name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={{
                          color: match.winner === 2 ? "green" : "black",
                          height: matchHeight / 2,
                          textAlignVertical: "center",
                          textAlign: "center",
                          fontSize: 100,
                        }}
                      >
                        {match.player2?.name}
                      </Text>
                    </View>
                    {match.player1 &&
                      match.player2 &&
                      !match.winner &&
                      readyToStart && (
                        <Pressable
                          onPress={() => handleStart(match)}
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Play color={"green"} />
                        </Pressable>
                      )}
                  </View>
                );
              })}
            </Animated.View>
          </GestureDetector>
        )}
      </View>
    </Animated.ScrollView>
  );
};

export default Tournament;
