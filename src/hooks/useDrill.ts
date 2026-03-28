import { useCallback, useEffect, useRef, useState } from "react";
import {
  Note,
  LEVEL_1_NOTES,
  isNoteMatch,
  shuffleArray,
} from "../constants/notes";

export type DrillState = "idle" | "running" | "complete";

export interface DrillResult {
  state: DrillState;
  currentNote: Note | null;
  score: number;
  totalNotes: number;
  elapsedSeconds: number;
  /** Increments each time a correct note is hit */
  correctHitCount: number;
  start: () => void;
  reset: () => void;
  checkFrequency: (frequency: number | null) => void;
}

export function useDrill(): DrillResult {
  const [state, setState] = useState<DrillState>("idle");
  const [noteQueue, setNoteQueue] = useState<Note[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [correctHitCount, setCorrectHitCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMatchTime = useRef<number>(0);

  const totalNotes = LEVEL_1_NOTES.length;
  const currentNote = state === "running" ? noteQueue[currentIndex] ?? null : null;

  const start = useCallback(() => {
    const shuffled = shuffleArray(LEVEL_1_NOTES);
    setNoteQueue(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setCorrectHitCount(0);
    setElapsedSeconds(0);
    setState("running");
    lastMatchTime.current = 0;
  }, []);

  const reset = useCallback(() => {
    setState("idle");
    setNoteQueue([]);
    setCurrentIndex(0);
    setScore(0);
    setElapsedSeconds(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const checkFrequency = useCallback(
    (frequency: number | null) => {
      if (state !== "running" || !frequency || currentIndex >= noteQueue.length)
        return;

      // Debounce: require 300ms between matches to avoid double-counting
      const now = Date.now();
      if (now - lastMatchTime.current < 300) return;

      const target = noteQueue[currentIndex];
      if (isNoteMatch(frequency, target)) {
        lastMatchTime.current = now;
        setScore((s) => s + 1);
        setCorrectHitCount((c) => c + 1);

        const nextIndex = currentIndex + 1;
        if (nextIndex >= noteQueue.length) {
          setState("complete");
        } else {
          setCurrentIndex(nextIndex);
        }
      }
    },
    [state, currentIndex, noteQueue]
  );

  // Timer
  useEffect(() => {
    if (state === "running") {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state]);

  return {
    state,
    currentNote,
    score,
    totalNotes,
    elapsedSeconds,
    correctHitCount,
    start,
    reset,
    checkFrequency,
  };
}
