/* =====================================================================
   ETERNAL BEAUTY by Cosmina — sursa unică de date pentru cele 3 design-uri
   ---------------------------------------------------------------------
   ⚠️  DATE PROVIZORII. Profilul Instagram nu a putut fi accesat din mediul
   în care s-a generat portalul, așa că textele marcate cu [PLACEHOLDER]
   și fotografiile trebuie înlocuite cu cele reale de pe
   https://www.instagram.com/eternal.beauty_by_cosmina/
   (vezi shared/photos/README.md și scripts/import-instagram.sh).

   Toate cele 3 site-uri citesc din acest fișier: modifici aici, se schimbă
   peste tot.
   ===================================================================== */
window.ETERNAL = {
  brand: {
    name: "Eternal Beauty",
    by: "by Cosmina",
    tagline: "Gene & sprâncene lucrate cu răbdare, pentru o frumusețe care rămâne.",
    shortIntro:
      "Studio dedicat privirii tale: extensii de gene, laminare, styling de sprâncene și tratamente delicate, într-un spațiu intim, doar pentru tine.",
    instagramHandle: "eternal.beauty_by_cosmina",
    instagramUrl: "https://www.instagram.com/eternal.beauty_by_cosmina/",
    phone: "+40 7xx xxx xxx", // [PLACEHOLDER]
    whatsapp: "407xxxxxxxx", // [PLACEHOLDER] doar cifre, cu prefix de țară
    email: "contact@eternalbeauty.ro", // [PLACEHOLDER]
    address: "Str. Exemplu nr. 1, Oraș", // [PLACEHOLDER]
    city: "România", // [PLACEHOLDER]
    mapsUrl: "https://maps.google.com/?q=Eternal+Beauty+by+Cosmina", // [PLACEHOLDER]
    schedule: [
      { days: "Luni – Vineri", hours: "10:00 – 19:00" },
      { days: "Sâmbătă", hours: "10:00 – 15:00" },
      { days: "Duminică", hours: "Închis" },
    ],
    bookingNote: "Programările se fac exclusiv cu confirmare prealabilă.",
  },

  founder: {
    name: "Cosmina",
    role: "Lash & Brow Artist · Fondatoare",
    story: [
      "Am pornit Eternal Beauty dintr-o pasiune simplă: să văd cum o privire se transformă atunci când este pusă în valoare corect, fără exagerări.",
      "Lucrez fiecare set ca pe o piesă unică. Aleg curbura, lungimea și densitatea în funcție de forma ochiului, de stilul tău și de cât de natural vrei să arate rezultatul.",
      "Igiena, produsele premium și timpul acordat fiecărei cliente nu sunt opționale. Sunt promisiunea mea.",
    ],
    credentials: [
      "Certificare extensii gene 1D · 2D–3D · Mega Volume", // [PLACEHOLDER]
      "Specializare laminare gene & sprâncene", // [PLACEHOLDER]
      "Peste 5 ani de experiență", // [PLACEHOLDER]
    ],
  },

  services: [
    {
      id: "gene-1d",
      name: "Extensii gene 1D",
      subtitle: "Efect natural, fir cu fir",
      description:
        "Aplicare individuală, pentru o privire deschisă și definită, care arată ca a ta, doar mai bună.",
      duration: "~ 2h",
      price: null, // ex: 180 → afișat „180 lei”; null → „la cerere”
    },
    {
      id: "gene-volum",
      name: "Extensii gene 2D–3D",
      subtitle: "Volum moale, textură pufoasă",
      description:
        "Evantaie fine, lucrate manual, pentru densitate fără greutate. Ideal pentru gene naturale rare.",
      duration: "~ 2h 30",
      price: null,
    },
    {
      id: "gene-mega",
      name: "Mega Volume",
      subtitle: "Dramatic, dar ușor",
      description:
        "Volum maxim cu fire ultra‑fine. Pentru ocazii speciale sau pentru cele care iubesc un look intens.",
      duration: "~ 3h",
      price: null,
    },
    {
      id: "laminare-gene",
      name: "Laminare gene + vopsit",
      subtitle: "Curbură naturală 6–8 săptămâni",
      description:
        "Ridică și fixează genele naturale, le hrănește cu keratină și le intensifică culoarea. Zero întreținere zilnică.",
      duration: "~ 1h",
      price: null,
    },
    {
      id: "laminare-sprancene",
      name: "Laminare sprâncene",
      subtitle: "Brow lift · formă disciplinată",
      description:
        "Fixează firele în direcția dorită, umple vizual golurile și dă efectul de sprâncene pieptănate și pline.",
      duration: "~ 1h",
      price: null,
    },
    {
      id: "styling-sprancene",
      name: "Pensat & vopsit sprâncene",
      subtitle: "Formă corectată după trăsăturile tale",
      description:
        "Mapare, pensat cu ață sau pensetă, vopsire cu henna sau vopsea profesională, pentru un contur curat.",
      duration: "~ 45 min",
      price: null,
    },
  ],

  process: [
    { step: "Consultație", text: "Discutăm despre stilul dorit, analizăm genele/sprâncenele naturale și alegem tehnica potrivită." },
    { step: "Pregătire", text: "Curățare, izolare și mapare. Totul steril, de unică folosință acolo unde se poate." },
    { step: "Aplicare", text: "Lucrez în liniște, cu răbdare. Tu te relaxezi, poți chiar să adormi." },
    { step: "Îngrijire", text: "Primești ghid de întreținere și recomandarea pentru următoarea întreținere." },
  ],

  testimonials: [
    { name: "Andreea M.", text: "Cel mai natural set de gene pe care l-am avut vreodată. Cosmina are o răbdare de aur și un ochi pentru detalii.", service: "Extensii 2D" }, // [PLACEHOLDER]
    { name: "Ioana P.", text: "Laminarea de sprâncene mi-a schimbat complet fața, în sensul bun. Nu mai folosesc creion deloc.", service: "Laminare sprâncene" }, // [PLACEHOLDER]
    { name: "Raluca D.", text: "Spațiu curat, muzică liniștită, produse bune. Am adormit la aplicare și m-am trezit cu o privire de revistă.", service: "Mega Volume" }, // [PLACEHOLDER]
  ],

  faq: [
    { q: "Cât durează extensiile de gene?", a: "Un set complet ține 3–4 săptămâni, cu întreținere recomandată la 2–3 săptămâni, în funcție de ciclul natural al genelor." },
    { q: "Doare?", a: "Nu. Stai cu ochii închiși, într-o poziție confortabilă. Majoritatea clientelor adorm." },
    { q: "Pot purta machiaj?", a: "Da, dar evită produsele pe bază de ulei în zona ochilor și rimelul waterproof pe extensii." },
    { q: "Cum mă programez?", a: "Prin mesaj pe Instagram sau WhatsApp. Confirm data și ora și îți trimit recomandările de dinaintea ședinței." },
  ],

  /* Fotografii: pune fișierele reale în shared/photos/ cu exact aceste nume.
     Dacă un fișier lipsește, site-urile afișează automat un placeholder. */
  photos: [
    { src: "post-01.jpg", alt: "Set extensii gene volum, prim-plan", tag: "Volum 2D" },
    { src: "post-02.jpg", alt: "Laminare gene, înainte și după", tag: "Laminare" },
    { src: "post-03.jpg", alt: "Sprâncene laminate și vopsite", tag: "Brow lift" },
    { src: "post-04.jpg", alt: "Extensii gene efect natural 1D", tag: "Natural 1D" },
    { src: "post-05.jpg", alt: "Mega volume, privire dramatică", tag: "Mega Volume" },
    { src: "post-06.jpg", alt: "Detaliu mapare gene", tag: "Proces" },
    { src: "post-07.jpg", alt: "Interior studio Eternal Beauty", tag: "Studio" },
    { src: "post-08.jpg", alt: "Cosmina la lucru", tag: "Cosmina" },
    { src: "portrait.jpg", alt: "Portret Cosmina, fondatoare Eternal Beauty", tag: "Portret" },
    { src: "hero.jpg", alt: "Privire cu extensii de gene, fotografie de copertă", tag: "Cover" },
  ],
};

/* Utilitare comune celor 3 design-uri */
window.ETERNAL.util = {
  photoPath(file) {
    return "../../shared/photos/" + file;
  },
  waLink(text) {
    const b = window.ETERNAL.brand;
    return "https://wa.me/" + b.whatsapp + "?text=" + encodeURIComponent(text || "Bună! Aș dori o programare la Eternal Beauty.");
  },
  priceLabel(p) {
    return p == null ? "la cerere" : p + " lei";
  },
  /* placeholder SVG generat cu paleta design-ului, folosit când lipsește poza */
  placeholder(label, a, b, fg) {
    const svg =
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 1000'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs>` +
      `<rect width='800' height='1000' fill='url(#g)'/>` +
      `<ellipse cx='400' cy='520' rx='230' ry='120' fill='none' stroke='${fg}' stroke-opacity='.35' stroke-width='3'/>` +
      `<ellipse cx='400' cy='520' rx='90' ry='90' fill='${fg}' fill-opacity='.18'/>` +
      `<text x='400' y='880' font-family='Georgia, serif' font-size='30' fill='${fg}' fill-opacity='.7' text-anchor='middle'>${label.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</text>` +
      `<text x='400' y='920' font-family='sans-serif' font-size='18' fill='${fg}' fill-opacity='.5' text-anchor='middle'>foto Instagram · de înlocuit</text>` +
      `</svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  },
  bindPlaceholders(a, b, fg) {
    const swap = (img) => {
      if (img.dataset.fallback) return;
      img.dataset.fallback = "1";
      img.src = window.ETERNAL.util.placeholder(img.dataset.photo || img.alt, a, b, fg);
    };
    document.querySelectorAll("img[data-photo]").forEach((img) => {
      img.addEventListener("error", () => swap(img));
      /* imaginile din HTML pot eșua înainte să ruleze scriptul */
      if (img.complete && img.naturalWidth === 0) swap(img);
    });
  },
};
