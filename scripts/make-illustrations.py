#!/usr/bin/env python3
"""Generate the Crust & Crumb glossary line illustrations (gold line art, 400x260)."""
import json, os, re

OUT = 'public/illustrations'
os.makedirs(OUT, exist_ok=True)

GOLD = '#f0c878'
SOFT = 'rgba(240,200,120,0.14)'
DIM = 'rgba(240,200,120,0.55)'
W, H = 400, 260

def svg(body, title):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-labelledby="t">
<title id="t">{title}</title>
<g fill="none" stroke="{GOLD}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
{body}
</g>
</svg>'''

def p(d, **k):
    a = ' '.join(f'{kk.replace("_","-")}="{v}"' for kk, v in k.items())
    return f'<path d="{d}" {a}/>'
def fill(d, **k): return p(d, fill=SOFT, **k)
def dim(d, **k): return p(d, stroke=DIM, stroke_dasharray='6 7', **k)
def ell(cx, cy, rx, ry, **k):
    a = ' '.join(f'{kk.replace("_","-")}="{v}"' for kk, v in k.items())
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" {a}/>'
def circ(cx, cy, r, **k):
    a = ' '.join(f'{kk.replace("_","-")}="{v}"' for kk, v in k.items())
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" {a}/>'
def rect(x, y, w, h, rx=8, **k):
    a = ' '.join(f'{kk.replace("_","-")}="{v}"' for kk, v in k.items())
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" {a}/>'
def line(x1, y1, x2, y2, **k):
    a = ' '.join(f'{kk.replace("_","-")}="{v}"' for kk, v in k.items())
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" {a}/>'
def text(x, y, s, size=13, anchor='middle', **k):
    a = ' '.join(f'{kk.replace("_","-")}="{v}"' for kk, v in k.items())
    return f'<text x="{x}" y="{y}" fill="{GOLD}" stroke="none" font-family="Figtree, ui-sans-serif, system-ui, sans-serif" font-size="{size}" font-weight="700" letter-spacing="1.5" text-anchor="{anchor}" {a}>{s}</text>'
def arrow(x1, y1, x2, y2, curve=None):
    d = f'M{x1} {y1} Q{curve} {x2} {y2}' if curve else f'M{x1} {y1} L{x2} {y2}'
    import math
    # arrow head
    if curve:
        cx, cy = map(float, curve.split())
        ang = math.atan2(y2 - cy, x2 - cx)
    else:
        ang = math.atan2(y2 - y1, x2 - x1)
    a1 = ang + math.pi * 0.8; a2 = ang - math.pi * 0.8
    h = 12
    head = f'M{x2 + h*math.cos(a1):.1f} {y2 + h*math.sin(a1):.1f} L{x2} {y2} L{x2 + h*math.cos(a2):.1f} {y2 + h*math.sin(a2):.1f}'
    return p(d) + p(head)

def loaf_slice(holes, extra=''):
    """A slice outline with given holes [(cx,cy,rx,ry)]"""
    body = fill('M70 215 L70 120 Q70 60 130 52 Q200 40 270 52 Q330 60 330 120 L330 215 Z')
    body += p('M70 120 Q70 60 130 52 Q200 40 270 52 Q330 60 330 120', stroke_width=5)
    for (cx, cy, rx, ry) in holes:
        body += ell(cx, cy, rx, ry)
    return body + extra

def crumb_holes(seed, n, rmin, rmax, region=(95, 75, 305, 200)):
    import random
    random.seed(seed)
    holes = []
    tries = 0
    while len(holes) < n and tries < 4000:
        tries += 1
        rx = random.uniform(rmin, rmax); ry = rx * random.uniform(0.7, 1.1)
        cx = random.uniform(region[0] + rx, region[2] - rx); cy = random.uniform(region[1] + ry, region[3] - ry)
        if all(((cx - a) ** 2 + (cy - b) ** 2) ** 0.5 > rx + c + 6 for (a, b, c, d) in holes):
            holes.append((round(cx), round(cy), round(rx), round(ry)))
    return holes

D = {}

# --- Techniques ---
D['windowpane-test'] = (
    circ(200, 118, 62, fill=SOFT, stroke=DIM, stroke_dasharray='6 7')
    + fill('M120 160 Q140 70 200 62 Q262 70 282 160 Q240 190 200 186 Q160 190 120 160 Z')
    + p('M150 112 Q200 90 250 112', stroke=DIM) + p('M140 140 Q200 120 262 140', stroke=DIM)
    # hands (thumbs)
    + p('M60 200 Q80 150 118 152 L132 166 Q110 172 92 200 Z') + p('M340 200 Q320 150 282 152 L268 166 Q290 172 308 200 Z')
    + p('M98 160 L118 178', stroke=DIM) + p('M302 160 L282 178', stroke=DIM)
    + text(200, 236, 'THIN ENOUGH TO SEE LIGHT THROUGH', 11)
)
D['stretch-and-fold'] = (
    p('M80 150 Q80 220 200 222 Q320 220 320 150') + p('M80 150 L320 150')
    + fill('M100 150 Q110 128 150 128 L300 128 Q312 140 310 150 Z')
    + p('M150 128 Q150 70 230 60 Q290 58 300 96', stroke_width=4)
    + arrow(300, 96, 262, 120, '300 118')
    + p('M110 90 Q150 70 180 92') + p('M198 70 Q218 48 240 42', stroke=DIM)
    + text(200, 246, 'STRETCH UP, FOLD OVER', 11)
)
D['coil-fold'] = (
    p('M60 200 L340 200', stroke=DIM)
    + fill('M110 200 Q100 168 140 162 L160 162 Q160 100 200 96 Q240 100 240 162 L260 162 Q300 168 290 200 Z')
    + p('M160 162 Q150 130 110 134', stroke_width=4) + p('M240 162 Q250 130 290 134', stroke_width=4)
    + arrow(200, 90, 200, 68) + p('M172 66 L228 66', stroke_width=5)
    + p('M120 120 Q110 150 140 162', stroke=DIM) + p('M280 120 Q290 150 260 162', stroke=DIM)
    + text(200, 236, 'LIFT THE MIDDLE, LET THE ENDS TUCK UNDER', 11)
)
D['slap-and-fold'] = (
    p('M50 206 L350 206')
    + fill('M120 206 Q120 150 190 150 L250 150 Q300 150 300 206 Z')
    + p('M250 150 Q250 100 215 72 Q180 50 150 60', stroke_width=4)
    + p('M150 60 Q130 54 112 70') + p('M106 64 L120 90 L140 86')
    + p('M70 150 Q60 130 72 110', stroke=DIM) + p('M58 160 Q44 140 56 118', stroke=DIM)
    + arrow(330, 90, 322, 150, '345 120')
    + text(200, 240, 'SLAP DOWN, FOLD OVER, REPEAT', 11)
)
D['scoring'] = (
    fill('M70 196 Q70 96 200 86 Q330 96 330 196 Z')
    + p('M70 196 L330 196')
    + p('M138 150 Q180 112 262 128', stroke_width=5)
    + p('M138 150 Q175 128 262 128', stroke=DIM)
    # lame
    + p('M250 56 L318 42') + rect(300, 30, 48, 20, 4) + p('M322 34 L330 46')
    + p('M248 58 L236 70', stroke=DIM)
    + text(200, 240, 'ONE CONFIDENT SLASH AT A SHALLOW ANGLE', 11)
)
D['ear'] = (
    fill('M60 210 Q60 110 190 96 Q330 100 340 210 Z') + p('M60 210 L340 210')
    + p('M150 112 Q190 70 262 98 Q232 114 212 136', stroke_width=4)
    + fill('M150 112 Q190 70 262 98 Q232 114 212 136 Q180 124 150 112 Z')
    + p('M212 136 Q250 130 300 140', stroke=DIM)
    + arrow(290, 60, 236, 86, '262 56')
    + text(200, 242, 'THE FLAP THAT LIFTS AT THE SCORE', 11)
)
D['shaping'] = (
    fill('M110 200 Q100 110 200 100 Q300 110 290 200 Z') + p('M110 200 L290 200')
    + p('M140 150 Q200 120 260 150', stroke=DIM) + p('M150 180 Q200 160 250 180', stroke=DIM)
    + arrow(126, 112, 150, 140, '128 136') + arrow(274, 112, 250, 140, '272 136')
    + p('M72 202 Q60 160 96 150 L110 160', stroke_width=3) + p('M328 202 Q340 160 304 150 L290 160')
    + text(200, 240, 'PULL THE SKIN TIGHT ON TOP, SEAM UNDERNEATH', 11)
)
D['pre-shape'] = (
    p('M40 196 L360 196')
    + fill('M70 196 Q66 150 120 148 Q174 150 170 196 Z')
    + fill('M150 196 Q146 146 206 144 Q266 146 262 196 Z')
    + fill('M236 196 Q232 150 290 148 Q344 150 340 196 Z')
    + p('M100 164 Q120 156 140 164', stroke=DIM) + p('M186 160 Q206 152 226 160', stroke=DIM) + p('M270 164 Q290 156 310 164', stroke=DIM)
    + circ(200, 70, 22) + p('M200 56 L200 70 L210 78')
    + text(200, 236, 'LOOSE ROUNDS, THEN A SHORT REST', 11)
)
D['poke-test'] = (
    fill('M70 200 Q70 110 200 102 Q330 110 330 200 Z') + p('M70 200 L330 200')
    + p('M172 112 Q190 136 212 112', stroke_width=4)
    + p('M192 20 L192 90 Q192 114 206 112') + p('M172 24 L172 80', stroke=DIM) + p('M212 24 L212 80', stroke=DIM)
    + rect(160, 10, 64, 26, 10, stroke=DIM)
    + arrow(260, 70, 232, 100, '262 96')
    + text(200, 240, 'SPRINGS BACK SLOWLY, NOT ALL THE WAY', 11)
)
D['lamination'] = ''.join(
    fill(f'M70 {180-i*22} L330 {180-i*22} L330 {196-i*22} L70 {196-i*22} Z') for i in range(0, 5)
) + ''.join(p(f'M70 {168-i*22} L330 {168-i*22}', stroke=DIM) for i in range(0, 4)) + (
    p('M70 196 L330 196', stroke_width=4) + text(200, 236, 'DOUGH, BUTTER, DOUGH, BUTTER. FOLDED AGAIN.', 11)
)
D['braiding'] = (
    ''.join(
        f'<ellipse cx="{200 + (26 if i % 2 == 0 else -26)}" cy="{58 + i * 30}" rx="40" ry="20" fill="{SOFT}" transform="rotate({-32 if i % 2 == 0 else 32} {200 + (26 if i % 2 == 0 else -26)} {58 + i * 30})"/>'
        for i in range(0, 6)
    )
    + p('M200 30 L200 220', stroke=DIM)
    + text(200, 248, 'THREE STRANDS, OUTSIDE OVER MIDDLE', 11)
)
D['autolyse'] = (
    p('M60 130 Q60 210 200 212 Q340 210 340 130') + p('M60 130 L340 130')
    + fill('M90 130 Q110 100 200 100 Q290 100 310 130 Z')
    + p('M130 116 L142 108', stroke=DIM) + p('M250 112 L262 106', stroke=DIM)
    + circ(300, 60, 30) + p('M300 42 L300 60 L312 68') + p('M300 36 L300 30', stroke=DIM) + p('M324 60 L330 60', stroke=DIM)
    + p('M100 60 Q110 40 120 60 Q130 80 120 80', stroke=DIM) + p('M140 50 Q150 30 160 50', stroke=DIM)
    + text(200, 246, 'FLOUR AND WATER ONLY. THEN WAIT.', 11)
)
D['tangzhong'] = (
    p('M80 110 L80 200 Q80 214 94 214 L306 214 Q320 214 320 200 L320 110 Z')
    + p('M320 150 L360 140', stroke_width=5)
    + fill('M80 150 Q130 136 200 150 Q270 164 320 150 L320 214 L80 214 Z')
    + p('M200 60 L200 150') + ell(200, 160, 22, 14, stroke=DIM) + p('M186 150 L214 170', stroke=DIM) + p('M214 150 L186 170', stroke=DIM)
    + p('M120 130 Q130 116 140 130 Q150 144 160 130', stroke=DIM)
    + text(200, 246, 'FLOUR COOKED IN WATER OR MILK INTO A PASTE', 11)
)
D['bulk-fermentation'] = (
    rect(110, 50, 180, 170, 10)
    + fill('M110 140 Q140 128 200 134 Q260 140 290 140 L290 220 L110 220 Z')
    + dim('M110 182 L290 182') + text(306, 186, '1x', 12, 'start') + text(306, 144, '1.5x', 12, 'start')
    + circ(150, 170, 5) + circ(190, 190, 7) + circ(240, 168, 6) + circ(214, 206, 4) + circ(262, 200, 5)
    + text(200, 246, 'THE FIRST RISE, AS ONE MASS', 11)
)
D['oven-spring'] = (
    p('M40 200 L360 200')
    + dim('M90 200 Q90 150 150 148 Q210 150 210 200')
    + fill('M190 200 Q190 86 270 82 Q350 86 350 200 Z')
    + p('M234 116 Q268 96 306 112', stroke_width=4)
    + arrow(150, 142, 150, 100)
    + text(150, 90, 'IN', 11) + text(270, 66, 'MINUTES LATER', 11)
    + text(200, 240, 'THE BURST OF RISE IN THE FIRST 15 MINUTES', 11)
)
D['oven-steam'] = (
    rect(60, 50, 280, 170, 10) + p('M60 86 L340 86')
    + fill('M120 196 Q120 140 200 136 Q280 140 280 196 Z') + p('M100 196 L300 196', stroke=DIM)
    + p('M120 120 Q130 104 120 90 Q110 76 120 62', stroke=DIM) + p('M200 118 Q210 102 200 88 Q190 74 200 60', stroke=DIM) + p('M280 120 Q290 104 280 90 Q270 76 280 62', stroke=DIM)
    + text(200, 246, 'STEAM KEEPS THE CRUST SOFT WHILE IT RISES', 11)
)
D['cold-proof'] = (
    rect(110, 30, 180, 200, 12) + p('M110 110 L290 110') + p('M274 60 L274 90') + p('M274 130 L274 170')
    + p('M130 190 Q130 150 200 148 Q270 150 270 190 Z', stroke=DIM)
    + fill('M150 190 Q150 160 200 158 Q250 160 250 190 Z')
    + ''.join(p(f'M{cx} {cy-14} L{cx} {cy+14} M{cx-12} {cy-7} L{cx+12} {cy+7} M{cx-12} {cy+7} L{cx+12} {cy-7}', stroke=DIM) for cx, cy in ((60, 80), (340, 150), (52, 190)))
    + text(200, 252, 'SLOW, COLD, AND FULL OF FLAVOR', 11)
)
D['float-test'] = (
    p('M120 50 L130 220 Q130 230 140 230 L260 230 Q270 230 270 220 L280 50')
    + fill('M124 110 L132 220 Q132 226 140 226 L260 226 Q268 226 268 220 L276 110 Z')
    + p('M124 110 Q160 100 200 110 Q240 120 276 110', stroke_width=4)
    + ell(200, 104, 36, 14, fill=SOFT) + p('M236 104 L300 80')
    + text(200, 254, 'FLOATS: PROBABLY READY. SINKS: MAYBE STILL READY.', 10)
)

# --- Crumb and crust faults ---
D['crumb'] = loaf_slice(crumb_holes(1, 18, 5, 14)) + text(200, 246, 'OPEN, EVEN, AND TENDER', 11)
D['dense-crumb'] = loaf_slice(crumb_holes(2, 60, 2, 4)) + text(200, 246, 'TIGHT, HEAVY, NOT MUCH AIR', 11)
D['gummy-crumb'] = loaf_slice(crumb_holes(3, 14, 4, 11, (95, 70, 305, 150))) + fill('M74 160 Q200 150 326 160 L326 215 L74 215 Z') + ''.join(p(f'M{x} 170 Q{x+10} 185 {x} 200', stroke=DIM) for x in range(100, 300, 36)) + text(200, 246, 'WET, STICKY STREAK NEAR THE BOTTOM', 11)
D['fools-crumb'] = loaf_slice([(170, 110, 50, 34), (265, 150, 30, 22)] + crumb_holes(4, 40, 2, 4, (95, 150, 240, 205))) + text(200, 246, 'A FEW HUGE HOLES, DENSE EVERYWHERE ELSE', 11)
D['tunneling'] = loaf_slice(crumb_holes(5, 30, 3, 6, (95, 120, 305, 205))) + ell(200, 86, 110, 18, fill=SOFT) + text(200, 246, 'A LONG CAVITY RIGHT UNDER THE CRUST', 11)
D['flying-crust'] = (
    fill('M70 120 Q70 60 130 52 Q200 40 270 52 Q330 60 330 120 L330 215 L70 215 Z')
    + p('M70 120 Q70 60 130 52 Q200 40 270 52 Q330 60 330 120', stroke_width=5)
    + p('M84 122 Q90 100 140 96 Q200 90 262 96 Q310 100 316 122 L316 215 L84 215 Z', stroke=GOLD)
    + ''.join(ell(*h) for h in crumb_holes(6, 24, 3, 7, (100, 110, 300, 205)))
    + text(200, 246, 'THE CRUST LIFTED AWAY FROM THE CRUMB', 11)
)
D['pancaking'] = (
    p('M40 200 L360 200')
    + dim('M110 200 Q110 110 200 104 Q290 110 290 200')
    + fill('M60 200 Q70 160 200 156 Q330 160 340 200 Z')
    + arrow(200, 120, 200, 150)
    + text(200, 240, 'SPREADS OUT INSTEAD OF UP', 11)
)
D['blowout'] = (
    fill('M70 200 Q70 100 200 92 Q330 100 330 200 Z') + p('M70 200 L330 200')
    + p('M280 130 L322 112 L298 150 L344 156 L300 182 L326 200', stroke_width=4)
    + fill('M280 130 L322 112 L298 150 L344 156 L300 182 L326 200 L286 190 Q270 160 280 130 Z')
    + p('M140 128 Q200 116 250 124', stroke=DIM)
    + text(200, 240, 'THE CRUST BURST WHERE IT WAS NOT SCORED', 11)
)
D['overproofed'] = (
    p('M80 120 Q80 214 200 216 Q320 214 320 120') + p('M80 120 L320 120')
    + fill('M80 120 Q100 70 150 82 Q180 92 200 98 Q220 92 250 82 Q300 70 320 120 Z')
    + p('M150 82 Q180 92 200 98 Q220 92 250 82', stroke_width=4)
    + circ(130, 150, 7) + circ(260, 160, 9) + circ(200, 180, 6)
    + arrow(200, 50, 200, 88)
    + text(200, 246, 'RISEN PAST ITS PEAK AND STARTING TO SINK', 11)
)
D['underproofed'] = (
    p('M80 120 Q80 214 200 216 Q320 214 320 120') + p('M80 120 L320 120')
    + fill('M90 160 Q120 140 200 140 Q280 140 310 160 L310 196 Q300 212 200 214 Q100 212 90 196 Z')
    + dim('M80 100 Q120 60 200 60 Q280 60 320 100')
    + arrow(200, 130, 200, 76)
    + text(200, 246, 'NOT ENOUGH RISE YET. GIVE IT TIME.', 11)
)

# --- Loaves ---
D['boule'] = fill('M60 200 Q60 90 200 82 Q340 90 340 200 Z') + p('M60 200 L340 200') + p('M140 150 Q200 112 260 150', stroke_width=4) + p('M200 100 Q240 140 220 180', stroke_width=4) + text(200, 240, 'THE ROUND LOAF', 11)
D['batard'] = fill('M30 190 Q40 110 200 104 Q360 110 370 190 Q200 212 30 190 Z') + p('M120 150 Q200 118 280 150', stroke_width=4) + text(200, 240, 'THE OVAL LOAF, A SHORT TORPEDO', 11)
D['baguette'] = fill('M20 150 Q30 118 200 114 Q370 118 380 150 Q370 182 200 186 Q30 182 20 150 Z') + ''.join(p(f'M{x} 165 L{x+44} 136', stroke_width=4) for x in (80, 150, 220, 290)) + text(200, 236, 'LONG, THIN, SCORED ON A SHALLOW DIAGONAL', 11)

# --- Tools ---
D['banneton'] = (
    p('M70 110 L90 210 Q90 220 100 220 L300 220 Q310 220 310 210 L330 110')
    + ''.join(p(f'M{72+i*3} {118+i*22} L{328-i*3} {118+i*22}', stroke=DIM) for i in range(0, 5))
    + ell(200, 110, 130, 24)
    + fill('M90 110 Q110 72 200 68 Q290 72 310 110 Q200 118 90 110 Z')
    + p('M130 100 Q200 92 270 100', stroke=DIM)
    + text(200, 250, 'THE PROOFING BASKET THAT HOLDS THE SHAPE', 11)
)
D['lame'] = (
    rect(60, 118, 200, 26, 12) + p('M100 118 L100 144', stroke=DIM) + p('M130 118 L130 144', stroke=DIM)
    + fill('M250 112 Q290 100 340 108 L340 148 Q290 160 250 148 Z')
    + p('M262 118 L326 114', stroke=DIM)
    + text(200, 200, 'A RAZOR ON A HANDLE, FOR SCORING', 11)
)
D['dutch-oven'] = (
    rect(70, 110, 260, 110, 14) + p('M50 130 L70 130') + p('M330 130 L350 130')
    + p('M60 100 Q60 60 200 56 Q340 60 340 100 L60 100 Z', fill=SOFT) + rect(180, 36, 40, 14, 6)
    + fill('M110 200 Q110 150 200 146 Q290 150 290 200 Z', stroke=DIM)
    + text(200, 248, 'A LIDDED POT THAT TRAPS ITS OWN STEAM', 11)
)
D['bench-scraper'] = (
    rect(80, 60, 240, 150, 6, fill=SOFT) + p('M80 90 L320 90') + rect(100, 36, 200, 28, 14) + p('M80 210 L320 210', stroke_width=5)
    + text(200, 246, 'DIVIDE, LIFT, SCRAPE, PRE-SHAPE', 11)
)
D['digital-scale'] = (
    rect(80, 150, 240, 50, 12) + rect(120, 162, 70, 24, 6) + text(155, 180, '500 g', 12)
    + p('M240 175 L280 175', stroke=DIM) + circ(260, 175, 8, stroke=DIM)
    + p('M110 150 Q120 110 200 106 Q280 110 290 150') + p('M110 150 L290 150', stroke=DIM)
    + fill('M130 150 Q140 126 200 124 Q260 126 270 150 Z')
    + text(200, 236, 'GRAMS, NOT CUPS', 11)
)
D['probe-thermometer'] = (
    fill('M70 200 Q70 110 200 102 Q330 110 330 200 Z') + p('M70 200 L330 200')
    + p('M200 160 L250 60', stroke_width=4) + rect(236, 24, 56, 40, 10) + text(264, 50, '208°F', 11)
    + p('M200 160 L204 152', stroke=DIM)
    + text(200, 240, 'CHECK THE INSIDE, NOT THE COLOR', 11)
)
D['grain-mill'] = (
    p('M120 60 L280 60 L240 120 L160 120 Z', fill=SOFT) + ''.join(circ(x, 78 + (i % 2) * 14, 5) for i, x in enumerate(range(150, 255, 18)))
    + rect(140, 120, 120, 60, 10) + p('M160 150 Q200 136 240 150', stroke=DIM)
    + p('M260 150 L300 150') + circ(312, 150, 12)
    + p('M160 180 L150 210 L250 210 L240 180', stroke=DIM) + ''.join(p(f'M{x} 198 l0 6', stroke=DIM) for x in range(165, 240, 12))
    + text(200, 246, 'WHOLE BERRIES IN, FRESH FLOUR OUT', 11)
)
D['aliquot-jar'] = (
    rect(140, 40, 120, 180, 8) + p('M140 40 L260 40', stroke_width=5)
    + fill('M140 150 L260 150 L260 220 L140 220 Z')
    + ''.join(dim(f'M260 {y} L300 {y}') + text(306, y + 4, s, 11, 'start') for y, s in ((150, '0%'), (120, '25%'), (90, '50%'), (60, '75%')))
    + circ(170, 180, 4) + circ(220, 190, 5) + circ(195, 205, 3)
    + text(200, 250, 'A SMALL SAMPLE THAT SHOWS THE REAL RISE', 11)
)
D['sourdough-starter'] = (
    rect(130, 40, 140, 190, 10) + p('M130 40 L270 40', stroke_width=5)
    + fill('M130 110 L270 110 L270 230 L130 230 Z')
    + dim('M120 170 L280 170') + text(292, 174, 'FED', 11, 'start') + text(292, 114, 'PEAK', 11, 'start')
    + circ(160, 140, 6) + circ(205, 130, 8) + circ(245, 150, 5) + circ(175, 185, 7) + circ(225, 200, 6) + circ(195, 160, 4)
    + text(200, 254, 'FLOUR, WATER, WILD YEAST AND BACTERIA', 11)
)
D['hydration'] = (
    fill('M60 200 Q90 120 150 124 Q210 120 240 200 Z') + p('M60 200 L240 200')
    + text(150, 232, 'FLOUR 100%', 11)
    + p('M300 90 Q270 130 270 150 Q270 176 300 178 Q330 176 330 150 Q330 130 300 90 Z', fill=SOFT)
    + text(300, 232, 'WATER 75%', 11)
    + text(200, 60, '75% HYDRATION', 13)
)
D['bakers-percentage'] = ''.join(
    rect(x, 200 - h, 44, h, 4, fill=SOFT) + text(x + 22, 222, lab, 10) + text(x + 22, 190 - h, pct, 11)
    for x, h, lab, pct in ((70, 130, 'FLOUR', '100%'), (150, 98, 'WATER', '75%'), (230, 26, 'STARTER', '20%'), (310, 6, 'SALT', '2%'))
) + p('M50 200 L370 200') + text(200, 250, 'EVERYTHING IS A PERCENT OF THE FLOUR', 11)
D['gluten'] = (
    ''.join(p(f'M{40+i*40} 60 Q{60+i*40} 130 {40+i*40} 200', stroke=DIM) for i in range(0, 9))
    + ''.join(p(f'M40 {70+j*32} Q200 {50+j*32} 360 {70+j*32}') for j in range(0, 5))
    + text(200, 246, 'THE STRETCHY NETWORK THAT HOLDS THE GAS', 11)
)
D['wheat-berry'] = (
    p('M180 30 Q280 90 260 180 Q230 236 180 240 Q130 236 100 180 Q80 90 180 30 Z', stroke_width=5, fill=SOFT)
    + p('M180 48 Q262 100 246 176 Q222 222 180 226 Q138 222 114 176 Q98 100 180 48 Z', stroke=DIM)
    + p('M180 60 L180 200', stroke=DIM)
    + ell(180, 196, 24, 18, fill=SOFT)
    + text(300, 100, 'BRAN', 11, 'start') + p('M272 100 L292 100', stroke=DIM)
    + text(300, 150, 'ENDOSPERM', 11, 'start') + p('M240 150 L292 150', stroke=DIM)
    + text(300, 206, 'GERM', 11, 'start') + p('M224 198 L292 202', stroke=DIM)
)
D['proofing'] = (
    p('M40 200 L360 200')
    + fill('M80 200 Q80 130 200 126 Q320 130 320 200 Z')
    + dim('M100 200 Q100 160 200 158 Q300 160 300 200')
    + circ(320, 60, 28) + p('M320 44 L320 60 L330 68')
    + arrow(200, 106, 200, 80)
    + text(200, 240, 'THE FINAL RISE BEFORE THE OVEN', 11)
)
D['kneading'] = (
    p('M50 206 L350 206')
    + fill('M110 206 Q104 150 170 146 L250 146 Q310 150 300 206 Z')
    + p('M250 146 Q270 150 290 170', stroke=DIM)
    + p('M60 150 Q80 110 130 120 L150 146') + p('M118 112 L126 126', stroke=DIM)
    + arrow(170, 110, 260, 112) + arrow(260, 128, 170, 130)
    + text(200, 240, 'PUSH, FOLD, TURN. UNTIL IT GOES SMOOTH.', 11)
)

CAPTIONS = {
    'windowpane-test': 'Stretch a piece of dough thin. If light shows through without it tearing, the gluten is developed.',
    'stretch-and-fold': 'Grab one side, stretch it up, and fold it over the top. Turn the bowl and repeat.',
    'coil-fold': 'Lift from the middle so both ends hang, then let them tuck under as you set it down.',
    'slap-and-fold': 'Lift, slap the far end down, fold the rest over. Wet dough tightens fast this way.',
    'scoring': 'A shallow cut at a low angle tells the loaf where to open.',
    'ear': 'The raised flap of crust along the score, lifted by oven spring.',
    'shaping': 'Tension on the surface, seam on the bottom. That skin is what holds the rise.',
    'pre-shape': 'A loose round first lets the dough relax before the final shape.',
    'poke-test': 'A floured finger dent that fills back slowly is a loaf ready to bake.',
    'lamination': 'Alternating layers of dough and butter, folded over and over.',
    'braiding': 'Outside strand over the middle, alternating sides.',
    'autolyse': 'Flour and water, rested before salt and leaven go in.',
    'tangzhong': 'A cooked flour paste that holds extra water for a softer, longer-lasting crumb.',
    'bulk-fermentation': 'The first rise, measured by how much the whole mass grows.',
    'oven-spring': 'The fast rise in the first minutes of baking, before the crust sets.',
    'oven-steam': 'Steam keeps the crust soft long enough for the loaf to finish expanding.',
    'cold-proof': 'A long, cold final rise in the fridge builds flavor and makes scoring easier.',
    'float-test': 'A spoonful that floats is full of gas. One that sinks may still be ready.',
    'crumb': 'The inside of the loaf: its holes, texture and tenderness.',
    'dense-crumb': 'Tight and heavy, usually from too little fermentation or weak gluten.',
    'gummy-crumb': 'A wet, sticky band, often from cutting too soon or underbaking.',
    'fools-crumb': 'A few giant holes with dense crumb around them: underfermented, not open.',
    'tunneling': 'A long cavity under the crust, usually from trapped gas during shaping.',
    'flying-crust': 'The top crust separates and lifts away from the crumb below it.',
    'pancaking': 'The loaf spreads sideways in the oven instead of rising up.',
    'blowout': 'The crust bursts where it was not scored, because the gas found its own exit.',
    'overproofed': 'Risen past its peak. The gluten is tired and the loaf will sink or spread.',
    'underproofed': 'Not enough rise yet. Bake it now and you get a tight, dense crumb.',
    'boule': 'A round loaf, from the French word for ball.',
    'batard': 'An oval loaf, shorter and fatter than a baguette.',
    'baguette': 'A long, thin loaf with a crackly crust, scored on the diagonal.',
    'banneton': 'The coiled basket that supports the dough during its final rise.',
    'lame': 'A razor blade on a handle, made for scoring dough.',
    'dutch-oven': 'A heavy lidded pot that traps steam from the dough itself.',
    'bench-scraper': 'A flat blade for dividing, lifting and shaping dough on the counter.',
    'digital-scale': 'Weigh everything in grams. Cups are a guess.',
    'probe-thermometer': 'Read the inside temperature to know the loaf is actually done.',
    'grain-mill': 'Turns whole wheat berries into fresh flour at home.',
    'aliquot-jar': 'A small straight-sided sample of dough that shows the true percentage rise.',
    'sourdough-starter': 'A living culture of flour, water, wild yeast and bacteria that leavens bread.',
    'hydration': 'Water as a percentage of flour weight. 750 g water on 1,000 g flour is 75%.',
    'bakers-percentage': 'Every ingredient expressed as a percent of the flour, which is always 100%.',
    'gluten': 'The stretchy protein network that traps gas and gives bread its structure.',
    'wheat-berry': 'The whole kernel: bran outside, endosperm inside, germ at the base.',
    'proofing': 'The final rise after shaping, right before the oven.',
    'kneading': 'Working the dough by hand to build gluten strength.',
}

ALTS = {k: f'Line drawing illustrating {k.replace("-", " ")}' for k in D}

manifest = {}
for k, body in D.items():
    name = k
    with open(f'{OUT}/{name}.svg', 'w') as f:
        f.write(svg(body, f'{name.replace("-", " ").title()} illustration'))
    manifest[k] = {'src': f'/illustrations/{name}.svg', 'alt': ALTS[k], 'caption': CAPTIONS[k]}

with open('src/data/illustrations.json', 'w') as f:
    json.dump(manifest, f, indent=2)
print(len(manifest), 'illustrations written')
