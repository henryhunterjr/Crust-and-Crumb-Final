'use client';

import React from 'react';
import { ChefHat, Wheat, Calculator, Search, Route, MessageSquare } from 'lucide-react';
import { GLOSSARY_DATA } from '../constants';

interface HeaderProps {
  onHomeClick?: () => void;
  onToolsClick?: () => void;
}

const WHEAT_STALKS = [
  { left: 2, height: 92, delay: -1.1, duration: 4.9, opacity: 0.28 },
  { left: 6, height: 132, delay: -2.8, duration: 5.8, opacity: 0.38 },
  { left: 10, height: 108, delay: -0.4, duration: 5.2, opacity: 0.30 },
  { left: 14, height: 158, delay: -3.3, duration: 6.2, opacity: 0.42 },
  { left: 18, height: 118, delay: -1.7, duration: 5.4, opacity: 0.34 },
  { left: 23, height: 146, delay: -4.0, duration: 6.0, opacity: 0.36 },
  { left: 28, height: 98, delay: -2.2, duration: 5.1, opacity: 0.28 },
  { left: 33, height: 168, delay: -0.8, duration: 6.4, opacity: 0.42 },
  { left: 38, height: 124, delay: -3.6, duration: 5.7, opacity: 0.32 },
  { left: 43, height: 148, delay: -1.4, duration: 6.1, opacity: 0.36 },
  { left: 48, height: 104, delay: -4.4, duration: 5.3, opacity: 0.26 },
  { left: 53, height: 162, delay: -2.0, duration: 6.3, opacity: 0.40 },
  { left: 58, height: 116, delay: -0.2, duration: 5.5, opacity: 0.30 },
  { left: 63, height: 150, delay: -3.1, duration: 6.0, opacity: 0.38 },
  { left: 68, height: 102, delay: -1.0, duration: 5.0, opacity: 0.28 },
  { left: 73, height: 174, delay: -4.2, duration: 6.5, opacity: 0.44 },
  { left: 78, height: 126, delay: -2.5, duration: 5.6, opacity: 0.32 },
  { left: 83, height: 154, delay: -0.6, duration: 6.2, opacity: 0.40 },
  { left: 88, height: 110, delay: -3.8, duration: 5.2, opacity: 0.30 },
  { left: 92, height: 142, delay: -1.9, duration: 5.9, opacity: 0.36 },
  { left: 96, height: 120, delay: -4.6, duration: 5.5, opacity: 0.30 },
];

const Header: React.FC<HeaderProps> = ({ onHomeClick, onToolsClick }) => {
  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="glossary-topbar sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button
            onClick={handleHomeClick}
            className="flex items-center gap-3 cursor-pointer group"
            aria-label="Return to home"
          >
            <div className="brand-wheat-shell">
              <Wheat size={27} className="brand-wheat-icon" />
            </div>
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#fff7e8] leading-none tracking-tight">
                Crust &amp; Crumb
              </h1>
              <p className="text-[10px] sm:text-xs text-[#d9b66f] font-sans tracking-[0.14em] mt-1 uppercase">
                The Intelligent Glossary
              </p>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-5">
            <button
              onClick={handleHomeClick}
              className="topbar-link"
            >
              Dictionary
            </button>
            <button
              onClick={onToolsClick}
              className="topbar-link flex items-center gap-1.5"
            >
              <Calculator size={17} />
              Baker&apos;s Tools
            </button>
            <a
              href="https://sourdough-simplified-gift.lovable.app/sourdough-for-the-rest"
              target="_blank"
              rel="noreferrer"
              className="topbar-link"
            >
              The Book
            </a>
            <div className="h-8 w-px bg-[#c99542]/30" />
            <div className="flex items-center gap-2 text-[#e8c982]">
              <ChefHat size={19} />
              <span className="font-serif italic text-sm">Perfection Not Required</span>
            </div>
          </div>

          <button
            onClick={onToolsClick}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-[#c9923f]/15 text-[#f2d18d] border border-[#c9923f]/30 rounded-lg font-medium text-sm"
          >
            <Calculator size={16} />
            Tools
          </button>
        </div>
      </header>

      <section className="glossary-hero" aria-labelledby="glossary-hero-title">
        <div className="grain-mote grain-mote-1" aria-hidden="true" />
        <div className="grain-mote grain-mote-2" aria-hidden="true" />
        <div className="grain-mote grain-mote-3" aria-hidden="true" />
        <div className="grain-mote grain-mote-4" aria-hidden="true" />

        <div className="wheat-field" aria-hidden="true">
          {WHEAT_STALKS.map((stalk, index) => (
            <span
              key={index}
              className="wheat-stalk"
              style={{
                left: `${stalk.left}%`,
                height: `${stalk.height}px`,
                animationDelay: `${stalk.delay}s`,
                animationDuration: `${stalk.duration}s`,
                opacity: stalk.opacity,
              }}
            >
              <span className="wheat-head" />
              <span className="wheat-leaf wheat-leaf-left" />
              <span className="wheat-leaf wheat-leaf-right" />
            </span>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <div className="hero-kicker">
              <span className="hero-kicker-line" />
              Bread knowledge, built for bakers
            </div>

            <h2
              id="glossary-hero-title"
              className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#fff8ea] leading-[1.03] tracking-[-0.025em]"
            >
              Learn the language.
              <span className="block text-[#dfb861] italic font-medium">Read the dough.</span>
            </h2>

            <p className="mt-5 text-base sm:text-lg text-[#eadcc5] leading-relaxed max-w-2xl">
              {GLOSSARY_DATA.length} bread-baking terms with plain-English definitions, Henry&apos;s notes,
              troubleshooting, recipes, tools, and the connections that make the whole craft easier to understand.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <span className="hero-feature-chip">
                <Search size={15} />
                Searchable A–Z
              </span>
              <span className="hero-feature-chip">
                <Route size={15} />
                Mastery Paths
              </span>
              <span className="hero-feature-chip">
                <MessageSquare size={15} />
                Ask Krusty
              </span>
              <span className="hero-feature-chip hero-feature-chip-accent">
                <Wheat size={15} />
                {GLOSSARY_DATA.length} terms
              </span>
            </div>
          </div>
        </div>

        <div className="hero-bottom-fade" aria-hidden="true" />
      </section>
    </>
  );
};

export default Header;
