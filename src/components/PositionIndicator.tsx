import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from "react-native-reanimated";

interface PositionIndicatorProps {
  levelCount: number;
  levelIndex: number;
  exerciseCount: number;
  exerciseIndex: number;
}

export default function PositionIndicator({
  levelCount,
  levelIndex,
  exerciseCount,
  exerciseIndex,
}: PositionIndicatorProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = 1;
    opacity.value = withDelay(2000, withTiming(0.3, { duration: 500 }));
  }, [levelIndex, exerciseIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <>
      {/* Horizontal dots — levels */}
      <Animated.View style={[styles.horizontalContainer, animatedStyle]}>
        {Array.from({ length: levelCount }).map((_, i) => (
          <View
            key={`h-${i}`}
            style={[
              styles.dot,
              i === levelIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </Animated.View>

      {/* Vertical dots — exercises (hidden when only 1) */}
      {exerciseCount > 1 && (
        <Animated.View style={[styles.verticalContainer, animatedStyle]}>
          {Array.from({ length: exerciseCount }).map((_, i) => (
            <View
              key={`v-${i}`}
              style={[
                styles.dot,
                i === exerciseIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  horizontalContainer: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  verticalContainer: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: "#f8fafc",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotInactive: {
    backgroundColor: "#475569",
  },
});
