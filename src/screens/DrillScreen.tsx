import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import Staff from "../components/Staff";
import { usePitchDetection } from "../hooks/usePitchDetection";
import { useDrill } from "../hooks/useDrill";
import { noteLabel, findClosestNote } from "../constants/notes";
import { Exercise, ExerciseLevel } from "../data/exercises";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface DrillScreenProps {
  exercise: Exercise;
  level: ExerciseLevel;
  isActive: boolean;
}

export default function DrillScreen({ exercise, level, isActive }: DrillScreenProps) {
  const pitch = usePitchDetection();
  const drill = useDrill(level.notes);
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const [showNoteNames, setShowNoteNames] = useState(true);

  // Fade-up animation for note reveal when names are hidden
  const revealOpacity = useRef(new Animated.Value(0)).current;
  const revealTranslateY = useRef(new Animated.Value(0)).current;
  const [revealNoteName, setRevealNoteName] = useState<string | null>(null);

  // Feed detected frequency into drill logic
  useEffect(() => {
    if (drill.state === "running" && pitch.frequency) {
      drill.checkFrequency(pitch.frequency);
    }
  }, [pitch.frequency, drill.state]);

  // Flash green on correct hit
  useEffect(() => {
    if (drill.correctHitCount === 0) return;
    flashOpacity.setValue(0.35);
    Animated.timing(flashOpacity, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [drill.correctHitCount]);

  // Fade-up note name reveal on correct hit when names are hidden
  useEffect(() => {
    if (drill.correctHitCount === 0 || showNoteNames || !drill.lastHitNote) return;
    setRevealNoteName(noteLabel(drill.lastHitNote));
    revealOpacity.setValue(1);
    revealTranslateY.setValue(0);
    Animated.parallel([
      Animated.timing(revealOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(revealTranslateY, {
        toValue: -30,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [drill.correctHitCount]);

  const handleStart = () => {
    drill.start();
    pitch.startListening();
  };

  const handleReset = () => {
    drill.reset();
    pitch.stopListening();
  };

  // Stop listening when drill completes
  useEffect(() => {
    if (drill.state === "complete") {
      pitch.stopListening();
    }
  }, [drill.state]);

  // Stop listening when screen becomes inactive
  useEffect(() => {
    if (!isActive && pitch.isListening) {
      pitch.stopListening();
      drill.reset();
    }
  }, [isActive]);

  const detectedNote = pitch.frequency
    ? findClosestNote(pitch.frequency, level.notes)
    : null;

  return (
    <View style={styles.container}>
      {/* Green flash overlay on correct note */}
      <Animated.View
        pointerEvents="none"
        style={[styles.flashOverlay, { opacity: flashOpacity }]}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Piano Drillz</Text>
        <Text style={styles.subtitle}>
          {exercise.name} — {level.label}
        </Text>
        <Text style={styles.levelDetail}>{level.subtitle}</Text>
      </View>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statValue}>{formatTime(drill.elapsedSeconds)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={styles.statValue}>
            {drill.score}/{drill.totalNotes}
          </Text>
        </View>
      </View>

      {/* Staff */}
      <View style={styles.staffContainer}>
        <Staff currentNote={drill.currentNote} width={SCREEN_WIDTH - 40} height={220} />
      </View>

      {/* Note helper */}
      {drill.state === "running" && drill.currentNote && (
        <View style={styles.noteInfo}>
          {showNoteNames ? (
            <>
              <Text style={styles.playText}>
                Play: <Text style={styles.noteName}>{noteLabel(drill.currentNote)}</Text>
              </Text>
              {detectedNote && (
                <Text style={styles.hearingText}>
                  Hearing: {noteLabel(detectedNote)} ({Math.round(pitch.frequency!)} Hz)
                </Text>
              )}
            </>
          ) : (
            <View style={styles.revealContainer}>
              {revealNoteName && (
                <Animated.Text
                  style={[
                    styles.revealText,
                    {
                      opacity: revealOpacity,
                      transform: [{ translateY: revealTranslateY }],
                    },
                  ]}
                >
                  {revealNoteName}
                </Animated.Text>
              )}
            </View>
          )}
        </View>
      )}

      {/* Idle state */}
      {drill.state === "idle" && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            Play through all {level.notes.length} notes as fast as you can!
          </Text>
        </View>
      )}

      {/* Complete state */}
      {drill.state === "complete" && (
        <View style={styles.completeContainer}>
          <Text style={styles.completeEmoji}>🎉</Text>
          <Text style={styles.completeTitle}>Complete!</Text>
          <Text style={styles.completeStats}>
            {drill.score}/{drill.totalNotes} correct in{" "}
            {formatTime(drill.elapsedSeconds)}
          </Text>
        </View>
      )}

      {/* Action button */}
      <View style={styles.buttonContainer}>
        {drill.state === "idle" && (
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>Start Drill</Text>
          </TouchableOpacity>
        )}
        {drill.state === "running" && (
          <>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowNoteNames((v) => !v)}
            >
              <Text style={styles.toggleButtonText}>
                {showNoteNames ? "Hide Notes" : "Show Notes"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.resetButton, { marginTop: 12 }]} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Stop</Text>
            </TouchableOpacity>
          </>
        )}
        {drill.state === "complete" && (
          <View style={styles.completeButtons}>
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resetButton, { marginTop: 12 }]}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Audio level meter */}
      {pitch.isListening && (
        <View style={styles.audioMeter}>
          <View style={styles.audioMeterRow}>
            <View style={styles.micDot} />
            <Text style={styles.micText}>Listening</Text>
            {pitch.frequency ? (
              <Text style={styles.freqText}>
                {Math.round(pitch.frequency)} Hz
              </Text>
            ) : (
              <Text style={styles.freqTextQuiet}>no pitch</Text>
            )}
          </View>
          <View style={styles.levelBarBg}>
            <View
              style={[
                styles.levelBarFill,
                {
                  width: `${Math.round(pitch.audioLevel * 100)}%`,
                  backgroundColor:
                    pitch.audioLevel > 0.6
                      ? "#22c55e"
                      : pitch.audioLevel > 0.2
                      ? "#eab308"
                      : "#334155",
                },
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#22c55e",
    zIndex: 10,
  },
  header: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#f8fafc",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 4,
  },
  levelDetail: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  statsBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 40,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#f8fafc",
    fontVariant: ["tabular-nums"],
    marginTop: 2,
  },
  staffContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  noteInfo: {
    alignItems: "center",
    marginTop: 20,
  },
  playText: {
    fontSize: 20,
    color: "#cbd5e1",
  },
  noteName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2563eb",
  },
  hearingText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 6,
  },
  revealContainer: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  revealText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#22c55e",
  },
  toggleButton: {
    backgroundColor: "#1e293b",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94a3b8",
  },
  messageContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 24,
  },
  messageText: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 24,
  },
  completeContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  completeEmoji: {
    fontSize: 48,
  },
  completeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#22c55e",
    marginTop: 8,
  },
  completeStats: {
    fontSize: 18,
    color: "#94a3b8",
    marginTop: 4,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 40,
    paddingBottom: 20,
  },
  completeButtons: {
    width: "100%",
  },
  startButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  resetButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#334155",
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94a3b8",
  },
  audioMeter: {
    paddingHorizontal: 40,
    paddingBottom: 20,
  },
  audioMeterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  micDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
    marginRight: 6,
  },
  micText: {
    fontSize: 12,
    color: "#64748b",
    flex: 1,
  },
  freqText: {
    fontSize: 12,
    color: "#94a3b8",
    fontVariant: ["tabular-nums"],
  },
  freqTextQuiet: {
    fontSize: 12,
    color: "#334155",
  },
  levelBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1e293b",
    overflow: "hidden",
  },
  levelBarFill: {
    height: 6,
    borderRadius: 3,
  },
});
