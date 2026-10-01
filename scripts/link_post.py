#!/usr/bin/env python3
"""Insert glossary links into WordPress post HTML: first mention only, inside p/li text, never inside
existing links, headings, code, captions or block comments. Preserves everything else byte for byte."""
import json, re, sys, html

BASE = 'https://crust-and-crumb-tawny.vercel.app/term/'
GLOSSARY = [t for t in json.load(open('src/data/glossary.json')) if t.get('definitionStatus') != 'editorial-draft']
STOP = {'bread', 'flour', 'dough', 'salt', 'yeast', 'water', 'crust', 'crumb', 'baking', 'starter', 'sourdough', 'ear', 'belly',
        'peak', 'mother', 'rope', 'seam', 'scald', 'germ', 'discard', 'zest', 'brine', 'oats', 'barley', 'millet', 'quinoa',
        'sponge', 'docking', 'tempering', 'soaker', 'inclusions', 'elasticity', 'tenacity', 'terroir', 'feeding', 'shaping', 'proofing', 'fermentation', 'hydration', 'gluten', 'scoring', 'kneading'}
# Terms in STOP are too generic to link blindly, except when the post itself is about them (passed as priority).

NO_LINK_TAGS = {'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'pre', 'figcaption', 'button', 'script', 'style', 'strong', 'em', 'b'}
TEXT_OK_TAGS = {'p', 'li', 'td'}

TOKEN = re.compile(r'(<!--.*?-->|<[^>]+>)', re.S)

def candidates(priority_ids):
    out = []
    for t in GLOSSARY:
        names = [t['term']] + list(t.get('aliases') or [])
        for n in names:
            key = n.lower()
            if len(key) < 4: continue
            if key in STOP and t['id'] not in priority_ids: continue
            out.append((t['id'], n))
    # longest names first so "stretch and fold" beats "fold", priority terms first
    out.sort(key=lambda x: (x[0] not in priority_ids, -len(x[1])))
    return out

def link_post(content, priority_ids, max_links=10):
    parts = TOKEN.split(content)
    stack = []
    in_block_comment_skip = False
    linked = {}
    existing = set(re.findall(r'crust-and-crumb[^"]*/term/([a-z0-9-]+)', content))
    cands = [(tid, n) for tid, n in candidates(priority_ids) if tid not in existing]
    for i, part in enumerate(parts):
        if not part: continue
        if part.startswith('<!--'):
            continue
        if part.startswith('<'):
            m = re.match(r'<(/?)([a-zA-Z0-9]+)', part)
            if not m: continue
            closing, tag = m.group(1) == '/', m.group(2).lower()
            if part.endswith('/>') or tag in ('br', 'img', 'hr', 'input'): continue
            if closing:
                if tag in stack:
                    while stack and stack.pop() != tag: pass
            else:
                stack.append(tag)
            continue
        # text node
        if len(linked) >= max_links: continue
        if any(t in NO_LINK_TAGS for t in stack): continue
        if not any(t in TEXT_OK_TAGS for t in stack): continue
        text = part
        for tid, name in cands:
            if tid in linked: continue
            pat = re.compile(r'(?<![\w-])(' + re.escape(name) + r'(?:s|es)?)(?![\w-])', re.I)
            m = pat.search(text)
            if not m: continue
            # don't link inside an all-caps heading-like strong line; handled by tag stack. Replace first occurrence.
            start, end = m.span(1)
            text = text[:start] + f'<a href="{BASE}{tid}">' + text[start:end] + '</a>' + text[end:]
            linked[tid] = m.group(1)
            if len(linked) >= max_links: break
        parts[i] = text
    return ''.join(parts), linked

if __name__ == '__main__':
    src = json.load(open(sys.argv[1]))
    out, linked = link_post(src['content'], set(src.get('priority', [])), int(src.get('max', 10)))
    json.dump({'content': out, 'linked': linked}, open(sys.argv[2], 'w'))
    for k, v in linked.items(): print(f'{k:28s} <- "{v}"')
