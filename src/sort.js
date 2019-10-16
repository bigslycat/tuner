/* @flow */

const swap = (index1 /* : number */, index2 /* : number */, arr /* : any[] */) => {
  const value1 = arr[index1];
  // eslint-disable-next-line no-param-reassign
  arr[index1] = arr[index2];
  // eslint-disable-next-line no-param-reassign
  arr[index2] = value1;
};

export const bubbleSort = /* :: <T> */ (
  comparator /* : (a: T, b: T) => number */,
  array /* : $ReadOnlyArray<T> */,
) /* : $ReadOnlyArray<T> */ => {
  const newArray /* : T[] */ = [...array];

  const count = newArray.length - 1;

  // eslint-disable-next-line flowtype/require-variable-type
  for (let offset = 0; offset < count; offset += 1) {
    const end = count - offset;

    // eslint-disable-next-line flowtype/require-variable-type
    for (let index = 0; index < end; index += 1) {
      const current = newArray[index];
      const next = newArray[index + 1];

      const result = comparator(current, next);

      if (Number.isNaN(result)) throw new RangeError('comparator return value is NaN');
      if (result > 0) swap(index, index + 1, newArray);
    }
  }

  return newArray;
};

export const getIndexOfMin = /* :: <T> */ (
  comparator /* : (a: T, b: T) => number */,
  from /* : number */,
  array /* : $ReadOnlyArray<T> */,
) /* : number */ => {
  // eslint-disable-next-line flowtype/require-variable-type
  let minIndex = from;

  const { length } = array;

  // eslint-disable-next-line flowtype/require-variable-type
  for (let index = from + 1; index < length; index += 1) {
    const result = comparator(array[index], array[minIndex]);
    if (result < 0) minIndex = index;
  }

  return minIndex;
};

export const selectSort = /* :: <T> */ (
  comparator /* : (a: T, b: T) => number */,
  array /* : $ReadOnlyArray<T> */,
) /* : $ReadOnlyArray<T> */ => {
  const newArray /* : T[] */ = [...array];

  const count = newArray.length - 1;

  // eslint-disable-next-line flowtype/require-variable-type
  for (let index = 0; index < count; index += 1) {
    const minIndex = getIndexOfMin(comparator, index, newArray);
    if (index !== minIndex) swap(minIndex, index, newArray);
  }

  return newArray;
};

export const fastSort = /* :: <T> */ (
  comparator /* : (a: T, b: T) => number */,
  array /* : $ReadOnlyArray<T> */,
) /* : $ReadOnlyArray<T> */ => {
  const newArray /* : T[] */ = [...array];

  return newArray;
};

const comparator = (a, b) => a - b;

const data = Array.from({ length: 10 }, () => Math.random()).sort((a, b) => -comparator(a, b));

const result = selectSort(comparator, data);

console.log([...data].sort(comparator).map((value, i) => [value === result[i], value, result[i]]));
