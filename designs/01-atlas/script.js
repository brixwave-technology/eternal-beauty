/* ATLAS — script (mobile-first) */
(function () {
  const D = window.ETERNAL, U = D.util, B = D.brand;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const photoFor = (i) => D.photos[i % 12];
  const groupOf = (id) => D.serviceGroups.find((g) => g.id === id);

  /* bindings */
  $$("[data-brand]").forEach((el) => (el.textContent = B[el.dataset.brand] || ""));
  $$("[data-founder]").forEach((el) => (el.textContent = D.founder[el.dataset.founder] || ""));
  $$("[data-wa]").forEach((a) => (a.href = U.waLink()));
  $$("[data-ig]").forEach((a) => (a.href = B.instagramUrl));
  $$("[data-tel]").forEach((a) => (a.href = "tel:" + B.phone.replace(/\s+/g, "")));
  $$("[data-mail]").forEach((a) => (a.href = "mailto:" + B.email));
  $("#year").textContent = new Date().getFullYear();
  $("#schedule").innerHTML = B.schedule.map((s) => `<div class="sched"><span>${esc(s.days)}</span><span>${esc(s.hours)}</span></div>`).join("");
  $("#hero-pills").innerHTML = D.stats.slice(0, 2).map((s) => `<li>${esc(s.value)} ${esc(s.label)}</li>`).join("");

  /* segmented control helper */
  const makeSeg = (root, items, onPick) => {
    const thumb = $(".seg__thumb", root);
    root.insertAdjacentHTML("beforeend", items.map((it, i) => `<button role="tab" aria-selected="${i === 0}" class="${i === 0 ? "is-on" : ""}" data-id="${it.id}">${esc(it.label)}</button>`).join(""));
    const btns = $$("button", root);
    const move = (b) => { thumb.style.setProperty("--x", b.offsetLeft + "px"); thumb.style.setProperty("--w", b.offsetWidth + "px"); };
    btns.forEach((b) => b.addEventListener("click", () => { btns.forEach((x) => { x.classList.toggle("is-on", x === b); x.setAttribute("aria-selected", x === b); }); move(b); onPick(b.dataset.id); }));
    const init = () => move($("button.is-on", root)); addEventListener("resize", init); (document.fonts ? document.fonts.ready : Promise.resolve()).then(init); init();
  };

  /* services chips + sheet */
  const chips = $("#chips");
  chips.innerHTML = D.services.map((s, i) => `
    <button class="chip" data-i="${i}" data-group="${s.group}">
      <figure><img data-photo="${esc(photoFor(i).tag)}" src="${U.photoPath(photoFor(i).src)}" alt="" width="800" height="500" loading="lazy"></figure>
      <div class="chip__body">
        <div class="chip__name">${esc(s.name)}</div>
        <div class="chip__sub">${esc(s.subtitle)}</div>
        <div class="chip__row"><b>${esc(U.priceLabel(s.price, s.unit, s.from))}</b><span class="chip__more">Detalii <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>
      </div>
    </button>`).join("");
  makeSeg($("#seg"), [{ id: "all", label: "Toate" }, ...D.serviceGroups.map((g) => ({ id: g.id, label: g.short }))], (id) => {
    $$(".chip").forEach((c) => c.classList.toggle("is-hidden", id !== "all" && c.dataset.group !== id));
    const g = groupOf(id); $("#seg-text").textContent = g ? g.text : "Laser medical pentru epilare definitivă și șase tratamente de remodelare corporală. Atinge un card pentru detalii și ofertă.";
    chips.scrollTo({ left: 0, behavior: "smooth" });
  });
  $("#seg-text").textContent = "Laser medical pentru epilare definitivă și șase tratamente de remodelare corporală. Atinge un card pentru detalii și ofertă.";

  const sheet = $("#sheet"); let lastFocus;
  const openSheet = (i) => {
    const s = D.services[i], p = photoFor(i);
    $("#sheet-img").src = U.photoPath(p.src); $("#sheet-img").alt = p.alt;
    $("#sheet-group").textContent = groupOf(s.group).name; $("#sheet-title").textContent = s.name; $("#sheet-sub").textContent = s.subtitle; $("#sheet-desc").textContent = s.description;
    $("#sheet-meta").innerHTML = `<div><dt>Preț</dt><dd>${esc(U.priceLabel(s.price, s.unit, s.from))}</dd></div><div><dt>Durată</dt><dd>${esc(s.duration)}</dd></div><div><dt>Cură</dt><dd>${esc(s.sessions)}</dd></div>`;
    $("#sheet-wa").href = U.waLink(`Bună! Aș dori o ofertă și o consultație gratuită pentru: ${s.name}. Mulțumesc!`);
    lastFocus = document.activeElement; sheet.hidden = false; sheet.classList.remove("is-closing"); document.body.style.overflow = "hidden"; $("#sheet-close").focus();
  };
  const closeSheet = () => { if (sheet.hidden) return; sheet.classList.add("is-closing"); setTimeout(() => { sheet.hidden = true; sheet.classList.remove("is-closing"); document.body.style.overflow = ""; lastFocus && lastFocus.focus(); }, reduce ? 0 : 330); };
  chips.addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (c) openSheet(+c.dataset.i); });
  $("#sheet-close").addEventListener("click", closeSheet);
  sheet.addEventListener("click", (e) => { if (e.target === sheet) closeSheet(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheet(); });
  // swipe down to close
  let sy = 0; const panel = $("#sheet-panel");
  panel.addEventListener("touchstart", (e) => (sy = e.touches[0].clientY), { passive: true });
  panel.addEventListener("touchend", (e) => { if (panel.scrollTop < 4 && e.changedTouches[0].clientY - sy > 90) closeSheet(); });

  /* body map */
  const chosen = new Set(), zl = $("#zlist"), zsum = $("#zsum");
  zl.innerHTML = D.zones.map((z) => `<button type="button" data-zone="${z.id}" aria-pressed="false"><b>${esc(z.name)}</b><span>${z.price} lei · ${z.minutes} min</span></button>`).join("");
  const svgZones = $$("#body-zones [data-zone]");
  const fmt = (n) => n.toLocaleString("ro-RO");
  const animateNum = (el, to, suffix) => {
    const from = parseFloat((el.dataset.v || "0")) || 0; el.dataset.v = to; if (reduce) { el.textContent = fmt(to) + suffix; return; }
    const t0 = performance.now(); const tick = (t) => { const p = Math.min(1, (t - t0) / 450), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(Math.round(from + (to - from) * e)) + suffix; if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick);
  };
  const render = () => {
    let min = 0, price = 0; const names = [];
    D.zones.forEach((z) => { if (chosen.has(z.id)) { min += z.minutes; price += z.price; names.push(z.name); } });
    $$("button", zl).forEach((b) => { const on = chosen.has(b.dataset.zone); b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on); });
    svgZones.forEach((el) => el.classList.toggle("is-on", chosen.has(el.dataset.zone)));
    animateNum($("#z-count"), chosen.size, ""); animateNum($("#z-min"), min, " min"); animateNum($("#z-price"), price, " lei");
    zsum.classList.toggle("is-empty", chosen.size === 0);
    $("#z-wa").href = U.waLink(chosen.size ? `Bună! Aș dori o ofertă pentru epilare laser, zonele: ${names.join(", ")}. Estimare din site: ~${min} min / ședință, ~${price} lei / ședință. Când aveți un loc pentru consultația gratuită?` : undefined);
  };
  const toggle = (id) => { chosen.has(id) ? chosen.delete(id) : chosen.add(id); render(); };
  zl.addEventListener("click", (e) => { const b = e.target.closest("[data-zone]"); if (b) toggle(b.dataset.zone); });
  $("#body-zones").addEventListener("click", (e) => { const z = e.target.closest("[data-zone]"); if (z) toggle(z.dataset.zone); });
  $("#z-reset").addEventListener("click", () => { chosen.clear(); render(); });
  render();

  /* compare */
  const cmp = $("#compare"), range = $("#cmp-range");
  const setX = (v) => cmp.style.setProperty("--x", v + "%"); range.addEventListener("input", () => setX(range.value)); setX(50);
  const fit = () => { $("#cmp-before img").style.width = cmp.clientWidth + "px"; }; addEventListener("resize", fit); fit();

  /* gallery */
  $("#gallery").innerHTML = D.photos.slice(0, 12).map((p) => `<figure class="reveal"><img data-photo="${esc(p.tag)}" src="${U.photoPath(p.src)}" alt="${esc(p.alt)}" width="800" height="1000" loading="lazy"><figcaption>${esc(p.tag)}</figcaption></figure>`).join("");

  /* why */
  $("#stats").innerHTML = D.stats.map((s) => `<li class="reveal"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></li>`).join("");
  const icons = [`<svg viewBox="0 0 24 24"><path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`, `<svg viewBox="0 0 24 24"><path d="M4 13l5 5L20 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`, `<svg viewBox="0 0 24 24"><path d="M12 21s-7-4.5-7-11a7 7 0 0 1 14 0c0 6.5-7 11-7 11z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`];
  $("#values").innerHTML = D.founder.values.map((v, i) => `<li class="reveal"><i aria-hidden="true">${icons[i % 3]}</i><div><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></div></li>`).join("");

  /* flow, locations, about, quotes */
  $("#process").innerHTML = D.process.map((p) => `<li class="reveal"><div><h3>${esc(p.step)}</h3><p>${esc(p.text)}</p></div></li>`).join("");
  $("#locations").innerHTML = D.locations.map((l) => `<article class="place reveal"><h3>${esc(l.city)}</h3><p><b>${esc(l.address)}</b></p><p>${esc(l.note)}</p><a class="btn btn--soft" href="${esc(l.mapsUrl)}" target="_blank" rel="noopener">Deschide în Maps</a></article>`).join("");
  $("#story").innerHTML = D.founder.story.slice(0, 3).map((p) => `<p>${esc(p)}</p>`).join("");
  $("#creds").innerHTML = D.founder.credentials.map((c) => `<li>${esc(c)}</li>`).join("");
  $("#quotes").innerHTML = D.testimonials.map((q) => `<article class="voice reveal"><p>${esc(q.text)}</p><footer><i aria-hidden="true">${esc(q.name[0])}</i><span><b>${esc(q.name)}</b> · ${esc(q.service)}</span><span class="stars" aria-label="${q.rating} din 5">${"★".repeat(q.rating || 5)}</span></footer></article>`).join("");

  /* info accordions + segmented */
  const acc = (items) => items.map((x) => `<div class="ai"><button aria-expanded="false"><span>${esc(x.q || x.title)}</span><i aria-hidden="true"></i></button><div class="a"><div><p>${esc(x.a || x.text)}</p></div></div></div>`).join("");
  $("#faq").innerHTML = acc(D.faq); $("#care").innerHTML = acc(D.aftercare.tips); $("#policies").innerHTML = acc(D.policies.items);
  document.addEventListener("click", (e) => { const b = e.target.closest(".ai button"); if (b) { const o = b.parentElement.classList.toggle("is-open"); b.setAttribute("aria-expanded", o); } });
  makeSeg($("#seg-info"), [{ id: "faq", label: "Întrebări" }, { id: "care", label: D.aftercare.title }, { id: "policies", label: D.policies.title }], (id) => $$(".acc").forEach((a) => a.classList.toggle("is-on", a.id === id)));

  U.bindPlaceholders("#e9f2ef", "#c9ddd6", "#0f2a2e");

  /* reveals */
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }), { threshold: 0.1 });
  $$(".stats, .values, .flow__list, .places__grid, .gallery, .voices__row").forEach((g) => $$(".reveal", g).forEach((el, i) => (el.style.transitionDelay = Math.min(i * 60, 300) + "ms")));
  $$(".reveal").forEach((el) => io.observe(el));
})();
