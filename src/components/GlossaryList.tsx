'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { WheatFilm, StorefrontFeature, BrandShelf } from './BrandFeatures';
import PronunciationButton from './PronunciationButton';
import {
  Search, Filter, Download, ExternalLink, BookOpen, ChevronDown, ChevronUp,
  CheckCircle, MessageSquare, AlertTriangle, Lightbulb, History, Calculator,
  Thermometer, Clock, ShoppingBag, Utensils, Youtube, Book, Users, FileText, Calendar, Sparkles, Info, X, ArrowRight
} from 'lucide-react';
import { GLOSSARY_DATA, LEARNING_PATHS, EXTERNAL_URLS, BAKING_TOOLS_PATH_ID } from '../constants';

// Affiliate product mappings - keywords to products
const AFFILIATE_MAPPINGS: { keywords: string[]; product: { name: string; url: string } }[] = [
  {
    keywords: ['bench knife', 'bench scraper', 'bench-scraper', 'dough scraper'],
    product: { name: 'Brød & Taylor Bench Knife', url: 'https://collabs.shop/8vcnxu' }
  },
  {
    keywords: ['banneton', 'proofing basket', 'proofing container', 'brotform'],
    product: { name: 'Brød & Taylor Proofing Container', url: 'https://collabs.shop/6iguo3' }
  },
  {
    keywords: ['lame', 'scoring', 'bread lame', 'score', 'slash'],
    product: { name: 'Wire Monkey Lame', url: 'https://wiremonkey.com/henryhunter' }
  },
  {
    keywords: ['dutch oven', 'baking vessel', 'combo cooker', 'lodge'],
    product: { name: 'Brød & Taylor Baking Shell (Boule)', url: 'https://collabs.shop/jveyfn' }
  },
  {
    keywords: ['batard', 'oval loaf', 'oblong'],
    product: { name: 'Brød & Taylor Baking Shell (Batard) & Steel', url: 'https://collabs.shop/noauwh' }
  },
  {
    keywords: ['baking steel', 'pizza steel', 'bread steel', 'steel plate'],
    product: { name: 'Brød & Taylor Bread Steel', url: 'https://collabs.shop/soze7p' }
  },
  {
    keywords: ['scale', 'kitchen scale', 'digital scale', 'weighing'],
    product: { name: 'Brød & Taylor Scale', url: 'https://collabs.shop/hvryn6' }
  },
  {
    keywords: ['proofing', 'proof', 'proofer', 'folding proofer', 'proofing box'],
    product: { name: 'Brød & Taylor Folding Proofer & Slow Cooker', url: 'https://collabs.shop/vutgu8' }
  },
  {
    keywords: ['grain mill', 'home milling', 'home-milling', 'fresh-milled', 'freshly milled', 'wheat berr', 'impact mill', 'stone mill'],
    product: { name: 'NutriMill Grain Mills', url: 'https://nutrimill.com/Academy26' }
  },
  {
    keywords: ['sourdough starter', 'levain', 'starter', 'mother dough', 'wild yeast'],
    product: { name: 'Sourhouse Goldie (code HBK26)', url: 'https://sourhouse.co/products/goldie-by-sourhouse-cooling-puck-white?ref=BAKINGGREATBREAD' }
  }
];

// Get matching affiliate products for a term
const getAffiliateProducts = (termId: string, termName: string, definition: string): { name: string; url: string }[] => {
  const searchText = `${termId} ${termName} ${definition}`.toLowerCase();
  const matches: { name: string; url: string }[] = [];
  const seenUrls = new Set<string>();

  for (const mapping of AFFILIATE_MAPPINGS) {
    if (mapping.keywords.some(kw => searchText.includes(kw.toLowerCase()))) {
      if (!seenUrls.has(mapping.product.url)) {
        matches.push(mapping.product);
        seenUrls.add(mapping.product.url);
      }
    }
  }

  return matches;
};

// Helper to generate YouTube search URL
const getYouTubeSearchUrl = (term: string, youtubeQuery?: string) => {
  const searchTerm = youtubeQuery || term;
  return `https://www.youtube.com/results?search_query=bread+baking+${encodeURIComponent(searchTerm)}`;
};

// Helper to generate blog search URL
const getBlogSearchUrl = (term: string) => {
  return `${EXTERNAL_URLS.blog}/?s=${encodeURIComponent(term)}`;
};

// Generate alphabet array
const ALPHABET = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

// Build a set of valid term IDs for quick lookup
const VALID_TERM_IDS = new Set(GLOSSARY_DATA.map(item => item.id));
const TERM_LOOKUP = new Map(GLOSSARY_DATA.map(item => [item.id, item.term]));

// Tooltip component
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <div className="group relative inline-block">
    {children}
    <div className="absolute bottom-full right-0 mb-2 w-40 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-normal z-50 pointer-events-none">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

interface GlossaryListProps {
  onAskKrusty: (term: string) => void;
  onTermClick: (termId: string) => void;
  onToolsClick?: () => void;
  resetTrigger?: number;
}

const GlossaryList: React.FC<GlossaryListProps> = ({ onAskKrusty, onTermClick, onToolsClick, resetTrigger }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activePathId, setActivePathId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [quickMode, setQuickMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'expert' | 'deep' | 'sources' | 'recipes'>('overview');
  const [selectedLetter, setSelectedLetter] = useState<string>('All');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Persisted state
  const [learnedTerms, setLearnedTerms] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleSlashShortcut = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.tagName === 'SELECT') return;
      event.preventDefault();
      searchInputRef.current?.focus();
    };
    window.addEventListener('keydown', handleSlashShortcut);
    return () => window.removeEventListener('keydown', handleSlashShortcut);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('learnedTerms');
    if (saved) {
      setLearnedTerms(new Set(JSON.parse(saved)));
    }
  }, []);

  // Reset all filters when resetTrigger changes
  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      setSearchTerm('');
      setSelectedCategory('All');
      setSelectedDifficulty('All');
      setActivePathId(null);
      setSelectedLetter('All');
      setExpandedId(null);
    }
  }, [resetTrigger]);

  const toggleLearned = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const newSet = new Set(learnedTerms);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setLearnedTerms(newSet);
    localStorage.setItem('learnedTerms', JSON.stringify(Array.from(newSet)));
  };

  // Handle expand toggle with proper mobile support
  const handleExpandToggle = useCallback((itemId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (expandedId === itemId) {
      setExpandedId(null);
    } else {
      setExpandedId(itemId);
      setActiveTab('overview');
    }
  }, [expandedId]);

  // Handle related term click with validation
  const handleRelatedTermClick = useCallback((termId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Only navigate if the term exists
    if (VALID_TERM_IDS.has(termId)) {
      // Clear filters to ensure term is visible
      setSelectedCategory('All');
      setSelectedDifficulty('All');
      setSelectedLetter('All');
      setActivePathId(null);
      setSearchTerm('');

      // Scroll to the term
      setTimeout(() => {
        const element = document.getElementById(termId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Expand the term
          setExpandedId(termId);
          setActiveTab('overview');
          // Add a highlight effect
          element.classList.add('ring-4', 'ring-amber-400');
          setTimeout(() => {
            element.classList.remove('ring-4', 'ring-amber-400');
          }, 2000);
        }
      }, 100);
    }
  }, []);

  // Get unique categories and difficulties from the data
  const categories = useMemo(() => {
    const cats = new Set(GLOSSARY_DATA.map(item => item.category));
    return Array.from(cats).sort();
  }, []);

  const difficulties = useMemo(() => {
    const diffs = new Set(GLOSSARY_DATA.map(item => item.difficulty));
    // Sort in logical order
    const order = ['Beginner', 'Intermediate', 'Advanced'];
    return Array.from(diffs).sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }, []);

  // Calculate which letters have terms
  const lettersWithTerms = useMemo(() => {
    const letters = new Set<string>();
    GLOSSARY_DATA.forEach(item => {
      const firstLetter = item.term.charAt(0).toUpperCase();
      // Handle numbers (like "1:1:1")
      if (/[0-9]/.test(firstLetter)) {
        letters.add('#');
      } else {
        letters.add(firstLetter);
      }
    });
    return letters;
  }, []);

  const filteredData = useMemo(() => {
    let data = GLOSSARY_DATA;

    if (activePathId) {
      const path = LEARNING_PATHS.find(p => p.id === activePathId);
      if (path) {
        data = data.filter(item => path.termIds.includes(item.id));
      }
    }

    // Filter by letter
    if (selectedLetter !== 'All') {
      if (selectedLetter === '#') {
        data = data.filter(item => /^[0-9]/.test(item.term));
      } else {
        data = data.filter(item =>
          item.term.charAt(0).toUpperCase() === selectedLetter
        );
      }
    }

    return data.filter((item) => {
      const matchesSearch =
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.aliases || []).some(alias => alias.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchTerm, selectedCategory, selectedDifficulty, activePathId, selectedLetter]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setActivePathId(null);
    setSelectedLetter('All');
  }, []);

  const activeFilterCount = [
    selectedCategory !== 'All',
    selectedDifficulty !== 'All',
    activePathId !== null,
    selectedLetter !== 'All',
  ].filter(Boolean).length;

  const downloadData = (format: 'json' | 'csv' | 'md') => {
    let content = '';
    let mimeType = '';
    let extension = '';

    if (format === 'json') {
      content = JSON.stringify(filteredData, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    } else if (format === 'csv') {
      const headers = ['Term', 'Definition', 'Category', 'Difficulty', 'Tips'];
      const rows = filteredData.map(item =>
        `"${item.term}","${item.definition.replace(/"/g, '""')}","${item.category}","${item.difficulty}","${(item.henrysTips || []).join('; ')}"`
      );
      content = [headers.join(','), ...rows].join('\n');
      mimeType = 'text/csv';
      extension = 'csv';
    } else if (format === 'md') {
      const header = '| Term | Category | Difficulty | Definition | Tips |\n|---|---|---|---|---|\n';
      const rows = filteredData.map(item =>
        `| **${item.term}** | ${item.category} | ${item.difficulty} | ${item.definition} | ${(item.henrysTips || []).join('<br>')} |`
      );
      content = header + rows.join('\n');
      mimeType = 'text/markdown';
      extension = 'md';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crust-and-crumb-glossary.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDifficultyColor = (diff: string) => {
    const diffLower = diff.toLowerCase();
    if (diffLower === 'beginner') return 'bg-[#e8f1ed] text-[#24604f] border-[#c6ddd3]';
    if (diffLower === 'intermediate') return 'bg-[#f8efd4] text-[#8b5a12] border-[#ead6a9]';
    if (diffLower === 'advanced') return 'bg-[#f7e7df] text-[#984c31] border-[#e8c6b7]';
    return 'bg-[#f0f3f1] text-[#51645e] border-[#d8e1dd]';
  };

  const getCategoryColor = (cat: string) => {
    const catLower = cat.toLowerCase();
    if (catLower === 'ingredient') return 'bg-[#f8efd4] text-[#8b5a12]';
    if (catLower === 'tool') return 'bg-[#e8f1ed] text-[#24604f]';
    if (catLower === 'technique') return 'bg-[#e8eef4] text-[#315879]';
    if (catLower === 'process') return 'bg-[#f2e9f4] text-[#6c4776]';
    if (catLower === 'bread' || catLower === 'bread_type') return 'bg-[#f7e7df] text-[#984c31]';
    if (catLower === 'pizza') return 'bg-[#f5e5e5] text-[#934848]';
    if (catLower === 'schedule') return 'bg-[#e2f0ef] text-[#2b6c69]';
    if (catLower === 'troubleshooting') return 'bg-[#f8e1dc] text-[#9b3423]';
    if (catLower === 'grain & milling') return 'bg-[#e9efd6] text-[#4d5e1c]';
    if (catLower === 'scientific/technical' || catLower === 'scientific') return 'bg-[#e8eaf5] text-[#46517d]';
    if (catLower === 'business') return 'bg-[#e2efe6] text-[#2c6548]';
    if (catLower === 'practical') return 'bg-[#e3f0f2] text-[#2e6971]';
    return 'bg-[#f0f3f1] text-[#51645e]';
  };

  // Widget Components - Calculator State
  const [calcFlour, setCalcFlour] = useState<string>('1000');
  const [calcHydration, setCalcHydration] = useState<string>('75');

  // Calculate derived values
  const flourWeight = parseFloat(calcFlour) || 0;
  const hydrationPercent = parseFloat(calcHydration) || 0;
  const waterNeeded = Math.round(flourWeight * (hydrationPercent / 100));
  const saltNeeded = Math.round(flourWeight * 0.02); // 2% salt
  const starterNeeded = Math.round(flourWeight * 0.20); // 20% starter

  const CalculatorWidget = () => (
    <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex items-center gap-2 mb-3 text-amber-700 font-semibold">
        <Calculator size={18} />
        <span>Baker's Percentage Calculator</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <label className="block text-slate-500 mb-1 font-medium">Flour (g)</label>
          <input
            type="number"
            value={calcFlour}
            onChange={(e) => setCalcFlour(e.target.value)}
            placeholder="1000"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1 font-medium">Hydration (%)</label>
          <input
            type="number"
            value={calcHydration}
            onChange={(e) => setCalcHydration(e.target.value)}
            placeholder="75"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <div className="col-span-2 sm:col-span-2">
          <label className="block text-slate-500 mb-1 font-medium">Results</label>
          <div className="bg-white border border-amber-200 rounded-lg p-3 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-600">Water:</span>
              <span className="font-bold text-amber-700">{waterNeeded}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Salt (2%):</span>
              <span className="font-bold text-amber-700">{saltNeeded}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Starter (20%):</span>
              <span className="font-bold text-amber-700">{starterNeeded}g</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Temperature Converter State
  const [tempCelsius, setTempCelsius] = useState<string>('');
  const [tempFahrenheit, setTempFahrenheit] = useState<string>('');

  const handleCelsiusChange = (value: string) => {
    setTempCelsius(value);
    if (value === '') {
      setTempFahrenheit('');
    } else {
      const c = parseFloat(value);
      if (!isNaN(c)) {
        setTempFahrenheit(((c * 9/5) + 32).toFixed(1));
      }
    }
  };

  const handleFahrenheitChange = (value: string) => {
    setTempFahrenheit(value);
    if (value === '') {
      setTempCelsius('');
    } else {
      const f = parseFloat(value);
      if (!isNaN(f)) {
        setTempCelsius(((f - 32) * 5/9).toFixed(1));
      }
    }
  };

  const TempConverterWidget = () => (
    <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex items-center gap-2 mb-3 text-amber-700 font-semibold">
        <Thermometer size={18} />
        <span>Temperature Converter</span>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-slate-500 mb-1 text-xs font-medium">Celsius</label>
          <input
            type="number"
            value={tempCelsius}
            onChange={(e) => handleCelsiusChange(e.target.value)}
            placeholder="°C"
            className="w-24 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <span className="text-slate-400 mt-5">=</span>
        <div>
          <label className="block text-slate-500 mb-1 text-xs font-medium">Fahrenheit</label>
          <input
            type="number"
            value={tempFahrenheit}
            onChange={(e) => handleFahrenheitChange(e.target.value)}
            placeholder="°F"
            className="w-24 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 print:py-0">
      <section id="dictionary" className="glossary-hero relative overflow-hidden rounded-[28px] px-5 py-8 sm:px-9 sm:py-10 lg:px-12 lg:py-12 mb-8 print:hidden">
        <div className="relative max-w-3xl">
          <p className="text-[#8d4c13] text-xs font-bold tracking-[0.18em] uppercase mb-4">Crust &amp; Crumb Academy · the public field guide</p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[0.98] tracking-[-0.03em] max-w-2xl">Learn the language.<br /><em className="text-[#a85e18]">Read the dough.</em></h2>
          <p className="mt-5 text-[#455b50] text-base sm:text-lg leading-relaxed max-w-xl">A free, searchable reference to {GLOSSARY_DATA.length} bread-baking terms, working techniques, and source-linked paths — built for the bake in front of you.</p>
          <div className="relative mt-7 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b8880]" size={21} aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="search"
              aria-label="Search the bread glossary"
              placeholder="Search a term, symptom, or technique"
              className="w-full h-14 rounded-2xl bg-white text-[#173b3a] pl-12 pr-20 text-base shadow-lg outline-none ring-2 ring-transparent placeholder:text-[#8a9994] focus:ring-[#f4c95d]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm ? (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#5f746e] hover:bg-[#eef2ef]" aria-label="Clear search">
                <X size={18} />
              </button>
            ) : (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 text-xs text-[#8a9994]"><kbd className="rounded border border-[#d8e1dd] px-1.5 py-0.5">/</kbd> to search</span>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#60766a]">
            <span><strong className="text-[#173b3a]">{GLOSSARY_DATA.length}</strong> terms</span>
            <span><strong className="text-[#173b3a]">{LEARNING_PATHS.length}</strong> guided paths</span>
            <span>Free to use and share</span>
          </div>
        </div>
        <WheatFilm />
      </section>

      <section className="mb-7 print:hidden" aria-labelledby="path-heading">
        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#b85d13] mb-1">Choose a way in</p>
            <h2 id="path-heading" className="font-serif text-2xl sm:text-3xl text-[#173b3a]">Follow a baking path</h2>
          </div>
          <span className="hidden sm:block text-sm text-[#71827c]">Or search above if you know the term.</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          <button
            onClick={() => setActivePathId(null)}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${!activePathId ? 'bg-[#e2830b] text-white shadow-sm' : 'bg-white border border-[#d8e1dd] text-[#48635b] hover:border-[#e2830b] hover:text-[#a75208]'}`}
          >
            All terms
          </button>
          {LEARNING_PATHS.map(path => (
            <button
              key={path.id}
              onClick={() => setActivePathId(activePathId === path.id ? null : path.id)}
              title={path.description}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${activePathId === path.id ? 'bg-[#e2830b] text-white shadow-sm' : 'bg-white border border-[#d8e1dd] text-[#48635b] hover:border-[#e2830b] hover:text-[#a75208]'}`}
            >
              {path.title}
            </button>
          ))}
          <button
            onClick={onToolsClick}
            className="shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold bg-[#f4ead1] border border-[#ead6a9] text-[#8b4e0a] hover:bg-[#f8e2b2] transition-colors flex items-center gap-2"
          >
            <Calculator size={15} /> Baker's tools
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-[#d8e1dd] bg-white px-4 py-4 sm:px-5 mb-8 print:hidden" aria-label="Glossary filters">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-bold tracking-[0.12em] uppercase text-[#6d8079] mb-2">Filter the field guide</label>
            <div className="flex flex-wrap gap-2">
              <div className="relative min-w-[170px] flex-1">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7b8c86]" size={16} aria-hidden="true" />
                <select aria-label="Filter by category" className="w-full h-11 pl-9 pr-4 border border-[#d8e1dd] rounded-xl appearance-none bg-[#fbfcfa] text-[#35544c] focus:ring-2 focus:ring-[#f4c95d] focus:border-[#e2830b]" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="All">All categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <select aria-label="Filter by difficulty" className="min-w-[150px] h-11 px-3 border border-[#d8e1dd] rounded-xl appearance-none bg-[#fbfcfa] text-[#35544c] focus:ring-2 focus:ring-[#f4c95d] focus:border-[#e2830b]" value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
                <option value="All">All levels</option>
                {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <Tooltip text="Show shorter definitions for faster scanning">
                <button onClick={() => setQuickMode(!quickMode)} className={`h-11 px-4 rounded-xl border text-sm font-semibold transition-colors ${quickMode ? 'bg-[#e8f1ed] border-[#a9c7bb] text-[#235c4d]' : 'bg-white border-[#d8e1dd] text-[#51645e] hover:border-[#9db6ac]'}`} aria-pressed={quickMode}>
                  {quickMode ? 'Quick view on' : 'Quick view'}
                </button>
              </Tooltip>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:pb-0">
            <span className="text-sm text-[#6d8079] whitespace-nowrap"><strong className="text-[#173b3a]">{filteredData.length}</strong> of {GLOSSARY_DATA.length}</span>
            <Tooltip text="Download the current glossary view">
              <div className="group relative">
                <button className="h-11 w-11 inline-flex items-center justify-center bg-[#173b3a] text-white rounded-xl hover:bg-[#245b59] transition-colors" aria-label="Download glossary"><Download size={17} /></button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#d8e1dd] py-1 hidden group-hover:block group-focus-within:block z-10">
                  <button onClick={() => downloadData('json')} className="block w-full text-left px-4 py-2.5 text-sm text-[#35544c] hover:bg-[#f4ead1]">Download JSON</button>
                  <button onClick={() => downloadData('csv')} className="block w-full text-left px-4 py-2.5 text-sm text-[#35544c] hover:bg-[#f4ead1]">Download CSV</button>
                  <button onClick={() => downloadData('md')} className="block w-full text-left px-4 py-2.5 text-sm text-[#35544c] hover:bg-[#f4ead1]">Download Markdown</button>
                </div>
              </div>
            </Tooltip>
          </div>
        </div>
        {(activeFilterCount > 0 || searchTerm) && (
          <div className="mt-4 pt-3 border-t border-[#edf1ee] flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#71827c]">Showing a focused view</span>
            {searchTerm && <span className="inline-flex items-center gap-1 rounded-full bg-[#eef2ef] px-3 py-1 text-xs text-[#35544c]">“{searchTerm}”</span>}
            {activePathId && <span className="inline-flex items-center gap-1 rounded-full bg-[#eef2ef] px-3 py-1 text-xs text-[#35544c]">{LEARNING_PATHS.find(path => path.id === activePathId)?.title}</span>}
            <button onClick={clearFilters} className="text-xs font-semibold text-[#b85d13] hover:underline">Clear view</button>
          </div>
        )}
      </section>

      <section className="mb-7 print:hidden" aria-labelledby="az-heading">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 id="az-heading" className="font-serif text-2xl text-[#173b3a]">Browse by letter</h2>
          <span className="text-xs text-[#71827c]">Jump to a term</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ALPHABET.map(letter => {
            const hasTerms = letter === 'All' || lettersWithTerms.has(letter);
            const isActive = selectedLetter === letter;
            return (
              <button key={letter} onClick={() => hasTerms && setSelectedLetter(letter)} disabled={!hasTerms} aria-pressed={isActive} className={`min-w-9 h-9 px-2 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-[#173b3a] text-white' : hasTerms ? 'bg-white border border-[#d8e1dd] text-[#48635b] hover:border-[#e2830b] hover:text-[#a75208]' : 'bg-[#f0f3f1] text-[#c1cbc6] cursor-not-allowed'}`}>
                {letter}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <div className={`grid grid-cols-1 ${quickMode ? 'md:grid-cols-2' : 'lg:grid-cols-1 xl:grid-cols-2'} gap-5 print:block print:space-y-6`}>
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => {
            // Get affiliate products for this term
            const affiliateProducts = getAffiliateProducts(item.id, item.term, item.definition);
            // Combine with existing affiliate tools
            const allAffiliateTools = [
              ...(item.affiliateTools || []),
              ...affiliateProducts.filter(ap =>
                !(item.affiliateTools || []).some(at => at.url === ap.url)
              )
            ];
            // Filter related terms to only valid ones
            const validRelatedTerms = (item.relatedTermIds || []).filter(tid => VALID_TERM_IDS.has(tid));

            return (
              <React.Fragment key={item.id}>
              {index === 6 && !searchTerm && activeFilterCount === 0 && selectedLetter === 'All' && <StorefrontFeature />}
              <article
                key={item.id}
                id={item.id}
                className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col overflow-hidden print:border-none print:shadow-none print:mb-8 ${expandedId === item.id ? 'ring-2 ring-[#f4c95d] shadow-lg' : 'border-[#d8e1dd] shadow-[0_8px_24px_rgba(23,59,58,0.05)] hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(23,59,58,0.09)]'}`}
              >
                {/* Card Header */}
                <div className="p-5 sm:p-6 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2 items-center flex-wrap">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.12em] ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-1 border rounded-full ${getDifficultyColor(item.difficulty)}`}>
                        {item.difficulty}
                      </span>
                      {item.bookRef && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 bg-[#fff8e7] text-[#8b5a12] border border-[#ead6a9] rounded-full">
                          <Book size={12} />
                          {item.bookChapter || 'Featured in Book'}
                        </span>
                      )}
                      {item.definitionStatus === 'editorial-draft' && (
                        <span className="text-[11px] font-semibold px-2 py-1 bg-[#f0f3f1] text-[#51645e] border border-[#d8e1dd] rounded-full">
                          Editorial draft
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => toggleLearned(item.id, e)}
                      onTouchEnd={(e) => toggleLearned(item.id, e)}
                      className={`transition-colors rounded-xl p-1 min-w-[44px] min-h-[44px] flex items-center justify-center ${learnedTerms.has(item.id) ? 'text-[#2f8a69] bg-[#e8f1ed]' : 'text-[#a9b7b1] hover:text-[#2f8a69] hover:bg-[#f1f6f3]'}`}
                      title={learnedTerms.has(item.id) ? 'Mark as not learned' : 'Mark as learned'}
                      aria-label={learnedTerms.has(item.id) ? `Mark ${item.term} as not learned` : `Mark ${item.term} as learned`}
                    >
                      <CheckCircle size={24} fill={learnedTerms.has(item.id) ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-[26px] leading-tight font-serif font-bold text-[#173b3a]">{item.term}</h3>
                    {item.pronunciation && (
                        <span className="text-[#87958f] font-serif italic text-sm">{item.pronunciation}</span>
                    )}
                    <PronunciationButton termId={item.id} term={item.term} compact />
                  </div>

                  {quickMode ? (
                    <p className="text-[#48635b] leading-relaxed">{item.shortDefinition || item.definition}</p>
                  ) : (
                    <div className="prose prose-slate max-w-none">
                      <p className="text-[#48635b] leading-relaxed text-[17px]">
                        {item.definition}
                      </p>
                    </div>
                  )}

                  {/* Show affiliate products in collapsed view too */}
                  {!quickMode && allAffiliateTools.length > 0 && expandedId !== item.id && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {allAffiliateTools.slice(0, 2).map((tool, idx) => (
                        <a
                          key={idx}
                          href={tool.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                        >
                          <ShoppingBag size={14} />
                          {tool.name}
                        </a>
                      ))}
                      {allAffiliateTools.length > 2 && (
                        <span className="text-xs text-slate-400 self-center">+{allAffiliateTools.length - 2} more</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Expanded Content */}
                {expandedId === item.id && (
                  <div className="border-t border-slate-100 bg-slate-50/50">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 overflow-x-auto">
                      <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap min-h-[48px] ${activeTab === 'overview' ? 'border-amber-500 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                      >
                        Overview
                      </button>
                      {(item.henrysTips || item.commonMistakes || item.troubleshooting) && (
                        <button
                          onClick={() => setActiveTab('expert')}
                          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap min-h-[48px] ${activeTab === 'expert' ? 'border-amber-500 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                          Henry's Advice
                        </button>
                      )}
                      {(item.history || item.difficultyExplanation || allAffiliateTools.length > 0 || (item.sources && item.sources.length > 0)) && (
                        <button
                          onClick={() => setActiveTab('deep')}
                          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap min-h-[48px] ${activeTab === 'deep' ? 'border-amber-500 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                          Deep Dive
                        </button>
                      )}
                      {item.sourceRelations && item.sourceRelations.length > 0 && (
                        <button
                          onClick={() => setActiveTab('sources')}
                          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap min-h-[48px] ${activeTab === 'sources' ? 'border-amber-500 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                          Source Library ({item.sourceRelations.length})
                        </button>
                      )}
                      {item.relatedRecipes && (
                        <button
                          onClick={() => setActiveTab('recipes')}
                          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap min-h-[48px] ${activeTab === 'recipes' ? 'border-amber-500 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                          Recipes
                        </button>
                      )}
                    </div>

                    <div className="p-6">
                      {activeTab === 'overview' && (
                        <div className="space-y-6">
                          {/* Resource Buttons */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <a href={getYouTubeSearchUrl(item.term, item.youtubeQuery)} target="_blank" rel="noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors min-h-[44px]">
                              <Youtube size={16} /> Watch Video
                            </a>
                            {item.bookRef && (
                              <a href={EXTERNAL_URLS.bookPage} target="_blank" rel="noreferrer"
                                className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors min-h-[44px]">
                                <Book size={16} /> Get the Book
                              </a>
                            )}
                            <a href={getBlogSearchUrl(item.term)} target="_blank" rel="noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors min-h-[44px]">
                              <FileText size={16} /> Read Blog
                            </a>
                            <a href={EXTERNAL_URLS.facebookGroup} target="_blank" rel="noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors min-h-[44px]">
                              <Users size={16} /> Facebook Group
                            </a>
                            {item.starterRelated && (
                              <a href={EXTERNAL_URLS.starterGuide} target="_blank" rel="noreferrer"
                                className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors min-h-[44px]">
                                <Sparkles size={16} /> Starter Guide
                              </a>
                            )}
                          </div>

                          {/* Affiliate Products in Overview */}
                          {allAffiliateTools.length > 0 && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <h4 className="flex items-center gap-2 font-bold text-green-800 mb-3">
                                <ShoppingBag size={18} /> Recommended Gear
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {allAffiliateTools.map((tool, idx) => (
                                  <a
                                    key={idx}
                                    href={tool.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-green-700 border border-green-300 rounded-lg text-sm font-medium hover:bg-green-100 hover:border-green-400 transition-colors min-h-[44px]"
                                  >
                                    <ShoppingBag size={16} />
                                    {tool.name}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {item.mediaPlaceholder?.map((media, idx) => (
                            <div key={idx} className="bg-slate-200 rounded-lg h-48 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-300">
                              {media === 'video' ? 'Video Placeholder' : 'Image Placeholder'}
                            </div>
                          ))}

                          {item.widgets?.includes('calculator') && <CalculatorWidget />}
                          {item.widgets?.includes('converter') && <TempConverterWidget />}
                        </div>
                      )}

                      {activeTab === 'expert' && (
                        <div className="space-y-6">
                          {item.henrysTips && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold">
                                <Lightbulb size={18} />
                                <h4>Henry's Tips</h4>
                              </div>
                              <ul className="list-disc list-inside space-y-1 text-amber-900 text-sm">
                                {item.henrysTips.map((tip, idx) => <li key={idx}>{tip}</li>)}
                              </ul>
                            </div>
                          )}
                          {item.commonMistakes && (
                            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2 text-rose-800 font-bold">
                                <AlertTriangle size={18} />
                                <h4>Common Mistakes</h4>
                              </div>
                              <ul className="list-disc list-inside space-y-1 text-rose-900 text-sm">
                                {item.commonMistakes.map((mistake, idx) => <li key={idx}>{mistake}</li>)}
                              </ul>
                            </div>
                          )}
                          {item.troubleshooting && (
                            <div className="bg-slate-100 rounded-lg p-4">
                              <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                                <BookOpen size={18} /> Troubleshooting
                              </h4>
                              <div className="space-y-3">
                                {item.troubleshooting.map((ts, idx) => (
                                  <div key={idx} className="text-sm">
                                    <span className="font-semibold text-slate-800 block">Problem: {ts.problem}</span>
                                    <span className="text-slate-600">Try: {ts.solution}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'deep' && (
                        <div className="space-y-4">
                          {item.history && (
                            <div>
                              <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-2"><History size={16} /> Origin & History</h4>
                              <p className="text-sm text-slate-600 italic">{item.history}</p>
                            </div>
                          )}
                          {item.difficultyExplanation && (
                            <div>
                              <h4 className="font-bold text-slate-700 mb-2">Why is this {item.difficulty}?</h4>
                              <p className="text-sm text-slate-600">{item.difficultyExplanation}</p>
                            </div>
                          )}
                          {allAffiliateTools.length > 0 && (
                            <div className="pt-4 border-t border-slate-200">
                              <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-3"><ShoppingBag size={16} /> Recommended Gear</h4>
                              <div className="flex flex-wrap gap-2">
                                {allAffiliateTools.map((tool, idx) => (
                                  <a key={idx} href={tool.url} target="_blank" rel="noreferrer" className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:border-amber-400 hover:text-amber-600 transition-colors min-h-[44px] inline-flex items-center">
                                    {tool.name}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                          {item.sources && item.sources.length > 0 && (
                            <div className="pt-4 border-t border-slate-200">
                              <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-2"><BookOpen size={16} /> Sources</h4>
                              <div className="flex flex-wrap gap-2">
                                {item.sources.map((source, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                    {source}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'sources' && item.sourceRelations && (
                        <div className="space-y-3">
                          <div>
                            <h4 className="flex items-center gap-2 font-bold text-slate-700"><ExternalLink size={16} /> Source-backed relationships</h4>
                            <p className="text-sm text-slate-500 mt-1">Links and records are drawn from the supplied inventories; derived matches are labeled.</p>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {item.sourceRelations.map((resource, idx) => (
                              <div key={`${resource.sourceSystem}-${resource.title}-${idx}`} className="rounded-lg border border-slate-200 bg-white p-3">
                                <div className="flex justify-between gap-2 text-xs text-slate-400 mb-1">
                                  <span className="font-semibold uppercase tracking-wide text-blue-700">{resource.sourceSystem}</span>
                                  <span>{resource.status}</span>
                                </div>
                                {resource.url ? (
                                  <a href={resource.url} target="_blank" rel="noreferrer" className="font-medium text-slate-800 hover:text-amber-700 hover:underline">{resource.title}</a>
                                ) : (
                                  <span className="font-medium text-slate-700">{resource.title}</span>
                                )}
                                <div className="text-xs text-slate-500 mt-1">{resource.relation.replaceAll('-', ' ')} · {resource.evidence} match</div>
                              </div>
                            ))}
                          </div>
                          {item.clusterPlan && (
                            <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-sm text-blue-900">
                              <strong>Cluster plan:</strong> {item.clusterPlan.recommendedAction}
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'recipes' && item.relatedRecipes && (
                        <div className="space-y-3">
                          <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-2"><Utensils size={16} /> Featured In</h4>
                          {item.relatedRecipes.map((recipe, idx) => (
                            <a key={idx} href={recipe.url || '#'} className="block p-3 bg-white border border-slate-200 rounded-lg hover:border-amber-400 hover:shadow-sm transition-all group min-h-[44px]">
                              <div className="font-medium text-slate-800 group-hover:text-amber-700">{recipe.name}</div>
                              <div className="text-xs text-slate-400">View Recipe →</div>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Card Footer */}
                <div className="px-5 sm:px-6 py-3 bg-[#f7faf7] border-t border-[#e4ece7] flex flex-wrap gap-3 justify-between items-center print:hidden">
                  <div className="flex items-center gap-2 overflow-x-auto max-w-[62%] hide-scrollbar">
                    {validRelatedTerms.length > 0 && <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#83928c] shrink-0">Related</span>}
                    {validRelatedTerms.map(tid => (
                      <button
                        key={tid}
                        onClick={(e) => handleRelatedTermClick(tid, e)}
                        onTouchEnd={(e) => handleRelatedTermClick(tid, e)}
                        className="text-xs text-[#3f7162] hover:text-[#b85d13] hover:underline whitespace-nowrap py-2 px-1 min-h-[44px] flex items-center"
                      >
                        {TERM_LOOKUP.get(tid) || tid}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {!quickMode && (
                      <button
                        onClick={() => onAskKrusty(item.term)}
                        className="text-[#51645e] hover:text-[#b85d13] text-sm font-semibold flex items-center gap-1 transition-colors py-2 px-3 min-h-[44px]"
                      >
                        <MessageSquare size={16} />
                        <span className="hidden sm:inline">Ask Krusty</span>
                      </button>
                    )}
                    <button
                      onClick={(e) => handleExpandToggle(item.id, e)}
                      onTouchEnd={(e) => handleExpandToggle(item.id, e)}
                      aria-expanded={expandedId === item.id}
                      className="bg-[#e2830b] hover:bg-[#c86f07] text-white text-sm font-semibold flex items-center gap-1.5 py-2 px-4 rounded-xl min-h-[44px] min-w-[124px] justify-center transition-colors active:bg-[#a95806]"
                    >
                      {expandedId === item.id ? (
                        <>Close guide <ChevronUp size={17} /></>
                      ) : (
                        <>Open guide <ArrowRight size={17} /></>
                      )}
                    </button>
                  </div>
                </div>
              </article>
              </React.Fragment>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-[#71827c] rounded-2xl border border-dashed border-[#cbd8d1] bg-white">
            <BookOpen size={42} className="mx-auto mb-4 text-[#b9c8c0]" />
            <p className="text-lg text-[#35544c]">No terms match this view.</p>
            <p className="mt-2 text-sm">Try a broader search or clear the filters.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-[#b85d13] font-semibold hover:underline"
            >
              Clear this view
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-[#91a098] text-xs print:hidden">
        You have reached the end of this view.
      </div>
      <BrandShelf />
    </div>
  );
};

export default GlossaryList;
