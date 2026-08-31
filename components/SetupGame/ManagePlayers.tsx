import { Player } from "@/store/GameStore";
import { commonStyles } from "@/styles/commonStyle";
import { CirclePlus } from "lucide-react-native";
import { useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import { PlayerTab } from "../CasualGame/PlayerTab";

type ManagePlayersProps = {
  players: Player[];
  horizontalPlayerList?: boolean;
  addPlayer: (player: Player) => void;
  deletePlayer: (nickname: string) => void;
};

export const ManagePlayers = ({
  players,
  horizontalPlayerList = false,
  addPlayer,
  deletePlayer,
}: ManagePlayersProps) => {
  const flatListRef = useRef<FlatList>(null);
  const playersLengthRef = useRef(players?.length || 0);
  const inputRef = useRef<TextInput>(null);

  const [newUser, setNewUser] = useState("");

  const handleAddPlayer = (nickname: string) => {
    if (nickname === "") {
      inputRef.current?.focus();
      return;
    }
    if (players?.some((player) => player.name === nickname)) {
      userExistsToast();
    } else {
      addPlayer({
        name: nickname,
        score: 0,
        wins: 0,
        dartsThrown: 0,
        history: [],
      });
      setNewUser("");
    }
    inputRef.current?.focus();
  };

  const handleDeletePlayer = (nickname: string) => {
    deletePlayer(nickname);
  };

  const userExistsToast = () => {
    Toast.show({
      type: "error",
      text1: "User already exists",
    });
  };

  return (
    <>
      <View style={commonStyles.row}>
        <TextInput
          submitBehavior={"submit"}
          ref={inputRef}
          defaultValue={newUser}
          onChangeText={setNewUser}
          maxLength={12}
          style={[
            { flex: 1 },
            styles.input,
            commonStyles.glassPanel,
            commonStyles.text,
          ]}
          placeholder="Insert player"
          placeholderTextColor="gray"
          onSubmitEditing={() => handleAddPlayer(newUser)}
        />
        <Pressable
          onPress={() => handleAddPlayer(newUser)}
          style={[styles.addPlayerBtn, commonStyles.glassPanel]}
        >
          <CirclePlus height={40} width={40} strokeWidth={1.5} />
        </Pressable>
      </View>
      <View style={styles.playersListWrapper}>
        <FlatList
          ref={flatListRef}
          data={players}
          numColumns={horizontalPlayerList ? 1 : 3}
          horizontal={horizontalPlayerList}
          renderItem={({ item: player }) => (
            <PlayerTab
              player={player}
              handleDeletePlayer={handleDeletePlayer}
            />
          )}
          keyExtractor={(item) => item.name}
          onContentSizeChange={() => {
            const currentLength = players?.length || 0;
            if (currentLength > playersLengthRef.current) {
              flatListRef.current?.scrollToEnd({ animated: true });
            }
            playersLengthRef.current = currentLength;
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    margin: 10,
    alignSelf: "stretch",
    color: "black",
  },
  addPlayerBtn: {
    width: 50,
    height: 50,
    marginTop: 10,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  playersListWrapper: {
    maxHeight: 200,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
});
