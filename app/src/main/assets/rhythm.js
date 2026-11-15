/*
 * Plektrum – rhythm library: time signatures, strumming patterns and drum beats.
 * Copyright (C) 2026 Jon Solberg — GNU GPL v3 or later.
 *
 * Patterns are step grids for one bar; `sub` is the number of steps per beat.
 *
 * Strum symbols:
 *   D / d  downstroke, accented / normal       U / u  upstroke, accented / normal
 *   x      muted "chuck" (percussive scratch)  S      stab – short chord, damped at once
 *   M / m  palm-muted low strings              B      bass note (lowest string of the chord)
 *   A      alternate bass (next string up)     P      pinch: bass + top string together
 *   p      treble note (alternates the two highest strings)
 *   1–6    single string, counted from the lowest string of the chord
 *   -      rest / let ring
 *
 * Drum lanes: k kick, s snare, r rim/side-stick, h closed hi-hat, o open hi-hat.
 *   X accent, x normal, g ghost note, - rest
 */
'use strict';

const METERS = [
  { id: '4/4',  beats: 4, unit: '♩' },
  { id: '3/4',  beats: 3, unit: '♩' },
  { id: '2/4',  beats: 2, unit: '♩' },
  { id: '5/4',  beats: 5, unit: '♩' },
  { id: '6/8',  beats: 2, unit: '♩.', compound: true },
  { id: '12/8', beats: 4, unit: '♩.', compound: true },
  { id: '7/8',  beats: 7, unit: '♪', groups: [0, 2, 4] },          // 2 + 2 + 3
];

const STRUMS = [
  // 4/4
  { id: 'faithful',   m: '4/4', sub: 2, p: 'D-dU-udU',          en: 'Pop / folk (D DU UDU)',     sv: 'Pop / folk (N NU UNU)' },
  { id: 'quarters',   m: '4/4', sub: 2, p: 'D-d-D-d-',          en: 'Quarter notes',             sv: 'Fjärdedelar' },
  { id: 'eighths',    m: '4/4', sub: 2, p: 'DuduDudu',          en: 'Straight eighths',          sv: 'Raka åttondelar' },
  { id: 'whole',      m: '4/4', sub: 2, p: 'D-------',          en: 'One strum per bar',         sv: 'Ett slag per takt' },
  { id: 'half',       m: '4/4', sub: 2, p: 'D---D---',          en: 'Half notes',                sv: 'Halvnoter' },
  { id: 'backbeat',   m: '4/4', sub: 2, p: 'd-D-d-D-',          en: 'Backbeat (accent on 2 & 4)', sv: 'Backbeat (betoning på 2 & 4)' },
  { id: 'chuck',      m: '4/4', sub: 2, p: 'D-xuD-xu',          en: 'Backbeat chuck',            sv: 'Backbeat med dämpat slag' },
  { id: 'push',       m: '4/4', sub: 2, p: 'D-dU-U-U',          en: 'Syncopated push',           sv: 'Synkoperad framförskjutning' },
  { id: 'tresillo',   m: '4/4', sub: 4, p: 'D--D--D-D--D--D-',  en: '3-3-2 (tresillo)',          sv: '3-3-2 (tresillo)' },
  { id: 'charleston', m: '4/4', sub: 2, p: 'S--S----',          en: 'Charleston stabs',          sv: 'Charleston-stötar' },
  { id: 'stabs',      m: '4/4', sub: 4, p: 'S--S---S--S-----',  en: 'Stabs (punctuation)',       sv: 'Stötar (punktering)' },
  { id: 'ska',        m: '4/4', sub: 2, p: '-U-U-U-U',          en: 'Ska offbeat',               sv: 'Ska på offbeat' },
  { id: 'reggae',     m: '4/4', sub: 4, p: '----S-------S---',  en: 'Reggae skank (2 & 4)',      sv: 'Reggae-skank (2 & 4)' },
  { id: 'funk',       m: '4/4', sub: 4, p: 'D-uxx-UxD-uxx-Ux',  en: 'Funk sixteenths',           sv: 'Funk-sextondelar' },
  { id: 'sixteenths', m: '4/4', sub: 4, p: 'DuduDuduDuduDudu',  en: 'Busy sixteenths',           sv: 'Täta sextondelar' },
  { id: 'shuffle',    m: '4/4', sub: 3, p: 'D-uD-uD-uD-u',      en: 'Shuffle',                   sv: 'Shuffle' },
  { id: 'bodiddley',  m: '4/4', sub: 4, p: 'D--D--D---D-D---',  en: 'Bo Diddley beat',           sv: 'Bo Diddley-takt' },
  { id: 'chug',       m: '4/4', sub: 2, p: 'MmMmMmMm',          en: 'Palm-muted chug',           sv: 'Handdämpat ös' },
  { id: 'gallop',     m: '4/4', sub: 4, p: 'M-mmM-mmM-mmM-mm',  en: 'Gallop',                    sv: 'Galopp' },
  { id: 'boomchick',  m: '4/4', sub: 2, p: 'B-D-A-D-',          en: 'Boom-chick (country)',      sv: 'Bas-slag (country)' },
  { id: 'bossa',      m: '4/4', sub: 4, p: 'B--dA-d-B-d-A--d',  en: 'Bossa nova',                sv: 'Bossa nova' },
  { id: 'travis',     m: '4/4', sub: 2, p: 'PpApBpAp',          en: 'Travis picking',            sv: 'Travis-plock' },
  { id: 'arp8',       m: '4/4', sub: 2, p: '13456543',          en: 'Arpeggio',                  sv: 'Arpeggio' },
  { id: 'arp16',      m: '4/4', sub: 4, p: '1345654313456543',  en: 'Fast arpeggio',             sv: 'Snabbt arpeggio' },
  // 3/4
  { id: 'waltz',      m: '3/4', sub: 2, p: 'B-D-D-',            en: 'Waltz (oom-pah-pah)',       sv: 'Vals (bom-tjing-tjing)' },
  { id: 'waltzstrum', m: '3/4', sub: 2, p: 'D-dUdU',            en: 'Waltz strum',               sv: 'Valsslag' },
  { id: 'waltzarp',   m: '3/4', sub: 2, p: '134565',            en: 'Waltz arpeggio',            sv: 'Valsarpeggio' },
  // 2/4
  { id: 'polka',      m: '2/4', sub: 2, p: 'BDAD',              en: 'Polka',                     sv: 'Polka' },
  { id: 'march',      m: '2/4', sub: 2, p: 'D-du',              en: 'March',                     sv: 'Marsch' },
  // 5/4
  { id: 'five',       m: '5/4', sub: 2, p: 'D-dU-uD-dU',        en: '5/4 strum (3 + 2)',         sv: '5/4-slag (3 + 2)' },
  { id: 'fivearp',    m: '5/4', sub: 2, p: '1345654345',        en: '5/4 arpeggio',              sv: '5/4-arpeggio' },
  // 6/8
  { id: 'six8',       m: '6/8', sub: 3, p: 'D-UD-U',            en: '6/8 strum',                 sv: '6/8-slag' },
  { id: 'six8drive',  m: '6/8', sub: 3, p: 'DduDdu',            en: '6/8 driving',               sv: '6/8 drivande' },
  { id: 'six8ballad', m: '6/8', sub: 3, p: 'D--D-u',            en: '6/8 ballad',                sv: '6/8-ballad' },
  { id: 'six8arp',    m: '6/8', sub: 3, p: '134543',            en: '6/8 arpeggio',              sv: '6/8-arpeggio' },
  // 12/8
  { id: 'blues128',   m: '12/8', sub: 3, p: 'D-uD-uD-uD-u',     en: 'Slow blues',                sv: 'Långsam blues' },
  { id: 'boom128',    m: '12/8', sub: 3, p: 'B-dA-dB-dA-d',     en: 'Shuffle bass & strum',      sv: 'Shufflebas och slag' },
  { id: 'arp128',     m: '12/8', sub: 3, p: '134543134543',     en: '12/8 arpeggio',             sv: '12/8-arpeggio' },
  // 7/8
  { id: 'seven8',     m: '7/8', sub: 1, p: 'D-D-D-u',           en: '7/8 strum (2 + 2 + 3)',     sv: '7/8-slag (2 + 2 + 3)' },
  { id: 'seven8arp',  m: '7/8', sub: 1, p: '1314345',           en: '7/8 arpeggio',              sv: '7/8-arpeggio' },
];

const DRUMS = [
  { id: 'none', m: '*', en: 'No drums', sv: 'Inga trummor' },
  // 4/4
  { id: 'rock',      m: '4/4', sub: 4, en: 'Rock backbeat',      sv: 'Rock-backbeat',
    k: 'x-------x-x-----', s: '----X-------X---', h: 'x-x-x-x-x-x-x-x-' },
  { id: 'pop',       m: '4/4', sub: 4, en: 'Pop',                sv: 'Pop',
    k: 'x-----x-x-------', s: '----X-------X---', h: 'x-x-x-x-x-x-x-x-' },
  { id: 'halftime',  m: '4/4', sub: 4, en: 'Half-time',          sv: 'Halvtid',
    k: 'x-----x---------', s: '--------X-------', h: 'x-x-x-x-x-x-x-x-' },
  { id: 'ballad',    m: '4/4', sub: 4, en: 'Soft ballad',        sv: 'Lugn ballad',
    k: 'x-------x-------', r: '----x-------x---', h: 'g-g-g-g-g-g-g-g-' },
  { id: 'floor',     m: '4/4', sub: 4, en: 'Four on the floor',  sv: 'Four on the floor',
    k: 'x---x---x---x---', s: '----X-------X---', h: 'x---x---x---x---', o: '--x---x---x---x-' },
  { id: 'funkdr',    m: '4/4', sub: 4, en: 'Funk',               sv: 'Funk',
    k: 'x--x--x---x-----', s: '----X--g-g--X--g', h: 'xgxgxgxgxgxgxgxg' },
  { id: 'train',     m: '4/4', sub: 4, en: 'Train beat (country)', sv: 'Tågtakt (country)',
    k: 'x-------x-------', s: 'ggggXgggggggXggg' },
  { id: 'shuffledr', m: '4/4', sub: 3, en: 'Shuffle',            sv: 'Shuffle',
    k: 'x-----x-----', s: '---X-----X--', h: 'x-xx-xx-xx-x' },
  { id: 'onedrop',   m: '4/4', sub: 4, en: 'Reggae one-drop',    sv: 'Reggae one-drop',
    k: '--------x-------', r: '--------x-------', h: 'x-x-x-x-x-x-x-x-' },
  { id: 'bossadr',   m: '4/4', sub: 4, en: 'Bossa nova',         sv: 'Bossa nova',
    k: 'x--xx--xx--xx--x', r: 'x--x--x---x--x--', h: 'gggggggggggggggg' },
  { id: 'diddley',   m: '4/4', sub: 4, en: 'Bo Diddley',         sv: 'Bo Diddley',
    k: 'x-------x-------', r: 'x--x--x---x-x---', h: 'g-g-g-g-g-g-g-g-' },
  { id: 'motown',    m: '4/4', sub: 4, en: 'Motown (snare on every beat)', sv: 'Motown (virvel på varje slag)',
    k: 'x-----x-x-----x-', s: 'x---X---x---X---', h: 'x-x-x-x-x-x-x-x-' },
  // 3/4
  { id: 'waltzdr',   m: '3/4', sub: 2, en: 'Waltz',              sv: 'Vals',
    k: 'x-----', s: '--x-x-', h: 'x-x-x-' },
  { id: 'jazzwaltz', m: '3/4', sub: 3, en: 'Jazz waltz',         sv: 'Jazzvals',
    k: 'x--------', r: '---x--x--', h: 'x--x-xx-x' },
  // 2/4
  { id: 'polkadr',   m: '2/4', sub: 2, en: 'Polka',              sv: 'Polka',
    k: 'x-x-', s: '-x-x', h: 'xxxx' },
  // 5/4
  { id: 'fivedr',    m: '5/4', sub: 2, en: '5/4 (3 + 2)',        sv: '5/4 (3 + 2)',
    k: 'x-----x---', s: '----X---X-', h: 'x-x-x-x-x-' },
  // 6/8
  { id: 'six8dr',    m: '6/8', sub: 3, en: '6/8 ballad',         sv: '6/8-ballad',
    k: 'x-----', s: '---X--', h: 'xxxxxx' },
  { id: 'six8rock',  m: '6/8', sub: 3, en: '6/8 rock',           sv: '6/8-rock',
    k: 'x-x---', s: '---X--', h: 'x-xx-x' },
  // 12/8
  { id: 'blues128dr', m: '12/8', sub: 3, en: 'Slow blues',       sv: 'Långsam blues',
    k: 'x-----x-----', s: '---X-----X--', h: 'xgxxgxxgxxgx' },
  { id: 'shuffle128', m: '12/8', sub: 3, en: '12/8 shuffle',     sv: '12/8-shuffle',
    k: 'x--x--x--x--', s: '---X-----X--', h: 'x-xx-xx-xx-x' },
  // 7/8
  { id: 'seven8dr',  m: '7/8', sub: 1, en: '7/8 (2 + 2 + 3)',    sv: '7/8 (2 + 2 + 3)',
    k: 'x---x--', s: '--x---x', h: 'xxxxxxx' },
];

/** Count syllables under each step: 1 & 2 & · 1 e & a · 1 2 3 4 5 6 … */
function countLabels(meter, sub) {
  const out = [];
  for (let b = 0; b < meter.beats; b++) for (let k = 0; k < sub; k++) {
    if (meter.compound) out.push(String(b * sub + k + 1));
    else if (sub === 1) out.push(String(b + 1));
    else if (k === 0) out.push(String(b + 1));
    else if (sub === 2) out.push('&');
    else if (sub === 3) out.push(k === 1 ? '&' : 'a');
    else out.push(['', 'e', '&', 'a'][k]);
  }
  return out;
}

if (typeof module !== 'undefined') module.exports = { METERS, STRUMS, DRUMS, countLabels };
