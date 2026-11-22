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
const VERSION = '1.35';
const REPO = 'https://github.com/jonsolberg/plektrum';
const KOFI = 'https://ko-fi.com/jonsolberg';

const store = {
  get(k, d) { try { const v = localStorage.getItem('plektrum.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('plektrum.' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
};
const S = Object.assign({
  lang: 'auto', theme: 'auto', lefty: false, names: false, hNotation: false, style: 'strum', volume: 0.8, sound: true,
  a4: 440, temp: 'equal', tempRoot: 0, tuning: 'std', custom: [40, 45, 50, 55, 59, 64], tunerMode: 'guitar', tunerView: 'needle', tunerSens: 0.52, instrument: 'guitar', customs: {}, tunerHist: false, tunerInput: '', chordInst: 'guitar', quizInst: 'guitar', chordTun: {}, showTuning: true, dotLabel: 'finger',
  tab: 'chords',
}, store.get('settings', {}));
const saveS = () => store.set('settings', S);
if (S.custom && !S.customs.guitar) { S.customs.guitar = S.custom; }   // custom tuning from version 1.0–1.4

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
    rootL: 'Root', noteL: 'Scale note', steps: 'Steps', scaleChords: 'Chords in the scale', triads: 'Triads', sevenths: '7th chords', fretlessNote: 'Fretless – lines mark semitones', blueL: 'Blue note', frets: 'frets {a}–{b}', playScale: 'Play scale',
    startTuner: 'Start tuner', stopTuner: 'Stop', tuning: 'Tuning', calib: 'Calibration A4', temperament: 'Temperament',
    tempRoot: 'Temperament key', pipe: 'Pitch pipe', pipeDesc: 'Tap a string to hear its note', mode: 'Mode', guitar: 'Guitar', chromatic: 'Chromatic',
    listen: 'Play a string', micDenied: 'The tuner needs the microphone. Allow it in Android settings.',
    lockHint: 'Tap a string to tune only that one. Tap again for automatic.', customT: 'Custom tuning', inTune: 'In tune',
    instrument: 'Instrument', histOpt: 'Show pitch history', histOptD: 'A graph of the last seconds – handy for vibrato and notes that drift', needle: 'Needle', strobe: 'Strobe', strobeWheel: 'Strobe wheel', strobeBands: 'Strobe bands', tapStart: 'Press Start and play a string', tuneUp: 'Tune up', tuneDown: 'Tune down',
    semisLow: '{n} semitone(s) low – tune up', semisHigh: '{n} semitone(s) high – tune down',
    sens: 'Sensitivity', sensD: 'Raise it for quiet acoustics, lower it in noisy rooms',
    grouping: 'Grouping', subdiv: 'Subdivision', swingD: 'Plays the off-beats late, like a shuffle', accentPat: 'Accent pattern',
    customPat: 'Custom', resetAcc: 'Reset accents', stepHint: 'Tap a step: normal → accent → soft → silent',
    listenT: 'Listen', listenDesc: 'Play a song to the phone – get its chords, bass line or melody', lExp: 'Experimental',
    lModeChords: 'Chords', lModeBass: 'Bass line', lModeMelody: 'Melody / solo', lStart: 'Start listening', lStop: 'Stop', lClear: 'Clear',
    lWaiting: 'Play some music near the phone…', lQuiet: 'Too quiet – turn it up or move closer', lsKey: 'Key', lKeyGuess: 'probably',
    lTimeline: 'Heard so far', lToProg: 'Open in Progressions', lSent: 'Sent to Progressions', lNotes: 'Notes heard', lFits: 'Fits',
    lShowScale: 'Show scale', lPlayBack: 'Play back', lNone: 'Nothing yet',
    lExpNote: 'Experimental: this guesses by listening to the whole sound, so it gets confused by loud vocals, drums and dense mixes. Use it as a starting point and check by ear. Everything stays on the phone – nothing is recorded or sent anywhere.',
    lTipChords: 'Works best with one guitar or piano, or a song where the chords are clear. Hold the phone near the speaker.',
    lTipBass: 'Listens to the lowest note. Works best when the bass is clear, or when you play the line yourself.',
    lTipMelody: 'Listens for one note at a time – a solo, a sung melody or a riff. Works best when that part is the loudest.',
    lMicDenied: 'Plektrum needs the microphone to listen.',
    lCable: 'Works best with a cable: plug the instrument (or the music player) into the phone through a USB-C audio interface or a guitar adapter cable instead of using the microphone. The line above shows which input is used – choose another under Tuner → Input.',
    learn: 'Music theory', learnDesc: 'Short lessons with examples you can play', lessonsN: '{n} lessons', lessonN: 'Lesson {n} of {of}', inListening: 'Listening to', inBuiltin: 'phone microphone', inUsb: 'USB input', inHeadset: 'headset / cable input', inBt: 'Bluetooth headset', inOther: 'external input', inDefault: 'default input', inNotUsed: '{d} is connected but not being used – choose it under Input below, or unplug and plug it in again with the tuner running.', inAuto: 'Automatic', inLabel: 'Input', inLabelD: 'Phone microphone or a cable (USB-C adapter)', inN: 'Input {n}', inSaved: 'Saved choice (not connected)', inNoMatch: 'This input could not be selected directly – Android uses a connected cable automatically.', lTry: 'Try it', lKey: 'Remember', lPiano: 'On the piano', lGuitar: 'On the guitar neck', lPrintAll: 'Save all lessons as PDF', lPrintOne: 'PDF', lPdfBusy: 'Creating PDF…', lPdfDone: 'Saved to Downloads: {f}', lPdfFail: 'Could not save the PDF – opening the print screen instead', lPdfTitle: 'Music theory', lPdfSub: '{n} lessons for string players – one a week for a year, from tuning your guitar to writing your own songs', lPdfToc: 'Contents', lPdfHint: 'Every example can be played in the app: Practice → Music theory.', lPdfIntro: 'Music theory explained for guitarists and other string players – one idea at a time, with examples on the piano and the guitar neck, a short exercise and a summary in every lesson. No previous knowledge needed.', lPdfFoot: 'a toolbox for string players',
    metroDesc: 'Time signatures, subdivisions, accents', qWhichNote: 'Which note is marked?', qFindNote: 'Find {n} on string {k} ({s})',
    qDegree: 'What is the {d} of {k} major?', qScaleIs: '{k} major: {s}', qSig: 'How many sharps or flats in {k} major?',
    qRel: 'What is the relative minor of {k} major?', qRelEx: 'The relative minor starts on the 6th note of the major scale.',
    qDia: 'Which chord is {n} in {k} major?', qTones: 'Which notes make up {c}?', qMode: 'Play the major scale from its {o} note. Which mode is that?',
    qModeEx: 'In {k} major: from {n} you get {m}.', qSteps: 'Which scale has these steps?', qStepsEx: 'W = whole step, H = half step, W½ = three semitones.',
    qInterval: 'Which interval is {a} up to {b}?', qSemis: '{n} semitones', qSemi1: '1 semitone', qListen: 'Listen – which interval?', qListenChord: 'Listen – which kind of chord?',
    together: 'Together', strummed: 'Strummed', fretWord: 'fret',
    metronome: 'Metronome', perBar: 'Beats per bar', tap: 'Tap', start: 'Start', challenge: 'Chord challenge',
    challengeDesc: 'Ten chord diagrams – name each one.', go: 'Start', which: 'Which chord is this?', next: 'Next',
    right: 'Right!', wrongIs: 'That was {c}', result: '{s} of 10', best: 'Best: {b} of 10', again: 'Play again', hear: 'Hear it',
    showTun: 'Show string tuning', showTunD: 'Note names of the open strings above the chord chart',
    settings: 'Settings', setDisplay: 'Display', soundOn: 'Play sounds', language: 'Language', auto: 'Automatic', theme: 'Theme', light: 'Light', dark: 'Dark',
    lefty: 'Left-handed', leftyD: 'Mirror diagrams and fretboards', namesS: 'Note names on diagrams',
    hNot: 'Swedish note names', hNotD: 'B is called H, B♭ is called B', playStyle: 'Tapping a chord chart plays', sound: 'Sound', volume: 'Volume',
    about: 'About', aboutT: 'A toolbox for string players: chords for guitar, ukulele, mandolin, banjo and bass, a tuner for fifteen instruments, chord progressions with strumming and drum backing, the circle of fifths, scales and a metronome. Works fully offline.',
    license: 'Free software under the GNU GPL v3.', source: 'Source code',
    beerT: 'Plektrum is free and has no ads. If it helps your playing, you can support me.', beer: 'Support me on Ko-fi',
  },
  sv: {
    chords: 'Ackord', studio: 'Studio', circle: 'Kvintcirkel', scales: 'Skalor', tuner: 'Stämapparat', practice: 'Öva',
    search: 'Sök ackord – Am7, C/G, F♯m7♭5 …', searchL: 'Sök', searchShort: 'Sök ackord', favourites: 'Favoriter', noFavs: 'Tryck på ☆ vid ett ackord för att spara det här.',
    root: 'Grundton', type: 'Typ', bass: 'Baston', none: 'ingen', strum: 'Slag', arp: 'Arpeggio',
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
    rootL: 'Grundton', noteL: 'Skalton', steps: 'Steg', scaleChords: 'Ackord i skalan', triads: 'Treklanger', sevenths: 'Fyrklanger', fretlessNote: 'Bandlöst – linjerna visar halvtoner', blueL: 'Blue note', frets: 'band {a}–{b}', playScale: 'Spela skalan',
    startTuner: 'Starta stämapparaten', stopTuner: 'Stopp', tuning: 'Stämning', calib: 'Kalibrering A4', temperament: 'Temperatur',
    tempRoot: 'Temperaturens tonart', pipe: 'Stämpipa', pipeDesc: 'Tryck på en sträng för att höra tonen', mode: 'Läge', guitar: 'Gitarr', chromatic: 'Kromatisk',
    listen: 'Spela på en sträng', micDenied: 'Stämapparaten behöver mikrofonen. Tillåt den i Androids inställningar.',
    lockHint: 'Tryck på en sträng för att bara stämma den. Tryck igen för automatiskt.', customT: 'Egen stämning', inTune: 'Stämd',
    instrument: 'Instrument', histOpt: 'Visa tonhöjdshistorik', histOptD: 'En graf över de senaste sekunderna – bra för vibrato och toner som glider', needle: 'Visare', strobe: 'Stroboskop', strobeWheel: 'Strobohjul', strobeBands: 'Strobeband', tapStart: 'Tryck på Starta och spela en sträng', tuneUp: 'Stäm upp', tuneDown: 'Stäm ner',
    semisLow: '{n} halvton(er) för lågt – stäm upp', semisHigh: '{n} halvton(er) för högt – stäm ner',
    sens: 'Känslighet', sensD: 'Höj för tysta akustiska gitarrer, sänk i stökiga rum',
    grouping: 'Gruppering', subdiv: 'Underdelning', swingD: 'Spelar offbeat-slagen sent, som shuffle', accentPat: 'Betoningsmönster',
    customPat: 'Eget', resetAcc: 'Återställ betoningar', stepHint: 'Tryck på ett steg: normal → betonad → svag → tyst',
    listenT: 'Lyssna', listenDesc: 'Spela en låt för telefonen – få ackorden, baslinjen eller melodin', lExp: 'Experimentell',
    lModeChords: 'Ackord', lModeBass: 'Baslinje', lModeMelody: 'Melodi / solo', lStart: 'Börja lyssna', lStop: 'Stoppa', lClear: 'Rensa',
    lWaiting: 'Spela musik nära telefonen…', lQuiet: 'För tyst – höj ljudet eller gå närmare', lsKey: 'Tonart', lKeyGuess: 'troligen',
    lTimeline: 'Hört hittills', lToProg: 'Öppna i Ackordföljder', lSent: 'Skickat till Ackordföljder', lNotes: 'Hörda toner', lFits: 'Passar',
    lShowScale: 'Visa skalan', lPlayBack: 'Spela upp', lNone: 'Inget än',
    lExpNote: 'Experimentell: den gissar genom att lyssna på hela ljudet, så den blir förvirrad av starka sångröster, trummor och täta mixar. Se det som en startpunkt och kontrollera med örat. Allt stannar i telefonen – inget spelas in eller skickas någonstans.',
    lTipChords: 'Fungerar bäst med en gitarr eller ett piano, eller en låt där ackorden hörs tydligt. Håll telefonen nära högtalaren.',
    lTipBass: 'Lyssnar på den lägsta tonen. Fungerar bäst när basen hörs tydligt, eller när du spelar linjen själv.',
    lTipMelody: 'Lyssnar efter en ton i taget – ett solo, en sjungen melodi eller ett riff. Fungerar bäst när den stämman hörs mest.',
    lMicDenied: 'Plektrum behöver mikrofonen för att kunna lyssna.',
    lCable: 'Fungerar bäst med kabel: koppla instrumentet (eller musikspelaren) till telefonen via ett USB-C-ljudkort eller en gitarradapterkabel i stället för att använda mikrofonen. Raden ovan visar vilken ingång som används – välj en annan under Stämapparat → Ingång.',
    learn: 'Musikteori', learnDesc: 'Korta lektioner med exempel du kan spela', lessonsN: '{n} lektioner', lessonN: 'Lektion {n} av {of}', inListening: 'Lyssnar på', inBuiltin: 'telefonens mikrofon', inUsb: 'USB-ingång', inHeadset: 'headset-/kabelingång', inBt: 'Bluetooth-headset', inOther: 'extern ingång', inDefault: 'standardingång', inNotUsed: '{d} är ansluten men används inte – välj den under Ingång nedan, eller dra ur och sätt i den igen medan stämapparaten är igång.', inAuto: 'Automatisk', inLabel: 'Ingång', inLabelD: 'Telefonens mikrofon eller en kabel (USB-C-adapter)', inN: 'Ingång {n}', inSaved: 'Sparat val (inte anslutet)', inNoMatch: 'Den här ingången kunde inte väljas direkt – Android använder en ansluten kabel automatiskt.', lTry: 'Prova', lKey: 'Kom ihåg', lPiano: 'På pianot', lGuitar: 'På gitarrhalsen', lPrintAll: 'Spara alla lektioner som PDF', lPrintOne: 'PDF', lPdfBusy: 'Skapar PDF…', lPdfDone: 'Sparad i Nedladdningar: {f}', lPdfFail: 'Kunde inte spara PDF:en – öppnar utskrift i stället', lPdfTitle: 'Musikteori', lPdfSub: '{n} lektioner för stränginstrument – en i veckan i ett år, från att stämma gitarren till att skriva egna låtar', lPdfToc: 'Innehåll', lPdfHint: 'Alla exempel kan spelas i appen: Öva → Musikteori.', lPdfIntro: 'Musikteori förklarad för gitarrister och andra som spelar stränginstrument – en sak i taget, med exempel på pianot och gitarrhalsen, en kort övning och en sammanfattning i varje lektion. Inga förkunskaper behövs.', lPdfFoot: 'en verktygslåda för stränginstrument',
    metroDesc: 'Taktarter, underdelningar, betoningar', qWhichNote: 'Vilken ton är markerad?', qFindNote: 'Hitta {n} på sträng {k} ({s})',
    qDegree: 'Vilken ton är {d} i {k}-dur?', qScaleIs: '{k}-dur: {s}', qSig: 'Hur många förtecken har {k}-dur?',
    qRel: 'Vilken är parallelltonarten i moll till {k}-dur?', qRelEx: 'Parallelltonarten i moll börjar på durskalans sjätte ton.',
    qDia: 'Vilket ackord är {n} i {k}-dur?', qTones: 'Vilka toner ingår i {c}?', qMode: 'Spela durskalan från dess {o} ton. Vilket modus blir det?',
    qModeEx: 'I {k}-dur: från {n} får du {m}.', qSteps: 'Vilken skala har de här stegen?', qStepsEx: 'W = helt tonsteg, H = halvt tonsteg, W½ = tre halvtoner.',
    qInterval: 'Vilket intervall är {a} upp till {b}?', qSemis: '{n} halvtoner', qSemi1: '1 halvton', qListen: 'Lyssna – vilket intervall?', qListenChord: 'Lyssna – vilken sorts ackord?',
    together: 'Samtidigt', strummed: 'Slag', fretWord: 'band',
    metronome: 'Metronom', perBar: 'Slag per takt', tap: 'Knacka', start: 'Starta', challenge: 'Ackordutmaning',
    challengeDesc: 'Tio ackorddiagram – namnge vart och ett.', go: 'Börja', which: 'Vilket ackord är det här?', next: 'Nästa',
    right: 'Rätt!', wrongIs: 'Det var {c}', result: '{s} av 10', best: 'Bäst: {b} av 10', again: 'Spela igen', hear: 'Lyssna',
    showTun: 'Visa strängarnas stämning', showTunD: 'De lösa strängarnas tonnamn ovanför ackorddiagrammet',
    nav_tuner: 'Stämma', nav_circle: 'Kvintcirkel', settings: 'Inställningar', setDisplay: 'Visning', soundOn: 'Spela upp ljud', language: 'Språk', auto: 'Automatiskt', theme: 'Tema', light: 'Ljust', dark: 'Mörkt',
    lefty: 'Vänsterhänt', leftyD: 'Spegelvänd diagram och greppbräda', namesS: 'Tonnamn i diagrammen',
    hNot: 'Svenska tonnamn', hNotD: 'B heter H, B♭ heter B', playStyle: 'Ett tryck på ackorddiagrammet spelar', sound: 'Ljud', volume: 'Volym',
    about: 'Om', aboutT: 'En verktygslåda för dig som spelar stränginstrument: ackord för gitarr, ukulele, mandolin, banjo och elbas, stämapparat för femton instrument, ackordföljder med komp och trummor, kvintcirkeln, skalor och metronom. Fungerar helt utan nätverk.',
    license: 'Fri programvara under GNU GPL v3.', source: 'Källkod',
    beerT: 'Plektrum är gratis och reklamfri. Om den hjälper ditt spelande får du gärna stödja mig.', beer: 'Stöd mig via Ko-fi',
  },
};
const lang = () => S.lang !== 'auto' ? S.lang : ((navigator.language || 'en').toLowerCase().startsWith('sv') ? 'sv' : 'en');
function t(k, vars) {
  let s = (STR[lang()] && STR[lang()][k]) || STR.en[k] || k;
  if (vars) for (const v in vars) s = s.replace('{' + v + '}', vars[v]);
  return s;
}
/** Lesson texts mark note names that differ between notations as {B|H}: the first for international names, the second for Swedish/German. */
const NB = s => typeof s === 'string' && s.indexOf('|') >= 0 ? s.replace(/\{([^{}|]*)\|([^{}|]*)\}/g, (m, b, h) => Theory.hNotation ? h : b) : s;
const L = o => NB(o[lang()] || o.en);
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
  plug: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0z"/><path d="M12 17v5"/></svg>',
  print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.6" r="1.1" fill="currentColor" stroke="none"/></svg>',
  ear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 9.5H7l4.5-3.5v12L7 14.5H3.5z"/><path d="M15 9.2a4 4 0 0 1 0 5.6M17.8 6.6a7.6 7.6 0 0 1 0 10.8"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M9 8h7M9 11.5h5"/></svg>',
  note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17.5V5.5l10-2v12"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="15.5" r="2.5"/></svg>',
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
  const on = Studio.clock.running || Metro.clock.running || Pitch.running || CircleTab.clock.running || (typeof Listen !== 'undefined' && Listen.running);
  if (AND && AND.keepAwake) AND.keepAwake(on);
}
function seg(name, opts, cur) {
  return `<div class="seg" data-seg="${name}">${opts.map(([v, l]) => `<button data-a="seg" data-k="${name}" data-v="${v}" class="${String(v) === String(cur) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
}
function rootGrid(action, cur, extra = '') {
  return `<div class="grid12">${[...Array(12).keys()].map(pc => `<button class="chip ${pc === cur ? 'on' : ''}" data-a="${action}" data-v="${pc}" ${extra}>${nn(pc)}</button>`).join('')}</div>`;
}
/** the instrument the chord library is showing */
/** chord instrument with a tuning; id "guitar:openg" for anything but standard tuning */
function chordInstById(id) {
  const [bid, tid] = String(id || 'guitar').split(':');
  const base = CHORD_INSTS.find(x => x.id === bid) || CHORD_INSTS[0];
  const tu = (tid && base.tunings.find(x => x.id === tid)) || base.tunings[0];
  if (tu === base.tunings[0]) return base;
  return Object.assign({}, base, { id: base.id + ':' + tu.id, n: tu.n, tun: tu, bassLoose: base.guitarMutes });
}
const CI = () => chordInstById(S.chordInst + (S.chordTun[S.chordInst] ? ':' + S.chordTun[S.chordInst] : ''));
const instOf = c => (c && c.inst) ? chordInstById(c.inst) : CI();
const tuningOf = inst => inst.tun || (CHORD_INSTS.find(x => x.id === inst.id) || CHORD_INSTS[0]).tunings[0];
/** flash an element (an SVG dot) – restarts the animation if it is already running */
function blink(el) {
  if (!el) return;
  el.classList.remove('on');
  void el.getBoundingClientRect();
  el.classList.add('on');
}
/** chapters of the theory course (for the printed book) */
const LESSON_CHAPTERS = [
  { t: T2('Getting started', 'Kom igång'), ids: ['tuning', 'charts', 'firstchords', 'strumming'] },
  { t: T2('Notes and rhythm', 'Toner och rytm'), ids: ['notes', 'neck', 'rhythm', 'staff', 'notevalues', 'groove'] },
  { t: T2('Scales and keys', 'Skalor och tonarter'), ids: ['intervals', 'major', 'keys', 'minor'] },
  { t: T2('Chords', 'Ackord'), ids: ['triads', 'inversions', 'arpeggios', 'sevenths', 'power', 'barre'] },
  { t: T2('Harmony and songs', 'Harmonik och låtar'), ids: ['diatonic', 'minorkeys', 'cadences', 'secondary', 'borrowed', 'blues12', 'findkey', 'capo', 'songform', 'byear'] },
  { t: T2('Soloing', 'Solospel'), ids: ['pent', 'pentboxes', 'techniques', 'improv', 'modes'] },
  { t: T2('Further on the guitar', 'Vidare på gitarren'), ids: ['caged', 'triadsneck', 'shell', 'fingerpicking', 'tunings'] },
  { t: T2('Going further', 'Ett steg till'), ids: ['ear', 'readrhythm', 'oddtime', 'colour', 'dimaug', 'voicelead'] },
  { t: T2('Putting it all together', 'Allt tillsammans'), ids: ['numbers', 'changes', 'leadsheet', 'songwriting', 'practise', 'wrapup'] },
];
const chapterOf = id => LESSON_CHAPTERS.find(c => c.ids.includes(id));
const stripMd = x => esc(L(x)).replace(/\*([^*]+)\*/g, '$1');

/** cover artwork: a guitar neck with the five CAGED shapes of C, drawn in white */
function coverNeckSvg() {
  const fw = 34, sy = 18, top = 14, left = 30, F = 15;
  const shapes = [[[1, 3], [2, 2], [3, 0], [4, 1], [5, 0]], [[1, 3], [2, 5], [3, 5], [4, 5], [5, 3]], [[0, 8], [1, 7], [2, 5], [3, 5], [4, 5], [5, 8]],
    [[0, 8], [1, 10], [2, 10], [3, 9], [4, 8], [5, 8]], [[2, 10], [3, 12], [4, 13], [5, 12]]];
  const X = f => f === 0 ? left - 10 : left + (f - 0.5) * fw, Y = s => top + (5 - s) * sy;
  let g = `<svg viewBox="0 0 ${left + F * fw + 12} ${top * 2 + sy * 5}" xmlns="http://www.w3.org/2000/svg">`;
  for (let f = 0; f <= F; f++) g += `<line x1="${left + f * fw}" x2="${left + f * fw}" y1="${top - 6}" y2="${top + sy * 5 + 6}" stroke="#fff" stroke-opacity="${f ? 0.35 : 0.9}" stroke-width="${f ? 1.5 : 4}"/>`;
  for (let s = 0; s < 6; s++) g += `<line x1="${left - 18}" x2="${left + F * fw}" y1="${Y(s)}" y2="${Y(s)}" stroke="#fff" stroke-opacity=".55" stroke-width="${1 + (5 - s) * 0.25}"/>`;
  [3, 5, 7, 9, 15].forEach(f => { g += `<circle cx="${X(f)}" cy="${top + sy * 2.5}" r="3" fill="#fff" fill-opacity=".3"/>`; });
  g += `<circle cx="${X(12)}" cy="${top + sy * 1.5}" r="3" fill="#fff" fill-opacity=".3"/><circle cx="${X(12)}" cy="${top + sy * 3.5}" r="3" fill="#fff" fill-opacity=".3"/>`;
  const op = [1, 0.85, 0.7, 0.85, 1];
  shapes.forEach((sh, k) => sh.forEach(([s, f]) => {
    const root = (STD[s] + f) % 12 === 0;
    g += `<circle cx="${X(f)}" cy="${Y(s)}" r="7.5" fill="${root ? '#fff' : 'none'}" stroke="#fff" stroke-width="2" opacity="${op[k]}"/>`;
  }));
  ['C', 'A', 'G', 'E', 'D'].forEach((l, k) => { const fx = [1.5, 4, 6.5, 9, 11.5][k]; g += `<text x="${left + fx * fw}" y="${top + sy * 5 + 22}" font-size="13" font-weight="700" fill="#fff" fill-opacity=".85" text-anchor="middle" font-family="system-ui,sans-serif">${l}</text>`; });
  return g.replace(`viewBox="0 0 ${left + F * fw + 12} ${top * 2 + sy * 5}"`, `viewBox="0 0 ${left + F * fw + 12} ${top * 2 + sy * 5 + 16}"`) + '</svg>';
}

/** A4 print layout of the lessons (all, or one), for Android's print screen ("Save as PDF") */
function lessonsPrintDoc(only) {
  const keep = Practice.lesson, idx = only == null ? LESSONS.map((_, i) => i) : [only];
  const tmp = document.createElement('div');
  tmp.innerHTML = idx.map(i => { Practice.lesson = i; return `<div class="plesson" data-i="${i}">${Practice.lessonHtml()}</div>`; }).join('');
  Practice.lesson = keep;
  tmp.querySelectorAll('.lnav, .lgo, .pl, .lprint1, .lcount').forEach(e => e.remove());
  // "Hear it" does nothing on paper
  tmp.querySelectorAll('.lrow').forEach(e => { if (e.textContent.trim() === t('hear')) e.remove(); });
  tmp.querySelectorAll('button').forEach(b => { const d = document.createElement('div'); d.className = b.className; d.innerHTML = b.innerHTML; b.replaceWith(d); });
  tmp.querySelectorAll('.lon, .lplaying').forEach(e => e.classList.remove('lon', 'lplaying'));
  // our own lesson header: chapter, number badge, title, goal
  tmp.querySelectorAll('.plesson').forEach(sec => {
    const i = +sec.dataset.i, l = LESSONS[i], ch = chapterOf(l.id), card = sec.querySelector('.lesson');
    card.querySelectorAll(':scope > .lhead, :scope > h2, :scope > .lgoal').forEach(e => e.remove());
    const goal = l.blocks.find(x => x.goal);
    card.insertAdjacentHTML('afterbegin', `<div class="phead"><div class="pch">${ch ? esc(L(ch.t)) : ''}</div>
      <div class="ptitle"><span class="pnum">${i + 1}</span><h1>${esc(L(l.title))}</h1></div>${goal ? `<p class="pgoal">${stripMd(goal.goal)}</p>` : ''}</div>`);
  });
  const css = [...document.querySelectorAll('style')].map(x => x.textContent).join('\n');
  const n = LESSONS.length, book = only == null;
  const ttl = t('lPdfTitle');
  const cover = !book ? '' : `<div class="pcover">
      <div class="pcband">
        <div class="pmark">${document.querySelector('#title svg') ? document.querySelector('#title svg').outerHTML : ''}<span>Plektrum</span></div>
        <h1>${ttl}</h1><p class="psub">${t('lPdfSub', { n })}</p>
        <div class="pneck">${coverNeckSvg()}</div>
      </div>
      <div class="pcbody">
        <div class="pcintro"><p>${t('lPdfIntro')}</p><p class="phint">${t('lPdfHint')}</p></div>
        <ul class="pcinside">${LESSON_CHAPTERS.map(c => `<li><b>${esc(L(c.t))}</b><span>${c.ids.length}</span></li>`).join('')}</ul>
      </div>
      <div class="pcfoot">Plektrum ${VERSION} · ${t('lPdfFoot')}</div>
    </div>
    <div class="ptocpage"><h2>${t('lPdfToc')}</h2><div class="ptcols">${LESSON_CHAPTERS.map(c => `<div class="ptchap"><h3>${esc(L(c.t))}</h3>${c.ids.map(id => {
      const i = LESSONS.findIndex(l => l.id === id); if (i < 0) return ''; const l = LESSONS[i], g = l.blocks.find(x => x.goal);
      return `<div class="ptrow"><span class="pnum">${i + 1}</span><div><b>${esc(L(l.title))}</b>${g ? `<span>${stripMd(g.goal)}</span>` : ''}</div></div>`; }).join('')}</div>`).join('')}</div></div>`;
  const title = book ? `Plektrum – ${ttl}` : `Plektrum – ${L(LESSONS[only].title)}`;
  const A = '#0d6b61', R = '#c4552a';
  return { title, html: `<!DOCTYPE html><html lang="${lang()}"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${css}
@page{size:A4;margin:18mm 17mm 18mm;
  @bottom-left{content:"Plektrum · ${ttl}";font:8pt system-ui,sans-serif;color:#9a958a}
  @bottom-right{content:counter(page);font:8.5pt system-ui,sans-serif;color:#9a958a}}
${book ? '@page:first{margin:0;@bottom-left{content:none}@bottom-right{content:none}}' : ''}
html,body{background:#fff!important;color:#23292a;margin:0;padding:0!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;touch-action:auto}
body{font:10.5pt/1.55 "Noto Serif",Georgia,"Times New Roman",serif}
b,strong{color:#15191a}
.card{box-shadow:none!important;border:0!important;background:#fff!important;padding:0!important;margin:0!important;border-radius:0}
.plesson{break-before:page}
.pdoc>.plesson:first-child{break-before:${book ? 'page' : 'auto'}}
/* lesson header */
.phead{margin:0 0 6mm;padding-bottom:4mm;border-bottom:1.5px solid #e6dfd1}
.pch{font:600 8pt system-ui,sans-serif;letter-spacing:1.6px;text-transform:uppercase;color:${R};margin-bottom:2mm}
.ptitle{display:flex;align-items:center;gap:4mm}
.pnum{flex:none;width:11mm;height:11mm;border-radius:50%;background:${A};color:#fff!important;display:flex;align-items:center;justify-content:center;font:700 13pt/1 system-ui,sans-serif;text-align:center}
.ptitle h1{font:700 22pt/1.15 system-ui,sans-serif;margin:0;letter-spacing:-.3px;color:#15191a}
.pgoal{margin:3mm 0 0;padding-left:4mm;border-left:3px solid ${A};font-style:italic;color:#4d5553;font-size:11pt}
/* body */
.lesson .lp{font-size:10.5pt;line-height:1.6;margin:0 0 3mm;text-align:justify;hyphens:auto}
.lesson h3{font:700 12.5pt system-ui,sans-serif;color:${A};break-after:avoid;margin:6mm 0 2mm}
.lex,.ltry,.lkey,.lvis,.dchords{break-inside:avoid}
.lkey{break-before:avoid-page}
.lex{background:#fff;border:1px solid #e3dccd;border-radius:3mm;margin:3mm 0 4mm;padding:3mm 4mm}
.lex .lrow{padding:1.5mm 0;border-bottom:1px solid #eee7da}
.lex .lrow:last-child{border-bottom:0}
.lrow b{font:600 10pt system-ui,sans-serif}
.lrow small{font:8.5pt system-ui,sans-serif;color:#7a7f7a}
.lrow > span{font:9pt system-ui,sans-serif}
.lvis{padding:2mm 0 0}
.lvis .qkeys{max-width:330px}.lvis .qboard{max-height:170px;width:auto;max-width:100%}
.diagwrap svg.big{width:140px;height:auto}
.notes,.lchips{font-family:system-ui,sans-serif}
.ltab{font:9pt/1.35 "DejaVu Sans Mono","Roboto Mono","Droid Sans Mono","Liberation Mono","Courier New",Courier,monospace;background:#fff;border:1px solid #e3dccd;border-radius:2mm;padding:2.5mm 3mm;white-space:pre;overflow:visible}
.ltry{background:#e5f1ee;border:0;border-radius:3mm;padding:3.5mm 5mm;margin:4mm 0;font-size:10.5pt}
.lkey{background:#fbf1ea;border:0;border-radius:3mm;padding:3.5mm 5mm;margin:5mm 0 0;font-size:10.5pt}
.ltry .lbl,.lkey .lbl{font:700 8pt system-ui,sans-serif;letter-spacing:1.4px;text-transform:uppercase;margin:0 0 1.5mm}
.ltry .lbl{color:${A}}.lkey .lbl{color:${R}}
.ltry .lbl::before{content:"✎  "}.lkey .lbl::before{content:"★  "}
.lkey ul{padding-left:5mm;margin:0}.lkey li{margin:1mm 0}
/* cover */
.pcover{height:297mm;display:flex;flex-direction:column;break-after:page;font-family:system-ui,sans-serif;overflow:hidden}
.pcband{background:linear-gradient(135deg,#0d6b61 0%,#2f6a5a 45%,#8a5a3a 80%,#c4552a 100%);color:#fff;padding:30mm 20mm 18mm;flex:none;min-height:175mm;box-sizing:border-box;display:flex;flex-direction:column}
.pmark{display:flex;align-items:center;gap:3mm;font:700 16pt system-ui,sans-serif;opacity:.95}.pmark svg{width:9mm;height:9mm;color:#fff}
.pcband h1{font:800 52pt/1 system-ui,sans-serif;letter-spacing:-1.4px;margin:22mm 0 5mm}
.psub{font-size:14pt;margin:0;max-width:150mm;opacity:.92;line-height:1.35}
.pneck{margin-top:auto}.pneck svg{width:100%;height:auto;display:block}
.pcbody{flex:1;display:flex;gap:12mm;padding:14mm 20mm 0}
.pcintro{flex:1.3;font:10.5pt/1.6 "Noto Serif",Georgia,serif;color:#333}
.pcintro .phint{font:9pt system-ui,sans-serif;color:#777;margin-top:4mm}
.pcinside{flex:1;list-style:none;margin:0;padding:0;font-size:10pt}
.pcinside li{display:flex;justify-content:space-between;border-bottom:1px solid #e6dfd1;padding:2mm 0}
.pcinside li span{color:${R};font-weight:700}
.pcfoot{padding:0 20mm 12mm;font-size:8.5pt;color:#9a958a}
/* contents */
.ptocpage{break-after:page;font-family:system-ui,sans-serif}
.ptocpage h2{font:800 26pt system-ui,sans-serif;margin:0 0 5mm;color:#15191a}
.ptcols{columns:2;column-gap:8mm}.ptchap{break-inside:avoid;margin-bottom:3mm}
.ptchap h3{font:700 8.5pt system-ui,sans-serif;letter-spacing:1.6px;text-transform:uppercase;color:${R};margin:0 0 1.5mm;padding-bottom:1mm;border-bottom:1px solid #e6dfd1}
.ptrow{display:flex;gap:2.6mm;align-items:flex-start;padding:.35mm 0}
.ptrow .pnum{width:6.5mm;height:6.5mm;font-size:8.5pt;margin-top:.3mm;color:#fff!important}
.ptrow > div b{display:block;font-size:9.5pt;line-height:1.3;color:#15191a}.ptrow > div span{display:block;font-size:7.6pt;color:#7a7f7a;line-height:1.22}
</style></head><body><div class="pdoc">${cover}${tmp.innerHTML}</div></body></html>` };
}
function printLessons(only) {
  const doc = lessonsPrintDoc(only);
  const file = (only == null ? `Plektrum - ${t('lPdfTitle')}` : `Plektrum - ${only + 1} ${L(LESSONS[only].title)}`).replace(/[\\/:*?"<>|]/g, '') + '.pdf';
  if (AND && AND.savePdf) { AND.savePdf(doc.title, file, doc.html, t('lPdfBusy'), t('lPdfDone', { f: file }), t('lPdfFail')); return; }
  if (AND && AND.printHtml) { AND.printHtml(doc.title, doc.html); return; }
  const w = window.open('', '_blank');                       // browsers: the normal print dialog
  if (!w) return;
  w.document.open(); w.document.write(doc.html); w.document.close();
  setTimeout(() => w.print(), 400);
}
/* ---------- sheet music (treble clef) for the lessons ---------- */
const DUR_BEATS = { w: 4, h: 2, q: 1, e: 0.5, s: 0.25 };
/** beats of a staff item: dotted = 1½ times, triplet = ⅔ */
const itemBeats = it => (DUR_BEATS[it.d || it.r] || 1) * (it.dot ? 1.5 : 1) * (it.tri ? 2 / 3 : 1);
/** 'C4', 'F#4', 'Bb3', 'E♭5' → {step (diatonic, C0 = 0), midi, acc} */
function parseNoteName(n) {
  const m = /^([A-G])([#♯b♭]?)(-?\d)$/.exec(n); if (!m) return null;
  const li = 'CDEFGAB'.indexOf(m[1]), oct = +m[3], acc = m[2] === '#' || m[2] === '♯' ? 1 : m[2] ? -1 : 0;
  return { step: oct * 7 + li, midi: 12 * (oct + 1) + [0, 2, 4, 5, 7, 9, 11][li] + acc, acc };
}
/**
 * Sheet music. items: {n:'C4', d:'q', dot, label, hl} | {r:'q', dot} (rest) | {bar:true}
 * opt: {time:'4/4', labels (note names), count: true | 'and' (beat numbers), bars (length bars),
 *       unit (px per beat), lines / spaces (highlight the lines or the spaces)}
 * Notes are spaced by their length, so a half note really takes two beats of room.
 */
function staffSvg(items, opt = {}) {
  const sp = 9, top = 22, bot = top + 4 * sp, unit = opt.unit || 30;
  const yOf = step => bot - (step - 30) * sp / 2;            // E4 (step 30) on the bottom line
  const per = opt.time ? +opt.time.split('/')[0] : 4;
  // layout
  let x = opt.time ? 70 : 50, t = 0, minStep = 30, maxStep = 38, lowY = bot, highY = top;
  const laid = items.map(it => {
    if (it.bar) { const o = { bar: true, x: x + 2 }; x += 14; return o; }
    const beats = itemBeats(it);
    const p = it.n ? parseNoteName(it.n) : null;
    if (p) {
      minStep = Math.min(minStep, p.step); maxStep = Math.max(maxStep, p.step);
      const y = yOf(p.step), stem = it.d !== 'w', down = p.step >= 34;
      lowY = Math.max(lowY, y + 5, stem && down ? y + 31 : 0); highY = Math.min(highY, y - 5, stem && !down ? y - 31 : 1e9);
    }
    const o = { it, p, beats, t, x: x + 9 + (p && p.acc ? 6 : 0) };
    x += Math.max(opt.minW || 13, beats * unit) + (p && p.acc ? 6 : 0); t += beats;
    return o;
  });
  const W = x + 8;
  const yLow = Math.max(bot, lowY) + 4, yTop = Math.min(top - 8, highY - 4);
  const nameY = yLow + 18, countY = nameY + (opt.labels ? 16 : 0), barY = countY + 7;
  const H = (opt.bars ? barY + 10 : opt.count ? countY + 8 : opt.labels ? nameY + 8 : yLow + 10) - yTop + 4;
  const oy = -yTop + 4;
  let g = `<svg class="qstaff" viewBox="0 ${-oy} ${W} ${H}" style="width:${Math.round(W * 1.15)}px" xmlns="http://www.w3.org/2000/svg">`;
  for (let k = 0; k < 5; k++) g += `<line x1="4" x2="${W - 2}" y1="${top + k * sp}" y2="${top + k * sp}" stroke="${opt.lines ? 'var(--accent)' : 'currentColor'}" stroke-opacity="${opt.lines ? 1 : 0.55}" stroke-width="${opt.lines ? 1.4 : 1}"/>`;
  if (opt.spaces) for (let k = 0; k < 4; k++) g += `<rect x="40" y="${top + k * sp + 1.5}" width="${W - 44}" height="${sp - 3}" rx="2" fill="var(--accent)" fill-opacity=".16"/>`;
  g += `<line x1="${W - 2}" x2="${W - 2}" y1="${top}" y2="${bot}" stroke="currentColor" stroke-width="1.6"/>`;
  // treble clef
  const gy = yOf(32), cx = 20;
  g += `<path d="M${cx + 3} ${gy + 2} c0 -5 -8 -5 -8 1 c0 7 12 8 13 -1 c1 -9 -9 -13 -15 -7 c-6 6 -4 19 7 21 c10 2 16 -9 9 -27 c-4 -10 -4 -22 1 -29 c4 -5 8 -1 6 6 c-2 8 -12 14 -12 25 l5 34 c1 6 -7 9 -10 4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${cx - 4}" cy="${gy + 39}" r="3.3" fill="currentColor"/>`;
  if (opt.time) { const [a, b2] = opt.time.split('/'); g += `<text x="${50}" y="${top + sp * 1.62}" font-size="17" font-weight="800" text-anchor="middle" fill="currentColor" font-family="system-ui,sans-serif">${a}</text><text x="${50}" y="${top + sp * 3.62}" font-size="17" font-weight="800" text-anchor="middle" fill="currentColor" font-family="system-ui,sans-serif">${b2}</text>`; }
  // beams: eighths and sixteenths are joined in groups inside one beat
  const beamed = new Set(), beat0 = o => Math.floor(o.t + 1e-6);
  for (let i = 0; i < laid.length; i++) {
    const o = laid[i];
    if (!o.p || !(o.it.d === 'e' || o.it.d === 's') || beamed.has(i)) continue;
    const grp = [o];
    for (let j = i + 1; j < laid.length; j++) {
      const n = laid[j];
      if (!n.p || !(n.it.d === 'e' || n.it.d === 's') || beat0(n) !== beat0(o) || n.it.tri !== o.it.tri) break;
      grp.push(n);
    }
    if (grp.length < 2) continue;
    const avg = grp.reduce((a, x) => a + x.p.step, 0) / grp.length, up = avg < 34;
    const ys = grp.map(x => yOf(x.p.step)), ly = up ? Math.min(...ys) - 30 : Math.max(...ys) + 30;
    const info = { grp, up, ly };
    grp.forEach(x => { x.grp = info; beamed.add(laid.indexOf(x)); });
  }
  laid.forEach((o, i) => {
    if (o.bar) { g += `<line x1="${o.x}" x2="${o.x}" y1="${top}" y2="${bot}" stroke="currentColor" stroke-width="1.2"/>`; return; }
    const it = o.it, X = o.x;
    let e = `<g class="sn" data-i="${i}">`;
    if (it.r) {
      const mid = top + 2 * sp;
      if (it.r === 'w') e += `<rect x="${X - 6}" y="${top + sp}" width="12" height="${sp * 0.55}" fill="currentColor"/>`;
      else if (it.r === 'h') e += `<rect x="${X - 6}" y="${mid - sp * 0.55}" width="12" height="${sp * 0.55}" fill="currentColor"/>`;
      else if (it.r === 'q') e += `<path d="M${X - 2} ${mid - 15} l6 7.5 q-4 3 -3 7 l5 6.5 q-5 -2 -6 2 q0 3 3 5 q-8 -2 -6 -8 q2 -3 5 -1 l-6 -7 q4 -3 3 -7 z" fill="currentColor"/>`;
      else e += `<circle cx="${X - 3}" cy="${mid - 4}" r="2.4" fill="currentColor"/><path d="M${X - 4} ${mid - 2.5} q4 2 7 -3 l-5 15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`;
      if (it.dot) e += `<circle cx="${X + 10}" cy="${mid - sp / 2}" r="1.8" fill="currentColor"/>`;
      if (opt.labels && it.label != null) e += `<text x="${X}" y="${nameY}" font-size="11" font-weight="700" text-anchor="middle" fill="currentColor" font-family="system-ui,sans-serif">${typeof it.label === 'string' ? it.label : L(it.label)}</text>`;
    } else {
      const p = o.p, y = yOf(p.step), hollow = it.d === 'w' || it.d === 'h';
      for (let st = 28; st >= p.step; st -= 2) e += `<line x1="${X - 9}" x2="${X + 9}" y1="${yOf(st)}" y2="${yOf(st)}" stroke="currentColor" stroke-width="1.1"/>`;
      for (let st = 40; st <= p.step; st += 2) e += `<line x1="${X - 9}" x2="${X + 9}" y1="${yOf(st)}" y2="${yOf(st)}" stroke="currentColor" stroke-width="1.1"/>`;
      if (p.acc) e += `<text x="${X - 13}" y="${y + 5}" font-size="15" text-anchor="middle" fill="currentColor">${p.acc > 0 ? '♯' : '♭'}</text>`;
      const col = it.hl ? 'var(--root)' : 'currentColor';
      e += `<ellipse cx="${X}" cy="${y}" rx="${hollow ? 5.7 : 5.3}" ry="3.9" transform="rotate(-20 ${X} ${y})" fill="${hollow ? 'none' : col}" stroke="${col}" stroke-width="${hollow ? 1.9 : 1}"/>`;
      if (it.d !== 'w') {
        const G = o.grp;
        const up = G ? G.up : p.step < 34;
        const sx = up ? X + 5 : X - 5, sy2 = up ? y - 30 : y + 30;
        if (G) {
          const ly = G.ly, k = G.grp.indexOf(o), sxOf = q => (G.up ? q.x + 5 : q.x - 5);
          e += `<line x1="${sx}" x2="${sx}" y1="${y}" y2="${ly}" stroke="${col}" stroke-width="1.3"/>`;
          if (k === 0) {
            const last = G.grp[G.grp.length - 1], dy = G.up ? 6 : -6;
            e += `<line x1="${sx}" x2="${sxOf(last)}" y1="${ly}" y2="${ly}" stroke="currentColor" stroke-width="4.2"/>`;
            // second beam for sixteenths: between neighbours, or a short stub
            G.grp.forEach((q, m) => {
              if (q.it.d !== 's') return;
              const nx = G.grp[m + 1], pv = G.grp[m - 1];
              if (nx && nx.it.d === 's') e += `<line x1="${sxOf(q)}" x2="${sxOf(nx)}" y1="${ly + dy}" y2="${ly + dy}" stroke="currentColor" stroke-width="4.2"/>`;
              else if (!(pv && pv.it.d === 's')) { const to = nx ? sxOf(q) + 7 : sxOf(q) - 7; e += `<line x1="${sxOf(q)}" x2="${to}" y1="${ly + dy}" y2="${ly + dy}" stroke="currentColor" stroke-width="4.2"/>`; }
            });
            if (o.it.tri) { const mx = (sxOf(o) + sxOf(last)) / 2; e += `<text x="${mx}" y="${G.up ? ly - 6 : ly + 15}" font-size="11" font-weight="800" font-style="italic" text-anchor="middle" fill="currentColor" font-family="system-ui,sans-serif">3</text>`; }
          }
        } else {
          e += `<line x1="${sx}" x2="${sx}" y1="${y}" y2="${sy2}" stroke="${col}" stroke-width="1.3"/>`;
          const flags = it.d === 'e' ? 1 : it.d === 's' ? 2 : 0;
          for (let k = 0; k < flags; k++) { const fy = sy2 + (up ? k * 7 : -k * 7); e += `<path d="M${sx} ${fy} q9 ${up ? 7 : -7} 6 ${up ? 18 : -18}" fill="none" stroke="currentColor" stroke-width="1.7"/>`; }
        }
      }
      if (it.dot) e += `<circle cx="${X + 10}" cy="${y - ((p.step - 30) % 2 === 0 ? sp / 2 : 0)}" r="1.9" fill="currentColor"/>`;
      if (it.tie) {
        const nx = laid.slice(i + 1).find(q => q.p);
        if (nx) { const down = p.step >= 34, yy = down ? y - 7 : y + 7, x2 = nx.x - 4, mx = (X + 4 + x2) / 2; e += `<path d="M${X + 4} ${yy} Q${mx} ${yy + (down ? -10 : 10)} ${x2} ${yy}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`; }
      }
      if (it.tri && !o.grp && it.triStart) e += `<text x="${X + unit * 0.66}" y="${Math.min(yTop + 16, y - 36)}" font-size="11" font-weight="800" font-style="italic" text-anchor="middle" fill="currentColor" font-family="system-ui,sans-serif">⌐ 3 ¬</text>`;
      if (opt.labels) e += `<text x="${X}" y="${nameY}" font-size="11" font-weight="700" text-anchor="middle" fill="${it.hl ? 'var(--root)' : 'currentColor'}" font-family="system-ui,sans-serif">${it.label != null ? (typeof it.label === 'string' ? it.label : L(it.label)) : nn(p.midi, p.acc < 0 ? 'f' : p.acc > 0 ? 's' : undefined)}</text>`;
    }
    if (opt.bars) e += `<rect x="${X - 6}" y="${barY}" width="${Math.max(6, o.beats * unit - 6)}" height="5" rx="2.5" fill="${it.r ? 'none' : 'var(--accent)'}" stroke="${it.r ? 'var(--muted)' : 'none'}" stroke-dasharray="${it.r ? '3 2' : ''}" fill-opacity=".85"/>`;
    g += e + '</g>';
    // the count: every beat (and "&") under the note or rest; held beats are greyed
    if (opt.count) {
      const step = opt.count === 'and' ? 0.5 : opt.count === 'e&a' ? 0.25 : opt.count === 'tri' ? 1 / 3 : 1;
      for (let k = 0; k < o.beats - 1e-6; k += step) {
        const at = o.t + k, inBar = ((at % per) + per) % per, whole = Math.abs(inBar - Math.round(inBar)) < 1e-6;
        const fr = Math.round((inBar - Math.floor(inBar + 1e-6)) * 12);   // twelfths of a beat
        const txt = whole ? String(Math.round(inBar) + 1) : fr === 6 ? '&' : fr === 3 ? 'e' : fr === 9 ? 'a' : fr === 4 ? (L({ en: 'trip', sv: 'tri' })) : fr === 8 ? (L({ en: 'let', sv: 'ol' })) : '·';
        const prevNote = laid.slice(0, i).reverse().find(q => !q.bar);
        const held = k > 0 || !!it.r || !!(prevNote && prevNote.it.tie);   // a tied note is not played again
        g += `<text class="scn" data-at="${at}" x="${X + k * unit}" y="${countY}" font-size="${whole ? 12 : 10.5}" font-weight="${held ? 500 : 800}" text-anchor="middle" fill="${held ? 'var(--muted)' : 'currentColor'}" font-family="system-ui,sans-serif">${txt}</text>`;
      }
    }
  });
  return g + '</svg>';
}
/** keep lesson fretboards at a sensible height whatever their number of frets */
function lessonBoardScale(fz) { const F = clamp(Math.max(...fz.dots.map(d => d[1])) + 1, 5, 15), H = 20 + 34 * 5 + 26; return Math.min(1.35, 170 / H) * (F >= 9 ? 1.5 : 1); }
/** lesson chord names are always written with English letters (B = 11): parse them that way */
function lessonChord(name) { const h = Theory.hNotation; Theory.hNotation = false; try { return parseChord(name); } finally { Theory.hNotation = h; } }
/** a lesson chord name for display, in the chosen B/H notation */
function lessonChordName(name) {
  const m = /^([A-G])([#♯b♭]?)(.*?)(?:\/([A-G])([#♯b♭]?))?$/.exec(name); if (!m) return pretty(name);
  const note = (l, a) => { a = a.replace('#', '♯').replace(/^b$/, '♭'); if (Theory.hNotation && l === 'B') return a === '♭' ? 'B' : 'H' + a; return l + a; };
  return note(m[1], m[2]) + pretty(m[3]) + (m[4] ? '/' + note(m[4], m[5]) : '');
}
/** the notes of a chord name as spans that can light up */
function chordNoteSpans(name) {
  const p = lessonChord(name); if (!p) return '';
  const T = TYPES[p.t], sp = chordSpell(p.r, p.t);
  const ivs = T.req.concat(T.opt).sort((a, b) => a - b);
  const lab = x => { const l = intervalLabel(p.t, x); return l[0] === '♯' ? 's' : l[0] === '♭' ? 'f' : sp; };
  const items = ivs.map(x => ({ pc: mod12(p.r + x), sp: lab(x) }));
  if (p.b != null && !items.some(i => i.pc === p.b)) items.unshift({ pc: p.b, sp });
  if (p.b != null) items.sort((a, b) => (a.pc === p.b ? -1 : b.pc === p.b ? 1 : 0));
  return items.map(i => `<i class="ln" data-pc="${i.pc}">${nn(i.pc, i.sp)}</i>`).join(' ');
}
/** restart a short highlight animation on an element */
function blinkEl(el) { el.classList.remove('lon'); void el.getBoundingClientRect(); el.classList.add('lon'); }
/** pitch class of a written note name such as "C♯/D♭" (first name counts) */
function pcOfName(t) {
  const m = /^([A-H])([♯#♭b]*)/.exec(String(t)); if (!m) return '';
  return mod12({ C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: Theory.hNotation ? 10 : 11, H: 11 }[m[1]] + [...m[2]].reduce((a, c) => a + (c === '♯' || c === '#' ? 1 : -1), 0));
}
/** tab text with every fret number wrapped, numbered in playing order (left to right) */
function tabHtml(tab) {
  if (Theory.hNotation) tab = tab.replace(/^B\|/m, 'H|');   // the B string is the H string in Swedish note names
  const lines = tab.split('\n'), toks = [];
  lines.forEach((ln, li) => { const re = /\d+/g; let m; while ((m = re.exec(ln.slice(2)))) toks.push({ li, col: m.index + 2, len: m[0].length }); });
  const cols = [...new Set(toks.map(x => x.col))].sort((a, b) => a - b);
  return lines.map((ln, li) => {
    let out = '', p = 0;
    toks.filter(x => x.li === li).sort((a, b) => a.col - b.col).forEach(x => {
      out += esc(ln.slice(p, x.col)) + `<span class="tn" data-i="${cols.indexOf(x.col)}">${ln.substr(x.col, x.len)}</span>`; p = x.col + x.len;
    });
    return out + esc(ln.slice(p));
  }).join('\n');
}
/** blink the strings of the big chord chart in time with the sound */
function blinkChord(sched, scope = '#bigdiag') {
  if (!sched || !Snd.ctx) return;
  sched.forEach(({ s, when }) => atTime(when, () => blink(document.querySelector(`${scope} .hl[data-s="${s}"]`))));
}
function vfor(c) {
  const vs = voicings(c.r, c.t, c.b, instOf(c));
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
  const tuneRow = !mini && opt.showTuning;
  const W = 124, padL = 23, sx = 16, top = tuneRow ? 38 : 26, sy = 22, rows = 5;
  const H = top + sy * rows + (names ? 22 : 10);
  const dotText = (i, f) => {
    const pc = mod12(tun[i] + f);
    if (mode === 'note') return nn(pc, opt.spell);
    if (mode === 'interval') return labels.get(pc) || '';
    return v.fing[i] ? String(v.fing[i]) : '';
  };
  const fs = txt => txt.length > 1 ? 8 : 10;
  if (!v) return `<svg viewBox="0 0 ${W} ${H}" class="${opt.cls || ''}"></svg>`;
  const tunLabels = () => { let o = ''; for (let i = 0; i < NS; i++) o += `<text x="${x(i)}" y="9" font-size="8.5" font-weight="600" text-anchor="middle" style="fill:var(--muted)">${nn(tun[i], opt.spell)}</text>`; return o; };
  const tun = opt.tuning || CI().n, NS = tun.length;
  const x = i => padL + (S.lefty ? NS - 1 - i : i) * (80 / (NS - 1));
  const fretted = v.frets.filter(f => f > 0);
  const maxF = fretted.length ? Math.max(...fretted) : 0;
  const minF = fretted.length ? Math.min(...fretted) : 0;
  const base = maxF <= rows ? 1 : minF;
  const y = f => top + (f - base + 0.5) * sy;
  let s = `<svg viewBox="0 0 ${W} ${H}" class="${opt.cls || ''}" xmlns="http://www.w3.org/2000/svg">`;
  if (tuneRow) s += tunLabels();
  for (let j = 0; j <= rows; j++) s += `<line x1="${x(0) - (S.lefty ? -0 : 0)}" x2="${x(NS - 1)}" y1="${top + j * sy}" y2="${top + j * sy}" style="stroke:var(--fret)" stroke-width="1.4"/>`;
  for (let i = 0; i < NS; i++) s += `<line x1="${x(i)}" x2="${x(i)}" y1="${top}" y2="${top + rows * sy}" style="stroke:var(--str)" stroke-width="${clamp(0.8 + (66 - tun[i]) / 22, 0.8, 2.2)}"/>`;
  if (base === 1) s += `<rect x="${Math.min(x(0), x(NS - 1)) - 1}" y="${top - 4}" width="${Math.abs(x(NS - 1) - x(0)) + 2}" height="5" rx="1.5" style="fill:var(--ink)"/>`;
  else s += `<text x="${S.lefty ? W - 2 : 2}" y="${top + sy * 0.5 + 4}" font-size="11" font-weight="700" text-anchor="${S.lefty ? 'end' : 'start'}" style="fill:var(--muted)">${base}</text>`;
  for (let i = 0; i < NS; i++) {
    const f = v.frets[i];
    if (f < 0) s += `<path d="M${x(i) - 4} ${top - 16}l8 8M${x(i) + 4} ${top - 16}l-8 8" style="stroke:var(--muted)" stroke-width="1.6" stroke-linecap="round"/>`;
    else if (f === 0) {
      const isR = mod12(tun[i]) === root;
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
  for (let i = 0; i < NS; i++) {
    const f = v.frets[i];
    if (f <= 0) continue;
    const inBarre = v.barre && f === v.barre.fret && i >= v.barre.from && i <= v.barre.to;
    const isRoot = mod12(tun[i] + f) === root;
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
  if (!mini) for (let i = 0; i < NS; i++) {
    const f = v.frets[i];
    if (f < 0) continue;
    const cy = f === 0 ? top - 12 : y(f);
    s += `<circle class="hl" data-s="${i}" cx="${x(i)}" cy="${cy}" r="${f === 0 ? 8 : 10.5}"/>`;
  }
  if (names) for (let i = 0; i < NS; i++) {
    const f = v.frets[i];
    if (f < 0) continue;
    s += `<text x="${x(i)}" y="${top + rows * sy + 16}" font-size="9.5" text-anchor="middle" style="fill:var(--muted)">${nn(tun[i] + f, opt.spell)}</text>`;
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
window.addEventListener('popstate', () => {
  if (Sheet.isOpen) Sheet._closed();
  else if (typeof Practice !== 'undefined' && Practice.view !== 'hub') Practice.pop();
});

/* =======================================================================
   CHORDS
   ======================================================================= */
const Chords = {
  c: Object.assign({ r: 0, t: 0, b: null, v: 0 }, store.get('chord', {})),
  favs: store.get('favs', []),
  save() { store.set('chord', this.c); },
  isFav() { const ii = CI().id; return this.favs.some(f => f.r === this.c.r && f.t === this.c.t && f.b === this.c.b && f.v === this.c.v && (f.inst || 'guitar') === ii); },

  render() {
    const c = this.c, inst = CI(), vs = voicings(c.r, c.t, c.b, inst);
    c.v = clamp(c.v, 0, Math.max(0, vs.length - 1));
    const v = vs[c.v];
    const T = TYPES[c.t];
    const pcs = [];
    T.req.concat(T.opt).sort((a, b) => a - b).forEach(s => pcs.push({ pc: mod12(c.r + s), lab: intervalLabel(c.t, s) }));
    if (c.b != null && !pcs.some(p => p.pc === c.b)) pcs.unshift({ pc: c.b, lab: t('bassShort') });
    const labels = new Map(pcs.map(p => [p.pc, p.lab]));
    const sp = chordSpell(c.r, c.t);
    const openShape = v && v.frets.some(f => f === 0) && Math.max(0, ...v.frets) <= 5;
    const posTxt = v ? (openShape ? t('openPos') : t('atFret', { n: v.pos })) : '';
    $('#tab-chords').innerHTML = `
      <div class="card">
        <div class="chordhead">
          <div class="grow" style="min-width:0"><div class="chordname">${cname(c.r, c.t, c.b)}</div>
          <div class="chordlong">${nn(c.r)} ${L(T)}${c.b != null ? ' / ' + nn(c.b) : ''}</div></div>
          <button class="iconbtn star ${this.isFav() ? 'on' : ''}" data-a="fav" aria-label="favourite">${I.star}</button>
        </div>
        <div class="instrow">
          <select id="cinst" aria-label="${esc(t('instrument'))}">${CHORD_INSTS.map(x => `<option value="${x.id}" ${x.id === S.chordInst ? 'selected' : ''}>${L(x)}</option>`).join('')}</select>
          <select id="ctun" aria-label="${esc(t('tuning'))}">${CHORD_INSTS.find(x => x.id === S.chordInst).tunings.map((x, k) => `<option value="${k ? x.id : ''}" ${x === tuningOf(inst) ? 'selected' : ''}>${L(x)}</option>`).join('')}</select>
        </div>
        ${v ? `
        <div class="diagwrap">
          <button class="iconbtn" data-a="vprev" ${c.v === 0 ? 'disabled style="opacity:.25"' : ''}>${I.left}</button>
          <div id="bigdiag" data-a="playCur">${diagram(v, c.r, { cls: 'big', labels, dot: S.dotLabel, spell: sp, showTuning: S.showTuning })}</div>
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
          <div class="fav" data-a="openFav" data-v="${i}">${diagram(vfor(Object.assign({ inst: 'guitar' }, f)), f.r, { mini: true, tuning: instOf(Object.assign({ inst: 'guitar' }, f)).n })}<b>${cname(f.r, f.t, f.b)}</b>${(f.inst || 'guitar') !== 'guitar' ? `<small>${L(instOf(f))}${instOf(f).tun ? ' · ' + L(instOf(f).tun) : ''}</small>` : ''}</div>`).join('')
          : `<div class="empty">${t('noFavs')}</div>`}</div>
      </div>
      <div class="card">
        <div class="lbl">${t('root')}</div>
        ${rootGrid('croot', c.r)}
        <div class="lbl">${t('type')}</div>
        <div class="chips">${TYPES.map((x, i) => `<button class="chip ${i === c.t ? 'on' : ''}" data-a="ctype" data-v="${i}">${x.sfx ? pretty(x.sfx) : L({ en: 'maj', sv: 'dur' })}</button>`).join('')}</div>
        <div class="lbl">${t('bass')}</div>
        <div class="chips"><button class="chip ${c.b == null ? 'on' : ''}" data-a="cbass" data-v="">${t('none')}</button>${[...Array(12).keys()].filter(pc => pc !== c.r).map(pc => `<button class="chip ${pc === c.b ? 'on' : ''}" data-a="cbass" data-v="${pc}">/${nn(pc)}</button>`).join('')}</div>
      </div>`;
    $('#cinst').addEventListener('change', e => { S.chordInst = e.target.value; saveS(); Snd.setTimbre(S.chordInst); this.c.v = 0; this.save(); this.render(); this.play(); });
    $('#ctun').addEventListener('change', e => {
      if (e.target.value) S.chordTun[S.chordInst] = e.target.value; else delete S.chordTun[S.chordInst];
      saveS(); this.c.v = 0; this.save(); this.render(); this.play();
    });
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
    if (v) blinkChord(Snd.chord(v.frets, CI().n, 0, style || S.style));
  },
  toggleFav() {
    const c = this.c;
    const ii = CI().id;
    const i = this.favs.findIndex(f => f.r === c.r && f.t === c.t && f.b === c.b && f.v === c.v && (f.inst || 'guitar') === ii);
    if (i >= 0) { this.favs.splice(i, 1); toast(t('favRemoved')); }
    else { this.favs.push({ r: c.r, t: c.t, b: c.b, v: c.v, inst: ii }); toast(t('favAdded')); }
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
        const n = voicings(this.c.r, this.c.t, this.c.b, CI()).length;
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
      case 'openFav': {
        const f = this.favs[+v], [fb, ft] = String(f.inst || 'guitar').split(':');
        S.chordInst = fb; if (ft) S.chordTun[fb] = ft; else delete S.chordTun[fb];
        saveS(); Snd.setTimbre(S.chordInst); this.set({ r: f.r, t: f.t, b: f.b, v: f.v }, true); window.scrollTo({ top: 0, behavior: 'smooth' }); break; }
      default: return false;
    }
    return true;
  },
};

/* =======================================================================
   CHORD PICKER (used by Studio)
   ======================================================================= */
function pickerHtml(c, idx, total) {
  const vs = voicings(c.r, c.t, c.b, CI());
  return `<h2>${t('chooseChord')} · ${cname(c.r, c.t, c.b)}</h2>
    <div class="lbl">${t('root')}</div>${rootGrid('pkroot', c.r)}
    <div class="lbl">${t('type')}</div>
    <div class="chips">${TYPES.map((x, i) => `<button class="chip ${i === c.t ? 'on' : ''}" data-a="pktype" data-v="${i}">${x.sfx ? pretty(x.sfx) : L({ en: 'maj', sv: 'dur' })}</button>`).join('')}</div>
    <div class="lbl">${t('bass')}</div>
    <div class="chips"><button class="chip ${c.b == null ? 'on' : ''}" data-a="pkbass" data-v="">${t('none')}</button>${[...Array(12).keys()].filter(pc => pc !== c.r).map(pc => `<button class="chip ${pc === c.b ? 'on' : ''}" data-a="pkbass" data-v="${pc}">/${nn(pc)}</button>`).join('')}</div>
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
      if (v) Snd.stroke(sp.p[step], v.frets, CI().n, tt, this.st, sp.sub >= 4 || spb < 0.4);
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
      Snd.stroke(sp.p[step], v.frets, CI().n, tt, st, sp.sub >= 4 || spb < 0.4);
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
    if (play) { const v = vfor(this.pick); if (v) Snd.chord(v.frets, CI().n, 0, 'strum'); }
  },

  action(a, v) {
    const p = this.p;
    switch (a) {
      case 'slot': if (!this.clock.running) this.openPicker(+v); else { const x = vfor(p.slots[+v]); if (x) Snd.chord(x.frets, CI().n, 0); } break;
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
    const v = voicings(c.r, c.t, null, CI())[0];
    if (v) Snd.chord(v.frets, CI().n, when || 0, 'strum');
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
    else { const v2 = voicings(c.r, c.t, null, CI())[0]; if (v2) Snd.chord(v2.frets, CI().n, time, 'strum', 0.7); }
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
  s: Object.assign({ root: 9, id: 'pmin', pos: -1, labels: 'notes', inst: 'guitar', tun: '', sev: false }, store.get('scale', {})),
  insts: scaleInstruments(),
  lastChord: null,
  save() { store.set('scale', this.s); },
  sc() { return SCALES.find(x => x.id === this.s.id) || SCALES[0]; },
  si() { return this.insts.find(x => x.id === this.s.inst) || this.insts[0]; },
  tu() { const si = this.si(); return si.tunings.find(x => x.id === this.s.tun) || si.tunings[0]; },
  instId() { return this.si().id; },

  board() {
    const sc = this.sc(), root = this.s.root, si = this.si(), tu = this.tu(), N = tu.n.length;
    const pcs = new Map(sc.iv.map(s => [mod12(root + s), s]));
    const sp = spellScale(root, sc);
    const name = pc => (sp && sp.get(pc)) || nn(pc);
    const positions = scalePositions(root, sc, tu);
    const pos = this.s.pos >= 0 ? positions[this.s.pos] : null;
    const inPos = pos ? new Set(pos.notes.map(n => n.s + ':' + n.f)) : null;
    const blue = sc.base ? new Set(sc.iv.filter(s => !SCALES.find(x => x.id === sc.base).iv.includes(s))) : new Set();
    const nut = 36, fw = 46, F = MAX_FRET, top = 22, sy = 27;
    const W = nut + F * fw + 14, H = top + sy * (N - 1) + 30;
    const X = x => S.lefty ? W - x : x;
    const fx = f => f === 0 ? nut - 18 : nut + (f - 0.5) * fw;
    const Y = s => top + (N - 1 - s) * sy;                  // highest string at the top, as in tab
    let o = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" id="boardSvg">`;
    o += `<rect x="${Math.min(X(nut), X(nut + F * fw))}" y="${top - 8}" width="${F * fw}" height="${sy * (N - 1) + 16}" rx="4" style="fill:var(--wood)"/>`;
    if (!si.fretless) {
      [3, 5, 7, 9, 15, 17].forEach(f => { o += `<circle cx="${X(nut + (f - 0.5) * fw)}" cy="${top + sy * (N - 1) / 2}" r="5" style="fill:var(--fret)" opacity=".7"/>`; });
      o += `<circle cx="${X(nut + 11.5 * fw)}" cy="${top + sy * (N - 1) * 0.25}" r="5" style="fill:var(--fret)" opacity=".7"/><circle cx="${X(nut + 11.5 * fw)}" cy="${top + sy * (N - 1) * 0.75}" r="5" style="fill:var(--fret)" opacity=".7"/>`;
    }
    for (let f = 0; f <= F; f++) {
      const xx = X(nut + f * fw);
      if (f === 0) o += `<line x1="${xx}" x2="${xx}" y1="${top - 8}" y2="${top + sy * (N - 1) + 8}" style="stroke:var(--ink)" stroke-width="5"/>`;
      else if (si.fretless) o += `<line x1="${xx}" x2="${xx}" y1="${top - 8}" y2="${top + sy * (N - 1) + 8}" style="stroke:var(--fret)" stroke-width="1" stroke-dasharray="2 5" opacity=".6"/>`;
      else o += `<line x1="${xx}" x2="${xx}" y1="${top - 8}" y2="${top + sy * (N - 1) + 8}" style="stroke:var(--fret)" stroke-width="2"/>`;
      if (f) o += `<text x="${X(nut + (f - 0.5) * fw)}" y="${H - 4}" font-size="11" text-anchor="middle" style="fill:var(--muted)">${f}</text>`;
    }
    if (pos) {
      const a = X(pos.lo === 0 ? nut - 34 : nut + (pos.lo - 1) * fw), b = X(nut + pos.hi * fw);
      o += `<rect x="${Math.min(a, b)}" y="${top - 11}" width="${Math.abs(b - a)}" height="${sy * (N - 1) + 22}" rx="8" fill="none" style="stroke:var(--accent)" stroke-width="2" stroke-dasharray="5 4"/>`;
    }
    for (let s = 0; s < N; s++) {
      const x0 = tu.start[s] ? nut + (tu.start[s] - 0.5) * fw : nut - 30;
      o += `<line x1="${X(x0)}" x2="${X(nut + F * fw)}" y1="${Y(s)}" y2="${Y(s)}" style="stroke:var(--str)" stroke-width="${clamp(0.8 + (66 - tu.n[s] - tu.start[s]) / 20, 0.8, 2.6)}"/>`;
      if (tu.start[s]) o += `<circle cx="${X(x0)}" cy="${Y(s)}" r="4" style="fill:var(--fret)"/>`;
    }
    for (let s = 0; s < N; s++) for (let f = tu.start[s]; f <= F; f++) {
      const m = tu.n[s] + f, pc = mod12(m);
      if (!pcs.has(pc)) continue;
      const deg = pcs.get(pc);
      const faded = inPos && !inPos.has(s + ':' + f);
      const isRoot = deg === 0, isBlue = blue.has(deg);
      const fill = isRoot ? 'var(--root)' : isBlue ? 'var(--dim)' : 'var(--accent)';
      const lab = this.s.labels === 'notes' ? name(pc) : scaleDegreeLabel(sc, deg);
      const xf = tu.start[s] && f === tu.start[s] ? nut + (f - 0.5) * fw : fx(f);
      o += `<g data-a="snote" data-v="${m},${s}" opacity="${faded ? 0.16 : 1}" style="cursor:pointer">
        <circle cx="${X(xf)}" cy="${Y(s)}" r="11" style="fill:${fill}"/>
        <text x="${X(xf)}" y="${Y(s) + 3.8}" font-size="${lab.length > 2 ? 9 : 10.5}" font-weight="700" text-anchor="middle" style="fill:${isRoot || isBlue ? '#fff' : 'var(--on-accent)'};pointer-events:none">${lab}</text></g>`;
    }
    return { svg: o + '</svg>', positions, W, fw, nut, pos };
  },

  render() {
    const sc = this.sc(), s = this.s, si = this.si(), tu = this.tu();
    const b = this.board();
    if (s.pos >= b.positions.length) s.pos = -1;
    const chords = scaleChords(s.root, sc, s.sev);
    const sp = spellScale(s.root, sc);
    const name = pc => (sp && sp.get(pc)) || nn(pc);
    const steps = stepPattern(sc);
    $('#tab-scales').innerHTML = `
      <div class="card">
        <div class="row" style="flex-wrap:nowrap">
          <div class="grow" style="min-width:0"><div class="lbl" style="margin-top:0">${t('instrument')}</div>
            <select id="scinst">${this.insts.map(x => `<option value="${x.id}" ${x.id === si.id ? 'selected' : ''}>${L(x)}</option>`).join('')}</select></div>
          ${si.tunings.length > 1 ? `<div class="grow" style="min-width:0"><div class="lbl" style="margin-top:0">${t('tuning')}</div>
            <select id="sctun">${si.tunings.map(x => `<option value="${x.id}" ${x === tu ? 'selected' : ''}>${L(x)}</option>`).join('')}</select></div>` : ''}
        </div>
        <div class="lbl">${t('scale')}</div>
        <select id="scsel">${SCALE_GROUPS.map(g => `<optgroup label="${esc(L(g))}">${SCALES.filter(x => x.g === g.id).map(x => `<option value="${x.id}" ${x.id === s.id ? 'selected' : ''}>${L(x)}</option>`).join('')}</optgroup>`).join('')}</select>
        <div class="lbl">${t('key')}</div>
        ${rootGrid('skey', s.root)}
      </div>
      <div class="card">
        <div class="row" style="justify-content:space-between;margin-bottom:8px">
          <b style="font-size:17px">${name(s.root)} ${L(sc).toLowerCase()}</b>
          <button class="btn small primary" data-a="splay">${I.play}${t('playScale')}</button>
        </div>
        <div class="notes" style="justify-content:flex-start">${sc.iv.map(x => `<div class="note ${x === 0 ? 'r' : ''}"><b>${name(mod12(s.root + x))}</b><span>${scaleDegreeLabel(sc, x)}</span></div>`).join('')}</div>
        ${steps ? `<div class="small muted" style="margin:-4px 0 4px">${t('steps')}: <b style="color:var(--ink);letter-spacing:.04em">${steps}</b></div>` : ''}
        ${b.positions.length ? `<div class="lbl">${t('position')}</div>
        <div class="chips scroll"><button class="chip ${s.pos < 0 ? 'on' : ''}" data-a="spos" data-v="-1">${t('wholeNeck')}</button>${b.positions.map((p, i) => `<button class="chip ${i === s.pos ? 'on' : ''}" data-a="spos" data-v="${i}">${i + 1} <span class="muted small" style="${i === s.pos ? 'color:inherit;opacity:.8' : ''}">· ${t('frets', { a: p.lo, b: p.hi })}</span></button>`).join('')}</div>` : ''}
        <div style="height:12px"></div>
        <div class="board" id="board">${b.svg}</div>
        <div class="legend"><span><i style="background:var(--root)"></i>${t('rootL')}</span><span><i style="background:var(--accent)"></i>${t('noteL')}</span>${sc.base ? `<span><i style="background:var(--dim)"></i>${t('blueL')}</span>` : ''}${si.fretless ? `<span>${t('fretlessNote')}</span>` : ''}</div>
        <div style="margin-top:12px">${seg('slabels', [['notes', t('notesL')], ['degrees', t('degrees')]], s.labels)}</div>
      </div>
      ${chords.length ? `<div class="card">
        <div class="row" style="justify-content:space-between"><div class="lbl" style="margin:0">${t('scaleChords')}</div>
          <div style="width:170px">${seg('ssev', [['0', t('triads')], ['1', t('sevenths')]], s.sev ? '1' : '0')}</div></div>
        <div class="dchords" style="margin-top:10px">${chords.map((c, i) => `<div class="dchord ${this.lastChord && this.lastChord.i === i ? 'lit' : ''}" data-a="schord" data-v="${i}"><i>${c.roman}</i><b>${name(c.r)}${c.t >= 0 ? pretty(TYPES[c.t].sfx) : ''}</b></div>`).join('')}</div>
        <div class="row" style="margin-top:10px;justify-content:flex-end">
          <button class="btn small" data-a="sfing" ${this.lastChord ? '' : 'disabled'}>${I.chords}${t('showFing')}</button></div>
      </div>` : ''}`;
    $('#scsel').addEventListener('change', e => { s.id = e.target.value; s.pos = -1; this.lastChord = null; this.save(); this.render(); });
    $('#scinst').addEventListener('change', e => { s.inst = e.target.value; s.tun = ''; s.pos = -1; Snd.setTimbre(s.inst); this.save(); this.render(); });
    const st = $('#sctun');
    if (st) st.addEventListener('change', e => { s.tun = e.target.value; s.pos = -1; this.save(); this.render(); });
    const board = $('#board');
    if (b.pos) {
      const center = b.nut + ((b.pos.lo + b.pos.hi) / 2) * b.fw;
      const x = S.lefty ? b.W - center : center;
      board.scrollLeft = x - board.clientWidth / 2;
    } else board.scrollLeft = S.lefty ? board.scrollWidth : 0;
  },
  /** chord instrument matching the fretboard, if the chord library has it */
  chordInst() { return CHORD_INSTS.find(x => x.id === this.si().id || (x.id === 'bass' && this.si().id.startsWith('bass'))) || null; },
  playChord(c) {
    const ci = this.chordInst() || CHORD_INSTS[0];
    const v = c.t >= 0 ? voicings(c.r, c.t, null, ci)[0] : null;
    if (v) Snd.chord(v.frets, ci.n, 0, 'strum');
  },
  playScale() {
    const sc = this.sc(), s = this.s, tu = this.tu();
    const b = this.board();
    let notes;
    if (b.pos) {
      notes = b.pos.notes.map(n => ({ m: tu.n[n.s] + n.f, s: n.s })).sort((a, c) => a.m - c.m);
      const seen = new Set();
      notes = notes.filter(n => !seen.has(n.m) && seen.add(n.m));
    } else {
      // one octave up and back from the lowest root on the lowest open string
      let lo = 0;
      tu.n.forEach((m, i) => { if (!tu.start[i] && m < tu.n[lo]) lo = i; });
      const m0 = tu.n[lo] + mod12(s.root - tu.n[lo]);
      notes = sc.iv.concat([12]).map(x => ({ m: m0 + x, s: -1 }));
    }
    // where to show each note: the position's own dot, else the nearest dot to the previous one
    if (!b.pos) {
      let pf = 0;
      notes = notes.map(n => {
        let best = null;
        tu.n.forEach((o, si) => { const f = n.m - o; if (f >= tu.start[si] && f <= MAX_FRET && (!best || Math.abs(f - pf) < Math.abs(best.f - pf))) best = { s: si, f }; });
        if (best) pf = best.f;
        return { m: n.m, s: best ? best.s : -1 };
      });
    }
    const all = notes.concat(notes.slice(0, -1).reverse());
    const now = Snd.now() + 0.05, step = TIMBRES[Snd.timbre].bow ? 0.42 : 0.26;
    all.forEach((n, i) => {
      const at = now + i * step;
      if (TIMBRES[Snd.timbre].bow) Snd.bowNote(n.m, at, -1, 0.9, step * 0.9); else Snd.pluck(n.m, at, -1, 0.9);
      if (n.s >= 0) atTime(at, () => blink(document.querySelector(`#boardSvg [data-v="${n.m},${n.s}"]`)));
    });
  },
  action(a, v) {
    switch (a) {
      case 'skey': this.s.root = +v; this.lastChord = null; this.save(); this.render(); break;
      case 'spos': this.s.pos = +v; this.save(); this.render(); break;
      case 'splay': this.playScale(); break;
      case 'snote': {
        const [m, s] = v.split(',').map(Number);
        Snd.pluck(m, 0, s);
        blink(document.querySelector(`#boardSvg [data-v="${v}"]`));
        break;
      }
      case 'schord': {
        const i = +v, c = scaleChords(this.s.root, this.sc(), this.s.sev)[i];
        const keep = Snd.timbre;
        Snd.setTimbre((this.chordInst() || CHORD_INSTS[0]).id);
        this.playChord(c);
        Snd.timbre = keep;
        this.lastChord = Object.assign({ i }, c);
        document.querySelectorAll('#tab-scales .dchord').forEach((el, k) => el.classList.toggle('lit', k === i));
        const fb = document.querySelector('[data-a=sfing]'); if (fb) fb.disabled = false;
        break;
      }
      case 'sfing': {
        const c = this.lastChord;
        if (!c || c.t < 0) break;
        const ci = this.chordInst();
        if (ci) S.chordInst = ci.id;
        saveS();
        Chords.set({ r: c.r, t: c.t, b: null, v: 0 });
        showTab('chords');
        break;
      }
      default: return false;
    }
    return true;
  },
  seg(k, v) {
    if (k === 'slabels') this.s.labels = v;
    else if (k === 'ssev') { this.s.sev = v === '1'; this.lastChord = null; }
    else return false;
    this.save(); this.render();
    return true;
  },
};

/* =======================================================================
   TUNER – needle and strobe
   ======================================================================= */
const Tuner = {
  lock: null, near: -1, ok: new Set(), okSince: 0, hist: [], freqs: [],
  disp: 0, target: 0, cents: null, smooth: 0, hasSig: false, last: null, lastAt: 0,
  strobeOff: [0, 0, 0], tPrev: 0,
  pipeStop: null, pipeString: -1, pipeOn: false, raf: 0,

  /** Forget readings and marks when the instrument, tuning or mode changes. */
  resetReading() {
    this.freqs = []; this.pending = []; this.hasSig = false; this.last = null; this.cents = null; this.okSince = 0; this.textAt = 0;
    this.near = -1; this.lock = null; this.ok.clear();
  },
  inst() { return INSTRUMENTS.find(x => x.id === S.instrument) || INSTRUMENTS[0]; },
  tuningDef() {
    const inst = this.inst();
    return inst.tunings.find(x => x.id === S.tuning) || (S.tuning === 'custom' ? null : inst.tunings[0]);
  },
  tuning() {
    const inst = this.inst(), tu = this.tuningDef();
    if (tu) return tu.n;
    if (!S.customs[inst.id] || S.customs[inst.id].length !== inst.tunings[0].n.length) S.customs[inst.id] = inst.tunings[0].n.slice();
    return S.customs[inst.id];
  },
  /** Listen low enough for the lowest string (5-string bass: B0 ≈ 31 Hz). */
  applyRange() {
    const lo = Math.min(...this.tuning());
    Pitch.configure(S.tunerMode === 'chromatic' ? 26 : Math.min(45, midiFreq(lo, S.a4) * 0.75));
  },
  /** strings that share the pitch of string i (12-string and mandolin courses) */
  same(i) { const tun = this.tuning(), m = tun[i]; return tun.map((x, k) => x === m ? k : -1).filter(k => k >= 0); },
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

  /**
   * Headstock drawn for the chosen instrument: pegs on the left (bass side, nearest the nut first)
   * and on the right (treble side, nearest the nut last); a 5-string banjo's short string has its
   * peg on the side of the neck.
   */
  headstock() {
    const inst = this.inst(), tun = this.tuning(), lay = inst.layout, n = tun.length;
    const first = lay.side ? 1 : 0;
    const rows = Math.max(lay.l, lay.r);
    const sp = rows > 4 ? 48 : 56, pr = rows > 4 ? 21 : 25;
    const top = 30, nutY = top + 34 + rows * sp, H = nutY + (lay.side ? 92 : 40);
    const pos = [];                                    // [postX, postY, pegX, pegY]
    for (let j = 0; j < lay.l; j++) { const y = nutY - 34 - j * sp; pos[first + j] = [118, y, 52, y]; }
    for (let j = 0; j < lay.r; j++) { const y = nutY - 34 - (lay.r - 1 - j) * sp; pos[first + lay.l + j] = [202, y, 268, y]; }
    if (lay.side) pos[0] = [124, nutY + 54, 52, nutY + 54];
    const nutX = k => 132 + (n === 1 ? 0 : (56 * k) / (n - 1));
    let s = `<svg class="headstock" viewBox="0 0 320 ${H}" xmlns="http://www.w3.org/2000/svg">
      <rect x="114" y="${nutY}" width="92" height="${H - nutY}" class="hs-neck"/>
      <path d="M104 ${nutY + 4} L96 ${top + 30} Q96 ${top - 4} 160 ${top - 8} Q224 ${top - 4} 224 ${top + 30} L216 ${nutY + 4} Z" class="hs-body"/>
      <rect x="104" y="${nutY - 4}" width="112" height="8" rx="2" class="hs-nut"/>`;
    for (let i = 0; i < n; i++) {
      const [px, py, gx, gy] = pos[i];
      s += `<line x1="${px}" y1="${py}" x2="${gx}" y2="${gy}" class="hs-shaft"/>`;
      const w = Math.max(0.8, 1.9 - (tun[i] - 28) / 40);
      if (lay.side && i === 0) s += `<line x1="${px}" y1="${py}" x2="${px + 6}" y2="${H}" class="hs-string" style="stroke-width:${w}"/>`;
      else s += `<line x1="${nutX(i)}" y1="${H}" x2="${nutX(i)}" y2="${nutY}" class="hs-string" style="stroke-width:${w}"/>
        <line x1="${nutX(i)}" y1="${nutY}" x2="${px}" y2="${py}" class="hs-string" style="stroke-width:${w}"/>`;
      s += `<circle cx="${px}" cy="${py}" r="5.5" class="hs-post"/>`;
    }
    for (let i = 0; i < n; i++) {
      const [, , gx, gy] = pos[i], m = tun[i], left = gx < 160;
      const cls = [this.lock != null && tun[this.lock] === m || this.pipeString === i ? 'lock' : '',
        this.near >= 0 && tun[this.near] === m ? 'near' : '', this.ok.has(i) ? 'ok' : ''].join(' ');
      s += `<g class="peg ${cls}" data-a="tstr" data-v="${i}">
        <circle cx="${gx}" cy="${gy}" r="${pr}" class="peg-c"/>
        <text x="${gx}" y="${gy + 3}" text-anchor="middle" class="peg-n" style="font-size:${pr > 22 ? 19 : 16}px">${nn(m)}<tspan class="peg-o" dy="-8">${Math.floor(m / 12) - 1}</tspan></text>
        <text x="${gx}" y="${gy + pr * 0.66}" text-anchor="middle" class="peg-h">${(Math.round(this.f(m) * 10) / 10)}</text>
        <g class="peg-ok"><circle cx="${gx + (left ? -1 : 1) * (pr - 6)}" cy="${gy - pr + 7}" r="8.5"/><path d="M${gx + (left ? -1 : 1) * (pr - 6) - 4.5} ${gy - pr + 7}l3 3 5.5-6"/></g>
      </g>`;
    }
    return s + '</svg>';
  },

  render() {
    const running = Pitch.running, view = S.tunerView, inst = this.inst(), tun = this.tuning();
    this.applyRange();
    $('#tab-tuner').innerHTML = `
      <div class="card tunerhero" id="thero" data-st="${running ? 'listen' : 'idle'}">
        <div class="tview">${seg('tview', [['needle', t('needle')], ['strobe', t('strobeWheel')], ['bands', t('strobeBands')]], view)}</div>
        ${view === 'strobe' ? `<canvas class="strobe" id="strobe"></canvas>` : view === 'bands' ? `<canvas class="strobe bands" id="strobe"></canvas>` : this.dial()}
        <div class="tnoterow">
          <span class="tside" id="tnFlat">♭</span>
          <div class="tnote"><b id="tnName">–</b><sub id="tnOct"></sub></div>
          <span class="tside" id="tnSharp">♯</span>
        </div>
        <div class="tcents" id="tnCents">${running ? '' : '&nbsp;'}</div>
        <div class="tstatus" id="tnStatus">${running ? t('listen') : t('tapStart')}</div>
        <div class="tchips"><span id="tnHz">— Hz</span><span id="tnTarget">${S.a4.toFixed(1)} Hz A4</span></div>
        ${S.tunerHist ? '<canvas class="history" id="thist"></canvas>' : ''}
        <div class="level"><i id="tlevel"></i></div>
        <div class="tinput" id="tinput">${running ? this.inputHtml() : ''}</div>
        <button class="btn ${running ? '' : 'primary'} tgo" data-a="tstart">${running ? I.stop + t('stopTuner') : I.mic + t('startTuner')}</button>
      </div>
      <div class="card">
        <div class="lbl" style="margin-top:0">${t('instrument')}</div>
        <select id="tinst">${INSTRUMENTS.map(x => `<option value="${x.id}" ${x.id === inst.id ? 'selected' : ''}>${L(x)}</option>`).join('')}</select>
        <div class="lbl">${t('tuning')}</div>
        <select id="ttuning">${inst.tunings.map(x => `<option value="${x.id}" ${x === this.tuningDef() ? 'selected' : ''}>${L(x)}${inst.id === 'guitar' ? ' – ' + x.n.map(m => nn(m)).join(' ') : ''}</option>`).join('')}
          <option value="custom" ${S.tuning === 'custom' ? 'selected' : ''}>${t('customT')}</option></select>
        ${S.tuning === 'custom' ? `<div class="custom" style="grid-template-columns:repeat(${Math.min(6, tun.length)},1fr)">${tun.map((m, i) => `<div><button data-a="tcust" data-v="${i},1">▲</button><b>${midiName(m)}</b><button data-a="tcust" data-v="${i},-1">▼</button></div>`).join('')}</div>` : ''}
        <div style="margin-top:12px">${seg('tmode', [['guitar', inst.short ? L(inst.short) : L(inst)], ['chromatic', t('chromatic')]], S.tunerMode)}</div>
        ${this.headstock()}
        <div class="small muted" style="text-align:center;margin-top:-4px">${this.pipeOn ? t('pipeDesc') : (S.tunerMode === 'guitar' ? t('lockHint') : t('pipeDesc'))}</div>
        <div class="setrow" style="margin-top:6px;padding-bottom:0;border:0"><div>${t('pipe')}<small>${t('pipeDesc')}</small></div>
          <label class="switch"><input type="checkbox" id="tpipe" ${this.pipeOn ? 'checked' : ''}><span></span></label></div>
      </div>
      <div class="card">
        <div class="setrow"><div>${t('calib')}</div>
          <div class="stepper"><button data-a="ta4" data-v="-0.5">−</button><span>${S.a4.toFixed(1)} Hz</span><button data-a="ta4" data-v="0.5">+</button></div></div>
        <div class="setrow"><div>${t('histOpt')}<small>${t('histOptD')}</small></div>
          <label class="switch"><input type="checkbox" id="thistopt" ${S.tunerHist ? 'checked' : ''}><span></span></label></div>
        <div class="setrow"><div>${t('inLabel')}<small>${t('inLabelD')}</small></div>
          <select id="tinsel" class="tinsel"><option value="">${t('inAuto')}</option></select></div>
        <div class="setrow"><div>${t('sens')}<small>${t('sensD')}</small></div>
          <input type="range" id="tsens" min="0" max="1" step="0.05" value="${S.tunerSens}" style="width:45%"></div>
        <div class="setrow"><div style="flex:1">${t('temperament')}
          <select id="ttemp" style="margin-top:6px">${TEMPER_GROUPS.map(g => `<optgroup label="${esc(L(g))}">${TEMPERAMENTS.filter(x => x.g === g.id).map(x => `<option value="${x.id}" ${x.id === S.temp ? 'selected' : ''}>${L(x)}</option>`).join('')}</optgroup>`).join('')}</select>
          <small style="margin-top:6px">${esc(L(this.temp().d))}</small></div></div>
        ${S.temp !== 'equal' ? `<div class="lbl">${t('tempRoot')}</div>${rootGrid('ttroot', S.tempRoot)}` : ''}
      </div>`;
    $('#ttuning').addEventListener('change', e => { S.tuning = e.target.value; this.resetReading(); saveS(); this.render(); });
    $('#tinst').addEventListener('change', e => {
      S.instrument = e.target.value; S.tuning = this.inst().tunings[0].id; Snd.setTimbre(S.instrument);
      this.resetReading(); this.stopPipe(); saveS(); this.render();
    });
    $('#ttemp').addEventListener('change', e => { S.temp = e.target.value; saveS(); this.render(); });
    $('#tpipe').addEventListener('change', e => { this.pipeOn = e.target.checked; if (!this.pipeOn) this.stopPipe(); this.render(); });
    $('#thistopt').addEventListener('change', e => { S.tunerHist = e.target.checked; saveS(); this.render(); });
    $('#tsens').addEventListener('input', e => { S.tunerSens = +e.target.value; this.applyGate(); saveS(); });
    $('#tinsel').addEventListener('change', e => this.chooseInput(e.target.value));
    this.fillInputSelect();
    this.canvas = $('#thist');
    if (this.hasSig && this.last) this.show(this.last);
    if (running) { const ti = $('#tinput'); if (ti) ti.dataset.h = ''; this.paintInput(); }
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

  /* which input the tuner is listening to (Android tells us), and a picker when there is a choice */
  inputs: null, devs: [],
  readInputs() {
    try { this.inputs = AND && AND.audioInputs ? JSON.parse(AND.audioInputs()) : null; } catch (e) { this.inputs = null; }
  },
  async listDevices() {
    try { this.devs = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'audioinput' && d.deviceId && d.label); } catch (e) { this.devs = []; }
  },
  inputHtml() {
    const inp = this.inputs, act = inp && inp.active && inp.active[0];
    const ext = inp && inp.available ? inp.available.filter(d => d.type !== 'builtin') : [];
    const name = d => d.type === 'builtin' ? t('inBuiltin') : d.type === 'usb' ? t('inUsb') + (d.name ? ` · ${esc(d.name)}` : '') : d.type === 'headset' ? t('inHeadset') : d.type === 'bluetooth' ? t('inBt') : t('inOther');
    let h = '';
    if (act) h += `<span class="tin ${act.type === 'builtin' ? '' : 'ext'}">${act.type === 'builtin' ? I.mic : I.plug}${t('inListening')}: <b>${name(act)}</b></span>`;
    else if (!AND) h += `<span class="tin">${I.mic}${t('inListening')}: <b>${t('inDefault')}</b></span>`;
    if (act && act.type === 'builtin' && ext.length) h += `<div class="tinwarn">${t('inNotUsed', { d: name(ext[0]) })}</div>`;
    return h;
  },
  paintInput() {
    const el = $('#tinput'); if (!el) return;
    const h = this.inputHtml();
    if (el.dataset.h === h) return;
    el.dataset.h = h; el.innerHTML = h;
  },
  /** the input selector in the settings card: Automatic + the inputs the system offers */
  inputName(d) { return d.type === 'builtin' ? t('inBuiltin') : d.type === 'usb' ? t('inUsb') + (d.name ? ` · ${d.name}` : '') : d.type === 'headset' ? t('inHeadset') : d.type === 'bluetooth' ? t('inBt') : t('inOther'); },
  INPUT_MATCH: { builtin: /speaker|built|phone|bottom|back|front|mic/i, usb: /usb/i, headset: /headset|wired|line|jack/i, bluetooth: /bluetooth|sco|bt/i },
  /** the deviceId to ask for: a direct choice, or an Android input type matched to the browser's list */
  resolveInput() {
    const v = S.tunerInput || '';
    if (!v) return '';
    if (v.startsWith('android:')) {
      const re = this.INPUT_MATCH[v.slice(8)], d = re && this.devs.find(x => re.test(x.label));
      return d ? d.deviceId : '';
    }
    return this.devs.some(d => d.deviceId === v) ? v : '';
  },
  async fillInputSelect() {
    const sel = $('#tinsel'); if (!sel) return;
    await this.listDevices(); this.readInputs();
    const real = this.devs.filter(d => d.deviceId !== 'default' && d.deviceId !== 'communications');
    let opts = [['', t('inAuto')]];
    if (real.length > 1) opts = opts.concat(real.map((d, i) => [d.deviceId, d.label || t('inN', { n: i + 1 })]));
    else if (this.inputs && this.inputs.available) {
      const seen = new Set();
      this.inputs.available.forEach(d => { if (!seen.has(d.type)) { seen.add(d.type); opts.push(['android:' + d.type, this.inputName({ type: d.type })]); } });
    }
    if (S.tunerInput && !opts.some(o => o[0] === S.tunerInput)) opts.push([S.tunerInput, t('inSaved')]);
    sel.innerHTML = opts.map(([v, l]) => `<option value="${esc(v)}" ${v === (S.tunerInput || '') ? 'selected' : ''}>${esc(l)}</option>`).join('');
  },
  async chooseInput(v) {
    S.tunerInput = v; saveS();
    if (v && !this.resolveInput() && v.startsWith('android:')) toast(t('inNoMatch'));
    if (Pitch.running) {
      Pitch.stop(); await Pitch.start(r => this.onPitch(r), this.resolveInput()); this.applyRange(); this.applyGate();
      setTimeout(() => { this.readInputs(); this.paintInput(); }, 700);
    }
  },
  watchInput(on) {
    clearInterval(this.inputTimer); this.inputTimer = null;
    if (!on) return;
    const tick = () => { this.readInputs(); this.paintInput(); };
    this.listDevices().then(() => { tick(); });
    setTimeout(tick, 500);
    this.inputTimer = setInterval(tick, 2000);
  },

  async toggle() {
    if (Pitch.running) { this.stop(); return; }
    this.applyGate();
    try {
      await this.listDevices();
      await Pitch.start(r => this.onPitch(r), this.resolveInput());
      this.applyRange();
      this.watchInput(true);
    } catch (e) {
      toast(t('micDenied'));
    }
    keepAwake();
    this.render();
  },
  stop() {
    Pitch.stop();
    this.watchInput(false);
    this.freqs = []; this.last = null; this.hasSig = false; this.cents = null;
    keepAwake();
    if (S.tab === 'tuner') this.render();
  },

  HOLD_MS: 2500,          // keep the last reading this long after the note fades
  onPitch(r) {
    const lv = $('#tlevel');
    if (lv) lv.style.width = clamp((r.db + 60) / 50 * 100, 0, 100) + '%';
    const now = performance.now();
    if (!r.freq || r.clarity < 0.8) {
      // the note is fading: hold the last reading, then show "no signal"
      if (this.hasSig && now - this.lastAt > this.HOLD_MS) { this.hasSig = false; this.freqs = []; this.pending = []; this.show(null); }
      return;
    }
    let f = r.freq;
    const med = this.freqs.length ? this.median(this.freqs) : 0;
    if (med) {
      // a reading far from the current note (an octave slip, a stray value or a new string)
      // only takes over once four readings in a row agree
      const c2 = 1200 * Math.log2(f / med);
      if (Math.abs(c2) > 60) {
        // a different note: only switch once a few readings agree (a new string, not a glitch)
        this.pending = (this.pending || []).filter(p => Math.abs(1200 * Math.log2(f / p)) < 40);
        this.pending.push(f);
        if (this.pending.length < 4) return;
        this.freqs = this.pending.slice();
        this.pending = [];
        this.smooth = this.centsFor(this.median(this.freqs));
      } else this.pending = [];
    }
    this.freqs.push(f);
    if (this.freqs.length > 11) this.freqs.shift();
    const fm = this.median(this.freqs);
    if (!this.hasSig) this.smooth = this.centsFor(fm);     // first reading: no swing in from the old position
    this.last = fm; this.lastAt = now; this.hasSig = true;
    this.show(fm);
  },
  median(a) { const b = a.slice().sort((x, y) => x - y); return b[b.length >> 1]; },
  /** cents from the string or note the tuner would aim for */
  centsFor(f) {
    const m = S.tunerMode === 'guitar' ? this.tuning()[this.pickString(f)] : this.nearestNote(f);
    return this.centsTo(f, m);
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
    const tf = this.f(m), raw = this.centsTo(f, m);
    this.cents = raw;
    const now = performance.now();
    if (this.textAt && now - this.textAt < 140 && this.textNote === m) return;
    this.textAt = now; this.textNote = m;
    const cents = Math.abs(this.smooth - raw) < 30 ? this.smooth : raw;
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

    if (S.tunerMode === 'guitar') {
      if (string !== this.near) {
        this.near = string;
        const grp = this.same(string);
        document.querySelectorAll('.peg').forEach((b, i) => b.classList.toggle('near', grp.includes(i)));
      }
      if (inTune) {
        if (!this.okSince) this.okSince = performance.now();
        if (performance.now() - this.okSince > 600 && !this.ok.has(string)) {
          this.same(string).forEach(k => {
            this.ok.add(k);
            const b = document.querySelectorAll('.peg')[k];
            if (b) b.classList.add('ok');
          });
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
      if (live) {
        // smoothed pitch (time constant ≈ 0.2 s) – steady, yet quick enough to tune with
        this.smooth += (this.cents - this.smooth) * (1 - Math.exp(-dt / 0.2));
        this.hist.push(clamp(this.smooth, -50, 50));
      } else this.hist.push(null);
      if (this.hist.length > 240) this.hist.shift();
      const n = $('#needle');
      if (n) {
        // damped meter movement towards the smoothed value
        if (live) this.disp += (clamp(this.smooth, -55, 55) - this.disp) * (1 - Math.exp(-dt / 0.09));
        n.style.transform = `rotate(${(this.disp / 50) * 0.36 * 180}deg)`;
        n.style.opacity = live ? 1 : 0.3;
      }
      // refresh the read-out while a held note is shown
      if (live && performance.now() - (this.textAt || 0) > 150 && this.last) this.show(this.last);
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
    if (S.tunerView === 'bands') { this.drawBands(c, dt, live); return; }
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth, h = c.clientHeight;
    if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    const g = c.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const cs = getComputedStyle(document.documentElement);
    const col = v => cs.getPropertyValue(v).trim();
    const fresh = live && performance.now() - this.lastAt < 300;
    const cents = fresh ? clamp(this.smooth, -60, 60) : 0;
    const inTune = live && Math.abs(this.smooth) < 1;
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 10;
    const rings = [{ n: 18, k: 1, r0: 0.40, r1: 0.58 }, { n: 36, k: 2, r0: 0.62, r1: 0.79 }, { n: 72, k: 4, r0: 0.83, r1: 1 }];
    // face
    g.fillStyle = col('--card2');
    g.beginPath(); g.arc(cx, cy, R + 6, 0, Math.PI * 2); g.fill();
    const on = !live ? col('--fret') : inTune ? col('--good') : col('--accent');
    if (inTune) { g.shadowColor = col('--good'); g.shadowBlur = 18; }
    rings.forEach((rg, i) => {
      // periods per second: 0.05 per cent on the inner ring
      if (fresh) this.strobeOff[i] = (this.strobeOff[i] + cents * 0.05 * rg.k * dt) % 1;
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

  /**
   * Band strobe: three horizontal bands of stripes that drift right when sharp and left when
   * flat; the finer bands move faster. They stand still and turn green when in tune.
   */
  drawBands(c, dt, live) {
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth, h = c.clientHeight;
    if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    const g = c.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const cs = getComputedStyle(document.documentElement);
    const col = v => cs.getPropertyValue(v).trim();
    const fresh = live && performance.now() - this.lastAt < 300;
    const cents = fresh ? clamp(this.smooth, -60, 60) : 0;
    const inTune = live && Math.abs(this.smooth) < 1;
    const bands = [{ p: 56, k: 1 }, { p: 28, k: 2 }, { p: 14, k: 4 }];
    const top = 12, gap = 7, bh = (h - top * 2 - gap * 2) / 3;
    const rr = (x, y, ww, hh, r) => { g.beginPath(); g.roundRect ? g.roundRect(x, y, ww, hh, r) : g.rect(x, y, ww, hh); };
    rr(0, 0, w, h, 16); g.fillStyle = col('--card2'); g.fill();
    const on = !live ? col('--fret') : inTune ? col('--good') : col('--accent');
    bands.forEach((b, i) => {
      // pixels per second: about 2.4 px/s per cent on the coarse band
      if (fresh) this.strobeOff[i] = (this.strobeOff[i] + cents * 2.4 * b.k * dt) % b.p;
      const y = top + i * (bh + gap);
      g.save();
      rr(10, y, w - 20, bh, 9); g.fillStyle = col('--card'); g.fill(); g.clip();
      g.fillStyle = on; g.globalAlpha = live ? 1 : 0.55;
      if (inTune) { g.shadowColor = col('--good'); g.shadowBlur = 12; }
      let off = this.strobeOff[i];
      if (off < 0) off += b.p;
      for (let x = off - b.p; x < w; x += b.p) { rr(x + 1, y, b.p / 2 - 2, bh, Math.min(4, b.p / 6)); g.fill(); }
      g.restore();
    });
    g.fillStyle = col('--ink');
    g.beginPath(); g.moveTo(w / 2 - 7, 0); g.lineTo(w / 2 + 7, 0); g.lineTo(w / 2, 9); g.fill();
    g.beginPath(); g.moveTo(w / 2 - 7, h); g.lineTo(w / 2 + 7, h); g.lineTo(w / 2, h - 9); g.fill();
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
        const cu = this.tuning();
        cu[i] = clamp(cu[i] + d, 21, 88);
        this.ok.delete(i);
        saveS(); this.render();
        break;
      }
      default: return false;
    }
    return true;
  },
  seg(k, v) {
    if (k === 'tmode') { S.tunerMode = v; this.resetReading(); this.applyRange(); }
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

/* -------------------------------------------------------------------------
   Practice: a start page with separate screens – metronome and quizzes.
   ------------------------------------------------------------------------- */
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/** correct answer plus distinct distractors, shuffled; returns {options, correct} */
function choices(correct, pool, n = 4) {
  const opts = [correct];
  for (const p of shuffle(pool)) { if (opts.length >= n) break; if (!opts.includes(p)) opts.push(p); }
  const o = shuffle(opts);
  return { options: o, correct: o.indexOf(correct) };
}
const INTERVAL_NAMES = {
  en: ['Unison', 'Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Tritone', 'Perfect 5th', 'Minor 6th', 'Major 6th', 'Minor 7th', 'Major 7th', 'Octave'],
  sv: ['Prim', 'Liten sekund', 'Stor sekund', 'Liten ters', 'Stor ters', 'Ren kvart', 'Tritonus', 'Ren kvint', 'Liten sext', 'Stor sext', 'Liten septima', 'Stor septima', 'Oktav'],
};
const semis = n => n === 1 ? t('qSemi1') : t('qSemis', { n });
const ivName = n => (INTERVAL_NAMES[lang()] || INTERVAL_NAMES.en)[n];
const QUIZ_KEYS = [0, 7, 2, 9, 4, 11, 6, 5, 10, 3, 8];          // major keys with tidy spellings
const majorNames = r => spellScale(r, SCALES.find(x => x.id === 'major'));

/** A small fretboard (frets 0–12) for the note quizzes. */
function quizBoard(tu, o = {}) {
  const N = tu.n.length, F = o.frets || 12, nut = 30, fw = 40, top = 20, sy = N > 5 ? 34 : 40;
  const W = nut + F * fw + 10, H = top + sy * (N - 1) + 26;
  const X = x => S.lefty ? W - x : x, Y = s => top + (N - 1 - s) * sy;
  const fx = f => f === 0 ? nut - 15 : nut + (f - 0.5) * fw;
  let g = `<svg class="qboard" viewBox="0 0 ${W} ${H}"${o.maxScale ? ` style="max-width:${Math.round(W * o.maxScale)}px"` : ''} xmlns="http://www.w3.org/2000/svg">`;
  g += `<rect x="${Math.min(X(nut), X(nut + F * fw))}" y="${top - 7}" width="${F * fw}" height="${sy * (N - 1) + 14}" rx="4" style="fill:var(--wood)"/>`;
  [3, 5, 7, 9, 15].filter(f => f <= F).forEach(f => { g += `<circle cx="${X(nut + (f - 0.5) * fw)}" cy="${top + sy * (N - 1) / 2}" r="4" style="fill:var(--fret)" opacity=".7"/>`; });
  if (F >= 12) g += `<circle cx="${X(nut + 11.5 * fw)}" cy="${top + sy * (N - 1) * 0.25}" r="4" style="fill:var(--fret)" opacity=".7"/><circle cx="${X(nut + 11.5 * fw)}" cy="${top + sy * (N - 1) * 0.75}" r="4" style="fill:var(--fret)" opacity=".7"/>`;
  for (let f = 0; f <= F; f++) {
    g += `<line x1="${X(nut + f * fw)}" x2="${X(nut + f * fw)}" y1="${top - 7}" y2="${top + sy * (N - 1) + 7}" style="stroke:${f ? 'var(--fret)' : 'var(--ink)'}" stroke-width="${f ? 2 : 4}"/>`;
    if (f && !o.noNums) g += `<text x="${X(nut + (f - 0.5) * fw)}" y="${H - 3}" font-size="10" text-anchor="middle" style="fill:var(--muted)">${f}</text>`;
  }
  if (o.names) for (let s = 0; s < N; s++) g += `<text x="${X(5)}" y="${Y(s) + 3.5}" font-size="10" font-weight="700" text-anchor="middle" style="fill:var(--muted)">${nn(tu.n[s] + tu.start[s])}</text>`;
  for (let s = 0; s < N; s++) {
    const x0 = tu.start[s] ? nut + (tu.start[s] - 0.5) * fw : nut - (o.names ? 20 : 26);
    const hot = o.string === s;
    g += `<line x1="${X(x0)}" x2="${X(nut + F * fw)}" y1="${Y(s)}" y2="${Y(s)}" style="stroke:${hot ? 'var(--accent)' : 'var(--str)'}" stroke-width="${hot ? 3 : clamp(0.8 + (66 - tu.n[s] - tu.start[s]) / 20, 0.8, 2.6)}"/>`;
  }
  if (o.tap) for (let s = 0; s < N; s++) {
    if (o.string != null && s !== o.string) continue;
    for (let f = tu.start[s]; f <= F; f++) {
      const x0 = f === 0 ? nut - 30 : nut + (f - 1) * fw, w = f === 0 ? 30 : fw;
      g += `<rect data-a="qtap" data-v="${s},${f}" x="${Math.min(X(x0), X(x0 + w))}" y="${Y(s) - sy / 2}" width="${w}" height="${sy}" fill="transparent" style="cursor:pointer"/>`;
    }
  }
  (o.dots || []).forEach((d, di) => {
    g += `<g class="fd" data-i="${di}">`;
    const r = d.small ? 11 : 14, fs = d.small ? (String(d.label).length > 1 ? 9.5 : 11) : 14;
    g += `<circle cx="${X(fx(d.f))}" cy="${Y(d.s)}" r="${r}" style="fill:${d.color || 'var(--accent)'};pointer-events:none"/>`;
    if (d.label) g += `<text x="${X(fx(d.f))}" y="${Y(d.s) + fs * 0.36}" font-size="${fs}" font-weight="700" text-anchor="middle" style="fill:${d.ink || '#fff'};pointer-events:none">${d.label}</text>`;
    g += '</g>';
  });
  return g + '</svg>';
}
/** the notes from the open string up to the answer, as small dots on the board */
const walkDots = (tu, s, f) => { const o = []; for (let k = tu.start[s]; k < f; k++) o.push({ s, f: k, label: nn(tu.n[s] + k), small: true, color: 'var(--accent-soft)', ink: 'var(--accent)' }); return o; };
function quizTuning() {
  const insts = scaleInstruments().filter(x => !x.fretless);
  const si = insts.find(x => x.id === S.quizInst) || insts[0];
  return { si, tu: si.tunings[0], insts };
}

/*
 * Quizzes. make() returns a question: {prompt (html), options (labels) + correct (index) – or
 * tap: true with check(value) for fretboard taps – play() for ear training, reveal() html shown
 * after answering, answerText for "That was …"}.
 */
/* ---------- explanations shown after each answer ---------- */
const X = (en, sv) => lang() === 'sv' ? sv : en;
const exChips = items => `<div class="notes exchips">${items.map(([n, l, hi]) => `<div class="note ${hi ? 'r' : ''}"><b>${n}</b><span>${l}</span></div>`).join('')}</div>`;
const TYPE_INFO = {
  '':     ['A major chord is the root, the major 3rd and the 5th (1 – 3 – 5). The major 3rd, four semitones up, gives the bright sound.',
           'Ett durackord är grundton, stor ters och kvint (1 – 3 – 5). Den stora tersen, fyra halvtoner upp, ger den ljusa klangen.'],
  'm':    ['A minor chord has a minor 3rd (♭3, three semitones up) instead of a major 3rd: 1 – ♭3 – 5. That single semitone makes it sound darker.',
           'Ett mollackord har en liten ters (♭3, tre halvtoner upp) i stället för stor ters: 1 – ♭3 – 5. Det enda halvtonssteget gör det mörkare.'],
  '7':    ['A dominant 7th chord is a major chord plus the ♭7, two semitones below the octave: 1 – 3 – 5 – ♭7. It sounds bluesy and wants to move on.',
           'Ett septimaackord är ett durackord plus ♭7, två halvtoner under oktaven: 1 – 3 – 5 – ♭7. Det låter bluesigt och vill vidare.'],
  'maj7': ['A major 7th chord is a major chord plus the major 7th, one semitone below the octave: 1 – 3 – 5 – 7. Soft and dreamy.',
           'Ett ackord med stor septima är ett durackord plus stor septima, en halvton under oktaven: 1 – 3 – 5 – 7. Mjukt och drömskt.'],
  'm7':   ['A minor 7th chord is a minor chord plus the ♭7: 1 – ♭3 – 5 – ♭7. Mellow – very common in soul, funk and jazz.',
           'Ett mollackord med septima är ett mollackord plus ♭7: 1 – ♭3 – 5 – ♭7. Mjukt – mycket vanligt i soul, funk och jazz.'],
  '5':    ['A power chord is only the root and the 5th (often with the octave). With no 3rd it is neither major nor minor.',
           'Ett kvintackord är bara grundton och kvint (ofta med oktaven). Utan ters är det varken dur eller moll.'],
  'sus2': ['sus2 swaps the 3rd for the 2nd: 1 – 2 – 5. Open and airy.', 'sus2 byter tersen mot sekunden: 1 – 2 – 5. Öppet och luftigt.'],
  'sus4': ['sus4 swaps the 3rd for the 4th: 1 – 4 – 5. It sounds unfinished and usually moves on to the major chord.',
           'sus4 byter tersen mot kvarten: 1 – 4 – 5. Det låter ofärdigt och går oftast vidare till durackordet.'],
  'add9': ['add9 is a major chord with the 9th added (the 2nd, an octave up): 1 – 3 – 5 – 9.', 'add9 är ett durackord med tillagd nona (sekunden en oktav upp): 1 – 3 – 5 – 9.'],
  '6':    ['A 6 chord is a major chord with the 6th added: 1 – 3 – 5 – 6.', 'Ett sextackord är ett durackord med tillagd sext: 1 – 3 – 5 – 6.'],
  'dim':  ['A diminished chord stacks two minor 3rds: 1 – ♭3 – ♭5. Tense and unstable.', 'Ett förminskat ackord staplar två små terser: 1 – ♭3 – ♭5. Spänt och instabilt.'],
  'aug':  ['An augmented chord stacks two major 3rds: 1 – 3 – ♯5. It sounds floating and unresolved.', 'Ett överstigande ackord staplar två stora terser: 1 – 3 – ♯5. Det låter svävande och olöst.'],
};
const SOUND = {
  '': ['bright and stable', 'ljust och stabilt'], 'm': ['darker, a little sad', 'mörkare, lite sorgset'], '7': ['bluesy, wants to move on', 'bluesigt, vill vidare'],
  'maj7': ['soft and dreamy', 'mjukt och drömskt'], 'm7': ['mellow and relaxed', 'mjukt och avslappnat'], 'dim': ['tense and unstable', 'spänt och instabilt'],
  'aug': ['floating, unresolved', 'svävande, olöst'], 'sus4': ['open, waiting to resolve to major', 'öppet, väntar på att lösas upp till dur'],
};
const IV_SONG = {
  1: ['the Jaws theme', 'Hajen-temat'], 2: ['the start of Happy Birthday', 'början av Happy Birthday'], 3: ['the start of Greensleeves', 'början av Greensleeves'],
  4: ['the start of When the Saints Go Marching In', 'början av When the Saints Go Marching In'], 5: ['Here Comes the Bride', 'Here Comes the Bride (brudmarschen)'],
  6: ['The Simpsons theme', 'Simpsons-temat'], 7: ['Twinkle Twinkle Little Star', 'Blinka lilla stjärna'], 8: ['The Entertainer', 'The Entertainer'],
  9: ['My Bonnie Lies Over the Ocean', 'My Bonnie Lies Over the Ocean'], 10: ['the original Star Trek theme', 'det gamla Star Trek-temat'],
  11: ['the chorus of Take On Me', 'refrängen i Take On Me'], 12: ['Somewhere Over the Rainbow', 'Somewhere Over the Rainbow'],
};
const pair = a => a ? X(a[0], a[1]) : '';
const typeInfo = ti => TYPE_INFO[TYPES[ti].sfx] ? pair(TYPE_INFO[TYPES[ti].sfx])
  : X('Formula: ', 'Formel: ') + TYPES[ti].req.concat(TYPES[ti].opt).sort((a, b) => a - b).map(s => intervalLabel(ti, s)).join(' – ');
function chordChips(r, ti) {
  const sp = chordSpell(r, ti);
  return exChips(TYPES[ti].req.concat(TYPES[ti].opt).sort((a, b) => a - b).map(s => [nn(r + s, sp), intervalLabel(ti, s), s === 0]));
}
/** a small piano keyboard: marks [{m: midi, t: label, k: 'r' root | 'a' highlight | 'n' plain mark}] */
function keysSvg(marks, lo, hi) {
  const isB = m => [1, 3, 6, 8, 10].includes(mod12(m));
  const ms = marks.map(x => x.m);
  lo = Math.min(lo != null ? lo : Math.min(...ms), ...ms); hi = Math.max(hi != null ? hi : Math.max(...ms), ...ms);
  if (hi - lo < 12) hi = lo + 12;                       // at least an octave, so the keys keep their size
  while (isB(lo)) lo--; while (isB(hi)) hi++;
  const ww = 26, wh = 92, bw = 16, bh = 56;
  const whites = []; for (let m = lo; m <= hi; m++) if (!isB(m)) whites.push(m);
  const W = whites.length * ww + 2, xw = m => 1 + whites.indexOf(m) * ww;
  const mk = new Map(marks.map(x => [x.m, x]));
  const fill = x => x.k === 'r' ? 'var(--root)' : x.k === 'a' ? 'var(--accent)' : 'var(--accent-soft)';
  const ink = x => x.k === 'n' ? 'var(--accent)' : '#fff';
  let g = `<svg class="qkeys" viewBox="0 0 ${W} ${wh + 2}" xmlns="http://www.w3.org/2000/svg">`;
  whites.forEach(m => {
    g += `<rect x="${xw(m)}" y="1" width="${ww - 2}" height="${wh}" rx="4" style="fill:#fbfaf7;stroke:var(--line)"/>`;
    const x = mk.get(m);
    if (x) g += `<g class="km" data-m="${m}"><circle cx="${xw(m) + ww / 2 - 1}" cy="${wh - 15}" r="10.5" style="fill:${fill(x)}"/><text x="${xw(m) + ww / 2 - 1}" y="${wh - 11}" font-size="${String(x.t).length > 2 ? 8 : 10.5}" font-weight="700" text-anchor="middle" style="fill:${ink(x)}">${x.t}</text></g>`;
  });
  for (let m = lo; m <= hi; m++) if (isB(m)) {
    const x0 = xw(m - 1) + ww - 1 - bw / 2;
    g += `<rect x="${x0}" y="1" width="${bw}" height="${bh}" rx="3" style="fill:#2b2a28"/>`;
    const x = mk.get(m);
    if (x) g += `<g class="km" data-m="${m}"><circle cx="${x0 + bw / 2}" cy="${bh - 12}" r="8.5" style="fill:${fill(x)}"/><text x="${x0 + bw / 2}" y="${bh - 8.5}" font-size="${String(x.t).length > 2 ? 7 : 9}" font-weight="700" text-anchor="middle" style="fill:${ink(x)}">${x.t}</text></g>`;
  }
  return g + '</svg>';
}
/** keyboard marks for the notes of a major key (labels = degree numbers or names) */
const scaleKeys = (r, iv, label, hiIdx) => iv.map((x, k) => ({ m: 60 + r + x, t: label(k, x), k: k === 0 ? 'r' : k === hiIdx ? 'a' : 'n' }));
/** pitch class → 1, 3, 5 … for a chord */
const ivLabels = (r, ti) => new Map(TYPES[ti].req.concat(TYPES[ti].opt).map(x => [mod12(r + x), intervalLabel(ti, x)]));
/** guitar chart of a chord with 1·3·5 on the dots */
function chordChart(r, ti, inst) {
  inst = inst || CHORD_INSTS[0];
  const v = voicings(r, ti, null, inst)[0];
  return v ? `<div class="diagwrap qvis">${diagram(v, r, { cls: 'big', tuning: inst.n, dot: 'interval', labels: ivLabels(r, ti), spell: chordSpell(r, ti) })}</div>` : '';
}
/** notes from the open string up to fret f, one semitone per fret */
function stringWalk(open, from, f) {
  const out = [];
  for (let k = from; k <= f; k++) out.push([nn(open + k), k === 0 ? X('open', 'lös') : String(k), k === f]);
  return exChips(out);
}

/* ---------- difficulty levels: 0 novice, 1 intermediate, 2 advanced, 3 expert ---------- */
const LEVEL_NAMES = { en: ['Novice', 'Medium', 'Advanced', 'Expert'], sv: ['Nybörjare', 'Medel', 'Avancerad', 'Expert'] };
const levelName = i => (LEVEL_NAMES[lang()] || LEVEL_NAMES.en)[i];
const qLevel = id => clamp(((S.qlevels || {})[id]) | 0, 0, 3);
const lvl = () => QuizRun.lvl | 0;
const tIdx = list => list.map(typeIndex).filter(i => i >= 0);
const NATURALS = [0, 2, 4, 5, 7, 9, 11];
const isNatural = pc => NATURALS.includes(mod12(pc));
/** keys with few accidentals first: novice ≤ 2, intermediate ≤ 4, then all */
const levelKeys = () => [[0, 7, 2, 5, 10], [0, 7, 2, 9, 4, 5, 10, 3, 8], QUIZ_KEYS, QUIZ_KEYS][lvl()];
/** guitar in standard tuning, for the E and A string quizzes */
const GTR = { n: STD, start: STD.map(() => 0) };
/** well-known spots on the low E (s 0) and A (s 1) strings: the frets with dots */
const LANDMARKS = [0, 3, 5, 7, 9, 12];

const QUIZZES = {
  chords: {
    icon: 'chords', en: 'Name the chord', sv: 'Namnge ackordet', inst: 'chord',
    d: { en: 'A chord chart appears – which chord is it?', sv: 'Ett ackorddiagram visas – vilket ackord är det?' },
    levels: [{ en: 'Open major and minor chords: C, D, E, G, A, Am, Dm, Em', sv: 'Öppna dur- och mollackord: C, D, E, G, A, Am, Dm, Em' },
      { en: 'Major, minor and 7th chords in every key', sv: 'Dur, moll och septimaackord i alla tonarter' },
      { en: 'Adds maj7, m7, sus, power chords – and diminished and augmented', sv: 'Lägger till maj7, m7, sus, kvintackord – och förminskade och överstigande' },
      { en: 'Every type: 6, add9, 9, dim7, m7♭5, mmaj7, 7sus4 …', sv: 'Alla typer: 6, add9, 9, dim7, m7♭5, mmaj7, 7sus4 …' }],
    make() {
      const ci = CI(), L0 = lvl();
      const types = [tIdx(['', 'm']), tIdx(['', 'm', '7']), tIdx(['', 'm', '7', 'maj7', 'm7', '5', 'sus2', 'sus4', 'dim', 'aug']),
        tIdx(['', 'm', '7', 'maj7', 'm7', '5', 'sus2', 'sus4', 'dim', 'aug', '6', 'm6', 'add9', '9', 'dim7', 'm7b5', 'mmaj7', '7sus4'])][L0];
      const BASIC = [[0, ''], [2, ''], [4, ''], [7, ''], [9, ''], [9, 'm'], [2, 'm'], [4, 'm']].map(([r, x]) => ({ r, t: typeIndex(x) }));
      let c, vs;
      do { c = L0 === 0 ? pick(BASIC) : { r: Math.floor(Math.random() * 12), t: pick(types) }; vs = voicings(c.r, c.t, null, ci); } while (!vs.length);
      const v = L0 === 0 ? vs[0] : vs[Math.floor(Math.random() * Math.min(L0 === 1 ? 2 : 3, vs.length))];
      const pool = [];
      if (L0 === 0) BASIC.forEach(b => pool.push(cname(b.r, b.t)));
      else for (let k = 0; k < 12; k++) { pool.push(cname(c.r, pick(types))); pool.push(cname(Math.floor(Math.random() * 12), c.t)); }
      const ch = choices(cname(c.r, c.t), pool);
      return Object.assign(ch, {
        prompt: `<div class="qtext">${t('which')}</div><div class="diagwrap">${diagram(v, -1, { cls: 'big', tuning: ci.n })}</div>`,
        reveal: () => `<div class="diagwrap">${diagram(v, c.r, { cls: 'big', tuning: ci.n, dot: 'interval', labels: ivLabels(c.r, c.t), spell: chordSpell(c.r, c.t) })}</div>`,
        play: () => Snd.chord(v.frets, ci.n, 0), autoplay: false,
        explain: `<b>${cname(c.r, c.t)}</b> – ${X('the chart now shows what each dot is: the red 1 is the root,', 'diagrammet visar nu vad varje prick är: röda 1 är grundtonen,')} <b>${nn(c.r)}</b>. ${typeInfo(c.t)}${chordChips(c.r, c.t)}`,
      });
    },
  },
  noteName: {
    icon: 'note', en: 'Name the note', sv: 'Vilken ton?', inst: 'fret',
    d: { en: 'A dot on the fretboard – which note is it?', sv: 'En prick på greppbrädan – vilken ton är det?' },
    levels: [{ en: 'Natural notes (no ♯ or ♭) on frets 0–5', sv: 'Stamtoner (utan ♯ eller ♭) på band 0–5' },
      { en: 'Natural notes up to fret 12', sv: 'Stamtoner upp till band 12' },
      { en: 'All twelve notes up to fret 12', sv: 'Alla tolv toner upp till band 12' },
      { en: 'All twelve notes, with the fret numbers hidden', sv: 'Alla tolv toner, utan bandnummer' }],
    make() {
      const { tu } = quizTuning(), L0 = lvl(), maxF = L0 === 0 ? 5 : 12, nat = L0 < 2;
      let s, f, m;
      do {
        s = Math.floor(Math.random() * tu.n.length);
        f = tu.start[s] + Math.floor(Math.random() * (maxF + 1 - tu.start[s]));
        m = tu.n[s] + f;
      } while (f < tu.start[s] || (nat && !isNatural(m)));
      const pc = mod12(m), opts = nat ? NATURALS : [...Array(12).keys()];
      return {
        prompt: `<div class="qtext">${t('qWhichNote')}</div>${quizBoard(tu, { dots: [{ s, f, label: '?' }], noNums: L0 === 3 })}`,
        options: opts.map(k => nn(k)), correct: opts.indexOf(pc), grid12: !nat,
        reveal: () => quizBoard(tu, { string: s, dots: walkDots(tu, s, f).concat([{ s, f, label: nn(pc), color: 'var(--good)' }]) }),
        play: () => Snd.pluck(m, 0, -1),
        explain: (f === tu.start[s] ? X(`It is the open string itself: <b>${nn(pc)}</b>.`, `Det är den lösa strängen själv: <b>${nn(pc)}</b>.`)
          : X(`The open string is <b>${nn(tu.n[s] + tu.start[s])}</b>. Every fret is one semitone higher – the board shows every note on the way up to fret ${f}:`,
              `Lösa strängen är <b>${nn(tu.n[s] + tu.start[s])}</b>. Varje band är en halvton högre – greppbrädan visar varje ton på vägen upp till band ${f}:`) + stringWalk(tu.n[s], tu.start[s], f))
          + (f === 12 ? X('Fret 12 is always the open note again, an octave higher.', 'Band 12 är alltid den lösa tonen igen, en oktav högre.') : ''),
      };
    },
  },
  findNote: {
    icon: 'scales', en: 'Find the note', sv: 'Hitta tonen', inst: 'fret',
    d: { en: 'Find a named note on a given string – tap the fret.', sv: 'Hitta en ton på en viss sträng – tryck på bandet.' },
    levels: [{ en: 'Natural notes on frets 0–5', sv: 'Stamtoner på band 0–5' },
      { en: 'Natural notes up to fret 12', sv: 'Stamtoner upp till band 12' },
      { en: 'All twelve notes up to fret 12', sv: 'Alla tolv toner upp till band 12' },
      { en: 'All twelve notes, with the fret numbers hidden', sv: 'Alla tolv toner, utan bandnummer' }],
    make() {
      const { tu } = quizTuning(), L0 = lvl(), maxF = L0 === 0 ? 5 : 12;
      const s = Math.floor(Math.random() * tu.n.length);
      const cand = [];
      for (let f = tu.start[s]; f <= maxF; f++) { const q = mod12(tu.n[s] + f); if ((L0 >= 2 || isNatural(q)) && !cand.includes(q)) cand.push(q); }
      const pc = pick(cand);
      const spots = [];
      for (let f = tu.start[s]; f <= 12; f++) if (mod12(tu.n[s] + f) === pc) spots.push(f);
      const strName = nn(tu.n[s] + tu.start[s]);
      return {
        prompt: `<div class="qtext">${t('qFindNote', { n: `<b>${nn(pc)}</b>`, k: `<b>${tu.n.length - s}</b>`, s: strName })}</div>${quizBoard(tu, { tap: true, string: s, noNums: L0 === 3 })}`,
        tap: true,
        check: v => { const [ss, f] = v.split(',').map(Number); this.tapped = { s: ss, f }; return ss === s && mod12(tu.n[s] + f) === pc; },
        reveal: () => quizBoard(tu, { string: s, dots: walkDots(tu, s, spots[0]).concat(spots.map(f => ({ s, f, label: nn(pc), color: 'var(--good)' })))
          .concat(QUIZZES.findNote.tapped && !spots.includes(QUIZZES.findNote.tapped.f) ? [{ s, f: QUIZZES.findNote.tapped.f, label: '✕', color: 'var(--warn)' }] : []) }),
        answerText: `${nn(pc)}: ${t('fretWord')} ${spots.join(', ')}`,
        play: () => Snd.pluck(tu.n[s] + spots[0], 0, -1),
        explain: X(`Start from the open string (<b>${strName}</b>) and count one semitone per fret until you reach <b>${nn(pc)}</b> – every note on the way is marked on the board:`,
                   `Börja på lösa strängen (<b>${strName}</b>) och räkna en halvton per band tills du når <b>${nn(pc)}</b> – varje ton på vägen är markerad på greppbrädan:`) + stringWalk(tu.n[s], tu.start[s], spots[0])
          + X('Remember: there is no note between E and F, or between B and C.', 'Kom ihåg: det finns ingen ton mellan E och F, eller mellan H och C.'),
      };
    },
  },
  eaNotes: {
    icon: 'note', en: 'Notes on the E and A strings', sv: 'Toner på E- och A-strängen',
    d: { en: 'Learn the two lowest guitar strings by heart – they hold the root of every barre chord and power chord.',
         sv: 'Lär dig gitarrens två lägsta strängar utantill – där ligger grundtonen i alla barréackord och kvintackord.' },
    levels: [{ en: 'Natural notes on frets 0–5', sv: 'Stamtoner på band 0–5' },
      { en: 'Natural notes up to fret 12', sv: 'Stamtoner upp till band 12' },
      { en: 'All twelve notes up to fret 12', sv: 'Alla tolv toner upp till band 12' },
      { en: 'All notes – name them, or find them yourself', sv: 'Alla toner – namnge dem eller hitta dem själv' }],
    make() {
      const L0 = lvl(), maxF = L0 === 0 ? 5 : 12, nat = L0 < 2, tu = GTR;
      const s = Math.floor(Math.random() * 2);                 // 0 = low E, 1 = A
      let f; do { f = Math.floor(Math.random() * (maxF + 1)); } while (nat && !isNatural(tu.n[s] + f));
      const m = tu.n[s] + f, pc = mod12(m), strName = s === 0 ? X('low E', 'låga E') : 'A';
      const marks = (L0 ? LANDMARKS : [0, 3, 5]).map(k => [nn(tu.n[s] + k), k ? String(k) : X('open', 'lös'), k === f]);
      const explain = X(`On the ${strName} string, fret ${f} is <b>${nn(pc)}</b>. Learn the dotted frets first and count from the nearest one:`,
                        `På ${strName}-strängen är band ${f} <b>${nn(pc)}</b>. Lär dig banden med prickar först och räkna från närmaste:`)
        + exChips(marks) + X(`The ${strName} string: `, `${strName}-strängen: `) + stringWalk(tu.n[s], 0, f);
      if (L0 === 3 && Math.random() < 0.5) {               // expert: sometimes find it yourself
        const spots = []; for (let k = 0; k <= 12; k++) if (mod12(tu.n[s] + k) === pc) spots.push(k);
        return {
          prompt: `<div class="qtext">${t('qFindNote', { n: `<b>${nn(pc)}</b>`, k: `<b>${6 - s}</b>`, s: strName })}</div>${quizBoard(tu, { tap: true, string: s })}`,
          tap: true, check: v => { const [ss, ff] = v.split(',').map(Number); return ss === s && mod12(tu.n[s] + ff) === pc; },
          reveal: () => quizBoard(tu, { string: s, dots: spots.map(k => ({ s, f: k, label: nn(pc), color: 'var(--good)' })) }),
          answerText: `${nn(pc)}: ${t('fretWord')} ${spots.join(', ')}`, play: () => Snd.pluck(m, 0, -1), explain,
        };
      }
      const opts = nat ? NATURALS : [...Array(12).keys()];
      return {
        prompt: `<div class="qtext">${X(`Which note is this on the ${strName} string?`, `Vilken ton är det här på ${strName}-strängen?`)}</div>${quizBoard(tu, { string: s, dots: [{ s, f, label: '?' }] })}`,
        options: opts.map(k => nn(k)), correct: opts.indexOf(pc), grid12: !nat,
        reveal: () => quizBoard(tu, { string: s, dots: walkDots(tu, s, f).concat([{ s, f, label: nn(pc), color: 'var(--good)' }]) }),
        play: () => Snd.pluck(m, 0, -1), explain,
      };
    },
  },
  countUp: {
    icon: 'scales', en: 'Count up the neck', sv: 'Räkna upp längs halsen',
    d: { en: 'Start from a note you know and count one fret per semitone – the quickest way to find any note on the fretboard.',
         sv: 'Börja på en ton du kan och räkna ett band per halvton – det snabbaste sättet att hitta vilken ton som helst på greppbrädan.' },
    levels: [{ en: 'From an open string, 1–4 frets up', sv: 'Från en lös sträng, 1–4 band upp' },
      { en: 'From the dotted frets on the E and A strings, 1–4 frets up', sv: 'Från banden med prickar på E- och A-strängen, 1–4 band upp' },
      { en: 'Any string, up or down, 1–5 frets', sv: 'Vilken sträng som helst, upp eller ner, 1–5 band' },
      { en: 'Any string, up or down, 1–7 frets', sv: 'Vilken sträng som helst, upp eller ner, 1–7 band' }],
    make() {
      const L0 = lvl(), tu = GTR;
      let s, from, step;
      do {
        s = L0 < 2 ? (L0 === 0 ? Math.floor(Math.random() * 6) : Math.floor(Math.random() * 2)) : Math.floor(Math.random() * 6);
        from = L0 === 0 ? 0 : L0 === 1 ? pick(LANDMARKS.slice(1, 5)) : pick(LANDMARKS);
        const max = [4, 4, 5, 7][L0];
        step = 1 + Math.floor(Math.random() * max);
        if (L0 >= 2 && Math.random() < 0.4) step = -step;
      } while (from + step < 0 || from + step > 12 || (L0 === 0 && !isNatural(tu.n[s] + from + step)));
      const to = from + step, m0 = tu.n[s] + from, pc = mod12(m0 + step), up = step > 0, n = Math.abs(step);
      const strName = s === 0 ? X('low E', 'låga E') : s === 5 ? X('high E', 'höga E') : nn(tu.n[s]), startName = nn(m0);
      const opts = [...Array(12).keys()];
      const walk = []; for (let k = 0; k <= n; k++) walk.push([nn(m0 + (up ? k : -k)), k ? (up ? '+' : '−') + k : X('start', 'start'), k === n]);
      return {
        prompt: `<div class="qtext">${up
            ? X(`You know <b>${startName}</b>. Count <b>${n}</b> fret${n > 1 ? 's' : ''} up on the ${strName} string – which note is at the <b>?</b>`,
                `Du kan <b>${startName}</b>. Räkna <b>${n}</b> band upp på ${strName}-strängen – vilken ton är vid <b>?</b>`)
            : X(`You know <b>${startName}</b>. Count <b>${n}</b> fret${n > 1 ? 's' : ''} down on the ${strName} string – which note is at the <b>?</b>`,
                `Du kan <b>${startName}</b>. Räkna <b>${n}</b> band ner på ${strName}-strängen – vilken ton är vid <b>?</b>`)}</div>`
          + quizBoard(tu, { string: s, dots: [{ s, f: from, label: startName, color: 'var(--root)' }, { s, f: to, label: '?' }] }),
        options: opts.map(k => nn(k)), correct: pc, grid12: true,
        reveal: () => quizBoard(tu, { string: s, dots: [{ s, f: from, label: startName, color: 'var(--root)' }, { s, f: to, label: nn(pc), color: 'var(--good)' }] }),
        play: () => { const t0 = Snd.now() + 0.05; Snd.pluck(m0, t0, -1); Snd.pluck(m0 + step, t0 + 0.6, -1); },
        explain: X(`Every fret is one semitone. ${up ? 'Up' : 'Down'} from <b>${startName}</b>:`, `Varje band är en halvton. ${up ? 'Uppåt' : 'Nedåt'} från <b>${startName}</b>:`)
          + exChips(walk) + X('Remember: E–F and B–C are only one fret apart – every other pair of letters is two frets.',
                              'Kom ihåg: E–F och H–C ligger bara ett band isär – alla andra bokstavspar är två band.'),
      };
    },
  },
  theory: {
    icon: 'circle', en: 'Scales & keys', sv: 'Skalor & tonarter',
    d: { en: 'Notes of scales, key signatures, chords in a key, modes and intervals.', sv: 'Skalornas toner, förtecken, ackord i tonarter, modus och intervall.' },
    levels: [{ en: 'Notes of a key, key signatures and relative minors – keys with up to 2 ♯ or ♭', sv: 'Toner i en tonart, förtecken och parallelltonarter – tonarter med högst 2 ♯ eller ♭' },
      { en: 'Adds chords in a key and the notes of major and minor chords', sv: 'Lägger till ackord i en tonart och tonerna i dur- och mollackord' },
      { en: 'Adds modes, step patterns, intervals and 7th chords – every key', sv: 'Lägger till modus, stegmönster, intervall och septimaackord – alla tonarter' },
      { en: 'Everything, including diminished and augmented chords', sv: 'Allt, även förminskade och överstigande ackord' }],
    make() {
      const L0 = lvl();
      const kind = pick([['degree', 'degree', 'sig', 'rel'], ['degree', 'sig', 'rel', 'dia', 'dia', 'tones'],
        ['degree', 'sig', 'rel', 'dia', 'tones', 'mode', 'steps', 'interval'], ['degree', 'degree', 'sig', 'rel', 'dia', 'dia', 'tones', 'mode', 'steps', 'interval']][L0]);
      const r = pick(levelKeys()), names = majorNames(r), K = names.get(r);
      const deg = i => names.get(mod12(r + [0, 2, 4, 5, 7, 9, 11][i]));
      const all = [...names.values()];
      const L2 = lang() === 'sv';
      if (kind === 'degree') {
        const i = 1 + Math.floor(Math.random() * 6);
        const ord = (L2 ? ['', 'sekunden', 'tersen', 'kvarten', 'kvinten', 'sexten', 'septiman'] : ['', '2nd', '3rd', '4th', '5th', '6th', '7th'])[i];
        return Object.assign(choices(deg(i), all.concat([nn(r + 1), nn(r + 6), nn(r + 10)])),
          { prompt: `<div class="qtext big">${t('qDegree', { d: ord, k: `<b>${K}</b>` })}</div>`,
            explain: X(`Count along the ${K} major scale – the note numbered ${i + 1} is <b>${deg(i)}</b>:`, `Räkna längs ${K}-durskalan – ton nummer ${i + 1} är <b>${deg(i)}</b>:`)
              + exChips(all.map((n, k) => [n, String(k + 1), k === i])),
            visual: keysSvg(scaleKeys(r, [0, 2, 4, 5, 7, 9, 11], k => k + 1, i)) });
      }
      if (kind === 'sig') {
        const sg = keySignature(r, false), lab = n => n === 0 ? '0' : n + ' ' + sg.acc;
        const ans = lab(sg.n), pool = [1, 2, 3, 4, 5, 6].map(lab).concat(['0']);
        const cw = sg.acc !== '♭';
        const chain = cw ? [0, 7, 2, 9, 4, 11, 6] : [0, 5, 10, 3, 8, 1, 6];
        const steps = chain.slice(0, sg.n + 1).map((pc, k) => [nn(pc, cw ? 's' : 'f'), String(k), k === sg.n]);
        const accs = (cw ? ['F♯', 'C♯', 'G♯', 'D♯', 'A♯', 'E♯'] : ['B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭']).slice(0, sg.n);
        return Object.assign(choices(ans, pool), { prompt: `<div class="qtext big">${t('qSig', { k: `<b>${K}</b>` })}</div>`,
          explain: sg.n === 0 ? X('C major uses only the natural notes – no sharps or flats.', 'C-dur använder bara stamtoner – inga förtecken.')
            : X(`Walk ${cw ? 'clockwise' : 'anticlockwise'} round the circle of fifths from C. Each step adds one ${cw ? 'sharp' : 'flat'}:`,
                `Gå ${cw ? 'medurs' : 'moturs'} runt kvintcirkeln från C. Varje steg lägger till ${cw ? 'ett kors' : 'ett b'}:`) + exChips(steps)
              + X(`So ${K} major has ${sg.n}: <b>${accs.join(' ')}</b> – the black keys on the keyboard.`, `${K}-dur har alltså ${sg.n}: <b>${accs.join(' ')}</b> – de svarta tangenterna på klaviaturen.`),
          visual: keysSvg([0, 2, 4, 5, 7, 9, 11].map((x, k) => { const m = 60 + r + x, nm = all[k]; return { m, t: nm, k: k === 0 ? 'r' : /[♯♭]/.test(nm) ? 'a' : 'n' }; }).concat([{ m: 72 + r, t: all[0], k: 'r' }])) });
      }
      if (kind === 'rel') {
        const ans = deg(5) + 'm';
        return Object.assign(choices(ans, [deg(1) + 'm', deg(2) + 'm', K + 'm', deg(3) + 'm', deg(4) + 'm']),
          { prompt: `<div class="qtext big">${t('qRel', { k: `<b>${K}</b>` })}</div>`,
            explain: X(`The relative minor starts on the 6th note of the major scale. Count to 6 in ${K} major:`, `Parallelltonarten i moll börjar på durskalans sjätte ton. Räkna till 6 i ${K}-dur:`)
              + exChips(all.slice(0, 6).map((n, k) => [n, String(k + 1), k === 5]))
              + X(`<b>${ans}</b> uses exactly the same notes as ${K} major – it just has another home note.`, `<b>${ans}</b> har exakt samma toner som ${K}-dur – bara ett annat hem.`),
            visual: keysSvg(scaleKeys(r, [0, 2, 4, 5, 7, 9, 11], k => k + 1, 5)) });
      }
      if (kind === 'dia') {
        const romans = DIATONIC_MAJOR, i = Math.floor(Math.random() * 7);
        const name = j => { const c = romanChord(romans[j], r, false); return names.get(c.r) + pretty(TYPES[c.t].sfx); };
        const ans = name(i), pool = [0, 1, 2, 3, 4, 5, 6].filter(j => j !== i).map(name).concat([names.get(mod12(r + [0, 2, 4, 5, 7, 9, 11][i])) + (/m|dim/.test(name(i)) ? '' : 'm')]);
        return Object.assign(choices(ans, pool), { prompt: `<div class="qtext big">${t('qDia', { n: `<b>${romans[i]}</b>`, k: `<b>${K}</b>` })}</div>`,
          explain: X(`Build a chord on every note of ${K} major using only the scale's notes (1-3-5, 2-4-6, 3-5-7 …). Capital numerals are major, small ones minor, ° diminished:`,
                     `Bygg ett ackord på varje ton i ${K}-dur med bara skalans toner (1-3-5, 2-4-6, 3-5-7 …). Versaler är dur, gemener moll, ° förminskat:`)
            + exChips(romans.map((rm, j) => [name(j), rm, j === i]))
            + X(`On the keyboard: <b>${ans}</b> is notes ${i + 1}, ${(i + 2) % 7 + 1} and ${(i + 4) % 7 + 1} of the scale.`, `På klaviaturen: <b>${ans}</b> är skalans ton ${i + 1}, ${(i + 2) % 7 + 1} och ${(i + 4) % 7 + 1}.`),
          visual: (() => { const iv = [0, 2, 4, 5, 7, 9, 11], st = [i, i + 2, i + 4]; return keysSvg(st.map((d, k) => ({ m: 60 + r + iv[d % 7] + (d >= 7 ? 12 : 0), t: (d % 7) + 1, k: k === 0 ? 'r' : 'a' }))
              .concat(iv.map((x, d) => ({ m: 60 + r + x, t: d + 1, k: 'n' })).filter(x => ![i, i + 2, i + 4].map(d => d % 7).includes(x.t - 1))), 60 + r, 60 + r + 11); })() });
      }
      if (kind === 'tones') {
        const tt = pick([[''], ['', 'm'], ['', 'm', '7', 'maj7', 'm7'], ['', 'm', '7', 'maj7', 'm7', 'dim', 'aug']][L0]), ti = typeIndex(tt), root = Math.floor(Math.random() * 12);
        const base = TYPES[ti].req.concat(TYPES[ti].opt).sort((a, b) => a - b).filter(x => x < 12);
        // spell letter by letter (stacked thirds); pick the root spelling that avoids double flats/sharps
        const STEP = { 0: 0, 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 4, 7: 4, 8: 4, 9: 6, 10: 6, 11: 6 };
        const spell = (rn, ivs) => {
          const LET = 'CDEFGAB', NAT = [0, 2, 4, 5, 7, 9, 11], l0 = LET.indexOf(rn[0]);
          return ivs.map(iv => {
            const li = (l0 + STEP[iv]) % 7; let d = mod12(root + iv) - NAT[li];
            if (d > 6) d -= 12; if (d < -6) d += 12;
            if (Math.abs(d) > 1) return nn(mod12(root + iv), d > 0 ? 's' : 'f');   // no double sharps/flats
            return LET[li] + ({ '-1': '♭', 0: '', 1: '♯' })[d];
          });
        };
        const odd = names => names.filter(n => /♭♭|×|C♭|F♭|E♯|B♯/.test(n)).length;
        const opts = [nn(root, 's'), nn(root, 'f')].map(rn => ({ rn, names: spell(rn, base) }));
        const best = opts.sort((a, b) => odd(a.names) - odd(b.names))[0];
        const fix = n => Theory.hNotation ? n.replace(/^B♭/, 'B\u0000').replace(/^B(?!\u0000)/, 'H').replace('\u0000', '') : n;
        const tones = ivs => spell(best.rn, ivs).map(fix).join(' – ');
        const ans = tones(base);
        const wrong = [];
        for (let k = 1; k < base.length; k++) for (const d of [-1, 1]) { const w = base.slice(); w[k] += d; if (w[k] > 0 && w[k] < 12 && !base.includes(w[k])) wrong.push(tones(w.sort((a, b) => a - b))); }
        return Object.assign(choices(ans, wrong), { prompt: `<div class="qtext big">${t('qTones', { c: `<b>${fix(best.rn) + pretty(tt)}</b>` })}</div>`, small: true,
          explain: typeInfo(ti) + exChips(spell(best.rn, base).map((n, k) => [fix(n), intervalLabel(ti, base[k]) + ' · ' + base[k], k === 0]))
            + X('The small numbers show the step in the chord and how many semitones above the root.', 'De små siffrorna visar steget i ackordet och hur många halvtoner över grundtonen.'),
          visual: keysSvg(base.map((x, k) => ({ m: 60 + root + x, t: intervalLabel(ti, x), k: k === 0 ? 'r' : 'a' })), 60 + root, 60 + root + 12) });
      }
      if (kind === 'mode') {
        const MODES = ['major', 'dor', 'phr', 'lyd', 'mix', 'minor', 'loc'], i = Math.floor(Math.random() * 7);
        const MODE_FEEL = { major: ['Ionian is the major scale itself – bright.', 'Jonisk är durskalan själv – ljus.'], dor: ['Dorian is minor with a bright 6th – folk, jazz, funk.', 'Dorisk är moll med ljus sext – folk, jazz, funk.'],
          phr: ['Phrygian is minor with a ♭2 – Spanish, metal.', 'Frygisk är moll med ♭2 – spanskt, metal.'], lyd: ['Lydian is major with a ♯4 – dreamy.', 'Lydisk är dur med ♯4 – drömsk.'],
          mix: ['Mixolydian is major with a ♭7 – rock and blues.', 'Mixolydisk är dur med ♭7 – rock och blues.'], minor: ['Aeolian is the natural minor scale.', 'Eolisk är den rena mollskalan.'],
          loc: ['Locrian has a ♭2 and ♭5 – tense, rarely used.', 'Lokrisk har ♭2 och ♭5 – spänd, används sällan.'] };
        const ans = L(SCALES.find(x => x.id === MODES[i]));
        const ord = (L2 ? ['1:a', '2:a', '3:e', '4:e', '5:e', '6:e', '7:e'] : ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'])[i];
        return Object.assign(choices(ans, MODES.map(id => L(SCALES.find(x => x.id === id)))),
          { prompt: `<div class="qtext big">${t('qMode', { o: ord })}</div>`, small: true,
            explain: X(`Each mode is the major scale started on another note. Start ${K} major on note ${i + 1}, <b>${deg(i)}</b>, and you get <b>${deg(i)} ${ans.toLowerCase()}</b>:`,
                       `Varje modus är durskalan startad på en annan ton. Starta ${K}-dur på ton ${i + 1}, <b>${deg(i)}</b>, så får du <b>${deg(i)} ${ans.toLowerCase()}</b>:`)
              + exChips([...Array(7).keys()].map(k => [deg((i + k) % 7), k === 0 ? X('home', 'hem') : '', k === 0]))
              + pair(MODE_FEEL[MODES[i]]),
            visual: (() => { const iv = [0, 2, 4, 5, 7, 9, 11], st = iv[i]; return keysSvg([...Array(8).keys()].map(k => { const d = (i + k) % 7, m = 60 + r + iv[d] + (i + k >= 7 ? 12 : 0); return { m, t: k === 7 ? deg(i) : deg(d), k: k === 0 || k === 7 ? 'r' : 'n' }; })); })() });
      }
      if (kind === 'steps') {
        const ids = ['major', 'minor', 'dor', 'mix', 'harm', 'mel', 'phr', 'lyd'], id = pick(ids), sc = SCALES.find(x => x.id === id);
        return Object.assign(choices(L(sc), ids.map(x => L(SCALES.find(y => y.id === x)))),
          { prompt: `<div class="qtext big">${t('qSteps')}<div class="qsteps">${stepPattern(sc)}</div></div>`, small: true,
            explain: t('qStepsEx') + ' ' + X(`Following the pattern from C gives <b>C ${L(sc).toLowerCase()}</b>:`, `Följer du mönstret från C får du <b>C ${L(sc).toLowerCase()}</b>:`)
              + exChips(sc.iv.map(x => [spellScale(0, sc).get(x), scaleDegreeLabel(sc, x), x === 0])),
            visual: keysSvg(sc.iv.concat([12]).map(x => ({ m: 60 + x, t: x === 12 ? 1 : scaleDegreeLabel(sc, x), k: x % 12 === 0 ? 'r' : 'a' })), 60, 72) });
      }
      const n = 1 + Math.floor(Math.random() * 12), a = pick(levelKeys()), sp = keySpell(a, false);
      return Object.assign(choices(ivName(n), [...Array(12).keys()].map(k => ivName(k + 1))),
        { prompt: `<div class="qtext big">${t('qInterval', { a: `<b>${nn(a, sp)}</b>`, b: `<b>${nn(a + n, sp)}</b>` })}</div>`, small: true,
          explain: X(`Count semitones (frets) from ${nn(a, sp)}: ${semis(n)} = <b>${ivName(n)}</b>.`, `Räkna halvtoner (band) från ${nn(a, sp)}: ${semis(n)} = <b>${ivName(n)}</b>.`)
            + X(' Each key on the keyboard above is one semitone – count them.', ' Varje tangent på klaviaturen ovan är en halvton – räkna dem.'),
          visual: keysSvg([...Array(n + 1).keys()].map(k => ({ m: 60 + a + k, t: k === 0 ? nn(a, sp) : k === n ? nn(a + n, sp) : k, k: k === 0 ? 'r' : k === n ? 'a' : 'n' }))) });
    },
  },
  intervals: {
    icon: 'ear', en: 'Intervals by ear', sv: 'Intervall på gehör',
    d: { en: 'Two notes play – name the interval.', sv: 'Två toner spelas – vilket intervall är det?' },
    levels: [{ en: 'Major 3rd, perfect 4th, perfect 5th and the octave', sv: 'Stor ters, ren kvart, ren kvint och oktav' },
      { en: 'Adds the major 2nd, minor 3rd and major 6th', sv: 'Lägger till stor sekund, liten ters och stor sext' },
      { en: 'Adds the minor 6th and both 7ths', sv: 'Lägger till liten sext och båda septimorna' },
      { en: 'All twelve, including the minor 2nd and the tritone', sv: 'Alla tolv, även liten sekund och tritonus' }],
    make() {
      const set = [[4, 5, 7, 12], [2, 3, 4, 5, 7, 9, 12], [2, 3, 4, 5, 7, 8, 9, 10, 11, 12], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]][lvl()];
      const n = pick(set), lo = 48 + Math.floor(Math.random() * 12);
      const near = set.filter(k => k !== n).sort((a, b) => Math.abs(a - n) - Math.abs(b - n)).slice(0, 5).map(ivName);
      return Object.assign(choices(ivName(n), near), {
        prompt: `<div class="qtext big">${t('qListen')}</div><div class="qear">${I.ear}</div>`,
        play: () => { const t0 = Snd.now() + 0.05; Snd.pluck(lo, t0, -1); Snd.pluck(lo + n, t0 + 0.75, -1); setTimeout(() => {}, 0); },
        replayBoth: () => { const t0 = Snd.now() + 0.05; Snd.pluck(lo, t0, -1, 0.9); Snd.pluck(lo + n, t0, -1, 0.9); },
        autoplay: true, small: true,
        explain: `<b>${ivName(n)}</b> = ${semis(n)}. ` + X('Remember it by ', 'Kom ihåg det med ') + `<b>${pair(IV_SONG[n])}</b>.`,
        visual: keysSvg([...Array(n + 1).keys()].map(k => ({ m: lo + k, t: k === 0 || k === n ? nn(lo + k) : k, k: k === 0 ? 'r' : k === n ? 'a' : 'n' }))),
      });
    },
  },
  chordEar: {
    icon: 'ear', en: 'Chord types by ear', sv: 'Ackordtyper på gehör',
    d: { en: 'A chord plays – major, minor, seventh …?', sv: 'Ett ackord spelas – dur, moll, septima …?' },
    levels: [{ en: 'Major or minor', sv: 'Dur eller moll' }, { en: 'Major, minor or 7th', sv: 'Dur, moll eller septima' },
      { en: 'Adds maj7, m7 and diminished', sv: 'Lägger till maj7, m7 och förminskat' }, { en: 'Adds augmented and sus4', sv: 'Lägger till överstigande och sus4' }],
    make() {
      const types = tIdx([['', 'm'], ['', 'm', '7'], ['', 'm', '7', 'maj7', 'm7', 'dim'], ['', 'm', '7', 'maj7', 'm7', 'dim', 'aug', 'sus4']][lvl()]);
      const ti = pick(types), r = Math.floor(Math.random() * 12);
      const v = voicings(r, ti, null, CHORD_INSTS[0])[0];
      const lab = k => { const x = TYPES[k]; const w = L(x); return w.charAt(0).toUpperCase() + w.slice(1); };
      const ch = choices(lab(ti), types.map(lab));
      const tOf = label => types.find(k => lab(k) === label);
      return Object.assign(ch, {
        prompt: `<div class="qtext big">${t('qListenChord')}</div><div class="qear">${I.ear}</div>`,
        play: () => Snd.chord(v.frets, STD, 0, 'arp'),
        replayBoth: () => Snd.chord(v.frets, STD, 0, 'strum'),
        autoplay: true, small: true,
        explain: k => `<b>${lab(ti)}</b> ${X('sounds', 'låter')} ${pair(SOUND[TYPES[ti].sfx])} (${cname(r, ti)}).`
          + (k >= 0 && k !== ch.correct ? `<br>${X('You chose', 'Du valde')} <b>${ch.options[k]}</b>, ${X('which sounds', 'som låter')} ${pair(SOUND[TYPES[tOf(ch.options[k])].sfx])}.` : '')
          + chordChips(r, ti),
        visual: chordChart(r, ti),
      });
    },
  },
};
const PRACTICE_ITEMS = ['learn', 'metro', 'listen', 'chords', 'noteName', 'findNote', 'eaNotes', 'countUp', 'theory', 'intervals', 'chordEar'];

const QuizRun = {
  start(id) {
    this.id = id; this.q = QUIZZES[id]; this.i = 0; this.score = 0; this.answered = null; this.ok = null; this.lvl = qLevel(id);
    this.timbreFor();
    this.cur = this.q.make();
  },
  timbreFor() { Snd.setTimbre(this.q.inst === 'chord' ? S.chordInst : this.q.inst === 'fret' ? S.quizInst || 'guitar' : 'guitar'); },
  key() { return this.id + ':' + this.lvl; },
  best() { return (store.get('best', {}))[this.key()] || 0; },
  html() {
    const q = this.q, c = this.cur;
    if (this.i >= 10) {
      const best = this.best();
      return `<div class="card"><div class="qhead">${t('result', { s: this.score })}</div>
        <div class="muted" style="text-align:center">${t('best', { b: best })}</div>
        <div class="row" style="margin-top:14px"><button class="btn primary grow" data-a="qagain">${t('again')}</button></div></div>`;
    }
    const opts = c.options ? `<div class="quizopts ${c.grid12 ? 'g12' : ''} ${c.small ? 'small' : ''}">${c.options.map((o, k) => {
      let cls = '';
      if (this.answered != null) { if (k === c.correct) cls = 'right'; else if (k === this.answered) cls = 'wrong'; }
      return `<button class="btn ${cls}" data-a="qans" data-v="${k}" ${this.answered != null ? 'disabled style="opacity:1"' : ''}>${o}</button>`;
    }).join('')}</div>` : '';
    const done = this.answered != null;
    const correctText = c.options ? c.options[c.correct] : c.answerText;
    return `<div class="card">
      <div class="row"><div class="lbl grow" style="margin:0">${L(q)} · ${levelName(this.lvl)} · ${this.i + 1}/10</div><b>${this.score}</b></div>
      <div class="progress" style="margin-top:8px"><i style="width:${this.i * 10}%"></i></div>
      ${done && c.reveal ? (c.prompt.split('</div>')[0] + '</div>') + c.reveal() : c.prompt}
      ${c.play ? `<div class="row" style="justify-content:center;margin-top:8px"><button class="btn small" data-a="qplay">${I.play}${t('hear')}</button>
        ${c.replayBoth ? `<button class="btn small" data-a="qplay2">${t(this.id === 'intervals' ? 'together' : 'strummed')}</button>` : ''}</div>` : ''}
      ${opts}
      ${done ? `<div class="qfeed ${this.ok ? 'good' : 'bad'}">${this.ok ? t('right') : t('wrongIs', { c: correctText })}</div>
        ${c.explain ? `<div class="qexplain">${c.visual ? `<div class="qvisual">${c.visual}</div>` : ''}${typeof c.explain === 'function' ? c.explain(this.answered) : c.explain}</div>` : ''}
        <div class="row" style="margin-top:10px"><button class="btn primary grow" data-a="qnext">${t('next')}</button></div>` : ''}
    </div>`;
  },
  answer(ok, k) {
    if (this.answered != null) return;
    this.answered = k == null ? -1 : k; this.ok = ok;
    if (ok) this.score++;
    if (navigator.vibrate && !ok) try { navigator.vibrate(60); } catch (e) { /* not allowed */ }
    if (this.cur.play && !this.cur.autoplay) this.cur.play();
    Practice.render();
  },
  action(a, v) {
    const c = this.cur;
    switch (a) {
      case 'qans': this.answer(+v === c.correct, +v); break;
      case 'qtap': if (c.tap && this.answered == null) this.answer(c.check(v), -1); break;
      case 'qplay': this.timbreFor(); c.play(); break;
      case 'qplay2': this.timbreFor(); c.replayBoth(); break;
      case 'qnext':
        this.i++; this.answered = null; this.ok = null;
        if (this.i < 10) { this.cur = this.q.make(); Practice.render(); if (this.cur.autoplay) setTimeout(() => this.cur.play(), 250); }
        else {
          const best = store.get('best', {});
          if (this.score > (best[this.key()] || 0)) { best[this.key()] = this.score; store.set('best', best); }
          Practice.render();
        }
        break;
      case 'qagain': this.start(this.id); Practice.render(); if (this.cur.autoplay) setTimeout(() => this.cur.play(), 250); break;
      default: return false;
    }
    return true;
  },
};

const Practice = {
  stack: ['hub'], started: false, lesson: 0,
  get view() { return this.stack[this.stack.length - 1]; },
  open(v) {
    this.stack.push(v); this.started = false;
    history.pushState({ practice: this.stack.length }, '');
    this.render(); window.scrollTo(0, 0);
  },
  /** back one screen (Android back button or the ‹ button) */
  pop() {
    if (this.view === 'listen') Listen.stop();
    if (this.stack.length > 1) this.stack.pop();
    this.started = false;
    if (S.tab === 'practice') { this.render(); window.scrollTo(0, 0); }
  },
  toHub() { this.pop(); },
  /** level buttons on a quiz's start page */
  seg(k, v) {
    if (k !== 'qlvl') return false;
    S.qlevels = Object.assign({}, S.qlevels, { [this.view]: +v }); saveS(); this.render();
    return true;
  },
  title(v) { return v === 'metro' ? t('metronome') : v === 'learn' ? t('learn') : v === 'listen' ? t('listenT') : v === 'lesson' ? L(LESSONS[this.lesson].title) : L(QUIZZES[v]); },
  backLabel() { const p = this.stack[this.stack.length - 2]; return p === 'hub' ? t('practice') : this.title(p); },
  render() {
    const el = $('#tab-practice');
    if (this.view === 'hub') {
      const best = store.get('best', {});
      el.innerHTML = `<div class="ptiles">${PRACTICE_ITEMS.map(v => {
        const q = QUIZZES[v];
        const icon = v === 'metro' ? I.practice : v === 'learn' ? I.book : v === 'listen' ? I.mic : I[q.icon];
        const desc = v === 'metro' ? t('metroDesc') : v === 'learn' ? t('learnDesc') : v === 'listen' ? t('listenDesc') : L(q.d);
        const sub = v === 'metro' ? (Metro.clock.running ? '● ' + Metro.m.bpm + ' BPM' : '') : v === 'learn' ? t('lessonsN', { n: LESSONS.length })
          : v === 'listen' ? (Listen.running ? '● ' + t('lStop') : `<span class="xbadge">${t('lExp')}</span>`)
          : levelName(qLevel(v)) + (best[v + ':' + qLevel(v)] ? ' · ' + t('best', { b: best[v + ':' + qLevel(v)] }) : '');
        return `<button class="ptile" data-a="popen" data-v="${v}">${icon}<b>${this.title(v)}</b><span>${desc}</span>${sub ? `<em>${sub}</em>` : ''}</button>`;
      }).join('')}</div>`;
      return;
    }
    const head = `<div class="pback"><button class="btn small" data-a="pback">${I.left}${this.backLabel()}</button><b>${this.view === 'lesson' ? '' : this.title(this.view)}</b></div>`;
    if (this.view === 'metro') { el.innerHTML = head + Metro.html(); Metro.bind(); return; }
    if (this.view === 'listen') { el.innerHTML = head + Listen.html(); Listen.bind(); return; }
    if (this.view === 'learn') {
      el.innerHTML = head + `<button class="btn lprint" data-a="lprint" data-v="all">${I.print}${t('lPrintAll')}</button><div class="lessons">${LESSON_CHAPTERS.map(c => `<div class="lchap">${L(c.t)}</div>` + c.ids.map(id => { const i = LESSONS.findIndex(l => l.id === id); return i < 0 ? '' : `<button class="lesson-item" data-a="lopen" data-v="${i}"><i>${i + 1}</i><b>${L(LESSONS[i].title)}</b>${I.right}</button>`; }).join('')).join('')}</div>`;
      return;
    }
    if (this.view === 'lesson') { el.innerHTML = head + this.lessonHtml(); return; }
    const q = QUIZZES[this.view];
    if (!this.started) {
      let instSel = '';
      if (q.inst === 'chord') instSel = `<div class="lbl">${t('instrument')}</div><select id="qinst">${CHORD_INSTS.map(x => `<option value="${x.id}" ${x.id === S.chordInst ? 'selected' : ''}>${L(x)}</option>`).join('')}</select>`;
      if (q.inst === 'fret') { const { insts, si } = quizTuning(); instSel = `<div class="lbl">${t('instrument')}</div><select id="qinst">${insts.map(x => `<option value="${x.id}" ${x.id === si.id ? 'selected' : ''}>${L(x)}</option>`).join('')}</select>`; }
      const lv = qLevel(this.view), best = store.get('best', {})[this.view + ':' + lv];
      const lvSel = q.levels ? `<div class="lbl">${X('Level', 'Nivå')}</div>${seg('qlvl', [0, 1, 2, 3].map(k => [k, levelName(k)]), lv)}
        <div class="small muted" style="margin:6px 2px 0">${L(q.levels[lv])}</div>` : '';
      el.innerHTML = head + `<div class="card"><div class="qintro">${I[q.icon] || ''}</div><div style="text-align:center">${L(q.d)}</div>
        ${best ? `<div class="small muted" style="text-align:center;margin-top:6px">${t('best', { b: best })}</div>` : ''}
        ${lvSel}
        ${instSel}
        <div class="row" style="margin-top:14px"><button class="btn primary grow" data-a="qgo">${t('go')}</button></div></div>`;
      const qi = $('#qinst');
      if (qi) qi.addEventListener('change', e => { if (q.inst === 'chord') S.chordInst = e.target.value; else S.quizInst = e.target.value; saveS(); });
      return;
    }
    el.innerHTML = head + QuizRun.html();
  },

  /* ---------- lessons ---------- */
  lessonHtml() { return NB(this.lessonHtmlRaw()); },
  lessonHtmlRaw() {
    const l = LESSONS[this.lesson], i0 = this.lesson;
    const play = `<span class="pl">${I.play}</span>`;
    const body = l.blocks.map((b, bi) => {
      const md = x => esc(L(x)).replace(/\*([^*]+)\*/g, '<b>$1</b>');
      const lbl = x => x == null ? '' : typeof x === 'string' ? NB(x) : L(x);
      if (b.goal) return `<p class="lgoal">${md(b.goal)}</p>`;
      if (b.h) return `<h3>${L(b.h)}</h3>`;
      if (b.p) return `<p class="lp">${md(b.p)}</p>`;
      if (b.try) return `<div class="ltry"><div class="lbl">${t('lTry')}</div>${md(b.try)}</div>`;
      if (b.key) return `<div class="lkey"><div class="lbl">${t('lKey')}</div><ul>${b.key.map(k => `<li>${md(k)}</li>`).join('')}</ul></div>`;
      if (b.strum) return `<div class="lex">${b.strum.map((r, k) => `<button class="lrow" data-a="lp" data-v="${bi}:${k}">${play}<b>${L(r[0])}<small class="lprog lstrum">${r[1].split('').map((c, i) => `<i class="lch ${c === '-' ? 'rest' : ''}" data-i="${i}">${c === 'D' ? '↓' : c === 'U' ? '↑' : c === 'x' ? '✕' : '·'}</i>`).join('')}</small><small class="lcount">${r[1].length === 8 ? '1 & 2 & 3 & 4 &' : r[1].length === 6 ? '1 2 3 4 5 6' : ''}</small></b></button>`).join('')}</div>`;
      if (b.prog) return `<div class="lex">${b.prog.map((r, k) => `<button class="lrow" data-a="lp" data-v="${bi}:${k}">${play}<b>${L(r[0])}<small class="lprog">${r[1].map((c, i) => (i && r[1].length > 8 && i % 4 === 0 ? '<span class="lbr"></span>' : '') + `<i class="lch" data-i="${i}">${lessonChordName(c)}</i>`).join('')}</small></b></button>`).join('')}</div>`;
      if (b.staff) return `<div class="lex">${b.staff.play === false ? '' : `<button class="lrow" data-a="lp" data-v="${bi}">${play}<b>${b.label ? lbl(b.label) : t('hear')}</b></button>`}<div class="lvis lstaff">${staffSvg(b.staff.items, b.staff)}</div></div>`;
      if (b.piano) {
        const pz = b.piano, marks = pz.keys.map(([m, l, k]) => ({ m, t: typeof l === 'number' ? nn(l) : lbl(l), k: k || 'n' }));
        return `<div class="lex"><button class="lrow" data-a="lp" data-v="${bi}">${play}<b>${b.label ? lbl(b.label) : t('hear')}<small>${t('lPiano')}</small></b></button><div class="lvis">${keysSvg(marks, pz.lo, pz.hi)}</div></div>`;
      }
      if (b.fret) {
        const fz = b.fret, tn = fz.tun || STD, tu = { n: tn, start: tn.map(() => 0) };
        const col = k => k === 'r' ? 'var(--root)' : k === 'n' ? 'var(--accent-soft)' : 'var(--accent)';
        const dots = fz.dots.map(([s, f, l, k]) => ({ s, f, label: typeof l === 'number' ? nn(l) : lbl(l), color: col(k), ink: k === 'n' ? 'var(--accent)' : '#fff' }));
        return `<div class="lex"><button class="lrow" data-a="lp" data-v="${bi}">${play}<b>${b.label ? lbl(b.label) : t('hear')}<small>${t('lGuitar')}</small></b></button><div class="lvis">${quizBoard(tu, { dots, frets: clamp(Math.max(...fz.dots.map(d => d[1])) + 1, 5, 15), maxScale: lessonBoardScale(fz), names: true })}</div></div>`;
      }
      if (b.chips) {
        const c = b.chips, chips = `<div class="notes lchips">${c.row.map(([n, l, hi], i) => `<div class="note ${hi ? 'r' : ''}" data-i="${i}" data-pc="${typeof n === 'number' ? n : pcOfName(lbl(n))}"><b>${typeof n === 'number' ? nn(n) : lbl(n)}</b>${lbl(l) ? `<span>${lbl(l)}</span>` : ''}</div>`).join('')}</div>`;
        return `<div class="lex">${c.play ? `<button class="lrow" data-a="lp" data-v="${bi}">${play}<b>${b.label ? lbl(b.label) : t('hear')}</b></button>` : ''}${chips}</div>`;
      }
      if (b.scale) {
        const sc = SCALES.find(x => x.id === b.scale.id), sp = spellScale(b.scale.root, sc);
        const nm = pc => (sp && sp.get(pc)) || nn(pc);
        return `<div class="lex"><button class="lrow" data-a="lp" data-v="${bi}">${play}<b>${nm(b.scale.root)} ${L(sc).toLowerCase()}<small>${stepPattern(sc)}</small></b></button>
          <div class="notes">${sc.iv.concat([12]).map((x, i) => `<div class="note ${x % 12 === 0 ? 'r' : ''}" data-i="${i}"><b>${nm(mod12(b.scale.root + x))}</b><span>${scaleDegreeLabel(sc, x % 12)}</span></div>`).join('')}</div></div>`;
      }
      if (b.notes && !b.tab) return `<div class="lex"><button class="lrow" data-a="lp" data-v="${bi}">${play}<b>${L(b.label)}<small>${b.notes.map((m, i) => `<i class="ln" data-i="${i}">${nn(m)}</i>`).join(' ')}</small></b></button></div>`;
      if (b.intervals) return `<div class="lex">${[...Array(12).keys()].map(k => `<button class="lrow" data-a="lp" data-v="${bi}:${k + 1}">${play}<b>${ivName(k + 1)}<small><i class="ln" data-i="0">C</i> → <i class="ln" data-i="1">${nn(k + 1, 's')}</i></small></b><span>${semis(k + 1)}</span></button>`).join('')}</div>`;
      if (b.table) return `<div class="lex">${b.table.map((r, k) => `<button class="lrow" data-a="lp" data-v="${bi}:${k}">${play}<b>${lbl(r[0])}${r[1] ? `<small>${lbl(r[1])}</small>` : ''}<small class="lns">${chordNoteSpans(r[2])}</small></b><span>${pretty(r[2])}</span></button>`).join('')}</div>`;
      if (b.diatonic != null) {
        const mi = !!b.minor, sp = spellScale(b.diatonic, SCALES.find(x => x.id === (mi ? 'minor' : 'major')));
        const chs = (mi ? DIATONIC_MINOR : DIATONIC_MAJOR).map(r => romanChord(r, b.diatonic, mi));
        return `<div class="lex"><div class="ttl" style="margin-bottom:8px">${sp.get(b.diatonic)} ${t(mi ? 'minor' : 'major').toLowerCase()}</div>
          <div class="dchords">${chs.map((c, k) => `<div class="dchord" data-a="lp" data-v="${bi}:${k}"><i>${c.roman}</i><b>${sp.get(c.r)}${pretty(TYPES[c.t].sfx)}</b></div>`).join('')}</div></div>`;
      }
      if (b.modes) return `<div class="lex">${b.modes.map((m, k) => `<button class="lrow" data-a="lp" data-v="${bi}:${k}">${play}<b>C ${L(SCALES.find(x => x.id === m[0])).toLowerCase()}<small>${L(m[1])}</small><small class="lns">${(() => { const sc = SCALES.find(x => x.id === m[0]), sp = spellScale(0, sc); return sc.iv.concat([12]).map((x, i) => `<i class="ln" data-i="${i}">${(sp && sp.get(x % 12)) || nn(x)}</i>`).join(' '); })()}</small></b></button>`).join('')}</div>`;
      if (b.chart) {
        const p = lessonChord(b.chart), v = voicings(p.r, p.t, p.b, CHORD_INSTS[0])[0];
        return `<div class="lex" style="text-align:center"><div class="diagwrap" data-a="lp" data-v="${bi}">${diagram(v, p.r, { cls: 'big', tuning: STD, dot: b.dot || 'finger', labels: b.dot === 'interval' ? ivLabels(p.r, p.t) : new Map(), spell: chordSpell(p.r, p.t) })}</div><div class="small muted">${pretty(b.chart)}</div></div>`;
      }
      if (b.tab) return `<div class="lex"><pre class="ltab">${tabHtml(b.tab)}</pre><button class="lrow" data-a="lp" data-v="${bi}">${play}<b>${t('hear')}</b></button></div>`;
      if (b.go) return `<div class="lgo">${b.go.map(([target, label]) => `<button class="btn small" data-a="lgo" data-v="${target}">${L(label)}</button>`).join('')}</div>`;
      return '';
    }).join('');
    return `<div class="card lesson"><div class="lhead"><div class="lbl" style="margin:0">${(chapterOf(l.id) ? L(chapterOf(l.id).t) + ' · ' : '')}${t('lessonN', { n: i0 + 1, of: LESSONS.length })}</div><button class="btn small lprint1" data-a="lprint" data-v="${i0}">${I.print}${t('lPrintOne')}</button></div>
      <h2 style="margin:4px 0 0;font-size:22px">${L(l.title)}</h2>${body}</div>
      <div class="lnav">${i0 > 0 ? `<button class="btn" data-a="lnav" data-v="-1">${I.left}${L(LESSONS[i0 - 1].title)}</button>` : ''}
        ${i0 < LESSONS.length - 1 ? `<button class="btn primary" data-a="lnav" data-v="1">${L(LESSONS[i0 + 1].title)}${I.right}</button>` : ''}</div>`;
  },
  lessonPlay(v) {
    const [bi, k] = String(v).split(':').map(Number), b = LESSONS[this.lesson].blocks[bi];
    Snd.setTimbre('guitar');
    const now = Snd.now() + 0.05;
    const btn = document.querySelector(`.lesson [data-a=lp][data-v="${v}"]`), box = btn && (btn.closest('.lex') || btn.parentElement);
    const q = sel => box ? box.querySelector(sel) : null;
    const mark = (el, when) => { if (el) atTime(when, () => blinkEl(el)); };
    const markRow = (dur) => { if (btn) { btn.classList.add('lplaying'); setTimeout(() => btn.classList.remove('lplaying'), dur * 1000); } };
    const chord = name => {
      const p = lessonChord(name); const vv = p && voicings(p.r, p.t, p.b, CHORD_INSTS[0])[0];
      if (!vv) return;
      const sched = Snd.chord(vv.frets, STD, 0, 'strum');
      if (btn) sched.forEach(({ s, when }) => mark(btn.querySelector(`.ln[data-pc="${mod12(STD[s] + vv.frets[s])}"]`), when));
      if (box && box.querySelector('.hl')) sched.forEach(({ s, when }) => mark(box.querySelector(`.hl[data-s="${s}"]`), when));
      markRow(1.4);
    };
    if (b.staff) {
      const beat = 60 / (b.staff.bpm || 84); let tt = 0;
      b.staff.items.forEach((it, i) => {
        if (it.bar) return;
        const len = itemBeats(it) * beat;
        const prev = b.staff.items.slice(0, i).reverse().find(x => !x.bar);
        if (it.n && !(prev && prev.tie)) {                                   // a tied note keeps sounding
          // the note lasts as long as it is written, including any notes tied on to it
          let held = len;
          for (let j = i, cur = it; cur && cur.tie; ) { const nx = b.staff.items.slice(j + 1).find(x => !x.bar); if (!nx) break; held += itemBeats(nx) * beat; j = b.staff.items.indexOf(nx); cur = nx; }
          const p = parseNoteName(it.n);
          Snd.held(p.midi - (b.staff.octaveDown ? 12 : 0), now + tt, held, 0.9);
        }
        if (b.staff.click) Snd.tick(now + tt, Number.isInteger(tt / beat) ? 1 : 0.4, false);
        mark(q(`.sn[data-i="${i}"]`), now + tt);
        tt += len;
      });
      (box ? box.querySelectorAll('.scn') : []).forEach(el => mark(el, now + +el.dataset.at * beat));
    } else if (b.strum) {
      const [, pat, name, bpm] = b.strum[k], p = lessonChord(name || 'G'), vv = p && voicings(p.r, p.t, p.b, CHORD_INSTS[0])[0];
      const step = 60 / (bpm || 90) / 2, bars = 2;
      for (let bar = 0; bar < bars; bar++) pat.split('').forEach((c, i) => {
        const at = now + (bar * pat.length + i) * step + (b.strum[k][4] && i % 2 ? step * 0.36 : 0);
        if (c !== '-') Snd.stroke(c === 'D' && i % 2 ? 'd' : c, vv.frets, STD, at);
        mark(btn && btn.querySelector(`.lch[data-i="${i}"]`), at);
      });
      if (btn) { btn.classList.add('lplaying'); setTimeout(() => btn.classList.remove('lplaying'), (pat.length * bars * step + 0.4) * 1000); }
    } else if (b.prog) {
      const chs = b.prog[k][1], gap = b.prog[k][2] || 1.1;
      chs.forEach((name, i) => {
        const p = lessonChord(name), vv = p && voicings(p.r, p.t, p.b, CHORD_INSTS[0])[0];
        if (vv) Snd.chord(vv.frets, STD, now + i * gap, 'strum', 0.9);
        mark(btn && btn.querySelector(`.lch[data-i="${i}"]`), now + i * gap);
      });
      if (btn) { btn.classList.add('lplaying'); setTimeout(() => btn.classList.remove('lplaying'), (chs.length * gap + 0.6) * 1000); }
    } else if (b.piano) {
      const ms = b.piano.play || b.piano.keys.map(x => x[0]), gap = b.piano.chord ? 0 : ms.length > 4 ? 0.3 : 0.55;
      ms.forEach((m, i) => { Snd.pluck(m, now + i * gap, -1, 0.85); mark(q(`.km[data-m="${m}"]`), now + i * gap); });
      if (!b.piano.chord && b.piano.end) ms.forEach(m => { Snd.pluck(m, now + ms.length * gap + 0.3, -1, 0.7); mark(q(`.km[data-m="${m}"]`), now + ms.length * gap + 0.3); });
    } else if (b.fret) {
      const ds = b.fret.dots, gap = b.fret.chord ? 0.03 : 0.32, tn = b.fret.tun || STD;
      const order = b.fret.chord ? ds.map((d, i) => i).sort((a, b2) => ds[a][0] - ds[b2][0] || ds[a][1] - ds[b2][1]) : ds.map((d, i) => i);
      order.forEach((di, i) => { const [s, f] = ds[di]; Snd.pluck(tn[s] + f, now + i * gap, s, 0.85); mark(q(`.fd[data-i="${di}"]`), now + i * gap); });
    } else if (b.chips) {
      const pl = b.chips.play, gap = pl.length > 3 ? 0.26 : 0.5;
      const chips = box ? [...box.querySelectorAll('.note')] : [];
      const chipFor = m => chips.find(el => el.dataset.pc === String(m)) || chips.find(el => el.dataset.pc !== '' && +el.dataset.pc < 12 && +el.dataset.pc === mod12(m)) || chips.find(el => mod12(+el.dataset.pc) === mod12(m));
      pl.forEach((m, i) => { Snd.pluck(m, now + i * gap, -1, 0.9); mark(chipFor(m, i), now + i * gap); });
      if (pl.length === 3) pl.forEach(m => { Snd.pluck(m, now + 1.6, -1, 0.7); mark(chipFor(m), now + 1.6); });
    } else if (b.scale) {
      const sc = SCALES.find(x => x.id === b.scale.id), m0 = 48 + b.scale.root + (b.scale.root < 4 ? 12 : 0);
      const up = sc.iv.concat([12]).map(x => m0 + x), all = up.concat(up.slice(0, -1).reverse());
      const idx = up.map((_, i) => i), allI = idx.concat(idx.slice(0, -1).reverse());
      all.forEach((m, i) => { Snd.pluck(m, now + i * 0.26, -1, 0.9); mark(q(`.note[data-i="${allI[i]}"]`), now + i * 0.26); });
    } else if (b.intervals) {
      Snd.pluck(60, now, -1); Snd.pluck(60 + k, now + 0.7, -1); Snd.pluck(60, now + 1.6, -1, 0.8); Snd.pluck(60 + k, now + 1.6, -1, 0.8); markRow(2.4);
      const n0 = btn && btn.querySelector('.ln[data-i="0"]'), n1 = btn && btn.querySelector('.ln[data-i="1"]');
      mark(n0, now); mark(n1, now + 0.7); mark(n0, now + 1.6); mark(n1, now + 1.6);
    }
    else if (b.table) chord(b.table[k][2]);
    else if (b.diatonic != null) {
      const c = romanChord((b.minor ? DIATONIC_MINOR : DIATONIC_MAJOR)[k], b.diatonic, !!b.minor); chord(nn(c.r, 's') + TYPES[c.t].sfx);
      const tile = box && box.querySelector(`.dchord[data-v="${v}"]`); if (tile) { tile.classList.add('lplaying'); setTimeout(() => tile.classList.remove('lplaying'), 1400); }
    } else if (b.modes) {
      const sc = SCALES.find(x => x.id === b.modes[k][0]), up = sc.iv.concat([12]).map(x => 60 + x);
      const idx = up.map((_, i) => i), allI = idx.concat(idx.slice(0, -1).reverse());
      up.concat(up.slice(0, -1).reverse()).forEach((m, i) => { Snd.pluck(m, now + i * 0.24, -1, 0.9); mark(btn && btn.querySelector(`.ln[data-i="${allI[i]}"]`), now + i * 0.24); });
      markRow(up.length * 2 * 0.24);
    } else if (b.chart) chord(b.chart);
    else if (b.notes && b.how) {
      // techniques: a legato note follows its picked note closely, a new pick waits a little longer
      let tt = 0; const ev = b.notes.map((m, i) => { if (i) tt += b.how[i] === 'pick' ? 0.75 : b.how[i] === 'bend' ? 0.45 : 0.32; return { m, t: tt, how: b.how[i] }; });
      Snd.phrase(ev, now, 3);
      ev.forEach((e, i) => (box ? box.querySelectorAll(`.tn[data-i="${i}"]`) : []).forEach(el => mark(el, now + e.t)));
    } else if (b.notes) {
      const gap = b.gap || (b.tab ? 0.34 : b.notes.length > 2 ? 0.26 : 0.8);
      b.notes.forEach((m, i) => {
        [].concat(m).forEach((mm, j) => Snd.pluck(mm, now + i * gap + j * 0.012, -1, Array.isArray(m) ? 0.75 : 0.9));
        if (b.tab) (box ? box.querySelectorAll(`.tn[data-i="${i}"]`) : []).forEach(el => mark(el, now + i * gap));
        else mark(btn && btn.querySelector(`.ln[data-i="${i}"]`), now + i * gap);
      });
    }
  },
  action(a, v) {
    switch (a) {
      case 'popen': this.open(v); break;
      case 'pback': history.back(); break;
      case 'lopen': this.lesson = +v; this.open('lesson'); break;
      case 'lnav': this.lesson = clamp(this.lesson + +v, 0, LESSONS.length - 1); this.render(); window.scrollTo(0, 0); break;
      case 'lp': this.lessonPlay(v); break;
      case 'lprint': printLessons(v === 'all' ? null : +v); break;
      case 'lgo':
        if (v.startsWith('tab:')) showTab(v.slice(4));
        else if (v.startsWith('lesson:')) { this.lesson = Math.max(0, LESSONS.findIndex(l => l.id === v.slice(7))); this.render(); window.scrollTo(0, 0); }
        else this.open(v);
        break;
      case 'qgo': this.started = true; QuizRun.start(this.view); this.render(); if (QuizRun.cur.autoplay) setTimeout(() => QuizRun.cur.play(), 250); break;
      default: return QuizRun.action(a, v);
    }
    return true;
  },
};

/* =======================================================================
   LISTEN (experimental) – chords, bass lines and melodies from the microphone
   ======================================================================= */
const LISTEN_SCALES = ['pmin', 'pmaj', 'blues', 'major', 'minor', 'dor', 'mix', 'harm'];
const Listen = {
  mode: store.get('listenMode', 'chords'),
  running: false, stream: null, src: null, an: null, anLow: null, raf: 0, last: 0, lastDraw: 0,
  cf: new ChordFinder(), nt: new NoteTracker(), db: -99, freqBuf: null, timeBuf: null, lowBuf: null, mag: null,
  chroma: new Float64Array(12), bassC: new Float64Array(12), nsdf: null,

  async start() {
    if (this.running) return;
    if (Pitch.running) { Tuner.stop(); Tuner.stopPipe(); }
    const ctx = Snd.init();
    if (ctx.state === 'suspended') await ctx.resume();
    const audio = { echoCancellation: false, noiseSuppression: false, autoGainControl: false };
    const dev = Tuner.resolveInput();
    if (dev) audio.deviceId = { exact: dev };
    try { this.stream = await navigator.mediaDevices.getUserMedia({ audio }); }
    catch (e) {
      try { delete audio.deviceId; this.stream = await navigator.mediaDevices.getUserMedia({ audio }); }
      catch (e2) { toast(t('lMicDenied')); return; }
    }
    this.src = ctx.createMediaStreamSource(this.stream);
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 30;
    this.an = ctx.createAnalyser(); this.an.fftSize = 16384; this.an.smoothingTimeConstant = 0;
    // the bass line is followed in a low-passed copy, so guitars and voices don't pull the pitch up
    const lp1 = ctx.createBiquadFilter(), lp2 = ctx.createBiquadFilter();
    lp1.type = lp2.type = 'lowpass'; lp1.frequency.value = lp2.frequency.value = 260;
    this.anLow = ctx.createAnalyser(); this.anLow.fftSize = 8192;
    this.src.connect(hp); hp.connect(this.an); hp.connect(lp1); lp1.connect(lp2); lp2.connect(this.anLow);
    this.freqBuf = new Float32Array(this.an.frequencyBinCount);
    this.mag = new Float64Array(this.an.frequencyBinCount);
    this.timeBuf = new Float32Array(this.an.fftSize);
    this.lowBuf = new Float32Array(this.anLow.fftSize);
    this.nsdf = new Float32Array(Math.ceil(ctx.sampleRate / 28) + 4);
    this.running = true; this.last = performance.now();
    keepAwake();
    // show which input is used (phone microphone or a cable), like the tuner does
    clearInterval(this.inTimer);
    const paintIn = () => { Tuner.readInputs(); const el = $('#linput'); if (!el) return; const h = Tuner.inputHtml(); if (el.dataset.h !== h) { el.dataset.h = h; el.innerHTML = h; } };
    Tuner.listDevices().then(paintIn); this.inTimer = setInterval(paintIn, 1000);
    const loop = () => { this.raf = requestAnimationFrame(loop); this.frame(); };
    loop();
    this.render();
  },
  stop() {
    cancelAnimationFrame(this.raf); clearInterval(this.inTimer);
    if (this.src) this.src.disconnect();
    if (this.stream) this.stream.getTracks().forEach(x => x.stop());
    this.stream = this.src = this.an = this.anLow = null;
    if (!this.running) return;
    this.running = false;
    this.cf.close();
    this.nt.push(0, 0);
    keepAwake();
    if (S.tab === 'practice' && Practice.view === 'listen') this.render();
  },
  clear() { this.cf.reset(); this.nt.reset(); this.render(); },

  frame() {
    if (!this.an) return;
    const now = performance.now(), dt = (now - this.last) / 1000;
    if (dt < 0.045) return;                       // about 20 analyses a second is plenty
    this.last = now;
    const sr = Snd.ctx.sampleRate;
    this.an.getFloatTimeDomainData(this.timeBuf);
    let sum = 0;
    for (let i = this.timeBuf.length - 4096; i < this.timeBuf.length; i++) sum += this.timeBuf[i] * this.timeBuf[i];
    this.db = 20 * Math.log10(Math.sqrt(sum / 4096) + 1e-9);
    if (this.mode === 'chords') {
      this.an.getFloatFrequencyData(this.freqBuf);
      for (let k = 0; k < this.freqBuf.length; k++) this.mag[k] = Math.pow(10, this.freqBuf[k] / 20);
      Hear.chroma(this.mag, sr, this.an.fftSize, 65, 2100, this.chroma);
      Hear.bass(this.mag, sr, this.an.fftSize, this.bassC);
      this.cf.push(this.chroma, this.bassC, dt, this.db);
    } else {
      let r;
      if (this.mode === 'bass') { this.anLow.getFloatTimeDomainData(this.lowBuf); r = Pitch.detect(this.lowBuf, sr, this.nsdf, 28); }
      else r = Pitch.detect(this.timeBuf.subarray(this.timeBuf.length - 4096), sr, this.nsdf, 70);
      const ok = r.freq && r.clarity > (this.mode === 'bass' ? 0.8 : 0.85) && (this.mode !== 'bass' || r.freq < 400);
      this.nt.push(ok ? r.freq : 0, dt, this.db);   // the short full-band level shows new attacks best
    }
    if (now - this.lastDraw > 150) { this.lastDraw = now; this.draw(); }
  },

  /* ---------- results ---------- */
  key() {
    const segs = this.cf.timeline();
    if (this.mode === 'chords' && segs.length >= 2) return Hear.keyFromChords(segs, this.cf.long)[0];
    return null;
  },
  chordLabel(c) { return chordName(c.r, Math.max(0, typeIndex(c.sfx)), c.b); },
  roman(c, k) {
    const deg = (c.r - k.tonic + 12) % 12;
    const R = ['I', '♭II', 'II', '♭III', 'III', 'IV', '♯IV', 'V', '♭VI', 'VI', '♭VII', 'VII'][deg];
    const minor = /^m(?!aj)/.test(c.sfx), dim = c.sfx === 'dim';
    return (minor || dim ? R.toLowerCase() : R) + (dim ? '°' : '') + (/7/.test(c.sfx) ? (c.sfx === 'maj7' ? 'maj7' : '7') : '');
  },
  keyName(k) { return nn(k.tonic, keySpell(k.tonic, k.minor)) + ' ' + (k.minor ? t('minor') : t('major')).toLowerCase(); },
  notes() { return this.nt.all().filter(n => n.dur >= 0.06); },
  fit(notes) {
    if (notes.length < 4) return null;
    const scales = LISTEN_SCALES.map(id => SCALES.find(x => x.id === id)).filter(Boolean);
    return Hear.scaleFit(notes, scales)[0] || null;
  },
  tuning() { return this.mode === 'bass' ? [28, 33, 38, 43] : [40, 45, 50, 55, 59, 64]; },

  /* ---------- screen ---------- */
  html() {
    const M = this.mode, tip = t(M === 'chords' ? 'lTipChords' : M === 'bass' ? 'lTipBass' : 'lTipMelody');
    return `<div class="card listen">
      <div class="lhead2"><span class="xbadge">${t('lExp')}</span>${seg('lmode', [['chords', t('lModeChords')], ['bass', t('lModeBass')], ['melody', t('lModeMelody')]], M)}</div>
      <div class="lnow" id="lnow"></div>
      <div class="lmeter"><i id="lmeter"></i></div>
      <div class="tinput" id="linput">${this.running ? Tuner.inputHtml() : ''}</div>
      <div class="row">
        <button class="btn ${this.running ? '' : 'primary'} grow" data-a="lrun">${this.running ? I.stop + t('lStop') : I.mic + t('lStart')}</button>
        <button class="btn" data-a="lclear">${I.trash}${t('lClear')}</button>
      </div>
      <p class="small muted" style="margin:10px 2px 0">${tip}</p>
      <p class="small muted lcable" style="margin:8px 2px 0">${I.plug}${t('lCable')}</p>
    </div>
    <div id="lres"></div>
    <p class="small muted lexp">${t('lExpNote')}</p>`;
  },
  render() {
    if (!(S.tab === 'practice' && Practice.view === 'listen')) return;
    Practice.render();
  },
  bind() { this.draw(); },

  /** Updates the live parts without rebuilding the whole page. */
  draw() {
    const now = $('#lnow'), res = $('#lres'), meter = $('#lmeter');
    if (!now || !res) return;
    const level = clamp((this.db + 60) / 50, 0, 1);
    if (meter) meter.style.width = (this.running ? level * 100 : 0) + '%';
    const quiet = this.running && this.db < -55;
    if (this.mode === 'chords') {
      const c = this.cf.cur, k = this.key();
      now.innerHTML = c ? `<b>${this.chordLabel(c)}</b>${k ? `<span>${this.roman(c, k)}</span>` : ''}`
        : `<span class="muted">${this.running ? t(quiet ? 'lQuiet' : 'lWaiting') : t('lNone')}</span>`;
      const segs = this.cf.timeline();
      const sig = segs.map(x => x.r + x.sfx + (x.b == null ? '' : '/' + x.b)).join(',') + '|' + (c ? c.r + c.sfx : '') + '|' + (k ? k.tonic + ':' + k.minor : '');
      if (sig === this._sig) return;
      this._sig = sig;
      const chart = c ? chordChart(c.r, Math.max(0, typeIndex(c.sfx)), CI()) : '';
      res.innerHTML = (chart ? `<div class="card lchart">${chart}</div>` : '') + (segs.length ? `<div class="card">
          ${k ? `<div class="lkeyl">${t('lsKey')}: <b>${this.keyName(k)}</b> <span class="muted">(${t('lKeyGuess')})</span></div>` : ''}
          <div class="lbl">${t('lTimeline')}</div>
          <div class="ltl">${segs.map((x, i) => `<button class="ltlc ${x.now ? 'on' : ''}" data-a="lchord" data-v="${i}"><b>${this.chordLabel(x)}</b>${k ? `<i>${this.roman(x, k)}</i>` : ''}</button>`).join('')}</div>
          <div class="row" style="margin-top:10px"><button class="btn primary grow" data-a="lstudio">${I.send}${t('toStudio')}</button></div>
        </div>` : '');
    } else {
      const notes = this.notes(), cur = this.nt.cur;
      now.innerHTML = cur ? `<b>${nn(cur.ref % 12)}<sub>${Math.floor(cur.ref / 12) - 1}</sub></b>`
        : `<span class="muted">${this.running ? t(quiet ? 'lQuiet' : 'lWaiting') : t('lNone')}</span>`;
      const sig = notes.map(n => n.midi).join(',') + '|' + this.mode;
      if (sig === this._sig) return;
      this._sig = sig;
      if (!notes.length) { res.innerHTML = ''; return; }
      const shown = notes.slice(-24), tun = this.tuning();
      const names = tun.map((m, i) => i === tun.length - 1 && this.mode !== 'bass' ? 'e' : nn(m % 12).replace('♭', 'b'));
      const tab = Hear.tabText(Hear.toTab(shown, tun), names);
      const f = this.fit(notes);
      const sc = f && SCALES.find(x => x.id === f.id);
      res.innerHTML = `<div class="card">
          <div class="lbl">${t('lNotes')}</div>
          <div class="lnotes">${shown.map(n => nn(n.midi % 12)).join(' ')}</div>
          <pre class="ltab">${esc(tab)}</pre>
          ${sc ? `<div class="lkeyl">${t('lFits')}: <b>${nn(f.root)} ${L(sc).toLowerCase()}</b></div>` : ''}
          <div class="row" style="margin-top:10px">
            <button class="btn grow" data-a="lplay">${I.play}${t('lPlayBack')}</button>
            ${sc ? `<button class="btn grow" data-a="lscale">${I.scales}${t('lShowScale')}</button>` : ''}
          </div>
        </div>`;
    }
  },

  seg(k, v) {
    if (k !== 'lmode') return false;
    if (this.mode === v) return true;
    this.mode = v; store.set('listenMode', v);
    this._sig = null;
    this.cf.reset(); this.nt.reset();
    this.render();
    return true;
  },
  action(a, v) {
    switch (a) {
      case 'lrun': if (this.running) this.stop(); else this.start(); return true;
      case 'lclear': this._sig = null; this.clear(); return true;
      case 'lchord': {
        const c = this.cf.timeline()[+v];
        if (c) { const x = vfor({ r: c.r, t: Math.max(0, typeIndex(c.sfx)), b: null, v: 0 }); if (x) Snd.chord(x.frets, CI().n, 0); }
        return true;
      }
      case 'lstudio': {
        const segs = this.cf.timeline(), k = this.key() || { tonic: segs[0] ? segs[0].r : 0, minor: false };
        // the last few chords, at most eight, without repeats next to each other
        const list = [];
        for (const x of segs) { const last = list[list.length - 1]; if (!last || last.r !== x.r || last.sfx !== x.sfx) list.push(x); }
        // a progression that repeats is sent once: the shortest loop the chords follow
        const same = (a, b) => a.r === b.r && a.sfx === b.sfx;
        let loop = list;
        for (let p = 2; p <= Math.min(8, Math.floor(list.length / 2) + 1); p++) {
          if (list.length > p && list.every((x, i) => i < p || same(x, list[i - p]))) { loop = list.slice(0, p); break; }
        }
        const pick = loop.slice(-8);
        if (!pick.length) return true;
        if (Studio.clock.running) Studio.stop();
        Studio.p.key = k.tonic; Studio.p.minor = k.minor;
        Studio.p.slots = pick.map(x => ({ r: x.r, t: Math.max(0, typeIndex(x.sfx)), b: x.b, v: 0 }));
        Studio.save();
        this.stop();
        toast(t('sentStudio'));
        showTab('studio');
        return true;
      }
      case 'lplay': {
        const notes = this.notes().slice(-24);
        if (!notes.length) return true;
        Snd.setTimbre(this.mode === 'bass' ? 'bass' : 'guitar');
        const t0 = Snd.now() + 0.1, s0 = notes[0].start;
        notes.forEach(n => Snd.pluck(n.midi, t0 + Math.min(n.start - s0, 30)));
        return true;
      }
      case 'lscale': {
        const f = this.fit(this.notes());
        if (!f) return true;
        this.stop();
        Scales.s.root = f.root; Scales.s.id = f.id; Scales.s.pos = -1;
        if (this.mode === 'bass' && Scales.insts.some(x => x.id === 'bass')) Scales.s.inst = 'bass';
        Scales.save();
        showTab('scales');
        return true;
      }
    }
    return false;
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
      ${toggle(t('showTun'), 'showTuning', S.showTuning, t('showTunD'))}
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
      <a href="#" data-a="openRepo">${t('source')}: github.com/jonsolberg/plektrum</a><br>
      <a href="#" data-a="openSite">${X('More apps and games', 'Fler appar och spel')}: jonsolberg.se</a>
    </div>
    <div class="setgroup small" style="line-height:1.5;padding:12px 14px">
      ${t('beerT')}
      <button class="btn primary" data-a="openKofi" style="width:100%;margin-top:10px">❤️ ${t('beer')}</button>
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
/** each tab plays with its own instrument's sound */
function soundFor(tab) {
  Snd.setTimbre(tab === 'tuner' ? S.instrument : tab === 'scales' ? (Scales.instId ? Scales.instId() : 'guitar') : S.chordInst);
}
const tabScroll = {};
function showTab(k) {
  const same = S.tab === k;
  tabScroll[S.tab] = window.scrollY;
  soundFor(k);
  if (S.tab === 'tuner' && k !== 'tuner') { if (Pitch.running) Tuner.stop(); Tuner.stopPipe(); }
  if (S.tab === 'practice' && k !== 'practice') Listen.stop();
  S.tab = k; saveS();
  document.querySelectorAll('main > section').forEach(s => s.classList.toggle('on', s.id === 'tab-' + k));
  document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('on', b.dataset.tab === k));
  RENDER[k]();
  // like a native app: each tab keeps its place; tapping the current tab again goes to the top
  window.scrollTo(0, same ? 0 : (tabScroll[k] || 0));
}
/* hide the bottom bar while the keyboard is open instead of letting it ride up on top of it */
(function () {
  let full = window.innerHeight;
  const check = () => {
    if (window.innerHeight > full) full = window.innerHeight;
    document.body.classList.toggle('kb', window.innerHeight < full * 0.78);
  };
  window.addEventListener('resize', check);
  window.addEventListener('orientationchange', () => { full = 0; setTimeout(check, 300); });
})();
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
    if (settingsSeg(k, v) || Practice.seg(k, v) || Listen.seg(k, v) || Studio.seg(k, v) || CircleTab.seg(k, v) || Scales.seg(k, v) || Tuner.seg(k, v) || Metro.seg(k, v)) return;
    return;
  }
  if (a === 'openRepo') {
    e.preventDefault();
    if (AND && AND.openUrl) AND.openUrl(REPO); else window.open(REPO, '_blank');
    return;
  }
  if (a === 'openSite') {
    e.preventDefault();
    const SITE = 'https://jonsolberg.se:8080/';
    if (AND && AND.openUrl) AND.openUrl(SITE); else window.open(SITE, '_blank');
    return;
  }
  if (a === 'openKofi') {
    e.preventDefault();
    if (AND && AND.openUrl) AND.openUrl(KOFI); else window.open(KOFI, '_blank');
    return;
  }
  Listen.action(a, v) || Chords.action(a, v) || Studio.action(a, v) || CircleTab.action(a, v) || Scales.action(a, v) ||
    Tuner.action(a, v) || Metro.action(a, v) || Practice.action(a, v);
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (Pitch.running) Tuner.stop();
    Tuner.stopPipe();
  }
});

window.onAppPause = () => { if (Pitch.running) Tuner.stop(); Tuner.stopPipe(); Listen.stop(); };

/* boot */
soundFor(S.tab);
Studio.init();
Chords.bindSearch();
if (!TABS.includes(S.tab)) S.tab = 'chords';
applySettings();
renderChrome();
document.querySelectorAll('main > section').forEach(s => s.classList.toggle('on', s.id === 'tab-' + S.tab));
RENDER[S.tab]();
