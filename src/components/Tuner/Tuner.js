/* @flow */

import * as React from 'react';
import styled, { css } from 'styled-components';
import sys from 'system-components';
import { pure } from 'recompose';

import { indexedNotes } from './notes';
import { createPitcher } from '../../util/createPitcher';

const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 32768;

navigator.mediaDevices &&
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(stream => {
      const microphoneStream = audioContext.createMediaStreamSource(stream);
      microphoneStream.connect(analyser);
    })
    .catch(e => console.error('Error capturing audio:', e));

const log2 = Math.log(2);

const noteIndexFromPitch = frequency =>
  12 * (Math.log(frequency / 440) / log2) + 57;

const roundN = precision => {
  const multipler = 10 ** precision;
  return value => Math.round(value * multipler) / multipler;
};

const round2 = roundN(2);

const position = noteIndex => round2(noteIndex / indexedNotes.length * 100);

const getFrequency = createPitcher(audioContext, analyser);

type Unit = 'px' | 'em' | 'rem' | '%';
type Units = $ReadOnlyArray<Unit>;

const units: Units = ['px', 'em', 'rem', '%'];

class Value<U: Unit> {
  value: number;
  unit: U;

  static parse = (value: string | number): Value<Unit> => {
    if (typeof value == 'number') return Value.of(value, 'px');

    const unit =
      value.trim().replace(/^[0-9]+(?:\.[0-9]+)?([^0-9]+)$/, '$1') || 'px';

    if (!units.includes(unit)) {
      throw RangeError(`Unit must be one of ${units.join(', ')}`);
    }

    return Value.of(parseFloat(value), (unit: any));
  };

  static of: ((value: number) => Value<'px'>) &
    (<T: Unit>(value: number, unit: T) => Value<T>) = (value, unit) =>
    new Value(value, unit);

  constructor(value: number, unit?: U) {
    this.value = value;
    this.unit = unit || ('px': any);
  }

  map(fn: number => number): Value<U> {
    return (Value.of(fn(this.value), (this.unit: any)): any);
  }

  toString() {
    return `${this.value}${this.unit}`;
  }
}

const Wrapper = styled.div`
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
`;

const SlideBox = styled.div`
  box-sizing: border-box;
  padding-left: 50%;
  overflow: hidden;
  position: relative;
  font-size: 32px;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(
      to left,
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 0) calc(50% - 2em),
      rgba(255, 255, 255, 0) calc(50% + 2em),
      rgba(255, 255, 255, 1)
    );
  }
`;

const Slider = sys(
  {
    offset: 0,
    blacklist: ['offset', 'length'],
  },
  css`
    width: ${props => props.size};
    transform: translateX(${props => -props.offset}%);
    transition-property: transform;
    transition-duration: 300ms;
  `,
);

const currentBlack = props =>
  props.isCurrent ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0)';

const visibleBlack = props =>
  props.visible === false ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 1)';

const Up: React$ComponentType<{
  visible?: boolean,
}> = pure(styled(props => (
  <svg height="24" width="24" viewBox="0 0 24 24" className={props.className}>
    <path d="M7 14l5-5 5 5z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
))`
  fill: ${visibleBlack};
  transition-property: fill;
  transition-duration: 300ms;
  margin: -9px auto -11px;
  display: block;
  color: red;
`);

const Down: React$ComponentType<{
  visible?: boolean,
}> = pure(styled(props => (
  <svg height="24" width="24" viewBox="0 0 24 24" className={props.className}>
    <path d="M7 10l5 5 5-5z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
))`
  fill: ${visibleBlack};
  transition-property: fill;
  transition-duration: 300ms;
  margin: -11px auto -9px;
  display: block;
  color: red;
`);

const NoteLabel: React$ComponentType<{
  isCurrent: boolean,
}> = pure(styled.div`
  border-radius: 3px;
  text-align: center;
  padding: 0;
  height: 1.5em;
  line-height: 1.5em;
  box-sizing: border-box;
  width: 100%;
  color: ${props => (props.isCurrent ? '#fff' : '#000')};
  background-color: ${currentBlack};
  transition-property: background-color;
  transition-duration: 300ms;
  font-family: 'Yanone Kaffeesatz';
  font-weight: 700;
  letter-spacing: 0.05em;
`);

const Note: React$ComponentType<{
  isCurrent: boolean,
}> = pure(styled(props => (
  <div className={props.className}>
    <Up visible={props.isCurrent} />
    <NoteLabel isCurrent={props.isCurrent}>{props.children}</NoteLabel>
    <Down visible={props.isCurrent} />
  </div>
))`
  width: ${props => props.size};
  transform: translateX(-50%);
  display: inline-block;
`);

const Notes = pure(props =>
  props.notes.map(note => (
    <Note
      isCurrent={props.current === note.label}
      key={note.label}
      size={props.size}>
      {note.label}
    </Note>
  )),
);

const Loading = styled.p.attrs({
  children: 'Connecting to microphone...',
})`
  text-align: center;
  font-size: 28px;
  font-weight: 300;
`;

type Props = {|
  noteBlockSize?: number | string,
  interval?: number,
|};

type State = {|
  noteBlockSize: Value<Unit>,
  sliderSize: Value<Unit>,
  noteLabel?: string,
  lineOffset?: number,
|};

export class Tuner extends React.PureComponent<Props, State> {
  componentWillMount() {
    this.sizeUpdate(this.props.noteBlockSize);
    this.listen(this.props.interval);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.sizeUpdate(nextProps.noteBlockSize);
    this.listen(nextProps.interval);
  }

  componentWillUnmount() {
    this.stop();
  }

  sizeUpdate(noteBlockSizeRaw: number | string = '2.6em') {
    const noteBlockSize = Value.parse(noteBlockSizeRaw);
    this.setState({
      noteBlockSize,
      sliderSize: noteBlockSize.map(size => size * indexedNotes.length),
    });
  }

  listen(interval: number = 100) {
    this.stop();

    this.interval = setInterval(() => {
      const frequency = getFrequency();
      const noteOffset = noteIndexFromPitch(frequency);
      const note = indexedNotes[Math.round(noteOffset)];

      if (!note) return;

      this.setState({
        noteLabel: note.label,
        lineOffset: position(noteOffset),
      });
    }, interval);
  }

  stop() {
    clearInterval(this.interval);
  }

  interval: IntervalID;

  render() {
    return this.state.noteLabel ? (
      <Wrapper>
        <Down />
        <SlideBox>
          <Slider
            size={this.state.sliderSize}
            length={indexedNotes.length}
            offset={this.state.lineOffset}>
            <Notes
              current={this.state.noteLabel}
              size={this.state.noteBlockSize}
              notes={indexedNotes}
            />
          </Slider>
        </SlideBox>
        <Up />
      </Wrapper>
    ) : (
      <Loading />
    );
  }
}
