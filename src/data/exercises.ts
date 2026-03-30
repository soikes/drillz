import { Note } from "../constants/notes";
import { ClefType } from "../components/Staff";
import { trebleNoteReading } from "./trebleNoteReading";
import { bassNoteReading } from "./bassNoteReading";

export interface ExerciseLevel {
  id: string;
  label: string;
  subtitle: string;
  notes: Note[];
}

export interface Exercise {
  id: string;
  name: string;
  clef: ClefType;
  levels: ExerciseLevel[];
}

export const EXERCISES: Exercise[] = [
  trebleNoteReading,
  bassNoteReading,
];
