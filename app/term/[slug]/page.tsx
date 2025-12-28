import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GLOSSARY_DATA } from '../../../src/constants';
import { GlossaryItem } from '../../../src/types';
import { ArrowLeft, BookOpen, Lightbulb, ExternalLink, Tag, BarChart, Volume2 } from 'lucide-react';

// Helper functions
function getTermBySlug(slug: string): GlossaryItem | undefined {
  return GLOSSARY_DATA.find(item => item.id === slug);
}

function getAllSlugs(): string[] {
  return GLOSSARY_DATA.map(item => item.id);
}

function getRelatedTerms(termIds: string[]): GlossaryItem[] {
  return termIds
    .map(id => GLOSSARY_DATA.find(item => item.id === id))
    .filter((item): item is GlossaryItem => item !== undefined);
}

function getCategoryColor(category: string): string {
  const catLower = category.toLowerCase();
  if (catLower === 'ingredient') return 'bg-amber-100 text-amber-800';
  if (catLower === 'tool') return 'bg-slate-100 text-slate-800';
  if (catLower === 'technique') return 'bg-blue-100 text-blue-800';
  if (catLower === 'process') return 'bg-purple-100 text-purple-800';
  if (catLower === 'bread' || catLower === 'bread_type') return 'bg-orange-100 text-orange-800';
  if (catLower === 'pizza') return 'bg-rose-100 text-rose-800';
  if (catLower === 'schedule') return 'bg-teal-100 text-teal-800';
  if (catLower === 'scientific/technical' || catLower === 'scientific') return 'bg-indigo-100 text-indigo-800';
  return 'bg-gray-100 text-gray-800';
}

function getDifficultyColor(difficulty: string): string {
  const diff = difficulty.toLowerCase();
  if (diff === 'beginner') return 'border-green-400 text-green-700 bg-green-50';
  if (diff === 'intermediate') return 'border-yellow-400 text-yellow-700 bg-yellow-50';
  if (diff === 'advanced') return 'border-red-400 text-red-700 bg-red-50';
  return 'border-gray-400 text-gray-700 bg-gray-50';
}

// Generate static params for all terms
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const term = getTermBySlug(slug);

  if (!term) {
    return {
      title: 'Term Not Found - Crust and Crumb',
      description: 'The requested bread baking term could not be found.',
    };
  }

  const description = term.shortDefinition || term.definition.substring(0, 160);

  return {
    title: `${term.term} - Bread Baking Glossary | Crust and Crumb`,
    description: `${term.term}: ${description}`,
    keywords: `${term.term}, bread baking, ${term.category}, baking glossary, Henry Hunter`,
    authors: [{ name: 'Henry Hunter' }],
    openGraph: {
      title: `${term.term} - Bread Baking Term`,
      description: description,
      type: 'article',
      siteName: 'Crust and Crumb',
      locale: 'en_US',
      images: [
        {
          url: 'https://crust-and-crumb-tawny.vercel.app/Thumbnail.jpg',
          width: 1200,
          height: 630,
          alt: `${term.term} - Crust and Crumb Glossary`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${term.term} - Bread Baking Term`,
      description: description,
      creator: '@bakinggreatbread',
      images: ['https://crust-and-crumb-tawny.vercel.app/Thumbnail.jpg'],
    },
  };
}

export default async function TermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = getTermBySlug(slug);

  if (!term) {
    notFound();
  }

  const relatedTerms = term.relatedTermIds ? getRelatedTerms(term.relatedTermIds) : [];

  // Get affiliate links - combine affiliateTools with links that have URLs
  const affiliateLinks = [
    ...(term.affiliateTools || []),
    ...(term.links?.filter(link => link.url) || []).map(link => ({
      name: link.label,
      url: link.url
    }))
  ];

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-amber-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Back to Glossary
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
          {/* Term Header */}
          <div className="p-8 border-b border-amber-100">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className={`text-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${getCategoryColor(term.category)}`}>
                {term.category}
              </span>
              <span className={`text-sm font-medium px-3 py-1 border rounded-full ${getDifficultyColor(term.difficulty)}`}>
                {term.difficulty}
              </span>
              {term.bookRef && (
                <span className="text-sm font-medium px-3 py-1 bg-amber-100 text-amber-800 rounded-full flex items-center gap-1">
                  <BookOpen size={14} />
                  Featured in Book
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              {term.term}
            </h1>

            {term.pronunciation && (
              <p className="text-lg text-slate-500 flex items-center gap-2">
                <Volume2 size={18} className="text-amber-600" />
                <span className="font-mono">{term.pronunciation}</span>
              </p>
            )}
          </div>

          {/* Definition */}
          <div className="p-8 border-b border-amber-100">
            <h2 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Tag size={18} className="text-amber-600" />
              Definition
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              {term.definition}
            </p>
          </div>

          {/* Henry's Tips */}
          {term.henrysTips && term.henrysTips.length > 0 && (
            <div className="p-8 border-b border-amber-100 bg-amber-50/50">
              <h2 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
                <Lightbulb size={18} className="text-amber-600" />
                Henry&apos;s Tips
              </h2>
              <ul className="space-y-3">
                {term.henrysTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-700">
                    <span className="text-amber-500 mt-1.5">•</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Common Mistakes */}
          {term.commonMistakes && term.commonMistakes.length > 0 && (
            <div className="p-8 border-b border-amber-100">
              <h2 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                <span className="text-red-500">⚠️</span>
                Common Mistakes
              </h2>
              <ul className="space-y-3">
                {term.commonMistakes.map((mistake, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-700">
                    <span className="text-red-400 mt-1.5">•</span>
                    <span className="leading-relaxed">{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* History */}
          {term.history && (
            <div className="p-8 border-b border-amber-100">
              <h2 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span className="text-slate-500">📜</span>
                History
              </h2>
              <p className="text-slate-700 leading-relaxed">
                {term.history}
              </p>
            </div>
          )}

          {/* Related Terms */}
          {relatedTerms.length > 0 && (
            <div className="p-8 border-b border-amber-100">
              <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <span className="text-blue-500">🔗</span>
                Related Terms
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedTerms.map((related) => (
                  <Link
                    key={related.id}
                    href={`/term/${related.id}`}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors font-medium text-sm"
                  >
                    {related.term}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Affiliate Links / Recommended Tools */}
          {affiliateLinks.length > 0 && (
            <div className="p-8 border-b border-amber-100 bg-green-50/50">
              <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <span className="text-green-600">🛒</span>
                Recommended Tools
              </h2>
              <div className="flex flex-wrap gap-3">
                {affiliateLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-green-200 rounded-lg text-green-700 hover:bg-green-100 hover:border-green-300 transition-colors font-medium text-sm shadow-sm"
                    data-affiliate-link={link.name}
                  >
                    {link.name}
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Sources */}
          {term.sources && term.sources.length > 0 && (
            <div className="p-8 bg-slate-50">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Sources
              </h2>
              <ul className="flex flex-wrap gap-2">
                {term.sources.map((source, index) => (
                  <li key={index} className="text-sm text-slate-600 px-3 py-1 bg-white rounded-full border border-slate-200">
                    {source}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>

        {/* Additional Info Card */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm mb-4">
            Learn more about bread baking with{' '}
            <a
              href="https://sourdough-simplified-gift.lovable.app/sourdough-for-the-rest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 hover:text-amber-900 font-medium underline"
            >
              &quot;Sourdough for the Rest of Us&quot;
            </a>
            {' '}by Henry Hunter
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold shadow-md"
          >
            <ArrowLeft size={18} />
            Explore All 132 Terms
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-amber-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>
            <a href="/" className="text-amber-700 hover:text-amber-900 font-medium">
              Crust and Crumb
            </a>
            {' '}• Interactive Bread Baking Glossary
          </p>
        </div>
      </footer>
    </div>
  );
}
