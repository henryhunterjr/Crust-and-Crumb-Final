import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { GLOSSARY_DATA, resolveSlugAlias } from '../../../../src/constants';

export const runtime = 'edge';

const GOLD = '#f0c878';
const CATEGORY_DOTS: Record<string, string> = {
  ingredient: '#e8b25c', tool: '#9db4d9', technique: '#7cc4f2', process: '#b9a3f0', bread: '#f09a63',
  pizza: '#ff8a6e', schedule: '#8fd3c7', 'scientific/technical': '#c9c3ff', troubleshooting: '#ff7a6b', 'grain & milling': '#b5d46a',
};

const clip = (text: string, max: number) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
};

async function loadFonts() {
  const [fraunces, figtree, figtreeBold] = await Promise.all([
    fetch(new URL('../../../../src/fonts/Fraunces-500.ttf', import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL('../../../../src/fonts/Figtree-400.ttf', import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL('../../../../src/fonts/Figtree-600.ttf', import.meta.url)).then((r) => r.arrayBuffer()),
  ]);
  return [
    { name: 'Fraunces', data: fraunces, weight: 500 as const, style: 'normal' as const },
    { name: 'Figtree', data: figtree, weight: 400 as const, style: 'normal' as const },
    { name: 'Figtree', data: figtreeBold, weight: 600 as const, style: 'normal' as const },
  ];
}

async function loadIllustration(req: NextRequest, src?: string): Promise<string | null> {
  if (!src) return null;
  try {
    const res = await fetch(new URL(src, req.url));
    if (!res.ok) return null;
    const svg = await res.text();
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = GLOSSARY_DATA.some((t) => t.id === slug) ? slug : resolveSlugAlias(slug);
  const term = GLOSSARY_DATA.find((t) => t.id === id);
  if (!term) return new Response('Not found', { status: 404 });

  const [fonts, illustration] = await Promise.all([loadFonts(), loadIllustration(req, term.illustration?.src)]);
  const dot = CATEGORY_DOTS[term.category.toLowerCase()] || GOLD;
  const lede = clip(term.shortDefinition || term.definition, illustration ? 110 : 170);
  const titleSize = term.term.length > 22 ? 64 : term.term.length > 14 ? 80 : 96;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '56px 64px',
          background: 'linear-gradient(135deg, #1c140b 0%, #0d0a07 55%, #241709 100%)', color: '#f6ecdc', fontFamily: 'Figtree',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: -140, right: -120, width: 520, height: 520, borderRadius: 999, background: 'rgba(240,200,120,0.08)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -220, left: -100, width: 480, height: 480, borderRadius: 999, background: 'rgba(184,119,42,0.14)', display: 'flex' }} />
        <div style={{ position: 'absolute', inset: 24, border: '1.5px solid rgba(240,200,120,0.28)', borderRadius: 32, display: 'flex' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 22, letterSpacing: 4, textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>
          <div style={{ width: 14, height: 14, borderRadius: 99, background: dot, display: 'flex' }} />
          <span>{term.category}</span>
          <span style={{ color: 'rgba(246,236,220,0.45)' }}>·</span>
          <span style={{ color: 'rgba(246,236,220,0.75)' }}>{term.difficulty}</span>
        </div>

        <div style={{ display: 'flex', flex: 1, gap: 40, alignItems: 'center', marginTop: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Fraunces', fontSize: titleSize, lineHeight: 1, letterSpacing: -2, color: '#fff8ec', display: 'flex' }}>{term.term}</div>
            {term.pronunciation && (
              <div style={{ fontFamily: 'Fraunces', fontSize: 30, color: GOLD, marginTop: 14, display: 'flex' }}>{term.pronunciation}</div>
            )}
            <div style={{ fontSize: 30, lineHeight: 1.35, color: 'rgba(246,236,220,0.9)', marginTop: 26, display: 'flex' }}>{lede}</div>
          </div>
          {illustration && (
            <div style={{ display: 'flex', width: 400, height: 260, borderRadius: 24, background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src={illustration} width={380} height={247} />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'Fraunces', fontSize: 34, color: '#fff8ec' }}>Crust &amp; Crumb</span>
            <span style={{ color: 'rgba(246,236,220,0.65)', letterSpacing: 3, fontSize: 18, textTransform: 'uppercase' }}>The Bread Baker&apos;s Glossary · Henry Hunter</span>
          </div>
          <span style={{ color: GOLD, fontWeight: 600 }}>crust-and-crumb-tawny.vercel.app</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts },
  );
}
