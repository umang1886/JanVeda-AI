/**
 * audio.js — Web Audio API EVM beep generator.
 * No audio file needed — pure programmatic sound.
 */

/**
 * Plays a short EVM confirmation beep using the Web Audio API oscillator.
 * Graceful degradation if audio is not available.
 */
export function playEVMBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880; // A5 note
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
    // Clean up
    setTimeout(() => ctx.close(), 600);
  } catch (e) {
    // Audio not supported — graceful degradation
    console.warn('EVM beep: audio not available', e);
  }
}

/**
 * Plays a success chime for vote confirmation.
 */
export function playSuccessChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523, 659, 784]; // C, E, G (major chord)
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const start = ctx.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
      osc.start(start);
      osc.stop(start + 0.5);
    });
    setTimeout(() => ctx.close(), 1200);
  } catch (e) {
    console.warn('Success chime: audio not available', e);
  }
}
