import fs from 'node:fs';
import cp from 'node:child_process';
import ts from 'typescript';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const exports = {};
new Function('exports', 'require', ts.transpileModule(fs.readFileSync('src/search.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(exports, require);
const { normalizeSearch, searchScore } = exports;
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const source = read('src/data/glossary.json'), published = read('src/data/public-glossary.json'), baseline = read('reports/baseline-glossary.json');
const ids = new Set(published.map(t => t.id)), aliases = new Map();
for (const term of source) for (const label of [term.term, ...(term.aliases || [])]) {
  const key = normalizeSearch(label), owners = aliases.get(key) || new Set(); owners.add(term.id); aliases.set(key, owners);
}
const collisions = [...aliases].filter(([, owners]) => owners.size > 1).map(([alias, owners]) => ({ alias, ids: [...owners] }));
const quote = value => '"' + String(value ?? '').replaceAll('"', '""') + '"';
function csv(path, rows) { fs.writeFileSync(path, Object.keys(rows[0]).map(quote).join(',') + '\n' + rows.map(row => Object.values(row).map(quote).join(',')).join('\n') + '\n'); }
csv('reports/inventory.csv', source.map(term => ({ id: term.id, url: `https://crust-and-crumb-tawny.vercel.app/term/${term.id}`, canonicalName: term.term,
  publicationState: ids.has(term.id) ? 'published' : 'editorial-draft', aliases: (term.aliases || []).join(' | '), primaryCategory: term.category, level: term.difficulty,
  designation: term.entryRole || 'unreviewed', definition: term.definition, fullExistingContent: JSON.stringify(baseline.find(t => t.id === term.id) || term),
  relatedTerms: (term.relatedTermIds || []).join(' | '), linkedResources: (term.sourceRelations || []).map(ref => ref.url).filter(Boolean).join(' | '),
  sourceNeeds: term.references?.length ? 'Linked references checked in release sample' : 'Claim-specific references need review', contentCheckedOn: term.contentCheckedOn || '',
  accuracyScore: '', clarityScore: '', practicalScore: '', depthScore: '', connectionsScore: '', overallScore: '', scoringState: 'Not manually scored',
  accuracyRisk: ['Scientific/Technical', 'Grain & Milling', 'Troubleshooting'].includes(term.category) ? 'technical-review-priority' : 'unreviewed',
  duplicateRisk: collisions.some(c => c.ids.includes(term.id)) ? 'alias-collision-review' : 'No normalized collision; concept review pending',
  action: !ids.has(term.id) ? 'hold draft' : term.contentCheckedOn ? 'retain corrected entry' : 'review depth and claims',
  reasons: [(term.relatedTermIds || []).length < 3 ? 'Fewer than three related terms; check relevance before adding links' : '', !term.references?.length ? 'Publisher labels are not claim-specific citations' : ''].filter(Boolean).join(' | '),
})));
fs.writeFileSync('reports/alias-collisions.json', JSON.stringify(collisions, null, 2) + '\n');
const summary = { date: '2026-10-02', baseCommit: cp.execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
  suppliedBuild: 'https://crust-and-crumb-km00v74ia-henryhunterjrs-projects.vercel.app/', records: source.length, publishedCanonical: published.length,
  drafts: source.length - published.length, standaloneAliasRecords: 0, archivedRecords: 0, aliasLabels: source.reduce((n, term) => n + (term.aliases || []).length, 0),
  aliasCollisions: collisions.length, publicAliasCollisions: collisions.filter(c => c.ids.filter(id => ids.has(id)).length > 1).length,
  danglingPublishedRelations: published.flatMap(term => (term.relatedTermIds || []).filter(id => !ids.has(id))).length,
  fewerThanThreeRelated: published.filter(term => (term.relatedTermIds || []).length < 3).length,
  entriesWithClaimReferences: published.filter(term => term.references?.length).length, corrected: published.filter(term => term.contentCheckedOn === '2026-10-02').map(term => term.id),
  majorUpgrades: published.filter(term => term.entryRole === 'major').length, newEntries: 0, removedEntries: 0, mergedEntries: 0,
  competitiveRank: 'undetermined; no comparable benchmark', baselineHtmlBytes: 1620814, fieldPerformance: 'unverified',
};
fs.writeFileSync('reports/inventory-summary.json', JSON.stringify(summary, null, 2) + '\n');
const cases = [['bakers percentage', 'bakers-percentage'], ['baker’s-percentage', 'bakers-percentage'], ['BÂTARD', 'batard'], ['brotform', 'banneton'], ['fresh milled flour', 'fresh-milled-flour']];
for (const [query, expected] of cases) {
  const ranked = published.filter(term => searchScore(term, query)).sort((a, b) => searchScore(b, query) - searchScore(a, query));
  if (ranked[0]?.id !== expected) throw new Error(`Search: ${query} returned ${ranked[0]?.id}`);
}
if (published.some(term => searchScore(term, 'zzzz-not-a-bread-term'))) throw new Error('Empty search returned unrelated results');
if (published.length !== 279 || source.length !== 292 || summary.danglingPublishedRelations) throw new Error('Catalog preservation failure');
for (const term of published.filter(term => term.entryRole === 'major')) {
  for (const key of ['definition','whyItMatters','practicalExample','sensoryCues','nuance','references','commonMistakes','nextResource','contentCheckedOn']) if (!term[key]?.length && !term[key]?.url) throw new Error(`${term.id} missing ${key}`);
  if (term.relatedTermIds.length < 4 || term.relatedTermIds.length > 8) throw new Error('Major related-link range');
}
if (published.some(term => term.clusterPlan || term.definitionStatus === 'editorial-draft')) throw new Error('Internal content exposed');
console.log(JSON.stringify(summary, null, 2));
console.log('Search, catalog, release entry completeness, and public-data checks passed.');
