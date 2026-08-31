import { commonStyles } from "@/styles/commonStyle";
import { StyleSheet, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import SetScoreButton from "../CasualGame/SetScoreButton";
type ManageScoreProps = {
  lastDartMultiplier: 1 | 2 | 3;
  target: number;
  setTarget: (target: number) => void;
};

export const ManageScore = ({
  lastDartMultiplier,
  target,
  setTarget,
}: ManageScoreProps) => {
  return (
    <>
      <View style={commonStyles.row}>
        <SetScoreButton target={301} setTarget={setTarget} />
        <SetScoreButton target={501} setTarget={setTarget} />
        <SetScoreButton target={701} setTarget={setTarget} />
      </View>
      <TextInput
        testID="target-input"
        value={target.toString()}
        onChangeText={(value) => {
          const onlyNumbers = value.replace(/[^0-9]/g, "");
          setTarget(Number(onlyNumbers));
        }}
        onEndEditing={() => {
          if (target < lastDartMultiplier) {
            Toast.show({
              type: "error",
              text1: "Target too low",
              text2: `For this mode, the target must be at least ${lastDartMultiplier}.`,
            });
            setTarget(lastDartMultiplier);
          }
        }}
        style={[styles.input, commonStyles.glassPanel, commonStyles.text]}
        keyboardType="number-pad"
      />
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
});
