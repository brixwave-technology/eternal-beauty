#!/usr/bin/env python3
"""Generează setul de ilustrații editoriale din shared/photos/ (fără dependențe externe
în afară de Pillow + numpy). Rulează: python3 scripts/generate-photos.py"""
import math, random, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

OUT = os.path.join(os.path.dirname(__file__), "..", "shared", "photos")
W, H, SS = 1000, 1250, 3  # 4:5, supersampling
random.seed(7); np.random.seed(7)

def hexc(h): h = h.lstrip("#"); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
def lerp(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def gradient_bg(w, h, c1, c2, c3=None, cx=0.5, cy=0.35):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((x / w) - cx) ** 2 + ((y / h) - cy) ** 2)
    t = np.clip(d / 0.9, 0, 1)[..., None]
    a, b = np.array(c1, np.float32), np.array(c2, np.float32)
    img = a * (1 - t) + b * t
    if c3:
        g = (y / h)[..., None]
        img = img * (1 - 0.35 * g) + np.array(c3, np.float32) * 0.35 * g
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), "RGB")

def bokeh(img, n, color, rmin, rmax, alpha=40):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    for _ in range(n):
        r = random.randint(rmin, rmax); x = random.randint(-r, img.width + r); y = random.randint(-r, img.height + r)
        d.ellipse([x - r, y - r, x + r, y + r], fill=color + (random.randint(alpha // 2, alpha),))
    layer = layer.filter(ImageFilter.GaussianBlur(rmin * 0.6))
    return Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")

def grain(img, amount=10):
    n = np.random.normal(0, amount, (img.height, img.width, 1)).astype(np.float32)
    a = np.clip(np.asarray(img).astype(np.float32) + n, 0, 255).astype(np.uint8)
    return Image.fromarray(a, "RGB")

def vignette(img, strength=0.35):
    y, x = np.mgrid[0:img.height, 0:img.width].astype(np.float32)
    d = np.sqrt(((x / img.width) - 0.5) ** 2 + ((y / img.height) - 0.5) ** 2)
    m = 1 - strength * np.clip((d - 0.35) / 0.45, 0, 1) ** 1.5
    a = np.clip(np.asarray(img).astype(np.float32) * m[..., None], 0, 255).astype(np.uint8)
    return Image.fromarray(a, "RGB")

def bez(p0, p1, p2, p3, n=40):
    pts = []
    for i in range(n + 1):
        t = i / n; u = 1 - t
        pts.append((u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0],
                    u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1]))
    return pts

def stroke(d, pts, color, w0, w1, alpha=255):
    """linie cu grosime variabilă (tapered)"""
    for i in range(len(pts) - 1):
        t = i / max(1, len(pts) - 2); w = max(1, int(w0 + (w1 - w0) * t))
        d.line([pts[i], pts[i + 1]], fill=color + (alpha,), width=w)
    r = max(1, w1 // 2); x, y = pts[-1]; d.ellipse([x - r, y - r, x + r, y + r], fill=color + (alpha,))

def lash_fan(d, base, angle_deg, length, color, count=3, spread=10, thick=6, curl=0.55):
    for k in range(count):
        a = math.radians(angle_deg + (k - (count - 1) / 2) * spread / max(1, count - 1) * 1.6)
        L = length * random.uniform(0.85, 1.05)
        p0 = base
        p1 = (base[0] + math.cos(a) * L * 0.35, base[1] + math.sin(a) * L * 0.35)
        p2 = (base[0] + math.cos(a) * L * 0.75 - math.sin(a) * L * curl * 0.35, base[1] + math.sin(a) * L * 0.75 + math.cos(a) * L * curl * 0.35 * (-1 if math.sin(a) < 0 else 1))
        p3 = (base[0] + math.cos(a) * L - math.sin(a) * L * curl, base[1] + math.sin(a) * L + math.cos(a) * L * curl * (-1 if math.sin(a) < 0 else 1))
        stroke(d, bez(p0, p1, p2, p3, 18), color, thick, 1)

def closed_eye(d, cx, cy, wdt, color, lash_color, density=1.0, lash_len=1.0, brow=True, brow_color=None, skin=None):
    # pleoapă: arc superior
    p0, p3 = (cx - wdt / 2, cy), (cx + wdt / 2, cy - wdt * 0.05)
    p1, p2 = (cx - wdt * 0.2, cy - wdt * 0.28), (cx + wdt * 0.25, cy - wdt * 0.3)
    lid = bez(p0, p1, p2, p3, 60)
    # pliu
    crease = [(x, y - wdt * 0.11 - (wdt * 0.06) * math.sin(math.pi * i / len(lid))) for i, (x, y) in enumerate(lid)]
    stroke(d, crease[6:-6], color, 4, 2, 120)
    stroke(d, lid, color, 5, 10)
    stroke(d, lid, color, 10, 4)
    # gene în jos (ochi închis)
    n = int(38 * density)
    for i in range(n):
        t = 0.06 + 0.9 * i / n
        idx = int(t * (len(lid) - 1)); bx, by = lid[idx]
        ang = 60 + 60 * t  # de la stânga (jos-stânga) spre dreapta (jos-dreapta)
        ang = 55 + 70 * t
        L = wdt * (0.16 + 0.1 * math.sin(math.pi * t)) * lash_len * random.uniform(0.85, 1.1)
        lash_fan(d, (bx, by + 2), ang, L, lash_color, count=1 if density < 0.8 else random.choice([1, 2, 3]), spread=6, thick=max(3, int(7 * SS / 3)), curl=0.6)
    if brow:
        bc = brow_color or color
        b0, b3 = (cx - wdt * 0.55, cy - wdt * 0.42), (cx + wdt * 0.62, cy - wdt * 0.5)
        b1, b2 = (cx - wdt * 0.2, cy - wdt * 0.62), (cx + wdt * 0.3, cy - wdt * 0.66)
        spine = bez(b0, b1, b2, b3, 70)
        # corp moale al sprâncenei, apoi fire
        body = [(x, y - wdt * (0.05 - 0.035 * (i / len(spine)))) for i, (x, y) in enumerate(spine)] + [(x, y + wdt * (0.035 - 0.02 * (i / len(spine)))) for i, (x, y) in reversed(list(enumerate(spine)))]
        d.polygon(body, fill=bc + (70,))
        for i in range(0, len(spine) - 1, 1):
            t = i / len(spine); x, y = spine[i]
            for k in range(3):
                h = wdt * (0.085 - 0.06 * t) * random.uniform(0.7, 1.1)
                a = math.radians(-100 + 60 * t + random.uniform(-10, 10))
                stroke(d, [(x + random.uniform(-6, 6), y + h * 0.45), (x + math.cos(a) * h, y + math.sin(a) * h)], bc, 8, 2, 190)

def open_eye(d, cx, cy, wdt, color, iris_col, lash_color, skin):
    hgt = wdt * 0.42
    top = bez((cx - wdt / 2, cy), (cx - wdt * 0.2, cy - hgt), (cx + wdt * 0.25, cy - hgt * 1.05), (cx + wdt / 2, cy - wdt * 0.03), 60)
    bot = bez((cx + wdt / 2, cy - wdt * 0.03), (cx + wdt * 0.2, cy + hgt * 0.6), (cx - wdt * 0.2, cy + hgt * 0.55), (cx - wdt / 2, cy), 60)
    d.polygon(top + bot, fill=(250, 248, 245, 255))
    # iris
    r = hgt * 0.62; ix, iy = cx + wdt * 0.02, cy - hgt * 0.15
    d.ellipse([ix - r, iy - r, ix + r, iy + r], fill=iris_col + (255,))
    for k in range(90):
        a = random.uniform(0, 2 * math.pi); l = r * random.uniform(0.35, 0.98)
        stroke(d, [(ix + math.cos(a) * r * 0.3, iy + math.sin(a) * r * 0.3), (ix + math.cos(a) * l, iy + math.sin(a) * l)], lerp(iris_col, (255, 255, 255), 0.35), 3, 1, 110)
    pr = r * 0.42; d.ellipse([ix - pr, iy - pr, ix + pr, iy + pr], fill=(20, 16, 18, 255))
    hr = r * 0.2; d.ellipse([ix - r * 0.45 - hr, iy - r * 0.5 - hr, ix - r * 0.45 + hr, iy - r * 0.5 + hr], fill=(255, 255, 255, 230))
    # mască pleoapă (pielea acoperă partea de sus a irisului)
    mask = Image.new("L", d._image.size, 0); md = ImageDraw.Draw(mask); md.polygon(top + bot, fill=255)
    # linii
    stroke(d, top, color, 6, 12); stroke(d, top, color, 12, 5)
    stroke(d, bot, color, 3, 2, 150)
    n = 34
    for i in range(n):
        t = 0.05 + 0.92 * i / n; idx = int(t * (len(top) - 1)); bx, by = top[idx]
        ang = -150 + 120 * t
        L = wdt * (0.14 + 0.1 * math.sin(math.pi * t)) * random.uniform(0.85, 1.1)
        lash_fan(d, (bx, by - 2), ang, L, lash_color, count=random.choice([1, 2, 3]), spread=7, thick=7, curl=0.5)
    for i in range(14):
        t = 0.1 + 0.8 * i / 14; idx = int(t * (len(bot) - 1)); bx, by = bot[idx]
        stroke(d, [(bx, by), (bx + random.uniform(-6, 6), by + wdt * 0.05)], lash_color, 4, 1, 180)
    return mask

def brow_only(d, cx, cy, wdt, color, laminated=True):
    b0, b3 = (cx - wdt / 2, cy), (cx + wdt / 2, cy - wdt * 0.12)
    b1, b2 = (cx - wdt * 0.15, cy - wdt * 0.22), (cx + wdt * 0.25, cy - wdt * 0.28)
    spine = bez(b0, b1, b2, b3, 110)
    body = [(x, y - wdt * (0.09 - 0.065 * (i / len(spine)))) for i, (x, y) in enumerate(spine)] + [(x, y + wdt * (0.06 - 0.04 * (i / len(spine)))) for i, (x, y) in reversed(list(enumerate(spine)))]
    d.polygon(body, fill=color + (80,))
    for i in range(len(spine) - 1):
        t = i / len(spine); x, y = spine[i]
        for k in range(4):
            h = wdt * (0.17 - 0.115 * t) * random.uniform(0.75, 1.05)
            a = math.radians((-105 + 70 * t) + (random.uniform(-5, 5) if laminated else random.uniform(-28, 28)))
            stroke(d, [(x + random.uniform(-8, 8), y + h * 0.5), (x + math.cos(a) * h, y + math.sin(a) * h)], color, 10, 2, 200)

def particles(img, color, n=160, rmax=5):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    for _ in range(n):
        r = random.randint(1, rmax); x = random.randint(0, img.width); y = random.randint(0, img.height)
        d.ellipse([x - r, y - r, x + r, y + r], fill=color + (random.randint(90, 220),))
    layer = layer.filter(ImageFilter.GaussianBlur(1.2))
    return Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")

def compose(bg, draw_fn, blur=0.8):
    big = Image.new("RGBA", (W * SS, H * SS), (0, 0, 0, 0)); d = ImageDraw.Draw(big)
    draw_fn(d)
    big = big.resize((W, H), Image.LANCZOS)
    if blur: big = big.filter(ImageFilter.GaussianBlur(blur))
    return Image.alpha_composite(bg.convert("RGBA"), big).convert("RGB")

def finish(img, name, grain_amt=7, vig=0.3):
    img = vignette(grain(img, grain_amt), vig)
    img.save(os.path.join(OUT, name), "JPEG", quality=86, optimize=True, progressive=True)
    print("✓", name)

S = W * SS; SH = H * SS
INK, PLUM, TAUPE, GOLD, SAGE = hexc("#2a1f22"), hexc("#3d1f2b"), hexc("#6b5a52"), hexc("#c9a46b"), hexc("#7f8c7a")
IVORY, BLUSH, ROSE, SAND, CREAM = hexc("#f6ede6"), hexc("#efcfc7"), hexc("#d8a2a4"), hexc("#e9d9c8"), hexc("#fbf6f1")

os.makedirs(OUT, exist_ok=True)

# hero.jpg — ochi închis dramatic, fundal întunecat cald cu pulbere aurie
bg = gradient_bg(W, H, hexc("#4a3238"), hexc("#17111a"), cx=0.5, cy=0.4); bg = bokeh(bg, 6, GOLD, 60, 160, 28)
img = compose(bg, lambda d: closed_eye(d, S * 0.5, SH * 0.5, S * 0.72, hexc("#f2e2d6"), hexc("#f6ece2"), density=1.15, lash_len=1.2, brow_color=hexc("#e9d3c4")))
finish(particles(img, GOLD, 220, 4), "hero.jpg", 9, 0.25)

# portrait.jpg — bust stilizat, fundal blush
def portrait(d):
    cx, cy = S * 0.5, SH * 0.42
    # păr
    d.ellipse([cx - S * 0.30, cy - S * 0.36, cx + S * 0.30, cy + S * 0.42], fill=hexc("#3b2a26") + (255,))
    # gât + umeri
    d.rounded_rectangle([cx - S * 0.075, cy + S * 0.16, cx + S * 0.075, cy + S * 0.36], radius=60, fill=hexc("#e8c7b6") + (255,))
    d.ellipse([cx - S * 0.55, cy + S * 0.30, cx + S * 0.55, cy + S * 0.95], fill=hexc("#f3e2da") + (255,))
    # față
    d.ellipse([cx - S * 0.20, cy - S * 0.27, cx + S * 0.20, cy + S * 0.22], fill=hexc("#f0d2c2") + (255,))
    # păr peste frunte
    d.chord([cx - S * 0.24, cy - S * 0.36, cx + S * 0.24, cy - S * 0.05], 200, 340, fill=hexc("#3b2a26") + (255,))
    # ochi închiși + sprâncene
    closed_eye(d, cx - S * 0.085, cy - S * 0.02, S * 0.13, hexc("#4a3530"), hexc("#2a1f22"), density=0.9, lash_len=0.9)
    closed_eye(d, cx + S * 0.085, cy - S * 0.02, S * 0.13, hexc("#4a3530"), hexc("#2a1f22"), density=0.9, lash_len=0.9)
    # nas + buze
    stroke(d, bez((cx - S * 0.01, cy + S * 0.02), (cx - S * 0.02, cy + S * 0.07), (cx - S * 0.015, cy + S * 0.09), (cx + S * 0.01, cy + S * 0.095), 20), hexc("#c99a86"), 5, 3, 160)
    d.ellipse([cx - S * 0.055, cy + S * 0.125, cx + S * 0.055, cy + S * 0.165], fill=hexc("#c9737a") + (230,))
    d.rectangle([cx - S * 0.06, cy + S * 0.125, cx + S * 0.06, cy + S * 0.145], fill=hexc("#f0d2c2") + (255,))
    d.ellipse([cx - S * 0.055, cy + S * 0.12, cx + S * 0.055, cy + S * 0.15], fill=hexc("#d68a8e") + (230,))
    # cercei
    for sx in (-1, 1):
        d.ellipse([cx + sx * S * 0.2 - 12, cy + S * 0.1 - 12, cx + sx * S * 0.2 + 12, cy + S * 0.1 + 12], fill=GOLD + (255,))
bg = gradient_bg(W, H, hexc("#fbeee8"), hexc("#e6c3bb"), cx=0.5, cy=0.3)
finish(compose(bg, portrait, 0.6), "portrait.jpg", 6, 0.22)

# post-01 — volum 2D, close-up ochi închis, blush
bg = bokeh(gradient_bg(W, H, hexc("#f7e6df"), hexc("#d9aaa8"), cx=0.4, cy=0.3), 8, (255, 255, 255), 40, 120, 60)
finish(compose(bg, lambda d: closed_eye(d, S * 0.52, SH * 0.52, S * 0.8, hexc("#3a2a2c"), hexc("#241a1d"), density=1.2, lash_len=1.15, brow_color=hexc("#4a3530"))), "post-01.jpg")

# post-02 — laminare gene (DUPĂ): ochi deschis, gene curbate, ivoriu
bg = bokeh(gradient_bg(W, H, hexc("#fbf6f1"), hexc("#e6d3c6"), cx=0.55, cy=0.3), 6, hexc("#f3d3c9"), 60, 150, 70)
finish(compose(bg, lambda d: open_eye(d, S * 0.5, SH * 0.5, S * 0.78, hexc("#3a2a2c"), hexc("#6f8a7a"), hexc("#241a1d"), IVORY)), "post-02.jpg")

# post-03 — sprâncene laminate, salvie
bg = bokeh(gradient_bg(W, H, hexc("#eef0ea"), hexc("#c5cdbf"), cx=0.5, cy=0.35), 5, (255, 255, 255), 60, 160, 60)
def p3(d):
    brow_only(d, S * 0.5, SH * 0.42, S * 0.78, hexc("#3a2a2c"), laminated=True)
    closed_eye(d, S * 0.5, SH * 0.72, S * 0.66, hexc("#4a3530"), hexc("#2a1f22"), density=0.9, lash_len=0.9, brow=False)
finish(compose(bg, p3), "post-03.jpg")

# post-04 — ÎNAINTE: gene naturale rare, aceeași compoziție ca post-02
bg = bokeh(gradient_bg(W, H, hexc("#fbf6f1"), hexc("#e6d3c6"), cx=0.55, cy=0.3), 6, hexc("#f3d3c9"), 60, 150, 70)
def p4(d):
    random.seed(11)
    hgt = S * 0.78 * 0.42; cx, cy, wdt = S * 0.5, SH * 0.5, S * 0.78
    top = bez((cx - wdt / 2, cy), (cx - wdt * 0.2, cy - hgt), (cx + wdt * 0.25, cy - hgt * 1.05), (cx + wdt / 2, cy - wdt * 0.03), 60)
    bot = bez((cx + wdt / 2, cy - wdt * 0.03), (cx + wdt * 0.2, cy + hgt * 0.6), (cx - wdt * 0.2, cy + hgt * 0.55), (cx - wdt / 2, cy), 60)
    d.polygon(top + bot, fill=(250, 248, 245, 255))
    r = hgt * 0.62; ix, iy = cx + wdt * 0.02, cy - hgt * 0.15
    d.ellipse([ix - r, iy - r, ix + r, iy + r], fill=hexc("#6f8a7a") + (255,))
    pr = r * 0.42; d.ellipse([ix - pr, iy - pr, ix + pr, iy + pr], fill=(20, 16, 18, 255))
    hr = r * 0.2; d.ellipse([ix - r * 0.45 - hr, iy - r * 0.5 - hr, ix - r * 0.45 + hr, iy - r * 0.5 + hr], fill=(255, 255, 255, 230))
    stroke(d, top, hexc("#3a2a2c"), 5, 8); stroke(d, bot, hexc("#3a2a2c"), 3, 2, 150)
    for i in range(16):
        t = 0.08 + 0.85 * i / 16; idx = int(t * (len(top) - 1)); bx, by = top[idx]
        a = math.radians(-120 + 60 * t + random.uniform(-10, 10)); L = wdt * 0.07 * random.uniform(0.7, 1.1)
        stroke(d, [(bx, by), (bx + math.cos(a) * L, by + math.sin(a) * L)], hexc("#3a2a2c"), 5, 1, 200)
finish(compose(bg, p4), "post-04.jpg")

# post-05 — mega volume, fundal prună întunecat
bg = bokeh(gradient_bg(W, H, hexc("#5a2f3c"), hexc("#241419"), cx=0.5, cy=0.35), 5, ROSE, 60, 160, 30)
finish(particles(compose(bg, lambda d: closed_eye(d, S * 0.5, SH * 0.52, S * 0.82, hexc("#f4dfd6"), hexc("#fbf1ea"), density=1.6, lash_len=1.35, brow_color=hexc("#e9cfc4"))), BLUSH, 120, 3), "post-05.jpg", 9, 0.25)

# post-06 — proces: mapare, linii de ghidaj și pensete
bg = gradient_bg(W, H, hexc("#f4efe8"), hexc("#d9cfc3"), cx=0.5, cy=0.3)
def p6(d):
    cx, cy, wdt = S * 0.5, SH * 0.5, S * 0.74
    closed_eye(d, cx, cy, wdt, hexc("#3a2a2c"), hexc("#241a1d"), density=1.0, lash_len=1.0, brow=False)
    # linii de mapare
    for k in range(7):
        x = cx - wdt * 0.42 + k * wdt * 0.14
        d.line([(x, cy - wdt * 0.22), (x, cy + wdt * 0.28)], fill=ROSE + (170,), width=3)
        d.ellipse([x - 9, cy - wdt * 0.25 - 9, x + 9, cy - wdt * 0.25 + 9], fill=ROSE + (255,))
    # pensetă
    stroke(d, [(S * 0.78, SH * 0.88), (S * 0.62, SH * 0.60)], hexc("#7d7f86"), 26, 8)
    stroke(d, [(S * 0.80, SH * 0.885), (S * 0.645, SH * 0.605)], hexc("#a5a7ad"), 22, 6)
finish(compose(bg, p6), "post-06.jpg")

# post-07 — interior studio: oglindă cu ring light, plantă, fotoliu
bg = gradient_bg(W, H, hexc("#f3e9e2"), hexc("#d8c2b6"), cx=0.5, cy=0.2)
def p7(d):
    # perete + podea
    d.rectangle([0, SH * 0.72, S, SH], fill=hexc("#e2d2c6") + (255,))
    d.line([(0, SH * 0.72), (S, SH * 0.72)], fill=hexc("#c9b3a4") + (255,), width=6)
    # oglindă
    d.ellipse([S * 0.22, SH * 0.16, S * 0.78, SH * 0.6], fill=hexc("#f8f1ec") + (255,), outline=GOLD + (255,), width=22)
    d.ellipse([S * 0.24, SH * 0.175, S * 0.76, SH * 0.585], outline=(255, 255, 255, 160), width=40)
    # reflexie fereastră
    d.rounded_rectangle([S * 0.36, SH * 0.25, S * 0.5, SH * 0.45], radius=30, fill=(255, 255, 255, 110))
    # consolă
    d.rounded_rectangle([S * 0.14, SH * 0.62, S * 0.86, SH * 0.66], radius=20, fill=hexc("#b89a86") + (255,))
    for x in (S * 0.18, S * 0.80):
        d.rectangle([x, SH * 0.66, x + 22, SH * 0.9], fill=hexc("#8e7362") + (255,))
    # sticluțe
    for i, c in enumerate([ROSE, GOLD, SAGE]):
        x = S * 0.3 + i * S * 0.07
        d.rounded_rectangle([x, SH * 0.55, x + 40, SH * 0.62], radius=14, fill=c + (255,))
    # plantă
    d.rounded_rectangle([S * 0.66, SH * 0.5, S * 0.74, SH * 0.62], radius=18, fill=hexc("#cfae9c") + (255,))
    for k in range(9):
        a = math.radians(-160 + k * 20); L = S * random.uniform(0.09, 0.16)
        x0, y0 = S * 0.70, SH * 0.5
        stroke(d, bez((x0, y0), (x0 + math.cos(a) * L * 0.5, y0 + math.sin(a) * L * 0.5 - 40), (x0 + math.cos(a) * L * 0.8, y0 + math.sin(a) * L * 0.8 - 30), (x0 + math.cos(a) * L, y0 + math.sin(a) * L), 14), SAGE, 34, 4)
    # fotoliu
    d.rounded_rectangle([S * 0.05, SH * 0.66, S * 0.34, SH * 0.98], radius=90, fill=hexc("#e9c9bf") + (255,))
    d.rounded_rectangle([S * 0.08, SH * 0.8, S * 0.31, SH * 0.9], radius=40, fill=hexc("#f3dcd4") + (255,))
finish(compose(bg, p7, 0.5), "post-07.jpg", 6, 0.28)

# post-08 — Cosmina la lucru: mâini cu pensete deasupra unui ochi
bg = bokeh(gradient_bg(W, H, hexc("#f7e9e3"), hexc("#dcbfb6"), cx=0.5, cy=0.4), 6, (255, 255, 255), 50, 130, 55)
def p8(d):
    closed_eye(d, S * 0.5, SH * 0.62, S * 0.7, hexc("#3a2a2c"), hexc("#241a1d"), density=1.1, lash_len=1.05, brow_color=hexc("#4a3530"))
    # mănuși/degete stilizate
    for (x0, y0, x1, y1, w) in [(S * 0.05, SH * 0.05, S * 0.36, SH * 0.36, 120), (S * 0.14, SH * 0.0, S * 0.42, SH * 0.3, 110), (S * 0.98, SH * 0.1, S * 0.66, SH * 0.4, 120), (S * 0.9, SH * 0.0, S * 0.62, SH * 0.33, 110)]:
        stroke(d, [(x0, y0), (x1, y1)], hexc("#2b2a30"), w, int(w * 0.8))
    # pensete
    stroke(d, [(S * 0.36, SH * 0.36), (S * 0.47, SH * 0.55)], hexc("#a5a7ad"), 20, 5)
    stroke(d, [(S * 0.66, SH * 0.4), (S * 0.55, SH * 0.56)], hexc("#a5a7ad"), 20, 5)
finish(compose(bg, p8), "post-08.jpg")

# post-09 — evantai de gene macro pe fundal auriu
bg = bokeh(gradient_bg(W, H, hexc("#e9d3b7"), hexc("#b58e5f"), cx=0.5, cy=0.35), 8, (255, 240, 220), 50, 150, 60)
def p9(d):
    for i in range(5):
        base = (S * (0.2 + i * 0.15), SH * 0.72)
        lash_fan(d, base, -90 + (i - 2) * 6, S * 0.28, hexc("#1d1517"), count=[1, 2, 3, 4, 5][i], spread=14, thick=8, curl=0.4)
        d.ellipse([base[0] - 10, base[1] - 10, base[0] + 10, base[1] + 10], fill=hexc("#1d1517") + (255,))
    d.line([(S * 0.12, SH * 0.74), (S * 0.88, SH * 0.74)], fill=(255, 255, 255, 120), width=6)
finish(compose(bg, p9), "post-09.jpg")

# post-10 — pensat & vopsit: sprânceană cu henna, ton cald
bg = bokeh(gradient_bg(W, H, hexc("#f6e7dd"), hexc("#d6b3a5"), cx=0.5, cy=0.35), 5, (255, 255, 255), 60, 140, 60)
def p10(d):
    brow_only(d, S * 0.5, SH * 0.45, S * 0.8, hexc("#5a3a2e"), laminated=False)
    closed_eye(d, S * 0.5, SH * 0.74, S * 0.66, hexc("#4a3530"), hexc("#2a1f22"), density=0.95, lash_len=0.95, brow=False)
finish(compose(bg, p10), "post-10.jpg")

# post-11 — produse premium: sticluțe și pensule
bg = gradient_bg(W, H, hexc("#f8f2ed"), hexc("#dfd0c4"), cx=0.5, cy=0.3)
def p11(d):
    d.rectangle([0, SH * 0.7, S, SH], fill=hexc("#ead9cd") + (255,))
    items = [(S * 0.2, SH * 0.42, 130, 420, PLUM), (S * 0.36, SH * 0.5, 100, 300, GOLD), (S * 0.5, SH * 0.38, 150, 480, hexc("#f1e4dc")), (S * 0.68, SH * 0.52, 110, 270, ROSE), (S * 0.82, SH * 0.45, 90, 380, SAGE)]
    for (x, y, w, h, c) in items:
        d.rounded_rectangle([x - w / 2, y, x + w / 2, y + h], radius=int(w * 0.35), fill=c + (255,))
        d.rounded_rectangle([x - w * 0.3, y - 70, x + w * 0.3, y + 10], radius=20, fill=hexc("#2a1f22") + (255,))
        d.rounded_rectangle([x - w * 0.42, y + h * 0.3, x + w * 0.42, y + h * 0.62], radius=16, fill=(255, 255, 255, 190))
    # pensule
    for i in range(3):
        x = S * 0.28 + i * 60
        stroke(d, [(x, SH * 0.95), (x + 40, SH * 0.72)], hexc("#3a2a2c"), 16, 10); stroke(d, [(x + 40, SH * 0.72), (x + 52, SH * 0.66)], ROSE, 22, 6)
finish(compose(bg, p11, 0.5), "post-11.jpg", 6, 0.25)

# post-12 — privire naturală 1D, ton neutru
bg = bokeh(gradient_bg(W, H, hexc("#f5efe9"), hexc("#d5c6bb"), cx=0.45, cy=0.35), 6, (255, 255, 255), 50, 140, 60)
finish(compose(bg, lambda d: open_eye(d, S * 0.5, SH * 0.5, S * 0.76, hexc("#3a2a2c"), hexc("#7a5a45"), hexc("#241a1d"), IVORY)), "post-12.jpg")
print("gata")
