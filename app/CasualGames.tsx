import { PlayerTab } from "@/components/CasualGame/PlayerTab";
import SetScoreButton from "@/components/CasualGame/SetScoreButton";
import { useGameStore } from "@/store/GameStore";
import { commonStyles } from "@/styles/commonStyle";
import { Link } from "expo-router";
import { CirclePlus } from "lucide-react-native";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const CasualGames = () => {
  const [newUser, setNewUser] = useState("");
  const { target, setTarget, players, addPlayer, deletePlayer } =
    useGameStore();
  const [currentGamePlayers, setCurrentGamePlayers] = useState(
    new Set(players.flatMap((player) => player.name)),
  );

  const userExistsToast = () => {
    Toast.show({
      type: "error",
      text1: "User already exists",
    });
  };

  const handleAddPlayer = (nickname: string) => {
    if (nickname === "") return;
    if (currentGamePlayers.has(nickname)) {
      userExistsToast();
    } else {
      setCurrentGamePlayers(currentGamePlayers.add(nickname));
      addPlayer({
        name: nickname,
        score: 0,
        avg: 0,
        dartsThrown: 0,
        history: [],
      });
      setNewUser("");
    }
  };

  const handleDeletePlayer = (nickname: string) => {
    deletePlayer(nickname);
    currentGamePlayers.delete(nickname);
    setCurrentGamePlayers(currentGamePlayers);
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text style={styles.title}>Game Setup</Text>
      <View style={{ flexDirection: "row" }}>
        <SetScoreButton target={301} setTarget={setTarget} />
        <SetScoreButton target={501} setTarget={setTarget} />
        <SetScoreButton target={701} setTarget={setTarget} />
      </View>
      <TextInput
        value={target.toString()}
        onChangeText={(value) => {
          const onlyNumbers = value.replace(/[^0-9]/g, "");
          setTarget(Number(onlyNumbers));
        }}
        style={[styles.input, commonStyles.glassPanel]}
        keyboardType="number-pad"
      />
      {/*to do here: single or double checkout */}
      <View style={{ flexDirection: "row" }}>
        <TextInput
          defaultValue={newUser}
          onChangeText={setNewUser}
          style={[{ flex: 1 }, styles.input, commonStyles.glassPanel]}
          placeholder="Insert player"
          placeholderTextColor="gray"
          onEndEditing={() => handleAddPlayer(newUser)}
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
          data={players}
          numColumns={3}
          horizontal={false}
          renderItem={({ item: player }) => (
            <PlayerTab
              player={player}
              handleDeletePlayer={handleDeletePlayer}
            />
          )}
          keyExtractor={(item) => item.name}
        />
      </View>
      <Link href={"/Game"} disabled={players.length < 2} asChild>
        <Pressable
          style={StyleSheet.flatten([
            styles.startGameBtn,
            commonStyles.glassPanel,
          ])}
        >
          <Text style={{ fontSize: 25 }}>Start</Text>
        </Pressable>
      </Link>
    </View>
  );
};
export default CasualGames;

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
  },

  input: {
    height: 50,
    fontSize: 25,
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

  startGameBtn: {
    height: 50,
    margin: 10,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
});
