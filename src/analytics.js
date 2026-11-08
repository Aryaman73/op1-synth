// GoatCounter page views, shared with the aryamans.goatcounter.com dashboard.
// Only the live host loads the script, so the dev server and `npm run preview`
// never count.
//
// The site is a single page with no routing, so GoatCounter's automatic onload
// count (recorded as /op1-synth/) is the whole integration.
const LIVE_HOST = 'aryamans.me';

export function startAnalytics() {
  if (location.hostname !== LIVE_HOST) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.dataset.goatcounter = 'https://aryamans.goatcounter.com/count';
  document.head.append(script);
}
