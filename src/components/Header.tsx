'use client';

import React from 'react';
import { Calculator, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onHomeClick?: () => void;
  onToolsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, onToolsClick }) => {
  const handleHomeClick = () => {
    // Reset filters and scroll to top
    if (onHomeClick) {
      onHomeClick();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-30 px-3 sm:px-6 lg:px-10 pt-3 sm:pt-4 print:static">
      <div className="glass-strong sheen max-w-[1440px] mx-auto rounded-full pl-2 pr-2 sm:pl-3 py-2 flex items-center justify-between gap-3" style={{ background: 'rgba(30, 23, 15, 0.62)' }}>
        <button
          onClick={handleHomeClick}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer min-w-0 rounded-full pr-2"
          aria-label="Return to home"
        >
          <img
            src="/brand/academy.png"
            alt="Crust & Crumb Academy"
            width="1280"
            height="720"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover object-center shrink-0 ring-1 ring-white/25"
            style={{ objectPosition: '50% 47%', transform: 'scale(1)' }}
          />
          <span className="text-left min-w-0">
            <span className="block font-display text-[17px] sm:text-[20px] font-semibold text-[#fff8ec] leading-tight tracking-[-0.01em] truncate">Crust &amp; Crumb</span>
            <span className="block text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[rgba(246,236,220,0.7)] leading-tight mt-0.5 truncate">The Bread Baker&apos;s Glossary</span>
          </span>
        </button>
        <nav className="hidden md:flex items-center gap-1 text-[15px] font-medium" aria-label="Primary navigation">
          <a href="#dictionary" className="px-4 py-2.5 rounded-full text-[#fff8ec] bg-white/10">Dictionary</a>
          <a href="#paths" className="px-4 py-2.5 rounded-full text-[rgba(246,236,220,0.82)] hover:text-[#fff8ec] hover:bg-white/5 transition-colors">Paths</a>
          <button
            onClick={onToolsClick}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[rgba(246,236,220,0.82)] hover:text-[#fff8ec] hover:bg-white/5 transition-colors"
          >
            <Calculator size={16} />
            Baker&apos;s Tools
          </button>
          <a href="https://pantry.bakinggreatbread.com/?utm_source=glossary&utm_medium=referral&utm_campaign=glossary-nav" target="_blank" rel="noreferrer" className="flex items-center gap-1 px-4 py-2.5 rounded-full text-[rgba(246,236,220,0.82)] hover:text-[#fff8ec] hover:bg-white/5 transition-colors">Recipe Pantry <ArrowUpRight size={14} /></a>
          <a href="https://sourdough-simplified-gift.lovable.app/sourdough-for-the-rest" target="_blank" rel="noreferrer" className="flex items-center gap-1 px-4 py-2.5 rounded-full text-[rgba(246,236,220,0.82)] hover:text-[#fff8ec] hover:bg-white/5 transition-colors">The Book <ArrowUpRight size={14} /></a>
        </nav>
        <span className="hidden lg:block font-display italic text-[15px] text-[#f0c878] pr-4">Perfection not required</span>
        {/* Mobile Tools Button */}
        <button
          onClick={onToolsClick}
          className="md:hidden btn-gold flex items-center gap-1.5 h-11 px-4 rounded-full font-semibold text-sm shrink-0"
        >
          <Calculator size={16} />
          Tools
        </button>
      </div>
    </header>
  );
};

export default Header;
