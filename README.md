# Smart Coletor — Monitoramento Inteligente de Resíduos com Arduino

Projeto acadêmico interdisciplinar desenvolvido para automação, monitoramento em tempo real do nível de preenchimento de lixeiras e sustentabilidade urbana.

---

## Estrutura do Projeto

```text
faculdade/
│
├── assets/                    # Recursos de mídia estáticos
│   ├── favicon.svg            # Ícone do site
│   ├── empresa.png            # Imagem/pôster institucional
│   ├── video-empresa.mp4      # Vídeo de apresentação institucional
│   └── team/                  # Fotos dos integrantes da equipe
│       ├── Ana.png
│       ├── Iris.png
│       ├── Lucas.png
│       ├── Rafa Alcasser.png
│       └── Rafaella.png
│
├── css/                       # Estilização modular da interface
│   ├── base.css               # Design tokens, tipografia e reset
│   ├── layout.css             # Estrutura geral, cabeçalho e rodapé
│   ├── sections.css           # Estilos de todas as seções e simulação
│   ├── theme-light.css        # Paleta e adaptações do Modo Claro
│   └── chatbot.css            # Interface e animações do assistente
│
├── js/                        # Scripts da aplicação cliente
│   ├── main.js                # Inicializador dos módulos
│   ├── config.js              # Configurações centrais, grupo e integrações
│   ├── ui.js                  # Navegação, tema, vídeo e animações
│   ├── simulator.js           # Lógica do sensor HC-SR04 e simulação
│   ├── chatbot.js             # Assistente interativo de dúvidas
│   ├── knowledge.js           # Base de conhecimento local do assistente
│   └── contact.js             # Formulário de contato, ViaCEP e Google Sheets
│
├── docs/                      # Scripts de apoio e integrações
│   └── google-sheets-script.js # Código do Google Apps Script (Web App)
│
├── index.html                 # Página principal da aplicação
└── README.md                  # Documentação do projeto
```

---

## Tecnologias Utilizadas

- **Frontend:** HTML5 semântico, CSS3 moderno (Design Tokens, Glassmorphism, Dark/Light Mode), JavaScript Vanilla (ES6+).
- **APIs & Integrações:**
  - **ViaCEP API:** Autocompletar dinâmico de logradouro, bairro, cidade e estado.
  - **Google Sheets API:** Armazenamento em nuvem de formulários via Google Apps Script Web App.
- **Hardware & Automação:** Microcontrolador Arduino, sensor ultrassônico HC-SR04 e LEDs indicadores de nível.

---

## Equipe do Projeto

| Integrante | Função no Projeto |
| :--- | :--- |
| **Ana Clara** | Design e Comunicação Visual |
| **Iris Guimarães** | Gestão Estratégica e Princípios |
| **Lucas Sales** | Desenvolvimento Web e Apresentação |
| **Rafaella Alcasser** | Engenharia IoT e Automação |
| **Rafaella Barroso** | Documentação e Qualidade |

---

## Como Executar Localmente

Como o projeto é construído em Vanilla HTML, CSS e JavaScript, basta abrir o arquivo `index.html` em qualquer navegador web ou utilizar um servidor local estático:

```bash
# Executar com npx serve (recomendado para simulação de rede e requisições)
npx serve .
```
