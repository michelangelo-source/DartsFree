import { Player, useGameStore } from "@/store/GameStore";
import { useTournamentStore } from "@/store/Tournament/TournamentStore";
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
  const { nextLeg, quitGame, legsToWin } = useGameStore();
  const { isStarted, startMatch, tournamentMatches } = useTournamentStore();
  
  const hasNextMatch = isStarted && tournamentMatches.some((m) => m.player1 && m.player2 && !m.winner);
  const isMatchOver = winner.wins + 1 >= legsToWin;

  return (
    <Modal animationType="fade" transparent={true} visible={open}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, commonStyles.glassPanel]}>
          <Text style={commonStyles.text}>Winner: {winner.name}</Text>
          <Text style={commonStyles.text}>
            Average:{" "}
            {Math.round(((winner.score / winner.dartsThrown) * 3) * 100) / 100 || 0}
          </Text>
          <Text style={commonStyles.text}>
            Darts Thrown: {winner.dartsThrown}
          </Text>
          <View style={styles.btnContainer}>
            {isStarted && isMatchOver ? (
              <>
                <Pressable
                  onPress={() => {
                    setOpen(!open);
                    router.navigate("/Tournament");
                    quitGame();
                  }}
                  style={styles.bracketBtn}
                >
                  <Text style={commonStyles.text}>See Bracket</Text>
                </Pressable>
                {hasNextMatch && (
                  <Pressable
                    onPress={() => {
                      quitGame();
                      setOpen(!open);
                      startMatch();
                      router.navigate("/Game");
                    }}
                    style={styles.nextMatchBtn}
                  >
                    <Text style={commonStyles.text}>Next Match</Text>
                  </Pressable>
                )}
              </>
            ) : (
              <>
                <Pressable
                  onPress={() => {
                    if (isStarted) {
                      nextLeg(winner.name);
                      resetOrder();
                      setOpen(!open);
                      router.navigate("/Tournament");
                    } else {
                      setOpen(!open);
                      router.navigate("/MainMenu");
                      quitGame();
                    }
                  }}
                  style={isStarted ? styles.bracketBtn : styles.quitBtn}
                >
                  <Text style={commonStyles.text}>
                    {isStarted ? "See Bracket" : "Quit Game"}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    nextLeg(winner.name);
                    resetOrder();
                    setOpen(!open);
                  }}
                  style={styles.nextLegBtn}
                >
                  <Text style={commonStyles.text}>Next Leg</Text>
                </Pressable>
              </>
            )}
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

  bracketBtn: {
    width: 160,
    backgroundColor: "rgba(224, 224, 224, 0.95)",
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  nextMatchBtn: {
    width: 150,
    margin: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.15)",
    borderColor: "green",
    borderWidth: 1,
  },
  nextLegBtn: {
    width: 130,
    backgroundColor: "rgba(224, 224, 224, 0.95)",
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
});
