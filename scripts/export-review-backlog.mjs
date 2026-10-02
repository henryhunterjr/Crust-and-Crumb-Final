import fs from 'node:fs';
import ts from 'typescript';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url), exports = {};
new Function('exports', 'require', ts.transpileModule(fs.readFileSync('src/search.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(exports, require);
const { normalizeSearch } = exports;
const source = JSON.parse(fs.readFileSync('src/data/glossary.json', 'utf8'));
const published = JSON.parse(fs.readFileSync('src/data/public-glossary.json', 'utf8'));
const order = fs.readFileSync('../crust-and-crumb-consolidated-work-order.md', 'utf8').split('## Appendix: Candidate coverage matrix')[1];
const names = order.split(/\r?\n/).filter(line => line.includes(';') && !line.startsWith('Audit ')).flatMap(line => line.trim().replace(/\.$/, '').split(';')).map(name => name.trim()).filter(Boolean);
const unique = [...new Map(names.map(name => [normalizeSearch(name), name])).values()];
const match = (terms, name) => terms.find(term => [term.term, ...(term.aliases || [])].some(label => normalizeSearch(label) === normalizeSearch(name)));
const quote = value => '"' + String(value ?? '').replaceAll('"', '""') + '"';
function csv(path, rows) { fs.writeFileSync(path, Object.keys(rows[0]).map(quote).join(',') + '\n' + rows.map(row => Object.values(row).map(quote).join(',')).join('\n') + '\n'); }
csv('reports/candidate-matrix.csv', unique.map(name => {
  const live = match(published, name), existing = live || match(source, name);
  return { candidate: name, canonicalName: existing?.term || '', destination: live ? `https://crust-and-crumb-tawny.vercel.app/term/${live.id}` : '',
    coverageStatus: live ? 'Published exact name or alias; depth not assessed' : existing ? 'Draft; withheld' : 'No exact name or alias; contextual coverage needs review',
    action: live ? 'Review depth and source support; avoid duplicate entry' : existing ? 'Factual review before publication' : name.includes('verify') ? 'Clarify intended term before proposing entry' : 'Check contextual coverage, then propose entry or alias',
    priority: live?.contentCheckedOn ? 'Release correction completed; broader review pending' : 'Unprioritized candidate backlog',
    reviewRequirement: 'Primary reference and bread-usefulness review; exact-name matching does not prove a concept gap' };
}));
csv('reports/category-map.csv', published.map(term => ({ id: term.id, name: term.term, primaryCategory: term.category, level: term.difficulty })));
csv('reports/alias-map.csv', published.flatMap(term => (term.aliases || []).map(alias => ({ alias, canonicalId: term.id, canonicalUrl: `https://crust-and-crumb-tawny.vercel.app/term/${term.id}` }))));
csv('reports/related-term-map.csv', published.flatMap(term => (term.relatedTermIds || []).map(id => ({ from: term.id, to: id, destination: `https://crust-and-crumb-tawny.vercel.app/term/${id}`, relevance: 'Existing relation; detailed editorial relevance review pending' }))));
const resources = new Map();
for (const term of published) for (const resource of term.sourceRelations || []) {
  if (!resource.url) continue;
  const row = resources.get(resource.url) || { url: resource.url, title: resource.title, sourceSystem: resource.sourceSystem, terms: [], verification: 'Imported destination; not individually verified in this release' };
  row.terms.push(term.id); resources.set(resource.url, row);
}
csv('reports/resource-manifest.csv', [...resources.values()].map(row => ({ ...row, terms: row.terms.join(' | ') })));
console.log(`Candidate matrix: ${unique.length} unique named candidates. ${resources.size} unique imported resource URLs. Contextual coverage and destination reviews remain pending.`);
