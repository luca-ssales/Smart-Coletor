
window.UI = (function () {
  function initNav() {
    const header = document.getElementById("header");
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("navMenu");
    const topBtn = document.getElementById("toTop");

    const setOpen = (open) => {
      menu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    };
    toggle.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });

    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 24);
      const show = window.scrollY > 600;
      topBtn.hidden = false;
      topBtn.classList.toggle("show", show);
      topBtn.tabIndex = show ? 0 : -1;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    const links = [...menu.querySelectorAll('a[href^="#"]')];
    const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((l) => l.classList.remove("active"));
          const link = map.get(en.target.id);
          if (link && !link.classList.contains("nav-cta")) link.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { items.forEach((i) => i.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach((i) => io.observe(i));
  }

  function initSteps() {
    const cards = document.querySelectorAll(".step-card");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const open = card.getAttribute("aria-expanded") === "true";
        cards.forEach((c) => c.setAttribute("aria-expanded", "false"));
        card.setAttribute("aria-expanded", String(!open));
      });
    });
  }

  function initStates() {
    const states = document.querySelectorAll(".state");
    states.forEach((s) => {
      s.addEventListener("click", () => {
        const wasOn = s.classList.contains("on");
        states.forEach((x) => x.classList.remove("on"));
        if (!wasOn) s.classList.add("on");
      });
    });

    initRangeCounter();
  }

  function initRangeCounter() {
    const rangeEls = document.querySelectorAll(".state .range-val");
    if (!rangeEls.length) return;

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const items = [...rangeEls].map((el, i) => {
      const from = Number(el.dataset.from ?? (i * 25));
      const to = Number(el.dataset.to ?? ((i + 1) * 25));
      return { el, from, to, current: to };
    });

    let isVisible = false;
    let animId = null;
    let cycleStartTime = null;

    const DURATION = 680; 
    const STAGGER = 100;  
    const HOLD = 1900;    
    const TOTAL_CYCLE = DURATION + (items.length - 1) * STAGGER + HOLD;

    function step(timestamp) {
      if (!isVisible) return;
      if (!cycleStartTime) cycleStartTime = timestamp;

      const elapsed = (timestamp - cycleStartTime) % TOTAL_CYCLE;

      items.forEach((item, index) => {
        const itemStart = index * STAGGER;
        if (elapsed < itemStart) {
          if (item.current !== item.from) {
            item.current = item.from;
            item.el.textContent = item.from;
            item.el.classList.remove("pop");
          }
        } else if (elapsed <= itemStart + DURATION) {
          const progress = (elapsed - itemStart) / DURATION;
          const ease = 1 - Math.pow(1 - progress, 3);
          const val = Math.round(item.from + (item.to - item.from) * ease);
          if (item.current !== val) {
            item.current = val;
            item.el.textContent = val;
          }
          if (val === item.to && !item.el.classList.contains("pop")) {
            item.el.classList.add("pop");
          }
        } else {
          if (item.current !== item.to) {
            item.current = item.to;
            item.el.textContent = item.to;
          }
          if (elapsed > itemStart + DURATION + 180) {
            item.el.classList.remove("pop");
          }
        }
      });

      animId = requestAnimationFrame(step);
    }

    const section = document.getElementById("sinalizacao") || document.getElementById("states");
    if (section && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            cycleStartTime = null;
            if (!animId) animId = requestAnimationFrame(step);
          } else {
            if (animId) {
              cancelAnimationFrame(animId);
              animId = null;
            }
            items.forEach((item) => {
              item.current = item.to;
              item.el.textContent = item.to;
              item.el.classList.remove("pop");
            });
          }
        });
      }, { threshold: 0.15 });
      observer.observe(section);
    } else {
      isVisible = true;
      animId = requestAnimationFrame(step);
    }

    document.querySelectorAll(".state").forEach((card, index) => {
      const item = items[index];
      if (!item) return;
      card.addEventListener("mouseenter", () => {
        let startT = null;
        const dur = 400;
        function hoverCount(ts) {
          if (!startT) startT = ts;
          const p = Math.min(1, (ts - startT) / dur);
          const e = 1 - Math.pow(1 - p, 3);
          const v = Math.round(item.from + (item.to - item.from) * e);
          item.el.textContent = v;
          if (p < 1) {
            requestAnimationFrame(hoverCount);
          } else {
            item.el.classList.add("pop");
            setTimeout(() => item.el.classList.remove("pop"), 180);
          }
        }
        requestAnimationFrame(hoverCount);
      });
    });
  }

  function fillFooter() {
    const p = window.APP_CONFIG.project;
    const map = { fMembers: p.members, fCourse: p.course, fInst: p.institution, fSubject: p.subject, fYear: p.year };
    Object.entries(map).forEach(([id, value]) => {
      if (!value) return;
      const el = document.getElementById(id);
      el.textContent = value;
      el.classList.remove("todo");
    });
  }

  function initTeam() {
    const grid = document.getElementById("teamGrid");
    if (!grid) return;

    const AREA_CONFIG = [
      {
        theme: "design",
        color: "#ec4899",
        glow: "rgba(236, 72, 153, 0.45)"
      },
      {
        theme: "strategy",
        color: "#f59e0b",
        glow: "rgba(245, 158, 11, 0.45)"
      },
      {
        theme: "web",
        color: "#10b981",
        glow: "rgba(16, 185, 129, 0.45)"
      },
      {
        theme: "iot",
        color: "#0ea5e9",
        glow: "rgba(14, 165, 233, 0.45)"
      },
      {
        theme: "qa",
        color: "#a855f7",
        glow: "rgba(168, 85, 247, 0.45)"
      }
    ];

    const getArea = (role, i) => {
      const r = (role || "").toLowerCase();
      if (r.includes("visual") || r.includes("design") || r.includes("comunicação")) return AREA_CONFIG[0];
      if (r.includes("gestão") || r.includes("estratégia") || r.includes("principios") || r.includes("gestao")) return AREA_CONFIG[1];
      if (r.includes("web") || r.includes("desenvolv") || r.includes("apresentação") || r.includes("front") || r.includes("código")) return AREA_CONFIG[2];
      if (r.includes("iot") || r.includes("automação") || r.includes("automacao") || r.includes("engenharia") || r.includes("arduino")) return AREA_CONFIG[3];
      if (r.includes("qualidade") || r.includes("documentação") || r.includes("documentacao") || r.includes("qa")) return AREA_CONFIG[4];
      return AREA_CONFIG[i % AREA_CONFIG.length];
    };

    grid.innerHTML = "";

    (window.APP_CONFIG.team || []).forEach((m, i) => {
      const area = getArea(m.role, i);
      const card = document.createElement("article");
      card.className = "member reveal";
      card.style.setProperty("--i", i);
      card.style.setProperty("--theme-color", area.color);
      card.style.setProperty("--theme-glow", area.glow);

      const avatarWrap = document.createElement("div");
      avatarWrap.className = "member-avatar-wrap";

      const photo = document.createElement("div");
      photo.className = "member-photo is-empty";
      const ph = document.createElement("span");
      ph.className = "member-ph";
      ph.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><use href="#user"/></svg>';
      photo.appendChild(ph);

      if (m.photo) {
        const img = document.createElement("img");
        img.alt = m.name ? "Foto de " + m.name : "Foto do integrante " + (i + 1);
        img.onload = () => photo.classList.remove("is-empty");
        img.onerror = () => {
          photo.classList.add("is-empty");
          img.remove();
        };
        img.src = encodeURI(m.photo);
        photo.prepend(img);
      }

      avatarWrap.appendChild(photo);

      const info = document.createElement("div");
      info.className = "member-info";
      const nameEl = document.createElement("h3");
      nameEl.textContent = m.name || "Nome do integrante";
      if (!m.name) nameEl.classList.add("todo");

      const roleEl = document.createElement("p");
      roleEl.className = "member-role";
      roleEl.textContent = m.role || "Contribuição no projeto";
      if (!m.role) roleEl.classList.add("todo");

      info.append(nameEl, roleEl);
      card.append(avatarWrap, info);
      grid.appendChild(card);
    });
  }

  function initTheme() {
    const btn = document.getElementById("themeToggle");
    const root = document.documentElement;
    const meta = document.querySelector('meta[name="theme-color"]');
    const apply = (light) => {
      if (light) root.setAttribute("data-theme", "light"); else root.removeAttribute("data-theme");
      btn.setAttribute("aria-pressed", String(light));
      btn.setAttribute("aria-label", light ? "Ativar modo escuro" : "Ativar modo claro");
      if (meta) meta.setAttribute("content", light ? "#f3f8ef" : "#0c1511");
    };
    apply(root.getAttribute("data-theme") === "light");
    btn.addEventListener("click", () => {
      const light = root.getAttribute("data-theme") !== "light";
      apply(light);
      try { localStorage.setItem("theme", light ? "light" : "dark"); } catch (e) {}
    });
  }

  function initCompanyVideo() {
    const video = document.getElementById("companyVideo");
    if (!video) return;

    video.addEventListener("click", () => {
      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }

  return { init() { initNav(); initTheme(); initCompanyVideo(); initTeam(); initReveal(); initSteps(); initStates(); fillFooter(); } };
})();
