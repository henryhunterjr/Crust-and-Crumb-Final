import type { GlossaryItem } from './types';

/** Preserve display spelling while treating punctuation and accents consistently. */
export function normalizeSearch(value: string): string {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/['’‘]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

export function searchScore(item: GlossaryItem, query: string): number {
  const q = normalizeSearch(query);
  if (!q) return 1;
  const name = normalizeSearch(item.term);
  const aliases = (item.aliases || []).map(normalizeSearch);
  if (name === q) return 100;
  if (aliases.includes(q)) return 95;
  if (name.startsWith(q)) return 85;
  if (name.includes(q) || aliases.some(alias => alias.includes(q))) return 80;
  const body = normalizeSearch([item.definition, item.shortDefinition, item.category,
    ...(item.keywords || []), ...(item.alternateQuestions || [])].filter(Boolean).join(' '));
  if (q.split(' ').every(word => body.includes(word))) return 20;
  return 0;
}

export function aliasSlug(value: string): string {
  return normalizeSearch(value).replace(/ /g, '-');
}
