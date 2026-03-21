'use client';

import React, { useState } from 'react';
import { ClipboardList, ChevronRight, ChevronLeft, Loader2, RotateCcw, Award } from 'lucide-react';

interface AnalysisReport {
  totalScore: number;
  exterior: { score: number; feedback: string };
  interior: { score: number; feedback: string };
  fermentation: { status: 'under' | 'perfect' | 'over' | 'unknown'; feedback: string };
  topFixes: string[];
  nextBakeTips: string[];
  encouragement: string;
}

interface FormData {
  breadType: string;
  leavening: string;
  crustColor: string;
  crustTexture: string;
  ovenSpring: string;
  scoring: string;
  crumbStructure: string;
  crumbTexture: string;
  flavor: string;
  proofingMethod: string;
  collapsed: string;
  notes: string;
}

const INITIAL_FORM: FormData = {
  breadType: '',
  leavening: '',
  crustColor: '',
  crustTexture: '',
  ovenSpring: '',
  scoring: '',
  crumbStructure: '',
  crumbTexture: '',
  flavor: '',
  proofingMethod: '',
  collapsed: '',
  notes: '',
};

const STEPS = [
  {
    id: 'basics',
    title: 'The Basics',
    fields: [
      { key: 'breadType', label: 'What did you bake?', type: 'select', options: ['Sourdough boule', 'Sourdough batard', 'Sandwich loaf', 'Baguette', 'Focaccia', 'Enriched dough (brioche/challah)', 'Other'] },
      { key: 'leavening', label: 'What leavening did you use?', type: 'select', options: ['Sourdough starter (liquid)', 'Stiff starter / lievito madre', 'Commercial yeast', 'Pre-ferment (poolish/biga)', 'Mixed (sourdough + yeast)'] },
      { key: 'proofingMethod', label: 'How did you proof it?', type: 'select', options: ['Room temp only', 'Cold proof overnight (fridge)', 'Cold proof 24-48 hours', 'Proofing box / controlled temp', 'Not sure'] },
    ],
  },
  {
    id: 'exterior',
    title: 'The Crust',
    fields: [
      { key: 'crustColor', label: 'How would you describe the crust color?', type: 'select', options: ['Pale / blonde', 'Golden brown', 'Deep amber / mahogany', 'Very dark / almost burnt', 'Uneven — dark top, pale sides'] },
      { key: 'crustTexture', label: 'How did the crust feel and sound?', type: 'select', options: ['Crispy and crackly', 'Firm but not crunchy', 'Soft and chewy', 'Thick and tough', 'Thin and fragile'] },
      { key: 'ovenSpring', label: 'How was the oven spring?', type: 'select', options: ['Explosive — really opened up', 'Good — solid rise', 'Modest — some rise', 'Flat — barely moved', 'Collapsed in the oven'] },
      { key: 'scoring', label: 'How did your score open?', type: 'select', options: ['Beautiful ear, opened wide', 'Opened but no dramatic ear', 'Barely opened', 'Blew out on the side instead', 'Did not score'] },
    ],
  },
  {
    id: 'interior',
    title: 'The Crumb',
    fields: [
      { key: 'crumbStructure', label: 'Describe the crumb structure', type: 'select', options: ['Open and irregular (lots of large holes)', 'Medium — some holes, mostly even', 'Tight and uniform (sandwich style)', 'Dense with almost no holes', 'Large tunnel near the top, dense at bottom'] },
      { key: 'crumbTexture', label: 'How did the crumb feel?', type: 'select', options: ['Moist, springy, and light', 'Slightly chewy but good', 'Gummy or doughy', 'Dry and crumbly', 'Rubbery / tough'] },
      { key: 'flavor', label: 'How was the flavor?', type: 'select', options: ['Complex, tangy, and delicious', 'Mild and pleasant', 'Too sour / acidic', 'Bland / under-fermented tasting', 'Slightly off or yeasty'] },
    ],
  },
  {
    id: 'notes',
    title: 'Anything Else?',
    fields: [
      { key: 'collapsed', label: 'Did the loaf collapse at any point?', type: 'select', options: ['No — held its shape', 'Slightly spread sideways', 'Collapsed in the oven', 'Collapsed after scoring', 'Deflated when I touched it'] },
      { key: 'notes', label: 'Anything specific you want analyzed? (optional)', type: 'textarea', placeholder: 'e.g. "My ear keeps blowing out to the side" or "crumb is gummy even though it looks baked"' },
    ],
  },
];

function scoreExterior(data: FormData): number {
  let score = 25;
  if (data.crustColor === 'Deep amber / mahogany') score += 10;
  else if (data.crustColor === 'Golden brown') score += 8;
  else if (data.crustColor === 'Pale / blonde') score += 3;
  else if (data.crustColor === 'Uneven — dark top, pale sides') score += 5;
  if (data.crustTexture === 'Crispy and crackly') score += 10;
  else if (data.crustTexture === 'Firm but not crunchy') score += 7;
  else if (data.crustTexture === 'Soft and chewy') score += 4;
  if (data.ovenSpring === 'Explosive — really opened up') score += 10;
  else if (data.ovenSpring === 'Good — solid rise') score += 8;
  else if (data.ovenSpring === 'Modest — some rise') score += 4;
  else if (data.ovenSpring === 'Flat — barely moved') score += 1;
  if (data.scoring === 'Beautiful ear, opened wide') score += 10;
  else if (data.scoring === 'Opened but no dramatic ear') score += 7;
  else if (data.scoring === 'Barely opened') score += 3;
  return Math.min(score, 50);
}

function scoreInterior(data: FormData): number {
  let score = 20;
  if (data.crumbStructure === 'Medium — some holes, mostly even') score += 12;
  else if (data.crumbStructure === 'Open and irregular (lots of large holes)') score += 10;
  else if (data.crumbStructure === 'Tight and uniform (sandwich style)') score += 9;
  else if (data.crumbStructure === 'Dense with almost no holes') score += 3;
  if (data.crumbTexture === 'Moist, springy, and light') score += 12;
  else if (data.crumbTexture === 'Slightly chewy but good') score += 10;
  else if (data.crumbTexture === 'Gummy or doughy') score += 3;
  else if (data.crumbTexture === 'Dry and crumbly') score += 4;
  if (data.flavor === 'Complex, tangy, and delicious') score += 10;
  else if (data.flavor === 'Mild and pleasant') score += 8;
  else if (data.flavor === 'Too sour / acidic') score += 5;
  else if (data.flavor === 'Bland / under-fermented tasting') score += 3;
  return Math.min(score, 50);
}

async function analyzeWithClaude(data: FormData, exteriorScore: number, interiorScore: number): Promise<AnalysisReport> {
  const prompt = `You are a master bread baker and educator for Crust & Crumb Academy by Henry Hunter ("Perfection Not Required").

A home baker just submitted this bake report. Analyze it and return a JSON object ONLY — no markdown, no preamble.

BAKE DATA:
- Bread type: ${data.breadType}
- Leavening: ${data.leavening}
- Proofing method: ${data.proofingMethod}
- Crust color: ${data.crustColor}
- Crust texture: ${data.crustTexture}
- Oven spring: ${data.ovenSpring}
- Scoring result: ${data.scoring}
- Crumb structure: ${data.crumbStructure}
- Crumb texture: ${data.crumbTexture}
- Flavor: ${data.flavor}
- Collapsed: ${data.collapsed}
- Baker's notes: ${data.notes || 'None'}

Pre-calculated scores: Exterior ${exteriorScore}/50, Interior ${interiorScore}/50, Total ${exteriorScore + interiorScore}/100

Return this exact JSON structure:
{
  "totalScore": ${exteriorScore + interiorScore},
  "exterior": {
    "score": ${exteriorScore},
    "feedback": "2-3 sentences of specific exterior feedback referencing what they described. Mention 1 glossary term like crust, maillard reaction, oven spring, ear, or scoring."
  },
  "interior": {
    "score": ${interiorScore},
    "feedback": "2-3 sentences of specific interior feedback referencing what they described. Mention 1 glossary term like crumb, bulk fermentation, overproofed, underproofed, or gummy crumb."
  },
  "fermentation": {
    "status": "under|perfect|over|unknown",
    "feedback": "1-2 sentences diagnosing fermentation based on the clues."
  },
  "topFixes": ["Fix #1 in 1 sentence", "Fix #2 in 1 sentence", "Fix #3 in 1 sentence"],
  "nextBakeTips": ["Tip #1 specific to their bake", "Tip #2 specific to their bake"],
  "encouragement": "One sentence in Henry Hunter's voice — warm, direct, no fluff."
}`;

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  const result = await response.json();
  const text = result.content?.map((b: { type: string; text?: string }) => b.type === 'text' ? b.text : '').join('') || '';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean) as AnalysisReport;
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-green-700';
  if (score >= 60) return 'text-amber-700';
  return 'text-red-600';
}

function scoreBg(score: number): string {
  if (score >= 80) return 'bg-green-50 border-green-200';
  if (score >= 60) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

function fermentationLabel(status: string): { label: string; color: string } {
  if (status === 'under') return { label: 'SLIGHTLY UNDER', color: 'text-blue-700 bg-blue-50 border-blue-200' };
  if (status === 'perfect') return { label: 'WELL FERMENTED', color: 'text-green-700 bg-green-50 border-green-200' };
  if (status === 'over') return { label: 'OVERPROOFED', color: 'text-red-700 bg-red-50 border-red-200' };
  return { label: 'HARD TO SAY', color: 'text-slate-600 bg-slate-50 border-slate-200' };
}

export default function BreadAnalyzer() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState('');

  const currentStep = STEPS[step];
  const isLastStep = step === STEPS.length - 1;
  const progress = (step / STEPS.length) * 100;

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const canAdvance = () => {
    return currentStep.fields
      .filter(f => f.type !== 'textarea')
      .every(f => form[f.key as keyof FormData] !== '');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const ext = scoreExterior(form);
      const int = scoreInterior(form);
      const result = await analyzeWithClaude(form, ext, int);
      setReport(result);
    } catch {
      setError('Something went wrong with the analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setReport(null);
    setStep(0);
    setError('');
  };

  if (report) {
    const ferm = fermentationLabel(report.fermentation.status);
    return (
      <div className="space-y-4">
        <div className={`rounded-xl border p-5 text-center ${scoreBg(report.totalScore)}`}>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Crust & Crumb Analysis</p>
          <div className={`text-6xl font-black mb-1 ${scoreColor(report.totalScore)}`}>{report.totalScore}</div>
          <p className="text-sm text-slate-500">out of 100</p>
          <div className="flex justify-center gap-6 mt-3 text-sm">
            <span className="text-slate-600">Exterior: <strong className={scoreColor(report.exterior.score)}>{report.exterior.score}/50</strong></span>
            <span className="text-slate-600">Interior: <strong className={scoreColor(report.interior.score)}>{report.interior.score}/50</strong></span>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 italic text-amber-900 text-sm">
          "{report.encouragement}"
          <p className="text-xs text-amber-600 mt-1 not-italic font-semibold">— Henry Hunter</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h4 className="font-bold text-slate-800 mb-1">Exterior Feedback</h4>
          <p className="text-sm text-slate-600">{report.exterior.feedback}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h4 className="font-bold text-slate-800 mb-1">Interior Feedback</h4>
          <p className="text-sm text-slate-600">{report.interior.feedback}</p>
        </div>
        <div className={`border rounded-xl p-4 ${ferm.color}`}>
          <p className="text-xs font-bold uppercase tracking-widest mb-1">Fermentation Diagnostic</p>
          <p className="font-bold text-sm mb-1">{ferm.label}</p>
          <p className="text-sm">{report.fermentation.feedback}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h4 className="font-bold text-slate-800 mb-2">Top Fixes for Next Bake</h4>
          <ul className="space-y-2">
            {report.topFixes.map((fix, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <span className="text-amber-600 font-bold shrink-0">{i + 1}.</span>{fix}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="font-bold text-amber-900 mb-2">Baker's Tips</h4>
          <ul className="space-y-1">
            {report.nextBakeTips.map((tip, i) => (
              <li key={i} className="text-sm text-amber-800 flex gap-2"><span className="shrink-0">✦</span>{tip}</li>
            ))}
          </ul>
        </div>
        <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 py-3 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
          <RotateCcw size={16} />Analyze Another Bake
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="bg-amber-100 p-2 rounded-lg">
          <Award size={22} className="text-amber-700" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-800">Bread Analyzer</h3>
          <p className="text-xs text-slate-500">Describe your bake. Get a scored report.</p>
        </div>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-xs text-slate-400 text-right -mt-2">Step {step + 1} of {STEPS.length}: {currentStep.title}</p>
      <div className="space-y-4">
        {currentStep.fields.map(field => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
            {field.type === 'select' && (
              <select value={form[field.key as keyof FormData]} onChange={e => handleChange(field.key, e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white">
                <option value="">Select one...</option>
                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}
            {field.type === 'textarea' && (
              <textarea value={form[field.key as keyof FormData]} onChange={e => handleChange(field.key, e.target.value)} placeholder={field.placeholder} rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none" />
            )}
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
      <div className="flex gap-3 pt-2">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1 px-4 py-2.5 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
            <ChevronLeft size={16} />Back
          </button>
        )}
        {!isLastStep ? (
          <button onClick={() => setStep(s => s + 1)} disabled={!canAdvance()} className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed">
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={loading} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors text-sm font-medium disabled:opacity-60">
            {loading ? <><Loader2 size={16} className="animate-spin" />Analyzing your bake...</> : <><ClipboardList size={16} />Get My Analysis</>}
          </button>
        )}
      </div>
    </div>
  );
}
