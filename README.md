# OP-1 Synthesizer

<img src="op1.png" width="800px"></img>

A *very* lightweight version of Teenage Engineering's OP-1 Synthesizer built with React and Redux

## Running

Requires Node 20.19+ (or 22.12+).

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## Controls

- `A W S E D F G Y H U J K O L P ; [ ' Z ] X \ C` – play notes
- `1`–`4` – toggle Sine / Saw / Triangle / Square oscillators (they stack)
- `5` / `6` – octave down / up; press the opposite one to return to normal. The on-screen `1`–`4`, `<` and `>` buttons can also be clicked.
- Knobs (click and drag):
  - small white – master volume
  - blue – filter cutoff
  - green – filter resonance
  - white – distortion
  - orange – reverb mix

Click the page or press a key first: browsers keep audio muted until you interact with the page.

## Features
- Four different oscillator types (Sine, Sawtooth, Triangle, Square)
- Keyboard functionality
- Built in volume control

## TODO
- Optimize keyboard listener
- Animate waveform of oscillator(s) on the display
- Allow users to stack oscillators
- Fix mouse functionality
- Add a drum pad
