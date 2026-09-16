import { FinishedTrainingModal } from "@/components/Modals/FinishedTrainingModal";
import { RandomThrowsGame } from "@/components/Training/RandomThrows/RandomThrowsGame";
import { RandomThrowsSetup } from "@/components/Training/RandomThrows/RandomThrowsSetup";
import { useRandomStore } from "@/store/Training/RandomThrowsStore";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

const RandomThrows = () => {
  const { playing, targets, result, start, finish, reset, gameId } =
    useRandomStore();

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return (
    <View style={styles.container}>
      {playing && targets.length > 0 ? (
        <RandomThrowsGame key={gameId} targets={targets} onFinish={finish} />
      ) : (
        <RandomThrowsSetup onStart={start} />
      )}
      <FinishedTrainingModal
        open={result !== null}
        result={result ?? ""}
        resetTraining={start}
        onExit={reset}
      />
    </View>
  );
};

export default RandomThrows;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
