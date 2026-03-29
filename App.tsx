import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActivityIndicator, View } from "react-native";
import { useFonts } from "@expo-google-fonts/jost/useFonts";
import {
  Jost_400Regular,
  Jost_600SemiBold,
  Jost_700Bold,
  Jost_800ExtraBold,
} from "@expo-google-fonts/jost";
import ExerciseNavigator from "./src/components/ExerciseNavigator";

export default function App() {
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold,
    Jost_700Bold,
    Jost_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0f172a", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#f8fafc" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ExerciseNavigator />
    </GestureHandlerRootView>
  );
}
