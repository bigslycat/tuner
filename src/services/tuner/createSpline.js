/* @flow */

import interpolator from 'natural-spline-interpolator';

const reducer = (
  // eslint-disable-next-line flowtype/no-mutable-array
  acc: Array<[number, number]>,
  value: number,
  index: number,
  // eslint-disable-next-line flowtype/no-mutable-array
): Array<[number, number]> => {
  acc.push([index, value]);
  return acc;
};

export const createSpline = (coefficient: number) => (
  data: Float64Array,
): $ReadOnlyArray<[number, number]> => {
  const interpolate = interpolator(data.reduce(reducer, []));

  const length = (data.length - 1) * coefficient + 1;

  return Array.from({ length }, (_, index) => {
    const key = index / coefficient;
    const value = interpolate(key);
    return [key, value];
  });
};
