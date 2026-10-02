import fs from 'node:fs';
const base = (process.argv[2] || 'http://localhost:3217').replace(/\/$/, '');
const canonical = 'https://crust-and-crumb-tawny.vercel.app';
const terms = JSON.parse(fs.readFileSync('src/data/public-glossary.json', 'utf8'));
const checks = [], errors = [];
const decode = value => value.replace(/&amp;/g, '&').replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
let cursor = 0;
await Promise.all(Array.from({ length: 8 }, async () => {
  while (cursor < terms.length) {
    const term = terms[cursor++];
    try {
      const response = await fetch(`${base}/term/${term.id}`, { signal: AbortSignal.timeout(30000) });
      const html = await response.text();
      const heading = decode((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] || '').replace(/<[^>]+>/g, ''));
      const foundCanonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
      const schema = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(match => JSON.parse(match[1]));
      const definition = schema.find(item => item['@type'] === 'DefinedTerm');
      if (response.status !== 200 || heading.trim() !== term.term || foundCanonical !== `${canonical}/term/${term.id}` || definition?.description !== term.definition) {
        errors.push({ id: term.id, status: response.status, heading, foundCanonical, schemaMatches: definition?.description === term.definition });
      }
      checks.push({ id: term.id, status: response.status, bytes: Buffer.byteLength(html), heading: heading.trim(), canonical: foundCanonical });
    } catch (error) { errors.push({ id: term.id, error: error.message }); }
  }
}));
const home = await fetch(base), homeHtml = await home.text();
const indexCount = new Set([...homeHtml.matchAll(/href="\/term\/([^"?]+)"/g)].map(match => match[1])).size;
if (indexCount !== terms.length) errors.push({ indexCount, expected: terms.length });
for (const page of ['editorial-standards', 'methodology', 'sources', 'updates']) {
  const response = await fetch(`${base}/${page}`), html = await response.text();
  if (response.status !== 200 || !html.includes(`href="${canonical}/${page}"`)) errors.push({ page, status: response.status });
}
const missing = await fetch(`${base}/term/does-not-exist`, { redirect: 'manual' });
if (missing.status !== 404) errors.push({ missing: missing.status });
for (const slug of ['brotform', 'baker-s-percentage', 'cold-retard']) {
  const response = await fetch(`${base}/term/${slug}`, { redirect: 'manual' });
  if (response.status !== 308) errors.push({ alias: slug, status: response.status });
}
const filtered = await fetch(`${base}/?q=bakers+percentage`), filteredHtml = await filtered.text();
if (!/<meta name="robots" content="[^"]*noindex/.test(filteredHtml)) errors.push({ filteredQuery: 'no noindex' });
const sitemapResponse = await fetch(`${base}/sitemap.xml`), sitemap = await sitemapResponse.text();
if ([...sitemap.matchAll(/<loc>/g)].length !== terms.length + 5 || sitemap.includes('?q=') || sitemap.includes('/term/brotform')) errors.push({ sitemap: 'wrong published URL set' });
const result = { date: '2026-10-02', base, publishedRoutesChecked: checks.length, failures: errors,
  homepageBytes: Buffer.byteLength(homeHtml), baselineHomepageBytes: 1620814, allCanonicalLinksInInitialHtml: indexCount,
  editorialPagesChecked: 4, aliasesChecked: 3, missingTermStatus: missing.status,
  labCoreWebVitals: 'not measured; HTML byte reduction is not a CWV score' };
fs.writeFileSync('reports/route-checks.json', JSON.stringify({ ...result, checks }, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
