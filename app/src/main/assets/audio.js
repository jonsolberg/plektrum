/*
 * Plektrum – audio: plucked-string synthesis (Karplus–Strong), clicks, a look-ahead
 * beat clock, the pitch pipe and the tuner's pitch detector.
 * Copyright (C) 2026 Jon Solberg — GNU GPL v3 or later.
 */
'use strict';

/**
 * Sound of each instrument family. bright: how much of the pluck's high end survives the attack;
 * t60: ring time (s) of the low notes, shortening by t60slope per semitone; pick: pluck position
 * (fraction of the string); body: resonance [Hz, Q, dB]; tone: final low-pass; pair: second string
 * of a course, detuned by this many cents (mandolin); bow: bowed instead of plucked.
 */
const TIMBRES = {
  guitar:   { bright: 0.55, t60: 4.2, slope: 0.07, min: 1.2, pick: 0.18, body: [220, 1.1, 4], tone: 5200, gain: 0.42 },
  uke:      { bright: 0.28, t60: 1.8, slope: 0.025, min: 0.6, pick: 0.15, body: [380, 1.0, 5], tone: 2800, gain: 0.55 },
  mandolin: { bright: 0.78, t60: 1.6, slope: 0.025, min: 0.5, pick: 0.09, body: [750, 1.3, 4], tone: 7500, gain: 0.32, pair: 6 },
  banjo:    { bright: 0.9, t60: 1.0, slope: 0.012, min: 0.35, pick: 0.06, body: [1500, 1.8, 9], tone: 9500, gain: 0.42 },
  bass:     { bright: 0.32, t60: 6.5, slope: 0.05, min: 2, pick: 0.24, body: [110, 0.9, 5], tone: 1700, gain: 0.62 },
  bow:      { bow: true, body: [520, 0.8, 3], tone: 4800, gain: 0.2 },
};
const TIMBRE_OF = {
  guitar: 'guitar', guitar7: 'guitar', guitar12: 'guitar', uke: 'uke', ukebari: 'uke', mandolin: 'mandolin', mandola: 'mandolin',
  banjo5: 'banjo', banjo4: 'banjo', bass: 'bass', bass4: 'bass', bass5: 'bass', bass6: 'bass',
  violin: 'bow', viola: 'bow', cello: 'bow', dbass: 'bow',
};

const Snd = {
  ctx: null, out: null, volume: 0.8, enabled: true, timbre: 'guitar',
  bufs: new Map(), voices: [],

  init() {
    if (!this.ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      this.ctx = new C({ latencyHint: 'interactive' });
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 4;
      const tone = this.ctx.createBiquadFilter();
      tone.type = 'lowpass'; tone.frequency.value = 5200;
      const body = this.ctx.createBiquadFilter();
      body.type = 'peaking'; body.frequency.value = 220; body.Q.value = 1.1; body.gain.value = 4;
      this.out = this.ctx.createGain();
      this.out.connect(body); body.connect(tone); tone.connect(comp); comp.connect(this.ctx.destination);
      this.comp = comp; this.bodyF = body; this.toneF = tone;
      this.setTimbre(this.timbre);
      this.drums = this.ctx.createGain();            // drums skip the guitar body/tone filters
      this.drums.gain.value = 0.7;
      this.drums.connect(comp);
      const nb = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate), nd = nb.getChannelData(0);
      for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
      this.noiseBuf = nb;
    }
    this.out.gain.value = this.volume;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },
  now() { return this.init().currentTime; },

  /** Switch the instrument sound: an instrument id (mandolin, banjo5 …) or a timbre name. */
  setTimbre(id) {
    const name = TIMBRE_OF[id] || (TIMBRES[id] ? id : 'guitar');
    this.timbre = name;
    if (!this.ctx) return;
    const tb = TIMBRES[name], t = this.ctx.currentTime;
    this.bodyF.frequency.setTargetAtTime(tb.body[0], t, 0.02);
    this.bodyF.Q.setTargetAtTime(tb.body[1], t, 0.02);
    this.bodyF.gain.setTargetAtTime(tb.body[2], t, 0.02);
    this.toneF.frequency.setTargetAtTime(tb.tone, t, 0.02);
  },

  /** Karplus–Strong string with a fractional delay so high notes stay in tune. */
  buffer(midi) {
    const tb = TIMBRES[this.timbre].bow ? TIMBRES.guitar : TIMBRES[this.timbre];
    const key = this.timbre + midi;
    if (this.bufs.has(key)) return this.bufs.get(key);
    const ctx = this.ctx, sr = ctx.sampleRate;
    const f = 440 * Math.pow(2, (midi - 69) / 12);
    const D = sr / f - 0.5, N = Math.floor(D), fr = D - N;
    const t60 = Math.max(tb.min, tb.t60 - (midi - 40) * tb.slope);
    const rho = Math.pow(0.001, 1 / (f * t60));
    const len = Math.floor(sr * Math.min(4, t60 + 0.3));
    const b = ctx.createBuffer(1, len, sr), d = b.getChannelData(0);
    let lp = 0;
    const pick = Math.max(1, Math.round(N * tb.pick));      // pluck position comb
    const ex = new Float32Array(N + 2);
    for (let i = 0; i < N + 2; i++) { lp += tb.bright * ((Math.random() * 2 - 1) - lp); ex[i] = lp; }
    for (let i = 0; i < N + 2 && i < len; i++) d[i] = 0.9 * (ex[i] - (i >= pick ? ex[i - pick] * 0.5 : 0));
    for (let i = N + 2; i < len; i++) {
      const r1 = d[i - N] * (1 - fr) + d[i - N - 1] * fr;
      const r2 = d[i - N - 1] * (1 - fr) + d[i - N - 2] * fr;
      d[i] = rho * 0.5 * (r1 + r2);
    }
    const fade = Math.floor(sr * 0.25);
    for (let i = 0; i < fade; i++) d[len - 1 - i] *= i / fade;
    // level-match: the random excitation (and the pick position) made some notes much quieter
    // than their neighbours – in a chord that note could all but disappear (e.g. the ♭5 of a dim chord)
    const win = Math.min(len, Math.floor(sr * 0.35));
    let e = 0; for (let i = 0; i < win; i++) e += d[i] * d[i];
    const rms = Math.sqrt(e / win), norm = rms > 1e-6 ? 0.18 / rms : 1;
    for (let i = 0; i < len; i++) d[i] *= norm;
    this.bufs.set(key, b);
    return b;
  },

  /** Pluck one string (0 = low E) at time `when`. A new note on a string damps the old one. */
  pluck(midi, when, string = -1, vel = 1) {
    if (!this.enabled) return;
    this.init();
    const ctx = this.ctx;
    when = Math.max(when || 0, ctx.currentTime);
    if (string >= 0 && this.voices[string]) {
      const v = this.voices[string];
      v.g.gain.cancelScheduledValues(when);
      v.g.gain.setTargetAtTime(0, when, 0.015);
      v.src.stop(when + 0.12);
    }
    const tb = TIMBRES[this.timbre];
    if (tb.bow) { this.bowNote(midi, when, string, vel); return; }
    const src = ctx.createBufferSource();
    src.buffer = this.buffer(midi);
    const srcs = [src];
    const g = ctx.createGain();
    g.gain.value = tb.gain * vel;
    src.connect(g); g.connect(this.out);
    src.start(when);
    if (tb.pair) {
      // the second string of the course, a hair out of tune and a moment later
      const s2 = ctx.createBufferSource();
      s2.buffer = src.buffer;
      s2.detune.value = tb.pair;
      s2.connect(g);
      srcs.push(s2);
      s2.start(when + 0.004 + Math.random() * 0.004);
      src.onended = () => { try { s2.stop(); } catch (e) { /* already stopped */ } };
      const stop = src.stop.bind(src);
      src.stop = t => { stop(t); s2.stop(t); };
    }
    const voice = { src, g, srcs, midi, base: srcs.map(x => x.detune.value) };
    if (string >= 0) { this.voices[string] = voice; src.onended = () => { if (this.voices[string] === voice) this.voices[string] = null; }; }
    return voice;
  },

  /**
   * A phrase on one string with guitar techniques: [{m, t, how}] where how is
   * 'pick' (a new picked note), 'h' / 'p' (hammer-on / pull-off: the same string sounding on
   * without a new pick), 'slide' (glide to the new fret) or 'bend' (push the pitch up smoothly).
   * Times are relative to `when`.
   */
  phrase(events, when, string = 3) {
    this.init();
    when = Math.max(when || 0, this.ctx.currentTime + 0.02);
    let v = null, cur = 0;
    const setTo = (cents, t, glide) => v.srcs.forEach((x, i) => {
      const d = x.detune, b = v.base[i];
      d.setValueAtTime(b + cur, t);
      if (glide) d.linearRampToValueAtTime(b + cents, t + glide); else d.setValueAtTime(b + cents, t + 0.003);
    });
    events.forEach(e => {
      const t = when + e.t;
      if (!v || e.how === 'pick') { v = this.pluck(e.m, t, string, e.vel || 0.95); cur = 0; return; }
      if (!v.srcs) return;                        // bowed instruments: no legato
      const cents = (e.m - v.midi) * 100;
      if (e.how === 'slide') setTo(cents, t, 0.09);
      else if (e.how === 'bend' || e.how === 'release') setTo(cents, t, 0.26);
      else {                                      // hammer-on / pull-off: a small tap of the finger
        setTo(cents, t, 0);
        v.g.gain.setValueAtTime(v.g.gain.value, t);
        if (e.how === 'p') { v.g.gain.setValueAtTime(v.g.gain.value * 0.95, t); }
      }
      cur = cents;
    });
  },

  /**
   * A note that lasts exactly `dur` seconds – for note-value examples, where a plucked string
   * would ring on (or die away) regardless of the written length. Soft, recorder-like tone.
   */
  held(midi, when, dur, vel = 1) {
    if (!this.enabled) return;
    const ctx = this.init();
    when = Math.max(when || 0, ctx.currentTime);
    const f = 440 * Math.pow(2, (midi - 69) / 12), end = when + Math.max(0.08, dur - 0.06);   // a small gap before the next note
    const g = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = Math.min(5000, f * 6);
    const oscs = [[1, 'triangle', 1], [2, 'sine', 0.25], [3, 'sine', 0.08]].map(([h, type, a]) => {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = type; o.frequency.value = f * h; og.gain.value = a; o.connect(og); og.connect(lp); return o;
    });
    const peak = 0.22 * vel;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(peak, when + 0.02);
    g.gain.setTargetAtTime(peak * 0.8, when + 0.02, 0.25);               // a slight settle, then steady
    g.gain.setTargetAtTime(0.0001, end, 0.02);                          // stop at the end of the note value
    lp.connect(g); g.connect(this.out);
    oscs.forEach(o => { o.start(when); o.stop(end + 0.2); });
  },

  /** Bowed note (violin family): two slightly detuned saws, bow attack, gentle delayed vibrato. */
  bowNote(midi, when, string = -1, vel = 1, dur = 1.4) {
    const ctx = this.ctx, f = 440 * Math.pow(2, (midi - 69) / 12);
    const g = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = Math.min(6000, f * 7); lp.Q.value = 0.8;
    const oscs = [0, 7].map(det => { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = det; o.connect(lp); return o; });
    const vib = ctx.createOscillator(), vg = ctx.createGain();
    vib.frequency.value = 5.6; vg.gain.setValueAtTime(0, when); vg.gain.linearRampToValueAtTime(f * 0.0045, when + 0.45);
    vib.connect(vg); oscs.forEach(o => vg.connect(o.frequency));
    const peak = TIMBRES.bow.gain * vel;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(peak * 1.3, when + 0.06);          // the bow catching the string
    g.gain.exponentialRampToValueAtTime(peak, when + 0.18);
    g.gain.setValueAtTime(peak, when + dur);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur + 0.35);
    lp.connect(g); g.connect(this.out);
    oscs.forEach(o => { o.start(when); o.stop(when + dur + 0.4); });
    vib.start(when); vib.stop(when + dur + 0.4);
    const src = { stop: t => oscs.forEach(o => { try { o.stop(t); } catch (e) { /* done */ } }) };
    if (string >= 0) this.voices[string] = { src, g };
  },

  /** frets[6] (-1 muted). style: 'strum' | 'arp' | 'up' */
  chord(frets, tuning, when, style = 'strum', vel = 1) {
    this.init();
    when = Math.max(when || 0, this.ctx.currentTime + 0.01);
    let idx = frets.map((f, i) => i).filter(i => frets[i] >= 0);
    for (let i = 0; i < frets.length; i++) if (frets[i] < 0) this.dampString(i, when);
    if (style === 'up') idx = idx.slice(-4).reverse();
    const gap = style === 'arp' ? 0.3 : style === 'fast' ? 0.012 : 0.022;
    idx.forEach((s, k) => this.pluck(tuning[s] + frets[s], when + k * gap, s, vel * (style === 'up' ? 0.8 : 1)));
    return idx.map((s, k) => ({ s, when: when + k * gap }));
  },
  dampString(i, when) {
    const v = this.voices[i];
    if (v) { v.g.gain.cancelScheduledValues(when); v.g.gain.setTargetAtTime(0, when, 0.015); }
  },
  /** short burst of filtered noise – the scratch of a muted strum */
  scratch(when, vel, freq = 1800, dur = 0.05) {
    const ctx = this.ctx;
    const src = ctx.createBufferSource(); src.buffer = this.noiseBuf;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = 1.2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(0.5 * vel, when + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    src.connect(bp); bp.connect(g); g.connect(this.out);
    src.start(when, Math.random() * 0.5); src.stop(when + dur + 0.02);
  },

  /**
   * One step of a strumming pattern (see rhythm.js for the symbols).
   * st carries state between steps (which treble string to pick next).
   */
  stroke(sym, frets, tuning, when, st, fast) {
    if (!this.enabled || sym === '-') return;
    const ss = frets.map((f, i) => i).filter(i => frets[i] >= 0);
    if (!ss.length) return;
    const one = (k, vel) => { const s = ss[Math.min(k, ss.length - 1)]; this.pluck(tuning[s] + frets[s], when, s, vel); };
    const strum = fast ? 'fast' : 'strum';
    switch (sym) {
      case 'D': this.chord(frets, tuning, when, strum, 1); break;
      case 'd': this.chord(frets, tuning, when, strum, 0.72); break;
      case 'U': this.chord(frets, tuning, when, 'up', 0.95); break;
      case 'u': this.chord(frets, tuning, when, 'up', 0.62); break;
      case 'S': this.chord(frets, tuning, when, 'fast', 1); this.damp(when + 0.11); break;
      case 'x':
        this.chord(frets, tuning, when, 'fast', 0.18); this.damp(when + 0.03);
        this.scratch(when, 0.9); break;
      case 'M': case 'm': {
        const low = ss.slice(0, 3), vel = sym === 'M' ? 0.95 : 0.7;
        low.forEach((s, k) => this.pluck(tuning[s] + frets[s], when + k * 0.006, s, vel));
        low.forEach(s => this.dampString(s, when + 0.1));
        this.scratch(when, 0.25, 700, 0.04);
        break;
      }
      case 'B': one(0, 0.95); break;
      case 'A': one(1, 0.85); break;
      case 'P': one(0, 0.95); one(ss.length - 1, 0.8); break;
      case 'p': st.t = (st.t || 0) ^ 1; one(ss.length - 1 - st.t, 0.7); break;
      default:
        if (sym >= '1' && sym <= '6') one(+sym - 1, 0.8);
    }
  },

  /** Synthesised drum kit: k kick, s snare, r rim, h closed hat, o open hat. */
  drum(lane, when, vel) {
    if (!this.enabled) return;
    const ctx = this.init();
    const env = (g, peak, decay) => {
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(peak, when + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, when + decay);
    };
    const noise = (type, freq, q, peak, decay) => {
      const src = ctx.createBufferSource(); src.buffer = this.noiseBuf;
      const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; if (q) f.Q.value = q;
      const g = ctx.createGain(); env(g, peak, decay);
      src.connect(f); f.connect(g); g.connect(this.drums);
      src.start(when, Math.random() * 0.5); src.stop(when + decay + 0.02);
    };
    const osc = (type, f0, f1, peak, decay) => {
      const o = ctx.createOscillator(); o.type = type;
      o.frequency.setValueAtTime(f0, when);
      if (f1) o.frequency.exponentialRampToValueAtTime(f1, when + decay * 0.4);
      const g = ctx.createGain(); env(g, peak, decay);
      o.connect(g); g.connect(this.drums);
      o.start(when); o.stop(when + decay + 0.02);
    };
    switch (lane) {
      case 'k': osc('sine', 150, 42, 1.0 * vel, 0.38); osc('triangle', 600, 120, 0.25 * vel, 0.03); break;
      case 's': noise('highpass', 1100, 0, 0.55 * vel, 0.17); osc('triangle', 210, 160, 0.35 * vel, 0.09); break;
      case 'r': osc('square', 1650, 0, 0.12 * vel, 0.035); noise('bandpass', 2600, 4, 0.35 * vel, 0.04); break;
      case 'h': noise('highpass', 7500, 0, 0.22 * vel, 0.045); break;
      case 'o': noise('highpass', 6500, 0, 0.2 * vel, 0.3); break;
    }
  },

  damp(when) {
    this.voices.forEach(v => { if (v) { v.g.gain.cancelScheduledValues(when); v.g.gain.setTargetAtTime(0, when, 0.02); } });
  },

  click(when, accent) {
    if (!this.enabled) return;
    const ctx = this.init();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = accent ? 1760 : 1175;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(accent ? 0.9 : 0.55, when + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.06);
    o.connect(g); g.connect(this.out);
    o.start(when); o.stop(when + 0.08);
  },

  /** Metronome tick: level 3 accent, 2 normal, 1 soft (subdivision). */
  tick(when, level, barStart) {
    if (!this.enabled) return;
    const ctx = this.init();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = level === 3 ? (barStart ? 1760 : 1480) : level === 2 ? 1175 : 880;
    const peak = level === 3 ? 0.9 : level === 2 ? 0.55 : 0.22;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(peak, when + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, when + (level === 1 ? 0.035 : 0.06));
    o.connect(g); g.connect(this.out);
    o.start(when); o.stop(when + 0.08);
  },

  /** Steady reference tone for the pitch pipe. Returns a stop() function. */
  tone(freq) {
    const ctx = this.init();
    const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    o2.type = 'triangle'; o2.frequency.value = freq * 2;
    const g2 = ctx.createGain(); g2.gain.value = 0.18;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.05);
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(this.out);
    o.start(); o2.start();
    return () => {
      const t = ctx.currentTime;
      g.gain.cancelScheduledValues(t);
      g.gain.setTargetAtTime(0.0001, t, 0.03);
      o.stop(t + 0.2); o2.stop(t + 0.2);
    };
  },
};

/** Look-ahead clock: calls onBeat(n, time) slightly before each beat is due. */
class BeatClock {
  constructor(onBeat) { this.onBeat = onBeat; this.timer = null; this.bpm = 100; }
  start(bpm) {
    this.stop();
    this.bpm = bpm;
    const ctx = Snd.init();
    this.n = 0;
    this.next = ctx.currentTime + 0.08;
    this.timer = setInterval(() => this.tick(), 25);
    this.tick();
  }
  setBpm(b) { this.bpm = b; }
  get running() { return !!this.timer; }
  tick() {
    const ctx = Snd.ctx;
    while (this.next < ctx.currentTime + 0.12) {
      this.onBeat(this.n, this.next);
      this.n++;
      this.next += 60 / this.bpm;
    }
  }
  stop() { if (this.timer) clearInterval(this.timer); this.timer = null; }
}
/** Run fn at audio time `when` (for keeping the screen in step with the sound). */
function atTime(when, fn) {
  const ms = Math.max(0, (when - Snd.ctx.currentTime) * 1000);
  return setTimeout(fn, ms);
}

/* ---------- tuner ---------- */
/** Small in-place radix-2 FFT with cached tables and work buffers. */
const FFT = {
  n: 0,
  size(n) {
    let N = 1;
    while (N < n) N <<= 1;
    if (N !== this.n) {
      this.n = N;
      this.re = new Float64Array(N); this.im = new Float64Array(N);
      this.ps = new Float64Array(N + 1);
      this.rev = new Uint32Array(N);
      const bits = Math.log2(N);
      for (let i = 0; i < N; i++) {
        let r = 0;
        for (let b = 0; b < bits; b++) r |= ((i >> b) & 1) << (bits - 1 - b);
        this.rev[i] = r;
      }
      this.cos = new Float64Array(N / 2); this.sin = new Float64Array(N / 2);
      for (let i = 0; i < N / 2; i++) { this.cos[i] = Math.cos(2 * Math.PI * i / N); this.sin[i] = -Math.sin(2 * Math.PI * i / N); }
    }
    return N;
  },
  run(re, im) {
    const N = this.n, rev = this.rev;
    for (let i = 0; i < N; i++) {
      const j = rev[i];
      if (j > i) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
    }
    for (let len = 2; len <= N; len <<= 1) {
      const half = len >> 1, step = N / len;
      for (let i = 0; i < N; i += len) {
        for (let j = 0, k = 0; j < half; j++, k += step) {
          const wr = this.cos[k], wi = this.sin[k];
          const a = i + j, b = a + half;
          const xr = re[b] * wr - im[b] * wi, xi = re[b] * wi + im[b] * wr;
          re[b] = re[a] - xr; im[b] = im[a] - xi;
          re[a] += xr; im[a] += xi;
        }
      }
    }
  },
};

const Pitch = {
  stream: null, src: null, an: null, buf: null, raf: 0, onResult: null,

  async start(onResult, deviceId) {
    this.onResult = onResult;
    const ctx = Snd.init();
    const audio = { echoCancellation: false, noiseSuppression: false, autoGainControl: false };
    if (deviceId) audio.deviceId = { exact: deviceId };
    try { this.stream = await navigator.mediaDevices.getUserMedia({ audio }); }
    catch (e) { if (!deviceId) throw e; delete audio.deviceId; this.stream = await navigator.mediaDevices.getUserMedia({ audio }); }
    this.src = ctx.createMediaStreamSource(this.stream);
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 22;
    this.an = ctx.createAnalyser();
    this.src.connect(hp); hp.connect(this.an);
    this.configure(this.minFreq);
    const loop = () => { this.raf = requestAnimationFrame(loop); this.frame(); };
    loop();
  },
  minFreq: 45,
  /** Lowest pitch to listen for. Low instruments (bass) get a longer window: it must hold a few periods. */
  configure(minFreq) {
    this.minFreq = Math.max(24, minFreq);
    if (!this.an) return;
    const sr = Snd.ctx.sampleRate;
    const size = sr / this.minFreq > 1300 ? 16384 : sr / this.minFreq > 900 ? 8192 : 4096;
    if (this.an.fftSize !== size) this.an.fftSize = size;
    this.buf = new Float32Array(this.an.fftSize);
    this.nsdf = new Float32Array(Math.ceil(sr / this.minFreq) + 4);
  },
  stop() {
    cancelAnimationFrame(this.raf);
    if (this.src) this.src.disconnect();
    if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    this.stream = this.src = this.an = null;
  },
  get running() { return !!this.stream; },

  frame() {
    const an = this.an; if (!an) return;
    this.frameN = (this.frameN || 0) + 1;
    if (an.fftSize >= 16384 && this.frameN % 2) return;      // very low notes: every other frame is plenty
    an.getFloatTimeDomainData(this.buf);
    const sr = Snd.ctx.sampleRate;
    const r = Pitch.detect(this.buf, sr, this.nsdf, this.minFreq);
    this.onResult && this.onResult(r);
  },

  gate: 0.006,              // RMS level below which we treat the input as silence

  /**
   * McLeod pitch method (normalised square difference function). The autocorrelation is computed
   * with an FFT and the energy term with prefix sums, so a frame costs O(n log n) instead of O(n²).
   * Returns {freq, clarity, db} or just {db} when there is no clear pitch.
   */
  detect(x, sr, nsdf, minFreq = 45) {
    const n = x.length;
    let sum = 0;
    for (let i = 0; i < n; i++) sum += x[i] * x[i];
    const rms = Math.sqrt(sum / n);
    const db = 20 * Math.log10(rms + 1e-9);
    if (rms < Pitch.gate) return { db };
    const N = FFT.size(2 * n);
    const re = FFT.re, im = FFT.im;
    re.fill(0); im.fill(0);
    for (let i = 0; i < n; i++) re[i] = x[i];
    FFT.run(re, im);
    for (let i = 0; i < N; i++) { re[i] = re[i] * re[i] + im[i] * im[i]; im[i] = 0; }
    FFT.run(re, im);                                   // power spectrum is real & even → forward FFT = N·autocorrelation
    const ps = FFT.ps;
    ps[0] = 0;
    for (let i = 0; i < n; i++) ps[i + 1] = ps[i] + x[i] * x[i];
    const minLag = Math.floor(sr / 1500), maxLag = Math.min(Math.floor(sr / minFreq), n >> 1);
    for (let tau = minLag; tau <= maxLag + 1; tau++) {
      const m = ps[n - tau] + (ps[n] - ps[tau]);
      nsdf[tau] = m > 0 ? 2 * (re[tau] / N) / m : 0;
    }
    // highest peak between each positive-going and negative-going zero crossing
    const peaks = [];
    let tau = minLag;
    while (tau < maxLag && nsdf[tau] > 0) tau++;        // skip the zero-lag lobe
    let best = -1, bestV = -1;
    for (; tau < maxLag; tau++) {
      if (nsdf[tau] > 0) {
        if (nsdf[tau] > bestV) { bestV = nsdf[tau]; best = tau; }
      } else if (best >= 0) { peaks.push(best); best = -1; bestV = -1; }
    }
    if (best >= 0) peaks.push(best);
    if (!peaks.length) return { db };
    let top = 0;
    for (const p of peaks) if (nsdf[p] > top) top = nsdf[p];
    const k = peaks.find(p => nsdf[p] >= 0.9 * top);
    if (nsdf[k] < 0.65) return { db };
    const a = nsdf[k - 1], b = nsdf[k], c = nsdf[k + 1];
    const den = a - 2 * b + c;
    const shift = den ? 0.5 * (a - c) / den : 0;
    return { freq: sr / (k + shift), clarity: b, db };
  },
};

if (typeof module !== 'undefined') module.exports = { Pitch };
