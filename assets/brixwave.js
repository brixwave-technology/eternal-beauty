/* ================= BRIXWAVE PORTAL — configurare ================= */
const BRIXWAVE = {
  name: "Brixwave",
  email: "brixwavetechnology@gmail.com",   // unde ajunge confirmarea clientului
  whatsapp: "",                            // ex: "407xxxxxxxx" (doar cifre). Gol → butonul WhatsApp e ascuns
  client: "Eternal Beauty by Cosmina",
  price: 1250,
  currency: "RON",
  includes: [
    "Designul ales, personalizat cu fotografiile reale de pe Instagram, serviciile și prețurile tale",
    "Toate secțiunile: servicii, galerie, despre, proces, păreri, întrebări frecvente, contact",
    "Programare rapidă prin WhatsApp și Instagram, cu mesaj precompletat",
    "Adaptare completă pentru telefon, tabletă și desktop",
    "Animații și micro‑interacțiuni moderne, optimizate pentru performanță",
    "Optimizare SEO de bază (titluri, descrieri, viteză, accesibilitate)",
    "Publicare online și asistență la configurarea domeniului",
    "O rundă de modificări după livrare",
  ],
  steps: [
    ["Alegi designul", "din portal, apoi confirmi prin e‑mail sau WhatsApp."],
    ["Primești oferta scrisă", "cu prețul de 1.250 RON, termenul de livrare și pașii de plată."],
    ["Trimiți materialele", "fotografiile, lista de servicii și prețurile, datele de contact."],
    ["Livrăm site-ul", "personalizat, testat pe toate dispozitivele, gata de publicat."],
  ],
};

const DESIGNS = [
  {
    id: "noir-luxe",
    name: "Noir Luxe",
    vibe: "Întunecat · luxos · cinematic",
    path: "designs/01-noir-luxe/index.html",
    desc: "Fundal de cerneală, accente de auriu‑șampanie și tipografie serif elegantă. Imaginile parcă ies din umbră: paralax fin, cursor personalizat, butoane magnetice. Pentru un brand care vrea să pară exclusivist.",
    tags: ["Serif Cormorant", "Auriu pe negru", "Paralax & cursor", "Marquee servicii"],
    swatches: ["#0d0b0c", "#c9a46b", "#f3ece1"],
    motion: 4, warmth: 2, density: 2,
    audience: "Clientelă premium, evenimente, lookuri intense",
  },
  {
    id: "blush-editorial",
    name: "Blush Editorial",
    vibe: "Cald · editorial · revistă",
    path: "designs/02-blush-editorial/index.html",
    desc: "Compoziție de copertă de revistă: titlu uriaș, fotografii cu arcade, roz prăfuit și prună. Galerie tip colaj, carduri care se înclină la hover, sticker rotativ. Feminin, prietenos, memorabil.",
    tags: ["Fraunces italic", "Roz & prună", "Grid colaj", "Sticker rotativ"],
    swatches: ["#fbf4f0", "#c9737a", "#3d1f2b"],
    motion: 3, warmth: 5, density: 3,
    audience: "Clientelă tânără, activă pe Instagram, ton cald",
  },
  {
    id: "atelier-minimal",
    name: "Atelier Minimal",
    vibe: "Calm · curat · natural",
    path: "designs/03-atelier-minimal/index.html",
    desc: "Alb cald, verde salvie și cărbune. Totul aerisit și clar: tabel de servicii, comparație înainte/după cu slider, carduri moi. Se citește repede pe telefon și inspiră încredere.",
    tags: ["Instrument Serif", "Salvie & ivoriu", "Înainte / după", "Foarte rapid"],
    swatches: ["#f6f3ee", "#7f8c7a", "#23221f"],
    motion: 2, warmth: 3, density: 3,
    audience: "Clientelă care caută naturalețe și claritate",
  },
];

/* ================================================================== */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmtPrice = () => BRIXWAVE.price.toLocaleString("ro-RO") + " " + BRIXWAVE.currency;
  const KEY = "brixwave.eternal.choice";
  let chosen = null;
  try { chosen = localStorage.getItem(KEY); } catch (e) {}

  $("#year").textContent = new Date().getFullYear();
  const fm = $("#footer-mail"); fm.textContent = BRIXWAVE.email; fm.href = "mailto:" + BRIXWAVE.email;

  /* ---- cards ---- */
  $("#cards").innerHTML = DESIGNS.map((d, i) => `
    <article class="card reveal" data-id="${d.id}" style="transition-delay:${i * 90}ms">
      <div class="card__preview" data-open="${d.id}" role="button" tabindex="0" aria-label="Previzualizează ${esc(d.name)}">
        <span class="card__badge">${chosen === d.id ? "Alegerea ta" : "Varianta " + (i + 1)}</span>
        <iframe src="${d.path}" title="Preview ${esc(d.name)}" loading="lazy" tabindex="-1" aria-hidden="true"></iframe>
      </div>
      <div class="card__body">
        <div class="card__head">
          <div><h3 class="card__name">${esc(d.name)}</h3><p class="card__vibe">${esc(d.vibe)}</p></div>
          <div class="card__swatches" aria-hidden="true">${d.swatches.map((c) => `<i style="background:${c}"></i>`).join("")}</div>
        </div>
        <p class="card__desc">${esc(d.desc)}</p>
        <ul class="card__tags">${d.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        <div class="card__actions">
          <button class="btn" data-open="${d.id}">Preview</button>
          <button class="btn btn--primary" data-choose="${d.id}">Aleg acest design</button>
        </div>
        <div class="card__price"><span>Preț realizare</span><b>${fmtPrice()}</b></div>
      </div>
    </article>`).join("");

  /* scale iframes to card width */
  const fit = () => $$(".card__preview").forEach((p) => { const f = $("iframe", p); if (f) f.style.transform = `scale(${p.clientWidth / 1440})`; });
  new ResizeObserver(fit).observe($("#cards")); fit();

  /* ---- compare table ---- */
  const meter = (n) => `<span class="meter" aria-hidden="true">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;
  const rows = [
    ["Atmosferă", (d) => esc(d.vibe)],
    ["Paletă", (d) => `<span class="card__swatches" aria-hidden="true" style="display:inline-flex;vertical-align:middle;margin-right:8px">${d.swatches.map((c) => `<i style="background:${c}"></i>`).join("")}</span>${esc(d.tags[1])}`],
    ["Tipografie", (d) => esc(d.tags[0])],
    ["Intensitate animații", (d) => meter(d.motion) + ["", "discretă", "moderată", "vizibilă", "cinematică", "maximă"][d.motion]],
    ["Căldură vizuală", (d) => meter(d.warmth) + ["", "rece", "sobră", "echilibrată", "caldă", "foarte caldă"][d.warmth]],
    ["Element distinctiv", (d) => esc(d.tags[2]) + " · " + esc(d.tags[3])],
    ["Potrivit pentru", (d) => esc(d.audience)],
    ["Preț", () => `<b style="color:var(--fg)">${fmtPrice()}</b>`],
  ];
  $("#compare-table").innerHTML = `<thead><tr><th scope="col"></th>${DESIGNS.map((d) => `<th scope="col">${esc(d.name)}</th>`).join("")}</tr></thead>
    <tbody>${rows.map(([label, fn]) => `<tr><th scope="row">${label}</th>${DESIGNS.map((d) => `<td>${fn(d)}</td>`).join("")}</tr>`).join("")}</tbody>`;

  /* ---- offer ---- */
  $("#includes").innerHTML = BRIXWAVE.includes.map((x) => `<li>${esc(x)}</li>`).join("");
  $("#steps").innerHTML = BRIXWAVE.steps.map(([b, t]) => `<li><span><b>${esc(b)}</b> ${esc(t)}</span></li>`).join("");

  /* ---- viewer ---- */
  const viewer = $("#viewer"), frame = $("#viewer-frame"), stage = $("#viewer-stage");
  let current = null, lastFocus = null;
  const openViewer = (id) => {
    const d = DESIGNS.find((x) => x.id === id); if (!d) return;
    current = d; lastFocus = document.activeElement;
    $("#viewer-title").innerHTML = `${esc(d.name)}<small>${esc(d.vibe)} · ${fmtPrice()}</small>`;
    $("#viewer-open").href = d.path; frame.src = d.path;
    viewer.hidden = false; document.body.style.overflow = "hidden"; $("#viewer-close").focus();
  };
  const closeViewer = () => { viewer.hidden = true; frame.src = "about:blank"; document.body.style.overflow = ""; lastFocus && lastFocus.focus(); };
  $("#viewer-close").addEventListener("click", closeViewer);
  $("#viewer-choose").addEventListener("click", () => { closeViewer(); openModal(current.id); });
  $$(".seg").forEach((b) => b.addEventListener("click", () => {
    $$(".seg").forEach((x) => x.classList.toggle("is-on", x === b));
    stage.classList.toggle("is-mobile", b.dataset.device === "mobile");
  }));

  /* ---- choice modal ---- */
  const modal = $("#modal");
  const openModal = (id) => {
    const d = DESIGNS.find((x) => x.id === id); if (!d) return;
    chosen = d.id; try { localStorage.setItem(KEY, d.id); } catch (e) {}
    markChoice();
    $("#modal-title").textContent = d.name;
    $("#modal-desc").textContent = d.desc;
    $("#modal-includes").innerHTML = BRIXWAVE.includes.slice(0, 5).map((x) => `<li>${esc(x)}</li>`).join("");
    const msg = `Bună! Sunt de la ${BRIXWAVE.client}. Am ales designul „${d.name}” din portalul Brixwave și aș dori oferta pentru realizarea site-ului la prețul de ${fmtPrice()}. Mulțumesc!`;
    $("#modal-mail").href = `mailto:${BRIXWAVE.email}?subject=${encodeURIComponent(`[${BRIXWAVE.client}] Design ales: ${d.name}`)}&body=${encodeURIComponent(msg)}`;
    const wa = $("#modal-wa");
    if (BRIXWAVE.whatsapp) { wa.hidden = false; wa.href = `https://wa.me/${BRIXWAVE.whatsapp}?text=${encodeURIComponent(msg)}`; } else wa.hidden = true;
    lastFocus = document.activeElement; modal.hidden = false; document.body.style.overflow = "hidden"; $("#modal-close").focus();
  };
  const closeModal = () => { modal.hidden = true; document.body.style.overflow = ""; lastFocus && lastFocus.focus(); };
  $("#modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") { if (!modal.hidden) closeModal(); else if (!viewer.hidden) closeViewer(); } });

  function markChoice() {
    $$(".card").forEach((c, i) => {
      const on = c.dataset.id === chosen; c.classList.toggle("is-chosen", on);
      $(".card__badge", c).textContent = on ? "Alegerea ta" : "Varianta " + (i + 1);
      $("[data-choose]", c).textContent = on ? "Ales · vezi oferta" : "Aleg acest design";
    });
    const hint = $("#offer-hint"), d = DESIGNS.find((x) => x.id === chosen);
    hint.classList.toggle("is-chosen", !!d);
    hint.textContent = d ? `Ai ales „${d.name}”. Confirmă alegerea din card pentru a primi oferta.` : "Alege un design mai sus pentru a confirma.";
  }
  markChoice();

  /* ---- delegated actions ---- */
  document.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]"), c = e.target.closest("[data-choose]");
    if (o) openViewer(o.dataset.open); else if (c) openModal(c.dataset.choose);
  });
  document.addEventListener("keydown", (e) => {
    const o = e.target.closest && e.target.closest(".card__preview[data-open]");
    if (o && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openViewer(o.dataset.open); }
  });

  /* ---- reveals ---- */
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }), { threshold: 0.1 });
  $$(".reveal").forEach((el) => io.observe(el));
  requestAnimationFrame(() => setTimeout(() => $(".hero").classList.add("is-in"), 60));
})();
