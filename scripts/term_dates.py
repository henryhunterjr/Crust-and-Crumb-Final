#!/usr/bin/env python3
"""Compute honest per-term dates from git history and write src/data/term-dates.json.

published = date of the first commit where the term appears in src/data/glossary.json
modified  = date of the latest commit where the term's content changed
            (glossary.json entry or its illustrations.json entry)

Run from the repo root after any data change, then commit the output:
    python3 scripts/term_dates.py
Needs full git history (not a shallow clone).
"""
import json, subprocess

FILES = ['src/data/glossary.json', 'src/data/illustrations.json']


def git(*args):
    return subprocess.run(['git', *args], capture_output=True, text=True, check=True).stdout


def snapshots(path):
    """Yield (date, {term_id: serialized entry}) oldest first."""
    lines = git('log', '--reverse', '--format=%H %cs', '--', path).split('\n')
    for line in filter(None, lines):
        sha, date = line.split()
        try:
            data = json.loads(git('show', f'{sha}:{path}'))
        except (subprocess.CalledProcessError, json.JSONDecodeError):
            continue
        if isinstance(data, list):
            entries = {t['id']: json.dumps(t, sort_keys=True) for t in data if isinstance(t, dict) and 'id' in t}
        else:
            entries = {k: json.dumps(v, sort_keys=True) for k, v in data.items()}
        yield date, entries


dates = {}
for path in FILES:
    previous = {}
    for date, entries in snapshots(path):
        for tid, blob in entries.items():
            d = dates.setdefault(tid, {})
            if path == FILES[0] and 'published' not in d:
                d['published'] = date
            if previous.get(tid) != blob:
                d['modified'] = max(d.get('modified', date), date)
        previous = entries

current = {t['id'] for t in json.load(open(FILES[0]))}
out = {tid: d for tid, d in sorted(dates.items()) if tid in current and 'published' in d}
json.dump(out, open('src/data/term-dates.json', 'w'), indent=1)
print(f'wrote dates for {len(out)} terms')
