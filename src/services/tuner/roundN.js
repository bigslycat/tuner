/* @flow */

export const roundN = (precision: number) => {
  const coefficient = 10 ** precision;
  return (value: number): number => Math.round(value * coefficient) / coefficient;
};
