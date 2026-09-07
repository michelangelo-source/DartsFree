import { commonStyles } from "@/styles/commonStyle";
import { router, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export const ExitGameModal = () => {
  const navigation = useNavigation();
  const [isExitDialogVisible, setIsExitDialogVisible] =
    useState<boolean>(false);
  const exitAction = useRef<any>(null);
  const shouldExit = useRef<boolean>(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (shouldExit.current) {
        return;
      }
      e.preventDefault();
      exitAction.current = e.data.action;
      setIsExitDialogVisible(true);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isExitDialogVisible}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, commonStyles.glassPanel]}>
          <Text style={commonStyles.text}>Are you sure?</Text>
          <View style={styles.btnContainer}>
            <>
              <Pressable
                onPress={() => {
                  setIsExitDialogVisible(false);
                  exitAction.current = null;
                }}
                style={styles.cancelBtn}
              >
                <Text style={commonStyles.text}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsExitDialogVisible(false);
                  shouldExit.current = true;
                  if (exitAction.current) {
                    navigation.dispatch(exitAction.current);
                  } else {
                    if (router.canGoBack()) {
                      router.back();
                    } else {
                      router.navigate("/");
                    }
                  }
                }}
                style={styles.quitBtn}
              >
                <Text style={commonStyles.text}>Exit</Text>
              </Pressable>
            </>
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
  cancelBtn: {
    width: 160,
    backgroundColor: "rgba(224, 224, 224, 0.95)",
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
});
