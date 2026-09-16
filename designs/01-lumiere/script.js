/* LUMIÈRE — script */
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
  $$("[data-tel]").forEach((a) => (a.href = "tel:" + B.phone.replace(/\s+/g, "")));
  $$("[data-mail]").forEach((a) => (a.href = "mailto:" + B.email));
  $("#year").textContent = new Date().getFullYear();
  $("#schedule").innerHTML = B.schedule.map((s) => `<div class="sched"><span>${esc(s.days)}</span><span>${esc(s.hours)}</span></div>`).join("");
  $$(".hero__title .w").forEach((w, i) => w.style.setProperty("--i", i));
  $$(".menu a").forEach((a, i) => a.style.setProperty("--i", i));

  /* stats with count-up */
  $("#stats").innerHTML = D.stats.map((s) => `<li class="reveal"><b data-count="${esc(s.value)}">${esc(s.value)}</b><span>${esc(s.label)}</span></li>`).join("");
  const countUp = (el) => {
    const raw = el.dataset.count, m = raw.match(/^([\d.]+)(.*)$/); if (!m || reduce) return;
    const target = parseFloat(m[1].replace(".", "")), suffix = m[2], t0 = performance.now(), dur = 1400;
    const fmt = (n) => (target >= 1000 ? Math.round(n).toLocaleString("ro-RO") : Math.round(n));
    const tick = (t) => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(target * e) + suffix; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };

  /* services: sticky story */
  $("#story-images").innerHTML = D.services.map((s, i) => `<img data-photo="${esc(photoFor(i).tag)}" src="${U.photoPath(photoFor(i).src)}" alt="" width="800" height="1000" loading="lazy" class="${i === 0 ? "is-active" : ""}">`).join("");
  $("#services").innerHTML = D.services.map((s, i) => `
    <li data-i="${i}" class="${i === 0 ? "is-active" : ""}">
      <figure class="step__img"><img data-photo="${esc(photoFor(i).tag)}" src="${U.photoPath(photoFor(i).src)}" alt="" width="800" height="600" loading="lazy"></figure>
      <div class="step__top"><h3 class="step__name">${esc(s.name)}</h3><span class="step__price">${esc(U.priceLabel(s.price))}</span></div>
      <p class="step__sub">${esc(s.subtitle)}</p>
      <p class="step__desc">${esc(s.description)}</p>
      <div class="step__meta"><span>${esc(s.duration)}</span>${s.maintenance ? `<span>${esc(s.maintenance)}</span>` : ""}</div>
    </li>`).join("");
  const steps = $$("#services li"), simgs = $$("#story-images img");
  const setStep = (i) => { steps.forEach((li, k) => li.classList.toggle("is-active", k === i)); simgs.forEach((im, k) => im.classList.toggle("is-active", k === i)); };

  /* bento */
  $("#story").innerHTML = D.founder.story.slice(0, 3).map((p) => `<p>${esc(p)}</p>`).join("");
  $("#creds").innerHTML = D.founder.credentials.map((c) => `<li>${esc(c)}</li>`).join("");
  D.founder.values.forEach((v, i) => { const t = $("#value-" + i); if (t) t.innerHTML = `<h3>${esc(v.title)}</h3><p class="tile__text">${esc(v.text)}</p>`; });
  $$(".tile").forEach((t) => t.classList.add("reveal"));

  /* gallery + lightbox */
  const shots = D.photos.slice(0, 12);
  $("#gallery").innerHTML = shots.map((p, i) => `<figure class="shot" data-i="${i}" tabindex="0" role="button" aria-label="Mărește: ${esc(p.alt)}"><img data-photo="${esc(p.tag)}" src="${U.photoPath(p.src)}" alt="${esc(p.alt)}" width="800" height="1000" loading="lazy" draggable="false"><figcaption>${esc(p.tag)}</figcaption></figure>`).join("");
  const lb = $("#lightbox"), lbImg = $("#lb-img"), lbCap = $("#lb-cap"); let lbi = 0, lastFocus;
  const showLb = (i) => { lbi = (i + shots.length) % shots.length; const p = shots[lbi]; lbImg.src = $(`.shot[data-i="${lbi}"] img`).src; lbImg.alt = p.alt; lbCap.textContent = p.alt; };
  const openLb = (i) => { lastFocus = document.activeElement; showLb(i); lb.hidden = false; document.body.style.overflow = "hidden"; $("#lb-close").focus(); };
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ""; lastFocus && lastFocus.focus(); };
  $$(".shot").forEach((s) => { s.addEventListener("click", () => openLb(+s.dataset.i)); s.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(+s.dataset.i); } }); });
  $("#lb-close").addEventListener("click", closeLb); $("#lb-prev").addEventListener("click", () => showLb(lbi - 1)); $("#lb-next").addEventListener("click", () => showLb(lbi + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  addEventListener("keydown", (e) => { if (lb.hidden) return; if (e.key === "Escape") closeLb(); if (e.key === "ArrowLeft") showLb(lbi - 1); if (e.key === "ArrowRight") showLb(lbi + 1); });

  /* process */
  $("#process").innerHTML = D.process.map((p, i) => `<li class="pstep reveal" style="--i:${i}"><h3>${esc(p.step)}</h3><p>${esc(p.text)}</p></li>`).join("");

  /* testimonials carousel */
  const sc = $("#quotes");
  sc.innerHTML = D.testimonials.map((q) => `<article class="voice"><p>${esc(q.text)}</p><footer><i aria-hidden="true">${esc(q.name[0])}</i><span><b>${esc(q.name)}</b> · ${esc(q.service)}</span><span class="stars" aria-label="${q.rating} din 5">${"★".repeat(q.rating || 5)}</span></footer></article>`).join("");
  const vbar = $("#voices-progress");
  const updBar = () => { const max = sc.scrollWidth - sc.clientWidth; const p = max ? sc.scrollLeft / max : 0; vbar.style.transform = `scaleX(${0.2 + 0.8 * p})`; $("#prev").disabled = sc.scrollLeft < 8; $("#next").disabled = sc.scrollLeft > max - 8; };
  sc.addEventListener("scroll", updBar, { passive: true }); updBar(); addEventListener("resize", updBar);
  const cardW = () => ($(".voice", sc)?.offsetWidth || 400) + 14;
  $("#prev").addEventListener("click", () => sc.scrollBy({ left: -cardW(), behavior: "smooth" }));
  $("#next").addEventListener("click", () => sc.scrollBy({ left: cardW(), behavior: "smooth" }));
  let down = false, sx = 0, sl = 0;
  sc.addEventListener("pointerdown", (e) => { down = true; sx = e.clientX; sl = sc.scrollLeft; sc.classList.add("is-dragging"); });
  addEventListener("pointerup", () => { down = false; sc.classList.remove("is-dragging"); });
  sc.addEventListener("pointermove", (e) => { if (down) sc.scrollLeft = sl - (e.clientX - sx); });

  /* info tabs */
  $("#tab-care").textContent = D.aftercare.title; $("#tab-policies").textContent = D.policies.title; $("#care-intro").textContent = D.aftercare.intro;
  $("#care").innerHTML = D.aftercare.tips.map((t) => `<li><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></li>`).join("");
  $("#policies").innerHTML = D.policies.items.map((p) => `<li><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join("");
  $("#faq").innerHTML = D.faq.map((f, i) => `<div class="fq"><button aria-expanded="false" aria-controls="f-${i}"><span>${esc(f.q)}</span><i aria-hidden="true"></i></button><div class="a" id="f-${i}"><div><p>${esc(f.a)}</p></div></div></div>`).join("");
  $$(".fq button").forEach((b) => b.addEventListener("click", () => { const o = b.parentElement.classList.toggle("is-open"); b.setAttribute("aria-expanded", o); }));
  const tabs = $$(".tab"), ink = $(".tabs__ink");
  const moveInk = (t) => { ink.style.setProperty("--x", t.offsetLeft + "px"); ink.style.setProperty("--w", t.offsetWidth + "px"); };
  tabs.forEach((t) => t.addEventListener("click", () => {
    tabs.forEach((x) => { x.classList.toggle("is-on", x === t); x.setAttribute("aria-selected", x === t); });
    $$(".panel").forEach((p) => p.classList.toggle("is-on", p.id === t.getAttribute("aria-controls")));
    moveInk(t);
  }));
  const inkInit = () => moveInk($(".tab.is-on")); addEventListener("resize", inkInit); document.fonts ? document.fonts.ready.then(inkInit) : inkInit(); inkInit();

  /* compare */
  const cmp = $("#compare"), range = $("#cmp-range");
  const setX = (v) => cmp.style.setProperty("--x", v + "%"); range.addEventListener("input", () => setX(range.value)); setX(50);
  const fit = () => { $("#cmp-before img").style.width = cmp.clientWidth + "px"; }; addEventListener("resize", fit); fit();

  U.bindPlaceholders("#efeae4", "#e7cfc6", "#2a2320");

  /* nav */
  const nav = $(".nav"), burger = $(".nav__burger"), menu = $("#menu");
  burger.addEventListener("click", () => { const open = menu.hidden; menu.hidden = !open; burger.setAttribute("aria-expanded", open); document.body.style.overflow = open ? "hidden" : ""; });
  $$("a", menu).forEach((a) => a.addEventListener("click", () => burger.click()));

  /* reveals */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); $$("[data-count]", e.target).forEach(countUp); if (e.target.dataset.count) countUp(e.target); io.unobserve(e.target); } }), { threshold: 0.12 });
  $$(".stats__row, .bento__grid, .process__row").forEach((g) => $$(".reveal", g).forEach((el, i) => (el.style.transitionDelay = Math.min(i * 70, 420) + "ms")));
  $$(".reveal").forEach((el) => io.observe(el));

  /* scroll engine: one passive listener, rAF-batched, writes transforms only */
  const pan = $(".pan"), track = $("#gallery"), pbar = $("#pan-progress");
  const sizePan = () => { if (innerWidth <= 900) { pan.style.height = ""; return; } const travel = track.scrollWidth - (pan.clientWidth - 2 * parseFloat(getComputedStyle(pan.querySelector(".pan__sticky")).paddingLeft)); pan.dataset.travel = Math.max(0, travel); pan.style.height = innerHeight + Math.max(0, travel) * 1.1 + "px"; };
  sizePan(); addEventListener("resize", sizePan); document.fonts && document.fonts.ready.then(sizePan);
  let raf = 0;
  const frame = () => {
    raf = 0;
    nav.classList.toggle("is-scrolled", scrollY > 30);
    if (innerWidth > 900) {
      const r = pan.getBoundingClientRect(), total = r.height - innerHeight, p = Math.min(1, Math.max(0, -r.top / total));
      track.style.transform = `translate3d(${(-p * (+pan.dataset.travel || 0)).toFixed(1)}px,0,0)`; pbar.style.transform = `scaleX(${p})`;
      let best = 0, bd = 1e9; steps.forEach((li, i) => { const rr = li.getBoundingClientRect(), d = Math.abs(rr.top + rr.height / 2 - innerHeight * 0.5); if (d < bd) { bd = d; best = i; } }); setStep(best);
    }
  };
  addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(frame); }, { passive: true }); frame();

  /* hero tilt (fine pointer only) */
  const tilt = $("#tilt");
  if (fine && !reduce) {
    tilt.addEventListener("pointermove", (e) => { const r = tilt.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; tilt.style.transform = `rotateY(${(x * 10).toFixed(2)}deg) rotateX(${(-y * 8).toFixed(2)}deg)`; tilt.style.transition = "transform .15s"; });
    tilt.addEventListener("pointerleave", () => { tilt.style.transition = "transform 1s cubic-bezier(.23,1,.32,1)"; tilt.style.transform = ""; });
  }
})();
