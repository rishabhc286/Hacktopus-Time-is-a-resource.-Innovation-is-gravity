import { useEffect, useRef, useState } from 'react';
import bgMusic from './web_background_music.mp3';

// ── Global engine state ─────────────────────────────────────────────────────
let soundTrigger: ((type: 'click' | 'warp' | 'sonar' | 'telemetry') => void) | null = null;
let globalAnalyser: AnalyserNode | null = null;

/** Called by AudioVisualizer to poll live frequency data */
export const getAnalyser = (): AnalyserNode | null => globalAnalyser;

export const playSound = (type: 'click' | 'warp' | 'sonar' | 'telemetry') => {
  if (soundTrigger) soundTrigger(type);
};

interface AudioEngineProps {
  isMuted: boolean;
  onToggleMute: (muted: boolean) => void;
}

export default function AudioEngine({ isMuted, onToggleMute }: AudioEngineProps) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextWiredRef = useRef(false);
  // Ref always holds the latest isMuted value — avoids stale closures in event handlers
  const isMutedRef = useRef(isMuted);

  // ── PHASE 1: Preload the audio file immediately on mount ──────────────────
  // The browser starts downloading the MP3 right away so it's buffered
  // by the time the user clicks. No AudioContext needed yet.
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.crossOrigin = 'anonymous'; // Required for MediaElementSourceNode
    audio.preload = 'auto';          // ← Tell browser to buffer the whole file NOW
    audio.volume = 0;                // Silent until user unmutes
    audio.src = bgMusic;

    audio.onerror = (e) => {
      console.warn('AudioEngine: Background music failed to load:', e);
    };

    musicRef.current = audio;

    // Start loading immediately — browsers respect this even without user interaction
    audio.load();

    return () => {
      audio.pause();
      audio.src = '';
      musicRef.current = null;
      globalAnalyser = null;
    };
  }, []);

  // Keep isMutedRef in sync with the prop on every render
  useEffect(() => {
    isMutedRef.current = isMuted;
  });

  // ── PHASE 2: Wire AudioContext + AnalyserNode on first user interaction ───
  // AudioContext creation requires a user gesture (browser autoplay policy).
  // Uses isMutedRef (not isMuted) so it always reads the *current* value,
  // even when invoked from a stale click-handler closure.
  const initAudioContext = () => {
    if (audioContextWiredRef.current) return;
    audioContextWiredRef.current = true;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Read current mute state from ref, not stale closure
      const currentlyMuted = isMutedRef.current;

      // Master Gain for SFX
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(currentlyMuted ? 0 : 0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Wire the already-loaded <audio> element into the Web Audio graph
      const audio = musicRef.current;
      if (audio) {
        const source = ctx.createMediaElementSource(audio);
        sourceNodeRef.current = source;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;              // → 128 frequency bins
        analyser.smoothingTimeConstant = 0.80;
        analyserRef.current = analyser;
        globalAnalyser = analyser;

        // Route: source → analyser → speakers
        source.connect(analyser);
        analyser.connect(ctx.destination);

        // Play immediately if user has already unmuted
        if (!currentlyMuted) {
          audio.volume = 0.28;
          audio.play().catch(err =>
            console.warn('AudioEngine: Playback deferred:', err)
          );
        }
      }
    } catch (e) {
      console.warn('AudioEngine: Failed to initialize AudioContext:', e);
    }
  };

  // First-interaction bootstrapper — uses capture phase so it fires BEFORE
  // React synthetic events, ensuring AudioContext is wired synchronously
  // with the same user gesture that triggered the state change.
  useEffect(() => {
    const handle = () => {
      initAudioContext();
      window.removeEventListener('click', handle, true);
      window.removeEventListener('keydown', handle, true);
    };
    window.addEventListener('click', handle, true); // capture phase
    window.addEventListener('keydown', handle, true);
    return () => {
      window.removeEventListener('click', handle, true);
      window.removeEventListener('keydown', handle, true);
    };
  }, []);

  // ── Sound effects trigger ─────────────────────────────────────────────────
  useEffect(() => {
    soundTrigger = (type: 'click' | 'warp' | 'sonar' | 'telemetry') => {
      const ctx = audioCtxRef.current;
      const master = masterGainRef.current;
      if (!ctx || isMuted || !master) return;

      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain); gain.connect(master);
        osc.start(now); osc.stop(now + 0.1);

      } else if (type === 'warp') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const sweepFilter = ctx.createBiquadFilter();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.35);
        sweepFilter.type = 'lowpass';
        sweepFilter.frequency.setValueAtTime(200, now);
        sweepFilter.frequency.exponentialRampToValueAtTime(2000, now + 0.35);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        osc.connect(sweepFilter); sweepFilter.connect(gain); gain.connect(master);
        osc.start(now); osc.stop(now + 0.45);

      } else if (type === 'sonar') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
        osc.connect(gain); gain.connect(master);
        osc.start(now); osc.stop(now + 1.0);

      } else if (type === 'telemetry') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(820, now);
        gain.gain.setValueAtTime(0.005, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.connect(gain); gain.connect(master);
        osc.start(now); osc.stop(now + 0.05);
      }
    };

    return () => { soundTrigger = null; };
  }, [isMuted]);

  // ── Live mute / unmute ────────────────────────────────────────────────────
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      masterGainRef.current.gain.setTargetAtTime(isMuted ? 0 : 0.08, now, 0.15);
      if (!isMuted && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    }

    const audio = musicRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = 0;
      audio.pause();
    } else {
      audio.volume = 0.28;
      // AudioContext not yet created — initAudioContext will handle play()
      if (audioContextWiredRef.current) {
        audio.play().catch(e =>
          console.warn('AudioEngine: Music resume failed:', e)
        );
      }
    }
  }, [isMuted]);

  return null;
}
