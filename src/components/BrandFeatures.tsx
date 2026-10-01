'use client';

import { useEffect, useRef, useState } from 'react';

export function WheatFilm() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyPreference = () => {
      if (preference.matches) video.current?.pause();
      else void video.current?.play().catch(() => {});
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
    <aside className="storefront-feature col-span-full print:hidden" aria-labelledby="storefront-heading">
      <img className="storefront-portrait" src="/brand/henry-storefront.png" alt="Henry presenting a bakery website on a phone" loading="lazy" width="941" height="1672" />
      <div className="storefront-copy">
        <p className="brand-eyebrow">From our baking community</p>
        <h2 id="storefront-heading">You’re a baker.<br />Your website should be the easy part.</h2>
        <p>Taking your bread beyond your own kitchen? Meet Storefront Builder from From Oven to Market. Give your baking a place online, without starting with code.</p>
        <a className="brand-link" href="https://fromoventomarket.com/storefront-builder/funnel?utm_source=glossary&utm_medium=referral&utm_campaign=glossary-launch" target="_blank" rel="noopener noreferrer">Explore Storefront Builder <span aria-hidden="true">↗</span></a>
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
        <a href="https://pantry.bakinggreatbread.com/?utm_source=glossary&utm_medium=referral&utm_campaign=glossary-launch" target="_blank" rel="noopener noreferrer">
          <img src="/brand/recipe-pantry.png" alt="Recipe Pantry" loading="lazy" width="1280" height="720" />
          <h3>Put it into practice <span aria-hidden="true">↗</span></h3>
          <p>Find your next bake in Recipe Pantry.</p>
        </a>
        <a href="https://recipepantry.app/collections/ancient-grains" target="_blank" rel="noopener noreferrer">
          <img src="/brand/ancient-grains.png" alt="Recipe Pantry Ancient Grains" loading="lazy" width="1254" height="1254" />
          <h3>Get to know your grains <span aria-hidden="true">↗</span></h3>
          <p>Explore the Ancient Grains recipe collection.</p>
        </a>
        <a href="https://www.facebook.com/groups/1082865755403754" target="_blank" rel="noopener noreferrer">
          <img src="/brand/community.png" alt="Baking Great Bread at Home" loading="lazy" width="1024" height="1024" />
          <h3>Pull up a chair <span aria-hidden="true">↗</span></h3>
          <p>Share your bakes with our bread community.</p>
        </a>
      </div>
    </section>
  );
}
