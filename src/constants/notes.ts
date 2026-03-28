export interface Note {
  name: string;
  octave: number;
  frequency: number;
  /** Steps from bottom line (E4=0). Each step is one line or space. */
  staffPosition: number;
  /** Whether this note sits on a ledger line */
  needsLedgerLine: boolean;
}

export const LEVEL_1_NOTES: Note[] = [
  { name: "C", octave: 4, frequency: 261.63, staffPosition: -2, needsLedgerLine: true },
  { name: "D", octave: 4, frequency: 293.66, staffPosition: -1, needsLedgerLine: false },
  { name: "E", octave: 4, frequency: 329.63, staffPosition: 0, needsLedgerLine: false },
  { name: "F", octave: 4, frequency: 349.23, staffPosition: 1, needsLedgerLine: false },
  { name: "G", octave: 4, frequency: 392.0, staffPosition: 2, needsLedgerLine: false },
  { name: "A", octave: 4, frequency: 440.0, staffPosition: 3, needsLedgerLine: false },
  { name: "B", octave: 4, frequency: 493.88, staffPosition: 4, needsLedgerLine: false },
  { name: "C", octave: 5, frequency: 523.25, staffPosition: 5, needsLedgerLine: false },
];

export function noteLabel(note: Note): string {
  return `${note.name}${note.octave}`;
}

/** Returns the number of semitones between two frequencies */
export function centsDistance(f1: number, f2: number): number {
  return Math.abs(12 * Math.log2(f1 / f2));
}

/** Check if a detected frequency matches a target note (within 1.5 semitones) */
export function isNoteMatch(detectedFreq: number, targetNote: Note): boolean {
  return centsDistance(detectedFreq, targetNote.frequency) < 1.5;
}

/** Find the closest note from a list given a frequency */
export function findClosestNote(
  frequency: number,
  notes: Note[]
): Note | null {
  let closest: Note | null = null;
  let minDistance = Infinity;

  for (const note of notes) {
    const dist = centsDistance(frequency, note.frequency);
    if (dist < minDistance) {
      minDistance = dist;
      closest = note;
    }
  }

  return minDistance < 2.0 ? closest : null;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
