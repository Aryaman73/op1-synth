import React, { Component } from 'react';

const GREY = '#6B7070';
const DIM = '#4A4E4E';

const knobs = [
  { color: '#DEE8E9', name: 'Volume', note: 'the small knob, top left' },
  { color: '#62B8F3', name: 'Cutoff', note: 'turn down for a darker, muffled tone' },
  { color: '#01BB00', name: 'Resonance', note: 'adds a ringing peak at the cutoff' },
  { color: '#FFFFFF', name: 'Drive', note: 'distortion, from warm to fuzzy' },
  { color: '#F85105', name: 'Reverb', note: 'how much room sound is mixed in' },
];

export default class Instructions extends Component {
  style = {
    wrapper: {
      width: 1133, // matches the synth body
      margin: '28px auto 40px',
      padding: '0 15px',
      boxSizing: 'border-box',
      display: 'flex',
      gap: 56,
      fontFamily: '\'Quicksand\', sans-serif',
      fontSize: '0.85rem',
      lineHeight: 1.7,
      color: GREY,
    },
    column: {
      flex: 1,
    },
    heading: {
      margin: '0 0 6px',
      fontFamily: '\'Bungee Hairline\', cursive',
      fontSize: '0.95rem',
      fontWeight: 400,
      letterSpacing: '0.2em',
      color: '#9AA0A0', // hairline font needs a bit more contrast to read
    },
    list: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    key: {
      display: 'inline-block',
      minWidth: 14,
      padding: '0 4px',
      marginRight: 2,
      border: `1px solid ${DIM}`,
      borderRadius: 3,
      lineHeight: '16px',
      fontSize: '0.75rem',
      textAlign: 'center',
      fontFamily: '\'Noto Sans\', sans-serif',
    },
    dot: {
      display: 'inline-block',
      width: 8,
      height: 8,
      marginRight: 8,
      borderRadius: '50%',
      verticalAlign: 'middle',
      position: 'relative',
      top: -1,
    },
    name: {
      color: '#8C9292',
    },
    note: {
      color: DIM,
    },
  };

  renderKeys = (keys) => keys.map(k => (
    <span key={ k } style={ this.style.key }>{ k }</span>
  ));

  render() {
    const style = this.style;

    return (
      <div style={ style.wrapper }>
        <div style={ style.column }>
          <h2 style={ style.heading }>{ 'PLAY' }</h2>
          <ul style={ style.list }>
            <li>Your computer keyboard is the piano: <span style={ style.name }>A S D F G H J K L</span> are white keys, the row above (<span style={ style.name }>W E R Y U O P</span>) are black keys.</li>
            <li style={ style.note }>Press a key or click the page first. Browsers keep audio muted until you do.</li>
          </ul>
        </div>

        <div style={ style.column }>
          <h2 style={ style.heading }>{ 'SOUND' }</h2>
          <ul style={ style.list }>
            <li>{ this.renderKeys(['1', '2', '3', '4']) } sine, saw, triangle, square. Turn on several to stack them.</li>
            <li>{ this.renderKeys(['5', '6']) } octave down / up. Press the other one to return.</li>
            <li style={ style.note }>You can also click the 1–4, &lt; and &gt; buttons on the synth.</li>
          </ul>
        </div>

        <div style={ style.column }>
          <h2 style={ style.heading }>{ 'KNOBS' }</h2>
          <ul style={ style.list }>
            { knobs.map(k => (
              <li key={ k.name }>
                <span style={ { ...style.dot, backgroundColor: k.color } } />
                <span style={ style.name }>{ k.name }</span>
                <span style={ style.note }>{ ` — ${k.note}` }</span>
              </li>
            )) }
            <li style={ style.note }>Click and drag to turn.</li>
          </ul>
        </div>
      </div>
    );
  }
}
