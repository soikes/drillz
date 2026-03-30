# Piano Drillz

iOS app for practicing piano note recognition. Play notes on a real piano, the app listens via microphone and scores you.

## Exercises

- **Treble Clef** — 5 levels from C4-C5 naturals to full chromatic range
- **Bass Clef** — 5 levels from C3-C4 naturals to full chromatic range

Swipe left/right for difficulty levels, up/down for exercise types.

## Stack

- Expo SDK 55 / React Native
- `react-native-audio-api` for real-time mic input
- YIN pitch detection algorithm
- `react-native-gesture-handler` + `react-native-reanimated` for swipe navigation
- `react-native-svg` for staff rendering

## Run

```bash
npm install
npx expo run:ios --device
```

Requires a dev client build (no Expo Go) due to native audio modules. Physical device needed for mic input.
