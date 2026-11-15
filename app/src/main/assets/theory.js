/*
 * Plektrum – music theory engine: notes, chord types, fingering generator, scales,
 * scale positions, progressions, tunings and temperaments.
 * Copyright (C) 2026 Jon Solberg — GNU GPL v3 or later.
 */
'use strict';

const STD = [40, 45, 50, 55, 59, 64];           // E2 A2 D3 G3 B3 E4 (low → high)
const SHARP = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const FLAT  = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
const MIXED = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
const Theory = { hNotation: false };
const mod12 = n => ((n % 12) + 12) % 12;

/** Note name. spell: 's' sharps, 'f' flats, otherwise the usual mix. */
function nn(pc, spell) {
  let n = (spell === 's' ? SHARP : spell === 'f' ? FLAT : MIXED)[mod12(pc)];
  if (Theory.hNotation) {
    if (n === 'B') n = 'H';
    else if (n === 'B♭') n = 'B';
  }
  return n;
}
const midiName = (m, spell) => nn(m, spell) + (Math.floor(m / 12) - 1);
const midiFreq = (m, a4 = 440) => a4 * Math.pow(2, (m - 69) / 12);

/* ---------- chord types ---------- */
// req: intervals that must sound; opt: may be left out (usually the fifth)
const TYPES = [
  { sfx: '',        req: [0, 4],        opt: [7],      en: 'major',                      sv: 'dur', common: 1 },
  { sfx: 'm',       req: [0, 3],        opt: [7],      en: 'minor',                      sv: 'moll', common: 1 },
  { sfx: '7',       req: [0, 4, 10],    opt: [7],      en: 'dominant seventh',           sv: 'septimaackord', common: 1 },
  { sfx: 'maj7',    req: [0, 4, 11],    opt: [7],      en: 'major seventh',              sv: 'stor septima', common: 1 },
  { sfx: 'm7',      req: [0, 3, 10],    opt: [7],      en: 'minor seventh',              sv: 'moll med septima', common: 1 },
  { sfx: '5',       req: [0, 7],        opt: [],       en: 'power chord',                sv: 'kvintackord', common: 1 },
  { sfx: 'sus2',    req: [0, 2, 7],     opt: [],       en: 'suspended second',           sv: 'sus 2', common: 1 },
  { sfx: 'sus4',    req: [0, 5, 7],     opt: [],       en: 'suspended fourth',           sv: 'sus 4', common: 1 },
  { sfx: 'add9',    req: [0, 4, 14],    opt: [7],      en: 'added ninth',                sv: 'tillagd nona', common: 1 },
  { sfx: '6',       req: [0, 4, 9],     opt: [7],      en: 'sixth',                      sv: 'sext', common: 1 },
  { sfx: 'm6',      req: [0, 3, 9],     opt: [7],      en: 'minor sixth',                sv: 'moll med sext' },
  { sfx: 'dim',     req: [0, 3, 6],     opt: [],       en: 'diminished',                 sv: 'förminskat', common: 1 },
  { sfx: 'aug',     req: [0, 4, 8],     opt: [],       en: 'augmented',                  sv: 'överstigande' },
  { sfx: 'dim7',    req: [0, 3, 6, 9],  opt: [],       en: 'diminished seventh',         sv: 'förminskat septimaackord' },
  { sfx: 'm7b5',    req: [0, 3, 6, 10], opt: [],       en: 'half-diminished',            sv: 'halvförminskat' },
  { sfx: 'mmaj7',   req: [0, 3, 11],    opt: [7],      en: 'minor major seventh',        sv: 'moll med stor septima' },
  { sfx: '7sus4',   req: [0, 5, 10],    opt: [7],      en: 'seventh, suspended fourth',  sv: 'septima sus 4' },
  { sfx: '7sus2',   req: [0, 2, 10],    opt: [7],      en: 'seventh, suspended second',  sv: 'septima sus 2' },
  { sfx: 'aug7',    req: [0, 4, 8, 10], opt: [],       en: 'augmented seventh',          sv: 'överstigande septima' },
  { sfx: '7b5',     req: [0, 4, 6, 10], opt: [],       en: 'seventh, flat five',         sv: 'septima med sänkt kvint' },
  { sfx: 'madd9',   req: [0, 3, 14],    opt: [7],      en: 'minor added ninth',          sv: 'moll med tillagd nona' },
  { sfx: '6/9',     req: [0, 4, 9, 14], opt: [7],      en: 'six-nine',                   sv: 'sext-nona' },
  { sfx: '9',       req: [0, 4, 10, 14], opt: [7],     en: 'ninth',                      sv: 'nonackord' },
  { sfx: 'maj9',    req: [0, 4, 11, 14], opt: [7],     en: 'major ninth',                sv: 'stor nona' },
  { sfx: 'm9',      req: [0, 3, 10, 14], opt: [7],     en: 'minor ninth',                sv: 'moll med nona' },
  { sfx: '9sus4',   req: [0, 5, 10, 14], opt: [7],     en: 'ninth, suspended fourth',    sv: 'nona sus 4' },
  { sfx: '7b9',     req: [0, 4, 10, 13], opt: [7],     en: 'seventh, flat nine',         sv: 'septima med liten nona' },
  { sfx: '7#9',     req: [0, 4, 10, 15], opt: [7],     en: 'seventh, sharp nine',        sv: 'septima med höjd nona' },
  { sfx: 'add11',   req: [0, 4, 17],    opt: [7],      en: 'added eleventh',             sv: 'tillagd undecima' },
  { sfx: '11',      req: [0, 10, 17],   opt: [7, 14],  en: 'eleventh',                   sv: 'undecimackord' },
  { sfx: 'm11',     req: [0, 3, 10, 17], opt: [7, 14], en: 'minor eleventh',             sv: 'moll med undecima' },
  { sfx: '7#11',    req: [0, 4, 10, 18], opt: [7],     en: 'seventh, sharp eleven',      sv: 'septima med höjd undecima' },
  { sfx: 'maj7#11', req: [0, 4, 11, 18], opt: [7],     en: 'major seventh, sharp eleven', sv: 'stor septima med höjd undecima' },
  { sfx: '13',      req: [0, 4, 10, 21], opt: [7, 14], en: 'thirteenth',                 sv: 'tredecimackord' },
  { sfx: 'maj13',   req: [0, 4, 11, 21], opt: [7, 14], en: 'major thirteenth',           sv: 'stor tredecima' },
  { sfx: 'm13',     req: [0, 3, 10, 21], opt: [7, 14], en: 'minor thirteenth',           sv: 'moll med tredecima' },
];
const typeIndex = sfx => TYPES.findIndex(t => t.sfx === sfx);

const IV_LABEL = { 0: '1', 2: '2', 3: '♭3', 4: '3', 5: '4', 6: '♭5', 7: '5', 8: '♯5', 9: '6', 10: '♭7', 11: '7',
                   13: '♭9', 14: '9', 15: '♯9', 17: '11', 18: '♯11', 21: '13' };
function intervalLabel(t, s) {
  if (TYPES[t].sfx === 'dim7' && s === 9) return '♭♭7';
  return IV_LABEL[s] || String(s);
}
const pretty = s => s.replace(/#/g, '♯').replace(/b(?=\d)/g, '♭');

function chordName(r, t, b, spell) {
  let n = nn(r, spell) + pretty(TYPES[t].sfx);
  if (b != null && b !== r) n += '/' + nn(b, spell);
  return n;
}

/* ---------- parsing ---------- */
const ALIAS = {
  'maj': '', 'M': '', 'major': '', 'dur': '', 'min': 'm', 'mi': 'm', '-': 'm', 'minor': 'm', 'moll': 'm',
  '°': 'dim', 'o': 'dim', '+': 'aug', '#5': 'aug', 'ø': 'm7b5', 'ø7': 'm7b5', 'm7-5': 'm7b5', 'min7b5': 'm7b5', 'm7(b5)': 'm7b5',
  'M7': 'maj7', 'Δ': 'maj7', 'Δ7': 'maj7', 'ma7': 'maj7', 'j7': 'maj7', 'min7': 'm7', '-7': 'm7', 'mi7': 'm7',
  '°7': 'dim7', 'o7': 'dim7', 'sus': 'sus4', '7sus': '7sus4', '69': '6/9', 'add2': 'add9', '2': 'sus2', '4': 'sus4',
  '+7': 'aug7', '7+5': 'aug7', '7#5': 'aug7', 'mM7': 'mmaj7', 'm(maj7)': 'mmaj7', 'minmaj7': 'mmaj7', 'm/maj7': 'mmaj7', 'mmaj7': 'mmaj7',
  'M9': 'maj9', 'min9': 'm9', '-9': 'm9', 'M13': 'maj13', 'dom7': '7', '7-9': '7b9', '7+9': '7#9', 'min6': 'm6', '-6': 'm6',
  'add4': 'add11', 'sus9': '9sus4', '9sus': '9sus4', '7-5': '7b5', 'M7#11': 'maj7#11', 'maj7(#11)': 'maj7#11', 'no3': '5', '(no3)': '5',
  'madd2': 'madd9', 'm69': '6/9',
};
function letterPc(L, acc) {
  L = L.toUpperCase();
  let pc;
  if (L === 'H') pc = 11;
  else if (L === 'B') pc = Theory.hNotation ? 10 : 11;
  else pc = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9 }[L];
  if (pc == null) return null;
  if (acc === '#') pc++;
  else if (acc === 'b') pc--;
  return mod12(pc);
}
function parseChord(str) {
  const s = str.trim().replace(/♯/g, '#').replace(/♭/g, 'b').replace(/\s+/g, '');
  const m = /^([A-Ha-h])([#b]?)(.*?)(?:\/([A-Ha-h])([#b]?))?$/.exec(s);
  if (!m) return null;
  const r = letterPc(m[1], m[2]);
  if (r == null) return null;
  const q = m[3];
  let t = TYPES.findIndex(x => x.sfx === q);
  if (t < 0 && q in ALIAS) t = typeIndex(ALIAS[q]);
  if (t < 0 && !/^M/.test(q)) t = TYPES.findIndex(x => x.sfx.toLowerCase() === q.toLowerCase());
  if (t < 0) return null;
  let b = null;
  if (m[4]) { b = letterPc(m[4], m[5]); if (b == null) return null; }
  return { r, t, b: b === r ? null : b };
}

/* ---------- instruments for the chord library ----------
 * n: open strings as MIDI notes, in the order they cross the nut (as drawn in the chart).
 * bass: the lowest string must play the chord's bass note (guitar, bass). Re-entrant or
 *   fifth-tuned instruments (ukulele, mandolin, banjo) use any inversion.
 * span: largest stretch in frets. minStr: strings that must sound.
 * guitarMutes: guitar-style muting (low strings may be left out, one more string at most).
 * drone: a string that is only ever played open or muted (the banjo's short 5th string).
 */
const CHORD_INSTS = [
  { id: 'guitar',   en: 'Guitar',           sv: 'Gitarr',          n: STD,                  bass: true,  span: 3, minStr: 4, guitarMutes: true },
  { id: 'uke',      en: 'Ukulele',          sv: 'Ukulele',         n: [67, 60, 64, 69],     bass: false, span: 3, minStr: 4 },
  { id: 'ukebari',  en: 'Baritone uke', sv: 'Barytonuke',  n: [50, 55, 59, 64],     bass: false, span: 3, minStr: 4 },
  { id: 'mandolin', en: 'Mandolin',         sv: 'Mandolin',        n: [55, 62, 69, 76],     bass: false, span: 4, minStr: 4 },
  { id: 'banjo5',   en: 'Banjo',            sv: 'Banjo',           n: [67, 50, 55, 59, 62], bass: false, span: 3, minStr: 4, drone: 0 },
  { id: 'banjo4',   en: 'Tenor banjo',      sv: 'Tenorbanjo',      n: [48, 55, 62, 69],     bass: false, span: 4, minStr: 4 },
  { id: 'bass',     en: 'Bass',             sv: 'Elbas',           n: [28, 33, 38, 43],     bass: true,  span: 3, minStr: 3 },
];

/* ---------- fingering generator ---------- */
const VCACHE = new Map();
/**
 * All playable fingerings for root r, type t, optional bass b on an instrument, best first.
 * Each: {frets[] (-1 muted), fing[] (0 none), barre {fret,from,to}|null, pos}.
 */
function voicings(r, t, b = null, inst = CHORD_INSTS[0]) {
  if (Array.isArray(inst)) inst = Object.assign({}, CHORD_INSTS[0], { id: inst.join('.'), n: inst });
  if (b === r) b = null;
  const key = r + '|' + t + '|' + (b == null ? '' : b) + '|' + inst.id;
  if (VCACHE.has(key)) return VCACHE.get(key);
  const tuning = inst.n, N = tuning.length, drone = inst.drone == null ? -1 : inst.drone;
  const T = TYPES[t];
  const req = new Set(T.req.map(s => mod12(r + s)));
  const opt = new Set(T.opt.map(s => mod12(r + s)));
  const bass = b == null ? r : b;
  const allowed = new Set([...req, ...opt, bass]);
  const minStrings = inst.minStr === 4 && T.req.length <= 2 && !T.opt.length && inst.guitarMutes ? 3 : inst.minStr;
  const maxStrings = inst.maxStr || N;
  const out = new Map();
  const cur = new Array(N);

  function evaluate() {
    let first = -1, last = -1, sounded = 0;
    for (let i = 0; i < N; i++) if (i !== drone && cur[i] >= 0) { if (first < 0) first = i; last = i; sounded++; }
    if (sounded < minStrings || sounded > maxStrings) return;
    // the bass note: lowest string (guitar, bass) or lowest pitch (slash chords elsewhere)
    if (inst.bass) { if (mod12(tuning[first] + cur[first]) !== bass) return; }
    else if (b != null) {
      let lo = 999;
      for (let i = 0; i < N; i++) if (cur[i] >= 0) lo = Math.min(lo, tuning[i] + cur[i]);
      if (mod12(lo) !== b) return;
    }
    let inner = 0;
    for (let i = first; i <= last; i++) if (i !== drone && cur[i] < 0) inner++;
    let top = 0;
    for (let i = last + 1; i < N; i++) if (i !== drone) top++;
    if (inst.guitarMutes ? inner + top > 1 : inner + top + (first - (drone === 0 ? 1 : 0)) > N - minStrings) return;
    const have = new Set();
    let opens = 0, minF = 99, maxF = 0, fretted = 0, lowest = 999, lowestPc = -1;
    for (let i = 0; i < N; i++) {
      const f = cur[i];
      if (f < 0) continue;
      const m = tuning[i] + f;
      have.add(mod12(m));
      if (m < lowest) { lowest = m; lowestPc = mod12(m); }
      if (f === 0) { if (i !== drone) opens++; }
      else { fretted++; if (f < minF) minF = f; if (f > maxF) maxF = f; }
    }
    for (const p of req) if (!have.has(p)) return;
    if (fretted && maxF - minF > inst.span) return;
    const k = cur.join(',');
    if (out.has(k)) return;

    // finger assignment
    const fing = new Array(N).fill(0);
    let barre = null, fingers = 0;
    if (fretted) {
      const at = [];
      for (let i = 0; i < N; i++) if (cur[i] === minF) at.push(i);
      let canBarre = at.length >= 2;
      if (canBarre) for (let i = at[0]; i <= at[at.length - 1]; i++) if (i !== drone && cur[i] < minF) { canBarre = false; break; }
      const useBarre = canBarre && (fretted > 4 || (at.length >= 3 && opens === 0 && minF > 1));
      const rest = [];
      for (let i = 0; i < N; i++) {
        const f = cur[i];
        if (f <= 0) continue;
        if (useBarre && f === minF && i >= at[0] && i <= at[at.length - 1]) { fing[i] = 1; continue; }
        rest.push(i);
      }
      if (useBarre) barre = { fret: minF, from: at[0], to: at[at.length - 1] };
      rest.sort((a, c) => cur[a] - cur[c] || a - c);
      let next = useBarre ? 2 : 1;
      for (const i of rest) {
        let f = Math.max(next, cur[i] - minF + 1);
        if (f > 4) f = next;
        if (f > 4) return;            // needs a fifth finger
        fing[i] = f;
        next = f + 1;
      }
      fingers = rest.length + (useBarre ? 1 : 0);
      if (fingers > 4) return;
    }

    const pos = fretted ? minF : 0;
    let missing = 0;
    for (const p of opt) if (!have.has(p)) missing++;
    let s = pos * 0.35 + missing * 2.2 + (N - (drone >= 0 ? 1 : 0) - sounded) * 1.0 + inner * 3 + top * 1.5
          + fingers * 0.5 + (fretted ? (maxF - minF) * 0.7 : 0) + (barre ? 0.8 : 0)
          + opens * (pos > 4 ? 1.6 : -0.4) + (inst.guitarMutes && maxF >= 4 ? opens * 1.2 : 0)
          + (!inst.bass && b == null && lowestPc !== r ? 0.6 : 0)
          + (drone >= 0 && cur[drone] < 0 ? 0.5 : 0);
    out.set(k, { frets: cur.slice(), fing, barre, pos, score: s });
  }

  for (let lo = 1; lo <= 13; lo++) {
    const opts = tuning.map((o, i) => {
      const a = [-1];
      if (allowed.has(mod12(o))) a.push(0);
      if (i !== drone) for (let f = lo; f <= lo + inst.span; f++) if (allowed.has(mod12(o + f))) a.push(f);
      return a;
    });
    (function rec(i) {
      if (i === N) { evaluate(); return; }
      for (const f of opts[i]) { cur[i] = f; rec(i + 1); }
    })(0);
  }
  const list = [...out.values()].sort((a, c) => a.score - c.score).slice(0, 24);
  VCACHE.set(key, list);
  return list;
}

/* ---------- scales ---------- */
const SCALES = [
  { id: 'pmin',   iv: [0, 3, 5, 7, 10],          en: 'Minor pentatonic',          sv: 'Mollpentatonisk' },
  { id: 'pmaj',   iv: [0, 2, 4, 7, 9],           en: 'Major pentatonic',          sv: 'Durpentatonisk' },
  { id: 'blues',  iv: [0, 3, 5, 6, 7, 10],       en: 'Blues',                     sv: 'Blues', base: 'pmin' },
  { id: 'mblues', iv: [0, 2, 3, 4, 7, 9],        en: 'Major blues',               sv: 'Durblues', base: 'pmaj' },
  { id: 'major',  iv: [0, 2, 4, 5, 7, 9, 11],    en: 'Major (Ionian)',            sv: 'Dur (jonisk)' },
  { id: 'minor',  iv: [0, 2, 3, 5, 7, 8, 10],    en: 'Natural minor (Aeolian)',   sv: 'Ren moll (eolisk)' },
  { id: 'harm',   iv: [0, 2, 3, 5, 7, 8, 11],    en: 'Harmonic minor',            sv: 'Harmonisk moll' },
  { id: 'mel',    iv: [0, 2, 3, 5, 7, 9, 11],    en: 'Melodic minor',             sv: 'Melodisk moll' },
  { id: 'dor',    iv: [0, 2, 3, 5, 7, 9, 10],    en: 'Dorian',                    sv: 'Dorisk' },
  { id: 'phr',    iv: [0, 1, 3, 5, 7, 8, 10],    en: 'Phrygian',                  sv: 'Frygisk' },
  { id: 'lyd',    iv: [0, 2, 4, 6, 7, 9, 11],    en: 'Lydian',                    sv: 'Lydisk' },
  { id: 'mix',    iv: [0, 2, 4, 5, 7, 9, 10],    en: 'Mixolydian',                sv: 'Mixolydisk' },
  { id: 'loc',    iv: [0, 1, 3, 5, 6, 8, 10],    en: 'Locrian',                   sv: 'Lokrisk' },
  { id: 'phrdom', iv: [0, 1, 4, 5, 7, 8, 10],    en: 'Phrygian dominant',         sv: 'Frygisk dominant' },
  { id: 'hung',   iv: [0, 2, 3, 6, 7, 8, 11],    en: 'Hungarian minor',           sv: 'Ungersk moll' },
  { id: 'whole',  iv: [0, 2, 4, 6, 8, 10],       en: 'Whole tone',                sv: 'Heltonsskala' },
  { id: 'dimhw',  iv: [0, 1, 3, 4, 6, 7, 9, 10], en: 'Diminished (half–whole)',   sv: 'Förminskad (halv–hel)' },
  { id: 'dimwh',  iv: [0, 2, 3, 5, 6, 8, 9, 11], en: 'Diminished (whole–half)',   sv: 'Förminskad (hel–halv)' },
  { id: 'hira',   iv: [0, 2, 3, 7, 8],           en: 'Hirajōshi',                 sv: 'Hirajōshi' },
  { id: 'chrom',  iv: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], en: 'Chromatic', sv: 'Kromatisk' },
];
const SCALE_LABEL = { 0: '1', 1: '♭2', 2: '2', 3: '♭3', 4: '3', 5: '4', 6: '♭5', 7: '5', 8: '♭6', 9: '6', 10: '♭7', 11: '7' };
function scaleDegreeLabel(sc, s) {
  if (sc.id === 'lyd' || sc.id === 'whole') { if (s === 6) return '♯4'; if (s === 8 && sc.id === 'whole') return '♯5'; }
  if (sc.id === 'hung' && s === 6) return '♯4';
  if (sc.id === 'mblues' && s === 3) return '♭3';
  return SCALE_LABEL[s];
}
const MAX_FRET = 17;

/**
 * Box positions: two notes per string for five-note scales, three for seven-note scales.
 * Six-note blues scales use the pentatonic boxes plus the blue note inside each string's span.
 */
function scalePositions(root, sc) {
  const base = sc.base ? SCALES.find(x => x.id === sc.base) : sc;
  const n = base.iv.length;
  if (n !== 5 && n !== 7) return [];
  const nps = n === 5 ? 2 : 3;
  const pcs = new Set(base.iv.map(s => mod12(root + s)));
  const extra = new Set(sc.iv.filter(s => !base.iv.includes(s)).map(s => mod12(root + s)));
  const pitches = [];
  for (let m = STD[0]; m <= STD[5] + MAX_FRET + 12; m++) if (pcs.has(mod12(m))) pitches.push(m);
  const positions = [];
  for (let k = 0; k < n; k++) {
    let idx = k, notes = [];
    for (let s = 0; s < 6; s++) for (let j = 0; j < nps; j++) {
      const m = pitches[idx++];
      notes.push({ s, f: m - STD[s] });
    }
    let lo = Math.min(...notes.map(x => x.f)), hi = Math.max(...notes.map(x => x.f));
    if (lo < 0) { notes = notes.map(x => ({ s: x.s, f: x.f + 12 })); lo += 12; hi += 12; }
    if (hi > MAX_FRET) {
      if (lo >= 12) { notes = notes.map(x => ({ s: x.s, f: x.f - 12 })); }
      else continue;
    }
    if (extra.size) {
      for (let s = 0; s < 6; s++) {
        const fs = notes.filter(x => x.s === s).map(x => x.f);
        const a = Math.min(...fs), z = Math.max(...fs);
        for (let f = a; f <= z; f++) if (extra.has(mod12(STD[s] + f))) notes.push({ s, f });
      }
    }
    lo = Math.min(...notes.map(x => x.f)); hi = Math.max(...notes.map(x => x.f));
    positions.push({ notes, lo, hi });
  }
  positions.sort((a, c) => a.lo - c.lo);
  return positions;
}

/* ---------- keys, circle of fifths, progressions ---------- */
const CIRCLE = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];              // major keys clockwise from the top
const FLAT_MAJOR = new Set([5, 10, 3, 8, 1]);                         // F B♭ E♭ A♭ D♭
const keySpell = (tonic, minor) => {
  const maj = minor ? mod12(tonic + 3) : tonic;
  return FLAT_MAJOR.has(maj) ? 'f' : (maj === 0 ? undefined : 's');
};
function keySignature(tonic, minor) {
  const maj = minor ? mod12(tonic + 3) : tonic;
  const i = CIRCLE.indexOf(maj);
  if (i === 0) return { n: 0, acc: '' };
  if (i <= 6) return { n: i, acc: '♯' };
  return { n: 12 - i, acc: '♭' };
}
// [semitones above tonic, chord type suffix, roman numeral]
const DEG_MAJOR = { I: [0, ''], ii: [2, 'm'], iii: [4, 'm'], IV: [5, ''], V: [7, ''], vi: [9, 'm'], 'vii°': [11, 'dim'],
                    I7: [0, '7'], IV7: [5, '7'], V7: [7, '7'], ii7: [2, 'm7'], Imaj7: [0, 'maj7'], '♭VII': [10, ''], '♭VI': [8, ''], iv: [5, 'm'] };
const DEG_MINOR = { i: [0, 'm'], 'ii°': [2, 'dim'], III: [3, ''], iv: [5, 'm'], v: [7, 'm'], V: [7, ''], VI: [8, ''], VII: [10, ''],
                    V7: [7, '7'], i7: [0, 'm7'], iv7: [5, 'm7'] };
const DIATONIC_MAJOR = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
const DIATONIC_MINOR = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];
const PROGRESSIONS = {
  major: [
    { en: 'Pop (axis)',          sv: 'Pop (axel)',           seq: ['I', 'V', 'vi', 'IV'] },
    { en: '50s / doo-wop',       sv: '50-tal / doo-wop',     seq: ['I', 'vi', 'IV', 'V'] },
    { en: 'Sensitive',           sv: 'Känslosam',            seq: ['vi', 'IV', 'I', 'V'] },
    { en: 'Three-chord rock',    sv: 'Tre ackord-rock',      seq: ['I', 'IV', 'V', 'IV'] },
    { en: 'Jazz ii–V–I',         sv: 'Jazz ii–V–I',          seq: ['ii7', 'V7', 'Imaj7', 'Imaj7'] },
    { en: 'Ballad',              sv: 'Ballad',               seq: ['I', 'IV', 'vi', 'V'] },
    { en: 'Canon',               sv: 'Kanon',                seq: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V'] },
    { en: 'Mixolydian rock',     sv: 'Mixolydisk rock',      seq: ['I', '♭VII', 'IV', 'I'] },
    { en: 'Heartbreak (iv)',     sv: 'Hjärtekross (iv)',     seq: ['I', 'IV', 'iv', 'I'] },
    { en: 'Turnaround',          sv: 'Turnaround',           seq: ['I', 'vi', 'ii', 'V'] },
    { en: '12-bar blues',        sv: '12-takters blues',     seq: ['I7', 'I7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'] },
  ],
  minor: [
    { en: 'Epic',                sv: 'Episk',                seq: ['i', 'VI', 'III', 'VII'] },
    { en: 'Minor three-chord',   sv: 'Moll tre ackord',      seq: ['i', 'iv', 'v', 'i'] },
    { en: 'Andalusian cadence',  sv: 'Andalusisk kadens',    seq: ['i', 'VII', 'VI', 'V'] },
    { en: 'Aeolian vamp',        sv: 'Eolisk vamp',          seq: ['i', 'VII', 'VI', 'VII'] },
    { en: 'Minor pop',           sv: 'Moll-pop',             seq: ['i', 'iv', 'VII', 'III'] },
    { en: 'Dramatic',            sv: 'Dramatisk',            seq: ['i', 'VI', 'VII', 'i'] },
    { en: 'Minor ii–V–i',        sv: 'Moll ii–V–i',          seq: ['ii°', 'V7', 'i', 'i'] },
    { en: 'Minor blues',         sv: 'Mollblues',            seq: ['i7', 'i7', 'i7', 'i7', 'iv7', 'iv7', 'i7', 'i7', 'VI', 'V7', 'i7', 'V7'] },
  ],
};
/** Turn a roman numeral into a chord in the given key: {r, t, roman} */
function romanChord(roman, tonic, minor) {
  const d = (minor ? DEG_MINOR : DEG_MAJOR)[roman];
  return { r: mod12(tonic + d[0]), t: typeIndex(d[1]), b: null, roman };
}

/* ---------- tunings & temperaments ---------- */
const TUNINGS = [
  { id: 'std',    en: 'Standard',                  sv: 'Standard',                  n: [40, 45, 50, 55, 59, 64] },
  { id: 'half',   en: 'Half step down',            sv: 'Ett halvt tonsteg ner',     n: [39, 44, 49, 54, 58, 63] },
  { id: 'whole',  en: 'Whole step down (D std)',   sv: 'Ett helt tonsteg ner (D)',  n: [38, 43, 48, 53, 57, 62] },
  { id: 'dropd',  en: 'Drop D',                    sv: 'Drop D',                    n: [38, 45, 50, 55, 59, 64] },
  { id: 'dropcs', en: 'Drop C♯',                   sv: 'Drop C♯',                   n: [37, 44, 49, 54, 58, 63] },
  { id: 'dropc',  en: 'Drop C',                    sv: 'Drop C',                    n: [36, 43, 48, 53, 57, 62] },
  { id: 'dropb',  en: 'Drop B',                    sv: 'Drop B',                    n: [35, 42, 47, 52, 56, 61] },
  { id: 'dadgad', en: 'DADGAD',                    sv: 'DADGAD',                    n: [38, 45, 50, 55, 57, 62] },
  { id: 'openg',  en: 'Open G',                    sv: 'Öppen G',                   n: [38, 43, 50, 55, 59, 62] },
  { id: 'opend',  en: 'Open D',                    sv: 'Öppen D',                   n: [38, 45, 50, 54, 57, 62] },
  { id: 'opene',  en: 'Open E',                    sv: 'Öppen E',                   n: [40, 47, 52, 56, 59, 64] },
  { id: 'opena',  en: 'Open A',                    sv: 'Öppen A',                   n: [40, 45, 52, 57, 61, 64] },
  { id: 'openc',  en: 'Open C',                    sv: 'Öppen C',                   n: [36, 43, 48, 55, 60, 64] },
  { id: 'opendm', en: 'Open D minor',              sv: 'Öppen D-moll',              n: [38, 45, 50, 53, 57, 62] },
  { id: 'fourths',en: 'All fourths',               sv: 'Bara kvarter',              n: [40, 45, 50, 55, 60, 65] },
  { id: 'nst',    en: 'New standard (C G D A E G)',sv: 'Ny standard (C G D A E G)', n: [36, 43, 50, 57, 64, 67] },
  { id: 'bari',   en: 'Baritone (B)',              sv: 'Baryton (B)',               n: [35, 40, 45, 50, 54, 59] },
  { id: 'custom', en: 'Custom',                    sv: 'Egen',                      n: null },
];
/* ---------- instruments (for the tuner) ----------
 * n: notes as MIDI numbers in the order the strings cross the nut, bass side first.
 * layout: pegs on the left side (l) and right side (r) of the headstock; side: the first
 * string has its own peg on the side of the neck (5-string banjo).
 */
const INSTRUMENTS = [
  { id: 'guitar', en: 'Guitar', sv: 'Gitarr', layout: { l: 3, r: 3 }, tunings: TUNINGS.filter(x => x.n) },
  { id: 'guitar7', en: '7-string guitar', sv: '7-strängad gitarr', short: { en: '7-string', sv: '7-strängad' }, layout: { l: 4, r: 3 }, tunings: [
    { id: 'g7std',  en: 'Standard', sv: 'Standard', n: [35, 40, 45, 50, 55, 59, 64] },
    { id: 'g7dropa', en: 'Drop A', sv: 'Drop A', n: [33, 40, 45, 50, 55, 59, 64] },
    { id: 'g7half', en: 'Half step down', sv: 'Ett halvt tonsteg ner', n: [34, 39, 44, 49, 54, 58, 63] },
  ] },
  { id: 'guitar12', en: '12-string guitar', sv: '12-strängad gitarr', short: { en: '12-string', sv: '12-strängad' }, layout: { l: 6, r: 6 }, tunings: [
    { id: 'g12std', en: 'Standard', sv: 'Standard', n: [52, 40, 57, 45, 62, 50, 67, 55, 59, 59, 64, 64] },
    { id: 'g12half', en: 'Half step down', sv: 'Ett halvt tonsteg ner', n: [51, 39, 56, 44, 61, 49, 66, 54, 58, 58, 63, 63] },
    { id: 'g12dropd', en: 'Drop D', sv: 'Drop D', n: [50, 38, 57, 45, 62, 50, 67, 55, 59, 59, 64, 64] },
  ] },
  { id: 'bass4', en: 'Bass (4 strings)', sv: 'Elbas (4 strängar)', short: { en: 'Bass', sv: 'Bas' }, layout: { l: 2, r: 2 }, tunings: [
    { id: 'b4std',   en: 'Standard', sv: 'Standard', n: [28, 33, 38, 43] },
    { id: 'b4dropd', en: 'Drop D', sv: 'Drop D', n: [26, 33, 38, 43] },
    { id: 'b4half',  en: 'Half step down', sv: 'Ett halvt tonsteg ner', n: [27, 32, 37, 42] },
    { id: 'b4dstd',  en: 'D standard', sv: 'D-standard', n: [26, 31, 36, 41] },
    { id: 'b4dropc', en: 'Drop C', sv: 'Drop C', n: [24, 31, 36, 41] },
  ] },
  { id: 'bass5', en: 'Bass (5 strings)', sv: 'Elbas (5 strängar)', short: { en: 'Bass', sv: 'Bas' }, layout: { l: 3, r: 2 }, tunings: [
    { id: 'b5std',  en: 'Standard (low B)', sv: 'Standard (låg B)', n: [23, 28, 33, 38, 43] },
    { id: 'b5highc', en: 'High C', sv: 'Hög C', n: [28, 33, 38, 43, 48] },
    { id: 'b5half', en: 'Half step down', sv: 'Ett halvt tonsteg ner', n: [22, 27, 32, 37, 42] },
  ] },
  { id: 'bass6', en: 'Bass (6 strings)', sv: 'Elbas (6 strängar)', short: { en: 'Bass', sv: 'Bas' }, layout: { l: 3, r: 3 }, tunings: [
    { id: 'b6std', en: 'Standard', sv: 'Standard', n: [23, 28, 33, 38, 43, 48] },
  ] },
  { id: 'uke', en: 'Ukulele', sv: 'Ukulele', layout: { l: 2, r: 2 }, tunings: [
    { id: 'ukstd',  en: 'Standard (G C E A)', sv: 'Standard (G C E A)', n: [67, 60, 64, 69] },
    { id: 'uklowg', en: 'Low G', sv: 'Låg G', n: [55, 60, 64, 69] },
    { id: 'ukd',    en: 'D tuning (A D F♯ B)', sv: 'D-stämning (A D F♯ H)', n: [69, 62, 66, 71] },
    { id: 'ukbari', en: 'Baritone (D G B E)', sv: 'Baryton (D G H E)', n: [50, 55, 59, 64] },
  ] },
  { id: 'mandolin', en: 'Mandolin', sv: 'Mandolin', layout: { l: 4, r: 4 }, tunings: [
    { id: 'mdstd', en: 'Standard (G D A E)', sv: 'Standard (G D A E)', n: [55, 55, 62, 62, 69, 69, 76, 76] },
  ] },
  { id: 'mandola', en: 'Mandola', sv: 'Mandola', layout: { l: 4, r: 4 }, tunings: [
    { id: 'mastd', en: 'Standard (C G D A)', sv: 'Standard (C G D A)', n: [48, 48, 55, 55, 62, 62, 69, 69] },
  ] },
  { id: 'banjo5', en: 'Banjo (5 strings)', sv: 'Banjo (5 strängar)', short: { en: 'Banjo', sv: 'Banjo' }, layout: { l: 2, r: 2, side: true }, tunings: [
    { id: 'bjg',     en: 'Open G (g D G B D)', sv: 'Öppen G (g D G H D)', n: [67, 50, 55, 59, 62] },
    { id: 'bjdblc',  en: 'Double C (g C G C D)', sv: 'Dubbel-C (g C G C D)', n: [67, 48, 55, 60, 62] },
    { id: 'bjgmod',  en: 'G modal / sawmill (g D G C D)', sv: 'G modal (g D G C D)', n: [67, 50, 55, 60, 62] },
    { id: 'bjopend', en: 'Open D (f♯ D F♯ A D)', sv: 'Öppen D (f♯ D F♯ A D)', n: [66, 50, 54, 57, 62] },
  ] },
  { id: 'banjo4', en: 'Tenor banjo', sv: 'Tenorbanjo', layout: { l: 2, r: 2 }, tunings: [
    { id: 'tbstd',   en: 'Standard (C G D A)', sv: 'Standard (C G D A)', n: [48, 55, 62, 69] },
    { id: 'tbirish', en: 'Irish (G D A E)', sv: 'Irländsk (G D A E)', n: [43, 50, 57, 64] },
  ] },
  { id: 'violin', en: 'Violin', sv: 'Fiol', layout: { l: 2, r: 2 }, tunings: [
    { id: 'vnstd', en: 'Standard (G D A E)', sv: 'Standard (G D A E)', n: [55, 62, 69, 76] },
    { id: 'vncross', en: 'Cross tuning (A E A E)', sv: 'Korsstämning (A E A E)', n: [57, 64, 69, 76] },
  ] },
  { id: 'viola', en: 'Viola', sv: 'Altfiol', layout: { l: 2, r: 2 }, tunings: [
    { id: 'vastd', en: 'Standard (C G D A)', sv: 'Standard (C G D A)', n: [48, 55, 62, 69] },
  ] },
  { id: 'cello', en: 'Cello', sv: 'Cello', layout: { l: 2, r: 2 }, tunings: [
    { id: 'vcstd', en: 'Standard (C G D A)', sv: 'Standard (C G D A)', n: [36, 43, 50, 57] },
  ] },
  { id: 'dbass', en: 'Double bass', sv: 'Kontrabas', layout: { l: 2, r: 2 }, tunings: [
    { id: 'dbstd', en: 'Orchestra (E A D G)', sv: 'Orkester (E A D G)', n: [28, 33, 38, 43] },
    { id: 'dbsolo', en: 'Solo (F♯ B E A)', sv: 'Solo (F♯ H E A)', n: [30, 35, 40, 45] },
  ] },
];

// cents relative to equal temperament, with C as the temperament's root
const TEMPERAMENTS = [
  { id: 'equal', en: 'Equal temperament', sv: 'Liksvävande', c: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { id: 'just',  en: 'Just intonation',   sv: 'Ren stämning', c: [0, 11.73, 3.91, 15.64, -13.69, -1.96, -9.78, 1.96, 13.69, -15.64, 17.6, -11.73] },
  { id: 'pyth',  en: 'Pythagorean',       sv: 'Pytagoreisk', c: [0, -9.78, 3.91, -5.87, 7.82, -1.96, 11.73, 1.96, -7.82, 5.87, -3.91, 9.78] },
  { id: 'mean',  en: '¼-comma meantone',  sv: 'Medeltonstemperatur (¼ komma)', c: [0, -23.95, -6.84, 10.26, -13.69, 3.42, -20.53, -3.42, -27.37, -10.26, 6.84, -17.11] },
  { id: 'werck', en: 'Werckmeister III',  sv: 'Werckmeister III', c: [0, -9.78, -7.82, -5.87, -9.78, -1.96, -11.73, -3.91, -7.82, -11.73, -3.91, -7.82] },
  { id: 'kirn',  en: 'Kirnberger III',    sv: 'Kirnberger III', c: [0, -9.78, -6.84, -5.87, -13.69, -1.96, -9.78, -3.42, -7.82, -10.26, -3.91, -11.73] },
  { id: 'vall',  en: 'Vallotti',          sv: 'Vallotti', c: [0, -5.87, -3.91, -1.96, -7.82, 1.96, -7.82, -1.96, -3.91, -5.87, 0, -9.78] },
];
/** Cent offset of pitch class pc for a temperament rooted on `root`, keeping A at the calibration pitch. */
function temperOffset(temp, root, pc) {
  const off = p => temp.c[mod12(p - root)];
  return off(pc) - off(9);
}
/** Target frequency of a MIDI note under calibration a4, temperament and its root. */
function targetFreq(m, a4, temp, root) {
  return midiFreq(m, a4) * Math.pow(2, temperOffset(temp, root, m) / 1200);
}

if (typeof module !== 'undefined') module.exports = {
  STD, CHORD_INSTS, TYPES, SCALES, TUNINGS, INSTRUMENTS, TEMPERAMENTS, PROGRESSIONS, CIRCLE, Theory, nn, voicings, parseChord, chordName,
  scalePositions, romanChord, keySignature, targetFreq, typeIndex,
};
