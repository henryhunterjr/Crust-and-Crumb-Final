'use client';

import React from 'react';
import { ChefHat, Wheat, Calculator } from 'lucide-react';

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
    <header className="bg-white border-b border-amber-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <button
          onClick={handleHomeClick}
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          aria-label="Return to home"
        >
          <div className="bg-amber-500 p-2 rounded-lg text-white">
            <Wheat size={28} />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-serif font-bold text-amber-900 leading-none">Crust and Crumb</h1>
            <p className="text-xs text-amber-600 font-sans tracking-wider mt-1">Based on "Sourdough for the Rest of Us"</p>
          </div>
        </button>
        <div className="hidden md:flex items-center gap-6">
           <a href="#" className="text-slate-600 hover:text-amber-700 font-medium transition-colors">Dictionary</a>
           <button
             onClick={onToolsClick}
             className="flex items-center gap-1.5 text-slate-600 hover:text-amber-700 font-medium transition-colors"
           >
             <Calculator size={18} />
             Baker's Tools
           </button>
           <a href="https://sourdough-simplified-gift.lovable.app/sourdough-for-the-rest" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-amber-700 font-medium transition-colors">The Book</a>
           <div className="h-8 w-px bg-amber-200"></div>
           <div className="flex items-center gap-2 text-amber-700">
             <ChefHat size={20} />
             <span className="font-serif italic">Perfection Not Required</span>
           </div>
        </div>
        {/* Mobile Tools Button */}
        <button
          onClick={onToolsClick}
          className="md:hidden flex items-center gap-1 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg font-medium text-sm"
        >
          <Calculator size={16} />
          Tools
        </button>
      </div>
    </header>
  );
};

export default Header;
