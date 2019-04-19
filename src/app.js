/* @flow */

import * as React from 'react';
import { render } from 'react-dom';

import { createGlobalStyle } from 'styled-components';

import packageJSON from '../package.json';

import { App } from './components/App';

const GlobalStyle = createGlobalStyle`
  @import 'https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:200,300,400,700';

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

render(
  <>
    <GlobalStyle />
    <App version={packageJSON.version} />
  </>,
  (document: any).getElementById('root'),
);
