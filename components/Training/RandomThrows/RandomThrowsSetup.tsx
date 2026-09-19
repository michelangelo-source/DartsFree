import { useRandomStore } from "@/store/Training/RandomThrowsStore";
import { commonStyles } from "@/styles/commonStyle";
import { Checkbox } from "expo-checkbox";
import { Minus, Plus } from "lucide-react-native";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type RandomThrowsSetupProps = {
  onStart: () => void;
};

export const RandomThrowsSetup = ({ onStart }: RandomThrowsSetupProps) => {
  const { settings, updateSettings } = useRandomStore();
  const canStart =
    (settings.singles || settings.doubles || settings.triples) &&
    settings.totalThrows > 0;

  return (
    <View style={styles.container}>
      <Text style={[commonStyles.title, styles.title]}>Random</Text>

      <View style={[commonStyles.glassPanel, styles.settingsPanel]}>
        <Text style={commonStyles.text}>Target types:</Text>

        <View style={styles.checkboxRow}>
          <Checkbox
            value={settings.singles}
            onValueChange={(v) => updateSettings({ ...settings, singles: v })}
            color={settings.singles ? "green" : undefined}
          />
          <Text style={styles.checkboxLabel}>Singles</Text>
        </View>

        <View style={styles.checkboxRow}>
          <Checkbox
            value={settings.doubles}
            onValueChange={(v) => updateSettings({ ...settings, doubles: v })}
            color={settings.doubles ? "green" : undefined}
          />
          <Text style={styles.checkboxLabel}>Doubles</Text>
        </View>

        <View style={styles.checkboxRow}>
          <Checkbox
            value={settings.triples}
            onValueChange={(v) => updateSettings({ ...settings, triples: v })}
            color={settings.triples ? "green" : undefined}
          />
          <Text style={styles.checkboxLabel}>Triples</Text>
        </View>
      </View>

      <View style={[commonStyles.glassPanel, styles.settingsPanel]}>
        <Text style={commonStyles.text}>Number of throws:</Text>
        <View style={styles.counterRow}>
          <Pressable
            style={styles.counterButton}
            onPress={() => {
              if (settings.totalThrows > 1) {
                updateSettings({
                  ...settings,
                  totalThrows: settings.totalThrows - 1,
                });
              }
            }}
          >
            <Minus color={"white"} />
          </Pressable>

          <TextInput
            style={[styles.input, commonStyles.glassPanel, commonStyles.text]}
            keyboardType="number-pad"
            value={settings.totalThrows.toString()}
            onChangeText={(text) => {
              const onlyNumbers = text.replace(/[^0-9]/g, "");

              updateSettings({
                ...settings,
                totalThrows: Number(onlyNumbers),
              });
            }}
            onEndEditing={() => {
              if (settings.totalThrows < 1) {
                updateSettings({ ...settings, totalThrows: 1 });
              }
            }}
          />

          <Pressable
            style={styles.counterButton}
            onPress={() => {
              updateSettings({
                ...settings,
                totalThrows: settings.totalThrows + 1,
              });
            }}
          >
            <Plus color={"white"} />
          </Pressable>
        </View>
      </View>

      <Pressable
        style={[
          commonStyles.glassPanel,
          styles.startButton,
          !canStart ? commonStyles.disabledButton : commonStyles.primaryButton,
        ]}
        onPress={canStart ? onStart : undefined}
      >
        <Text style={commonStyles.text}>Start</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 15,
    padding: 20,
  },
  title: {
    textAlign: "center",
  },
  settingsPanel: {
    padding: 15,
    gap: 10,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 5,
  },
  checkboxLabel: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    alignSelf: "stretch",
    height: 50,
    textAlign: "center",
    color: "black",
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  counterButton: {
    backgroundColor: "green",
    borderRadius: 8,
    padding: 8,
  },
  startButton: {
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 10,
  },
});
