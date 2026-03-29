import { Note } from "../constants/notes";
import { trebleNoteReading } from "./trebleNoteReading";

export interface ExerciseLevel {
  id: string;
  label: string;
  subtitle: string;
  notes: Note[];
}

export interface Exercise {
  id: string;
  name: string;
  levels: ExerciseLevel[];
}

export const EXERCISES: Exercise[] = [
  trebleNoteReading,
  // Future: bassNoteReading, intervalRecognition, etc.
];
