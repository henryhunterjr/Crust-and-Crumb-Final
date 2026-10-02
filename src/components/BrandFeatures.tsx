'use client';

import { useEffect, useRef, useState } from 'react';
import { AFFILIATE_LINKS, GRAND_TETON_URL, NUTRIMILL_URL, NUTRIMILL_CODE } from '../constants';

export function AffiliateDisclosure({ className = '' }: { className?: string }) {
  return <p className={`text-sm leading-relaxed ${className}`}>Some equipment and partner links are affiliate links. Henry may earn a commission from qualifying purchases.</p>;
}

export function WireMonkeyFeature() {
  return (
    <aside className="mb-10 print:hidden" aria-label="Wire Monkey scoring tools">
      <a href={AFFILIATE_LINKS.wireMonkeyLame.url} target="_blank" rel="sponsored noopener noreferrer" data-affiliate-link="Wire Monkey" className="block rounded-2xl overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0c878]">
        <img src="/partners/wire-monkey-scoring-lames-banner.png" alt="Wire Monkey handcrafted wood scoring lames, with several lame designs and a scored loaf" width="1200" height="300" loading="lazy" decoding="async" className="w-full h-auto" />
      </a>
      <AffiliateDisclosure className="mt-3 text-[rgba(246,236,220,0.74)]" />
    </aside>
  );
}

export function WheatFilm() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyPreference = () => {
      if (preference.matches) video.current?.pause();
      else video.current?.pause();
    };
    applyPreference();
    preference.addEventListener('change', applyPreference);
    return () => preference.removeEventListener('change', applyPreference);
  }, []);
  return (
    <figure className="wheat-film">
      <video ref={video} muted loop playsInline preload="metadata" poster="/brand/wheat-poster.jpg" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-label="Golden wheat moving in the breeze">
        <source src="/brand/wheat.mp4" type="video/mp4" />
      </video>
      <a className="wheat-pantry-link" href="https://pantry.bakinggreatbread.com/?utm_source=glossary&utm_medium=referral&utm_campaign=glossary-launch" target="_blank" rel="noopener noreferrer" aria-label="Explore recipes in Recipe Pantry">
        <img src="/brand/recipe-pantry.png" alt="Recipe Pantry" width="1280" height="720" />
      </a>
      <figcaption>Good bread starts with understanding.</figcaption>
      <button type="button" aria-label={playing ? 'Pause wheat video' : 'Play wheat video'} onClick={() => {
        if (playing) video.current?.pause();
        else void video.current?.play().catch(() => {});
      }}>{playing ? 'Pause motion' : 'Play motion'}</button>
    </figure>
  );
}

export function StorefrontFeature() {
  return (
    <aside className="storefront-feature glass-strong sheen col-span-full print:hidden" aria-labelledby="storefront-heading">
      <img className="storefront-portrait" src="/brand/henry-storefront.png" alt="Henry presenting a bakery website on a phone" loading="lazy" width="941" height="1672" />
      <div className="storefront-copy">
        <p className="brand-eyebrow">From our baking community</p>
        <h2 id="storefront-heading">You’re a baker.<br />Your website should be the easy part.</h2>
        <p>Taking your bread beyond your own kitchen? Meet Storefront Builder from From Oven to Market. Give your baking a place online, without starting with code.</p>
        <a className="brand-link btn-gold" href="https://fromoventomarket.com/storefront-builder/funnel?utm_source=glossary&utm_medium=referral&utm_campaign=glossary-launch" target="_blank" rel="noopener noreferrer">Explore Storefront Builder <span aria-hidden="true">↗</span></a>
        <img className="storefront-seal" src="/brand/oven-to-market.png" alt="From Oven to Market, a Crust & Crumb Academy course" loading="lazy" width="1254" height="1254" />
      </div>
    </aside>
  );
}

export function BrandShelf() {
  return (
    <section className="brand-shelf print:hidden" aria-labelledby="brand-shelf-heading">
      <p className="brand-eyebrow">More from our kitchen</p>
      <h2 id="brand-shelf-heading">The definition is just the beginning.</h2>
      <p className="brand-shelf-intro">Keep baking, exploring, and learning with the resources behind this guide.</p>
      <div className="brand-shelf-grid">
        <a className="glass sheen lift" href="https://pantry.bakinggreatbread.com/?utm_source=glossary&utm_medium=referral&utm_campaign=glossary-launch" target="_blank" rel="noopener noreferrer">
          <img src="/brand/recipe-pantry.png" alt="Recipe Pantry" loading="lazy" width="1280" height="720" />
          <h3>Put it into practice <span aria-hidden="true">↗</span></h3>
          <p>Find your next bake in Recipe Pantry.</p>
        </a>
        <a className="glass sheen lift" href="https://recipepantry.app/collections/ancient-grains" target="_blank" rel="noopener noreferrer">
          <img src="/brand/ancient-grains.png" alt="Recipe Pantry Ancient Grains" loading="lazy" width="1254" height="1254" />
          <h3>Get to know your grains <span aria-hidden="true">↗</span></h3>
          <p>Explore the Ancient Grains recipe collection.</p>
        </a>
        <a className="glass sheen lift" href="https://www.facebook.com/groups/1082865755403754" target="_blank" rel="noopener noreferrer">
          <img src="/brand/community.png" alt="Baking Great Bread at Home" loading="lazy" width="1024" height="1024" />
          <h3>Pull up a chair <span aria-hidden="true">↗</span></h3>
          <p>Share your bakes with our bread community.</p>
        </a>
      </div>
    </section>
  );
}


/** Henry at the mill: shown on the home page in the fresh-milled path and on milling term pages. */
export function HomeMillingFeature({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={`milling-feature glass-strong sheen print:hidden ${compact ? 'milling-feature-compact' : ''}`} aria-labelledby="milling-heading">
      <img className="milling-photo" src="/partners/henry-nutrimill.webp" alt="Henry Hunter milling hard red wheat in his kitchen with a NutriMill grain mill" loading="lazy" width="1254" height="1254" />
      <div className="milling-copy">
        <p className="brand-eyebrow">Home milling</p>
        <h2 id="milling-heading">Fresh flour changes the bread.</h2>
        <p>Milling at home lets you choose your grain, texture, and when the flour is ground. Freshness, whole-grain content, and storage each matter. I mill on a NutriMill, and Academy bakers save $20 with code <strong>{NUTRIMILL_CODE}</strong>.</p>
        <a className="brand-link btn-gold" href={NUTRIMILL_URL} target="_blank" rel="noopener noreferrer sponsored" data-affiliate-link="NutriMill">Shop NutriMill, save $20 <span aria-hidden="true">↗</span></a>
      </div>
    </aside>
  );
}

/** The grain itself: Grand Teton photo for the matching grain term. */
export function GrainFeature({ src, alt, product }: { src: string; alt: string; product: string }) {
  return (
    <aside className="grain-feature glass sheen print:hidden" aria-label="Where to get this grain">
      <a href={GRAND_TETON_URL} target="_blank" rel="noopener noreferrer sponsored" data-affiliate-link="Grand Teton Ancient Grains" className="grain-photo-link">
        <img className="grain-photo" src={src} alt={alt} loading="lazy" width="900" height="900" />
      </a>
      <div className="grain-copy">
        <img className="grain-seal" src="/partners/grand-teton-seal.png" alt="Proudly produced by Grand Teton Ancient Grains" loading="lazy" width="316" height="336" />
        <p className="brand-eyebrow">Our grain partner</p>
        <h3>{product}</h3>
        <p>Grown and milled by a family farm in Teton, Idaho. Certified 100% organic, food grade, and ready to mill, sprout, or cook whole. This is the grain I bake with.</p>
        <a className="btn-glass" href={GRAND_TETON_URL} target="_blank" rel="noopener noreferrer sponsored" data-affiliate-link="Grand Teton Ancient Grains">Shop Grand Teton Ancient Grains <span aria-hidden="true">↗</span></a>
      </div>
    </aside>
  );
}
