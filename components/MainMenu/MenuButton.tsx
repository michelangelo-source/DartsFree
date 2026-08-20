import { commonStyles } from "@/styles/commonStyle";
import { Href, Link } from "expo-router";
import { ReactElement } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type MenuButtonProps = {
  href: Href;
  label: string;
  icon: ReactElement;
};

export const MenuButton = ({ href, label, icon }: MenuButtonProps) => {
  return (
    <View style={styles.container}>
      <Link href={href} asChild>
        <Pressable
          style={StyleSheet.flatten([styles.button, commonStyles.glassPanel])}
        >
          <View style={styles.iconContainer}>{icon}</View>
          <Text style={commonStyles.text}>{label}</Text>
        </Pressable>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    height: 60,
    margin: 10,

    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
