import { ImageBackground } from "expo-image";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <ImageBackground
          source={require("../assets/images/mainBackground.png")}
          contentFit="cover"
          contentPosition="right"
          style={{ flex: 1 }}
        >
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade",
              contentStyle: {
                backgroundColor: "transparent",
              },
            }}
          />
          <Toast />
        </ImageBackground>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
