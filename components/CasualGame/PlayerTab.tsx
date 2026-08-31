import type { Player } from "@/store/GameStore";
import { commonStyles } from "@/styles/commonStyle";
import { X } from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

type PlayerTabProps = {
  player: Player;
  handleDeletePlayer: (nickname: string) => void;
};

export const PlayerTab = ({ player, handleDeletePlayer }: PlayerTabProps) => {
  const { width } = useWindowDimensions();

  return (
    <View
      key={player.name}
      style={[
        styles.playerItem,
        commonStyles.glassPanel,
        { width: width / 3 - 13 },
      ]}
    >
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[styles.playerText, commonStyles.adjustableFontSize]}
      >
        {player.name}
      </Text>
      <Pressable onPress={() => handleDeletePlayer(player.name)}>
        <X />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  playerItem: {
    backgroundColor: "black",
    height: 50,
    justifyContent: "space-evenly",
    marginLeft: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  playerText: {
    width: "80%",
    height: "100%",
  },
});
