/* @flow */

export const getMaxGainIndex = (data: Float32Array): number => {
  let maxGain: number = -Infinity;
  let maxGainIndex: number = -1;

  data.forEach((gain, index) => {
    if (gain > maxGain) {
      maxGain = gain;
      maxGainIndex = index;
    }
  });

  return maxGainIndex;
};
