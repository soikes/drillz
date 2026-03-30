import { Note } from "../constants/notes";
import { Exercise } from "./exercises";

// Bass clef staff positions (bottom line G2 = 0):
// G2=0, A2=1, B2=2, C3=3, D3=4, E3=5, F3=6, G3=7, A3=8
// Ledger lines above: B3=9 (space), C4=10 (first ledger line)
// Ledger lines below: F2=-1 (space), E2=-2 (first ledger line)

// Level 1: C3–C4 naturals (8 notes) — one octave in middle of bass staff
const LEVEL_1: Note[] = [
  { name: "C", octave: 3, frequency: 130.81, staffPosition: 3, needsLedgerLine: false },
  { name: "D", octave: 3, frequency: 146.83, staffPosition: 4, needsLedgerLine: false },
  { name: "E", octave: 3, frequency: 164.81, staffPosition: 5, needsLedgerLine: false },
  { name: "F", octave: 3, frequency: 174.61, staffPosition: 6, needsLedgerLine: false },
  { name: "G", octave: 3, frequency: 196.0, staffPosition: 7, needsLedgerLine: false },
  { name: "A", octave: 3, frequency: 220.0, staffPosition: 8, needsLedgerLine: false },
  { name: "B", octave: 3, frequency: 246.94, staffPosition: 9, needsLedgerLine: false },
  { name: "C", octave: 4, frequency: 261.63, staffPosition: 10, needsLedgerLine: true },
];

// Level 2: G2–D4 naturals (12 notes) — full staff range
const LEVEL_2: Note[] = [
  { name: "G", octave: 2, frequency: 98.0, staffPosition: 0, needsLedgerLine: false },
  { name: "A", octave: 2, frequency: 110.0, staffPosition: 1, needsLedgerLine: false },
  { name: "B", octave: 2, frequency: 123.47, staffPosition: 2, needsLedgerLine: false },
  ...LEVEL_1,
  { name: "D", octave: 4, frequency: 293.66, staffPosition: 11, needsLedgerLine: false },
];

// Level 3: E2–E4 naturals (15 notes) — with ledger lines
const LEVEL_3: Note[] = [
  { name: "E", octave: 2, frequency: 82.41, staffPosition: -2, needsLedgerLine: true },
  { name: "F", octave: 2, frequency: 87.31, staffPosition: -1, needsLedgerLine: false },
  ...LEVEL_2,
  { name: "E", octave: 4, frequency: 329.63, staffPosition: 12, needsLedgerLine: true },
];

// Level 4: C3–C4 chromatic (13 notes) — sharps/flats in small range
const LEVEL_4: Note[] = [
  { name: "C", octave: 3, frequency: 130.81, staffPosition: 3, needsLedgerLine: false },
  { name: "C#", octave: 3, frequency: 138.59, staffPosition: 3, needsLedgerLine: false, accidental: "sharp" },
  { name: "D", octave: 3, frequency: 146.83, staffPosition: 4, needsLedgerLine: false },
  { name: "Eb", octave: 3, frequency: 155.56, staffPosition: 5, needsLedgerLine: false, accidental: "flat" },
  { name: "E", octave: 3, frequency: 164.81, staffPosition: 5, needsLedgerLine: false },
  { name: "F", octave: 3, frequency: 174.61, staffPosition: 6, needsLedgerLine: false },
  { name: "F#", octave: 3, frequency: 185.0, staffPosition: 6, needsLedgerLine: false, accidental: "sharp" },
  { name: "G", octave: 3, frequency: 196.0, staffPosition: 7, needsLedgerLine: false },
  { name: "Ab", octave: 3, frequency: 207.65, staffPosition: 8, needsLedgerLine: false, accidental: "flat" },
  { name: "A", octave: 3, frequency: 220.0, staffPosition: 8, needsLedgerLine: false },
  { name: "Bb", octave: 3, frequency: 233.08, staffPosition: 9, needsLedgerLine: false, accidental: "flat" },
  { name: "B", octave: 3, frequency: 246.94, staffPosition: 9, needsLedgerLine: false },
  { name: "C", octave: 4, frequency: 261.63, staffPosition: 10, needsLedgerLine: true },
];

// Level 5: E2–E4 chromatic (~28 notes) — full range with accidentals
const LEVEL_5: Note[] = [
  { name: "E", octave: 2, frequency: 82.41, staffPosition: -2, needsLedgerLine: true },
  { name: "F", octave: 2, frequency: 87.31, staffPosition: -1, needsLedgerLine: false },
  { name: "F#", octave: 2, frequency: 92.5, staffPosition: -1, needsLedgerLine: false, accidental: "sharp" },
  { name: "G", octave: 2, frequency: 98.0, staffPosition: 0, needsLedgerLine: false },
  { name: "Ab", octave: 2, frequency: 103.83, staffPosition: 1, needsLedgerLine: false, accidental: "flat" },
  { name: "A", octave: 2, frequency: 110.0, staffPosition: 1, needsLedgerLine: false },
  { name: "Bb", octave: 2, frequency: 116.54, staffPosition: 2, needsLedgerLine: false, accidental: "flat" },
  { name: "B", octave: 2, frequency: 123.47, staffPosition: 2, needsLedgerLine: false },
  ...LEVEL_4,
  { name: "C#", octave: 4, frequency: 277.18, staffPosition: 10, needsLedgerLine: true, accidental: "sharp" },
  { name: "D", octave: 4, frequency: 293.66, staffPosition: 11, needsLedgerLine: false },
  { name: "Eb", octave: 4, frequency: 311.13, staffPosition: 12, needsLedgerLine: true, accidental: "flat" },
  { name: "E", octave: 4, frequency: 329.63, staffPosition: 12, needsLedgerLine: true },
];

export const bassNoteReading: Exercise = {
  id: "bass-note-reading",
  name: "Bass Clef",
  clef: "bass",
  levels: [
    { id: "bass-1", label: "Level 1", subtitle: "C3–C4 naturals", notes: LEVEL_1 },
    { id: "bass-2", label: "Level 2", subtitle: "G2–D4 naturals", notes: LEVEL_2 },
    { id: "bass-3", label: "Level 3", subtitle: "E2–E4 naturals", notes: LEVEL_3 },
    { id: "bass-4", label: "Level 4", subtitle: "C3–C4 chromatic", notes: LEVEL_4 },
    { id: "bass-5", label: "Level 5", subtitle: "E2–E4 chromatic", notes: LEVEL_5 },
  ],
};
