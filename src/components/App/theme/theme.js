/* @flow */

import WebFont from 'webfontloader';
// import { css } from '@xstyled/emotion';

const rgb = (value: number) => `#${value.toString(16).padStart(6, '0')}`;

WebFont.load({
  google: {
    families: [
      'Fira+Sans+Extra+Condensed:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i:cyrillic,cyrillic-ext,latin-ext',
      'Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i:cyrillic,cyrillic-ext,latin-ext',
    ],
  },
});

export const colors = {
  body: rgb(0x000000),
  textOnBody: rgb(0xffffff),
  bodyContrast: rgb(0xffffff),
  textOnBodyContrast: rgb(0x000000),
  accent: rgb(0xff8800),
};

export const colorStyles = {};

// const def = [0, 12, 14, 16, 20, 24, 32, 48, 64, 72];

// export const fontSizes = {};

export const fonts = {
  display: 'Fira Sans Extra Condensed',
  base: 'Roboto',
};

export const textStyles = {};

export const fontWeights = {};

export const lineHeights = {};

export const letterSpacings = {};

export const space = {};

export const sizes = {
  note: { x: '64px', y: '64px' },
};

export const borderWidths = {};

export const borderStyles = {};

export const borders = {};

export const radii = {};

export const shadows = {};

export const zIndices = {};

export const transitions = {};
