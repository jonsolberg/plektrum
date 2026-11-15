/*
 * Plektrum – user interface.
 * Copyright (C) 2026 Jon Solberg
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version. See LICENSE.
 */
'use strict';

const $ = (s, el = document) => el.querySelector(s);
const AND = window.Android || null;
const VERSION = '1.4';
const REPO = 'https://github.com/jonsolberg/guitarchords';

const store = {
  get(k, d) { try { const v = localStorage.getItem('plektrum.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('plektrum.' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
};
const S = Object.assign({
  lang: 'auto', theme: 'auto', lefty: false, names: false, hNotation: false, style: 'strum', volume: 0.8, sound: true,
  a4: 440, temp: 'equal', tempRoot: 0, tuning: 'std', custom: [40, 45, 50, 55, 59, 64], tunerMode: 'guitar', tunerView: 'needle', tunerSens: 0.52, dotLabel: 'finger',
  tab: 'chords',
}, store.get('settings', {}));
const saveS = () => store.set('settings', S);

/* ---------------- text ---------------- */
const STR = {
  en: {
    chords: 'Chords', studio: 'Studio', circle: 'Circle', scales: 'Scales', tuner: 'Tuner', practice: 'Practice',
    search: 'Find a chord – Am7, C/G, F♯m7♭5 …', searchL: 'Search', searchShort: 'Find chord', favourites: 'Favourites', noFavs: 'Tap ☆ on a chord to keep it here.',
    root: 'Root', type: 'Type', bass: 'Bass note', none: 'none', strum: 'Strum', arp: 'Arpeggio',
    fingering: 'Fingering {i} of {n}', atFret: 'from fret {n}', openPos: 'open position', noVoicing: 'No playable fingering for this one.',
    favAdded: 'Saved to favourites', favRemoved: 'Removed from favourites', swipe: 'swipe or tap the arrows for more', otherFing: 'Other fingerings', fingers: 'Fingers', bassShort: 'bass',
    key: 'Key', major: 'Major', minor: 'Minor', tempo: 'Tempo', play: 'Play', stop: 'Stop', transpose: 'Transpose',
    clear: 'Clear', perChord: 'Beats per chord', pattern: 'Pattern', pOnce: 'Once', pBeats: 'Every beat', pDU: 'Down-up', pArp: 'Picking',
    timeSig: 'Time signature', chordLen: 'Each chord lasts', halfBar: '½ bar', bar: 'bar', bars: 'bars', strumming: 'Strumming pattern',
    drumsL: 'Drum beat', drumVol: 'Drum volume', feel: 'Feel', swing: 'Swing', straight: 'Straight', countIn: 'Count-in (one bar)',
    lgDown: 'down', lgUp: 'up', lgMute: 'muted', lgStab: 'stab', lgPalm: 'palm mute', lgBass: 'bass', lgBass2: 'alt. bass',
    lgPinch: 'pinch / treble', lgString: 'string', lgSoft: 'faint = softer · tap to hear',
    click: 'Metronome click', suggestions: 'Progressions in {key}', saved: 'Saved progressions', save: 'Save', name: 'Name',
    noSaved: 'Nothing saved yet.', addChord: 'Add chord', chooseChord: 'Choose chord', remove: 'Remove', done: 'Done',
    moveL: 'Move left', moveR: 'Move right', full: 'A progression holds up to {n} chords', progName: 'My progression',
    deleted: 'Deleted', loaded: 'Loaded', savedT: 'Saved', voicing: 'Fingering',
    circleHint: 'Tap a key on the circle. The highlighted slice holds the chords that belong to it.',
    chordsIn: 'Chords in {key}', goodProg: 'Good progressions in {key}', toStudio: 'To Studio', sentStudio: 'Sent to Studio',
    sig0: 'No sharps or flats', sigN: '{n} {acc}', sharps: 'sharps', sharp: 'sharp', flats: 'flats', flat: 'flat',
    relMinor: 'Relative minor', relMajor: 'Relative major', showFing: 'Show fingerings',
    scale: 'Scale', position: 'Position', wholeNeck: 'Whole neck', showAs: 'Show', notesL: 'Notes', degrees: 'Degrees',
    rootL: 'Root', noteL: 'Scale note', blueL: 'Blue note', frets: 'frets {a}–{b}', playScale: 'Play scale',
    startTuner: 'Start tuner', stopTuner: 'Stop', tuning: 'Tuning', calib: 'Calibration A4', temperament: 'Temperament',
    tempRoot: 'Temperament key', pipe: 'Pitch pipe', pipeDesc: 'Tap a string to hear its note', mode: 'Mode', guitar: 'Guitar', chromatic: 'Chromatic',
    listen: 'Play a string', micDenied: 'The tuner needs the microphone. Allow it in Android settings.',
    lockHint: 'Tap a string to tune only that one. Tap again for automatic.', customT: 'Custom tuning', inTune: 'In tune',
    needle: 'Needle', strobe: 'Strobe', tapStart: 'Press Start and play a string', tuneUp: 'Tune up', tuneDown: 'Tune down',
    semisLow: '{n} semitone(s) low – tune up', semisHigh: '{n} semitone(s) high – tune down',
    sens: 'Sensitivity', sensD: 'Raise it for quiet acoustics, lower it in noisy rooms',
    grouping: 'Grouping', subdiv: 'Subdivision', swingD: 'Plays the off-beats late, like a shuffle', accentPat: 'Accent pattern',
    customPat: 'Custom', resetAcc: 'Reset accents', stepHint: 'Tap a step: normal → accent → soft → silent',
    metronome: 'Metronome', perBar: 'Beats per bar', tap: 'Tap', start: 'Start', challenge: 'Chord challenge',
    challengeDesc: 'Ten chord diagrams – name each one.', go: 'Start', which: 'Which chord is this?', next: 'Next',
    right: 'Right!', wrongIs: 'That was {c}', result: '{s} of 10', best: 'Best: {b} of 10', again: 'Play again', hear: 'Hear it',
    settings: 'Settings', setDisplay: 'Display', soundOn: 'Play sounds', language: 'Language', auto: 'Automatic', theme: 'Theme', light: 'Light', dark: 'Dark',
    lefty: 'Left-handed', leftyD: 'Mirror diagrams and fretboards', namesS: 'Note names on diagrams',
    hNot: 'Swedish note names', hNotD: 'B is called H, B♭ is called B', playStyle: 'Tapping a chord chart plays', sound: 'Sound', volume: 'Volume',
    about: 'About', aboutT: 'A toolbox for guitarists: chords, progressions, the circle of fifths, scales, a tuner and a metronome. Works fully offline.',
    license: 'Free software under the GNU GPL v3.', source: 'Source code',
  },
  sv: {
    chords: 'Ackord', studio: 'Studio', circle: 'Kvintcirkel', scales: 'Skalor', tuner: 'Stämapparat', practice: 'Öva',
    search: 'Sök ackord – Am7, C/G, F♯m7♭5 …', searchL: 'Sök', searchShort: 'Sök ackord', favourites: 'Favoriter', noFavs: 'Tryck på ☆ vid ett ackord för att spara det här.',
    root: 'Grundton', type: 'Typ', bass: 'Bastone', none: 'ingen', strum: 'Slag', arp: 'Arpeggio',
    fingering: 'Grepp {i} av {n}', atFret: 'från band {n}', openPos: 'öppet läge', noVoicing: 'Inget spelbart grepp för det här ackordet.',
    favAdded: 'Sparat bland favoriter', favRemoved: 'Borttaget från favoriter', swipe: 'svep eller tryck på pilarna för fler', otherFing: 'Fler grepp', fingers: 'Fingrar', bassShort: 'bas',
    key: 'Tonart', major: 'Dur', minor: 'Moll', tempo: 'Tempo', play: 'Spela', stop: 'Stopp', transpose: 'Transponera',
    clear: 'Rensa', perChord: 'Slag per ackord', pattern: 'Komp', pOnce: 'Ett slag', pBeats: 'Varje slag', pDU: 'Ner-upp', pArp: 'Plock',
    timeSig: 'Taktart', chordLen: 'Varje ackord varar', halfBar: '½ takt', bar: 'takt', bars: 'takter', strumming: 'Kompmönster',
    drumsL: 'Trumkomp', drumVol: 'Trumvolym', feel: 'Känsla', swing: 'Swing', straight: 'Rakt', countIn: 'Inräkning (en takt)',
    lgDown: 'ner', lgUp: 'upp', lgMute: 'dämpat', lgStab: 'stöt', lgPalm: 'handdämpat', lgBass: 'bas', lgBass2: 'växelbas',
    lgPinch: 'nyp / diskant', lgString: 'sträng', lgSoft: 'blek = svagare · tryck för att lyssna',
    click: 'Metronomklick', suggestions: 'Progressioner i {key}', saved: 'Sparade progressioner', save: 'Spara', name: 'Namn',
    noSaved: 'Inget sparat än.', addChord: 'Lägg till ackord', chooseChord: 'Välj ackord', remove: 'Ta bort', done: 'Klar',
    moveL: 'Flytta vänster', moveR: 'Flytta höger', full: 'En progression rymmer högst {n} ackord', progName: 'Min progression',
    deleted: 'Borttagen', loaded: 'Inläst', savedT: 'Sparad', voicing: 'Grepp',
    circleHint: 'Tryck på en tonart i cirkeln. Den markerade delen innehåller ackorden som hör till den.',
    chordsIn: 'Ackord i {key}', goodProg: 'Bra progressioner i {key}', toStudio: 'Till Studio', sentStudio: 'Skickad till Studio',
    sig0: 'Inga förtecken', sigN: '{n} {acc}', sharps: 'korsförtecken', sharp: 'korsförtecken', flats: 'b-förtecken', flat: 'b-förtecken',
    relMinor: 'Parallell moll', relMajor: 'Parallell dur', showFing: 'Visa grepp',
    scale: 'Skala', position: 'Läge', wholeNeck: 'Hela halsen', showAs: 'Visa', notesL: 'Toner', degrees: 'Steg',
    rootL: 'Grundton', noteL: 'Skalton', blueL: 'Blue note', frets: 'band {a}–{b}', playScale: 'Spela skalan',
    startTuner: 'Starta stämapparaten', stopTuner: 'Stopp', tuning: 'Stämning', calib: 'Kalibrering A4', temperament: 'Temperatur',
    tempRoot: 'Temperaturens tonart', pipe: 'Stämpipa', pipeDesc: 'Tryck på en sträng för att höra tonen', mode: 'Läge', guitar: 'Gitarr', chromatic: 'Kromatisk',
    listen: 'Spela på en sträng', micDenied: 'Stämapparaten behöver mikrofonen. Tillåt den i Androids inställningar.',
    lockHint: 'Tryck på en sträng för att bara stämma den. Tryck igen för automatiskt.', customT: 'Egen stämning', inTune: 'Stämd',
    needle: 'Visare', strobe: 'Stroboskop', tapStart: 'Tryck på Starta och spela en sträng', tuneUp: 'Stäm upp', tuneDown: 'Stäm ner',
    semisLow: '{n} halvton(er) för lågt – stäm upp', semisHigh: '{n} halvton(er) för högt – stäm ner',
    sens: 'Känslighet', sensD: 'Höj för tysta akustiska gitarrer, sänk i stökiga rum',
    grouping: 'Gruppering', subdiv: 'Underdelning', swingD: 'Spelar offbeat-slagen sent, som shuffle', accentPat: 'Betoningsmönster',
    customPat: 'Eget', resetAcc: 'Återställ betoningar', stepHint: 'Tryck på ett steg: normal → betonad → svag → tyst',
    metronome: 'Metronom', perBar: 'Slag per takt', tap: 'Knacka', start: 'Starta', challenge: 'Ackordutmaning',
    challengeDesc: 'Tio ackorddiagram – namnge vart och ett.', go: 'Börja', which: 'Vilket ackord är det här?', next: 'Nästa',
    right: 'Rätt!', wrongIs: 'Det var {c}', result: '{s} av 10', best: 'Bäst: {b} av 10', again: 'Spela igen', hear: 'Lyssna',
    nav_tuner: 'Stämma', nav_circle: 'Kvintcirkel', settings: 'Inställningar', setDisplay: 'Visning', soundOn: 'Spela upp ljud', language: 'Språk', auto: 'Automatiskt', theme: 'Tema', light: 'Ljust', dark: 'Mörkt',
    lefty: 'Vänsterhänt', leftyD: 'Spegelvänd diagram och greppbräda', namesS: 'Tonnamn i diagrammen',
    hNot: 'Svenska tonnamn', hNotD: 'B heter H, B♭ heter B', playStyle: 'Ett tryck på ackorddiagrammet spelar', sound: 'Ljud', volume: 'Volym',
    about: 'Om', aboutT: 'En verktygslåda för gitarrister: ackord, progressioner, kvintcirkeln, skalor, stämapparat och metronom. Fungerar helt utan nätverk.',
    license: 'Fri programvara under GNU GPL v3.', source: 'Källkod',
  },
};
const lang = () => S.lang !== 'auto' ? S.lang : ((navigator.language || 'en').toLowerCase().startsWith('sv') ? 'sv' : 'en');
function t(k, vars) {
  let s = (STR[lang()] && STR[lang()][k]) || STR.en[k] || k;
  if (vars) for (const v in vars) s = s.replace('{' + v + '}', vars[v]);
  return s;
}
const L = o => o[lang()] || o.en;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------------- icons ---------------- */
const I = {
  logo: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c5.2 0 8.6 2.4 8.6 6.6 0 5-4.7 10.7-8.6 13-3.9-2.3-8.6-8-8.6-13 0-4.2 3.4-6.6 8.6-6.6z"/></svg>',
  chords: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M5 8.5h14M5 14h14M9.7 3v18M14.3 3v18"/><circle cx="9.7" cy="11.2" r="1.6" fill="currentColor"/><circle cx="14.3" cy="16.8" r="1.6" fill="currentColor"/></svg>',
  studio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="5" width="7.5" height="6" rx="1.5"/><rect x="13.5" y="5" width="7.5" height="6" rx="1.5"/><rect x="3" y="14" width="7.5" height="6" rx="1.5"/><rect x="13.5" y="14" width="7.5" height="6" rx="1.5"/></svg>',
  circle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.4"/><path d="M12 3v4.6M12 16.4V21M3 12h4.6M16.4 12H21M5.6 5.6l3.3 3.3M15.1 15.1l3.3 3.3M18.4 5.6l-3.3 3.3M8.9 15.1l-3.3 3.3"/></svg>',
  scales: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 6.5h20M2 12h20M2 17.5h20M8 4v16M15 4v16" opacity=".55"/><circle cx="5" cy="6.5" r="2" fill="currentColor"/><circle cx="11.5" cy="12" r="2" fill="currentColor"/><circle cx="18.5" cy="17.5" r="2" fill="currentColor"/></svg>',
  tuner: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3.5 17a8.5 8.5 0 0 1 17 0"/><path d="M12 17l3.6-6.2"/><circle cx="12" cy="17" r="1.3" fill="currentColor"/><path d="M12 8.5v1.6M6.6 11.1l1.1 1.1M17.4 11.1l-1.1 1.1"/></svg>',
  practice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><path d="M9.2 3h5.6L19 21H5z"/><path d="M7 15.5h10M12 15.5l4.5-9"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6.5h9M18 6.5h2M4 12h3M11 12h9M4 17.5h11M19 17.5h1"/><circle cx="15.5" cy="6.5" r="2.2"/><circle cx="9" cy="12" r="2.2"/><circle cx="17" cy="17.5" r="2.2"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  arp: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="17" r="2.4"/><circle cx="12" cy="12" r="2.4"/><circle cx="19" cy="7" r="2.4"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.6" r="1.1" fill="currentColor" stroke="none"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>',
};
const TABS = ['chords', 'studio', 'circle', 'scales', 'tuner', 'practice'];

/* ---------------- helpers ---------------- */
const spell = () => undefined;
const cname = (r, ti, b) => chordName(r, ti, b);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('on');
  clearTimeout(toast.tm);
  toast.tm = setTimeout(() => el.classList.remove('on'), 1800);
}
function keepAwake() {
  const on = Studio.clock.running || Metro.clock.running || Pitch.running || CircleTab.clock.running;
  if (AND && AND.keepAwake) AND.keepAwake(on);
}
function seg(name, opts, cur) {
  return `<div class="seg" data-seg="${name}">${opts.map(([v, l]) => `<button data-a="seg" data-k="${name}" data-v="${v}" class="${String(v) === String(cur) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
}
function rootGrid(action, cur, extra = '') {
  return `<div class="grid12">${[...Array(12).keys()].map(pc => `<button class="chip ${pc === cur ? 'on' : ''}" data-a="${action}" data-v="${pc}" ${extra}>${nn(pc)}</button>`).join('')}</div>`;
}
function vfor(c) {
  const vs = voicings(c.r, c.t, c.b);
  return vs[clamp(c.v || 0, 0, vs.length - 1)] || null;
}

/** Sharps or flats for a chord's notes, following its own key (E major → G♯, F major → B♭). */
function chordSpell(r, ti) {
  const sfx = TYPES[ti].sfx;
  if (MIXED[mod12(r)].includes('♭')) return 'f';     // keep the root as it is named (E♭m → E♭ G♭ B♭)
  if (MIXED[mod12(r)].includes('♯')) return 's';
  const minor = /^m(?!aj)/.test(sfx) || sfx.startsWith('dim') || sfx === 'm7b5';
  const sp = keySpell(r, minor);
  if (sp) return sp;
  return /7|9|11|13/.test(sfx) && !/maj/.test(sfx) ? 'f' : undefined;   // C7 → B♭
}
/* ---------------- chord diagram ---------------- */
/**
 * SVG chord box. Strings run vertically, low E on the left (on the right when left-handed).
 */
function diagram(v, root, opt = {}) {
  const mini = !!opt.mini, labels = !mini && opt.labels ? opt.labels : null;
  const names = !mini && !labels && S.names;
  const mode = labels ? (opt.dot || 'finger') : 'finger';
  const W = 124, padL = 23, sx = 16, top = 26, sy = 22, rows = 5;
  const H = top + sy * rows + (names ? 22 : 10);
  const dotText = (i, f) => {
    const pc = mod12(STD[i] + f);
    if (mode === 'note') return nn(pc, opt.spell);
    if (mode === 'interval') return labels.get(pc) || '';
    return v.fing[i] ? String(v.fing[i]) : '';
  };
  const fs = txt => txt.length > 1 ? 8 : 10;
  if (!v) return `<svg viewBox="0 0 ${W} ${H}" class="${opt.cls || ''}"></svg>`;
  const x = i => padL + (S.lefty ? 5 - i : i) * sx;
  const fretted = v.frets.filter(f => f > 0);
  const maxF = fretted.length ? Math.max(...fretted) : 0;
  const minF = fretted.length ? Math.min(...fretted) : 0;
  const base = maxF <= rows ? 1 : minF;
  const y = f => top + (f - base + 0.5) * sy;
  let s = `<svg viewBox="0 0 ${W} ${H}" class="${opt.cls || ''}" xmlns="http://www.w3.org/2000/svg">`;
  for (let j = 0; j <= rows; j++) s += `<line x1="${x(0) - (S.lefty ? -0 : 0)}" x2="${x(5)}" y1="${top + j * sy}" y2="${top + j * sy}" style="stroke:var(--fret)" stroke-width="1.4"/>`;
  for (let i = 0; i < 6; i++) s += `<line x1="${x(i)}" x2="${x(i)}" y1="${top}" y2="${top + rows * sy}" style="stroke:var(--str)" stroke-width="${1 + (5 - i) * 0.16}"/>`;
  if (base === 1) s += `<rect x="${Math.min(x(0), x(5)) - 1}" y="${top - 4}" width="${Math.abs(x(5) - x(0)) + 2}" height="5" rx="1.5" style="fill:var(--ink)"/>`;
  else s += `<text x="${S.lefty ? W - 2 : 2}" y="${top + sy * 0.5 + 4}" font-size="11" font-weight="700" text-anchor="${S.lefty ? 'end' : 'start'}" style="fill:var(--muted)">${base}</text>`;
  for (let i = 0; i < 6; i++) {
    const f = v.frets[i];
    if (f < 0) s += `<path d="M${x(i) - 4} ${top - 16}l8 8M${x(i) + 4} ${top - 16}l-8 8" style="stroke:var(--muted)" stroke-width="1.6" stroke-linecap="round"/>`;
    else if (f === 0) {
      const isR = mod12(STD[i]) === root;
      if (mode === 'finger') s += `<circle cx="${x(i)}" cy="${top - 12}" r="4.2" fill="none" style="stroke:${isR ? 'var(--root)' : 'var(--ink)'}" stroke-width="1.6"/>`;
      else {
        const txt = dotText(i, 0);
        s += `<circle cx="${x(i)}" cy="${top - 12}" r="7" style="fill:var(--card);stroke:${isR ? 'var(--root)' : 'var(--ink)'}" stroke-width="1.4"/>`;
        s += `<text x="${x(i)}" y="${top - 8.6}" font-size="${fs(txt)}" font-weight="700" text-anchor="middle" style="fill:${isR ? 'var(--root)' : 'var(--ink)'}">${txt}</text>`;
      }
    }
  }
  if (v.barre) {
    const xa = Math.min(x(v.barre.from), x(v.barre.to)), xb = Math.max(x(v.barre.from), x(v.barre.to));
    s += `<rect x="${xa - 7}" y="${y(v.barre.fret) - 7}" width="${xb - xa + 14}" height="14" rx="7" style="fill:var(--accent)"/>`;
    if (!mini && mode === 'finger') s += `<text x="${(xa + xb) / 2}" y="${y(v.barre.fret) + 3.6}" font-size="10" font-weight="700" text-anchor="middle" style="fill:var(--on-accent)">1</text>`;
  }
  for (let i = 0; i < 6; i++) {
    const f = v.frets[i];
    if (f <= 0) continue;
    const inBarre = v.barre && f === v.barre.fret && i >= v.barre.from && i <= v.barre.to;
    const isRoot = mod12(STD[i] + f) === root;
    if (inBarre) {
      if (mode !== 'finger') {
        s += `<circle cx="${x(i)}" cy="${y(f)}" r="7" style="fill:${isRoot ? 'var(--root)' : 'var(--accent)'}"/>`;
        const txt = dotText(i, f);
        s += `<text x="${x(i)}" y="${y(f) + 3.3}" font-size="${fs(txt)}" font-weight="700" text-anchor="middle" style="fill:${isRoot ? '#fff' : 'var(--on-accent)'}">${txt}</text>`;
      } else if (isRoot) s += `<circle cx="${x(i)}" cy="${y(f)}" r="3" style="fill:var(--root)"/>`;
      continue;
    }
    s += `<circle cx="${x(i)}" cy="${y(f)}" r="7" style="fill:${isRoot ? 'var(--root)' : 'var(--accent)'}"/>`;
    if (!mini) { const txt = dotText(i, f); if (txt) s += `<text x="${x(i)}" y="${y(f) + 3.4}" font-size="${fs(txt)}" font-weight="700" text-anchor="middle" style="fill:${isRoot ? '#fff' : 'var(--on-accent)'}">${txt}</text>`; }
  }
  if (names) for (let i = 0; i < 6; i++) {
    const f = v.frets[i];
    if (f < 0) continue;
    s += `<text x="${x(i)}" y="${top + rows * sy + 16}" font-size="9.5" text-anchor="middle" style="fill:var(--muted)">${nn(STD[i] + f, opt.spell)}</text>`;
  }
  return s + '</svg>';
}

/* ---------------- sheet ---------------- */
const Sheet = {
  onClose: null,
  open(html, onClose) {
    $('#sheetBody').innerHTML = html;
    $('#sheet').classList.add('on');
    $('#scrim').classList.add('on');
    this.onClose = onClose || null;
    if (!this.isOpen) history.pushState({ sheet: 1 }, '');
    this.isOpen = true;
  },
  update(html) { $('#sheetBody').innerHTML = html; },
  close() { if (this.isOpen) history.back(); },
  _closed() {
    this.isOpen = false;
    $('#sheet').classList.remove('on');
    $('#scrim').classList.remove('on');
    const cb = this.onClose; this.onClose = null;
    if (cb) cb();
  },
};
window.addEventListener('popstate', () => { if (Sheet.isOpen) Sheet._closed(); });

/* =======================================================================
   CHORDS
   ======================================================================= */
const Chords = {
  c: Object.assign({ r: 0, t: 0, b: null, v: 0 }, store.get('chord', {})),
  favs: store.get('favs', []),
  save() { store.set('chord', this.c); },
  isFav() { return this.favs.some(f => f.r === this.c.r && f.t === this.c.t && f.b === this.c.b && f.v === this.c.v); },

  render() {
    const c = this.c, vs = voicings(c.r, c.t, c.b);
    c.v = clamp(c.v, 0, Math.max(0, vs.length - 1));
    const v = vs[c.v];
    const T = TYPES[c.t];
    const pcs = [];
    T.req.concat(T.opt).sort((a, b) => a - b).forEach(s => pcs.push({ pc: mod12(c.r + s), lab: intervalLabel(c.t, s) }));
    if (c.b != null && !pcs.some(p => p.pc === c.b)) pcs.unshift({ pc: c.b, lab: t('bassShort') });
    const labels = new Map(pcs.map(p => [p.pc, p.lab]));
    const sp = chordSpell(c.r, c.t);
    const posTxt = v ? (v.pos <= 1 && v.frets.some(f => f === 0) ? t('openPos') : t('atFret', { n: v.pos })) : '';
    $('#tab-chords').innerHTML = `
      <div class="card">
        <div class="chordhead">
          <div class="grow" style="min-width:0"><div class="chordname">${cname(c.r, c.t, c.b)}</div>
          <div class="chordlong">${nn(c.r)} ${L(T)}${c.b != null ? ' / ' + nn(c.b) : ''}</div></div>
          <button class="iconbtn star ${this.isFav() ? 'on' : ''}" data-a="fav" aria-label="favourite">${I.star}</button>
        </div>
        ${v ? `
        <div class="diagwrap">
          <button class="iconbtn" data-a="vprev" ${c.v === 0 ? 'disabled style="opacity:.25"' : ''}>${I.left}</button>
          <div id="bigdiag" data-a="playCur">${diagram(v, c.r, { cls: 'big', labels, dot: S.dotLabel, spell: sp })}</div>
          <button class="iconbtn" data-a="vnext" ${c.v >= vs.length - 1 ? 'disabled style="opacity:.25"' : ''}>${I.right}</button>
        </div>
        <div class="voicenav">${t('fingering', { i: c.v + 1, n: vs.length })} · ${posTxt}</div>
        <div class="chordbar">
          ${seg('dotl', [['finger', t('fingers')], ['note', t('notesL')], ['interval', '1·3·5']], S.dotLabel)}
          <button class="btn primary sq" data-a="strum" aria-label="${esc(t('strum'))}">${I.play}</button>
          <button class="btn sq" data-a="arp" aria-label="${esc(t('arp'))}">${I.arp}</button>
        </div>
        ${vs.length > 1 ? `<div class="lbl" style="margin-top:10px">${t('otherFing')}</div>` : ''}
        <div class="thumbs" id="thumbs">${vs.map((x, i) => `<div class="thumb ${i === c.v ? 'on' : ''}" data-a="vsel" data-v="${i}">${diagram(x, c.r, { mini: true })}</div>`).join('')}</div>
        ` : `<div class="empty" style="padding:30px 0;text-align:center">${t('noVoicing')}</div>`}
      </div>
      <div class="card">
        <div class="lbl">${t('favourites')}</div>
        <div class="favs">${this.favs.length ? this.favs.map((f, i) => `
          <div class="fav" data-a="openFav" data-v="${i}">${diagram(vfor(f), f.r, { mini: true })}<b>${cname(f.r, f.t, f.b)}</b></div>`).join('')
          : `<div class="empty">${t('noFavs')}</div>`}</div>
      </div>
      <div class="card">
        <div class="lbl">${t('root')}</div>
        ${rootGrid('croot', c.r)}
        <div class="lbl">${t('type')}</div>
        <div class="chips">${TYPES.map((x, i) => `<button class="chip ${i === c.t ? 'on' : ''}" data-a="ctype" data-v="${i}">${x.sfx ? pretty(x.sfx) : L({ en: 'maj', sv: 'dur' })}</button>`).join('')}</div>
        <div class="lbl">${t('bass')}</div>
        <div class="chips scroll"><button class="chip ${c.b == null ? 'on' : ''}" data-a="cbass" data-v="">${t('none')}</button>${[...Array(12).keys()].filter(pc => pc !== c.r).map(pc => `<button class="chip ${pc === c.b ? 'on' : ''}" data-a="cbass" data-v="${pc}">/${nn(pc)}</button>`).join('')}</div>
      </div>`;
    const th = $('#thumbs .thumb.on'), row = $('#thumbs');
    if (th) row.scrollLeft = th.offsetLeft - row.offsetLeft - (row.clientWidth - th.clientWidth) / 2;
    this.bindSwipe();
  },

  set(o, play) {
    Object.assign(this.c, o);
    this.save();
    this.render();
    if (play) this.play();
  },
  play(style) {
    const v = vfor(this.c);
    if (v) Snd.chord(v.frets, STD, 0, style || S.style);
  },
  toggleFav() {
    const c = this.c;
    const i = this.favs.findIndex(f => f.r === c.r && f.t === c.t && f.b === c.b && f.v === c.v);
    if (i >= 0) { this.favs.splice(i, 1); toast(t('favRemoved')); }
    else { this.favs.push({ r: c.r, t: c.t, b: c.b, v: c.v }); toast(t('favAdded')); }
    store.set('favs', this.favs);
    this.render();
  },

  suggestions(q) {
    q = q.trim();
    if (!q) return [];
    const out = [], seen = new Set();
    const add = (r, ti, b) => { const n = cname(r, ti, b); if (!seen.has(n)) { seen.add(n); out.push({ r, t: ti, b, n }); } };
    const p = parseChord(q);
    if (p) add(p.r, p.t, p.b);
    const norm = s => s.toLowerCase().replace(/♯/g, '#').replace(/♭/g, 'b');
    const nq = norm(q);
    if (!q.includes('/')) {
      for (let r = 0; r < 12 && out.length < 9; r++) {
        const names = [nn(r), nn(r, 's'), nn(r, 'f')];
        for (let ti = 0; ti < TYPES.length && out.length < 9; ti++) {
          if (names.some(nm => norm(nm + TYPES[ti].sfx).startsWith(nq))) add(r, ti, null);
        }
      }
    }
    return out.slice(0, 8);
  },
  /** Search field in the top bar: picking a chord opens it on the Chords tab. */
  bindSearch() {
    const inp = $('#hsearch'), box = $('#hsugg');
    let list = [], hi = 0;
    const show = () => {
      list = this.suggestions(inp.value);
      hi = 0;
      box.innerHTML = list.map((s, i) => `<button data-i="${i}" class="${i === hi ? 'hi' : ''}">${s.n}</button>`).join('');
      box.style.display = list.length ? 'block' : 'none';
    };
    const pick = s => {
      inp.value = ''; box.style.display = 'none'; inp.blur();
      Object.assign(this.c, { r: s.r, t: s.t, b: s.b, v: 0 });
      this.save();
      if (S.tab !== 'chords') showTab('chords'); else { this.render(); window.scrollTo(0, 0); }
      this.play();
    };
    inp.addEventListener('input', show);
    inp.addEventListener('focus', show);
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter' && list[hi]) pick(list[hi]);
      else if (e.key === 'Escape') { inp.value = ''; inp.blur(); }
    });
    box.addEventListener('mousedown', e => e.preventDefault());
    box.addEventListener('click', e => { const b = e.target.closest('button'); if (b) pick(list[+b.dataset.i]); });
    inp.addEventListener('blur', () => setTimeout(() => { box.style.display = 'none'; }, 150));
  },
  bindSwipe() {
    const el = $('#bigdiag');
    if (!el) return;
    let x0 = null, y0 = 0;
    el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener('touchend', e => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault();
        const n = voicings(this.c.r, this.c.t, this.c.b).length;
        const nv = clamp(this.c.v + (dx < 0 ? 1 : -1) * (S.lefty ? -1 : 1), 0, n - 1);
        if (nv !== this.c.v) this.set({ v: nv }, true);
        Chords.swiped = Date.now();
      }
    });
  },
  action(a, v) {
    switch (a) {
      case 'croot': this.set({ r: +v, v: 0, b: this.c.b === +v ? null : this.c.b }, true); break;
      case 'ctype': this.set({ t: +v, v: 0 }, true); break;
      case 'cbass': this.set({ b: v === '' ? null : +v, v: 0 }, true); break;
      case 'vprev': this.set({ v: this.c.v - 1 }, true); break;
      case 'vnext': this.set({ v: this.c.v + 1 }, true); break;
      case 'vsel': this.set({ v: +v }, true); break;
      case 'playCur': if (!Chords.swiped || Date.now() - Chords.swiped > 400) this.play(); break;
      case 'cnote': Snd.pluck(48 + mod12(+v - 48 + 12), 0, -1); break;
      case 'strum': this.play('strum'); break;
      case 'arp': this.play('arp'); break;
      case 'fav': this.toggleFav(); break;
      case 'openFav': { const f = this.favs[+v]; this.set({ r: f.r, t: f.t, b: f.b, v: f.v }, true); window.scrollTo({ top: 0, behavior: 'smooth' }); break; }
      default: return false;
    }
    return true;
  },
};

/* =======================================================================
   CHORD PICKER (used by Studio)
   ======================================================================= */
function pickerHtml(c, idx, total) {
  const vs = voicings(c.r, c.t, c.b);
  return `<h2>${t('chooseChord')} · ${cname(c.r, c.t, c.b)}</h2>
    <div class="lbl">${t('root')}</div>${rootGrid('pkroot', c.r)}
    <div class="lbl">${t('type')}</div>
    <div class="chips">${TYPES.map((x, i) => `<button class="chip ${i === c.t ? 'on' : ''}" data-a="pktype" data-v="${i}">${x.sfx ? pretty(x.sfx) : L({ en: 'maj', sv: 'dur' })}</button>`).join('')}</div>
    <div class="lbl">${t('bass')}</div>
    <div class="chips scroll"><button class="chip ${c.b == null ? 'on' : ''}" data-a="pkbass" data-v="">${t('none')}</button>${[...Array(12).keys()].filter(pc => pc !== c.r).map(pc => `<button class="chip ${pc === c.b ? 'on' : ''}" data-a="pkbass" data-v="${pc}">/${nn(pc)}</button>`).join('')}</div>
    <div class="lbl">${t('voicing')}</div>
    <div class="thumbs">${vs.map((x, i) => `<div class="thumb ${i === c.v ? 'on' : ''}" data-a="pkv" data-v="${i}">${diagram(x, c.r, { mini: true })}</div>`).join('')}</div>
    <div class="row" style="margin-top:14px">
      ${idx != null ? `<button class="btn small" data-a="pkmove" data-v="-1" ${idx === 0 ? 'disabled' : ''}>${I.left}</button>
      <button class="btn small" data-a="pkmove" data-v="1" ${idx >= total - 1 ? 'disabled' : ''}>${I.right}</button>
      <button class="btn small" data-a="pkdel">${I.trash}${t('remove')}</button>` : ''}
      <span class="grow"></span>
      <button class="btn primary" data-a="pkdone">${t('done')}</button>
    </div>`;
}

/* =======================================================================
   STUDIO – progressions
   ======================================================================= */
const MAX_SLOTS = 16;
const Studio = {
  p: Object.assign({ key: 0, minor: false, bpm: 90, meter: '4/4', bars: 1, strum: 'faithful', drums: 'pop', swing: 0,
                     countIn: true, click: false, drumVol: 0.7, slots: null }, store.get('prog', {})),
  saved: store.get('progs', []),
  playing: -1,
  clock: new BeatClock((n, time) => Studio.beat(n, time)),

  init() {
    delete this.p.beats; delete this.p.pattern;            // settings from version 1.0
    if (!this.p.slots) this.p.slots = PROGRESSIONS.major[0].seq.map(r => Object.assign(romanChord(r, 0, false), { v: 0 }));
  },
  save() { store.set('prog', this.p); },
  keyName() { return nn(this.p.key, keySpell(this.p.key, this.p.minor)) + ' ' + (this.p.minor ? t('minor') : t('major')).toLowerCase(); },

  meter() { return METERS.find(m => m.id === this.p.meter) || METERS[0]; },
  strum() { return STRUMS.find(x => x.id === this.p.strum && x.m === this.p.meter) || STRUMS.find(x => x.m === this.p.meter); },
  drumPat() { return DRUMS.find(x => x.id === this.p.drums && (x.m === this.p.meter || x.m === '*')) || DRUMS[0]; },
  barChoices() {
    const m = this.meter();
    return (m.beats % 2 === 0 ? [0.5] : []).concat([1, 2, 4]);
  },
  eighthFactor(unit) { return unit === '♪' ? 1 : unit === '♩.' ? 3 : 2; },
  bpmRange() { return this.meter().unit === '♪' ? [60, 400] : [30, 240]; },
  canSwing() { const m = this.meter(), sp = this.strum(); return !m.compound && (sp.sub === 2 || sp.sub === 4); },

  /** The strumming pattern as a row of steps with arrows and counts. */
  gridHtml() {
    const m = this.meter(), sp = this.strum(), labs = countLabels(m, sp.sub);
    const SYM = { D: '↓', d: '↓', U: '↑', u: '↑', x: '✕', S: '↓', M: 'PM', m: 'pm', B: 'B', A: 'B²', P: 'P', p: 'p' };
    const soft = 'dum';
    const cells = sp.p.split('').map((c, i) => {
      const sym = SYM[c] || (c >= '1' && c <= '6' ? c : '');
      const beat = i % sp.sub === 0 && (!m.groups || m.groups.includes(i));
      return `<div class="sg ${beat ? 'bt' : ''} ${soft.includes(c) ? 'soft' : ''} ${c === 'S' ? 'stab' : ''}"><b>${sym}</b><i>${labs[i]}</i></div>`;
    }).join('');
    const used = new Set(sp.p.replace(/[1-6]/g, '1').toUpperCase().split(''));
    const leg = [['D', '↓', t('lgDown')], ['U', '↑', t('lgUp')], ['X', '✕', t('lgMute')], ['S', '↓·', t('lgStab')],
      ['M', 'PM', t('lgPalm')], ['B', 'B', t('lgBass')], ['A', 'B²', t('lgBass2')], ['P', 'P', t('lgPinch')], ['1', '1–6', t('lgString')]]
      .filter(([k]) => used.has(k) || (k === 'P' && sp.p.includes('p')));
    return `<div class="sgrid" style="grid-template-columns:repeat(${sp.p.length},minmax(0,1fr))">${cells}</div>
      <div class="sleg">${leg.map(([, s, l]) => `<span><b>${s}</b> ${l}</span>`).join('')}<span class="muted">${t('lgSoft')}</span></div>`;
  },

  render() {
    const p = this.p, m = this.meter(), sp = this.strum(), dp = this.drumPat();
    p.strum = sp.id; p.drums = dp.id;
    if (!this.barChoices().includes(p.bars)) p.bars = 1;
    const progs = PROGRESSIONS[p.minor ? 'minor' : 'major'];
    const [lo, hi] = this.bpmRange();
    const barLabel = b => b === 0.5 ? t('halfBar') : b + ' ' + (b === 1 ? t('bar') : t('bars'));
    $('#tab-studio').innerHTML = `
      <div class="card">
        <div class="slots">${p.slots.map((c, i) => `
          <div class="slot ${i === this.playing ? 'play' : ''}" data-a="slot" data-v="${i}">
            <b>${cname(c.r, c.t, c.b)}</b><small>${c.roman ? esc(c.roman) : '&nbsp;'}</small>${diagram(vfor(c), c.r, { mini: true })}</div>`).join('')}
          ${p.slots.length < MAX_SLOTS ? `<div class="slot add" data-a="slotAdd">+</div>` : ''}
        </div>
        <div class="row" style="margin-top:12px">
          <button class="btn primary grow" data-a="sPlay" ${p.slots.length ? '' : 'disabled'}>${this.clock.running ? I.stop + t('stop') : I.play + t('play')}</button>
          <button class="btn" data-a="sTrans" data-v="-1">−1</button>
          <span class="small muted">${t('transpose')}</span>
          <button class="btn" data-a="sTrans" data-v="1">+1</button>
        </div>
        <div class="countin" id="scount"></div>
        <div class="lbl">${t('tempo')} · <b style="color:var(--ink)"><span class="unit">${m.unit}</span> = <span id="sbpm">${p.bpm}</span></b></div>
        <input type="range" min="${lo}" max="${hi}" value="${p.bpm}" id="sbpmr">
      </div>
      <div class="card">
        <div class="lbl">${t('timeSig')}</div>
        <div class="chips">${METERS.map(x => `<button class="chip ${x.id === p.meter ? 'on' : ''}" data-a="sMeter" data-v="${x.id}">${x.id}</button>`).join('')}</div>
        <div class="lbl">${t('chordLen')}</div>
        ${seg('bars', this.barChoices().map(b => [b, barLabel(b)]), p.bars)}
        <div class="lbl">${t('strumming')}</div>
        <select id="sstrum">${STRUMS.filter(x => x.m === p.meter).map(x => `<option value="${x.id}" ${x.id === sp.id ? 'selected' : ''}>${L(x)}</option>`).join('')}</select>
        <div id="sgridWrap" style="margin-top:10px" data-a="sPreview">${this.gridHtml()}</div>
        ${this.canSwing() ? `<div class="lbl">${t('feel')} · <b style="color:var(--ink)" id="sswingv">${p.swing ? t('swing') + ' ' + Math.round(p.swing * 100) + ' %' : t('straight')}</b></div>
        <input type="range" min="0" max="1" step="0.05" value="${p.swing}" id="sswing">` : ''}
        <div class="lbl">${t('drumsL')}</div>
        <select id="sdrums">${DRUMS.filter(x => x.m === p.meter || x.m === '*').map(x => `<option value="${x.id}" ${x.id === dp.id ? 'selected' : ''}>${L(x)}</option>`).join('')}</select>
        ${dp.id !== 'none' ? `<div class="setrow" style="border:0;padding-bottom:0"><div style="flex:none">${t('drumVol')}</div><input type="range" min="0" max="1" step="0.05" value="${p.drumVol}" id="sdvol" style="flex:1"></div>` : ''}
        <div class="setrow"><div>${t('countIn')}</div>
          <label class="switch"><input type="checkbox" id="scountin" ${p.countIn ? 'checked' : ''}><span></span></label></div>
        <div class="setrow" style="padding-bottom:0"><div>${t('click')}</div>
          <label class="switch"><input type="checkbox" id="sclick" ${p.click ? 'checked' : ''}><span></span></label></div>
      </div>
      <div class="card">
        <div class="lbl">${t('key')}</div>
        ${rootGrid('sKey', p.key)}
        <div style="margin-top:8px">${seg('mode', [['0', t('major')], ['1', t('minor')]], p.minor ? '1' : '0')}</div>
        <div class="lbl">${t('suggestions', { key: this.keyName() })}</div>
        <div class="list">${progs.map((g, i) => `
          <div class="item" data-a="sSug" data-v="${i}"><div class="t"><b>${L(g)}</b>
          <span>${g.seq.map(r => { const c = romanChord(r, p.key, p.minor); return cname(c.r, c.t); }).join(' – ')}</span></div></div>`).join('')}</div>
      </div>
      <div class="card">
        <div class="row"><div class="lbl grow" style="margin:0">${t('saved')}</div>
          <button class="btn small" data-a="sSave">${t('save')}</button>
          <button class="btn small" data-a="sClear">${t('clear')}</button></div>
        <div class="list" style="margin-top:10px">${this.saved.length ? this.saved.map((g, i) => `
          <div class="item"><div class="t" data-a="sLoad" data-v="${i}"><b>${esc(g.name)}</b>
          <span>${g.meter ? g.meter + ' · ' : ''}${g.slots.map(c => cname(c.r, c.t, c.b)).join(' – ')}</span></div>
          <button class="iconbtn" data-a="sDel" data-v="${i}">${I.trash}</button></div>`).join('') : `<div class="empty">${t('noSaved')}</div>`}</div>
      </div>`;
    const on = (id, ev, fn) => { const el = $('#' + id); if (el) el.addEventListener(ev, fn); };
    on('sbpmr', 'input', e => { p.bpm = +e.target.value; $('#sbpm').textContent = p.bpm; this.clock.setBpm(p.bpm); this.save(); });
    on('sclick', 'change', e => { p.click = e.target.checked; this.save(); });
    on('scountin', 'change', e => { p.countIn = e.target.checked; this.save(); });
    on('sstrum', 'change', e => { p.strum = e.target.value; this.save(); this.render(); });
    on('sdrums', 'change', e => { p.drums = e.target.value; this.save(); this.render(); });
    on('sdvol', 'input', e => { p.drumVol = +e.target.value; if (Snd.drums) Snd.drums.gain.value = p.drumVol; this.save(); });
    on('sswing', 'input', e => {
      p.swing = +e.target.value; this.save();
      $('#sswingv').textContent = p.swing ? t('swing') + ' ' + Math.round(p.swing * 100) + ' %' : t('straight');
    });
  },
  highlight(i) {
    this.playing = i;
    document.querySelectorAll('#tab-studio .slot').forEach((el, k) => el.classList.toggle('play', k === i));
  },
  hlStep(i) {
    const cells = document.querySelectorAll('#tab-studio .sg');
    cells.forEach((el, k) => el.classList.toggle('on', k === i));
  },
  toggle() {
    if (this.clock.running) { this.stop(); return; }
    if (!this.p.slots.length) return;
    Snd.init();
    Snd.drums.gain.value = this.p.drumVol;
    this.st = {};
    this.clock.start(this.p.bpm);
    keepAwake();
    this.render();
  },
  stop() {
    this.clock.stop();
    if (Snd.ctx) Snd.damp(Snd.ctx.currentTime);
    this.highlight(-1);
    this.hlStep(-1);
    keepAwake();
    this.render();
  },
  /** time offset of step j inside a beat, with swing on the off-beats */
  offset(j, sub, spb) {
    let o = j * spb / sub;
    if (this.p.swing > 0 && !this.meter().compound) {
      if (sub === 2 && j === 1) o += this.p.swing * spb / 6;
      if (sub === 4 && j % 2 === 1) o += this.p.swing * spb / 12;
    }
    return o;
  },
  beat(n, time) {
    const p = this.p, slots = p.slots, m = this.meter();
    if (!slots.length) { this.stop(); return; }
    const spb = 60 / this.clock.bpm;
    const lead = p.countIn ? m.beats : 0;
    const clicks = bi => !m.groups || m.groups.includes(bi);
    if (n < lead) {                                        // count-in bar: clicks only
      if (clicks(n)) Snd.click(time, n === 0);
      const shown = m.groups ? m.groups.indexOf(n) + 1 : n + 1;
      if (clicks(n)) atTime(time, () => { const el = $('#scount'); if (el) el.textContent = shown; });
      return;
    }
    if (n === lead) atTime(time, () => { const el = $('#scount'); if (el) el.textContent = ''; });
    const k = n - lead, bib = k % m.beats;
    const beatsPerChord = p.bars * m.beats;
    const i = Math.floor(k / beatsPerChord) % slots.length;
    const v = vfor(slots[i]);
    if (p.click && clicks(bib)) Snd.click(time, bib === 0);
    const sp = this.strum();
    for (let j = 0; j < sp.sub; j++) {
      const step = bib * sp.sub + j, tt = time + this.offset(j, sp.sub, spb);
      if (v) Snd.stroke(sp.p[step], v.frets, STD, tt, this.st, sp.sub >= 4 || spb < 0.4);
      atTime(tt, () => { if (this.clock.running) this.hlStep(step); });
    }
    const dp = this.drumPat();
    if (dp.sub) for (let j = 0; j < dp.sub; j++) {
      const step = bib * dp.sub + j, tt = time + this.offset(j, dp.sub, spb);
      for (const lane of 'ksrho') {
        const ch = dp[lane] && dp[lane][step];
        if (ch && ch !== '-') Snd.drum(lane, tt, ch === 'X' ? 1 : ch === 'g' ? 0.35 : 0.75);
      }
    }
    if (k % beatsPerChord === 0) atTime(time, () => { if (this.clock.running) this.highlight(i); });
  },
  /** Play one bar of the strumming pattern on the first chord, so you can hear it. */
  preview() {
    if (this.clock.running || !this.p.slots.length) return;
    const v = vfor(this.p.slots[0]), sp = this.strum(), m = this.meter();
    if (!v) return;
    const spb = 60 / this.p.bpm, t0 = Snd.now() + 0.05, st = {};
    for (let b = 0; b < m.beats; b++) for (let j = 0; j < sp.sub; j++) {
      const step = b * sp.sub + j, tt = t0 + b * spb + this.offset(j, sp.sub, spb);
      Snd.stroke(sp.p[step], v.frets, STD, tt, st, sp.sub >= 4 || spb < 0.4);
      atTime(tt, () => this.hlStep(step));
    }
    atTime(t0 + m.beats * spb, () => { if (!this.clock.running) this.hlStep(-1); });
  },
  transpose(d) {
    this.p.key = mod12(this.p.key + d);
    this.p.slots.forEach(c => { c.r = mod12(c.r + d); if (c.b != null) c.b = mod12(c.b + d); c.v = 0; });
    this.save(); this.render();
  },
  setSlots(seq, key, minor) {
    this.p.key = key; this.p.minor = minor;
    this.p.slots = seq.map(r => Object.assign(romanChord(r, key, minor), { v: 0 }));
    this.save();
  },

  edit: null,
  openPicker(i) {
    this.edit = i;
    const c = i == null ? Object.assign({}, this.p.slots[this.p.slots.length - 1] || { r: this.p.key, t: 0, b: null, v: 0 }) : this.p.slots[i];
    if (i == null) { delete c.roman; this.p.slots.push(c); this.edit = this.p.slots.length - 1; }
    this.pick = this.p.slots[this.edit];
    Sheet.open(pickerHtml(this.pick, this.edit, this.p.slots.length), () => { this.save(); this.render(); });
  },
  refreshPicker(play) {
    delete this.pick.roman;
    Sheet.update(pickerHtml(this.pick, this.edit, this.p.slots.length));
    if (play) { const v = vfor(this.pick); if (v) Snd.chord(v.frets, STD, 0, 'strum'); }
  },

  action(a, v) {
    const p = this.p;
    switch (a) {
      case 'slot': if (!this.clock.running) this.openPicker(+v); else { const x = vfor(p.slots[+v]); if (x) Snd.chord(x.frets, STD, 0); } break;
      case 'slotAdd': if (p.slots.length >= MAX_SLOTS) toast(t('full', { n: MAX_SLOTS })); else this.openPicker(null); break;
      case 'sPlay': this.toggle(); break;
      case 'sPreview': this.preview(); break;
      case 'sMeter': {
        if (v === p.meter) break;
        const was = this.meter(), wasRunning = this.clock.running;
        if (wasRunning) this.clock.stop();
        const eighths = p.bpm * this.eighthFactor(was.unit);
        p.meter = v;
        const [lo, hi] = this.bpmRange();
        p.bpm = clamp(Math.round(eighths / this.eighthFactor(this.meter().unit)), lo, hi);
        p.strum = ''; p.drums = DRUMS.find(x => x.m === v) ? DRUMS.find(x => x.m === v).id : 'none';
        this.save(); this.render();
        if (wasRunning) this.toggle();
        break;
      }
      case 'sTrans': this.transpose(+v); break;
      case 'sKey': {
        const d = mod12(+v - p.key);
        if (d) this.transpose(d > 6 ? d - 12 : d);
        break;
      }
      case 'sSug': this.setSlots(PROGRESSIONS[p.minor ? 'minor' : 'major'][+v].seq, p.key, p.minor); this.render(); window.scrollTo({ top: 0, behavior: 'smooth' }); break;
      case 'sSave': this.askSave(); break;
      case 'sClear': this.stop(); p.slots = []; this.save(); this.render(); break;
      case 'sLoad': {
        const g = this.saved[+v];
        const keep = { key: g.key, minor: g.minor, bpm: g.bpm || p.bpm, slots: g.slots };
        for (const f of ['meter', 'bars', 'strum', 'drums', 'swing']) if (g[f] != null) keep[f] = g[f];
        if (this.clock.running) this.stop();
        Object.assign(p, JSON.parse(JSON.stringify(keep)));
        this.save(); this.render(); toast(t('loaded')); window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      }
      case 'sDel': this.saved.splice(+v, 1); store.set('progs', this.saved); this.render(); toast(t('deleted')); break;
      case 'pkroot': { const c = this.pick; c.r = +v; if (c.b === c.r) c.b = null; c.v = 0; this.refreshPicker(true); break; }
      case 'pktype': this.pick.t = +v; this.pick.v = 0; this.refreshPicker(true); break;
      case 'pkbass': this.pick.b = v === '' ? null : +v; this.pick.v = 0; this.refreshPicker(true); break;
      case 'pkv': this.pick.v = +v; this.refreshPicker(true); break;
      case 'pkmove': {
        const i = this.edit, j = i + +v;
        if (j < 0 || j >= p.slots.length) break;
        [p.slots[i], p.slots[j]] = [p.slots[j], p.slots[i]];
        this.edit = j; this.refreshPicker(false);
        break;
      }
      case 'pkdel': p.slots.splice(this.edit, 1); Sheet.close(); break;
      case 'pkdone': Sheet.close(); break;
      case 'saveDo': {
        const name = ($('#pname').value || '').trim() || t('progName');
        this.saved.unshift({ name, key: p.key, minor: p.minor, bpm: p.bpm, meter: p.meter, bars: p.bars, strum: p.strum,
                             drums: p.drums, swing: p.swing, slots: JSON.parse(JSON.stringify(p.slots)) });
        store.set('progs', this.saved);
        Sheet.close(); toast(t('savedT'));
        break;
      }
      default: return false;
    }
    return true;
  },
  seg(k, v) {
    if (k === 'bars') this.p.bars = +v;
    else if (k === 'mode') this.p.minor = v === '1';
    else return false;
    this.save(); this.render();
    return true;
  },
  askSave() {
    Sheet.open(`<h2>${t('save')}</h2><div class="lbl">${t('name')}</div>
      <input type="text" id="pname" value="${esc(this.p.slots.map(c => cname(c.r, c.t, c.b)).slice(0, 4).join(' '))}">
      <div class="row" style="margin-top:14px;justify-content:flex-end"><button class="btn primary" data-a="saveDo">${t('save')}</button></div>`,
      () => this.render());
    setTimeout(() => { const i = $('#pname'); if (i) { i.focus(); i.select(); } }, 250);
  },
};

/* =======================================================================
   CIRCLE OF FIFTHS
   ======================================================================= */
/** How-to text for the circle of fifths. Examples follow the key on the circle. */
const CIRCLE_GUIDE = {
  en: {
    title: 'How to use the circle of fifths',
    s: [
      ['What it shows', 'The twelve keys sit like the hours on a clock. Each step clockwise is a fifth up and adds one sharp (C → G → D …). Each step anticlockwise is a fourth up and adds one flat (C → F → B♭ …). Outer ring: major chords. Middle ring: their relative minors. Inner ring: the diminished chord of each key.'],
      ['The chords of a key', 'Tap a key and its slice lights up. It holds the seven chords of the key: the key itself (I) with its neighbours IV and V in the outer ring, ii, vi and iii just inside them, and vii° in the centre. In {key} that is {list}. These are the chords most songs in {key} use, and any of them sound good together.'],
      ['Building a progression', 'Start and end on I. V pulls strongly back home to I ({V} → {I}). Stepping to a neighbouring chord always sounds smooth; jumping across the circle sounds dramatic. Try the progressions further down: ▶ plays one on the circle, → sends it to the Studio.'],
      ['Major and minor', 'A major key and the minor key just inside it share the same notes and chords ({I} major and {vi}). Switch between Major and Minor to see the same chords counted from the minor chord.'],
      ['Key signatures', 'The number of steps from C tells how many sharps or flats a key has. It is shown in the middle. Sharps are added in the order F♯ C♯ G♯ D♯ A♯ E♯, flats in the order B♭ E♭ A♭ D♭ G♭ C♭ – the same order you meet them going round the circle.'],
      ['Changing key and transposing', 'Neighbouring keys share six of their seven chords, so moving one step round the circle is the smoothest key change. To transpose a song, move every chord the same number of steps round the circle.'],
      ['Borrowed chords', 'For more colour, borrow chords from the parallel minor key, such as iv ({iv}) or ♭VII ({bVII}), which sits one step anticlockwise from IV.'],
    ],
  },
  sv: {
    title: 'Så använder du kvintcirkeln',
    s: [
      ['Vad cirkeln visar', 'De tolv tonarterna sitter som timmarna på en klocka. Varje steg medurs är en kvint upp och lägger till ett korsförtecken (C → G → D …). Varje steg moturs är en kvart upp och lägger till ett b-förtecken (C → F → B♭ …). Yttre ringen: durackord. Mellersta ringen: deras parallella mollackord. Inre ringen: tonartens förminskade ackord.'],
      ['Ackorden i en tonart', 'Tryck på en tonart så lyser dess del upp. Där finns tonartens sju ackord: tonarten själv (I) med grannarna IV och V i yttre ringen, ii, vi och iii innanför dem, och vii° i mitten. I {key} är det {list}. Det är de ackord de flesta låtar i {key} använder, och de låter bra ihop i vilken ordning som helst.'],
      ['Bygga en progression', 'Börja och sluta på I. V drar starkt hem till I ({V} → {I}). Ett steg till ett grannackord låter alltid mjukt; ett hopp tvärs över cirkeln låter dramatiskt. Prova progressionerna längre ner: ▶ spelar en på cirkeln, → skickar den till Studio.'],
      ['Dur och moll', 'En durtonart och molltonarten precis innanför har samma toner och ackord ({I}-dur och {vi}). Växla mellan Dur och Moll för att se samma ackord räknade från mollackordet.'],
      ['Förtecken', 'Antalet steg från C visar hur många kors- eller b-förtecken tonarten har. Det står i mitten. Korsen tillkommer i ordningen F♯ C♯ G♯ D♯ A♯ E♯, b:na i ordningen B♭ E♭ A♭ D♭ G♭ C♭ – samma ordning som du möter dem runt cirkeln.'],
      ['Byta tonart och transponera', 'Närliggande tonarter delar sex av sina sju ackord, så ett steg runt cirkeln är det mjukaste tonartsbytet. För att transponera en låt flyttar du alla ackord lika många steg runt cirkeln.'],
      ['Lånade ackord', 'För mer färg kan du låna ackord från den parallella molltonarten, till exempel iv ({iv}) eller ♭VII ({bVII}), som ligger ett steg moturs från IV.'],
    ],
  },
};

const CircleTab = {
  k: Object.assign({ key: 0, minor: false }, store.get('circle', {})),
  lit: null,            // chord currently sounding {r,t}
  guideOpen: store.get('circleGuide', false),
  playingProg: -1,
  clock: new BeatClock((n, time) => CircleTab.beat(n, time)),
  save() { store.set('circle', this.k); },
  majorPc() { return this.k.minor ? mod12(this.k.key + 3) : this.k.key; },
  keyName() { return nn(this.k.key, keySpell(this.k.key, this.k.minor)) + ' ' + (this.k.minor ? t('minor') : t('major')).toLowerCase(); },
  diatonic() {
    const romans = this.k.minor ? DIATONIC_MINOR : DIATONIC_MAJOR;
    return romans.map(r => romanChord(r, this.k.key, this.k.minor));
  },
  /** which ring/slice a chord sits in: {ring 0 outer major, 1 minor, 2 diminished, i} */
  slotOf(c) {
    const sfx = TYPES[c.t].sfx;
    if (sfx === 'dim' || sfx === 'm7b5') return { ring: 2, i: CIRCLE.indexOf(mod12(c.r + 1)) };
    if (sfx.startsWith('m') && !sfx.startsWith('maj')) return { ring: 1, i: CIRCLE.indexOf(mod12(c.r + 3)) };
    return { ring: 0, i: CIRCLE.indexOf(c.r) };
  },

  svg() {
    const cx = 200, cy = 200, R = [196, 140, 94, 58];
    const ki = CIRCLE.indexOf(this.majorPc());
    const sp = keySpell(this.k.key, this.k.minor);
    const inKey = (ring, i) => {
      const d = mod12(i - ki);
      return ring === 2 ? d === 0 : (d === 0 || d === 1 || d === 11);
    };
    const romansMajor = { 0: ['I', 'vi', 'vii°'], 1: ['V', 'iii'], 11: ['IV', 'ii'] };
    const romansMinor = { 0: ['III', 'i', 'ii°'], 1: ['VII', 'v'], 11: ['VI', 'iv'] };
    const roman = (ring, i) => {
      const d = mod12(i - ki);
      const m = this.k.minor ? romansMinor : romansMajor;
      return m[d] ? m[d][ring] : '';
    };
    const isTonic = (ring, i) => (this.k.minor ? ring === 1 : ring === 0) && i === ki;
    const pt = (r, a) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
    const wedge = (r1, r2, i) => {
      const a0 = (i - 0.5) * Math.PI / 6, a1 = (i + 0.5) * Math.PI / 6;
      const [x1, y1] = pt(r1, a0), [x2, y2] = pt(r1, a1), [x3, y3] = pt(r2, a1), [x4, y4] = pt(r2, a0);
      return `M${x1} ${y1}A${r1} ${r1} 0 0 1 ${x2} ${y2}L${x3} ${y3}A${r2} ${r2} 0 0 0 ${x4} ${y4}Z`;
    };
    const litSlot = this.lit ? this.slotOf(this.lit) : null;
    let s = `<svg class="circle" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">`;
    for (let ring = 0; ring < 3; ring++) for (let i = 0; i < 12; i++) {
      const maj = CIRCLE[i];
      const ink = inKey(ring, i), tonic = isTonic(ring, i);
      const lit = litSlot && litSlot.ring === ring && litSlot.i === i;
      let fill = ring === 0 ? 'var(--card)' : ring === 1 ? 'var(--card2)' : 'var(--wood)';
      if (ink) fill = 'var(--accent-soft)';
      if (tonic) fill = 'var(--accent)';
      if (lit) fill = 'var(--root)';
      s += `<path class="seg-el" d="${wedge(R[ring], R[ring + 1], i)}" style="fill:${fill};stroke:var(--bg)" stroke-width="2" data-a="cseg" data-v="${ring},${i}"/>`;
      const mid = (R[ring] + R[ring + 1]) / 2 + (ring === 0 ? 4 : 0);
      const [tx, ty] = pt(mid, i * Math.PI / 6);
      const sp2 = FLAT_MAJOR.has(maj) ? 'f' : 's';
      let label;
      if (ring === 0) label = maj === 6 ? `${nn(6, 's')}/${nn(6, 'f')}` : nn(maj, sp2);
      else if (ring === 1) label = nn(maj + 9, maj === 6 ? 's' : sp2) + 'm';
      else label = nn(maj + 11, maj === 6 ? 's' : sp2) + '°';
      const col = tonic || lit ? 'var(--on-accent)' : ink ? 'var(--ink)' : 'var(--muted)';
      const fs = ring === 0 ? (label.length > 3 ? 13 : 19) : ring === 1 ? (label.length > 3 ? 11.5 : 14) : 10.5;
      const ro = ink ? roman(ring, i) : '';
      s += `<text x="${tx}" y="${ty + (ro ? -2 : fs * 0.35)}" font-size="${fs}" font-weight="${ink ? 700 : 500}" text-anchor="middle" style="fill:${lit ? '#fff' : col}">${label}</text>`;
      if (ro) s += `<text x="${tx}" y="${ty + fs * 0.35 + 9}" font-size="${ring === 2 ? 8.5 : 10}" text-anchor="middle" style="fill:${lit ? '#fff' : col};opacity:.8">${ro}</text>`;
    }
    const sig = keySignature(this.k.key, this.k.minor);
    s += `<circle cx="${cx}" cy="${cy}" r="${R[3] - 2}" style="fill:var(--card)"/>`;
    s += `<text x="${cx}" y="${cy - 2}" font-size="19" font-weight="750" text-anchor="middle" style="fill:var(--ink)">${nn(this.k.key, sp)}${this.k.minor ? 'm' : ''}</text>`;
    s += `<text x="${cx}" y="${cy + 17}" font-size="12" text-anchor="middle" style="fill:var(--muted)">${sig.n ? sig.n + ' ' + sig.acc : '♮'}</text>`;
    return s + '</svg>';
  },

  guideHtml() {
    const g = CIRCLE_GUIDE[lang()] || CIRCLE_GUIDE.en;
    const maj = this.majorPc(), sp = keySpell(maj, false);
    const ch = r => { const c = romanChord(r, maj, false); return chordName(c.r, c.t, null, sp); };
    const vars = {
      key: nn(maj, sp) + (lang() === 'sv' ? '-dur' : ' major'),
      list: DIATONIC_MAJOR.map(ch).join(', '),
      I: nn(maj, sp), V: ch('V'), vi: ch('vi'), iv: ch('iv'), bVII: ch('♭VII'),
    };
    const fill = txt => esc(txt).replace(/\{(\w+)\}/g, (m, k) => `<b>${esc(vars[k] || m)}</b>`);
    return `<details class="card guide" id="cguide" ${this.guideOpen ? 'open' : ''}>
      <summary>${I.info}<span>${g.title}</span></summary>
      ${g.s.map(([h, p]) => `<h3>${h}</h3><p>${fill(p)}</p>`).join('')}
    </details>`;
  },

  render() {
    const k = this.k, sp = keySpell(k.key, k.minor);
    const sig = keySignature(k.key, k.minor);
    const sigTxt = sig.n ? t('sigN', { n: sig.n, acc: sig.acc === '♯' ? (sig.n === 1 ? t('sharp') : t('sharps')) : (sig.n === 1 ? t('flat') : t('flats')) }) : t('sig0');
    const rel = k.minor ? nn(k.key + 3, sp) + ' ' + t('major').toLowerCase() : nn(k.key + 9, sp) + 'm';
    const dia = this.diatonic();
    const progs = PROGRESSIONS[k.minor ? 'minor' : 'major'];
    $('#tab-circle').innerHTML = `
      <div class="card">
        <div id="circleSvg">${this.svg()}</div>
        <div style="margin-top:10px">${seg('cmode', [['0', t('major')], ['1', t('minor')]], k.minor ? '1' : '0')}</div>
        <div class="row small muted" style="margin-top:10px;justify-content:space-between">
          <span><b style="color:var(--ink)">${this.keyName()}</b> · ${sigTxt}</span>
          <span>${k.minor ? t('relMajor') : t('relMinor')}: <b style="color:var(--ink)">${rel}</b></span>
        </div>
      </div>
      ${this.guideHtml()}
      <div class="card">
        <div class="lbl">${t('chordsIn', { key: this.keyName() })}</div>
        <div class="dchords">${dia.map((c, i) => `<div class="dchord" data-a="cdia" data-v="${i}"><i>${c.roman}</i><b>${chordName(c.r, c.t, null, sp)}</b></div>`).join('')}</div>
        <div class="row" style="margin-top:10px;justify-content:flex-end">
          <button class="btn small" data-a="cfing">${I.chords}${t('showFing')}</button></div>
      </div>
      <div class="card">
        <div class="lbl">${t('goodProg', { key: this.keyName() })}</div>
        <div class="list">${progs.map((g, i) => `
          <div class="item ${i === this.playingProg ? 'on' : ''}">
            <button class="iconbtn" data-a="cprog" data-v="${i}">${i === this.playingProg ? I.stop : I.play}</button>
            <div class="t"><b>${L(g)} <span style="display:inline;color:var(--muted);font-weight:500;overflow-wrap:anywhere;white-space:normal">${g.seq.join('–')}</span></b>
              <span>${g.seq.map(r => { const c = romanChord(r, k.key, k.minor); return chordName(c.r, c.t, null, sp); }).join(' – ')}</span></div>
            <button class="iconbtn" data-a="cstudio" data-v="${i}" aria-label="${t('toStudio')}">${I.send}</button>
          </div>`).join('')}</div>
      </div>`;
    const gd = $('#cguide');
    if (gd) gd.addEventListener('toggle', () => { this.guideOpen = gd.open; store.set('circleGuide', gd.open); });
  },
  redrawCircle() {
    const el = $('#circleSvg');
    if (el) el.innerHTML = this.svg();
    document.querySelectorAll('#tab-circle .dchord').forEach((el2, i) => {
      const c = this.diatonic()[i];
      el2.classList.toggle('lit', !!this.lit && this.lit.r === c.r && TYPES[this.lit.t].sfx.replace(/7$/, '') === TYPES[c.t].sfx.replace(/7$/, ''));
    });
  },
  flash(c, ms = 700) {
    this.lit = c;
    this.redrawCircle();
    clearTimeout(this.flashTm);
    if (ms) this.flashTm = setTimeout(() => { this.lit = null; this.redrawCircle(); }, ms);
  },
  playChord(c, when) {
    const v = voicings(c.r, c.t, null)[0];
    if (v) Snd.chord(v.frets, STD, when || 0, 'strum');
  },
  lastChord: null,
  beat(n, time) {
    const g = PROGRESSIONS[this.k.minor ? 'minor' : 'major'][this.playingProg];
    if (!g) { this.stopProg(); return; }
    const bpc = 2, i = Math.floor(n / bpc), b = n % bpc;
    if (i >= g.seq.length * 2) {      // twice through, then stop
      atTime(time, () => this.stopProg());
      this.clock.stop();
      return;
    }
    const c = romanChord(g.seq[i % g.seq.length], this.k.key, this.k.minor);
    if (b === 0) { this.playChord(c, time); atTime(time, () => this.flash(c, 0)); }
    else Snd.chord(voicings(c.r, c.t, null)[0].frets, STD, time, 'strum', 0.7);
  },
  stopProg() {
    this.clock.stop();
    this.playingProg = -1;
    this.lit = null;
    keepAwake();
    if (S.tab === 'circle') this.render();
  },
  action(a, v) {
    const k = this.k;
    switch (a) {
      case 'cseg': {
        const [ring, i] = v.split(',').map(Number);
        const maj = CIRCLE[i];
        let c;
        if (ring === 0) { c = { r: maj, t: 0 }; Object.assign(k, { key: maj, minor: false }); }
        else if (ring === 1) { c = { r: mod12(maj + 9), t: 1 }; Object.assign(k, { key: mod12(maj + 9), minor: true }); }
        else { c = { r: mod12(maj + 11), t: typeIndex('dim') }; }
        this.save();
        if (this.clock.running) this.stopProg();
        this.render();
        this.playChord(c);
        this.lastChord = c;
        this.flash(c);
        break;
      }
      case 'cdia': { const c = this.diatonic()[+v]; this.playChord(c); this.lastChord = c; this.flash(c); break; }
      case 'cfing': {
        const c = this.lastChord || { r: k.key, t: k.minor ? 1 : 0 };
        Chords.set({ r: c.r, t: c.t, b: null, v: 0 });
        showTab('chords');
        break;
      }
      case 'cprog': {
        const i = +v;
        if (this.playingProg === i) { this.stopProg(); break; }
        this.clock.stop();
        this.playingProg = i;
        this.clock.start(Studio.p.bpm || 90);
        keepAwake();
        this.render();
        break;
      }
      case 'cstudio': {
        if (Studio.clock.running) Studio.stop();
        Studio.setSlots(PROGRESSIONS[k.minor ? 'minor' : 'major'][+v].seq, k.key, k.minor);
        toast(t('sentStudio'));
        showTab('studio');
        break;
      }
      default: return false;
    }
    return true;
  },
  seg(key, v) {
    if (key !== 'cmode') return false;
    const minor = v === '1';
    if (minor !== this.k.minor) {
      this.k.key = minor ? mod12(this.k.key + 9) : mod12(this.k.key + 3);   // jump to the relative key
      this.k.minor = minor;
      if (this.clock.running) this.stopProg();
      this.save(); this.render();
    }
    return true;
  },
};

/* =======================================================================
   SCALES
   ======================================================================= */
const Scales = {
  s: Object.assign({ root: 9, id: 'pmin', pos: -1, labels: 'notes' }, store.get('scale', {})),
  save() { store.set('scale', this.s); },
  sc() { return SCALES.find(x => x.id === this.s.id) || SCALES[0]; },

  board() {
    const sc = this.sc(), root = this.s.root;
    const pcs = new Map(sc.iv.map(s => [mod12(root + s), s]));
    const positions = scalePositions(root, sc);
    const pos = this.s.pos >= 0 ? positions[this.s.pos] : null;
    const inPos = pos ? new Set(pos.notes.map(n => n.s + ':' + n.f)) : null;
    const blue = sc.base ? new Set(sc.iv.filter(s => !SCALES.find(x => x.id === sc.base).iv.includes(s))) : new Set();
    const nut = 36, fw = 46, F = MAX_FRET, top = 22, sy = 27;
    const W = nut + F * fw + 14, H = top + sy * 5 + 30;
    const X = x => S.lefty ? W - x : x;
    const fx = f => f === 0 ? nut - 18 : nut + (f - 0.5) * fw;
    const sy_ = s => top + (5 - s) * sy;            // high e at the top
    let o = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" id="boardSvg">`;
    o += `<rect x="${Math.min(X(nut), X(nut + F * fw))}" y="${top - 8}" width="${F * fw}" height="${sy * 5 + 16}" rx="4" style="fill:var(--wood)"/>`;
    [3, 5, 7, 9, 15, 17].forEach(f => { o += `<circle cx="${X(nut + (f - 0.5) * fw)}" cy="${top + sy * 2.5}" r="5" style="fill:var(--fret)" opacity=".7"/>`; });
    o += `<circle cx="${X(nut + 11.5 * fw)}" cy="${top + sy * 1.5}" r="5" style="fill:var(--fret)" opacity=".7"/><circle cx="${X(nut + 11.5 * fw)}" cy="${top + sy * 3.5}" r="5" style="fill:var(--fret)" opacity=".7"/>`;
    for (let f = 0; f <= F; f++) {
      const xx = X(nut + f * fw);
      o += `<line x1="${xx}" x2="${xx}" y1="${top - 8}" y2="${top + sy * 5 + 8}" style="stroke:${f === 0 ? 'var(--ink)' : 'var(--fret)'}" stroke-width="${f === 0 ? 5 : 2}"/>`;
      if (f) o += `<text x="${X(nut + (f - 0.5) * fw)}" y="${H - 4}" font-size="11" text-anchor="middle" style="fill:var(--muted)">${f}</text>`;
    }
    if (pos) {
      const a = X(pos.lo === 0 ? nut - 34 : nut + (pos.lo - 1) * fw), b = X(nut + pos.hi * fw);
      o += `<rect x="${Math.min(a, b)}" y="${top - 11}" width="${Math.abs(b - a)}" height="${sy * 5 + 22}" rx="8" fill="none" style="stroke:var(--accent)" stroke-width="2" stroke-dasharray="5 4"/>`;
    }
    for (let s = 0; s < 6; s++) o += `<line x1="${X(nut - 30)}" x2="${X(nut + F * fw)}" y1="${sy_(s)}" y2="${sy_(s)}" style="stroke:var(--str)" stroke-width="${1 + s * 0.3}"/>`;
    for (let s = 0; s < 6; s++) for (let f = 0; f <= F; f++) {
      const m = STD[s] + f, pc = mod12(m);
      if (!pcs.has(pc)) continue;
      const deg = pcs.get(pc);
      const faded = inPos && !inPos.has(s + ':' + f);
      const isRoot = deg === 0, isBlue = blue.has(deg);
      const fill = isRoot ? 'var(--root)' : isBlue ? 'var(--dim)' : 'var(--accent)';
      const lab = this.s.labels === 'notes' ? nn(pc) : scaleDegreeLabel(sc, deg);
      o += `<g data-a="snote" data-v="${m},${s}" opacity="${faded ? 0.16 : 1}" style="cursor:pointer">
        <circle cx="${X(fx(f))}" cy="${sy_(s)}" r="11" style="fill:${fill}"/>
        <text x="${X(fx(f))}" y="${sy_(s) + 3.8}" font-size="${lab.length > 2 ? 9 : 10.5}" font-weight="700" text-anchor="middle" style="fill:${isRoot || isBlue ? '#fff' : 'var(--on-accent)'};pointer-events:none">${lab}</text></g>`;
    }
    return { svg: o + '</svg>', positions, W, fw, nut, pos };
  },

  render() {
    const sc = this.sc(), s = this.s;
    const b = this.board();
    if (s.pos >= b.positions.length) s.pos = -1;
    $('#tab-scales').innerHTML = `
      <div class="card">
        <div class="lbl">${t('scale')}</div>
        <select id="scsel">${SCALES.map(x => `<option value="${x.id}" ${x.id === s.id ? 'selected' : ''}>${L(x)}</option>`).join('')}</select>
        <div class="lbl">${t('key')}</div>
        ${rootGrid('skey', s.root)}
      </div>
      <div class="card">
        <div class="row" style="justify-content:space-between;margin-bottom:8px">
          <b style="font-size:17px">${nn(s.root)} ${L(sc).toLowerCase()}</b>
          <button class="btn small primary" data-a="splay">${I.play}${t('playScale')}</button>
        </div>
        <div class="notes" style="justify-content:flex-start">${sc.iv.map(x => `<div class="note ${x === 0 ? 'r' : ''}"><b>${nn(s.root + x)}</b><span>${scaleDegreeLabel(sc, x)}</span></div>`).join('')}</div>
        ${b.positions.length ? `<div class="lbl">${t('position')}</div>
        <div class="chips scroll"><button class="chip ${s.pos < 0 ? 'on' : ''}" data-a="spos" data-v="-1">${t('wholeNeck')}</button>${b.positions.map((p, i) => `<button class="chip ${i === s.pos ? 'on' : ''}" data-a="spos" data-v="${i}">${i + 1} <span class="muted small" style="${i === s.pos ? 'color:inherit;opacity:.8' : ''}">· ${t('frets', { a: p.lo, b: p.hi })}</span></button>`).join('')}</div>` : ''}
        <div style="height:12px"></div>
        <div class="board" id="board">${b.svg}</div>
        <div class="legend"><span><i style="background:var(--root)"></i>${t('rootL')}</span><span><i style="background:var(--accent)"></i>${t('noteL')}</span>${sc.base ? `<span><i style="background:var(--dim)"></i>${t('blueL')}</span>` : ''}</div>
        <div style="margin-top:12px">${seg('slabels', [['notes', t('notesL')], ['degrees', t('degrees')]], s.labels)}</div>
      </div>`;
    $('#scsel').addEventListener('change', e => { s.id = e.target.value; s.pos = -1; this.save(); this.render(); });
    const board = $('#board');
    if (b.pos) {
      const center = b.nut + ((b.pos.lo + b.pos.hi) / 2) * b.fw;
      const x = S.lefty ? b.W - center : center;
      board.scrollLeft = x - board.clientWidth / 2;
    } else board.scrollLeft = S.lefty ? board.scrollWidth : 0;
  },
  playScale() {
    const sc = this.sc(), s = this.s;
    const b = this.board();
    let notes;
    if (b.pos) {
      notes = b.pos.notes.map(n => ({ m: STD[n.s] + n.f, s: n.s })).sort((a, c) => a.m - c.m);
      const seen = new Set();
      notes = notes.filter(n => !seen.has(n.m) && seen.add(n.m));
    } else {
      // one octave up and back, from the lowest root on the low E or A string
      let m0 = STD[0] + mod12(s.root - STD[0]);
      const ivs = sc.iv.concat([12]);
      notes = ivs.map(x => ({ m: m0 + x, s: -1 }));
    }
    const up = notes.slice(), down = notes.slice(0, -1).reverse();
    const all = up.concat(down);
    const now = Snd.now() + 0.05, step = 0.2;
    all.forEach((n, i) => Snd.pluck(n.m, now + i * step, -1, 0.9));
  },
  action(a, v) {
    switch (a) {
      case 'skey': this.s.root = +v; this.save(); this.render(); break;
      case 'spos': this.s.pos = +v; this.save(); this.render(); break;
      case 'splay': this.playScale(); break;
      case 'snote': { const [m, s] = v.split(',').map(Number); Snd.pluck(m, 0, s); break; }
      default: return false;
    }
    return true;
  },
  seg(k, v) { if (k !== 'slabels') return false; this.s.labels = v; this.save(); this.render(); return true; },
};

/* =======================================================================
   TUNER – needle and strobe
   ======================================================================= */
const Tuner = {
  lock: null, near: -1, ok: new Set(), okSince: 0, hist: [], freqs: [],
  disp: 0, target: 0, cents: null, smooth: 0, hasSig: false, last: null, lastAt: 0,
  strobeOff: [0, 0, 0], tPrev: 0,
  pipeStop: null, pipeString: -1, pipeOn: false, raf: 0,

  tuning() {
    const tu = TUNINGS.find(x => x.id === S.tuning) || TUNINGS[0];
    return tu.n || S.custom;
  },
  temp() { return TEMPERAMENTS.find(x => x.id === S.temp) || TEMPERAMENTS[0]; },
  f(m) { return targetFreq(m, S.a4, this.temp(), S.tempRoot); },
  centsTo(f, m) { return 1200 * Math.log2(f / this.f(m)); },
  /** Nearest note under the current temperament and calibration. */
  nearestNote(f) {
    const m0 = Math.round(69 + 12 * Math.log2(f / S.a4));
    let m = m0, best = 1e9;
    for (const mm of [m0 - 1, m0, m0 + 1]) { const c = Math.abs(this.centsTo(f, mm)); if (c < best) { best = c; m = mm; } }
    return m;
  },
  applyGate() { Pitch.gate = 0.02 * Math.pow(0.1, S.tunerSens); },

  /** Headstock with 3 + 3 tuning pegs; low E bottom left, high E bottom right. */
  headstock() {
    const tun = this.tuning();
    const post = i => i < 3 ? [118, 178 - i * 58] : [202, 62 + (i - 3) * 58];
    const peg = i => i < 3 ? [52, 178 - i * 58] : [268, 62 + (i - 3) * 58];
    let s = `<svg class="headstock" viewBox="0 0 320 262" xmlns="http://www.w3.org/2000/svg">
      <path d="M104 256 L96 50 Q96 14 160 10 Q224 14 224 50 L216 256 Z" class="hs-body"/>
      <rect x="104" y="248" width="112" height="8" rx="2" class="hs-nut"/>`;
    for (let i = 0; i < 6; i++) {
      const [px, py] = post(i), [gx, gy] = peg(i);
      s += `<line x1="${px}" y1="${py}" x2="${gx}" y2="${gy}" class="hs-shaft"/>`;
      s += `<line x1="${140 + i * 8}" y1="252" x2="${px}" y2="${py}" class="hs-string" style="stroke-width:${1.9 - i * 0.18}"/>`;
      s += `<circle cx="${px}" cy="${py}" r="6" class="hs-post"/>`;
    }
    for (let i = 0; i < 6; i++) {
      const [gx, gy] = peg(i), m = tun[i];
      const cls = [this.lock === i || this.pipeString === i ? 'lock' : '', this.near === i ? 'near' : '', this.ok.has(i) ? 'ok' : ''].join(' ');
      s += `<g class="peg ${cls}" data-a="tstr" data-v="${i}">
        <circle cx="${gx}" cy="${gy}" r="25" class="peg-c"/>
        <text x="${gx}" y="${gy + 3}" text-anchor="middle" class="peg-n">${nn(m)}<tspan class="peg-o" dy="-8">${Math.floor(m / 12) - 1}</tspan></text>
        <text x="${gx}" y="${gy + 17}" text-anchor="middle" class="peg-h">${(Math.round(this.f(m) * 10) / 10)}</text>
        <g class="peg-ok"><circle cx="${gx + (i < 3 ? -19 : 19)}" cy="${gy - 17}" r="8.5"/><path d="M${gx + (i < 3 ? -23.5 : 14.5)} ${gy - 17}l3 3 5.5-6"/></g>
      </g>`;
    }
    return s + '</svg>';
  },

  render() {
    const running = Pitch.running, strobe = S.tunerView === 'strobe';
    $('#tab-tuner').innerHTML = `
      <div class="card tunerhero" id="thero" data-st="${running ? 'listen' : 'idle'}">
        <div class="tview">${seg('tview', [['needle', t('needle')], ['strobe', t('strobe')]], S.tunerView)}</div>
        ${strobe ? `<canvas class="strobe" id="strobe"></canvas>` : this.dial()}
        <div class="tnoterow">
          <span class="tside" id="tnFlat">♭</span>
          <div class="tnote"><b id="tnName">–</b><sub id="tnOct"></sub></div>
          <span class="tside" id="tnSharp">♯</span>
        </div>
        <div class="tcents" id="tnCents">${running ? '' : '&nbsp;'}</div>
        <div class="tstatus" id="tnStatus">${running ? t('listen') : t('tapStart')}</div>
        <div class="tchips"><span id="tnHz">— Hz</span><span id="tnTarget">${S.a4.toFixed(1)} Hz A4</span></div>
        <canvas class="history" id="thist"></canvas>
        <div class="level"><i id="tlevel"></i></div>
        <button class="btn ${running ? '' : 'primary'} tgo" data-a="tstart">${running ? I.stop + t('stopTuner') : I.mic + t('startTuner')}</button>
      </div>
      <div class="card">
        ${seg('tmode', [['guitar', t('guitar')], ['chromatic', t('chromatic')]], S.tunerMode)}
        <div class="lbl">${t('tuning')}</div>
        <select id="ttuning">${TUNINGS.map(x => `<option value="${x.id}" ${x.id === S.tuning ? 'selected' : ''}>${L(x)}${x.n ? ' – ' + x.n.map(m => nn(m)).join(' ') : ''}</option>`).join('')}</select>
        ${S.tuning === 'custom' ? `<div class="custom">${S.custom.map((m, i) => `<div><button data-a="tcust" data-v="${i},1">▲</button><b>${midiName(m)}</b><button data-a="tcust" data-v="${i},-1">▼</button></div>`).join('')}</div>` : ''}
        ${this.headstock()}
        <div class="small muted" style="text-align:center;margin-top:-4px">${this.pipeOn ? t('pipeDesc') : (S.tunerMode === 'guitar' ? t('lockHint') : t('pipeDesc'))}</div>
        <div class="setrow" style="margin-top:6px;padding-bottom:0;border:0"><div>${t('pipe')}<small>${t('pipeDesc')}</small></div>
          <label class="switch"><input type="checkbox" id="tpipe" ${this.pipeOn ? 'checked' : ''}><span></span></label></div>
      </div>
      <div class="card">
        <div class="setrow"><div>${t('calib')}</div>
          <div class="stepper"><button data-a="ta4" data-v="-0.5">−</button><span>${S.a4.toFixed(1)} Hz</span><button data-a="ta4" data-v="0.5">+</button></div></div>
        <div class="setrow"><div>${t('sens')}<small>${t('sensD')}</small></div>
          <input type="range" id="tsens" min="0" max="1" step="0.05" value="${S.tunerSens}" style="width:45%"></div>
        <div class="setrow"><div style="flex:1">${t('temperament')}
          <select id="ttemp" style="margin-top:6px">${TEMPERAMENTS.map(x => `<option value="${x.id}" ${x.id === S.temp ? 'selected' : ''}>${L(x)}</option>`).join('')}</select></div></div>
        ${S.temp !== 'equal' ? `<div class="lbl">${t('tempRoot')}</div>${rootGrid('ttroot', S.tempRoot)}` : ''}
      </div>`;
    $('#ttuning').addEventListener('change', e => { S.tuning = e.target.value; this.lock = null; this.ok.clear(); this.near = -1; saveS(); this.render(); });
    $('#ttemp').addEventListener('change', e => { S.temp = e.target.value; saveS(); this.render(); });
    $('#tpipe').addEventListener('change', e => { this.pipeOn = e.target.checked; if (!this.pipeOn) this.stopPipe(); this.render(); });
    $('#tsens').addEventListener('input', e => { S.tunerSens = +e.target.value; this.applyGate(); saveS(); });
    this.canvas = $('#thist');
    if (this.hasSig && this.last) this.show(this.last);
    this.paint(0);
  },

  dial() {
    // arc gauge from −50 to +50 cents
    const cx = 160, cy = 176, r = 136;
    const A = c => (c / 50) * (Math.PI * 0.36);
    const P = (c, rr) => [cx + rr * Math.sin(A(c)), cy - rr * Math.cos(A(c))];
    const arc = (c0, c1, rr) => { const [x0, y0] = P(c0, rr), [x1, y1] = P(c1, rr); return `M${x0} ${y0}A${rr} ${rr} 0 0 1 ${x1} ${y1}`; };
    const wedge = (c0, c1, r0, r1) => {
      const [a0, b0] = P(c0, r1), [a1, b1] = P(c1, r1), [a2, b2] = P(c1, r0), [a3, b3] = P(c0, r0);
      return `M${a0} ${b0}A${r1} ${r1} 0 0 1 ${a1} ${b1}L${a2} ${b2}A${r0} ${r0} 0 0 0 ${a3} ${b3}Z`;
    };
    let s = `<svg class="gauge" viewBox="0 0 320 196" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tgrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="var(--warn)"/><stop offset=".3" stop-color="#d9a33a"/>
          <stop offset=".5" stop-color="var(--good)"/><stop offset=".7" stop-color="#d9a33a"/><stop offset="1" stop-color="var(--warn)"/>
        </linearGradient>
        <radialGradient id="tface" cx="50%" cy="100%" r="90%">
          <stop offset="0" stop-color="var(--card)"/><stop offset="1" stop-color="var(--card2)"/>
        </radialGradient>
      </defs>
      <path d="${wedge(-52, 52, 40, r + 12)}" fill="url(#tface)"/>
      <path d="${wedge(-3, 3, 40, r + 12)}" class="tzone"/>
      <path d="${arc(-50, 50, r)}" fill="none" stroke="url(#tgrad)" stroke-width="5" stroke-linecap="round"/>`;
    for (let c = -50; c <= 50; c += 2.5) {
      const big = c % 25 === 0, mid = c % 10 === 0 || c % 5 === 0;
      if (!big && !mid && Math.abs(c) > 10) continue;
      const [x1, y1] = P(c, r - 9), [x2, y2] = P(c, r - (big ? 26 : mid ? 19 : 14));
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${c === 0 ? 'tk0' : 'tk'}" stroke-width="${big ? 2.4 : mid ? 1.4 : 1}"/>`;
      if (big) { const [tx, ty] = P(c, r - 40); s += `<text x="${tx}" y="${ty + 4}" class="tkl" text-anchor="middle">${c > 0 ? '+' + c : c}</text>`; }
    }
    s += `<g id="needle" style="transform-origin:${cx}px ${cy}px">
        <path d="M${cx - 5} ${cy} L${cx - 1.1} ${cy - r + 14} L${cx + 1.1} ${cy - r + 14} L${cx + 5} ${cy} Z" class="ndl"/>
        <circle cx="${cx}" cy="${cy - r + 14}" r="3.4" class="ndl"/>
      </g>
      <circle cx="${cx}" cy="${cy}" r="12" class="hub"/><circle cx="${cx}" cy="${cy}" r="4.5" class="hub2"/>`;
    return s + '</svg>';
  },

  async toggle() {
    if (Pitch.running) { this.stop(); return; }
    this.applyGate();
    try {
      await Pitch.start(r => this.onPitch(r));
    } catch (e) {
      toast(t('micDenied'));
    }
    keepAwake();
    this.render();
  },
  stop() {
    Pitch.stop();
    this.freqs = []; this.last = null; this.hasSig = false; this.cents = null;
    keepAwake();
    if (S.tab === 'tuner') this.render();
  },

  onPitch(r) {
    const lv = $('#tlevel');
    if (lv) lv.style.width = clamp((r.db + 60) / 50 * 100, 0, 100) + '%';
    const now = performance.now();
    if (!r.freq) {
      // hold the last reading briefly while a note rings out, then show "no signal"
      if (this.hasSig && now - this.lastAt > 700) { this.hasSig = false; this.freqs = []; this.show(null); }
      this.hist.push(null);
      if (this.hist.length > 240) this.hist.shift();
      return;
    }
    // median of the last few readings; start over when the pitch jumps (a new string)
    const prev = this.freqs.length ? this.freqs[this.freqs.length - 1] : 0;
    if (prev && Math.abs(1200 * Math.log2(r.freq / prev)) > 60) this.freqs = [];
    this.freqs.push(r.freq);
    if (this.freqs.length > 7) this.freqs.shift();
    const f = this.freqs.slice().sort((a, b) => a - b)[this.freqs.length >> 1];
    this.last = f; this.lastAt = now; this.hasSig = true;
    this.show(f);
  },

  /** Which string to tune: the locked one, or the nearest – sticking with the current one unless another is clearly closer. */
  pickString(f) {
    const tun = this.tuning();
    if (this.lock != null) return this.lock;
    let best = -1, bc = 1e9;
    tun.forEach((m, i) => { const c = Math.abs(this.centsTo(f, m)); if (c < bc) { bc = c; best = i; } });
    if (this.near >= 0 && this.near < tun.length && this.near !== best) {
      const cur = Math.abs(this.centsTo(f, tun[this.near]));
      if (cur < 250 && cur - bc < 60) return this.near;
    }
    return best;
  },

  show(f) {
    const nameEl = $('#tnName');
    if (!nameEl) return;
    const status = $('#tnStatus');
    const hero = $('#thero');
    if (!f) {
      nameEl.style.opacity = .35;
      status.textContent = t('listen');
      status.className = 'tstatus';
      if (hero) hero.dataset.st = 'listen';
      $('#tnFlat').className = 'tside'; $('#tnSharp').className = 'tside';
      this.cents = null;
      return;
    }
    nameEl.style.opacity = 1;
    let m, string = -1;
    if (S.tunerMode === 'guitar') { string = this.pickString(f); m = this.tuning()[string]; }
    else m = this.nearestNote(f);
    const tf = this.f(m), cents = this.centsTo(f, m);
    this.cents = cents;
    this.target = clamp(cents, -55, 55);
    const played = this.nearestNote(f);
    nameEl.textContent = nn(m);
    $('#tnOct').textContent = Math.floor(m / 12) - 1;
    $('#tnHz').textContent = f.toFixed(2) + ' Hz';
    $('#tnCents').textContent = (cents > 0 ? '+' : cents < 0 ? '−' : '±') + (Math.abs(cents) < 100 ? Math.abs(cents).toFixed(1) : Math.round(Math.abs(cents))) + ' cent';
    $('#tnTarget').textContent = (played !== m ? midiName(played) + ' → ' : '→ ') + tf.toFixed(2) + ' Hz';
    const a = Math.abs(cents), inTune = a < 3;
    if (hero) hero.dataset.st = inTune ? 'good' : a < 10 ? 'close' : 'off';
    $('#tnFlat').className = 'tside' + (!inTune && cents < 0 ? ' lit' : '');
    $('#tnSharp').className = 'tside' + (!inTune && cents > 0 ? ' lit' : '');
    let msg;
    if (inTune) msg = '✓ ' + t('inTune');
    else if (a >= 100) {
      const st = Math.round(a / 100);
      msg = (cents < 0 ? '↑ ' : '↓ ') + t(cents < 0 ? 'semisLow' : 'semisHigh', { n: st });
    } else msg = cents < 0 ? '↑ ' + t('tuneUp') : '↓ ' + t('tuneDown');
    status.textContent = msg;
    status.className = 'tstatus ' + (inTune ? 'good' : a < 10 ? 'close' : '');
    this.hist.push(clamp(cents, -50, 50));
    if (this.hist.length > 240) this.hist.shift();

    if (S.tunerMode === 'guitar') {
      if (string !== this.near) {
        this.near = string;
        document.querySelectorAll('.peg').forEach((b, i) => b.classList.toggle('near', i === string));
      }
      if (inTune) {
        if (!this.okSince) this.okSince = performance.now();
        if (performance.now() - this.okSince > 600 && !this.ok.has(string)) {
          this.ok.add(string);
          const b = document.querySelectorAll('.peg')[string];
          if (b) b.classList.add('ok');
          if (navigator.vibrate) try { navigator.vibrate(35); } catch (e) { /* not allowed */ }
        }
      } else this.okSince = 0;
    }
  },

  /** Animation: needle easing, strobe bands and the history trace. */
  paint(ts) {
    cancelAnimationFrame(this.raf);
    const step = now => {
      const dt = this.tPrev ? Math.min(0.05, (now - this.tPrev) / 1000) : 0;
      this.tPrev = now;
      if (S.tab !== 'tuner') { this.tPrev = 0; return; }
      this.raf = requestAnimationFrame(step);
      const live = this.hasSig && this.cents != null;
      if (live) this.smooth += (this.cents - this.smooth) * Math.min(1, dt * 10);
      const n = $('#needle');
      if (n) {
        if (live) this.disp += (this.target - this.disp) * Math.min(1, dt * 14);
        n.style.transform = `rotate(${(this.disp / 50) * 0.42 * 180}deg)`;
        n.style.opacity = live ? 1 : 0.3;
      }
      this.drawStrobe(dt, live);
      this.drawHist();
    };
    this.raf = requestAnimationFrame(step);
  },

  /**
   * Strobe wheel: three rings of segments, like the disc of a mechanical strobe tuner. They turn
   * clockwise when sharp and anticlockwise when flat; the finer outer rings turn faster, so even a
   * fraction of a cent shows. In tune, the wheel stands still and glows green.
   */
  drawStrobe(dt, live) {
    const c = $('#strobe');
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth, h = c.clientHeight;
    if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    const g = c.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const cs = getComputedStyle(document.documentElement);
    const col = v => cs.getPropertyValue(v).trim();
    const cents = live ? clamp(this.smooth, -60, 60) : 0;
    const inTune = live && Math.abs(cents) < 1;
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 10;
    const rings = [{ n: 18, k: 1, r0: 0.40, r1: 0.58 }, { n: 36, k: 2, r0: 0.62, r1: 0.79 }, { n: 72, k: 4, r0: 0.83, r1: 1 }];
    // face
    g.fillStyle = col('--card2');
    g.beginPath(); g.arc(cx, cy, R + 6, 0, Math.PI * 2); g.fill();
    const on = !live ? col('--fret') : inTune ? col('--good') : col('--accent');
    if (inTune) { g.shadowColor = col('--good'); g.shadowBlur = 18; }
    rings.forEach((rg, i) => {
      // periods per second: 0.05 per cent on the inner ring
      if (live) this.strobeOff[i] = (this.strobeOff[i] + cents * 0.05 * rg.k * dt) % 1;
      const seg = Math.PI * 2 / rg.n, rot = this.strobeOff[i] * seg;
      g.fillStyle = on;
      g.globalAlpha = live ? 1 : 0.55;
      for (let k = 0; k < rg.n; k++) {
        const a0 = -Math.PI / 2 + rot + k * seg, a1 = a0 + seg / 2;
        g.beginPath();
        g.arc(cx, cy, R * rg.r1, a0, a1);
        g.arc(cx, cy, R * rg.r0, a1, a0, true);
        g.closePath(); g.fill();
      }
    });
    g.shadowBlur = 0; g.globalAlpha = 1;
    // hub
    g.fillStyle = col('--card');
    g.beginPath(); g.arc(cx, cy, R * 0.34, 0, Math.PI * 2); g.fill();
    g.strokeStyle = col('--line'); g.lineWidth = 1.5; g.stroke();
    // direction hint inside the hub
    g.fillStyle = !live ? col('--muted') : inTune ? col('--good') : col('--ink');
    g.font = `700 ${Math.round(R * 0.2)}px system-ui, sans-serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(!live ? '·' : inTune ? '✓' : cents < 0 ? '↺' : '↻', cx, cy + 1);
    // reference mark at the top
    g.fillStyle = col('--ink');
    g.beginPath(); g.moveTo(cx - 7, cy - R - 10); g.lineTo(cx + 7, cy - R - 10); g.lineTo(cx, cy - R - 1); g.fill();
  },

  drawHist() {
    const c = this.canvas;
    if (!c || !c.isConnected) return;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth, h = c.clientHeight;
    if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    const g = c.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const cs = getComputedStyle(document.documentElement);
    const good = cs.getPropertyValue('--good').trim(), acc = cs.getPropertyValue('--accent').trim(), warn = cs.getPropertyValue('--warn').trim();
    const Y = v => h / 2 - v / 50 * (h / 2 - 4);
    g.fillStyle = good; g.globalAlpha = .14;
    g.fillRect(0, Y(3), w, Y(-3) - Y(3));
    g.globalAlpha = .35; g.fillRect(0, h / 2 - 0.5, w, 1);
    g.globalAlpha = 1;
    g.lineWidth = 2.4; g.lineCap = 'round'; g.lineJoin = 'round';
    const N = 240, step = w / N;
    for (let i = 1; i < this.hist.length; i++) {
      const v0 = this.hist[i - 1], v1 = this.hist[i];
      if (v0 == null || v1 == null) continue;
      const x1 = w - (this.hist.length - 1 - i) * step;
      const a = Math.abs(v1);
      g.strokeStyle = a < 3 ? good : a < 10 ? acc : warn;
      g.beginPath(); g.moveTo(x1 - step, Y(v0)); g.lineTo(x1, Y(v1)); g.stroke();
    }
  },

  stopPipe() {
    if (this.pipeStop) this.pipeStop();
    this.pipeStop = null;
    this.pipeString = -1;
  },
  action(a, v) {
    switch (a) {
      case 'tstart': this.toggle(); break;
      case 'tstr': {
        const i = +v;
        if (this.pipeOn) {
          const same = this.pipeString === i;
          this.stopPipe();
          if (!same) { this.pipeString = i; this.pipeStop = Snd.tone(this.f(this.tuning()[i])); }
        } else if (S.tunerMode === 'guitar') {
          this.lock = this.lock === i ? null : i;
          if (this.lock != null) this.near = i;
          if (!Pitch.running) Snd.pluck(this.tuning()[i], 0, i);
        } else Snd.pluck(this.tuning()[i], 0, i);
        this.render();
        break;
      }
      case 'ta4': S.a4 = clamp(Math.round((S.a4 + +v) * 2) / 2, 415, 466); saveS(); this.render(); break;
      case 'ttroot': S.tempRoot = +v; saveS(); this.render(); break;
      case 'tcust': {
        const [i, d] = v.split(',').map(Number);
        S.custom[i] = clamp(S.custom[i] + d, 28, 76);
        this.ok.delete(i);
        saveS(); this.render();
        break;
      }
      default: return false;
    }
    return true;
  },
  seg(k, v) {
    if (k === 'tmode') { S.tunerMode = v; this.lock = null; this.near = -1; }
    else if (k === 'tview') S.tunerView = v;
    else return false;
    saveS(); this.render();
    return true;
  },
};

/* =======================================================================
   PRACTICE – metronome & chord challenge
   ======================================================================= */
const METRO_SIGS = [
  { id: '2/4', beats: 2, unit: '♩' },
  { id: '3/4', beats: 3, unit: '♩' },
  { id: '4/4', beats: 4, unit: '♩' },
  { id: '5/4', beats: 5, unit: '♩', groups: [[3, 2], [2, 3]] },
  { id: '6/8', beats: 2, unit: '♩.', compound: true },
  { id: '9/8', beats: 3, unit: '♩.', compound: true },
  { id: '12/8', beats: 4, unit: '♩.', compound: true },
  { id: '5/8', beats: 5, unit: '♪', groups: [[3, 2], [2, 3]] },
  { id: '7/8', beats: 7, unit: '♪', groups: [[2, 2, 3], [3, 2, 2], [2, 3, 2]] },
];
// Accent patterns for practising syncopation (4/4). 3 = accent, 2 = normal, 1 = soft, 0 = silent.
const METRO_PRESETS = [
  { id: 'std',        en: 'Every beat',                 sv: 'Varje slag' },
  { id: 'backbeat',   sub: 1, p: '0303',             en: 'Backbeat (2 & 4 only)',      sv: 'Backbeat (bara 2 & 4)' },
  { id: 'offbeat',    sub: 2, p: '03030303',         en: 'Offbeats (the "&")',          sv: 'Offbeat ("och")' },
  { id: 'charleston', sub: 2, p: '30020000',         en: 'Charleston',                 sv: 'Charleston' },
  { id: 'tresillo',   sub: 2, p: '30030030',         en: 'Tresillo (3-3-2)',           sv: 'Tresillo (3-3-2)' },
  { id: 'son',        sub: 4, p: '3002002000202000', en: 'Son clave (3-2)',            sv: 'Son clave (3-2)' },
  { id: 'rumba',      sub: 4, p: '3002000200202000', en: 'Rumba clave (3-2)',          sv: 'Rumba clave (3-2)' },
  { id: 'bossa',      sub: 4, p: '3002002000200200', en: 'Bossa nova clave',           sv: 'Bossa nova-clave' },
  { id: 'shuffle',    sub: 3, p: '301201201201',     en: 'Shuffle',                    sv: 'Shuffle' },
  { id: 'gallop',     sub: 4, p: '3022202220222022', en: 'Gallop',                     sv: 'Galopp' },
  { id: 'push',       sub: 2, p: '30020202',         en: 'Syncopated push',            sv: 'Synkoperad framförskjutning' },
];

const Metro = {
  m: Object.assign({ bpm: 100, sig: '4/4', group: 0, sub: 1, swing: false, preset: 'std', custom: null }, store.get('metro', {})),
  taps: [], cur: -1,
  clock: new BeatClock((n, time) => Metro.beat(n, time)),
  save() { store.set('metro', this.m); },
  sig() { return METRO_SIGS.find(x => x.id === this.m.sig) || METRO_SIGS[2]; },
  subChoices() {
    const g = this.sig();
    if (g.compound) return [[1, '♩.'], [3, '♪♪♪'], [6, '♬♬♬']];
    if (g.unit === '♪') return [[1, '♪'], [2, '♬']];
    return [[1, '♩'], [2, '♪♪'], [3, '3'], [4, '♬♬']];
  },
  canSwing() { const g = this.sig(); return !g.compound && g.unit !== '♪' && (this.m.sub === 2 || this.m.sub === 4); },
  marking(b) {
    return b < 60 ? 'Largo' : b < 76 ? 'Adagio' : b < 108 ? 'Andante' : b < 120 ? 'Moderato' : b < 156 ? 'Allegro' : b < 176 ? 'Vivace' : 'Presto';
  },
  /** Beat indices where a group starts (5/4 as 3 + 2 → 0, 3). */
  groupStarts() {
    const g = this.sig();
    if (!g.groups) return null;
    const sizes = g.groups[this.m.group] || g.groups[0];
    const out = [];
    let a = 0;
    for (const s of sizes) { out.push(a); a += s; }
    return out;
  },
  /** One level per step: 3 accent, 2 beat, 1 subdivision, 0 silent. */
  levels() {
    const g = this.sig(), sub = this.m.sub, n = g.beats * sub;
    if (this.m.custom && this.m.custom.length === n) return this.m.custom;
    const gs = this.groupStarts();
    const out = [];
    for (let i = 0; i < n; i++) {
      const beat = Math.floor(i / sub), onBeat = i % sub === 0;
      if (i === 0) out.push(3);
      else if (onBeat && gs && gs.includes(beat)) out.push(3);
      else if (onBeat) out.push(2);
      else out.push(1);
    }
    return out;
  },
  html() {
    const m = this.m, g = this.sig(), lv = this.levels(), sub = m.sub;
    const lo = g.unit === '♪' ? 60 : 30, hi = g.unit === '♪' ? 400 : 240;
    const groupsHtml = g.groups ? `<div class="lbl">${t('grouping')}</div>${seg('mgroup', g.groups.map((x, i) => [i, x.join(' + ')]), m.group)}` : '';
    const gs = this.groupStarts();
    let cells = '';
    lv.forEach((l, i) => {
      const beat = Math.floor(i / sub);
      const newGroup = i > 0 && i % sub === 0 && (!gs || gs.includes(beat));
      cells += `${newGroup ? '<span class="msep"></span>' : ''}<button class="mstep l${l} ${i % sub === 0 ? 'b' : ''}" data-a="mlevel" data-v="${i}" aria-label="${i + 1}"><i></i></button>`;
    });
    return `<div class="card">
      <div class="lbl">${t('metronome')}</div>
      <div class="bpm"><small class="unit">${g.unit} =</small> <span id="mbpm">${m.bpm}</span></div>
      <div class="muted" style="text-align:center;font-size:14px" id="mmark">${this.marking(m.bpm)} · ${g.id}</div>
      <div class="msteps" id="msteps">${cells}</div>
      <div class="small muted" style="text-align:center;margin:-6px 0 10px">${t('stepHint')}</div>
      <div class="row tempo">
        <button class="btn" data-a="mstep" data-v="-5">−5</button><button class="btn" data-a="mstep" data-v="-1">−1</button>
        <input class="grow" type="range" min="${lo}" max="${hi}" value="${m.bpm}" id="mbpmr">
        <button class="btn" data-a="mstep" data-v="1">+1</button><button class="btn" data-a="mstep" data-v="5">+5</button>
      </div>
      <div class="row" style="margin-top:12px">
        <button class="btn" data-a="mtap" style="min-width:90px">${t('tap')}</button>
        <button class="btn primary grow" data-a="mstart">${this.clock.running ? I.stop + t('stop') : I.play + t('start')}</button>
      </div>
      <div class="lbl">${t('timeSig')}</div>
      <div class="chips">${METRO_SIGS.map(x => `<button class="chip ${x.id === m.sig ? 'on' : ''}" data-a="msig" data-v="${x.id}">${x.id}</button>`).join('')}</div>
      ${groupsHtml}
      <div class="lbl">${t('subdiv')}</div>
      ${seg('msub', this.subChoices(), sub)}
      ${this.canSwing() ? `<div class="setrow" style="padding-bottom:0"><div>${t('swing')}<small>${t('swingD')}</small></div>
        <label class="switch"><input type="checkbox" id="mswing" ${m.swing ? 'checked' : ''}><span></span></label></div>` : ''}
      ${m.sig === '4/4' ? `<div class="lbl">${t('accentPat')}</div>
        <select id="mpreset">${METRO_PRESETS.map(x => `<option value="${x.id}" ${x.id === m.preset ? 'selected' : ''}>${L(x)}</option>`).join('')}
        ${m.preset === 'custom' ? `<option value="custom" selected>${t('customPat')}</option>` : ''}</select>` : ''}
      ${m.custom ? `<div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn small" data-a="mreset">${t('resetAcc')}</button></div>` : ''}
    </div>`;
  },
  bind() {
    const r = $('#mbpmr');
    r.addEventListener('input', () => this.setBpm(+r.value, true));
    const sw = $('#mswing');
    if (sw) sw.addEventListener('change', e => { this.m.swing = e.target.checked; this.save(); });
    const ps = $('#mpreset');
    if (ps) ps.addEventListener('change', e => this.applyPreset(e.target.value));
  },
  applyPreset(id) {
    const pr = METRO_PRESETS.find(x => x.id === id);
    if (!pr) return;
    this.m.preset = id;
    if (pr.p) { this.m.sub = pr.sub; this.m.custom = pr.p.split('').map(Number); }
    else { this.m.custom = null; }
    this.save(); Practice.render();
  },
  setBpm(b, fromSlider) {
    const g = this.sig(), lo = g.unit === '♪' ? 60 : 30, hi = g.unit === '♪' ? 400 : 240;
    this.m.bpm = clamp(Math.round(b), lo, hi);
    this.clock.setBpm(this.m.bpm);
    $('#mbpm').textContent = this.m.bpm;
    $('#mmark').textContent = this.marking(this.m.bpm) + ' · ' + g.id;
    if (!fromSlider) $('#mbpmr').value = this.m.bpm;
    this.save();
  },
  beat(n, time) {
    const g = this.sig(), sub = this.m.sub, lv = this.levels();
    const bib = n % g.beats, spb = 60 / this.clock.bpm;
    for (let j = 0; j < sub; j++) {
      let off = j * spb / sub;
      if (this.m.swing && this.canSwing()) {
        if (sub === 2 && j === 1) off += spb / 6;
        if (sub === 4 && j % 2 === 1) off += spb / 12;
      }
      const step = bib * sub + j, l = lv[step], tt = time + off;
      if (l) Snd.tick(tt, l, step === 0);
      atTime(tt, () => this.hl(step));
    }
  },
  hl(i) {
    if (!this.clock.running) i = -1;
    document.querySelectorAll('#msteps .mstep').forEach((el, k) => el.classList.toggle('on', k === i));
  },
  action(a, v) {
    switch (a) {
      case 'mstep': this.setBpm(this.m.bpm + +v); break;
      case 'mstart':
        if (this.clock.running) this.clock.stop(); else this.clock.start(this.m.bpm);
        keepAwake(); Practice.render(); break;
      case 'mtap': {
        const btn = document.querySelector('[data-a=mtap]');
        if (btn) { btn.classList.remove('flash'); void btn.offsetWidth; btn.classList.add('flash'); }
        const now = performance.now();
        this.taps = this.taps.filter(x => now - x < 2500);
        this.taps.push(now);
        if (this.taps.length >= 2) {
          const d = (this.taps[this.taps.length - 1] - this.taps[0]) / (this.taps.length - 1);
          this.setBpm(60000 / d);
        }
        break;
      }
      case 'msig': {
        if (v === this.m.sig) break;
        const was = this.sig();
        const f = u => u === '♪' ? 1 : u === '♩.' ? 3 : 2;
        const eighths = this.m.bpm * f(was.unit);
        this.m.sig = v; this.m.group = 0; this.m.custom = null; this.m.preset = 'std';
        const g = this.sig();
        this.m.sub = g.compound ? 3 : 1;
        this.m.bpm = clamp(Math.round(eighths / f(g.unit)), g.unit === '♪' ? 60 : 30, g.unit === '♪' ? 400 : 240);
        this.clock.setBpm(this.m.bpm);
        this.save(); Practice.render();
        break;
      }
      case 'mlevel': {
        const lv = this.levels().slice(), i = +v;
        lv[i] = { 2: 3, 3: 1, 1: 0, 0: 2 }[lv[i]];          // normal → accent → soft → silent → normal
        this.m.custom = lv; this.m.preset = 'custom';
        const step = lv[i];
        if (step) Snd.tick(Snd.now(), step, i === 0);
        this.save(); Practice.render();
        break;
      }
      case 'mreset': this.m.custom = null; this.m.preset = 'std'; this.save(); Practice.render(); break;
      default: return false;
    }
    return true;
  },
  seg(k, v) {
    if (k === 'mgroup') { this.m.group = +v; this.m.custom = null; this.m.preset = 'std'; }
    else if (k === 'msub') {
      this.m.sub = +v;
      const pr = METRO_PRESETS.find(x => x.id === this.m.preset);
      if (!(pr && pr.p && pr.sub === this.m.sub)) { this.m.custom = null; this.m.preset = 'std'; }
    } else return false;
    this.save(); Practice.render();
    return true;
  },
};

const Quiz = {
  q: null, i: 0, score: 0, answered: null, best: store.get('quizBest', 0),
  pool() {
    const out = [];
    TYPES.forEach((x, ti) => { if (x.common) for (let r = 0; r < 12; r++) out.push({ r, t: ti }); });
    return out;
  },
  start() {
    const pool = this.pool();
    this.list = [];
    while (this.list.length < 10) {
      const c = pool[Math.floor(Math.random() * pool.length)];
      if (this.list.some(x => x.r === c.r && x.t === c.t)) continue;
      const vs = voicings(c.r, c.t, null);
      c.v = Math.floor(Math.random() * Math.min(3, vs.length));
      this.list.push(c);
    }
    this.i = 0; this.score = 0; this.answered = null;
    this.makeOptions();
  },
  makeOptions() {
    const c = this.list[this.i];
    const opts = [c];
    const common = TYPES.map((x, i) => i).filter(i => TYPES[i].common);
    let guard = 0;
    while (opts.length < 4 && guard++ < 200) {
      const d = Math.random() < 0.55
        ? { r: c.r, t: common[Math.floor(Math.random() * common.length)] }
        : { r: Math.floor(Math.random() * 12), t: c.t };
      if (!opts.some(o => o.r === d.r && o.t === d.t)) opts.push(d);
    }
    this.opts = opts.sort(() => Math.random() - 0.5);
  },
  html() {
    if (!this.list) return `<div class="card"><div class="lbl">${t('challenge')}</div>
      <div class="muted">${t('challengeDesc')}</div>
      ${this.best ? `<div class="small muted" style="margin-top:6px">${t('best', { b: this.best })}</div>` : ''}
      <div class="row" style="margin-top:12px"><button class="btn primary grow" data-a="qstart">${t('go')}</button></div></div>`;
    if (this.i >= 10) return `<div class="card"><div class="lbl">${t('challenge')}</div>
      <div class="bpm">${t('result', { s: this.score })}</div>
      <div class="muted" style="text-align:center;margin-top:6px">${t('best', { b: this.best })}</div>
      <div class="row" style="margin-top:14px"><button class="btn primary grow" data-a="qstart">${t('again')}</button></div></div>`;
    const c = this.list[this.i];
    const v = voicings(c.r, c.t, null)[c.v];
    const name = o => cname(o.r, o.t);
    return `<div class="card"><div class="row"><div class="lbl grow" style="margin:0">${t('challenge')} · ${this.i + 1}/10</div><b>${this.score}</b></div>
      <div class="progress" style="margin-top:8px"><i style="width:${this.i * 10}%"></i></div>
      <div class="muted" style="text-align:center">${t('which')}</div>
      <div class="diagwrap" data-a="qhear">${diagram(v, this.answered ? c.r : -1, { cls: 'big' })}</div>
      <div class="row" style="justify-content:center"><button class="btn small" data-a="qhear">${I.play}${t('hear')}</button></div>
      <div class="quizopts">${this.opts.map((o, k) => {
        let cls = '';
        if (this.answered) { if (o === c) cls = 'right'; else if (o === this.answered) cls = 'wrong'; }
        return `<button class="btn ${cls}" data-a="qans" data-v="${k}" ${this.answered ? 'disabled style="opacity:1"' : ''}>${name(o)}</button>`;
      }).join('')}</div>
      ${this.answered ? `<div style="text-align:center;margin-top:10px;font-weight:650;color:${this.answered === c ? 'var(--good)' : 'var(--warn)'}">${this.answered === c ? t('right') : t('wrongIs', { c: name(c) })}</div>
      <div class="row" style="margin-top:10px"><button class="btn primary grow" data-a="qnext">${t('next')}</button></div>` : ''}
    </div>`;
  },
  action(a, v) {
    switch (a) {
      case 'qstart': this.start(); Practice.render(); break;
      case 'qhear': { const c = this.list[this.i]; const x = voicings(c.r, c.t, null)[c.v]; Snd.chord(x.frets, STD, 0); break; }
      case 'qans': {
        if (this.answered) break;
        const o = this.opts[+v], c = this.list[this.i];
        this.answered = o;
        if (o === c) this.score++;
        const x = voicings(c.r, c.t, null)[c.v]; Snd.chord(x.frets, STD, 0);
        Practice.render();
        break;
      }
      case 'qnext':
        this.i++; this.answered = null;
        if (this.i < 10) this.makeOptions();
        else if (this.score > this.best) { this.best = this.score; store.set('quizBest', this.best); }
        Practice.render();
        break;
      default: return false;
    }
    return true;
  },
};
const Practice = {
  render() {
    $('#tab-practice').innerHTML = Metro.html() + Quiz.html();
    Metro.bind();
  },
};

/* =======================================================================
   SETTINGS
   ======================================================================= */
function settingsHtml() {
  const sw = (id, on) => `<label class="switch"><input type="checkbox" data-set="${id}" ${on ? 'checked' : ''}><span></span></label>`;
  const stack = (label, ctl, note) => `<div class="setstack"><div class="t">${label}${note ? `<small class="muted" style="display:block;font-size:12.5px">${note}</small>` : ''}</div>${ctl}</div>`;
  const toggle = (label, id, on, note) => `<div class="setrow"><div>${label}${note ? `<small>${note}</small>` : ''}</div>${sw(id, on)}</div>`;
  return `<h2>${t('settings')}</h2>
    <div class="sethead">${t('setDisplay')}</div>
    <div class="setgroup">
      ${stack(t('language'), seg('slang', [['auto', t('auto')], ['en', 'English'], ['sv', 'Svenska']], S.lang))}
      ${stack(t('theme'), seg('stheme', [['auto', t('auto')], ['light', t('light')], ['dark', t('dark')]], S.theme))}
    </div>
    <div class="sethead">${t('chords')}</div>
    <div class="setgroup">
      ${toggle(t('lefty'), 'lefty', S.lefty, t('leftyD'))}
      ${toggle(t('hNot'), 'hNotation', S.hNotation, t('hNotD'))}
      ${stack(t('playStyle'), seg('sstyle', [['strum', t('strum')], ['arp', t('arp')]], S.style))}
    </div>
    <div class="sethead">${t('sound')}</div>
    <div class="setgroup">
      ${toggle(t('soundOn'), 'sound', S.sound)}
      ${stack(t('volume'), `<input type="range" min="0" max="1" step="0.05" value="${S.volume}" data-set="volume">`)}
    </div>
    <div class="sethead">${t('about')}</div>
    <div class="setgroup small" style="line-height:1.55;padding:12px 14px">
      <b>Plektrum ${VERSION}</b><br>${t('aboutT')}<br>© 2026 Jon Solberg · ${t('license')}<br>
      <a href="#" data-a="openRepo">${t('source')}: github.com/jonsolberg/guitarchords</a>
    </div>`;
}
function openSettings() {
  Sheet.open(settingsHtml(), () => renderAll());
  const body = $('#sheetBody');
  body.querySelectorAll('[data-set]').forEach(el => el.addEventListener(el.type === 'range' ? 'input' : 'change', () => {
    const k = el.dataset.set;
    S[k] = el.type === 'checkbox' ? el.checked : +el.value;
    saveS();
    applySettings();
  }));
}
function settingsSeg(k, v) {
  if (k === 'slang') S.lang = v;
  else if (k === 'stheme') S.theme = v;
  else if (k === 'sstyle') S.style = v;
  else if (k === 'dotl') { S.dotLabel = v; saveS(); Chords.render(); return true; }
  else return false;
  saveS();
  applySettings();
  Sheet.update(settingsHtml());
  openSettingsBind();
  renderChrome();
  return true;
}
function openSettingsBind() {
  $('#sheetBody').querySelectorAll('[data-set]').forEach(el => el.addEventListener(el.type === 'range' ? 'input' : 'change', () => {
    const k = el.dataset.set;
    S[k] = el.type === 'checkbox' ? el.checked : +el.value;
    saveS(); applySettings();
  }));
}

/* =======================================================================
   SHELL
   ======================================================================= */
function systemDark() {
  if (AND && AND.isSystemDark) return AND.isSystemDark();
  return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
}
function applyTheme() {
  const dark = S.theme === 'dark' || (S.theme === 'auto' && systemDark());
  document.documentElement.classList.toggle('dark', dark);
  if (AND && AND.setDark) AND.setDark(dark);
}
window.onSystemTheme = () => applyTheme();
if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

function applySettings() {
  Theory.hNotation = S.hNotation;
  Snd.volume = S.volume;
  Snd.enabled = S.sound;
  if (Snd.out) Snd.out.gain.value = S.volume;
  document.documentElement.lang = lang();
  applyTheme();
}
function renderChrome() {
  $('#title').innerHTML = I.logo + 'Plektrum';
  $('#settingsBtn').innerHTML = I.settings;
  $('#hsearch').placeholder = t('searchShort');
  $('#hsearchIcon').innerHTML = I.search;
  $('#settingsBtn').setAttribute('aria-label', t('settings'));
  $('#nav').innerHTML = TABS.map(k => `<button data-tab="${k}" class="${S.tab === k ? 'on' : ''}">${I[k]}<span>${t('nav_' + k) !== 'nav_' + k ? t('nav_' + k) : t(k)}</span></button>`).join('');
}
const RENDER = { chords: () => Chords.render(), studio: () => Studio.render(), circle: () => CircleTab.render(),
                 scales: () => Scales.render(), tuner: () => Tuner.render(), practice: () => Practice.render() };
function showTab(k) {
  if (S.tab === 'tuner' && k !== 'tuner') { if (Pitch.running) Tuner.stop(); Tuner.stopPipe(); }
  S.tab = k; saveS();
  document.querySelectorAll('main > section').forEach(s => s.classList.toggle('on', s.id === 'tab-' + k));
  document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('on', b.dataset.tab === k));
  RENDER[k]();
  window.scrollTo(0, 0);
}
function renderAll() {
  renderChrome();
  RENDER[S.tab]();
}

document.addEventListener('click', e => {
  const tab = e.target.closest('[data-tab]');
  if (tab) { showTab(tab.dataset.tab); return; }
  if (e.target.closest('#settingsBtn')) { openSettings(); return; }
  if (e.target.closest('#scrim')) { Sheet.close(); return; }
  const el = e.target.closest('[data-a]');
  if (!el || el.disabled) return;
  const a = el.dataset.a, v = el.dataset.v;
  Snd.init();
  if (a === 'seg') {
    const k = el.dataset.k;
    if (settingsSeg(k, v) || Studio.seg(k, v) || CircleTab.seg(k, v) || Scales.seg(k, v) || Tuner.seg(k, v) || Metro.seg(k, v)) return;
    return;
  }
  if (a === 'openRepo') {
    e.preventDefault();
    if (AND && AND.openUrl) AND.openUrl(REPO); else window.open(REPO, '_blank');
    return;
  }
  Chords.action(a, v) || Studio.action(a, v) || CircleTab.action(a, v) || Scales.action(a, v) ||
    Tuner.action(a, v) || Metro.action(a, v) || Quiz.action(a, v);
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (Pitch.running) Tuner.stop();
    Tuner.stopPipe();
  }
});

window.onAppPause = () => { if (Pitch.running) Tuner.stop(); Tuner.stopPipe(); };

/* boot */
Studio.init();
Chords.bindSearch();
if (!TABS.includes(S.tab)) S.tab = 'chords';
applySettings();
renderChrome();
document.querySelectorAll('main > section').forEach(s => s.classList.toggle('on', s.id === 'tab-' + S.tab));
RENDER[S.tab]();
