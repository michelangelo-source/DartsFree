import DartIcon from "@/assets/icons/dartIcon.svg";
import DartInTheBoard from "@/assets/icons/dartInTheBoard.svg";
import ThrowingMan from "@/assets/icons/throwingMan.svg";
import {
  MenuButton,
  MenuButtonProps,
} from "@/components/menuButtons/MenuButton";
import { commonStyles } from "@/styles/commonStyle";
import { Trophy } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

const menuButtons: MenuButtonProps[] = [
  {
    href: "/CasualGames",
    label: "Casual Games",
    icon: <DartInTheBoard width={40} height={40} strokeWidth={1.2} />,
  },
  {
    href: "/Tournament",
    label: "Tournament",
    icon: <Trophy size={40} strokeWidth={1.2} />,
  },
  {
    href: "/Training",
    label: "Training",
    icon: <ThrowingMan width={40} height={40} strokeWidth={1.2} />,
  },
];

const MainMenu = () => (
  <View style={styles.container}>
    <View style={[styles.titleContainer, commonStyles.glassPanel]}>
      <DartIcon width={40} height={40} strokeWidth={1.2} />
      <Text style={styles.title}> Darts Free</Text>
    </View>

    {menuButtons.map((button) => (
      <MenuButton
        href={button.href}
        label={button.label}
        key={button.label}
        icon={button.icon}
      />
    ))}
  </View>
);

export default MainMenu;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    padding: 15,
  },
  title: { fontSize: 40 },
});
