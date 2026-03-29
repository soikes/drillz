import { GestureHandlerRootView } from "react-native-gesture-handler";
import ExerciseNavigator from "./src/components/ExerciseNavigator";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ExerciseNavigator />
    </GestureHandlerRootView>
  );
}
