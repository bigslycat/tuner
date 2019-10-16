/* @flow */

export const getExtremum = (data: $ReadOnlyArray<[number, number]>): number =>
  data.reduce((prev, next) => (next[1] > prev[1] ? next : prev))[0];
