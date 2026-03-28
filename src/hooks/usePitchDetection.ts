import { useCallback, useRef, useState } from "react";
import { Alert } from "react-native";
import { AudioRecorder, AudioManager } from "react-native-audio-api";

const SAMPLE_RATE = 16000;
const BUFFER_LENGTH = 1600;
const MIN_FREQUENCY = 60;
const MAX_FREQUENCY = 1500;

function detectPitchYIN(buffer: Float32Array, sampleRate: number): number | null {
  const bufferSize = buffer.length;
  const minPeriod = Math.floor(sampleRate / MAX_FREQUENCY);
  const maxPeriod = Math.floor(sampleRate / MIN_FREQUENCY);
  const halfBuffer = Math.floor(bufferSize / 2);
  const actualMaxPeriod = Math.min(maxPeriod, halfBuffer);

  if (actualMaxPeriod <= minPeriod) return null;

  let rms = 0;
  for (let i = 0; i < bufferSize; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / bufferSize);
  if (rms < 0.005) return null;

  const diff = new Float32Array(actualMaxPeriod);
  for (let tau = minPeriod; tau < actualMaxPeriod; tau++) {
    let sum = 0;
    for (let i = 0; i < halfBuffer; i++) {
      const delta = buffer[i] - buffer[i + tau];
      sum += delta * delta;
    }
    diff[tau] = sum;
  }

  const cmndf = new Float32Array(actualMaxPeriod);
  cmndf[minPeriod] = 1;
  let runningSum = diff[minPeriod];

  for (let tau = minPeriod + 1; tau < actualMaxPeriod; tau++) {
    runningSum += diff[tau];
    cmndf[tau] = diff[tau] / (runningSum / (tau - minPeriod + 1));
  }

  const threshold = 0.3;
  let bestTau = -1;

  for (let tau = minPeriod; tau < actualMaxPeriod; tau++) {
    if (cmndf[tau] < threshold) {
      while (tau + 1 < actualMaxPeriod && cmndf[tau + 1] < cmndf[tau]) {
        tau++;
      }
      bestTau = tau;
      break;
    }
  }

  if (bestTau === -1) {
    let minVal = Infinity;
    for (let tau = minPeriod; tau < actualMaxPeriod; tau++) {
      if (cmndf[tau] < minVal) {
        minVal = cmndf[tau];
        bestTau = tau;
      }
    }
    if (minVal > 0.7) return null;
  }

  if (bestTau === -1) return null;

  let betterTau = bestTau;
  if (bestTau > minPeriod && bestTau < actualMaxPeriod - 1) {
    const s0 = cmndf[bestTau - 1];
    const s1 = cmndf[bestTau];
    const s2 = cmndf[bestTau + 1];
    const shift = (s0 - s2) / (2 * (s0 - 2 * s1 + s2));
    if (Math.abs(shift) < 1) {
      betterTau = bestTau + shift;
    }
  }

  return sampleRate / betterTau;
}

export interface PitchDetectionResult {
  frequency: number | null;
  audioLevel: number;
  isListening: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
}

export function usePitchDetection(): PitchDetectionResult {
  const [frequency, setFrequency] = useState<number | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const recorderRef = useRef<AudioRecorder | null>(null);

  const startListening = useCallback(async () => {
    // Clean up any existing recorder first
    if (recorderRef.current) {
      recorderRef.current.clearOnAudioReady();
      try { recorderRef.current.stop(); } catch {}
      recorderRef.current = null;
    }

    const status = await AudioManager.requestRecordingPermissions();
    if (status !== "Granted") {
      Alert.alert(
        "Microphone Access Required",
        "Please enable microphone access in Settings to use this app."
      );
      return;
    }

    AudioManager.setAudioSessionOptions({
      iosCategory: "record",
      iosMode: "measurement",
      iosOptions: [],
    });

    await AudioManager.setAudioSessionActivity(true);

    // Create a fresh recorder each time
    const recorder = new AudioRecorder();

    recorder.onAudioReady(
      {
        sampleRate: SAMPLE_RATE,
        bufferLength: BUFFER_LENGTH,
        channelCount: 1,
      },
      (event) => {
        const channelData = event.buffer.getChannelData(0);

        let rms = 0;
        for (let i = 0; i < channelData.length; i++) {
          rms += channelData[i] * channelData[i];
        }
        rms = Math.sqrt(rms / channelData.length);
        setAudioLevel(Math.min(1, rms / 0.3));

        const detected = detectPitchYIN(channelData, event.buffer.sampleRate);
        setFrequency(detected);
      }
    );

    recorder.start();
    recorderRef.current = recorder;
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.clearOnAudioReady();
      try { recorderRef.current.stop(); } catch {}
      recorderRef.current = null;
    }
    AudioManager.setAudioSessionActivity(false);
    setIsListening(false);
    setFrequency(null);
    setAudioLevel(0);
  }, []);

  return { frequency, audioLevel, isListening, startListening, stopListening };
}
