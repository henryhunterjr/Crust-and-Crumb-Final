'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, ChefHat, ArrowUp, Instagram, Youtube, Facebook, Linkedin, Mail, Globe, X, Calculator, ExternalLink, Thermometer, RefreshCw, Scale } from 'lucide-react';
import Header from '@/src/components/Header';
import GlossaryList from '@/src/components/GlossaryList';
import ChatBot from '@/src/components/ChatBot';
import { ChatMessage } from '@/src/types';

// TikTok icon component (not in Lucide)
const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const SOCIAL_LINKS = [
  { name: 'Instagram', url: 'https://www.instagram.com/bakinggreatbread', icon: Instagram },
  { name: 'YouTube', url: 'https://www.youtube.com/@Henryhunterjr', icon: Youtube },
  { name: 'Facebook', url: 'https://www.facebook.com/groups/1082865755403754', icon: Facebook },
  { name: 'TikTok', url: 'https://www.tiktok.com/@henryhunter12', icon: TikTokIcon },
  { name: 'LinkedIn', url: 'http://linkedin.com/in/henry-hunter-09948b303', icon: Linkedin },
  { name: 'Email', url: 'mailto:bakinggreatbreadathome@gmail.com', icon: Mail },
  { name: 'Blog', url: 'https://bakinggreatbread.blog', icon: Globe },
];

export default function GlossaryApp() {
  // Chat state lifted to App
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hey there, baker! I'm Krusty, your friendly bread concierge. I'm here to help you on your sourdough journey using wisdom from Henry's book. Ask me about techniques, schedules, or troubleshooting - you've got this!",
      timestamp: Date.now()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [resetFilters, setResetFilters] = useState(0);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  // Baker's Tools Calculator State
  const [flourWeight, setFlourWeight] = useState('1000');
  const [hydrationPercent, setHydrationPercent] = useState('75');

  // Calculate derived values
  const flour = parseFloat(flourWeight) || 0;
  const hydration = parseFloat(hydrationPercent) || 0;
  const waterNeeded = Math.round(flour * (hydration / 100));
  const saltNeeded = Math.round(flour * 0.02);
  const starterNeeded = Math.round(flour * 0.20);
  const totalDoughWeight = flour + waterNeeded + saltNeeded + starterNeeded;

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeClick = useCallback(() => {
    setResetFilters(prev => prev + 1);
  }, []);

  const handleAskKrusty = (term: string) => {
    setIsChatOpen(true);
    setChatInput(`Tell me more about ${term} as explained in "Sourdough for the Rest of Us".`);
  };

  const handleTermClick = (termId: string) => {
    const element = document.getElementById(termId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/50">
      <Header onHomeClick={handleHomeClick} onToolsClick={() => setIsToolsOpen(true)} />
      <main className="flex-grow">
        <GlossaryList
          onAskKrusty={handleAskKrusty}
          onTermClick={handleTermClick}
          onToolsClick={() => setIsToolsOpen(true)}
          resetTrigger={resetFilters}
        />
      </main>

      <footer className="bg-white border-t border-amber-200 py-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4 text-amber-600">
            <ChefHat size={24} />
            <span className="font-serif font-bold text-lg">Crust and Crumb</span>
          </div>
          <p className="text-slate-500 mb-6 max-w-md mx-auto text-sm">
            The official companion app for &quot;Sourdough for the Rest of Us&quot;.
          </p>

          {/* Social Media Icons */}
          <div className="flex justify-center gap-3 mt-6">
            {SOCIAL_LINKS.map((link) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 hover:bg-amber-600 hover:text-white transition-all duration-200 hover:scale-110"
                  aria-label={link.name}
                  title={link.name}
                >
                  <IconComponent size={20} />
                </a>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 mt-8">© 2025 Baking Great Bread at Home by Henry Hunter. All rights reserved.</p>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 bg-amber-500 text-white p-3 rounded-full shadow-lg hover:bg-amber-600 transition-all transform hover:scale-105 print:hidden"
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Chat Trigger Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-amber-600 text-white p-4 rounded-full shadow-lg hover:bg-amber-700 transition-all transform hover:scale-105 print:hidden"
          aria-label="Open Baking Assistant"
        >
          <MessageSquare size={24} />
        </button>
      )}

      <ChatBot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={chatMessages}
        setMessages={setChatMessages}
        input={chatInput}
        setInput={setChatInput}
      />

      {/* Baker's Tools Modal */}
      {isToolsOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto print:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsToolsOpen(false)}
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-amber-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <Calculator size={24} className="text-amber-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Baker's Tools</h2>
                    <p className="text-sm text-slate-500">Calculators & converters for bread baking</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsToolsOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-slate-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Baker's Percentage Calculator */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Scale size={20} className="text-amber-700" />
                    <h3 className="font-bold text-lg text-slate-800">Baker's Percentage Calculator</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Flour (g)</label>
                      <input
                        type="number"
                        value={flourWeight}
                        onChange={(e) => setFlourWeight(e.target.value)}
                        placeholder="1000"
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 text-lg font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Hydration (%)</label>
                      <input
                        type="number"
                        value={hydrationPercent}
                        onChange={(e) => setHydrationPercent(e.target.value)}
                        placeholder="75"
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 text-lg font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Results */}
                  <div className="bg-white border border-amber-300 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3">Calculated Amounts</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex justify-between items-center bg-amber-50 rounded-lg px-4 py-3 border border-amber-100">
                        <span className="text-slate-600">Water</span>
                        <span className="font-bold text-amber-700 text-xl">{waterNeeded}g</span>
                      </div>
                      <div className="flex justify-between items-center bg-amber-50 rounded-lg px-4 py-3 border border-amber-100">
                        <span className="text-slate-600">Salt (2%)</span>
                        <span className="font-bold text-amber-700 text-xl">{saltNeeded}g</span>
                      </div>
                      <div className="flex justify-between items-center bg-amber-50 rounded-lg px-4 py-3 border border-amber-100">
                        <span className="text-slate-600">Starter (20%)</span>
                        <span className="font-bold text-amber-700 text-xl">{starterNeeded}g</span>
                      </div>
                      <div className="flex justify-between items-center bg-amber-600 text-white rounded-lg px-4 py-3">
                        <span className="font-medium">Total Dough</span>
                        <span className="font-bold text-xl">{totalDoughWeight}g</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-3 italic">
                    Standard sourdough uses 2% salt and 20% starter (based on flour weight)
                  </p>
                </div>

                {/* External Tools */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <ExternalLink size={18} />
                    More Baking Tools
                  </h3>

                  <a
                    href="https://sourdough-yeast-converter.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-purple-50 border border-purple-200 rounded-xl p-4 hover:bg-purple-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <RefreshCw size={20} className="text-purple-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-purple-800">Sourdough ↔ Yeast Converter</h4>
                          <ExternalLink size={14} className="text-purple-400" />
                        </div>
                        <p className="text-sm text-purple-600">Convert between sourdough starter and commercial yeast</p>
                      </div>
                    </div>
                  </a>

                  <a
                    href="https://bakinggreatbread.com/salt-converter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-blue-50 border border-blue-200 rounded-xl p-4 hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Scale size={20} className="text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-blue-800">Salt Converter</h4>
                          <ExternalLink size={14} className="text-blue-400" />
                        </div>
                        <p className="text-sm text-blue-600">Convert between different salt types for baking</p>
                      </div>
                    </div>
                  </a>
                </div>

                {/* Quick Reference */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h3 className="font-bold text-slate-700 mb-3">Hydration Quick Reference</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between bg-white rounded px-3 py-2">
                      <span className="text-slate-600">Low hydration (bagels)</span>
                      <span className="font-medium text-slate-800">55-60%</span>
                    </div>
                    <div className="flex justify-between bg-white rounded px-3 py-2">
                      <span className="text-slate-600">Standard bread</span>
                      <span className="font-medium text-slate-800">65-70%</span>
                    </div>
                    <div className="flex justify-between bg-white rounded px-3 py-2">
                      <span className="text-slate-600">Artisan sourdough</span>
                      <span className="font-medium text-slate-800">70-80%</span>
                    </div>
                    <div className="flex justify-between bg-white rounded px-3 py-2">
                      <span className="text-slate-600">High hydration (ciabatta)</span>
                      <span className="font-medium text-slate-800">80-90%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
