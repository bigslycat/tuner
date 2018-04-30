/* @flow */

import * as React from 'react';
import { render } from 'react-dom';

import { injectGlobal } from 'styled-components';

import { App } from './components/App';

injectGlobal`
  html, body {
    padding:0;
    margin: 0;
    height: 100%;
  }

  #root {
    padding:0;
    margin: 0;
    width: 100%;
    height: 100%;
  }
`;

render(<App />, (document: any).getElementById('root'));
