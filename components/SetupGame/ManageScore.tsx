import { commonStyles } from "@/styles/commonStyle";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import SetScoreButton from "../CasualGame/SetScoreButton";
import { RadioGroup } from "../RadioGroup/RadioGroup";

const MultiplayerOptions = [
  { value: 1, label: "Single" },
  { value: 2, label: "Double" },
  { value: 3, label: "Master" },
];

type ManageScoreProps = {
  lastDartMultiplier: 1 | 2 | 3;
  setLastDartMultiplier: (multiplier: 1 | 2 | 3) => void;
  target: number;
  setTarget: (target: number) => void;
};

export const ManageScore = ({
  lastDartMultiplier,
  target,
  setTarget,
  setLastDartMultiplier,
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

      <View style={[commonStyles.glassPanel, styles.radioSection]}>
        <Text style={[styles.radioLabel, commonStyles.text]}>
          Checkout Mode:
        </Text>
        <RadioGroup
          options={MultiplayerOptions}
          selectedValue={lastDartMultiplier}
          onSelect={setLastDartMultiplier}
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
  radioSection: {
    padding: 10,
    marginHorizontal: 10,
    alignSelf: "stretch",
  },
  radioLabel: {
    textAlign: "center",
  },
});
