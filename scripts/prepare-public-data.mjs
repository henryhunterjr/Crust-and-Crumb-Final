import fs from 'node:fs';
const terms = JSON.parse(fs.readFileSync('src/data/glossary.json', 'utf8'));
const published = terms.filter(term => term.definitionStatus !== 'editorial-draft');
const ids = new Set();
for (const term of published) {
  if (!term.id || !term.term || !term.definition || !term.category || !['Beginner', 'Intermediate', 'Advanced'].includes(term.difficulty)) throw new Error(`Invalid published term: ${term.id}`);
  if (ids.has(term.id)) throw new Error(`Duplicate term id: ${term.id}`);
  ids.add(term.id);
}
const cleanTitle = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const publicTerms = published.map(({ clusterPlan, ...term }) => {
  for (const id of term.relatedTermIds || []) if (!ids.has(id)) throw new Error(`${term.id} points to unpublished/missing ${id}`);
  if (term.contentCheckedOn && !/^\d{4}-\d{2}-\d{2}$/.test(term.contentCheckedOn)) throw new Error(`Invalid date: ${term.id}`);
  const seenUrls = new Set(), seenTitles = new Set();
  const sourceRelations = (term.sourceRelations || []).filter(source => {
    if (!source.url || /draft|private|pending|unpublished/i.test(source.status || '') || /[?&]p=\d+/.test(source.url)) return false;
    const url = new URL(source.url);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error(`Invalid resource: ${term.id}`);
    const key = url.origin + url.pathname.replace(/\/$/, '') + url.search;
    const title = source.sourceSystem + ':' + cleanTitle(source.title);
    if (seenUrls.has(key) || seenTitles.has(title)) return false;
    seenUrls.add(key); seenTitles.add(title); return true;
  }).map(({ sourceSystem, relation, title, url, evidence }) => ({ sourceSystem, relation, title, url, evidence }));
  return { ...term, sourceRelations };
});
fs.writeFileSync('src/data/public-glossary.json', JSON.stringify(publicTerms));
console.log(`Public catalog prepared: ${terms.length} records, ${published.length} published, ${terms.length - published.length} drafts withheld.`);
