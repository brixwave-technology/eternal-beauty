#!/usr/bin/env python3
"""Generează setul de ilustrații (epilare laser & remodelare corporală) din shared/photos/.
Doar Pillow + numpy. Rulează: python3 scripts/generate-photos.py"""
import math, random, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), "..", "shared", "photos")
W, H, SS = 1000, 1250, 3
S, SH = W * SS, H * SS
random.seed(3); np.random.seed(3)

def hexc(h): h = h.lstrip("#"); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
def lerp(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def gradient_bg(c1, c2, cx=0.5, cy=0.35, c3=None):
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.sqrt(((x / W) - cx) ** 2 + ((y / H) - cy) ** 2)
    t = np.clip(d / 0.9, 0, 1)[..., None]
    img = np.array(c1, np.float32) * (1 - t) + np.array(c2, np.float32) * t
    if c3:
        g = (y / H)[..., None]; img = img * (1 - 0.3 * g) + np.array(c3, np.float32) * 0.3 * g
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), "RGB")

def bokeh(img, n, color, rmin, rmax, alpha=40):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    for _ in range(n):
        r = random.randint(rmin, rmax); x = random.randint(-r, img.width + r); y = random.randint(-r, img.height + r)
        d.ellipse([x - r, y - r, x + r, y + r], fill=color + (random.randint(alpha // 2, alpha),))
    layer = layer.filter(ImageFilter.GaussianBlur(rmin * 0.6))
    return Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")

def grain(img, amount=7):
    n = np.random.normal(0, amount, (img.height, img.width, 1)).astype(np.float32)
    return Image.fromarray(np.clip(np.asarray(img).astype(np.float32) + n, 0, 255).astype(np.uint8), "RGB")

def vignette(img, strength=0.3):
    y, x = np.mgrid[0:img.height, 0:img.width].astype(np.float32)
    d = np.sqrt(((x / img.width) - 0.5) ** 2 + ((y / img.height) - 0.5) ** 2)
    m = 1 - strength * np.clip((d - 0.35) / 0.45, 0, 1) ** 1.5
    return Image.fromarray(np.clip(np.asarray(img).astype(np.float32) * m[..., None], 0, 255).astype(np.uint8), "RGB")

def bez(p0, p1, p2, p3, n=40):
    pts = []
    for i in range(n + 1):
        t = i / n; u = 1 - t
        pts.append((u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0], u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1]))
    return pts

def stroke(d, pts, color, w0, w1, alpha=255):
    for i in range(len(pts) - 1):
        t = i / max(1, len(pts) - 2); w = max(1, int(w0 + (w1 - w0) * t))
        d.line([pts[i], pts[i + 1]], fill=color + (alpha,), width=w)
    r = max(1, w1 // 2); x, y = pts[-1]; d.ellipse([x - r, y - r, x + r, y + r], fill=color + (alpha,))

def compose(bg, draw_fn, blur=0.7):
    big = Image.new("RGBA", (S, SH), (0, 0, 0, 0)); d = ImageDraw.Draw(big); draw_fn(d)
    big = big.resize((W, H), Image.LANCZOS)
    if blur: big = big.filter(ImageFilter.GaussianBlur(blur))
    return Image.alpha_composite(bg.convert("RGBA"), big).convert("RGB")

def glow(img, cx, cy, r, color, alpha=120):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color + (alpha,))
    layer = layer.filter(ImageFilter.GaussianBlur(r * 0.55))
    return Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")

def particles(img, color, n=160, rmax=4):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    for _ in range(n):
        r = random.randint(1, rmax); x = random.randint(0, img.width); y = random.randint(0, img.height)
        d.ellipse([x - r, y - r, x + r, y + r], fill=color + (random.randint(90, 220),))
    return Image.alpha_composite(img.convert("RGBA"), layer.filter(ImageFilter.GaussianBlur(1))).convert("RGB")

def finish(img, name, g=6, v=0.28):
    vignette(grain(img, g), v).save(os.path.join(OUT, name), "JPEG", quality=86, optimize=True, progressive=True); print("✓", name)

# ---------- paletă clinică ----------
PETROL, PETROL_2, TEAL, MINT = hexc("#0f2a2e"), hexc("#17393e"), hexc("#3f8f8a"), hexc("#b9e0d6")
SAND, WHITE, SKIN, SKIN_2, INK = hexc("#e9d9c5"), hexc("#f7f6f2"), hexc("#f0d5c3"), hexc("#e3bfa9"), hexc("#1d2426")
CHROME, CHROME_2, ICE, WARM = hexc("#cfd6db"), hexc("#8b979f"), hexc("#dff3ff"), hexc("#f3b27a")

# ---------- forme ----------
def skin_limb(d, pts_top, pts_bot, color=SKIN, shade=SKIN_2):
    """membru (picior/braț) din două curbe; umbră pe marginea inferioară"""
    d.polygon(pts_top + pts_bot, fill=color + (255,))
    stroke(d, pts_bot, shade, 26, 26, 120)
    # highlight
    hl = [(x, y + 30) for (x, y) in pts_top[4:-4]]
    stroke(d, hl, (255, 255, 255), 10, 10, 90)

def leg(d, x0, y0, x1, y1, thick, color=SKIN):
    a = math.atan2(y1 - y0, x1 - x0); nx, ny = -math.sin(a), math.cos(a)
    top = bez((x0 + nx * thick * .5, y0 + ny * thick * .5), (x0 + (x1 - x0) * .3 + nx * thick * .62, y0 + (y1 - y0) * .3 + ny * thick * .62), (x0 + (x1 - x0) * .7 + nx * thick * .48, y0 + (y1 - y0) * .7 + ny * thick * .48), (x1 + nx * thick * .38, y1 + ny * thick * .38), 40)
    bot = bez((x1 - nx * thick * .38, y1 - ny * thick * .38), (x0 + (x1 - x0) * .7 - nx * thick * .5, y0 + (y1 - y0) * .7 - ny * thick * .5), (x0 + (x1 - x0) * .3 - nx * thick * .6, y0 + (y1 - y0) * .3 - ny * thick * .6), (x0 - nx * thick * .5, y0 - ny * thick * .5), 40)
    skin_limb(d, top, bot, color)
    return top, bot

def handpiece(d, x, y, angle_deg, size=1.0, color=CHROME, dark=INK, cable=True):
    """piesă de mână laser orientată spre (x,y) (vârful), cu cablu"""
    a = math.radians(angle_deg); L = 520 * size; wdt = 150 * size
    ux, uy = math.cos(a), math.sin(a); nx, ny = -uy, ux
    tip = (x, y); back = (x - ux * L, y - uy * L)
    poly = [(tip[0] + nx * wdt * .55, tip[1] + ny * wdt * .55), (back[0] + nx * wdt * .38, back[1] + ny * wdt * .38), (back[0] - nx * wdt * .38, back[1] - ny * wdt * .38), (tip[0] - nx * wdt * .55, tip[1] - ny * wdt * .55)]
    d.polygon(poly, fill=color + (255,))
    # cap întunecat
    cap = [(tip[0] + nx * wdt * .55, tip[1] + ny * wdt * .55), (tip[0] - ux * 70 * size + nx * wdt * .5, tip[1] - uy * 70 * size + ny * wdt * .5), (tip[0] - ux * 70 * size - nx * wdt * .5, tip[1] - uy * 70 * size - ny * wdt * .5), (tip[0] - nx * wdt * .55, tip[1] - ny * wdt * .55)]
    d.polygon(cap, fill=dark + (255,))
    # buton/lumină
    bx, by = x - ux * L * .5, y - uy * L * .5
    d.ellipse([bx - 16 * size, by - 16 * size, bx + 16 * size, by + 16 * size], fill=TEAL + (255,))
    # highlight
    stroke(d, [(back[0] + nx * wdt * .2, back[1] + ny * wdt * .2), (tip[0] - ux * 90 * size + nx * wdt * .3, tip[1] - uy * 90 * size + ny * wdt * .3)], (255, 255, 255), 8, 8, 110)
    if cable:
        stroke(d, bez(back, (back[0] - ux * 300 + nx * 200, back[1] - uy * 300 + ny * 200), (back[0] - ux * 500 - nx * 300, back[1] - uy * 500 - ny * 300), (back[0] - ux * 900, back[1] - uy * 900 + 200), 40), dark, 14, 12, 230)
    return tip

def light_cone(img, tip, angle_deg, length, color=ICE, alpha=150, spread=28):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    a = math.radians(angle_deg); s = math.radians(spread)
    p = [(tip[0] / SS, tip[1] / SS), ((tip[0] + math.cos(a - s) * length) / SS, (tip[1] + math.sin(a - s) * length) / SS), ((tip[0] + math.cos(a + s) * length) / SS, (tip[1] + math.sin(a + s) * length) / SS)]
    d.polygon(p, fill=color + (alpha,))
    layer = layer.filter(ImageFilter.GaussianBlur(14))
    return Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")

def frost(d, cx, cy, r, color=ICE, n=14):
    for k in range(n):
        a = math.radians(k * 360 / n + random.uniform(-6, 6)); L = r * random.uniform(.6, 1)
        stroke(d, [(cx + math.cos(a) * r * .3, cy + math.sin(a) * r * .3), (cx + math.cos(a) * L, cy + math.sin(a) * L)], color, 6, 1, 200)
        for s in (-1, 1):
            m = L * .6; px, py = cx + math.cos(a) * m, cy + math.sin(a) * m
            b = a + s * math.radians(35)
            stroke(d, [(px, py), (px + math.cos(b) * L * .22, py + math.sin(b) * L * .22)], color, 4, 1, 180)

def body_silhouette(d, cx, top, height, color=SKIN):
    """corp feminin stilizat, față, brațe ușor depărtate"""
    h = height; u = h / 100
    head_r = 6 * u
    d.ellipse([cx - head_r, top, cx + head_r, top + 2 * head_r], fill=color + (255,))
    neck = top + 2 * head_r
    d.rectangle([cx - 2.2 * u, neck - 1 * u, cx + 2.2 * u, neck + 4 * u], fill=color + (255,))
    # trunchi
    torso = bez((cx - 12 * u, neck + 4 * u), (cx - 16 * u, neck + 18 * u), (cx - 7 * u, neck + 26 * u), (cx - 12 * u, neck + 40 * u), 30) + \
            bez((cx + 12 * u, neck + 40 * u), (cx + 7 * u, neck + 26 * u), (cx + 16 * u, neck + 18 * u), (cx + 12 * u, neck + 4 * u), 30)
    d.polygon(torso, fill=color + (255,))
    d.rounded_rectangle([cx - 12 * u, neck + 4 * u, cx + 12 * u, neck + 9 * u], radius=int(3 * u), fill=color + (255,))
    # brațe
    for sx in (-1, 1):
        stroke(d, bez((cx + sx * 12 * u, neck + 6 * u), (cx + sx * 19 * u, neck + 18 * u), (cx + sx * 20 * u, neck + 30 * u), (cx + sx * 21 * u, neck + 42 * u), 30), color, int(5.5 * u), int(4 * u))
    # picioare
    for sx in (-1, 1):
        stroke(d, bez((cx + sx * 6 * u, neck + 40 * u), (cx + sx * 7 * u, neck + 55 * u), (cx + sx * 5 * u, neck + 70 * u), (cx + sx * 5 * u, neck + 92 * u), 40), color, int(8.5 * u), int(4.5 * u))
    return u, neck

os.makedirs(OUT, exist_ok=True)

# hero.jpg — piesă laser pe gambă, con de lumină, fundal petrol
bg = gradient_bg(PETROL_2, PETROL, cx=0.6, cy=0.55); bg = glow(bg, int(W * .58), int(H * .55), 220, TEAL, 90)
def hero(d):
    leg(d, S * -0.05, SH * 1.02, S * 0.72, SH * 0.5, 320)
    handpiece(d, S * 0.55, SH * 0.6, 125, 1.05)
img = compose(bg, hero); img = light_cone(img, (S * 0.55, SH * 0.6), 125, 420, ICE, 130, 22)
finish(particles(img, ICE, 140, 3), "hero.jpg", 8, 0.22)

# portrait.jpg — Cosmina în halat alb
bg = gradient_bg(hexc("#eaf3f0"), MINT, cx=0.5, cy=0.3)
def portrait(d):
    cx, cy = S * 0.5, SH * 0.42
    d.ellipse([cx - S * .28, cy - S * .34, cx + S * .28, cy + S * .40], fill=hexc("#3a2a24") + (255,))
    d.rounded_rectangle([cx - S * .07, cy + S * .14, cx + S * .07, cy + S * .34], radius=50, fill=SKIN_2 + (255,))
    # halat
    d.ellipse([cx - S * .56, cy + S * .28, cx + S * .56, cy + S * .98], fill=WHITE + (255,))
    d.polygon([(cx - S * .2, cy + S * .3), (cx, cy + S * .6), (cx + S * .2, cy + S * .3), (cx + S * .1, cy + S * .28), (cx, cy + S * .42), (cx - S * .1, cy + S * .28)], fill=hexc("#e2ebe7") + (255,))
    d.rectangle([cx - S * .03, cy + S * .42, cx + S * .03, cy + S * .98], fill=hexc("#e2ebe7") + (255,))
    d.ellipse([cx - S * .19, cy - S * .26, cx + S * .19, cy + S * .21], fill=SKIN + (255,))
    d.chord([cx - S * .22, cy - S * .34, cx + S * .22, cy - S * .04], 200, 340, fill=hexc("#3a2a24") + (255,))
    for sx in (-1, 1):
        stroke(d, bez((cx + sx * S * .04, cy - S * .05), (cx + sx * S * .08, cy - S * .075), (cx + sx * S * .11, cy - S * .07), (cx + sx * S * .13, cy - S * .06), 10), hexc("#3a2a24"), 8, 4)
        stroke(d, [(cx + sx * S * .045, cy - S * .01), (cx + sx * S * .115, cy - S * .015)], hexc("#3a2a24"), 6, 3)
    d.ellipse([cx - S * .05, cy + S * .10, cx + S * .05, cy + S * .13], fill=hexc("#c9737a") + (220,))
    # ecuson
    d.rounded_rectangle([cx + S * .12, cy + S * .5, cx + S * .3, cy + S * .56], radius=12, fill=TEAL + (255,))
finish(compose(bg, portrait, 0.5), "portrait.jpg", 5, 0.2)

# post-01 — laser axile: braț ridicat + piesă + lumină
bg = gradient_bg(hexc("#f3efe8"), SAND, cx=0.4, cy=0.3)
def p1(d):
    # trunchi lateral + braț ridicat
    d.polygon([(S * .05, SH * 1.05), (S * .1, SH * .55), (S * .25, SH * .42), (S * .45, SH * .5), (S * .55, SH * 1.05)], fill=SKIN + (255,))
    stroke(d, bez((S * .32, SH * .48), (S * .3, SH * .3), (S * .45, SH * .12), (S * .7, SH * .02), 40), SKIN, 230, 170)
    d.ellipse([S * .29, SH * .47, S * .42, SH * .58], fill=SKIN_2 + (255,))
    handpiece(d, S * .37, SH * .52, 200, .95)
img = compose(bg, p1); img = light_cone(img, (S * .37, SH * .52), 200, 260, ICE, 120, 24)
finish(img, "post-01.jpg")

# post-02 — DUPĂ: picioare netede, lucioase
bg = bokeh(gradient_bg(hexc("#f8f5f0"), hexc("#e6ded4"), cx=0.5, cy=0.3), 6, (255, 255, 255), 60, 150, 60)
def p2(d):
    leg(d, S * .28, SH * 1.1, S * .42, SH * -0.05, 330)
    leg(d, S * .62, SH * 1.1, S * .7, SH * -0.05, 330)
    for x in (S * .32, S * .64):
        stroke(d, [(x, SH * .95), (x + S * .08, SH * .05)], (255, 255, 255), 22, 14, 150)
finish(compose(bg, p2), "post-02.jpg")

# post-03 — criolipoliză: trunchi + aplicator cu cristale
bg = gradient_bg(hexc("#e8f1f3"), hexc("#c3d9dd"), cx=0.5, cy=0.35)
def p3(d):
    torso = bez((S * .2, SH * -.05), (S * .12, SH * .35), (S * .28, SH * .6), (S * .22, SH * 1.05), 40) + bez((S * .78, SH * 1.05), (S * .72, SH * .6), (S * .88, SH * .35), (S * .8, SH * -.05), 40)
    d.polygon(torso, fill=SKIN + (255,))
    d.ellipse([S * .47, SH * .48, S * .53, SH * .53], fill=SKIN_2 + (255,))
    # aplicator
    d.rounded_rectangle([S * .3, SH * .52, S * .7, SH * .78], radius=120, fill=CHROME + (255,))
    d.rounded_rectangle([S * .34, SH * .56, S * .66, SH * .7], radius=90, fill=hexc("#f4f8fa") + (255,))
    d.rectangle([S * .46, SH * .74, S * .54, SH * 1.05], fill=INK + (255,))
    frost(d, S * .5, SH * .63, S * .11, hexc("#7fb8c9"), 12)
    frost(d, S * .22, SH * .3, S * .06, hexc("#9fd0de"), 8); frost(d, S * .8, SH * .2, S * .05, hexc("#9fd0de"), 8)
finish(compose(bg, p3), "post-03.jpg")

# post-04 — ÎNAINTE: aceleași picioare, cu puncte (fire)
bg = bokeh(gradient_bg(hexc("#f8f5f0"), hexc("#e6ded4"), cx=0.5, cy=0.3), 6, (255, 255, 255), 60, 150, 60)
def p4(d):
    random.seed(9)
    leg(d, S * .28, SH * 1.1, S * .42, SH * -0.05, 330)
    leg(d, S * .62, SH * 1.1, S * .7, SH * -0.05, 330)
    for _ in range(900):
        x = random.uniform(S * .2, S * .85); y = random.uniform(0, SH)
        # doar pe picioare (aprox.)
        lx1 = S * .28 + (S * .42 - S * .28) * (1 - y / SH); lx2 = S * .62 + (S * .7 - S * .62) * (1 - y / SH)
        if abs(x - lx1) < 140 or abs(x - lx2) < 140:
            d.ellipse([x - 4, y - 4, x + 4, y + 4], fill=hexc("#5a4a44") + (170,))
finish(compose(bg, p4), "post-04.jpg")

# post-05 — full body: siluetă + zone marcate
bg = gradient_bg(WHITE, hexc("#e4ebe8"), cx=0.5, cy=0.3)
def p5(d):
    u, neck = body_silhouette(d, S * .5, SH * .06, SH * .9)
    zones = [(S * .5 - 20 * u, neck + 10 * u, "axile"), (S * .5 - 22 * u, neck + 26 * u, "brațe"), (S * .5 - 12 * u, neck + 38 * u, "inghinal"), (S * .5 - 13 * u, neck + 60 * u, "coapse"), (S * .5 - 12 * u, neck + 82 * u, "gambe")]
    for (x, y, lab) in zones:
        d.rounded_rectangle([x, y - 5 * u, x + 24 * u + (x < S * .5) * 0, y + 5 * u], radius=int(5 * u), outline=TEAL + (255,), width=6)
        d.ellipse([x - 5 * u, y - 2.5 * u, x, y + 2.5 * u], fill=TEAL + (255,))
    # bară de lumină verticală
    d.rectangle([S * .5 - 2, SH * .05, S * .5 + 2, SH * .98], fill=TEAL + (60,))
finish(compose(bg, p5), "post-05.jpg")

# post-06 — aparat laser medical
bg = gradient_bg(hexc("#f2f4f5"), hexc("#d7dee2"), cx=0.5, cy=0.3)
def p6(d):
    d.rectangle([0, SH * .8, S, SH], fill=hexc("#dfe5e8") + (255,))
    d.rounded_rectangle([S * .28, SH * .28, S * .72, SH * .82], radius=70, fill=WHITE + (255,))
    d.rounded_rectangle([S * .3, SH * .3, S * .7, SH * .5], radius=50, fill=INK + (255,))
    d.rounded_rectangle([S * .34, SH * .34, S * .66, SH * .46], radius=30, fill=PETROL_2 + (255,))
    for i in range(4):
        d.rounded_rectangle([S * (.36 + i * .075), SH * .40, S * (.36 + i * .075) + 90, SH * .43], radius=15, fill=TEAL + (255,))
    d.ellipse([S * .44, SH * .58, S * .56, SH * .66], fill=hexc("#e7ecef") + (255,))
    d.ellipse([S * .47, SH * .6, S * .53, SH * .64], fill=TEAL + (255,))
    for x in (S * .34, S * .66):
        d.ellipse([x - 40, SH * .8, x + 40, SH * .85], fill=CHROME_2 + (255,))
    handpiece(d, S * .82, SH * .62, -60, .85, cable=False)
    stroke(d, bez((S * .72, SH * .55), (S * .85, SH * .35), (S * .95, SH * .45), (S * .82 - 400, SH * .62 + 300), 40), INK, 14, 12, 230)
finish(compose(bg, p6, .5), "post-06.jpg", 5, .24)

# post-07 — interior clinică
bg = gradient_bg(hexc("#f4f1ec"), hexc("#dcd8d1"), cx=0.5, cy=0.2)
def p7(d):
    d.rectangle([0, SH * .7, S, SH], fill=hexc("#e4dcd2") + (255,))
    d.line([(0, SH * .7), (S, SH * .7)], fill=hexc("#c9bfb2") + (255,), width=6)
    d.rounded_rectangle([S * .55, SH * .16, S * .92, SH * .5], radius=40, fill=hexc("#eef6f3") + (255,), outline=WHITE + (255,), width=18)
    # pat tratament
    d.rounded_rectangle([S * .08, SH * .58, S * .72, SH * .68], radius=50, fill=WHITE + (255,))
    d.rounded_rectangle([S * .1, SH * .55, S * .3, SH * .6], radius=30, fill=hexc("#dce9e4") + (255,))
    for x in (S * .16, S * .64):
        d.rectangle([x, SH * .68, x + 26, SH * .9], fill=CHROME_2 + (255,))
    # aparat
    d.rounded_rectangle([S * .78, SH * .48, S * .96, SH * .86], radius=40, fill=WHITE + (255,))
    d.rounded_rectangle([S * .8, SH * .5, S * .94, SH * .58], radius=20, fill=INK + (255,))
    # plantă
    d.rounded_rectangle([S * .06, SH * .82, S * .16, SH * .96], radius=24, fill=hexc("#cfae9c") + (255,))
    for k in range(9):
        a = math.radians(-160 + k * 20); L = S * random.uniform(.1, .18); x0, y0 = S * .11, SH * .82
        stroke(d, bez((x0, y0), (x0 + math.cos(a) * L * .5, y0 + math.sin(a) * L * .5 - 40), (x0 + math.cos(a) * L * .8, y0 + math.sin(a) * L * .8 - 30), (x0 + math.cos(a) * L, y0 + math.sin(a) * L), 14), TEAL, 34, 4)
finish(compose(bg, p7, .5), "post-07.jpg", 5, .26)

# post-08 — Cosmina la lucru: mănuși + piesă pe gambă
bg = gradient_bg(hexc("#f3efe8"), SAND, cx=0.5, cy=0.4)
def p8(d):
    leg(d, S * -0.05, SH * .95, S * 1.05, SH * .55, 300)
    handpiece(d, S * .5, SH * .66, 115, 1.0)
    for (x0, y0, x1, y1, w) in [(S * .95, SH * .02, S * .62, SH * .34, 120), (S * 1.02, SH * .12, S * .68, SH * .4, 110)]:
        stroke(d, [(x0, y0), (x1, y1)], hexc("#7fb0c4"), w, int(w * .8))
img = compose(bg, p8); img = light_cone(img, (S * .5, SH * .66), 115, 300, ICE, 120, 22)
finish(img, "post-08.jpg")

# post-09 — cavitație: coapsă + aplicator rotund cu unde
bg = gradient_bg(hexc("#eef3f2"), hexc("#cfdfda"), cx=0.5, cy=0.35)
def p9(d):
    leg(d, S * -0.05, SH * .7, S * 1.05, SH * .45, 520)
    cx, cy = S * .5, SH * .58
    d.ellipse([cx - 150, cy - 150, cx + 150, cy + 150], fill=CHROME + (255,))
    d.ellipse([cx - 100, cy - 100, cx + 100, cy + 100], fill=WHITE + (255,))
    d.ellipse([cx - 30, cy - 30, cx + 30, cy + 30], fill=TEAL + (255,))
    stroke(d, bez((cx, cy - 150), (cx - 100, cy - 400), (cx + 300, cy - 600), (cx + 500, cy - 900), 30), INK, 14, 12, 230)
    for r in (230, 320, 410):
        d.arc([cx - r, cy - r, cx + r, cy + r], 200, 340, fill=TEAL + (140,), width=8)
finish(compose(bg, p9), "post-09.jpg")

# post-10 — drenaj limfatic: picioare în cizme de presoterapie
bg = gradient_bg(hexc("#f1f3f5"), hexc("#d5dde3"), cx=0.5, cy=0.3)
def p10(d):
    for x in (S * .33, S * .67):
        d.rounded_rectangle([x - 150, SH * .1, x + 150, SH * .92], radius=140, fill=hexc("#22333a") + (255,))
        for k in range(7):
            y = SH * (.16 + k * .11)
            d.rounded_rectangle([x - 135, y, x + 135, y + SH * .085], radius=60, fill=hexc("#2f4650") + (255,))
            d.line([(x - 100, y + SH * .02), (x + 100, y + SH * .02)], fill=TEAL + (160,), width=5)
        d.rounded_rectangle([x - 40, SH * .04, x + 40, SH * .14], radius=30, fill=SKIN + (255,))
    stroke(d, [(S * .33, SH * .92), (S * .5, SH * 1.05)], INK, 14, 12, 230); stroke(d, [(S * .67, SH * .92), (S * .5, SH * 1.05)], INK, 14, 12, 230)
finish(compose(bg, p10, .5), "post-10.jpg", 5, .24)

# post-11 — tunel cu infraroșu: arcadă cu lumină caldă
bg = gradient_bg(hexc("#2a1a14"), hexc("#120b09"), cx=0.5, cy=0.55); bg = glow(bg, int(W * .5), int(H * .55), 260, WARM, 130)
def p11(d):
    for i, r in enumerate((S * .42, S * .36, S * .3, S * .24)):
        d.arc([S * .5 - r, SH * .55 - r, S * .5 + r, SH * .55 + r], 180, 360, fill=lerp(WARM, (255, 240, 220), i / 4) + (200 - i * 30,), width=int(26 - i * 4))
    d.rectangle([S * .08, SH * .55, S * .92, SH * .6], fill=hexc("#3b2a22") + (255,))
    leg(d, S * .1, SH * .62, S * .9, SH * .56, 200, color=SKIN)
img = compose(bg, p11); finish(particles(img, WARM, 120, 3), "post-11.jpg", 8, .22)

# post-12 — laser față: profil + piesă mică lângă buză
bg = gradient_bg(hexc("#f6f1ec"), hexc("#e7d9cf"), cx=0.4, cy=0.35)
def p12(d):
    prof = bez((S * .25, SH * -.05), (S * .55, SH * .1), (S * .5, SH * .35), (S * .62, SH * .42), 30) + bez((S * .62, SH * .42), (S * .52, SH * .48), (S * .6, SH * .55), (S * .55, SH * .6), 20) + bez((S * .55, SH * .6), (S * .58, SH * .68), (S * .48, SH * .75), (S * .45, SH * 1.05), 20) + [(S * -.05, SH * 1.05), (S * -.05, SH * -.05)]
    d.polygon(prof, fill=SKIN + (255,))
    d.chord([S * -.15, SH * -.1, S * .5, SH * .45], 150, 400, fill=hexc("#3a2a24") + (255,))
    d.ellipse([S * .3, SH * .3, S * .38, SH * .34], fill=hexc("#3a2a24") + (255,))
    d.ellipse([S * .53, SH * .61, S * .6, SH * .64], fill=hexc("#c9737a") + (220,))
    handpiece(d, S * .6, SH * .56, 200, .7)
img = compose(bg, p12); img = light_cone(img, (S * .6, SH * .56), 200, 160, ICE, 110, 26)
finish(img, "post-12.jpg")
print("gata")
