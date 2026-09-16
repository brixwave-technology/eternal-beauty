/* OBSIDIAN — script */
(function () {
  const D = window.ETERNAL, U = D.util, B = D.brand;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const photoFor = (i) => D.photos[i % 12];

  /* bindings */
  $$("[data-brand]").forEach((el) => (el.textContent = B[el.dataset.brand] || ""));
  $$("[data-founder]").forEach((el) => (el.textContent = D.founder[el.dataset.founder] || ""));
  $$("[data-wa]").forEach((a) => (a.href = U.waLink()));
  $$("[data-ig]").forEach((a) => (a.href = B.instagramUrl));
  $$("[data-mail]").forEach((a) => (a.href = "mailto:" + B.email));
  $("#year").textContent = new Date().getFullYear();
  $$("[data-tel]").forEach((a) => (a.href = "tel:" + B.phone.replace(/\s+/g, "")));
  $("#locations").innerHTML = D.locations.map((l) => `<div><h3>${esc(l.city)}</h3><p>${esc(l.address)} · ${esc(l.note)}</p><a href="${esc(l.mapsUrl)}" target="_blank" rel="noopener">Deschide în Maps ↗</a></div>`).join("");
  $("#schedule").innerHTML = B.schedule.map((s) => `<span class="sched"><span>${esc(s.days)}</span><span>${esc(s.hours)}</span></span>`).join("");
  $$(".hero__word span").forEach((s, i) => s.style.setProperty("--i", i));
  $$(".menu a").forEach((a, i) => a.style.setProperty("--i", i));

  /* loader */
  const loader = $("#loader"), lc = $("#loader-count"), lbar = $("#loader-bar");
  const ready = () => { loader.classList.add("is-done"); document.body.classList.remove("is-loading"); document.documentElement.classList.add("is-ready"); };
  if (reduce || sessionStorage.getItem("eb-loaded")) { loader.remove(); document.documentElement.classList.add("is-ready"); }
  else {
    document.body.classList.add("is-loading"); sessionStorage.setItem("eb-loaded", "1");
    const t0 = performance.now(), dur = 1300;
    const tick = (t) => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); lc.textContent = Math.round(e * 100); lbar.style.transform = `scaleX(${e})`; if (p < 1) requestAnimationFrame(tick); else setTimeout(ready, 150); };
    requestAnimationFrame(tick);
  }

  /* strip */
  const strip = D.photos.slice(0, 12).map((p) => `<figure><img data-photo="${esc(p.tag)}" src="${U.photoPath(p.src)}" alt="" width="400" height="500" loading="lazy"></figure>`).join("");
  $("#strip").innerHTML = strip + strip;

  /* sticky stack services */
  $("#services").innerHTML = D.services.map((s, i) => `
    <div class="card-wrap"><article class="card" data-i="${i}">
      <div class="card__body">
        <h3 class="card__name">${esc(s.name)}</h3>
        <p class="card__sub">${esc(s.subtitle)}</p>
        <p class="card__desc">${esc(s.description)}</p>
        <div class="card__meta">
          <div><b>${esc(U.priceLabel(s.price, s.unit, s.from))}</b><span>preț</span></div>
          <div><b>${esc(s.duration)}</b><span>durată</span></div>
          ${s.sessions ? `<div><b>${esc(s.sessions.split("·")[0].trim())}</b><span>${esc((s.sessions.split("·")[1] || "cură").trim())}</span></div>` : ""}
        </div>
      </div>
      <figure class="card__img"><img data-photo="${esc(photoFor(i).tag)}" src="${U.photoPath(photoFor(i).src)}" alt="${esc(photoFor(i).alt)}" width="800" height="1000" loading="lazy"></figure>
    </article></div>`).join("");
  const wraps = $$(".card-wrap"), cards = $$(".card");

  /* stats */
  $("#stats").innerHTML = D.stats.map((s) => `<li class="reveal"><b data-count="${esc(s.value)}">${esc(s.value)}</b><span>${esc(s.label)}</span></li>`).join("");
  const countUp = (el) => { const m = el.dataset.count.match(/^([\d.]+)(.*)$/); if (!m || reduce) return; const target = parseFloat(m[1].replace(".", "")), suf = m[2], t0 = performance.now(); const fmt = (n) => (target >= 1000 ? Math.round(n).toLocaleString("ro-RO") : Math.round(n)); const tick = (t) => { const p = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(target * e) + suf; if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); };

  /* works */
  $("#gallery").innerHTML = D.photos.slice(0, 10).map((p) => `<figure class="work reveal"><img data-photo="${esc(p.tag)}" src="${U.photoPath(p.src)}" alt="${esc(p.alt)}" width="800" height="1000" loading="lazy"><figcaption>${esc(p.tag)}</figcaption></figure>`).join("");

  /* about */
  $("#story").innerHTML = D.founder.story.map((p) => `<p class="reveal">${esc(p)}</p>`).join("");
  $("#values").innerHTML = D.founder.values.map((v) => `<li class="reveal"><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></li>`).join("");
  $("#creds").innerHTML = D.founder.credentials.map((c) => `<li class="reveal">${esc(c)}</li>`).join("");

  /* process */
  $("#process").insertAdjacentHTML("beforeend", D.process.map((p) => `<li class="fstep reveal"><h3>${esc(p.step)}</h3><p>${esc(p.text)}</p></li>`).join(""));

  /* quotes: big scrub quote + grid */
  const big = D.testimonials[0];
  $("#quote-big").innerHTML = `<p>${big.text.split(" ").map((w) => `<span class="wd">${esc(w)}</span>`).join(" ")}</p><footer><b>${esc(big.name)}</b> · ${esc(big.service)}</footer>`;
  const words = $$("#quote-big .wd");
  $("#quotes").innerHTML = D.testimonials.slice(1).map((q) => `<article class="reveal"><p>${esc(q.text)}</p><footer><b>${esc(q.name)}</b> · ${esc(q.service)}</footer></article>`).join("");

  /* accordions */
  const acc = (items) => items.map((x, i) => `<div class="ai"><button aria-expanded="false"><span>${esc(x.q || x.title)}</span><i aria-hidden="true"></i></button><div class="a"><div><p>${esc(x.a || x.text)}</p></div></div></div>`).join("");
  $("#care-title").textContent = D.aftercare.title; $("#care-intro").textContent = D.aftercare.intro; $("#policies-title").textContent = D.policies.title;
  $("#care").innerHTML = acc(D.aftercare.tips); $("#policies").innerHTML = acc(D.policies.items); $("#faq").innerHTML = acc(D.faq);
  $$(".ai button").forEach((b) => b.addEventListener("click", () => { const o = b.parentElement.classList.toggle("is-open"); b.setAttribute("aria-expanded", o); }));

  U.bindPlaceholders("#15151c", "#2b2230", "#e6b4d3");

  /* nav / menu */
  const burger = $(".top__burger"), menu = $("#menu");
  burger.addEventListener("click", () => { const open = menu.hidden; menu.hidden = !open; burger.setAttribute("aria-expanded", open); document.body.style.overflow = open ? "hidden" : ""; });
  $$("a", menu).forEach((a) => a.addEventListener("click", () => burger.click()));

  /* reveals */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); $$("[data-count]", e.target).forEach(countUp); io.unobserve(e.target); } }), { threshold: 0.12 });
  $$(".numbers ul, .works__grid, .about__values, .creds, #story, .flow__row, .quote__grid").forEach((g) => $$(".reveal", g).forEach((el, i) => (el.style.transitionDelay = Math.min(i * 70, 420) + "ms")));
  $$(".reveal").forEach((el) => io.observe(el));

  /* scroll engine (passive + rAF, transforms only) */
  const par = $$("[data-parallax]"), flow = $(".flow__row"), flowBar = $("#flow-progress"), quoteBig = $("#quote-big");
  let raf = 0;
  const frame = () => {
    raf = 0; const vh = innerHeight;
    // sticky stack: shrink the previous card as the next arrives
    if (!reduce) wraps.forEach((w, i) => {
      if (i === 0) return; const r = w.getBoundingClientRect(); const p = Math.min(1, Math.max(0, 1 - r.top / vh));
      const prev = cards[i - 1]; prev.style.transform = `scale(${(1 - 0.08 * p).toFixed(4)})`; prev.style.filter = `brightness(${(1 - 0.45 * p).toFixed(3)})`;
    });
    // parallax
    if (!reduce) par.forEach((el) => { const r = el.getBoundingClientRect(); el.style.transform = `translate3d(0,${(-(r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.parallax)).toFixed(1)}px,0)`; });
    // flow line
    const fr = flow.getBoundingClientRect(); flowBar.style.setProperty("--p", Math.min(1, Math.max(0, (vh - fr.top) / (vh * 0.8))).toFixed(3));
    // scrub quote
    const qr = quoteBig.getBoundingClientRect(); const qp = Math.min(1, Math.max(0, (vh * 0.85 - qr.top) / (vh * 0.6)));
    const n = Math.floor(qp * words.length); words.forEach((w, i) => w.classList.toggle("is-on", i < n || reduce));
  };
  addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(frame); }, { passive: true }); frame();

  /* spotlight + magnetic (fine pointers) */
  if (fine && !reduce) {
    const spot = $("#spot");
    addEventListener("pointermove", (e) => { spot.style.setProperty("--mx", e.clientX + "px"); spot.style.setProperty("--my", e.clientY + "px"); }, { passive: true });
    $$("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => { const r = btn.getBoundingClientRect(); btn.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.2).toFixed(1)}px,${((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1)}px)`; });
      btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
    });
  }
})();
