'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  channel?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, title, channel }) => (
  <div className="space-y-2">
    <div className="aspect-video rounded-lg overflow-hidden shadow-md">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        loading="lazy"
      />
    </div>
    <div className="flex items-center justify-between text-sm">
      {channel && (
        <span className="text-slate-500">
          Video by <span className="font-medium text-slate-700">{channel}</span>
        </span>
      )}
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium ml-auto"
      >
        Watch on YouTube <ExternalLink size={14} />
      </a>
    </div>
  </div>
);

export default YouTubeEmbed;
