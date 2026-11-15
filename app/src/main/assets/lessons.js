/*
 * Plektrum – music theory lessons (English and Swedish).
 * Copyright (C) 2026 Jon Solberg — GNU GPL v3 or later.
 *
 * Block types: h (heading), p (paragraph), notes (MIDI notes to play in turn), scale {id, root},
 * table (rows of [label, formula, play]), diatonic (root), tab (pre-formatted), chart (chord name),
 * go ([tab or quiz id, label]).
 */
'use strict';

const T2 = (en, sv) => ({ en, sv });

const LESSONS = [
  {
    id: 'notes', icon: 'note', title: T2('The twelve notes', 'De tolv tonerna'),
    blocks: [
      { p: T2('Western music uses twelve notes that repeat in octaves. Seven of them have letter names: C D E F G A B. Between most of them lies one more note, named with a sharp ♯ (a step up) or a flat ♭ (a step down) – so C♯ and D♭ are the same note.',
              'Västerländsk musik använder tolv toner som upprepas i oktaver. Sju av dem har bokstavsnamn: C D E F G A B. Mellan de flesta ligger ytterligare en ton, som får ett kors ♯ (ett steg upp) eller ett b ♭ (ett steg ner) – C♯ och D♭ är alltså samma ton.') },
      { notes: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72], label: T2('All twelve notes from C to C', 'Alla tolv toner från C till C') },
      { p: T2('The step from one note to the next is a semitone – one fret on a guitar. There is no note between E and F, or between B and C.',
              'Steget från en ton till nästa är ett halvt tonsteg – ett band på gitarren. Det finns ingen ton mellan E och F, eller mellan B och C.') },
      { p: T2('Twelve semitones up you reach the octave: the same note name, sounding "the same, only higher" because the frequency has doubled. A4 is tuned to 440 Hz, A5 to 880 Hz.',
              'Tolv halvtoner upp når du oktaven: samma tonnamn, som låter "likadant fast högre" eftersom frekvensen har fördubblats. A4 stäms till 440 Hz, A5 till 880 Hz.') },
      { notes: [57, 69], label: T2('A and the A an octave higher', 'A och A en oktav högre') },
      { p: T2('In Sweden and Germany B is often called H, and B♭ is called B. You can switch to those names under Settings.',
              'I Sverige och Tyskland kallas B ofta H, och B♭ kallas B. Du kan byta till de namnen under Inställningar.') },
      { go: [['noteName', T2('Quiz: name the note', 'Quiz: vilken ton?')], ['findNote', T2('Quiz: find the note', 'Quiz: hitta tonen')]] },
    ],
  },
  {
    id: 'intervals', icon: 'ear', title: T2('Intervals', 'Intervall'),
    blocks: [
      { p: T2('An interval is the distance between two notes, counted in semitones. Each has a name – tap a row to hear it from C.',
              'Ett intervall är avståndet mellan två toner, räknat i halvtoner. Varje intervall har ett namn – tryck på en rad för att höra det från C.') },
      { intervals: true },
      { p: T2('Consonant intervals – thirds, fifths, sixths and the octave – sound stable. Dissonant ones – seconds, sevenths and the tritone – create tension that wants to move on.',
              'Konsonanta intervall – terser, kvinter, sexter och oktaven – låter stabila. Dissonanta – sekunder, septimor och tritonus – skapar en spänning som vill vidare.') },
      { p: T2('On a guitar in standard tuning, the next string up is a perfect 4th higher (5 semitones) – except from G to B, which is a major 3rd. That is why chord shapes change on the B string.',
              'På en gitarr i standardstämning ligger nästa sträng en ren kvart högre (5 halvtoner) – utom från G till H, som är en stor ters. Det är därför greppen ändrar form på H-strängen.') },
      { go: [['intervals', T2('Quiz: intervals by ear', 'Quiz: intervall på gehör')]] },
    ],
  },
  {
    id: 'major', icon: 'scales', title: T2('The major scale', 'Durskalan'),
    blocks: [
      { p: T2('The major scale has seven notes and a fixed pattern of steps: whole, whole, half, whole, whole, whole, half (W W H W W W H). A whole step is two semitones, a half step one.',
              'Durskalan har sju toner och ett fast mönster av steg: hel, hel, halv, hel, hel, hel, halv (W W H W W W H). Ett helt tonsteg är två halvtoner, ett halvt tonsteg en.') },
      { scale: { id: 'major', root: 0 } },
      { p: T2('Start on any note and follow the pattern to get its major scale. Starting on G, the pattern needs an F♯ – which is why G major has one sharp.',
              'Börja på vilken ton som helst och följ mönstret så får du dess durskala. Börjar du på G kräver mönstret ett F♯ – därför har G-dur ett korsförtecken.') },
      { scale: { id: 'major', root: 7 } },
      { p: T2('The notes are numbered 1 to 7 – the scale degrees. 1 is the tonic, the home note. The numbers name chord notes and intervals: "the 3rd", "the 5th", "a ♭7".',
              'Tonerna numreras 1 till 7 – skalstegen. 1 är grundtonen, hemmet. Siffrorna används för ackordtoner och intervall: "tersen", "kvinten", "en ♭7".') },
      { go: [['tab:scales', T2('Open Scales', 'Öppna Skalor')], ['theory', T2('Quiz: scales & keys', 'Quiz: skalor & tonarter')]] },
    ],
  },
  {
    id: 'keys', icon: 'circle', title: T2('Keys and key signatures', 'Tonarter och förtecken'),
    blocks: [
      { p: T2('A key is the set of notes a piece mostly uses, named after its home note. C major uses only the natural notes; every other key has a key signature – a fixed set of sharps or flats.',
              'En tonart är de toner ett stycke mest använder, uppkallad efter grundtonen. C-dur använder bara stamtoner; alla andra tonarter har förtecken – en fast uppsättning kors eller b.') },
      { p: T2('Going round the circle of fifths clockwise adds one sharp each step: G has 1, D has 2, A has 3 … Anticlockwise adds one flat: F has 1, B♭ has 2, E♭ has 3 …',
              'Medurs runt kvintcirkeln tillkommer ett kors per steg: G har 1, D har 2, A har 3 … Moturs tillkommer ett b: F har 1, B♭ har 2, E♭ har 3 …') },
      { p: T2('Sharps are added in the order F♯ C♯ G♯ D♯ A♯ E♯ B♯, flats in the order B♭ E♭ A♭ D♭ G♭ C♭ F♭ – the same order you meet them going round the circle.',
              'Korsen tillkommer i ordningen F♯ C♯ G♯ D♯ A♯ E♯ H♯, b:na i ordningen B♭ E♭ A♭ D♭ G♭ C♭ F♭ – samma ordning som runt cirkeln.') },
      { p: T2('Every major key has a relative minor with exactly the same notes, starting on its 6th note: C major and A minor, G major and E minor.',
              'Varje durtonart har en parallelltonart i moll med exakt samma toner, som börjar på dess sjätte ton: C-dur och a-moll, G-dur och e-moll.') },
      { scale: { id: 'minor', root: 9 } },
      { go: [['tab:circle', T2('Open the circle of fifths', 'Öppna kvintcirkeln')], ['theory', T2('Quiz: scales & keys', 'Quiz: skalor & tonarter')]] },
    ],
  },
  {
    id: 'minor', icon: 'scales', title: T2('Minor scales', 'Mollskalor'),
    blocks: [
      { p: T2('Natural minor (W H W W H W W) is the major scale started from its 6th note. Compared with major it has a ♭3, ♭6 and ♭7, which give it its darker sound.',
              'Ren moll (W H W W H W W) är durskalan spelad från dess sjätte ton. Jämfört med dur har den ♭3, ♭6 och ♭7, som ger det mörkare ljudet.') },
      { scale: { id: 'minor', root: 9 } },
      { p: T2('Harmonic minor raises the 7th (G♯ in A minor). The V chord then becomes major and pulls strongly home – and the step from F to G♯ gives the scale its exotic sound.',
              'Harmonisk moll höjer sjunde tonen (G♯ i a-moll). Då blir V-ackordet dur och drar starkt hem – och steget från F till G♯ ger skalan dess exotiska klang.') },
      { scale: { id: 'harm', root: 9 } },
      { p: T2('Melodic minor raises both the 6th and the 7th. Classical music uses it going up; in jazz it is used both ways and is the source of many modern sounds.',
              'Melodisk moll höjer både sexten och septiman. Klassisk musik använder den uppåt; i jazz används den åt båda hållen och är källan till många moderna klanger.') },
      { scale: { id: 'mel', root: 9 } },
      { go: [['tab:scales', T2('Open Scales', 'Öppna Skalor')]] },
    ],
  },
  {
    id: 'triads', icon: 'chords', title: T2('Triads', 'Treklanger'),
    blocks: [
      { p: T2('A chord is three or more notes played together. The basic chord – a triad – stacks two thirds on a root: 1, 3 and 5. Tap a row to hear it.',
              'Ett ackord är tre eller fler toner som spelas samtidigt. Grundackordet – treklangen – staplar två terser på en grundton: 1, 3 och 5. Tryck på en rad för att höra.') },
      { table: [[T2('Major', 'Dur'), '1 – 3 – 5', 'C'], [T2('Minor', 'Moll'), '1 – ♭3 – 5', 'Cm'], [T2('Diminished', 'Förminskat'), '1 – ♭3 – ♭5', 'Cdim'],
                [T2('Augmented', 'Överstigande'), '1 – 3 – ♯5', 'Caug'], [T2('Suspended 2nd', 'Sus 2'), '1 – 2 – 5', 'Csus2'], [T2('Suspended 4th', 'Sus 4'), '1 – 4 – 5', 'Csus4']] },
      { p: T2('The 3rd decides major or minor. The difference between the bright and the sad sound is a single semitone – compare C and Cm.',
              'Tersen avgör dur eller moll. Skillnaden mellan det ljusa och det sorgsna är ett enda halvt tonsteg – jämför C och Cm.') },
      { p: T2('An inversion keeps the notes but puts another one in the bass: C/E has E lowest, C/G has G lowest. These are written as slash chords.',
              'I en omvändning behålls tonerna men en annan hamnar i basen: C/E har E längst ner, C/G har G. De skrivs som snedstrecksackord.') },
      { table: [['C', '', 'C'], ['C/E', '', 'C/E'], ['C/G', '', 'C/G']] },
      { go: [['chordEar', T2('Quiz: chord types by ear', 'Quiz: ackordtyper på gehör')], ['tab:chords', T2('Open Chords', 'Öppna Ackord')]] },
    ],
  },
  {
    id: 'sevenths', icon: 'chords', title: T2('Seventh chords and extensions', 'Septimaackord och utvidgningar'),
    blocks: [
      { p: T2('Stack one more third on a triad and you get a seventh chord. The five common ones:',
              'Staplar du ytterligare en ters på en treklang får du ett septimaackord. De fem vanligaste:') },
      { table: [[T2('Major 7th', 'Stor septima'), '1 – 3 – 5 – 7', 'Cmaj7'], [T2('Dominant 7th', 'Septimaackord'), '1 – 3 – 5 – ♭7', 'C7'], [T2('Minor 7th', 'Moll med septima'), '1 – ♭3 – 5 – ♭7', 'Cm7'],
                [T2('Half-diminished', 'Halvförminskat'), '1 – ♭3 – ♭5 – ♭7', 'Cm7b5'], [T2('Diminished 7th', 'Förminskat septima'), '1 – ♭3 – ♭5 – ♭♭7', 'Cdim7']] },
      { p: T2('The dominant 7th (such as G7) holds a tritone – B and F – that wants to resolve. That is what makes G7 lead so strongly home to C.',
              'Septimaackordet (till exempel G7) innehåller en tritonus – H och F – som vill lösas upp. Det är därför G7 leder så starkt hem till C.') },
      { table: [['G7', '', 'G7'], ['C', '', 'C']] },
      { p: T2('Extensions keep stacking thirds above the octave: the 9 (the 2 an octave up), the 11 (the 4) and the 13 (the 6). An add9 chord adds the 9 without the 7th; a 6 chord adds the 6th.',
              'Utvidgningar fortsätter stapla terser över oktaven: 9 (tvåan en oktav upp), 11 (fyran) och 13 (sexan). Ett add9-ackord lägger till nian utan septiman; ett 6-ackord lägger till sexten.') },
      { table: [['Cadd9', '1 – 3 – 5 – 9', 'Cadd9'], ['C9', '1 – 3 – 5 – ♭7 – 9', 'C9'], ['C6', '1 – 3 – 5 – 6', 'C6']] },
      { go: [['chords', T2('Quiz: name the chord', 'Quiz: namnge ackordet')]] },
    ],
  },
  {
    id: 'diatonic', icon: 'circle', title: T2('Chords in a key', 'Ackord i en tonart'),
    blocks: [
      { p: T2('Build a triad on each note of the major scale, using only notes of the key, and you get its seven chords. Roman numerals number them: capitals are major, small letters minor, ° diminished.',
              'Bygg en treklang på varje ton i durskalan, med bara tonartens toner, så får du dess sju ackord. Romerska siffror numrerar dem: versaler är dur, gemener moll, ° förminskat.') },
      { diatonic: 0 },
      { p: T2('The chords have three jobs. Tonic (I, vi) is rest and home. Subdominant (IV, ii) moves away. Dominant (V, vii°) builds tension that wants to return to I.',
              'Ackorden har tre roller. Tonika (I, vi) är vila och hem. Subdominant (IV, ii) rör sig bort. Dominant (V, vii°) bygger spänning som vill tillbaka till I.') },
      { p: T2('Most songs move between these: I–V–vi–IV (pop), I–IV–V (rock and blues), ii–V–I (jazz). The same numbers work in every key – that is what makes transposing easy.',
              'De flesta låtar rör sig mellan dessa: I–V–vi–IV (pop), I–IV–V (rock och blues), ii–V–I (jazz). Samma siffror fungerar i alla tonarter – det gör det lätt att transponera.') },
      { diatonic: 7 },
      { go: [['tab:circle', T2('Open the circle of fifths', 'Öppna kvintcirkeln')], ['tab:studio', T2('Try them in the Studio', 'Prova i Studio')], ['theory', T2('Quiz: scales & keys', 'Quiz: skalor & tonarter')]] },
    ],
  },
  {
    id: 'modes', icon: 'scales', title: T2('Modes', 'Modus'),
    blocks: [
      { p: T2('A mode is the major scale started from another of its notes. The notes stay the same, but the home note moves – and the mood changes. Here every mode starts on C so you can compare them.',
              'Ett modus är durskalan spelad från en annan av sina toner. Tonerna är desamma, men hemmet flyttas – och stämningen ändras. Här börjar alla modus på C så att du kan jämföra.') },
      { modes: [['major', T2('Bright, happy', 'Ljus, glad')], ['dor', T2('Minor with a bright 6th – folk, jazz, funk', 'Moll med ljus sext – folk, jazz, funk')],
                ['phr', T2('Minor with a ♭2 – Spanish, metal', 'Moll med ♭2 – spanskt, metal')], ['lyd', T2('Major with a ♯4 – dreamy, film music', 'Dur med ♯4 – drömskt, filmmusik')],
                ['mix', T2('Major with a ♭7 – rock, blues, Celtic', 'Dur med ♭7 – rock, blues, keltiskt')], ['minor', T2('Natural minor – sad, serious', 'Ren moll – sorgsen, allvarlig')],
                ['loc', T2('♭2 and ♭5 – tense and unstable', '♭2 och ♭5 – spänd och instabil')]] },
      { p: T2('To hear a mode properly, play it over its own root: D Dorian over a Dm chord, G Mixolydian over G7.',
              'För att verkligen höra ett modus, spela det över sin egen grundton: D dorisk över ett Dm-ackord, G mixolydisk över G7.') },
      { go: [['tab:scales', T2('Open Scales', 'Öppna Skalor')]] },
    ],
  },
  {
    id: 'pent', icon: 'scales', title: T2('Pentatonic and blues', 'Pentatonik och blues'),
    blocks: [
      { p: T2('Pentatonic scales have five notes and no semitone steps, so it is hard to hit a "wrong" note. They are the backbone of rock, blues and folk melodies all over the world.',
              'Pentatoniska skalor har fem toner och inga halvtonssteg, så det är svårt att träffa en "fel" ton. De är stommen i rock, blues och folkmelodier över hela världen.') },
      { scale: { id: 'pmin', root: 9 } },
      { p: T2('Minor pentatonic: 1 ♭3 4 5 ♭7. Major pentatonic: 1 2 3 5 6. A minor pentatonic and C major pentatonic share the same notes.',
              'Mollpentatonisk: 1 ♭3 4 5 ♭7. Durpentatonisk: 1 2 3 5 6. A-mollpentatonisk och C-durpentatonisk har samma toner.') },
      { scale: { id: 'pmaj', root: 0 } },
      { p: T2('The blues scale adds the ♭5 – the "blue note" – to the minor pentatonic. Bend into it or slide through it.',
              'Bluesskalan lägger till ♭5 – den "blå tonen" – i mollpentatoniken. Böj upp till den eller glid förbi.') },
      { scale: { id: 'blues', root: 9 } },
      { p: T2('On the guitar the scale falls into five boxes that link up along the neck. Learn box 1 first – Scales, position 1.',
              'På gitarren delas skalan in i fem lådor som hänger ihop längs halsen. Lär dig låda 1 först – Skalor, läge 1.') },
      { go: [['tab:scales', T2('Open Scales', 'Öppna Skalor')]] },
    ],
  },
  {
    id: 'rhythm', icon: 'practice', title: T2('Rhythm', 'Rytm'),
    blocks: [
      { p: T2('The beat is the pulse you tap your foot to. Tempo is measured in beats per minute (BPM): 60 is one beat a second, 120 is two.',
              'Pulsen är det du stampar takten till. Tempo mäts i slag per minut (BPM): 60 är ett slag i sekunden, 120 två.') },
      { p: T2('The time signature tells how many beats a bar holds and which note gets the beat. 4/4 has four quarter-note beats; 3/4 is the waltz; 6/8 has two beats, each split in three eighths – called compound time.',
              'Taktarten anger hur många slag en takt har och vilket notvärde som är slaget. 4/4 har fyra fjärdedelsslag; 3/4 är valstakt; 6/8 har två slag som vart och ett delas i tre åttondelar – sammansatt takt.') },
      { p: T2('Subdivisions split the beat: eighths are counted "1 & 2 &", sixteenths "1 e & a", triplets "1 & a".',
              'Underdelningar delar slaget: åttondelar räknas "1 och 2 och", sextondelar "1 e och a", trioler "1 och a".') },
      { p: T2('Syncopation puts accents off the beat – on the "&" – which gives funk, reggae and Latin music their drive. Swing plays the off-beat eighths late, long–short, as in blues and jazz.',
              'Synkopering lägger betoningar mellan slagen – på "och" – vilket ger funk, reggae och latinmusik deras driv. Swing spelar offbeat-åttondelarna sent, långt–kort, som i blues och jazz.') },
      { go: [['metro', T2('Open the metronome', 'Öppna metronomen')], ['tab:studio', T2('Strumming patterns in the Studio', 'Komp i Studio')]] },
    ],
  },
  {
    id: 'charts', icon: 'chords', title: T2('Reading chord charts and tab', 'Läsa ackorddiagram och tabulatur'),
    blocks: [
      { p: T2('A chord chart shows the neck standing up. Vertical lines are strings, the lowest on the left; horizontal lines are frets. A dot shows where to press, its number which finger (1 index … 4 little finger). ○ is an open string, ✕ a string you do not play.',
              'Ett ackorddiagram visar halsen stående. Lodräta linjer är strängar, den lägsta till vänster; vågräta linjer är band. En prick visar var du trycker och siffran vilket finger (1 pekfinger … 4 lillfinger). ○ är en öppen sträng, ✕ en sträng du inte spelar.') },
      { chart: 'C' },
      { p: T2('A long bar across several strings is a barre: one finger presses them all. A number beside the chart gives the fret it starts at.',
              'En lång stapel över flera strängar är ett barré: ett finger trycker ner alla. En siffra bredvid diagrammet anger vilket band det börjar på.') },
      { chart: 'F' },
      { p: T2('Tablature (tab) writes music as lines for the strings – the highest string at the top – with fret numbers on them. Read from left to right; numbers above each other are played together.',
              'Tabulatur (tab) skriver musik som linjer för strängarna – den ljusaste överst – med bandnummer på. Läs från vänster till höger; siffror ovanför varandra spelas samtidigt.') },
      { tab: 'e|-------0-------|\nB|-----1---1-----|\nG|---0-------0---|\nD|-2-------------|\nA|3--------------|\nE|---------------|', notes: [48, 52, 55, 60, 64, 60, 55] },
      { go: [['tab:chords', T2('Open Chords', 'Öppna Ackord')]] },
    ],
  },
];

if (typeof module !== 'undefined') module.exports = { LESSONS };
