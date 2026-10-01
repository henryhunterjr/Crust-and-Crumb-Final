import { Metadata } from 'next'
import GlossaryApp from './GlossaryApp'
import { GLOSSARY_DATA as glossaryData } from '@/src/constants'
import { SITE_URL, SITE_NAME, PUBLISHER_NAME, AUTHOR_NAME, OG_IMAGE, SAME_AS, jsonLd } from '@/src/seo'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const homeJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'Crust and Crumb Bread Baking Glossary',
    url: SITE_URL,
    inLanguage: 'en-US',
    publisher: { '@type': 'Organization', name: PUBLISHER_NAME, url: 'https://www.bakinggreatbread.blog', sameAs: SAME_AS },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${SITE_URL}/#glossary`,
    name: 'Crust & Crumb Interactive Bread Baking Glossary',
    description: `${glossaryData.length} bread baking and sourdough terms with clear definitions, real examples, and tips from baker Henry Hunter.`,
    url: SITE_URL,
    image: `${SITE_URL}${OG_IMAGE.url}`,
    inLanguage: 'en-US',
    author: { '@type': 'Person', name: AUTHOR_NAME, sameAs: SAME_AS },
    hasDefinedTerm: glossaryData.map((item) => ({
      '@type': 'DefinedTerm',
      name: item.term,
      url: `${SITE_URL}/term/${item.id}`,
    })),
  },
]

// Server component that renders SEO-friendly content
export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(homeJsonLd) }} />
      {/* Interactive client app */}
      <GlossaryApp />
    </>
  )
}
