'use client';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function BackToGlossary() {
  const [href, setHref] = useState('/#dictionary');
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('glossary-view');
      if (saved && /^\/(?:\?|#|$)/.test(saved) && !saved.startsWith('//')) setHref(saved);
    } catch { /* Browsing works without storage. */ }
  }, []);
  return <a href={href} className="btn-gold inline-flex items-center gap-2 min-h-11 px-5 rounded-full font-bold text-sm shrink-0">
    <ArrowLeft size={17} /> Back to glossary
  </a>;
}
