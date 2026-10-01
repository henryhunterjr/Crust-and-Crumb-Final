'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { WheatFilm, StorefrontFeature, BrandShelf } from './BrandFeatures';
import PronunciationButton from './PronunciationButton';
import {
  Search, Filter, Download, ExternalLink, BookOpen, ChevronDown, ChevronUp,
  CheckCircle, MessageSquare, AlertTriangle, Lightbulb, History, Calculator,
  Thermometer, Clock, ShoppingBag, Utensils, Youtube, Book, Users, FileText, Calendar, Sparkles, Info, X, ArrowRight,
  Wheat, Sprout, Wrench, Croissant, GraduationCap, Stethoscope
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { GLOSSARY_DATA, LEARNING_PATHS, EXTERNAL_URLS, BAKING_TOOLS_PATH_ID, SOURCE_LABELS, SYMPTOMS } from '../constants';

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
    product: { name: 'Brød & Taylor Bread Steel Max', url: 'https://collabs.shop/zd4dhw' }
  },
  {
    keywords: ['scale', 'kitchen scale', 'digital scale', 'weighing'],
    product: { name: 'Brød & Taylor Scale', url: 'https://collabs.shop/hvryn6' }
  },
  {
    keywords: ['proofing', 'proof', 'proofer', 'folding proofer', 'proofing box', 'overproofed', 'underproofed'],
    product: { name: 'Brød & Taylor Folding Proofer & Slow Cooker', url: 'https://collabs.shop/vutgu8' }
  },
  {
    keywords: ['grain mill', 'home milling', 'fresh milled', 'freshly milled', 'wheat berry', 'impact mill', 'stone mill'],
    product: { name: 'NutriMill Grain Mills', url: 'https://nutrimill.com/Academy26' }
  },
  {
    keywords: ['sourdough starter', 'levain', 'starter', 'mother', 'mother dough', 'wild yeast'],
    product: { name: 'Sourhouse Goldie (code HBK26)', url: 'https://sourhouse.co/products/goldie-by-sourhouse-cooling-puck-white?ref=BAKINGGREATBREAD' }
  }
];

// Get matching affiliate products for a term.
// Match on the term's own id and name only (not the definition), with word boundaries,
// so a passing mention of "starter" or "lame" doesn't attach unrelated gear.
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const getAffiliateProducts = (termId: string, termName: string, _definition: string): { name: string; url: string }[] => {
  const searchText = `${termId.replace(/-/g, ' ')} ${termName}`.toLowerCase();
  const matches: { name: string; url: string }[] = [];
  const seenUrls = new Set<string>();

  for (const mapping of AFFILIATE_MAPPINGS) {
    const hit = mapping.keywords.some(kw => new RegExp(`\\b${escapeRegExp(kw.toLowerCase())}(?![a-z])`).test(searchText));
    if (hit && !seenUrls.has(mapping.product.url)) {
      matches.push(mapping.product);
      seenUrls.add(mapping.product.url);
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

// Visual identity for each guided path card
const PATH_META: Record<string, { icon: LucideIcon; tint: string }> = {
  'beginner-basics': { icon: GraduationCap, tint: 'rgba(124,196,242,.32)' },
  'sourdough-mastery': { icon: Book, tint: 'rgba(240,200,120,.34)' },
  'fresh-milled-grains': { icon: Sprout, tint: 'rgba(181,212,106,.32)' },
  'troubleshooting': { icon: AlertTriangle, tint: 'rgba(255,122,107,.32)' },
  'bread-types': { icon: Croissant, tint: 'rgba(240,154,99,.32)' },
  'tools-equipment': { icon: Wrench, tint: 'rgba(157,180,217,.32)' },
  default: { icon: Wheat, tint: 'rgba(240,200,120,.28)' },
};

// Category accent dots (bright enough to read on the dark glass)
const CATEGORY_DOTS: Record<string, string> = {
  ingredient: '#e8b25c', tool: '#9db4d9', technique: '#7cc4f2', process: '#b9a3f0', bread: '#f09a63',
  pizza: '#f08c9b', 'scientific/technical': '#8e9bf5', troubleshooting: '#ff7a6b', 'grain & milling': '#b5d46a',
  business: '#7fd1a8', practical: '#6fd0d8', schedule: '#6fd0d8',
};
const categoryDot = (cat: string) => CATEGORY_DOTS[cat.toLowerCase()] || '#f0c878';

// Tooltip component
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <div className="group relative inline-block">
    {children}
    <div className="absolute bottom-full right-0 mb-2 w-40 px-3 py-2 bg-[#241b13] text-[#f6ecdc] border border-white/15 text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-normal z-50 pointer-events-none">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#241b13]"></div>
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
  const [activeSymptomId, setActiveSymptomId] = useState<string | null>(null);
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
      setActiveSymptomId(null);
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
      setActiveSymptomId(null);
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

    if (activeSymptomId) {
      const symptom = SYMPTOMS.find(s => s.id === activeSymptomId);
      if (symptom) {
        data = data.filter(item => symptom.termIds.includes(item.id));
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
    }).sort((a, b) => {
      // Paths keep their teaching order; everything else is A to Z
      const path = activePathId ? LEARNING_PATHS.find(p => p.id === activePathId) : undefined;
      if (path) return path.termIds.indexOf(a.id) - path.termIds.indexOf(b.id);
      const symptom = activeSymptomId ? SYMPTOMS.find(s => s.id === activeSymptomId) : undefined;
      if (symptom) return symptom.termIds.indexOf(a.id) - symptom.termIds.indexOf(b.id);
      return a.term.localeCompare(b.term);
    });
  }, [searchTerm, selectedCategory, selectedDifficulty, activePathId, activeSymptomId, selectedLetter]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setActivePathId(null);
    setActiveSymptomId(null);
    setSelectedLetter('All');
  }, []);

  const activeFilterCount = [
    selectedCategory !== 'All',
    selectedDifficulty !== 'All',
    activePathId !== null,
    activeSymptomId !== null,
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
    if (diffLower === 'beginner') return 'bg-[rgba(181,212,106,0.12)] text-[#d6ebaa] border-[rgba(181,212,106,0.4)]';
    if (diffLower === 'intermediate') return 'bg-[rgba(240,200,120,0.12)] text-[#ffe2a8] border-[rgba(240,200,120,0.4)]';
    if (diffLower === 'advanced') return 'bg-[rgba(255,138,110,0.12)] text-[#ffc2b2] border-[rgba(255,138,110,0.4)]';
    return 'bg-white/10 text-[#f6ecdc] border-white/20';
  };

  const getCategoryColor = (_cat: string) => 'bg-white/[0.07] text-[rgba(246,236,220,0.85)] border-white/15';

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
    <div className="mt-4 p-5 glass rounded-[22px]">
      <div className="flex items-center gap-2 mb-3 text-[#f0c878] font-semibold">
        <Calculator size={18} />
        <span>Baker's Percentage Calculator</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <label className="block text-[rgba(246,236,220,0.65)] mb-1 font-medium">Flour (g)</label>
          <input
            type="number"
            value={calcFlour}
            aria-label="Flour in grams"
            onChange={(e) => setCalcFlour(e.target.value)}
            placeholder="1000"
            className="w-full glass-select rounded-xl px-3 py-2 focus:outline-none focus:border-[rgba(240,200,120,0.7)]"
          />
        </div>
        <div>
          <label className="block text-[rgba(246,236,220,0.65)] mb-1 font-medium">Water (% of flour)</label>
          <input
            type="number"
            value={calcHydration}
            aria-label="Water as a percent of flour"
            onChange={(e) => setCalcHydration(e.target.value)}
            placeholder="75"
            className="w-full glass-select rounded-xl px-3 py-2 focus:outline-none focus:border-[rgba(240,200,120,0.7)]"
          />
        </div>
        <div className="col-span-2 sm:col-span-2">
          <label className="block text-[rgba(246,236,220,0.65)] mb-1 font-medium">Results</label>
          <div className="glass-inset rounded-xl p-3 space-y-1">
            <div className="flex justify-between">
              <span className="text-[rgba(246,236,220,0.7)]">Water:</span>
              <span className="font-bold text-[#ffe2a8]">{waterNeeded}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[rgba(246,236,220,0.7)]">Salt (2%):</span>
              <span className="font-bold text-[#ffe2a8]">{saltNeeded}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[rgba(246,236,220,0.7)]">Starter (20%):</span>
              <span className="font-bold text-[#ffe2a8]">{starterNeeded}g</span>
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
    <div className="mt-4 p-5 glass rounded-[22px]">
      <div className="flex items-center gap-2 mb-3 text-[#f0c878] font-semibold">
        <Thermometer size={18} />
        <span>Temperature Converter</span>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-[rgba(246,236,220,0.65)] mb-1 text-xs font-medium">Celsius</label>
          <input
            type="number"
            value={tempCelsius}
            aria-label="Temperature in Celsius"
            onChange={(e) => handleCelsiusChange(e.target.value)}
            placeholder="°C"
            className="w-24 glass-select rounded-xl px-3 py-2 focus:outline-none focus:border-[rgba(240,200,120,0.7)]"
          />
        </div>
        <span className="text-[rgba(246,236,220,0.5)] mt-5">=</span>
        <div>
          <label className="block text-[rgba(246,236,220,0.65)] mb-1 text-xs font-medium">Fahrenheit</label>
          <input
            type="number"
            value={tempFahrenheit}
            aria-label="Temperature in Fahrenheit"
            onChange={(e) => handleFahrenheitChange(e.target.value)}
            placeholder="°F"
            className="w-24 glass-select rounded-xl px-3 py-2 focus:outline-none focus:border-[rgba(240,200,120,0.7)]"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 print:py-0">
      <section id="dictionary" className="glossary-hero relative pt-6 sm:pt-12 pb-10 sm:pb-14 print:hidden">
        <div className="relative max-w-3xl">
          <h1 className="font-display font-medium text-[44px] sm:text-[64px] lg:text-[84px] leading-[0.98] tracking-[-0.035em] text-[#fff8ec] [text-shadow:0_2px_30px_rgba(0,0,0,0.45)]">
            <span className="eyebrow block mb-5 font-sans not-italic tracking-[0.16em] [text-shadow:none]">Crust &amp; Crumb Interactive Bread Baking Glossary</span>
            Learn the language.<br /><em className="text-[#f0c878]">Read the dough.</em>
          </h1>
          <p className="mt-6 text-[rgba(246,236,220,0.86)] text-lg sm:text-xl leading-relaxed max-w-xl">
            A free, searchable reference to {GLOSSARY_DATA.length} bread-baking terms, working techniques, and guided learning paths. Built for the bake in front of you.
          </p>
          <p className="mt-3 text-[rgba(246,236,220,0.66)] text-[15px] leading-relaxed max-w-xl">
            Written by baker Henry Hunter, founder of Baking Great Bread at Home and Crust &amp; Crumb Academy, for home bakers learning sourdough, artisan bread, fresh-milled flour, and ancient grains.
          </p>
          <div className="glass-strong sheen mt-8 max-w-2xl rounded-[26px] flex items-center gap-3 h-16 sm:h-[72px] pl-5 pr-3 focus-within:border-[rgba(240,200,120,0.75)] focus-within:shadow-[0_0_0_4px_rgba(240,200,120,0.18)] transition-shadow">
            <Search className="text-[#f0c878] shrink-0" size={22} aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="search"
              aria-label="Search the bread glossary"
              placeholder="Search a term, symptom, or technique"
              className="glass-input flex-1 min-w-0 h-full text-base sm:text-lg outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm ? (
              <button onClick={() => setSearchTerm('')} className="btn-glass rounded-xl w-11 h-11 inline-flex items-center justify-center shrink-0" aria-label="Clear search">
                <X size={18} />
              </button>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[rgba(246,236,220,0.6)] shrink-0 pr-1">
                <kbd className="rounded-md border border-white/20 bg-white/10 px-2 py-1 font-semibold text-[rgba(246,236,220,0.85)]">/</kbd> to search
              </span>
            )}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 max-w-2xl">
            <div className="glass sheen rounded-[20px] px-4 py-3.5">
              <div className="font-display text-[28px] sm:text-[32px] font-medium leading-none tracking-[-0.02em]">{GLOSSARY_DATA.length}</div>
              <div className="text-[13px] text-[rgba(246,236,220,0.7)] mt-1.5">terms and techniques</div>
            </div>
            <div className="glass sheen rounded-[20px] px-4 py-3.5">
              <div className="font-display text-[28px] sm:text-[32px] font-medium leading-none tracking-[-0.02em]">{LEARNING_PATHS.length}</div>
              <div className="text-[13px] text-[rgba(246,236,220,0.7)] mt-1.5">guided paths</div>
            </div>
            <div className="glass sheen rounded-[20px] px-4 py-3.5">
              <div className="font-display text-[28px] sm:text-[32px] font-medium leading-none tracking-[-0.02em]">Free</div>
              <div className="text-[13px] text-[rgba(246,236,220,0.7)] mt-1.5">to use and share</div>
            </div>
          </div>
        </div>
        <WheatFilm />
      </section>

      <section id="paths" className="mb-10 print:hidden scroll-mt-28" aria-labelledby="path-heading">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <p className="eyebrow mb-2">Guided paths</p>
            <h2 id="path-heading" className="font-display font-medium text-[34px] sm:text-[44px] leading-none tracking-[-0.025em] text-[#fff8ec]">Choose a way in</h2>
          </div>
          <span className="hidden sm:block text-[15px] text-[rgba(246,236,220,0.7)] max-w-xs text-right">Each path is a short run of terms in the order a baker actually meets them. Bread Types is a collection to browse.</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEARNING_PATHS.map(path => {
            const meta = PATH_META[path.id] || PATH_META.default;
            const Icon = meta.icon;
            const isActive = activePathId === path.id;
            return (
              <button
                key={path.id}
                onClick={() => {
                  setActivePathId(isActive ? null : path.id);
                  setActiveSymptomId(null);
                  setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                }}
                aria-pressed={isActive}
                className={`glass sheen lift text-left rounded-[28px] p-6 flex flex-col gap-4 min-h-[184px] ${isActive ? '!border-[rgba(240,200,120,0.7)] !bg-[rgba(240,200,120,0.12)]' : ''}`}
              >
                <span className="flex items-center justify-between w-full">
                  <span className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]" style={{ background: meta.tint }}>
                    <Icon size={22} className="text-[#fff8ec]" aria-hidden="true" />
                  </span>
                  <span className="text-[13px] font-semibold text-[rgba(246,236,220,0.7)]">{path.termIds.length} terms</span>
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="font-display text-[24px] font-medium tracking-[-0.015em] text-[#fff8ec]">{path.title}</span>
                  <span className="text-[15px] leading-relaxed text-[rgba(246,236,220,0.74)]">{path.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section id="diagnose" className="glass sheen rounded-[28px] p-5 sm:p-7 mb-10 print:hidden scroll-mt-28" aria-labelledby="diagnose-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
          <div>
            <p className="eyebrow mb-2 flex items-center gap-2"><Stethoscope size={14} aria-hidden="true" /> Diagnose a problem</p>
            <h2 id="diagnose-heading" className="font-display font-medium text-[30px] sm:text-[38px] leading-none tracking-[-0.025em] text-[#fff8ec]">What went wrong with the loaf?</h2>
          </div>
          <span className="text-[15px] text-[rgba(246,236,220,0.7)] sm:max-w-xs sm:text-right">Pick the symptom you can see. You'll get the causes first, then the fixes.</span>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Symptoms">
          {SYMPTOMS.map(symptom => {
            const isActive = activeSymptomId === symptom.id;
            return (
              <button
                key={symptom.id}
                onClick={() => {
                  setActiveSymptomId(isActive ? null : symptom.id);
                  setActivePathId(null);
                  setSelectedLetter('All');
                  setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                }}
                aria-pressed={isActive}
                className={`btn-glass min-h-[44px] px-4 rounded-full text-[15px] font-semibold ${isActive ? 'is-active' : ''}`}
              >
                {symptom.label}
              </button>
            );
          })}
        </div>
      </section>

      <section id="results" className="glass sheen rounded-[28px] px-4 py-4 sm:px-5 mb-5 print:hidden scroll-mt-28" aria-label="Glossary filters">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex-1 min-w-0 flex flex-wrap gap-2">
            <div className="relative min-w-0 basis-full sm:basis-auto sm:min-w-[170px] flex-1">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f0c878]" size={16} aria-hidden="true" />
              <select aria-label="Filter by category" className="glass-select w-full h-12 pl-10 pr-4 rounded-2xl appearance-none focus:outline-none focus:border-[rgba(240,200,120,0.7)]" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="All">All categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="glass-inset flex flex-wrap items-center gap-1 p-1 rounded-2xl max-w-full" role="group" aria-label="Filter by level">
              {['All', ...difficulties].map(d => (
                <button key={d} onClick={() => setSelectedDifficulty(d)} aria-pressed={selectedDifficulty === d}
                  className={`h-10 px-3 sm:px-3.5 rounded-xl text-sm font-semibold transition-colors ${selectedDifficulty === d ? 'bg-white/15 text-[#fff8ec] border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]' : 'text-[rgba(246,236,220,0.72)] hover:text-[#fff8ec] border border-transparent'}`}>
                  {d === 'All' ? 'All levels' : d}
                </button>
              ))}
            </div>
            <Tooltip text="Show shorter definitions for faster scanning">
              <button onClick={() => setQuickMode(!quickMode)} className="btn-glass h-12 px-4 rounded-2xl text-sm font-semibold" aria-pressed={quickMode}>
                {quickMode ? 'Quick view on' : 'Quick view'}
              </button>
            </Tooltip>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[rgba(246,236,220,0.7)] whitespace-nowrap tabular-nums" aria-live="polite"><strong className="text-[#fff8ec]">{filteredData.length}</strong> of {GLOSSARY_DATA.length}</span>
            <Tooltip text="Download the current glossary view">
              <div className="group relative">
                <button className="btn-glass h-12 w-12 inline-flex items-center justify-center rounded-2xl" aria-label="Download glossary"><Download size={17} /></button>
                <div className="glass-strong absolute right-0 mt-2 w-52 rounded-2xl py-1.5 hidden group-hover:block group-focus-within:block z-10">
                  <button onClick={() => downloadData('json')} className="block w-full text-left px-4 py-2.5 text-sm text-[#f6ecdc] hover:bg-white/10">Download JSON</button>
                  <button onClick={() => downloadData('csv')} className="block w-full text-left px-4 py-2.5 text-sm text-[#f6ecdc] hover:bg-white/10">Download CSV</button>
                  <button onClick={() => downloadData('md')} className="block w-full text-left px-4 py-2.5 text-sm text-[#f6ecdc] hover:bg-white/10">Download Markdown</button>
                </div>
              </div>
            </Tooltip>
          </div>
        </div>
        {(activeFilterCount > 0 || searchTerm) && (
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[rgba(246,236,220,0.65)]">Showing a focused view</span>
            {searchTerm && <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs text-[#f6ecdc]">“{searchTerm}”</span>}
            {activePathId && <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(240,200,120,0.15)] border border-[rgba(240,200,120,0.45)] px-3 py-1 text-xs text-[#ffe2a8]">{LEARNING_PATHS.find(path => path.id === activePathId)?.title}</span>}
            {activeSymptomId && <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(255,122,107,0.15)] border border-[rgba(255,122,107,0.45)] px-3 py-1 text-xs text-[#ffc2b2]">Diagnosing: {SYMPTOMS.find(s => s.id === activeSymptomId)?.label}</span>}
            <button onClick={clearFilters} className="text-xs font-semibold text-[#f0c878] hover:underline min-h-[32px] px-1">Clear view</button>
          </div>
        )}
      </section>

      <nav className="glass rounded-[20px] p-1.5 mb-8 print:hidden overflow-x-auto hide-scrollbar" aria-label="Browse by letter">
        <div className="flex gap-1 min-w-max lg:min-w-0 lg:justify-between">
          {ALPHABET.map(letter => {
            const hasTerms = letter === 'All' || lettersWithTerms.has(letter);
            const isActive = selectedLetter === letter;
            return (
              <button key={letter} onClick={() => hasTerms && setSelectedLetter(letter)} disabled={!hasTerms} aria-pressed={isActive}
                className={`min-w-[38px] h-10 px-2 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'btn-gold' : hasTerms ? 'text-[#f6ecdc] hover:bg-white/10' : 'text-[rgba(246,236,220,0.25)] cursor-not-allowed'}`}>
                {letter}
              </button>
            );
          })}
        </div>
      </nav>

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
            const isOpen = expandedId === item.id;

            return (
              <React.Fragment key={item.id}>
              {index === 6 && !searchTerm && activeFilterCount === 0 && selectedLetter === 'All' && <StorefrontFeature />}
              <article
                key={item.id}
                id={item.id}
                className={`glass sheen rounded-[28px] flex flex-col overflow-hidden scroll-mt-28 transition-[transform,border-color,background-color] duration-300 print:border-none print:shadow-none print:mb-8 ${isOpen ? '!border-[rgba(240,200,120,0.6)] !bg-[rgba(255,244,228,0.1)]' : 'hover:-translate-y-0.5 hover:border-white/25'}`}
              >
                {/* Card Header */}
                <div className="p-5 sm:p-7 pb-4 sm:pb-5">
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="flex gap-2 items-center flex-wrap">
                      <span className={`inline-flex items-center gap-2 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.12em] border ${getCategoryColor(item.category)}`}>
                        <span className="w-2 h-2 rounded-full" style={{ background: categoryDot(item.category), boxShadow: `0 0 10px ${categoryDot(item.category)}` }} aria-hidden="true" />
                        {item.category}
                      </span>
                      <span className={`text-[12px] font-semibold px-2.5 py-1 border rounded-full ${getDifficultyColor(item.difficulty)}`}>
                        {item.difficulty}
                      </span>
                      {item.bookRef && (
                        <span className="flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 bg-[rgba(240,200,120,0.14)] text-[#ffe2a8] border border-[rgba(240,200,120,0.45)] rounded-full">
                          <Book size={12} />
                          {item.bookChapter || 'Featured in Book'}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => toggleLearned(item.id, e)}
                      onTouchEnd={(e) => toggleLearned(item.id, e)}
                      className={`transition-colors rounded-2xl min-w-[44px] min-h-[44px] flex items-center justify-center border ${learnedTerms.has(item.id) ? 'text-[#b5d46a] bg-[rgba(181,212,106,0.15)] border-[rgba(181,212,106,0.45)]' : 'text-[rgba(246,236,220,0.45)] border-transparent hover:text-[#b5d46a] hover:bg-white/5'}`}
                      title={learnedTerms.has(item.id) ? 'Mark as not learned' : 'Mark as learned'}
                      aria-label={learnedTerms.has(item.id) ? `Mark ${item.term} as not learned` : `Mark ${item.term} as learned`}
                    >
                      <CheckCircle size={24} fill={learnedTerms.has(item.id) ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h3 className="font-display text-[30px] sm:text-[32px] leading-tight font-medium tracking-[-0.02em] text-[#fff8ec]">
                      <a href={`/term/${item.id}`} onClick={(e) => e.stopPropagation()} className="hover:text-[#f0c878] focus-visible:text-[#f0c878]">{item.term}</a>
                    </h3>
                    {item.pronunciation && (
                      <span className="text-[#f0c878] font-display italic text-[15px] opacity-90">{item.pronunciation}</span>
                    )}
                    <PronunciationButton termId={item.id} term={item.term} compact />
                  </div>

                  {quickMode ? (
                    <p className="text-[rgba(246,236,220,0.82)] leading-relaxed">{item.shortDefinition || item.definition}</p>
                  ) : (
                    <div className={item.illustration ? 'grid gap-4 sm:grid-cols-[minmax(0,1fr)_200px] sm:items-start' : ''}>
                      <p className="text-[rgba(246,236,220,0.86)] leading-relaxed text-[17px]">
                        {item.definition}
                      </p>
                      {item.illustration && (
                        <figure className="glass-inset rounded-[18px] p-2 m-0">
                          <img src={item.illustration.src} alt={item.illustration.alt} width="400" height="260" loading="lazy" decoding="async" className="w-full h-auto rounded-[12px]" />
                        </figure>
                      )}
                    </div>
                  )}

                  {/* Show affiliate products in collapsed view too */}
                  {!quickMode && allAffiliateTools.length > 0 && !isOpen && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {allAffiliateTools.slice(0, 2).map((tool, idx) => (
                        <a
                          key={idx}
                          href={tool.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="btn-glass inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs font-semibold"
                        >
                          <ShoppingBag size={14} className="text-[#f0c878]" />
                          {tool.name}
                        </a>
                      ))}
                      {allAffiliateTools.length > 2 && (
                        <span className="text-xs text-[rgba(246,236,220,0.55)] self-center">+{allAffiliateTools.length - 2} more</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Expanded Content */}
                {isOpen && (
                  <div className="border-t border-white/10 bg-black/15">
                    {/* Tabs */}
                    <div className="flex gap-1 px-3 sm:px-5 pt-3 overflow-x-auto hide-scrollbar" role="tablist">
                      {[
                        { key: 'overview' as const, label: 'Overview', show: true },
                        { key: 'expert' as const, label: "Henry's Advice", show: Boolean(item.henrysTips || item.commonMistakes || item.troubleshooting) },
                        { key: 'deep' as const, label: 'Deep Dive', show: Boolean(item.history || item.difficultyExplanation || allAffiliateTools.length > 0 || (item.sources && item.sources.length > 0)) },
                        { key: 'sources' as const, label: `Source Library (${item.sourceRelations?.length || 0})`, show: Boolean(item.sourceRelations && item.sourceRelations.length > 0) },
                        { key: 'recipes' as const, label: 'Recipes', show: Boolean(item.relatedRecipes) },
                      ].filter(t => t.show).map(t => (
                        <button
                          key={t.key}
                          role="tab"
                          aria-selected={activeTab === t.key}
                          onClick={() => setActiveTab(t.key)}
                          className={`px-4 h-11 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${activeTab === t.key ? 'bg-white/15 border-white/25 text-[#fff8ec] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]' : 'border-transparent text-[rgba(246,236,220,0.7)] hover:text-[#fff8ec]'}`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-5 sm:p-7">
                      {activeTab === 'overview' && (
                        <div className="space-y-6">
                          {/* Resource Buttons */}
                          <div className="flex flex-wrap gap-2">
                            <a href={getYouTubeSearchUrl(item.term, item.youtubeQuery)} target="_blank" rel="noreferrer"
                              className="btn-glass flex items-center gap-2 px-4 rounded-full text-sm font-semibold min-h-[44px]">
                              <Youtube size={16} className="text-[#ff8a7a]" /> Watch Video
                            </a>
                            {item.bookRef && (
                              <a href={EXTERNAL_URLS.bookPage} target="_blank" rel="noreferrer"
                                className="btn-gold flex items-center gap-2 px-4 rounded-full text-sm font-semibold min-h-[44px]">
                                <Book size={16} /> Get the Book
                              </a>
                            )}
                            <a href={getBlogSearchUrl(item.term)} target="_blank" rel="noreferrer"
                              className="btn-glass flex items-center gap-2 px-4 rounded-full text-sm font-semibold min-h-[44px]">
                              <FileText size={16} className="text-[#f0c878]" /> Read Blog
                            </a>
                            <a href={EXTERNAL_URLS.facebookGroup} target="_blank" rel="noreferrer"
                              className="btn-glass flex items-center gap-2 px-4 rounded-full text-sm font-semibold min-h-[44px]">
                              <Users size={16} className="text-[#9db4d9]" /> Facebook Group
                            </a>
                            {item.starterRelated && (
                              <a href={EXTERNAL_URLS.starterGuide} target="_blank" rel="noreferrer"
                                className="btn-glass flex items-center gap-2 px-4 rounded-full text-sm font-semibold min-h-[44px]">
                                <Sparkles size={16} className="text-[#b9a3f0]" /> Starter Guide
                              </a>
                            )}
                          </div>

                          {/* Affiliate Products in Overview */}
                          {allAffiliateTools.length > 0 && (
                            <div className="glass rounded-[22px] p-5">
                              <h4 className="flex items-center gap-2 font-semibold text-[#fff8ec] mb-3">
                                <ShoppingBag size={18} className="text-[#f0c878]" /> Recommended Gear
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {allAffiliateTools.map((tool, idx) => (
                                  <a
                                    key={idx}
                                    href={tool.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-glass inline-flex items-center gap-2 px-4 rounded-full text-sm font-semibold min-h-[44px]"
                                  >
                                    <ShoppingBag size={16} className="text-[#f0c878]" />
                                    {tool.name}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {item.widgets?.includes('calculator') && CalculatorWidget()}
                          {item.widgets?.includes('converter') && TempConverterWidget()}
                        </div>
                      )}

                      {activeTab === 'expert' && (
                        <div className="space-y-5">
                          {item.henrysTips && (
                            <div className="rounded-[22px] p-5 bg-[rgba(240,200,120,0.1)] border border-[rgba(240,200,120,0.32)] shadow-[inset_0_1px_0_rgba(255,236,190,0.22)]">
                              <div className="flex items-center gap-2 mb-3 text-[#f0c878] font-bold text-xs uppercase tracking-[0.14em]">
                                <Lightbulb size={16} />
                                <h4>Henry&apos;s notes from the bench</h4>
                              </div>
                              <ul className="space-y-2.5 text-[#fff3df] text-[16px] leading-relaxed">
                                {item.henrysTips.map((tip, idx) => <li key={idx}>{tip}</li>)}
                              </ul>
                            </div>
                          )}
                          {item.commonMistakes && (
                            <div className="rounded-[22px] p-5 bg-[rgba(255,122,107,0.08)] border border-[rgba(255,122,107,0.3)]">
                              <div className="flex items-center gap-2 mb-3 text-[#ffb2a8] font-bold text-xs uppercase tracking-[0.14em]">
                                <AlertTriangle size={16} />
                                <h4>Common Mistakes</h4>
                              </div>
                              <ul className="space-y-2 text-[rgba(246,236,220,0.88)] text-[15px] leading-relaxed list-disc pl-5">
                                {item.commonMistakes.map((mistake, idx) => <li key={idx}>{mistake}</li>)}
                              </ul>
                            </div>
                          )}
                          {item.troubleshooting && (
                            <div className="space-y-2.5">
                              <h4 className="font-display text-[22px] font-medium text-[#fff8ec] flex items-center gap-2">
                                Diagnose and fix
                              </h4>
                              {item.troubleshooting.map((ts, idx) => (
                                <details key={idx} className="glass rounded-[18px] px-5 group" open={idx === 0}>
                                  <summary className="flex items-center justify-between gap-3 min-h-[56px] cursor-pointer list-none text-[16px] font-semibold text-[#fff8ec]">
                                    {ts.problem}
                                    <ChevronDown size={18} className="text-[#f0c878] shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                                  </summary>
                                  <p className="pb-4 text-[15px] leading-relaxed text-[rgba(246,236,220,0.84)]">{ts.solution}</p>
                                </details>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'deep' && (
                        <div className="space-y-5">
                          {item.history && (
                            <div>
                              <h4 className="flex items-center gap-2 font-semibold text-[#fff8ec] mb-2"><History size={16} className="text-[#f0c878]" /> Origin &amp; History</h4>
                              <p className="text-[15px] text-[rgba(246,236,220,0.82)] italic leading-relaxed">{item.history}</p>
                            </div>
                          )}
                          {item.difficultyExplanation && (
                            <div>
                              <h4 className="font-semibold text-[#fff8ec] mb-2">Why is this {item.difficulty}?</h4>
                              <p className="text-[15px] text-[rgba(246,236,220,0.82)] leading-relaxed">{item.difficultyExplanation}</p>
                            </div>
                          )}
                          {allAffiliateTools.length > 0 && (
                            <div className="pt-4 border-t border-white/10">
                              <h4 className="flex items-center gap-2 font-semibold text-[#fff8ec] mb-3"><ShoppingBag size={16} className="text-[#f0c878]" /> Recommended Gear</h4>
                              <div className="flex flex-wrap gap-2">
                                {allAffiliateTools.map((tool, idx) => (
                                  <a key={idx} href={tool.url} target="_blank" rel="noreferrer" className="btn-glass px-4 rounded-full text-sm font-semibold min-h-[44px] inline-flex items-center">
                                    {tool.name}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                          {item.sources && item.sources.length > 0 && (
                            <div className="pt-4 border-t border-white/10">
                              <h4 className="flex items-center gap-2 font-semibold text-[#fff8ec] mb-2"><BookOpen size={16} className="text-[#f0c878]" /> Sources</h4>
                              <div className="flex flex-wrap gap-2">
                                {item.sources.map((source, idx) => (
                                  <span key={idx} className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[rgba(246,236,220,0.85)] text-xs">
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
                            <h4 className="flex items-center gap-2 font-semibold text-[#fff8ec]"><ExternalLink size={16} className="text-[#f0c878]" /> Go deeper</h4>
                            <p className="text-sm text-[rgba(246,236,220,0.62)] mt-1">Articles, videos, and recipes that cover this term.</p>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {item.sourceRelations.map((resource, idx) => (
                              <div key={`${resource.sourceSystem}-${resource.title}-${idx}`} className="glass rounded-[18px] p-4">
                                <div className="flex justify-between gap-2 text-[11px] text-[rgba(246,236,220,0.55)] mb-1.5">
                                  <span className="font-bold uppercase tracking-[0.12em] text-[#f0c878]">{resource.sourceSystem}</span>
                                </div>
                                {resource.url ? (
                                  <a href={resource.url} target="_blank" rel="noreferrer" className="font-semibold text-[#fff8ec] hover:text-[#f0c878] hover:underline">{resource.title}</a>
                                ) : (
                                  <span className="font-semibold text-[#fff8ec]">{resource.title}</span>
                                )}
                                <div className="text-xs text-[rgba(246,236,220,0.55)] mt-1">{SOURCE_LABELS[resource.relation] || 'Related'}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeTab === 'recipes' && item.relatedRecipes && (
                        <div className="space-y-3">
                          <h4 className="flex items-center gap-2 font-semibold text-[#fff8ec] mb-2"><Utensils size={16} className="text-[#f0c878]" /> Featured In</h4>
                          {item.relatedRecipes.map((recipe, idx) => (
                            <a key={idx} href={recipe.url || '#'} className="glass lift block p-4 rounded-[18px] min-h-[44px]">
                              <div className="font-semibold text-[#fff8ec]">{recipe.name}</div>
                              <div className="text-xs text-[#f0c878] mt-0.5">View recipe</div>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Card Footer */}
                <div className="mt-auto px-5 sm:px-7 py-3 border-t border-white/10 flex flex-col gap-1 print:hidden">
                  <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar -mx-1">
                    {validRelatedTerms.length > 0 && <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[rgba(246,236,220,0.5)] shrink-0 mr-1">Related</span>}
                    {validRelatedTerms.map(tid => (
                      <button
                        key={tid}
                        onClick={(e) => handleRelatedTermClick(tid, e)}
                        onTouchEnd={(e) => handleRelatedTermClick(tid, e)}
                        className="text-[13px] text-[rgba(246,236,220,0.85)] hover:text-[#f0c878] whitespace-nowrap px-3 rounded-full hover:bg-white/5 min-h-[44px] flex items-center transition-colors"
                      >
                        {TERM_LOOKUP.get(tid) || tid}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    {!quickMode && (
                      <button
                        onClick={() => onAskKrusty(item.term)}
                        aria-label={`Ask Krusty about ${item.term}`}
                        className="btn-glass text-sm font-semibold flex items-center gap-1.5 px-4 rounded-full min-h-[44px]"
                      >
                        <MessageSquare size={16} className="text-[#f0c878]" />
                        <span className="hidden sm:inline">Ask Krusty</span>
                      </button>
                    )}
                    <button
                      onClick={(e) => handleExpandToggle(item.id, e)}
                      onTouchEnd={(e) => handleExpandToggle(item.id, e)}
                      aria-expanded={isOpen}
                      className="btn-gold text-sm font-bold flex items-center gap-1.5 px-5 rounded-full min-h-[44px] min-w-[132px] justify-center"
                    >
                      {isOpen ? (
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
          <div className="glass sheen col-span-full py-16 px-6 text-center rounded-[28px]">
            <BookOpen size={42} className="mx-auto mb-4 text-[#f0c878]" />
            <p className="font-display text-[26px] text-[#fff8ec]">Not in the glossary yet</p>
            <p className="mt-2 text-[15px] text-[rgba(246,236,220,0.72)] max-w-md mx-auto">Try a broader search, or ask Krusty. Every term bakers look for goes on the list for the next update.</p>
            <div className="mt-6 flex justify-center gap-2 flex-wrap">
              <button onClick={() => onAskKrusty(searchTerm || 'this term')} className="btn-gold h-11 px-5 rounded-full font-bold text-sm">Ask Krusty about it</button>
              <button onClick={clearFilters} className="btn-glass h-11 px-5 rounded-full font-semibold text-sm">Clear this view</button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 text-center text-[rgba(246,236,220,0.45)] text-xs print:hidden">
        You&apos;ve reached the end of this view.
      </div>
      <BrandShelf />
    </div>
  );
};

export default GlossaryList;
