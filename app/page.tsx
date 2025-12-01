import { Metadata } from 'next'
import GlossaryApp from './GlossaryApp'
import glossaryData from '@/src/data/glossary.json'

// Generate metadata with actual glossary content for SEO
export const metadata: Metadata = {
  title: 'Crust and Crumb - Interactive Bread Baking Glossary',
  description: `Interactive bread baking glossary with ${glossaryData.length} definitions, baker's percentage calculator & expert tips. Companion to 'Sourdough for the Rest of Us' by Henry Hunter.`,
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
