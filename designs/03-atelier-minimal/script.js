/* ATELIER MINIMAL — script */
(function () {
  const D = window.ETERNAL, U = D.util, B = D.brand;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  $$("[data-brand]").forEach((el) => (el.textContent = B[el.dataset.brand] || ""));
  $$("[data-founder]").forEach((el) => (el.textContent = D.founder[el.dataset.founder] || ""));
  $$("[data-wa]").forEach((a) => (a.href = U.waLink()));
  $$("[data-ig]").forEach((a) => (a.href = B.instagramUrl));
  $$("[data-tel]").forEach((a) => (a.href = "tel:" + B.phone.replace(/\s+/g, "")));
  $$("[data-maps]").forEach((a) => (a.href = B.mapsUrl));
  $("#year").textContent = new Date().getFullYear();
  $("#schedule").innerHTML = B.schedule.map((s) => `<div class="sched"><span>${esc(s.days)}</span><span>${esc(s.hours)}</span></div>`).join("");

  $("#services").innerHTML = D.services.map((s) => `
    <div class="row reveal" role="button" tabindex="0" aria-expanded="false" aria-controls="d-${s.id}">
      <h3 class="row__name">${esc(s.name)}</h3>
      <p class="row__sub">${esc(s.subtitle)}</p>
      <span class="row__dur">${esc(s.duration)}</span>
      <span class="row__price">${esc(U.priceLabel(s.price))}</span>
      <div class="row__desc" id="d-${s.id}"><div><p>${esc(s.description)}</p>${s.maintenance ? `<span class="maint">${esc(s.maintenance)}</span>` : ""}</div></div>
    </div>`).join("");
  $$(".row").forEach((r) => {
    const t = () => { const o = r.classList.toggle("is-open"); r.setAttribute("aria-expanded", o); };
    r.addEventListener("click", t);
    r.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); t(); } });
  });

  $("#gallery").innerHTML = D.photos.slice(0, 8).map((p) => `
    <figure class="work reveal"><img data-photo="${esc(p.tag)}" src="${U.photoPath(p.src)}" alt="${esc(p.alt)}" width="800" height="1000" loading="lazy"><figcaption>${esc(p.tag)}</figcaption></figure>`).join("");
  $("#stats").innerHTML = D.stats.map((s) => `<li class="reveal"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></li>`).join("");
  $("#values").innerHTML = D.founder.values.map((v) => `<li class="reveal"><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></li>`).join("");
  $("#care-title").textContent = D.aftercare.title; $("#care-intro").textContent = D.aftercare.intro;
  $("#care").innerHTML = D.aftercare.tips.map((t, i) => `<li class="reveal"><i aria-hidden="true">${i + 1}</i><div><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></div></li>`).join("");
  $("#policies-title").textContent = D.policies.title;
  $("#policies").innerHTML = D.policies.items.map((p) => `<div class="reveal"><dt>${esc(p.title)}</dt><dd>${esc(p.text)}</dd></div>`).join("");
  $("#story").innerHTML = D.founder.story.map((p) => `<p class="reveal">${esc(p)}</p>`).join("");
  $("#creds").innerHTML = D.founder.credentials.map((c) => `<li class="reveal">${esc(c)}</li>`).join("");
  $("#process").innerHTML = D.process.map((p, i) => `<li class="pstep reveal" style="--i:${i}"><i aria-hidden="true"></i><h3>${esc(p.step)}</h3><p>${esc(p.text)}</p></li>`).join("");
  $("#quotes").innerHTML = D.testimonials.map((q) => `
    <article class="voice reveal"><p>${esc(q.text)}</p><footer><i aria-hidden="true">${esc(q.name[0])}</i><span><b>${esc(q.name)}</b> · ${esc(q.service)}</span></footer></article>`).join("");
  $("#faq").innerHTML = D.faq.map((f, i) => `
    <div class="fq reveal"><button aria-expanded="false" aria-controls="f-${i}"><span>${esc(f.q)}</span><i aria-hidden="true"></i></button><div class="a" id="f-${i}"><div><p>${esc(f.a)}</p></div></div></div>`).join("");
  $$(".fq button").forEach((b) => b.addEventListener("click", () => { const o = b.parentElement.classList.toggle("is-open"); b.setAttribute("aria-expanded", o); }));

  U.bindPlaceholders("#ece7df", "#b9c4b4", "#23221f");

  /* before/after */
  const cmp = $("#compare"), range = $("#cmp-range");
  const setX = (v) => cmp.style.setProperty("--x", v + "%");
  range.addEventListener("input", () => setX(range.value)); setX(range.value);
  // keep the "before" image sized to the container so both align
  const fit = () => { const w = cmp.clientWidth; $("#cmp-before img").style.width = w + "px"; };
  addEventListener("resize", fit); fit();

  /* reveals */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$(".services__table, .works__grid, .process__list, .voices__row, .faq__list, .about__creds, .stats__row, .values__row, .care__grid, .notes__list, #story").forEach((g) => $$(".reveal", g).forEach((el, i) => (el.style.transitionDelay = Math.min(i * 60, 360) + "ms")));
  $$(".reveal").forEach((el) => io.observe(el));
})();
