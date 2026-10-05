import { Player } from "@/store/GameStore";
import { commonStyles } from "@/styles/commonStyle";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
type PlayerCardProps = {
  target: number;
  isCurrentPlayer: boolean;
  player: Player;
  playerCount: number;
};
export const PlayerCard = ({
  isCurrentPlayer,
  player,
  target,
  playerCount,
}: PlayerCardProps) => {
  const { width: screenWidth } = useWindowDimensions();
  
  let cardWidth = screenWidth / 3 - 20;
  if (playerCount === 1) {
    cardWidth = screenWidth - 20;
  } else if (playerCount === 2) {
    cardWidth = screenWidth / 2 - 20;
  }

  return (
    <View
      testID="player-card"
      style={[
        styles.container,
        commonStyles.glassPanel,
        { width: cardWidth, borderWidth: isCurrentPlayer ? 1 : 0 },
      ]}
    >
      <Text numberOfLines={1} style={styles.nameText}>
        {player.name}
      </Text>
      <View style={[commonStyles.row, styles.winnerMarkWrapper]}>
        {Array.from({ length: player.wins }).map((_, index) => (
          <View key={index} style={styles.winnerMark}></View>
        ))}
      </View>
      <Text style={commonStyles.subTitle}>{target - player.score}</Text>
      <Text>
        {Math.round(((player.score / player.dartsThrown) * 3) * 100) / 100 || 0}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 10,
    height: 100,

    alignItems: "center",
    justifyContent: "center",
    borderColor: "green",
  },
  nameText: {
    alignItems: "center",
  },
  winnerMarkWrapper: {
    gap: 2,
  },
  winnerMark: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "green",
  },
});
