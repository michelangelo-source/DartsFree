import type { Player } from "@/store/GameStore";
import { commonStyles } from "@/styles/commonStyle";
import { X } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

type PlayerTabProps = {
  player: Player;
  handleDeletePlayer: (nickname: string) => void;
};

export const PlayerTab = ({ player, handleDeletePlayer }: PlayerTabProps) => {
  return (
    <View
      key={player.name}
      style={[styles.playerItem, commonStyles.glassPanel]}
    >
      {/* make it textInput for editing */}
      <Text
        numberOfLines={2}
        style={{
          width: "80%",
        }}
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
    width: "30%",
    justifyContent: "space-evenly",
    marginLeft: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
