import { MenuButton } from "@/components/MainMenu/MenuButton";
import { Clock, Dices } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

const TrainingMenu = () => {
  return (
    <View style={styles.container}>
      <MenuButton
        href={"/Training/AroundTheClock"}
        label={"Around The Clock"}
        icon={<Clock width={40} height={40} strokeWidth={1.2} />}
      />
      <MenuButton
        href={"/Training/Random"}
        label={"Random"}
        icon={<Dices width={40} height={40} strokeWidth={1.2} />}
      />
    </View>
  );
};
export default TrainingMenu;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
