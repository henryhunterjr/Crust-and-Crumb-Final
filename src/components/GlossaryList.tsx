'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search, Filter, Download, ExternalLink, BookOpen, ChevronDown, ChevronUp,
  CheckCircle, MessageSquare, AlertTriangle, Lightbulb, History, Calculator,
  Thermometer, Clock, ShoppingBag, Utensils, Youtube, Book, Users, FileText, Calendar, Sparkles, Info
} from 'lucide-react';
import { GLOSSARY_DATA, LEARNING_PATHS, EXTERNAL_URLS, BAKING_TOOLS_PATH_ID } from '../constants';
import LearnMore from './LearnMore';
import { hasTermLinks } from '../data/glossaryLinks';

// Affiliate product mappings - keywords to products
const AFFILIATE_MAPPINGS: { keywords: string[]; product: { name: string; url: string } }[] = [
  {
    keywords: ['bench knife', 'bench scraper', 'bench-scraper', 'dough scraper'],
    product: { name: 'Brød & Taylor Bench Knife', url: 'https://collabs.shop/i4ifmu' }
  },
  {
    keywords: ['banneton', 'proofing basket', 'proofing container', 'brotform'],
    product: { name: 'Brød & Taylor Proofing Container', url: 'https://collabs.shop/6iguo3' }
  },
  {
    keywords: ['lame', 'scoring', 'bread lame', 'score', 'slash'],
    product: { name: 'Wire Monkey Lame', url: 'https://wiremonkey.com/?ref=BAKINGGREATBREAD' }
  },
  {
    keywords: ['dutch oven', 'baking vessel', 'combo cooker', 'lodge'],
    product: { name: 'Brød & Taylor Baking Shell (Boule)', url: 'https://collabs.shop/yfjaxt' }
  },
  {
    keywords: ['batard', 'oval loaf', 'oblong'],
    product: { name: 'Brød & Taylor Baking Shell (Batard)', url: 'https://collabs.shop/8su3wv' }
  },
  {
    keywords: ['baking steel', 'pizza steel', 'bread steel', 'steel plate'],
    product: { name: 'Brød & Taylor Bread Steel', url: 'https://collabs.shop/soze7p' }
  },
  {
    keywords: ['scale', 'kitchen scale', 'digital scale', 'weighing'],
    product: { name: 'Brød & Taylor Scale', url: 'https://collabs.shop/bsdfl2' }
  },
  {
    keywords: ['proofing', 'proof', 'proofer', 'folding proofer', 'proofing box'],
    product: { name: 'Brød & Taylor Folding Proofer', url: 'https://collabs.shop/38ff48' }
  },
  {
    keywords: ['sourdough starter', 'levain', 'starter', 'mother dough', 'wild yeast'],
    product: { name: 'Sourhouse Goldie', url: 'https://bit.ly/3Wd9rJy' }
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

// Tooltip component
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <div className="group relative inline-block">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
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
  const [activeTab, setActiveTab] = useState<'overview' | 'expert' | 'deep' | 'recipes'>('overview');
  const [selectedLetter, setSelectedLetter] = useState<string>('All');

  // Persisted state
  const [learnedTerms, setLearnedTerms] = useState<Set<string>>(new Set());

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
        item.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchTerm, selectedCategory, selectedDifficulty, activePathId, selectedLetter]);

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
    if (diffLower === 'beginner') return 'bg-green-100 text-green-800 border-green-200';
    if (diffLower === 'intermediate') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (diffLower === 'advanced') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryColor = (cat: string) => {
    const catLower = cat.toLowerCase();
    if (catLower === 'ingredient') return 'bg-amber-100 text-amber-800';
    if (catLower === 'tool') return 'bg-slate-100 text-slate-800';
    if (catLower === 'technique') return 'bg-blue-100 text-blue-800';
    if (catLower === 'process') return 'bg-purple-100 text-purple-800';
    if (catLower === 'bread' || catLower === 'bread_type') return 'bg-orange-100 text-orange-800';
    if (catLower === 'pizza') return 'bg-rose-100 text-rose-800';
    if (catLower === 'schedule') return 'bg-teal-100 text-teal-800';
    if (catLower === 'scientific/technical' || catLower === 'scientific') return 'bg-indigo-100 text-indigo-800';
    return 'bg-gray-100 text-gray-800';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:py-0">

      {/* Mastery Paths - Compact Grid */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Mastery Paths</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {/* All Terms */}
          <button
            onClick={() => setActivePathId(null)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              !activePathId
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-300 hover:bg-amber-50'
            }`}
          >
            All Terms
          </button>
          {/* Learning Paths */}
          {LEARNING_PATHS.map(path => (
            <button
              key={path.id}
              onClick={() => setActivePathId(activePathId === path.id ? null : path.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activePathId === path.id
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-300 hover:bg-amber-50'
              }`}
            >
              {path.title}
            </button>
          ))}
          {/* Baking Tools - Opens Modal */}
          <button
            onClick={onToolsClick}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all bg-amber-100 border border-amber-300 text-amber-800 hover:bg-amber-200 flex items-center justify-center gap-1.5"
          >
            <Calculator size={14} />
            Baking Tools
          </button>
        </div>
      </div>

      {/* A-Z Navigation */}
      <div className="mb-6 print:hidden">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Browse A-Z</h2>
        <div className="flex flex-wrap gap-1">
          {ALPHABET.map(letter => {
            const hasTerms = letter === 'All' || lettersWithTerms.has(letter);
            const isActive = selectedLetter === letter;
            return (
              <button
                key={letter}
                onClick={() => hasTerms && setSelectedLetter(letter)}
                disabled={!hasTerms}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md'
                    : hasTerms
                    ? 'bg-white border border-slate-200 text-slate-700 hover:border-amber-300 hover:bg-amber-50'
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6 mb-8 print:hidden">
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-end">

          <div className="w-full lg:w-1/3">
            <label className="block text-sm font-medium text-slate-700 mb-2">Search Terms</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search definitions, tips..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 w-full lg:w-2/3 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
              <select
                className="w-full px-4 py-2 border border-slate-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="All">All Levels</option>
                {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <Tooltip text="Quick Mode: Shows abbreviated definitions for faster browsing">
                <button
                  onClick={() => setQuickMode(!quickMode)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${quickMode ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                >
                  Quick Mode
                </button>
              </Tooltip>
              <Tooltip text="Download glossary as JSON, CSV, or Markdown">
                <div className="group relative">
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
                    <Download size={18} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 hidden group-hover:block z-10">
                    <button onClick={() => downloadData('json')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-amber-50">Download JSON</button>
                    <button onClick={() => downloadData('csv')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-amber-50">Download CSV</button>
                    <button onClick={() => downloadData('md')} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-amber-50">Download Markdown</button>
                  </div>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className={`grid grid-cols-1 ${quickMode ? 'md:grid-cols-2' : 'lg:grid-cols-1 xl:grid-cols-2'} gap-6 print:block print:space-y-6`}>
        {filteredData.length > 0 ? (
          filteredData.map((item) => {
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
              <div
                key={item.id}
                id={item.id}
                className={`bg-white rounded-xl border shadow-sm transition-all duration-300 flex flex-col overflow-hidden print:border-none print:shadow-none print:mb-8 ${expandedId === item.id ? 'ring-2 ring-amber-200 shadow-md' : 'border-amber-100 hover:shadow-md'}`}
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-2 items-center flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wide ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 border rounded-full ${getDifficultyColor(item.difficulty)}`}>
                        {item.difficulty}
                      </span>
                      {item.bookRef && (
                        <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
                          <Book size={12} />
                          {item.bookChapter || 'Featured in Book'}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => toggleLearned(item.id, e)}
                      onTouchEnd={(e) => toggleLearned(item.id, e)}
                      className={`transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center ${learnedTerms.has(item.id) ? 'text-green-500' : 'text-slate-300 hover:text-green-400'}`}
                      title="Mark as learned"
                    >
                      <CheckCircle size={24} fill={learnedTerms.has(item.id) ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="text-2xl font-serif font-bold text-slate-900">{item.term}</h3>
                    {item.pronunciation && (
                      <span className="text-slate-400 font-serif italic text-sm">{item.pronunciation}</span>
                    )}
                  </div>

                  {quickMode ? (
                    <p className="text-slate-600">{item.shortDefinition || item.definition}</p>
                  ) : (
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-600 leading-relaxed text-lg">
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

                  {/* Show learning links in collapsed view */}
                  {!quickMode && expandedId !== item.id && hasTermLinks(item.id) && (
                    <LearnMore termId={item.id} termName={item.term} compact={true} />
                  )}
                </div>

                {/* Expanded Content */}
                {!quickMode && expandedId === item.id && (
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

                          {/* Go Deeper - Learning Links */}
                          <LearnMore termId={item.id} termName={item.term} />

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
                <div className="px-6 py-3 bg-amber-50 border-t border-amber-100 flex flex-wrap gap-3 justify-between items-center print:hidden">
                  <div className="flex gap-2 overflow-x-auto max-w-[60%] hide-scrollbar">
                    {validRelatedTerms.map(tid => (
                      <button
                        key={tid}
                        onClick={(e) => handleRelatedTermClick(tid, e)}
                        onTouchEnd={(e) => handleRelatedTermClick(tid, e)}
                        className="text-xs text-amber-600 hover:text-amber-800 hover:underline whitespace-nowrap py-2 px-1 min-h-[44px] flex items-center"
                      >
                        #{tid}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {!quickMode && (
                      <button
                        onClick={() => onAskKrusty(item.term)}
                        className="text-slate-500 hover:text-amber-600 text-sm font-medium flex items-center gap-1 transition-colors py-2 px-3 min-h-[44px]"
                      >
                        <MessageSquare size={16} />
                        <span className="hidden sm:inline">Ask Krusty</span>
                      </button>
                    )}
                    <button
                      onClick={(e) => handleExpandToggle(item.id, e)}
                      onTouchEnd={(e) => handleExpandToggle(item.id, e)}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium flex items-center gap-1 py-2 px-4 rounded-lg min-h-[44px] min-w-[100px] justify-center transition-colors active:bg-amber-800"
                    >
                      {expandedId === item.id ? (
                        <>Collapse <ChevronUp size={18} /></>
                      ) : (
                        <>Expand <ChevronDown size={18} /></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-slate-400">
            <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No baking terms found matching your criteria.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedDifficulty('All'); setActivePathId(null); setSelectedLetter('All'); }}
              className="mt-4 text-amber-600 font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-slate-400 text-sm print:hidden">
        Showing {filteredData.length} of {GLOSSARY_DATA.length} entries
      </div>
    </div>
  );
};

export default GlossaryList;
