import type { GlossaryItem } from '../types';

export default function TermEvidence({ term }: { term: GlossaryItem }) {
  const sections = [
    ['Why it matters', term.whyItMatters], ['In practice', term.practicalExample],
    ["What you'll see or feel", term.sensoryCues], ['A useful distinction', term.nuance],
  ];
  return <>
    {sections.filter(([, text]) => text).map(([heading, text]) => <section key={heading} className="mb-5">
      <h2 className="font-display text-2xl text-[#fff8ec] mb-2">{heading}</h2>
      <p className="leading-relaxed text-[rgba(246,236,220,0.88)]">{text}</p>
    </section>)}
    {term.nextResource && <section className="glass rounded-2xl p-5 mb-5">
      <h2 className="font-display text-2xl mb-2">Put it into practice</h2>
      <a href={term.nextResource.url} className="text-[#f0c878] underline">{term.nextResource.label}</a>
    </section>}
    {term.references?.length ? <section className="mb-5" aria-label="References for this entry">
      <h2 className="font-display text-2xl text-[#fff8ec] mb-3">References for this entry</h2>
      <ul className="space-y-3">{term.references.map(ref => <li key={ref.url}>
        <a href={ref.url} className="text-[#f0c878] underline">{ref.title}</a>
        <p className="text-sm leading-relaxed">{ref.publisher}{ref.author ? ` · ${ref.author}` : ''}. Supports: {ref.supports}</p>
      </li>)}</ul>
      {term.contentCheckedOn && <p className="text-sm mt-4">Sources checked {term.contentCheckedOn} with AI assistance. This is not a claim of independent expert or Henry review.</p>}
    </section> : null}
  </>;
}
