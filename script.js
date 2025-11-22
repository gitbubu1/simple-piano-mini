const NOTE_FREQ = {
  C4: 261.63,
  "C#4": 277.18,
  D4: 293.66,
  "D#4": 311.13,
  E4: 329.63,
  F4: 349.23,
  "F#4": 369.99,
  G4: 392.0,
  "G#4": 415.3,
  A4: 440.0,
  "A#4": 466.16,
  B4: 493.88,
  C5: 523.25
};

// keyboard support
const KEYBOARD_MAP = {
  a: "C4",
  w: "C#4",
  s: "D4",
  e: "D#4",
  d: "E4",
  f: "F4",
  t: "F#4",
  g: "G4",
  y: "G#4",
  h: "A4",
  u: "A#4",
  j: "B4",
  k: "C5"
};

let audioCtx;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playNote(note) {
  const freq = NOTE_FREQ[note];
  if (!freq) return;

  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.8, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.65);
}

function setPressed(note, pressed) {
  document.querySelectorAll(`.key[data-note="${note}"]`)
    .forEach((el) => el.classList.toggle("pressed", pressed));
}

// mouse / touch controls
document.querySelectorAll(".key").forEach((keyEl) => {
  const note = keyEl.dataset.note;

  keyEl.addEventListener("mousedown", () => {
    setPressed(note, true);
    playNote(note);
  });

  keyEl.addEventListener("mouseup", () => setPressed(note, false));
  keyEl.addEventListener("mouseleave", () => setPressed(note, false));

  keyEl.addEventListener("touchstart", (e) => {
    e.preventDefault();
    setPressed(note, true);
    playNote(note);
  }, { passive: false });

  keyEl.addEventListener("touchend", () => setPressed(note, false));
});

// keyboard support
const downKeys = new Set();

window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (downKeys.has(key)) return;

  const note = KEYBOARD_MAP[key];
  if (!note) return;

  downKeys.add(key);
  setPressed(note, true);
  playNote(note);
});

window.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  const note = KEYBOARD_MAP[key];

  if (!note) return;

  downKeys.delete(key);
  setPressed(note, false);
});
