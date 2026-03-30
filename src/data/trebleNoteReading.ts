import { Note } from "../constants/notes";
import { Exercise } from "./exercises";

// Level 1: C4–C5 naturals (8 notes) — one octave
const LEVEL_1: Note[] = [
  { name: "C", octave: 4, frequency: 261.63, staffPosition: -2, needsLedgerLine: true },
  { name: "D", octave: 4, frequency: 293.66, staffPosition: -1, needsLedgerLine: false },
  { name: "E", octave: 4, frequency: 329.63, staffPosition: 0, needsLedgerLine: false },
  { name: "F", octave: 4, frequency: 349.23, staffPosition: 1, needsLedgerLine: false },
  { name: "G", octave: 4, frequency: 392.0, staffPosition: 2, needsLedgerLine: false },
  { name: "A", octave: 4, frequency: 440.0, staffPosition: 3, needsLedgerLine: false },
  { name: "B", octave: 4, frequency: 493.88, staffPosition: 4, needsLedgerLine: false },
  { name: "C", octave: 5, frequency: 523.25, staffPosition: 5, needsLedgerLine: false },
];

// Level 2: B3–D5 naturals (10 notes) — wider range
const LEVEL_2: Note[] = [
  { name: "B", octave: 3, frequency: 246.94, staffPosition: -3, needsLedgerLine: false },
  ...LEVEL_1,
  { name: "D", octave: 5, frequency: 587.33, staffPosition: 6, needsLedgerLine: false },
];

// Level 3: A3–E5 naturals (12 notes) — full treble range
const LEVEL_3: Note[] = [
  { name: "A", octave: 3, frequency: 220.0, staffPosition: -4, needsLedgerLine: true },
  { name: "B", octave: 3, frequency: 246.94, staffPosition: -3, needsLedgerLine: false },
  ...LEVEL_1,
  { name: "D", octave: 5, frequency: 587.33, staffPosition: 6, needsLedgerLine: false },
  { name: "E", octave: 5, frequency: 659.25, staffPosition: 7, needsLedgerLine: false },
];

// Level 4: C4–C5 chromatic (13 notes) — sharps/flats in small range
const LEVEL_4: Note[] = [
  { name: "C", octave: 4, frequency: 261.63, staffPosition: -2, needsLedgerLine: true },
  { name: "C#", octave: 4, frequency: 277.18, staffPosition: -2, needsLedgerLine: true, accidental: "sharp" },
  { name: "D", octave: 4, frequency: 293.66, staffPosition: -1, needsLedgerLine: false },
  { name: "Eb", octave: 4, frequency: 311.13, staffPosition: 0, needsLedgerLine: false, accidental: "flat" },
  { name: "E", octave: 4, frequency: 329.63, staffPosition: 0, needsLedgerLine: false },
  { name: "F", octave: 4, frequency: 349.23, staffPosition: 1, needsLedgerLine: false },
  { name: "F#", octave: 4, frequency: 369.99, staffPosition: 1, needsLedgerLine: false, accidental: "sharp" },
  { name: "G", octave: 4, frequency: 392.0, staffPosition: 2, needsLedgerLine: false },
  { name: "Ab", octave: 4, frequency: 415.3, staffPosition: 3, needsLedgerLine: false, accidental: "flat" },
  { name: "A", octave: 4, frequency: 440.0, staffPosition: 3, needsLedgerLine: false },
  { name: "Bb", octave: 4, frequency: 466.16, staffPosition: 4, needsLedgerLine: false, accidental: "flat" },
  { name: "B", octave: 4, frequency: 493.88, staffPosition: 4, needsLedgerLine: false },
  { name: "C", octave: 5, frequency: 523.25, staffPosition: 5, needsLedgerLine: false },
];

// Level 5: A3–E5 chromatic (~24 notes) — full range with accidentals
const LEVEL_5: Note[] = [
  { name: "A", octave: 3, frequency: 220.0, staffPosition: -4, needsLedgerLine: true },
  { name: "Bb", octave: 3, frequency: 233.08, staffPosition: -3, needsLedgerLine: false, accidental: "flat" },
  { name: "B", octave: 3, frequency: 246.94, staffPosition: -3, needsLedgerLine: false },
  ...LEVEL_4,
  { name: "C#", octave: 5, frequency: 554.37, staffPosition: 5, needsLedgerLine: false, accidental: "sharp" },
  { name: "D", octave: 5, frequency: 587.33, staffPosition: 6, needsLedgerLine: false },
  { name: "Eb", octave: 5, frequency: 622.25, staffPosition: 7, needsLedgerLine: false, accidental: "flat" },
  { name: "E", octave: 5, frequency: 659.25, staffPosition: 7, needsLedgerLine: false },
];

export const trebleNoteReading: Exercise = {
  id: "treble-note-reading",
  name: "Treble Clef",
  clef: "treble",
  levels: [
    { id: "treble-1", label: "Level 1", subtitle: "C4–C5 naturals", notes: LEVEL_1 },
    { id: "treble-2", label: "Level 2", subtitle: "B3–D5 naturals", notes: LEVEL_2 },
    { id: "treble-3", label: "Level 3", subtitle: "A3–E5 naturals", notes: LEVEL_3 },
    { id: "treble-4", label: "Level 4", subtitle: "C4–C5 chromatic", notes: LEVEL_4 },
    { id: "treble-5", label: "Level 5", subtitle: "A3–E5 chromatic", notes: LEVEL_5 },
  ],
};
