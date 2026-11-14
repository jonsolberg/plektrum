/*
 * Plektrum – audio: plucked-string synthesis (Karplus–Strong), clicks, a look-ahead
 * beat clock, the pitch pipe and the tuner's pitch detector.
 * Copyright (C) 2026 Jon Solberg — GNU GPL v3 or later.
 */
'use strict';

const Snd = {
  ctx: null, out: null, volume: 0.8, enabled: true,
  bufs: new Map(), voices: [null, null, null, null, null, null],

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
    }
    this.out.gain.value = this.volume;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },
  now() { return this.init().currentTime; },

  /** Karplus–Strong string with a fractional delay so high notes stay in tune. */
  buffer(midi) {
    if (this.bufs.has(midi)) return this.bufs.get(midi);
    const ctx = this.ctx, sr = ctx.sampleRate;
    const f = 440 * Math.pow(2, (midi - 69) / 12);
    const D = sr / f - 0.5, N = Math.floor(D), fr = D - N;
    const t60 = Math.max(1.2, 4.2 - (midi - 40) * 0.07);
    const rho = Math.pow(0.001, 1 / (f * t60));
    const len = Math.floor(sr * Math.min(4, t60 + 0.3));
    const b = ctx.createBuffer(1, len, sr), d = b.getChannelData(0);
    let lp = 0;
    const pick = Math.max(1, Math.round(N * 0.18));        // pluck position comb → less "plinky"
    const ex = new Float32Array(N + 2);
    for (let i = 0; i < N + 2; i++) { lp += 0.55 * ((Math.random() * 2 - 1) - lp); ex[i] = lp; }
    for (let i = 0; i < N + 2 && i < len; i++) d[i] = 0.9 * (ex[i] - (i >= pick ? ex[i - pick] * 0.5 : 0));
    for (let i = N + 2; i < len; i++) {
      const r1 = d[i - N] * (1 - fr) + d[i - N - 1] * fr;
      const r2 = d[i - N - 1] * (1 - fr) + d[i - N - 2] * fr;
      d[i] = rho * 0.5 * (r1 + r2);
    }
    const fade = Math.floor(sr * 0.25);
    for (let i = 0; i < fade; i++) d[len - 1 - i] *= i / fade;
    this.bufs.set(midi, b);
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
    const src = ctx.createBufferSource();
    src.buffer = this.buffer(midi);
    const g = ctx.createGain();
    g.gain.value = 0.42 * vel;
    src.connect(g); g.connect(this.out);
    src.start(when);
    const voice = { src, g };
    if (string >= 0) { this.voices[string] = voice; src.onended = () => { if (this.voices[string] === voice) this.voices[string] = null; }; }
  },

  /** frets[6] (-1 muted). style: 'strum' | 'arp' | 'up' */
  chord(frets, tuning, when, style = 'strum', vel = 1) {
    this.init();
    when = Math.max(when || 0, this.ctx.currentTime + 0.01);
    let idx = [0, 1, 2, 3, 4, 5].filter(i => frets[i] >= 0);
    if (style === 'up') idx.reverse();
    const gap = style === 'arp' ? 0.16 : 0.022;
    idx.forEach((s, k) => this.pluck(tuning[s] + frets[s], when + k * gap, s, vel * (style === 'up' ? 0.8 : 1)));
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
const Pitch = {
  stream: null, src: null, an: null, buf: null, raf: 0, onResult: null,

  async start(onResult) {
    this.onResult = onResult;
    const ctx = Snd.init();
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    });
    this.src = ctx.createMediaStreamSource(this.stream);
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 45;
    this.an = ctx.createAnalyser();
    this.an.fftSize = 4096;
    this.src.connect(hp); hp.connect(this.an);
    this.buf = new Float32Array(this.an.fftSize);
    this.nsdf = new Float32Array(Math.ceil(ctx.sampleRate / 50) + 2);
    const loop = () => { this.raf = requestAnimationFrame(loop); this.frame(); };
    loop();
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
    an.getFloatTimeDomainData(this.buf);
    const sr = Snd.ctx.sampleRate;
    const r = Pitch.detect(this.buf, sr, this.nsdf);
    this.onResult && this.onResult(r);
  },

  /** McLeod pitch method (normalised square difference). Returns {freq, clarity, db} or {db}. */
  detect(x, sr, nsdf) {
    const n = x.length;
    let sum = 0;
    for (let i = 0; i < n; i++) sum += x[i] * x[i];
    const rms = Math.sqrt(sum / n);
    const db = 20 * Math.log10(rms + 1e-9);
    if (rms < 0.006) return { db };
    const minLag = Math.floor(sr / 1500), maxLag = Math.min(Math.floor(sr / 50), n >> 1);
    for (let tau = minLag; tau <= maxLag; tau++) {
      let acf = 0, m = 0;
      const lim = n - tau;
      for (let i = 0; i < lim; i++) { const a = x[i], b = x[i + tau]; acf += a * b; m += a * a + b * b; }
      nsdf[tau] = m > 0 ? 2 * acf / m : 0;
    }
    // collect the highest peak between each positive-going and negative-going zero crossing
    let peaks = [], tau = minLag;
    while (tau < maxLag && nsdf[tau] > 0) tau++;          // skip the zero-lag lobe
    let best = -1, bestV = -1;
    for (; tau < maxLag; tau++) {
      if (nsdf[tau] > 0) {
        if (nsdf[tau] > bestV) { bestV = nsdf[tau]; best = tau; }
      } else if (best >= 0) { peaks.push(best); best = -1; bestV = -1; }
    }
    if (best >= 0) peaks.push(best);
    if (!peaks.length) return { db };
    const top = Math.max(...peaks.map(p => nsdf[p]));
    const k = peaks.find(p => nsdf[p] >= 0.9 * top);
    if (nsdf[k] < 0.6) return { db };
    const a = nsdf[k - 1], b = nsdf[k], c = nsdf[k + 1];
    const den = a - 2 * b + c;
    const shift = den ? 0.5 * (a - c) / den : 0;
    return { freq: sr / (k + shift), clarity: b, db };
  },
};

if (typeof module !== 'undefined') module.exports = { Pitch };
