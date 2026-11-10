import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import keyboardActions from '../../redux/keyboard/actions.js';
import Speaker from '../speaker/Speaker.jsx';
import Display from '../display/Display.jsx';
import Volume from '../volume/Volume.jsx';
import Button from '../button/Button.jsx';
import ButtonRow from '../button-row/ButtonRow.jsx';
import Keyboard from '../keyboard/Keyboard.jsx';
import Parameter from '../parameter/Parameter.jsx';
import SimpleReverb from '../../utils/SimpleReverb.js';
import { makeDistortionCurve } from '../../utils/Distortion.js';

const KNOB_MAX = 127;

// Starting knob positions (0-127):
//   volume - master volume
//   blue   - filter cutoff (fully open)
//   green  - filter resonance
//   white  - distortion drive
//   orange - reverb mix
const KNOB_DEFAULTS = {
  volume: 64,
  blue: 127,
  green: 0,
  white: 0,
  orange: 0,
};

class Synth extends Component {
  constructor() {
    super();

    // TODO: Move most of this to Redux
    this.state = {
      pressedKeys: [],
      oscKeys: [49],
      arrowKey: 0,
      context: {},
      mousePressed: false,
      masterVolume: {},
    };

    this.keyCodes = [
      65,87,83,69,68,
      82,70,71,89,72,
      85,74,75,79,76,
      80,186,219,222,
      90,221,88,220,67
    ];

    this.oscCodes = [49, 50, 51, 52];

    this.arrowCodes = [53, 54]; // [ left arrow, right arrow ]

    // Sounding notes, keyed by piano key index: { oscillators, noteGain }.
    this.voices = {};

    // Audio graph is built up front so children (e.g. Display) get the
    // analyser on their first render.
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    const context = new AudioContext();

    // Shared effects chain, built once (voices plug into `voiceMix`):
    //
    //   voices -> voiceMix -> filter -> distortion -+-> dry ---------+-> masterVolume -> limiter -> analyser -> out
    //                                               +-> reverb -> wet +
    const voiceMix = context.createGain();
    const filter = context.createBiquadFilter();
    const distortion = context.createWaveShaper();
    const dry = context.createGain();
    const reverb = new SimpleReverb(context, { seconds: 3, decay: 2, reverse: 0 });
    const wet = context.createGain();
    const masterVolume = context.createGain();
    const limiter = context.createDynamicsCompressor();
    const analyser = context.createAnalyser();

    filter.type = 'lowpass';
    distortion.oversample = '4x';

    // Only catch peaks (resonance + drive can get loud); leave normal levels alone.
    limiter.threshold.value = -3;
    limiter.knee.value = 0;
    limiter.ratio.value = 20;

    voiceMix.connect(filter);
    filter.connect(distortion);
    distortion.connect(dry);
    distortion.connect(reverb.input);
    reverb.connect(wet);
    dry.connect(masterVolume);
    wet.connect(masterVolume);
    masterVolume.connect(limiter);
    limiter.connect(analyser);
    analyser.connect(context.destination);

    this.audio = { voiceMix, filter, distortion, dry, wet, masterVolume };

    Object.assign(this.state, { context, masterVolume, analyser }, KNOB_DEFAULTS);

    Object.keys(KNOB_DEFAULTS).forEach(name => this.applyKnob(name, KNOB_DEFAULTS[name], true));
  }

  // Push a knob value (0-127) into the audio graph.
  applyKnob = (name, value, immediate = false) => {
    const { context } = this.state;
    const { filter, distortion, dry, wet, masterVolume } = this.audio;
    const t = value / KNOB_MAX;
    // Short glide avoids zipper noise while dragging.
    const set = (param, v) => immediate
      ? (param.value = v)
      : param.setTargetAtTime(v, context.currentTime, 0.02);

    switch (name) {
      case 'volume':
        set(masterVolume.gain, t * 2);
        break;
      case 'blue': // filter cutoff, exponential 40 Hz - 20 kHz
        set(filter.frequency, 40 * Math.pow(500, t));
        break;
      case 'green': // filter resonance
        set(filter.Q, 0.7 + t * 19.3);
        break;
      case 'white': // distortion drive (curve is not an AudioParam)
        distortion.curve = value > 0 ? makeDistortionCurve(t * 400) : null;
        break;
      case 'orange': // reverb dry/wet mix
        set(dry.gain, 1 - t * 0.5);
        set(wet.gain, t);
        break;
    }
  };

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.releaseAll);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.releaseAll);
  }

  // Browsers start the AudioContext suspended until a user gesture.
  resumeAudio = () => {
    if (this.state.context.state === 'suspended') {
      this.state.context.resume();
    }
  };

  // Toggle an oscillator (1-4) on/off; at least one always stays on.
  toggleOscillator = (oscKey) => {
    this.setState(({ oscKeys }) => {
      if (oscKeys.indexOf(oscKey) > -1) {
        return oscKeys.length > 1 ? { oscKeys: oscKeys.filter(k => k !== oscKey) } : null;
      }

      return { oscKeys: [...oscKeys, oscKey] };
    });
  };

  // Step the octave with < / >: from normal go down/up one; from either
  // shifted octave, pressing the opposite direction returns to normal.
  changeOctave = (arrowKey) => {
    this.setState(state => {
      if (state.arrowKey === arrowKey) {
        return null;
      }

      return { arrowKey: state.arrowKey === 0 ? arrowKey : 0 };
    });
  };

  // On-screen button clicks (1-4, <, >) behave like their keyboard shortcuts.
  onButtonPress = (keyCode) => {
    this.resumeAudio();

    if (this.oscCodes.indexOf(keyCode) > -1) {
      this.toggleOscillator(keyCode);
    } else if (this.arrowCodes.indexOf(keyCode) > -1) {
      this.changeOctave(keyCode);
    }
  };

  onKeyDown = (e) => {
    const index = this.keyCodes.indexOf(e.keyCode),
      oscIndex = this.oscCodes.indexOf(e.keyCode),
      arrowIndex = this.arrowCodes.indexOf(e.keyCode);

    this.resumeAudio();

    if (index > -1) {
      this.noteOn(index);
    }

    if (oscIndex > -1) {
      this.toggleOscillator(e.keyCode);
    }

    if (arrowIndex > -1) {
      this.changeOctave(e.keyCode);
    }
  };

  onKeyUp = (e) => {
    const index = this.keyCodes.indexOf(e.keyCode);

    if (index > -1) {
      this.noteOff(index);
    }
  };

  // Shared by the computer keyboard and mouse/touch on the on-screen keys.
  noteOn = (index) => {
    const id = index.toString();

    this.resumeAudio();

    if (this.props.keys.getIn([id, 'isPressed'])) {
      return;
    }

    this.playSound(index, this.props.keys.getIn([id, 'freq']));
    this.props.dispatch(keyboardActions.keyDown(id));
  };

  noteOff = (index) => {
    this.stopSound(index);
    this.props.dispatch(keyboardActions.keyUp(index.toString()));
  };

  // Release everything if the page loses focus mid-note (a keyup or
  // pointerup elsewhere would never reach us and the note would drone).
  releaseAll = () => {
    Object.keys(this.voices).forEach(index => this.noteOff(Number(index)));
  };

  // Start one oscillator per active waveform for piano key `index`. The
  // oscillators are stored under that key so the release always stops
  // exactly what was started, even if the oscillator or octave settings
  // change while the note is held.
  playSound = (index, frequency) => {
    const { context, oscKeys, arrowKey } = this.state;
    const { voiceMix } = this.audio;
    const octave = arrowKey === 53 ? 0.5 : arrowKey === 54 ? 2 : 1;

    // Per-note level, so stacking oscillators doesn't sum too hot and
    // later setting changes don't alter notes already sounding.
    const noteGain = context.createGain();
    noteGain.gain.value = 0.3 / oscKeys.length;
    noteGain.connect(voiceMix);

    const oscillators = oscKeys.map(oscKey => {
      const osc = context.createOscillator();

      // custom periodic wave
      // const sineTerms = new Float32Array([0, 0, 1, 0, 1]);
      // const cosineTerms = new Float32Array(sineTerms.length);
      // const customWaveform = context.createPeriodicWave(cosineTerms, sineTerms);
      // osc.setPeriodicWave(customWaveform);

      switch (oscKey) {
        case 50:
          osc.type = 'sawtooth';
          break;
        case 51:
          osc.type = 'triangle';
          break;
        case 52:
          osc.type = 'square';
          break;
        default:
          osc.type = 'sine';
          break;
      }

      osc.frequency.value = frequency * octave;
      osc.connect(noteGain);
      osc.start();

      return osc;
    });

    this.voices[index] = { oscillators, noteGain };
  };

  stopSound = (index) => {
    const voice = this.voices[index];

    if (!voice) {
      return;
    }

    voice.oscillators.forEach(osc => osc.stop());
    voice.noteGain.disconnect();
    delete this.voices[index];
  };

  onKeyChange = (pressedKeys) => {
    this.setState({ pressedKeys });
  };

  onKnobChange = (name, value) => {
    this.applyKnob(name, value);

    this.setState({
      [`${name}`]: value,
    });
  };

  render() {
    const style = {
        synth: {
          position: 'relative',
          width: 1133,
          backgroundColor: '#C3C9C9',
          height: 412,
          borderRadius: '15px',
          boxSizing: 'border-box',
          padding: 15,
          margin: '0 auto',
        },
        modules: {
          width: '95.6%',
          height: '97.5%',
          border: '3px solid #000',
          borderRadius: '15px',
          float: 'left',
        },
        model: {
          transform: 'rotate(-90deg)',
          transformOrigin: 'left top 0',
          float: 'left',
          position: 'absolute',
          bottom: 30,
          right: -4,
          color: '#636464',
          fontSize: '1.5rem',
          fontWeight: 500,
        },
        batteryLevel: {
          fontWeight: 500,
          fontSize: '1.5rem',
          transform: 'rotate(-90deg)',
          transformOrigin: 'left top 0',
          float: 'left',
          position: 'absolute',
          bottom: 170,
          right: 10,
          letterSpacing: '3px',
        },
        mic: {
          position: 'absolute',
          bottom: 367,
          right: 22,
        },
        micHole: {
          display: 'block',
          height: '7.8px',
          lineHeight: '7.8px',
          lineSpacing: '3px',
          fontSize: '2.2rem',
          fontWeight: 500,
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        },
        text: {
          fontFamily: '\'Quicksand\', sans-serif',
          fontSize: '0.85rem',
          position: 'relative',
          top: 12.5,
          textAlign: 'center',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        },
        squareGroup: {
          width: 124,
          height: 124,
          float: 'left'
        },
        rectGroup: {
          width: 62,
          height: 124,
          float: 'left',
        },
        controlGroup: {
          width: 186,
          height: 186,
          float: 'left',
        },
      };

    return (
      <div style={ style.synth }>
        <div style={ style.modules }>
          <Speaker />

          <div style={ style.squareGroup }>
            <Volume
              value={ this.state.volume }
              onChange={ this.onKnobChange.bind(this, 'volume')}
            />
            <Button borderRight={ true } />
            <Button />
          </div>

          <Display
            oscKeys={ this.state.oscKeys }
            analyser={this.state.analyser}
          />

          <Parameter color={ '#62B8F3' } value={ this.state.blue } onChange={ this.onKnobChange.bind(this, 'blue')} />
          <Parameter color={ '#01BB00' } value={ this.state.green } onChange={ this.onKnobChange.bind(this, 'green')} />
          <Parameter color={ '#FFFFFF' } value={ this.state.white } onChange={ this.onKnobChange.bind(this, 'white')} />
          <Parameter color={ '#F85105' } value={ this.state.orange } onChange={ this.onKnobChange.bind(this, 'orange')} />

          <div style={ style.rectGroup }>
            <Button borderRight={ false }/>
            <Button borderRight={ false }/>
          </div>

          <ButtonRow
            oscKeys={ this.state.oscKeys }
            arrowKey={ this.state.arrowKey }
            onPress={ this.onButtonPress }
          />

          <div style={ style.controlGroup }>
            <Button />
            <Button />
            <Button />
            <Button />
            <Button />
            <Button />
            <Button borderBottom={ false } />
            <Button borderBottom={ false } />
            <Button borderBottom={ false }>
              <div style={ style.text }>{ 'Shift' }</div>
            </Button>
          </div>

          <Keyboard
            keys={ this.props.keys }
            onNoteOn={ this.noteOn }
            onNoteOff={ this.noteOff }
          />
        </div>
        <div style={ style.model }>
          { 'OP-1' }
        </div>
        <div style={ style.batteryLevel }>
          { '.....' }
        </div>
        <div style={ style.mic }>
          <div style={ style.micHole }>{ '..' }</div>
          <div style={ style.micHole }>{ '..' }</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    keys: state.keys,
  };
}

export default connect(mapStateToProps)(Synth);
