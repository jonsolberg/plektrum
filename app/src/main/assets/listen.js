/*
 * Plektrum – Listen (experimental): finds chords, bass lines and melodies in sound from the microphone.
 * Copyright (C) 2026 Jon Solberg. Licensed under the GNU GPL v3 (see LICENSE).
 *
 * Everything here works on plain arrays so it can be tested without a browser:
 *  - Hear.chroma()   spectrum → the strength of each of the 12 pitch classes (a "chromagram")
 *  - ChordFinder     chromagram over time → steady chord names, with hysteresis so it doesn't flicker
 *  - Hear.key()      long-term chromagram → most likely key (Krumhansl–Kessler profiles)
 *  - NoteTracker     pitch per frame → notes with start and length (for bass lines and melodies)
 *  - Hear.scaleFit() notes → the scales they fit best
 *  - Hear.toTab()    notes → tab on a guitar or bass, keeping the hand in one area of the neck
 */
'use strict';

const Hear = {
  BASS_LO: 36, BASS_HI: 150,          // the bass-note range used for roots and inversions (C2 … D3)
  /**
   * Chromagram from a magnitude spectrum (linear amplitudes, bin k = k·sr/fftSize Hz).
   * Each spectral peak adds its energy to its pitch class. A peak is also allowed to be a harmonic
   * of a lower note: the 3rd and 5th harmonics land on the 5th and major 3rd, which would otherwise
   * blur every major chord, so their share is moved back to the fundamental when that is present.
   */
  chroma(mag, sr, fftSize, lo = 65, hi = 2100, out) {
    const c = out || new Float64Array(12);
    c.fill(0);
    const k0 = Math.max(2, Math.floor(lo * fftSize / sr)), k1 = Math.min(mag.length - 2, Math.ceil(hi * fftSize / sr));
    // whiten: compare each bin with its neighbourhood so broadband noise and drums count for little
    let peakMax = 0;
    const pk = [];
    for (let k = k0; k <= k1; k++) {
      const m = mag[k];
      if (m <= mag[k - 1] || m < mag[k + 1]) continue;
      let loc = 0, n = 0;
      const w = Math.max(3, Math.round(k * 0.06));
      for (let j = k - w; j <= k + w; j += 1) { if (j >= 0 && j < mag.length) { loc += mag[j]; n++; } }
      loc /= n;
      if (m < loc * 1.6) continue;
      // parabolic interpolation for the exact frequency
      const a = mag[k - 1], b = m, g = mag[k + 1], den = a - 2 * b + g;
      const shift = den ? 0.5 * (a - g) / den : 0;
      const f = (k + shift) * sr / fftSize;
      const e = m - loc;
      pk.push([f, e]);
      if (e > peakMax) peakMax = e;
    }
    if (!pk.length) return c;
    for (const [f, e] of pk) {
      if (e < peakMax * 0.04) continue;
      const midi = 69 + 12 * Math.log2(f / 440);
      const near = Math.round(midi), dev = Math.abs(midi - near);
      if (dev > 0.35) continue;                                   // between two notes: noise
      const w = Math.sqrt(e) * (1 - dev * 1.5) * (f < 260 ? 1.3 : 1);   // low notes define the chord more
      c[((near % 12) + 12) % 12] += w;
    }
    return c;
  },

  /**
   * The bass note as a 12-value array with only its pitch class set (all zero when unclear).
   * The bass is the lowest clear note, not the loudest one: a low string's fundamental is often weaker
   * than its own overtones.
   */
  bass(mag, sr, fftSize, out) {
    const c = out || new Float64Array(12);
    c.fill(0);
    const k0 = Math.max(2, Math.floor(this.BASS_LO * fftSize / sr)), k1 = Math.ceil(this.BASS_HI * fftSize / sr);
    const k2 = Math.ceil(400 * fftSize / sr);
    let max = 0;
    for (let k = k0; k <= k2; k++) if (mag[k] > max) max = mag[k];
    if (max <= 0) return c;
    for (let k = k0 + 1; k <= k1; k++) {
      const m = mag[k];
      if (m <= mag[k - 1] || m < mag[k + 1] || m < max * 0.22) continue;
      const a = mag[k - 1], g = mag[k + 1], den = a - 2 * m + g;
      const f = (k + (den ? 0.5 * (a - g) / den : 0)) * sr / fftSize;
      const midi = 69 + 12 * Math.log2(f / 440), near = Math.round(midi);
      if (Math.abs(midi - near) > 0.35) continue;
      c[((near % 12) + 12) % 12] = m / max;
      return c;
    }
    return c;
  },

  norm(c) {
    let s = 0;
    for (let i = 0; i < 12; i++) s += c[i] * c[i];
    s = Math.sqrt(s) || 1;
    const o = new Float64Array(12);
    for (let i = 0; i < 12; i++) o[i] = c[i] / s;
    return o;
  },

  /** Chord shapes to look for: intervals with weights. Kept to what a listener would name by ear. */
  SHAPES: [
    { sfx: '',     iv: [[0, 1], [4, 0.9], [7, 0.8]],               bias: 0.02 },
    { sfx: 'm',    iv: [[0, 1], [3, 0.9], [7, 0.8]],               bias: 0.015 },
    { sfx: '7',    iv: [[0, 1], [4, 0.85], [7, 0.7], [10, 0.75]],   bias: -0.03 },
    { sfx: 'maj7', iv: [[0, 1], [4, 0.85], [7, 0.7], [11, 0.75]],   bias: -0.035 },
    { sfx: 'm7',   iv: [[0, 1], [3, 0.85], [7, 0.7], [10, 0.75]],   bias: -0.03 },
    { sfx: 'sus4', iv: [[0, 1], [5, 0.9], [7, 0.8]],               bias: -0.04 },
    { sfx: 'sus2', iv: [[0, 1], [2, 0.9], [7, 0.8]],               bias: -0.045 },
    { sfx: 'dim',  iv: [[0, 1], [3, 0.9], [6, 0.85]],              bias: -0.05 },
    { sfx: '5',    iv: [[0, 1], [7, 0.95]],                       bias: -0.06 },
  ],

  _templates: null,
  templates() {
    if (this._templates) return this._templates;
    const out = [];
    for (let r = 0; r < 12; r++) for (const sh of this.SHAPES) {
      const v = new Float64Array(12);
      for (const [i, w] of sh.iv) v[(r + i) % 12] = w;
      out.push({ r, sfx: sh.sfx, v: this.norm(v), bias: sh.bias });
    }
    return (this._templates = out);
  },

  /**
   * Scores every chord against a chromagram. The bass chroma (optional) gives the root a bonus,
   * and turns e.g. C over a G bass into C/G rather than G-something.
   * Returns candidates sorted best first: {r, sfx, score, b}.
   */
  rank(chroma, bass) {
    const c = this.norm(chroma);
    let energy = 0;
    for (let i = 0; i < 12; i++) energy += chroma[i];
    if (energy <= 1e-9) return [];
    let bassPc = -1;
    if (bass) {
      let bm = 0, bs = 0;
      for (let i = 0; i < 12; i++) { bs += bass[i]; if (bass[i] > bm) { bm = bass[i]; bassPc = i; } }
      if (bs <= 1e-9 || bm < bs * 0.45) bassPc = -1;            // no clear bass note
    }
    const res = [];
    for (const t of this.templates()) {
      let s = 0;
      for (let i = 0; i < 12; i++) s += c[i] * t.v[i];
      s += t.bias;
      if (bassPc >= 0) {
        if (bassPc === t.r) s += 0.07;
        else if (t.v[bassPc] > 0) s += 0.015;                    // an inversion: the bass is a chord note
        else s -= 0.07;                                           // a chord without its bass note is unlikely (Em over C = Cmaj7)
      }
      res.push({ r: t.r, sfx: t.sfx, score: s, b: bassPc >= 0 && bassPc !== t.r && t.v[bassPc] > 0 ? bassPc : null });
    }
    return res.sort((a, b) => b.score - a.score);
  },

  /* Krumhansl–Kessler key profiles */
  MAJ: [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88],
  MIN: [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17],

  /** Most likely keys for a long-term chromagram: [{tonic, minor, score}] best first. */
  key(chroma) {
    const corr = (a, b) => {
      let ma = 0, mb = 0;
      for (let i = 0; i < 12; i++) { ma += a[i]; mb += b[i]; }
      ma /= 12; mb /= 12;
      let s = 0, sa = 0, sb = 0;
      for (let i = 0; i < 12; i++) { const x = a[i] - ma, y = b[i] - mb; s += x * y; sa += x * x; sb += y * y; }
      return sa && sb ? s / Math.sqrt(sa * sb) : 0;
    };
    const out = [];
    for (let t = 0; t < 12; t++) for (const minor of [false, true]) {
      const p = minor ? this.MIN : this.MAJ, rot = new Array(12);
      for (let i = 0; i < 12; i++) rot[(i + t) % 12] = p[i];
      out.push({ tonic: t, minor, score: corr(chroma, rot) });
    }
    return out.sort((a, b) => b.score - a.score);
  },

  /**
   * Key from the chords that were heard (plus the long-term chromagram as a tie-breaker).
   * Relative keys (G major / E minor) share all notes; what tells them apart is which chord is home:
   * songs tend to start and end on it and return to it often.
   */
  keyFromChords(segs, chroma) {
    const fam = sfx => /^(m|m7|m6|m9|madd9)$/.test(sfx) ? 'm' : /^(dim|dim7|m7b5)$/.test(sfx) ? 'd' : 'M';
    const DIA = { major: [[0, 'M'], [2, 'm'], [4, 'm'], [5, 'M'], [7, 'M'], [9, 'm'], [11, 'd']],
                  minor: [[0, 'm'], [2, 'd'], [3, 'M'], [5, 'm'], [7, 'm'], [7, 'M'], [8, 'M'], [10, 'M']] };
    const total = segs.reduce((a, x) => a + x.len, 0);
    const ks = chroma ? this.key(chroma) : [];
    const out = [];
    for (let t = 0; t < 12; t++) for (const minor of [false, true]) {
      const dia = DIA[minor ? 'minor' : 'major'];
      let fit = 0, home = 0;
      segs.forEach(x => {
        const iv = (x.r - t + 12) % 12, f = fam(x.sfx);
        fit += (dia.some(([d, q]) => d === iv && q === f) ? 1 : -0.6) * x.len;
        if (iv === 0 && f === (minor ? 'm' : 'M')) home += x.len;
      });
      let score = total ? fit / total + 0.6 * home / total : 0;
      const isHome = x => x && (x.r - t + 12) % 12 === 0 && fam(x.sfx) === (minor ? 'm' : 'M');
      if (isHome(segs[0])) score += 0.15;
      if (isHome(segs[segs.length - 1])) score += 0.2;
      const kc = ks.find(k => k.tonic === t && k.minor === minor);
      if (kc) score += 0.25 * kc.score;
      out.push({ tonic: t, minor, score });
    }
    return out.sort((a, b) => b.score - a.score);
  },

  /** Which scales the played notes fit. notes: [{midi, dur}]. Returns [{root, iv, id, score}] best first. */
  scaleFit(notes, scales) {
    const h = new Float64Array(12);
    let total = 0;
    for (const n of notes) { const w = Math.min(n.dur || 0.2, 1.5); h[((Math.round(n.midi) % 12) + 12) % 12] += w; total += w; }
    if (!total) return [];
    const first = notes.length ? ((Math.round(notes[0].midi) % 12) + 12) % 12 : -1;
    const last = notes.length ? ((Math.round(notes[notes.length - 1].midi) % 12) + 12) % 12 : -1;
    const out = [];
    for (const sc of scales) for (let root = 0; root < 12; root++) {
      const inSc = new Set(sc.iv.map(i => (root + i) % 12));
      let hit = 0;
      for (let i = 0; i < 12; i++) if (inSc.has(i)) hit += h[i];
      const cover = hit / total;                                   // share of the playing inside the scale
      let used = 0;
      for (const p of inSc) if (h[p] > total * 0.02) used++;
      const fill = used / inSc.size;                               // how much of the scale is actually used
      let s = cover * 0.75 + fill * 0.25 - inSc.size * 0.004;      // prefer the smaller scale when both fit
      s += (h[root] / total) * 0.25;                               // a scale is named after the note you keep returning to
      if (first === root) s += 0.02;
      if (last === root) s += 0.05;
      out.push({ root, iv: sc.iv, id: sc.id, score: s, cover });
    }
    return out.sort((a, b) => b.score - a.score);
  },

  /**
   * Notes → tab positions [{s, f}] (s = string index from the lowest, f = fret).
   * Picks each fret close to the previous one so the hand stays in one area.
   */
  toTab(notes, tuning, maxFret = 17) {
    let hand = null;
    return notes.map(n => {
      const m = Math.round(n.midi), opts = [];
      tuning.forEach((open, s) => { const f = m - open; if (f >= 0 && f <= maxFret) opts.push({ s, f }); });
      if (!opts.length) return null;
      let best = opts[0], bestCost = Infinity;
      for (const o of opts) {
        const cost = hand == null ? o.f + (o.f === 0 ? -1 : 0) : Math.abs(o.f - hand) + (o.f === 0 ? 1.5 : 0) + o.f * 0.03;
        if (cost < bestCost) { bestCost = cost; best = o; }
      }
      if (best.f > 0) hand = hand == null ? best.f : hand * 0.6 + best.f * 0.4;
      return best;
    });
  },

  /** ASCII tab, highest string on top, one column group per note. */
  tabText(pos, names, width = 3) {
    const N = names.length, lines = names.map(n => (n + '|').padStart(2, ' '));
    const rows = Array.from({ length: N }, () => '-');
    pos.forEach(p => {
      for (let s = 0; s < N; s++) {
        const cell = p && p.s === s ? String(p.f) : '';
        rows[s] += cell.padEnd(width, '-');
      }
    });
    return Array.from({ length: N }, (_, i) => N - 1 - i).map(s => lines[s] + rows[s] + '|').join('\n');
  },
};

/**
 * Turns a stream of chord rankings into steady chords. A new chord must win clearly for a while
 * before it replaces the current one; very short ones are dropped from the timeline.
 */
class ChordFinder {
  constructor(opts = {}) {
    this.hold = opts.hold || 0.35;            // seconds a challenger must lead
    this.minSeg = opts.minSeg || 0.6;         // shorter chords are left out of the timeline
    this.decay = opts.decay || 0.25;          // smoothing time constant for the chromagram (s)
    this.reset();
  }
  reset() {
    this.sm = new Float64Array(12); this.smB = new Float64Array(12); this.long = new Float64Array(12);
    this.cur = null; this.cand = null; this.candT = 0; this.t = 0; this.segs = []; this.silent = 0;
  }
  /** One frame: chroma and bass chroma of the last dt seconds, level in dB. Returns the current chord or null. */
  push(chroma, bass, dt, db) {
    this.t += dt;
    const a = 1 - Math.exp(-dt / this.decay);
    let e = 0;
    for (let i = 0; i < 12; i++) {
      this.sm[i] += a * (chroma[i] - this.sm[i]);
      if (bass) this.smB[i] += a * (bass[i] - this.smB[i]);
      this.long[i] += chroma[i] * dt;
      e += chroma[i];
    }
    if (db != null && db < -55 || e <= 1e-9) {          // quiet: let the chord end after a while
      this.silent += dt;
      if (this.silent > 0.8 && this.cur) this.close();
      return this.cur;
    }
    this.silent = 0;
    const r = Hear.rank(this.sm, bass ? this.smB : null);
    if (!r.length) return this.cur;
    const top = r[0], name = ChordFinder.key(top);
    if (this.cur && ChordFinder.key(this.cur) === name) { this.cand = null; this.cur.conf = top.score; return this.cur; }
    const curScore = this.cur ? (r.find(x => x.r === this.cur.r && x.sfx === this.cur.sfx) || { score: 0 }).score : -1;
    if (top.score < 0.55 || top.score - curScore < 0.02) { this.cand = null; return this.cur; }
    if (!this.cand || ChordFinder.key(this.cand) !== name) { this.cand = top; this.candT = this.t; }
    if (this.t - this.candT >= this.hold) {
      this.close();
      this.cur = { r: top.r, sfx: top.sfx, b: top.b, start: this.candT, conf: top.score };
      this.cand = null;
    }
    return this.cur;
  }
  close() {
    if (!this.cur) return;
    const len = this.t - this.cur.start;
    if (len >= this.minSeg) {
      const last = this.segs[this.segs.length - 1];
      if (last && ChordFinder.key(last) === ChordFinder.key(this.cur)) last.len += len;
      else this.segs.push({ r: this.cur.r, sfx: this.cur.sfx, b: this.cur.b, start: this.cur.start, len });
    }
    this.cur = null;
  }
  /** The timeline including the chord that is sounding now. */
  timeline() {
    const out = this.segs.slice();
    if (this.cur && this.t - this.cur.start >= this.minSeg) {
      const last = out[out.length - 1];
      if (last && ChordFinder.key(last) === ChordFinder.key(this.cur)) out[out.length - 1] = Object.assign({}, last, { len: last.len + this.t - this.cur.start });
      else out.push({ r: this.cur.r, sfx: this.cur.sfx, b: this.cur.b, start: this.cur.start, len: this.t - this.cur.start, now: true });
    }
    return out;
  }
  static key(c) { return c.r + ':' + c.sfx; }
}

/** Pitch per frame → notes. A note starts when the pitch has been steady for a moment, and ends on silence or a new pitch. */
class NoteTracker {
  constructor(opts = {}) {
    this.minLen = opts.minLen || 0.07;        // shorter blips are ignored
    this.tol = opts.tol || 0.45;              // semitones a held note may drift (vibrato, bends)
    this.reset();
  }
  reset() { this.t = 0; this.notes = []; this.cur = null; this.pend = null; this.prevDb = -99; }
  /** One frame: detected frequency (0 = none), frame length, and level in dB (to hear a repeated note's new attack). */
  push(freq, dt, db) {
    this.t += dt;
    const attack = db != null && db - this.prevDb > 5;
    if (db != null) this.prevDb = this.prevDb < -90 ? db : this.prevDb * 0.5 + db * 0.5;
    if (attack && this.cur && this.t - this.cur.start > 0.12) this.end();   // the same note picked again
    if (!freq) {
      if (this.cur) this.end();
      this.pend = null;
      return null;
    }
    const m = 69 + 12 * Math.log2(freq / 440);
    if (this.cur) {
      if (Math.abs(m - this.cur.ref) <= this.tol) { this.cur.sum += m * dt; this.cur.w += dt; return this.cur; }
      this.end();
    }
    if (this.pend && Math.abs(m - this.pend.m) <= this.tol) {
      if (this.t - this.pend.t >= this.minLen) {
        this.cur = { start: this.pend.t, ref: Math.round(this.pend.m), sum: m * (this.t - this.pend.t), w: this.t - this.pend.t };
        this.pend = null;
      }
    } else this.pend = { m, t: this.t - dt };
    return this.cur;
  }
  end() {
    const c = this.cur; this.cur = null;
    if (!c) return;
    const midi = Math.round(c.sum / c.w);
    this.notes.push({ midi, start: c.start, dur: this.t - c.start });
  }
  all() {
    const out = this.notes.slice();
    if (this.cur) out.push({ midi: Math.round(this.cur.sum / this.cur.w), start: this.cur.start, dur: this.t - this.cur.start, now: true });
    return out;
  }
}

if (typeof module !== 'undefined') module.exports = { Hear, ChordFinder, NoteTracker };
