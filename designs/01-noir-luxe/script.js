/* NOIR LUXE — script */
(function () {
  const D = window.ETERNAL, U = D.util, B = D.brand;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---- brand bindings ---- */
  $$("[data-brand]").forEach((el) => (el.textContent = B[el.dataset.brand] || ""));
  $$("[data-wa]").forEach((a) => (a.href = U.waLink()));
  $$("[data-ig]").forEach((a) => (a.href = B.instagramUrl));
  $$("[data-tel]").forEach((a) => (a.href = "tel:" + B.phone.replace(/\s+/g, "")));
  $$("[data-maps]").forEach((a) => (a.href = B.mapsUrl));
  $("#year").textContent = new Date().getFullYear();
  $("#schedule").innerHTML = B.schedule.map((s) => `<div class="sched"><span>${esc(s.days)}</span><span>${esc(s.hours)}</span></div>`).join("");

  /* ---- marquee ---- */
  const items = D.services.map((s) => `<span class="marquee__item"><i></i>${esc(s.name)}</span>`).join("");
  $("#marquee").innerHTML = items + items;

  /* ---- services (accordion rows + hover preview) ---- */
  const list = $("#services");
  list.innerHTML = D.services.map((s, i) => `
    <li class="service reveal" data-i="${i}">
      <div class="service__row" role="button" tabindex="0" aria-expanded="false" aria-controls="svc-${s.id}">
        <h3 class="service__name">${esc(s.name)}</h3>
        <p class="service__sub">${esc(s.subtitle)}</p>
        <span class="service__meta">${esc(s.duration)}</span>
        <span class="service__price">${esc(U.priceLabel(s.price))}</span>
      </div>
      <div class="service__body" id="svc-${s.id}"><div><p>${esc(s.description)}</p></div></div>
    </li>`).join("");
  const preview = $("#services-preview"), pimg = $("img", preview);
  $$(".service", list).forEach((li, i) => {
    const row = $(".service__row", li);
    const toggle = () => {
      const open = li.classList.toggle("is-open");
      row.setAttribute("aria-expanded", open);
    };
    row.addEventListener("click", toggle);
    row.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
    row.addEventListener("pointerenter", () => {
      const ph = D.photos[i % D.photos.length];
      pimg.src = U.photoPath(ph.src); pimg.alt = "";
      pimg.onerror = () => (pimg.src = U.placeholder(ph.tag, "#1e1a1c", "#3a2f27", "#c9a46b"));
      preview.classList.add("is-visible");
    });
    row.addEventListener("pointerleave", () => preview.classList.remove("is-visible"));
  });
  list.addEventListener("pointermove", (e) => {
    const r = list.getBoundingClientRect();
    preview.style.top = Math.max(0, e.clientY - r.top - preview.offsetHeight / 2) + "px";
  });

  /* ---- gallery ---- */
  const gal = $("#gallery");
  gal.innerHTML = D.photos.slice(0, 8).map((p) => `
    <figure class="shot reveal">
      <img data-photo="${esc(p.tag)}" src="${U.photoPath(p.src)}" alt="${esc(p.alt)}" width="800" height="1000" loading="lazy" draggable="false">
      <figcaption>${esc(p.tag)}</figcaption>
    </figure>`).join("");
  // drag to scroll
  let down = false, sx = 0, sl = 0;
  gal.addEventListener("pointerdown", (e) => { down = true; sx = e.clientX; sl = gal.scrollLeft; gal.classList.add("is-dragging"); });
  window.addEventListener("pointerup", () => { down = false; gal.classList.remove("is-dragging"); });
  gal.addEventListener("pointermove", (e) => { if (down) gal.scrollLeft = sl - (e.clientX - sx); });

  /* ---- about / process ---- */
  $("#story").innerHTML = D.founder.story.map((p) => `<p class="reveal">${esc(p)}</p>`).join("");
  $("#creds").innerHTML = D.founder.credentials.map((c) => `<li class="reveal">${esc(c)}</li>`).join("");
  $("#process").innerHTML = D.process.map((p, i) => `<li class="step reveal" style="--i:${i}"><h3>${esc(p.step)}</h3><p>${esc(p.text)}</p></li>`).join("");

  /* ---- quotes rotator ---- */
  const stage = $("#quotes"), qnav = $("#quotes-nav");
  stage.innerHTML = D.testimonials.map((t, i) => `
    <blockquote class="quote${i === 0 ? " is-active" : ""}" role="tabpanel">
      <p>${esc(t.text)}</p><footer><b>${esc(t.name)}</b> · ${esc(t.service)}</footer>
    </blockquote>`).join("");
  qnav.innerHTML = D.testimonials.map((_, i) => `<button role="tab" aria-selected="${i === 0}" aria-label="Testimonial ${i + 1}"></button>`).join("");
  let qi = 0, timer;
  const show = (n) => {
    qi = (n + D.testimonials.length) % D.testimonials.length;
    $$(".quote", stage).forEach((q, i) => q.classList.toggle("is-active", i === qi));
    $$("button", qnav).forEach((b, i) => b.setAttribute("aria-selected", i === qi));
  };
  const arm = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => show(qi + 1), 6000); };
  $$("button", qnav).forEach((b, i) => b.addEventListener("click", () => { show(i); arm(); }));
  arm();

  /* ---- faq ---- */
  $("#faq").innerHTML = D.faq.map((f, i) => `
    <div class="faq__item reveal">
      <button class="faq__q" aria-expanded="false" aria-controls="faq-${i}"><span>${esc(f.q)}</span><i aria-hidden="true"></i></button>
      <div class="faq__a" id="faq-${i}"><div><p>${esc(f.a)}</p></div></div>
    </div>`).join("");
  $$(".faq__q").forEach((b) => b.addEventListener("click", () => {
    const item = b.parentElement, open = item.classList.toggle("is-open");
    b.setAttribute("aria-expanded", open);
  }));

  /* ---- placeholders for missing photos (palette: ink → warm brown, gold text) ---- */
  U.bindPlaceholders("#1e1a1c", "#3a2f27", "#c9a46b");

  /* ---- nav state + mobile menu ---- */
  const nav = $(".nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 24);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const burger = $(".nav__burger"), menu = $("#mobile-menu");
  burger.addEventListener("click", () => {
    const open = menu.hidden; menu.hidden = !open;
    burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Închide meniul" : "Deschide meniul");
    document.body.style.overflow = open ? "hidden" : "";
  });
  $$("a", menu).forEach((a) => a.addEventListener("click", () => burger.click()));

  /* ---- reveals (IntersectionObserver, once) ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal, .process__steps, .contact__title").forEach((el) => io.observe(el));
  // hero text: reveal on load
  requestAnimationFrame(() => setTimeout(() => $(".hero").classList.add("is-in"), 80));
  // stagger reveals inside the same parent
  $$(".services__list, .about__creds, .process__steps, .gallery__scroller, .faq__list").forEach((group) =>
    $$(".reveal", group).forEach((el, i) => (el.style.transitionDelay = Math.min(i * 70, 420) + "ms")));

  /* ---- parallax (hero frame) ---- */
  if (!reduce) {
    const els = $$("[data-parallax]");
    let raf = 0;
    const tick = () => {
      raf = 0;
      els.forEach((el) => {
        const r = el.getBoundingClientRect(), v = (r.top + r.height / 2 - innerHeight / 2) * parseFloat(el.dataset.parallax);
        el.style.transform = `translate3d(0,${(-v).toFixed(1)}px,0)`;
      });
    };
    addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(tick); }, { passive: true }); tick();
  }

  /* ---- magnetic buttons + custom cursor (fine pointers only) ---- */
  if (matchMedia("(hover:hover) and (pointer:fine)").matches && !reduce) {
    $$("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.22, y = (e.clientY - r.top - r.height / 2) * 0.32;
        btn.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
      });
      btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
    });
    const cur = $(".cursor");
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function loop() { cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22; cur.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
    $$("a, button, .service__row, .shot").forEach((el) => {
      el.addEventListener("pointerenter", () => document.body.classList.add("cursor-hover"));
      el.addEventListener("pointerleave", () => document.body.classList.remove("cursor-hover"));
    });
  }
})();
