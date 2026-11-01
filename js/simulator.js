
window.Simulator = (function () {
  const cfg = window.APP_CONFIG;
  const $ = (id) => document.getElementById(id);
  const GAUGE_LEN = 326.7; 
  let timer = null;

  const levelIndex = (pct) => cfg.levels.findIndex((l) => pct < l.max);

  const distanceFor = (pct) => cfg.binDepthCm * (1 - pct / 100);

  const notifState = {
    notified50: false,
    notified75: false,
    notified100: false
  };

  function playPhoneChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now); 
      osc1.frequency.setValueAtTime(880.00, now + 0.1); 

      osc2.frequency.setValueAtTime(1174.66, now + 0.1); 

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.1);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } catch (e) {
      
    }
  }

  function triggerPhoneFeedback() {
    const mockup = $("phoneMockup");
    const screen = $("phoneScreen");
    if (mockup) {
      mockup.classList.remove("vibrate");
      void mockup.offsetWidth;
      mockup.classList.add("vibrate");
      setTimeout(() => mockup.classList.remove("vibrate"), 400);
    }
    if (screen) {
      screen.classList.remove("screen-wake");
      void screen.offsetWidth;
      screen.classList.add("screen-wake");
      setTimeout(() => screen.classList.remove("screen-wake"), 700);
    }
    playPhoneChime();
  }

  function addPhoneNotification(type, title, desc) {
    const list = $("phoneNotifsList");
    if (!list) return;

    const idleHint = $("phoneIdleHint");
    if (idleHint) idleHint.style.display = "none";

    const existing = list.querySelector(`.phone-push-card[data-type="${type}"]`);
    if (existing) {
      existing.querySelector(".push-desc").textContent = desc;
      return;
    }

    const card = document.createElement("div");
    card.className = `phone-push-card card-${type}`;
    card.setAttribute("data-type", type);

    card.innerHTML = `
      <div class="push-top">
        <div class="push-icon-box">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5">
            <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </div>
        <span class="push-app">SMARTBIN IoT</span>
        <span class="push-time">Agora</span>
      </div>
      <div class="push-title">${title}</div>
      <div class="push-desc">${desc}</div>
    `;

    list.prepend(card);
    triggerPhoneFeedback();
  }

  function clearPhoneNotifications() {
    const list = $("phoneNotifsList");
    if (!list) return;

    list.innerHTML = `
      <div class="phone-idle-hint" id="phoneIdleHint">
        <span class="idle-pulse-dot"></span>
        <span>Monitoramento IoT Ativo</span>
      </div>
    `;

    notifState.notified50 = false;
    notifState.notified75 = false;
    notifState.notified100 = false;
  }

  function checkPhoneThresholds(pct, dist) {
    
    if (pct >= 50 && !notifState.notified50) {
      notifState.notified50 = true;
      addPhoneNotification(
        "warning",
        "⚠️ Capacidade em 50%",
        `Lixeira atingiu metade da capacidade (${dist.toFixed(1).replace(".", ",")} cm do sensor).`
      );
    }

    if (pct >= 75 && !notifState.notified75) {
      notifState.notified75 = true;
      addPhoneNotification(
        "alert",
        "🚨 Alerta: Nível em 75%",
        `Capacidade alta! Planeje a coleta em breve (${dist.toFixed(1).replace(".", ",")} cm).`
      );
    }

    if (pct >= 98 && !notifState.notified100) {
      notifState.notified100 = true;
      addPhoneNotification(
        "critical",
        "⛔ Lixeira Cheia (100%)",
        "Limite máximo atingido! Esvaziamento necessário imediatamente."
      );
    }

    if (pct <= 2 && (notifState.notified50 || notifState.notified75 || notifState.notified100)) {
      clearPhoneNotifications();
    }
  }

  function updatePhoneClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const mins = String(now.getMinutes()).padStart(2, "0");
    const timeStr = `${hours}:${mins}`;

    const statusTime = $("phoneStatusTime");
    const bigClock = $("phoneBigClock");
    const lockDate = $("phoneLockDate");

    if (statusTime) statusTime.textContent = timeStr;
    if (bigClock) bigClock.textContent = timeStr;

    if (lockDate) {
      const options = { weekday: "long", day: "numeric", month: "long" };
      lockDate.textContent = now.toLocaleDateString("pt-BR", options);
    }
  }

  function render(pct) {
    const idx = levelIndex(pct);
    const level = cfg.levels[idx];
    const dist = distanceFor(pct);

    $("pctText").textContent = Math.round(pct);
    $("distText").textContent = dist.toFixed(1).replace(".", ",");
    const status = $("statusText");
    status.textContent = level.name;
    status.dataset.state = idx;

    checkPhoneThresholds(pct, dist);

    $("gaugeVal").style.strokeDashoffset = GAUGE_LEN * (1 - pct / 100);
    const fill = $("barFill");
    fill.style.width = pct + "%";
    fill.style.setProperty("--bw", pct > 0 ? (10000 / pct) + "%" : "100%");

    const hGreen = Math.min(66, (pct / 25) * 66);
    const barGreen = $("pillBarGreen");
    if (barGreen) {
      barGreen.setAttribute("y", (444 - hGreen).toFixed(1));
      barGreen.setAttribute("height", hGreen.toFixed(1));
    }

    const hYellow = pct <= 25 ? 0 : Math.min(66, ((pct - 25) / 25) * 66);
    const barYellow = $("pillBarYellow");
    if (barYellow) {
      barYellow.setAttribute("y", (378 - hYellow).toFixed(1));
      barYellow.setAttribute("height", hYellow.toFixed(1));
    }

    const hOrange = pct <= 50 ? 0 : Math.min(66, ((pct - 50) / 25) * 66);
    const barOrange = $("pillBarOrange");
    if (barOrange) {
      barOrange.setAttribute("y", (312 - hOrange).toFixed(1));
      barOrange.setAttribute("height", hOrange.toFixed(1));
    }

    const hRed = pct <= 75 ? 0 : Math.min(66, ((pct - 75) / 25) * 66);
    const barRed = $("pillBarRed");
    if (barRed) {
      barRed.setAttribute("y", (246 - hRed).toFixed(1));
      barRed.setAttribute("height", hRed.toFixed(1));
    }

    const liquidY = 444 - (pct / 100) * 264;

    const topLine = $("pillTopLine");
    if (topLine) {
      topLine.setAttribute("y1", liquidY.toFixed(1));
      topLine.setAttribute("y2", liquidY.toFixed(1));
      topLine.style.opacity = pct > 0 ? "0.85" : "0";
    }

    const indGroup = $("pillIndicatorGroup");
    if (indGroup) {
      indGroup.style.transform = `translateY(${liquidY.toFixed(1)}px)`;
      const indLine = $("pillIndLine");
      const indBadge = $("pillIndBadge");
      const indText = $("pillIndText");
      if (indLine) indLine.setAttribute("stroke", level.color);
      if (indBadge) indBadge.setAttribute("stroke", level.color);
      if (indText) {
        indText.setAttribute("fill", level.color);
        indText.textContent = `${Math.round(pct)}%`;
      }
    }

    const beam = $("simBeam");
    if (beam) beam.style.opacity = (0.4 + (pct / 100) * 0.4).toFixed(2);

    $("bin").dataset.level = idx;

    const range = $("levelRange");
    range.setAttribute("aria-valuetext", `${Math.round(pct)}% — ${level.name}`);
    if (Number(range.value) !== Math.round(pct)) range.value = Math.round(pct);
  }

  let autoDirection = "up";
  const TRASH_ITEMS = ["itemPaper", "itemCan", "itemCup"];
  let trashItemIdx = 0;

  function spawnTrashDrop() {
    const layer = $("trashDropLayer");
    if (!layer) return;

    const itemId = TRASH_ITEMS[trashItemIdx];
    trashItemIdx = (trashItemIdx + 1) % TRASH_ITEMS.length;

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "trash-drop-item");

    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#${itemId}`);
    use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#${itemId}`);
    g.appendChild(use);
    layer.appendChild(g);

    const startX = 145 + (Math.random() * 70); 
    const endX = startX + (Math.random() * 24 - 12);
    const startY = 2 + (Math.random() * 14);
    const endY = 126 + (Math.random() * 8);
    const startRot = -45 + (Math.random() * 90);
    const endRot = startRot + (-60 + (Math.random() * 120));

    const duration = 580 + (Math.random() * 200); 
    const startTime = performance.now();
    let sensorTriggered = false;

    function anim(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      const ease = progress * progress;

      const currentX = startX + (endX - startX) * progress;
      const currentY = startY + (endY - startY) * ease;
      const currentRot = startRot + (endRot - startRot) * progress;
      const currentScale = 1.08 - (progress * 0.38);

      let opacity = 1;
      if (progress < 0.12) {
        opacity = progress / 0.12;
      } else if (progress > 0.8) {
        opacity = (1 - progress) / 0.2;
      }

      g.setAttribute(
        "transform",
        `translate(${currentX.toFixed(1)}, ${currentY.toFixed(1)}) rotate(${currentRot.toFixed(1)}) scale(${currentScale.toFixed(2)})`
      );
      g.setAttribute("opacity", opacity.toFixed(2));

      if (!sensorTriggered && currentY >= 65) {
        sensorTriggered = true;
        const beam = $("simBeam");
        if (beam) {
          beam.classList.add("sonar-detect");
          setTimeout(() => beam.classList.remove("sonar-detect"), 220);
        }
      }

      if (progress < 1) {
        requestAnimationFrame(anim);
      } else {
        if (g.parentNode) g.remove();
      }
    }

    requestAnimationFrame(anim);
  }

  function spawnTrashBurst(count = 2) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        spawnTrashDrop();
      }, i * (90 + Math.random() * 70));
    }
  }

  function stopAuto() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    const btn = $("autoBtn");
    if (btn) {
      btn.setAttribute("aria-pressed", "false");
      btn.textContent = "Simular enchimento automático";
    }
  }

  function startAuto() {
    stopAuto();
    const btn = $("autoBtn");
    if (btn) {
      btn.setAttribute("aria-pressed", "true");
      btn.textContent = "Parar simulação";
    }

    const current = Number($("levelRange").value) || 0;
    autoDirection = current >= 100 ? "down" : "up";

    function step() {
      const val = Number($("levelRange").value) || 0;

      if (autoDirection === "up") {
        if (val < 100) {
          const next = Math.min(100, val + 1);
          render(next);

          if (next === 2) {
            spawnTrashBurst(3);
          } else if (next % 4 === 0 && next < 96) {
            spawnTrashBurst(Math.random() > 0.45 ? 2 : 1);
          }

          timer = setTimeout(step, 80);
        } else {
          
          autoDirection = "down";
          timer = setTimeout(step, 800);
        }
      } else {
        
        if (val > 0) {
          const next = Math.max(0, val - 4);
          render(next);
          
          timer = setTimeout(step, 25);
        } else {
          
          autoDirection = "up";
          timer = setTimeout(step, 400);
        }
      }
    }

    step();
  }

  function init() {
    updatePhoneClock();
    setInterval(updatePhoneClock, 30000);

    const range = $("levelRange");
    let lastManualVal = range ? Number(range.value) : 0;

    if (range) {
      range.addEventListener("input", () => {
        stopAuto();
        const v = Number(range.value);
        if (v > lastManualVal + 3) {
          const count = Math.min(3, Math.max(1, Math.floor((v - lastManualVal) / 3)));
          spawnTrashBurst(count);
          lastManualVal = v;
        } else if (v < lastManualVal) {
          lastManualVal = v;
        }
        render(v);
      });
    }
    const autoBtn = $("autoBtn");
    if (autoBtn) autoBtn.addEventListener("click", () => (timer ? stopAuto() : startAuto()));
    if (range) render(Number(range.value));
  }

  return { init, render, levelIndex, distanceFor };
})();
