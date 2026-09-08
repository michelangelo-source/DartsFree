import { Pressable, StyleSheet, Text, View } from "react-native";

export type RadioOption = {
  label: string;
  value: string | number;
};

type RadioGroupProps = {
  options: RadioOption[];
  selectedValue: string | number;
  onSelect: (value: any) => void;
};

export const RadioGroup = ({
  options,
  selectedValue,
  onSelect,
}: RadioGroupProps) => {
  return (
    <View style={styles.horizontalContainer}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            style={styles.radioContainer}
          >
            <View
              style={[styles.outerCircle, isSelected && styles.selectedCircle]}
            >
              {isSelected && <View style={styles.innerCircle} />}
            </View>

            <Text style={styles.radioText}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 2,
  },
  outerCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  selectedCircle: {
    borderColor: "green",
  },
  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "green",
  },
  radioText: {
    fontSize: 15,
  },
});
