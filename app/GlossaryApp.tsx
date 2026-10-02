'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageSquare, ChefHat, ArrowUp, Instagram, Youtube, Facebook, Linkedin, Mail, Globe, X, Calculator, ExternalLink, Thermometer, Scale } from 'lucide-react';
import { useDialogFocus } from '@/src/components/useDialogFocus';
import Header from '@/src/components/Header';
import GlossaryList from '@/src/components/GlossaryList';
import ChatBot from '@/src/components/ChatBot';
import BreadAnalyzer from '@/src/components/BreadAnalyzer';
import { ChatMessage } from '@/src/types';
import { FEATURED_TOOL, TOOL_GROUPS } from '@/src/constants';

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
      text: "I'm Krusty, your bread glossary helper. Ask about a term or technique. If AI conversation is unavailable, I'll show matching glossary definitions and links.",
      timestamp: Date.now()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [resetFilters, setResetFilters] = useState(0);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  useDialogFocus(isToolsOpen, toolsRef);
  const [activeToolTab, setActiveToolTab] = useState<'calculator' | 'analyzer'>('calculator');

  // Baker's Tools Calculator State
  const [flourWeight, setFlourWeight] = useState('1000');
  const [hydrationPercent, setHydrationPercent] = useState('75');
  const [starterHydrationPercent, setStarterHydrationPercent] = useState('100');

  // Calculate derived values
  const flour = parseFloat(flourWeight) || 0;
  const hydration = parseFloat(hydrationPercent) || 0;
  const waterNeeded = Math.round(flour * (hydration / 100));
  const saltNeeded = Math.round(flour * 0.02);
  const starterNeeded = Math.round(flour * 0.20);
  const starterHydration = parseFloat(starterHydrationPercent) || 0;
  const starterFlour = starterNeeded / (1 + starterHydration / 100);
  const starterWater = starterNeeded - starterFlour;
  const totalHydration = flour > 0 ? ((waterNeeded + starterWater) / (flour + starterFlour)) * 100 : 0;
  const totalDoughWeight = flour + waterNeeded + saltNeeded + starterNeeded;

  // Auto-open a specific Baker's Tool when linked from a glossary definition.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedTool = params.get('tool');
    if (requestedTool === 'analyzer' || requestedTool === 'calculator') {
      setIsToolsOpen(true);
      setActiveToolTab(requestedTool);
    }
  }, []);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isToolsOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsToolsOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isToolsOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeClick = useCallback(() => {
    setResetFilters(prev => prev + 1);
  }, []);

  const handleAskKrusty = (term: string) => {
    setIsChatOpen(true);
    setChatInput(`Tell me more about ${term} using the glossary.`);
  };

  const handleTermClick = (termId: string) => {
    const element = document.getElementById(termId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onHomeClick={handleHomeClick} onToolsClick={() => setIsToolsOpen(true)} />
      <main className="flex-grow">
        <GlossaryList
          onAskKrusty={handleAskKrusty}
          onTermClick={handleTermClick}
          onToolsClick={() => setIsToolsOpen(true)}
          resetTrigger={resetFilters}
        />
      </main>

      <footer className="px-4 sm:px-6 lg:px-10 pb-8 pt-4 print:hidden">
        <div className="glass-strong sheen max-w-[1440px] mx-auto rounded-[32px] px-6 py-10 text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <img src="/brand/academy.png" alt="Crust & Crumb Academy" width="1280" height="720" className="w-14 h-14 rounded-full object-cover ring-1 ring-white/25" />
            <span className="font-display font-semibold text-2xl text-[#fff8ec]">Crust &amp; Crumb</span>
          </div>
          <p className="text-[rgba(246,236,220,0.72)] mb-6 max-w-md mx-auto text-[15px]">
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
                  className="btn-glass w-11 h-11 flex items-center justify-center rounded-full text-[#f0c878] hover:text-[#fff8ec]"
                  aria-label={link.name}
                  title={link.name}
                >
                  <IconComponent size={20} />
                </a>
              );
            })}
          </div>

          <nav aria-label="About this glossary" className="flex flex-wrap justify-center gap-4 mt-6">{['editorial-standards', 'methodology', 'sources', 'updates'].map(page => <a key={page} className="text-[#f0c878] underline min-h-11 inline-flex items-center" href={`/${page}`}>{page.replaceAll('-', ' ')}</a>)}</nav>
          <p className="text-xs text-[rgba(246,236,220,0.5)] mt-8">© {new Date().getFullYear()} Baking Great Bread at Home by Henry Hunter. All rights reserved.</p>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="glass-strong fixed bottom-24 right-5 z-40 text-[#f6ecdc] w-12 h-12 flex items-center justify-center rounded-full print:hidden"
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
          className="btn-gold fixed bottom-5 right-5 z-40 h-12 px-4 lg:px-5 rounded-full flex items-center gap-2 font-bold print:hidden"
          aria-label="Open Baking Assistant"
        >
          <MessageSquare size={21} />
          <span className="hidden lg:inline text-sm font-semibold">Ask Krusty</span>
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
            className="fixed inset-0 bg-black/55 backdrop-blur-sm transition-opacity"
            onClick={() => setIsToolsOpen(false)}
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div ref={toolsRef} role="dialog" aria-modal="true" aria-labelledby="tools-title" className="relative bg-[#fbf7f0]/95 backdrop-blur-2xl border border-white/60 rounded-[28px] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.85)] max-w-2xl w-full max-h-[90vh] overflow-y-auto text-[#2a1f14]">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-[#fbf7f0]/90 backdrop-blur-xl border-b border-[#e8dcc7] px-6 py-4 flex items-center justify-between rounded-t-[28px]">
                <div className="flex items-center gap-3">
                  <div className="bg-[#f4ead1] p-2 rounded-lg">
                    <Calculator size={24} className="text-[#8b4e0a]" />
                  </div>
                  <div>
                    <h2 id="tools-title" className="font-display text-2xl font-semibold text-[#2a1f14]">Baker's Tools</h2>
                    <p className="text-sm text-[#7a6650]">Calculators, converters and bread analysis</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsToolsOpen(false)}
                  className="w-11 h-11 flex items-center justify-center hover:bg-black/5 rounded-full transition-colors"
                  aria-label="Close tools"
                >
                  <X size={22} className="text-[#5b4a38]" />
                </button>
              </div>

              {/* Starter & Levain Studio is the #1 Baker's Tool */}
              <div className="px-6 pt-5 pb-4 bg-white/40 border-b border-[#eee3cf]">
                <a
                  href={FEATURED_TOOL.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-2xl border border-amber-300 bg-white shadow-sm hover:shadow-md transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-700"
                  aria-label={`${FEATURED_TOOL.cta}: ${FEATURED_TOOL.name}`}
                >
                  <div className="relative bg-black">
                    <img
                      src={FEATURED_TOOL.image}
                      alt={FEATURED_TOOL.imageAlt}
                      width="1600"
                      height="900"
                      loading="lazy"
                      decoding="async"
                      className="block w-full h-auto"
                    />
                    <span className="absolute left-3 top-3 rounded-full border border-amber-200/60 bg-black/75 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-200 backdrop-blur-sm">
                      {FEATURED_TOOL.eyebrow}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="font-display text-xl sm:text-2xl font-semibold text-slate-900">{FEATURED_TOOL.name}</h4>
                        <p className="mt-1 font-semibold text-amber-800">{FEATURED_TOOL.headline}</p>
                      </div>
                      <span className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-sm font-bold text-white group-hover:bg-amber-700 transition-colors">
                        {FEATURED_TOOL.cta}
                        <ExternalLink size={14} aria-hidden="true" />
                      </span>
                    </div>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">{FEATURED_TOOL.blurb}</p>
                  </div>
                </a>

              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#eee3cf] px-6 bg-white/60">
                <button
                  onClick={() => setActiveToolTab('calculator')}
                  className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeToolTab === 'calculator' ? 'border-amber-500 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  Calculator
                </button>
                <button
                  onClick={() => setActiveToolTab('analyzer')}
                  className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${activeToolTab === 'analyzer' ? 'border-amber-500 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  Bread Analyzer
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {activeToolTab === 'analyzer' && <BreadAnalyzer />}
                {activeToolTab === 'calculator' && <>
                {/* Baker's Percentage Calculator */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Scale size={20} className="text-amber-700" />
                    <h3 className="font-bold text-lg text-slate-800">Baker's Percentage Calculator</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label htmlFor="calc-flour" className="block text-sm font-medium text-slate-600 mb-1">Flour (g)</label>
                      <input
                        id="calc-flour"
                        inputMode="decimal"
                        type="number"
                        min="0" value={flourWeight}
                        onChange={(e) => setFlourWeight(e.target.value)}
                        placeholder="1000"
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 text-lg font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="calc-hydration" className="block text-sm font-medium text-slate-600 mb-1">Water (% of flour)</label>
                      <input
                        id="calc-hydration"
                        inputMode="decimal"
                        type="number"
                        min="0" value={hydrationPercent}
                        onChange={(e) => setHydrationPercent(e.target.value)}
                        placeholder="75"
                        className="w-full border border-slate-300 rounded-lg px-4 py-3 text-lg font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="calc-starter-hydration" className="block text-sm font-medium text-slate-600 mb-1">Starter hydration (%)</label>
                      <input
                        id="calc-starter-hydration"
                        inputMode="decimal"
                        type="number"
                        value={starterHydrationPercent}
                        onChange={(e) => setStarterHydrationPercent(e.target.value)}
                        placeholder="100"
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
                    <div className="mt-3 flex justify-between items-center rounded-lg px-4 py-3 border border-amber-200 bg-amber-50" aria-live="polite">
                      <span className="text-slate-700 font-medium">Total hydration, counting the starter</span>
                      <span className="font-bold text-amber-800 text-xl">{totalHydration.toFixed(1)}%</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-3 italic">
                    Water, 2% salt, and 20% starter are all figured on the flour you add. Your starter also carries flour and water, so the total hydration of the finished dough runs a little higher than the water percentage you enter.
                  </p>
                </div>

                {/* Henry's tools and resources */}
                <div className="space-y-5">
                  <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <ExternalLink size={18} />
                    Henry&apos;s tools and resources
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-500">
                    Some gear links are affiliate links. If you buy through them, I may earn a commission at no extra cost to you.
                  </p>
                  <a
                    href="https://wiremonkey.com/henryhunter"
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="block overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                    aria-label="Shop Wire Monkey scoring lames through Henry Hunter's affiliate link"
                  >
                    <img
                      src="/partners/wiremonkey-promo-banner.png"
                      alt="Wire Monkey handcrafted wood scoring lames"
                      width="1200"
                      height="300"
                      loading="lazy"
                      decoding="async"
                      className="block w-full h-auto"
                    />
                  </a>
                  {TOOL_GROUPS.map(group => (
                    <section key={group.id} aria-labelledby={`tools-${group.id}`} className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <h4 id={`tools-${group.id}`} className="text-xs font-bold uppercase tracking-[0.12em] text-amber-800">{group.title}</h4>
                        <span className="text-xs text-slate-500">{group.blurb}</span>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {group.links.map(link => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel={link.url.includes('nutrimill.com/Academy26') ? 'sponsored noopener noreferrer' : 'noopener noreferrer'}
                            className="block bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 hover:bg-amber-100 transition-colors min-h-[44px]"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-amber-900 text-sm">{link.name}</span>
                              <ExternalLink size={13} className="text-amber-500 shrink-0" aria-hidden="true" />
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 leading-snug">{link.blurb}</p>
                          </a>
                        ))}
                      </div>
                    </section>
                  ))}
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
                </>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
