# Roteiro de Apresentação e Defesa Técnica — Smart Coletor

Este documento serve como guia completo para explicar aos professores e avaliadores todas as decisões técnicas, funções, cálculos matemáticos e tecnologias implementadas no projeto **Smart Coletor**.

---

## 1. Visão Geral da Arquitetura do Software

- **Paradigma:** Vanilla Web (HTML5 Semântico, CSS3 Moderno com Design Tokens, JavaScript ES6+ Modular).
- **Zero Dependências Pesadas:** Não utilizamos frameworks pesados (como React ou Angular) nem bibliotecas de terceiros (como jQuery ou Bootstrap). Todo o código é nativo, garantindo performance extrema e controle total de cada pixel e evento.
- **Arquitetura Modular:**
  - `config.js`: Centraliza constantes, faixas de medição e dados da equipe.
  - `simulator.js`: Lógica matemática, física de partículas e simulação do sensor.
  - `chatbot.js` & `knowledge.js`: Motor de busca semântica e respostas locais.
  - `contact.js`: Integração com APIs externas (ViaCEP e Google Sheets).
  - `ui.js`: Interatividade visual, tema e transições de tela.

---

## 2. Simulador Interativo da Lixeira (`js/simulator.js`)

### A. Como é calculada a distância do sensor ultrassônico?
* **Pergunta do Professor:** *"Como o simulador calcula a distância em centímetros a partir da porcentagem de resíduos?"*
* **Explicação Técnica:**
  No arquivo `js/simulator.js`, a função é:
  ```javascript
  const distanceFor = (pct) => cfg.binDepthCm * (1 - pct / 100);
  ```
  O sensor ultrassônico **HC-SR04** fica instalado na tampa superior da lixeira, apontado para baixo:
  - Quando a lixeira está **0% cheia (vazia)**, a distância do sensor até o fundo é a profundidade total (`30 cm`).
  - Quando a lixeira está **100% cheia**, o resíduo encosta no topo e a distância lida pelo sensor é **`0 cm`**.
  - O cálculo inverte a porcentagem para refletir a física real da propagação da onda de som do Arduino.

### B. Como as barras de nível e o preenchimento sobem no SVG?
* **Pergunta do Professor:** *"Como você anima o líquido/resíduo e as barras dentro da lixeira vetorial?"*
* **Explicação Técnica:**
  - A lixeira foi desenhada com SVG nativo. O nível é controlado pela função `render(pct)` calculando a coordenada cartesiana `liquidY`:
  ```javascript
  const liquidY = 444 - (pct / 100) * 264;
  ```
  - `444` é a coordenada do fundo da lixeira no SVG e `264` é a altura máxima útil.
  - Cada uma das 4 faixas de cores (Verde, Amarelo, Laranja e Vermelho) tem seu próprio elemento `<rect>` que cresce proporcionalmente conforme a porcentagem avança, simulando o comportamento de 4 LEDs físicos do circuito Arduino.

### C. Como funcionam os resíduos caindo com física?
* **Pergunta do Professor:** *"Como você fez os lixos caírem dentro da lixeira de forma realista?"*
* **Explicação Técnica:**
  - Função `spawnTrashDrop()`: Instancia dinamicamente elementos SVG (`<use href="#itemPaper">`, etc.) através de `document.createElementNS("http://www.w3.org/2000/svg", "g")`.
  - Em vez de animação fixa de CSS, a animação usa **`requestAnimationFrame()`** com aceleração quadrática (`ease = progress * progress`), simulando a **aceleração da gravidade**:
  - Quando a coordenada Y do item atinge `currentY >= 65`, aciona a classe `.sonar-detect`, fazendo o feixe ultrassônico piscar exatamente no instante em que o objeto passa pelo campo de detecção do sensor.

### D. Como foi gerado o som de notificação sem arquivos MP3?
* **Pergunta do Professor:** *"De onde vem o som de alerta quando a lixeira enche?"*
* **Explicação Técnica:**
  - Função `playPhoneChime()`: Utiliza a **Web Audio API** nativa (`AudioContext`).
  - Os tons musicais são sintetizados matematicamente em tempo real usando osciladores de onda senoidal (`createOscillator()`) nas notas **Ré 5 (`587.33 Hz`)** e **Lá 5 (`880.00 Hz`)**, com atenuação de volume exponencial (`exponentialRampToValueAtTime`).
  - **Vantagem:** Não precisa carregar arquivos de áudio externos, funciona offline e tem latência zero.

---

## 3. Formulário de Contato e Integrações (`js/contact.js`)

### A. Como funciona a busca automática do CEP?
* **Pergunta do Professor:** *"Como o endereço é preenchido sozinho quando o usuário digita o CEP?"*
* **Explicação Técnica:**
  - A função `handleCepInput()` monitora o campo com máscara regex (`00000-000`).
  - Ao detectar **8 dígitos numéricos**, dispara a função assíncrona `fetchAddressByCep()` consumindo a API REST pública do **ViaCEP** via `fetch()`:
  ```javascript
  const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
  const data = await response.json();
  ```
  - Se válido, preenche automaticamente os campos de Rua, Bairro, Cidade e UF.
  - O campo **Número** é mantido em branco de propósito e recebe foco imediato com animação pulsante (`#contatoNumero.focus()`), otimizando a experiência do usuário.

### B. Como os dados vão para o Google Sheets sem servidor backend?
* **Pergunta do Professor:** *"Como o site salva na planilha sem ter um servidor Node.js ou PHP rodando?"*
* **Explicação Técnica:**
  - Criamos um **Google Apps Script Web App** conectado à planilha com a função `doPost(e)`.
  - O frontend envia um `fetch()` com método `POST`:
  ```javascript
  await fetch(sheetsUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });
  ```
  - **Ponto-chave para responder ao professor:** O Google Apps Script não processa pré-voo CORS (`OPTIONS`). Ao enviar com `mode: "no-cors"` e cabeçalho `text/plain`, a requisição é tratada como uma *Simple Request* pelo navegador, enviando os dados JSON sem bloqueio de segurança CORS e sem custo de hospedagem.
  - Além disso, adicionamos **persistência local (`localStorage`)**, salvando uma cópia de segurança no navegador do cliente para prevenir perda de dados.

---

## 4. Chatbot Assistente (`js/chatbot.js` e `js/knowledge.js`)

* **Pergunta do Professor:** *"Esse assistente usa OpenAI / ChatGPT? Como ele responde?"*
* **Explicação Técnica:**
  - Não usa APIs externas de IA paga, tornando o projeto autônomo e offline.
  - Criamos uma base de conhecimento estruturada em `knowledge.js` com tópicos, palavras-chave e sinônimos.
  - O algoritmo em `chatbot.js` realiza:
    1. **Normalização de texto:** Remove acentos (Unicode NFD) e converte para minúsculas.
    2. **Extração de tokens:** Quebra a frase em palavras significativas.
    3. **Algoritmo de Correspondência Semântica:** Atribui pesos aos termos encontrados. A resposta com maior pontuação é exibida na tela com efeito de digitação e sugestão de perguntas relacionadas (*chips*).

---

## 5. Animações e Efeitos Visuais no CSS

### A. Como o vídeo institucional foi recortado para esconder a marca d'água?
* **Pergunta do Professor:** *"Como foi feito o acabamento do vídeo da empresa?"*
* **Explicação Técnica:**
  - Utilizamos a técnica de **Overscan com Mascaramento**:
    - O contêiner `.company-img-wrap` possui `overflow: hidden` e uma moldura sólida de `6px`.
    - O elemento `<video>` recebe `transform: scale(1.09); transform-origin: center 20%;`.
    - Esse zoom de 9% com ponto de ancoragem no topo empurra as margens inferiores e laterais (onde ficavam marcas d'água) para fora da área visível do contêiner.

### B. Como funciona a lixeira animada do topo (Hero)?
* **Pergunta do Professor:** *"Como todos os elementos da lixeira do topo se movem juntos no mesmo ritmo?"*
* **Explicação Técnica:**
  - Criamos uma variável no CSS: `--cycle: 14s;`.
  - Todas as animações (`@keyframes heroRise`, `@keyframes heroColor`, `@keyframes orbColor`) usam a mesma duração de 14 segundos, mantendo a subida dos resíduos, a troca de cor dos LEDs e a iluminação ambiente perfeitamente sincronizadas.
  - Para o resíduo não sair pelas laterais da lixeira, usamos um elemento SVG `<clipPath id="hClip">` que recorta o desenho exatamente no formato trapezoidal da lixeira.

### C. Como foi feito o Modo Claro / Modo Escuro sem piscar a tela (FOUC)?
* **Pergunta do Professor:** *"Como o tema claro é aplicado sem que a tela pisque preta ao carregar?"*
* **Explicação Técnica:**
  - No `<head>` de `index.html`, executamos um script síncrono antes do carregamento do `<body>`. Ele lê o `localStorage` e define o atributo `data-theme="light"` no elemento `<html>` antes da primeira pintura gráfica do navegador, eliminando o efeito *FOUC (Flash of Unstyled Content)*.
  - No CSS, usamos **Design Tokens / CSS Custom Properties** (`--bg`, `--text`, `--surface`). Ao mudar o atributo `data-theme`, o navegador recalcula instantaneamente toda a paleta de cores.

### D. Como as seções surgem suavemente ao rolar a página?
* **Pergunta do Professor:** *"Como você detecta quando uma seção aparece na tela para animá-la?"*
* **Explicação Técnica:**
  - Usamos a **`IntersectionObserver API`** em `js/ui.js`:
  ```javascript
  const observer = new IntersectionObserver((entries) => { ... }, { threshold: 0.15 });
  ```
  - Ela é disparada pela GPU do navegador quando 15% do elemento entra no campo de visão, aplicando a classe `.visible`. Isso é muito mais performático do que utilizar ouvintes de rolagem tradicionais (`window.addEventListener('scroll')`), que sobrecarregam a CPU.
