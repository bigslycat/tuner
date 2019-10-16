/* @flow */

import {
  createEvent,
  createEffect,
  createStore,
  restoreEvent,
  createStoreObject,
  type Event,
  type Effect,
  type Store,
} from 'effector';

import { createSpline } from './createSpline';
import { getExtremum } from './getExtremum';
import { indexedNotes } from './notes';
import { getMaxGainIndex } from './getMaxGainIndex';
import { roundN } from './roundN';

const log2 = Math.log(2);
const round2 = roundN(2);

export const setIntervalTime: Event<number> = createEvent();
export const setFFTSize: Event<number> = createEvent();
export const setSampleRate: Event<number> = createEvent();
export const setPrecision: Event<number> = createEvent();

const reset: Event<void> = createEvent();
const setMaxGainIndex: Event<number> = createEvent();
const setMaxGainOffset: Event<number> = createEvent();
const requestMicroAccess: Effect<void, MediaStream> = createEffect().use((): Promise<MediaStream> =>
  navigator.mediaDevices
    ? navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    : Promise.reject(new Error('navigator.mediaDevices is not defined')),
);

const intervalTime$: Store<number> = restoreEvent(setIntervalTime, 300);
const fftSize$: Store<number> = restoreEvent(setFFTSize, 32768);
const sampleRate$: Store<number> = restoreEvent(setSampleRate, 48000);
const precision$: Store<number> = restoreEvent(setPrecision, 10);
const frequencyBinCount$: Store<number> = fftSize$.map(fftSize => fftSize / 2);
const spline$: Store<(data: Float64Array) => $ReadOnlyArray<[number, number]>> = precision$.map(
  createSpline,
);

export const start: Event<void> = requestMicroAccess.prepend(() => {});
export const stop: Event<void> = createEvent();

const mediaStream$: Store<null | MediaStream> = createStore(null)
  .on(requestMicroAccess.done, (_, { result }) => result)
  .reset(stop);

export const active$: Store<boolean> = mediaStream$.map(stream => !!stream);
export const pending$: Store<boolean> = requestMicroAccess.pending;
export const mediaStreamError$: Store<null | Error> = createStore(null)
  .on(requestMicroAccess.fail, (_, { error }) => error)
  .reset(requestMicroAccess, requestMicroAccess.done, stop);

mediaStreamError$.watch(console.error);

export const maxGainIndex$: Store<null | number> = createStore(null)
  .on(setMaxGainIndex, (_, payload) => payload)
  .reset(reset);

export const maxGainOffset$: Store<null | number> = createStore(null)
  .on(setMaxGainOffset, (_, payload) => payload)
  .reset(reset);

export const maxGainFrequency$: Store<null | number> = createStoreObject({
  maxGainOffset: maxGainOffset$,
  fftSize: fftSize$,
  sampleRate: sampleRate$,
}).map(({ maxGainOffset, fftSize, sampleRate }) =>
  maxGainOffset === null ? null : (maxGainOffset * sampleRate) / fftSize,
);

export const noteOffset$: Store<null | number> = maxGainFrequency$.map(frequency =>
  frequency === null ? null : Math.max(0, 12 * (Math.log(frequency / 440) / log2) + 57),
);

export const noteIndex$: Store<null | number> = noteOffset$.map(offset =>
  offset === null ? null : Math.round(offset),
);

const { length } = indexedNotes;

export const positionOffset$: Store<null | number> = noteOffset$.map(noteOffset =>
  noteOffset === null ? null : round2((noteOffset / length) * 100),
);

let data: Float32Array = new Float32Array(frequencyBinCount$.getState());

frequencyBinCount$.watch(frequencyBinCount => {
  data = new Float32Array(frequencyBinCount);
});

mediaStream$.watch(state => !state && reset());

const analyser$: Store<null | AnalyserNode> = createStoreObject({
  mediaStream: mediaStream$,
  fftSize: fftSize$,
  sampleRate: sampleRate$,
})
  .map(({ mediaStream, fftSize, sampleRate }, prevInstance: *) => {
    if (prevInstance) {
      prevInstance.analyser.disconnect();
      prevInstance.micro.disconnect();
      prevInstance.connectionNode.disconnect();
      prevInstance.ctx.close();
      prevInstance.mediaStream.getTracks().forEach(track => track.stop());
    }

    if (mediaStream) {
      const ctx: AudioContext = new (AudioContext: any)({ sampleRate });
      const analyser: AnalyserNode = new (AnalyserNode: any)(ctx, { fftSize, sampleRate });
      const micro: MediaStreamAudioSourceNode = new (MediaStreamAudioSourceNode: any)(ctx, {
        mediaStream,
      });

      const connectionNode: AudioNode = micro.connect(analyser);

      return { ctx, analyser, micro, connectionNode, mediaStream };
    }

    return null;
  })
  .map(instance => instance && instance.analyser);

createStoreObject({
  analyser: analyser$,
  intervalTime: intervalTime$,
  spline: spline$,
}).map(({ analyser, intervalTime, spline }, interval: ?IntervalID): null | IntervalID => {
  if (interval) clearInterval(interval);
  return (
    analyser &&
    setInterval(() => {
      analyser.getFloatFrequencyData(data);

      const maxGainIndex = getMaxGainIndex(data);

      const from = Math.max(0, maxGainIndex - 3);
      const slice = Float64Array.from(data.slice(from, maxGainIndex + 3));
      const splinedSlice = spline(slice);
      const maxGainOffset = getExtremum(splinedSlice) + from;

      setMaxGainIndex(maxGainIndex);
      setMaxGainOffset(maxGainOffset);
    }, intervalTime)
  );
});
