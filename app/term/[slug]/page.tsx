import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import { GLOSSARY_DATA, LEARNING_PATHS, resolveSlugAlias } from '../../../src/constants';
import { GlossaryItem } from '../../../src/types';
import PronunciationButton from '../../../src/components/PronunciationButton';
import { ArrowLeft, BookOpen, Lightbulb, ExternalLink, Volume2, ChevronDown, AlertTriangle } from 'lucide-react';

// Helper functions
function getTermBySlug(slug: string): GlossaryItem | undefined {
  const direct = GLOSSARY_DATA.find(item =>
    item.id === slug || (item.aliases || []).some(alias => alias.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug)
  );
  if (direct) return direct;
  const aliasId = resolveSlugAlias(slug);
  return aliasId ? GLOSSARY_DATA.find(item => item.id === aliasId) : undefined;
}

function getAllSlugs(): string[] {
  return GLOSSARY_DATA.flatMap(item => [
    item.id,
    ...(item.aliases || []).map(alias => alias.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
  ]).filter((slug, index, slugs) => slugs.indexOf(slug) === index);
}

function getRelatedTerms(termIds: string[]): GlossaryItem[] {
  return termIds
    .map(id => GLOSSARY_DATA.find(item => item.id === id))
    .filter((item): item is GlossaryItem => item !== undefined);
}


function getDifficultyColor(difficulty: string): string {
  const diff = difficulty.toLowerCase();
  if (diff === 'beginner') return 'bg-[rgba(181,212,106,0.12)] text-[#d6ebaa] border-[rgba(181,212,106,0.4)]';
  if (diff === 'intermediate') return 'bg-[rgba(240,200,120,0.12)] text-[#ffe2a8] border-[rgba(240,200,120,0.4)]';
  if (diff === 'advanced') return 'bg-[rgba(255,138,110,0.12)] text-[#ffc2b2] border-[rgba(255,138,110,0.4)]';
  return 'bg-white/10 text-[#f6ecdc] border-white/20';
}

const CATEGORY_DOTS: Record<string, string> = {
  ingredient: '#e8b25c', tool: '#9db4d9', technique: '#7cc4f2', process: '#b9a3f0', bread: '#f09a63',
  pizza: '#f08c9b', 'scientific/technical': '#8e9bf5', troubleshooting: '#ff7a6b', 'grain & milling': '#b5d46a',
  business: '#7fd1a8', practical: '#6fd0d8', schedule: '#6fd0d8',
};

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

  // Pantry and legacy alias slugs redirect to the canonical term URL
  if (resolveSlugAlias(slug) === term.id && term.id !== slug) {
    permanentRedirect(`/term/${term.id}`);
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

  // Guided path context (prev / next) when this term sits on a path
  const path = LEARNING_PATHS.find(p => p.termIds.includes(term.id));
  const pathIndex = path ? path.termIds.indexOf(term.id) : -1;
  const prevId = path && pathIndex > 0 ? path.termIds[pathIndex - 1] : undefined;
  const nextId = path && pathIndex < path.termIds.length - 1 ? path.termIds[pathIndex + 1] : undefined;
  const termName = (id?: string) => (id ? GLOSSARY_DATA.find(item => item.id === id)?.term || id : '');
  const dot = CATEGORY_DOTS[term.category.toLowerCase()] || '#f0c878';

  return (
    <div className="min-h-screen text-[#f6ecdc]">
      <header className="sticky top-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4">
        <div className="glass-strong sheen max-w-6xl mx-auto rounded-full pl-2 pr-2 sm:pl-3 py-2 flex items-center justify-between gap-3" style={{ background: 'rgba(30, 23, 15, 0.62)' }}>
          <Link href="/" className="flex items-center gap-3 rounded-full pr-2 min-w-0">
            <img src="/brand/academy.png" alt="Crust & Crumb Academy" width="1280" height="720" className="w-11 h-11 rounded-full object-cover ring-1 ring-white/25 shrink-0" />
            <span className="font-display text-[18px] sm:text-[20px] font-semibold text-[#fff8ec] truncate">Crust &amp; Crumb</span>
          </Link>
          <Link href="/#dictionary" className="btn-gold inline-flex items-center gap-2 h-11 px-5 rounded-full font-bold text-sm shrink-0">
            <ArrowLeft size={17} />
            <span className="sm:hidden">All terms</span>
            <span className="hidden sm:inline">All {GLOSSARY_DATA.length} terms</span>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[rgba(246,236,220,0.7)] mb-6">
          <Link href="/" className="hover:text-[#f0c878]">Glossary</Link>
          <span aria-hidden="true">/</span>
          <span>{term.category}</span>
          <span aria-hidden="true">/</span>
          <span className="text-[#fff8ec]">{term.term}</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] items-start">
          <article className="glass-strong sheen rounded-[34px] p-6 sm:p-10 lg:p-12 flex flex-col gap-8">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 h-8 px-3 rounded-full border border-white/20 bg-white/[0.07] text-[12px] font-bold uppercase tracking-[0.12em] text-[rgba(246,236,220,0.9)]">
                <span className="w-2 h-2 rounded-full" style={{ background: dot, boxShadow: `0 0 10px ${dot}` }} aria-hidden="true" />
                {term.category}
              </span>
              <span className={`inline-flex items-center h-8 px-3 border rounded-full text-[13px] font-semibold ${getDifficultyColor(term.difficulty)}`}>
                {term.difficulty}
              </span>
              {term.bookRef && (
                <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[13px] font-semibold bg-[rgba(240,200,120,0.14)] text-[#ffe2a8] border border-[rgba(240,200,120,0.45)]">
                  <BookOpen size={14} />
                  Featured in the book
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="font-display font-medium text-[46px] sm:text-[64px] lg:text-[76px] leading-[1] tracking-[-0.035em] text-[#fff8ec]">
                {term.term}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                {term.pronunciation && (
                  <p className="text-lg text-[#f0c878] flex items-center gap-2 font-display italic">
                    <Volume2 size={18} aria-hidden="true" />
                    {term.pronunciation}
                  </p>
                )}
                <PronunciationButton termId={term.id} term={term.term} />
              </div>
              {term.shortDefinition && (
                <p className="font-display italic text-[22px] sm:text-[24px] leading-snug text-[#f0c878]">{term.shortDefinition}</p>
              )}
            </div>

            <p className="text-[19px] sm:text-[20px] leading-[1.65] text-[rgba(246,236,220,0.9)]">
              {term.definition}
            </p>

            {term.henrysTips && term.henrysTips.length > 0 && (
              <section className="flex gap-4 sm:gap-5 rounded-[26px] p-5 sm:p-6 bg-[rgba(240,200,120,0.1)] border border-[rgba(240,200,120,0.32)] shadow-[inset_0_1px_0_rgba(255,236,190,0.22)]" aria-labelledby="tips-h">
                <img src="/brand/academy.png" alt="" width="1280" height="720" className="w-12 h-12 rounded-full object-cover shrink-0 hidden sm:block" />
                <div className="flex flex-col gap-3">
                  <h2 id="tips-h" className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#f0c878]">
                    <Lightbulb size={16} aria-hidden="true" />
                    Henry&apos;s notes from the bench
                  </h2>
                  <ul className="space-y-3 text-[17px] leading-relaxed text-[#fff3df]">
                    {term.henrysTips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {term.troubleshooting && term.troubleshooting.length > 0 && (
              <section className="flex flex-col gap-3" aria-labelledby="fix-h">
                <h2 id="fix-h" className="font-display font-medium text-[28px] sm:text-[32px] tracking-[-0.02em] text-[#fff8ec]">Diagnose and fix</h2>
                {term.troubleshooting.map((ts, index) => (
                  <details key={index} className="glass rounded-[22px] px-5 group" open={index === 0}>
                    <summary className="flex items-center justify-between gap-3 min-h-[60px] cursor-pointer list-none text-[17px] font-semibold text-[#fff8ec]">
                      {ts.problem}
                      <ChevronDown size={20} className="text-[#f0c878] shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="pb-5 text-[16px] leading-relaxed text-[rgba(246,236,220,0.85)]">{ts.solution}</p>
                  </details>
                ))}
              </section>
            )}

            {term.commonMistakes && term.commonMistakes.length > 0 && (
              <section className="rounded-[24px] p-5 sm:p-6 bg-[rgba(255,122,107,0.08)] border border-[rgba(255,122,107,0.3)]" aria-labelledby="mistakes-h">
                <h2 id="mistakes-h" className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#ffb2a8] mb-3">
                  <AlertTriangle size={16} aria-hidden="true" />
                  Common mistakes
                </h2>
                <ul className="space-y-2 text-[16px] leading-relaxed text-[rgba(246,236,220,0.88)] list-disc pl-5">
                  {term.commonMistakes.map((mistake, index) => (
                    <li key={index}>{mistake}</li>
                  ))}
                </ul>
              </section>
            )}

            {term.history && (
              <section aria-labelledby="history-h">
                <h2 id="history-h" className="font-display font-medium text-[24px] text-[#fff8ec] mb-2">History</h2>
                <p className="text-[17px] leading-relaxed text-[rgba(246,236,220,0.85)]">{term.history}</p>
              </section>
            )}

            {relatedTerms.length > 0 && (
              <section aria-labelledby="related-h" className="flex flex-col gap-3">
                <h2 id="related-h" className="font-display font-medium text-[28px] sm:text-[32px] tracking-[-0.02em] text-[#fff8ec]">Connected terms</h2>
                <div className="flex flex-wrap gap-2">
                  {relatedTerms.map((related) => {
                    const rdot = CATEGORY_DOTS[related.category.toLowerCase()] || '#f0c878';
                    return (
                      <Link key={related.id} href={`/term/${related.id}`} className="btn-glass inline-flex items-center gap-2 h-11 px-4 rounded-full text-[15px] font-semibold">
                        <span className="w-2 h-2 rounded-full" style={{ background: rdot }} aria-hidden="true" />
                        {related.term}
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {term.sourceRelations && term.sourceRelations.length > 0 && (
              <section aria-labelledby="deeper-h" className="flex flex-col gap-3">
                <h2 id="deeper-h" className="font-display font-medium text-[28px] sm:text-[32px] tracking-[-0.02em] text-[#fff8ec]">Go deeper</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {term.sourceRelations.map((resource, index) => (
                    <div key={`${resource.sourceSystem}-${resource.title}-${index}`} className="glass rounded-[20px] p-4">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#f0c878]">{resource.sourceSystem}</span>
                        {resource.status && <span className="text-[11px] text-[rgba(246,236,220,0.55)]">{resource.status}</span>}
                      </div>
                      {resource.url ? (
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#fff8ec] hover:text-[#f0c878] hover:underline">
                          {resource.title}
                        </a>
                      ) : (
                        <span className="font-semibold text-[#fff8ec]">{resource.title}</span>
                      )}
                      <p className="text-xs text-[rgba(246,236,220,0.55)] mt-1">{resource.relation.replaceAll('-', ' ')}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {affiliateLinks.length > 0 && (
              <section aria-labelledby="tools-h" className="flex flex-col gap-3">
                <h2 id="tools-h" className="font-display font-medium text-[24px] text-[#fff8ec]">Recommended tools</h2>
                <div className="flex flex-wrap gap-2">
                  {affiliateLinks.map((link, index) => (
                    <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="btn-glass inline-flex items-center gap-2 h-11 px-4 rounded-full text-sm font-semibold" data-affiliate-link={link.name}>
                      {link.name}
                      <ExternalLink size={14} className="text-[#f0c878]" />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {term.sources && term.sources.length > 0 && (
              <section aria-labelledby="sources-h">
                <h2 id="sources-h" className="text-[12px] font-bold uppercase tracking-[0.14em] text-[rgba(246,236,220,0.55)] mb-3">Sources</h2>
                <ul className="flex flex-wrap gap-2">
                  {term.sources.map((source, index) => (
                    <li key={index} className="text-sm text-[rgba(246,236,220,0.82)] px-3 py-1 rounded-full bg-white/[0.07] border border-white/15">
                      {source}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-28">
            {path && (
              <div className="glass sheen rounded-[28px] p-6 flex flex-col gap-4">
                <span className="eyebrow">{path.title} path</span>
                <span className="font-display text-[24px] font-medium text-[#fff8ec]">Term {pathIndex + 1} of {path.termIds.length}</span>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden" aria-hidden="true">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#f4d08a] to-[#d9a54c]" style={{ width: `${Math.round(((pathIndex + 1) / path.termIds.length) * 100)}%` }} />
                </div>
                <div className="flex gap-2">
                  {prevId && (
                    <Link href={`/term/${prevId}`} className="btn-glass flex-1 min-h-[48px] px-3 rounded-2xl flex items-center justify-center text-center text-sm font-semibold">{termName(prevId)}</Link>
                  )}
                  {nextId && (
                    <Link href={`/term/${nextId}`} className="btn-gold flex-1 min-h-[48px] px-3 rounded-2xl flex items-center justify-center text-center text-sm font-bold">Next: {termName(nextId)}</Link>
                  )}
                </div>
              </div>
            )}
            <div className="glass sheen rounded-[28px] p-6 flex flex-col gap-3">
              <span className="eyebrow">Bake in front of you?</span>
              <p className="text-[16px] leading-relaxed text-[rgba(246,236,220,0.86)]">Post your loaf in Crust &amp; Crumb Academy. Henry or someone in the community will look at it with you, personally.</p>
              <a href="https://www.skool.com/crust-crumb-academy-7621" target="_blank" rel="noopener noreferrer" className="btn-gold min-h-[48px] rounded-2xl flex items-center justify-center font-bold text-sm">Share your bake</a>
            </div>
            <div className="glass sheen rounded-[28px] p-6 flex flex-col gap-3">
              <span className="eyebrow">Put it into practice</span>
              <p className="text-[16px] leading-relaxed text-[rgba(246,236,220,0.86)]">Practice it in a real bake from Recipe Pantry, or go deeper in <em>Sourdough for the Rest of Us</em>.</p>
              <div className="flex flex-col gap-2">
                <a href="https://pantry.bakinggreatbread.com/?utm_source=glossary&utm_medium=referral&utm_campaign=term-page" target="_blank" rel="noopener noreferrer" className="btn-glass min-h-[46px] rounded-2xl flex items-center justify-center font-semibold text-sm">Recipe Pantry</a>
                <a href="https://sourdough-simplified-gift.lovable.app/sourdough-for-the-rest" target="_blank" rel="noopener noreferrer" className="btn-glass min-h-[46px] rounded-2xl flex items-center justify-center font-semibold text-sm">The book</a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="px-4 sm:px-6 pb-8">
        <div className="glass max-w-6xl mx-auto rounded-[26px] px-6 py-5 flex flex-wrap items-center justify-between gap-3 text-sm text-[rgba(246,236,220,0.7)]">
          <span>© {new Date().getFullYear()} Baking Great Bread at Home by Henry Hunter</span>
          <Link href="/" className="font-semibold text-[#f0c878] hover:underline">Crust &amp; Crumb glossary</Link>
        </div>
      </footer>
    </div>
  );
}
