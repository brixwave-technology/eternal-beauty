# Fotografii Eternal Beauty

Profilul Instagram **@eternal.beauty_by_cosmina** nu a putut fi accesat din mediul
în care a fost generat portalul (rețeaua blochează instagram.com), așa că
site-urile pornesc cu **placeholdere generate** în paleta fiecărui design.

## Cum pui pozele reale (2 minute)

Salvează din Instagram (sau cere-i Cosminei originalele) și pune-le aici cu exact
aceste nume:

| Fișier         | Ce conține                                   | Unde apare                        |
| -------------- | -------------------------------------------- | --------------------------------- |
| `hero.jpg`     | poză de copertă, portret/verticală           | hero-ul celor 3 design-uri        |
| `portrait.jpg` | portret Cosmina                              | secțiunea „Despre”                |
| `post-01.jpg`  | … `post-08.jpg` — lucrări (gene, sprâncene)  | galerie / marquee / grid          |

Format recomandat: JPG, min. 1200px pe latura lungă, orientare verticală (4:5 ca pe Instagram).

Legendele și tag-urile se editează în `shared/eternal-data.js` → `photos`.

## Import automat (opțional)

`scripts/import-instagram.sh` descarcă ultimele postări publice cu
[Instaloader](https://instaloader.github.io/) și le redenumește după schema de mai sus.
Rulează-l de pe un calculator cu acces la Instagram.
