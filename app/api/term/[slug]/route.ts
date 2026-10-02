import { NextRequest, NextResponse } from 'next/server';
import { GLOSSARY_DATA, resolveSlugAlias } from '../../../../src/constants';
import { aliasSlug } from '../../../../src/search';
import { GlossaryItem } from '../../../../src/types';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow all origins (can be restricted to specific domains)
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight OPTIONS requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Helper to find term by slug
function getTermBySlug(slug: string): GlossaryItem | undefined {
  const direct = GLOSSARY_DATA.find(item =>
    item.id === slug || (item.aliases || []).some(alias => aliasSlug(alias) === slug)
  );
  if (direct) return direct;
  const aliasId = resolveSlugAlias(slug);
  return aliasId ? GLOSSARY_DATA.find(item => item.id === aliasId) : undefined;
}

// Helper to format related term IDs as slugs
function formatRelatedTerms(termIds?: string[]): string[] {
  if (!termIds) return [];
  // Filter to only include terms that exist
  return termIds.filter(id => GLOSSARY_DATA.some(item => item.id === id));
}

// Helper to format affiliate links
function formatAffiliateLinks(term: GlossaryItem): { name: string; url: string }[] {
  const links: { name: string; url: string }[] = [];

  // Add affiliateTools
  if (term.affiliateTools) {
    links.push(...term.affiliateTools);
  }

  // Add links that have URLs
  if (term.links) {
    for (const link of term.links) {
      if (link.url && !links.some(l => l.url === link.url)) {
        links.push({ name: link.label, url: link.url });
      }
    }
  }

  return links;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const term = getTermBySlug(slug);

  // Return 404 if term not found
  if (!term) {
    return NextResponse.json(
      {
        error: 'Term not found',
        message: `No glossary term found with slug: ${slug}`,
        availableTermsCount: GLOSSARY_DATA.length,
      },
      {
        status: 404,
        headers: corsHeaders,
      }
    );
  }

  // Format the response according to the specified structure
  const response = {
    name: term.term,
    slug: term.id,
    pronunciation: term.pronunciation || null,
    definition: term.definition,
    shortDefinition: term.shortDefinition || null,
    tips: term.henrysTips?.join('\n\n') || null,
    difficulty: term.difficulty,
    category: term.category,
    relatedTerms: formatRelatedTerms(term.relatedTermIds),
    affiliateLinks: formatAffiliateLinks(term),
    featuredInBook: Boolean(term.bookRef),
    // Additional useful fields
    commonMistakes: term.commonMistakes || [],
    history: term.history || null,
    sources: term.sources || [],
    references: term.references || [],
    whyItMatters: term.whyItMatters || null,
    practicalExample: term.practicalExample || null,
    sensoryCues: term.sensoryCues || null,
    nuance: term.nuance || null,
    contentCheckedOn: term.contentCheckedOn || null,
    youtubeQuery: term.youtubeQuery || null,
    aliases: term.aliases || [],
    sourceRelations: (term.sourceRelations || []).map(({ sourceSystem, relation, title, url }) => ({ sourceSystem, relation, title, url })),
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
