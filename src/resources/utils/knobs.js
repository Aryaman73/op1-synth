// Knob settings: how a knob position (0-1) maps to the value the audio code
// uses, and how that value reads on the display. Keeping both together means
// the readout always shows what the knob actually does.

const percent = v => `${Math.round(v * 100)}%`;

const hertz = hz => hz < 1000 ? `${Math.round(hz)} Hz` : `${(hz / 1000).toFixed(1)} kHz`;

const seconds = s => s < 1 ? `${Math.round(s * 1000)} ms` : `${s.toFixed(2)} s`;

const BLUE = '#62B8F3';
const GREEN = '#01BB00';
const WHITE = '#FFFFFF';
const ORANGE = '#F85105';

export const KNOBS = {
  volume:  { label: 'VOLUME',    color: '#DEE8E9', map: t => t * 2,                     format: v => percent(v / 2) },
  // Sound page
  blue:    { label: 'CUTOFF',    color: BLUE,      map: t => 40 * Math.pow(500, t),     format: hertz },
  green:   { label: 'RESONANCE', color: GREEN,     map: t => 0.7 + t * 19.3,            format: q => `Q ${q.toFixed(1)}` },
  white:   { label: 'DRIVE',     color: WHITE,     map: t => t * 400,                   format: k => percent(k / 400) },
  orange:  { label: 'REVERB',    color: ORANGE,    map: t => t,                         format: percent },
  // Envelope page
  attack:  { label: 'ATTACK',    color: BLUE,      map: t => 0.002 * Math.pow(1000, t), format: seconds },
  decay:   { label: 'DECAY',     color: GREEN,     map: t => 0.01 * Math.pow(200, t),   format: seconds },
  sustain: { label: 'SUSTAIN',   color: WHITE,     map: t => t,                         format: percent },
  release: { label: 'RELEASE',   color: ORANGE,    map: t => 0.01 * Math.pow(300, t),   format: seconds },
};
