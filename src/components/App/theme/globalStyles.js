/* @flow */

import { createGlobalStyle } from '@xstyled/emotion';
import { normalize } from 'polished';

export const Global = createGlobalStyle`
  ${normalize()}

  html,
  body {
    height: max;
    margin: 0;
    padding: 0;
  }

  #root {
    height: max;
  }
`;
