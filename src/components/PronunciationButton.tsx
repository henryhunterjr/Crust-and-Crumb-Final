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
        setStatus('error');
        audioRef.current = null;
        URL.revokeObjectURL(objectUrl);
        objectUrlRef.current = null;
      };
      await audio.play();
      setStatus('playing');
    } catch {
      setStatus('error');
    }
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
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-2.5 py-1.5 min-h-[40px] text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e2830b] focus-visible:ring-offset-2 ${
        status === 'error'
          ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
          : status === 'playing'
            ? 'border-[#e2830b] bg-[#fff3df] text-[#a85e18]'
            : 'border-[#d8e1dd] bg-[#f7faf7] text-[#4f6d63] hover:border-[#e2830b] hover:bg-[#fff8e7] hover:text-[#a85e18]'
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
