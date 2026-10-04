import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GLOSSARY_DATA } from '@/src/constants';

const pages: Record<string, { title: string; paragraphs: string[] }> = {
  'editorial-standards': { title: 'Editorial standards', paragraphs: [
    'Crust & Crumb is Henry Hunter’s bread glossary for home bakers. Definitions come first; practical explanations should help you decide what to do with the dough in front of you.',
    'Technical claims need references that support the specific claim. A publisher name in an older entry is a source label, not a verified citation. Regional terms and flour behavior need context rather than universal rules.',
    'This glossary receives AI-assisted editing. A source-check date records that the listed references were checked for that entry. It does not mean Henry tested that example or an independent scientist reviewed it. Examples added with AI assistance are labeled through the entry’s source-check note.',
    'Report a correction from the relevant term page, including what needs changing and a supporting source. This opens the glossary correction inbox at Baking Great Bread at Home; no message is sent automatically. Henry Hunter owns this inbox. Every correction receives a reply within 7 days, even if the review itself takes longer. Unresolved drafts remain outside the public catalog.',
    'Some equipment and partner links are affiliate links. Henry may earn a commission from qualifying purchases. They are separate from technical references and do not establish the accuracy of a definition.',
  ] },
  methodology: { title: 'How this glossary is built', paragraphs: [
    'The library preserves stable term IDs and individual /term/ URLs. Alternate labels should resolve to a canonical entry; related but different ideas receive separate explanations.',
    'Search matches names, aliases, definitions, keywords, and categories. It ignores case, accents, apostrophes, and hyphens. Exact names and aliases rank first. Filters combine across search, category, level, path, symptom, and starting letter. Learning paths keep their teaching order when no search is applied.',
    'The first view shows 36 cards to keep lookup lighter. Show more reveals the next group, and the complete A–Z link index remains available below the results. Downloads contain every matching term, including terms beyond the visible cards.',
    'Technical improvements are released in batches. The October 2, 2026 batch checked sources and expanded three core entries, with targeted corrections in two more. The remaining catalog has not received a complete scientific or cultural review. A larger term count is not a quality score.',
    'Search and filter state stays in the page URL, with the most recent view saved in this tab’s session storage for the back link. Search questions are not submitted to an editorial queue by this feature. Sending an Ask Krusty question contacts a separate AI service; avoid personal information.',
  ] },
  sources: { title: 'Sources and references', paragraphs: [
    'The linked references below support the entries that explicitly cite them. Each entry identifies the claim or section supported. This bibliography does not certify every definition in the back catalog.',
    'Henry’s articles, videos, and recipes are learning resources. Older publisher labels and inventory-derived related resources are separate from claim-specific references. Source checks do not imply endorsement by the named publishers.',
  ] },
  updates: { title: 'Glossary updates', paragraphs: [
    'October 4, 2026: added Maceration to the public bread-baking lexicon and added real reference photos for Ascorbic Acid and Baker’s Couche. The public glossary now contains 280 terms.',
    'October 2, 2026: related-term link audit passed across all 279 public entries. No entry links to itself, and no related-term ID points to a missing public term.',
    'October 2, 2026: crawl baseline passed. The sitemap lists all 279 canonical term pages; robots.txt points to the sitemap; term pages are indexable and render unique term titles/descriptions plus WebPage and DefinedTerm structured data. Google Search Console indexing confirmation is still pending.',
    'October 2, 2026: removed the NEW badge from Bread Analyzer while AI bake analysis is paused; the troubleshooting guides remain available and the pause stays documented here until analysis returns.',
    'October 2, 2026: launched Starter & Levain Studio as the first featured Baker’s Tool and connected relevant starter, levain, fermentation, yeast, milling, hydration, and baker’s-percentage entries to the tools that help put those definitions into practice.',
    'October 2, 2026: formalized the glossary correction inbox under Henry Hunter. Every correction receives a reply within 7 days, with the term URL and supporting reference requested in the message.',
    'October 2, 2026: began the credibility and ranking review. No competitive rank claim will be published until the crawl/index audit, target-search tracking method, and reproducible competitor benchmark are complete.',
    'October 2, 2026: repaired normalized search and relevance ordering; added shareable filter state and a return link; made related-term navigation ordinary links; and fixed alphabet availability within filtered views.',
    'October 2, 2026: added editorial standards, methodology, references, and this update log. Expanded Bulk Fermentation, Fresh-Milled Flour, and Underproofed; corrected Whole Wheat Flour and Ash Content; added a term-specific correction email link.',
    'October 2, 2026: deduplicated the public resource library, kept private drafts and internal plans outside browser data, introduced smaller card batches, and changed decorative wheat motion to play on request. Existing grain photos and click-to-play teaching videos are retained.',
    'The roadmap still includes wider technical and cultural source review, more reviewed learning paths and demonstrations, and a reproducible competitor benchmark. No exact competitive rank is claimed.',
    'October 2, 2026: pronunciation audio checked successfully. AI conversation currently falls back to matching glossary entries when the connected AI service is unavailable. AI bake analysis is temporarily paused; troubleshooting guides remain available.',
  ] },
};

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(pages).map(info => ({ info })); }
export async function generateMetadata({ params }: { params: Promise<{ info: string }> }): Promise<Metadata> {
  const { info } = await params;
  const page = pages[info];
  return page ? { title: page.title, description: page.paragraphs[0], alternates: { canonical: `/${info}` } } : {};
}
export default async function InformationPage({ params }: { params: Promise<{ info: string }> }) {
  const { info } = await params;
  const page = pages[info];
  if (!page) notFound();
  const references = [...new Map(GLOSSARY_DATA.flatMap(term => term.references || []).map(ref => [ref.url, ref])).values()];
  return <main className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
    <Link href="/" className="text-[#f0c878] underline min-h-11 inline-flex items-center">Back to glossary</Link>
    <article className="glass-strong rounded-[28px] p-6 sm:p-10 mt-5">
      <h1 className="font-display text-4xl sm:text-5xl mb-8">{page.title}</h1>
      <div className="space-y-5 leading-relaxed text-lg">{page.paragraphs.map(text => <p key={text}>{text}</p>)}</div>
      {info === 'sources' && <ul className="space-y-5 mt-8">{references.map(ref => <li key={ref.url}>
        <a href={ref.url} className="text-[#f0c878] underline">{ref.title}</a><p>{ref.publisher}</p>
        <p className="text-sm">{ref.supports}</p>
      </li>)}</ul>}
      <a href="mailto:bakinggreatbreadathome@gmail.com?subject=Glossary%20editorial%20correction" className="text-[#f0c878] underline inline-flex min-h-11 items-center mt-6">Contact us about a correction</a>
    </article>
    <nav aria-label="About this glossary" className="flex flex-wrap gap-5 mt-8">{Object.entries(pages).map(([slug, value]) => <Link key={slug} href={`/${slug}`} className="text-[#f0c878] underline min-h-11 inline-flex items-center">{value.title}</Link>)}</nav>
  </main>;
}
