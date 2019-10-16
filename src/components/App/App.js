/* @flow */

import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import styled, { ThemeProvider, css } from '@xstyled/emotion';
import { th } from '@xstyled/system';
import { opacify } from 'polished';
import { useStore } from 'effector-react';

import { theme, Global } from './theme';

import {
  start,
  stop,
  indexedNotes,
  noteIndex$,
  positionOffset$,
  active$,
  pending$,
  mediaStreamError$,
} from '../../services/tuner';

const AppBody = styled.div`
  height: 100%;

  display: grid;
  row-gap: 32px;
  grid-template-columns: auto minmax(200px, 800px) auto;
  grid-template-rows: auto 40px 80px 48px auto;
  grid-template-areas:
    '. .      .'
    '. header .'
    '. main  .'
    '. footer .'
    '. .      .';

  background-color: body;
`;

const Heading1: React$AbstractComponent<{}, HTMLHeadingElement> = styled.h1Box`
  color: textOnBody;
  font-size: 40;
  line-height: 1em;
  font-family: display;
  font-weight: 700;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
  margin: 0;
  padding: 0;
  text-align: center;
`;

const TunerBody: React$AbstractComponent<{}, HTMLDivElement> = React.memo(styled.box`
  position: relative;
  overflow: hidden;
  background-color: bodyContrast;
  cursor: default;

  transition: all 1000ms ease-in-out;

  ${props =>
    !props.active &&
    css`
      filter: blur(1px);
      opacity: 0.2;
    `}

  :before {
    box-shadow: inset 0 0 20px 3px black;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    ${props => {
      const transparent = opacify(-1, props.theme.colors.body);
      return css`
        background-image: linear-gradient(
          90deg,
          ${props.theme.colors.body} 0,
          ${transparent} calc(50% - 24px),
          ${transparent} calc(50% + 24px),
          ${props.theme.colors.body} 100%
        );
      `;
    }}
  }
`);

const TunerWrapper: React$AbstractComponent<{}, HTMLDivElement> = React.memo(styled.div`
  padding-left: 50%;
  padding-top: 15px;
  padding-bottom: 15px;
  position: relative;
  height: 100%;
  width: 100%;
  box-sizing: border-box;

  :before,
  :after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    left: calc(50% - 5px);
  }

  :before {
    top: 0;
    border-width: 5px 5px 0 5px;
    border-color: ${th.color('body')} transparent transparent transparent;
  }

  :after {
    bottom: 0;
    border-width: 0 5px 5px 5px;
    border-color: transparent transparent ${th.color('body')} transparent;
  }
`);

const noteBodyCurrent = css`
  color: textOnBody;
  background-color: body;

  :before,
  :after {
    opacity: 1;
  }
`;

export const NoteBody: React$AbstractComponent<{}, HTMLDivElement> = React.memo(styled.div`
  color: textOnBodyContrast;
  background-color: transparent;
  transition: color 300ms ease-in-out, background-color 300ms ease-in-out;
  transform: translateX(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  font-family: display;
  font-size: 24px;

  border-radius: 5px;

  :before,
  :after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    transition: opacity 300ms ease-in-out;
    opacity: 0;
  }

  :before {
    border-width: 0 5px 5px 5px;
    border-color: transparent transparent ${th.color('body')} transparent;
    top: -5px;
  }

  :after {
    border-width: 5px 5px 0 5px;
    border-color: ${th.color('body')} transparent transparent transparent;
    bottom: -5px;
  }

  ${props => props.current && noteBodyCurrent}
`);

export const Note: React$ComponentType<{
  index: number,
}> = React.memo(props => {
  const noteIndex = useStore(noteIndex$);
  const current = props.index === noteIndex;
  const { label } = indexedNotes[props.index];
  return <NoteBody current={current}>{label}</NoteBody>;
});

const noteBlockSize = 48;
const notesBodySize = noteBlockSize * indexedNotes.length;

export const NotesBody: React$AbstractComponent<{}, HTMLDivElement> = React.memo(styled.div`
  display: grid;
  grid-template-columns: repeat(${indexedNotes.length}, ${noteBlockSize}px);
  transition: transform 400ms ease-in-out;
  width: ${notesBodySize}px;
  height: 100%;
`);

export const Tuner: React$ComponentType<{}> = React.memo(props => {
  // eslint-disable-next-line react/no-array-index-key
  const notes = React.useMemo(() => indexedNotes.map((note, i) => <Note index={i} key={i} />), []);
  const positionOffset = useStore(positionOffset$) || 0;
  const active = useStore(active$);

  return (
    <TunerBody {...props} active={active}>
      <TunerWrapper>
        <NotesBody
          style={{
            transform: `translateX(${-positionOffset}%)`,
          }}>
          {notes}
        </NotesBody>
      </TunerWrapper>
    </TunerBody>
  );
});

export const Button: React$AbstractComponent<{}, HTMLButtonElement> = styled.buttonBox`
  color: black;
  background-color: #ff8800;
  border: none;
  font-family: base;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 24px;
  box-sizing: border-box;
  height: 48px;
  padding: 0 21px;
  border-radius: 5px;
  border: solid 3px #ff8800;
  ${props =>
    props.outline &&
    css`
      color: #ff8800;
      background-color: transparent;
    `}
`;

const AppBranch: React$ComponentType<{}> = () => {
  const active = useStore(active$);
  const pending = useStore(pending$);
  const error = useStore(mediaStreamError$);

  if (pending) {
    return null;
  }

  if (error) {
    return (
      <>
        <Body>
          {error.name === 'NotAllowedError'
            ? "I can't work without microphone access. Please reset your decision in browser and retry."
            : error.message}
        </Body>
        <Footer>
          <Button onClick={start} mr='16px'>
            Retry
          </Button>
          <Button onClick={stop} outline>
            Cancel
          </Button>
        </Footer>
      </>
    );
  }

  if (active) {
    return (
      <Footer>
        <Button onClick={stop} outline>
          Stop
        </Button>
      </Footer>
    );
  }

  return (
    <Footer>
      <Button onClick={start}>Start</Button>
    </Footer>
  );
};

const Body: React$AbstractComponent<{}, HTMLDivElement> = styled.main`
  grid-area: main;
  color: textOnBody;
  font-family: base;
  font-size: 24px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 1;
  text-shadow: 0 0 10px black;
  padding: 0 16px;
`;

const Footer: React$AbstractComponent<{}, HTMLDivElement> = styled.footer`
  grid-area: footer;
  display: flex;
  justify-content: center;
`;

export const App: React$ComponentType<{
  analyserFftSize?: number,
}> = () => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <Global />
      <AppBody>
        <Heading1 gridArea='header'>Musical tuner</Heading1>
        <Tuner gridArea='main' />
        <AppBranch />
      </AppBody>
    </ThemeProvider>
  </BrowserRouter>
);
