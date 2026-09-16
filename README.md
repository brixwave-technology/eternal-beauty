# Portal Brixwave × Eternal Beauty by Cosmina

Portal de prezentare prin care clienta (Eternal Beauty by Cosmina) alege unul dintre
**trei design-uri complete** de site. Prețul este **1.250 RON pentru oricare** dintre ele
și îi este comunicat imediat după alegere, împreună cu pașii următori.

```
index.html                     ← portalul Brixwave (alegere design + preț + confirmare)
assets/brixwave.{css,js}       ← stil + logică portal (config în capul lui brixwave.js)
designs/01-lumiere/            ← Design 1: luminos, glass & pearl, poveste sticky, pan orizontal
designs/02-blush-editorial/    ← Design 2: editorial, roz prăfuit & prună
designs/03-obsidian/           ← Design 3: întunecat, chrome & orhidee, preloader, sticky stack
shared/eternal-data.js         ← TOATE datele salonului (o singură sursă pentru cele 3 site-uri)
shared/photos/                 ← fotografiile (vezi README-ul de acolo)
scripts/import-instagram.sh    ← import automat al postărilor publice (Instaloader)
.claude/skills/                ← skill-uri de design instalate (vezi mai jos)
```

## Rulare locală

Site-urile sunt statice, fără build. Deschide `index.html` direct sau, mai bine:

```bash
python3 -m http.server 8080
# http://localhost:8080/
```

Funcționează și pe GitHub Pages / Netlify / orice hosting static (rădăcina repo-ului).

## GitHub Pages

Repo-ul conține `.github/workflows/pages.yml`, care publică rădăcina repo-ului la fiecare push.
Activare (o singură dată): **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Adresa portalului va fi `https://brixwave-technology.github.io/eternal-beauty/`.
Alternativ, „Deploy from a branch” cu ramura curentă și folderul `/ (root)` funcționează la fel.

## Ce trebuie completat înainte de a trimite portalul clientei

1. **Telefonul și WhatsApp-ul salonului** în `shared/eternal-data.js` (`brand.phone`,
   `brand.whatsapp`). Restul conținutului (8 servicii cu prețuri orientative, proces,
   îngrijire, politici, 6 testimoniale, 8 întrebări) este complet și se ajustează după
   lista reală a Cosminei.
2. **Fotografiile** în `shared/photos/`: setul actual este generat (ilustrații editoriale,
   `scripts/generate-photos.py`). Suprascrie-le cu pozele reale, păstrând numele
   (detalii în `shared/photos/README.md`).
3. **Contact Brixwave** în `assets/brixwave.js` → `BRIXWAVE.email` / `BRIXWAVE.whatsapp`.
   Confirmarea alegerii ajunge acolo, cu designul ales în mesaj.

## Skill-uri instalate (`.claude/skills/`)

| Sursă | Skill-uri |
| --- | --- |
| Emil Kowalski (`emilkowalski/skills`) | `emil-design-eng`, `animate`, `review-animations`, `improve-animations`, `find-animation-opportunities`, `animation-vocabulary`, `prototype`, `apple-design`, `pick-ui-library` |
| Taste Skill (`Leonxlnx/taste-skill`) | `taste-skill` (design-taste-frontend v2), `soft-skill`, `redesign-skill`, `minimalist-skill`, `output-skill`, `gpt-tasteskill` |
| Impeccable (`pbakaus/impeccable`) | `impeccable` + 36 referințe (`/impeccable polish`, `audit`, `critique`, `animate`, `bolder`, `quieter` …) |

Impeccable a fost compilat direct din sursă (bundle-ul semnat de pe GitHub Releases nu era
accesibil). Launcher-ul `scripts/impeccable` descarcă motorul la prima rulare pe un calculator
cu acces la GitHub.
