/* @flow */

import * as React from 'react';
import styled from 'styled-components';
import sys from 'system-components';

import { Tuner } from '../Tuner';

const Text = sys(
  {
    is: 'p',
    m: 0,
    pb: '0.5em',
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 300,
  },
  'weight',
  'textAlign',
  'space',
  'fontSize',
);

export const App = styled(props => (
  <div className={props.className}>
    <Text>Musical tuner</Text>
    <Tuner />
  </div>
))`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: black;
  font-family: 'Yanone Kaffeesatz';
  color: white;
`;
