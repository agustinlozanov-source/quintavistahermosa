// Quinta Vista Hermosa — interacciones
(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  /* ---------- Lugares cercanos ---------- */
  const ATTRACTIONS = [
    {
      name: "Centro Histórico",
      kicker: "Santiago",
      img: "centro-historico.jpg",
      text: "Villa colonial a treinta minutos de Monterrey: la Parroquia de Santiago Apóstol, la Casa del Arte y la Cultura, el museo, sus plazas y el mirador con vista a la sierra.",
      q: "Centro Histórico Santiago Nuevo León",
    },
    {
      name: "Pueblo Mágico",
      kicker: "Desde 2006",
      img: "centro-noche.jpg",
      text: "Santiago se incorporó a Pueblos Mágicos en 2006. Recibió el rango de Villa en 1831; antes, estas tierras fueron habitadas por guachichiles, rayados y borrados.",
      q: "Parroquia Santiago Apóstol Santiago Nuevo León",
    },
    {
      name: "Cañón de Matacanes",
      kicker: "Aventura extrema",
      img: "matacanes.jpg",
      text: "Aguas turquesa, pozas, saltos, ríos subterráneos y cuevas. Rappel y el salto de La Quebradita, de 12 metros. Mejor temporada: de marzo a agosto.",
      q: "Cañón de Matacanes",
    },
    {
      name: "Cola de Caballo",
      kicker: "Cascada",
      img: "cola-de-caballo.jpg",
      text: "La cascada más impresionante de Nuevo León: 25 metros de caída, miradores, zonas para día de campo y renta de caballos, cuatrimotos y bicicletas.",
      q: "Cascada Cola de Caballo Santiago Nuevo León",
    },
    {
      name: "Presa de la Boca",
      kicker: "Parque",
      img: "presa-de-la-boca.jpg",
      text: "La Presa Rodrigo Gómez, construida a finales de los 50 para abastecer de agua a Monterrey. Hoy es un clásico para pasear frente al agua y las montañas.",
      q: "Presa de la Boca Santiago Nuevo León",
    },
    {
      name: "Racing Track",
      kicker: "En familia",
      img: "racing-track.jpg",
      text: "Go-karts para quienes buscan adrenalina y competencia. Ideal para cumpleaños, eventos empresariales o cualquier festejo al extremo.",
      q: "Santiago Racing Track",
    },
    {
      name: "Parque Nacional Cumbres",
      kicker: "Área natural",
      img: "cumbres.jpg",
      text: "Casi 200 mil hectáreas de paredes rocosas, cañadas, valles y ríos. Rappel, cañonismo, escalada y observación de fauna.",
      q: "Parque Nacional Cumbres de Monterrey",
    },
    {
      name: "Cueva de la Boca",
      kicker: "Leyenda",
      img: "cueva-de-la-boca.jpg",
      text: "Dicen que aquí escondió su oro Agapito Treviño. Lo cierto: al anochecer salen cerca de cinco millones de murciélagos en una nube impresionante.",
      q: "Cueva de la Boca Santiago Nuevo León",
    },
    {
      name: "Cañón de Chipitín",
      kicker: "Rappel",
      img: "chipitin.jpg",
      text: "Rappeles para todos los niveles, pozas naturales, senderos, cañonismo y una vista impactante de su cascada de 75 metros.",
      q: "Cañón de Chipitín",
    },
  ];

  const carousel = document.querySelector(".carousel");
  if (carousel) {
    carousel.innerHTML = ATTRACTIONS.map(
      (a) => `
      <article class="card">
        <div class="card-img"><img src="assets/img/alrededores/${a.img}" alt="${a.name}" loading="lazy" /></div>
        <div class="card-body">
          <span class="card-kicker">${a.kicker}</span>
          <h3>${a.name}</h3>
          <p>${a.text}</p>
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.q)}" target="_blank" rel="noopener">Ver en el mapa →</a>
        </div>
      </article>`
    ).join("");

    document.querySelectorAll(".carousel-ctrl .round-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        const card = carousel.querySelector(".card");
        const step = card ? card.getBoundingClientRect().width + 20 : 400;
        carousel.scrollBy({ left: step * Number(btn.dataset.dir) });
      })
    );
  }

  /* ---------- Intro del Hero ---------- */
  requestAnimationFrame(() => {
    root.classList.add("is-loaded");
    setTimeout(() => root.classList.add("is-settled"), 1900);
  });

  /* ---------- Separar palabras del texto de bienvenida ---------- */
  const wordsEl = document.querySelector("[data-words]");
  let words = [];
  if (wordsEl) {
    [...wordsEl.childNodes].forEach((node) => {
      if (node.nodeType !== Node.TEXT_NODE) return;
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) return frag.append(" ");
        const s = document.createElement("span");
        s.className = "word";
        s.textContent = part;
        frag.append(s);
      });
      node.replaceWith(frag);
    });
    words = [...wordsEl.querySelectorAll(".word")];
  }

  /* ---------- Scroll: hero, texto, header ---------- */
  const hero = document.querySelector(".hero");
  const header = document.querySelector(".site-header");

  function onScroll() {
    const vh = window.innerHeight;

    if (hero && !reduced) {
      const r = hero.getBoundingClientRect();
      const p = clamp(-r.top / (r.height - vh));
      root.style.setProperty("--p", p.toFixed(4));
      // La segunda foto aparece en la segunda mitad del recorrido
      root.style.setProperty("--pb", clamp((p - 0.3) / 0.5).toFixed(4));
    }

    if (words.length) {
      const r = wordsEl.getBoundingClientRect();
      const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35));
      const lit = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("on", reduced || i < lit));
    }

    if (header && hero) {
      header.classList.toggle("is-solid", hero.getBoundingClientRect().bottom < 90);
    }
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    },
    { passive: true }
  );
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Aparición al entrar en pantalla + contadores ---------- */
  const countUp = (el) => {
    const target = Number(el.dataset.count);
    if (reduced) return (el.textContent = target);
    const start = performance.now();
    const tick = (t) => {
      const k = clamp((t - start) / 1200);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        e.target.querySelectorAll("[data-count]").forEach(countUp);
        io.unobserve(e.target);
      }),
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });

  /* ---------- Vista previa de foto al pasar por instalaciones ---------- */
  const preview = document.querySelector(".amenity-preview");
  if (preview && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".amenity").forEach((row) => {
      row.addEventListener("mouseenter", () => {
        preview.src = row.dataset.img;
        preview.classList.add("show");
      });
      row.addEventListener("mouseleave", () => preview.classList.remove("show"));
      row.addEventListener("mousemove", (e) => {
        preview.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 100}px) rotate(-3deg)`;
      });
    });
  }

  /* ---------- Menú móvil ---------- */
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menu.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle?.addEventListener("click", () => setMenu(menu.hidden));
  menu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
