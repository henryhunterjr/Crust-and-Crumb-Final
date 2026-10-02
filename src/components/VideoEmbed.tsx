'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

/** Click-to-play YouTube embed. Shows the thumbnail until the visitor presses play,
 *  then loads the privacy-enhanced (youtube-nocookie) player. Keeps term pages fast. */
export default function VideoEmbed({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className="m-0 flex flex-col gap-2">
      <div className="relative w-full overflow-hidden rounded-[18px] bg-black" style={{ aspectRatio: '16 / 9' }}>
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 w-full h-full"
          >
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-[rgba(20,14,8,0.72)] border border-[rgba(240,200,120,0.6)] group-hover:scale-105 transition-transform">
                <Play size={28} className="text-[#f0c878] ml-1" fill="currentColor" aria-hidden="true" />
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="text-[15px] font-semibold text-[#fff8ec] leading-snug">{title}</figcaption>
    </figure>
  );
}
