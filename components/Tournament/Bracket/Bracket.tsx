import {
  TournamentMatch,
  useTournamentStore,
} from "@/store/Tournament/TournamentStore";
import { commonStyles } from "@/styles/commonStyle";
import { Minus, Play, Plus } from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  AnimatedRef,
  clamp,
  scrollTo,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";
import {
  calculateMatchSpacing,
  calculateTopStartingPosition,
  EXTRA_SCROLL_SPACE,
  LEG_COUNT_SPACE,
  MAP_PADDING,
  MATCH_HEIGHT,
  MATCH_HEIGHT_MARGIN,
  MATCH_WIDTH,
  MATCH_WIDTH_MARGIN,
} from "./helpers";

type BracketProps = {
  scrollViewRef: AnimatedRef<Animated.ScrollView>;
  scrollY: SharedValue<number>;
  handleStart: (match: TournamentMatch) => void;
};
export const Bracket = ({
  scrollViewRef,
  scrollY,
  handleStart,
}: BracketProps) => {
  const { readyToStart, isStarted, tournamentMatches, legsToWin, setLegToWin } =
    useTournamentStore();
  const { height, width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const contextX = useSharedValue(0);
  const contextY = useSharedValue(0);
  const lastTranslationY = useSharedValue(0);

  const BASE_HEIGHT = height * 0.8;
  const totalMatchesLength = tournamentMatches.length;
  const maxRound = tournamentMatches.at(-1)?.round ?? 0;

  const MAP_WIDTH =
    maxRound * MATCH_WIDTH +
    (maxRound - 1) * MATCH_WIDTH_MARGIN +
    2 * MAP_PADDING;
  const MAP_HEIGHT =
    Math.ceil(totalMatchesLength / 2) * MATCH_HEIGHT +
    (Math.ceil(totalMatchesLength / 2) - 1) * MATCH_HEIGHT_MARGIN +
    2 * MAP_PADDING +
    LEG_COUNT_SPACE;

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

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <View style={[styles.container, { height: BASE_HEIGHT }]}>
      {!!totalMatchesLength && (
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.mapContainer,
              { width: MAP_WIDTH, height: MAP_HEIGHT },
              commonStyles.glassPanel,
              animatedContentStyle,
            ]}
          >
            {legsToWin.map((count, index) => {
              return (
                <View
                  key={index}
                  style={[
                    styles.legsToWinContainer,
                    {
                      left:
                        index * (MATCH_WIDTH + MATCH_WIDTH_MARGIN) +
                        MAP_PADDING,
                      top:
                        MAP_PADDING + calculateTopStartingPosition(index + 1),
                    },
                  ]}
                >
                  <Text style={[commonStyles.text, styles.legsToWinLabel]}>
                    Legs to win
                  </Text>

                  <View style={styles.legsToWinControls}>
                    <Text style={commonStyles.text}>{count}</Text>
                    {!isStarted && (
                      <View style={styles.legsToWinButtonsContainer}>
                        <Pressable
                          onPress={() => {
                            if (count > 1) setLegToWin(index, count - 1);
                          }}
                          style={styles.legsToWinButton}
                        >
                          <Minus color={"white"} />
                        </Pressable>
                        <Pressable
                          onPress={() => setLegToWin(index, count + 1)}
                          style={styles.legsToWinButton}
                        >
                          <Plus color={"white"} />
                        </Pressable>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
            {tournamentMatches.map((match, index) => {
              const leftPosition =
                (match.round - 1) * (MATCH_WIDTH + MATCH_WIDTH_MARGIN) +
                MAP_PADDING;
              const topPosition =
                MAP_PADDING +
                LEG_COUNT_SPACE +
                calculateTopStartingPosition(match.round) +
                calculateMatchSpacing(match.round, index, totalMatchesLength);

              return (
                <View
                  key={match.id}
                  style={[
                    styles.matchContainer,
                    { left: leftPosition, top: topPosition },
                    commonStyles.glassPanel,
                  ]}
                >
                  <View style={styles.playersColumn}>
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={[
                        styles.playerText,
                        styles.player1Border,
                        { color: match.winner === 1 ? "green" : "black" },
                        commonStyles.adjustableFontSize,
                      ]}
                    >
                      {match.player1?.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={[
                        styles.playerText,
                        { color: match.winner === 2 ? "green" : "black" },
                        commonStyles.adjustableFontSize,
                      ]}
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
                        style={styles.playButton}
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
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
  },
  mapContainer: {
    position: "relative",
    margin: 10,
  },
  matchContainer: {
    position: "absolute",
    width: MATCH_WIDTH,
    flexDirection: "row",
  },
  playersColumn: {
    flex: 1,
  },
  playerText: {
    height: MATCH_HEIGHT / 2,
  },
  player1Border: {
    borderBottomWidth: 1,
  },
  playButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  legsToWinContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "flex-end",
    height: LEG_COUNT_SPACE,
    width: MATCH_WIDTH,
  },
  legsToWinLabel: {
    fontSize: 10,
    opacity: 0.7,
  },
  legsToWinControls: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  legsToWinButtonsContainer: {
    flexDirection: "row",
    gap: 5,
  },
  legsToWinButton: {
    backgroundColor: "green",
    borderRadius: 5,
  },
});
