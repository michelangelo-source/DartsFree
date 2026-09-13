import { commonStyles } from "@/styles/commonStyle";
import { router } from "expo-router";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
type FinishedTrainingModalProps = {
  open: boolean;
  result: string;
  resetTraining: () => void;
};

export const FinishedTrainingModal = ({
  open,
  result,
  resetTraining,
}: FinishedTrainingModalProps) => {
  return (
    <Modal animationType="fade" transparent={true} visible={open}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, commonStyles.glassPanel]}>
          <Text style={commonStyles.text}>Result:</Text>
          <Text style={commonStyles.text}>{result}</Text>
          <View style={styles.btnContainer}>
            <Pressable
              onPress={() => {
                router.navigate("/MainMenu");
              }}
              style={styles.quitBtn}
            >
              <Text style={commonStyles.text}>Exit</Text>
            </Pressable>
            <Pressable onPress={resetTraining} style={styles.resetBtn}>
              <Text style={commonStyles.text}>Reset</Text>
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

  resetBtn: {
    width: 160,
    backgroundColor: "rgba(224, 224, 224, 0.95)",
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
});
