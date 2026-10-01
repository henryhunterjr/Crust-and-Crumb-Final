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
    <header className="bg-[#17120f]/95 backdrop-blur border-b border-[#5b4637] sticky top-0 z-30">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 min-h-[82px] sm:min-h-[88px] py-3 flex items-center justify-between gap-4">
        <button
          onClick={handleHomeClick}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group min-w-0"
          aria-label="Return to home"
        >
          <img src="/brand/academy.png" alt="Crust & Crumb Academy" width="1280" height="720" className="w-[88px] sm:w-[118px] h-12 sm:h-14 object-contain shrink-0 rounded-md" />
          <div className="text-left">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-[#f4c95d] leading-tight">Crust &amp; Crumb Academy</p>
            <h1 className="text-[15px] sm:text-[20px] font-serif font-bold text-[#fbf4e6] leading-tight mt-1">The Bread Baker&apos;s Glossary</h1>
            <p className="hidden sm:block text-[11px] text-[#c9b8a7] mt-1">A working reference by Henry Hunter</p>
          </div>
        </button>
        <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
           <a href="#dictionary" className="text-[#fbf4e6] hover:text-[#f4c95d] font-semibold transition-colors">Dictionary</a>
           <button
             onClick={onToolsClick}
             className="flex items-center gap-1.5 text-[#ddcdbd] hover:text-[#f4c95d] font-semibold transition-colors"
           >
             <Calculator size={18} />
             Baker's Tools
           </button>
           <a href="https://sourdough-simplified-gift.lovable.app/sourdough-for-the-rest" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#ddcdbd] hover:text-[#f4c95d] font-semibold transition-colors">The Book <ArrowUpRight size={15} /></a>
           <div className="h-7 w-px bg-[#5b4637]"></div>
           <div className="flex items-center gap-2 text-[#f4c95d]">
             <span className="font-serif italic text-sm">Perfection not required</span>
           </div>
        </nav>
        {/* Mobile Tools Button */}
        <button
          onClick={onToolsClick}
          className="md:hidden flex items-center gap-1 px-3 py-2 bg-[#f4c95d] text-[#17120f] rounded-lg font-semibold text-sm border border-[#f8d878]"
        >
          <Calculator size={16} />
          Tools
        </button>
      </div>
    </header>
  );
};

export default Header;
