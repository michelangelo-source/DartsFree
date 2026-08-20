import { Player, useGameStore } from "@/store/GameStore";
import { commonStyles } from "@/styles/commonStyle";
import { router } from "expo-router";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type FinishedGameModalProps = {
  winner?: Player;
  open: boolean;
  resetOrder: () => void;
  setOpen: (state: boolean) => void;
};

export const FinishedGameModal = ({
  open,
  winner = {
    wins: 0,
    name: "",
    score: 0,
    dartsThrown: 0,
    history: [],
  },
  resetOrder,
  setOpen,
}: FinishedGameModalProps) => {
  const { nextLeg, quitGame } = useGameStore();
  return (
    <Modal animationType="fade" transparent={true} visible={open}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, commonStyles.glassPanel]}>
          <Text style={commonStyles.text}>Winner: {winner.name}</Text>
          <Text style={commonStyles.text}>
            Average:{" "}
            {Math.round((winner.score / winner.dartsThrown) * 100) / 100 || 0}
          </Text>
          <Text style={commonStyles.text}>
            Darts Thrown: {winner.dartsThrown}
          </Text>
          <View style={styles.btnContainer}>
            <Pressable
              onPress={() => {
                setOpen(!open);
                router.navigate("/MainMenu");
                quitGame();
              }}
              style={styles.quitBtn}
            >
              <Text style={commonStyles.text}>Quit Game</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                nextLeg(winner.name);
                resetOrder();
                setOpen(!open);
              }}
              style={styles.nextBtn}
            >
              <Text style={commonStyles.text}>Next Leg</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    borderRadius: 20,
    width: "90%",
    alignItems: "center",
  },
  btnContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
  },
  quitBtn: {
    width: 140,
    backgroundColor: "rgba(255,0,0,0.55)",
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  nextBtn: {
    width: 130,
    backgroundColor: "rgba(224, 224, 224, 0.95)",
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
});
