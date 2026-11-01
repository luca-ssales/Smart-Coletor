
window.Chatbot = (function () {
  const K = window.KNOWLEDGE;
  const history = [];
  let busy = false;
  let provider;

  const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s\-]/g, " ").replace(/\s+/g, " ").trim();

  const localProvider = {
    async reply(question) {
      const q = " " + normalize(question) + " ";
      let best = null, bestScore = 0;
      K.topics.forEach((t) => {
        let score = 0;
        t.keywords.forEach((kw) => {
          const k = normalize(kw);
          if (q.includes(" " + k + " ")) score += k.includes(" ") ? 3 : 2;   
          else if (k.length > 4 && q.includes(k)) score += 1;               
        });
        if (score > bestScore) { bestScore = score; best = t; }
      });
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 500)); 
      return best ? best.answer : K.fallback;
    }
  };
  provider = localProvider;

  const $ = (id) => document.getElementById(id);

  function addMessage(role, text) {
    const el = document.createElement("div");
    el.className = "msg " + role;
    el.textContent = text;
    $("chatLog").appendChild(el);
    scrollDown();
    return el;
  }
  const scrollDown = () => { const l = $("chatLog"); l.scrollTop = l.scrollHeight; };

  function setBusy(v) {
    busy = v;
    $("chatSend").disabled = v;
    document.querySelectorAll("#chips .chip").forEach((c) => (c.disabled = v));
  }

  async function ask(text) {
    text = text.trim();
    if (!text || busy) return;
    setBusy(true);
    addMessage("user", text);
    history.push({ role: "user", content: text });

    const typing = document.createElement("div");
    typing.className = "msg bot typing";
    typing.setAttribute("aria-label", "O assistente está digitando");
    typing.innerHTML = "<i></i><i></i><i></i>";
    $("chatLog").appendChild(typing);
    scrollDown();

    let answer;
    try { answer = await provider.reply(text, history.slice()); }
    catch (err) { answer = "Desculpe, não consegui responder agora. Tente novamente."; }
    typing.remove();
    addMessage("bot", answer);
    history.push({ role: "assistant", content: answer });
    setBusy(false);
  }

  function init() {
    
    $("chatLog").replaceChildren();
    $("chips").replaceChildren();
    addMessage("bot", K.welcome);
    const chips = $("chips");
    K.suggestions.forEach((s) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = s;
      b.addEventListener("click", () => ask(s));
      chips.appendChild(b);
    });
    $("chatForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("chatInput");
      const v = input.value;
      input.value = "";
      ask(v);
    });
  }

  return { init, ask, setProvider(p) { provider = p; } };
})();
