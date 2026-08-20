import { Player } from "@/store/GameStore";
import { commonStyles } from "@/styles/commonStyle";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
type PlayerCardProps = {
  target: number;
  isCurrentPlayer: boolean;
  player: Player;
};
export const PlayerCard = ({
  isCurrentPlayer,
  player,
  target,
}: PlayerCardProps) => {
  const { width: screenWidth } = useWindowDimensions();
  return (
    <View
      style={[
        styles.container,
        commonStyles.glassPanel,
        { width: screenWidth / 3 - 20, borderWidth: isCurrentPlayer ? 1 : 0 },
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
        {Math.round((player.score / player.dartsThrown) * 100) / 100 || 0}
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
