'use client';

import { useEffect, useRef, useState } from 'react';
import { LoaderCircle, Volume2, VolumeX } from 'lucide-react';

interface PronunciationButtonProps {
  termId: string;
  term: string;
  compact?: boolean;
}

const STOP_EVENT = 'crust-crumb-pronunciation-stop';

export default function PronunciationButton({ termId, term, compact = false }: PronunciationButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');

  useEffect(() => {
    const stopAudio = () => {
      audioRef.current?.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      audioRef.current = null;
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
      setStatus('idle');
    };

    window.addEventListener(STOP_EVENT, stopAudio);
    return () => {
      window.removeEventListener(STOP_EVENT, stopAudio);
      stopAudio();
    };
  }, []);

  const playPronunciation = async () => {
    if (status === 'loading') return;

    if (status === 'playing') {
      audioRef.current?.pause();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
      setStatus('idle');
      return;
    }

    window.dispatchEvent(new Event(STOP_EVENT));
    setStatus('loading');

    try {
      const response = await fetch(`/api/pronunciation/${encodeURIComponent(termId)}`);
      if (!response.ok) throw new Error('Pronunciation audio is unavailable.');

      const audioBlob = await response.blob();
      const objectUrl = URL.createObjectURL(audioBlob);
      objectUrlRef.current = objectUrl;
      const audio = new Audio(objectUrl);
      audioRef.current = audio;
      audio.onended = () => {
        setStatus('idle');
        audioRef.current = null;
        URL.revokeObjectURL(objectUrl);
        objectUrlRef.current = null;
      };
      audio.onerror = () => {
        audioRef.current = null;
        URL.revokeObjectURL(objectUrl);
        objectUrlRef.current = null;
        speakWithBrowser();
      };
      await audio.play();
      setStatus('playing');
    } catch {
      speakWithBrowser();
    }
  };

  // Fallback: the visitor's own device voice, so Listen always works
  const speakWithBrowser = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setStatus('error');
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(term);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    const voices = synth.getVoices();
    const preferred = voices.find((v) => v.lang === 'en-US' && /natural|samantha|google us/i.test(v.name))
      || voices.find((v) => v.lang && v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;
    utterance.onend = () => setStatus('idle');
    utterance.onerror = () => setStatus('idle');
    setStatus('playing');
    synth.speak(utterance);
  };

  const label = status === 'playing'
    ? `Pause pronunciation for ${term}`
    : status === 'error'
      ? `Pronunciation unavailable for ${term}`
      : `Play pronunciation for ${term}`;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        void playPronunciation();
      }}
      onTouchEnd={(event) => event.stopPropagation()}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 min-h-[44px] min-w-[44px] text-xs font-semibold transition-colors ${
        status === 'error'
          ? 'border-[rgba(255,122,107,0.45)] bg-[rgba(255,122,107,0.12)] text-[#ffb2a8]'
          : status === 'playing'
            ? 'border-[rgba(240,200,120,0.7)] bg-[rgba(240,200,120,0.18)] text-[#ffe2a8]'
            : 'border-white/15 bg-white/[0.07] text-[rgba(246,236,220,0.85)] hover:border-[rgba(240,200,120,0.55)] hover:text-[#ffe2a8]'
      }`}
      aria-label={label}
      aria-pressed={status === 'playing'}
      title={label}
    >
      {status === 'loading' ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : status === 'playing' ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
      {!compact && <span className="hidden sm:inline">{status === 'loading' ? 'Loading' : status === 'playing' ? 'Pause' : status === 'error' ? 'Unavailable' : 'Listen'}</span>}
    </button>
  );
}
