import { Metadata } from 'next'
import GlossaryApp from './GlossaryApp'
import glossaryData from '@/src/data/glossary.json'

const termCount = glossaryData.length

export const metadata: Metadata = {
  title: "The Bread Baker's Glossary: 132+ Terms, Techniques & Tools",
  description: `Explore ${termCount}+ bread baking terms with clear definitions, techniques, tools, sourdough guidance, baker's science, expert tips and an interactive baker's percentage calculator.`,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "The Bread Baker's Glossary: 132+ Terms & Growing",
    description: "An extensive bread baking reference for sourdough, fermentation, flour, tools, techniques and baker's science, built by Crust & Crumb Academy.",
    url: '/',
    siteName: 'Crust & Crumb Academy',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/glossary-social-image',
        width: 1200,
        height: 630,
        alt: "The Bread Baker's Glossary, 132 terms and growing, from Crust & Crumb Academy",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "The Bread Baker's Glossary: 132+ Terms & Growing",
    description: "Bread baking definitions, techniques, tools, sourdough guidance, baker's science and expert tips in one growing reference.",
    creator: '@bakinggreatbread',
    images: ['/glossary-social-image'],
  },
}

// Server component that renders SEO-friendly content
export default function Home() {
  return (
    <>
      {/* Hidden SEO content - visible to crawlers but not displayed */}
      <div className="sr-only" aria-hidden="true">
        <h1>Crust and Crumb - Interactive Bread Baking Glossary</h1>
        <p>
          The official companion to &quot;Sourdough for the Rest of Us&quot; by Henry Hunter.
          A comprehensive glossary with {glossaryData.length} bread baking definitions,
          techniques, and expert tips.
        </p>
        <h2>Glossary Terms</h2>
        <ul>
          {glossaryData.map((item: any) => (
            <li key={item.id}>
              <h3>{item.term}</h3>
              <p>Category: {item.category}</p>
              <p>Difficulty: {item.difficulty}</p>
              <p>{item.definition}</p>
              {item.henrysTips && item.henrysTips.length > 0 && (
                <p>Tips: {item.henrysTips.join('; ')}</p>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Interactive client app */}
      <GlossaryApp />
    </>
  )
}

