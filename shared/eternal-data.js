/* =====================================================================
   ETERNAL BEAUTY by Cosmina — sursa unică de date pentru cele 3 design-uri
   ---------------------------------------------------------------------
   Date preluate de pe Instagram (@eternal.beauty_by_cosmina):
   „Eternal Beauty – epilare definitivă laser medicală @remodelare.
    Epilare definitivă / remodelare corporală MEDICALĂ. De peste 8 ani
    garantăm rezultate. Sighetu Marmației, str. Bogdan Vodă bl. C6 ·
    Vișeu de Sus, str. Zorilor.” 207 postări · 1.920 urmăritori.

   Lista de servicii, prețurile și numărul de ședințe sunt orientative
   (piața din România, 2026) și se ajustează după lista reală a clinicii.
   Telefonul/WhatsApp trebuie completate mai jos.
   ===================================================================== */
window.ETERNAL = {
  brand: {
    name: "Eternal Beauty",
    by: "by Cosmina",
    category: "Epilare definitivă laser · Remodelare corporală medicală",
    tagline: "Piele netedă definitiv. Corp remodelat medical. Rezultate garantate de peste 8 ani.",
    shortIntro:
      "Clinică de epilare definitivă cu laser medical și remodelare corporală, în Sighetu Marmației și Vișeu de Sus. Aparatură medicală certificată, protocoale sigure pentru orice tip de piele, rezultate garantate de peste 8 ani.",
    instagramHandle: "eternal.beauty_by_cosmina",
    instagramUrl: "https://www.instagram.com/eternal.beauty_by_cosmina/",
    phone: "+40 7xx xxx xxx", // ← completează numărul real
    whatsapp: "40700000000", // ← doar cifre, cu prefixul de țară (ex: 40722123456)
    email: "eternal.beauty.by.cosmina@gmail.com",
    address: "Sighetu Marmației, str. Bogdan Vodă bl. C6 · Vișeu de Sus, str. Zorilor",
    city: "Sighetu Marmației · Vișeu de Sus",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bogdan+Vod%C4%83+bl+C6+Sighetu+Marma%C8%9Biei",
    schedule: [
      { days: "Luni – Vineri", hours: "10:00 – 19:00" },
      { days: "Sâmbătă", hours: "10:00 – 14:00" },
      { days: "Duminică", hours: "Închis" },
    ],
    bookingNote: "Programările se fac cu confirmare prealabilă, prin mesaj pe WhatsApp sau Instagram. Prima consultație este gratuită și include testul de piele.",
    since: 2016,
  },

  locations: [
    {
      id: "sighet",
      city: "Sighetu Marmației",
      address: "Str. Bogdan Vodă, bl. C6",
      note: "Clinica principală · epilare laser & remodelare corporală",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bogdan+Vod%C4%83+bl+C6+Sighetu+Marma%C8%9Biei",
    },
    {
      id: "viseu",
      city: "Vișeu de Sus",
      address: "Str. Zorilor",
      note: "Punct de lucru · epilare laser, pe programare",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Str+Zorilor+Vi%C8%99eu+de+Sus",
    },
  ],

  stats: [
    { value: "8+", label: "ani de experiență medicală" },
    { value: "2", label: "locații în Maramureș" },
    { value: "6–8", label: "ședințe pentru rezultat definitiv" },
    { value: "1.900+", label: "comunitate pe Instagram" },
  ],

  founder: {
    name: "Cosmina",
    role: "Fondatoare · Specialist epilare laser & remodelare corporală",
    story: [
      "Am deschis Eternal Beauty cu o convingere simplă: epilarea definitivă și remodelarea corporală trebuie făcute medical, cu aparatură certificată și protocoale sigure, nu „la ochi”.",
      "Fiecare tratament începe cu o consultație și un test de piele. Stabilim fototipul, densitatea firului, zonele și numărul de ședințe, apoi urmăm planul împreună, cu rezultate măsurabile la fiecare vizită.",
      "De peste 8 ani garantăm rezultate pentru că nu promitem minuni: explicăm ce se poate obține, în cât timp și cum menținem rezultatul.",
      "Mă perfecționez constant în tehnologiile laser și în protocoalele de remodelare corporală, pentru ca fiecare clientă să primească ce e mai sigur și mai eficient azi.",
    ],
    credentials: [
      "Specializare epilare definitivă laser medical",
      "Certificare remodelare corporală (criolipoliză, cavitație, vacuum, Wella Med)",
      "Protocoale pentru toate fototipurile de piele",
      "Aparatură medicală certificată CE",
      "Peste 8 ani de practică în Maramureș",
    ],
    values: [
      { title: "Medical, nu cosmetic", text: "Lucrăm cu laser medical și parametri setați după fototipul tău. Siguranța pielii e prima regulă." },
      { title: "Rezultate garantate", text: "Plan de tratament clar, cu număr de ședințe estimat și evoluție urmărită la fiecare vizită." },
      { title: "Fără durere inutilă", text: "Sisteme de răcire integrate și protocoale blânde. Majoritatea clientelor descriu senzația ca pe un ciupit scurt." },
    ],
  },

  /* Lista reală de servicii (de pe Instagram / de la client). Prețurile sunt orientative. */
  services: [
    {
      id: "epilare-laser",
      group: "laser",
      name: "Epilare definitivă cu aparat medical",
      subtitle: "Laser medical, pentru toate fototipurile",
      description:
        "Epilare definitivă cu laser medical certificat: față, axile, brațe, inghinal, picioare sau full body. Răcire integrată, parametri setați după pielea ta, fără lamă, fără ceară, fără fire crescute sub piele. Cura completă: 6–8 ședințe.",
      duration: "15 min – 2h, după zone",
      sessions: "6–8 ședințe · la 4–8 săptămâni",
      price: 80,
      unit: "zonă mică",
      from: true,
    },
    {
      id: "criolipoliza",
      group: "remodelare",
      name: "Criolipoliză",
      subtitle: "Grăsime localizată eliminată prin frig controlat",
      description:
        "Celulele adipoase sunt răcite controlat și eliminate natural de organism în 6–12 săptămâni. Pentru abdomen, flancuri, coapse, brațe, bărbie. Fără operație, fără pauză de la activitate.",
      duration: "45–60 min / zonă",
      sessions: "1–3 ședințe · la 6–8 săptămâni",
      price: 350,
      unit: "zonă",
    },
    {
      id: "cavitatie",
      group: "remodelare",
      name: "Cavitație",
      subtitle: "Centimetri în minus, fără bisturiu",
      description:
        "Ultrasunetele de joasă frecvență sparg depozitele de grăsime, care sunt eliminate apoi prin sistemul limfatic. Potrivită pentru abdomen, șolduri, coapse și brațe. Se combină ideal cu drenajul limfatic.",
      duration: "40–45 min",
      sessions: "8–10 ședințe · săptămânal",
      price: 130,
      unit: "ședință",
    },
    {
      id: "drenaj-limfatic",
      group: "remodelare",
      name: "Drenaj limfatic",
      subtitle: "Presoterapie · retenție redusă, picioare ușoare",
      description:
        "Drenaj limfatic mecanic prin presoterapie: elimină retenția de apă, reduce senzația de picioare grele și accelerează eliminarea toxinelor după cavitație sau criolipoliză.",
      duration: "30–40 min",
      sessions: "6–10 ședințe",
      price: 90,
      unit: "ședință",
    },
    {
      id: "tunel-infrarosu",
      group: "remodelare",
      name: "Tunel cu infraroșu",
      subtitle: "Detoxifiere, ardere calorică, relaxare",
      description:
        "Căldura infraroșie pătrunde în profunzime, stimulează circulația și metabolismul, ajută la arderea caloriilor și la eliminarea toxinelor. O ședință de 30 de minute echivalează cu un efort fizic susținut, în deplină relaxare.",
      duration: "30 min",
      sessions: "8–10 ședințe · de 2–3 ori pe săptămână",
      price: 70,
      unit: "ședință",
    },
    {
      id: "vacuum",
      group: "remodelare",
      name: "Vacuum",
      subtitle: "Masaj anticelulitic și modelare",
      description:
        "Masajul cu vacuum mobilizează țesutul, stimulează circulația și drenajul, netezește aspectul de celulită și conturează coapsele, fesele și abdomenul. Completare eficientă pentru cavitație.",
      duration: "30–40 min",
      sessions: "8–10 ședințe · săptămânal",
      price: 100,
      unit: "ședință",
    },
    {
      id: "wella-med",
      group: "remodelare",
      name: "Wella Med",
      subtitle: "Remodelare corporală cu aparat medical",
      description:
        "Tratament de remodelare corporală cu aparat medical Wella Med, pentru fermitate, reducerea celulitei și conturarea siluetei. Se stabilește la consultație, în funcție de zonă și obiectiv, singur sau în cură combinată.",
      duration: "40–60 min",
      sessions: "Cură personalizată",
      price: null,
      unit: null,
    },
  ],

  serviceGroups: [
    { id: "laser", name: "Epilare definitivă laser", short: "Laser", text: "Laser medical, pentru toate fototipurile. Fără lamă, fără ceară, fără fire crescute sub piele." },
    { id: "remodelare", name: "Remodelare corporală medicală", short: "Remodelare", text: "Criolipoliză, cavitație, drenaj limfatic, tunel cu infraroșu, vacuum, Wella Med. Rezultate măsurabile, fără operație." },
  ],

  /* Zone pentru harta corporală interactivă (prețuri orientative / ședință) */
  zones: [
    { id: "fata", name: "Față (buză, bărbie)", price: 80, minutes: 15, sessions: "6–8", region: "sus" },
    { id: "axile", name: "Axile", price: 100, minutes: 15, sessions: "6–8", region: "sus" },
    { id: "brate", name: "Brațe complet", price: 200, minutes: 30, sessions: "6–8", region: "sus" },
    { id: "piept", name: "Piept / abdomen", price: 200, minutes: 30, sessions: "6–8", region: "mijloc" },
    { id: "spate", name: "Spate", price: 300, minutes: 40, sessions: "6–8", region: "mijloc" },
    { id: "inghinal", name: "Inghinal total", price: 150, minutes: 20, sessions: "6–8", region: "mijloc" },
    { id: "coapse", name: "Coapse", price: 250, minutes: 35, sessions: "6–8", region: "jos" },
    { id: "gambe", name: "Gambe", price: 220, minutes: 30, sessions: "6–8", region: "jos" },
  ],

  process: [
    { step: "Consultație gratuită", text: "Discutăm obiectivul, evaluăm fototipul și zona, facem testul de piele. Primești planul de tratament și numărul estimat de ședințe." },
    { step: "Pregătire", text: "Zona se rade cu 24 h înainte, fără soare, autobronzant sau ceară în ultimele 4 săptămâni. Îți trimitem lista completă pe WhatsApp." },
    { step: "Tratament", text: "Ochelari de protecție, gel de răcire, parametri setați pe pielea ta. Senzația: un ciupit scurt, cald. Fără pauză de la activitățile zilnice." },
    { step: "Urmărire", text: "La 4–8 săptămâni revii pentru următoarea ședință. Măsurăm evoluția și ajustăm energia pe măsură ce firul devine mai fin." },
  ],

  aftercare: {
    title: "După tratament",
    intro: "Câteva reguli simple păstrează pielea calmă și rezultatul sigur între ședințe.",
    tips: [
      { title: "Fără soare 2 săptămâni", text: "Evită expunerea directă și solarul. Folosește zilnic SPF 50 pe zonele tratate expuse." },
      { title: "Calmează pielea", text: "Aplică gel de aloe sau crema recomandată de noi în primele 48 h. Roșeața ușoară dispare în câteva ore." },
      { title: "Fără căldură 24–48 h", text: "Amână sauna, baia fierbinte, sportul intens și piscina, ca să nu iriți foliculii tratați." },
      { title: "Nu smulge, nu epila cu ceară", text: "Între ședințe se folosește doar lama. Firele tratate cad singure în 1–3 săptămâni." },
      { title: "Hidratare", text: "Bea apă suficientă, mai ales după remodelare corporală: ajută eliminarea celulelor adipoase." },
      { title: "Respectă intervalul", text: "Ședințele la 4–8 săptămâni prind firul în faza de creștere. Intervalul corect înseamnă mai puține ședințe." },
    ],
  },

  policies: {
    title: "Bine de știut",
    items: [
      { title: "Consultație gratuită", text: "Prima vizită include evaluarea și testul de piele, fără cost. Planul și oferta se stabilesc pe loc." },
      { title: "Contraindicații", text: "Sarcină, alăptare, tratamente fotosensibilizante, bronz recent sau afecțiuni active ale pielii amână tratamentul. Le discutăm la consultație." },
      { title: "Anulare sau reprogramare", text: "Te rugăm să anunți cu minimum 24 h înainte, ca să oferim locul altei cliente." },
      { title: "Pachete și abonamente", text: "Curele de 6 sau 8 ședințe au preț redus față de ședința individuală. Se plătesc integral sau în două tranșe." },
      { title: "Plată", text: "Numerar sau card, la finalul ședinței. Pentru pachete se poate cere un avans la prima ședință." },
      { title: "Vouchere cadou", text: "Orice tratament poate fi oferit cadou. Voucherul este valabil 6 luni, la oricare dintre cele două locații." },
    ],
  },

  testimonials: [
    { name: "Andreea M.", text: "După 6 ședințe la axile și inghinal nu am mai atins lama. Cosmina explică totul, testează pielea și setează aparatul pentru tine. Zero iritații.", service: "Epilare laser axile + inghinal", rating: 5 },
    { name: "Ioana P.", text: "Criolipoliza pe abdomen mi-a scos ce nu reușeam cu sala. La 8 săptămâni diferența era vizibilă și în haine, nu doar pe centimetru.", service: "Criolipoliză", rating: 5 },
    { name: "Raluca D.", text: "Picioare complet, 7 ședințe. Am venit din Vișeu, am putut face jumătate din ședințe la punctul de lucru de acolo. Rezultat definitiv.", service: "Epilare laser picioare", rating: 5 },
    { name: "Bianca T.", text: "Îmi era teamă de durere. Răcirea aparatului face diferența, e o senzație scurtă de ciupit. Pielea închisă nu a fost o problemă.", service: "Epilare laser full body", rating: 5 },
    { name: "Elena S.", text: "Cură de cavitație cu drenaj limfatic pe șolduri: minus 6 cm în total și picioare mult mai ușoare. Recomand seriozitatea și curățenia clinicii.", service: "Cavitație + drenaj", rating: 5 },
    { name: "Diana C.", text: "Mustața și bărbia, problema mea de ani de zile, rezolvate în 6 ședințe scurte. Nu mai apar fire crescute sub piele.", service: "Epilare laser față", rating: 5 },
  ],

  faq: [
    { q: "Este epilarea laser definitivă?", a: "Da. Laserul distruge foliculul aflat în faza de creștere, iar după cura completă de 6–8 ședințe firele nu mai cresc. Ocazional, o ședință de întreținere pe an păstrează rezultatul perfect." },
    { q: "Doare?", a: "Senzația e descrisă ca un ciupit scurt și cald. Aparatul are răcire integrată, iar parametrii se setează după pielea ta. Zonele sensibile se tratează cu energie mai blândă." },
    { q: "Câte ședințe sunt necesare și la ce interval?", a: "În medie 6–8 ședințe, la 4 săptămâni pentru față și axile, la 6–8 săptămâni pentru picioare și corp. Firul devine mai rar și mai fin după fiecare ședință." },
    { q: "Se poate face pe piele închisă sau bronzată?", a: "Laserul medical pe care îl folosim tratează în siguranță toate fototipurile. Bronzul recent, însă, amână tratamentul cu 3–4 săptămâni, pentru siguranța pielii." },
    { q: "Cum mă pregătesc?", a: "Rade zona cu 24 h înainte, nu folosi ceară sau pensetă cu 4 săptămâni înainte, evită soarele și autobronzantul, vino cu pielea curată, fără creme sau deodorant." },
    { q: "Ce este criolipoliza și pentru cine este?", a: "O procedură non‑invazivă care răcește controlat grăsimea localizată, eliminată apoi natural în 6–12 săptămâni. Pentru persoane aproape de greutatea ideală, cu depozite locale rezistente la sport." },
    { q: "Câte ședințe de remodelare corporală sunt necesare?", a: "Criolipoliza: 1–3 ședințe pe zonă. Cavitație, vacuum, tunel cu infraroșu: cure de 8–10 ședințe, de 1–3 ori pe săptămână. Planul exact se stabilește la consultație, după măsurători." },
    { q: "Pot face tratamentele la oricare dintre locații?", a: "Da. Programează-te la Sighetu Marmației sau la Vișeu de Sus, în funcție de ce îți este mai aproape. Planul tău de tratament se continuă la oricare dintre ele." },
  ],

  /* Fotografii: pune fișierele reale în shared/photos/ cu exact aceste nume. */
  photos: [
    { src: "post-01.jpg", alt: "Epilare laser axile, piesă de mână pe piele", tag: "Laser axile" },
    { src: "post-02.jpg", alt: "Picioare netede după cura de epilare laser", tag: "După" },
    { src: "post-03.jpg", alt: "Criolipoliză, aplicator pe abdomen", tag: "Criolipoliză" },
    { src: "post-04.jpg", alt: "Picioare înainte de epilarea laser", tag: "Înainte" },
    { src: "post-05.jpg", alt: "Zone de tratament full body", tag: "Full body" },
    { src: "post-06.jpg", alt: "Aparat laser medical", tag: "Aparatură" },
    { src: "post-07.jpg", alt: "Interior clinică Eternal Beauty", tag: "Clinica" },
    { src: "post-08.jpg", alt: "Cosmina în timpul unui tratament laser", tag: "Cosmina" },
    { src: "post-09.jpg", alt: "Cavitație pe coapsă, aplicator cu ultrasunete", tag: "Cavitație" },
    { src: "post-10.jpg", alt: "Drenaj limfatic, presoterapie pe picioare", tag: "Drenaj" },
    { src: "post-11.jpg", alt: "Tunel cu infraroșu, lumină caldă", tag: "Infraroșu" },
    { src: "post-12.jpg", alt: "Epilare laser buză superioară", tag: "Laser față" },
    { src: "portrait.jpg", alt: "Portret Cosmina, fondatoare Eternal Beauty", tag: "Portret" },
    { src: "hero.jpg", alt: "Epilare definitivă laser, fotografie de copertă", tag: "Cover" },
  ],
};

/* Utilitare comune celor 3 design-uri */
window.ETERNAL.util = {
  photoPath(file) { return "../../shared/photos/" + file; },
  waLink(text) {
    const b = window.ETERNAL.brand;
    return "https://wa.me/" + b.whatsapp + "?text=" + encodeURIComponent(text || "Bună! Aș dori o consultație gratuită la Eternal Beauty pentru epilare laser / remodelare corporală. Când aveți un loc liber?");
  },
  priceLabel(p, unit, from) { return p == null ? "la cerere" : (from ? "de la " : "") + p + " lei" + (unit ? " / " + unit : ""); },
  placeholder(label, a, b, fg) {
    const svg =
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 1000'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs>` +
      `<rect width='800' height='1000' fill='url(#g)'/>` +
      `<circle cx='400' cy='500' r='160' fill='none' stroke='${fg}' stroke-opacity='.35' stroke-width='3'/>` +
      `<circle cx='400' cy='500' r='70' fill='${fg}' fill-opacity='.18'/>` +
      `<text x='400' y='880' font-family='sans-serif' font-size='30' fill='${fg}' fill-opacity='.7' text-anchor='middle'>${label.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</text>` +
      `</svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  },
  bindPlaceholders(a, b, fg) {
    const swap = (img) => { if (img.dataset.fallback) return; img.dataset.fallback = "1"; img.src = window.ETERNAL.util.placeholder(img.dataset.photo || img.alt, a, b, fg); };
    document.querySelectorAll("img[data-photo]").forEach((img) => { img.addEventListener("error", () => swap(img)); if (img.complete && img.naturalWidth === 0) swap(img); });
  },
};
