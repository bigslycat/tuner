/* @flow */

export const createPitcher = (
  audioContext: AudioContext,
  analyser: AnalyserNode,
) => {
  const data = new Float32Array(analyser.frequencyBinCount);

  const frequencies = data.map(
    (v, k) => k * audioContext.sampleRate / (analyser.frequencyBinCount * 2),
  );

  return (): number => {
    analyser.getFloatFrequencyData(data);

    let lastGain = -Infinity;
    let lastFrequency = -1;

    data.forEach((gain, index) => {
      if (gain > lastGain) {
        lastGain = gain;
        lastFrequency = frequencies[index];
      }
    });

    return lastFrequency;
  };
};
