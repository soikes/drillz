import React, { useState, useCallback, useRef } from "react";
import { View, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { EXERCISES } from "../data/exercises";
import DrillScreen from "../screens/DrillScreen";
import PositionIndicator from "./PositionIndicator";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SNAP_THRESHOLD = 0.3;
const VELOCITY_THRESHOLD = 500;
const RUBBER_BAND_FACTOR = 0.3;

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
};

export default function ExerciseNavigator() {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);

  // Refs so gesture worklet closures always see current values
  const levelIndexRef = useRef(levelIndex);
  levelIndexRef.current = levelIndex;
  const exerciseIndexRef = useRef(exerciseIndex);
  exerciseIndexRef.current = exerciseIndex;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lockedAxis = useSharedValue<"none" | "x" | "y">("none");
  // Shared values for bounds checking on the worklet thread
  const sLevelIndex = useSharedValue(levelIndex);
  const sExerciseIndex = useSharedValue(exerciseIndex);
  const sMaxLevel = useSharedValue(EXERCISES[exerciseIndex].levels.length - 1);
  const sMaxExercise = useSharedValue(EXERCISES.length - 1);

  // Keep shared values in sync
  sLevelIndex.value = levelIndex;
  sExerciseIndex.value = exerciseIndex;
  sMaxLevel.value = EXERCISES[exerciseIndex].levels.length - 1;

  const exercise = EXERCISES[exerciseIndex];
  const level = exercise.levels[levelIndex];
  const maxLevelIndex = exercise.levels.length - 1;
  const maxExerciseIndex = EXERCISES.length - 1;

  const prevLevel = levelIndex > 0 ? exercise.levels[levelIndex - 1] : null;
  const nextLevel = levelIndex < maxLevelIndex ? exercise.levels[levelIndex + 1] : null;
  const prevExercise = exerciseIndex > 0 ? EXERCISES[exerciseIndex - 1] : null;
  const nextExercise = exerciseIndex < maxExerciseIndex ? EXERCISES[exerciseIndex + 1] : null;

  const navigateX = useCallback((direction: -1 | 1) => {
    setLevelIndex((i) => {
      const maxLevel = EXERCISES[exerciseIndexRef.current].levels.length - 1;
      return Math.max(0, Math.min(i + direction, maxLevel));
    });
  }, []);

  const navigateY = useCallback((direction: -1 | 1) => {
    setExerciseIndex((i) => Math.max(0, Math.min(i + direction, EXERCISES.length - 1)));
  }, []);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      lockedAxis.value = "none";
    })
    .onUpdate((e) => {
      if (lockedAxis.value === "none") {
        if (Math.abs(e.translationX) > 10 || Math.abs(e.translationY) > 10) {
          lockedAxis.value =
            Math.abs(e.translationX) > Math.abs(e.translationY) ? "x" : "y";
        }
        return;
      }

      if (lockedAxis.value === "x") {
        const atLeftEdge = sLevelIndex.value === 0 && e.translationX > 0;
        const atRightEdge = sLevelIndex.value === sMaxLevel.value && e.translationX < 0;
        translateX.value =
          atLeftEdge || atRightEdge
            ? e.translationX * RUBBER_BAND_FACTOR
            : e.translationX;
        translateY.value = 0;
      } else {
        const atTopEdge = sExerciseIndex.value === 0 && e.translationY > 0;
        const atBottomEdge = sExerciseIndex.value === sMaxExercise.value && e.translationY < 0;
        translateY.value =
          atTopEdge || atBottomEdge
            ? e.translationY * RUBBER_BAND_FACTOR
            : e.translationY;
        translateX.value = 0;
      }
    })
    .onEnd((e) => {
      if (lockedAxis.value === "x") {
        const swipedEnough =
          Math.abs(translateX.value) > SCREEN_WIDTH * SNAP_THRESHOLD ||
          Math.abs(e.velocityX) > VELOCITY_THRESHOLD;

        if (swipedEnough && translateX.value < 0 && sLevelIndex.value < sMaxLevel.value) {
          translateX.value = withTiming(-SCREEN_WIDTH, { duration: 200 }, () => {
            runOnJS(navigateX)(1);
            translateX.value = 0;
          });
        } else if (swipedEnough && translateX.value > 0 && sLevelIndex.value > 0) {
          translateX.value = withTiming(SCREEN_WIDTH, { duration: 200 }, () => {
            runOnJS(navigateX)(-1);
            translateX.value = 0;
          });
        } else {
          translateX.value = withSpring(0, SPRING_CONFIG);
        }
      } else if (lockedAxis.value === "y") {
        const swipedEnough =
          Math.abs(translateY.value) > SCREEN_HEIGHT * SNAP_THRESHOLD ||
          Math.abs(e.velocityY) > VELOCITY_THRESHOLD;

        if (swipedEnough && translateY.value < 0 && sExerciseIndex.value < sMaxExercise.value) {
          translateY.value = withTiming(-SCREEN_HEIGHT, { duration: 200 }, () => {
            runOnJS(navigateY)(1);
            translateY.value = 0;
          });
        } else if (swipedEnough && translateY.value > 0 && sExerciseIndex.value > 0) {
          translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 }, () => {
            runOnJS(navigateY)(-1);
            translateY.value = 0;
          });
        } else {
          translateY.value = withSpring(0, SPRING_CONFIG);
        }
      }

      lockedAxis.value = "none";
    });

  const currentStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const nextLevelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value + SCREEN_WIDTH }],
  }));

  const prevLevelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value - SCREEN_WIDTH }],
  }));

  const nextExerciseStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value + SCREEN_HEIGHT }],
  }));

  const prevExerciseStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value - SCREEN_HEIGHT }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <View style={styles.gestureArea}>
          {prevLevel && (
            <Animated.View style={[styles.adjacentScreen, prevLevelStyle]}>
              <DrillScreen exercise={exercise} level={prevLevel} isActive={false} />
            </Animated.View>
          )}
          {nextLevel && (
            <Animated.View style={[styles.adjacentScreen, nextLevelStyle]}>
              <DrillScreen exercise={exercise} level={nextLevel} isActive={false} />
            </Animated.View>
          )}
          {prevExercise && (
            <Animated.View style={[styles.adjacentScreen, prevExerciseStyle]}>
              <DrillScreen
                exercise={prevExercise}
                level={prevExercise.levels[levelIndex] ?? prevExercise.levels[0]}
                isActive={false}
              />
            </Animated.View>
          )}
          {nextExercise && (
            <Animated.View style={[styles.adjacentScreen, nextExerciseStyle]}>
              <DrillScreen
                exercise={nextExercise}
                level={nextExercise.levels[levelIndex] ?? nextExercise.levels[0]}
                isActive={false}
              />
            </Animated.View>
          )}
          <Animated.View style={[styles.screen, currentStyle]}>
            <DrillScreen exercise={exercise} level={level} isActive={true} />
          </Animated.View>
        </View>
      </GestureDetector>
      <PositionIndicator
        levelCount={exercise.levels.length}
        levelIndex={levelIndex}
        exerciseCount={EXERCISES.length}
        exerciseIndex={exerciseIndex}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  gestureArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  adjacentScreen: {
    ...StyleSheet.absoluteFillObject,
  },
});
