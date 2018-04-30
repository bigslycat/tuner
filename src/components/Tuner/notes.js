/* @flow */

export const octaves = [
  {
    C: 16.352,
    'C#': 17.324,
    D: 18.354,
    'D#': 19.445,
    E: 20.602,
    F: 21.827,
    'F#': 23.125,
    G: 24.5,
    'G#': 25.957,
    A: 27.5,
    'A#': 29.135,
    B: 30.868,
  },
  {
    C: 32.703,
    'C#': 34.648,
    D: 36.708,
    'D#': 38.891,
    E: 41.203,
    F: 43.654,
    'F#': 46.249,
    G: 48.999,
    'G#': 51.913,
    A: 55,
    'A#': 58.27,
    B: 61.735,
  },
  {
    C: 65.406,
    'C#': 69.296,
    D: 73.416,
    'D#': 77.782,
    E: 82.407,
    F: 87.307,
    'F#': 92.499,
    G: 97.999,
    'G#': 103.83,
    A: 110,
    'A#': 116.54,
    B: 123.47,
  },
  {
    C: 130.81,
    'C#': 138.59,
    D: 146.83,
    'D#': 155.56,
    E: 164.81,
    F: 174.61,
    'F#': 185,
    G: 196,
    'G#': 207.65,
    A: 220,
    'A#': 233.08,
    B: 246.94,
  },
  {
    C: 261.63,
    'C#': 277.18,
    D: 293.66,
    'D#': 311.13,
    E: 329.63,
    F: 349.23,
    'F#': 369.99,
    G: 392,
    'G#': 415.3,
    A: 440,
    'A#': 466.16,
    B: 493.88,
  },
  {
    C: 523.25,
    'C#': 554.37,
    D: 587.33,
    'D#': 622.25,
    E: 659.26,
    F: 698.46,
    'F#': 739.99,
    G: 783.99,
    'G#': 830.61,
    A: 880,
    'A#': 932.33,
    B: 987.77,
  },
  {
    C: 1046.5,
    'C#': 1108.7,
    D: 1174.7,
    'D#': 1244.5,
    E: 1318.5,
    F: 1396.9,
    'F#': 1480,
    G: 1568,
    'G#': 1661.2,
    A: 1760,
    'A#': 1864.7,
    B: 1975.5,
  },
  {
    C: 2093,
    'C#': 2217.5,
    D: 2349.3,
    'D#': 2489,
    E: 2637,
    F: 2793.8,
    'F#': 2960,
    G: 3136,
    'G#': 3322.4,
    A: 3520,
    'A#': 3729.3,
    B: 3951.1,
  },
  {
    C: 4186,
    'C#': 4434.9,
    D: 4698.6,
    'D#': 4978,
    E: 5274,
    F: 5587.7,
    'F#': 5919.9,
    G: 6271.9,
    'G#': 6644.9,
    A: 7040,
    'A#': 7458.6,
    B: 7902.1,
  },
  {
    C: 8372,
    'C#': 8869.8,
    D: 9397.3,
    'D#': 9956.1,
    E: 10548,
    F: 11175,
    'F#': 11840,
    G: 12544,
    'G#': 13290,
    A: 14080,
    'A#': 14917,
    B: 15804,
  },
  {
    C: 16744,
    'C#': 17739.7,
    D: 18794.5,
    'D#': 19912.1,
    E: 21096.2,
    F: 22350.6,
    'F#': 23679.6,
    G: 25087.7,
    'G#': 26579.5,
    A: 28160,
    'A#': 29834.5,
    B: 31608.5,
  },
];

export const notes = octaves.reduce((acc, octave, octaveIndex) => {
  Object.entries(octave).forEach(([noteLabel, frequency]) => {
    acc[noteLabel + octaveIndex] = frequency;
  });
  return acc;
}, {});

type Note = {
  label: string,
  frequency: number,
};

export const indexedNotes: $ReadOnlyArray<Note> = Object.entries(notes).map(
  ([label, frequency]: any): Note => ({
    label,
    frequency,
  }),
);
