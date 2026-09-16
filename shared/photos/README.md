# Fotografii Eternal Beauty

Setul actual (`hero.jpg`, `portrait.jpg`, `post-01.jpg` … `post-12.jpg`) este **generat**:
ilustrații editoriale în paleta salonului, produse de `scripts/generate-photos.py`
(Pillow + numpy). Instagram nu a fost accesibil din mediul de generare, iar
serviciile de imagini AI cereau un plan plătit.

## Cum pui pozele reale (2 minute)

Suprascrie fișierele cu exact aceste nume:

| Fișier         | Ce conține                                       | Unde apare                          |
| -------------- | ------------------------------------------------ | ----------------------------------- |
| `hero.jpg`     | poză de copertă, verticală                       | hero-ul celor 3 design-uri          |
| `portrait.jpg` | portret Cosmina                                  | secțiunea „Despre”                  |
| `post-01.jpg`  | … `post-12.jpg` — lucrări (gene, sprâncene)      | galerie / marquee / grid            |
| `post-02.jpg` + `post-04.jpg` | perechea „după” / „înainte”       | sliderul din Atelier Minimal        |

Format recomandat: JPG, min. 1200px pe latura lungă, orientare verticală (4:5 ca pe Instagram).
Legendele și tag-urile se editează în `shared/eternal-data.js` → `photos`.

## Import automat (opțional)

`scripts/import-instagram.sh` descarcă ultimele postări publice cu
[Instaloader](https://instaloader.github.io/) și le redenumește după schema de mai sus.
Rulează-l de pe un calculator cu acces la Instagram. Pentru a regenera ilustrațiile:
`python3 scripts/generate-photos.py`.
