/* BLUSH EDITORIAL — script */
(function () {
  const D = window.ETERNAL, U = D.util, B = D.brand;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  $$("[data-brand]").forEach((el) => (el.textContent = B[el.dataset.brand] || ""));
  $$("[data-founder]").forEach((el) => (el.textContent = D.founder[el.dataset.founder] || ""));
  $$("[data-wa]").forEach((a) => (a.href = U.waLink()));
  $$("[data-ig]").forEach((a) => (a.href = B.instagramUrl));
  $$("[data-tel]").forEach((a) => (a.href = "tel:" + B.phone.replace(/\s+/g, "")));
  $$("[data-maps]").forEach((a) => (a.href = B.mapsUrl));
  $("#year").textContent = new Date().getFullYear();
  $("#cover-date").textContent = new Date().toLocaleDateString("ro-RO", { month: "long", year: "numeric" });
  $("#schedule").innerHTML = B.schedule.map((s) => `<div class="sched"><span>${esc(s.days)}</span><span>${esc(s.hours)}</span></div>`).join("");

  const t = D.services.map((s) => `<span>${esc(s.name)}</span>`).join("");
  $("#ticker").innerHTML = t + t;

  $("#services").innerHTML = D.services.map((s, i) => `
    <li class="item reveal">
      <button class="item__head" aria-expanded="false" aria-controls="s-${s.id}">
        <span class="item__name">${esc(s.name)}</span>
        <span class="item__price">${esc(U.priceLabel(s.price))}</span>
        <span class="item__sub">${esc(s.subtitle)}</span>
      </button>
      <div class="item__more" id="s-${s.id}"><div><div class="in"><p>${esc(s.description)}</p><span class="dur">${esc(s.duration)}</span></div></div></div>
    </li>`).join("");
  $$(".item__head").forEach((b) => b.addEventListener("click", () => {
    const li = b.parentElement, open = !li.classList.contains("is-open");
    $$(".item.is-open").forEach((o) => { o.classList.remove("is-open"); $(".item__head", o).setAttribute("aria-expanded", "false"); });
    li.classList.toggle("is-open", open); b.setAttribute("aria-expanded", open);
  }));

  $("#gallery").innerHTML = D.photos.slice(0, 8).map((p) => `
    <figure class="tile reveal"><img data-photo="${esc(p.tag)}" src="${U.photoPath(p.src)}" alt="${esc(p.alt)}" width="800" height="1000" loading="lazy"><figcaption>${esc(p.tag)}</figcaption></figure>`).join("");

  $("#story").innerHTML = D.founder.story.map((p) => `<p class="reveal">${esc(p)}</p>`).join("");
  $("#creds").innerHTML = D.founder.credentials.map((c) => `<li class="reveal">${esc(c)}</li>`).join("");
  $("#process").innerHTML = D.process.map((p) => `<li class="card reveal"><i aria-hidden="true"></i><div><h3>${esc(p.step)}</h3><p>${esc(p.text)}</p></div></li>`).join("");
  $("#quotes").innerHTML = D.testimonials.map((q, i) => `
    <article class="voice reveal" style="--r:${[-1.5, 1, -0.5][i % 3]}deg"><blockquote>${esc(q.text)}</blockquote><footer><b>${esc(q.name)}</b> · ${esc(q.service)}</footer></article>`).join("");
  $("#faq").innerHTML = D.faq.map((f, i) => `
    <div class="q reveal"><button aria-expanded="false" aria-controls="q-${i}"><span>${esc(f.q)}</span><i aria-hidden="true">+</i></button><div class="a" id="q-${i}"><div><p>${esc(f.a)}</p></div></div></div>`).join("");
  $$(".q button").forEach((b) => b.addEventListener("click", () => {
    const open = b.parentElement.classList.toggle("is-open"); b.setAttribute("aria-expanded", open);
  }));

  U.bindPlaceholders("#e9c5c0", "#c9737a", "#3d1f2b");

  /* reading progress */
  const bar = $("#progress");
  const onScroll = () => { const h = document.documentElement; bar.style.transform = `scaleX(${(h.scrollTop / (h.scrollHeight - h.clientHeight)) || 0})`; };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* reveals with stagger per group */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$(".menu__list, .grid__wall, .steps__row, .voices__deck, .faq__list, .about__creds, #story").forEach((g) => $$(".reveal", g).forEach((el, i) => (el.style.transitionDelay = Math.min(i * 80, 480) + "ms")));
  $$(".reveal").forEach((el) => io.observe(el));

  /* tilt on voice cards */
  if (!reduce && matchMedia("(hover:hover)").matches) {
    $$(".voice").forEach((c) => {
      c.addEventListener("pointermove", (e) => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = `translateY(-8px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
      });
      c.addEventListener("pointerleave", () => (c.style.transform = ""));
    });
  }
})();
