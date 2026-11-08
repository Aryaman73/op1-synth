import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Project pages live at aryamans.me/op1-synth, so emitted asset URLs need
  // the subpath (the dev server still serves at /op1-synth/ too).
  base: '/op1-synth/',
  plugins: [react()],
});
